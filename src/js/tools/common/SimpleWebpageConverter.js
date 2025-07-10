/**
 * 简化版网页转换器
 * 用于将网页内容转换为符合项目样式的代码，但不插入到导航中
 */

class SimpleWebpageConverter {
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
    }

    /**
     * 获取网页内容
     * @param {string} url - 网页URL
     * @returns {Promise<string>} 网页HTML内容
     */
    async fetchWebpage(url) {
        try {
            // 注意：在实际环境中，需要通过代理服务器或后端API获取网页内容以避免CORS问题
            // 这里使用模拟数据进行测试
            return await this.simulateFetch(url);
        } catch (error) {
            console.error('获取网页失败:', error);
            throw error;
        }
    }

    /**
     * 模拟获取网页内容
     * @param {string} url - 网页URL
     * @returns {Promise<string>} 模拟的HTML内容
     */
    async simulateFetch(url) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 根据URL返回不同的模拟数据
        if (url.includes('cursor.com')) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Cursor - The AI Code Editor</title>
                    <meta name="description" content="Built to make you extraordinarily productive, Cursor is the best way to code with AI.">
                </head>
                <body>
                    <header>
                        <h1>The AI Code Editor</h1>
                        <p>Built to make you extraordinarily productive, Cursor is the best way to code with AI.</p>
                    </header>
                    <section class="features">
                        <div class="feature">
                            <h3>Tab, tab, tab</h3>
                            <p>Cursor lets you breeze through changes by predicting your next edit.</p>
                        </div>
                        <div class="feature">
                            <h3>Knows your codebase</h3>
                            <p>Get answers from your codebase or refer to files or docs. Use the model's code in one click.</p>
                        </div>
                        <div class="feature">
                            <h3>Edit in natural language</h3>
                            <p>Cursor lets you write code using instructions. Update entire classes or functions with a simple prompt.</p>
                        </div>
                        <div class="feature">
                            <h3>Build software faster</h3>
                            <p>Intelligent, fast, and familiar, Cursor is the best way to code with AI.</p>
                        </div>
                    </section>
                </body>
                </html>
            `;
        } else if (url.includes('docs.cursor.com')) {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Welcome - Cursor Documentation</title>
                    <meta name="description" content="Learn about Cursor and how to get started">
                </head>
                <body>
                    <header>
                        <h1>Welcome</h1>
                        <p>Learn about Cursor and how to get started</p>
                    </header>
                    <main>
                        <p>Cursor is an AI-powered code editor that understands your codebase and helps you code faster through natural language. Just describe what you want to build or change and Cursor will generate the code for you.</p>
                        
                        <section>
                            <h2>Get started</h2>
                            <p>Download, install, and start building with Cursor in minutes</p>
                        </section>
                        
                        <section>
                            <h2>Changelog</h2>
                            <p>Stay up to date with the latest features and improvements</p>
                        </section>
                        
                        <section>
                            <h2>Concepts</h2>
                            <p>Understand core concepts and features that power Cursor</p>
                        </section>
                        
                        <section>
                            <h2>Models</h2>
                            <p>Explore AI models available and how to select the right one</p>
                        </section>
                    </main>
                </body>
                </html>
            `;
        } else {
            return `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Sample Webpage</title>
                    <meta name="description" content="This is a sample webpage for testing">
                </head>
                <body>
                    <header>
                        <h1>Sample Webpage</h1>
                        <h2>For Testing Purposes</h2>
                        <p>This is a sample webpage used for testing the webpage converter.</p>
                    </header>
                    <div class="features">
                        <div class="feature">
                            <h3>Feature 1</h3>
                            <p>Description of feature 1</p>
                        </div>
                        <div class="feature">
                            <h3>Feature 2</h3>
                            <p>Description of feature 2</p>
                        </div>
                        <div class="feature">
                            <h3>Feature 3</h3>
                            <p>Description of feature 3</p>
                        </div>
                    </div>
                    <main>
                        <section>
                            <h2>Section 1</h2>
                            <p>Content of section 1</p>
                        </section>
                        <section>
                            <h2>Section 2</h2>
                            <p>Content of section 2</p>
                        </section>
                    </main>
                </body>
                </html>
            `;
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
        const title = this.extractContent(doc, this.config.selectors.title) || 
                     doc.title || '未知标题';
        
        // 提取副标题
        const subtitle = this.extractContent(doc, this.config.selectors.subtitle);
        
        // 提取描述
        const description = this.extractContent(doc, this.config.selectors.description) || 
                           doc.querySelector('meta[name="description"]')?.getAttribute('content') || '';
        
        // 提取特性
        const features = this.extractFeatures(doc);
        
        // 提取内容部分
        const sections = this.extractSections(doc);
        
        // 提取元数据
        const metadata = {
            title: doc.title || '',
            description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            url: ''
        };
        
        return {
            title,
            subtitle,
            description,
            features,
            sections,
            metadata
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
                // 排除标题元素
                const titleElement = sectionElement.querySelector('h2');
                if (titleElement) {
                    titleElement.remove();
                }
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
     * 将网页转换为符合项目样式的HTML
     * @param {Object} webpage - 解析后的网页结构
     * @returns {string} 转换后的HTML
     */
    convertToStyledHtml(webpage) {
        let html = `
            <div class="converted-webpage">
                <div class="tool-welcome-page">
                    <div class="tech-particles" id="particles"></div>
                    
                    <div class="welcome-header">
                        <h1>${webpage.title}</h1>
                        ${webpage.subtitle ? `<h2>${webpage.subtitle}</h2>` : ''}
                        <p>${webpage.description}</p>
                    </div>
                    
                    ${this.generateFeaturesHtml(webpage.features)}
                </div>
                
                <div class="converted-content">
                    ${this.generateSectionsHtml(webpage.sections)}
                </div>
                
                <div class="converted-metadata">
                    <div class="metadata-item">
                        <strong>原始网页:</strong> ${webpage.metadata.url || '未知'}
                    </div>
                    ${webpage.metadata.title ? `
                    <div class="metadata-item">
                        <strong>原始标题:</strong> ${webpage.metadata.title}
                    </div>
                    ` : ''}
                    ${webpage.metadata.description ? `
                    <div class="metadata-item">
                        <strong>原始描述:</strong> ${webpage.metadata.description}
                    </div>
                    ` : ''}
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * 生成特性HTML
     * @param {Array<Object>} features - 特性数组
     * @returns {string} 特性HTML
     */
    generateFeaturesHtml(features) {
        if (!features || features.length === 0) {
            return '';
        }
        
        let featuresHtml = `<div class="welcome-features">`;
        
        for (const feature of features) {
            featuresHtml += `
                <div class="feature-card">
                    <div class="feature-icon">
                        <i class="${feature.icon}"></i>
                    </div>
                    <h3>${feature.title}</h3>
                    <p>${feature.description}</p>
                </div>
            `;
        }
        
        featuresHtml += `</div>`;
        
        return featuresHtml;
    }

    /**
     * 生成内容部分HTML
     * @param {Array<Object>} sections - 内容部分数组
     * @returns {string} 内容部分HTML
     */
    generateSectionsHtml(sections) {
        if (!sections || sections.length === 0) {
            return '';
        }
        
        let sectionsHtml = '';
        
        for (const section of sections) {
            sectionsHtml += `
                <div class="content-section">
                    <h2>${section.title}</h2>
                    <div class="section-content">
                        ${section.content}
                    </div>
                </div>
            `;
        }
        
        return sectionsHtml;
    }

    /**
     * 将网页转换为符合项目样式的HTML
     * @param {string} url - 网页URL
     * @returns {Promise<string>} 转换后的HTML
     */
    async convert(url) {
        try {
            // 获取网页内容
            const html = await this.fetchWebpage(url);
            
            // 解析网页内容
            const webpage = this.parseWebpage(html);
            
            // 设置URL
            webpage.metadata.url = url;
            
            // 转换为符合项目样式的HTML
            return this.convertToStyledHtml(webpage);
        } catch (error) {
            console.error('转换网页失败:', error);
            throw error;
        }
    }
}

export default SimpleWebpageConverter; 