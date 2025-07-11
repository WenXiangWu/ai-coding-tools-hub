/**
 * 主题管理器 - 负责主题的加载、切换、保存和恢复
 * 设计原则：高内聚低耦合，便于扩展
 */
class ThemeManager {
    constructor(i18nManager = null) {
        this.currentTheme = 'default';
        this.themes = new Map();
        this.themeLink = null;
        this.storageKey = 'ai-tools-theme';
        this.observers = new Set();
        this.i18nManager = i18nManager;
        
        this.init();
    }

    /**
     * 设置国际化管理器
     * @param {Object} i18nManager - 国际化管理器实例
     */
    setI18nManager(i18nManager) {
        this.i18nManager = i18nManager;
        console.log('🌐 主题管理器已设置国际化管理器');
    }

    /**
     * 初始化主题管理器
     */
    async init() {
        this.loadAvailableThemes();
        this.createThemeLink();
        await this.restoreTheme();
        this.initSystemThemeDetection();
        
        // 预加载热门主题以提升切换速度
        this.preloadPopularThemes();
        
        console.log('🎨 主题管理器初始化完成');
    }

    /**
     * 预加载热门主题
     */
    preloadPopularThemes() {
        // 异步预加载，不阻塞初始化
        setTimeout(() => {
            const popularThemes = ['dark', 'blue'];
            popularThemes.forEach(themeId => {
                const theme = this.themes.get(themeId);
                if (theme && theme.file) {
                    const link = document.createElement('link');
                    link.rel = 'prefetch';
                    link.href = this.getThemeUrl(theme.file);
                    document.head.appendChild(link);
                }
            });
            console.log('🚀 热门主题预加载完成');
        }, 1000);
    }

    /**
     * 加载可用主题配置
     */
    loadAvailableThemes() {
        this.themes = new Map([
            ['default', {
                nameKey: 'theme.themes.default.name',
                descriptionKey: 'theme.themes.default.description',
                icon: '🌟',
                category: 'light',
                file: 'default/theme.css',
                colors: {
                    '--bg-primary': '#ffffff',
                    '--bg-secondary': '#f8fafc',
                    '--bg-card': '#ffffff',
                    '--text-primary': '#1e293b',
                    '--text-secondary': '#64748b',
                    '--primary-color': '#2563eb',
                    '--border-color': '#e2e8f0'
                }
            }],
            ['dark', {
                nameKey: 'theme.themes.dark.name',
                descriptionKey: 'theme.themes.dark.description',
                icon: '🌙',
                category: 'dark',
                file: 'dark/theme.css',
                colors: {
                    '--bg-primary': '#0f172a',
                    '--bg-secondary': '#1e293b',
                    '--bg-card': '#1e293b',
                    '--text-primary': '#f1f5f9',
                    '--text-secondary': '#cbd5e1',
                    '--primary-color': '#6366f1',
                    '--border-color': '#334155'
                }
            }],
            ['blue', {
                nameKey: 'theme.themes.blue.name',
                descriptionKey: 'theme.themes.blue.description',
                icon: '🌊',
                category: 'light',
                file: 'blue/theme.css',
                colors: {
                    '--bg-primary': '#f0f9ff',
                    '--bg-secondary': '#e0f2fe',
                    '--bg-card': '#ffffff',
                    '--text-primary': '#0c4a6e',
                    '--text-secondary': '#075985',
                    '--primary-color': '#0ea5e9',
                    '--border-color': '#bae6fd'
                }
            }],
            ['green', {
                nameKey: 'theme.themes.green.name',
                descriptionKey: 'theme.themes.green.description',
                icon: '🌿',
                category: 'light',
                file: 'green/theme.css',
                colors: {
                    '--bg-primary': '#f0fdf4',
                    '--bg-secondary': '#dcfce7',
                    '--bg-card': '#ffffff',
                    '--text-primary': '#064e3b',
                    '--text-secondary': '#065f46',
                    '--primary-color': '#10b981',
                    '--border-color': '#bbf7d0'
                }
            }],
            ['purple', {
                nameKey: 'theme.themes.purple.name',
                descriptionKey: 'theme.themes.purple.description',
                icon: '💜',
                category: 'light',
                file: 'purple/theme.css',
                colors: {
                    '--bg-primary': '#faf5ff',
                    '--bg-secondary': '#f3e8ff',
                    '--bg-card': '#ffffff',
                    '--text-primary': '#581c87',
                    '--text-secondary': '#6b21a8',
                    '--primary-color': '#8b5cf6',
                    '--border-color': '#e9d5ff'
                }
            }],
            ['auto', {
                nameKey: 'theme.themes.auto.name',
                descriptionKey: 'theme.themes.auto.description',
                icon: '🔄',
                category: 'auto',
                file: null
            }]
        ]);
    }

