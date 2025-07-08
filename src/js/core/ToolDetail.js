/**
 * 工具详情页核心类
 * 负责管理工具详情页的结构和状态
 */
class ToolDetail {
    constructor(toolId) {
        this.toolId = toolId;
        this.expandedItems = new Set();
        this.contentCache = new Map();
        
        // 初始化四个主要区域
        this.sections = {
            introduction: {
                title: '前言',
                icon: 'fas fa-info-circle',
                items: []
            },
            tutorials: {
                title: '教程',
                icon: 'fas fa-book',
                items: [
                    {
                        id: 'learning_path',
                        title: '学习路线',
                        items: []
                    },
                    {
                        id: 'basic_tutorial',
                        title: '入门教程',
                        items: []
                    },
                    {
                        id: 'advanced_tutorial',
                        title: '进阶教程',
                        items: []
                    },
                    {
                        id: 'projects',
                        title: '实战项目',
                        items: []
                    },
                    {
                        id: 'faq',
                        title: '常见问题',
                        items: []
                    }
                ]
            },
            bestPractices: {
                title: '最佳实践',
                icon: 'fas fa-check-circle',
                items: [
                    {
                        id: 'official_practices',
                        title: '官方最佳实践',
                        items: []
                    },
                    {
                        id: 'development_experience',
                        title: '开发经验',
                        items: []
                    },
                    {
                        id: 'team_practices',
                        title: '团队落地实践',
                        items: []
                    }
                ]
            },
            links: {
                title: '相关链接',
                icon: 'fas fa-link',
                items: [
                    {
                        id: 'website',
                        title: '官方网站',
                        url: ''
                    },
                    {
                        id: 'documentation',
                        title: '官方文档',
                        url: ''
                    },
                    {
                        id: 'github',
                        title: 'GitHub',
                        url: ''
                    },
                    {
                        id: 'changelog',
                        title: '更新日志',
                        url: ''
                    }
                ]
            }
        };
    }

    /**
     * 通过ID查找项目
     * @param {string} id 项目ID
     * @returns {Object|null} 找到的项目或null
     */
    findItemById(id) {
        const search = (items, parent = null, level = 0) => {
            for (const item of items) {
                if (item.id === id) {
                    return { ...item, parent, level };
                }
                if (item.items && item.items.length > 0) {
                    const found = search(item.items, item, level + 1);
                    if (found) return found;
                }
            }
            return null;
        };

        for (const section of Object.values(this.sections)) {
            const found = search(section.items);
            if (found) return found;
        }
        return null;
    }

    /**
     * 展开指定项目
     * @param {string} id 项目ID
     */
    expand(id) {
        this.expandedItems.add(id);
    }

    /**
     * 折叠指定项目
     * @param {string} id 项目ID
     */
    collapse(id) {
        this.expandedItems.delete(id);
    }

    /**
     * 异步加载内容
     * @param {string} id 项目ID
     * @returns {Promise<string>} 加载的内容
     */
    async loadContent(id) {
        if (this.contentCache.has(id)) {
            return this.contentCache.get(id);
        }

        // 从对应工具的内容文件加载
        const content = await import(`../tools/${this.toolId}/content/${id}.js`);
        this.contentCache.set(id, content);
        return content;
    }

    /**
     * 获取项目的展开状态
     * @param {string} id 项目ID
     * @returns {boolean} 是否展开
     */
    isExpanded(id) {
        return this.expandedItems.has(id);
    }

    /**
     * 获取所有展开的项目
     * @returns {string[]} 展开的项目ID列表
     */
    getExpandedItems() {
        return Array.from(this.expandedItems);
    }
}

export default ToolDetail; 