/**
 * 简体中文语言包
 */

export default {
    meta: {
        name: '简体中文',
        nativeName: '简体中文',
        code: 'zh-CN',
        direction: 'ltr'
    },
    
    // 通用
    common: {
        loading: '加载中...',
        error: '错误',
        success: '成功',
        cancel: '取消',
        confirm: '确认',
        close: '关闭',
        save: '保存',
        edit: '编辑',
        delete: '删除',
        search: '搜索',
        filter: '筛选',
        sort: '排序',
        more: '更多',
        less: '收起',
        viewAll: '查看全部',
        learnMore: '了解更多',
        getStarted: '立即开始',
        download: '下载',
        documentation: '文档',
        website: '官网',
        github: 'GitHub',
        changelog: '更新日志',
        support: '支持',
        contact: '联系我们',
        about: '关于',
        privacy: '隐私政策',
        terms: '服务条款',
        type: '类型'
    },
    
    // 语言
    languages: {
        'zh-CN': '简体中文',
        'en-US': 'English'
    },
    
    // 网站头部
    header: {
        logo: 'AITOOLBOX',
        navigation: {
            tools: '工具总览',
            compare: '工具对比',
            tutorials: '学习中心',
            updates: '更新动态',
            devtools: '开发工具',
            language: '语言'
        },
        devtools: {
            json: 'JSON解析器',
            diff: '文本对比',
            cron: 'Cron表达式',
            timestamp: '时间戳转换',
            qrcode: '二维码生成',
            regex: '正则表达式'
        },
        cta: '立即获取'
    },
    
    // 首页内容
    home: {
        hero: {
            title: '智能无限，协作无间',
            subtitle: 'AITOOLBOX，致力于成为真正的 AI 工程师。以智能生产力为核心，无缝融入你的开发流程，与你默契配合，更高质量、高效率完成每一个任务。',
            primaryButton: '立即获取 AITOOLBOX',
            secondaryButton: '查看所有下载选项'
        },
        featuredTools: {
            title: '精选AI工具集合',
            subtitle: '发现并对比最优秀的AI编程助手工具',
            stats: {
                number: '50+',
                label: '优质工具'
            }
        },
        toolsGrid: {
            title: '全面的AI工具生态',
            subtitle: '从代码编辑到智能助手，我们为您精选了最优秀的AI工具',
            categories: {
                editors: '代码编辑器',
                assistants: '智能助手',
                productivity: '生产力工具',
                collaboration: '协作工具'
            }
        },
        features: {
            title: '为什么选择我们',
            subtitle: '专业的AI工具推荐和深度对比分析',
            items: [
                {
                    title: '专业评测',
                    description: '深度测试每个工具的功能特性和性能表现'
                },
                {
                    title: '实时更新',
                    description: '持续跟踪工具更新，确保信息的准确性'
                },
                {
                    title: '详细对比',
                    description: '多维度对比分析，帮助您选择最适合的工具'
                },
                {
                    title: '使用指南',
                    description: '提供详细的使用教程和最佳实践'
                }
            ]
        }
    },
    
    // 工具相关
    tools: {
        categories: {
            editor: 'AI代码编辑器',
            assistant: '智能助手',
            productivity: '生产力工具',
            collaboration: '协作工具'
        },
        status: {
            hot: '🔥 热门',
            new: '✨ 新品',
            updated: '已更新',
            featured: '精选',
            stable: '🛡️ 稳定',
            powerful: '⚡ 强大',
            local: '🏠 本土',
            professional: '👑 专业',
            educational: '🎓 教育'
        },
        pricing: {
            free: '免费',
            freemium: '免费试用',
            paid: '付费',
            enterprise: '企业版'
        },
        details: {
            features: '功能特性',
            pros: '优点',
            cons: '缺点',
            pricing: '价格',
            platforms: '支持平台',
            languages: '支持语言',
            rating: '评分',
            users: '用户数',
            updated: '更新时间',
            website: '官方网站',
            documentation: '文档',
            github: 'GitHub',
            changelog: '更新日志',
            status: '工具状态'
        },
        actions: {
            viewDetails: '查看详情',
            compare: '对比',
            addToCompare: '添加到对比',
            removeFromCompare: '从对比中移除',
            visitWebsite: '访问官网',
            viewDocs: '查看文档',
            download: '下载'
        },
        moreFeatures: '还有{{count}}个功能'
    },
    
    // 工具对比
    compare: {
        title: '工具对比',
        subtitle: '并排对比多个工具的功能特性',
        empty: '暂无对比工具',
        addTool: '添加工具',
        removeTool: '移除工具',
        clearAll: '清空所有',
        categories: {
            basic: '基本信息',
            features: '功能特性',
            pricing: '价格方案',
            support: '支持情况',
            community: '社区活跃度'
        }
    },
    
    // 筛选和排序
    filters: {
        typeLabel: '类型筛选：',
        priceLabel: '价格筛选：',
        sortLabel: '排序方式：',
        typeOptions: {
            all: '全部类型',
            ide: 'IDE插件',
            standalone: '独立应用',
            web: 'Web应用',
            api: 'API服务'
        },
        priceOptions: {
            all: '全部价格',
            free: '免费',
            freemium: '免费+付费',
            paid: '付费'
        },
        sortOptions: {
            popularity: '热门程度',
            name: '名称排序',
            rating: '评分排序',
            updated: '更新时间',
            users: '用户数量'
        }
    },
    
    // 界面文本
    ui: {
        loading: '正在加载工具数据...',
        compareButton: '对比选中的工具',
        compareCount: '0',
        viewAll: '查看全部',
        compareAnalysis: '工具对比分析',
        learningCenter: '学习中心',
        learningSubtitle: '从入门到精通的完整学习路径',
        updateNews: '更新动态',
        updateSubtitle: '及时了解AI工具的最新发展',
        tutorialCategories: {
            beginner: '入门指南',
            intermediate: '进阶技巧',
            advanced: '专家级应用',
            bestPractices: '最佳实践'
        }
    },
    
    // 页脚
    footer: {
        description: '专业的AI工具箱平台，为开发者提供全面的智能开发解决方案。',
        sections: {
            product: '产品',
            developer: '开发者',
            support: '支持'
        },
        links: {
            toolsOverview: '工具总览',
            compareTools: '工具对比',
            learningCenter: '学习中心',
            apiDocs: 'API 文档',
            integrationGuide: '集成指南',
            developerCommunity: '开发者社区',
            github: 'GitHub',
            helpCenter: '帮助中心',
            contactUs: '联系我们',
            statusPage: '状态页面',
            rssSubscribe: 'RSS订阅'
        },
        copyright: '© 2024 AITOOLBOX. 智能无限，协作无间。'
    },
    
    // 搜索和筛选
    search: {
        placeholder: '搜索工具名称或功能...',
        noResults: '未找到匹配的工具',
        results: '找到 {{count}} 个工具',
        filters: {
            category: '分类',
            pricing: '价格',
            platform: '平台',
            language: '语言',
            status: '状态'
        },
        sort: {
            name: '名称',
            rating: '评分',
            users: '用户数',
            updated: '更新时间'
        }
    },
    
    // 页面标题和描述
    meta: {
        title: 'AITOOLBOX - 智能无限，协作无间',
        description: 'AITOOLBOX，致力于成为真正的 AI 工程师。以智能生产力为核心，无缝融入你的开发流程，与你默契配合，更高质量、高效率完成每一个任务。',
        keywords: 'AITOOLBOX,AI工具箱,智能开发,AI编程工具,人工智能,编程助手,代码生成,智能协作'
    },
    
    // 错误信息
    errors: {
        networkError: '网络连接错误，请检查您的网络设置',
        loadingError: '加载失败，请稍后重试',
        notFound: '页面未找到',
        serverError: '服务器错误，请稍后重试',
        unknownError: '未知错误，请稍后重试'
    },
    
    // 成功信息
    success: {
        saved: '保存成功',
        updated: '更新成功',
        deleted: '删除成功',
        copied: '复制成功'
    },
    
    // 主题切换
    theme: {
        title: '主题',
        switchTheme: '切换主题',
        selectTheme: '选择主题',
        personalizeExperience: '个性化您的体验',
        preferencesAutoSaved: '主题偏好会自动保存',
        notifications: {
            switched: '主题已更换',
            switchFailed: '主题切换失败',
            switchError: '主题切换出错'
        },
        themes: {
            default: {
                name: '默认',
                description: '清新简洁的默认主题'
            },
            dark: {
                name: '深色',
                description: '护眼的深色主题'
            },
            blue: {
                name: '海洋蓝',
                description: '清新的蓝色主题'
            },
            green: {
                name: '森林绿',
                description: '自然的绿色主题'
            },
            purple: {
                name: '紫罗兰',
                description: '优雅的紫色主题'
            },
            auto: {
                name: '跟随系统',
                description: '自动跟随系统主题偏好'
            }
        }
    },
    
    // 开发工具
    devtools: {
        title: '开发工具',
        json: {
            title: 'JSON解析器',
            description: '格式化和验证JSON数据',
            placeholder: '在此输入JSON数据...'
        },
        diff: {
            title: '文本对比',
            description: '比较两个文本的差异',
            left: '原文本',
            right: '新文本'
        },
        cron: {
            title: 'Cron表达式',
            description: '生成和验证Cron表达式',
            placeholder: '输入Cron表达式...'
        },
        timestamp: {
            title: '时间戳转换',
            description: '时间戳和日期时间互相转换',
            current: '当前时间戳',
            convert: '转换'
        },
        qrcode: {
            title: '二维码生成',
            description: '生成各种类型的二维码',
            placeholder: '输入要生成二维码的内容...'
        },
        regex: {
            title: '正则表达式',
            description: '测试和验证正则表达式',
            pattern: '正则表达式',
            text: '测试文本',
            flags: '标志'
        }
    }
};

