#!/usr/bin/env python3
"""
智能网站爬虫 Web 版启动脚本 v2.1.0
"""

import sys
import subprocess
import os
from pathlib import Path

def check_dependencies():
    """检查依赖是否安装"""
    required_packages = [
        'flask',
        'flask_cors', 
        'flask_socketio',
        'crawl4ai',
        'beautifulsoup4'
    ]
    
    missing_packages = []
    
    for package in required_packages:
        try:
            if package == 'flask_cors':
                __import__('flask_cors')
            elif package == 'flask_socketio':
                __import__('flask_socketio')
            elif package == 'beautifulsoup4':
                __import__('bs4')
            else:
                __import__(package)
        except ImportError:
            missing_packages.append(package)
    
    if missing_packages:
        print("❌ 缺少以下依赖包:")
        for package in missing_packages:
            print(f"   - {package}")
        
        print("\n📦 请运行以下命令安装依赖:")
        print("pip install -r requirements.txt")
        return False
    
    return True

def start_server():
    """启动服务器"""
    print("🚀 启动智能网站爬虫 Web 服务器...")
    
    # 检查基础依赖
    if not check_dependencies():
        sys.exit(1)
    
    # 启动服务器
    try:
        from .server import app, socketio
        print("\n🌐 服务器信息:")
        print("📱 Web界面: http://localhost:5000")
        print("🔌 API接口: http://localhost:5000/api/tasks")
        print("💡 提示: 按 Ctrl+C 停止服务器")
        
        socketio.run(app, host='0.0.0.0', port=5000, debug=False)
        
    except KeyboardInterrupt:
        print("\n👋 服务器已停止")
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        print("\n🔧 故障排除:")
        print("   1. 确保所有依赖已安装: pip install -r requirements.txt")
        print("   2. 检查端口5000是否被占用")
        print("   3. 确保server.py文件存在且无语法错误")
        sys.exit(1)

if __name__ == '__main__':
    start_server() 