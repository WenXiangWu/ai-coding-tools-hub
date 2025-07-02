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
            
            // 获取DOM元素
            this.getDOMElements();
            
            // 设置配置管理器监听
            this.setupConfigListener();
            
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
            this.renderNavigation();
        };
        
        navigationConfigManager.addListener(this.configListener);
    }

    /**
     * 渲染导航
     */
    async renderNavigation() {
        // 使用配置管理器获取导航项和开发工具
        const navigation = navigationConfigManager.getAllNavigationItems();
        const devtools = navigationConfigManager.getAllDevtools();
        
        // 清空现有导航
        this.mainNavElement.innerHTML = '';
        
        // 渲染导航项
        for (const item of navigation) {
            const navElement = this.createNavigationElement(item, devtools);
            this.mainNavElement.appendChild(navElement);
        }
        
        // 添加搜索框
        if (SEARCH_CONFIG.enabled) {
            const searchElement = this.createSearchElement();
            this.mainNavElement.appendChild(searchElement);
        }
        
        // 添加主题切换器
        await this.addThemeSwitcher();
        
        // 创建移动端覆盖层
        this.createMobileOverlay();
        
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
        button.innerHTML = `
            ${item.icon ? `<i class="${item.icon}"></i>` : ''}
            <span>${item.name}</span>
            <i class="fas fa-caret-down"></i>
        `;
        
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
            // 动态导入主题模块
            const [
                { ThemeManager },
                { ThemeSwitcher }
            ] = await Promise.all([
                import('../managers/theme-manager.js'),
                import('../components/ThemeSwitcher.js')
            ]);
            
            // 检查是否已经存在主题切换器
            const existingThemeSwitcher = this.mainNavElement.querySelector('.theme-switcher-container');
            if (existingThemeSwitcher) {
                existingThemeSwitcher.remove();
            }
            
            // 创建主题切换器容器
            const themeSwitcherContainer = document.createElement('div');
            themeSwitcherContainer.className = 'theme-switcher-container';
            
            // 初始化主题管理器（如果还没有初始化）
            if (!window.themeManager) {
                window.themeManager = new ThemeManager();
                await window.themeManager.initialize();
            }
            
            // 创建主题切换器
            const themeSwitcher = new ThemeSwitcher(window.themeManager);
            await themeSwitcher.render(themeSwitcherContainer);
            
            // 添加到导航中
            this.mainNavElement.appendChild(themeSwitcherContainer);
            
        } catch (error) {
            console.error('❌ 添加主题切换器失败:', error);
            // 主题切换器失败不应该阻止导航渲染
        }
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
        // 恢复原始导航顺序
        this.renderNavigation();
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
} 