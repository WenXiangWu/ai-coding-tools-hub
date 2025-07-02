/**
 * 主题管理器 - 负责主题的加载、切换、保存和恢复
 * 设计原则：高内聚低耦合，便于扩展
 */
class ThemeManager {
    constructor() {
        this.currentTheme = 'default';
        this.themes = new Map();
        this.themeLink = null;
        this.storageKey = 'ai-tools-theme';
        this.observers = new Set();
        
        this.init();
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
                name: '默认主题',
                description: '清新简洁的默认主题',
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
                name: '深色主题',
                description: '护眼的深色主题',
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
                name: '海洋蓝',
                description: '清新的蓝色主题',
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
                name: '森林绿',
                description: '自然的绿色主题',
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
                name: '紫罗兰',
                description: '优雅的紫色主题',
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
                name: '跟随系统',
                description: '自动跟随系统主题',
                icon: '🔄',
                category: 'auto',
                file: null
            }]
        ]);
    }

    /**
     * 创建主题样式链接元素
     */
    createThemeLink() {
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
        // 检测当前页面位置来确定正确的相对路径
        const currentPath = window.location.pathname;
        const isInDemos = currentPath.includes('/demos/');
        const isInPages = currentPath.includes('/pages/');
        
        let basePath = './src/themes';
        if (isInDemos) {
            basePath = '../src/themes';
        } else if (isInPages) {
            basePath = '../src/themes';
        }
        
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

            console.log(`✅ 主题切换完成: ${theme.name}`);
            return true;
            
        } catch (error) {
            console.error('❌ 主题切换失败:', error);
            return false;
        }
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
        if (!theme || !theme.colors) return;
        
        const body = document.body;
        
        // 立即应用CSS变量到body样式
        Object.entries(theme.colors).forEach(([property, value]) => {
            body.style.setProperty(property, value);
        });
        
        console.log(`⚡ 立即应用主题变量: ${theme.name}`);
    }

    /**
     * 更新body类名
     */
    updateBodyClass(themeId, category) {
        const body = document.body;
        
        // 移除所有主题类
        body.classList.remove('theme-default', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple');
        body.classList.remove('theme-light', 'theme-dark-mode');
        
        // 添加新主题类
        body.classList.add(`theme-${themeId}`);
        if (category === 'dark') {
            body.classList.add('theme-dark-mode');
        } else {
            body.classList.add('theme-light');
        }
        
        // 立即应用主题变量
        this.applyThemeVariables(themeId);
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
                await this.switchTheme(savedTheme);
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
        return {
            id: this.currentTheme,
            ...this.themes.get(this.currentTheme)
        };
    }

    /**
     * 获取所有可用主题
     */
    getAvailableThemes() {
        return Array.from(this.themes.entries()).map(([id, theme]) => ({
            id,
            ...theme
        }));
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
                link.href = `src/themes/${theme.file}`;
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
window.themeManager = new ThemeManager();

export default ThemeManager; 