#!/usr/bin/env python3
"""
主要功能测试
"""

import sys
import pytest
from pathlib import Path

# 添加src目录到路径
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

def test_import_main_modules():
    """测试主要模块是否可以正常导入"""
    try:
        from src.crawler import WebsiteCrawler
        from src.navigation import EnhancedNavigationExtractor
        assert True
    except ImportError as e:
        pytest.fail(f"模块导入失败: {e}")

def test_version_info():
    """测试版本信息"""
    try:
        from src import __version__
        assert __version__ == "2.1.0"
    except ImportError:
        pytest.fail("无法导入版本信息")

def test_enhanced_navigation_extractor():
    """测试增强导航提取器"""
    try:
        from src.navigation import EnhancedNavigationExtractor
        
        extractor = EnhancedNavigationExtractor("https://example.com")
        assert len(extractor.nav_selectors) >= 15
        assert extractor.base_url == "https://example.com"
        
    except Exception as e:
        pytest.fail(f"增强导航提取器测试失败: {e}")

def test_website_crawler():
    """测试网站爬虫"""
    try:
        from src.crawler import WebsiteCrawler
        
        crawler = WebsiteCrawler("https://example.com", "test_output")
        assert crawler.base_url == "https://example.com"
        assert crawler.output_dir.name == "test_output"
        
    except Exception as e:
        pytest.fail(f"网站爬虫测试失败: {e}")

if __name__ == "__main__":
    pytest.main([__file__]) 