/**
 * 移动端导航组件
 * 管理移动端导航菜单的交互逻辑
 */

import { Component } from '../core/Component.js';

export class MobileNavigation extends Component {
    /**
     * 构造函数
     * @param {Object} options - 配置选项
     * @param {Object} options.i18nManager - 国际化管理器实例
     * @param {Object} options.themeManager - 主题管理器实例
     */
    constructor(options = {}) {
        super();
        
        console.log('📱 初始化移动端导航组件:', options);
        
        const { i18nManager, themeManager } = options;
        
        if (!i18nManager) {
            throw new Error('移动端导航组件: i18nManager参数不能为空');
        }
        
        if (!themeManager) {
            throw new Error('移动端导航组件: themeManager参数不能为空');
        }
        
        this.i18nManager = i18nManager;
        this.themeManager = themeManager;
        
        // 获取DOM元素
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.mobileNav = document.getElementById('mobileNav');
        this.mobileNavOverlay = document.getElementById('mobileNavOverlay');
        this.mobileNavClose = document.getElementById('mobileNavClose');
        this.mobileDevtoolsToggle = document.getElementById('mobileDevtoolsToggle');
        this.mobileDevtoolsMenu = document.getElementById('mobileDevtoolsMenu');
        
        // 切换器相关元素将在bindEvents中获取
        
        // 状态管理
        this.isOpen = false;
        this.devtoolsExpanded = false;
        this.languageMenuExpanded = false;
        this.themeMenuExpanded = false;
        
        // 子组件已移除，直接管理切换逻辑
        
        // 立即初始化
        this.init();
    }

