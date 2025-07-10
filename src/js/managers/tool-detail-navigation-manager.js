/**
 * 工具详情页导航管理器
 * 负责管理工具详情页的导航状态和交互
 */

import { 
    DEFAULT_NAVIGATION_STRUCTURE,
    mergeWithDefaultConfig, 
    validateNavigationConfig,
    NAVIGATION_OPTIONS,
    getDefaultNavigationStructure
} from '../config/tool-detail-navigation-config.js';

class ToolDetailNavigationManager {
    /**
     * 构造函数
     * @param {string} toolId - 工具ID
     */
    constructor(toolId) {
        this.toolId = toolId;
        this.config = null;
        this.activeTabId = null;
        this.activeItemId = null;
        this.expandedItems = new Set();
        this.contentCache = new Map();
        this.eventListeners = new Map();
        this.isInitialized = false;
        
        // 绑定方法
        this.handleTabClick = this.handleTabClick.bind(this);
        this.handleItemClick = this.handleItemClick.bind(this);
        this.handleToggleExpand = this.handleToggleExpand.bind(this);
    }

    /**
     * 初始化导航管理器
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn(`导航管理器[${this.toolId}]已初始化`);
            return;
        }

        try {
            console.log(`🔧 初始化导航管理器[${this.toolId}]...`);
            
            // 加载配置
            await this.loadConfig();
            
            // 添加对展开状态变化的监听
            this.on('expandStateChanged', this.updateExpandState.bind(this));
            
            this.isInitialized = true;
            console.log(`✅ 导航管理器[${this.toolId}]初始化完成`);
            
        } catch (error) {
            console.error(`❌ 导航管理器[${this.toolId}]初始化失败:`, error);
            throw error;
        }
    }

    /**
     * 加载工具特定的导航配置
     * @returns {Promise<void>}
     */
    async loadConfig() {
        try {
            console.log(`📂 加载工具[${this.toolId}]导航配置...`);
            
            // 尝试加载工具特定的配置
            let customConfig = null;
            
            try {
                // 动态导入工具特定的配置
                console.log(`尝试加载 ../tools/${this.toolId}/navigation-config.js`);
                const module = await import(`../tools/${this.toolId}/navigation-config.js`);
                customConfig = module.default;
                console.log(`✅ 已加载工具[${this.toolId}]自定义导航配置`, customConfig);
            } catch (error) {
                console.warn(`⚠️ 未找到工具[${this.toolId}]自定义导航配置，将使用默认配置:`, error.message);
            }
            
            // 合并配置
            this.config = mergeWithDefaultConfig(customConfig);
            console.log(`合并后的配置:`, this.config);
            
            // 验证配置
            if (!validateNavigationConfig(this.config)) {
                console.error(`❌ 工具[${this.toolId}]导航配置无效，将使用默认配置`);
                this.config = getDefaultNavigationStructure();
            }
            
            // 设置默认激活的标签页
            if (this.config.tabs && this.config.tabs.length > 0) {
                this.activeTabId = this.config.tabs[0].id;
            }
            
            // 初始展开项
            if (NAVIGATION_OPTIONS.expandedByDefault) {
                this.initExpandedItems();
            }
            
            // 触发配置加载完成事件
            this.emit('configLoaded', { config: this.config });
            
        } catch (error) {
            console.error(`❌ 加载工具[${this.toolId}]导航配置失败:`, error);
            throw error;
        }
    }

    /**
     * 初始化展开项
     */
    initExpandedItems() {
        // 默认展开所有一级标签页
        this.config.tabs.forEach(tab => {
            if (tab.children && tab.children.length > 0) {
                this.expandedItems.add(tab.id);
            }
        });
    }

    /**
     * 渲染导航结构
     * @param {HTMLElement} container - 容器元素
     */
    renderNavigation(container) {
        if (!container) {
            console.error('渲染导航失败: 未提供容器元素');
            return;
        }

        if (!this.config) {
            console.error('渲染导航失败: 配置未加载');
            return;
        }

        console.log('🖌️ 开始渲染工具详情页导航...');

        // 创建导航容器
        const navContainer = document.createElement('div');
        navContainer.className = 'tool-detail-nav';
        navContainer.setAttribute('data-tool-id', this.toolId);

        // 渲染标签页
        this.config.tabs.forEach(tab => {
            const tabElement = this.createTabElement(tab);
            navContainer.appendChild(tabElement);
        });

        // 清空并添加到容器
        container.innerHTML = '';
        container.appendChild(navContainer);

        // 设置事件监听
        this.setupEventListeners(navContainer);

        console.log('✅ 工具详情页导航渲染完成');
        
        // 触发渲染完成事件
        this.emit('navigationRendered', { container });
    }

