/**
 * 主应用类
 * 应用的入口点，负责初始化和协调所有组件
 */
import { Store } from './Store.js';
import { eventBus } from './EventBus.js';
import { ToolService } from '../services/ToolService.js';
import { CompareService } from '../services/CompareService.js';
import { ToolCard } from '../components/ToolCard.js';
import { LanguageSwitcher } from '../components/LanguageSwitcher.js';
import { NavigationManager } from '../managers/navigation-manager.js';
import { getI18nManager } from '../managers/i18n-manager.js';
import { APP_CONFIG, UI_CONSTANTS, CSS_CLASSES } from '../constants/AppConstants.js';
import { debounce, storage, getDeviceInfo } from '../utils/helpers.js';

class App {
    constructor() {
        this.store = new Store();
        this.toolService = null;
        this.compareService = null;
        this.navigationManager = null;
        this.i18nManager = null;
        this.languageSwitcher = null;
        this.components = {
            toolCards: new Map(),
            modals: new Map()
        };
        this.initialized = false;
        this.deviceInfo = getDeviceInfo();
        
        // 绑定方法上下文
        this.handleResize = debounce(this.handleResize.bind(this), 250);
    }

    /**
     * 初始化应用
     */
    async initialize() {
        try {
            console.log('🚀 开始初始化应用...');
            
            // 初始化设备信息
            this.deviceInfo = getDeviceInfo();
            
            // 设置错误处理
            this.setupErrorHandling();
            
            // 初始化国际化系统
            await this.initializeI18n();
            
            // 初始化语言切换器
            this.initializeLanguageSwitcher();
            
            // 初始化导航管理器
            await this.initializeNavigation();
            
            // 初始化服务
            await this.initializeServices();
            
            // 检查和同步工具数据
            this.checkAndSyncToolData();
            
            // 设置事件监听
            this.setupEventListeners();
            
            // 初始化UI
            this.initializeUI();
            
            // 加载用户偏好
            this.loadUserPreferences();
            
            // 添加全局调试函数
            window.forceTranslate = () => {
                console.log('🔧 强制翻译页面...');
                if (this.i18nManager && typeof this.i18nManager.translatePage === 'function') {
                    this.i18nManager.translatePage();
                    console.log('✅ 强制翻译完成');
                } else {
                    console.error('❌ i18n管理器不可用');
                }
            };
            
            window.checkI18nStatus = () => {
                console.log('📊 i18n状态检查:', {
                    'i18n管理器存在': !!this.i18nManager,
                    '已初始化': this.i18nManager?.isInitialized,
                    '当前语言': this.i18nManager?.getCurrentLanguage(),
                    '支持的语言': this.i18nManager?.supportedLanguages,
                    '翻译数据': Object.keys(this.i18nManager?.translations || {})
                });
            };
            
            console.log('✅ 应用初始化完成');
            
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.handleError('应用初始化失败', error);
        }
    }

    /**
     * 初始化国际化系统
     */
    async initializeI18n() {
        try {
            this.i18nManager = getI18nManager();
            await this.i18nManager.init();
            
            // 监听语言变化事件
            this.i18nManager.onLanguageChange((event) => {
                this.handleLanguageChange(event);
            });
            
            console.log('✅ 国际化系统初始化完成');
        } catch (error) {
            console.error('❌ 国际化系统初始化失败:', error);
            throw error;
        }
    }

    /**
     * 初始化语言切换器
     */
    initializeLanguageSwitcher() {
        try {
            const container = document.getElementById('languageSwitcherContainer');
            if (container) {
                // 获取i18n管理器
                const i18nManager = this.i18nManager || window.__i18nManager;
                if (i18nManager) {
                    this.languageSwitcher = new LanguageSwitcher({
                        container: container,
                        i18nManager: i18nManager
                    });
                    console.log('✅ 语言切换器初始化完成');
                } else {
                    console.error('❌ i18n管理器不可用');
                }
            } else {
                console.warn('⚠️ 找不到语言切换器容器');
            }
        } catch (error) {
            console.error('❌ 语言切换器初始化失败:', error);
            // 语言切换器初始化失败不应该阻止应用启动
        }
    }

