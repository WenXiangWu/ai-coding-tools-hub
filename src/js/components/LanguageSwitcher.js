/**
 * 语言切换器组件
 * 提供语言选择和切换功能
 */

import { Component } from '../core/Component.js';
import { getI18nManager, t } from '../managers/i18n-manager.js';

export class LanguageSwitcher extends Component {
    constructor(container) {
        super(); // Component基类不接收容器参数
        
        // 验证容器
        if (!container) {
            throw new Error('LanguageSwitcher: 容器参数不能为空');
        }
        
        this.container = container;
        this.i18nManager = getI18nManager();
        this.isOpen = false;
        this.currentLanguage = 'zh-CN'; // 默认语言
        this.isInitialized = false;
        
        console.log('🔄 LanguageSwitcher: 构造函数执行，容器:', this.container);
        
        // 显示加载状态
        this.showLoading();
        
        // 异步初始化
        this.init();
    }

    /**
     * 显示加载状态
     */
    showLoading() {
        if (!this.container) {
            console.error('❌ LanguageSwitcher: 容器未找到，无法显示加载状态');
            return;
        }
        
        try {
            this.container.innerHTML = `
                <div class="language-switcher">
                    <button class="language-button loading">
                        <span class="language-icon">
                            <i class="fas fa-globe"></i>
                        </span>
                        <span class="language-text">加载中...</span>
                    </button>
                </div>
            `;
            console.log('✅ LanguageSwitcher: 加载状态已显示');
        } catch (error) {
            console.error('❌ LanguageSwitcher: 显示加载状态失败:', error);
        }
    }

    /**
     * 初始化组件
     */
    async init() {
        try {
            console.log('🔄 LanguageSwitcher: 开始初始化');
            
            // 等待i18n管理器初始化完成
            await this.waitForI18nInit();
            
            // 获取当前语言
            this.currentLanguage = this.i18nManager.getCurrentLanguage();
            console.log('✅ LanguageSwitcher: i18n管理器就绪，当前语言:', this.currentLanguage);
            
            // 渲染组件
            this.render();
            this.bindEvents();
            this.isInitialized = true;
            
            // 监听语言变化
            this.i18nManager.onLanguageChange((event) => {
                this.currentLanguage = event.newLanguage;
                // 只有在组件完全初始化后才更新显示
                if (this.isInitialized) {
                    this.updateCurrentLanguage();
                }
            });
            
            console.log('✅ LanguageSwitcher: 初始化完成');
            
        } catch (error) {
            console.error('❌ LanguageSwitcher: 初始化失败', error);
            this.showError();
        }
    }