    /**
     * 创建标签页元素
     * @param {Object} tab - 标签页配置
     * @returns {HTMLElement} 标签页元素
     */
    createTabElement(tab) {
        const tabElement = document.createElement('div');
        tabElement.className = 'nav-tab';
        tabElement.setAttribute('data-tab-id', tab.id);
        
        if (tab.id === this.activeTabId) {
            tabElement.classList.add('active');
        }

        // 标签页标题
        const tabHeader = document.createElement('div');
        tabHeader.className = 'nav-tab-header';
        tabHeader.setAttribute('data-tab-toggle', tab.id);

        // 图标
        if (tab.icon && NAVIGATION_OPTIONS.showIcons) {
            const iconElement = document.createElement('i');
            iconElement.className = tab.icon;
            tabHeader.appendChild(iconElement);
        }

        // 标题
        const titleElement = document.createElement('span');
        titleElement.textContent = tab.title;
        tabHeader.appendChild(titleElement);

        // 展开/折叠图标（如果有子项）
        if (tab.children && tab.children.length > 0) {
            const toggleIcon = document.createElement('i');
            toggleIcon.className = this.expandedItems.has(tab.id) 
                ? 'fas fa-chevron-down' 
                : 'fas fa-chevron-right';
            toggleIcon.setAttribute('data-toggle', tab.id);
            tabHeader.appendChild(toggleIcon);
        }

        tabElement.appendChild(tabHeader);

        // 子项容器
        if (tab.children && tab.children.length > 0) {
            const childrenContainer = document.createElement('div');
            childrenContainer.className = 'nav-items';
            
            if (!this.expandedItems.has(tab.id)) {
                childrenContainer.style.display = 'none';
            }

            // 渲染子项
            tab.children.forEach(item => {
                const itemElement = this.createNavItemElement(item, tab.id);
                childrenContainer.appendChild(itemElement);
            });

            tabElement.appendChild(childrenContainer);
        }

        return tabElement;
    }

    /**
     * 创建导航项元素
     * @param {Object} item - 导航项配置
     * @param {string} parentId - 父级ID
     * @returns {HTMLElement} 导航项元素
     */
    createNavItemElement(item, parentId) {
        const itemElement = document.createElement('div');
        itemElement.className = 'nav-item';
        itemElement.setAttribute('data-item-id', item.id);
        itemElement.setAttribute('data-parent-id', parentId);
        
        if (item.id === this.activeItemId) {
            itemElement.classList.add('active');
        }

        // 导航项内容
        const itemContent = document.createElement('div');
        itemContent.className = 'nav-item-content';
        itemContent.setAttribute('data-item', item.id);

        // 图标
        if (item.icon && NAVIGATION_OPTIONS.showIcons) {
            const iconElement = document.createElement('i');
            iconElement.className = item.icon;
            itemContent.appendChild(iconElement);
        }

        // 标题
        const titleElement = document.createElement('span');
        titleElement.textContent = item.title;
        itemContent.appendChild(titleElement);

        // 如果是外部链接
        if (item.external && item.url) {
            const externalIcon = document.createElement('i');
            externalIcon.className = 'fas fa-external-link-alt';
            externalIcon.style.marginLeft = '5px';
            itemContent.appendChild(externalIcon);
            
            // 设置点击打开链接
            itemContent.onclick = (e) => {
                e.preventDefault();
                window.open(item.url, '_blank');
            };
        }

        itemElement.appendChild(itemContent);

        return itemElement;
    }

    /**
     * 设置事件监听
     * @param {HTMLElement} container - 导航容器
     */
    setupEventListeners(container) {
        // 标签页点击
        const tabHeaders = container.querySelectorAll('.nav-tab-header');
        tabHeaders.forEach(header => {
            header.addEventListener('click', this.handleTabClick);
        });

        // 导航项点击
        const navItems = container.querySelectorAll('.nav-item-content');
        navItems.forEach(item => {
            item.addEventListener('click', this.handleItemClick);
        });

        // 展开/折叠图标点击
        const toggleIcons = container.querySelectorAll('[data-toggle]');
        toggleIcons.forEach(icon => {
            icon.addEventListener('click', this.handleToggleExpand);
        });
    }

    /**
     * 处理标签页点击
     * @param {Event} event - 点击事件
     */
    handleTabClick(event) {
        const tabId = event.currentTarget.getAttribute('data-tab-toggle');
        if (!tabId) return;

        // 如果点击的是展开/折叠图标，不处理
        if (event.target.hasAttribute('data-toggle')) {
            return;
        }

        // 激活标签页
        this.activateTab(tabId);
        
        // 点击标签页时也切换展开/折叠状态
        this.toggleExpand(tabId);
    }

