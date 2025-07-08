/**
 * Trae AI编程工具信息
 * 字节跳动推出的AI编程助手
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';
import { getI18nManager } from '../managers/i18n-manager.js';

// 获取国际化管理器
const i18nManager = getI18nManager();

// 获取多语言URL
function getUrls() {
    const urlMappings = i18nManager.urlMappings[i18nManager.getCurrentLanguage()] || {};
    return urlMappings.trae || {
        website: 'https://www.trae.cn',
        documentation: 'https://www.trae.cn/docs',
        github: 'https://github.com/bytedance/trae',
        changelog: 'https://www.trae.cn/changelog'
    };
}

export const traeTool = {
    id: 'trae',
    name: 'Trae',
    category: 'AI代码助手',
    type: TOOL_TYPES.STANDALONE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.NEW,
    
    logo: 'tool-icon tool-icon-trae',
    description: '字节跳动推出的智能AI编程助手，提供代码补全、代码生成、代码优化等功能，支持多种编程语言和开发场景。',
    features: [
        '智能代码补全',
        '代码生成',
        '代码优化',
        '多语言支持',
        '自然语言编程',
        'AI对话式编程',
        '代码解释'
    ],
    
    rating: 4.5,
    users: '100K+',
    updated: '2024-03-20',
    
    // 动态获取URL
    get website() {
        return getUrls().website;
    },
    get documentation() {
        return getUrls().documentation;
    },
    get github() {
        return getUrls().github;
    },
    get changelog() {
        return getUrls().changelog;
    },
    
    supported_languages: [
        'JavaScript',
        'Python',
        'TypeScript',
        'Java',
        'Go',
        'C++',
        'Rust',
        'PHP'
    ],
    platforms: ['Windows', 'macOS', 'Linux'],
    
    pros: [
        '强大的AI能力',
        '中文支持优秀',
        '活跃的社区',
        '快速响应速度',
        '支持多种开发场景',
        '与字节系产品集成'
    ],
    cons: [
        '部分功能需要付费',
        '需要网络连接',
        '文档更新不够及时'
    ],
    
    // 详细的文档结构
    documentation_sections: {
        getting_started: {
            title: '快速开始',
            icon: 'fas fa-rocket',
            sections: [
                {
                    id: 'introduction',
                    title: '什么是Trae',
                    content: `
                        <h3>Trae是什么？</h3>
                        <p>Trae是字节跳动推出的新一代AI编程助手，专注于提供智能的代码补全、生成和优化功能。它能够理解开发者的意图，提供精准的编程建议。</p>
                        
                        <h4>核心特性</h4>
                        <ul>
                            <li><strong>智能代码补全</strong> - 基于上下文的智能补全，提高编码效率</li>
                            <li><strong>代码生成</strong> - 根据自然语言描述生成代码实现</li>
                            <li><strong>代码优化</strong> - 智能识别并优化代码性能和质量</li>
                            <li><strong>多语言支持</strong> - 支持主流编程语言和框架</li>
                        </ul>
                    `
                },
                {
                    id: 'installation',
                    title: '安装与配置',
                    content: `
                        <h3>系统要求</h3>
                        <ul>
                            <li>Windows 10/11, macOS 10.14+, 或 Linux</li>
                            <li>至少4GB RAM (推荐8GB+)</li>
                            <li>稳定的网络连接</li>
                        </ul>
                        
                        <h3>安装步骤</h3>
                        <ol>
                            <li>访问 <a href="${getUrls().website}" target="_blank">Trae官方网站</a></li>
                            <li>注册字节开发者账号</li>
                            <li>下载并安装Trae</li>
                            <li>使用开发者账号登录</li>
                        </ol>
                    `
                }
            ]
        },
        features: {
            title: '功能特性',
            icon: 'fas fa-star',
            sections: [
                {
                    id: 'code_completion',
                    title: '代码补全',
                    content: `
                        <h3>智能代码补全</h3>
                        <p>Trae提供基于深度学习的智能代码补全功能，可以根据上下文提供准确的代码建议。</p>
                        
                        <h4>主要特点：</h4>
                        <ul>
                            <li>实时补全建议</li>
                            <li>上下文感知</li>
                            <li>支持多种编程范式</li>
                            <li>自定义代码风格</li>
                        </ul>
                    `
                },
                {
                    id: 'code_generation',
                    title: '代码生成',
                    content: `
                        <h3>AI代码生成</h3>
                        <p>通过自然语言描述，Trae可以生成符合要求的代码实现。</p>
                        
                        <h4>使用场景：</h4>
                        <ul>
                            <li>常见功能实现</li>
                            <li>算法问题求解</li>
                            <li>接口对接代码</li>
                            <li>测试用例生成</li>
                        </ul>
                    `
                }
            ]
        }
    }
}; 