/**
 * Claude AI编程助手信息
 * Anthropic的高级AI助手
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const claudeTool = {
    id: 'claude',
    name: 'Claude',
    category: 'AI编程助手',
    type: TOOL_TYPES.WEB,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.PROFESSIONAL,
    
    logo: 'fas fa-brain',
    description: 'Anthropic开发的高级AI助手，擅长复杂代码理解、架构设计和技术文档编写。是专业开发者的理想伙伴。',
    features: [
        '代码理解',
        '架构设计',
        '文档生成',
        '问题解决',
        '长上下文',
        '代码审查',
        '技术写作',
        '算法优化'
    ],
    
    rating: 4.8,
    users: '800K+',
    updated: '2024-12-24',
    
    website: 'https://claude.ai',
    documentation: 'https://docs.anthropic.com',
    github: null,
    
    supported_languages: [
        'Python',
        'JavaScript',
        'Java',
        'C++',
        'Go',
        'Rust',
        'TypeScript',
        'C#',
        'PHP',
        'Ruby',
        'Swift',
        'Kotlin'
    ],
    platforms: ['Web', 'API'],
    
    pros: [
        '强大的推理能力',
        '长文本处理',
        '代码质量高',
        '架构设计能力强',
        '详细的解释',
        '支持复杂任务',
        '安全性好'
    ],
    cons: [
        '主要基于Web',
        '免费额度有限',
        '响应速度较慢',
        '无IDE集成'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'Claude编程入门',
                url: '#tutorial-claude-basics',
                level: '入门'
            },
            {
                title: '架构设计与Claude',
                url: '#tutorial-claude-architecture',
                level: '高级'
            },
            {
                title: 'Claude API使用指南',
                url: '#tutorial-claude-api',
                level: '中级'
            }
        ],
        news: [
            {
                title: 'Claude 3.5 Sonnet增强版',
                date: '2024-12-24',
                summary: '在代码生成和调试方面表现更加优秀'
            }
        ],
        alternatives: ['ChatGPT', 'Gemini', 'GitHub Copilot'],
        integrations: ['API', 'Slack', 'Discord', 'Web浏览器']
    }
}; 