    /**
     * 获取翻译后的主题名称
     * @param {string} themeId - 主题ID
     * @returns {string} 翻译后的主题名称
     */
    getThemeName(themeId) {
        const theme = this.themes.get(themeId);
        if (!theme) return themeId;
        
        if (this.i18nManager && theme.nameKey) {
            return this.i18nManager.t(theme.nameKey);
        }
        
        // 兜底显示，如果没有国际化管理器
        const fallbackNames = {
            'default': '默认',
            'dark': '深色',
            'blue': '海洋蓝',
            'green': '森林绿',
            'purple': '紫罗兰',
            'auto': '跟随系统'
        };
        
        return fallbackNames[themeId] || themeId;
    }

    /**
     * 获取翻译后的主题描述
     * @param {string} themeId - 主题ID
     * @returns {string} 翻译后的主题描述
     */
    getThemeDescription(themeId) {
        const theme = this.themes.get(themeId);
        if (!theme) return '';
        
        if (this.i18nManager && theme.descriptionKey) {
            return this.i18nManager.t(theme.descriptionKey);
        }
        
        return '';
    }

    /**
     * 创建主题样式链接元素
     */
    createThemeLink() {
        // 检查是否已经有预加载的主题链接
        const preloadedLink = document.getElementById('theme-css-preload');
        if (preloadedLink) {
            // 如果有预加载链接，直接使用它
            preloadedLink.id = 'theme-css';
            this.themeLink = preloadedLink;
            console.log('🔄 复用预加载的主题链接');
            return;
        }

        // 移除已存在的主题链接
        const existingLink = document.getElementById('theme-css');
        if (existingLink) {
            existingLink.remove();
        }

        // 创建新的主题链接
        this.themeLink = document.createElement('link');
        this.themeLink.id = 'theme-css';
        this.themeLink.rel = 'stylesheet';
        this.themeLink.type = 'text/css';
        
        // 插入到主样式文件之后
        const mainCss = document.querySelector('link[href*="main.css"]');
        if (mainCss && mainCss.parentNode) {
            mainCss.parentNode.insertBefore(this.themeLink, mainCss.nextSibling);
        } else {
            document.head.appendChild(this.themeLink);
        }
    }

    /**
     * 获取主题文件的正确路径
     * @param {string} themeFile - 主题文件路径
     * @returns {string} 完整的URL路径
     */
    getThemeUrl(themeFile) {
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];
        
        let basePath = '../themes';
        
        // 如果是在根目录
        if (lastSegment === '' || lastSegment === 'index.html') {
            basePath = 'src/themes';
        }
        // 如果是在demos目录
        else if (currentPath.includes('/demos/')) {
            basePath = '../src/themes';
        }
        // 如果是在pages目录
        else if (currentPath.includes('/pages/')) {
            basePath = '../themes';
        }
        
        console.log('🔍 主题文件路径:', {
            currentPath,
            lastSegment,
            basePath,
            themeFile,
            finalUrl: `${basePath}/${themeFile}`
        });
        
