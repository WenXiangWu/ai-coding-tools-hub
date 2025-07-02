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
                file: 'default/theme.css'
            }],
            ['dark', {
                name: '深色主题',
                description: '护眼的深色主题',
                icon: '🌙',
                category: 'dark',
                file: 'dark/theme.css'
            }],
            ['blue', {
                name: '海洋蓝',
                description: '清新的蓝色主题',
                icon: '🌊',
                category: 'light',
                file: 'blue/theme.css'
            }],
            ['green', {
                name: '森林绿',
                description: '自然的绿色主题',
                icon: '🌿',
                category: 'light',
                file: 'green/theme.css'
            }],
            ['purple', {
                name: '紫罗兰',
                description: '优雅的紫色主题',
                icon: '💜',
                category: 'light',
                file: 'purple/theme.css'
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
     * 切换主题
     * @param {string} themeId - 主题ID
     * @returns {Promise<boolean>} 是否切换成功
     */
    async switchTheme(themeId) {
        try {
            if (!this.themes.has(themeId)) {
                console.warn(`主题 "${themeId}" 不存在`);
                return false;
            }

            const theme = this.themes.get(themeId);
            
            // 处理自动主题
            if (themeId === 'auto') {
                return await this.enableAutoTheme();
            }

            // 禁用自动主题
            this.disableAutoTheme();

            // 加载主题文件
            if (theme.file) {
                const themeUrl = `src/themes/${theme.file}`;
                await this.loadThemeFile(themeUrl);
            } else {
                // 移除主题文件，使用默认样式
                this.themeLink.href = '';
            }

            // 更新当前主题
            this.currentTheme = themeId;
            
            // 保存主题选择
            this.saveTheme(themeId);
            
            // 更新body类名
            this.updateBodyClass(themeId, theme.category);
            
            // 通知观察者
            this.notifyObservers(themeId, theme);
            
            // 添加切换动画
            this.addSwitchAnimation();

            console.log(`主题已切换至: ${theme.name}`);
            return true;
            
        } catch (error) {
            console.error('主题切换失败:', error);
            return false;
        }
    }

    /**
     * 加载主题文件
     * @param {string} url - 主题文件URL
     */
    async loadThemeFile(url) {
        return new Promise((resolve, reject) => {
            const link = this.themeLink;
            
            const onLoad = () => {
                link.removeEventListener('load', onLoad);
                link.removeEventListener('error', onError);
                resolve();
            };
            
            const onError = () => {
                link.removeEventListener('load', onLoad);
                link.removeEventListener('error', onError);
                reject(new Error(`Failed to load theme: ${url}`));
            };
            
            link.addEventListener('load', onLoad);
            link.addEventListener('error', onError);
            link.href = url;
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
            const themeUrl = `src/themes/${theme.file}`;
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