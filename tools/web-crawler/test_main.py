#!/usr/bin/env python3
"""
测试main.py功能
"""

import sys
from pathlib import Path

# 添加当前目录到Python路径
sys.path.insert(0, str(Path(__file__).parent))

try:
    from main import display_startup_info, start_web_server
    
    print("✅ 成功导入main模块")
    
    # 测试启动信息显示
    print("\n" + "="*50)
    print("测试启动信息显示:")
    print("="*50)
    
    result = display_startup_info()
    print(f"启动信息显示结果: {result}")
    
    if result:
        print("\n" + "="*50)
        print("测试Web服务器启动:")
        print("="*50)
        
        # 检查启动脚本是否存在
        web_script = Path("web/start.py")
        print(f"Web启动脚本存在: {web_script.exists()}")
        
        if web_script.exists():
            print("找到启动脚本，准备启动Web服务器...")
            # 这里不实际启动，只是测试到这一步
            print("✅ 测试完成")
        else:
            print("❌ 启动脚本不存在")
    
except Exception as e:
    print(f"❌ 导入或测试失败: {e}")
    import traceback
    traceback.print_exc() 