// URL映射配置
export const urlMappings = {
    // Cursor相关链接
    cursor: {
        website: 'https://cursor.sh',
        documentation: 'https://cursordocs.com',
        github: 'https://github.com/getcursor/cursor',
        changelog: 'https://cursordocs.com/changelog'
    },
    
    // Claude相关链接
    claude: {
        website: 'https://claude.ai',
        documentation: 'https://docs.anthropic.com',
        github: 'https://github.com/anthropics/claude-api',
        changelog: 'https://docs.anthropic.com/claude/changelog'
    },
    
    // GitHub Copilot相关链接
    copilot: {
        website: 'https://github.com/features/copilot',
        documentation: 'https://docs.github.com/zh/copilot',
        github: 'https://github.com/github/copilot',
        changelog: 'https://docs.github.com/zh/copilot/changelog'
    },
    
    // Gemini相关链接
    gemini: {
        website: 'https://gemini.google.com',
        documentation: 'https://ai.google.dev/docs',
        github: 'https://github.com/google/generative-ai',
        changelog: 'https://ai.google.dev/docs/changelog'
    },
    
    // 通义千问相关链接
    tongyi: {
        website: 'https://tongyi.aliyun.com',
        documentation: 'https://help.aliyun.com/zh/dashscope',
        github: 'https://github.com/alibaba/tongyi',
        changelog: 'https://help.aliyun.com/zh/dashscope/changelog'
    },
    
    // Windsurf相关链接
    windsurf: {
        website: 'https://windsurf.ai',
        documentation: 'https://docs.windsurf.ai',
        github: 'https://github.com/windsurf-ai/windsurf',
        changelog: 'https://docs.windsurf.ai/changelog'
    },
    
    // Codeium相关链接
    codeium: {
        website: 'https://codeium.com',
        documentation: 'https://docs.codeium.com',
        github: 'https://github.com/codeium/codeium',
        changelog: 'https://docs.codeium.com/changelog'
    }
}; 