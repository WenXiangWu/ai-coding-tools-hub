/**
 * 比较服务
 * 负责处理工具对比功能的业务逻辑
 */
import { eventBus } from '../core/EventBus.js';

class CompareService {
    constructor(store, toolService) {
        this.store = store;
        this.toolService = toolService;
        this.maxCompareItems = 5;
    }

    /**
     * 添加工具到比较列表
     * @param {string} toolId - 工具ID
     * @returns {boolean} 是否添加成功
     */
    addToCompare(toolId) {
        const currentState = this.store.getState();
        const selectedTools = new Set(currentState.selectedTools);

        // 检查是否已经在比较列表中
        if (selectedTools.has(toolId)) {
            return false;
        }

        // 检查是否超过最大比较数量
        if (selectedTools.size >= this.maxCompareItems) {
            eventBus.emit('compare:maxItemsReached', {
                maxItems: this.maxCompareItems
            });
            return false;
        }

        // 添加到比较列表
        selectedTools.add(toolId);
        this.store.setState({ selectedTools }, 'ADD_TO_COMPARE');

        eventBus.emit('compare:itemAdded', {
            toolId,
            totalItems: selectedTools.size
        });

        return true;
    }

    /**
     * 从比较列表中移除工具
     * @param {string} toolId - 工具ID
     * @returns {boolean} 是否移除成功
     */
    removeFromCompare(toolId) {
        const currentState = this.store.getState();
        const selectedTools = new Set(currentState.selectedTools);

        if (!selectedTools.has(toolId)) {
            return false;
        }

        selectedTools.delete(toolId);
        this.store.setState({ selectedTools }, 'REMOVE_FROM_COMPARE');

        // 如果比较列表变空，退出比较模式
        if (selectedTools.size === 0) {
            this.exitCompareMode();
        }

        eventBus.emit('compare:itemRemoved', {
            toolId,
            totalItems: selectedTools.size
        });

        return true;
    }

    /**
     * 切换工具的比较状态
     * @param {string} toolId - 工具ID
     * @returns {boolean} 当前状态
     */
    toggleCompare(toolId) {
        const currentState = this.store.getState();
        const selectedTools = currentState.selectedTools;

        if (selectedTools.has(toolId)) {
            this.removeFromCompare(toolId);
            return false;
        } else {
            this.addToCompare(toolId);
            return true;
        }
    }

    /**
     * 进入比较模式
     */
    enterCompareMode() {
        const currentState = this.store.getState();
        
        if (currentState.selectedTools.size === 0) {
            return false;
        }

        this.store.setState({ compareMode: true }, 'ENTER_COMPARE_MODE');
        eventBus.emit('compare:modeEntered');
        return true;
    }

    /**
     * 退出比较模式
     */
    exitCompareMode() {
        this.store.setState({ compareMode: false }, 'EXIT_COMPARE_MODE');
        eventBus.emit('compare:modeExited');
    }

    /**
     * 获取比较数据
     * @returns {Object} 比较数据对象
     */
    getComparisonData() {
        const currentState = this.store.getState();
        const selectedToolIds = Array.from(currentState.selectedTools);
        
        if (selectedToolIds.length === 0) {
            return null;
        }

        const tools = selectedToolIds.map(id => this.toolService.getTool(id)).filter(Boolean);
        
        return {
            tools,
            matrix: this.generateComparisonMatrix(tools)
        };
    }

    /**
     * 生成比较矩阵
     * @param {Array} tools - 工具列表
     * @returns {Object} 比较矩阵
     */
    generateComparisonMatrix(tools) {
        const fields = [
            { key: 'name', label: '工具名称' },
            { key: 'category', label: '分类' },
            { key: 'type', label: '类型' },
            { key: 'price', label: '价格模式' },
            { key: 'rating', label: '评分' },
            { key: 'features', label: '主要功能' },
            { key: 'platforms', label: '支持平台' }
        ];

        const matrix = {};
        
        fields.forEach(field => {
            matrix[field.key] = {
                label: field.label,
                values: tools.map(tool => tool[field.key])
            };
        });

        return matrix;
    }

    /**
     * 获取选中工具数量
     * @returns {number} 选中工具数量
     */
    getSelectedCount() {
        return this.store.getState().selectedTools.size;
    }

    /**
     * 检查工具是否被选中
     * @param {string} toolId - 工具ID
     * @returns {boolean} 是否被选中
     */
    isSelected(toolId) {
        return this.store.getState().selectedTools.has(toolId);
    }

    /**
     * 清空比较列表
     */
    clearCompareList() {
        this.store.setState({ 
            selectedTools: new Set(),
            compareMode: false 
        }, 'CLEAR_COMPARE_LIST');

        eventBus.emit('compare:listCleared');
    }
}

export { CompareService }; 