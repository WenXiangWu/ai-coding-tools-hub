/**
 * 网页转换器模块
 * 用于将网页内容转换为符合项目样式的代码，并可以插入到工具详情页导航栏中
 */

/**
 * 网页转换器类
 */
class WebpageConverter {
    /**
     * 构造函数
     */
    constructor() {
        this.config = {
            selectors: {
                title: ['h1', '.hero-title', '.main-title', 'header h1', 'title'],
                subtitle: ['h2', '.hero-subtitle', '.subtitle', 'header h2'],
                description: ['p', '.hero-description', '.description', 'header p'],
                features: ['.features', '.feature-list', '.cards', '.grid'],
                featureItem: ['.feature', '.card', '.grid-item', '.item'],
                featureTitle: ['h3', '.feature-title', '.card-title', '.title'],
                featureDescription: ['p', '.feature-description', '.card-description', '.description'],
                featureIcon: ['.icon', '.feature-icon', '.card-icon', 'i'],
                navigation: ['nav', '.navigation', '.menu', '.navbar'],
                navItem: ['.nav-item', '.menu-item', '.navbar-item', 'a'],
                content: ['.content', '.main-content', 'main', 'article'],
                section: ['.section', 'section', '.content-section'],
                sectionTitle: ['h2', '.section-title', '.title'],
                sectionContent: ['.section-content', '.content']
            },
            defaultIcons: {
                feature: 'fas fa-star',
                navItem: 'fas fa-link'
            }
        };
        
        // 绑定方法
        this.fetchWebpage = this.fetchWebpage.bind(this);
        this.parseWebpage = this.parseWebpage.bind(this);
        this.convertToToolDetail = this.convertToToolDetail.bind(this);
    }

