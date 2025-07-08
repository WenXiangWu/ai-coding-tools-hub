/**
 * 导航管理器
 * 负责管理主导航、移动端菜单和响应式行为
 */

import { 
    getEnabledNavigation, 
    getEnabledDevtools, 
    getMobileNavigationItems,
    SEARCH_CONFIG,
    MOBILE_CONFIG,
    THEME_CONFIG
} from '../config/navigation-config.js';
import { navigationConfigManager } from '../utils/navigation-config-manager.js';
import ThemeSwitcher from '../components/ThemeSwitcher.js';
import ThemeManager from './theme-manager.js';

export class NavigationManager {
    constructor() {
        this.isInitialized = false;
        this.isMobileMenuOpen = false;
        this.currentBreakpoint = 'desktop';
        this.resizeObserver = null;
        
        // DOM 元素
        this.headerElement = null;
        this.mainNavElement = null;
        this.mobileMenuBtn = null;
        this.mobileOverlay = null;
        
        // 绑定方法
        this.handleResize = this.handleResize.bind(this);
        this.handleMobileMenuToggle = this.handleMobileMenuToggle.bind(this);
        this.handleDocumentClick = this.handleDocumentClick.bind(this);
        this.handleEscKey = this.handleEscKey.bind(this);
    }

    /**
     * 初始化导航管理器
     */
    async initialize() {
        try {
            console.log('🧭 初始化导航管理器...');
            
            // 防止重复初始化
            if (this.isInitialized) {
                console.log('⚠️ 导航管理器已初始化，跳过重复初始化');
                return;
            }
            
            // 获取DOM元素
            this.getDOMElements();
            
            // 设置配置管理器监听
            this.setupConfigListener();
            
            // 设置i18n监听器
            this.setupI18nListener();
            
            // 渲染导航
            await this.renderNavigation();
            
            // 设置事件监听
            this.setupEventListeners();
            
            // 检查初始状态
            this.checkBreakpoint();
            
            this.isInitialized = true;
            console.log('✅ 导航管理器初始化完成');
            
        } catch (error) {
            console.error('❌ 导航管理器初始化失败:', error);
            throw error;
        }
    }

    /**
     * 获取DOM元素
     */
    getDOMElements() {
        this.headerElement = document.querySelector('.header');
        this.mainNavElement = document.querySelector('.main-nav');
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        
        if (!this.headerElement || !this.mainNavElement || !this.mobileMenuBtn) {
            throw new Error('导航DOM元素未找到');
        }
    }

    /**
     * 设置配置管理器监听
     */
    setupConfigListener() {
        // 监听配置变化，自动重新渲染导航
        this.configListener = (event, data) => {
            console.log('🔄 配置发生变化，重新渲染导航:', event, data);
            // 防止频繁重新渲染导致重复组件
            clearTimeout(this.renderTimeout);
            this.renderTimeout = setTimeout(() => {
            this.renderNavigation();
            }, 100);
        };
        
        navigationConfigManager.addListener(this.configListener);
    }

    /**
     * 设置i18n监听器
     */
    setupI18nListener() {
        // 监听语言切换事件
        this.i18nListener = (eventData) => {
            console.log('🌍 语言切换事件，重新翻译导航:', eventData);
            // 延迟一点时间，确保i18n系统已经完全切换
            setTimeout(() => {
                this.translateNavigationElements();
                // 通知主题切换器刷新
                this.refreshThemeSwitcher();
            }, 50);
        };
        
        // 监听语言切换事件
        if (window.__i18nManager) {
            window.__i18nManager.onLanguageChange(this.i18nListener);
        } else {
            // 如果i18n管理器还没有初始化，等待一下再设置监听
            setTimeout(() => {
                if (window.__i18nManager) {
                    window.__i18nManager.onLanguageChange(this.i18nListener);
                }
            }, 100);
        }
    }

