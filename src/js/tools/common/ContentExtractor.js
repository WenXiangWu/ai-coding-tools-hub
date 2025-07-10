/**
 * 内容提取器
 * 专注于从网页中提取结构化文本和图片，不考虑样式
 */

class ContentExtractor {
    /**
     * 构造函数
     */
    constructor() {
        // 提取配置
        this.config = {
            // 主要内容选择器（按优先级排序）
            contentSelectors: [
                'main', 'article', '[role="main"]', '.main-content', 
                '.content', '.article-content', '.post-content', 
                '.page-content', '#content', '#main', '#article',
                '.container .content', '.wrapper .content'
            ],
            // 标题选择器
            headingSelectors: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            // 需要完全忽略的元素选择器
            ignoreSelectors: [
                // 导航相关
                'nav', 'header nav', '.nav', '.navbar', '.navigation', 
                '.menu', '.main-menu', '.primary-menu', '.secondary-menu',
                '.breadcrumb', '.breadcrumbs', '.pagination',
                // 页眉页脚
                'header', 'footer', '.header', '.footer', '.site-header', 
                '.site-footer', '.page-header', '.page-footer',
                // 侧边栏
                'aside', '.sidebar', '.side-bar', '.widget', '.widgets',
                // 广告和推广
                '.ads', '.ad', '.advertisement', '.promo', '.promotion',
                '.banner', '.sponsor', '.affiliate',
                // 评论和社交
                '.comments', '.comment', '.comment-section', '.social',
                '.share', '.sharing', '.social-share', '.social-links',
                // 相关推荐
                '.related', '.recommended', '.suggestions', '.more-posts',
                '.popular', '.trending', '.recent-posts',
                // 弹窗和通知
                '.modal', '.popup', '.overlay', '.notification', '.alert',
                '.cookie-notice', '.cookie-banner', '.gdpr', '.privacy-notice',
                // 搜索和表单
                '.search', '.search-form', '.newsletter', '.subscribe',
                '.contact-form', '.feedback-form',
                // 其他不需要的内容
                '.skip-link', '.screen-reader-text', '.sr-only', '.hidden',
                '.print-only', '.no-print', '.admin-bar', '.debug'
            ],
            // 内容区域的负面指标（用于排除不太可能是主要内容的区域）
            negativeIndicators: [
                'nav', 'menu', 'sidebar', 'footer', 'header', 'ad', 'comment',
                'social', 'share', 'related', 'widget', 'banner', 'promo'
            ],
            // 内容区域的正面指标（用于识别主要内容）
            positiveIndicators: [
                'content', 'article', 'post', 'main', 'story', 'text', 'body'
            ],
            // 代理服务器URL（用于解决CORS问题）
            proxyUrl: 'https://api.allorigins.win/raw?url='
        };
    }

    /**
     * 获取网页内容
     * @param {string} url - 网页URL
     * @returns {Promise<string>} 网页HTML内容
     */
    async fetchWebpage(url) {
        try {
            // 如果是当前页面，直接使用当前页面的HTML
            if (url === 'current' || url === window.location.href) {
                return document.documentElement.outerHTML;
            }
            
            // 否则，通过代理服务器获取网页内容
            const response = await fetch(this.config.proxyUrl + encodeURIComponent(url));
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error('获取网页失败:', error);
            throw error;
        }
    }

    /**
     * 从网页中提取内容
     * @param {string} html - 网页HTML内容
     * @returns {Object} 提取的结构化内容
     */
    extractContent(html) {
        // 创建DOM解析器
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // 提取页面元数据
        const metadata = this.extractMetadata(doc);
        
        // 清理DOM，移除不需要的元素
        this.cleanupDOM(doc);
        
        // 找到主要内容区域
        const mainContent = this.findMainContent(doc);
        
        // 提取结构化内容
        const structuredContent = this.extractStructuredContent(mainContent || doc.body);
        
        // 后处理：清理和优化内容
        const cleanedContent = this.postProcessContent(structuredContent);
        
        return {
            metadata,
            content: cleanedContent
        };
    }

