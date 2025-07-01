import { toolsManager } from './js/managers/tools-manager.js';

// 获取URL参数
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

// 获取价格文本
function getPriceText(price) {
    switch (price) {
        case 'free': return '免费';
        case 'freemium': return '部分免费';
        case 'paid': return '付费';
        default: return price;
    }
}

// 渲染星级评分
function renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // 实心星
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // 半星
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // 空心星
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// 滚动到指定元素
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// 生成目录
function generateTOC() {
    const content = document.getElementById('toolContentBody');
    if (!content) return;

    const headers = content.querySelectorAll('h2, h3, h4');
    const tocNav = document.getElementById('tocNav');
    
    if (!tocNav || headers.length === 0) return;

    let tocHTML = '<ul class="toc-list">';
    headers.forEach((header, index) => {
        const id = `section-${index}`;
        header.id = id;
        header.classList.add('section-anchor');
        
        const level = header.tagName.toLowerCase();
        const text = header.textContent;
        
        tocHTML += `<li class="toc-level-${level}">
            <a href="#${id}" onclick="scrollToElement('${id}')">${text}</a>
        </li>`;
    });
    tocHTML += '</ul>';
    
    tocNav.innerHTML = tocHTML;
}

// 计算阅读时间
function calculateReadingTime(text) {
    const wordsPerMinute = 200; // 中文阅读速度约200字/分钟
    const wordCount = text.replace(/\s+/g, '').length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return { wordCount, readingTime };
}

// 创建阅读进度指示器
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.id = 'readingProgress';
    document.body.appendChild(progressBar);
    
    // 监听滚动事件更新进度
    window.addEventListener('scroll', updateReadingProgress);
}

// 更新阅读进度
function updateReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    progressBar.style.width = Math.min(progress, 100) + '%';
}

// 创建浮动操作按钮
function createFloatingActions() {
    const floatingActions = document.createElement('div');
    floatingActions.className = 'floating-actions';
    floatingActions.innerHTML = `
        <button class="floating-btn secondary" onclick="toggleBookmark()" title="收藏">
            <i class="fas fa-bookmark"></i>
        </button>
        <button class="floating-btn secondary" onclick="shareContent()" title="分享">
            <i class="fas fa-share-alt"></i>
        </button>
        <button class="floating-btn" onclick="scrollToTop()" title="返回顶部">
            <i class="fas fa-arrow-up"></i>
        </button>
    `;
    document.body.appendChild(floatingActions);
}

// 创建快速行动区域
function createQuickActions(tool) {
    return `
        <div class="tool-quick-actions">
            <div class="quick-action-card" onclick="window.open('${tool.website}', '_blank')">
                <div class="quick-action-icon">
                    <i class="fas fa-external-link-alt"></i>
                </div>
                <h4>立即试用</h4>
                <p>访问官方网站开始使用</p>
                    </div>
            <div class="quick-action-card" onclick="window.open('${tool.documentation}', '_blank')">
                <div class="quick-action-icon">
                    <i class="fas fa-book"></i>
                </div>
                <h4>查看文档</h4>
                <p>学习详细使用教程</p>
            </div>
            ${tool.github ? `
            <div class="quick-action-card" onclick="window.open('${tool.github}', '_blank')">
                <div class="quick-action-icon">
                    <i class="fab fa-github"></i>
                </div>
                <h4>开源代码</h4>
                <p>查看GitHub源码</p>
            </div>
            ` : ''}
            <div class="quick-action-card" onclick="copyToolUrl()">
                <div class="quick-action-icon">
                    <i class="fas fa-link"></i>
                            </div>
                <h4>分享工具</h4>
                <p>复制页面链接</p>
            </div>
                        </div>
    `;
}

// 创建文章元信息
function createArticleMeta(wordCount, readingTime, updatedDate) {
    return `
        <div class="article-meta">
            <div class="reading-time">
                <i class="fas fa-clock"></i>
                <span>预计阅读 ${readingTime} 分钟</span>
                </div>
            <div class="word-count">
                <i class="fas fa-file-alt"></i>
                <span>约 ${wordCount} 字</span>
            </div>
            <div class="last-updated">
                <i class="fas fa-calendar-alt"></i>
                <span>更新于 ${updatedDate}</span>
            </div>
        </div>
    `;
}

