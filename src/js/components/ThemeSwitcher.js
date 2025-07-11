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
        
        // 创建dropdown结构
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        
        // 创建toggle按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'nav-link dropdown-toggle';
        toggleBtn.setAttribute('aria-label', '选择主题');
        toggleBtn.innerHTML = `
            <span>${currentTheme.icon} ${currentTheme.name}</span>
            <i class="fas fa-caret-down"></i>
        `;
        
        // 创建dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        
        // 创建主题选项
        themes.forEach(theme => {
            const item = document.createElement('button');
            item.className = 'dropdown-item button-item';
            item.setAttribute('data-theme', theme.id);
            item.innerHTML = `${theme.icon} ${theme.name}`;
            if (theme.id === currentTheme.id) {
                item.classList.add('active');
            }
            dropdownMenu.appendChild(item);
        });
        
        dropdown.appendChild(toggleBtn);
        dropdown.appendChild(dropdownMenu);
        
        this.container.appendChild(dropdown);
        this.dropdown = dropdown;
        this.toggleBtn = toggleBtn;
        this.dropdownMenu = dropdownMenu;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.dropdown) return;
        
        // 处理主题选项点击
        this.dropdownMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                const newThemeId = e.target.getAttribute('data-theme');
                console.log('🔄 切换主题:', newThemeId);
                
                try {
                    this.themeManager.switchTheme(newThemeId);
                    
                    // 更新按钮显示
                    this.updateToggleButton(newThemeId);
                    
                    // 更新选中状态
                    this.updateActiveState(newThemeId);
                    
                    console.log('✅ 主题切换成功');
                } catch (error) {
                    console.error('❌ 主题切换失败:', error);
                }
            }
        });
        
        // 处理dropdown外部点击关闭
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target)) {
                this.dropdown.classList.remove('open');
            }
        });
        
        // 处理toggle按钮点击
        this.toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.dropdown.classList.toggle('open');
        });
    }
    
    /**
     * 更新toggle按钮显示
     */
    updateToggleButton(themeId) {
        const themes = this.themeManager.getAvailableThemes();
        const themeData = themes.find(theme => theme.id === themeId);
        if (themeData && this.toggleBtn) {
            this.toggleBtn.innerHTML = `
                <span>${themeData.icon} ${themeData.name}</span>
                <i class="fas fa-caret-down"></i>
            `;
        }
    }
    
    /**
     * 更新选中状态
     */
    updateActiveState(themeId) {
        if (!this.dropdownMenu) return;
        
        // 移除所有active状态
        const items = this.dropdownMenu.querySelectorAll('.dropdown-item');
        items.forEach(item => item.classList.remove('active'));
        
        // 添加新的active状态
        const activeItem = this.dropdownMenu.querySelector(`[data-theme="${themeId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.dropdown) {
            this.dropdown.removeEventListener('click', this.handleThemeChange);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 