    /**
     * 提取页面元数据
     * @param {Document} doc - DOM文档
     * @returns {Object} 页面元数据
     */
    extractMetadata(doc) {
        // 尝试获取更准确的标题
        let title = doc.title || '';
        
        // 如果标题太长，尝试获取主要内容区域的第一个h1
        if (title.length > 100) {
            const h1 = doc.querySelector('main h1, article h1, .content h1, h1');
            if (h1 && h1.textContent.trim()) {
                title = h1.textContent.trim();
            }
        }
        
        return {
            title,
            description: doc.querySelector('meta[name="description"]')?.getAttribute('content') || '',
            url: '',
            favicon: doc.querySelector('link[rel="icon"]')?.getAttribute('href') || 
                   doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href') || ''
        };
    }

    /**
     * 清理DOM，移除不需要的元素
     * @param {Document} doc - DOM文档
     */
    cleanupDOM(doc) {
        // 移除脚本和样式
        const scripts = doc.querySelectorAll('script, style, noscript');
        scripts.forEach(el => el.remove());
        
        // 移除忽略的元素
        const ignoreSelector = this.config.ignoreSelectors.join(', ');
        const ignoreElements = doc.querySelectorAll(ignoreSelector);
        ignoreElements.forEach(el => el.remove());
        
        // 移除隐藏元素
        const hiddenElements = doc.querySelectorAll('[style*="display: none"], [style*="visibility: hidden"], [hidden]');
        hiddenElements.forEach(el => el.remove());
        
        // 移除空的或只包含空白的元素
        const emptyElements = doc.querySelectorAll('div, span, p, section, article');
        emptyElements.forEach(el => {
            if (!el.textContent.trim() && !el.querySelector('img, video, audio, iframe, canvas, svg')) {
                el.remove();
            }
        });
    }

    /**
     * 查找主要内容区域
     * @param {Document} doc - DOM文档
     * @returns {Element} 主要内容元素
     */
    findMainContent(doc) {
        // 首先尝试标准的内容选择器
        for (const selector of this.config.contentSelectors) {
            const element = doc.querySelector(selector);
            if (element && this.isValidContentArea(element)) {
                return element;
            }
        }
        
        // 如果没有找到，使用启发式方法
        return this.findContentByHeuristics(doc);
    }

    /**
     * 验证内容区域是否有效
     * @param {Element} element - 要验证的元素
     * @returns {boolean} 是否是有效的内容区域
     */
    isValidContentArea(element) {
        if (!element) return false;
        
        const text = element.textContent.trim();
        
        // 内容太少
        if (text.length < 100) return false;
        
        // 检查是否包含太多导航元素
        const navElements = element.querySelectorAll('nav, .nav, .menu, .navbar');
        if (navElements.length > 2) return false;
        
        // 检查文本密度
        const textLength = text.length;
        const elementCount = element.querySelectorAll('*').length;
        const textDensity = textLength / Math.max(elementCount, 1);
        
        // 文本密度太低可能是导航或其他非内容区域
        if (textDensity < 10) return false;
        
        return true;
    }

    /**
     * 使用启发式方法查找内容
     * @param {Document} doc - DOM文档
     * @returns {Element} 主要内容元素
     */
    findContentByHeuristics(doc) {
        const candidates = [];
        
        // 收集候选元素
        const allElements = doc.querySelectorAll('div, section, article, main');
        
        allElements.forEach(element => {
            const score = this.calculateContentScore(element);
            if (score > 0) {
                candidates.push({ element, score });
            }
        });
        
        // 按分数排序
        candidates.sort((a, b) => b.score - a.score);
        
        // 返回得分最高的元素
        return candidates.length > 0 ? candidates[0].element : doc.body;
    }

