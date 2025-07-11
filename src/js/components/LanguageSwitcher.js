/**
 * 语言切换器组件
 * 提供语言选择和切换功能
 */

import { Component } from '../core/Component.js';
import { getI18nManager, t } from '../managers/i18n-manager.js';

export class LanguageSwitcher extends Component {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {HTMLElement} options.container - 容器元素
     * @param {Object} options.i18nManager - 国际化管理器实例
     */
    constructor(options = {}) {
        super(); // Component基类不接收容器参数
        
        console.log('🌐 初始化语言切换器:', options);
        
        const { container, i18nManager } = options;
        
        if (!container) {
            throw new Error('语言切换器: 容器参数不能为空');
        }
        
        if (!i18nManager) {
            throw new Error('语言切换器: i18nManager参数不能为空');
        }
        
        this.container = container;
        this.i18nManager = i18nManager;
        
        // 立即初始化
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        try {
            console.log('🚀 开始初始化语言切换器');
            
            // 清空容器
            this.container.innerHTML = '';
            
            // 创建切换器
            this.render();
            
            // 绑定事件
            this.bindEvents();
            
            console.log('✅ 语言切换器初始化完成');
        } catch (error) {
            console.error('❌ 语言切换器初始化失败:', error);
            throw error;
        }
    }

    /**
     * 渲染切换器
     */
    render() {
        const currentLang = this.i18nManager.getCurrentLanguage();
        const languages = this.i18nManager.getSupportedLanguages();
        
        // 获取当前语言的显示名称
        const currentLangData = languages.find(lang => lang.code === currentLang);
        const currentLangName = currentLangData ? currentLangData.name : 'Language';
        
        // 创建dropdown结构
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown';
        
        // 创建toggle按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'nav-link dropdown-toggle';
        toggleBtn.setAttribute('aria-label', '选择语言');
        toggleBtn.innerHTML = `
            <span>${currentLangName}</span>
            <i class="fas fa-caret-down"></i>
        `;
        
        // 创建dropdown menu
        const dropdownMenu = document.createElement('div');
        dropdownMenu.className = 'dropdown-menu';
        
        // 创建语言选项
        languages.forEach(lang => {
            const item = document.createElement('button');
            item.className = 'dropdown-item button-item';
            item.setAttribute('data-lang', lang.code);
            item.textContent = lang.name;
            if (lang.code === currentLang) {
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
        
        // 处理语言选项点击
        this.dropdownMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('dropdown-item')) {
                const newLang = e.target.getAttribute('data-lang');
                console.log('🔄 切换语言:', newLang);
                
                try {
                    this.i18nManager.switchLanguage(newLang);
                    // 刷新页面内容
                    this.i18nManager.translatePage();
                    
                    // 更新按钮显示
                    this.updateToggleButton(newLang);
                    
                    // 更新选中状态
                    this.updateActiveState(newLang);
                    
                    console.log('✅ 语言切换成功');
                } catch (error) {
                    console.error('❌ 语言切换失败:', error);
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
    updateToggleButton(langCode) {
        const languages = this.i18nManager.getSupportedLanguages();
        const langData = languages.find(lang => lang.code === langCode);
        if (langData && this.toggleBtn) {
            this.toggleBtn.innerHTML = `
                <span>${langData.name}</span>
                <i class="fas fa-caret-down"></i>
            `;
        }
    }
    
    /**
     * 更新选中状态
     */
    updateActiveState(langCode) {
        if (!this.dropdownMenu) return;
        
        // 移除所有active状态
        const items = this.dropdownMenu.querySelectorAll('.dropdown-item');
        items.forEach(item => item.classList.remove('active'));
        
        // 添加新的active状态
        const activeItem = this.dropdownMenu.querySelector(`[data-lang="${langCode}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.dropdown) {
            this.dropdown.removeEventListener('click', this.handleLanguageChange);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 样式现在由nav.css提供，不再需要内联样式 