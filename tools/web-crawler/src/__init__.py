"""
智能网站爬虫工具包
基于 Crawl4AI 的网站内容抓取和导航分析工具
"""

__version__ = "2.1.0"
__author__ = "AITOOLBOX"
__email__ = "support@aitoolbox.com"
__description__ = "基于 Crawl4AI 的智能网站爬虫工具，支持增强导航栏提取"

from .crawler import WebsiteCrawler
from .navigation import EnhancedNavigationExtractor

__all__ = [
    "WebsiteCrawler",
    "EnhancedNavigationExtractor",
] 