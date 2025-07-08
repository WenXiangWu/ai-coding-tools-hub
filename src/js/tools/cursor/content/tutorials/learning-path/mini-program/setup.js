/**
 * Cursor小程序开发 - 项目设置指南
 */
export default {
    id: 'mini_program_setup',
    title: '小程序项目设置',
    description: '使用Cursor开发小程序的项目初始化指南',
    content: `
        <article class="tool-content">
            <section class="overview">
                <h2>小程序项目设置指南</h2>
                <p>
                    本指南将帮助你使用Cursor搭建一个小程序开发环境，并完成项目的初始化设置。
                    我们将使用微信小程序作为示例，但这些原则同样适用于其他小程序平台。
                </p>
            </section>

            <section class="prerequisites">
                <h3>前置要求</h3>
                <div class="requirement-list">
                    <div class="requirement-item">
                        <i class="fas fa-check-circle"></i>
                        <div class="requirement-content">
                            <h4>Cursor编辑器</h4>
                            <p>确保已安装最新版本的Cursor编辑器</p>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <i class="fas fa-check-circle"></i>
                        <div class="requirement-content">
                            <h4>微信开发者工具</h4>
                            <p>下载并安装微信开发者工具</p>
                        </div>
                    </div>
                    <div class="requirement-item">
                        <i class="fas fa-check-circle"></i>
                        <div class="requirement-content">
                            <h4>Node.js环境</h4>
                            <p>安装Node.js (建议版本 >= 14.0.0)</p>
                        </div>
                    </div>
                </div>
            </section>

            <section class="setup-steps">
                <h3>设置步骤</h3>
                <div class="step-list">
                    <div class="step-item">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h4>创建项目</h4>
                            <pre><code>// 使用微信小程序模板创建项目
npx create-wxapp my-miniprogram
cd my-miniprogram</code></pre>
                        </div>
                    </div>

                    <div class="step-item">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h4>配置Cursor</h4>
                            <p>在Cursor中打开项目，并配置以下设置：</p>
                            <pre><code>{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.wxml": "html",
    "*.wxss": "css"
  }
}</code></pre>
                        </div>
                    </div>

                    <div class="step-item">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h4>安装依赖</h4>
                            <pre><code>npm install
// 安装开发依赖
npm install --save-dev @types/wechat-miniprogram eslint prettier</code></pre>
                        </div>
                    </div>

                    <div class="step-item">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h4>配置AI助手</h4>
                            <p>在项目根目录创建.cursorrc文件：</p>
                            <pre><code>{
  "ai": {
    "enabled": true,
    "suggestions": {
      "wxml": true,
      "wxss": true,
      "js": true
    }
  }
}</code></pre>
                        </div>
                    </div>
                </div>
            </section>

            <section class="project-structure">
                <h3>项目结构</h3>
                <pre><code>my-miniprogram/
├── dist/           # 编译后的文件
├── src/            # 源代码
│   ├── pages/      # 页面文件
│   ├── components/ # 组件
│   ├── utils/      # 工具函数
│   └── app.js      # 入口文件
├── package.json
├── project.config.json
└── .cursorrc</code></pre>
            </section>

            <section class="best-practices">
                <h3>最佳实践建议</h3>
                <ul class="practice-list">
                    <li>
                        <strong>使用TypeScript</strong>
                        <p>建议使用TypeScript开发，可以获得更好的类型提示和错误检查</p>
                    </li>
                    <li>
                        <strong>组件化开发</strong>
                        <p>将常用UI元素封装为组件，提高代码复用性</p>
                    </li>
                    <li>
                        <strong>状态管理</strong>
                        <p>考虑使用mobx-miniprogram等状态管理工具</p>
                    </li>
                </ul>
            </section>

            <section class="next-steps">
                <h3>下一步</h3>
                <p>
                    完成项目设置后，你可以继续查看
                    <a href="#/tutorials/learning-path/mini-program/development">开发流程指南</a>
                    来了解如何开始开发你的第一个页面。
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

        .requirement-list {
            display: grid;
            gap: 20px;
            margin: 20px 0;
        }

        .requirement-item {
            display: flex;
            align-items: start;
            padding: 15px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        .requirement-item i {
            color: var(--success-color);
            margin-right: 15px;
            margin-top: 3px;
        }

        .step-list {
            display: grid;
            gap: 30px;
            margin: 20px 0;
        }

        .step-item {
            display: flex;
            gap: 20px;
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        .step-number {
            width: 30px;
            height: 30px;
            background: var(--primary-color);
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .step-content {
            flex: 1;
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

        .practice-list {
            list-style: none;
            padding: 0;
        }

        .practice-list li {
            margin: 15px 0;
            padding: 15px;
            background: var(--surface-1);
            border-radius: 4px;
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
    `
}; 