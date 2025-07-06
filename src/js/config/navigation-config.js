/**
 * 导航配置文件
 * 统一管理主导航和工具下拉菜单配置
 */

/**
 * 主导航配置
 */
export const MAIN_NAVIGATION = [
    {
        id: 'tools',
        name: '工具总览',
        href: '#tools',
        icon: 'fas fa-th-large',
        type: 'internal',
        order: 1,
        enabled: true,
        description: '查看所有AI编程工具',
        mobile: {
            priority: 'high', // high, medium, low
            showInCollapsed: true
        }
    },
    {
        id: 'compare',
        name: '工具对比',
        href: '#compare',
        icon: 'fas fa-balance-scale',
        type: 'internal',
        order: 2,
        enabled: true,
        description: '对比不同AI工具的功能特性',
        mobile: {
            priority: 'high',
            showInCollapsed: true
        }
    },
    {
        id: 'tutorials',
        name: '学习中心',
        href: '#tutorials',
        icon: 'fas fa-graduation-cap',
        type: 'internal',
        order: 3,
        enabled: true,
        description: 'AI工具学习教程和指南',
        mobile: {
            priority: 'medium',
            showInCollapsed: true
        }
    },
    {
        id: 'updates',
        name: '更新动态',
        href: '#updates',
        icon: 'fas fa-clock',
        type: 'internal',
        order: 4,
        enabled: true,
        description: '最新的工具更新和功能介绍',
        mobile: {
            priority: 'medium',
            showInCollapsed: false
        }
    },
    {
        id: 'devtools',
        name: '开发小工具',
        icon: 'fas fa-tools',
        type: 'dropdown',
        order: 5,
        enabled: true,
        description: '实用的开发辅助工具',
        mobile: {
            priority: 'low',
            showInCollapsed: false
        },
        children: 'DEVTOOLS_DROPDOWN' // 引用下面的配置
    }
];

/**
 * 开发小工具下拉菜单配置
 */
export const DEVTOOLS_DROPDOWN = [
    {
        id: 'json-parser',
        name: 'JSON解析',
        href: 'devtools/json.html',
        icon: 'fas fa-code',
        type: 'external',
        order: 1,
        enabled: true,
        description: 'JSON格式化和验证工具',
        category: 'format'
    },
    {
        id: 'text-diff',
        name: '文本对比',
        href: 'devtools/diff.html',
        icon: 'fas fa-not-equal',
        type: 'external',
        order: 2,
        enabled: true,
        description: '比较两段文本的差异',
        category: 'compare'
    },
    {
        id: 'cron-expression',
        name: 'Cron表达式',
        href: 'devtools/cron.html',
        icon: 'fas fa-clock',
        type: 'external',
        order: 3,
        enabled: true,
        description: 'Cron定时任务表达式生成器',
        category: 'utility'
    },
    {
        id: 'timestamp-converter',
        name: '时间戳转换',
        href: 'devtools/timestamp.html',
        icon: 'fas fa-calendar-alt',
        type: 'external',
        order: 4,
        enabled: true,
        description: '时间戳与日期格式互转',
        category: 'utility'
    },
    {
        id: 'qrcode-generator',
        name: '二维码生成',
        href: 'devtools/qrcode.html',
        icon: 'fas fa-qrcode',
        type: 'external',
        order: 5,
        enabled: true,
        description: '生成各种类型的二维码',
        category: 'generator'
    },
    {
        id: 'regex-tool',
        name: '正则表达式工具',
        href: 'devtools/regex.html',
        icon: 'fas fa-search',
        type: 'external',
        order: 6,
        enabled: true,
        description: '正则表达式测试和生成工具',
        category: 'utility'
    }
];

/**
 * 搜索框配置
 */
export const SEARCH_CONFIG = {
    enabled: false,  // 禁用搜索功能
    placeholder: '搜索工具或教程...',
    icon: 'fas fa-search',
    mobile: {
        priority: 'high',
        showInCollapsed: true,
        fullWidth: true
    }
};

/**
 * 移动端配置
 */
export const MOBILE_CONFIG = {
    breakpoint: 768, // 移动端断点
    menuIcon: 'fas fa-bars',
    closeIcon: 'fas fa-times',
    collapseThreshold: 'medium', // 折叠优先级阈值：high, medium, low
    showCategoryLabels: true, // 是否显示分类标签
    enableSearch: true, // 是否启用搜索功能
    maxItemsBeforeCollapse: 4, // 展开状态下最多显示的项目数
    animation: {
        enabled: true,
        duration: 300,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
};

/**
 * 主题配置（可选）
 */
export const THEME_CONFIG = {
    enabled: true,
    position: 'header-right', // header-right, header-left, mobile-menu
    mobile: {
        showInMenu: true,
        priority: 'low'
    }
};

/**
 * 获取启用的主导航项
 */
export function getEnabledNavigation() {
    return MAIN_NAVIGATION
        .filter(item => item.enabled)
        .sort((a, b) => a.order - b.order);
}

/**
 * 获取启用的开发工具
 */
export function getEnabledDevtools() {
    return DEVTOOLS_DROPDOWN
        .filter(item => item.enabled)
        .sort((a, b) => a.order - b.order);
}

/**
 * 根据优先级获取移动端显示项目
 * @param {string} threshold - 优先级阈值
 */
export function getMobileNavigationItems(threshold = 'medium') {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const thresholdValue = priorityOrder[threshold] || 2;
    
    return MAIN_NAVIGATION
        .filter(item => 
            item.enabled && 
            item.mobile.showInCollapsed &&
            priorityOrder[item.mobile.priority] >= thresholdValue
        )
        .sort((a, b) => a.order - b.order);
}

/**
 * 根据分类获取开发工具
 * @param {string} category - 工具分类
 */
export function getDevtoolsByCategory(category = null) {
    const tools = getEnabledDevtools();
    if (!category) return tools;
    
    return tools.filter(tool => tool.category === category);
}

/**
 * 获取导航项目配置
 * @param {string} id - 导航项ID
 */
export function getNavigationItem(id) {
    return MAIN_NAVIGATION.find(item => item.id === id);
}

/**
 * 获取开发工具配置
 * @param {string} id - 工具ID
 */
export function getDevtoolItem(id) {
    return DEVTOOLS_DROPDOWN.find(item => item.id === id);
} 