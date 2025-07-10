/**
 * 工具详情页核心类
 * 负责管理工具详情页的结构和状态
 */
import { getToolDetailNavigationManager } from '../managers/tool-detail-navigation-manager.js';

class ToolDetail {
    constructor(toolId) {
        this.toolId = toolId;
        this.navigationManager = null;
        this.contentCache = new Map();
        this.isInitialized = false;
    }

    /**
     * 初始化工具详情页
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn(`工具详情页[${this.toolId}]已初始化`);
            return;
        }

        try {
            console.log(`🔧 初始化工具详情页[${this.toolId}]...`);
            
            // 获取并初始化导航管理器
            this.navigationManager = getToolDetailNavigationManager(this.toolId);
            await this.navigationManager.initialize();
            
            // 设置导航管理器事件监听
            this.setupNavigationEvents();
            
            this.isInitialized = true;
            console.log(`✅ 工具详情页[${this.toolId}]初始化完成`);
            
        } catch (error) {
            console.error(`❌ 工具详情页[${this.toolId}]初始化失败:`, error);
            throw error;
        }
    }

    /**
     * 设置导航管理器事件监听
     */
    setupNavigationEvents() {
        // 监听内容加载事件
        this.navigationManager.on('contentLoaded', ({ itemId, content }) => {
            this.contentCache.set(itemId, content);
        });
        
        // 监听导航项激活事件
        this.navigationManager.on('itemActivated', ({ itemId }) => {
            this.loadContent(itemId).catch(error => {
                console.error(`加载内容失败: ${itemId}`, error);
            });
        });
    }

    /**
     * 渲染导航结构
     * @param {HTMLElement} container - 导航容器
     */
    renderNavigation(container) {
        if (!this.navigationManager) {
            console.error('渲染导航失败: 导航管理器未初始化');
            return;
        }
        
        this.navigationManager.renderNavigation(container);
    }

