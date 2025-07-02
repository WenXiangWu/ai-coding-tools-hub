/**
 * 导航配置管理工具
 * 提供动态管理导航项和开发工具的功能
 */

import { 
    MAIN_NAVIGATION, 
    DEVTOOLS_DROPDOWN,
    getEnabledNavigation,
    getEnabledDevtools
} from '../config/navigation-config.js';

export class NavigationConfigManager {
    constructor() {
        this.customItems = new Map(); // 存储自定义添加的项目
        this.disabledItems = new Set(); // 存储被禁用的项目ID
        this.listeners = new Set(); // 配置变化监听器
    }

    /**
     * 添加导航项
     * @param {Object} item - 导航项配置
     * @param {boolean} persist - 是否持久化保存
     */
    addNavigationItem(item, persist = false) {
        // 验证必要字段
        if (!item.id || !item.name) {
            throw new Error('导航项必须包含 id 和 name 字段');
        }

        // 检查是否已存在
        const existingItem = this.getNavigationItem(item.id);
        if (existingItem) {
            throw new Error(`导航项 ${item.id} 已存在`);
        }

        // 设置默认值
        const navigationItem = {
            type: 'internal',
            order: 1000,
            enabled: true,
            mobile: {
                priority: 'medium',
                showInCollapsed: true
            },
            ...item
        };

        this.customItems.set(item.id, navigationItem);

        if (persist) {
            this.saveToStorage();
        }

        this.notifyListeners('item-added', navigationItem);
        console.log('✅ 导航项已添加:', navigationItem);

        return navigationItem;
    }

    /**
     * 添加开发工具项
     * @param {Object} tool - 工具配置
     * @param {boolean} persist - 是否持久化保存
     */
    addDevtoolItem(tool, persist = false) {
        // 验证必要字段
        if (!tool.id || !tool.name || !tool.href) {
            throw new Error('开发工具必须包含 id、name 和 href 字段');
        }

        // 检查是否已存在
        const existingTool = this.getDevtoolItem(tool.id);
        if (existingTool) {
            throw new Error(`开发工具 ${tool.id} 已存在`);
        }

        // 设置默认值
        const devtoolItem = {
            type: 'external',
            order: 1000,
            enabled: true,
            category: 'utility',
            icon: 'fas fa-tool',
            ...tool
        };

        this.customItems.set(tool.id, devtoolItem);

        if (persist) {
            this.saveToStorage();
        }

        this.notifyListeners('devtool-added', devtoolItem);
        console.log('✅ 开发工具已添加:', devtoolItem);

        return devtoolItem;
    }

    /**
     * 移除导航项
     * @param {string} id - 项目ID
     * @param {boolean} persist - 是否持久化保存
     */
    removeItem(id, persist = false) {
        // 如果是自定义项目，直接删除
        if (this.customItems.has(id)) {
            const item = this.customItems.get(id);
            this.customItems.delete(id);
            
            if (persist) {
                this.saveToStorage();
            }
            
            this.notifyListeners('item-removed', { id, item });
            console.log('✅ 自定义项目已移除:', id);
            return true;
        }

        // 如果是内置项目，标记为禁用
        const builtinItem = this.getBuiltinItem(id);
        if (builtinItem) {
            this.disabledItems.add(id);
            
            if (persist) {
                this.saveToStorage();
            }
            
            this.notifyListeners('item-disabled', { id, item: builtinItem });
            console.log('✅ 内置项目已禁用:', id);
            return true;
        }

        console.warn('⚠️ 项目不存在:', id);
        return false;
    }

    /**
     * 启用被禁用的内置项目
     * @param {string} id - 项目ID
     * @param {boolean} persist - 是否持久化保存
     */
    enableItem(id, persist = false) {
        if (this.disabledItems.has(id)) {
            this.disabledItems.delete(id);
            
            if (persist) {
                this.saveToStorage();
            }
            
            const item = this.getBuiltinItem(id);
            this.notifyListeners('item-enabled', { id, item });
            console.log('✅ 项目已启用:', id);
            return true;
        }

        console.warn('⚠️ 项目未被禁用或不存在:', id);
        return false;
    }

    /**
     * 更新导航项
     * @param {string} id - 项目ID
     * @param {Object} updates - 更新内容
     * @param {boolean} persist - 是否持久化保存
     */
    updateItem(id, updates, persist = false) {
        // 更新自定义项目
        if (this.customItems.has(id)) {
            const currentItem = this.customItems.get(id);
            const updatedItem = { ...currentItem, ...updates };
            this.customItems.set(id, updatedItem);
            
            if (persist) {
                this.saveToStorage();
            }
            
            this.notifyListeners('item-updated', { id, item: updatedItem, updates });
            console.log('✅ 自定义项目已更新:', id);
            return updatedItem;
        }

        // 内置项目不能直接更新，需要创建覆盖版本
        const builtinItem = this.getBuiltinItem(id);
        if (builtinItem && !this.disabledItems.has(id)) {
            const overrideItem = { ...builtinItem, ...updates, id: `${id}-override` };
            this.disabledItems.add(id); // 禁用原始项目
            this.customItems.set(overrideItem.id, overrideItem);
            
            if (persist) {
                this.saveToStorage();
            }
            
            this.notifyListeners('item-overridden', { 
                originalId: id, 
                newId: overrideItem.id, 
                item: overrideItem 
            });
            console.log('✅ 内置项目已覆盖更新:', id, '->', overrideItem.id);
            return overrideItem;
        }

        console.warn('⚠️ 无法更新项目:', id);
        return null;
    }

