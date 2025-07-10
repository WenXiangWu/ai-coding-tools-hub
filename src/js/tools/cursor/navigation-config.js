/**
 * Cursor工具详情页导航配置
 */
export default {
    tabs: [
        {
            id: "introduction",
            title: "前言",
            icon: "fas fa-info-circle",
            children: [
                {
                    id: "what_is_cursor",
                    title: "什么是Cursor",
                    icon: "fas fa-question-circle",
                    description: "Cursor编辑器简介",
                    content: "../tools/cursor/content/introduction/what-is-cursor.js"
                },
                {
                    id: "why_cursor",
                    title: "为什么选择Cursor",
                    icon: "fas fa-check-double",
                    description: "Cursor的核心优势",
                    content: "../tools/cursor/content/introduction/why-cursor.js"
                },
                {
                    id: "core_features",
                    title: "核心特性",
                    icon: "fas fa-star",
                    description: "Cursor主要功能介绍",
                    content: "../tools/cursor/content/introduction/core-features.js"
                }
            ]
        },
        {
            id: "tutorials",
            title: "教程",
            icon: "fas fa-book",
            children: [
                {
                    id: "learning_path",
                    title: "学习路线",
                    icon: "fas fa-route",
                    description: "Cursor学习路线图",
                    content: "../tools/cursor/content/learning-path/index.js",
                    children: [
                        {
                            id: "env_setup",
                            title: "环境安装",
                            icon: "fas fa-download",
                            description: "安装和配置Cursor",
                            content: "../tools/cursor/content/env_setup.js"
                        },
                        {
                            id: "basic_concepts",
                            title: "基础概念",
                            icon: "fas fa-book-open",
                            description: "Cursor的基本概念和术语",
                            content: "../tools/cursor/content/tutorials/basic/basic-concepts.js"
                        },
                        {
                            id: "mini_program",
                            title: "编写小程序",
                            icon: "fas fa-code",
                            description: "使用Cursor开发小程序",
                            content: "../tools/cursor/content/tutorials/learning-path/mini-program/setup.js"
                        }
                    ]
                },
                {
                    id: "basic_tutorials",
                    title: "入门教程",
                    icon: "fas fa-graduation-cap",
                    description: "Cursor基础入门",
                    children: [
                        {
                            id: "interface_intro",
                            title: "界面介绍",
                            icon: "fas fa-desktop",
                            description: "Cursor界面布局和功能区介绍",
                            content: "../tools/cursor/content/tutorials/basic/interface-intro.js"
                        },
                        {
                            id: "basic_operations",
                            title: "基本操作",
                            icon: "fas fa-mouse-pointer",
                            description: "常用操作和快捷键",
                            content: "../tools/cursor/content/tutorials/basic/basic-operations.js"
                        },
                        {
                            id: "ai_features",
                            title: "AI功能",
                            icon: "fas fa-robot",
                            description: "AI编程辅助功能介绍",
                            content: "../tools/cursor/content/tutorials/basic/ai-features.js"
                        }
                    ]
                },
                {
                    id: "advanced_tutorials",
                    title: "进阶教程",
                    icon: "fas fa-laptop-code",
                    description: "Cursor高级特性",
                    children: [
                        {
                            id: "composer_guide",
                            title: "Composer使用指南",
                            icon: "fas fa-layer-group",
                            description: "多文件编辑功能详解",
                            content: "../tools/cursor/content/tutorials/advanced/composer-guide.js"
                        },
                        {
                            id: "ai_prompts",
                            title: "AI提示优化",
                            icon: "fas fa-comment-dots",
                            description: "如何编写高效的AI提示",
                            content: "../tools/cursor/content/tutorials/advanced/ai-prompts.js"
                        },
                        {
                            id: "custom_settings",
                            title: "自定义配置",
                            icon: "fas fa-sliders-h",
                            description: "个性化设置和优化",
                            content: "../tools/cursor/content/tutorials/advanced/custom-settings.js"
                        }
                    ]
                },
                {
                    id: "projects",
                    title: "实战项目",
                    icon: "fas fa-project-diagram",
                    description: "真实项目开发案例",
                    children: [
                        {
                            id: "web_app",
                            title: "Web应用开发",
                            icon: "fas fa-globe",
                            description: "使用Cursor开发Web应用",
                            content: "../tools/cursor/content/tutorials/projects/web-app.js"
                        },
                        {
                            id: "api_service",
                            title: "API服务开发",
                            icon: "fas fa-server",
                            description: "使用Cursor开发API服务",
                            content: "../tools/cursor/content/tutorials/projects/api-service.js"
                        },
                        {
                            id: "data_analysis",
                            title: "数据分析项目",
                            icon: "fas fa-chart-bar",
                            description: "使用Cursor进行数据分析",
                            content: "../tools/cursor/content/tutorials/projects/data-analysis.js"
                        }
                    ]
                },
                {
                    id: "faq",
                    title: "常见问题",
                    icon: "fas fa-question-circle",
                    description: "常见问题解答",
                    children: [
                        {
                            id: "installation_issues",
                            title: "安装问题",
                            icon: "fas fa-download",
                            description: "安装相关的常见问题",
                            content: "../tools/cursor/content/tutorials/faq/installation-issues.js"
                        },
                        {
                            id: "ai_issues",
                            title: "AI功能问题",
                            icon: "fas fa-robot",
                            description: "AI功能相关的常见问题",
                            content: "../tools/cursor/content/tutorials/faq/ai-issues.js"
                        },
                        {
                            id: "performance_issues",
                            title: "性能问题",
                            icon: "fas fa-tachometer-alt",
                            description: "性能相关的常见问题",
                            content: "../tools/cursor/content/tutorials/faq/performance-issues.js"
                        }
                    ]
                }
            ]
        },
        {
            id: "best_practices",
            title: "最佳实践",
            icon: "fas fa-check-circle",
            children: [
                {
                    id: "official_practices",
                    title: "官方最佳实践",
                    icon: "fas fa-certificate",
                    description: "Cursor官方推荐的最佳实践",
                    children: [
                        {
                            id: "project_structure",
                            title: "项目结构",
                            icon: "fas fa-folder-tree",
                            description: "推荐的项目组织方式",
                            content: "../tools/cursor/content/best-practices/official/project-structure.js"
                        },
                        {
                            id: "coding_standards",
                            title: "编码规范",
                            icon: "fas fa-code",
                            description: "代码质量和风格指南",
                            content: "../tools/cursor/content/best-practices/official/coding-standards.js"
                        },
                        {
                            id: "ai_collaboration",
                            title: "AI协作模式",
                            icon: "fas fa-users-cog",
                            description: "如何与AI助手高效协作",
                            content: "../tools/cursor/content/best-practices/official/ai-collaboration.js"
                        }
                    ]
                },
                {
                    id: "user_experiences",
                    title: "使用经验",
                    icon: "fas fa-lightbulb",
                    description: "社区开发经验分享",
                    children: [
                        {
                            id: "workflow_optimization",
                            title: "工作流优化",
                            icon: "fas fa-tasks",
                            description: "提升开发效率的经验",
                            content: "../tools/cursor/content/best-practices/development/workflow-optimization.js"
                        },
                        {
                            id: "debugging_skills",
                            title: "调试技巧",
                            icon: "fas fa-bug",
                            description: "高效的调试方法",
                            content: "../tools/cursor/content/best-practices/development/debugging-skills.js"
                        },
                        {
                            id: "performance_tuning",
                            title: "性能调优",
                            icon: "fas fa-tachometer-alt",
                            description: "编辑器性能优化建议",
                            content: "../tools/cursor/content/best-practices/development/performance-tuning.js"
                        }
                    ]
                },
                {
                    id: "team_practices",
                    title: "团队实践",
                    icon: "fas fa-users",
                    description: "团队使用Cursor的实践经验",
                    children: [
                        {
                            id: "team_workflow",
                            title: "团队工作流",
                            icon: "fas fa-sitemap",
                            description: "团队协作最佳实践",
                            content: "../tools/cursor/content/best-practices/team/team-workflow.js"
                        },
                        {
                            id: "code_review",
                            title: "代码审查",
                            icon: "fas fa-code-branch",
                            description: "使用Cursor进行代码审查",
                            content: "../tools/cursor/content/best-practices/team/code-review.js"
                        },
                        {
                            id: "training_guide",
                            title: "培训指南",
                            icon: "fas fa-chalkboard-teacher",
                            description: "团队成员培训建议",
                            content: "../tools/cursor/content/best-practices/team/training-guide.js"
                        }
                    ]
                }
            ]
        },
        {
            id: "links",
            title: "相关链接",
            icon: "fas fa-link",
            children: [
                {
                    id: "website",
                    title: "官方网站",
                    icon: "fas fa-globe",
                    url: "https://cursor.sh",
                    description: "Cursor官方网站",
                    external: true
                },
                {
                    id: "documentation",
                    title: "官方文档",
                    icon: "fas fa-book",
                    url: "https://cursor.sh/docs",
                    description: "Cursor官方文档",
                    external: true
                },
                {
                    id: "github",
                    title: "GitHub",
                    icon: "fab fa-github",
                    url: "https://github.com/getcursor/cursor",
                    description: "Cursor GitHub仓库",
                    external: true
                },
                {
                    id: "changelog",
                    title: "更新日志",
                    icon: "fas fa-history",
                    url: "https://cursor.sh/changelog",
                    description: "Cursor版本更新记录",
                    external: true
                }
            ]
        }
    ],
    welcome: {
        title: "Cursor 学习中心",
        subtitle: "革命性的AI代码编辑器",
        description: "基于GPT-4构建，提供智能代码补全、自然语言编程和实时代码解释。完美融合传统编程体验与AI创新。",
        heroImage: "../../design/icon/cursor.svg",
        features: [
            {
                title: "智能代码补全",
                description: "基于上下文的智能代码补全，提高编码效率",
                icon: "fas fa-code"
            },
            {
                title: "自然语言编程",
                description: "使用自然语言描述需求，AI自动生成代码",
                icon: "fas fa-comment-alt"
            },
            {
                title: "实时代码解释",
                description: "一键解释复杂代码，快速理解功能逻辑",
                icon: "fas fa-lightbulb"
            },
            {
                title: "多文件编辑",
                description: "强大的Composer功能，同时处理多个文件",
                icon: "fas fa-layer-group"
            }
        ]
    }
}; 