        return `${basePath}/${themeFile}`;
    }

    /**
     * 切换主题
     * @param {string} themeId - 主题ID
     * @returns {Promise<boolean>} 是否切换成功
     */
    async switchTheme(themeId) {
        try {
            console.log(`🚀 快速切换主题: ${themeId}`);
            
            if (!this.themes.has(themeId)) {
                console.warn(`主题 "${themeId}" 不存在`);
                return false;
            }

            const theme = this.themes.get(themeId);
            
            // 立即更新UI状态，不等待文件加载
            this.currentTheme = themeId;
            this.updateBodyClass(themeId, theme.category);
            this.addSwitchAnimation();
            
            // 处理自动主题
            if (themeId === 'auto') {
                this.disableAutoTheme();
                const systemTheme = this.getSystemTheme();
                await this.switchToSystemTheme(systemTheme);
                this.autoThemeEnabled = true;
                this.saveTheme(themeId);
                this.notifyObservers(themeId, theme);
                return true;
            }

            // 禁用自动主题
            this.disableAutoTheme();

            // 异步加载主题文件（不阻塞UI）
            const loadPromise = theme.file ? 
                this.loadThemeFile(this.getThemeUrl(theme.file)) : 
                Promise.resolve();

            // 立即保存和通知，不等待文件加载完成
            this.saveTheme(themeId);
            this.notifyObservers(themeId, theme);

            // 等待文件加载（如果需要）
            await loadPromise;

            // 清理预加载的主题CSS，避免重复
            this.cleanupPreloadedTheme();

            console.log(`✅ 主题切换完成: ${theme.name}`);
            return true;
            
        } catch (error) {
            console.error('❌ 主题切换失败:', error);
            return false;
        }
    }

    /**
     * 清理预加载的主题CSS
     */
    cleanupPreloadedTheme() {
        const preloadedTheme = document.getElementById('theme-css-preload');
        if (preloadedTheme) {
            // 延迟移除，确保新的主题CSS已经加载完成
            setTimeout(() => {
                preloadedTheme.remove();
                console.log('🗑️ 预加载的主题CSS已清理');
            }, 100);
        }
        
        // 同时清理可能存在的其他预加载主题链接
        const allPreloadedThemes = document.querySelectorAll('link[id^="theme-css-preload"]');
        allPreloadedThemes.forEach(link => {
            setTimeout(() => {
                link.remove();
            }, 100);
        });
    }

    /**
     * 加载主题文件
     * @param {string} url - 主题文件URL
     */
    async loadThemeFile(url) {
        return new Promise((resolve) => {
            const link = this.themeLink;
            
            // 缩短超时时间，快速失败
            const timeout = setTimeout(() => {
                link.removeEventListener('load', onLoad);
                link.removeEventListener('error', onError);
                console.warn(`⚠️ 主题文件加载超时: ${url}`);
                resolve(); // 快速resolve，不阻塞UI
            }, 1500); // 减少到1.5秒
            
            const onLoad = () => {
                clearTimeout(timeout);
                link.removeEventListener('load', onLoad);
                link.removeEventListener('error', onError);
                console.log(`✅ 主题文件加载成功: ${url}`);
                
                // 主题文件加载完成后，确保主题变量生效
                const currentThemeId = this.currentTheme;
                if (currentThemeId) {
                    // 小延迟确保CSS已经生效
                    setTimeout(() => {
                        this.applyThemeVariables(currentThemeId);
                    }, 50);
                }
                
                resolve();
            };
            
            const onError = (e) => {
                clearTimeout(timeout);
                link.removeEventListener('load', onLoad);
                link.removeEventListener('error', onError);
                console.warn(`⚠️ 主题文件加载失败，使用默认样式: ${url}`);
                resolve(); // 错误时也快速resolve
            };
            
            // 检查是否已经是相同URL，避免重复加载
            if (link.href && link.href.endsWith(url.split('/').pop())) {
                console.log(`🔄 主题文件已加载，跳过: ${url}`);
                resolve();
                return;
            }
            
            link.addEventListener('load', onLoad);
            link.addEventListener('error', onError);
            
            // 开始加载
            link.href = url;
            console.log(`📥 快速加载主题文件: ${url}`);
        });
    }

    /**
     * 启用自动主题（跟随系统）
     */
    async enableAutoTheme() {
        this.autoThemeEnabled = true;
        const systemTheme = this.getSystemTheme();
        await this.switchToSystemTheme(systemTheme);
        return true;
    }

    /**
     * 禁用自动主题
     */
    disableAutoTheme() {
        this.autoThemeEnabled = false;
    }

    /**
     * 切换到系统主题
     */
    async switchToSystemTheme(systemTheme) {
        const themeId = systemTheme === 'dark' ? 'dark' : 'default';
        const theme = this.themes.get(themeId);
        
        if (theme.file) {
            const themeUrl = this.getThemeUrl(theme.file);
            await this.loadThemeFile(themeUrl);
        }
        
        this.updateBodyClass(themeId, theme.category);
        this.notifyObservers(themeId, theme);
    }

    /**
     * 获取系统主题
     */
    getSystemTheme() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
            ? 'dark' : 'light';
    }

    /**
     * 初始化系统主题检测
     */
    initSystemThemeDetection() {
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener((e) => {
                if (this.autoThemeEnabled && this.currentTheme === 'auto') {
                    this.switchToSystemTheme(e.matches ? 'dark' : 'light');
                }
            });
        }
    }

    /**
     * 立即应用主题CSS变量
     */
    applyThemeVariables(themeId) {
        const theme = this.themes.get(themeId);
        if (!theme || !theme.colors) {
            console.log(`⚠️ 主题 ${themeId} 没有颜色配置，跳过变量应用`);
            return;
        }
        
        const html = document.documentElement;
        
        // 首先清除所有可能的主题变量
        const allThemeVariables = [
            '--bg-primary', '--bg-secondary', '--bg-card', 
            '--text-primary', '--text-secondary', 
            '--primary-color', '--border-color'
        ];
        
        allThemeVariables.forEach(property => {
            html.style.removeProperty(property);
        });
        
        // 立即应用CSS变量到:root元素
        Object.entries(theme.colors).forEach(([property, value]) => {
            html.style.setProperty(property, value);
        });
        
        console.log(`⚡ 立即应用主题变量到:root: ${theme.name}`, theme.colors);
    }

    /**
     * 更新body类名
     */
    updateBodyClass(themeId, category) {
        const html = document.documentElement;
        const body = document.body;
        
        // 移除所有主题类（从html和body元素）- 使用更彻底的清理方式
        const existingClasses = Array.from(html.classList).filter(cls => cls.startsWith('theme-'));
        html.classList.remove(...existingClasses);
        
        const existingBodyClasses = Array.from(body.classList).filter(cls => cls.startsWith('theme-'));
        body.classList.remove(...existingBodyClasses);
        
        // 清除之前设置的 className（处理预加载脚本的情况）
        if (html.className) {
            html.className = html.className.replace(/theme-[\w-]+/g, '').trim();
        }
        
        // 添加新主题类到html和body元素
        html.classList.add(`theme-${themeId}`);
        body.classList.add(`theme-${themeId}`);
        
        if (category === 'dark') {
            html.classList.add('theme-dark-mode');
            body.classList.add('theme-dark-mode');
        } else {
            html.classList.add('theme-light');
            body.classList.add('theme-light');
        }
        
        // 立即应用主题变量到:root
        this.applyThemeVariables(themeId);
        
        // 强制刷新Hero区域动画
        this.refreshHeroAnimation(themeId);
        
        // 强制刷新tools-filter样式
        this.refreshToolsFilterStyles(themeId);
        
        console.log(`🎨 主题类已更新到: theme-${themeId}, 类别: ${category}`);
    }

    /**
     * 强制刷新Hero区域样式和动画
     * @param {string} themeId - 主题ID
     */
    refreshHeroAnimation(themeId) {
        const heroSection = document.querySelector('.hero-section');
        if (!heroSection) {
            return;
        }
        
        try {
            // 临时禁用所有动画和过渡
            heroSection.style.cssText += `
                animation: none !important;
                transition: none !important;
            `;
            
            // 清除内联样式背景（如果有的话）
            heroSection.style.background = '';
            
            // 强制重绘
            heroSection.offsetHeight;
            
            // 根据主题应用对应的动画
            let animationName = 'heroBackgroundShift';
            
            switch (themeId) {
                case 'dark':
                    animationName = 'heroBackgroundShiftDark';
                    break;
                case 'blue':
                    animationName = 'heroBackgroundShiftBlue';
                    break;
                case 'green':
                    animationName = 'heroBackgroundShiftGreen';
                    break;
                case 'purple':
                    animationName = 'heroBackgroundShiftPurple';
                    break;
                default:
                    animationName = 'heroBackgroundShift';
            }
            
            // 重新启用动画和样式
            setTimeout(() => {
                // 移除禁用样式
                heroSection.style.animation = '';
                heroSection.style.transition = '';
                
                // 强制重新应用CSS类
                const html = document.documentElement;
                const currentClass = `theme-${themeId}`;
                
                if (html.classList.contains(currentClass)) {
                    html.classList.remove(currentClass);
                    html.offsetHeight; // 强制重绘
                    html.classList.add(currentClass);
                }
                
                console.log(`🎭 Hero区域样式已强制刷新: theme-${themeId}`);
            }, 10);
            
            // 额外的后备处理，确保动画正确启动
            setTimeout(() => {
                if (heroSection.style.animation === 'none' || !heroSection.style.animation) {
                    heroSection.style.animation = `${animationName} 25s ease-in-out infinite`;
                    console.log(`🔄 后备动画启动: ${animationName}`);
                }
            }, 100);
            
        } catch (error) {
            console.warn('⚠️ 刷新Hero样式失败:', error);
        }
    }

    /**
     * 强制刷新tools-filter样式
     * @param {string} themeId - 主题ID
     */
    refreshToolsFilterStyles(themeId) {
        const toolsFilterElements = document.querySelectorAll('.tools-filter');
        if (!toolsFilterElements || toolsFilterElements.length === 0) {
            return;
        }

        try {
            toolsFilterElements.forEach(element => {
                // 临时禁用过渡效果
                const originalTransition = element.style.transition;
                element.style.transition = 'none';
                
                // 强制重绘
                element.offsetHeight;
                
                // 重新启用过渡效果
                setTimeout(() => {
                    element.style.transition = originalTransition || '';
                    
                    // 强制重新应用CSS类
                    const html = document.documentElement;
                    const currentClass = `theme-${themeId}`;
                    
                    if (html.classList.contains(currentClass)) {
                        html.classList.remove(currentClass);
                        element.offsetHeight; // 强制重绘
                        html.classList.add(currentClass);
                    }
                }, 10);
            });
            
            console.log(`🔄 tools-filter样式已强制刷新: theme-${themeId}`);
            
        } catch (error) {
            console.warn('⚠️ 刷新tools-filter样式失败:', error);
        }
    }

    /**
     * 添加切换动画
     */
    addSwitchAnimation() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    /**
     * 保存主题到本地存储
     */
    saveTheme(themeId) {
        try {
            localStorage.setItem(this.storageKey, themeId);
        } catch (error) {
            console.warn('无法保存主题设置:', error);
        }
    }

    /**
     * 从本地存储恢复主题
     */
    async restoreTheme() {
        try {
            const savedTheme = localStorage.getItem(this.storageKey);
            if (savedTheme && this.themes.has(savedTheme)) {
                // 检查是否已经有预加载的主题，如果有，直接使用
                const preloadedTheme = document.getElementById('theme-css-preload');
                if (preloadedTheme && preloadedTheme.href.includes(savedTheme)) {
                    console.log('🔄 使用预加载的主题:', savedTheme);
                    // 直接更新状态，不重新加载CSS
                    this.currentTheme = savedTheme;
                    const theme = this.themes.get(savedTheme);
                    this.updateBodyClass(savedTheme, theme.category);
                    this.notifyObservers(savedTheme, theme);
                    
                    // 将预加载的link改为正式的主题link
                    preloadedTheme.id = 'theme-css';
                    this.themeLink = preloadedTheme;
                } else {
                    await this.switchTheme(savedTheme);
                }
            } else {
                // 默认使用系统主题偏好
                const systemTheme = this.getSystemTheme();
                const defaultTheme = systemTheme === 'dark' ? 'dark' : 'default';
                await this.switchTheme(defaultTheme);
            }
        } catch (error) {
            console.warn('恢复主题失败，使用默认主题:', error);
            await this.switchTheme('default');
        }
    }

    /**
     * 获取当前主题
     */
    getCurrentTheme() {
        const theme = this.themes.get(this.currentTheme);
        return {
            id: this.currentTheme,
            name: this.getThemeName(this.currentTheme),
            description: this.getThemeDescription(this.currentTheme),
            ...theme
        };
    }

    /**
     * 获取所有可用主题
     */
    getAvailableThemes() {
        return Array.from(this.themes.entries()).map(([id, theme]) => ({
            id,
            name: this.getThemeName(id),
            description: this.getThemeDescription(id),
            ...theme
        }));
    }

    /**
     * 获取指定主题
     */
    getTheme(themeId) {
        const theme = this.themes.get(themeId);
        if (theme) {
            return {
                id: themeId,
                ...theme
            };
        }
        return null;
    }

    /**
     * 添加主题切换观察者
     */
    addObserver(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    /**
     * 通知所有观察者
     */
    notifyObservers(themeId, theme) {
        this.observers.forEach(callback => {
            try {
                callback({ id: themeId, ...theme });
            } catch (error) {
                console.warn('主题观察者回调失败:', error);
            }
        });
    }

    /**
     * 预加载主题
     */
    async preloadThemes(themeIds = []) {
        const preloadPromises = themeIds.map(async (themeId) => {
            const theme = this.themes.get(themeId);
            if (theme && theme.file) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = this.getThemeUrl(theme.file);
                document.head.appendChild(link);
            }
        });
        
        await Promise.all(preloadPromises);
    }

    /**
     * 注册新主题
     */
    registerTheme(id, config) {
        this.themes.set(id, config);
    }

    /**
     * 销毁主题管理器
     */
    destroy() {
        this.observers.clear();
        if (this.themeLink && this.themeLink.parentNode) {
            this.themeLink.parentNode.removeChild(this.themeLink);
        }
    }
}

// 创建全局主题管理器实例
// window.themeManager = new ThemeManager();  // 移除这行，让theme-init.js负责创建实例

export default ThemeManager; 