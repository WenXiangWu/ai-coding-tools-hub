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
            console.log('🚀 开始初始化AI工具应用...');
            
            // 设置全局错误处理
            this.setupErrorHandling();
            
            // 初始化国际化系统（优先初始化）
            await this.initializeI18n();
            
            // 🔑 关键修复：先初始化UI，确保DOM元素可用
            this.initializeUI();
            
            // 初始化语言切换器
            this.initializeLanguageSwitcher();
            
            // 初始化导航管理器
            await this.initializeNavigation();
            
            // 然后设置事件监听，这样事件处理器中可以安全访问DOM元素
            this.setupEventListeners();
            
            // 最后初始化服务，触发事件
            await this.initializeServices();
            
            // 加载用户偏好
            this.loadUserPreferences();
            
            // 标记为已初始化
            this.initialized = true;
            
            // 触发初始化完成事件
            eventBus.emit('app:initialized');
            
            console.log('✅ AI工具应用初始化完成');
            
        } catch (error) {
            this.handleError('应用初始化失败', error);
            throw error;
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
                this.languageSwitcher = new LanguageSwitcher(container);
                console.log('✅ 语言切换器初始化完成');
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
        // 状态变化监听
        this.store.subscribe((newState, updates, prevState, action) => {
            this.handleStateChange(newState, updates, prevState, action);
        });

        // 服务初始化事件
        eventBus.on('toolService:initialized', (tools) => {
            console.log('📡 App收到toolService:initialized事件，工具数量:', tools?.length || 0);
            console.log('🔍 事件接收时机检查:', {
                appInitialized: this.initialized,
                hasToolService: !!this.toolService,
                hasElements: !!this.elements,
                hasContainer: !!this.elements?.toolsContainer
            });
            
            try {
                this.handleToolServiceInitialized(tools);
            } catch (error) {
                console.error('❌ 处理toolService:initialized事件失败:', error);
                // 延迟重试
                setTimeout(() => {
                    console.log('🔄 延迟重试处理工具初始化事件...');
                    try {
                        this.handleToolServiceInitialized(tools);
                    } catch (retryError) {
                        console.error('❌ 延迟重试仍然失败:', retryError);
                    }
                }, 100);
            }
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

        // 设置筛选控件
        this.setupFilterControls();
        
        // 设置排序选择器
        this.setupSortSelect();
        
        // 设置比较按钮
        this.setupCompareButton();
        
        console.log('✅ UI初始化完成');
        
        // UI初始化完成，工具数据将在ToolService初始化完成后自动渲染
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
        console.log(`🔄 状态变化 [${action}]:`, Object.keys(updates));
        
        // 更新加载状态
        if ('loading' in updates) {
            this.updateLoadingState(newState.loading);
        }

        // 更新错误状态
        if ('error' in updates) {
            this.updateErrorState(newState.error);
        }

        // 更新工具列表
        if ('filteredTools' in updates) {
            console.log(`🎨 检测到filteredTools更新，数量: ${newState.filteredTools.length}`);
            this.renderTools();
        }

        // 如果tools更新了但filteredTools没有，主动应用筛选
        if ('tools' in updates && !('filteredTools' in updates)) {
            console.log(`📋 检测到tools更新，主动应用筛选，数量: ${newState.tools.length}`);
            this.applyFilters();
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
     * 应用筛选和排序
     */
    applyFilters() {
        const state = this.store.getState();
        
        // 优先使用store中的工具数据
        let tools = state.tools;
        
        // 如果store中没有数据，尝试从toolService获取并保存到store
        if (!tools || tools.length === 0) {
            if (this.toolService) {
                tools = this.toolService.getAllTools();
                console.log('🔄 从ToolService获取工具数据:', tools.length);
                
                // 如果成功获取到数据，保存到store
                if (tools && tools.length > 0) {
                    this.store.setState({ tools }, 'TOOLS_SYNC');
                }
            } else {
                console.log('⚠️ applyFilters - ToolService尚未初始化且store中无数据');
                return;
            }
        }
        
        console.log('🔍 applyFilters - 开始筛选工具:', tools?.length || 0);
        
        // 如果仍然没有工具数据，设置空状态
        if (!tools || tools.length === 0) {
            console.log('⚠️ applyFilters - 没有工具数据');
            this.store.setState({ filteredTools: [] }, 'APPLY_FILTERS_EMPTY');
            this.updateToolsCount(0);
            return;
        }
        
        // 应用筛选和排序
        let filteredTools = tools;
        
        if (this.toolService) {
            // 应用筛选（不包含搜索）
            filteredTools = this.toolService.filterTools(state.filters);

            // 应用排序
            filteredTools = this.toolService.sortTools(filteredTools, state.sort);
        }

        console.log('✅ applyFilters - 筛选结果:', filteredTools.length);
        
        this.store.setState({ filteredTools }, 'APPLY_FILTERS');
        
        // 更新工具数量显示
        this.updateToolsCount(filteredTools.length);
    }

    /**
     * 渲染工具列表
     */
    renderTools() {
        try {
            const state = this.store.getState();
            const tools = state.filteredTools;

            console.log('🎨 renderTools开始 - 状态检查:', {
                hasState: !!state,
                toolsArray: !!tools,
                toolsLength: tools?.length || 0,
                hasElements: !!this.elements,
                hasContainer: !!this.elements?.toolsContainer,
                containerInDOM: !!document.getElementById('toolsContainer')
            });

            // 检查DOM元素是否可用
            if (!this.elements || !this.elements.toolsContainer) {
                console.warn('⚠️ renderTools: DOM元素不可用，尝试重新获取...');
                
                // 尝试直接从DOM获取元素
                const container = document.getElementById('toolsContainer');
                if (container) {
                    console.log('✅ 从DOM直接获取到容器元素，重新初始化UI...');
                    this.initializeUI();
                    
                    // 验证是否成功
                    if (!this.elements || !this.elements.toolsContainer) {
                        console.error('❌ UI重新初始化失败，无法渲染工具');
                        return;
                    }
                } else {
                    console.error('❌ DOM容器元素不存在，无法渲染工具');
                    return;
                }
            }

            // 清空现有组件
            console.log('🧹 清空现有工具卡片...');
            this.clearToolCards();

            // 检查是否有工具
            if (!tools || tools.length === 0) {
                console.log('📋 没有工具数据，渲染空状态');
                this.renderEmptyState();
                this.updateToolsCount(0);
                return;
            }

            // 渲染工具卡片
            console.log(`🎨 开始渲染 ${tools.length} 个工具卡片`);
            let successCount = 0;
            let errorCount = 0;
            
            tools.forEach((tool, index) => {
                try {
                    console.log(`🔧 渲染第 ${index + 1}/${tools.length} 个工具: ${tool?.name || 'unnamed'}`);
                    this.renderToolCard(tool);
                    successCount++;
                } catch (error) {
                    console.error(`❌ 渲染第 ${index + 1} 个工具失败:`, error);
                    errorCount++;
                }
            });

            // 更新计数显示
            this.updateToolsCount(tools.length);
            
            console.log(`✅ 工具渲染完成 - 成功: ${successCount}, 失败: ${errorCount}`);
            console.log(`📊 DOM状态 - 容器子元素数: ${this.elements.toolsContainer.children.length}`);
            
        } catch (error) {
            console.error('❌ renderTools执行失败:', error);
            console.error('错误堆栈:', error.stack);
            
            // 显示错误信息
            if (this.elements.toolsContainer) {
                this.elements.toolsContainer.innerHTML = `
                    <div class="error-state">
                        <h3>⚠️ 渲染错误</h3>
                        <p>工具列表渲染失败: ${error.message}</p>
                        <button onclick="window.debug?.forceRender()" class="btn btn-primary">重试</button>
                    </div>
                `;
            }
        }
    }

    /**
     * 渲染单个工具卡片
     */
    renderToolCard(tool) {
        try {
            const state = this.store.getState();
            
            // 验证必要数据
            if (!tool) {
                console.error('❌ renderToolCard: tool为空');
                return;
            }
            
            if (!tool.id) {
                console.error('❌ renderToolCard: tool.id缺失', tool);
                return;
            }
            
            if (!this.elements.toolsContainer) {
                console.error('❌ renderToolCard: toolsContainer元素不存在');
                return;
            }

            const isSelected = state.selectedTools.has(tool.id);
            console.log(`🔧 渲染工具卡片: ${tool.name} (ID: ${tool.id}, 选中: ${isSelected})`);
            console.log('🔍 工具数据详情:', {
                id: tool.id,
                name: tool.name,
                description: tool.description?.substring(0, 50) + '...',
                type: tool.type,
                price: tool.price,
                rating: tool.rating
            });

            // 临时使用简化卡片进行测试
            if (window.debug && window.debug.useSimpleCards) {
                this.renderSimpleToolCard(tool);
                return;
            }

            const toolCard = new ToolCard({
                tool,
                isSelected,
                onSelect: this.handleToolSelect.bind(this),
                onViewDetails: this.handleToolDetails.bind(this),
                showCompareButton: APP_CONFIG.FEATURES.ENABLE_COMPARISON
            });

            toolCard.mount(this.elements.toolsContainer);
            this.components.toolCards.set(tool.id, toolCard);
            
            console.log(`✅ 工具卡片渲染成功: ${tool.name}`);
            
        } catch (error) {
            console.error(`❌ 渲染工具卡片失败 (${tool?.name || 'unknown'}):`, error);
            console.error('工具数据:', tool);
            console.error('错误堆栈:', error.stack);
            
            // 回退到简化卡片
            this.renderSimpleToolCard(tool, error);
        }
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
     * 处理工具服务初始化完成
     */
    handleToolServiceInitialized(tools) {
        console.log('🎉 开始处理工具服务初始化完成事件，工具数量:', tools?.length || 0);
        
        // 验证输入数据
        if (!Array.isArray(tools)) {
            console.error('❌ 收到的工具数据不是数组:', typeof tools, tools);
            return;
        }
        
        if (tools.length === 0) {
            console.warn('⚠️ 收到的工具数据为空数组');
        }
        
        try {
            // 确保工具数据正确同步到store中
            console.log('📊 同步工具数据到Store...');
            this.store.setState({ 
                tools: tools,
                filteredTools: tools, // 强制同步filteredTools
                loading: false,
                error: null 
            }, 'TOOLS_LOADED_AND_FILTERED');
            
            console.log('✅ 工具数据已同步到Store');
            
            // 检查DOM元素是否准备就绪
            const elementsReady = this.elements && this.elements.toolsContainer;
            console.log('🔍 DOM元素检查:', {
                hasElements: !!this.elements,
                hasContainer: !!this.elements?.toolsContainer,
                containerInDOM: !!document.getElementById('toolsContainer')
            });
            
            if (!elementsReady) {
                console.warn('⚠️ DOM元素尚未准备就绪，缓存数据并等待...');
                // 缓存工具数据，等待DOM准备好
                this._pendingTools = tools;
                
                // 尝试重新初始化UI元素
                this.retryUIInitialization(tools);
                return;
            }
            
            // 更新UI显示的工具数量
            this.updateToolsCount(tools.length);
            
            // 应用初始筛选并渲染
            console.log('🎨 应用筛选并渲染工具...');
            this.applyFilters();
            
            console.log('✅ 工具数据处理完成，filteredTools数量:', tools.length);
            
        } catch (error) {
            console.error('❌ 处理工具服务初始化事件时出错:', error);
            console.error('错误堆栈:', error.stack);
            
            // 设置错误状态
            this.store.setState({
                loading: false,
                error: { message: '工具数据同步失败: ' + error.message }
            }, 'TOOL_SYNC_ERROR');
        }
    }

    /**
     * 重试UI初始化（当DOM元素不可用时）
     */
    retryUIInitialization(tools, attempt = 1, maxAttempts = 5) {
        console.log(`🔄 重试UI初始化 (尝试 ${attempt}/${maxAttempts})...`);
        
        if (attempt > maxAttempts) {
            console.error('❌ UI初始化重试失败，已达到最大尝试次数');
            return;
        }
        
        // 重新检查DOM
        const container = document.getElementById('toolsContainer');
        if (container) {
            console.log('✅ DOM容器已找到，重新初始化UI...');
            
            // 重新初始化UI元素
            this.initializeUI();
            
            // 检查是否成功
            if (this.elements && this.elements.toolsContainer) {
                console.log('✅ UI重新初始化成功，处理缓存的工具数据...');
                this.updateToolsCount(tools.length);
                this.applyFilters();
                return;
            }
        }
        
        // 继续等待和重试
        const delay = 100 * attempt; // 递增延迟
        setTimeout(() => {
            this.retryUIInitialization(tools, attempt + 1, maxAttempts);
        }, delay);
    }

    /**
     * 处理工具选择
     */
    handleToolSelect(toolId, tool) {
        return this.compareService.toggleCompare(toolId);
    }

    /**
     * 处理工具详情
     */
    handleToolDetails(eventData) {
        const { toolId, tool } = eventData;
        
        // 跳转到独立的工具详情页面
        console.log('跳转到工具详情页面:', tool);
        
        // 构建详情页面URL
        const detailUrl = `src/pages/tool.html?id=${encodeURIComponent(toolId)}`;
        
        // 跳转到详情页面
        window.location.href = detailUrl;
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
            
            // 翻译页面中的所有元素
            this.i18nManager.translatePage();
            
            // 更新页面标题和meta信息
            this.updatePageMeta();
            
            // 重新渲染工具卡片（如果需要）
            this.rerenderToolsForLanguage();
            
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