    /**
     * 重新初始化语言切换器
     * 当导航管理器重新渲染并恢复语言切换器容器时调用
     */
    reinitializeLanguageSwitcher() {
        try {
            console.log('🔄 重新初始化语言切换器...');
            
            // 清理现有的语言切换器
            if (this.languageSwitcher) {
                if (typeof this.languageSwitcher.destroy === 'function') {
                    this.languageSwitcher.destroy();
                }
                this.languageSwitcher = null;
            }
            
            // 等待DOM更新后重新初始化
            setTimeout(() => {
                this.initializeLanguageSwitcher();
            }, 50);
            
        } catch (error) {
            console.error('❌ 重新初始化语言切换器失败:', error);
        }
    }

    /**
     * 初始化导航
     */
    async initializeNavigation() {
        try {
            this.navigationManager = new NavigationManager();
            await this.navigationManager.initialize();
            console.log('✅ 导航初始化完成');
        } catch (error) {
            console.error('❌ 导航初始化失败:', error);
            // 导航初始化失败不应该阻止应用启动，所以不抛出错误
        }
    }

    /**
     * 初始化服务
     */
    async initializeServices() {
        // 初始化工具服务
        this.toolService = new ToolService(this.store);
        await this.toolService.initialize();
        
        // 🔑 安全机制：检查是否错过了初始化事件
        // 如果工具数据已经加载但UI状态没有更新，主动同步
        this.checkAndSyncToolData();
        
        // 初始化比较服务
        this.compareService = new CompareService(this.store, this.toolService);
        
        console.log('✅ 服务初始化完成');
    }

    /**
     * 检查并同步工具数据（防止错过初始化事件）
     */
    checkAndSyncToolData() {
        if (!this.toolService) return;
        
        const tools = this.toolService.getAllTools();
        const state = this.store.getState();
        
        console.log('🔍 检查工具数据同步状态:', {
            toolServiceHasData: tools.length > 0,
            storeHasTools: (state.tools || []).length > 0,
            storeHasFilteredTools: (state.filteredTools || []).length > 0
        });
        
        // 如果ToolService有数据但Store中没有，说明错过了事件，主动同步
        if (tools.length > 0 && (!state.tools || state.tools.length === 0)) {
            console.log('🔧 检测到数据未同步，主动触发工具初始化事件');
            this.handleToolServiceInitialized(tools);
        }
    }

    /**
     * 设置事件监听
     */
    setupEventListeners() {
        console.log('🎯 开始设置事件监听...');
        
        // 状态变化监听
        this.store.subscribe((newState, updates, prevState, action) => {
            console.log('📡 收到状态变化事件:', {
                action,
                updates: Object.keys(updates),
                hasTools: newState.tools?.length > 0,
                hasFilteredTools: newState.filteredTools?.length > 0
            });
            this.handleStateChange(newState, updates, prevState, action);
        });

        // 服务初始化事件
        eventBus.on('toolService:initialized', (tools) => {
            console.log('📡 收到工具服务初始化事件，工具数量:', tools?.length || 0);
            this.handleToolServiceInitialized(tools);
        });
        
        // 工具相关事件
        eventBus.on('toolCard:detailsClicked', this.handleToolDetails.bind(this));
        eventBus.on('toolCard:compareToggled', this.handleCompareToggle.bind(this));
        
        // 比较相关事件
        eventBus.on('compare:maxItemsReached', this.handleMaxCompareItems.bind(this));
        
        // UI 事件
        eventBus.on('ui:filterChanged', this.handleFilterChange.bind(this));
        eventBus.on('ui:sortChanged', this.handleSortChange.bind(this));
        
        // 浏览器事件
        window.addEventListener('resize', this.handleResize);
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        
        // 键盘快捷键
        document.addEventListener('keydown', this.handleGlobalKeyDown.bind(this));
        
        console.log('✅ 事件监听设置完成');
    }

