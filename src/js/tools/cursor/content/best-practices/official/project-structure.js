/**
 * Cursor最佳实践 - 项目结构指南
 */
export default {
    id: 'project_structure',
    title: '项目结构最佳实践',
    description: 'Cursor推荐的项目结构组织方式',
    content: `
        <article class="tool-content">
            <section class="introduction">
                <h2>项目结构最佳实践</h2>
                <p>
                    良好的项目结构是提高代码可维护性和团队协作效率的基础。本指南将介绍Cursor推荐的项目结构组织方式，
                    帮助你建立清晰、可扩展的代码库。
                </p>
            </section>

            <section class="basic-structure">
                <h3>基础项目结构</h3>
                <div class="structure-example">
                    <pre><code>project-root/
├── src/
│   ├── components/     # 可复用组件
│   ├── pages/         # 页面组件
│   ├── hooks/         # 自定义Hooks
│   ├── utils/         # 工具函数
│   ├── services/      # API服务
│   ├── types/         # TypeScript类型定义
│   └── assets/        # 静态资源
├── tests/             # 测试文件
├── docs/              # 项目文档
├── scripts/           # 构建脚本
└── config/            # 配置文件</code></pre>
                </div>
            </section>

            <section class="organization-principles">
                <h3>组织原则</h3>
                <div class="principle-list">
                    <div class="principle-item">
                        <h4>1. 功能分层</h4>
                        <ul>
                            <li>按功能模块划分目录</li>
                            <li>相关文件放在同一目录</li>
                            <li>避免过深的目录层级</li>
                        </ul>
                    </div>
                    <div class="principle-item">
                        <h4>2. 命名规范</h4>
                        <ul>
                            <li>使用有意义的文件名</li>
                            <li>保持命名风格一致</li>
                            <li>使用小写字母和连字符</li>
                        </ul>
                    </div>
                    <div class="principle-item">
                        <h4>3. 模块化</h4>
                        <ul>
                            <li>每个文件只做一件事</li>
                            <li>控制文件大小</li>
                            <li>适当拆分组件</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="component-structure">
                <h3>组件结构示例</h3>
                <div class="component-example">
                    <pre><code>components/
├── Button/
│   ├── index.tsx      # 组件入口
│   ├── styles.css     # 样式文件
│   ├── types.ts       # 类型定义
│   └── tests/         # 测试文件
│       ├── Button.test.tsx
│       └── __snapshots__/
├── Form/
│   ├── index.tsx
│   ├── FormField.tsx
│   ├── FormLabel.tsx
│   └── styles/
│       ├── index.css
│       └── themes/
└── Layout/
    ├── index.tsx
    ├── Header.tsx
    └── Footer.tsx</code></pre>
                </div>
            </section>

            <section class="file-organization">
                <h3>文件组织技巧</h3>
                <div class="tips-grid">
                    <div class="tip-item">
                        <i class="fas fa-folder-tree"></i>
                        <h4>目录结构</h4>
                        <ul>
                            <li>使用index文件导出模块</li>
                            <li>相关文件放在同一目录</li>
                            <li>避免循环依赖</li>
                        </ul>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-code-branch"></i>
                        <h4>代码分割</h4>
                        <ul>
                            <li>按路由分割代码</li>
                            <li>使用动态导入</li>
                            <li>提取共用模块</li>
                        </ul>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-cubes"></i>
                        <h4>模块化原则</h4>
                        <ul>
                            <li>高内聚，低耦合</li>
                            <li>单一职责原则</li>
                            <li>封装实现细节</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="configuration">
                <h3>配置文件管理</h3>
                <div class="config-example">
                    <pre><code>config/
├── default.js        # 默认配置
├── development.js    # 开发环境配置
├── production.js     # 生产环境配置
├── test.js          # 测试环境配置
└── types.ts         # 配置类型定义</code></pre>
                    <div class="config-tips">
                        <p>配置文件建议：</p>
                        <ul>
                            <li>使用环境变量管理敏感信息</li>
                            <li>配置文件版本控制</li>
                            <li>使用类型定义确保类型安全</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="testing-structure">
                <h3>测试文件组织</h3>
                <div class="test-structure">
                    <pre><code>tests/
├── unit/            # 单元测试
│   ├── components/
│   └── utils/
├── integration/     # 集成测试
│   └── api/
├── e2e/            # 端到端测试
│   └── flows/
└── fixtures/       # 测试数据</code></pre>
                    <div class="test-tips">
                        <p>测试文件组织建议：</p>
                        <ul>
                            <li>测试文件与源文件结构对应</li>
                            <li>使用描述性的测试名称</li>
                            <li>合理组织测试套件</li>
                        </ul>
                    </div>
                </div>
            </section>

            <section class="common-pitfalls">
                <h3>常见问题与解决方案</h3>
                <div class="pitfall-list">
                    <div class="pitfall-item">
                        <h4>❌ 问题：目录结构过深</h4>
                        <p>解决方案：保持最多3-4层目录深度，使用更好的命名代替深层嵌套</p>
                    </div>
                    <div class="pitfall-item">
                        <h4>❌ 问题：文件过大</h4>
                        <p>解决方案：将大文件拆分为多个小文件，每个文件专注于单一功能</p>
                    </div>
                    <div class="pitfall-item">
                        <h4>❌ 问题：循环依赖</h4>
                        <p>解决方案：重新设计模块边界，提取共用逻辑到独立模块</p>
                    </div>
                </div>
            </section>

            <section class="next-steps">
                <h3>下一步</h3>
                <p>
                    了解了项目结构最佳实践后，建议继续阅读
                    <a href="#/best-practices/official/coding-standards">编码规范指南</a>
                    来提升代码质量。
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

        .structure-example, .component-example, .config-example, .test-structure {
            background: var(--surface-2);
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
        }

        pre {
            background: var(--surface-3);
            padding: 15px;
            border-radius: 4px;
            overflow-x: auto;
            margin: 0;
        }

        code {
            font-family: 'Fira Code', monospace;
        }

        .principle-list {
            display: grid;
            gap: 20px;
            margin: 20px 0;
        }

        .principle-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        .principle-item ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .tips-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }

        .tip-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
        }

        .tip-item i {
            font-size: 24px;
            color: var(--primary-color);
            margin-bottom: 10px;
        }

        .tip-item ul {
            margin: 10px 0;
            padding-left: 20px;
        }

        .config-tips, .test-tips {
            margin-top: 15px;
            padding: 15px;
            background: var(--surface-1);
            border-radius: 4px;
        }

        .pitfall-list {
            display: grid;
            gap: 20px;
            margin: 20px 0;
        }

        .pitfall-item {
            padding: 20px;
            background: var(--surface-2);
            border-radius: 8px;
            border-left: 4px solid var(--error-color);
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