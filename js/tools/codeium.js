/**
 * Codeium AI编程助手信息
 * 免费的AI代码补全工具
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const codeiumTool = {
    id: 'codeium',
    name: 'Codeium',
    category: 'AI编程助手',
    type: TOOL_TYPES.IDE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.EDUCATIONAL,
    
    logo: 'tool-icon tool-icon-codeium',
    description: '强大的免费AI编程助手，支持70+编程语言，40+IDE集成，为开发者提供智能代码补全和生成服务。',
    features: [
        '免费使用',
        '70+语言支持',
        '40+IDE集成',
        '智能补全',
        '代码生成',
        'Chat功能',
        '企业版本',
        '本地部署'
    ],
    
    rating: 4.4,
    users: '400K+',
    updated: '2024-12-20',
    
    website: 'https://codeium.com',
    documentation: 'https://codeium.com/docs',
    github: 'https://github.com/Exafunction/codeium',
    
    supported_languages: [
        'JavaScript',
        'Python',
        'TypeScript',
        'Java',
        'C++',
        'Go',
        'Rust',
        'C#',
        'PHP',
        'Ruby',
        'Swift',
        'Kotlin',
        '等70+种语言'
    ],
    platforms: ['VS Code', 'JetBrains', 'Vim', 'Neovim', 'Emacs', 'Sublime Text'],
    
    pros: [
        '完全免费',
        '广泛语言支持',
        '多IDE集成',
        '响应速度快',
        '隐私保护',
        '企业级选项',
        '活跃开发'
    ],
    cons: [
        '功能相对基础',
        '高级功能有限',
        '社区相对较小',
        '文档不够详细'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'Codeium入门指南',
                url: '#tutorial-codeium-basics',
                level: '入门'
            },
            {
                title: 'IDE集成配置',
                url: '#tutorial-codeium-integration',
                level: '中级'
            },
            {
                title: '企业版部署',
                url: '#tutorial-codeium-enterprise',
                level: '高级'
            }
        ],
        news: [
            {
                title: 'Codeium Chat功能上线',
                date: '2024-12-20',
                summary: '新增对话式编程功能，支持自然语言交互'
            }
        ],
        alternatives: ['GitHub Copilot', 'Tabnine', 'Cursor'],
        integrations: ['VS Code', 'JetBrains', 'Vim', 'Sublime Text']
    }
}; 