    /**
     * 初始化UI
     */
    initializeUI() {
        console.log('🎨 开始初始化UI...');
        
        try {
            // 获取主要DOM元素
            this.elements = {
                toolsContainer: document.getElementById('toolsContainer'),
                loadingIndicator: document.getElementById('loadingIndicator'),
                errorMessage: document.getElementById('errorMessage'),
                typeFilter: document.getElementById('typeFilter'),
                priceFilter: document.getElementById('priceFilter'),
                sortSelect: document.getElementById('sortSelect'),
                compareButton: document.getElementById('compareButton'),
                comparePanel: document.getElementById('comparePanel')
            };

            console.log('📦 DOM元素状态:', {
                hasToolsContainer: !!this.elements.toolsContainer,
                hasLoadingIndicator: !!this.elements.loadingIndicator,
                hasErrorMessage: !!this.elements.errorMessage,
                hasTypeFilter: !!this.elements.typeFilter,
                hasPriceFilter: !!this.elements.priceFilter,
                hasSortSelect: !!this.elements.sortSelect
            });

            if (!this.elements.toolsContainer) {
                throw new Error('找不到工具容器元素 #toolsContainer');
            }

            // 设置筛选控件
            this.setupFilterControls();
            
            // 设置排序选择器
            this.setupSortSelect();
            
            // 设置比较按钮
            this.setupCompareButton();
            
            // 检查是否已有工具数据，如果有则渲染
            const state = this.store.getState();
            if (state.tools && state.tools.length > 0) {
                console.log('🔄 检测到已有工具数据，开始渲染...');
                this.renderTools();
            } else {
                console.log('⏳ 等待工具数据加载...');
            }
            
            console.log('✅ UI初始化完成');
            
        } catch (error) {
            console.error('❌ UI初始化失败:', error);
            this.handleError('UI初始化失败', error);
        }
    }

    /**
     * 设置筛选控件
     */
    setupFilterControls() {
        // 设置类型筛选
        if (this.elements.typeFilter) {
            this.elements.typeFilter.addEventListener('change', (e) => {
                this.handleFilterChange('type', e.target.value);
            });
        }

        // 设置价格筛选
        if (this.elements.priceFilter) {
            this.elements.priceFilter.addEventListener('change', (e) => {
                this.handleFilterChange('price', e.target.value);
            });
        }
    }

    /**
     * 设置排序选择器
     */
    setupSortSelect() {
        if (!this.elements.sortSelect) return;

        this.elements.sortSelect.addEventListener('change', (e) => {
            const sortBy = e.target.value;
            this.handleSortChange(sortBy);
        });
    }

    /**
     * 设置比较按钮
     */
    setupCompareButton() {
        if (!this.elements.compareButton) return;

        this.elements.compareButton.addEventListener('click', () => {
            this.toggleCompareMode();
        });
    }

