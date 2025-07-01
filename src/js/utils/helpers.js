/**
 * 通用工具函数库
 * 提供应用中常用的辅助方法
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

/**
 * 节流函数
 * @param {Function} func - 要节流的函数
 * @param {number} delay - 节流间隔（毫秒）
 * @returns {Function} 节流后的函数
 */
export function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= delay) {
            lastCall = now;
            return func.apply(this, args);
        }
    };
}

/**
 * 深度克隆对象
 * @param {any} obj - 要克隆的对象
 * @returns {any} 克隆后的对象
 */
export function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (obj instanceof Date) {
        return new Date(obj.getTime());
    }

    if (obj instanceof Array) {
        return obj.map(item => deepClone(item));
    }

    if (obj instanceof Set) {
        return new Set([...obj].map(item => deepClone(item)));
    }

    if (obj instanceof Map) {
        const clonedMap = new Map();
        for (const [key, value] of obj) {
            clonedMap.set(deepClone(key), deepClone(value));
        }
        return clonedMap;
    }

    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }

    return obj;
}

/**
 * 检查是否为空值
 * @param {any} value - 要检查的值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (value instanceof Set || value instanceof Map) return value.size === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
}

/**
 * 格式化日期
 * @param {string|Date} date - 日期
 * @param {string} format - 格式模板
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '-';
    
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 计算相对时间
 * @param {string|Date} date - 日期
 * @returns {string} 相对时间字符串
 */
export function getRelativeTime(date) {
    if (!date) return '-';
    
    const now = new Date();
    const target = new Date(date);
    const diffMs = now - target;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffDays > 365) {
        return `${Math.floor(diffDays / 365)}年前`;
    } else if (diffDays > 30) {
        return `${Math.floor(diffDays / 30)}个月前`;
    } else if (diffDays > 0) {
        return `${diffDays}天前`;
    } else if (diffHours > 0) {
        return `${diffHours}小时前`;
    } else if (diffMinutes > 0) {
        return `${diffMinutes}分钟前`;
    } else {
        return '刚刚';
    }
}

/**
 * 生成唯一ID
 * @param {string} prefix - 前缀
 * @returns {string} 唯一ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 将字符串转换为短横线命名法
 * @param {string} str - 要转换的字符串
 * @returns {string} 短横线命名法字符串
 */
export function toKebabCase(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}

/**
 * 将字符串转换为驼峰命名法
 * @param {string} str - 要转换的字符串
 * @returns {string} 驼峰命名法字符串
 */
export function toCamelCase(str) {
    return str
        .replace(/[-_\s]+(.)?/g, (_, char) => char ? char.toUpperCase() : '')
        .replace(/^[A-Z]/, char => char.toLowerCase());
}

/**
 * 截断文本
 * @param {string} text - 要截断的文本
 * @param {number} maxLength - 最大长度
 * @param {string} suffix - 后缀
 * @returns {string} 截断后的文本
 */
export function truncateText(text, maxLength, suffix = '...') {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * 转义HTML字符
 * @param {string} str - 要转义的字符串
 * @returns {string} 转义后的字符串
 */
export function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * 解析URL参数
 * @param {string} url - URL字符串
 * @returns {Object} 参数对象
 */
export function parseUrlParams(url = window.location.search) {
    const params = {};
    const urlParams = new URLSearchParams(url);
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    return params;
}

/**
 * 构建URL参数字符串
 * @param {Object} params - 参数对象
 * @returns {string} URL参数字符串
 */
export function buildUrlParams(params) {
    const urlParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
        if (value != null) {
            urlParams.append(key, String(value));
        }
    }
    return urlParams.toString();
}

/**
 * 数组去重
 * @param {Array} array - 原数组
 * @param {string|Function} key - 去重依据的属性名或函数
 * @returns {Array} 去重后的数组
 */
export function uniqueArray(array, key) {
    if (!Array.isArray(array)) return [];

    if (!key) {
        return [...new Set(array)];
    }

    const seen = new Set();
    return array.filter(item => {
        const value = typeof key === 'function' ? key(item) : item[key];
        if (seen.has(value)) {
            return false;
        }
        seen.add(value);
        return true;
    });
}

/**
 * 数组分组
 * @param {Array} array - 原数组
 * @param {string|Function} key - 分组依据的属性名或函数
 * @returns {Object} 分组后的对象
 */
