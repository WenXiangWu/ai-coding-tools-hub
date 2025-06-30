/**
 * AI编程工具管理器
 * 负责动态加载、管理和操作所有AI工具
 */

import { TOOLS_CONFIG, GLOBAL_CONFIG, getEnabledTools } from '../config/tools-config.js';
import { validateToolData, standardizeToolData } from '../utils/tool-schema.js';

class ToolsManager {
    constructor() {
        this.tools = new Map();
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
        this.initialized = false;
    }

    /**
     * 初始化工具管理器
     */
    async initialize() {
        if (this.initialized) {
            return;
        }

        console.log('🚀 初始化AI工具管理器...');
        
        try {
            await this.loadAllTools();
            this.initialized = true;
            console.log(`✅ 工具管理器初始化完成，加载了 ${this.tools.size} 个工具`);
        } catch (error) {
            console.error('❌ 工具管理器初始化失败:', error);
            throw error;
        }
    }

    /**
     * 加载所有启用的工具
     */
    async loadAllTools() {
        const enabledConfigs = getEnabledTools();
        const loadPromises = enabledConfigs.map(config => this.loadTool(config.id));
        
        const results = await Promise.allSettled(loadPromises);
        
        // 记录加载结果
        results.forEach((result, index) => {
            const config = enabledConfigs[index];
            if (result.status === 'rejected') {
                console.error(`❌ 加载工具失败: ${config.id}`, result.reason);
            } else {
                console.log(`✅ 工具加载成功: ${config.id}`);
            }
        });
    }

    /**
     * 加载单个工具
     * @param {string} toolId - 工具ID
     */
    async loadTool(toolId) {
        // 避免重复加载
        if (this.loadingPromises.has(toolId)) {
            return this.loadingPromises.get(toolId);
        }

        const config = TOOLS_CONFIG.find(c => c.id === toolId);
        if (!config || !config.enabled) {
            throw new Error(`工具配置不存在或未启用: ${toolId}`);
        }

        // 创建加载Promise
        const loadPromise = this._loadToolModule(config);
        this.loadingPromises.set(toolId, loadPromise);

        try {
            const toolData = await loadPromise;
            this.tools.set(toolId, toolData);
            return toolData;
        } catch (error) {
            this.loadingPromises.delete(toolId);
            throw error;
        }
    }

    /**
     * 内部方法：加载工具模块
     * @param {Object} config - 工具配置
     */
    async _loadToolModule(config) {
        try {
            // 动态导入模块
            const module = await import(config.module);
            
            // 获取工具数据（根据命名约定）
            const toolVariableName = `${config.id}Tool`;
            const toolData = module[toolVariableName];
            
            if (!toolData) {
                throw new Error(`模块中未找到工具数据: ${toolVariableName}`);
            }

            // 验证工具数据
            const validation = validateToolData(toolData);
            if (!validation.isValid) {
                console.warn(`⚠️ 工具数据验证警告 (${config.id}):`, validation.errors);
            }

            // 标准化工具数据
            const standardizedData = standardizeToolData(toolData);
            
            // 添加配置信息
            standardizedData._config = config;
            standardizedData._loadTime = new Date();

            this.loadedModules.set(config.id, module);
            
            return standardizedData;
        } catch (error) {
            throw new Error(`加载工具模块失败 (${config.id}): ${error.message}`);
        }
    }

    /**
     * 获取工具数据
     * @param {string} toolId - 工具ID
     * @returns {Object|null} 工具数据
     */
    getTool(toolId) {
        return this.tools.get(toolId) || null;
    }

    /**
     * 获取所有工具数据
     * @returns {Array} 工具数据数组
     */
    getAllTools() {
        return Array.from(this.tools.values());
    }

    /**
     * 根据条件筛选工具
     * @param {Object} filters - 筛选条件
     * @returns {Array} 筛选后的工具数组
     */
    filterTools(filters = {}) {
        let tools = this.getAllTools();

        // 按分类筛选
        if (filters.category) {
            tools = tools.filter(tool => tool.category === filters.category);
        }

        // 按类型筛选
        if (filters.type) {
            tools = tools.filter(tool => tool.type === filters.type);
        }

        // 按价格模式筛选
        if (filters.price) {
            tools = tools.filter(tool => tool.price === filters.price);
        }

        // 按状态筛选
        if (filters.status) {
            tools = tools.filter(tool => tool.status === filters.status);
        }

        // 按评分筛选
        if (filters.minRating) {
            tools = tools.filter(tool => tool.rating >= filters.minRating);
        }

        // 按关键词搜索
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            tools = tools.filter(tool => 
                tool.name.toLowerCase().includes(searchTerm) ||
                tool.description.toLowerCase().includes(searchTerm) ||
                tool.features.some(feature => feature.toLowerCase().includes(searchTerm))
            );
        }

        return tools;
    }

    /**
     * 搜索工具
     * @param {string} query - 搜索查询
     * @returns {Array} 搜索结果
     */
    searchTools(query) {
        if (!query || query.trim() === '') {
            return this.getAllTools();
        }

        return this.filterTools({ search: query.trim() });
    }

    /**
     * 获取工具统计信息
     * @returns {Object} 统计信息
     */
    getStatistics() {
        const tools = this.getAllTools();
        
        return {
            total: tools.length,
            byCategory: this._groupBy(tools, 'category'),
            byType: this._groupBy(tools, 'type'),
            byPrice: this._groupBy(tools, 'price'),
            byStatus: this._groupBy(tools, 'status'),
            averageRating: tools.reduce((sum, tool) => sum + tool.rating, 0) / tools.length,
            totalUsers: tools.reduce((sum, tool) => {
                const users = tool.users.replace(/[^\d]/g, '');
                return sum + (parseInt(users) || 0);
            }, 0)
        };
    }

    /**
     * 内部方法：按字段分组
     * @param {Array} array - 数组
     * @param {string} key - 分组字段
     * @returns {Object} 分组结果
     */
    _groupBy(array, key) {
        return array.reduce((groups, item) => {
            const value = item[key];
            groups[value] = (groups[value] || 0) + 1;
            return groups;
        }, {});
    }

    /**
     * 重新加载工具
     * @param {string} toolId - 工具ID
     */
    async reloadTool(toolId) {
        // 清除缓存
        this.tools.delete(toolId);
        this.loadedModules.delete(toolId);
        this.loadingPromises.delete(toolId);

        // 重新加载
        return await this.loadTool(toolId);
    }

    /**
     * 获取推荐工具
     * @param {number} limit - 限制数量
     * @returns {Array} 推荐工具列表
     */
    getFeaturedTools(limit = 4) {
        const tools = this.getAllTools();
        const featured = tools.filter(tool => tool._config?.featured);
        
        // 按优先级排序
        featured.sort((a, b) => (a._config?.priority || 999) - (b._config?.priority || 999));
        
        return limit ? featured.slice(0, limit) : featured;
    }

    /**
     * 检查是否已初始化
     * @returns {boolean} 初始化状态
     */
    isInitialized() {
        return this.initialized;
    }

    /**
     * 获取加载状态
     * @returns {Object} 加载状态信息
     */
    getLoadingStatus() {
        return {
            initialized: this.initialized,
            toolsLoaded: this.tools.size,
            totalTools: getEnabledTools().length,
            isLoading: this.loadingPromises.size > 0
        };
    }
}

// 创建全局实例
export const toolsManager = new ToolsManager();

// 默认导出
export default toolsManager; 