    /**
     * 处理状态变化
     */
    handleStateChange(newState, updates, prevState, action) {
        console.log(`🔄 状态变化 [${action}]:`, {
            updatedFields: Object.keys(updates),
            toolsCount: newState.tools?.length || 0,
            filteredToolsCount: newState.filteredTools?.length || 0
        });
        
        // 更新加载状态
        if ('loading' in updates) {
            this.updateLoadingState(newState.loading);
        }

        // 更新错误状态
        if ('error' in updates) {
            this.updateErrorState(newState.error);
        }

        // 如果tools更新了，需要重新应用筛选并渲染
        if ('tools' in updates) {
            console.log('📦 工具数据更新，准备重新渲染');
            // 确保有工具数据
            if (newState.tools && newState.tools.length > 0) {
                // 如果没有筛选过的工具，先设置为所有工具
                if (!newState.filteredTools || newState.filteredTools.length === 0) {
                    console.log('🔄 初始化筛选后的工具列表');
                    this.store.setState({ filteredTools: newState.tools }, 'INIT_FILTERED_TOOLS');
                } else {
                    // 否则重新应用筛选
                    console.log('🔍 重新应用筛选条件');
                    this.applyFilters();
                }
            }
        }

        // 更新工具列表显示
        if ('filteredTools' in updates) {
            console.log(`🎨 准备渲染工具列表，数量: ${newState.filteredTools?.length || 0}`);
            // 确保DOM已经准备好
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.renderTools());
            } else {
                this.renderTools();
            }
        }

        // 更新比较状态
        if ('selectedTools' in updates || 'compareMode' in updates) {
            this.updateCompareState(newState);
        }
    }

    /**
     * 处理筛选变化
     */
    handleFilterChange(filterType, filterValue) {
        const currentState = this.store.getState();
        const newFilters = {
            ...currentState.filters,
            [filterType]: filterValue
        };

        console.log(`📋 筛选变化: ${filterType} = ${filterValue}`);
        this.store.setState({ filters: newFilters }, 'FILTER_CHANGE');

        // 应用筛选
        this.applyFilters();
    }

    /**
     * 处理排序变化
     */
    handleSortChange(sortBy) {
        this.store.setState({ sort: sortBy }, 'SORT_CHANGE');
        this.applyFilters();
    }

    /**
     * 应用筛选条件
     */
    applyFilters() {
        console.log('🔍 开始应用筛选条件...');
        
        const state = this.store.getState();
        let tools = state.tools || [];
        
        console.log('📊 筛选前工具数量:', tools.length);
        console.log('🏷️ 当前筛选条件:', state.filters);
        
        // 如果没有工具数据，直接返回
        if (!tools || tools.length === 0) {
            console.warn('⚠️ 没有可用的工具数据');
            this.store.setState({ filteredTools: [] }, 'FILTER_NO_TOOLS');
            return;
        }
        
        // 应用类型筛选
        if (state.filters.type && state.filters.type !== 'all') {
            tools = tools.filter(tool => tool.type === state.filters.type);
        }
        
        // 应用价格筛选
        if (state.filters.price && state.filters.price !== 'all') {
            tools = tools.filter(tool => tool.price === state.filters.price);
        }
        
        // 应用分类筛选
        if (state.filters.category && state.filters.category !== 'all') {
            tools = tools.filter(tool => tool.category === state.filters.category);
        }
        
        // 应用排序
        if (state.sort) {
            tools = this.sortTools(tools, state.sort);
        }
        
        console.log('📊 筛选后工具数量:', tools.length);
        
        // 更新过滤后的工具列表
        this.store.setState({ 
            filteredTools: tools,
            loading: false,
            error: null
        }, 'FILTER_APPLIED');
        
        // 触发重新渲染
        this.renderTools();
    }
    
    /**
     * 对工具进行排序
     * @param {Array} tools - 要排序的工具数组
     * @param {string} sortBy - 排序方式
     * @returns {Array} 排序后的工具数组
     */
    sortTools(tools, sortBy) {
        switch (sortBy) {
            case 'popularity':
                return [...tools].sort((a, b) => (b.rating || 0) - (a.rating || 0));
            case 'name':
                return [...tools].sort((a, b) => a.name.localeCompare(b.name));
            case 'newest':
                return [...tools].sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0));
            default:
                return tools;
        }
    }

    /**
     * 渲染工具列表
     */
    renderTools() {
        console.log('🎨 开始渲染工具列表...');
        
        try {
            // 获取工具数据
            const state = this.store.getState();
            const tools = state.filteredTools || state.tools || [];
            
            console.log('📦 渲染前状态检查:', {
                hasToolsContainer: !!document.getElementById('toolsContainer'),
                totalTools: state.tools?.length || 0,
                filteredTools: state.filteredTools?.length || 0,
                actualTools: tools.length,
                filters: state.filters,
                loading: state.loading
            });
            
            // 获取工具容器
            const container = document.getElementById('toolsContainer');
            if (!container) {
                console.error('❌ 找不到工具容器元素 #toolsContainer');
                return;
            }
            
            // 清理现有卡片
            this.clearToolCards();
            console.log('🧹 已清理现有卡片');
            
            // 检查是否有工具数据
            if (!tools || tools.length === 0) {
                console.log('⚠️ 没有可用的工具数据，显示空状态');
                this.renderEmptyState();
                return;
            }
            
            // 渲染工具卡片
            console.log(`🔄 开始渲染 ${tools.length} 个工具卡片`);
            let successCount = 0;
            let errorCount = 0;
            
            tools.forEach(tool => {
                try {
                    console.log(`🎯 渲染工具卡片: ${tool.id}`);
                    const card = this.renderToolCard(tool);
                    if (card) {
                        container.appendChild(card);
                        successCount++;
                    }
                } catch (error) {
                    console.error(`❌ 渲染工具卡片失败 [${tool.id}]:`, error);
                    errorCount++;
                    // 尝试使用简化版卡片作为后备
                    try {
                        const simpleCard = this.renderSimpleToolCard(tool, error);
                        if (simpleCard) {
                            container.appendChild(simpleCard);
                            successCount++;
                        }
                    } catch (fallbackError) {
                        console.error(`❌ 简化版卡片渲染也失败 [${tool.id}]:`, fallbackError);
                    }
                }
            });
            
            console.log('✅ 工具列表渲染完成:', {
                total: tools.length,
                success: successCount,
                error: errorCount
            });
            
            // 更新工具计数
            this.updateToolsCount(tools.length);
            
        } catch (error) {
            console.error('❌ 渲染工具列表时发生错误:', error);
            this.handleError('渲染工具列表失败', error);
        }
    }

    /**
     * 渲染工具卡片
     * @param {Object} tool - 工具数据
     * @returns {HTMLElement} 工具卡片元素
     */
    renderToolCard(tool) {
        console.log('🎯 渲染工具卡片:', tool.id);
        
        try {
            const state = this.store.getState();
            const selectedTools = state.selectedTools || new Set();
            
            // 确保 selectedTools 是 Set 类型
            const isSelected = selectedTools instanceof Set ? 
                selectedTools.has(tool.id) : 
                Array.isArray(selectedTools) ? 
                    selectedTools.includes(tool.id) : 
                    false;
            
            const cardProps = {
                tool,
                isSelected,
                showCompareButton: state.compareMode,
                onSelect: (toolId, toolData) => this.handleToolSelect(toolId, toolData),
                onViewDetails: (eventData) => this.handleToolDetails(eventData)
            };
            
            const card = new ToolCard(cardProps);
            this.components.toolCards.set(tool.id, card);
            console.log('✅ 工具卡片渲染成功:', tool.id);
            return card.render();
        } catch (error) {
            console.error('❌ 渲染工具卡片失败:', {
                toolId: tool.id,
                error: error.message
            });
            return this.renderErrorCard(tool, error);
        }
    }

    /**
     * 渲染错误卡片
     * @param {Object} tool - 工具数据
     * @param {Error} error - 错误对象
     * @returns {HTMLElement} 错误卡片元素
     */
    renderErrorCard(tool, error) {
        const errorCard = document.createElement('div');
        errorCard.className = 'tool-card error';
        errorCard.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>渲染失败: ${tool.name || tool.id}</h3>
                <p class="error-message">${error.message}</p>
            </div>
        `;
        return errorCard;
    }

    /**
     * 渲染简化的工具卡片（用于调试和错误回退）
     */
    renderSimpleToolCard(tool, error = null) {
        // 安全检查DOM元素
        if (!this.elements || !this.elements.toolsContainer) {
            console.warn('⚠️ renderSimpleToolCard: DOM元素不可用');
            return;
        }
        
        const card = document.createElement('div');
        card.className = 'tool-card simple-tool-card';
        card.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin: 10px;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 200px;
        `;
        
        card.innerHTML = `
            <div class="simple-card-content">
                <div style="display: flex; align-items: center; margin-bottom: 15px;">
                    <div style="width: 40px; height: 40px; background: #007bff; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; margin-right: 15px; font-weight: bold;">
                        ${tool.name ? tool.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                        <h3 style="margin: 0; color: #333; font-size: 18px;">${tool.name || '未知工具'}</h3>
                        <span style="font-size: 12px; color: #666;">${tool.type || '未知类型'}</span>
                    </div>
                </div>
                
                <p style="color: #666; margin: 10px 0; line-height: 1.5;">
                    ${tool.description || '暂无描述'}
                </p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                    <span style="background: #28a745; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px;">
                        ${tool.price || '未知价格'}
                    </span>
                    <span style="color: #ffa500;">
                        ★ ${tool.rating || 'N/A'}
                    </span>
                </div>
                
                ${error ? `
                    <div style="margin-top: 10px; padding: 10px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; font-size: 12px;">
                        ⚠️ 复杂卡片渲染失败，使用简化版本<br>
                        错误: ${error.message}
                    </div>
                ` : ''}
                
                <div style="margin-top: 15px;">
                    <button class="simple-card-details-btn" data-tool-id="${tool.id}" style="background: #007bff; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer; margin-right: 8px;">
                        查看详情
                    </button>
                    <button onclick="window.debug?.showDebugPanel()" style="background: #6c757d; color: white; border: none; padding: 8px 12px; border-radius: 4px; font-size: 12px; cursor: pointer;">
                        调试面板
                    </button>
                </div>
            </div>
        `;
        
        // 为简化卡片添加事件监听
        const detailsBtn = card.querySelector('.simple-card-details-btn');
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                console.log('🔍 简化卡片详情按钮点击，跳转到详情页面:', tool);
                const detailUrl = `src/pages/tool.html?id=${encodeURIComponent(tool.id)}`;
                window.location.href = detailUrl;
            });
        }

        this.elements.toolsContainer.appendChild(card);
        console.log(`✅ 简化工具卡片渲染成功: ${tool.name}`);
    }

    /**
     * 清空工具卡片
     */
    clearToolCards() {
        try {
            // 销毁现有组件
            this.components.toolCards.forEach(card => {
                try {
                    card.unmount();
                } catch (error) {
                    console.warn('⚠️ 销毁工具卡片组件时出错:', error);
                }
            });
            this.components.toolCards.clear();
            
            // 清空容器
            if (this.elements && this.elements.toolsContainer) {
                this.elements.toolsContainer.innerHTML = '';
                console.log('🧹 工具卡片容器已清空');
            } else {
                console.warn('⚠️ 工具容器元素不可用，无法清空');
            }
        } catch (error) {
            console.error('❌ 清空工具卡片失败:', error);
        }
    }

    /**
     * 渲染空状态
     */
    renderEmptyState() {
        try {
            // 安全检查DOM元素
            if (!this.elements || !this.elements.toolsContainer) {
                console.warn('⚠️ renderEmptyState: DOM元素不可用');
                return;
            }
            
            const message = UI_CONSTANTS.MESSAGES.NO_TOOLS;

            this.elements.toolsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3>暂无内容</h3>
                    <p>${message}</p>

                </div>
            `;
            
            console.log('📋 空状态已渲染');
        } catch (error) {
            console.error('❌ 渲染空状态失败:', error);
        }
    }

    /**
     * 处理工具服务初始化完成事件
     */
    handleToolServiceInitialized(tools) {
        console.log('🎯 处理工具服务初始化事件...');
        console.log('📦 工具数据状态:', {
            toolsCount: tools?.length || 0,
            hasToolService: !!this.toolService,
            hasStore: !!this.store,
            uiInitialized: !!this.elements?.toolsContainer
        });

        if (!tools || !Array.isArray(tools)) {
            console.error('❌ 无效的工具数据:', tools);
            return;
        }

        try {
            // 更新状态
            this.store.setState({
                tools,
                filteredTools: tools, // 初始时显示所有工具
                loading: false,
                error: null
            }, 'TOOLS_INITIALIZED');

            // 确保UI已初始化
            if (!this.elements?.toolsContainer) {
                console.log('⚠️ UI尚未初始化，初始化UI...');
                this.initializeUI();
            }

            // 主动触发渲染
            console.log('🔄 主动触发工具列表渲染...');
            this.renderTools();

        } catch (error) {
            console.error('❌ 处理工具初始化事件失败:', error);
            this.handleError('处理工具初始化事件失败', error);
        }
    }

    /**
     * 处理工具选择
     */
    handleToolSelect(toolId, tool) {
        return this.compareService.toggleCompare(toolId);
    }

    /**
     * 处理工具详情
     * @param {Object} eventData - 事件数据
     */
    handleToolDetails(eventData) {
        console.log('🔍 处理工具详情:', eventData);
        
        try {
            const { toolId, tool } = eventData;
            if (!toolId || !tool) {
                console.error('❌ 工具详情数据无效:', eventData);
                return;
            }
            
            // 跳转到详情页面
            const detailUrl = `src/pages/tool.html?id=${encodeURIComponent(toolId)}`;
            window.location.href = detailUrl;
            
            console.log('✅ 工具详情处理成功:', toolId);
        } catch (error) {
            console.error('❌ 处理工具详情失败:', error);
            this.handleError('处理工具详情失败', error);
        }
    }

    /**
     * 处理比较切换
     */
    handleCompareToggle(eventData) {
        const { toolId, selected } = eventData;
        this.updateToolCardSelection(toolId, selected);
    }

    /**
     * 处理最大比较项目
     */
    handleMaxCompareItems(eventData) {
        const { maxItems } = eventData;
        const message = UI_CONSTANTS.MESSAGES.COMPARE_MAX_REACHED
            .replace('{count}', maxItems);
        this.showNotification(message, 'warning');
    }

    /**
     * 切换比较模式
     */
    toggleCompareMode() {
        const state = this.store.getState();
        
        if (state.compareMode) {
            this.compareService.exitCompareMode();
        } else {
            if (state.selectedTools.size >= 2) {
                this.compareService.enterCompareMode();
                this.showComparePanel();
            } else {
                this.showNotification(UI_CONSTANTS.MESSAGES.COMPARE_MIN_REQUIRED, 'warning');
            }
        }
    }

    /**
     * 显示比较面板
     */
    showComparePanel() {
        const comparisonData = this.compareService.getComparisonData();
        if (!comparisonData) return;

        // 这里可以实现比较面板的显示逻辑
        console.log('显示比较面板:', comparisonData);
    }

    /**
     * 更新加载状态
     */
    updateLoadingState(loading) {
        try {
            if (this.elements && this.elements.loadingIndicator) {
                this.elements.loadingIndicator.style.display = loading ? 'block' : 'none';
            }

            // 更新工具容器状态
            if (this.elements && this.elements.toolsContainer) {
                this.elements.toolsContainer.classList.toggle(CSS_CLASSES.LOADING, loading);
            }
            
            console.log(`🔄 更新加载状态: ${loading ? '加载中' : '已完成'}`);
        } catch (error) {
            console.error('❌ 更新加载状态失败:', error);
        }
    }

    /**
     * 更新错误状态
     */
    updateErrorState(error) {
        try {
            if (!this.elements || !this.elements.errorMessage) {
                console.warn('⚠️ 错误消息元素不可用');
                return;
            }

            if (error) {
                this.elements.errorMessage.textContent = error.message || UI_CONSTANTS.MESSAGES.ERROR;
                this.elements.errorMessage.style.display = 'block';
                console.log('❌ 显示错误消息:', error.message);
            } else {
                this.elements.errorMessage.style.display = 'none';
                console.log('✅ 隐藏错误消息');
            }
        } catch (err) {
            console.error('❌ 更新错误状态失败:', err);
        }
    }

    /**
     * 更新比较状态
     */
    updateCompareState(state) {
        const selectedCount = state.selectedTools.size;
        
        // 更新比较按钮
        if (this.elements.compareButton) {
            this.elements.compareButton.textContent = `对比 (${selectedCount})`;
            this.elements.compareButton.disabled = selectedCount < 2;
        }

        // 更新比较面板显示
        if (this.elements.comparePanel) {
            this.elements.comparePanel.style.display = state.compareMode ? 'block' : 'none';
        }
    }

    /**
     * 更新工具卡片选择状态
     */
    updateToolCardSelection(toolId, selected) {
        const toolCard = this.components.toolCards.get(toolId);
        if (toolCard) {
            toolCard.updateCompareButton(selected);
        }
    }

    /**
     * 更新工具数量显示
     */
    updateToolsCount(count) {
        try {
            const countElement = document.getElementById('toolsCount');
            if (countElement) {
                countElement.textContent = `共 ${count} 个工具`;
                console.log(`📊 更新工具数量显示: ${count} 个工具`);
            } else {
                console.warn('⚠️ 工具数量显示元素未找到 (toolsCount)');
            }
        } catch (error) {
            console.error('❌ 更新工具数量显示失败:', error);
        }
    }

    /**
     * 更新筛选控件状态
     */
    updateFilterControlState(filterType, filterValue) {
        // 对于下拉选择框，值会自动更新，这里可以添加其他UI状态更新逻辑
        console.log(`🎨 更新筛选控件状态: ${filterType} = ${filterValue}`);
    }

    /**
     * 显示工具详情模态框（已弃用 - 现在使用独立页面）
     */
    showToolModal(tool) {
        // 直接跳转到详情页面而不是显示模态框
        console.log('showToolModal被调用，重定向到详情页面:', tool);
        
        if (!tool || !tool.id) {
            console.error('❌ 工具数据无效，无法跳转到详情页面');
            this.showNotification('工具数据不可用', 'error');
            return;
        }
        
        const detailUrl = `src/pages/tool.html?id=${encodeURIComponent(tool.id)}`;
        window.location.href = detailUrl;
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 简单的通知实现
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * 处理语言变化
     */
    handleLanguageChange(event) {
        try {
            const { oldLanguage, newLanguage } = event;
            console.log(`🌍 语言已切换: ${oldLanguage} → ${newLanguage}`);
            
            // 注意：不需要再次调用translatePage()，因为i18n管理器已经处理了
            
            // 更新页面标题和meta信息
            this.updatePageMeta();
            
            // 重新渲染工具卡片（如果需要）
            this.rerenderToolsForLanguage();
            
            // 添加全局调试函数（临时）
            window.forceTranslate = () => {
                console.log('🔧 强制翻译页面...');
                this.i18nManager.translatePage();
                console.log('✅ 强制翻译完成');
            };
            
            // 触发语言变化事件
            eventBus.emit('app:languageChanged', { oldLanguage, newLanguage });
            
        } catch (error) {
            console.error('❌ 处理语言变化失败:', error);
        }
    }

    /**
     * 更新页面meta信息
     */
    updatePageMeta() {
        try {
            const title = this.i18nManager.t('meta.title');
            const description = this.i18nManager.t('meta.description');
            const keywords = this.i18nManager.t('meta.keywords');
            
            // 更新页面标题
            document.title = title;
            
            // 更新meta description
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', description);
            }
            
            // 更新meta keywords
            const metaKeywords = document.querySelector('meta[name="keywords"]');
            if (metaKeywords) {
                metaKeywords.setAttribute('content', keywords);
            }
            
            // 更新Open Graph信息
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', title);
            }
            
            const ogDescription = document.querySelector('meta[property="og:description"]');
            if (ogDescription) {
                ogDescription.setAttribute('content', description);
            }
            
        } catch (error) {
            console.error('❌ 更新页面meta信息失败:', error);
        }
    }

    /**
     * 为语言变化重新渲染工具
     */
    rerenderToolsForLanguage() {
        try {
            // 如果工具已经加载，重新渲染以更新URL链接
            const state = this.store.getState();
            if (state.tools && state.tools.length > 0) {
                // 清除现有的工具卡片
                this.clearToolCards();
                
                // 重新渲染工具
                this.renderTools();
            }
        } catch (error) {
            console.error('❌ 重新渲染工具失败:', error);
        }
    }

    /**
     * 处理全局键盘事件
     */
    handleGlobalKeyDown(e) {
        // 比较快捷键 (c)
        if (e.key === 'c' && e.ctrlKey && !e.target.matches('input, textarea')) {
            e.preventDefault();
            this.toggleCompareMode();
        }

        // ESC 键
        if (e.key === 'Escape') {
            // 关闭模态框
            const modals = document.querySelectorAll('.modal');
            if (modals.length > 0) {
                modals[modals.length - 1].remove();
            }
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        this.deviceInfo = getDeviceInfo();
        
        // 响应式布局调整
        document.body.classList.toggle('mobile', this.deviceInfo.isMobile);
        document.body.classList.toggle('tablet', this.deviceInfo.isTablet);
        document.body.classList.toggle('desktop', this.deviceInfo.isDesktop);
    }

    /**
     * 处理页面卸载前
     */
    handleBeforeUnload() {
        this.saveUserPreferences();
    }

    /**
     * 加载用户偏好
     */
    loadUserPreferences() {
        const preferences = storage.get('userPreferences', {});
        
        if (preferences.filters) {
            this.store.setState({ filters: preferences.filters }, 'LOAD_PREFERENCES');
        }
        
        if (preferences.sort) {
            this.store.setState({ sort: preferences.sort }, 'LOAD_PREFERENCES');
        }
    }

    /**
     * 保存用户偏好
     */
    saveUserPreferences() {
        const state = this.store.getState();
        const preferences = {
            filters: state.filters,
            sort: state.sort,
            timestamp: Date.now()
        };
        
        storage.set('userPreferences', preferences);
    }

    /**
     * 设置全局错误处理
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.handleError('JavaScript错误', event.error);
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.handleError('未处理的Promise拒绝', event.reason);
        });
    }

    /**
     * 错误处理
     */
    handleError(message, error) {
        console.error(`[App] ${message}:`, error);
        
        this.store.setState({
            error: {
                message,
                details: error?.message || '未知错误',
                timestamp: new Date().toISOString()
            }
        }, 'ERROR');

        eventBus.emit('app:error', { message, error });
    }

    /**
     * 销毁应用
     */
    destroy() {
        // 清理组件
        this.clearToolCards();
        
        // 清理服务
        this.toolService?.destroy();
        this.compareService?.destroy();
        
        // 清理导航管理器
        this.navigationManager?.destroy();
        
        // 清理国际化系统
        this.i18nManager?.destroy();
        this.languageSwitcher?.destroy();
        
        // 清理事件监听
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('beforeunload', this.handleBeforeUnload);
        
        // 清理事件总线
        eventBus.removeAllListeners();
        
        // 保存用户偏好
        this.saveUserPreferences();
        
        console.log('🗑️ 应用已销毁');
    }
}

export { App }; 