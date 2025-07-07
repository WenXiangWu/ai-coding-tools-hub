/**
 * 主题系统初始化脚本
 * 支持ES模块和传统script标签两种加载方式
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 开始初始化主题系统...');
    
    // 检测是否为file协议
    const isFileProtocol = window.location.protocol === 'file:';
    
    // 动态加载主题管理器
    if (!window.themeManager) {
        if (isFileProtocol) {
            // file协议下使用传统方式
            console.log('🔄 检测到file协议，使用传统加载方式');
            loadThemeSystemFallback();
        } else {
            // http/https协议下使用ES模块
            import('../js/managers/theme-manager.js').then(module => {
                console.log('✅ 主题管理器模块加载成功');
                const ThemeManager = module.default;
                window.themeManager = new ThemeManager();
                console.log('✅ window.themeManager 已创建:', window.themeManager);
                
                // 只预加载主题，不创建切换器
                if (window.themeManager) {
                    // 预加载主要主题
                    window.themeManager.preloadThemes(['dark', 'blue', 'green']);
                    console.log('🎨 主题系统已完全启动（仅管理器）');
                }
            }).catch(error => {
                console.error('❌ 主题管理器ES模块加载失败:', error);
                // 降级到非模块化版本
                loadThemeSystemFallback();
            });
        }
    } else {
        console.log('✅ 主题管理器已存在');
        // 只预加载主题
        if (window.themeManager && window.themeManager.preloadThemes) {
            window.themeManager.preloadThemes(['dark', 'blue', 'green']);
        }
    }
});

/**
 * 降级处理：加载非模块化版本
 */
function loadThemeSystemFallback() {
    console.log('🔄 启动主题系统降级模式...');
    
    // 简单的主题管理器实现
    window.themeManager = {
        currentTheme: 'default',
        switchTheme: function(themeId) {
            console.log('🔄 切换主题到:', themeId);
            
            // 移除所有主题类（从html和body元素）
            document.documentElement.className = document.documentElement.className.replace(/theme-\w+/g, '');
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            
            // 添加新主题类到html元素
            if (themeId !== 'default') {
                document.documentElement.classList.add(`theme-${themeId}`);
                document.body.classList.add(`theme-${themeId}`);
            }
            
            // 加载主题CSS
            let themeLink = document.getElementById('theme-css');
            const preloadedTheme = document.getElementById('theme-css-preload');
            
            if (!themeLink) {
                themeLink = document.createElement('link');
                themeLink.id = 'theme-css';
                themeLink.rel = 'stylesheet';
                document.head.appendChild(themeLink);
            }
            
            if (themeId !== 'default') {
                // 获取正确的主题文件路径
                const basePath = getThemeBasePath();
                themeLink.href = `${basePath}/${themeId}/theme.css`;
                
                // 清理预加载的主题CSS
                if (preloadedTheme) {
                    setTimeout(() => preloadedTheme.remove(), 100);
                }
            } else {
                themeLink.href = '';
                if (preloadedTheme) {
                    preloadedTheme.remove();
                }
            }
            
            // 保存到本地存储
            try {
                localStorage.setItem('ai-tools-theme', themeId);
            } catch (e) {
                console.warn('无法保存主题设置');
            }
            
            this.currentTheme = themeId;
            return Promise.resolve(true);
        },
        getCurrentTheme: function() {
            return {
                id: this.currentTheme,
                name: this.getThemeName(this.currentTheme)
            };
        },
        getThemeName: function(id) {
            const names = {
                'default': '默认主题',
                'dark': '深色主题',
                'blue': '海洋蓝',
                'green': '森林绿',
                'purple': '紫罗兰',
                'auto': '跟随系统'
            };
            return names[id] || '未知主题';
        },
        preloadThemes: function(themeIds) {
            // 空实现，降级模式下不预加载
            console.log('🔄 降级模式下跳过主题预加载');
        },
        // 添加init方法以保持兼容性
        init: function() {
            console.log('🎨 降级模式主题管理器初始化');
            return Promise.resolve();
        }
    };
    
    // 恢复保存的主题
    try {
        const savedTheme = localStorage.getItem('ai-tools-theme');
        if (savedTheme) {
            window.themeManager.switchTheme(savedTheme);
        }
    } catch (e) {
        console.warn('无法恢复主题设置');
    }
    
    console.log('🎨 降级模式主题管理器已初始化（仅管理器）');
}

/**
 * 获取主题文件的基础路径
 */
function getThemeBasePath() {
    const currentPath = window.location.pathname;
    const pathSegments = currentPath.split('/');
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    // 如果是在根目录
    if (lastSegment === '' || lastSegment === 'index.html') {
        return 'src/themes';
    }
    
    // 如果是在demos目录
    if (currentPath.includes('/demos/')) {
        return '../src/themes';
    }
    
    // 如果是在pages目录
    if (currentPath.includes('/pages/')) {
        return '../src/themes';
    }
    
    // 默认返回相对于根目录的路径
    return 'src/themes';
}

/**
 * 紧急降级处理
 * 如果主题系统加载失败，确保页面仍能正常使用
 */
window.addEventListener('error', function(event) {
    if (event.message && event.message.includes('theme')) {
        console.warn('主题系统出现错误，启用降级模式');
        document.body.classList.add('theme-default');
    }
});

/**
 * 为非模块环境提供的备用启动方式
 */
if (typeof window !== 'undefined') {
    window.initThemeSystem = function() {
        if (window.ThemeManager && window.ThemeSwitcher) {
            window.themeManager = new window.ThemeManager();
            window.themeSwitcher = new window.ThemeSwitcher(window.themeManager);
        }
    };
}