    /**
     * 初始化
     */
    init() {
        try {
            console.log('🚀 开始初始化移动端导航组件');
            
            if (!this.mobileMenuToggle || !this.mobileNav || !this.mobileNavOverlay) {
                console.warn('⚠️ 移动端导航DOM元素未找到，跳过初始化');
                return;
            }
            
            // 绑定事件
            this.bindEvents();
            
            // 初始化切换器
            this.initSwitchers();
            
            console.log('✅ 移动端导航组件初始化完成');
        } catch (error) {
            console.error('❌ 移动端导航组件初始化失败:', error);
            throw error;
        }
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 汉堡菜单按钮点击
        this.mobileMenuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });
        
        // 关闭按钮点击
        if (this.mobileNavClose) {
            this.mobileNavClose.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeMenu();
            });
        }
        
        // 覆盖层点击关闭
        this.mobileNavOverlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // 开发工具下拉菜单
        if (this.mobileDevtoolsToggle) {
            this.mobileDevtoolsToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDevtools();
            });
        }
        
        // 语言切换下拉菜单
        this.mobileLangToggle = document.getElementById('mobileLangToggle');
        this.mobileLangMenu = document.getElementById('mobileLangMenu');
        if (this.mobileLangToggle) {
            this.mobileLangToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleLanguageMenu();
            });
        }
        
        // 主题切换下拉菜单
        this.mobileThemeToggle = document.getElementById('mobileThemeToggle');
        this.mobileThemeMenu = document.getElementById('mobileThemeMenu');
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleThemeMenu();
            });
        }
        
        // ESC键关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });
        
        // 点击菜单内的链接时关闭菜单
        this.mobileNav.addEventListener('click', (e) => {
            // 如果点击的是链接但不是dropdown相关元素，则关闭菜单
            if (e.target.classList.contains('mobile-nav-link') || 
                e.target.classList.contains('mobile-dropdown-item')) {
                this.closeMenu();
            }
        });
        
        // 阻止菜单内点击事件冒泡到覆盖层
        this.mobileNav.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        console.log('📱 移动端导航事件绑定完成');
    }

    /**
     * 初始化切换器
     */
    initSwitchers() {
        try {
            // 渲染语言选项
            this.renderLanguageOptions();
            
            // 渲染主题选项
            this.renderThemeOptions();
            
            // 更新当前显示
            this.updateCurrentLanguageDisplay();
            this.updateCurrentThemeDisplay();
            
            console.log('🔧 移动端切换器初始化完成');
        } catch (error) {
            console.error('❌ 移动端切换器初始化失败:', error);
        }
    }

    /**
     * 渲染语言选项
     */
    renderLanguageOptions() {
        if (!this.mobileLangMenu || !this.i18nManager) return;
        
        const languages = this.i18nManager.getSupportedLanguages();
        const currentLang = this.i18nManager.getCurrentLanguage();
        
        this.mobileLangMenu.innerHTML = '';
        
        languages.forEach(lang => {
            const item = document.createElement('button');
            item.className = 'mobile-dropdown-item';
            item.setAttribute('data-lang', lang.code);
            item.textContent = lang.name;
            
            if (lang.code === currentLang) {
                item.classList.add('active');
            }
            
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleLanguageChange(lang.code);
            });
            
            this.mobileLangMenu.appendChild(item);
        });
    }

    /**
     * 渲染主题选项
     */
    renderThemeOptions() {
        if (!this.mobileThemeMenu || !this.themeManager) return;
        
        const themes = this.themeManager.getAvailableThemes();
        const currentTheme = this.themeManager.getCurrentTheme();
        
        this.mobileThemeMenu.innerHTML = '';
        
        themes.forEach(theme => {
            const item = document.createElement('button');
            item.className = 'mobile-dropdown-item';
            item.setAttribute('data-theme', theme.id);
            item.innerHTML = `${theme.icon} ${theme.name}`;
            
            if (theme.id === currentTheme.id) {
                item.classList.add('active');
            }
            
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleThemeChange(theme.id);
            });
            
            this.mobileThemeMenu.appendChild(item);
        });
    }

    /**
     * 更新当前语言显示
     */
    updateCurrentLanguageDisplay() {
        const currentLangDisplay = document.getElementById('mobileLangCurrent');
        if (!currentLangDisplay || !this.i18nManager) return;
        
        const currentLang = this.i18nManager.getCurrentLanguage();
        const languages = this.i18nManager.getSupportedLanguages();
        const langData = languages.find(lang => lang.code === currentLang);
        
        if (langData) {
            currentLangDisplay.textContent = langData.name;
        }
    }

    /**
     * 更新当前主题显示
     */
    updateCurrentThemeDisplay() {
        const currentThemeDisplay = document.getElementById('mobileThemeCurrent');
        if (!currentThemeDisplay || !this.themeManager) return;
        
        const currentTheme = this.themeManager.getCurrentTheme();
        currentThemeDisplay.innerHTML = `${currentTheme.icon} ${currentTheme.name}`;
    }

    /**
     * 切换菜单状态
     */
    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    /**
     * 打开菜单
     */
    openMenu() {
        this.isOpen = true;
        
        // 添加active类
        this.mobileMenuToggle.classList.add('active');
        this.mobileNav.classList.add('active');
        this.mobileNavOverlay.classList.add('active');
        
        // 禁止body滚动
        document.body.style.overflow = 'hidden';
        
        console.log('📱 移动端菜单已打开');
    }

    /**
     * 关闭菜单
     */
    closeMenu() {
        this.isOpen = false;
        
        // 移除active类
        this.mobileMenuToggle.classList.remove('active');
        this.mobileNav.classList.remove('active');
        this.mobileNavOverlay.classList.remove('active');
        
        // 恢复body滚动
        document.body.style.overflow = '';
        
        // 关闭所有下拉菜单
        this.closeDevtools();
        this.closeLanguageMenu();
        this.closeThemeMenu();
        
        console.log('📱 移动端菜单已关闭');
    }

    /**
     * 切换开发工具下拉菜单
     */
    toggleDevtools() {
        if (this.devtoolsExpanded) {
            this.closeDevtools();
        } else {
            this.openDevtools();
        }
    }

    /**
     * 打开开发工具下拉菜单
     */
    openDevtools() {
        this.devtoolsExpanded = true;
        
        if (this.mobileDevtoolsToggle) {
            this.mobileDevtoolsToggle.classList.add('active');
        }
        
        if (this.mobileDevtoolsMenu) {
            this.mobileDevtoolsMenu.classList.add('active');
        }
        
        console.log('🔧 移动端开发工具菜单已展开');
    }

    /**
     * 关闭开发工具下拉菜单
     */
    closeDevtools() {
        this.devtoolsExpanded = false;
        
        if (this.mobileDevtoolsToggle) {
            this.mobileDevtoolsToggle.classList.remove('active');
        }
        
        if (this.mobileDevtoolsMenu) {
            this.mobileDevtoolsMenu.classList.remove('active');
        }
        
        console.log('🔧 移动端开发工具菜单已收起');
    }

    /**
     * 切换语言菜单
     */
    toggleLanguageMenu() {
        if (this.languageMenuExpanded) {
            this.closeLanguageMenu();
        } else {
            this.openLanguageMenu();
        }
    }

    /**
     * 打开语言菜单
     */
    openLanguageMenu() {
        this.languageMenuExpanded = true;
        
        if (this.mobileLangToggle) {
            this.mobileLangToggle.classList.add('active');
        }
        
        if (this.mobileLangMenu) {
            this.mobileLangMenu.classList.add('active');
        }
        
        // 关闭其他菜单
        this.closeDevtools();
        this.closeThemeMenu();
        
        console.log('🌐 移动端语言菜单已展开');
    }

    /**
     * 关闭语言菜单
     */
    closeLanguageMenu() {
        this.languageMenuExpanded = false;
        
        if (this.mobileLangToggle) {
            this.mobileLangToggle.classList.remove('active');
        }
        
        if (this.mobileLangMenu) {
            this.mobileLangMenu.classList.remove('active');
        }
        
        console.log('🌐 移动端语言菜单已收起');
    }

    /**
     * 切换主题菜单
     */
    toggleThemeMenu() {
        if (this.themeMenuExpanded) {
            this.closeThemeMenu();
        } else {
            this.openThemeMenu();
        }
    }

    /**
     * 打开主题菜单
     */
    openThemeMenu() {
        this.themeMenuExpanded = true;
        
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.classList.add('active');
        }
        
        if (this.mobileThemeMenu) {
            this.mobileThemeMenu.classList.add('active');
        }
        
        // 关闭其他菜单
        this.closeDevtools();
        this.closeLanguageMenu();
        
        console.log('🎨 移动端主题菜单已展开');
    }

    /**
     * 关闭主题菜单
     */
    closeThemeMenu() {
        this.themeMenuExpanded = false;
        
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.classList.remove('active');
        }
        
        if (this.mobileThemeMenu) {
            this.mobileThemeMenu.classList.remove('active');
        }
        
        console.log('🎨 移动端主题菜单已收起');
    }

    /**
     * 处理语言切换
     */
    handleLanguageChange(langCode) {
        try {
            console.log('🔄 移动端切换语言:', langCode);
            
            this.i18nManager.switchLanguage(langCode);
            this.i18nManager.translatePage();
            
            // 更新显示
            this.updateCurrentLanguageDisplay();
            
            // 更新选中状态
            this.updateLanguageActiveState(langCode);
            
            // 关闭菜单
            this.closeLanguageMenu();
            
            console.log('✅ 移动端语言切换成功');
        } catch (error) {
            console.error('❌ 移动端语言切换失败:', error);
        }
    }

    /**
     * 处理主题切换
     */
    handleThemeChange(themeId) {
        try {
            console.log('🔄 移动端切换主题:', themeId);
            
            this.themeManager.switchTheme(themeId);
            
            // 更新显示
            this.updateCurrentThemeDisplay();
            
            // 更新选中状态
            this.updateThemeActiveState(themeId);
            
            // 关闭菜单
            this.closeThemeMenu();
            
            console.log('✅ 移动端主题切换成功');
        } catch (error) {
            console.error('❌ 移动端主题切换失败:', error);
        }
    }

    /**
     * 更新语言选中状态
     */
    updateLanguageActiveState(langCode) {
        if (!this.mobileLangMenu) return;
        
        // 移除所有active状态
        const items = this.mobileLangMenu.querySelectorAll('.mobile-dropdown-item');
        items.forEach(item => item.classList.remove('active'));
        
        // 添加新的active状态
        const activeItem = this.mobileLangMenu.querySelector(`[data-lang="${langCode}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * 更新主题选中状态
     */
    updateThemeActiveState(themeId) {
        if (!this.mobileThemeMenu) return;
        
        // 移除所有active状态
        const items = this.mobileThemeMenu.querySelectorAll('.mobile-dropdown-item');
        items.forEach(item => item.classList.remove('active'));
        
        // 添加新的active状态
        const activeItem = this.mobileThemeMenu.querySelector(`[data-theme="${themeId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 如果窗口变大到桌面端尺寸，自动关闭移动端菜单
        if (window.innerWidth > 768 && this.isOpen) {
            this.closeMenu();
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        // 清理事件监听器
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.removeEventListener('click', this.toggleMenu);
        }
        
        if (this.mobileNavClose) {
            this.mobileNavClose.removeEventListener('click', this.closeMenu);
        }
        
        if (this.mobileNavOverlay) {
            this.mobileNavOverlay.removeEventListener('click', this.closeMenu);
        }
        
        if (this.mobileDevtoolsToggle) {
            this.mobileDevtoolsToggle.removeEventListener('click', this.toggleDevtools);
        }
        
        if (this.mobileLangToggle) {
            this.mobileLangToggle.removeEventListener('click', this.toggleLanguageMenu);
        }
        
        if (this.mobileThemeToggle) {
            this.mobileThemeToggle.removeEventListener('click', this.toggleThemeMenu);
        }
        
        // 恢复body样式
        document.body.style.overflow = '';
        
        console.log('📱 移动端导航组件已销毁');
    }
} 