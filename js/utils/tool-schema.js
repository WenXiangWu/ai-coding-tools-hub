/**
 * AI编程工具标准化数据模板
 * 
 * 这个文件定义了AI工具信息的标准化结构
 * 所有工具都必须遵循这个数据模式
 */

/**
 * 工具类型枚举
 */
export const TOOL_TYPES = {
    STANDALONE: 'standalone',  // 独立应用
    WEB: 'web',               // Web应用
    IDE: 'ide',               // IDE插件
    API: 'api'                // API服务
};

/**
 * 价格模式枚举
 */
export const PRICE_MODELS = {
    FREE: 'free',             // 完全免费
    FREEMIUM: 'freemium',     // 免费+付费
    PAID: 'paid'              // 付费
};

/**
 * 工具状态枚举
 */
export const TOOL_STATUS = {
    HOT: 'hot',               // 热门
    NEW: 'new',               // 新品
    STABLE: 'stable',         // 稳定
    POWERFUL: 'powerful',     // 强大
    LOCAL: 'local',           // 本土
    PROFESSIONAL: 'professional', // 专业
    EDUCATIONAL: 'educational'    // 教育
};

/**
 * 工具信息标准化模板
 */
export const TOOL_SCHEMA = {
    // 基础信息
    id: '',                   // 工具唯一标识符 (必需)
    name: '',                 // 工具名称 (必需)
    category: '',             // 工具分类 (必需)
    type: '',                 // 工具类型: standalone/web/ide/api (必需)
    price: '',                // 价格模式: free/freemium/paid (必需)
    status: '',               // 工具状态 (必需)
    
    // 展示信息
    logo: '',                 // 图标class (FontAwesome) (必需)
    description: '',          // 工具描述 (必需)
    features: [],             // 主要功能列表 (必需)
    
    // 评价信息
    rating: 0,                // 评分 (1-5) (必需)
    users: '',                // 用户数量 (必需)
    updated: '',              // 最后更新时间 (YYYY-MM-DD) (必需)
    
    // 链接信息
    website: '',              // 官方网站 (必需)
    documentation: '',        // 官方文档 (必需)
    github: null,             // GitHub仓库 (可选)
    
    // 技术信息
    supported_languages: [],   // 支持的编程语言 (必需)
    platforms: [],            // 支持的平台 (必需)
    
    // 评价信息
    pros: [],                 // 优点列表 (必需)
    cons: [],                 // 缺点列表 (必需)
    
    // 可选扩展信息
    extensions: {
        tutorials: [],        // 相关教程
        news: [],            // 相关新闻
        alternatives: [],    // 替代工具
        integrations: []     // 集成工具
    }
};

/**
 * 验证工具信息是否符合标准
 * @param {Object} toolData - 工具数据
 * @returns {Object} 验证结果 {isValid: boolean, errors: string[]}
 */
export function validateToolData(toolData) {
    const errors = [];
    
    // 必需字段验证
    const requiredFields = [
        'id', 'name', 'category', 'type', 'price', 'status',
        'logo', 'description', 'features', 'rating', 'users', 'updated',
        'website', 'documentation', 'supported_languages', 'platforms',
        'pros', 'cons'
    ];
    
    requiredFields.forEach(field => {
        if (!toolData[field] && toolData[field] !== 0) {
            errors.push(`缺少必需字段: ${field}`);
        }
    });
    
    // 类型验证
    if (toolData.type && !Object.values(TOOL_TYPES).includes(toolData.type)) {
        errors.push(`无效的工具类型: ${toolData.type}`);
    }
    
    if (toolData.price && !Object.values(PRICE_MODELS).includes(toolData.price)) {
        errors.push(`无效的价格模式: ${toolData.price}`);
    }
    
    if (toolData.status && !Object.values(TOOL_STATUS).includes(toolData.status)) {
        errors.push(`无效的工具状态: ${toolData.status}`);
    }
    
    // 评分验证
    if (toolData.rating && (toolData.rating < 1 || toolData.rating > 5)) {
        errors.push('评分必须在1-5之间');
    }
    
    // 数组字段验证
    const arrayFields = ['features', 'supported_languages', 'platforms', 'pros', 'cons'];
    arrayFields.forEach(field => {
        if (toolData[field] && !Array.isArray(toolData[field])) {
            errors.push(`${field} 必须是数组类型`);
        }
    });
    
    // 日期格式验证
    if (toolData.updated && !/^\d{4}-\d{2}-\d{2}$/.test(toolData.updated)) {
        errors.push('updated 字段必须是 YYYY-MM-DD 格式');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * 创建工具数据的标准化副本
 * @param {Object} toolData - 原始工具数据
 * @returns {Object} 标准化后的工具数据
 */
export function standardizeToolData(toolData) {
    const standardized = { ...TOOL_SCHEMA };
    
    // 复制提供的数据
    Object.keys(toolData).forEach(key => {
        if (standardized.hasOwnProperty(key)) {
            standardized[key] = toolData[key];
        }
    });
    
    // 确保数组字段不为null
    ['features', 'supported_languages', 'platforms', 'pros', 'cons'].forEach(field => {
        if (!standardized[field]) {
            standardized[field] = [];
        }
    });
    
    // 确保扩展信息存在
    if (!standardized.extensions) {
        standardized.extensions = {
            tutorials: [],
            news: [],
            alternatives: [],
            integrations: []
        };
    }
    
    return standardized;
}

/**
 * 获取状态图标
 * @param {string} status - 工具状态
 * @returns {string} FontAwesome图标class
 */
export function getStatusIcon(status) {
    const icons = {
        [TOOL_STATUS.HOT]: 'fire',
        [TOOL_STATUS.NEW]: 'star',
        [TOOL_STATUS.STABLE]: 'shield-alt',
        [TOOL_STATUS.POWERFUL]: 'bolt',
        [TOOL_STATUS.LOCAL]: 'home',
        [TOOL_STATUS.PROFESSIONAL]: 'crown',
        [TOOL_STATUS.EDUCATIONAL]: 'graduation-cap'
    };
    return icons[status] || 'info';
}

/**
 * 获取状态文本
 * @param {string} status - 工具状态
 * @returns {string} 状态显示文本
 */
export function getStatusText(status) {
    const texts = {
        [TOOL_STATUS.HOT]: '热门',
        [TOOL_STATUS.NEW]: '新品',
        [TOOL_STATUS.STABLE]: '稳定',
        [TOOL_STATUS.POWERFUL]: '强大',
        [TOOL_STATUS.LOCAL]: '本土',
        [TOOL_STATUS.PROFESSIONAL]: '专业',
        [TOOL_STATUS.EDUCATIONAL]: '教育'
    };
    return texts[status] || '推荐';
}

/**
 * 获取价格模式文本
 * @param {string} price - 价格模式
 * @returns {string} 价格显示文本
 */
export function getPriceText(price) {
    const texts = {
        [PRICE_MODELS.FREE]: '免费',
        [PRICE_MODELS.FREEMIUM]: '免费+付费',
        [PRICE_MODELS.PAID]: '付费'
    };
    return texts[price] || '未知';
} 