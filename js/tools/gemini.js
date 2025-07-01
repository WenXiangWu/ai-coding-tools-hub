/**
 * Google Gemini AI编程助手信息
 * Google的多模态AI助手
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const geminiTool = {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'AI编程助手',
    type: TOOL_TYPES.WEB,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.POWERFUL,
    
    logo: 'tool-icon tool-icon-gemini',
    description: 'Google开发的先进多模态AI助手，支持文本、图像和代码的理解与生成，为开发者提供全方位的编程支持。',
    features: [
        '多模态理解',
        '代码生成',
        '图像理解',
        '长文本处理',
        'API集成',
        '实时对话',
        '文档分析',
        '架构设计'
    ],
    
    rating: 4.5,
    users: '600K+',
    updated: '2024-12-22',
    
    website: 'https://gemini.google.com',
    documentation: 'https://ai.google.dev/docs',
    github: null,
    
    supported_languages: [
        'Python',
        'JavaScript',
        'Java',
        'C++',
        'Go',
        'TypeScript',
        'C#',
        'PHP',
        'Ruby',
        'Swift',
        'Kotlin',
        'Rust'
    ],
    platforms: ['Web', 'API', 'Android Studio'],
    
    pros: [
        '多模态能力强',
        '免费额度大',
        'Google生态集成',
        '性能优秀',
        '支持长文本',
        '响应速度快',
        '持续改进'
    ],
    cons: [
        '主要基于Web',
        'IDE集成有限',
        '功能相对较新',
        '文档不够完善'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'Gemini编程入门',
                url: '#tutorial-gemini-basics',
                level: '入门'
            },
            {
                title: 'Gemini API开发指南',
                url: '#tutorial-gemini-api',
                level: '中级'
            },
            {
                title: '多模态编程实践',
                url: '#tutorial-gemini-multimodal',
                level: '高级'
            }
        ],
        news: [
            {
                title: 'Gemini Pro版本更新',
                date: '2024-12-22',
                summary: '提升代码理解能力，增强多模态交互'
            }
        ],
        alternatives: ['Claude', 'ChatGPT', 'GitHub Copilot'],
        integrations: ['Google Cloud', 'Android Studio', 'Firebase']
    }
}; 