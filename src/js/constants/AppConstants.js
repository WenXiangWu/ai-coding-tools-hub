/**
 * 应用常量定义
 * 统一管理应用中使用的常量
 */

// UI 相关常量
export const UI_CONSTANTS = {
    // 消息文本
    MESSAGES: {
        LOADING: '正在加载工具数据...',
        LOADING_TOOLS: '正在加载AI工具...',
        ERROR: '加载失败，请重试',
        NO_TOOLS: '暂无工具数据',
        NO_RESULTS: '未找到相关工具',
        SEARCH_PLACEHOLDER: '搜索工具或教程...',
        COMPARE_MAX_REACHED: '最多只能选择 {count} 个工具进行对比',
        COMPARE_MIN_REQUIRED: '至少选择 2 个工具才能进行对比',
        NETWORK_ERROR: '网络连接失败，请检查网络设置',
        UNKNOWN_ERROR: '发生未知错误，请刷新页面重试'
    },

    // 筛选选项
    FILTERS: {
        ALL: 'all',
        TYPE: {
            STANDALONE: 'standalone',
            WEB: 'web',
            IDE: 'ide',
            API: 'api'
        },
        PRICE: {
            FREE: 'free',
            FREEMIUM: 'freemium',
            PAID: 'paid'
        },
        STATUS: {
            HOT: 'hot',
            NEW: 'new',
            STABLE: 'stable',
            POWERFUL: 'powerful',
            LOCAL: 'local',
            PROFESSIONAL: 'professional',
            EDUCATIONAL: 'educational'
        }
    },

    // 排序选项
    SORT_OPTIONS: {
        POPULARITY: 'popularity',
        NAME: 'name',
        RATING: 'rating',
        USERS: 'users',
        UPDATED: 'updated'
    },

    // 视图模式
    VIEW_MODES: {
        GRID: 'grid',
        LIST: 'list',
        COMPARE: 'compare'
    },

    // 动画持续时间
    ANIMATION: {
        DURATION: 300,
        DELAY: 100,
        STAGGER: 50
    },

    // 分页设置
    PAGINATION: {
        TOOLS_PER_PAGE: 12,
        LOAD_MORE_COUNT: 6
    }
};

// 应用配置常量  
export const APP_CONFIG = {
    // API 相关
    API: {
        BASE_URL: '/api',
        TIMEOUT: 10000,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 1000
    },

    // 缓存设置
    CACHE: {
        TIMEOUT: 5 * 60 * 1000, // 5分钟
        MAX_SIZE: 100,
        KEYS: {
            TOOLS: 'tools',
            SEARCH: 'search',
            FILTERS: 'filters',
            STATISTICS: 'statistics'
        }
    },

    // 功能开关
    FEATURES: {
        ENABLE_SEARCH: true,
        ENABLE_COMPARISON: true,
        ENABLE_FILTERS: true,
        ENABLE_EXPORT: true,
        ENABLE_SHARE: true,
        ENABLE_FAVORITES: false,
        ENABLE_ANALYTICS: true
    },

    // 限制设置
    LIMITS: {
        MAX_COMPARE_ITEMS: 5,
        MAX_SEARCH_RESULTS: 50,
        MAX_RECENT_SEARCHES: 10,
        MAX_FAVORITES: 20
    },

    // 调试设置
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'info', // error, warn, info, debug
        SHOW_PERFORMANCE: false,
        STORE_HISTORY: true
    }
};

// 事件名称常量
export const EVENTS = {
    // 应用生命周期
    APP_INIT: 'app:init',
    APP_READY: 'app:ready',
    APP_ERROR: 'app:error',
    APP_DESTROY: 'app:destroy',

    // 工具相关
    TOOLS_LOADED: 'tools:loaded',
    TOOLS_FILTERED: 'tools:filtered',
    TOOLS_SORTED: 'tools:sorted',
    TOOL_SELECTED: 'tool:selected',
    TOOL_DESELECTED: 'tool:deselected',

    // 搜索相关
    SEARCH_START: 'search:start',
    SEARCH_COMPLETE: 'search:complete',
    SEARCH_CLEAR: 'search:clear',

    // 比较相关
    COMPARE_ADD: 'compare:add',
    COMPARE_REMOVE: 'compare:remove',
    COMPARE_MODE_ENTER: 'compare:modeEnter',
    COMPARE_MODE_EXIT: 'compare:modeExit',
    COMPARE_CLEAR: 'compare:clear',

    // UI 相关
    UI_LOADING_START: 'ui:loadingStart',
    UI_LOADING_END: 'ui:loadingEnd',
    UI_ERROR_SHOW: 'ui:errorShow',
    UI_ERROR_HIDE: 'ui:errorHide',
    UI_MODAL_OPEN: 'ui:modalOpen',
    UI_MODAL_CLOSE: 'ui:modalClose'
};