    /**
     * 等待i18n管理器初始化完成
     */
    async waitForI18nInit() {
        // 检查i18n管理器是否存在
        if (!this.i18nManager) {
            console.error('❌ LanguageSwitcher: i18n管理器不存在');
            throw new Error('i18n管理器不存在');
        }
        
        // 如果已经初始化，直接返回
        if (this.i18nManager.isInitialized) {
            console.log('✅ LanguageSwitcher: i18n管理器已初始化');
            return;
        }
        
        console.log('⏳ LanguageSwitcher: 等待i18n管理器初始化...');
        
        // 等待初始化完成事件
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                console.error('❌ LanguageSwitcher: i18n管理器初始化超时');
                reject(new Error('i18n管理器初始化超时'));
            }, 5000); // 5秒超时
            
            const handleInit = () => {
                console.log('✅ LanguageSwitcher: 收到i18n初始化完成事件');
                clearTimeout(timeout);
                // 确保eventBus存在再移除监听器
                if (this.i18nManager.eventBus && typeof this.i18nManager.eventBus.off === 'function') {
                    this.i18nManager.eventBus.off('i18n:initialized', handleInit);
                }
                resolve();
            };
            
            // 确保eventBus存在再添加监听器
            if (this.i18nManager.eventBus && typeof this.i18nManager.eventBus.on === 'function') {
                this.i18nManager.eventBus.on('i18n:initialized', handleInit);
            } else {
                console.error('❌ LanguageSwitcher: i18n管理器的eventBus不可用');
                clearTimeout(timeout);
                reject(new Error('i18n管理器的eventBus不可用'));
                return;
            }
            
            // 如果App还没有初始化i18n，我们主动初始化
            if (!this.i18nManager.isInitialized) {
                console.log('🔄 LanguageSwitcher: 主动触发i18n管理器初始化');
                if (typeof this.i18nManager.init === 'function') {
                    this.i18nManager.init().catch(error => {
                        console.error('❌ LanguageSwitcher: 主动初始化i18n失败', error);
                        clearTimeout(timeout);
                        reject(error);
                    });
                } else {
                    console.error('❌ LanguageSwitcher: i18n管理器缺少init方法');
                    clearTimeout(timeout);
                    reject(new Error('i18n管理器缺少init方法'));
                }
            }
        });
    }

    /**
     * 显示错误状态
     */
    showError() {
        if (!this.container) {
            console.error('❌ LanguageSwitcher: 容器未找到，无法显示错误状态');
            return;
        }
        
        try {
            this.container.innerHTML = `
                <div class="language-switcher">
                    <button class="language-button error" onclick="location.reload()">
                        <span class="language-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </span>
                        <span class="language-text">加载失败</span>
                    </button>
                </div>
            `;
            console.log('✅ LanguageSwitcher: 错误状态已显示');
        } catch (error) {
            console.error('❌ LanguageSwitcher: 显示错误状态失败:', error);
        }
    }

    /**
     * 渲染组件
     */
    render() {
        if (!this.container) {
            console.error('❌ LanguageSwitcher: 容器未找到，无法渲染');
            return;
        }
        
        if (!this.i18nManager) {
            console.error('❌ LanguageSwitcher: i18n管理器未找到，无法渲染');
            return;
        }
        
        try {
            console.log('🔄 LanguageSwitcher: 开始渲染组件');
            
            const supportedLanguages = this.i18nManager.getSupportedLanguages();
            console.log('📊 LanguageSwitcher: 支持的语言:', supportedLanguages);
            
            const currentLang = supportedLanguages.find(lang => lang.code === this.currentLanguage);
            console.log('📊 LanguageSwitcher: 当前语言对象:', currentLang);
            
            this.container.innerHTML = `
                <div class="language-switcher">
                    <button class="language-button" id="languageButton">
                        <span class="language-icon">
                            <i class="fas fa-globe"></i>
                        </span>
                        <span class="language-text" id="languageText">${currentLang?.nativeName || this.currentLanguage}</span>
                        <span class="language-arrow">
                            <i class="fas fa-caret-down"></i>
                        </span>
                    </button>
                    <div class="language-dropdown" id="languageDropdown">
                        <div class="language-dropdown-content">
                            ${supportedLanguages.map(lang => `
                                <button class="language-option ${lang.code === this.currentLanguage ? 'active' : ''}" 
                                        data-language="${lang.code}">
                                    <span class="language-flag">${this.getLanguageFlag(lang.code)}</span>
                                    <span class="language-name">${lang.nativeName}</span>
                                    ${lang.code === this.currentLanguage ? '<i class="fas fa-check"></i>' : ''}
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            console.log('✅ LanguageSwitcher: 组件渲染完成');
            
        } catch (error) {
            console.error('❌ LanguageSwitcher: 渲染组件失败:', error);
            this.showError();
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.container) {
            console.error('❌ LanguageSwitcher: 容器未找到，无法绑定事件');
            return;
        }
        
        try {
            console.log('🔄 LanguageSwitcher: 开始绑定事件');
            
            const languageButton = this.container.querySelector('#languageButton');
            const languageDropdown = this.container.querySelector('#languageDropdown');
            const languageOptions = this.container.querySelectorAll('.language-option');

            if (!languageButton) {
                console.error('❌ LanguageSwitcher: 找不到语言按钮');
                return;
            }

            // 点击语言按钮
            languageButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });

            // 点击语言选项
            languageOptions.forEach(option => {
                option.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const language = option.dataset.language;
                    this.switchLanguage(language);
                    this.closeDropdown();
                });
            });

            // 点击外部关闭下拉菜单
            document.addEventListener('click', (e) => {
                if (this.container && !this.container.contains(e.target)) {
                    this.closeDropdown();
                }
            });

            // ESC键关闭下拉菜单
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.closeDropdown();
                }
            });
            
            console.log('✅ LanguageSwitcher: 事件绑定完成');
            
        } catch (error) {
            console.error('❌ LanguageSwitcher: 绑定事件失败:', error);
        }
    }

    /**
     * 切换下拉菜单
     */
    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    /**
     * 打开下拉菜单
     */
    openDropdown() {
        if (!this.container) return;
        
        const dropdown = this.container.querySelector('#languageDropdown');
        const button = this.container.querySelector('#languageButton');
        
        if (dropdown) {
            dropdown.classList.add('active');
        }
        if (button) {
            button.classList.add('active');
        }
        this.isOpen = true;
        
        // 设置位置
        this.positionDropdown();
    }

    /**
     * 关闭下拉菜单
     */
    closeDropdown() {
        if (!this.container) return;
        
        const dropdown = this.container.querySelector('#languageDropdown');
        const button = this.container.querySelector('#languageButton');
        
        if (dropdown) {
            dropdown.classList.remove('active');
        }
        if (button) {
            button.classList.remove('active');
        }
        this.isOpen = false;
    }

    /**
     * 定位下拉菜单
     */
    positionDropdown() {
        if (!this.container) return;
        
        const dropdown = this.container.querySelector('#languageDropdown');
        const button = this.container.querySelector('#languageButton');
        
        if (!dropdown || !button) return;
        
        try {
            const buttonRect = button.getBoundingClientRect();
            const dropdownRect = dropdown.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            
            // 检查是否有足够空间显示在下方
            const spaceBelow = viewportHeight - buttonRect.bottom;
            const spaceAbove = buttonRect.top;
            
            if (spaceBelow < dropdownRect.height && spaceAbove > dropdownRect.height) {
                dropdown.classList.add('dropdown-up');
            } else {
                dropdown.classList.remove('dropdown-up');
            }
        } catch (error) {
            console.error('❌ LanguageSwitcher: 定位下拉菜单失败:', error);
        }
    }

    /**
     * 切换语言
     */
    async switchLanguage(language) {
        try {
            await this.i18nManager.switchLanguage(language);
            
            // 显示切换成功提示
            this.showNotification(t('success.updated'), 'success');
            
        } catch (error) {
            console.error('语言切换失败:', error);
            this.showNotification(t('errors.unknownError'), 'error');
        }
    }

    /**
     * 更新当前语言显示
     */
    updateCurrentLanguage() {
        // 更严格的检查
        if (!this.container) {
            console.warn('⚠️ LanguageSwitcher: 容器未找到，跳过更新语言显示');
            return;
        }
        
        if (!this.i18nManager) {
            console.warn('⚠️ LanguageSwitcher: i18n管理器未找到，跳过更新语言显示');
            return;
        }
        
        if (!this.currentLanguage) {
            console.warn('⚠️ LanguageSwitcher: 当前语言未设置，跳过更新语言显示');
            return;
        }
        
        try {
            // 检查i18n管理器是否有getSupportedLanguages方法
            if (typeof this.i18nManager.getSupportedLanguages !== 'function') {
                console.warn('⚠️ LanguageSwitcher: i18n管理器缺少getSupportedLanguages方法');
                return;
            }
            
            const supportedLanguages = this.i18nManager.getSupportedLanguages();
            if (!Array.isArray(supportedLanguages)) {
                console.warn('⚠️ LanguageSwitcher: 支持的语言列表无效');
                return;
            }
            
            const currentLang = supportedLanguages.find(lang => lang && lang.code === this.currentLanguage);
            
            // 更新按钮文本
            const languageText = this.container.querySelector('#languageText');
            if (languageText) {
                languageText.textContent = currentLang?.nativeName || this.currentLanguage;
            }
            
            // 更新选项状态
            const languageOptions = this.container.querySelectorAll('.language-option');
            languageOptions.forEach(option => {
                if (!option.dataset) return; // 防止dataset为null
                
                const isActive = option.dataset.language === this.currentLanguage;
                option.classList.toggle('active', isActive);
                
                // 更新勾选图标
                const checkIcon = option.querySelector('.fas.fa-check');
                if (isActive && !checkIcon) {
                    const icon = document.createElement('i');
                    icon.className = 'fas fa-check';
                    option.appendChild(icon);
                } else if (!isActive && checkIcon) {
                    checkIcon.remove();
                }
            });
            
            console.log('✅ LanguageSwitcher: 语言显示已更新');
            
        } catch (error) {
            console.error('❌ LanguageSwitcher: 更新语言显示失败:', error);
        }
    }

    /**
     * 获取语言标志
     */
    getLanguageFlag(langCode) {
        const flags = {
            'zh-CN': '🇨🇳',
            'en-US': '🇺🇸'
        };
        return flags[langCode] || '🌐';
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        requestAnimationFrame(() => {
            notification.classList.add('notification-show');
        });
        
        // 自动隐藏
        setTimeout(() => {
            notification.classList.remove('notification-show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    /**
     * 获取当前语言
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 解绑事件
     */
    unbindEvents() {
        try {
            // 移除文档点击事件
            document.removeEventListener('click', this.handleDocumentClick);
            
            // 移除窗口调整大小事件
            window.removeEventListener('resize', this.handleWindowResize);
            
            // 移除所有下拉菜单事件
            const dropdown = this.container?.querySelector('.language-dropdown');
            if (dropdown) {
                dropdown.removeEventListener('click', this.handleDropdownClick);
            }
            
            // 移除语言按钮事件
            const button = this.container?.querySelector('.language-button');
            if (button) {
                button.removeEventListener('click', this.handleButtonClick);
            }
            
        } catch (error) {
            console.error('❌ 解绑事件失败:', error);
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        try {
            // 移除i18n事件监听
            if (this.i18nManager && this.i18nManager.offLanguageChange) {
                this.i18nManager.offLanguageChange();
            }
            
            // 移除DOM事件监听
            this.unbindEvents();
            
            // 清空容器
            if (this.container) {
                this.container.innerHTML = '';
            }
            
            // 清理引用
            this.container = null;
            this.currentLanguage = null;
            this.isInitialized = false;
            
            console.log('🗑️ LanguageSwitcher已销毁');
        } catch (error) {
            console.error('❌ LanguageSwitcher销毁失败:', error);
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