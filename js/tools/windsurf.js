/**
 * Windsurf AI开发环境信息
 * 下一代AI开发环境
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const windsurfTool = {
    id: 'windsurf',
    name: 'Windsurf',
    category: 'AI开发环境',
    type: TOOL_TYPES.STANDALONE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.NEW,
    
    logo: 'tool-icon tool-icon-windsurf',
    description: '下一代AI开发环境，提供完整的项目管理、智能代码分析和协作功能。让团队开发更加高效和智能。',
    features: [
        '项目管理',
        '团队协作',
        '智能分析',
        '云端同步',
        'AI助手',
        '代码审查',
        '自动化工作流',
        '集成开发'
    ],
    
    rating: 4.7,
    users: '100K+',
    updated: '2024-12-20',
    
    website: 'https://codeium.com/windsurf',
    documentation: 'https://windsurf.codeium.com/docs',
    github: null,
    changelog: 'https://windsurf.codeium.com/changelog',
    
    supported_languages: [
        'JavaScript',
        'Python',
        'TypeScript',
        'Java',
        'C#',
        'PHP',
        'Go',
        'Rust',
        'C++',
        'Ruby'
    ],
    platforms: ['Windows', 'macOS', 'Linux'],
    
    pros: [
        '优秀的团队协作',
        '强大的项目管理',
        '免费额度充足',
        '直观的用户界面',
        '快速的同步速度',
        '良好的性能',
        '活跃的更新'
    ],
    cons: [
        '相对较新',
        '功能还在完善中',
        '文档较少',
        '社区相对较小'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'Windsurf入门教程',
                url: '#tutorial-windsurf-basics',
                level: '入门'
            },
            {
                title: '团队协作最佳实践',
                url: '#tutorial-windsurf-collaboration',
                level: '中级'
            },
            {
                title: 'Windsurf高级功能',
                url: '#tutorial-windsurf-advanced',
                level: '高级'
            }
        ],
        news: [
            {
                title: 'Windsurf Beta版本发布',
                date: '2024-12-20',
                summary: '集成强大的项目管理和团队协作功能'
            }
        ],
        alternatives: ['Cursor', 'VS Code', 'GitHub Codespaces'],
        integrations: ['Git', 'GitHub', 'GitLab', 'Slack', 'Discord']
    }
}; 