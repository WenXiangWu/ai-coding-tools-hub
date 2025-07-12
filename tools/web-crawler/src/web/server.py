#!/usr/bin/env python3
"""
智能网站爬虫 Web 服务器
提供 REST API 和 WebSocket 支持
"""

import asyncio
import json
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Any
import threading
import queue
import time

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import logging

# 爬虫相关导入
try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
    from crawl4ai.extraction_strategy import JsonCssExtractionStrategy, LLMExtractionStrategy
    from crawl4ai.deep_crawling import BFSDeepCrawlStrategy, DFSDeepCrawlStrategy
    from crawl4ai.deep_crawling.filters import DomainFilter, URLPatternFilter, FilterChain
    from crawl4ai import LLMConfig
    CRAWL4AI_AVAILABLE = True
except ImportError:
    CRAWL4AI_AVAILABLE = False
    print("警告: crawl4ai 未安装，请运行 'pip install crawl4ai'")

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# 初始化 Flask 应用
app = Flask(__name__, static_folder='.')
app.config['SECRET_KEY'] = 'your-secret-key'
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# 全局变量
tasks: Dict[str, Dict] = {}  # 存储任务状态
task_queue = queue.Queue()   # 任务队列
results_storage: Dict[str, List] = {}  # 结果存储


class CrawlerTask:
    """爬虫任务类"""
    
    def __init__(self, task_id: str, config: Dict):
        self.task_id = task_id
        self.config = config
        self.status = 'pending'
        self.progress = 0
        self.status_text = '等待开始...'
        self.stats = {
            'discovered': 0,
            'crawled': 0,
            'failed': 0
        }
        self.results = []
        self.navigation = []
        self.error = None
        self.start_time = None
        self.end_time = None
        
        # 存储发现的URL和内容
        self.discovered_urls = set()
        self.crawled_content = {}

    def update_status(self, status: str, progress: int = None, status_text: str = None):
        """更新任务状态"""
        self.status = status
        if progress is not None:
            self.progress = progress
        if status_text:
            self.status_text = status_text
            
        # 通过WebSocket发送更新
        socketio.emit('task_update', {
            'task_id': self.task_id,
            'status': self.status,
            'progress': self.progress,
            'status_text': self.status_text,
            'stats': self.stats
        })

    def add_log(self, message: str, level: str = 'info'):
        """添加日志"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'message': message,
            'level': level
        }
        
        socketio.emit('log', log_entry)
        logger.info(f"[{self.task_id}] {message}")

    def add_result(self, result: Dict):
        """添加结果"""
        self.results.append(result)
        self.stats['crawled'] = len(self.results)
        
        socketio.emit('result', {
            'task_id': self.task_id,
            'result': result
        })

    async def run(self):
        """执行爬虫任务"""
        if not CRAWL4AI_AVAILABLE:
            self.status = 'failed'
            self.error = 'crawl4ai 未安装'
            return

        try:
            self.start_time = datetime.now()
            self.update_status('running', 0, '初始化爬虫...')
            self.add_log('开始执行爬虫任务')

            # 第一步：发现网站结构
            await self.discover_website_structure()
            
            # 第二步：抓取所有内容
            await self.crawl_all_content()
            
            # 第三步：生成导航结构
            self.generate_navigation_structure()
            
            # 完成
            self.end_time = datetime.now()
            self.update_status('completed', 100, '抓取完成')
            self.add_log('爬虫任务执行完成', 'success')
            
        except Exception as e:
            self.status = 'failed'
            self.error = str(e)
            self.add_log(f'任务执行失败: {str(e)}', 'error')
            logger.error(f"任务 {self.task_id} 失败: {str(e)}", exc_info=True)

    async def discover_website_structure(self):
        """发现网站结构"""
        self.update_status('running', 10, '发现网站结构...')
        self.add_log('开始发现网站结构')
        
        config = self.config
        browser_config = self._create_browser_config()
        
        # 配置过滤器
        filters = []
        if config['filters']['exclude_domains']:
            domain_filter = DomainFilter(
                blocked_domains=config['filters']['exclude_domains']
            )
            filters.append(domain_filter)
        
        if config['filters']['exclude_patterns']:
            pattern_filter = URLPatternFilter(
                excluded_patterns=config['filters']['exclude_patterns']
            )
            filters.append(pattern_filter)
        
        # 总是创建 FilterChain，即使没有过滤器也创建空的
        filter_chain = FilterChain(filters)
        
        # 配置深度爬取策略
        deep_crawl_strategy = None
        if config['crawl_strategy'] == 'bfs':
            deep_crawl_strategy = BFSDeepCrawlStrategy(
                max_depth=config['max_depth'],
                include_external=False,
                max_pages=config['max_pages'],
                filter_chain=filter_chain
            )
        elif config['crawl_strategy'] == 'dfs':
            deep_crawl_strategy = DFSDeepCrawlStrategy(
                max_depth=config['max_depth'],
                include_external=False,
                max_pages=config['max_pages'],
                filter_chain=filter_chain
            )
        
        # 配置爬取参数
        run_config = CrawlerRunConfig(
            cache_mode=getattr(CacheMode, config['cache_mode']),
            deep_crawl_strategy=deep_crawl_strategy,
            exclude_external_links=config['filters']['exclude_external'],
            exclude_social_media_links=config['filters']['exclude_social'],
            exclude_external_images=config['filters']['exclude_images'],
            process_iframes=config['filters']['process_iframes'],
            word_count_threshold=config['word_threshold'],
            wait_for=config['wait_for'],
            stream=True
        )
        
        # 创建爬虫实例
        async with AsyncWebCrawler(config=browser_config) as crawler:
            # 首先爬取首页
            result = await crawler.arun(
                url=config['start_url'],
                config=run_config
            )
            
            if result.success:
                self.add_log(f'成功发现网站结构: {config["start_url"]}')
                self.discovered_urls.add(config['start_url'])
                
                # 处理结果
                processed_result = self._process_crawl_result(result)
                self.add_result(processed_result)
                
                # 更新统计信息
                self.stats['discovered'] = len(self.discovered_urls)
                self.stats['crawled'] = len(self.results)
                
                self.update_status('running', 30, '网站结构发现完成')
            else:
                raise Exception(f"无法访问网站: {result.error_message}")

    async def crawl_all_content(self):
        """抓取所有内容"""
        self.update_status('running', 40, '开始抓取所有内容...')
        self.add_log('开始抓取所有发现的页面')
        
        config = self.config
        browser_config = self._create_browser_config()
        
        # 创建爬虫实例
        async with AsyncWebCrawler(config=browser_config) as crawler:
            # 获取所有需要抓取的URL
            urls_to_crawl = list(self.discovered_urls)
            total_urls = len(urls_to_crawl)
            
            if total_urls == 0:
                self.add_log('没有发现需要抓取的URL')
                return
            
            # 批量抓取
            for i, url in enumerate(urls_to_crawl):
                if url in self.crawled_content:
                    continue
                
                try:
                    # 更新进度
                    progress = 40 + int((i / total_urls) * 50)
                    self.update_status('running', progress, f'抓取中 ({i+1}/{total_urls}): {url}')
                    
                    # 配置单页面抓取
                    run_config = CrawlerRunConfig(
                        cache_mode=getattr(CacheMode, config['cache_mode']),
                        extraction_strategy=self._create_extraction_strategy(),
                        word_count_threshold=config['word_threshold'],
                        wait_for=config['wait_for']
                    )
                    
                    # 抓取页面
                    result = await crawler.arun(url=url, config=run_config)
                    
                    if result.success:
                        self.add_log(f'成功抓取: {url}')
                        processed_result = self._process_crawl_result(result)
                        self.add_result(processed_result)
                        self.crawled_content[url] = processed_result
                    else:
                        self.add_log(f'抓取失败: {url} - {result.error_message}', 'warning')
                        self.stats['failed'] += 1
                        
                except Exception as e:
                    self.add_log(f'抓取出错: {url} - {str(e)}', 'error')
                    self.stats['failed'] += 1
                
                # 更新统计信息
                self.stats['crawled'] = len(self.results)
                
                # 短暂延迟，避免过快请求
                await asyncio.sleep(0.5)
            
            self.update_status('running', 90, '内容抓取完成')

    def generate_navigation_structure(self):
        """生成导航结构"""
        self.update_status('running', 95, '生成导航结构...')
        self.add_log('开始生成导航结构')
        
        # 从抓取的内容中提取导航信息
        navigation_items = []
        
        for result in self.results:
            if result.get('navigation_content'):
                # 提取导航链接
                nav_links = self._extract_navigation_links(
                    result['navigation_content'], 
                    result['url']
                )
                navigation_items.extend(nav_links)
        
        # 去重并排序
        unique_nav_items = {}
        for item in navigation_items:
            key = item['url']
            if key not in unique_nav_items:
                unique_nav_items[key] = item
        
        self.navigation = list(unique_nav_items.values())
        self.navigation.sort(key=lambda x: x.get('title', ''))
        
        self.add_log(f'生成导航结构完成，共 {len(self.navigation)} 个导航项')

    def _create_browser_config(self) -> BrowserConfig:
        """创建浏览器配置"""
        return BrowserConfig(
            browser_type=self.config['browser_type'],
            headless=self.config['headless'],
            viewport_width=self.config['viewport']['width'],
            viewport_height=self.config['viewport']['height']
        )

    def _create_extraction_strategy(self):
        """创建提取策略"""
        # 使用CSS选择器提取策略
        extraction_config = {
            "navigation": {
                "selector": "nav, .nav, .navigation, nav[role='navigation'], .navbar, .menu, .sidebar, .nav-menu, .main-nav, .site-nav, .primary-nav, .header-nav, .top-nav, .side-nav, .navigation-menu",
                "type": "html"
            },
            "navigation_links": {
                "selector": "nav a, .nav a, .navigation a, .navbar a, .menu a",
                "type": "text",
                "attribute": "href"
            }
        }
        
        return JsonCssExtractionStrategy(extraction_config)

    def _process_crawl_result(self, result) -> Dict:
        """处理爬取结果"""
        # 基本信息
        processed = {
            'url': result.url,
            'title': result.metadata.get('title', ''),
            'description': result.metadata.get('description', ''),
            'content': result.cleaned_html[:5000] if result.cleaned_html else '',  # 限制长度
            'word_count': len(result.cleaned_html.split()) if result.cleaned_html else 0,
            'timestamp': datetime.now().isoformat(),
            'success': result.success
        }
        
        # 添加提取的结构化数据
        if result.extracted_content:
            try:
                extracted_data = json.loads(result.extracted_content)
                processed['navigation_content'] = extracted_data.get('navigation', '')
                processed['navigation_links'] = extracted_data.get('navigation_links', [])
            except json.JSONDecodeError:
                pass
        
        # 添加链接信息
        if hasattr(result, 'links') and result.links:
            processed['links'] = result.links[:50]  # 限制链接数量
        
        return processed

    def _extract_navigation_links(self, nav_content: str, base_url: str) -> List[Dict]:
        """从导航内容中提取链接"""
        import re
        from urllib.parse import urljoin, urlparse
        
        links = []
        
        # 使用正则表达式提取链接
        link_pattern = r'<a[^>]*href=["\']([^"\']*)["\'][^>]*>([^<]*)</a>'
        matches = re.findall(link_pattern, nav_content, re.IGNORECASE)
        
        for href, text in matches:
            if href and text.strip():
                # 处理相对链接
                full_url = urljoin(base_url, href)
                
                # 验证URL
                if self._is_valid_url(full_url, base_url):
                    links.append({
                        'url': full_url,
                        'title': text.strip(),
                        'type': 'navigation'
                    })
        
        return links

    def _is_valid_url(self, url: str, base_url: str) -> bool:
        """验证URL是否有效"""
        try:
            parsed = urlparse(url)
            base_parsed = urlparse(base_url)
            
            # 必须是HTTP/HTTPS协议
            if parsed.scheme not in ['http', 'https']:
                return False
            
            # 必须是同一域名（内部链接）
            if parsed.netloc != base_parsed.netloc:
                return False
            
            return True
        except:
            return False

    def to_dict(self) -> Dict:
        """转换为字典"""
        return {
            'task_id': self.task_id,
            'status': self.status,
            'progress': self.progress,
            'status_text': self.status_text,
            'stats': self.stats,
            'results': self.results,
            'navigation': self.navigation,
            'error': self.error,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None
        }


def task_worker():
    """任务工作线程"""
    while True:
        try:
            task = task_queue.get(timeout=1)
            if task is None:
                break
            
            # 执行任务
            asyncio.run(task.run())
            
            # 标记任务完成
            task_queue.task_done()
            
        except queue.Empty:
            continue
        except Exception as e:
            logger.error(f"任务工作线程错误: {str(e)}", exc_info=True)


# 启动任务工作线程
worker_thread = threading.Thread(target=task_worker, daemon=True)
worker_thread.start()


# Web 路由
@app.route('/')
def index():
    """主页"""
    return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    """静态文件"""
    return send_from_directory('.', filename)


@app.route('/api/crawl', methods=['POST'])
def start_crawl():
    """启动爬虫任务"""
    try:
        data = request.json
        
        # 生成任务ID
        task_id = str(uuid.uuid4())
        
        # 创建任务
        task = CrawlerTask(task_id, data)
        tasks[task_id] = task
        
        # 添加到队列
        task_queue.put(task)
        
        return jsonify({
            'success': True,
            'task_id': task_id,
            'message': '任务已创建'
        })
        
    except Exception as e:
        logger.error(f"启动爬虫任务失败: {str(e)}", exc_info=True)
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500


@app.route('/api/status/<task_id>')
def get_task_status(task_id):
    """获取任务状态"""
    task = tasks.get(task_id)
    if not task:
        return jsonify({'error': '任务不存在'}), 404
    
    return jsonify(task.to_dict())


@app.route('/api/results/<task_id>')
def get_task_results(task_id):
    """获取任务结果"""
    task = tasks.get(task_id)
    if not task:
        return jsonify({'error': '任务不存在'}), 404
    
    return jsonify({
        'results': task.results,
        'navigation': task.navigation,
        'stats': task.stats
    })


@app.route('/api/tasks')
def list_tasks():
    """列出所有任务"""
    task_list = []
    for task_id, task in tasks.items():
        task_list.append({
            'task_id': task_id,
            'status': task.status,
            'progress': task.progress,
            'stats': task.stats,
            'start_time': task.start_time.isoformat() if task.start_time else None
        })
    
    return jsonify(task_list)


# WebSocket 事件处理
@socketio.on('connect')
def handle_connect():
    """客户端连接"""
    logger.info('客户端已连接')


@socketio.on('disconnect')
def handle_disconnect():
    """客户端断开连接"""
    logger.info('客户端已断开连接')


if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=True) 