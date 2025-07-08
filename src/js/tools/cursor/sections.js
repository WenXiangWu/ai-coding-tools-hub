/**
 * Cursor工具详情页导航结构配置
 */
export default {
    // 前言部分
    introduction: {
        title: '前言',
        icon: 'fas fa-info-circle',
        items: [
            {
                id: 'what_is_cursor',
                title: '什么是Cursor',
                description: 'Cursor编辑器简介'
            },
            {
                id: 'why_cursor',
                title: '为什么选择Cursor',
                description: 'Cursor的核心优势'
            },
            {
                id: 'core_features',
                title: '核心特性',
                description: 'Cursor主要功能介绍'
            }
        ]
    },

    // 教程部分
    tutorials: {
        title: '教程',
        icon: 'fas fa-book',
        items: [
            {
                id: 'learning_path',
                title: '学习路线',
                description: 'Cursor学习路线图',
                items: [
                    {
                        id: 'env_setup',
                        title: '环境安装',
                        description: '安装和配置Cursor'
                    },
                    {
                        id: 'basic_concepts',
                        title: '基础概念',
                        description: 'Cursor的基本概念和术语'
                    },
                    {
                        id: 'mini_program',
                        title: '编写小程序',
                        description: '使用Cursor开发小程序',
                        items: [
                            {
                                id: 'mini_program_setup',
                                title: '项目设置',
                                description: '小程序项目初始化'
                            },
                            {
                                id: 'mini_program_dev',
                                title: '开发流程',
                                description: '使用Cursor开发小程序的流程'
                            },
                            {
                                id: 'mini_program_debug',
                                title: '调试技巧',
                                description: '小程序开发调试技巧'
                            }
                        ]
                    }
                ]
            },
            {
                id: 'basic_tutorial',
                title: '入门教程',
                description: 'Cursor基础入门',
                items: [
                    {
                        id: 'interface_intro',
                        title: '界面介绍',
                        description: 'Cursor界面布局和功能区介绍'
                    },
                    {
                        id: 'basic_operations',
                        title: '基本操作',
                        description: '常用操作和快捷键'
                    },
                    {
                        id: 'ai_features',
                        title: 'AI功能',
                        description: 'AI编程辅助功能介绍'
                    }
                ]
            },
            {
                id: 'advanced_tutorial',
                title: '进阶教程',
                description: 'Cursor高级特性',
                items: [
                    {
                        id: 'composer_guide',
                        title: 'Composer使用指南',
                        description: '多文件编辑功能详解'
                    },
                    {
                        id: 'ai_prompts',
                        title: 'AI提示优化',
                        description: '如何编写高效的AI提示'
                    },
                    {
                        id: 'custom_settings',
                        title: '自定义配置',
                        description: '个性化设置和优化'
                    }
                ]
            },
            {
                id: 'projects',
                title: '实战项目',
                description: '真实项目开发案例',
                items: [
                    {
                        id: 'web_app',
                        title: 'Web应用开发',
                        description: '使用Cursor开发Web应用'
                    },
                    {
                        id: 'api_service',
                        title: 'API服务开发',
                        description: '使用Cursor开发API服务'
                    },
                    {
                        id: 'data_analysis',
                        title: '数据分析项目',
                        description: '使用Cursor进行数据分析'
                    }
                ]
            },
            {
                id: 'faq',
                title: '常见问题',
                description: '常见问题解答',
                items: [
                    {
                        id: 'installation_issues',
                        title: '安装问题',
                        description: '安装相关的常见问题'
                    },
                    {
                        id: 'ai_issues',
                        title: 'AI功能问题',
                        description: 'AI功能相关的常见问题'
                    },
                    {
                        id: 'performance_issues',
                        title: '性能问题',
                        description: '性能相关的常见问题'
                    }
                ]
            }
        ]
    },

    // 最佳实践部分
    bestPractices: {
        title: '最佳实践',
        icon: 'fas fa-check-circle',
        items: [
            {
                id: 'official_practices',
                title: '官方最佳实践',
                description: 'Cursor官方推荐的最佳实践',
                items: [
                    {
                        id: 'project_structure',
                        title: '项目结构',
                        description: '推荐的项目组织方式'
                    },
                    {
                        id: 'coding_standards',
                        title: '编码规范',
                        description: '代码质量和风格指南'
                    },
                    {
                        id: 'ai_collaboration',
                        title: 'AI协作模式',
                        description: '如何与AI助手高效协作'
                    }
                ]
            },
            {
                id: 'development_experience',
                title: '开发经验',
                description: '社区开发经验分享',
                items: [
                    {
                        id: 'workflow_optimization',
                        title: '工作流优化',
                        description: '提升开发效率的经验'
                    },
                    {
                        id: 'debugging_skills',
                        title: '调试技巧',
                        description: '高效的调试方法'
                    },
                    {
                        id: 'performance_tuning',
                        title: '性能调优',
                        description: '编辑器性能优化建议'
                    }
                ]
            },
            {
                id: 'team_practices',
                title: '团队落地实践',
                description: '团队使用Cursor的实践经验',
                items: [
                    {
                        id: 'team_workflow',
                        title: '团队工作流',
                        description: '团队协作最佳实践'
                    },
                    {
                        id: 'code_review',
                        title: '代码审查',
                        description: '使用Cursor进行代码审查'
                    },
                    {
                        id: 'training_guide',
                        title: '培训指南',
                        description: '团队成员培训建议'
                    }
                ]
            }
        ]
    },

    // 相关链接部分
    links: {
        title: '相关链接',
        icon: 'fas fa-link',
        items: [
            {
                id: 'website',
                title: '官方网站',
                url: 'https://cursor.sh',
                description: 'Cursor官方网站'
            },
            {
                id: 'documentation',
                title: '官方文档',
                url: 'https://cursor.sh/docs',
                description: 'Cursor官方文档'
            },
            {
                id: 'github',
                title: 'GitHub',
                url: 'https://github.com/getcursor/cursor',
                description: 'Cursor GitHub仓库'
            },
            {
                id: 'changelog',
                title: '更新日志',
                url: 'https://cursor.sh/changelog',
                description: 'Cursor版本更新记录'
            }
        ]
    }
}; 