    /**
     * 获取所有启用的导航项（包括自定义项目）
     */
    getAllNavigationItems() {
        const builtinItems = MAIN_NAVIGATION.filter(item => 
            item.enabled && !this.disabledItems.has(item.id)
        );

        const customNavItems = Array.from(this.customItems.values()).filter(item =>
            item.enabled && !item.href // 导航项通常没有 href，而是内部链接
        );

        return [...builtinItems, ...customNavItems]
            .sort((a, b) => a.order - b.order);
    }

    /**
     * 获取所有启用的开发工具（包括自定义工具）
     */
    getAllDevtools() {
        const builtinTools = DEVTOOLS_DROPDOWN.filter(tool => 
            tool.enabled && !this.disabledItems.has(tool.id)
        );

        const customTools = Array.from(this.customItems.values()).filter(tool =>
            tool.enabled && tool.href // 开发工具通常有 href
        );

        return [...builtinTools, ...customTools]
            .sort((a, b) => a.order - b.order);
    }

    /**
     * 根据分类获取开发工具
     * @param {string} category - 工具分类
     */
    getDevtoolsByCategory(category) {
        const allTools = this.getAllDevtools();
        return category ? allTools.filter(tool => tool.category === category) : allTools;
    }

    /**
     * 获取指定导航项
     * @param {string} id - 项目ID
     */
    getNavigationItem(id) {
        // 优先查找自定义项目
        if (this.customItems.has(id)) {
            return this.customItems.get(id);
        }

        // 查找内置项目（未被禁用的）
        const builtinItem = this.getBuiltinItem(id);
        return (builtinItem && !this.disabledItems.has(id)) ? builtinItem : null;
    }

    /**
     * 获取指定开发工具
     * @param {string} id - 工具ID
     */
    getDevtoolItem(id) {
        return this.getNavigationItem(id); // 统一处理
    }

    /**
     * 获取内置项目
     * @param {string} id - 项目ID
     */
    getBuiltinItem(id) {
        return MAIN_NAVIGATION.find(item => item.id === id) ||
               DEVTOOLS_DROPDOWN.find(item => item.id === id);
    }

    /**
     * 重置为默认配置
     */
    resetToDefault() {
        this.customItems.clear();
        this.disabledItems.clear();
        this.saveToStorage();
        this.notifyListeners('config-reset');
        console.log('✅ 配置已重置为默认');
    }

    /**
     * 批量导入配置
     * @param {Object} config - 配置对象
     */
    importConfig(config) {
        if (config.customItems) {
            this.customItems = new Map(config.customItems);
        }

        if (config.disabledItems) {
            this.disabledItems = new Set(config.disabledItems);
        }

        this.notifyListeners('config-imported', config);
        console.log('✅ 配置已导入');
    }

    /**
     * 导出当前配置
     */
    exportConfig() {
        return {
            customItems: Array.from(this.customItems.entries()),
            disabledItems: Array.from(this.disabledItems),
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    /**
     * 从本地存储加载配置
     */
    loadFromStorage() {
        try {
            const stored = localStorage.getItem('navigation-config');
            if (stored) {
                const config = JSON.parse(stored);
                this.importConfig(config);
                console.log('✅ 从本地存储加载配置完成');
            }
        } catch (error) {
            console.error('❌ 加载配置失败:', error);
        }
    }

    /**
     * 保存配置到本地存储
     */
    saveToStorage() {
        try {
            const config = this.exportConfig();
            localStorage.setItem('navigation-config', JSON.stringify(config));
            console.log('✅ 配置已保存到本地存储');
        } catch (error) {
            console.error('❌ 保存配置失败:', error);
        }
    }

    /**
     * 添加配置变化监听器
     * @param {Function} listener - 监听器函数
     */
    addListener(listener) {
        this.listeners.add(listener);
    }

    /**
     * 移除配置变化监听器
     * @param {Function} listener - 监听器函数
     */
    removeListener(listener) {
        this.listeners.delete(listener);
    }

    /**
     * 通知所有监听器
     * @param {string} event - 事件类型
     * @param {*} data - 事件数据
     */
    notifyListeners(event, data) {
        this.listeners.forEach(listener => {
            try {
                listener(event, data);
            } catch (error) {
                console.error('❌ 监听器执行失败:', error);
            }
        });
    }

    /**
     * 获取配置统计信息
     */
    getStats() {
        return {
            customItems: this.customItems.size,
            disabledItems: this.disabledItems.size,
            totalNavigationItems: this.getAllNavigationItems().length,
            totalDevtools: this.getAllDevtools().length,
            builtinNavigation: MAIN_NAVIGATION.length,
            builtinDevtools: DEVTOOLS_DROPDOWN.length
        };
    }

    /**
     * 验证配置完整性
     */
    validateConfig() {
        const errors = [];
        const warnings = [];

        // 检查自定义项目
        for (const [id, item] of this.customItems) {
            if (!item.name) {
                errors.push(`自定义项目 ${id} 缺少 name 字段`);
            }
            
            if (item.type === 'external' && !item.href) {
                errors.push(`外部链接项目 ${id} 缺少 href 字段`);
            }

            if (!item.mobile) {
                warnings.push(`项目 ${id} 缺少移动端配置`);
            }
        }

        // 检查禁用的项目是否存在
        for (const id of this.disabledItems) {
            if (!this.getBuiltinItem(id)) {
                warnings.push(`禁用的项目 ${id} 在内置配置中不存在`);
            }
        }

        return { errors, warnings, valid: errors.length === 0 };
    }
}

// 创建全局配置管理器实例
export const navigationConfigManager = new NavigationConfigManager();

// 在页面加载时自动加载保存的配置
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', () => {
        navigationConfigManager.loadFromStorage();
    });
} 