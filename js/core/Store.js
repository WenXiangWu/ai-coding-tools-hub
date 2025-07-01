/**
 * 应用状态管理器
 * 提供集中化的状态管理和响应式更新
 */
class Store {
    constructor() {
        this.state = this.getInitialState();
        this.listeners = new Set();
        this.history = [];
        this.maxHistorySize = 50;
        this.debug = true;
    }

    /**
     * 获取初始状态
     * @returns {Object} 初始状态对象
     */
    getInitialState() {
        return {
            // 工具相关状态
            tools: [],
            filteredTools: [],
            selectedTools: new Set(),
            
            // 筛选和排序状态
            filters: {
                type: 'all',
                price: 'all',
                category: 'all'
            },
            sort: 'popularity',
            searchQuery: '',
            
            // UI状态
            loading: true,
            error: null,
            compareMode: false,
            currentView: 'grid',
            
            // 模态框状态
            modal: {
                open: false,
                type: null,
                data: null
            },
            
            // 统计信息
            statistics: {
                totalTools: 0,
                featuredTools: 0,
                categories: {},
                lastUpdated: null
            }
        };
    }

    /**
     * 获取当前状态
     * @returns {Object} 当前状态的副本
     */
    getState() {
        return this.deepClone(this.state);
    }

    /**
     * 深度克隆状态对象（正确处理Set、Map等特殊类型）
     * @param {any} obj - 要克隆的对象
     * @returns {any} 克隆后的对象
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Set) {
            return new Set(Array.from(obj).map(item => this.deepClone(item)));
        }
        
        if (obj instanceof Map) {
            const clonedMap = new Map();
            obj.forEach((value, key) => {
                clonedMap.set(this.deepClone(key), this.deepClone(value));
            });
            return clonedMap;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (Array.isArray(obj)) {
            return obj.map(item => this.deepClone(item));
        }
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        
        return cloned;
    }

    /**
     * 更新状态
     * @param {Object} updates - 状态更新对象
     * @param {string} action - 触发更新的动作名称（用于调试）
     */
    setState(updates, action = 'UNKNOWN') {
        const prevState = this.getState();
        
        // 深度合并状态
        this.state = this.deepMerge(this.state, updates);
        
        // 保存历史记录
        if (this.debug) {
            this.saveToHistory(prevState, updates, action);
        }
        
        // 通知所有监听者
        this.notifyListeners(this.state, updates, prevState, action);
        
        // 调试日志
        if (this.debug) {
            console.log(`[Store] ${action}:`, updates);
        }
    }

    /**
     * 深度合并对象
     * @param {Object} target - 目标对象
     * @param {Object} source - 源对象
     * @returns {Object} 合并后的对象
     */
    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source.hasOwnProperty(key)) {
                if (source[key] instanceof Set) {
                    result[key] = new Set(source[key]);
                } else if (Array.isArray(source[key])) {
                    result[key] = [...source[key]];
                } else if (typeof source[key] === 'object' && source[key] !== null) {
                    result[key] = this.deepMerge(result[key] || {}, source[key]);
                } else {
                    result[key] = source[key];
                }
            }
        }
        
        return result;
    }

    /**
     * 保存状态历史
     * @param {Object} prevState - 之前的状态
     * @param {Object} updates - 更新内容
     * @param {string} action - 动作名称
     */
    saveToHistory(prevState, updates, action) {
        this.history.push({
            timestamp: Date.now(),
            action,
            prevState,
            updates,
            newState: this.getState()
        });
        
        // 保持历史记录在合理范围内
        if (this.history.length > this.maxHistorySize) {
            this.history.shift();
        }
    }

    /**
     * 订阅状态变化
     * @param {Function} listener - 监听函数
     * @returns {Function} 取消订阅函数
     */
    subscribe(listener) {
        this.listeners.add(listener);
        
        // 返回取消订阅函数
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * 通知所有监听者
     * @param {Object} newState - 新状态
     * @param {Object} updates - 更新内容
     * @param {Object} prevState - 之前的状态
     * @param {string} action - 动作名称
     */
    notifyListeners(newState, updates, prevState, action) {
        this.listeners.forEach(listener => {
            try {
                listener(newState, updates, prevState, action);
            } catch (error) {
                console.error('[Store] 监听器执行错误:', error);
            }
        });
    }

    /**
     * 获取状态历史
     * @returns {Array} 状态历史数组
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * 清空历史记录
     */
    clearHistory() {
        this.history = [];
    }

    /**
     * 重置状态到初始状态
     */
    reset() {
        this.setState(this.getInitialState(), 'RESET');
    }

    /**
     * 批量更新状态（避免多次通知）
     * @param {Function} updater - 更新函数
     * @param {string} action - 动作名称
     */
    batch(updater, action = 'BATCH') {
        const prevState = this.getState();
        const allUpdates = {};
        
        // 临时禁用通知
        const originalNotify = this.notifyListeners;
        this.notifyListeners = () => {};
        
        // 创建临时setState函数
        const batchSetState = (partialUpdates) => {
            Object.assign(allUpdates, partialUpdates);
            this.state = this.deepMerge(this.state, partialUpdates);
        };
        
        // 执行更新
        updater(batchSetState);
        
        // 恢复通知并发送一次性通知
        this.notifyListeners = originalNotify;
        this.notifyListeners(this.state, allUpdates, prevState, action);
        
        // 保存历史记录
        if (this.debug) {
            this.saveToHistory(prevState, allUpdates, action);
        }
    }

    /**
     * 创建状态选择器
     * @param {Function} selector - 选择器函数
     * @returns {Function} 订阅函数
     */
    createSelector(selector) {
        let lastResult = selector(this.state);
        
        return (listener) => {
            return this.subscribe((newState) => {
                const newResult = selector(newState);
                if (newResult !== lastResult) {
                    lastResult = newResult;
                    listener(newResult);
                }
            });
        };
    }

    /**
     * 启用/禁用调试模式
     * @param {boolean} enabled - 是否启用调试
     */
    setDebug(enabled) {
        this.debug = enabled;
    }
}

export { Store }; 