    /**
     * 渲染欢迎页
     * @param {HTMLElement} container - 内容容器
     * @returns {Promise<void>}
     */
    async renderWelcomePage(container) {
        if (!this.navigationManager) {
            console.error('渲染欢迎页失败: 导航管理器未初始化');
            return;
        }
        
        try {
            console.log('🏠 开始渲染欢迎页...');
            
            // 获取欢迎页配置
            const welcomeConfig = this.navigationManager.getWelcomeConfig();
            if (!welcomeConfig) {
                console.error('渲染欢迎页失败: 欢迎页配置为空');
                container.innerHTML = '<div class="error-message">欢迎页配置加载失败</div>';
                return;
            }
            
            console.log('📋 欢迎页配置:', welcomeConfig);
            console.log('📋 欢迎页特性:', welcomeConfig.features);
            
            // 获取工具信息
            const toolInfo = await this.getToolInfo();
            
            // 创建欢迎页元素
            const welcomeElement = document.createElement('div');
            welcomeElement.className = 'tool-welcome-page';
            
            // 添加粒子背景
            const particlesContainer = document.createElement('div');
            particlesContainer.className = 'tech-particles';
            welcomeElement.appendChild(particlesContainer);
            
            // 标题和描述
            const headerElement = document.createElement('div');
            headerElement.className = 'welcome-header';
            
            // 使用工具信息填充欢迎页
            const titleElement = document.createElement('h1');
            titleElement.textContent = welcomeConfig.title || toolInfo?.name || this.toolId;
            headerElement.appendChild(titleElement);
            
            if (welcomeConfig.subtitle || toolInfo?.category) {
                const subtitleElement = document.createElement('h2');
                subtitleElement.textContent = welcomeConfig.subtitle || toolInfo?.category || '';
                headerElement.appendChild(subtitleElement);
            }
            
            if (welcomeConfig.description || toolInfo?.description) {
                const descriptionElement = document.createElement('p');
                descriptionElement.textContent = welcomeConfig.description || toolInfo?.description || '';
                headerElement.appendChild(descriptionElement);
            }
            
            welcomeElement.appendChild(headerElement);
            
            // 特性列表
            if ((welcomeConfig.features && welcomeConfig.features.length > 0) || (toolInfo?.features && toolInfo.features.length > 0)) {
                console.log('🔍 开始渲染特性列表...');
                console.log('🔍 welcomeConfig.features:', welcomeConfig.features);
                console.log('🔍 toolInfo?.features:', toolInfo?.features);
                
                const featuresElement = document.createElement('div');
                featuresElement.className = 'welcome-features matrix-features';
                
                // 使用配置的特性或工具的特性
                const features = welcomeConfig.features || toolInfo?.features?.map(text => ({
                    title: text,
                    description: '',
                    icon: 'fas fa-check'
                })) || [];
                
                console.log('🔍 最终使用的特性列表:', features);
                
                features.forEach((feature, index) => {
                    const featureElement = document.createElement('div');
                    featureElement.className = 'feature-card matrix-item';
                    featureElement.setAttribute('data-delay', index * 100);
                    
                    if (feature.icon) {
                        const iconElement = document.createElement('div');
                        iconElement.className = 'feature-icon';
                        iconElement.innerHTML = `<i class="${feature.icon}"></i>`;
                        featureElement.appendChild(iconElement);
                    }
                    
                    const featureContent = document.createElement('div');
                    featureContent.className = 'feature-content';
                    
                    const featureTitle = document.createElement('h3');
                    featureTitle.textContent = feature.title;
                    featureContent.appendChild(featureTitle);
                    
                    if (feature.description) {
                        const featureDesc = document.createElement('p');
                        featureDesc.textContent = feature.description;
                        featureContent.appendChild(featureDesc);
                    }
                    
                    featureElement.appendChild(featureContent);
                    featuresElement.appendChild(featureElement);
                });
                
                welcomeElement.appendChild(featuresElement);
            } else {
                console.warn('⚠️ 没有找到特性列表数据');
                // 如果没有特性列表数据，创建一个默认的特性列表
                const defaultFeatures = [
                    {
                        title: "智能代码补全",
                        description: "基于上下文的智能代码补全，提高编码效率",
                        icon: "fas fa-code"
                    },
                    {
                        title: "自然语言编程",
                        description: "使用自然语言描述需求，AI自动生成代码",
                        icon: "fas fa-comment-alt"
                    },
                    {
                        title: "实时代码解释",
                        description: "一键解释复杂代码，快速理解功能逻辑",
                        icon: "fas fa-lightbulb"
                    },
                    {
                        title: "多文件编辑",
                        description: "强大的Composer功能，同时处理多个文件",
                        icon: "fas fa-layer-group"
                    }
                ];
                
                console.log('🔍 使用默认特性列表:', defaultFeatures);
                
                const featuresElement = document.createElement('div');
                featuresElement.className = 'welcome-features matrix-features';
                
                defaultFeatures.forEach((feature, index) => {
                    const featureElement = document.createElement('div');
                    featureElement.className = 'feature-card matrix-item';
                    featureElement.setAttribute('data-delay', index * 100);
                    
                    if (feature.icon) {
                        const iconElement = document.createElement('div');
                        iconElement.className = 'feature-icon';
                        iconElement.innerHTML = `<i class="${feature.icon}"></i>`;
                        featureElement.appendChild(iconElement);
                    }
                    
                    const featureContent = document.createElement('div');
                    featureContent.className = 'feature-content';
                    
                    const featureTitle = document.createElement('h3');
                    featureTitle.textContent = feature.title;
                    featureContent.appendChild(featureTitle);
                    
                    if (feature.description) {
                        const featureDesc = document.createElement('p');
                        featureDesc.textContent = feature.description;
                        featureContent.appendChild(featureDesc);
                    }
                    
                    featureElement.appendChild(featureContent);
                    featuresElement.appendChild(featureElement);
                });
                
                welcomeElement.appendChild(featuresElement);
            }
            
            // 清空并添加到容器
            container.innerHTML = '';
            container.appendChild(welcomeElement);
            
            // 初始化粒子背景
            this.initParticleBackground(particlesContainer);
            
            // 初始化矩阵特性动画
            this.initMatrixAnimation();
            
            console.log('✅ 欢迎页渲染完成');
        } catch (error) {
            console.error('❌ 渲染欢迎页失败:', error);
            container.innerHTML = `<div class="error-message">欢迎页渲染失败: ${error.message}</div>`;
        }
    }
    
