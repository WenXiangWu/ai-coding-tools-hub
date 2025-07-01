/**
 * 工具服务
 * 负责处理所有与工具相关的业务逻辑
 */
import { eventBus } from '../core/EventBus.js';

class ToolService {
    constructor(store) {
        this.store = store;
        this.toolsManager = null;
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5分钟缓存
        this.retryAttempts = 3;
        this.retryDelay = 1000;
    }

    /**
     * 初始化工具服务
     */
    async initialize() {
        try {
            console.log('🔄 开始初始化工具服务...');
            this.store.setState({ loading: true }, 'TOOL_SERVICE_INIT_START');

            // 动态导入工具管理器
            console.log('📦 导入工具管理器...');
            const toolsManagerModule = await import('../managers/tools-manager.js');
            this.toolsManager = toolsManagerModule.default || toolsManagerModule.toolsManager;
            
            if (!this.toolsManager) {
                throw new Error('无法导入工具管理器');
            }

            // 初始化工具管理器
            console.log('🚀 初始化工具管理器...');
            if (!this.toolsManager.isInitialized()) {
                await this.toolsManager.initialize();
            }

            // 加载工具数据
            console.log('📊 加载工具数据...');
            await this.loadTools();

            this.store.setState({ loading: false }, 'TOOL_SERVICE_INIT_COMPLETE');
            
            // 触发初始化完成事件
            const allTools = this.getAllTools();
            eventBus.emit('toolService:initialized', allTools);

            console.log('✅ 工具服务初始化完成，共加载', allTools.length, '个工具');
        } catch (error) {
            console.error('❌ 初始化工具服务失败:', error);
            this.store.setState({ 
                loading: false, 
                error: error.message 
            }, 'TOOL_SERVICE_INIT_ERROR');
            this.handleError('初始化工具服务失败', error);
            // 不要抛出错误，而是设置空数据确保应用能继续运行
            this.store.setState({ 
                tools: [],
                filteredTools: [],
                statistics: { total: 0 }
            }, 'FALLBACK_EMPTY_STATE');
        }
    }

    /**
     * 加载所有工具
     */
    async loadTools() {
        let attempt = 0;
        
        while (attempt < this.retryAttempts) {
            try {
                console.log(`📋 获取工具列表 (尝试 ${attempt + 1}/${this.retryAttempts})...`);
                
                // 确保工具管理器已初始化
                if (!this.toolsManager.isInitialized()) {
                    throw new Error('工具管理器未初始化');
                }

                const tools = this.toolsManager.getAllTools();
                console.log(`📊 从工具管理器获取到 ${tools.length} 个工具`);
                
                if (tools.length === 0) {
                    console.warn('⚠️ 工具管理器返回空列表');
                    // 尝试重新初始化工具管理器
                    await this.toolsManager.initialize();
                    const retryTools = this.toolsManager.getAllTools();
                    if (retryTools.length === 0) {
                        throw new Error('工具管理器初始化后仍无工具数据');
                    }
                    tools = retryTools;
                }

                const statistics = this.calculateStatistics(tools);

                // 直接设置状态，确保数据正确传递
                this.store.setState({ 
                    tools: tools,
                    filteredTools: tools,
                    statistics: statistics 
                }, 'LOAD_TOOLS_COMPLETE');

                // 设置缓存
                this.setCache('allTools', tools);
                
                console.log(`✅ 成功加载 ${tools.length} 个工具`);
                console.log('🔍 工具列表:', tools.map(t => ({ id: t.id, name: t.name })));
                return tools;
            } catch (error) {
                attempt++;
                console.error(`❌ 加载工具失败 (尝试 ${attempt}/${this.retryAttempts}):`, error);
                
                if (attempt >= this.retryAttempts) {
                    throw error;
                }
                
                console.warn(`⏳ 等待 ${this.retryDelay * attempt}ms 后重试...`);
                await this.delay(this.retryDelay * attempt);
            }
        }
    }

    /**
     * 重新加载工具
     */
    async reloadTools() {
        this.clearCache();
        await this.loadTools();
        eventBus.emit('toolService:reloaded');
    }

    /**
     * 获取所有工具
     * @returns {Array} 工具列表
     */
    getAllTools() {
        return this.store.getState().tools;
    }

    /**
     * 获取单个工具
     * @param {string} toolId - 工具ID
     * @returns {Object|null} 工具对象
     */
    getTool(toolId) {
        const tools = this.getAllTools();
        return tools.find(tool => tool.id === toolId) || null;
    }

