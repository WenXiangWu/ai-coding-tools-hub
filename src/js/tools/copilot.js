/**
 * GitHub Copilot AI编程助手信息
 * GitHub官方AI编程助手
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const copilotTool = {
    id: 'copilot',
    name: 'GitHub Copilot',
    category: 'AI编程助手',
    type: TOOL_TYPES.IDE,
    price: PRICE_MODELS.PAID,
    status: TOOL_STATUS.STABLE,
    
    logo: 'tool-icon tool-icon-copilot',
    description: 'GitHub与OpenAI合作打造的AI编程助手，基于数十亿行代码训练，提供精准的代码建议和自动补全功能。',
    features: [
        '自动补全',
        '代码建议',
        '多IDE支持',
        '企业级',
        'Chat功能',
        '代码解释',
        '单元测试生成',
        '代码重构'
    ],
    
    rating: 4.6,
    users: '1M+',
    updated: '2024-12-23',
    
    website: 'https://github.com/features/copilot',
    documentation: 'https://docs.github.com/copilot',
    github: 'https://github.com/github/copilot-docs',
    changelog: 'https://github.blog/changelog/label/copilot/',
    
    supported_languages: [
        'JavaScript',
        'Python',
        'TypeScript',
        'Ruby',
        'Go',
        'C#',
        'C++',
        'Java',
        'PHP',
        'Swift',
        'Kotlin',
        'Rust'
    ],
    platforms: ['VS Code', 'Visual Studio', 'Neovim', 'JetBrains IDEs'],
    
    pros: [
        '成熟稳定',
        '广泛IDE支持',
        '企业级功能',
        '高质量代码建议',
        '快速响应',
        'GitHub生态集成',
        '持续更新'
    ],
    cons: [
        '需要付费',
        '依赖GitHub生态',
        '需要网络连接',
        '代码质量有时不稳定'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'GitHub Copilot快速入门',
                url: '#tutorial-copilot-basics',
                level: '入门'
            },
            {
                title: 'Copilot Chat使用指南',
                url: '#tutorial-copilot-chat',
                level: '中级'
            },
            {
                title: '企业级Copilot部署',
                url: '#tutorial-copilot-enterprise',
                level: '高级'
            }
        ],
        news: [
            {
                title: 'Copilot Chat功能全面升级',
                date: '2024-12-23',
                summary: '支持更自然的对话交互，新增代码审查建议'
            }
        ],
        alternatives: ['Cursor', 'Tabnine', 'Codeium'],
        integrations: ['GitHub', 'VS Code', 'JetBrains', 'Visual Studio']
    }
}; 