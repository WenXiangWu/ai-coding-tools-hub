# 智能网站爬虫工具

[![Python Version](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-2.1.0-orange.svg)](CHANGELOG.md)

基于 Crawl4AI 的智能网站爬虫工具，支持增强导航栏提取和内容批量抓取。

## 🌟 主要特性

- **🔍 智能网站发现** - 自动识别网站结构和导航关系
- **📊 增强导航提取** - 15种专业导航选择器，确保导航一致性
- **📄 批量内容抓取** - 高效并发处理，支持多种输出格式
- **🎛️ 可视化界面** - 现代化Web界面，实时进度显示
- **⚙️ 灵活配置** - 支持多种爬取策略和提取方式

## 📦 安装

### 系统要求
- Python 3.8+
- 至少 4GB 内存
- 稳定的网络连接

### 快速安装
```bash
# 克隆项目
git clone https://github.com/aitoolbox/web-crawler.git
cd web-crawler

# 安装依赖
pip install -r requirements.txt

# 安装浏览器引擎
playwright install chromium
```

### 开发安装
```bash
# 开发模式安装
pip install -e .

# 安装开发依赖
pip install -e .[dev]
```

## 🚀 快速开始

### 方式一：Web界面（推荐）
```bash
# 启动Web界面
python main.py web

# 访问 http://localhost:5000
```

### 方式二：命令行
```bash
# 基础用法
python main.py cli https://example.com

# 指定输出目录
python main.py cli https://example.com --output my_results
```

### 方式三：Python API
```python
import asyncio
from src.crawler import WebsiteCrawler

async def crawl_website():
    crawler = WebsiteCrawler("https://example.com", "results")
    
    # 发现网站结构
    urls = await crawler.discover_website_structure(max_depth=3)
    
    # 批量抓取内容
    results = await crawler.crawl_all_content(urls)
    
    return results

# 运行爬虫
asyncio.run(crawl_website())
```

## 📁 项目结构

```
web-crawler/
├── main.py                    # 主入口文件
├── setup.py                   # 安装配置
├── requirements.txt           # 项目依赖
├── README.md                  # 项目说明
├── CHANGELOG.md               # 更新日志
├── LICENSE                    # 许可证
├── .gitignore                 # Git忽略文件
├── src/                       # 源代码
│   ├── __init__.py
│   ├── crawler.py             # 主爬虫模块
│   ├── navigation.py          # 增强导航提取器
│   ├── utils/                 # 工具模块
│   │   ├── __init__.py
│   │   └── integration.py     # 集成工具
│   └── web/                   # Web界面
│       ├── __init__.py
│       ├── server.py          # Flask服务器
│       ├── start.py           # Web启动脚本
│       ├── app.js             # 前端应用
│       └── index.html         # 主页面
└── results/                   # 输出目录（自动生成）
```

## ⚙️ 配置选项

### 基础配置
| 参数 | 说明 | 默认值 |
|------|------|--------|
| `max_depth` | 最大爬取深度 | 3 |
| `max_pages` | 最大页面数量 | 50 |
| `batch_size` | 并发批处理大小 | 5 |

### 增强导航功能
- **15种专业导航选择器**：覆盖现代网站的各种导航结构
- **完整HTML结构保留**：确保导航信息的完整性
- **多层级导航识别**：自动识别嵌套导航关系
- **智能去重机制**：避免重复导航项

### 输出格式
- **JSON** - 结构化数据，适合程序处理
- **Markdown** - 清洁文本格式，适合阅读
- **HTML** - 可视化索引页面
- **导航报告** - 详细的导航分析报告

## 🔧 开发

### 运行测试
```bash
# 安装测试依赖
pip install -e .[dev]

# 运行测试
pytest tests/
```

### 代码格式化
```bash
# 格式化代码
black src/
flake8 src/
```

### 类型检查
```bash
mypy src/
```

## 📊 性能优化

1. **合理设置并发数**：根据目标网站调整 `batch_size`
2. **使用缓存机制**：避免重复抓取相同内容
3. **过滤无效链接**：使用URL过滤器提高效率
4. **监控资源使用**：避免内存和CPU过载

## ⚠️ 使用须知

### 法律合规
- 遵守目标网站的 robots.txt 规则
- 控制请求频率，避免对服务器造成压力
- 仅用于合法目的，尊重版权和隐私

### 技术建议
- 每秒请求不超过1-2次
- 使用真实的User-Agent
- 实现适当的错误处理和重试机制

## 🤝 贡献

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [Crawl4AI](https://github.com/unclecode/crawl4ai) - 强大的AI驱动网页爬虫框架
- [Playwright](https://playwright.dev/) - 现代化浏览器自动化工具
- [Flask](https://flask.palletsprojects.com/) - 轻量级Web框架

---

<div align="center">
  <p>如果这个项目对您有帮助，请给我们一个 ⭐ Star！</p>
</div> 