    /**
     * 计算内容区域的分数
     * @param {Element} element - 要评分的元素
     * @returns {number} 内容分数
     */
    calculateContentScore(element) {
        if (!element) return 0;
        
        let score = 0;
        const text = element.textContent.trim();
        const className = element.className.toLowerCase();
        const id = element.id.toLowerCase();
        
        // 基础分数：文本长度
        score += Math.min(text.length / 100, 50);
        
        // 段落数量
        const paragraphs = element.querySelectorAll('p');
        score += paragraphs.length * 2;
        
        // 标题数量
        const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
        score += headings.length * 3;
        
        // 正面指标
        this.config.positiveIndicators.forEach(indicator => {
            if (className.includes(indicator) || id.includes(indicator)) {
                score += 10;
            }
        });
        
        // 负面指标
        this.config.negativeIndicators.forEach(indicator => {
            if (className.includes(indicator) || id.includes(indicator)) {
                score -= 15;
            }
        });
        
        // 如果包含太多链接，可能是导航
        const links = element.querySelectorAll('a');
        const linkRatio = links.length / Math.max(paragraphs.length, 1);
        if (linkRatio > 3) {
            score -= 20;
        }
        
        return Math.max(score, 0);
    }

    /**
     * 提取结构化内容
     * @param {Element} element - 要提取内容的元素
     * @returns {Array} 结构化内容数组
     */
    extractStructuredContent(element) {
        const content = [];
        
        // 按顺序处理子元素
        for (const child of element.children) {
            const processedContent = this.processElement(child);
            if (processedContent) {
                if (Array.isArray(processedContent)) {
                    content.push(...processedContent);
                } else {
                    content.push(processedContent);
                }
            }
        }
        
        return content;
    }