    /**
     * 刷新主题切换器
     */
    refreshThemeSwitcher() {
        try {
            if (window.themeSwitcher && typeof window.themeSwitcher.refresh === 'function') {
                window.themeSwitcher.refresh();
                console.log('✅ 主题切换器已刷新');
            }
        } catch (error) {
            console.warn('⚠️ 刷新主题切换器失败:', error);
        }
    }

    /**
     * 渲染导航
     */
    async renderNavigation() {
        // 使用配置管理器获取导航项和开发工具
        const navigation = navigationConfigManager.getAllNavigationItems();
        const devtools = navigationConfigManager.getAllDevtools();
        
        // 保存静态容器和主题切换器
        const languageSwitcherContainer = this.mainNavElement.querySelector('#languageSwitcherContainer');
        const existingThemeSwitcher = this.mainNavElement.querySelector('.theme-switcher-container, [data-nav-theme-switcher]');
        
        console.log('🔄 开始渲染导航...');
        if (existingThemeSwitcher) {
            console.log('💾 发现现有主题切换器，将保存并恢复');
        }
        
        // 清空现有导航
        this.mainNavElement.innerHTML = '';
        
        // 渲染导航项
        for (const item of navigation) {
            const navElement = this.createNavigationElement(item, devtools);
            this.mainNavElement.appendChild(navElement);
        }
        
        // 搜索功能已移除
        
        // 恢复或创建语言切换器容器
        if (languageSwitcherContainer) {
            this.mainNavElement.appendChild(languageSwitcherContainer);
        } else {
            // 如果容器不存在，创建一个新的
            const newContainer = document.createElement('div');
            newContainer.className = 'language-switcher-container';
            newContainer.id = 'languageSwitcherContainer';
            newContainer.innerHTML = '<!-- 语言切换器将在这里渲染 -->';
            this.mainNavElement.appendChild(newContainer);
        }
        
        // 只有在没有现有主题切换器时才创建新的
        if (existingThemeSwitcher) {
            console.log('🔄 恢复现有主题切换器');
            this.mainNavElement.appendChild(existingThemeSwitcher);
        } else {
            console.log('🎨 创建新的主题切换器');
        // 添加主题切换器
        await this.addThemeSwitcher();
        }
        
        // 创建移动端覆盖层
        this.createMobileOverlay();
        
        // 通知语言切换器容器已恢复，需要重新初始化
        this.notifyLanguageSwitcherContainerRestored();
        
        // 渲染完成后，触发翻译
        this.translateNavigationElements();
        
        console.log('📱 导航渲染完成');
    }

    /**
     * 创建导航元素
     */
    createNavigationElement(item, devtools) {
        if (item.type === 'dropdown' && item.children === 'DEVTOOLS_DROPDOWN') {
            return this.createDropdownElement(item, devtools);
        } else {
            return this.createLinkElement(item);
        }
    }

    /**
     * 创建链接元素
     */
    createLinkElement(item) {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'nav-link';
        link.setAttribute('data-nav-id', item.id);
        
        // 添加i18n属性
        const i18nKey = this.getI18nKeyForNavItem(item.id);
        if (i18nKey) {
            link.setAttribute('data-i18n', i18nKey);
        }
        
        link.innerHTML = `
            ${item.icon ? `<i class="${item.icon}"></i>` : ''}
            <span>${item.name}</span>
        `;
        
        if (item.description) {
            link.title = item.description;
        }
        
        return link;
    }