// 错误类型常量
export const ERROR_TYPES = {
    NETWORK_ERROR: 'network_error',
    PARSE_ERROR: 'parse_error',
    VALIDATION_ERROR: 'validation_error',
    NOT_FOUND_ERROR: 'not_found_error',
    PERMISSION_ERROR: 'permission_error',
    TIMEOUT_ERROR: 'timeout_error',
    UNKNOWN_ERROR: 'unknown_error'
};

// CSS 类名常量
export const CSS_CLASSES = {
    // 状态类
    LOADING: 'loading',
    ERROR: 'error',
    ACTIVE: 'active',
    SELECTED: 'selected',
    DISABLED: 'disabled',
    HIDDEN: 'hidden',
    VISIBLE: 'visible',

    // 组件类
    TOOL_CARD: 'tool-card',
    TOOL_GRID: 'tool-grid',
    FILTER_PANEL: 'filter-panel',
    SEARCH_BOX: 'search-box',
    COMPARE_TABLE: 'compare-table',
    MODAL: 'modal',
    DROPDOWN: 'dropdown',

    // 修饰符类
    PRIMARY: 'primary',
    SECONDARY: 'secondary',
    SUCCESS: 'success',
    WARNING: 'warning',
    DANGER: 'danger',
    INFO: 'info'
};

// 本地存储键名常量
export const STORAGE_KEYS = {
    USER_PREFERENCES: 'ai_tools_user_preferences',
    RECENT_SEARCHES: 'ai_tools_recent_searches',
    FAVORITES: 'ai_tools_favorites',
    COMPARE_HISTORY: 'ai_tools_compare_history',
    VIEW_MODE: 'ai_tools_view_mode',
    FILTER_STATE: 'ai_tools_filter_state'
};

// 工具状态文本映射
export const STATUS_TEXT_MAP = {
    [UI_CONSTANTS.FILTERS.STATUS.HOT]: '🔥 热门',
    [UI_CONSTANTS.FILTERS.STATUS.NEW]: '✨ 新品',
    [UI_CONSTANTS.FILTERS.STATUS.STABLE]: '🛡️ 稳定',
    [UI_CONSTANTS.FILTERS.STATUS.POWERFUL]: '⚡ 强大',
    [UI_CONSTANTS.FILTERS.STATUS.LOCAL]: '🏠 本土',
    [UI_CONSTANTS.FILTERS.STATUS.PROFESSIONAL]: '👑 专业',
    [UI_CONSTANTS.FILTERS.STATUS.EDUCATIONAL]: '🎓 教育'
};

// 工具类型文本映射
export const TYPE_TEXT_MAP = {
    [UI_CONSTANTS.FILTERS.TYPE.STANDALONE]: '独立应用',
    [UI_CONSTANTS.FILTERS.TYPE.WEB]: 'Web应用',
    [UI_CONSTANTS.FILTERS.TYPE.IDE]: 'IDE插件',
    [UI_CONSTANTS.FILTERS.TYPE.API]: 'API服务'
};

// 价格模式文本映射
export const PRICE_TEXT_MAP = {
    [UI_CONSTANTS.FILTERS.PRICE.FREE]: '免费',
    [UI_CONSTANTS.FILTERS.PRICE.FREEMIUM]: '免费+付费',
    [UI_CONSTANTS.FILTERS.PRICE.PAID]: '付费'
};

// 排序选项文本映射
export const SORT_TEXT_MAP = {
    [UI_CONSTANTS.SORT_OPTIONS.POPULARITY]: '热门程度',
    [UI_CONSTANTS.SORT_OPTIONS.NAME]: '名称排序',
    [UI_CONSTANTS.SORT_OPTIONS.RATING]: '评分排序',
    [UI_CONSTANTS.SORT_OPTIONS.USERS]: '用户数量',
    [UI_CONSTANTS.SORT_OPTIONS.UPDATED]: '更新时间'
};

// 响应式断点
export const BREAKPOINTS = {
    MOBILE: 768,
    TABLET: 1024,
    DESKTOP: 1200,
    LARGE_DESKTOP: 1440
};

// 键盘快捷键
export const KEYBOARD_SHORTCUTS = {
    SEARCH: '/',
    COMPARE: 'c',
    ESCAPE: 'Escape',
    ENTER: 'Enter',
    SPACE: ' ',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight'
}; 