    /**
     * 处理导航项点击
     * @param {Event} event - 点击事件
     */
    handleItemClick(event) {
        const itemId = event.currentTarget.getAttribute('data-item');
        if (!itemId) return;

        this.activateItem(itemId);
    }

    /**
     * 处理展开/折叠点击
     * @param {Event} event - 点击事件
     */
    handleToggleExpand(event) {
        event.stopPropagation();
        const tabId = event.currentTarget.getAttribute('data-toggle');
        if (!tabId) return;

        this.toggleExpand(tabId);
    }

    /**
     * 激活标签页
     * @param {string} tabId - 标签页ID
     */
    activateTab(tabId) {
        if (tabId === this.activeTabId) return;

        this.activeTabId = tabId;
        this.activeItemId = null;

        // 触发标签页激活事件
        this.emit('tabActivated', { tabId });
    }

    /**
     * 激活导航项
     * @param {string} itemId - 导航项ID
     */
    activateItem(itemId) {
        if (itemId === this.activeItemId) return;

        this.activeItemId = itemId;

        // 查找父级标签页并激活
        const parentTab = this.findParentTab(itemId);
        if (parentTab && parentTab.id !== this.activeTabId) {
            this.activeTabId = parentTab.id;
        }

        // 触发导航项激活事件
        this.emit('itemActivated', { itemId, tabId: this.activeTabId });
    }

    /**
     * 查找导航项的父级标签页
     * @param {string} itemId - 导航项ID
     * @returns {Object|null} 父级标签页
     */
    findParentTab(itemId) {
        for (const tab of this.config.tabs) {
            if (!tab.children) continue;
            
            for (const item of tab.children) {
                if (item.id === itemId) {
                    return tab;
                }
            }
        }
        return null;
    }

    /**
     * 切换标签页展开/折叠状态
     * @param {string} tabId - 标签页ID
     */
    toggleExpand(tabId) {
        if (this.expandedItems.has(tabId)) {
            this.expandedItems.delete(tabId);
        } else {
            this.expandedItems.add(tabId);
        }

        // 触发展开状态变化事件
        this.emit('expandStateChanged', { 
            tabId, 
            expanded: this.expandedItems.has(tabId) 
        });
    }

    /**
     * 异步加载内容
     * @param {string} itemId - 导航项ID
     * @returns {Promise<Object>} 加载的内容
     */
    async loadContent(itemId) {
        // 如果内容已缓存，直接返回
        if (this.contentCache.has(itemId)) {
            console.log(`📋 使用缓存内容: ${itemId}`);
            return this.contentCache.get(itemId);
        }

        try {
            console.log(`📄 加载内容: ${itemId}`);
            
            // 查找导航项
            const item = this.findItemById(itemId);
            if (!item) {
                throw new Error(`未找到导航项: ${itemId}`);
            }
            
            // 如果是外部链接，直接返回URL
            if (item.external && item.url) {
                const content = { 
                    type: 'external', 
                    url: item.url,
                    title: item.title
                };
                this.contentCache.set(itemId, content);
                return content;
            }
            
            // 如果没有指定内容路径，尝试使用默认路径
            const contentPath = item.content || `../tools/${this.toolId}/content/${itemId}.js`;
            console.log(`🔗 内容路径: ${contentPath}`);
            
            try {
                // 动态导入内容模块
                const module = await import(contentPath);
                const content = module.default;
                
                if (!content) {
                    throw new Error(`内容模块未导出默认内容: ${contentPath}`);
                }
                
                // 缓存内容
                this.contentCache.set(itemId, content);
                
                console.log(`✅ 内容加载完成: ${itemId}`);
                
                // 触发内容加载完成事件
                this.emit('contentLoaded', { itemId, content });
                
                return content;
            } catch (importError) {
                console.error(`❌ 导入内容模块失败: ${contentPath}`, importError);
                
                // 创建一个占位内容
                const placeholderContent = {
                    title: item.title,
                    html: `
                        <div class="content-placeholder">
                            <div class="placeholder-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <h2>内容正在开发中</h2>
                            <p>该部分内容尚未完成，请稍后再来查看。</p>
                            <p class="error-details">错误信息: ${importError.message}</p>
                        </div>
                    `
                };
                
                // 缓存占位内容
                this.contentCache.set(itemId, placeholderContent);
                
                // 触发内容加载完成事件（使用占位内容）
                this.emit('contentLoaded', { itemId, content: placeholderContent });
                
                return placeholderContent;
            }
        } catch (error) {
            console.error(`❌ 加载内容失败: ${itemId}`, error);
            
            // 触发内容加载失败事件
            this.emit('contentLoadError', { itemId, error });
            
            // 返回错误内容而不是抛出异常
            const errorContent = {
                title: '加载失败',
                html: `
                    <div class="error-content">
                        <div class="error-icon">
                            <i class="fas fa-exclamation-triangle"></i>
                        </div>
                        <h2>内容加载失败</h2>
                        <p>加载该部分内容时发生错误，请稍后再试。</p>
                        <p class="error-details">错误信息: ${error.message}</p>
                    </div>
                `
            };
            
            return errorContent;
        }
    }