    /**
     * 获取特色工具
     * @param {number} limit - 限制数量
     * @returns {Array} 特色工具列表
     */
    getFeaturedTools(limit = 4) {
        const cacheKey = `featuredTools_${limit}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        const tools = this.getAllTools();
        const featuredTools = tools
            .filter(tool => tool._config?.featured)
            .sort((a, b) => (a._config?.priority || 999) - (b._config?.priority || 999))
            .slice(0, limit);

        this.setCache(cacheKey, featuredTools);
        return featuredTools;
    }

    /**
     * 筛选工具
     * @param {Object} filters - 筛选条件
     * @returns {Array} 筛选后的工具列表
     */
    filterTools(filters = {}) {
        const cacheKey = this.generateFilterCacheKey(filters);
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        let tools = this.getAllTools();

        // 先应用搜索筛选
        if (filters.search && filters.search.trim() !== '') {
            tools = this.searchTools(filters.search.trim());
        }

        // 按类型筛选
        if (filters.type && filters.type !== 'all') {
            tools = tools.filter(tool => tool.type === filters.type);
        }

        // 按价格筛选
        if (filters.price && filters.price !== 'all') {
            tools = tools.filter(tool => tool.price === filters.price);
        }

        // 按分类筛选
        if (filters.category && filters.category !== 'all') {
            tools = tools.filter(tool => tool.category === filters.category);
        }

        // 按状态筛选
        if (filters.status) {
            tools = tools.filter(tool => tool.status === filters.status);
        }

        // 按评分筛选
        if (filters.minRating) {
            tools = tools.filter(tool => tool.rating >= filters.minRating);
        }

        // 按支持的语言筛选
        if (filters.languages && filters.languages.length > 0) {
            tools = tools.filter(tool => 
                filters.languages.some(lang => 
                    tool.supported_languages.includes(lang)
                )
            );
        }

        // 按平台筛选
        if (filters.platforms && filters.platforms.length > 0) {
            tools = tools.filter(tool => 
                filters.platforms.some(platform => 
                    tool.platforms.includes(platform)
                )
            );
        }

        this.setCache(cacheKey, tools);
        return tools;
    }

    /**
     * 搜索工具
     * @param {string} query - 搜索查询
     * @param {Object} options - 搜索选项
     * @returns {Array} 搜索结果
     */
    searchTools(query, options = {}) {
        if (!query || query.trim() === '') {
            return this.getAllTools();
        }

        const cacheKey = `search_${query}_${JSON.stringify(options)}`;
        const cached = this.getCache(cacheKey);
        if (cached) return cached;

        const searchTerm = query.toLowerCase().trim();
        const tools = this.getAllTools();
        const results = [];

        tools.forEach(tool => {
            let score = 0;
            let matches = [];

            // 名称匹配（权重最高）
            if (tool.name.toLowerCase().includes(searchTerm)) {
                score += 100;
                matches.push({ type: 'name', text: tool.name });
            }

            // 描述匹配
            if (tool.description.toLowerCase().includes(searchTerm)) {
                score += 50;
                matches.push({ type: 'description', text: tool.description });
            }

            // 功能匹配
            const featureMatches = tool.features.filter(feature => 
                feature.toLowerCase().includes(searchTerm)
            );
            if (featureMatches.length > 0) {
                score += 30 * featureMatches.length;
                matches.push(...featureMatches.map(feature => ({
                    type: 'feature',
                    text: feature
                })));
            }

            // 支持语言匹配
            const langMatches = tool.supported_languages.filter(lang => 
                lang.toLowerCase().includes(searchTerm)
            );
            if (langMatches.length > 0) {
                score += 20 * langMatches.length;
                matches.push(...langMatches.map(lang => ({
                    type: 'language',
                    text: lang
                })));
            }

            // 平台匹配
            const platformMatches = tool.platforms.filter(platform => 
                platform.toLowerCase().includes(searchTerm)
            );
            if (platformMatches.length > 0) {
                score += 15 * platformMatches.length;
                matches.push(...platformMatches.map(platform => ({
                    type: 'platform',
                    text: platform
                })));
            }

            // 分类匹配
            if (tool.category.toLowerCase().includes(searchTerm)) {
                score += 25;
                matches.push({ type: 'category', text: tool.category });
            }

            if (score > 0) {
                results.push({
                    tool,
                    score,
                    matches
                });
            }
        });

        // 按评分排序
        results.sort((a, b) => b.score - a.score);
        
        const finalResults = results.map(result => result.tool);
        this.setCache(cacheKey, finalResults);
        
        return finalResults;
    }

    /**
     * 排序工具
     * @param {Array} tools - 工具列表
     * @param {string} sortBy - 排序方式
     * @returns {Array} 排序后的工具列表
     */
    sortTools(tools, sortBy = 'popularity') {
        const sortedTools = [...tools];

        switch (sortBy) {
            case 'name':
                sortedTools.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
                break;
            case 'rating':
                sortedTools.sort((a, b) => b.rating - a.rating);
                break;
            case 'users':
                sortedTools.sort((a, b) => {
                    const usersA = this.parseUserCount(a.users);
                    const usersB = this.parseUserCount(b.users);
                    return usersB - usersA;
                });
                break;
            case 'updated':
                sortedTools.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            case 'popularity':
            default:
                sortedTools.sort((a, b) => {
                    const priorityA = a._config?.priority || 999;
                    const priorityB = b._config?.priority || 999;
                    return priorityA - priorityB;
                });
        }

        return sortedTools;
    }

    /**
     * 获取工具统计信息
     * @returns {Object} 统计信息
     */
    getStatistics() {
        return this.store.getState().statistics;
    }

    /**
     * 计算统计信息
     * @param {Array} tools - 工具列表
     * @returns {Object} 统计信息
     */
    calculateStatistics(tools) {
        const stats = {
            totalTools: tools.length,
            featuredTools: tools.filter(tool => tool._config?.featured).length,
            categories: {},
            types: {},
            priceModels: {},
            platforms: {},
            languages: {},
            averageRating: 0,
            lastUpdated: new Date().toISOString()
        };

        let totalRating = 0;
        
        tools.forEach(tool => {
            // 分类统计
            stats.categories[tool.category] = (stats.categories[tool.category] || 0) + 1;
            
            // 类型统计
            stats.types[tool.type] = (stats.types[tool.type] || 0) + 1;
            
            // 价格模式统计
            stats.priceModels[tool.price] = (stats.priceModels[tool.price] || 0) + 1;
            
            // 平台统计
            tool.platforms.forEach(platform => {
                stats.platforms[platform] = (stats.platforms[platform] || 0) + 1;
            });
            
            // 语言统计
            tool.supported_languages.forEach(lang => {
                stats.languages[lang] = (stats.languages[lang] || 0) + 1;
            });
            
            totalRating += tool.rating;
        });

        stats.averageRating = tools.length > 0 ? (totalRating / tools.length).toFixed(1) : 0;

        return stats;
    }

    /**
     * 解析用户数量字符串
     * @param {string} usersStr - 用户数量字符串
     * @returns {number} 用户数量
     */
    parseUserCount(usersStr) {
        const match = usersStr.match(/(\d+(?:\.\d+)?)\s*([kmb万千万亿]?)/i);
        if (!match) return 0;

        const num = parseFloat(match[1]);
        const unit = match[2].toLowerCase();

        const multipliers = {
            'k': 1000,
            'm': 1000000,
            'b': 1000000000,
            '千': 1000,
            '万': 10000,
            '亿': 100000000
        };

        return num * (multipliers[unit] || 1);
    }

    /**
     * 生成筛选缓存键
     * @param {Object} filters - 筛选条件
     * @returns {string} 缓存键
     */
    generateFilterCacheKey(filters) {
        return `filter_${JSON.stringify(filters)}`;
    }

    /**
     * 设置缓存
     * @param {string} key - 缓存键
     * @param {any} value - 缓存值
     */
    setCache(key, value) {
        this.cache.set(key, {
            value,
            timestamp: Date.now()
        });
    }

    /**
     * 获取缓存
     * @param {string} key - 缓存键
     * @returns {any|null} 缓存值
     */
    getCache(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        // 检查缓存是否过期
        if (Date.now() - cached.timestamp > this.cacheTimeout) {
            this.cache.delete(key);
            return null;
        }

        return cached.value;
    }

    /**
     * 清空缓存
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * 处理错误
     * @param {string} message - 错误消息
     * @param {Error} error - 错误对象
     */
    handleError(message, error) {
        console.error(`[ToolService] ${message}:`, error);
        
        this.store.setState({
            loading: false,
            error: {
                message,
                details: error.message,
                timestamp: new Date().toISOString()
            }
        }, 'TOOL_SERVICE_ERROR');

        eventBus.emit('toolService:error', { message, error });
    }

    /**
     * 延迟执行
     * @param {number} ms - 延迟毫秒数
     * @returns {Promise} Promise对象
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 销毁服务
     */
    destroy() {
        this.clearCache();
        eventBus.removeAllListeners('toolService');
        console.log('🗑️ 工具服务已销毁');
    }
}

export { ToolService }; 