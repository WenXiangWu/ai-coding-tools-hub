/**
 * 工具详情页导航配置
 * 定义导航结构和默认配置
 */

/**
 * 默认导航结构
 * 每个工具可以覆盖这个结构
 */
export const DEFAULT_NAVIGATION_STRUCTURE = {
    tabs: [
        {
            id: "introduction",
            title: "前言",
            icon: "fas fa-info-circle",
            content: null,
            children: []
        },
        {
            id: "tutorials",
            title: "教程",
            icon: "fas fa-book",
            content: null,
            children: [
                {
                    id: "learning_path",
                    title: "学习路线",
                    icon: "fas fa-route",
                    content: null,
                    children: []
                },
                {
                    id: "basic_tutorials",
                    title: "入门教程",
                    icon: "fas fa-graduation-cap",
                    content: null,
                    children: []
                },
                {
                    id: "advanced_tutorials",
                    title: "进阶教程",
                    icon: "fas fa-laptop-code",
                    content: null,
                    children: []
                },
                {
                    id: "projects",
                    title: "实战项目",
                    icon: "fas fa-project-diagram",
                    content: null,
                    children: []
                },
                {
                    id: "faq",
                    title: "常见问题",
                    icon: "fas fa-question-circle",
                    content: null,
                    children: []
                }
            ]
        },
        {
            id: "best_practices",
            title: "最佳实践",
            icon: "fas fa-check-circle",
            content: null,
            children: [
                {
                    id: "official_practices",
                    title: "官方最佳实践",
                    icon: "fas fa-certificate",
                    content: null,
                    children: []
                },
                {
                    id: "user_experiences",
                    title: "使用经验",
                    icon: "fas fa-lightbulb",
                    content: null,
                    children: []
                },
                {
                    id: "team_practices",
                    title: "团队实践",
                    icon: "fas fa-users",
                    content: null,
                    children: []
                }
            ]
        },
        {
            id: "links",
            title: "相关链接",
            icon: "fas fa-link",
            content: null,
            children: [
                {
                    id: "website",
                    title: "官方网站",
                    icon: "fas fa-globe",
                    url: null,
                    external: true
                },
                {
                    id: "documentation",
                    title: "官方文档",
                    icon: "fas fa-book",
                    url: null,
                    external: true
                },
                {
                    id: "github",
                    title: "GitHub",
                    icon: "fab fa-github",
                    url: null,
                    external: true
                },
                {
                    id: "changelog",
                    title: "更新日志",
                    icon: "fas fa-history",
                    url: null,
                    external: true
                }
            ]
        }
    ],
    welcome: {
        title: "工具名称",
        subtitle: "简短描述",
        description: "详细介绍",
        heroImage: null,
        features: [
            {
                title: "特性1",
                description: "特性1描述",
                icon: "fas fa-star"
            },
            {
                title: "特性2",
                description: "特性2描述",
                icon: "fas fa-bolt"
            },
            {
                title: "特性3",
                description: "特性3描述",
                icon: "fas fa-magic"
            }
        ]
    }
};

/**
 * 导航配置选项
 */
export const NAVIGATION_OPTIONS = {
    animation: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out'
    },
    expandedByDefault: true,
    showIcons: true,
    showDescriptions: true,
    mobileBreakpoint: 768
};

/**
 * 获取默认导航结构的深拷贝
 * @returns {Object} 默认导航结构的副本
 */
export function getDefaultNavigationStructure() {
    return JSON.parse(JSON.stringify(DEFAULT_NAVIGATION_STRUCTURE));
}

/**
 * 合并自定义配置与默认配置
 * @param {Object} customConfig - 自定义配置
 * @returns {Object} 合并后的配置
 */
export function mergeWithDefaultConfig(customConfig) {
    if (!customConfig) return getDefaultNavigationStructure();
    
    const defaultConfig = getDefaultNavigationStructure();
    
    // 深度合并配置
    return {
        tabs: customConfig.tabs || defaultConfig.tabs,
        welcome: {
            ...defaultConfig.welcome,
            ...customConfig.welcome
        }
    };
}

/**
 * 验证导航配置是否有效
 * @param {Object} config - 导航配置
 * @returns {boolean} 配置是否有效
 */
export function validateNavigationConfig(config) {
    if (!config || !config.tabs || !Array.isArray(config.tabs)) {
        console.error('导航配置无效: 缺少tabs数组');
        return false;
    }
    
    // 验证每个tab是否有必要的属性
    for (const tab of config.tabs) {
        if (!tab.id || !tab.title) {
            console.error('导航配置无效: tab缺少id或title', tab);
            return false;
        }
        
        // 验证子项
        if (tab.children && Array.isArray(tab.children)) {
            for (const child of tab.children) {
                if (!child.id || !child.title) {
                    console.error('导航配置无效: 子项缺少id或title', child);
                    return false;
                }
            }
        }
    }
    
    return true;
} 