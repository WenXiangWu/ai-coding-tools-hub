/**
 * English (US) Language Pack
 */

export default {
    meta: {
        name: 'English',
        nativeName: 'English',
        code: 'en-US',
        direction: 'ltr'
    },
    
    // Common
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        confirm: 'Confirm',
        close: 'Close',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        more: 'More',
        less: 'Less',
        viewAll: 'View All',
        learnMore: 'Learn More',
        getStarted: 'Get Started',
        download: 'Download',
        documentation: 'Documentation',
        website: 'Website',
        github: 'GitHub',
        changelog: 'Changelog',
        support: 'Support',
        contact: 'Contact Us',
        about: 'About',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
    },
    
    // Languages
    languages: {
        'zh-CN': '简体中文',
        'en-US': 'English'
    },
    
    // Header
    header: {
        logo: 'AITOOLBOX',
        navigation: {
            tools: 'Tools Overview',
            compare: 'Compare Tools',
            tutorials: 'Learning Center',
            devtools: 'Dev Tools',
            language: 'Language'
        },
        devtools: {
            json: 'JSON Parser',
            diff: 'Text Diff',
            cron: 'Cron Expression',
            timestamp: 'Timestamp Converter',
            qrcode: 'QR Code Generator',
            regex: 'Regular Expression'
        },
        cta: 'Get Started'
    },
    
    // Home Content
    home: {
        hero: {
            title: 'Intelligent Unlimited, Seamless Collaboration',
            subtitle: 'AITOOLBOX is committed to becoming a true AI engineer. With intelligent productivity at its core, it seamlessly integrates into your development workflow, working in perfect harmony with you to complete every task with higher quality and efficiency.',
            primaryButton: 'Get AITOOLBOX Now',
            secondaryButton: 'View All Download Options'
        },
        featuredTools: {
            title: 'Featured AI Tools Collection',
            subtitle: 'Discover and compare the best AI programming assistant tools',
            stats: {
                number: '50+',
                label: 'Quality Tools'
            }
        },
        toolsGrid: {
            title: 'Comprehensive AI Tools Ecosystem',
            subtitle: 'From code editors to intelligent assistants, we curate the best AI tools for you',
            categories: {
                editors: 'Code Editors',
                assistants: 'AI Assistants',
                productivity: 'Productivity Tools',
                collaboration: 'Collaboration Tools'
            }
        },
        features: {
            title: 'Why Choose Us',
            subtitle: 'Professional AI tool recommendations and in-depth comparative analysis',
            items: [
                {
                    title: 'Professional Testing',
                    description: 'In-depth testing of each tool\'s features and performance'
                },
                {
                    title: 'Real-time Updates',
                    description: 'Continuous tracking of tool updates to ensure accuracy'
                },
                {
                    title: 'Detailed Comparison',
                    description: 'Multi-dimensional comparative analysis to help you choose the best tool'
                },
                {
                    title: 'Usage Guide',
                    description: 'Provide detailed tutorials and best practices'
                }
            ]
        }
    },
    
    // Tools
    tools: {
        categories: {
            editor: 'AI Code Editor',
            assistant: 'AI Assistant',
            productivity: 'Productivity Tool',
            collaboration: 'Collaboration Tool'
        },
        status: {
            hot: 'Hot',
            new: 'New',
            updated: 'Updated',
            featured: 'Featured'
        },
        pricing: {
            free: 'Free',
            freemium: 'Freemium',
            paid: 'Paid',
            enterprise: 'Enterprise'
        },
        details: {
            features: 'Features',
            pros: 'Pros',
            cons: 'Cons',
            pricing: 'Pricing',
            platforms: 'Platforms',
            languages: 'Languages',
            rating: 'Rating',
            users: 'Users',
            updated: 'Updated',
            website: 'Website',
            documentation: 'Documentation',
            github: 'GitHub',
            changelog: 'Changelog'
        },
        actions: {
            viewDetails: 'View Details',
            compare: 'Compare',
            addToCompare: 'Add to Compare',
            removeFromCompare: 'Remove from Compare',
            visitWebsite: 'Visit Website',
            viewDocs: 'View Docs',
            download: 'Download'
        }
    },
    
    // Compare
    compare: {
        title: 'Tool Comparison',
        subtitle: 'Compare multiple tools side by side',
        empty: 'No tools to compare',
        addTool: 'Add Tool',
        removeTool: 'Remove Tool',
        clearAll: 'Clear All',
        categories: {
            basic: 'Basic Info',
            features: 'Features',
            pricing: 'Pricing',
            support: 'Support',
            community: 'Community'
        }
    },
    
    // Search and Filter
    search: {
        placeholder: 'Search tool name or features...',
        noResults: 'No matching tools found',
        results: 'Found {{count}} tools',
        filters: {
            category: 'Category',
            pricing: 'Pricing',
            platform: 'Platform',
            language: 'Language',
            status: 'Status'
        },
        sort: {
            name: 'Name',
            rating: 'Rating',
            users: 'Users',
            updated: 'Updated'
        }
    },
    
    // Page Meta
    meta: {
        title: 'AITOOLBOX - Intelligent Unlimited, Seamless Collaboration',
        description: 'AITOOLBOX is committed to becoming a true AI engineer. With intelligent productivity at its core, it seamlessly integrates into your development workflow, working in perfect harmony with you to complete every task with higher quality and efficiency.',
        keywords: 'AITOOLBOX,AI toolbox,intelligent development,AI programming tools,artificial intelligence,programming assistant,code generation,intelligent collaboration'
    },
    
    // Error Messages
    errors: {
        networkError: 'Network connection error, please check your network settings',
        loadingError: 'Loading failed, please try again later',
        notFound: 'Page not found',
        serverError: 'Server error, please try again later',
        unknownError: 'Unknown error, please try again later'
    },
    
    // Success Messages
    success: {
        saved: 'Saved successfully',
        updated: 'Updated successfully',
        deleted: 'Deleted successfully',
        copied: 'Copied successfully'
    },
    
    // Theme
    theme: {
        title: 'Theme Settings',
        light: 'Light Theme',
        dark: 'Dark Theme',
        auto: 'Follow System',
        themes: {
            default: 'Default',
            dark: 'Dark',
            blue: 'Blue',
            green: 'Green',
            purple: 'Purple'
        }
    },
    
    // Dev Tools
    devtools: {
        title: 'Developer Tools',
        json: {
            title: 'JSON Parser',
            description: 'Format and validate JSON data',
            placeholder: 'Enter JSON data here...'
        },
        diff: {
            title: 'Text Diff',
            description: 'Compare differences between two texts',
            left: 'Original Text',
            right: 'New Text'
        },
        cron: {
            title: 'Cron Expression',
            description: 'Generate and validate Cron expressions',
            placeholder: 'Enter Cron expression...'
        },
        timestamp: {
            title: 'Timestamp Converter',
            description: 'Convert between timestamps and datetime',
            current: 'Current Timestamp',
            convert: 'Convert'
        },
        qrcode: {
            title: 'QR Code Generator',
            description: 'Generate various types of QR codes',
            placeholder: 'Enter content to generate QR code...'
        },
        regex: {
            title: 'Regular Expression',
            description: 'Test and validate regular expressions',
            pattern: 'Regular Expression',
            text: 'Test Text',
            flags: 'Flags'
        }
    }
};

