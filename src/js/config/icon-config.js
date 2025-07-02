/**
 * 工具图标配置管理
 * 统一管理所有工具的图标路径
 */

/**
 * 获取图标基础路径（根据当前页面位置动态计算）
 */
function getIconBasePath() {
    const currentPath = window.location.pathname.replace(/\\/g, '/'); // 统一使用正斜杠
    
    // 如果是详情页面（在 src/pages/ 目录下）
    if (currentPath.includes('/src/pages/')) {
        return '../../design/icon/';
    }
    
    // 如果是根目录页面
    return './design/icon/';
}

// 工具图标映射表（文件名）
const TOOL_ICON_FILES = {
    cursor: 'cursor.svg',
    windsurf: 'windsurf.svg',
    claude: 'claude-color.svg',
    copilot: 'githubcopilot.svg',
    gemini: 'gemini-color.svg',
    tongyi: 'tongyi.png',
    codeium: 'cursor.png' // 使用cursor作为默认图标，可以后续添加codeium专用图标
};

// 动态生成完整路径的工具图标映射表
export const TOOL_ICONS = new Proxy(TOOL_ICON_FILES, {
    get(target, prop) {
        if (prop in target) {
            return getIconBasePath() + target[prop];
        }
        return getIconBasePath() + 'cursor.png'; // 默认图标
    }
});

/**
 * 获取工具图标路径
 * @param {string} toolId - 工具ID
 * @returns {string} 图标路径
 */
export function getToolIcon(toolId) {
    const iconPath = TOOL_ICONS[toolId]; // Proxy会自动处理默认值和路径
    
    // 调试信息
    if (window.debug && window.debug.logIconPaths) {
        console.log(`🖼️ 获取图标路径: ${toolId} -> ${iconPath}`);
    }
    
    return iconPath;
}

/**
 * 设置工具图标（设置文件名，路径会自动计算）
 * @param {string} toolId - 工具ID
 * @param {string} iconFileName - 图标文件名
 */
export function setToolIcon(toolId, iconFileName) {
    TOOL_ICON_FILES[toolId] = iconFileName;
}

/**
 * 获取所有可用的图标映射
 * @returns {Object} 图标映射对象
 */
export function getAllIconMappings() {
    const result = {};
    for (const toolId in TOOL_ICON_FILES) {
        result[toolId] = TOOL_ICONS[toolId];
    }
    return result;
} 