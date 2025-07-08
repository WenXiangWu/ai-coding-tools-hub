/**
 * 什么是Cursor - 内容文件
 */
export default {
    id: 'what_is_cursor',
    title: '什么是Cursor',
    description: 'Cursor编辑器简介',
    content: `
        <article class="tool-content">
            <section class="introduction">
                <h2>什么是Cursor？</h2>
                <p>
                    Cursor是一款革命性的AI代码编辑器，它基于Visual Studio Code构建，并集成了强大的AI编程助手功能。
                    它的目标是通过AI技术提升开发者的编程效率，让编程体验更加智能和流畅。
                </p>
            </section>

            <section class="key-features">
                <h3>核心特点</h3>
                <div class="feature-grid">
                    <div class="feature-item">
                        <i class="fas fa-robot"></i>
                        <h4>AI驱动</h4>
                        <p>基于GPT-4的AI模型，提供智能代码补全和生成功能</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-code"></i>
                        <h4>原生编辑器体验</h4>
                        <p>继承VS Code的强大功能，提供熟悉的编程体验</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-comments"></i>
                        <h4>自然语言交互</h4>
                        <p>使用自然语言描述需求，AI助手帮你实现代码</p>
                    </div>
                    <div class="feature-item">
                        <i class="fas fa-project-diagram"></i>
                        <h4>多文件编辑</h4>
                        <p>通过Composer功能，轻松处理跨文件的代码改动</p>
                    </div>
                </div>
            </section>

            <section class="target-users">
                <h3>适用人群</h3>
                <ul class="user-list">
                    <li>
                        <strong>专业开发者</strong>
                        <p>提升日常编码效率，处理复杂的编程任务</p>
                    </li>
                    <li>
                        <strong>初学者</strong>
                        <p>通过AI助手学习编程，快速理解代码逻辑</p>
                    </li>
                    <li>
                        <strong>团队协作</strong>
                        <p>改善团队协作效率，提高代码质量</p>
                    </li>
                </ul>
            </section>

            <section class="technical-details">
                <h3>技术特性</h3>
                <ul class="tech-list">
                    <li>基于Electron框架构建的跨平台应用</li>
                    <li>集成GPT-4等先进AI模型</li>
                    <li>支持多种编程语言和框架</li>
                    <li>实时代码分析和建议</li>
                    <li>智能代码重构和优化</li>
                </ul>
            </section>

            <section class="getting-started">
                <h3>快速开始</h3>
                <p>
                    想要开始使用Cursor？请查看我们的
                    <a href="#/tutorials/learning-path/env-setup">环境安装指南</a>
                    和<a href="#/tutorials/basic/interface-intro">界面介绍</a>。
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

        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .feature-item {
            padding: 15px;
            border-radius: 8px;
            background: var(--surface-2);
            text-align: center;
        }

        .feature-item i {
            font-size: 24px;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .user-list, .tech-list {
            list-style: none;
            padding: 0;
        }

        .user-list li, .tech-list li {
            margin: 10px 0;
            padding: 10px;
            background: var(--surface-1);
            border-radius: 4px;
        }

        .getting-started {
            margin-top: 30px;
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
            text-align: center;
        }

        section {
            margin-bottom: 30px;
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
    `
}; 