// 监听滚动事件，高亮当前章节
function setupScrollSpy() {
    const headers = document.querySelectorAll('.section-anchor');
    const navLinks = document.querySelectorAll('.nav-link, .toc-nav a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // 更新导航高亮
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                entry.target.classList.remove('in-view');
            }
        });
    }, {
        rootMargin: '-100px 0px -50% 0px'
    });
    
    headers.forEach(header => observer.observe(header));
}

// 工具函数
function toggleBookmark() {
    // 实现收藏功能
    const bookmarkBtn = document.querySelector('.floating-btn .fa-bookmark');
    if (bookmarkBtn.classList.contains('fas')) {
        bookmarkBtn.classList.remove('fas');
        bookmarkBtn.classList.add('far');
        showToast('已取消收藏');
    } else {
        bookmarkBtn.classList.remove('far');
        bookmarkBtn.classList.add('fas');
        showToast('已添加到收藏');
    }
}

function shareContent() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            url: window.location.href
        });
    } else {
        copyToolUrl();
    }
}

function copyToolUrl() {
    navigator.clipboard.writeText(window.location.href).then(() => {
        showToast('链接已复制到剪贴板');
    });
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

function showToast(message) {
    // 创建简单的toast通知
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        background: var(--text-primary);
        color: white;
        padding: 12px 20px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        animation: fadeInOut 3s ease;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// 主函数：渲染工具详情页面
async function renderToolDetail() {
    const toolId = getQueryParam('id');
    if (!toolId) {
        console.warn('缺少工具ID参数，返回主页');
        window.location.href = 'index.html';
        return;
    }

    try {
        console.log('正在加载工具详情，ID:', toolId);
        
        // 初始化工具管理器
        await toolsManager.initialize();
        
        // 获取所有工具
        const allTools = toolsManager.getAllTools();
        console.log('已获取工具列表，总数:', allTools.length);
        
        // 查找指定工具
        const tool = allTools.find(t => t.id === toolId);
        
        if (!tool) {
            console.error('未找到指定工具:', toolId);
            showErrorPage(`未找到工具 "${toolId}"`);
            return;
        }

        console.log('成功找到工具:', tool.name);
        
        // 更新页面标题和面包屑
        document.title = `${tool.name} - AI编程工具详情`;
        document.getElementById('toolBreadcrumbName').textContent = tool.name;
        
        // 更新侧边栏信息
        document.getElementById('sidebarToolIcon').innerHTML = `<div class="${tool.logo || 'tool-icon fas fa-tools'}"></div>`;
        document.getElementById('sidebarToolName').textContent = tool.name;
        document.getElementById('sidebarToolCategory').textContent = tool.category || tool.type;
        
        // 更新外部链接
        const officialWebsite = document.getElementById('officialWebsite');
        const documentationLink = document.getElementById('documentationLink');
        const githubLink = document.getElementById('githubLink');
        
        if (officialWebsite && tool.website) {
            officialWebsite.href = tool.website;
            officialWebsite.style.display = 'block';
        } else if (officialWebsite) {
            officialWebsite.style.display = 'none';
        }
        
        if (documentationLink && tool.documentation) {
            documentationLink.href = tool.documentation;
            documentationLink.style.display = 'block';
        } else if (documentationLink) {
            documentationLink.style.display = 'none';
        }
        
        if (githubLink && tool.github) {
            githubLink.href = tool.github;
            githubLink.style.display = 'block';
        } else if (githubLink) {
            githubLink.style.display = 'none';
        }

        // 渲染主内容
        renderToolContent(tool);
        
        // 生成目录
        generateTOC();
        
        // 创建用户体验增强功能
        createReadingProgress();
        createFloatingActions();
        setupScrollSpy();
        setupMobileNavigation();
        
        console.log('工具详情页面渲染完成');
        
    } catch (error) {
        console.error('渲染工具详情失败:', error);
        showErrorPage('加载工具详情时发生错误');
    }
}

// 显示错误页面
function showErrorPage(message) {
    const headerContainer = document.getElementById('toolContentHeader');
    const bodyContainer = document.getElementById('toolContentBody');
    
    if (headerContainer) {
        headerContainer.innerHTML = `
            <div class="error-page">
                <div class="error-icon">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h1>出错了</h1>
                <p>${message}</p>
            </div>
        `;
    }
    
    if (bodyContainer) {
        bodyContainer.innerHTML = `
            <div class="error-actions">
                <button class="btn btn-primary" onclick="window.location.href='index.html'">
                    <i class="fas fa-home"></i> 返回主页
                </button>
                <button class="btn btn-outline" onclick="window.location.reload()">
                    <i class="fas fa-refresh"></i> 重新加载
                </button>
            </div>
        `;
    }
}

// 渲染工具内容
function renderToolContent(tool) {
    const headerContainer = document.getElementById('toolContentHeader');
    const bodyContainer = document.getElementById('toolContentBody');
    
    if (!headerContainer || !bodyContainer) return;

    // 渲染Hero区域
    headerContainer.innerHTML = `
        <div class="tool-hero">
            <div class="tool-hero-content">
                <div style="display: flex; align-items: flex-start; gap: var(--spacing-xl);">
                    <div class="tool-hero-icon">
                        <div class="${tool.logo || 'tool-icon fas fa-tools'}"></div>
                    </div>
                    <div class="tool-hero-info" style="flex: 1;">
                        <h1>${tool.name}</h1>
                        <div class="tool-hero-meta">
                            <div class="hero-meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${tool.category || tool.type}</span>
                            </div>
                            <div class="hero-meta-item">
                                <i class="fas fa-star"></i>
                                <span>${tool.rating || 'N/A'} / 5.0</span>
                            </div>
                            <div class="hero-meta-item">
                                <i class="fas fa-users"></i>
                                <span>${tool.users || '未知'}</span>
                            </div>
                            <div class="hero-meta-item">
                                <i class="fas fa-dollar-sign"></i>
                                <span>${getPriceText(tool.price)}</span>
                            </div>
                        </div>
                        <p class="tool-hero-description">${tool.description || '暂无描述'}</p>
                        
                        ${tool.features && tool.features.length > 0 ? `
                        <div class="tool-features-preview">
                            <h4>主要功能：</h4>
                            <div class="feature-tags">
                                ${tool.features.slice(0, 6).map(feature => 
                                    `<span class="feature-tag">${feature}</span>`
                                ).join('')}
                                ${tool.features.length > 6 ? `<span class="feature-tag more">+${tool.features.length - 6}个功能</span>` : ''}
                            </div>
                        </div>
                        ` : ''}
                        
                        ${tool.platforms && tool.platforms.length > 0 ? `
                        <div class="platform-info">
                            <h4>支持平台：</h4>
                            <div class="platform-tags">
                                ${tool.platforms.map(platform => 
                                    `<span class="platform-tag">${platform}</span>`
                                ).join('')}
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
        ${createQuickActions(tool)}
    `;

    // 渲染详细内容
    let contentHTML = '';
    
    // 获取工具文档内容
    const allContent = getAllContent(tool);
    const { wordCount, readingTime } = calculateReadingTime(allContent);
    
    // 添加文章元信息
    contentHTML += createArticleMeta(wordCount, readingTime, tool.updated);
    
    // 工具概述部分
    contentHTML += `
        <div class="content-section" id="overview">
            <h2>工具概述</h2>
            <div class="section-content">
                <p>${tool.description || '暂无详细描述'}</p>
                
                ${tool.pros && tool.pros.length > 0 ? `
                <div class="pros-cons">
                    <div class="pros">
                        <h4>优势</h4>
                        <ul>
                            ${tool.pros.map(pro => `<li>${pro}</li>`).join('')}
                        </ul>
                    </div>
                    ${tool.cons && tool.cons.length > 0 ? `
                    <div class="cons">
                        <h4>注意事项</h4>
                        <ul>
                            ${tool.cons.map(con => `<li>${con}</li>`).join('')}
                        </ul>
                    </div>
                    ` : ''}
                </div>
                ` : ''}
            </div>
        </div>
    `;
    
    // 功能特性部分
    if (tool.features && tool.features.length > 0) {
        contentHTML += `
            <div class="content-section" id="features">
                <h2>功能特性</h2>
                <div class="section-content">
                    <div class="feature-list">
                        ${tool.features.map(feature => `
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 价格方案部分
    contentHTML += `
        <div class="content-section" id="pricing">
            <h2>价格方案</h2>
            <div class="section-content">
                <div class="pricing-info">
                    <div class="price-tag ${tool.price}">
                        <i class="fas fa-dollar-sign"></i>
                        <span>${getPriceText(tool.price)}</span>
                    </div>
                    <p>
                        ${tool.price === 'free' ? '该工具完全免费使用。' : ''}
                        ${tool.price === 'freemium' ? '该工具提供免费版本，付费版本有更多功能。' : ''}
                        ${tool.price === 'paid' ? '该工具为付费工具。' : ''}
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // 支持的编程语言
    if (tool.supported_languages && tool.supported_languages.length > 0) {
        contentHTML += `
            <div class="content-section" id="languages">
                <h2>支持的编程语言</h2>
                <div class="section-content">
                    <div class="platform-tags">
                        ${tool.supported_languages.map(lang => 
                            `<span class="platform-tag">${lang}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 用户评价部分
    contentHTML += `
        <div class="content-section" id="reviews">
            <h2>用户评价</h2>
            <div class="section-content">
                <div class="review-summary">
                    <div class="rating-display">
                        <div class="rating-score">${tool.rating || 'N/A'}</div>
                        <div class="rating-stars">
                            ${renderStars(tool.rating || 0)}
                        </div>
                        <div class="rating-count">基于用户反馈</div>
                    </div>
                </div>
                <p>用户数量：${tool.users || '数据暂不可用'}</p>
                <p>最后更新：${tool.updated || '未知'}</p>
            </div>
        </div>
    `;
    
    // 教程和扩展（如果有的话）
    if (tool.extensions && tool.extensions.tutorials && tool.extensions.tutorials.length > 0) {
        contentHTML += `
            <div class="content-section" id="tutorials">
                <h2>学习教程</h2>
                <div class="section-content">
                    <div class="tutorial-grid">
                        ${tool.extensions.tutorials.map(tutorial => `
                            <div class="tutorial-card">
                                <h4>${tutorial.title}</h4>
                                <span class="tutorial-level">${tutorial.level}</span>
                                <a href="${tutorial.url}" class="btn btn-outline btn-sm">查看教程</a>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    // 如果有原始的文档章节，也渲染它们
    if (tool.documentation_sections) {
        Object.entries(tool.documentation_sections).forEach(([sectionKey, section]) => {
            contentHTML += `
                <div class="content-section" id="${sectionKey}">
                    <h2>${section.title}</h2>
                    ${renderSectionContent(section)}
                </div>
            `;
        });
    }
    
    bodyContainer.innerHTML = contentHTML;
}

// 获取所有内容用于计算字数
function getAllContent(tool) {
    let content = tool.description;
    if (tool.documentation_sections) {
        Object.values(tool.documentation_sections).forEach(section => {
            content += JSON.stringify(section);
        });
    }
    return content;
}

// 渲染章节内容
function renderSectionContent(section) {
    let html = '';
    
    if (section.sections) {
        section.sections.forEach(subsection => {
            html += `
                <div class="sub-section" id="${subsection.id}">
                    <h3>${subsection.title}</h3>
                    <div class="section-content">
                        ${Array.isArray(subsection.content) ? 
                            subsection.content.map(item => `<p>${item}</p>`).join('') :
                            `<p>${subsection.content}</p>`
                        }
                    </div>
                </div>
            `;
        });
    }
    
    return html;
}

// 移动端导航
function setupMobileNavigation() {
    const mobileToggle = document.getElementById('mobileSidebarToggle');
    const sidebar = document.querySelector('.tool-sidebar');
    const overlay = document.getElementById('mobileOverlay');
    
    if (mobileToggle && sidebar && overlay) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateY(20px); }
        10%, 90% { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', renderToolDetail); 