/**
 * Cursor AI编程工具信息
 * 革命性的AI代码编辑器
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';

export const cursorTool = {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI代码编辑器',
    type: TOOL_TYPES.STANDALONE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.HOT,
    
    logo: 'fas fa-mouse-pointer',
    description: '革命性的AI代码编辑器，基于GPT-4构建，提供智能代码补全、自然语言编程和实时代码解释。完美融合传统编程体验与AI创新。',
    features: [
        '智能补全',
        '代码生成', 
        '实时调试',
        '多语言支持',
        'Composer功能',
        '自然语言编程',
        'AI对话式编程',
        '代码解释'
    ],
    
    rating: 4.9,
    users: '500K+',
    updated: '2024-12-25',
    
    website: 'https://cursor.sh',
    documentation: 'https://docs.cursor.sh',
    github: 'https://github.com/getcursor/cursor',
    
    supported_languages: [
        'JavaScript',
        'Python', 
        'TypeScript',
        'Go',
        'Rust',
        'Java',
        'C++',
        'C#',
        'PHP',
        'Ruby',
        'Swift',
        'Kotlin'
    ],
    platforms: ['Windows', 'macOS', 'Linux'],
    
    pros: [
        '强大的AI能力',
        '流畅的用户体验',
        '活跃的社区',
        'Composer多文件编辑',
        '自然语言编程',
        '快速响应速度',
        '支持多种AI模型'
    ],
    cons: [
        '付费版价格较高',
        '需要网络连接',
        '部分功能需要订阅',
        '对网络要求较高'
    ],
    
    extensions: {
        tutorials: [
            {
                title: 'Cursor快速入门指南',
                url: '#tutorial-cursor-basics',
                level: '入门'
            },
            {
                title: 'Composer功能详解',
                url: '#tutorial-cursor-composer',
                level: '中级'
            },
            {
                title: 'Cursor高级配置',
                url: '#tutorial-cursor-advanced',
                level: '高级'
            }
        ],
        news: [
            {
                title: 'Cursor 0.42版本发布',
                date: '2024-12-25',
                summary: '新增多文件编辑功能，优化代码补全算法'
            }
        ],
        alternatives: ['Windsurf', 'GitHub Copilot', 'Codeium'],
        integrations: ['Git', 'GitHub', 'Docker', 'Terminal']
    }
}; 