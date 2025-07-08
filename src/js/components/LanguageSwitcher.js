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
        
        const select = document.createElement('select');
        select.className = 'language-select';
        select.setAttribute('aria-label', '选择语言');
        
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            option.selected = lang.code === currentLang;
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
            const newLang = e.target.value;
            console.log('🔄 切换语言:', newLang);
            
            try {
                this.i18nManager.switchLanguage(newLang);
                // 刷新页面内容
                this.i18nManager.translatePage();
                console.log('✅ 语言切换成功');
            } catch (error) {
                console.error('❌ 语言切换失败:', error);
                // 恢复选择
                this.select.value = this.i18nManager.getCurrentLanguage();
            }
        });
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.select) {
            this.select.removeEventListener('change', this.handleLanguageChange);
        }
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}

// 样式
const style = document.createElement('style');
style.textContent = `
    .language-switcher {
        position: relative;
        display: inline-block;
    }
    
    .language-button {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-color);
        font-size: 14px;
        min-width: 120px;
    }
    
    .language-button:hover {
        background: var(--hover-bg);
    }
    
    .language-button.active {
        background: var(--primary-color);
        color: white;
    }
    
    .language-icon {
        font-size: 16px;
    }
    
    .language-text {
        flex: 1;
        text-align: left;
    }
    
    .language-arrow {
        font-size: 12px;
        transition: transform 0.2s ease;
    }
    
    .language-button.active .language-arrow {
        transform: rotate(180deg);
    }
    
    .language-dropdown {
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        min-width: 180px;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        z-index: 1000;
    }
    
    .language-dropdown.active {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .language-dropdown.dropdown-up {
        top: auto;
        bottom: 100%;
        transform: translateY(10px);
    }
    
    .language-dropdown.dropdown-up.active {
        transform: translateY(0);
    }
    
    .language-dropdown-content {
        padding: 8px;
    }
    
    .language-option {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        padding: 10px 12px;
        border: none;
        background: transparent;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--text-color);
        font-size: 14px;
    }
    
    .language-option:hover {
        background: var(--hover-bg);
    }
    
    .language-option.active {
        background: var(--primary-color);
        color: white;
    }
    
    .language-flag {
        font-size: 16px;
        width: 20px;
        text-align: center;
    }
    
    .language-name {
        flex: 1;
        text-align: left;
    }
    
    .language-option .fas.fa-check {
        font-size: 12px;
        color: currentColor;
    }
    
    /* 通知样式 */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--card-bg);
        border: 1px solid var(--border-color);
        border-radius: 8px;
        padding: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .notification.notification-show {
        opacity: 1;
        transform: translateX(0);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--text-color);
    }
    
    .notification-success {
        border-left: 4px solid #10b981;
    }
    
    .notification-error {
        border-left: 4px solid #ef4444;
    }
    
    .notification-success .fas {
        color: #10b981;
    }
    
    .notification-error .fas {
        color: #ef4444;
    }
    
    /* 响应式设计 */
    @media (max-width: 768px) {
        .language-button {
            min-width: auto;
            padding: 8px 10px;
        }
        
        .language-text {
            display: none;
        }
        
        .language-dropdown {
            right: -20px;
            min-width: 160px;
        }
        
        .notification {
            left: 20px;
            right: 20px;
            max-width: none;
        }
    }
`;

if (!document.head.querySelector('style[data-component="language-switcher"]')) {
    style.setAttribute('data-component', 'language-switcher');
    document.head.appendChild(style);
} 