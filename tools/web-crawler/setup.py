#!/usr/bin/env python3
"""
智能网站爬虫工具 - 安装配置文件
"""

from setuptools import setup, find_packages
from pathlib import Path

# 读取README文件
readme_file = Path(__file__).parent / "README.md"
long_description = readme_file.read_text(encoding="utf-8") if readme_file.exists() else ""

# 读取requirements文件
requirements_file = Path(__file__).parent / "requirements.txt"
requirements = []
if requirements_file.exists():
    requirements = requirements_file.read_text(encoding="utf-8").strip().split("\n")
    requirements = [req.strip() for req in requirements if req.strip() and not req.startswith("#")]

setup(
    name="web-crawler",
    version="2.1.0",
    author="AITOOLBOX",
    author_email="support@aitoolbox.com",
    description="基于 Crawl4AI 的智能网站爬虫工具，支持增强导航栏提取",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/aitoolbox/web-crawler",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Internet :: WWW/HTTP :: Browsers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Text Processing :: Markup :: HTML",
    ],
    python_requires=">=3.8",
    install_requires=requirements,
    extras_require={
        "dev": [
            "pytest>=7.0",
            "pytest-asyncio>=0.21",
            "black>=22.0",
            "flake8>=4.0",
            "mypy>=0.991",
        ],
        "llm": [
            "openai>=1.0.0",
            "anthropic>=0.20.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "web-crawler=main:main",
        ],
    },
    include_package_data=True,
    package_data={
        "src.web": ["*.html", "*.js", "*.css"],
    },
    zip_safe=False,
    keywords="web crawler, scraping, crawl4ai, navigation extraction",
    project_urls={
        "Bug Reports": "https://github.com/aitoolbox/web-crawler/issues",
        "Source": "https://github.com/aitoolbox/web-crawler",
        "Documentation": "https://github.com/aitoolbox/web-crawler/blob/main/README.md",
    },
) 