export function groupArray(array, key) {
    if (!Array.isArray(array)) return {};

    return array.reduce((groups, item) => {
        const groupKey = typeof key === 'function' ? key(item) : item[key];
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {});
}

/**
 * 排序数组
 * @param {Array} array - 原数组
 * @param {string|Function} key - 排序依据
 * @param {boolean} ascending - 是否升序
 * @returns {Array} 排序后的数组
 */
export function sortArray(array, key, ascending = true) {
    if (!Array.isArray(array)) return [];

    const sorted = [...array].sort((a, b) => {
        let aValue = typeof key === 'function' ? key(a) : a[key];
        let bValue = typeof key === 'function' ? key(b) : b[key];

        // 处理null/undefined
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return ascending ? 1 : -1;
        if (bValue == null) return ascending ? -1 : 1;

        // 数字比较
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            return ascending ? aValue - bValue : bValue - aValue;
        }

        // 字符串比较
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
        
        if (aValue < bValue) return ascending ? -1 : 1;
        if (aValue > bValue) return ascending ? 1 : -1;
        return 0;
    });

    return sorted;
}

/**
 * 获取嵌套对象属性值
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径 (如: 'a.b.c')
 * @param {any} defaultValue - 默认值
 * @returns {any} 属性值
 */
export function getNestedValue(obj, path, defaultValue = undefined) {
    if (!obj || typeof obj !== 'object') return defaultValue;

    const keys = path.split('.');
    let result = obj;

    for (const key of keys) {
        if (result == null || typeof result !== 'object') {
            return defaultValue;
        }
        result = result[key];
    }

    return result !== undefined ? result : defaultValue;
}

/**
 * 设置嵌套对象属性值
 * @param {Object} obj - 对象
 * @param {string} path - 属性路径
 * @param {any} value - 要设置的值
 */
export function setNestedValue(obj, path, value) {
    if (!obj || typeof obj !== 'object') return;

    const keys = path.split('.');
    const lastKey = keys.pop();
    let current = obj;

    for (const key of keys) {
        if (!(key in current) || typeof current[key] !== 'object') {
            current[key] = {};
        }
        current = current[key];
    }

    current[lastKey] = value;
}

/**
 * 延迟执行
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise} Promise对象
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 重试函数
 * @param {Function} fn - 要重试的函数
 * @param {number} maxAttempts - 最大重试次数
 * @param {number} delay - 重试间隔
 * @returns {Promise} Promise对象
 */
export async function retry(fn, maxAttempts = 3, delayMs = 1000) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt === maxAttempts) {
                throw lastError;
            }
            await delay(delayMs * attempt);
        }
    }
}

/**
 * 检查设备类型
 * @returns {Object} 设备信息
 */
export function getDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/.test(userAgent);
    const isDesktop = !isMobile && !isTablet;

    return {
        isMobile,
        isTablet,
        isDesktop,
        userAgent,
        width: window.innerWidth,
        height: window.innerHeight
    };
}

/**
 * 本地存储封装
 */
export const storage = {
    /**
     * 设置本地存储
     * @param {string} key - 键
     * @param {any} value - 值
     * @param {number} expiry - 过期时间（毫秒）
     */
    set(key, value, expiry) {
        const item = {
            value,
            timestamp: Date.now(),
            expiry: expiry ? Date.now() + expiry : null
        };
        try {
            localStorage.setItem(key, JSON.stringify(item));
        } catch (error) {
            console.warn('无法设置本地存储:', error);
        }
    },

    /**
     * 获取本地存储
     * @param {string} key - 键
     * @param {any} defaultValue - 默认值
     * @returns {any} 值
     */
    get(key, defaultValue = null) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return defaultValue;

            const item = JSON.parse(itemStr);
            
            // 检查是否过期
            if (item.expiry && Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return defaultValue;
            }

            return item.value;
        } catch (error) {
            console.warn('无法获取本地存储:', error);
            return defaultValue;
        }
    },

    /**
     * 删除本地存储
     * @param {string} key - 键
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('无法删除本地存储:', error);
        }
    },

    /**
     * 清空本地存储
     */
    clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('无法清空本地存储:', error);
        }
    }
};

/**
 * 性能监控
 */
export const performance = {
    /**
     * 测量函数执行时间
     * @param {Function} fn - 要测量的函数
     * @param {string} label - 标签
     * @returns {any} 函数返回值
     */
    async measure(fn, label = 'operation') {
        const start = performance.now();
        try {
            const result = await fn();
            const end = performance.now();
            console.log(`⏱️ ${label}: ${(end - start).toFixed(2)}ms`);
            return result;
        } catch (error) {
            const end = performance.now();
            console.error(`⏱️ ${label} (错误): ${(end - start).toFixed(2)}ms`, error);
            throw error;
        }
    },

    /**
     * 标记时间点
     * @param {string} name - 标记名称
     */
    mark(name) {
        if (window.performance && window.performance.mark) {
            window.performance.mark(name);
        }
    },

    /**
     * 测量两个时间点之间的时长
     * @param {string} name - 测量名称
     * @param {string} startMark - 开始标记
     * @param {string} endMark - 结束标记
     */
    measureBetween(name, startMark, endMark) {
        if (window.performance && window.performance.measure) {
            window.performance.measure(name, startMark, endMark);
        }
    }
}; 