/**
 * Cursor AI编程工具信息
 * 革命性的AI代码编辑器
 */

import { TOOL_TYPES, PRICE_MODELS, TOOL_STATUS } from '../utils/tool-schema.js';
import { getI18nManager } from '../managers/i18n-manager.js';

// 获取国际化管理器
const i18nManager = getI18nManager();

// 获取多语言URL
function getUrls() {
    const urlMappings = i18nManager.urlMappings[i18nManager.getCurrentLanguage()] || {};
    return urlMappings.cursor || {
        website: 'https://cursor.sh',
        documentation: 'https://docs.cursor.com',
        github: 'https://github.com/getcursor/cursor',
        changelog: 'https://docs.cursor.com/changelog'
    };
}

export const cursorTool = {
    id: 'cursor',
    name: 'Cursor',
    category: 'AI代码编辑器',
    type: TOOL_TYPES.STANDALONE,
    price: PRICE_MODELS.FREEMIUM,
    status: TOOL_STATUS.HOT,
    
    logo: 'tool-icon tool-icon-cursor',
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
    
    // 详细的文档结构
    documentation_sections: {
        getting_started: {
            title: '快速开始',
            icon: 'fas fa-rocket',
            sections: [
                {
                    id: 'introduction',
                    title: '什么是Cursor',
                    content: `
                        <h3>Cursor是什么？</h3>
                        <p>Cursor是一款革命性的AI代码编辑器，基于VS Code构建，专门为AI辅助编程而设计。它将传统的代码编辑体验与最先进的AI技术完美结合。</p>
                        
                        <h4>核心特性</h4>
                        <ul>
                            <li><strong>智能代码补全</strong> - 基于上下文的智能补全，比传统IDE更精准</li>
                            <li><strong>Composer功能</strong> - 同时编辑多个文件，让AI理解整个项目结构</li>
                            <li><strong>自然语言编程</strong> - 用自然语言描述需求，AI帮你实现代码</li>
                            <li><strong>实时代码解释</strong> - AI可以解释代码逻辑，帮助理解复杂代码</li>
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
                        
                        <h3>下载安装</h3>
                        <ol>
                            <li>访问 <a href="${getUrls().website}" target="_blank">官方网站</a></li>
                            <li>选择适合你操作系统的版本下载</li>
                            <li>运行安装程序，按提示完成安装</li>
                        </ol>
                        
                        <h3>首次配置</h3>
                        <p>首次启动Cursor时，你需要：</p>
                        <ol>
                            <li>创建账户或登录现有账户</li>
                            <li>选择AI模型（推荐GPT-4）</li>
                            <li>设置代码风格和偏好</li>
                        </ol>
                    `
                }
            ]
        },
        migration_guide: {
            title: '从VS Code迁移',
            icon: 'fas fa-exchange-alt',
            sections: [
                {
                    id: 'why_migrate',
                    title: '为什么选择Cursor',
                    content: `
                        <h3>Cursor vs VS Code</h3>
                        <p>Cursor是VS Code的一个分支，这使我们能够专注于与AI进行编码的最佳方式，同时提供熟悉的文本编辑体验。</p>
                        
                        <div class="comparison-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>功能</th>
                                        <th>VS Code</th>
                                        <th>Cursor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>基础编辑</td>
                                        <td>✅ 优秀</td>
                                        <td>✅ 优秀</td>
                                    </tr>
                                    <tr>
                                        <td>AI代码补全</td>
                                        <td>🔶 需要插件</td>
                                        <td>✅ 原生支持</td>
                                    </tr>
                                    <tr>
                                        <td>多文件AI编辑</td>
                                        <td>❌ 不支持</td>
                                        <td>✅ Composer功能</td>
                                    </tr>
                                    <tr>
                                        <td>自然语言编程</td>
                                        <td>❌ 不支持</td>
                                        <td>✅ 原生支持</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    `
                },
                {
                    id: 'import_settings',
                    title: '导入VS Code配置',
                    content: `
                        <h3>一键导入配置</h3>
                        <p>您可以通过一键将您的VS Code配置导入到Cursor。</p>
                        
                        <h4>操作步骤：</h4>
                        <ol>
                            <li>打开Cursor设置</li>
                            <li>导航到 <code>Cursor Settings</code> > <code>General</code> > <code>Account</code></li>
                            <li>点击"Import from VS Code"按钮</li>
                            <li>选择要导入的内容：
                                <ul>
                                    <li>扩展程序</li>
                                    <li>主题和配色方案</li>
                                    <li>键盘快捷键</li>
                                    <li>用户设置</li>
                                </ul>
                            </li>
                        </ol>
                        
                        <div class="tip-box">
                            <i class="fas fa-lightbulb"></i>
                            <strong>提示：</strong> 导入过程可能需要几分钟时间，请耐心等待。
                        </div>
                    `
                },
                {
                    id: 'activity_bar',
                    title: '界面差异说明',
                    content: `
                        <h3>活动栏布局</h3>
                        <p>Cursor中的活动栏默认是水平的，以节省聊天空间。</p>
                        
                        <h4>主要功能区域：</h4>
                        <ul>
                            <li><strong>Chat</strong> - 与AI对话编程</li>
                            <li><strong>Composer</strong> - 多文件编辑</li>
                            <li><strong>Explorer</strong> - 文件浏览器</li>
                            <li><strong>Search</strong> - 全局搜索</li>
                            <li><strong>Extensions</strong> - 扩展管理</li>
                        </ul>
                    `
                }
            ]
        },
        features: {
            title: '核心功能',
            icon: 'fas fa-star',
            sections: [
                {
                    id: 'chat',
                    title: 'AI聊天功能',
                    content: `
                        <h3>与AI对话编程</h3>
                        <p>Cursor的Chat功能让您可以用自然语言与AI交流，获得编程帮助。</p>
                        
                        <h4>主要特性：</h4>
                        <ul>
                            <li><strong>代码解释</strong> - 选中代码后询问AI，获得详细解释</li>
                            <li><strong>错误诊断</strong> - 遇到错误时，AI可以帮助分析和修复</li>
                            <li><strong>代码优化</strong> - 请求AI优化您的代码性能和可读性</li>
                            <li><strong>功能实现</strong> - 描述需求，AI帮您实现具体功能</li>
                        </ul>
                        
                        <h4>使用技巧：</h4>
                        <ol>
                            <li>选中相关代码后再提问，获得更准确的回答</li>
                            <li>使用 <code>@</code> 符号引用文件和函数</li>
                            <li>描述具体的使用场景和需求</li>
                        </ol>
                    `
                },
                {
                    id: 'composer',
                    title: 'Composer多文件编辑',
                    content: `
                        <h3>革命性的多文件AI编辑</h3>
                        <p>Composer是Cursor的杀手级功能，可以同时编辑多个文件，让AI理解整个项目结构。</p>
                        
                        <h4>使用场景：</h4>
                        <ul>
                            <li><strong>重构代码</strong> - 跨文件重构，保持代码一致性</li>
                            <li><strong>添加功能</strong> - 在多个文件中添加相关功能</li>
                            <li><strong>修复bug</strong> - 修复涉及多个文件的复杂bug</li>
                            <li><strong>项目初始化</strong> - 快速搭建项目结构</li>
                        </ul>
                        
                        <h4>操作步骤：</h4>
                        <ol>
                            <li>打开Composer面板（Ctrl+Shift+I）</li>
                            <li>选择要编辑的文件</li>
                            <li>描述您的需求</li>
                            <li>审查AI的修改建议</li>
                            <li>接受或调整修改</li>
                        </ol>
                    `
                },
                {
                    id: 'tab_autocomplete',
                    title: '智能代码补全',
                    content: `
                        <h3>上下文感知的智能补全</h3>
                        <p>Cursor的Tab补全功能提供了业界领先的智能代码补全体验。</p>
                        
                        <h4>核心特性：</h4>
                        <ul>
                            <li><strong>上下文理解</strong> - 理解项目上下文，提供相关建议</li>
                            <li><strong>多行补全</strong> - 可以补全整个函数或代码块</li>
                            <li><strong>语言无关</strong> - 支持所有主流编程语言</li>
                            <li><strong>实时学习</strong> - 根据您的编码习惯调整建议</li>
                        </ul>
                        
                        <h4>使用技巧：</h4>
                        <ul>
                            <li>按Tab键接受建议</li>
                            <li>按Esc键拒绝建议</li>
                            <li>使用Ctrl+→浏览多个建议</li>
                        </ul>
                    `
                }
            ]
        },
        pricing: {
            title: '价格方案',
            icon: 'fas fa-dollar-sign',
            sections: [
                {
                    id: 'free_plan',
                    title: '免费计划',
                    content: `
                        <h3>免费使用核心功能</h3>
                        <p>Cursor提供慷慨的免费计划，让您体验AI编程的魅力。</p>
                        
                        <h4>包含功能：</h4>
                        <ul>
                            <li>基础的AI聊天功能</li>
                            <li>有限的代码补全</li>
                            <li>基本的Composer功能</li>
                            <li>社区支持</li>
                        </ul>
                        
                        <h4>使用限制：</h4>
                        <ul>
                            <li>每月200次AI请求</li>
                            <li>基础的AI模型</li>
                            <li>标准的响应速度</li>
                        </ul>
                    `
                },
                {
                    id: 'pro_plan',
                    title: 'Pro计划',
                    content: `
                        <h3>专业开发者的选择</h3>
                        <p>Pro计划提供更强大的AI能力和更多的使用配额。</p>
                        
                        <h4>价格：$20/月</h4>
                        
                        <h4>包含功能：</h4>
                        <ul>
                            <li>无限制的AI聊天</li>
                            <li>高级AI模型（GPT-4）</li>
                            <li>完整的Composer功能</li>
                            <li>优先支持</li>
                            <li>快速响应速度</li>
                        </ul>
                        
                        <h4>适合人群：</h4>
                        <ul>
                            <li>专业开发者</li>
                            <li>中小型团队</li>
                            <li>个人项目</li>
                        </ul>
                    `
                },
                {
                    id: 'business_plan',
                    title: '商业计划',
                    content: `
                        <h3>企业级解决方案</h3>
                        <p>为企业团队提供定制化的AI编程解决方案。</p>
                        
                        <h4>价格：$40/月/用户</h4>
                        
                        <h4>包含功能：</h4>
                        <ul>
                            <li>Pro计划的所有功能</li>
                            <li>团队协作功能</li>
                            <li>管理员控制台</li>
                            <li>企业级安全</li>
                            <li>专门的客户经理</li>
                            <li>SLA保证</li>
                        </ul>
                        
                        <h4>适合人群：</h4>
                        <ul>
                            <li>大型企业</li>
                            <li>开发团队</li>
                            <li>有合规要求的组织</li>
                        </ul>
                    `
                }
            ]
        },
        tips: {
            title: '使用技巧',
            icon: 'fas fa-lightbulb',
            sections: [
                {
                    id: 'productivity_tips',
                    title: '提高生产力',
                    content: `
                        <h3>最大化您的编程效率</h3>
                        
                        <h4>快捷键使用：</h4>
                        <ul>
                            <li><strong>Ctrl+K</strong> - 快速编辑选中代码</li>
                            <li><strong>Ctrl+L</strong> - 打开Chat面板</li>
                            <li><strong>Ctrl+Shift+L</strong> - 在新窗口中打开Chat</li>
                            <li><strong>Ctrl+I</strong> - 打开Composer</li>
                            <li><strong>Tab</strong> - 接受代码补全建议</li>
                        </ul>
                        
                        <h4>提问技巧：</h4>
                        <ul>
                            <li>具体描述您的需求和期望结果</li>
                            <li>提供足够的上下文信息</li>
                            <li>使用清晰的语言，避免歧义</li>
                            <li>分步骤提问，逐步细化需求</li>
                        </ul>
                    `
                },
                {
                    id: 'best_practices',
                    title: '最佳实践',
                    content: `
                        <h3>充分利用AI助手</h3>
                        
                        <h4>代码审查：</h4>
                        <ul>
                            <li>使用AI进行代码审查，发现潜在问题</li>
                            <li>请求AI提供代码改进建议</li>
                            <li>让AI解释复杂的代码逻辑</li>
                        </ul>
                        
                        <h4>学习新技术：</h4>
                        <ul>
                            <li>使用AI学习新的编程语言</li>
                            <li>了解最新的技术趋势</li>
                            <li>获得个性化的学习建议</li>
                        </ul>
                        
                        <h4>团队协作：</h4>
                        <ul>
                            <li>使用AI统一代码风格</li>
                            <li>生成代码文档和注释</li>
                            <li>创建标准化的代码模板</li>
                        </ul>
                    `
                }
            ]
        },
        troubleshooting: {
            title: '故障排除',
            icon: 'fas fa-wrench',
            sections: [
                {
                    id: 'common_issues',
                    title: '常见问题',
                    content: `
                        <h3>解决常见使用问题</h3>
                        
                        <h4>AI响应缓慢：</h4>
                        <ul>
                            <li>检查网络连接状态</li>
                            <li>减少同时进行的AI请求</li>
                            <li>重启Cursor应用</li>
                            <li>检查是否有后台进程占用资源</li>
                        </ul>
                        
                        <h4>代码补全不准确：</h4>
                        <ul>
                            <li>确保项目文件结构清晰</li>
                            <li>添加必要的类型声明</li>
                            <li>检查语言服务器状态</li>
                            <li>重新索引项目文件</li>
                        </ul>
                        
                        <h4>Composer功能异常：</h4>
                        <ul>
                            <li>检查文件权限</li>
                            <li>确保没有文件被其他程序锁定</li>
                            <li>清理临时文件</li>
                            <li>更新到最新版本</li>
                        </ul>
                    `
                },
                {
                    id: 'performance_optimization',
                    title: '性能优化',
                    content: `
                        <h3>优化Cursor性能</h3>
                        
                        <h4>系统要求：</h4>
                        <ul>
                            <li>至少8GB RAM（推荐16GB）</li>
                            <li>SSD硬盘（提高文件读写速度）</li>
                            <li>稳定的网络连接</li>
                            <li>关闭不必要的后台应用</li>
                        </ul>
                        
                        <h4>优化设置：</h4>
                        <ul>
                            <li>调整AI请求频率</li>
                            <li>限制代码补全的触发频率</li>
                            <li>关闭不需要的扩展</li>
                            <li>定期清理缓存文件</li>
                        </ul>
                    `
                }
            ]
        }
    },
    
    extensions: {
        tutorials: [
            {
                title: 'Cursor快速入门指南',
                url: '#tutorial-cursor-basics',
                level: '入门',
                duration: '15分钟'
            },
            {
                title: 'Composer功能详解',
                url: '#tutorial-cursor-composer',
                level: '中级',
                duration: '30分钟'
            },
            {
                title: 'Cursor高级配置与技巧',
                url: '#tutorial-cursor-advanced',
                level: '高级',
                duration: '45分钟'
            }
        ],
        news: [
            {
                title: 'Cursor 0.42版本发布',
                date: '2024-12-25',
                summary: '新增多文件编辑功能，优化代码补全算法，提升Chat响应速度'
            },
            {
                title: '支持Claude 3.5 Sonnet模型',
                date: '2024-12-20',
                summary: '新增对Anthropic Claude 3.5 Sonnet的支持，提供更强的代码理解能力'
            }
        ],
        alternatives: ['Windsurf', 'GitHub Copilot', 'Codeium'],
        integrations: ['Git', 'GitHub', 'Docker', 'Terminal', 'ESLint', 'Prettier']
    }
}; 