    /**
     * 处理单个元素
     * @param {Element} element - 要处理的元素
     * @returns {Object|Array|null} 处理后的内容
     */
    processElement(element) {
        if (!element || !element.tagName) return null;
        
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent.trim();
        
        // 跳过空元素
        if (!text && !element.querySelector('img, video, audio, iframe, canvas, svg')) {
            return null;
        }
        
        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return {
                    type: 'heading',
                    level: parseInt(tagName.charAt(1)),
                    content: text
                };
                
            case 'p':
                return this.processParagraph(element);
                
            case 'img':
                return this.processImage(element);
                
            case 'figure':
                return this.processFigure(element);
                
            case 'ul':
            case 'ol':
                return this.processList(element);
                
            case 'table':
                return this.processTable(element);
                
            case 'pre':
                return this.processCodeBlock(element);
                
            case 'blockquote':
                return {
                    type: 'blockquote',
                    content: this.processInlineContent(element)
                };
                
            case 'hr':
                return { type: 'divider' };
                
            case 'div':
            case 'section':
            case 'article':
                // 递归处理容器元素
                const children = [];
                for (const child of element.children) {
                    const processed = this.processElement(child);
                    if (processed) {
                        if (Array.isArray(processed)) {
                            children.push(...processed);
                        } else {
                            children.push(processed);
                        }
                    }
                }
                return children.length > 0 ? children : null;
                
            default:
                // 对于其他元素，如果包含有用内容，则处理
                if (text.length > 20) {
                    return {
                        type: 'text',
                        content: text
                    };
                }
                return null;
        }
    }

    /**
     * 处理段落
     * @param {Element} element - 段落元素
     * @returns {Object} 处理后的段落内容
     */
    processParagraph(element) {
        const inlineContent = this.processInlineContent(element);
        return {
            type: 'paragraph',
            content: inlineContent
        };
    }

    /**
     * 处理内联内容
     * @param {Element} element - 包含内联内容的元素
     * @returns {Array} 内联内容数组
     */
    processInlineContent(element) {
        const content = [];
        
        for (const node of element.childNodes) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent.trim();
                if (text) {
                    content.push({ type: 'text', content: text });
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                
                switch (tagName) {
                    case 'a':
                        content.push({
                            type: 'link',
                            href: node.getAttribute('href') || '',
                            content: node.textContent.trim()
                        });
                        break;
                        
                    case 'img':
                        content.push(this.processImage(node));
                        break;
                        
                    case 'strong':
                    case 'b':
                        content.push({
                            type: 'strong',
                            content: node.textContent.trim()
                        });
                        break;
                        
                    case 'em':
                    case 'i':
                        content.push({
                            type: 'emphasis',
                            content: node.textContent.trim()
                        });
                        break;
                        
                    case 'code':
                        content.push({
                            type: 'inline-code',
                            content: node.textContent.trim()
                        });
                        break;
                        
                    default:
                        const text = node.textContent.trim();
                        if (text) {
                            content.push({ type: 'text', content: text });
                        }
                }
            }
        }
        
        return content;
    }

    /**
     * 处理图片
     * @param {Element} element - 图片元素
     * @returns {Object} 处理后的图片内容
     */
    processImage(element) {
        const src = element.getAttribute('src') || '';
        const alt = element.getAttribute('alt') || '';
        const title = element.getAttribute('title') || '';
        
        // 处理相对路径
        let absoluteSrc = src;
        if (src && !src.startsWith('http') && !src.startsWith('data:')) {
            try {
                const baseUrl = window.location.origin;
                absoluteSrc = new URL(src, baseUrl).href;
            } catch (e) {
                // 如果无法解析URL，保持原样
                absoluteSrc = src;
            }
        }
        
        return {
            type: 'image',
            src: absoluteSrc,
            alt: alt,
            title: title,
            width: element.getAttribute('width') || '',
            height: element.getAttribute('height') || ''
        };
    }

    /**
     * 处理图片容器
     * @param {Element} element - figure元素
     * @returns {Object} 处理后的图片容器内容
     */
    processFigure(element) {
        const img = element.querySelector('img');
        const caption = element.querySelector('figcaption');
        
        if (img) {
            const imageData = this.processImage(img);
            if (caption) {
                imageData.caption = caption.textContent.trim();
            }
            return imageData;
        }
        
        return null;
    }

    /**
     * 处理列表
     * @param {Element} element - 列表元素
     * @returns {Object} 处理后的列表内容
     */
    processList(element) {
        const items = [];
        const listItems = element.querySelectorAll('li');
        
        listItems.forEach(li => {
            const content = this.processInlineContent(li);
            if (content.length > 0) {
                items.push(content);
            }
        });
        
        return {
            type: element.tagName.toLowerCase() === 'ul' ? 'unordered-list' : 'ordered-list',
            items: items
        };
    }

    /**
     * 处理表格
     * @param {Element} element - 表格元素
     * @returns {Object} 处理后的表格内容
     */
    processTable(element) {
        const result = {
            type: 'table',
            headers: [],
            rows: []
        };
        
        // 处理表头
        const thead = element.querySelector('thead');
        if (thead) {
            const headerRow = thead.querySelector('tr');
            if (headerRow) {
                result.headers = Array.from(headerRow.querySelectorAll('th, td'))
                    .map(cell => cell.textContent.trim());
            }
        }
        
        // 处理表格内容
        const tbody = element.querySelector('tbody') || element;
        const rows = tbody.querySelectorAll('tr');
        
        // 如果没有找到表头，使用第一行作为表头
        if (result.headers.length === 0 && rows.length > 0) {
            const firstRow = rows[0];
            const headerCells = firstRow.querySelectorAll('th, td');
            
            if (headerCells.length > 0) {
                result.headers = Array.from(headerCells)
                    .map(cell => cell.textContent.trim());
                
                // 从第二行开始处理数据行
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const cells = Array.from(row.querySelectorAll('td'))
                        .map(cell => cell.textContent.trim());
                    
                    if (cells.length > 0) {
                        result.rows.push(cells);
                    }
                }
            }
        } else {
            // 处理所有数据行
            for (const row of rows) {
                const cells = Array.from(row.querySelectorAll('td'))
                    .map(cell => cell.textContent.trim());
                
                if (cells.length > 0) {
                    result.rows.push(cells);
                }
            }
        }
        
        return result;
    }

    /**
     * 处理代码块
     * @param {Element} element - pre元素
     * @returns {Object} 处理后的代码块内容
     */
    processCodeBlock(element) {
        const code = element.querySelector('code');
        const content = code ? code.textContent : element.textContent;
        
        // 尝试识别语言
        let language = '';
        if (code) {
            const className = code.className;
            const match = className.match(/language-(\w+)/);
            if (match) {
                language = match[1];
            }
        }
        
        return {
            type: 'code',
            language: language,
            content: content
        };
    }

    /**
     * 后处理内容：清理和优化
     * @param {Array} content - 原始内容数组
     * @returns {Array} 处理后的内容数组
     */
    postProcessContent(content) {
        if (!Array.isArray(content)) return content;
        
        const processed = [];
        
        for (let i = 0; i < content.length; i++) {
            const item = content[i];
            
            if (!item) continue;
            
            // 递归处理嵌套数组
            if (Array.isArray(item)) {
                const processedArray = this.postProcessContent(item);
                if (processedArray.length > 0) {
                    processed.push(...processedArray);
                }
                continue;
            }
            
            // 跳过空内容
            if (item.type === 'text' && (!item.content || item.content.trim().length === 0)) {
                continue;
            }
            
            // 合并相邻的文本内容
            if (item.type === 'text' && processed.length > 0) {
                const lastItem = processed[processed.length - 1];
                if (lastItem.type === 'text') {
                    lastItem.content += ' ' + item.content;
                    continue;
                }
            }
            
            processed.push(item);
        }
        
        return processed;
    }

    /**
     * 将提取的内容转换为HTML
     * @param {Object} extractedContent - 提取的内容
     * @returns {string} 转换后的HTML
     */
    convertToHtml(extractedContent) {
        const { metadata, content } = extractedContent;
        
        let html = `
            <div class="extracted-content">
                <div class="metadata">
                    <h1>${this.escapeHtml(metadata.title)}</h1>
                    ${metadata.description ? `<p>${this.escapeHtml(metadata.description)}</p>` : ''}
                    ${metadata.url ? `<p>来源: <a href="${metadata.url}" target="_blank">${this.escapeHtml(metadata.url)}</a></p>` : ''}
                </div>
                <div class="content">
                    ${this.renderContent(content)}
                </div>
            </div>
        `;
        
        return html;
    }

    /**
     * 渲染内容
     * @param {Array|Object} content - 要渲染的内容
     * @returns {string} 渲染后的HTML
     */
    renderContent(content) {
        if (!content) return '';
        
        if (Array.isArray(content)) {
            return content.map(item => this.renderContent(item)).join('');
        }
        
        switch (content.type) {
            case 'text':
                return this.escapeHtml(content.content);
                
            case 'heading':
                return `<h${content.level}>${this.escapeHtml(content.content)}</h${content.level}>`;
                
            case 'paragraph':
                return `<p>${this.renderContent(content.content)}</p>`;
                
            case 'image':
                return `<figure>
                    <img src="${content.src}" alt="${this.escapeHtml(content.alt)}" 
                         ${content.title ? `title="${this.escapeHtml(content.title)}"` : ''}
                         ${content.width ? `width="${content.width}"` : ''} 
                         ${content.height ? `height="${content.height}"` : ''}>
                    ${content.caption ? `<figcaption>${this.escapeHtml(content.caption)}</figcaption>` : 
                      content.alt ? `<figcaption>${this.escapeHtml(content.alt)}</figcaption>` : ''}
                </figure>`;
                
            case 'link':
                return `<a href="${content.href}" target="_blank">${this.escapeHtml(content.content)}</a>`;
                
            case 'strong':
                return `<strong>${this.escapeHtml(content.content)}</strong>`;
                
            case 'emphasis':
                return `<em>${this.escapeHtml(content.content)}</em>`;
                
            case 'inline-code':
                return `<code>${this.escapeHtml(content.content)}</code>`;
                
            case 'unordered-list':
                return `<ul>${content.items.map(item => `<li>${this.renderContent(item)}</li>`).join('')}</ul>`;
                
            case 'ordered-list':
                return `<ol>${content.items.map(item => `<li>${this.renderContent(item)}</li>`).join('')}</ol>`;
                
            case 'table':
                return `
                    <table>
                        <thead>
                            <tr>${content.headers.map(header => `<th>${this.escapeHtml(header)}</th>`).join('')}</tr>
                        </thead>
                        <tbody>
                            ${content.rows.map(row => `
                                <tr>${row.map(cell => `<td>${this.escapeHtml(cell)}</td>`).join('')}</tr>
                            `).join('')}
                        </tbody>
                    </table>
                `;
                
            case 'code':
                return `<pre><code${content.language ? ` class="language-${content.language}"` : ''}>${this.escapeHtml(content.content)}</code></pre>`;
                
            case 'blockquote':
                return `<blockquote>${this.renderContent(content.content)}</blockquote>`;
                
            case 'divider':
                return '<hr>';
                
            default:
                return '';
        }
    }

    /**
     * 转义HTML字符
     * @param {string} str - 要转义的字符串
     * @returns {string} 转义后的字符串
     */
    escapeHtml(str) {
        if (!str) return '';
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    /**
     * 将提取的内容转换为JSON
     * @param {Object} extractedContent - 提取的内容
     * @returns {string} JSON字符串
     */
    convertToJson(extractedContent) {
        return JSON.stringify(extractedContent, null, 2);
    }

    /**
     * 将提取的内容转换为Markdown
     * @param {Object} extractedContent - 提取的内容
     * @returns {string} Markdown文本
     */
    convertToMarkdown(extractedContent) {
        const { metadata, content } = extractedContent;
        
        let markdown = `# ${metadata.title}\n\n`;
        
        if (metadata.description) {
            markdown += `${metadata.description}\n\n`;
        }
        
        if (metadata.url) {
            markdown += `来源: [${metadata.url}](${metadata.url})\n\n`;
        }
        
        markdown += this.renderMarkdown(content);
        
        return markdown;
    }

    /**
     * 渲染Markdown内容
     * @param {Array|Object} content - 要渲染的内容
     * @returns {string} 渲染后的Markdown
     */
    renderMarkdown(content) {
        if (!content) return '';
        
        if (Array.isArray(content)) {
            return content.map(item => this.renderMarkdown(item)).join('\n\n');
        }
        
        switch (content.type) {
            case 'text':
                return content.content;
                
            case 'heading':
                return `${'#'.repeat(content.level)} ${content.content}`;
                
            case 'paragraph':
                return this.renderMarkdown(content.content);
                
            case 'image':
                return `![${content.alt}](${content.src})${content.caption ? `\n*${content.caption}*` : ''}`;
                
            case 'link':
                return `[${content.content}](${content.href})`;
                
            case 'strong':
                return `**${content.content}**`;
                
            case 'emphasis':
                return `*${content.content}*`;
                
            case 'inline-code':
                return `\`${content.content}\``;
                
            case 'unordered-list':
                return content.items.map(item => `- ${this.renderMarkdown(item)}`).join('\n');
                
            case 'ordered-list':
                return content.items.map((item, index) => `${index + 1}. ${this.renderMarkdown(item)}`).join('\n');
                
            case 'table':
                let tableMarkdown = `| ${content.headers.join(' | ')} |\n`;
                tableMarkdown += `| ${content.headers.map(() => '---').join(' | ')} |\n`;
                tableMarkdown += content.rows.map(row => `| ${row.join(' | ')} |`).join('\n');
                return tableMarkdown;
                
            case 'code':
                return `\`\`\`${content.language}\n${content.content}\n\`\`\``;
                
            case 'blockquote':
                return this.renderMarkdown(content.content).split('\n').map(line => `> ${line}`).join('\n');
                
            case 'divider':
                return '---';
                
            default:
                return '';
        }
    }

    /**
     * 提取网页内容并转换为指定格式
     * @param {string} url - 网页URL
     * @param {string} format - 输出格式 (html, json, markdown)
     * @returns {Promise<string>} 转换后的内容
     */
    async extract(url, format = 'html') {
        try {
            // 获取网页内容
            const html = await this.fetchWebpage(url);
            
            // 提取内容
            const extractedContent = this.extractContent(html);
            
            // 设置URL
            extractedContent.metadata.url = url;
            
            // 根据格式转换内容
            switch (format.toLowerCase()) {
                case 'json':
                    return this.convertToJson(extractedContent);
                case 'markdown':
                case 'md':
                    return this.convertToMarkdown(extractedContent);
                case 'html':
                default:
                    return this.convertToHtml(extractedContent);
            }
        } catch (error) {
            console.error('提取内容失败:', error);
            throw error;
        }
    }
}

export default ContentExtractor; 