    /**
     * 创建下拉菜单元素
     */
    createDropdownElement(item, devtools) {
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown devtools-dropdown';
        dropdown.setAttribute('data-nav-id', item.id);
        
        // 下拉按钮
        const button = document.createElement('button');
        button.className = 'nav-link dropdown-toggle';
        button.id = `${item.id}DropdownBtn`;
        
        // 为按钮内的span添加i18n属性
        const buttonI18nKey = this.getI18nKeyForNavItem(item.id);
        const spanElement = document.createElement('span');
        spanElement.textContent = item.name;
        if (buttonI18nKey) {
            spanElement.setAttribute('data-i18n', buttonI18nKey);
        }
        
        button.innerHTML = `
            ${item.icon ? `<i class="${item.icon}"></i>` : ''}
        `;
        button.appendChild(spanElement);
        button.innerHTML += `<i class="fas fa-caret-down"></i>`;
        
        // 下拉菜单
        const menu = document.createElement('div');
        menu.className = 'dropdown-menu';
        menu.id = `${item.id}DropdownMenu`;
        
        // 添加工具项
        devtools.forEach(tool => {
            const toolLink = document.createElement('a');
            toolLink.href = tool.href;
            toolLink.className = 'dropdown-item';
            toolLink.setAttribute('data-tool-id', tool.id);
            
            // 添加i18n属性
            const toolI18nKey = this.getI18nKeyForDevtool(tool.id);
            if (toolI18nKey) {
                toolLink.setAttribute('data-i18n', toolI18nKey);
            }
            
            toolLink.innerHTML = `
                ${tool.icon ? `<i class="${tool.icon}"></i>` : ''}
                <span>${tool.name}</span>
            `;
            
            if (tool.description) {
                toolLink.title = tool.description;
            }
            
            menu.appendChild(toolLink);
        });
        
        dropdown.appendChild(button);
        dropdown.appendChild(menu);
        
        return dropdown;
    }

    /**
     * 创建搜索框元素
     */
    createSearchElement() {
        const searchBox = document.createElement('div');
        searchBox.className = 'search-box';
        searchBox.innerHTML = `
            <i class="${SEARCH_CONFIG.icon}"></i>
            <input type="text" id="searchInput" placeholder="${SEARCH_CONFIG.placeholder}">
        `;
        
        return searchBox;
    }

    /**
     * 添加主题切换器
     */
    async addThemeSwitcher() {
        try {
            console.log('🎨 开始添加主题切换器...');
            
            // 检查是否已经存在主题切换器（更严格的检查）
            const existingThemeSwitchers = document.querySelectorAll('.theme-switcher-container, .theme-switcher, [data-nav-theme-switcher]');
            if (existingThemeSwitchers.length > 0) {
                console.log('⚠️ 检测到已存在的主题切换器，跳过创建:', existingThemeSwitchers.length, '个');
                existingThemeSwitchers.forEach((switcher, index) => {
                    console.log(`  - 主题切换器 ${index + 1}:`, switcher.className, switcher);
                });
                return;
            }
            
            // 先彻底清理所有现有的主题切换器（全局搜索）
            this.cleanupAllThemeSwitchers();
            
            // 检测协议类型
            const isFileProtocol = window.location.protocol === 'file:';
            
            if (isFileProtocol) {
                // file协议下使用简化的主题切换器
                console.log('🔄 file协议下创建简化主题切换器');
                this.createSimpleThemeSwitcher();
            } else {
            // 动态导入主题模块
            const [
                    ThemeManagerModule,
                    ThemeSwitcherModule
            ] = await Promise.all([
                import('./theme-manager.js'),
                import('../components/ThemeSwitcher.js')
            ]);
            
                // 获取默认导出的类
                const ThemeManager = ThemeManagerModule.default;
                const ThemeSwitcher = ThemeSwitcherModule.default;
            
            // 创建主题切换器容器
            const themeSwitcherContainer = document.createElement('div');
            themeSwitcherContainer.className = 'theme-switcher-container';
                themeSwitcherContainer.setAttribute('data-nav-theme-switcher', 'true');
            
            // 初始化主题管理器（如果还没有初始化）
            if (!window.themeManager) {
                window.themeManager = new ThemeManager();
                // ThemeManager的构造函数中已经调用了init()，所以不需要再次调用
            }
            
            // 创建主题切换器
            const themeSwitcher = new ThemeSwitcher({
                container: themeSwitcherContainer,
                themeManager: window.themeManager
            });
            
            // 保存到window对象以便全局访问
            window.themeSwitcher = themeSwitcher;
            
            // 找到语言切换器容器，在其后插入主题切换器
            const languageSwitcherContainer = this.mainNavElement.querySelector('#languageSwitcherContainer');
            if (languageSwitcherContainer && languageSwitcherContainer.nextSibling) {
                // 在语言切换器容器之后插入
                this.mainNavElement.insertBefore(themeSwitcherContainer, languageSwitcherContainer.nextSibling);
            } else {
                // 如果找不到语言切换器或它是最后一个元素，就添加到末尾
            this.mainNavElement.appendChild(themeSwitcherContainer);
            }
            }
            
            console.log('✅ 主题切换器添加成功');
            
        } catch (error) {
            console.error('❌ 添加主题切换器失败:', error);
            
            // 再次检查是否已经有主题切换器，避免重复创建
            const existingAfterError = document.querySelectorAll('.theme-switcher-container, .theme-switcher, [data-nav-theme-switcher]');
            if (existingAfterError.length > 0) {
                console.log('⚠️ 错误处理时发现已有主题切换器，跳过降级创建');
                return;
            }
            
            // 主题切换器失败时使用简化版本
            console.log('🔄 降级到简化主题切换器');
            this.createSimpleThemeSwitcher();
        }
    }

