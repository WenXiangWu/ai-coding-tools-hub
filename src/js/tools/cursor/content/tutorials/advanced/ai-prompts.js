/**
 * Cursor进阶教程 - AI提示词编写指南
 */
export default {
    id: 'ai_prompts',
    title: 'AI提示词编写指南',
    description: '学习如何编写高效的AI提示词以提升开发效率',
    content: `
        <article class="tool-content">
            <section class="introduction">
                <h2>AI提示词编写指南</h2>
                <p>
                    高质量的提示词（Prompts）是充分利用Cursor AI能力的关键。本指南将帮助你掌握编写有效提示词的技巧，
                    让AI助手更好地理解你的需求并提供精准的帮助。
                </p>
            </section>

            <section class="prompt-principles">
                <h3>提示词编写原则</h3>
                <div class="principle-grid">
                    <div class="principle-item">
                        <i class="fas fa-bullseye"></i>
                        <h4>明确目标</h4>
                        <p>清晰描述你想要达成的目标，包括具体的输出格式和要求</p>
                    </div>
                    <div class="principle-item">
                        <i class="fas fa-puzzle-piece"></i>
                        <h4>提供上下文</h4>
                        <p>包含必要的背景信息，如技术栈、约束条件等</p>
                    </div>
                    <div class="principle-item">
                        <i class="fas fa-layer-group"></i>
                        <h4>分步骤描述</h4>
                        <p>将复杂任务拆分为多个小步骤，逐步引导AI完成</p>
                    </div>
                    <div class="principle-item">
                        <i class="fas fa-code"></i>
                        <h4>使用示例</h4>
                        <p>通过具体的代码示例说明你的期望结果</p>
                    </div>
                </div>
            </section>

            <section class="prompt-patterns">
                <h3>常用提示词模式</h3>
                <div class="pattern-list">
                    <div class="pattern-item">
                        <h4>代码生成</h4>
                        <pre><code>创建一个[组件名称]组件，具有以下功能：
1. [功能1描述]
2. [功能2描述]
使用[框架/库]实现，需要支持[特定要求]</code></pre>
                    </div>
                    <div class="pattern-item">
                        <h4>代码优化</h4>
                        <pre><code>优化以下代码，重点关注：
- 性能优化
- 代码可读性
- 最佳实践
[插入需要优化的代码]</code></pre>
                    </div>
                    <div class="pattern-item">
                        <h4>问题诊断</h4>
                        <pre><code>我的代码出现以下错误：
[错误信息]
相关代码：
[代码片段]
环境信息：
- Node.js版本：[版本号]
- 相关依赖版本：[版本信息]</code></pre>
                    </div>
                    <div class="pattern-item">
                        <h4>功能扩展</h4>
                        <pre><code>在现有代码基础上添加[新功能]：
当前代码：
[现有代码]
需要添加的功能：
1. [功能描述1]
2. [功能描述2]</code></pre>
                    </div>
                </div>
            </section>

            <section class="best-practices">
                <h3>最佳实践示例</h3>
                <div class="example-list">
                    <div class="example-item good">
                        <h4>✅ 好的提示词示例</h4>
                        <pre><code>创建一个React表单组件，包含以下功能：
1. 用户名、邮箱、密码输入框
2. 表单验证（使用Yup schema）
3. 提交时显示加载状态
4. 错误信息展示

技术要求：
- 使用React Hook Form
- TypeScript类型定义
- 响应式布局
- 支持暗色模式

参考代码结构：
interface FormData {
  username: string;
  email: string;
  password: string;
}</code></pre>
                    </div>
                    <div class="example-item bad">
                        <h4>❌ 不好的提示词示例</h4>
                        <pre><code>帮我写个表单</code></pre>
                        <p class="explanation">问题：缺乏具体要求和上下文信息，AI无法准确理解需求</p>
                    </div>
                </div>
            </section>

            <section class="advanced-techniques">
                <h3>进阶技巧</h3>
                <div class="technique-list">
                    <div class="technique-item">
                        <h4>1. 迭代优化</h4>
                        <p>根据AI的响应逐步细化和调整提示词，直到得到满意的结果</p>
                        <div class="example">
                            <strong>第一轮：</strong> "创建用户注册表单"<br>
                            <strong>优化后：</strong> "创建用户注册表单，包含字段验证和API集成"<br>
                            <strong>进一步优化：</strong> "创建用户注册表单，使用Formik处理验证，集成后端API"
                        </div>
                    </div>
                    <div class="technique-item">
                        <h4>2. 角色设定</h4>
                        <p>为AI设定特定的角色，以获得更专业的响应</p>
                        <div class="example">
                            "作为一个性能优化专家，请审查以下代码并提供优化建议..."
                        </div>
                    </div>
                    <div class="technique-item">
                        <h4>3. 约束条件</h4>
                        <p>明确指出限制和要求，避免生成不符合预期的代码</p>
                        <div class="example">
                            "生成的代码必须：不使用class组件，只使用函数组件和hooks"
                        </div>
                    </div>
                </div>
            </section>

            <section class="common-scenarios">
                <h3>常见应用场景</h3>
                <div class="scenario-grid">
                    <div class="scenario-item">
                        <h4>代码重构</h4>
                        <pre><code>请帮我重构这段代码，要求：
1. 提取可复用的逻辑到自定义hook
2. 优化性能，避免不必要的重渲染
3. 添加适当的类型注解
[插入代码]</code></pre>
                    </div>
                    <div class="scenario-item">
                        <h4>单元测试</h4>
                        <pre><code>为以下组件编写单元测试：
1. 测试所有主要功能点
2. 包含异步操作测试
3. 模拟用户交互
[插入组件代码]</code></pre>
                    </div>
                </div>
            </section>

            <section class="troubleshooting">
                <h3>常见问题与解决方案</h3>
                <div class="faq-list">
                    <div class="faq-item">
                        <h4>Q: AI生成的代码不完整怎么办？</h4>
                        <p>A: 明确指出你需要完整的实现，包括所有必要的导入语句和类型定义</p>
                    </div>
                    <div class="faq-item">
                        <h4>Q: 如何让AI生成更符合项目风格的代码？</h4>
                        <p>A: 提供项目的代码规范示例和使用的技术栈信息</p>
                    </div>
                </div>
            </section>

            <section class="next-steps">
                <h3>下一步学习</h3>
                <p>
                    掌握了提示词编写技巧后，建议继续学习
                    <a href="#/tutorials/advanced/custom-settings">自定义设置指南</a>
                    来进一步提升开发效率。
                </p>
            </section>
        </article>
    `,
    style: `
        .tool-content {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }

        .principle-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .principle-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
            text-align: center;
        }

        .principle-item i {
            font-size: 24px;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .pattern-list, .example-list, .technique-list, .faq-list {
            display: grid;
            gap: 20px;
            margin: 20px 0;
        }

        .pattern-item, .example-item, .technique-item, .faq-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        .example-item.good {
            border-left: 4px solid var(--success-color);
        }

        .example-item.bad {
            border-left: 4px solid var(--error-color);
        }

        .explanation {
            margin-top: 10px;
            color: var(--error-color);
            font-style: italic;
        }

        .scenario-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .scenario-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        pre {
            background: var(--surface-3);
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
        }

        code {
            font-family: 'Fira Code', monospace;
        }

        .next-steps {
            margin-top: 30px;
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
            text-align: center;
        }

        h2, h3, h4 {
            color: var(--heading-color);
        }

        a {
            color: var(--primary-color);
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        .example {
            margin-top: 10px;
            padding: 10px;
            background: var(--surface-1);
            border-radius: 4px;
        }
    `
}; 