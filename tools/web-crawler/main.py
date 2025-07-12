#!/usr/bin/env python3
"""
智能网站爬虫工具 v2.1.0
基于 Crawl4AI 的网站内容抓取和导航分析工具

Usage:
    python main.py web                           # 启动Web界面
    python main.py cli <url>                     # 命令行模式
    python main.py cli <url> --output <dir>     # 指定输出目录
"""

import sys
import os
import argparse
import subprocess
from pathlib import Path
from typing import Optional

__version__ = "2.1.0"


def check_dependencies():
    """检查依赖是否安装"""
    required_packages = [
        ('crawl4ai', 'crawl4ai'),
        ('beautifulsoup4', 'bs4'),
        ('flask', 'flask'),
        ('flask-cors', 'flask_cors'),
        ('flask-socketio', 'flask_socketio')
    ]
    
    missing_packages = []
    
    for package_name, import_name in required_packages:
        try:
            __import__(import_name)
        except ImportError:
            missing_packages.append(package_name)
    
    if missing_packages:
        print("❌ 缺少以下依赖包:")
        for package in missing_packages:
            print(f"   - {package}")
        
        print("\n📦 请运行以下命令安装依赖:")
        print("pip install -r requirements.txt")
        return False
    
    return True


def display_startup_info():
    """显示启动信息"""
    print(f"🚀 智能网站爬虫工具 v{__version__}")
    print("=" * 50)
    
    # 检查依赖
    print("\n📦 检查依赖...")
    deps_ok = check_dependencies()
    
    if not deps_ok:
        return False
    
    print("✅ 所有依赖包正常")
    
    # 显示功能特性
    print("\n🎯 主要功能特性:")
    print("   • 智能网站结构发现")
    print("   • 增强导航栏提取")
    print("   • 批量内容抓取")
    print("   • 可视化Web界面")
    print("   • 多种输出格式")
    
    print("\n" + "=" * 50)
    
    return True


def start_web_server():
    """启动Web服务器"""
    print("🌐 启动Web服务器...")
    
    # 检查Web启动脚本 - 先检查新结构，再检查旧结构
    web_start_script = Path("src/web/start.py")
    if not web_start_script.exists():
        web_start_script = Path("web/start.py")
    
    if not web_start_script.exists():
        print("❌ Web服务器启动脚本不存在")
        print("   请确保项目结构完整")
        return False
    
    try:
        # 使用subprocess运行Web服务器
        print(f"📂 使用启动脚本: {web_start_script}")
        
        # 切换到web目录并运行
        import os
        current_dir = os.getcwd()
        web_dir = web_start_script.parent
        
        os.chdir(web_dir)
        result = subprocess.run([
            sys.executable, "start.py"
        ], capture_output=False)
        
        os.chdir(current_dir)
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Web服务器启动失败: {e}")
        return False


def start_command_line(url: str, output_dir: Optional[str] = None):
    """启动命令行版本"""
    print(f"💻 启动命令行版本...")
    print(f"🌐 目标URL: {url}")
    
    print("⚠️  命令行版本正在开发中...")
    print("   请使用Web界面版本：python main.py web")
    
    return False


def main():
    """主函数"""
    parser = argparse.ArgumentParser(
        description=f"智能网站爬虫工具 v{__version__}",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
使用示例:
  python main.py web                           # 启动Web界面
  python main.py cli https://example.com      # 命令行模式（开发中）
        """
    )
    
    parser.add_argument(
        'mode',
        choices=['web', 'cli'],
        help='启动模式: web (Web界面) 或 cli (命令行)'
    )
    
    parser.add_argument(
        'url',
        nargs='?',
        help='目标网站URL (命令行模式必需)'
    )
    
    parser.add_argument(
        '--output', '-o',
        help='输出目录 (仅命令行模式)'
    )
    
    parser.add_argument(
        '--version', '-v',
        action='version',
        version=f'智能网站爬虫工具 v{__version__}'
    )
    
    args = parser.parse_args()
    
    # 显示启动信息
    if not display_startup_info():
        print("\n❌ 依赖检查失败，请先安装必要的依赖包")
        sys.exit(1)
    
    # 根据模式启动
    if args.mode == 'web':
        print("\n🌐 启动Web界面模式...")
        success = start_web_server()
    elif args.mode == 'cli':
        if not args.url:
            print("❌ 命令行模式需要提供目标URL")
            parser.print_help()
            sys.exit(1)
        
        print("\n💻 启动命令行模式...")
        success = start_command_line(args.url, args.output)
    else:
        parser.print_help()
        sys.exit(1)
    
    if success:
        print("\n✅ 程序执行完成")
    else:
        print("\n❌ 程序执行失败")
        sys.exit(1)


if __name__ == "__main__":
    main() 