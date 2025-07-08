/**
 * 主题切换器组件
 */
export default class ThemeSwitcher {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {HTMLElement} options.container - 容器元素
     * @param {Object} options.themeManager - 主题管理器实例
     */
    constructor(options = {}) {
        console.log('🎨 初始化主题切换器:', options);
        
        const { container, themeManager } = options;
        
        if (!container) {
            throw new Error('主题切换器: 容器参数不能为空');
        }
        
        if (!themeManager) {
            throw new Error('主题切换器: themeManager参数不能为空');
        }
        
        this.container = container;
        this.themeManager = themeManager;
        
        // 立即初始化
        this.init();
    }
    
    /**
     * 初始化
     */
    init() {
        try {
            console.log('🚀 开始初始化主题切换器');
            
            // 清空容器
            this.container.innerHTML = '';
            
            // 创建切换器
            this.render();
            
            // 绑定事件
            this.bindEvents();
            
            console.log('✅ 主题切换器初始化完成');
        } catch (error) {
            console.error('❌ 主题切换器初始化失败:', error);
            throw error;
        }
    }
    
    /**
     * 渲染切换器
     */
    render() {
        const currentTheme = this.themeManager.getCurrentTheme();
        const themes = this.themeManager.getAvailableThemes();
        
        const select = document.createElement('select');
        select.className = 'theme-select';
        select.setAttribute('aria-label', '选择主题');
        
        themes.forEach(theme => {
            const option = document.createElement('option');
            option.value = theme.id;
            option.textContent = `${theme.icon} ${theme.name}`;
            option.selected = theme.id === currentTheme.id;
            select.appendChild(option);
        });
        
        this.container.appendChild(select);
        this.select = select;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.select) return;
        
        this.select.addEventListener('change', (e) => {
            const newThemeId = e.target.value;
            console.log('🔄 切换主题:', newThemeId);
            
            try {
                this.themeManager.switchTheme(newThemeId);
                console.log('✅ 主题切换成功');
            } catch (error) {
                console.error('❌ 主题切换失败:', error);
                // 恢复选择
                const currentTheme = this.themeManager.getCurrentTheme();
                this.select.value = currentTheme.id;
            }
        });
    }
    
    /**
     * 销毁组件
     */
    destroy() {
        if (this.select) {
            this.select.removeEventListener('change', this.handleThemeChange);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 