    /**
     * 获取工具信息
     * @returns {Promise<Object>} 工具信息
     */
    async getToolInfo() {
        try {
            // 动态导入工具管理器
            const { toolsManager } = await import('../managers/tools-manager.js');
            
            // 确保工具管理器已初始化
            if (!toolsManager.isInitialized()) {
                await toolsManager.initialize();
            }
            
            // 获取工具信息
            return toolsManager.getTool(this.toolId);
        } catch (error) {
            console.error(`获取工具信息失败: ${this.toolId}`, error);
            return null;
        }
    }

    /**
     * 异步加载内容
     * @param {string} id - 内容ID
     * @returns {Promise<Object>} 加载的内容
     */
    async loadContent(id) {
        if (this.contentCache.has(id)) {
            return this.contentCache.get(id);
        }

        try {
            // 使用导航管理器加载内容
            const content = await this.navigationManager.loadContent(id);
            this.contentCache.set(id, content);
            return content;
        } catch (error) {
            console.error(`加载内容失败: ${id}`, error);
            throw error;
        }
    }

    /**
     * 渲染内容
     * @param {string} id - 内容ID
     * @param {HTMLElement} container - 内容容器
     * @returns {Promise<void>}
     */
    async renderContent(id, container) {
        try {
            const content = await this.loadContent(id);
            
            // 清空容器
            container.innerHTML = '';
            
            // 如果内容是HTML字符串
            if (typeof content === 'string') {
                container.innerHTML = content;
            } 
            // 如果内容是DOM元素
            else if (content instanceof HTMLElement) {
                container.appendChild(content);
            } 
            // 如果内容是对象，包含render方法
            else if (content && typeof content.render === 'function') {
                await content.render(container);
            } 
            // 如果内容是对象，包含html属性
            else if (content && content.html) {
                container.innerHTML = content.html;
            } 
            // 其他情况
            else {
                container.textContent = JSON.stringify(content);
            }
        } catch (error) {
            console.error(`渲染内容失败: ${id}`, error);
            
            // 显示错误信息
            container.innerHTML = `
                <div class="error-message">
                    <h3>加载内容失败</h3>
                    <p>${error.message}</p>
                </div>
            `;
        }
    }

    /**
     * 获取活动标签页
     * @returns {Object|null} 活动标签页
     */
    getActiveTab() {
        return this.navigationManager ? this.navigationManager.getActiveTab() : null;
    }

    /**
     * 获取活动导航项
     * @returns {Object|null} 活动导航项
     */
    getActiveItem() {
        return this.navigationManager ? this.navigationManager.getActiveItem() : null;
    }

    /**
     * 激活标签页
     * @param {string} tabId - 标签页ID
     */
    activateTab(tabId) {
        if (this.navigationManager) {
            this.navigationManager.activateTab(tabId);
        }
    }

    /**
     * 激活导航项
     * @param {string} itemId - 导航项ID
     */
    activateItem(itemId) {
        if (this.navigationManager) {
            this.navigationManager.activateItem(itemId);
        }
    }

    /**
     * 销毁工具详情页
     */
    destroy() {
        // 清除缓存
        this.contentCache.clear();
        
        // 销毁导航管理器
        if (this.navigationManager) {
            this.navigationManager.destroy();
            this.navigationManager = null;
        }
        
        this.isInitialized = false;
        console.log(`🗑️ 工具详情页[${this.toolId}]已销毁`);
    }

    /**
     * 初始化粒子背景
     * @param {HTMLElement} container - 粒子容器
     */
    initParticleBackground(container) {
        if (!container) return;
        
        // 创建粒子
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 5) + 's';
            container.appendChild(particle);
        }
    }
    
    /**
     * 初始化矩阵特性动画
     */
    initMatrixAnimation() {
        // 延迟一点时间，确保DOM已经渲染
        setTimeout(() => {
            // 初始化矩阵特性动画
            const matrixItems = document.querySelectorAll('.matrix-item');
            console.log('🎬 初始化矩阵特性动画，找到特性卡片:', matrixItems.length);
            
            matrixItems.forEach((item, index) => {
                const delay = parseInt(item.getAttribute('data-delay') || index * 200);
                setTimeout(() => {
                    item.classList.add('animate-in');
                    console.log(`✨ 特性卡片 #${index+1} 动画开始`);
                }, delay);
            });
        }, 500);
    }
}

export default ToolDetail; 