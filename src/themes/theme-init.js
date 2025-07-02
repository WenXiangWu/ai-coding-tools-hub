/**
 * 主题系统初始化脚本
 * 自动启动主题管理器和主题切换器
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎨 开始初始化主题系统...');
    
    // 动态加载主题管理器
    if (!window.themeManager) {
        // 尝试使用ES模块加载
        import('../js/managers/theme-manager.js').then(module => {
            console.log('✅ 主题管理器模块加载成功');
            const ThemeManager = module.default;
            window.themeManager = new ThemeManager();
            initThemeSwitcher();
        }).catch(error => {
            console.error('❌ 主题管理器ES模块加载失败:', error);
            // 降级到非模块化版本
            loadThemeSystemFallback();
        });
    } else {
        console.log('✅ 主题管理器已存在');
        initThemeSwitcher();
    }
});

/**
 * 初始化主题切换器
 */
function initThemeSwitcher() {
    console.log('🔄 正在初始化主题切换器...');
    
    // 延迟导入主题切换器组件
    import('../js/components/ThemeSwitcher.js').then(module => {
        console.log('✅ 主题切换器模块加载成功');
        const ThemeSwitcher = module.default;
        
        // 创建主题切换器实例
        if (window.themeManager) {
            window.themeSwitcher = new ThemeSwitcher(window.themeManager);
            
            // 预加载主要主题
            window.themeManager.preloadThemes(['dark', 'blue', 'green']);
            
            console.log('🎨 主题系统已完全启动');
        } else {
            console.error('❌ 主题管理器不存在，无法创建主题切换器');
        }
    }).catch(error => {
        console.error('❌ 主题切换器ES模块加载失败:', error);
        // 创建简单的降级主题切换器
        createFallbackThemeSwitcher();
    });
}

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
            
            // 移除所有主题类
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            
            // 添加新主题类
            document.body.classList.add(`theme-${themeId}`);
            
            // 加载主题CSS
            let themeLink = document.getElementById('theme-css');
            if (!themeLink) {
                themeLink = document.createElement('link');
                themeLink.id = 'theme-css';
                themeLink.rel = 'stylesheet';
                document.head.appendChild(themeLink);
            }
            
            if (themeId !== 'default') {
                // 检测当前页面路径来确定正确的相对路径
                const isInDemos = window.location.pathname.includes('/demos/');
                const basePath = isInDemos ? '../src/themes' : './src/themes';
                themeLink.href = `${basePath}/${themeId}/theme.css`;
            } else {
                themeLink.href = '';
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
    
    // 创建简单的主题切换器
    createFallbackThemeSwitcher();
}

/**
 * 创建降级版本的主题切换器
 */
function createFallbackThemeSwitcher() {
    console.log('🔄 创建降级版主题切换器...');
    
    const themes = [
        { id: 'default', name: '🌟 默认主题', icon: '🌟' },
        { id: 'dark', name: '🌙 深色主题', icon: '🌙' },
        { id: 'blue', name: '🌊 海洋蓝', icon: '🌊' },
        { id: 'green', name: '🌿 森林绿', icon: '🌿' },
        { id: 'purple', name: '💜 紫罗兰', icon: '💜' }
    ];
    
    // 创建主题切换器HTML
    const switcherHtml = `
        <div class="theme-switcher fallback-theme-switcher" style="position: fixed; top: 20px; right: 20px; z-index: 9999;">
            <div class="theme-switcher-trigger" style="
                display: flex;
                align-items: center;
                padding: 0.5rem 0.75rem;
                background: rgba(255, 255, 255, 0.9);
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                color: #1e293b;
                font-size: 0.875rem;
                gap: 0.5rem;
            ">
                <span class="theme-icon">🎨</span>
                <span>主题</span>
                <span class="theme-arrow" style="transition: transform 0.3s;">▼</span>
            </div>
            <div class="theme-switcher-dropdown" style="
                position: absolute;
                top: calc(100% + 0.5rem);
                right: 0;
                min-width: 200px;
                background: white;
                border: 1px solid #e2e8f0;
                border-radius: 8px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
                display: none;
                z-index: 10000;
            ">
                <div style="padding: 0.5rem;">
                    ${themes.map(theme => `
                        <div class="theme-option" data-theme-id="${theme.id}" style="
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                            padding: 0.5rem;
                            border-radius: 4px;
                            cursor: pointer;
                            color: #1e293b;
                            font-size: 0.875rem;
                        " onmouseover="this.style.background='#f1f5f9'" onmouseout="this.style.background='transparent'">
                            <span>${theme.icon}</span>
                            <span>${theme.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    // 插入到页面
    document.body.insertAdjacentHTML('beforeend', switcherHtml);
    
    // 绑定事件
    const switcher = document.querySelector('.fallback-theme-switcher');
    const trigger = switcher.querySelector('.theme-switcher-trigger');
    const dropdown = switcher.querySelector('.theme-switcher-dropdown');
    const arrow = switcher.querySelector('.theme-arrow');
    
    let isOpen = false;
    
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        isOpen = !isOpen;
        dropdown.style.display = isOpen ? 'block' : 'none';
        arrow.style.transform = isOpen ? 'rotate(180deg)' : 'rotate(0deg)';
    });
    
    // 绑定主题选项点击事件
    dropdown.addEventListener('click', function(e) {
        const option = e.target.closest('.theme-option');
        if (option && window.themeManager) {
            const themeId = option.dataset.themeId;
            window.themeManager.switchTheme(themeId);
            isOpen = false;
            dropdown.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
            
            // 更新图标
            const icon = switcher.querySelector('.theme-icon');
            const themeIcons = {
                'default': '🌟',
                'dark': '🌙', 
                'blue': '🌊',
                'green': '🌿',
                'purple': '💜'
            };
            icon.textContent = themeIcons[themeId] || '🎨';
        }
    });
    
    // 点击外部关闭
    document.addEventListener('click', function() {
        if (isOpen) {
            isOpen = false;
            dropdown.style.display = 'none';
            arrow.style.transform = 'rotate(0deg)';
        }
    });
    
    console.log('✅ 降级版主题切换器创建完成');
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