    /**
     * 创建简化的主题切换器（用于file协议或模块加载失败时）
     */
    createSimpleThemeSwitcher() {
        try {
            // 检查是否已经存在简化主题切换器
            const existingSimpleThemeSwitcher = document.querySelector('.simple-theme-switcher');
            if (existingSimpleThemeSwitcher) {
                console.log('⚠️ 简化主题切换器已存在，跳过创建');
                return;
            }
            
            // 创建主题切换器容器
            const themeSwitcherContainer = document.createElement('div');
            themeSwitcherContainer.className = 'theme-switcher-container simple-theme-switcher';
            themeSwitcherContainer.setAttribute('data-nav-theme-switcher', 'true');
            
            // 创建简单的主题切换按钮
            const themeButton = document.createElement('button');
            themeButton.className = 'theme-switcher-btn';
            themeButton.innerHTML = `
                <i class="fas fa-palette"></i>
                <span>主题</span>
            `;
            
            // 创建主题选项
            const themeDropdown = document.createElement('div');
            themeDropdown.className = 'theme-dropdown';
            themeDropdown.style.display = 'none';
            
            const themes = [
                { id: 'default', name: '默认主题', icon: '🌟' },
                { id: 'dark', name: '深色主题', icon: '🌙' },
                { id: 'blue', name: '海洋蓝', icon: '🌊' },
                { id: 'green', name: '森林绿', icon: '🌿' },
                { id: 'purple', name: '紫罗兰', icon: '💜' }
            ];
            
            themes.forEach(theme => {
                const option = document.createElement('div');
                option.className = 'theme-option';
                option.dataset.theme = theme.id;
                option.innerHTML = `
                    <span class="theme-icon">${theme.icon}</span>
                    <span class="theme-name">${theme.name}</span>
                `;
                
                option.addEventListener('click', () => {
                    if (window.themeManager && window.themeManager.switchTheme) {
                        window.themeManager.switchTheme(theme.id);
                    }
                    themeDropdown.style.display = 'none';
                });
                
                themeDropdown.appendChild(option);
            });
            
            // 切换下拉菜单
            themeButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const isVisible = themeDropdown.style.display !== 'none';
                themeDropdown.style.display = isVisible ? 'none' : 'block';
            });
            
            // 点击外部关闭
            document.addEventListener('click', () => {
                themeDropdown.style.display = 'none';
            });
            
            themeSwitcherContainer.appendChild(themeButton);
            themeSwitcherContainer.appendChild(themeDropdown);
            
