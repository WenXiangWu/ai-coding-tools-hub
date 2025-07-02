/**
 * 主题系统初始化脚本
 * 自动启动主题管理器和主题切换器
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 动态加载主题管理器
    if (!window.themeManager) {
        import('../js/managers/theme-manager.js').then(module => {
            const ThemeManager = module.default;
            window.themeManager = new ThemeManager();
            initThemeSwitcher();
        }).catch(error => {
            console.error('主题管理器加载失败:', error);
            // 降级处理：使用默认主题
            document.body.classList.add('theme-default');
        });
    } else {
        initThemeSwitcher();
    }
});

/**
 * 初始化主题切换器
 */
function initThemeSwitcher() {
    // 延迟导入主题切换器组件
    import('../js/components/ThemeSwitcher.js').then(module => {
        const ThemeSwitcher = module.default;
        
        // 创建主题切换器实例
        if (window.themeManager) {
            window.themeSwitcher = new ThemeSwitcher(window.themeManager);
            
            // 预加载主要主题
            window.themeManager.preloadThemes(['dark', 'blue', 'green']);
            
            console.log('🎨 主题系统已启动');
        }
    }).catch(error => {
        console.error('主题切换器加载失败:', error);
    });
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