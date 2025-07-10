import { toolsManager } from '../js/managers/tools-manager.js';
import { getToolIcon } from '../js/config/icon-config.js';
import { LanguageSwitcher } from '../js/components/LanguageSwitcher.js';
import ThemeSwitcher from '../js/components/ThemeSwitcher.js';
import { getI18nManager } from '../js/managers/i18n-manager.js';
import ThemeManager from '../js/managers/theme-manager.js';
import ToolDetail from '../js/core/ToolDetail.js';

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
    try {
        // 获取工具ID
    const toolId = getQueryParam('id');
    if (!toolId) {
            showErrorPage('未指定工具ID');
        return;
    }

        // 确保工具管理器已初始化
        if (!toolsManager.isInitialized()) {
            console.log('🚀 初始化工具管理器...');
        await toolsManager.initialize();
        }
        
        // 获取工具信息
        const tool = toolsManager.getTool(toolId);
        if (!tool) {
            showErrorPage(`未找到ID为 ${toolId} 的工具`);
            return;
        }

        // 设置页面标题
        document.title = `${tool.name} - AI编程工具箱`;
        
        // 创建并初始化工具详情页对象
        const toolDetail = new ToolDetail(toolId);
        await toolDetail.initialize();
        
        // 渲染工具内容
        await renderToolContent(tool, toolDetail);
        
        // 创建阅读进度指示器
        createReadingProgress();
        
        // 创建浮动操作按钮
        createFloatingActions();
        
        // 渲染头部操作区
        renderDetailHeaderActions();
        
        // 设置移动端导航
        setupMobileNavigation();
        
        console.log(`✅ 工具详情页 [${toolId}] 渲染完成`);
        
    } catch (error) {
        console.error('渲染工具详情页失败:', error);
        showErrorPage('加载工具详情页失败');
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
async function renderToolContent(tool, toolDetail) {
    // 获取内容容器
    const contentContainer = document.getElementById('toolContentBody');
    if (!contentContainer) {
        console.error('未找到内容容器');
        return;
    }
    
    console.log('🖌️ 开始渲染工具详情页内容...');
    
    // 更新侧边栏工具信息
    const sidebarToolIcon = document.getElementById('sidebarToolIcon');
    const sidebarToolName = document.getElementById('sidebarToolName');
    const toolBreadcrumbSidebarName = document.getElementById('toolBreadcrumbSidebarName');
    
    if (sidebarToolIcon) {
        // 获取工具图标
        const iconPath = getToolIcon(tool.id);
        sidebarToolIcon.innerHTML = `<img src="${iconPath}" alt="${tool.name}" width="24" height="24">`;
    }
    
    if (sidebarToolName) {
        sidebarToolName.textContent = tool.name || '工具名称';
    }
    
    if (toolBreadcrumbSidebarName) {
        toolBreadcrumbSidebarName.textContent = tool.name || '工具详情';
    }
    
    // 清空容器
    contentContainer.innerHTML = '';
    
    // 获取导航容器
    const navContainer = document.getElementById('toolNavContainer');
    if (!navContainer) {
        console.error('未找到导航容器');
        return;
    }
    
    // 创建内容区域
    const contentArea = document.createElement('div');
    contentArea.className = 'tool-content-area';
    
    console.log('🧭 渲染导航栏...');
    // 渲染导航栏
    toolDetail.renderNavigation(navContainer);
    
    console.log('👋 渲染欢迎页...');
    // 渲染欢迎页
    await toolDetail.renderWelcomePage(contentArea);
    
    // 添加内容到页面
    contentContainer.appendChild(contentArea);
    
    console.log('🔗 设置导航交互...');
    // 设置导航交互
    setupNavigationInteraction(toolDetail, contentArea);
    
    console.log('✅ 工具详情页内容渲染完成');
}

// 添加导航交互设置函数
function setupNavigationInteraction(toolDetail, contentArea) {
    console.log('🔄 设置导航交互...');
    
    // 获取所有导航项
    const navItems = document.querySelectorAll('.nav-item-content');
    const navTabs = document.querySelectorAll('.nav-tab-header');
    
    console.log(`找到 ${navItems.length} 个导航项和 ${navTabs.length} 个标签页`);
    
    // 为导航项添加点击事件
    navItems.forEach(item => {
        const itemId = item.getAttribute('data-item');
        if (!itemId) return;
        
        item.addEventListener('click', async (event) => {
            event.preventDefault();
            console.log(`🖱️ 点击导航项: ${itemId}`);
            
            // 移除所有激活状态
            navItems.forEach(i => i.parentElement.classList.remove('active'));
            
            // 添加激活状态
            item.parentElement.classList.add('active');
            
            // 加载并渲染内容
            await toolDetail.renderContent(itemId, contentArea);
            
            // 更新URL
            updateUrlWithNavItem(itemId);
        });
    });
    
    // 为标签页添加点击事件
    navTabs.forEach(tab => {
        const tabId = tab.getAttribute('data-tab-toggle');
        if (!tabId) return;
        
        tab.addEventListener('click', (event) => {
            // 如果点击的是展开/折叠图标，不处理
            if (event.target.hasAttribute('data-toggle')) {
                return;
            }
            
            console.log(`🖱️ 点击标签页: ${tabId}`);
            
            // 移除所有激活状态
            navTabs.forEach(t => t.parentElement.classList.remove('active'));
            
            // 添加激活状态
            tab.parentElement.classList.add('active');
            
            // 更新URL
            updateUrlWithNavItem(tabId);
        });
    });
    
    // 检查URL中是否有指定的导航项
    const navItem = getQueryParam('nav');
    if (navItem) {
        console.log(`🔍 URL中指定的导航项: ${navItem}`);
        
        // 查找对应的导航项
        const item = document.querySelector(`[data-item="${navItem}"]`);
        if (item) {
            console.log(`✅ 找到导航项，模拟点击: ${navItem}`);
            // 模拟点击
            item.click();
    } else {
            // 查找对应的标签页
            const tab = document.querySelector(`[data-tab-toggle="${navItem}"]`);
            if (tab) {
                console.log(`✅ 找到标签页，模拟点击: ${navItem}`);
                tab.click();
            } else {
                console.log(`❌ 未找到导航项或标签页: ${navItem}`);
            }
        }
    } else {
        console.log('URL中未指定导航项，使用默认项');
        
        // 如果没有指定导航项，默认选择第一个标签页
        if (navTabs.length > 0) {
            navTabs[0].click();
        }
    }
    
    console.log('✅ 导航交互设置完成');
}

// 添加更新URL函数
function updateUrlWithNavItem(itemId) {
    const url = new URL(window.location.href);
    url.searchParams.set('nav', itemId);
    window.history.replaceState({}, '', url);
}

// 移除或修改以下函数，因为它们已被新的导航系统替代
// 注释掉而不是删除，以便参考
/*
function renderWelcomePage(tool) {
    // 已被ToolDetail.renderWelcomePage替代
}

function renderPrefaceTab(tool) {
    // 已被新的导航系统替代
}

function renderLearningPathTab(tool) {
    // 已被新的导航系统替代
}

function renderBasicTutorialsTab(tool) {
    // 已被新的导航系统替代
}

function renderAdvancedTutorialsTab(tool) {
    // 已被新的导航系统替代
}

function renderPracticalProjectsTab(tool) {
    // 已被新的导航系统替代
}

function renderFAQTab(tool) {
    // 已被新的导航系统替代
}

function setupTabNavigation() {
    // 已被setupNavigationInteraction替代
}

function switchToPage(newLink, newContent, allLinks, allContents) {
    // 已被新的导航系统替代
}

function activateNewPage(newLink, newContent) {
    // 已被新的导航系统替代
}
*/

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