/**
 * 通义灵码AI编程助手信息
 * 阿里云的本土化AI编程工具
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const tongyiTool = {
    id: 'tongyi',
    name: '通义灵码',
    category: 'AI编程助手',
    type: TOOL_TYPES.IDE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.LOCAL,
    
    logo: 'fas fa-microchip',
    description: '阿里云推出的智能编程助手，专为中国开发者打造，支持中文交互，深度理解中文编程需求和习惯。',
    features: [
        '中文交互',
        '本土优化',
        '代码补全',
        '智能问答',
        'IDE集成',
        '团队协作',
        '代码审查',
        '文档生成'
    ],
    
    rating: 4.3,
    users: '300K+',
    updated: '2024-12-21',
    
    website: 'https://tongyi.aliyun.com/lingma',
    documentation: 'https://help.aliyun.com/product/2357968.html',
    github: null,
    
    supported_languages: [
        'Java',
        'Python',
        'JavaScript',
        'TypeScript',
        'C++',
        'Go',
        'PHP',
        'C#',
        'Kotlin',
        'Swift'
    ],
    platforms: ['VS Code', 'IntelliJ IDEA', 'PyCharm', 'WebStorm'],
    
    pros: [
        '中文支持优秀',
        '本土化服务',
        '阿里云生态',
        '企业级支持',
        '数据安全',
        '响应速度快',
        '免费额度充足'
    ],
    cons: [
        '主要面向中国市场',
        '功能相对基础',
        '国际化程度低',
        '社区较小'
    ],
    
    extensions: {
        tutorials: [
            {
                title: '通义灵码快速上手',
                url: '#tutorial-tongyi-basics',
                level: '入门'
            },
            {
                title: '企业级部署指南',
                url: '#tutorial-tongyi-enterprise',
                level: '中级'
            },
            {
                title: '中文编程最佳实践',
                url: '#tutorial-tongyi-chinese',
                level: '高级'
            }
        ],
        news: [
            {
                title: '通义灵码2.0版本发布',
                date: '2024-12-21',
                summary: '增强中文理解能力，优化代码生成质量'
            }
        ],
        alternatives: ['GitHub Copilot', 'Cursor', 'Codeium'],
        integrations: ['阿里云', 'DingTalk', '钉钉', 'VS Code']
    }
}; 