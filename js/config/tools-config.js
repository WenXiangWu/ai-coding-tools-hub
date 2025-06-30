/**
 * AI编程工具配置管理
 */

export const TOOLS_CONFIG = [
    {
        id: 'cursor',
        enabled: true,
        priority: 1,
        module: '../tools/cursor.js',
        featured: true
    },
    {
        id: 'windsurf',
        enabled: true,
        priority: 2,
        module: '../tools/windsurf.js',
        featured: true
    },
    {
        id: 'claude',
        enabled: true,
        priority: 3,
        module: '../tools/claude.js',
        featured: true
    },
    {
        id: 'copilot',
        enabled: true,
        priority: 4,
        module: '../tools/copilot.js',
        featured: true
    },
    {
        id: 'gemini',
        enabled: true,
        priority: 5,
        module: '../tools/gemini.js',
        featured: false
    },
    {
        id: 'tongyi',
        enabled: true,
        priority: 6,
        module: '../tools/tongyi.js',
        featured: false
    },
    {
        id: 'codeium',
        enabled: true,
        priority: 7,
        module: '../tools/codeium.js',
        featured: false
    }
];

export const GLOBAL_CONFIG = {
    maxToolsPerPage: 12,
    enableSearch: true,
    enableFiltering: true,
    enableComparison: true
};

export function getEnabledTools() {
    return TOOLS_CONFIG.filter(tool => tool.enabled);
}

export function getToolConfig(toolId) {
    return TOOLS_CONFIG.find(tool => tool.id === toolId) || null;
} 