// URL mappings configuration
export const urlMappings = {
    // Cursor related links
    cursor: {
        website: 'https://cursor.sh',
        documentation: 'https://docs.cursor.com',
        github: 'https://github.com/getcursor/cursor',
        changelog: 'https://docs.cursor.com/changelog'
    },
    
    // Claude related links
    claude: {
        website: 'https://claude.ai',
        documentation: 'https://docs.anthropic.com',
        github: 'https://github.com/anthropics/claude-api',
        changelog: 'https://docs.anthropic.com/claude/changelog'
    },
    
    // GitHub Copilot related links
    copilot: {
        website: 'https://github.com/features/copilot',
        documentation: 'https://docs.github.com/en/copilot',
        github: 'https://github.com/github/copilot',
        changelog: 'https://docs.github.com/en/copilot/changelog'
    },
    
    // Gemini related links
    gemini: {
        website: 'https://gemini.google.com',
        documentation: 'https://ai.google.dev/docs',
        github: 'https://github.com/google/generative-ai',
        changelog: 'https://ai.google.dev/docs/changelog'
    },
    
    // Tongyi related links
    tongyi: {
        website: 'https://tongyi.aliyun.com',
        documentation: 'https://help.aliyun.com/en/dashscope',
        github: 'https://github.com/alibaba/tongyi',
        changelog: 'https://help.aliyun.com/en/dashscope/changelog'
    },
    
    // Windsurf related links
    windsurf: {
        website: 'https://windsurf.ai',
        documentation: 'https://docs.windsurf.ai',
        github: 'https://github.com/windsurf-ai/windsurf',
        changelog: 'https://docs.windsurf.ai/changelog'
    },
    
    // Codeium related links
    codeium: {
        website: 'https://codeium.com',
        documentation: 'https://docs.codeium.com',
        github: 'https://github.com/codeium/codeium',
        changelog: 'https://docs.codeium.com/changelog'
    }
}; 