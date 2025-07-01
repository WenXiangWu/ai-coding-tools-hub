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
    
    website: 'https://cursor.sh',
    documentation: 'https://docs.cursor.sh',
    github: 'https://github.com/getcursor/cursor',
    changelog: 'https://docs.cursor.sh/changelog',
    
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
                            <li>访问 <a href="https://cursor.sh" target="_blank">cursor.sh</a></li>
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
                        
                        <h4>如果您更喜欢垂直活动栏：</h4>
                        <ol>
                            <li>打开VS Code设置 (<code>Ctrl/⌘ + Shift + P</code>)</li>
                            <li>输入 <code>VS Code Settings</code></li>
                            <li>将 <code>workbench.activityBar.orientation</code> 设置为 <code>vertical</code></li>
                            <li>重启Cursor</li>
                        </ol>
                        
                        <h3>设置面板说明</h3>
                        <ul>
                            <li><strong>Cursor特定设置：</strong> 右上角齿轮按钮 或 <code>Ctrl/⌘ + Shift + J</code></li>
                            <li><strong>VS Code设置：</strong> <code>Ctrl/⌘ + Shift + P</code> 然后输入 <code>VS Code Settings</code></li>
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
                    id: 'tab_completion',
                    title: 'Tab智能补全',
                    content: `
                        <h3>Tab补全功能</h3>
                        <p>Cursor的Tab功能提供基于上下文的智能代码补全，比传统的自动补全更加智能和准确。</p>
                        
                        <h4>使用方法：</h4>
                        <ol>
                            <li>开始输入代码</li>
                            <li>当看到灰色的建议代码时，按<code>Tab</code>键接受</li>
                            <li>按<code>Escape</code>键拒绝建议</li>
                        </ol>
                        
                        <h4>高级用法：</h4>
                        <ul>
                            <li><strong>部分接受：</strong> 按<code>Ctrl/⌘ + →</code>只接受建议的一部分</li>
                            <li><strong>查看替代方案：</strong> 按<code>Alt + ]</code>查看其他建议</li>
                        </ul>
                    `
                },
                {
                    id: 'composer',
                    title: 'Composer多文件编辑',
                    content: `
                        <h3>什么是Composer？</h3>
                        <p>Composer是Cursor的杀手级功能，允许AI同时编辑多个文件，理解整个项目的结构和上下文。</p>
                        
                        <h4>启动Composer：</h4>
                        <ul>
                            <li>快捷键：<code>Ctrl/⌘ + I</code></li>
                            <li>或者点击左侧面板的Composer图标</li>
                        </ul>
                        
                        <h4>使用技巧：</h4>
                        <ol>
                            <li><strong>添加文件：</strong> 点击"+"按钮添加需要编辑的文件</li>
                            <li><strong>描述需求：</strong> 用自然语言描述你想要实现的功能</li>
                            <li><strong>预览更改：</strong> AI会显示将要进行的更改，你可以预览后决定是否应用</li>
                            <li><strong>应用更改：</strong> 确认无误后点击"Apply"按钮</li>
                        </ol>
                        
                        <div class="example-box">
                            <h5>示例：创建一个React组件</h5>
                            <p><strong>输入：</strong> "创建一个用户卡片组件，包含头像、姓名、邮箱，并添加相应的样式文件"</p>
                            <p><strong>结果：</strong> AI会同时创建.jsx文件和.css文件，确保两者协调一致</p>
                        </div>
                    `
                },
                {
                    id: 'chat',
                    title: 'AI对话功能',
                    content: `
                        <h3>Chat功能概述</h3>
                        <p>Cursor的Chat功能让你可以与AI进行自然语言对话，获得编程帮助、代码解释和问题解答。</p>
                        
                        <h4>启动Chat：</h4>
                        <ul>
                            <li>快捷键：<code>Ctrl/⌘ + L</code></li>
                            <li>或者点击右侧面板的Chat图标</li>
                        </ul>
                        
                        <h4>Chat使用技巧：</h4>
                        <ul>
                            <li><strong>@符号引用：</strong> 使用@可以引用特定文件或代码片段</li>
                            <li><strong>代码上下文：</strong> 选中代码后开始对话，AI会基于选中内容回答</li>
                            <li><strong>多轮对话：</strong> 可以进行连续的问答，AI会记住对话历史</li>
                        </ul>
                        
                        <div class="chat-examples">
                            <h5>常用对话示例：</h5>
                            <ul>
                                <li>"解释这段代码的作用"</li>
                                <li>"这个函数有什么性能问题吗？"</li>
                                <li>"帮我优化这个算法"</li>
                                <li>"如何测试这个组件？"</li>
                            </ul>
                        </div>
                    `
                }
            ]
        },
        tips_and_tricks: {
            title: '使用技巧',
            icon: 'fas fa-magic',
            sections: [
                {
                    id: 'control_ai',
                    title: '如何让AI更听话',
                    content: `
                        <h3>需求分解策略</h3>
                        <p>不要让AI一次性完成所有工作，而是将复杂需求分解成小步骤。</p>
                        
                        <h4>示例流程：</h4>
                        <ol>
                            <li><strong>第一步：</strong> "请帮我设计一个用户注册页面的整体结构"</li>
                            <li><strong>第二步：</strong> "现在请实现表单验证逻辑"</li>
                            <li><strong>第三步：</strong> "添加样式，要求简洁现代"</li>
                            <li><strong>第四步：</strong> "添加提交后的成功/错误处理"</li>
                        </ol>
                        
                        <div class="tip-box">
                            <i class="fas fa-lightbulb"></i>
                            <strong>关键提示：</strong> 每完成一步后，先检查结果是否符合预期，再进行下一步。
                        </div>
                    `
                },
                {
                    id: 'debugging',
                    title: '代码调试技巧',
                    content: `
                        <h3>遇到报错不要慌</h3>
                        <p>当代码出现错误时，使用这个三步法：</p>
                        
                        <h4>步骤1：让AI分析问题</h4>
                        <p>发送报错信息时，在后面加上：</p>
                        <blockquote>
                        "先检查研究我的代码文件，试图找出报错的原因。然后概述你要做的事情，不要写任何代码，直到我说继续"
                        </blockquote>
                        
                        <h4>步骤2：添加调试日志</h4>
                        <p>让AI在关键节点添加console.log或其他日志，帮助定位问题。</p>
                        
                        <h4>步骤3：版本回滚</h4>
                        <p>如果问题无法解决，使用git回滚到工作版本，重新实现功能。</p>
                        
                        <div class="warning-box">
                            <i class="fas fa-exclamation-triangle"></i>
                            <strong>重要：</strong> 建议使用Git管理代码版本，便于出现问题时快速回滚。
                        </div>
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