    /**
     * 获取网页内容
     * @param {string} url - 网页URL
     * @returns {Promise<string>} 网页HTML内容
     */
    async fetchWebpage(url) {
        try {
            // 使用代理服务器避免CORS问题
            const proxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
            const response = await fetch(proxyUrl);
            
            if (!response.ok) {
                throw new Error(`获取网页失败: ${response.status} ${response.statusText}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('获取网页失败:', error);
            throw error;
        }
    }

    /**
     * 解析网页内容
     * @param {string} html - 网页HTML内容
     * @returns {Object} 解析后的网页结构
     */
    parseWebpage(html) {
        // 创建DOM解析器
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取标题
        const title = this.extractContent(doc, this.config.selectors.title);
        
        // 提取副标题
        const subtitle = this.extractContent(doc, this.config.selectors.subtitle);
        
        // 提取描述
        const description = this.extractContent(doc, this.config.selectors.description);
        
        // 提取特性
        const features = this.extractFeatures(doc);
        
        // 提取导航
        const navigation = this.extractNavigation(doc);
        
        // 提取内容部分
        const sections = this.extractSections(doc);
        
        // 提取元数据
        const metadata = this.extractMetadata(doc);
        
        return {
            title,
            subtitle,
            description,
            features,
            navigation,
            sections,
            metadata,
            url: metadata.url || '',
            favicon: metadata.favicon || ''
        };
    }

    /**
     * 提取内容
     * @param {Document} doc - DOM文档
     * @param {Array<string>} selectors - 选择器数组
     * @returns {string} 提取的内容
     */
    extractContent(doc, selectors) {
        for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent.trim()) {
                return element.textContent.trim();
            }
        }
        return '';
    }

    /**
     * 提取特性
     * @param {Document} doc - DOM文档
     * @returns {Array<Object>} 特性数组
     */
    extractFeatures(doc) {
        const features = [];
        
        // 尝试查找特性容器
        let featureContainer = null;
        for (const selector of this.config.selectors.features) {
            featureContainer = doc.querySelector(selector);
            if (featureContainer) break;
        }
        
        if (!featureContainer) {
            // 如果没有找到特性容器，尝试从页面中提取可能的特性
            return this.extractPossibleFeatures(doc);
        }
        
        // 查找特性项
        let featureItems = [];
        for (const selector of this.config.selectors.featureItem) {
            const items = featureContainer.querySelectorAll(selector);
            if (items && items.length > 0) {
                featureItems = Array.from(items);
                break;
            }
        }
        
        // 从每个特性项中提取信息
        for (const item of featureItems) {
            const feature = {
                title: '',
                description: '',
                icon: this.config.defaultIcons.feature
            };
            
            // 提取标题
            for (const selector of this.config.selectors.featureTitle) {
                const titleElement = item.querySelector(selector);
                if (titleElement && titleElement.textContent.trim()) {
                    feature.title = titleElement.textContent.trim();
                    break;
                }
            }
            
            // 提取描述
            for (const selector of this.config.selectors.featureDescription) {
                const descElement = item.querySelector(selector);
                if (descElement && descElement.textContent.trim()) {
                    feature.description = descElement.textContent.trim();
                    break;
                }
            }
            
            // 提取图标
            for (const selector of this.config.selectors.featureIcon) {
                const iconElement = item.querySelector(selector);
                if (iconElement) {
                    // 尝试获取图标类名
                    const iconClass = iconElement.className;
                    if (iconClass && iconClass.includes('fa-')) {
                        // 如果是Font Awesome图标
                        feature.icon = iconClass;
                    } else if (iconElement.tagName === 'IMG') {
                        // 如果是图片
                        feature.iconUrl = iconElement.src;
                        feature.icon = null;
                    }
                    break;
                }
            }
            
            // 只有当标题不为空时才添加特性
            if (feature.title) {
                features.push(feature);
            }
        }
        
        return features;
    }

    /**
     * 提取可能的特性
     * @param {Document} doc - DOM文档
     * @returns {Array<Object>} 特性数组
     */
    extractPossibleFeatures(doc) {
        const features = [];
        
        // 查找所有h3标题，可能是特性标题
        const h3Elements = doc.querySelectorAll('h3');
        
        for (const h3 of h3Elements) {
            // 获取下一个段落作为描述
            let description = '';
            let nextElement = h3.nextElementSibling;
            
            if (nextElement && nextElement.tagName === 'P') {
                description = nextElement.textContent.trim();
            }
            
            // 创建特性对象
            const feature = {
                title: h3.textContent.trim(),
                description: description,
                icon: this.config.defaultIcons.feature
            };
            
            // 只有当标题不为空时才添加特性
            if (feature.title) {
                features.push(feature);
            }
        }
        
        return features;
    }

    /**
     * 提取导航
     * @param {Document} doc - DOM文档
     * @returns {Array<Object>} 导航项数组
     */
    extractNavigation(doc) {
        const navItems = [];
        
        // 尝试查找导航容器
        let navContainer = null;
        for (const selector of this.config.selectors.navigation) {
            navContainer = doc.querySelector(selector);
            if (navContainer) break;
        }
        
        if (!navContainer) {
            return navItems;
        }
        
        // 查找导航项
        let items = [];
        for (const selector of this.config.selectors.navItem) {
            const foundItems = navContainer.querySelectorAll(selector);
            if (foundItems && foundItems.length > 0) {
                items = Array.from(foundItems);
                break;
            }
        }
        
        // 从每个导航项中提取信息
        for (const item of items) {
            const navItem = {
                title: item.textContent.trim(),
                url: item.href || '',
                icon: this.config.defaultIcons.navItem
            };
            
            // 只有当标题不为空时才添加导航项
            if (navItem.title) {
                navItems.push(navItem);
            }
        }
        
        return navItems;
    }

    /**
     * 提取内容部分
     * @param {Document} doc - DOM文档
     * @returns {Array<Object>} 内容部分数组
     */
    extractSections(doc) {
        const sections = [];
        
        // 尝试查找内容容器
        let contentContainer = null;
        for (const selector of this.config.selectors.content) {
            contentContainer = doc.querySelector(selector);
            if (contentContainer) break;
        }
        
        if (!contentContainer) {
            contentContainer = doc.body;
        }
        
        // 查找内容部分
        let sectionElements = [];
        for (const selector of this.config.selectors.section) {
            const foundSections = contentContainer.querySelectorAll(selector);
            if (foundSections && foundSections.length > 0) {
                sectionElements = Array.from(foundSections);
                break;
            }
        }
        
        // 如果没有找到内容部分，尝试使用h2标题分割内容
        if (sectionElements.length === 0) {
            return this.extractSectionsByHeadings(contentContainer);
        }
        
        // 从每个内容部分中提取信息
        for (const sectionElement of sectionElements) {
            const section = {
                title: '',
                content: ''
            };
            
            // 提取标题
            for (const selector of this.config.selectors.sectionTitle) {
                const titleElement = sectionElement.querySelector(selector);
                if (titleElement && titleElement.textContent.trim()) {
                    section.title = titleElement.textContent.trim();
                    break;
                }
            }
            
            // 提取内容
            for (const selector of this.config.selectors.sectionContent) {
                const contentElement = sectionElement.querySelector(selector);
                if (contentElement) {
                    section.content = contentElement.innerHTML;
                    break;
                }
            }
            
            // 如果没有找到内容，使用整个部分的HTML
            if (!section.content) {
                section.content = sectionElement.innerHTML;
            }
            
            // 只有当标题不为空时才添加内容部分
            if (section.title) {
                sections.push(section);
            }
        }
        
        return sections;
    }

    /**
     * 通过标题提取内容部分
     * @param {Element} container - 容器元素
     * @returns {Array<Object>} 内容部分数组
     */
    extractSectionsByHeadings(container) {
        const sections = [];
        
        // 查找所有h2标题
        const h2Elements = container.querySelectorAll('h2');
        
        for (let i = 0; i < h2Elements.length; i++) {
            const h2 = h2Elements[i];
            const section = {
                title: h2.textContent.trim(),
                content: ''
            };
            
            // 收集该标题后面、下一个h2前面的所有内容
            let contentHtml = '';
            let currentElement = h2.nextElementSibling;
            
            while (currentElement && currentElement !== h2Elements[i + 1]) {
                contentHtml += currentElement.outerHTML;
                currentElement = currentElement.nextElementSibling;
            }
            
            section.content = contentHtml;
            
            // 只有当标题不为空时才添加内容部分
            if (section.title) {
                sections.push(section);
            }
        }
        
        return sections;
    }

    /**
     * 提取元数据
     * @param {Document} doc - DOM文档
     * @returns {Object} 元数据
     */
    extractMetadata(doc) {
        const metadata = {
            title: '',
            description: '',
            keywords: '',
            author: '',
            url: '',
            favicon: ''
        };
        
        // 提取标题
        const titleElement = doc.querySelector('title');
        if (titleElement) {
            metadata.title = titleElement.textContent.trim();
        }
        
        // 提取元标签
        const metaTags = doc.querySelectorAll('meta');
        for (const meta of metaTags) {
            const name = meta.getAttribute('name');
            const property = meta.getAttribute('property');
            const content = meta.getAttribute('content');
            
            if (!content) continue;
            
            if (name === 'description' || property === 'og:description') {
                metadata.description = content;
            } else if (name === 'keywords') {
                metadata.keywords = content;
            } else if (name === 'author') {
                metadata.author = content;
            } else if (property === 'og:url') {
                metadata.url = content;
            }
        }
        
        // 提取favicon
        const faviconLink = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]');
        if (faviconLink) {
            metadata.favicon = faviconLink.getAttribute('href');
        }
        
        return metadata;
    }

    /**
     * 将解析后的网页结构转换为工具详情页内容
     * @param {Object} webpage - 解析后的网页结构
     * @returns {Object} 工具详情页内容
     */
    convertToToolDetail(webpage) {
        // 创建欢迎页配置
        const welcomeConfig = {
            title: webpage.title || '网页标题',
            subtitle: webpage.subtitle || webpage.metadata.description || '网页副标题',
            description: webpage.description || webpage.metadata.description || '网页描述',
            heroImage: webpage.favicon || null,
            features: this.convertFeatures(webpage.features)
        };
        
        // 创建导航结构
        const navigationStructure = {
            tabs: this.createNavigationTabs(webpage)
        };
        
        return {
            welcome: welcomeConfig,
            navigation: navigationStructure,
            content: this.createContent(webpage)
        };
    }

    /**
     * 转换特性
     * @param {Array<Object>} features - 特性数组
     * @returns {Array<Object>} 转换后的特性数组
     */
    convertFeatures(features) {
        // 如果没有特性，创建默认特性
        if (!features || features.length === 0) {
            return [
                {
                    title: '特性1',
                    description: '特性1描述',
                    icon: 'fas fa-star'
                },
                {
                    title: '特性2',
                    description: '特性2描述',
                    icon: 'fas fa-bolt'
                },
                {
                    title: '特性3',
                    description: '特性3描述',
                    icon: 'fas fa-magic'
                }
            ];
        }
        
        // 转换特性
        return features.slice(0, 4).map(feature => ({
            title: feature.title,
            description: feature.description || '',
            icon: feature.icon || 'fas fa-star'
        }));
    }

    /**
     * 创建导航标签页
     * @param {Object} webpage - 解析后的网页结构
     * @returns {Array<Object>} 导航标签页数组
     */
    createNavigationTabs(webpage) {
        const tabs = [
            {
                id: 'introduction',
                title: '前言',
                icon: 'fas fa-info-circle',
                content: this.createIntroductionContent(webpage),
                children: []
            }
        ];
        
        // 如果有内容部分，添加教程标签页
        if (webpage.sections && webpage.sections.length > 0) {
            const tutorialTab = {
                id: 'tutorials',
                title: '教程',
                icon: 'fas fa-book',
                content: null,
                children: []
            };
            
            // 将内容部分转换为子标签页
            for (let i = 0; i < webpage.sections.length; i++) {
                const section = webpage.sections[i];
                tutorialTab.children.push({
                    id: `section_${i}`,
                    title: section.title,
                    icon: 'fas fa-file-alt',
                    content: this.createSectionContent(section)
                });
            }
            
            tabs.push(tutorialTab);
        }
        
        // 添加相关链接标签页
        tabs.push({
            id: 'links',
            title: '相关链接',
            icon: 'fas fa-link',
            content: null,
            children: [
                {
                    id: 'website',
                    title: '原始网页',
                    icon: 'fas fa-globe',
                    url: webpage.url,
                    external: true
                }
            ]
        });
        
        return tabs;
    }

    /**
     * 创建前言内容
     * @param {Object} webpage - 解析后的网页结构
     * @returns {Object} 前言内容
     */
    createIntroductionContent(webpage) {
        return {
            title: webpage.title || '网页标题',
            html: `
                <div class="introduction-content">
                    <div class="intro-header">
                        <h1>${webpage.title || '网页标题'}</h1>
                        ${webpage.subtitle ? `<h2>${webpage.subtitle}</h2>` : ''}
                    </div>
                    <div class="intro-description">
                        ${webpage.description || webpage.metadata.description || ''}
                    </div>
                    <div class="intro-metadata">
                        <div class="metadata-item">
                            <strong>来源:</strong> ${webpage.url || '未知'}
                        </div>
                        ${webpage.metadata.author ? `
                        <div class="metadata-item">
                            <strong>作者:</strong> ${webpage.metadata.author}
                        </div>
                        ` : ''}
                        ${webpage.metadata.keywords ? `
                        <div class="metadata-item">
                            <strong>关键词:</strong> ${webpage.metadata.keywords}
                        </div>
                        ` : ''}
                    </div>
                </div>
            `
        };
    }

    /**
     * 创建内容部分内容
     * @param {Object} section - 内容部分
     * @returns {Object} 内容部分内容
     */
    createSectionContent(section) {
        return {
            title: section.title,
            html: `
                <div class="section-content">
                    <h2>${section.title}</h2>
                    <div class="content-body">
                        ${section.content}
                    </div>
                </div>
            `
        };
    }

    /**
     * 创建内容
     * @param {Object} webpage - 解析后的网页结构
     * @returns {Object} 内容
     */
    createContent(webpage) {
        const content = {};
        
        // 添加前言内容
        content.introduction = this.createIntroductionContent(webpage);
        
        // 添加内容部分
        if (webpage.sections && webpage.sections.length > 0) {
            for (let i = 0; i < webpage.sections.length; i++) {
                const section = webpage.sections[i];
                content[`section_${i}`] = this.createSectionContent(section);
            }
        }
        
        return content;
    }

    /**
     * 将网页转换为工具详情页内容
     * @param {string} url - 网页URL
     * @returns {Promise<Object>} 工具详情页内容
     */
    async convertWebpage(url) {
        try {
            // 获取网页内容
            const html = await this.fetchWebpage(url);
            
            // 解析网页内容
            const webpage = this.parseWebpage(html);
            
            // 转换为工具详情页内容
            return this.convertToToolDetail(webpage);
        } catch (error) {
            console.error('转换网页失败:', error);
            throw error;
        }
    }

    /**
     * 将工具详情页内容插入到指定的标签页下
     * @param {Object} toolDetail - 工具详情页内容
     * @param {string} tabId - 标签页ID
     * @param {string} itemId - 导航项ID
     * @returns {Object} 更新后的导航结构
     */
    insertIntoTab(toolDetail, tabId, itemId) {
        // 深拷贝导航结构
        const navigationStructure = JSON.parse(JSON.stringify(toolDetail.navigation));
        
        // 查找标签页
        const tab = navigationStructure.tabs.find(t => t.id === tabId);
        if (!tab) {
            throw new Error(`未找到标签页: ${tabId}`);
        }
        
        // 如果没有子项，创建子项数组
        if (!tab.children) {
            tab.children = [];
        }
        
        // 创建新的导航项
        const newItem = {
            id: itemId,
            title: toolDetail.welcome.title,
            icon: 'fas fa-globe',
            content: toolDetail.content.introduction
        };
        
        // 添加到子项
        tab.children.push(newItem);
        
        return navigationStructure;
    }
}

// 导出网页转换器
export default WebpageConverter; 