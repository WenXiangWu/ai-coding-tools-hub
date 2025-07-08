import { toolsManager } from '../js/managers/tools-manager.js';
import { getToolIcon } from '../js/config/icon-config.js';
import { LanguageSwitcher } from '../js/components/LanguageSwitcher.js';
import ThemeSwitcher from '../js/components/ThemeSwitcher.js';
import { getI18nManager } from '../js/managers/i18n-manager.js';
import ThemeManager from '../js/managers/theme-manager.js';

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

// 目录功能已移除

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
        window.location.href = '../../index.html';
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
        const breadcrumbElement = document.getElementById('toolBreadcrumbSidebarName');
        if (breadcrumbElement) {
            breadcrumbElement.textContent = tool.name;
        }
        
        // 更新侧边栏信息
        const iconPath = getToolIcon(tool.id);
        document.getElementById('sidebarToolIcon').innerHTML = `
            <img src="${iconPath}" 
                 alt="${tool.name} 图标" 
                 class="tool-icon-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div class="tool-icon-fallback" style="display: none;">
                <div class="${tool.logo || 'tool-icon fas fa-tools'}"></div>
            </div>
        `;
        document.getElementById('sidebarToolName').textContent = tool.name;
        
        // 更新外部链接
        const officialWebsite = document.getElementById('officialWebsite');
        const documentationLink = document.getElementById('documentationLink');
        const githubLink = document.getElementById('githubLink');
        const changelogLink = document.getElementById('changelogLink');
        

        
        if (officialWebsite) {
            if (tool.website) {
                officialWebsite.href = tool.website;
                officialWebsite.parentElement.style.display = 'list-item';
            } else {
                officialWebsite.parentElement.style.display = 'none';
            }
        }
        
        if (documentationLink) {
            if (tool.documentation) {
                documentationLink.href = tool.documentation;
                documentationLink.parentElement.style.display = 'list-item';
            } else {
                documentationLink.parentElement.style.display = 'none';
            }
        }
        
        if (githubLink) {
            if (tool.github) {
                githubLink.href = tool.github;
                githubLink.parentElement.style.display = 'list-item';
            } else {
                githubLink.parentElement.style.display = 'none';
            }
        }
        
        if (changelogLink) {
            if (tool.changelog) {
                changelogLink.href = tool.changelog;
                changelogLink.parentElement.style.display = 'list-item';
            } else {
                changelogLink.parentElement.style.display = 'none';
            }
        }

        // 渲染主内容
        renderToolContent(tool);
        
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
                <button class="btn btn-primary" onclick="window.location.href='../../index.html'">
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

    // 不渲染Hero区域，让欢迎页面在主内容区域显示
    headerContainer.innerHTML = '';

    // 创建欢迎页面和tab内容容器
    bodyContainer.innerHTML = `
        <div class="tab-content-container">
            ${renderWelcomePage(tool)}
            ${renderPrefaceTab(tool)}
            ${renderLearningPathTab(tool)}
            ${renderBasicTutorialsTab(tool)}
            ${renderAdvancedTutorialsTab(tool)}
            ${renderPracticalProjectsTab(tool)}
            ${renderFAQTab(tool)}
        </div>
    `;

    // 初始化tab功能
    setupTabNavigation();
    setupFAQInteraction();
}

