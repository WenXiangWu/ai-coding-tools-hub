/**
 * 事件总线
 * 提供组件间的解耦通信机制
 */
class EventBus {
    constructor() {
        this.events = new Map();
        this.maxListeners = 50;
        this.debug = false;
    }

    /**
     * 监听事件
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @param {Object} options - 选项
     * @returns {Function} 取消监听函数
     */
    on(event, callback, options = {}) {
        if (typeof callback !== 'function') {
            throw new Error('事件回调必须是函数');
        }

        if (!this.events.has(event)) {
            this.events.set(event, []);
        }

        const listeners = this.events.get(event);
        
        // 检查监听器数量限制
        if (listeners.length >= this.maxListeners) {
            console.warn(`[EventBus] 事件 "${event}" 的监听器数量已达到上限 (${this.maxListeners})`);
        }

        const listener = {
            callback,
            once: options.once || false,
            priority: options.priority || 0,
            context: options.context || null,
            id: this.generateId()
        };

        listeners.push(listener);
        
        // 按优先级排序
        listeners.sort((a, b) => b.priority - a.priority);

        if (this.debug) {
            console.log(`[EventBus] 添加监听器: ${event}`, listener);
        }

        // 返回取消监听函数
        return () => this.off(event, listener.id);
    }

    /**
     * 监听事件一次
     * @param {string} event - 事件名称
     * @param {Function} callback - 回调函数
     * @param {Object} options - 选项
     * @returns {Function} 取消监听函数
     */
    once(event, callback, options = {}) {
        return this.on(event, callback, { ...options, once: true });
    }

    /**
     * 取消监听事件
     * @param {string} event - 事件名称
     * @param {string|Function} listenerOrId - 监听器ID或回调函数
     */
    off(event, listenerOrId) {
        if (!this.events.has(event)) {
            return;
        }

        const listeners = this.events.get(event);
        
        if (typeof listenerOrId === 'string') {
            // 通过ID移除
            const index = listeners.findIndex(l => l.id === listenerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
                if (this.debug) {
                    console.log(`[EventBus] 移除监听器: ${event} (ID: ${listenerOrId})`);
                }
            }
        } else if (typeof listenerOrId === 'function') {
            // 通过回调函数移除
            const index = listeners.findIndex(l => l.callback === listenerOrId);
            if (index !== -1) {
                listeners.splice(index, 1);
                if (this.debug) {
                    console.log(`[EventBus] 移除监听器: ${event}`, listenerOrId);
                }
            }
        }

        // 如果没有监听器了，删除事件
        if (listeners.length === 0) {
            this.events.delete(event);
        }
    }

    /**
     * 移除所有监听器
     * @param {string} event - 事件名称（可选）
     */
    removeAllListeners(event) {
        if (event) {
            this.events.delete(event);
            if (this.debug) {
                console.log(`[EventBus] 移除所有监听器: ${event}`);
            }
        } else {
            this.events.clear();
            if (this.debug) {
                console.log('[EventBus] 移除所有监听器');
            }
        }
    }

    /**
     * 触发事件
     * @param {string} event - 事件名称
     * @param {...any} args - 传递给监听器的参数
     * @returns {boolean} 是否有监听器处理了事件
     */
    emit(event, ...args) {
        if (!this.events.has(event)) {
            if (this.debug) {
                console.log(`[EventBus] 没有监听器处理事件: ${event}`);
            }
            return false;
        }

        const listeners = [...this.events.get(event)]; // 复制数组避免在迭代中修改
        let handled = false;

        if (this.debug) {
            console.log(`[EventBus] 触发事件: ${event}`, args);
        }

        for (const listener of listeners) {
            try {
                // 调用监听器
                if (listener.context) {
                    listener.callback.call(listener.context, ...args);
                } else {
                    listener.callback(...args);
                }

                handled = true;

                // 如果是一次性监听器，移除它
                if (listener.once) {
                    this.off(event, listener.id);
                }
            } catch (error) {
                console.error(`[EventBus] 事件监听器执行错误 (${event}):`, error);
            }
        }

        return handled;
    }

    /**
     * 异步触发事件
     * @param {string} event - 事件名称
     * @param {...any} args - 传递给监听器的参数
     * @returns {Promise<boolean>} 是否有监听器处理了事件
     */
    async emitAsync(event, ...args) {
        if (!this.events.has(event)) {
            return false;
        }

        const listeners = [...this.events.get(event)];
        let handled = false;

        if (this.debug) {
            console.log(`[EventBus] 异步触发事件: ${event}`, args);
        }

        for (const listener of listeners) {
            try {
                let result;
                if (listener.context) {
                    result = listener.callback.call(listener.context, ...args);
                } else {
                    result = listener.callback(...args);
                }

                // 如果返回Promise，等待它完成
                if (result instanceof Promise) {
                    await result;
                }

                handled = true;

                // 如果是一次性监听器，移除它
                if (listener.once) {
                    this.off(event, listener.id);
                }
            } catch (error) {
                console.error(`[EventBus] 异步事件监听器执行错误 (${event}):`, error);
            }
        }

        return handled;
    }

    /**
     * 获取事件的监听器数量
     * @param {string} event - 事件名称
     * @returns {number} 监听器数量
     */
    listenerCount(event) {
        return this.events.has(event) ? this.events.get(event).length : 0;
    }

    /**
     * 获取所有事件名称
     * @returns {Array<string>} 事件名称数组
     */
    eventNames() {
        return Array.from(this.events.keys());
    }

    /**
     * 获取事件的所有监听器
     * @param {string} event - 事件名称
     * @returns {Array} 监听器数组
     */
    listeners(event) {
        return this.events.has(event) ? [...this.events.get(event)] : [];
    }

    /**
     * 设置最大监听器数量
     * @param {number} max - 最大数量
     */
    setMaxListeners(max) {
        this.maxListeners = max;
    }

    /**
     * 启用/禁用调试模式
     * @param {boolean} enabled - 是否启用调试
     */
    setDebug(enabled) {
        this.debug = enabled;
    }

    /**
     * 生成唯一ID
     * @returns {string} 唯一ID
     */
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    /**
     * 创建命名空间事件总线
     * @param {string} namespace - 命名空间
     * @returns {Object} 命名空间事件总线
     */
    namespace(namespace) {
        return {
            on: (event, callback, options) => this.on(`${namespace}:${event}`, callback, options),
            once: (event, callback, options) => this.once(`${namespace}:${event}`, callback, options),
            off: (event, listenerOrId) => this.off(`${namespace}:${event}`, listenerOrId),
            emit: (event, ...args) => this.emit(`${namespace}:${event}`, ...args),
            emitAsync: (event, ...args) => this.emitAsync(`${namespace}:${event}`, ...args)
        };
    }
}

// 创建全局事件总线实例
const eventBus = new EventBus();

export { EventBus, eventBus }; 