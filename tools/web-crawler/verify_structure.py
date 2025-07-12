#!/usr/bin/env python3
"""
项目结构验证脚本
验证重构后的项目结构是否正确
"""

import sys
from pathlib import Path

def verify_project_structure():
    """验证项目结构"""
    print("🔍 验证项目结构...")
    
    # 必需的文件和目录
    required_items = [
        "main.py",
        "setup.py",
        "requirements.txt",
        "README.md",
        "CHANGELOG.md",
        "LICENSE",
        ".gitignore",
        "src/",
        "src/__init__.py",
        "src/crawler.py",
        "src/navigation.py",
        "src/utils/",
        "src/utils/__init__.py",
        "src/utils/integration.py",
        "src/web/",
        "src/web/__init__.py",
        "src/web/server.py",
        "src/web/start.py",
        "src/web/app.js",
        "src/web/index.html",
        "tests/",
        "tests/__init__.py",
        "tests/test_main.py",
    ]
    
    missing_items = []
    existing_items = []
    
    for item in required_items:
        item_path = Path(item)
        if item_path.exists():
            existing_items.append(item)
            print(f"✅ {item}")
        else:
            missing_items.append(item)
            print(f"❌ {item}")
    
    print(f"\n📊 结构验证结果:")
    print(f"  ✅ 存在: {len(existing_items)} 个")
    print(f"  ❌ 缺失: {len(missing_items)} 个")
    
    if missing_items:
        print(f"\n⚠️  缺失的文件/目录:")
        for item in missing_items:
            print(f"     - {item}")
        return False
    else:
        print(f"\n🎉 项目结构验证通过！")
        return True

def verify_main_entry():
    """验证主入口文件"""
    print("\n🚀 验证主入口文件...")
    
    main_file = Path("main.py")
    if not main_file.exists():
        print("❌ main.py 不存在")
        return False
    
    try:
        with open(main_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查关键函数
        required_functions = [
            'def check_dependencies',
            'def check_enhanced_navigation',
            'def start_web_server',
            'def start_command_line',
            'def main'
        ]
        
        for func in required_functions:
            if func in content:
                print(f"✅ {func}")
            else:
                print(f"❌ {func}")
                return False
        
        print("✅ 主入口文件验证通过")
        return True
        
    except Exception as e:
        print(f"❌ 主入口文件验证失败: {e}")
        return False

def verify_setup_py():
    """验证setup.py文件"""
    print("\n📦 验证setup.py文件...")
    
    setup_file = Path("setup.py")
    if not setup_file.exists():
        print("❌ setup.py 不存在")
        return False
    
    try:
        with open(setup_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 检查关键配置
        required_configs = [
            'name="web-crawler"',
            'version="2.1.0"',
            'author="AITOOLBOX"',
            'entry_points=',
            'install_requires='
        ]
        
        for config in required_configs:
            if config in content:
                print(f"✅ {config}")
            else:
                print(f"❌ {config}")
                return False
        
        print("✅ setup.py文件验证通过")
        return True
        
    except Exception as e:
        print(f"❌ setup.py文件验证失败: {e}")
        return False

def main():
    """主函数"""
    print("🧪 智能网站爬虫工具 - 项目结构验证")
    print("=" * 50)
    
    # 验证项目结构
    structure_ok = verify_project_structure()
    
    # 验证主入口文件
    main_ok = verify_main_entry()
    
    # 验证setup.py
    setup_ok = verify_setup_py()
    
    # 生成总结报告
    print("\n" + "=" * 50)
    print("📋 验证总结报告")
    print("=" * 50)
    
    results = {
        "项目结构": structure_ok,
        "主入口文件": main_ok,
        "安装配置": setup_ok
    }
    
    all_passed = all(results.values())
    
    for test_name, result in results.items():
        status = "✅ 通过" if result else "❌ 失败"
        print(f"  {test_name}: {status}")
    
    if all_passed:
        print("\n🎉 所有验证通过！项目结构规范化完成")
        print("\n🚀 快速开始:")
        print("  python main.py web      # 启动Web界面")
        print("  python main.py --help   # 查看帮助")
        return True
    else:
        print("\n⚠️  部分验证失败，请检查上述错误")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1) 