            // 添加样式
            if (!document.getElementById('simple-theme-switcher-styles')) {
                const style = document.createElement('style');
                style.id = 'simple-theme-switcher-styles';
                style.textContent = `
                    .simple-theme-switcher {
                        position: relative;
                        display: inline-block;
                    }
                    .theme-switcher-btn {
                        background: none;
                        border: none;
                        color: inherit;
                        cursor: pointer;
                        padding: 8px 12px;
                        border-radius: 4px;
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        transition: background-color 0.2s;
                    }
                    .theme-switcher-btn:hover {
                        background-color: rgba(0,0,0,0.1);
                    }
                    .theme-dropdown {
                        position: absolute;
                        top: 100%;
                        right: 0;
                        background: white;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        min-width: 150px;
                        z-index: 1000;
                    }
                    .theme-option {
                        padding: 8px 12px;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        transition: background-color 0.2s;
                    }
                    .theme-option:hover {
                        background-color: #f5f5f5;
                    }
                    .theme-icon {
                        font-size: 14px;
                    }
                    .theme-name {
                        font-size: 14px;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // 找到语言切换器容器，在其后插入主题切换器
            const languageSwitcherContainer = this.mainNavElement.querySelector('#languageSwitcherContainer');
            if (languageSwitcherContainer && languageSwitcherContainer.nextSibling) {
                // 在语言切换器容器之后插入
                this.mainNavElement.insertBefore(themeSwitcherContainer, languageSwitcherContainer.nextSibling);
            } else {
                // 如果找不到语言切换器或它是最后一个元素，就添加到末尾
                this.mainNavElement.appendChild(themeSwitcherContainer);
            }
            
            console.log('✅ 简化主题切换器创建成功');
            
        } catch (error) {
            console.error('❌ 创建简化主题切换器失败:', error);
        }
    }

    /**
     * 彻底清理所有主题切换器
     */
    cleanupAllThemeSwitchers() {
        console.log('🧹 开始清理所有主题切换器...');
        
        // 清理当前导航中的主题切换器
        const navThemeSwitchers = this.mainNavElement.querySelectorAll('.theme-switcher-container, .theme-switcher');
        navThemeSwitchers.forEach(switcher => {
            console.log('🗑️ 移除导航中的主题切换器:', switcher.className);
            switcher.remove();
        });
        
        // 全局清理所有主题切换器（包括可能被theme-init.js创建的）
        const allThemeSwitchers = document.querySelectorAll('.theme-switcher-container, .theme-switcher, .fallback-theme-switcher');
        allThemeSwitchers.forEach(switcher => {
            console.log('🗑️ 移除全局主题切换器:', switcher.className);
            switcher.remove();
        });
        
        // 清理带有特定属性的主题切换器
        const navThemeSwitchersByAttr = document.querySelectorAll('[data-nav-theme-switcher]');
        navThemeSwitchersByAttr.forEach(switcher => {
            console.log('🗑️ 移除带属性的主题切换器:', switcher.className);
            switcher.remove();
        });
        
        // 清理可能存在的window.themeSwitcher实例
        if (window.themeSwitcher) {
            console.log('🗑️ 清理window.themeSwitcher实例');
            if (typeof window.themeSwitcher.destroy === 'function') {
                try {
                    window.themeSwitcher.destroy();
                } catch (e) {
                    console.warn('销毁主题切换器实例时出错:', e);
                }
            }
            window.themeSwitcher = null;
        }
        
        console.log('🧹 主题切换器清理完成');
    }

    /**
     * 创建移动端覆盖层
     */
    createMobileOverlay() {
        if (this.mobileOverlay) {
            this.mobileOverlay.remove();
        }
        
        this.mobileOverlay = document.createElement('div');
        this.mobileOverlay.className = 'mobile-overlay';
        this.mobileOverlay.addEventListener('click', this.handleMobileMenuToggle);
        
        document.body.appendChild(this.mobileOverlay);
    }

    /**
     * 通知语言切换器容器已恢复
     */
    notifyLanguageSwitcherContainerRestored() {
        // 通知App实例重新初始化语言切换器
        if (window.app && window.app.reinitializeLanguageSwitcher) {
            console.log('🔄 通知App重新初始化语言切换器');
            window.app.reinitializeLanguageSwitcher();
        }
    }

    /**
     * 设置事件监听器
     */
    setupEventListeners() {
        // 移动端菜单按钮
        this.mobileMenuBtn.addEventListener('click', this.handleMobileMenuToggle);
        
        // 窗口大小变化
        window.addEventListener('resize', this.handleResize);
        
        // 文档点击（关闭下拉菜单）
        document.addEventListener('click', this.handleDocumentClick);
        
        // ESC键（关闭移动端菜单）
        document.addEventListener('keydown', this.handleEscKey);
        
        // 下拉菜单处理
        this.setupDropdownHandlers();
    }

    /**
     * 设置下拉菜单处理器
     */
    setupDropdownHandlers() {
        const dropdowns = this.mainNavElement.querySelectorAll('.dropdown');
        
        dropdowns.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            
            if (toggle && menu) {
                // 鼠标悬停（桌面端）
                dropdown.addEventListener('mouseenter', () => {
                    if (this.currentBreakpoint === 'desktop') {
                        this.closeAllDropdowns();
                        menu.classList.add('active');
                    }
                });
                
                dropdown.addEventListener('mouseleave', () => {
                    if (this.currentBreakpoint === 'desktop') {
                        menu.classList.remove('active');
                    }
                });
                
                // 点击切换（移动端）
                toggle.addEventListener('click', (e) => {
                    if (this.currentBreakpoint === 'mobile') {
                        e.preventDefault();
                        
                        const isActive = menu.classList.contains('active');
                        
                        // 关闭所有下拉菜单（包括主题切换器）
                        this.closeAllDropdowns();
                        
                        // 如果之前是关闭的，则打开当前下拉菜单
                        if (!isActive) {
                            dropdown.classList.add('active');
                            menu.classList.add('active');
                        }
                    }
                });
            }
        });
        
        // 设置全局下拉菜单管理
        this.setupGlobalDropdownManager();
    }

    /**
     * 设置全局下拉菜单管理器
     */
    setupGlobalDropdownManager() {
        // 监听主题切换器的下拉菜单事件
        document.addEventListener('theme-switcher-open', () => {
            if (this.currentBreakpoint === 'mobile') {
                // 关闭其他下拉菜单
                const dropdowns = this.mainNavElement.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.classList.remove('active');
                    const menu = dropdown.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.classList.remove('active');
                    }
                });
            }
        });
    }

    /**
     * 关闭所有下拉菜单
     */
    closeAllDropdowns() {
        // 关闭导航中的下拉菜单
        const dropdowns = this.mainNavElement.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.classList.remove('active');
            }
        });
        
        // 通知主题切换器关闭
        document.dispatchEvent(new CustomEvent('close-all-dropdowns'));
    }

    /**
     * 处理移动端菜单切换
     */
    handleMobileMenuToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        
        // 更新菜单状态
        this.mainNavElement.classList.toggle('active', this.isMobileMenuOpen);
        this.mobileOverlay.classList.toggle('active', this.isMobileMenuOpen);
        
        // 更新按钮图标
        const icon = this.mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.className = this.isMobileMenuOpen ? MOBILE_CONFIG.closeIcon : MOBILE_CONFIG.menuIcon;
        }
        
        // 禁用/启用页面滚动
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
        
        console.log(`📱 移动端菜单 ${this.isMobileMenuOpen ? '打开' : '关闭'}`);
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.checkBreakpoint();
        
        // 如果切换到桌面端，关闭移动端菜单
        if (this.currentBreakpoint === 'desktop' && this.isMobileMenuOpen) {
            this.closeMobileMenu();
        }
    }

    /**
     * 检查断点
     */
    checkBreakpoint() {
        const width = window.innerWidth;
        const newBreakpoint = width <= MOBILE_CONFIG.breakpoint ? 'mobile' : 'desktop';
        
        if (newBreakpoint !== this.currentBreakpoint) {
            this.currentBreakpoint = newBreakpoint;
            this.updateNavigationForBreakpoint();
            console.log(`📱 断点切换: ${this.currentBreakpoint}`);
        }
    }

    /**
     * 根据断点更新导航
     */
    updateNavigationForBreakpoint() {
        if (this.currentBreakpoint === 'mobile') {
            this.setupMobileNavigation();
        } else {
            this.setupDesktopNavigation();
        }
    }

    /**
     * 设置移动端导航
     */
    setupMobileNavigation() {
        // 获取移动端优先显示的项目
        const mobileItems = getMobileNavigationItems(MOBILE_CONFIG.collapseThreshold);
        
        // 重新排列导航项目
        this.rearrangeNavigationForMobile(mobileItems);
    }

    /**
     * 设置桌面端导航
     */
    setupDesktopNavigation() {
        // 恢复原始导航顺序，但不重新渲染整个导航
        // 只需要重置移动端的样式修改
        const navItems = Array.from(this.mainNavElement.children);
        navItems.forEach(item => {
            if (item.style.order) {
                item.style.order = '';
            }
        });
    }

    /**
     * 为移动端重新排列导航
     */
    rearrangeNavigationForMobile(priorityItems) {
        // 这里可以根据需要调整移动端的导航布局
        // 例如：优先级高的项目显示在顶部
        const navItems = Array.from(this.mainNavElement.children);
        
        priorityItems.forEach((item, index) => {
            const element = navItems.find(el => el.getAttribute('data-nav-id') === item.id);
            if (element) {
                element.style.order = index;
            }
        });
    }

    /**
     * 处理文档点击（关闭下拉菜单）
     */
    handleDocumentClick(e) {
        // 关闭所有下拉菜单（除非点击的是下拉菜单内部或主题切换器内部）
        if (!e.target.closest('.dropdown') && !e.target.closest('.theme-switcher-container')) {
            this.closeAllDropdowns();
        }
    }

    /**
     * 处理ESC键
     */
    handleEscKey(e) {
        if (e.key === 'Escape') {
            if (this.isMobileMenuOpen) {
                this.closeMobileMenu();
            }
            
            // 关闭所有下拉菜单
            this.closeAllDropdowns();
        }
    }

    /**
     * 关闭移动端菜单
     */
    closeMobileMenu() {
        if (this.isMobileMenuOpen) {
            this.isMobileMenuOpen = false;
            this.mainNavElement.classList.remove('active');
            this.mobileOverlay.classList.remove('active');
            
            // 关闭所有下拉菜单
            this.closeAllDropdowns();
            
            const icon = this.mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.className = MOBILE_CONFIG.menuIcon;
            }
            
            document.body.style.overflow = '';
        }
    }

    /**
     * 添加导航项
     * @param {Object} item - 导航项配置
     * @param {boolean} persist - 是否持久化保存
     */
    addNavigationItem(item, persist = true) {
        try {
            return navigationConfigManager.addNavigationItem(item, persist);
        } catch (error) {
            console.error('❌ 添加导航项失败:', error);
            throw error;
        }
    }

    /**
     * 添加开发工具项
     * @param {Object} tool - 工具配置
     * @param {boolean} persist - 是否持久化保存
     */
    addDevtoolItem(tool, persist = true) {
        try {
            return navigationConfigManager.addDevtoolItem(tool, persist);
        } catch (error) {
            console.error('❌ 添加开发工具失败:', error);
            throw error;
        }
    }

    /**
     * 移除导航项
     * @param {string} id - 导航项ID
     * @param {boolean} persist - 是否持久化保存
     */
    removeNavigationItem(id, persist = true) {
        return navigationConfigManager.removeItem(id, persist);
    }

    /**
     * 更新导航项
     * @param {string} id - 导航项ID
     * @param {Object} updates - 更新内容
     * @param {boolean} persist - 是否持久化保存
     */
    updateNavigationItem(id, updates, persist = true) {
        return navigationConfigManager.updateItem(id, updates, persist);
    }

    /**
     * 启用导航项
     * @param {string} id - 导航项ID
     * @param {boolean} persist - 是否持久化保存
     */
    enableNavigationItem(id, persist = true) {
        return navigationConfigManager.enableItem(id, persist);
    }

    /**
     * 获取配置统计信息
     */
    getConfigStats() {
        return navigationConfigManager.getStats();
    }

    /**
     * 重置导航配置
     */
    resetConfig() {
        navigationConfigManager.resetToDefault();
    }

    /**
     * 导出导航配置
     */
    exportConfig() {
        return navigationConfigManager.exportConfig();
    }

    /**
     * 导入导航配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        navigationConfigManager.importConfig(config);
    }

    /**
     * 销毁导航管理器
     */
    destroy() {
        // 移除事件监听器
        this.mobileMenuBtn?.removeEventListener('click', this.handleMobileMenuToggle);
        window.removeEventListener('resize', this.handleResize);
        document.removeEventListener('click', this.handleDocumentClick);
        document.removeEventListener('keydown', this.handleEscKey);
        
        // 移除配置监听器
        if (this.configListener) {
            navigationConfigManager.removeListener(this.configListener);
        }
        
        // 移除移动端覆盖层
        this.mobileOverlay?.remove();
        
        // 恢复页面滚动
        document.body.style.overflow = '';
        
        // 重置状态
        this.isInitialized = false;
        this.isMobileMenuOpen = false;
        
        console.log('🗑️ 导航管理器已销毁');
    }

    /**
     * 获取状态信息
     */
    getStatus() {
        const configStats = navigationConfigManager.getStats();
        return {
            initialized: this.isInitialized,
            mobileMenuOpen: this.isMobileMenuOpen,
            currentBreakpoint: this.currentBreakpoint,
            navigationItems: configStats.totalNavigationItems,
            devtoolItems: configStats.totalDevtools,
            customItems: configStats.customItems,
            disabledItems: configStats.disabledItems,
            configValid: navigationConfigManager.validateConfig().valid
        };
    }

    /**
     * 获取导航项的i18n键
     */
    getI18nKeyForNavItem(navId) {
        const keyMap = {
            'tools': 'header.navigation.tools',
            'compare': 'header.navigation.compare',
            'tutorials': 'header.navigation.tutorials',
            'updates': 'header.navigation.updates',
            'devtools': 'header.navigation.devtools'
        };
        return keyMap[navId] || null;
    }

    /**
     * 获取开发工具的i18n键
     */
    getI18nKeyForDevtool(toolId) {
        const keyMap = {
            'json-parser': 'header.devtools.json',
            'text-diff': 'header.devtools.diff',
            'cron-expression': 'header.devtools.cron',
            'timestamp-converter': 'header.devtools.timestamp',
            'qrcode-generator': 'header.devtools.qrcode',
            'regex-tool': 'header.devtools.regex'
        };
        return keyMap[toolId] || null;
    }

    /**
     * 翻译导航元素
     */
    translateNavigationElements() {
        try {
            // 获取i18n管理器
            const i18nManager = window.__i18nManager;
            if (!i18nManager || typeof i18nManager.translateElement !== 'function') {
                console.warn('⚠️ i18n管理器不可用，跳过导航翻译');
                return;
            }

            // 翻译导航栏中的所有元素
            const navElements = this.mainNavElement.querySelectorAll('[data-i18n]');
            navElements.forEach(element => {
                i18nManager.translateElement(element);
            });

            console.log('✅ 导航元素翻译完成，共翻译', navElements.length, '个元素');
        } catch (error) {
            console.error('❌ 导航元素翻译失败:', error);
        }
    }
} 