// 渲染科技感欢迎页面
function renderWelcomePage(tool) {
    return `
        <div class="welcome-page active" id="welcome">
            <div class="tech-welcome-container">
                <div class="tech-background">
                    <div class="tech-grid"></div>
                    <div class="tech-particles"></div>
                </div>
                
                <div class="welcome-content-main">
                    <div class="tech-header">
                        <div class="welcome-text">
                            <h1 class="tech-title">
                                <span class="title-line">欢迎来到</span>
                                <div class="title-tool-section">
                                    <div class="tool-logo-inline">
                                        <img src="${getToolIcon(tool.id)}" 
                                             alt="${tool.name} 图标" 
                                             class="tool-icon-img inline" 
                                             onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                        <div class="tool-icon-fallback" style="display: none;">
                                            <div class="${tool.logo || 'tool-icon fas fa-tools'}"></div>
                                        </div>
                                        <div class="logo-glow-inline"></div>
                                    </div>
                                    <span class="title-highlight">${tool.name}</span>
                                </div>
                                <span class="title-line">学习中心</span>
                            </h1>
                            <p class="tech-subtitle">${tool.description || '革命性的AI代码编辑器，基于GPT-4构建，提供智能代码补全、自然语言编程和实时代码解释。'}</p>
                        </div>
                    </div>
                    
                    <div class="tech-features">
                        <div class="feature-matrix">
                            <div class="matrix-item" data-delay="0">
                                <div class="matrix-icon">
                                    <i class="fas fa-brain"></i>
                                </div>
                                <h3>AI智能引擎</h3>
                                <p>强大的AI驱动代码生成与优化</p>
                            </div>
                            <div class="matrix-item" data-delay="200">
                                <div class="matrix-icon">
                                    <i class="fas fa-rocket"></i>
                                </div>
                                <h3>极速开发</h3>
                                <p>10倍提升开发效率和代码质量</p>
                            </div>
                            <div class="matrix-item" data-delay="400">
                                <div class="matrix-icon">
                                    <i class="fas fa-shield-alt"></i>
                                </div>
                                <h3>企业级安全</h3>
                                <p>本地处理确保代码安全与隐私</p>
                            </div>
                            <div class="matrix-item" data-delay="600">
                                <div class="matrix-icon">
                                    <i class="fas fa-infinity"></i>
                                </div>
                                <h3>无限可能</h3>
                                <p>支持所有主流编程语言和框架</p>
                            </div>
                        </div>
                    </div>

                    
                    <div class="tech-cta">
                        <div class="cta-text">
                            <h2>开始您的AI编程之旅</h2>
                            <p>选择左侧教程开始学习，或直接体验强大功能</p>
                        </div>
                        <div class="cta-buttons">
                            <button class="tech-btn primary" onclick="document.querySelector('a[href=\\"#learning-path\\"]').click()">
                                <i class="fas fa-play"></i>
                                开始学习路线
                            </button>
                            <button class="tech-btn secondary" onclick="window.open('${tool.website}', '_blank')">
                                <i class="fas fa-external-link-alt"></i>
                                立即体验
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染前言tab
function renderPrefaceTab(tool) {
    return `
        <div class="tab-content" id="preface">
            <div class="content-section">
                <h2>前言</h2>
                <div class="section-content">
                    <div class="preface-content">
                        <div class="intro-grid">
                            <div class="intro-item">
                                <i class="fas fa-lightbulb"></i>
                                <h4>为什么选择 ${tool.name}？</h4>
                                <p>先进的AI技术，智能代码补全，大幅提升开发效率</p>
                            </div>
                            <div class="intro-item">
                                <i class="fas fa-rocket"></i>
                                <h4>快速上手</h4>
                                <p>简单配置，即刻开始使用，无需复杂的学习成本</p>
                            </div>
                            <div class="intro-item">
                                <i class="fas fa-users"></i>
                                <h4>社区支持</h4>
                                <p>活跃的开发者社区，丰富的学习资源和技术支持</p>
                            </div>
                            <div class="intro-item">
                                <i class="fas fa-book-open"></i>
                                <h4>系统学习</h4>
                                <p>从基础到进阶，完整的学习路径和实战项目</p>
                            </div>
                        </div>
                        
                        <div class="learning-guide">
                            <h3>如何使用本学习中心</h3>
                            <div class="guide-steps">
                                <div class="guide-step">
                                    <span class="step-number">1</span>
                                    <div class="step-content">
                                        <h5>按照学习路线</h5>
                                        <p>建议按顺序学习，从学习路线开始</p>
                                    </div>
                                </div>
                                <div class="guide-step">
                                    <span class="step-number">2</span>
                                    <div class="step-content">
                                        <h5>动手实践</h5>
                                        <p>通过入门和进阶教程进行实际操作</p>
                                    </div>
                                </div>
                                <div class="guide-step">
                                    <span class="step-number">3</span>
                                    <div class="step-content">
                                        <h5>项目实战</h5>
                                        <p>完成实战项目，巩固所学知识</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染学习路线tab
function renderLearningPathTab(tool) {
    return `
        <div class="tab-content" id="learning-path">
            <div class="content-section">
                <h2>学习路线</h2>
                <div class="section-content">
                    <div class="learning-path-timeline">
                        <div class="path-step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <h4>环境准备</h4>
                                <p>安装必要的开发环境和 ${tool.name} 插件</p>
                                <span class="time-estimate">预计时间：30分钟</span>
                            </div>
                        </div>
                        <div class="path-step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <h4>基础配置</h4>
                                <p>了解基本配置选项，设置个人偏好</p>
                                <span class="time-estimate">预计时间：1小时</span>
                            </div>
                        </div>
                        <div class="path-step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <h4>核心功能</h4>
                                <p>掌握代码补全、智能建议等核心功能</p>
                                <span class="time-estimate">预计时间：2小时</span>
                            </div>
                        </div>
                        <div class="path-step">
                            <div class="step-number">4</div>
                            <div class="step-content">
                                <h4>进阶技巧</h4>
                                <p>学习高级功能和最佳实践</p>
                                <span class="time-estimate">预计时间：3小时</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染入门教程tab
function renderBasicTutorialsTab(tool) {
    return `
        <div class="tab-content" id="basic-tutorials">
            <div class="content-section">
                <h2>入门教程</h2>
                <div class="section-content">
                    <div class="tutorial-grid">
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-play-circle"></i>
                            </div>
                            <h4>快速开始</h4>
                            <p>5分钟快速上手 ${tool.name}，了解基本操作流程</p>
                            <span class="tutorial-level">初级</span>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">开始学习</a>
                        </div>
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-cog"></i>
                            </div>
                            <h4>安装配置</h4>
                            <p>详细的安装步骤和基础配置说明</p>
                            <span class="tutorial-level">初级</span>
                            <a href="${tool.documentation || tool.website}" class="btn btn-outline btn-sm" target="_blank">查看教程</a>
                        </div>
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-keyboard"></i>
                            </div>
                            <h4>基础操作</h4>
                            <p>学习常用快捷键和基本操作技巧</p>
                            <span class="tutorial-level">初级</span>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">学习操作</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染进阶教程tab
function renderAdvancedTutorialsTab(tool) {
    return `
        <div class="tab-content" id="advanced-tutorials">
            <div class="content-section">
                <h2>进阶教程</h2>
                <div class="section-content">
                    <div class="tutorial-grid">
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-magic"></i>
                            </div>
                            <h4>高级功能</h4>
                            <p>探索 ${tool.name} 的高级功能和特性</p>
                            <span class="tutorial-level">高级</span>
                            <a href="${tool.documentation || tool.website}" class="btn btn-outline btn-sm" target="_blank">深入学习</a>
                        </div>
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-sliders-h"></i>
                            </div>
                            <h4>自定义配置</h4>
                            <p>根据需求定制个性化的开发环境</p>
                            <span class="tutorial-level">中级</span>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">配置指南</a>
                        </div>
                        <div class="tutorial-card">
                            <div class="tutorial-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <h4>代码优化</h4>
                            <p>利用AI功能提升代码质量和性能</p>
                            <span class="tutorial-level">高级</span>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">优化技巧</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染实战项目tab
function renderPracticalProjectsTab(tool) {
    return `
        <div class="tab-content" id="practical-projects">
            <div class="content-section">
                <h2>实战项目</h2>
                <div class="section-content">
                    <div class="project-grid">
                        <div class="project-card">
                            <div class="project-header">
                                <div class="project-icon">
                                    <i class="fas fa-globe"></i>
                                </div>
                                <span class="project-level">初级项目</span>
                            </div>
                            <h4>简单Web应用</h4>
                            <p>使用 ${tool.name} 构建一个简单的Web应用，体验AI辅助开发</p>
                            <div class="project-meta">
                                <span><i class="fas fa-clock"></i> 2-4小时</span>
                                <span><i class="fas fa-star"></i> 适合新手</span>
                            </div>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">开始项目</a>
                        </div>
                        <div class="project-card">
                            <div class="project-header">
                                <div class="project-icon">
                                    <i class="fas fa-mobile-alt"></i>
                                </div>
                                <span class="project-level">中级项目</span>
                            </div>
                            <h4>移动应用开发</h4>
                            <p>创建一个移动应用，探索跨平台开发最佳实践</p>
                            <div class="project-meta">
                                <span><i class="fas fa-clock"></i> 1-2天</span>
                                <span><i class="fas fa-star"></i> 有一定基础</span>
                            </div>
                            <a href="${tool.website}" class="btn btn-outline btn-sm" target="_blank">查看项目</a>
                        </div>
                        <div class="project-card">
                            <div class="project-header">
                                <div class="project-icon">
                                    <i class="fas fa-robot"></i>
                                </div>
                                <span class="project-level">高级项目</span>
                            </div>
                            <h4>AI集成项目</h4>
                            <p>构建一个集成AI功能的复杂应用系统</p>
                            <div class="project-meta">
                                <span><i class="fas fa-clock"></i> 1-2周</span>
                                <span><i class="fas fa-star"></i> 经验丰富</span>
                            </div>
                            <a href="${tool.github || tool.website}" class="btn btn-outline btn-sm" target="_blank">挑战项目</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 渲染FAQ tab
function renderFAQTab(tool) {
    return `
        <div class="tab-content" id="faq">
            <div class="content-section">
                <h2>常见问题(FAQ)</h2>
                <div class="section-content">
                    <div class="faq-list">
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>如何开始使用 ${tool.name}？</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>首先访问官方网站下载并安装 ${tool.name}，然后按照安装向导完成配置。建议先查看快速入门教程了解基本操作。</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>${tool.name} 支持哪些编程语言？</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>${tool.supported_languages ? 
                                    `${tool.name} 支持 ${tool.supported_languages.join('、')} 等主流编程语言。` : 
                                    `${tool.name} 支持多种主流编程语言，具体支持列表请查看官方文档。`}</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>遇到问题时如何获取帮助？</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>可以通过以下方式获取帮助：1) 查看官方文档；2) 访问社区论坛；3) 提交GitHub Issue；4) 联系官方技术支持。</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>${tool.name} 是否免费使用？</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>${tool.price === 'free' ? `${tool.name} 完全免费使用。` : 
                                    tool.price === 'freemium' ? `${tool.name} 提供免费版本，同时也有功能更丰富的付费版本。` : 
                                    `${tool.name} 为付费工具，具体价格请查看官方网站。`}</p>
                            </div>
                        </div>
                        <div class="faq-item">
                            <div class="faq-question">
                                <h4>如何更新到最新版本？</h4>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                            <div class="faq-answer">
                                <p>大多数情况下 ${tool.name} 会自动检测并提示更新。你也可以在设置中手动检查更新，或者到官方网站下载最新版本。</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 设置tab导航功能 - 增强版页面切换
function setupTabNavigation() {
    // 只选择内部导航的链接，排除外部链接
    const navLinks = document.querySelectorAll('.nav-link:not([target="_blank"])');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (navLinks.length === 0 || tabContents.length === 0) {
        return;
    }
    
    let currentActiveTab = null;
    
    // 创建页面指示器
    createPageIndicator();
    
    navLinks.forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href').substring(1);
            const targetContent = document.getElementById(targetId);
            
            if (!targetContent) {
                return;
            }
            
            if (link.classList.contains('active')) {
                return;
            }
            
            // 执行页面切换动画
            switchToPage(link, targetContent, navLinks, tabContents);
        });
    });
    
    // 初始化页面 - 默认显示欢迎页面，不选中任何tab
    // 移除所有导航链接的active状态
    navLinks.forEach(link => link.classList.remove('active'));
    
    // 移除所有tab内容的active状态，但保持欢迎页面的active状态
    tabContents.forEach(content => {
        if (!content.classList.contains('welcome-page')) {
            content.classList.remove('active');
        }
    });
    
    // 确保欢迎页面是显示的
    const welcomePage = document.getElementById('welcome');
    if (welcomePage) {
        welcomePage.classList.add('active');
        currentActiveTab = welcomePage;
    }
    
    // 欢迎页面不显示页面指示器
    const pageIndicator = document.querySelector('.page-indicator');
    if (pageIndicator) {
        pageIndicator.classList.remove('show');
    }
    
    // 初始化欢迎页面的动画和统计数字
    initWelcomePageAnimations();
}

// 页面切换核心函数
function switchToPage(newLink, newContent, allLinks, allContents) {
    // 显示加载状态
    showPageTransition();
    
    // 移除所有导航active状态
    allLinks.forEach(link => link.classList.remove('active'));
    
    // 找到当前活动的内容（包括欢迎页面）
    const currentContent = document.querySelector('.tab-content.active, .welcome-page.active');
    
    if (currentContent) {
        // 当前页面退出动画
        currentContent.classList.add('exiting');
        
        setTimeout(() => {
            currentContent.classList.remove('active', 'exiting');
            
            // 激活新页面
            activateNewPage(newLink, newContent);
        }, 200);
    } else {
        // 直接激活新页面
        activateNewPage(newLink, newContent);
    }
}

// 激活新页面
function activateNewPage(newLink, newContent) {
    newLink.classList.add('active');
    newContent.classList.add('active');
    
    // 更新页面指示器（只对tab页面显示）
    if (newContent && !newContent.classList.contains('welcome-page')) {
        updatePageIndicator(getPageTitle(newLink));
    }
    
    // 隐藏加载状态
    hidePageTransition();
    
    // 滚动到顶部
    newContent.scrollTop = 0;
}

// 创建页面指示器
function createPageIndicator() {
    if (document.querySelector('.page-indicator')) return;
    
    const indicator = document.createElement('div');
    indicator.className = 'page-indicator';
    indicator.innerHTML = '<i class="fas fa-book-open"></i> <span class="page-title">前言</span>';
    document.body.appendChild(indicator);
}

// 更新页面指示器
function updatePageIndicator(title) {
    const indicator = document.querySelector('.page-indicator');
    if (indicator) {
        const titleSpan = indicator.querySelector('.page-title');
        if (titleSpan) {
            titleSpan.textContent = title;
        }
        
        // 显示指示器
        indicator.classList.add('show');
        
        // 3秒后自动隐藏
        clearTimeout(window.indicatorTimeout);
        window.indicatorTimeout = setTimeout(() => {
            indicator.classList.remove('show');
        }, 3000);
    }
}

// 获取页面标题
function getPageTitle(link) {
    const span = link.querySelector('span');
    return span ? span.textContent : link.textContent;
}

// 显示页面切换过渡效果
function showPageTransition() {
    const container = document.querySelector('.tab-content-container');
    if (container) {
        container.style.opacity = '0.7';
        container.style.transform = 'scale(0.98)';
    }
}

// 隐藏页面切换过渡效果
function hidePageTransition() {
    const container = document.querySelector('.tab-content-container');
    if (container) {
        setTimeout(() => {
            container.style.opacity = '1';
            container.style.transform = 'scale(1)';
        }, 100);
    }
}

// 设置FAQ交互功能
function setupFAQInteraction() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                // 切换当前FAQ项的展开状态
                item.classList.toggle('active');
                
                // 可选：关闭其他已展开的FAQ项（手风琴效果）
                // faqItems.forEach(otherItem => {
                //     if (otherItem !== item) {
                //         otherItem.classList.remove('active');
                //     }
                // });
            });
        }
    });
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

// 初始化欢迎页面动画
function initWelcomePageAnimations() {
    // 初始化矩阵特性动画
    const matrixItems = document.querySelectorAll('.matrix-item');
    matrixItems.forEach((item, index) => {
        const delay = item.getAttribute('data-delay') || index * 200;
        setTimeout(() => {
            item.classList.add('animate-in');
        }, delay);
    });
    

    
    // 初始化粒子背景动画
    initParticleBackground();
}



// 初始化粒子背景
function initParticleBackground() {
    const particlesContainer = document.querySelector('.tech-particles');
    if (!particlesContainer) return;
    
    // 创建粒子
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 10 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
        particlesContainer.appendChild(particle);
    }
}

// 渲染详情页右上角的语言切换器和主题切换器
function renderDetailHeaderActions() {
    console.log('🎯 开始渲染详情页头部操作区');
    
    try {
        // 获取容器
        const languageSwitcherContainer = document.getElementById('detailLanguageSwitcher');
        const themeSwitcherContainer = document.getElementById('detailThemeSwitcher');
        
        if (!languageSwitcherContainer || !themeSwitcherContainer) {
            console.error('❌ 找不到语言切换器或主题切换器容器');
            return;
        }
        
        // 初始化语言切换器
        try {
            const i18nManager = getI18nManager();
            if (i18nManager) {
                const languageSwitcher = new LanguageSwitcher({
                    container: languageSwitcherContainer,
                    i18nManager: i18nManager
                });
                console.log('✅ 语言切换器初始化成功');
            } else {
                console.error('❌ i18n管理器不可用');
            }
        } catch (error) {
            console.error('❌ 语言切换器初始化失败:', error);
        }
        
        // 初始化主题切换器
        try {
            const themeManager = new ThemeManager();
            if (themeManager) {
                const themeSwitcher = new ThemeSwitcher({
                    container: themeSwitcherContainer,
                    themeManager: themeManager
                });
                console.log('✅ 主题切换器初始化成功');
            } else {
                console.error('❌ 主题管理器不可用');
            }
        } catch (error) {
            console.error('❌ 主题切换器初始化失败:', error);
        }
        
        console.log('✅ 详情页头部操作区渲染完成');
    } catch (error) {
        console.error('❌ 渲染详情页头部操作区失败:', error);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    renderDetailHeaderActions();
    renderToolDetail();
});

/**
 * 更新语言显示
 */
function updateLanguageDisplay() {
    try {
        console.log('🔄 LanguageSwitcher: 更新语言显示');
        
        const i18nManager = getI18nManager();
        if (!i18nManager) {
            console.warn('⚠️ LanguageSwitcher: i18n管理器不存在');
            return;
        }
        
        const supportedLanguages = i18nManager.getSupportedLanguages();
        const currentLang = supportedLanguages.find(lang => lang && lang.code === i18nManager.getCurrentLanguage());
        
        // 更新选项状态
        const select = document.querySelector('#detailLanguageSwitcher .language-select');
        if (select) {
            select.value = currentLang?.code || i18nManager.getCurrentLanguage();
        }
        
        console.log('✅ LanguageSwitcher: 语言显示已更新');
        
    } catch (error) {
        console.error('❌ LanguageSwitcher: 更新语言显示失败:', error);
    }
} 