    /**
     * 根据ID查找导航项
     * @param {string} id - 导航项ID
     * @returns {Object|null} 导航项
     */
    findItemById(id) {
        // 先检查是否是标签页
        const tab = this.config.tabs.find(tab => tab.id === id);
        if (tab) return tab;

        // 然后检查子项
        for (const tab of this.config.tabs) {
            if (!tab.children) continue;
            
            const item = tab.children.find(item => item.id === id);
            if (item) return item;
        }

        return null;
    }

    /**
     * 获取当前激活的标签页
     * @returns {Object|null} 激活的标签页
     */
    getActiveTab() {
        if (!this.activeTabId) return null;
        return this.config.tabs.find(tab => tab.id === this.activeTabId);
    }

    /**
     * 获取当前激活的导航项
     * @returns {Object|null} 激活的导航项
     */
    getActiveItem() {
        if (!this.activeItemId) return null;
        return this.findItemById(this.activeItemId);
    }

    /**
     * 获取欢迎页配置
     * @returns {Object} 欢迎页配置
     */
    getWelcomeConfig() {
        return this.config.welcome;
    }

    /**
     * 添加事件监听器
     * @param {string} event - 事件名称
     * @param {Function} listener - 监听函数
     */
    on(event, listener) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, new Set());
        }
        this.eventListeners.get(event).add(listener);
    }

    /**
     * 移除事件监听器
     * @param {string} event - 事件名称
     * @param {Function} listener - 监听函数
     */
    off(event, listener) {
        if (!this.eventListeners.has(event)) return;
        this.eventListeners.get(event).delete(listener);
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {Object} data - 事件数据
     */
    emit(event, data) {
        if (!this.eventListeners.has(event)) return;
        
        for (const listener of this.eventListeners.get(event)) {
            try {
                listener(data);
            } catch (error) {
                console.error(`事件监听器执行错误: ${event}`, error);
            }
        }
    }

    /**
     * 更新展开状态的DOM表现
     * @param {Object} data - 事件数据
     */
    updateExpandState({ tabId, expanded }) {
        // 查找对应的标签页元素
        const tabElement = document.querySelector(`.nav-tab[data-tab-id="${tabId}"]`);
        if (!tabElement) return;
        
        // 查找子项容器
        const childrenContainer = tabElement.querySelector('.nav-items');
        if (!childrenContainer) return;
        
        // 更新展开/折叠状态
        childrenContainer.style.display = expanded ? 'flex' : 'none';
        
        // 更新图标
        const toggleIcon = tabElement.querySelector(`[data-toggle="${tabId}"]`);
        if (toggleIcon) {
            toggleIcon.className = expanded ? 'fas fa-chevron-down' : 'fas fa-chevron-right';
        }
        
        console.log(`🔄 更新标签页[${tabId}]展开状态: ${expanded ? '展开' : '折叠'}`);
    }

    /**
     * 销毁导航管理器
     */
    destroy() {
        // 清空事件监听器
        this.eventListeners.clear();
        
        // 清空缓存
        this.contentCache.clear();
        
        // 重置状态
        this.activeTabId = null;
        this.activeItemId = null;
        this.expandedItems.clear();
        this.isInitialized = false;
        
        console.log(`🗑️ 工具[${this.toolId}]详情页导航管理器已销毁`);
    }
}

// 导出单例工厂函数
let instances = new Map();

/**
 * 获取工具详情页导航管理器实例
 * @param {string} toolId - 工具ID
 * @returns {ToolDetailNavigationManager} 导航管理器实例
 */
export function getToolDetailNavigationManager(toolId) {
    if (!toolId) {
        throw new Error('获取导航管理器失败: 未提供工具ID');
    }
    
    console.log(`🔍 获取工具[${toolId}]详情页导航管理器...`);
    
    if (!instances.has(toolId)) {
        console.log(`🆕 创建工具[${toolId}]详情页导航管理器实例`);
        instances.set(toolId, new ToolDetailNavigationManager(toolId));
    } else {
        console.log(`♻️ 复用工具[${toolId}]详情页导航管理器实例`);
    }
    
    return instances.get(toolId);
}

/**
 * 清除所有导航管理器实例
 */
export function clearAllNavigationManagers() {
    for (const [toolId, manager] of instances.entries()) {
        manager.destroy();
    }
    instances.clear();
} 