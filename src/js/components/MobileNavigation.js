/**
 * 移动端导航组件
 * 管理移动端导航菜单的交互逻辑
 */

import { Component } from '../core/Component.js';
import { LanguageSwitcher } from './LanguageSwitcher.js';
import ThemeSwitcher from './ThemeSwitcher.js';

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
        
        // 切换器容器
        this.mobileLangSwitcher = document.getElementById('mobileLangSwitcher');
        this.mobileThemeSwitcher = document.getElementById('mobileThemeSwitcher');
        
        // 状态管理
        this.isOpen = false;
        this.devtoolsExpanded = false;
        
        // 子组件
        this.languageSwitcher = null;
        this.themeSwitcher = null;
        
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
            // 初始化语言切换器
            if (this.mobileLangSwitcher) {
                this.languageSwitcher = new LanguageSwitcher({
                    container: this.mobileLangSwitcher,
                    i18nManager: this.i18nManager
                });
            }
            
            // 初始化主题切换器
            if (this.mobileThemeSwitcher) {
                this.themeSwitcher = new ThemeSwitcher({
                    container: this.mobileThemeSwitcher,
                    themeManager: this.themeManager
                });
            }
            
            console.log('🔧 移动端切换器初始化完成');
        } catch (error) {
            console.error('❌ 移动端切换器初始化失败:', error);
        }
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
        
        // 关闭开发工具下拉菜单
        this.closeDevtools();
        
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
        
        // 销毁子组件
        if (this.languageSwitcher) {
            this.languageSwitcher.destroy();
        }
        
        if (this.themeSwitcher) {
            this.themeSwitcher.destroy();
        }
        
        // 恢复body样式
        document.body.style.overflow = '';
        
        console.log('📱 移动端导航组件已销毁');
    }
} 