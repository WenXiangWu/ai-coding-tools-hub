// AI编程工具大全 - 主应用文件
// 使用模块化架构管理AI工具数据

// 全局变量
let isLoading = true;
let selectedTools = new Set();
let currentFilter = 'all';
let currentSort = 'priority';

// 应用初始化
class App {
    constructor() {
        this.initialized = false;
        this.tools = [];
        this.toolsManager = null;
        this.currentTypeFilter = 'all';
        this.currentPriceFilter = 'all';
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // 显示加载界面
            this.showLoadingScreen();

            // 动态导入模块
            const { toolsManager } = await import('./js/managers/tools-manager.js');
            const { getStatusIcon, getStatusText, getPriceText } = await import('./js/utils/tool-schema.js');
            
            this.toolsManager = toolsManager;
            this.getStatusIcon = getStatusIcon;
            this.getStatusText = getStatusText;
            this.getPriceText = getPriceText;

            // 初始化工具管理器
            await this.toolsManager.initialize();

            // 获取工具数据
            this.tools = this.toolsManager.getAllTools();

            // 初始化页面组件
            this.initializeComponents();

            // 隐藏加载界面
            this.hideLoadingScreen();

            this.initialized = true;
            console.log('✅ 应用初始化完成，加载了', this.tools.length, '个工具');
        } catch (error) {
            console.error('❌ 应用初始化失败:', error);
            this.showErrorScreen(error.message);
        }
    }

    showLoadingScreen() {
        console.log('显示加载界面');
        isLoading = true;
    }

    hideLoadingScreen() {
        setTimeout(() => {
            isLoading = false;
            console.log('隐藏加载界面');
        }, 1000);
    }

    showErrorScreen(message) {
        const errorHTML = `
            <div class="error-screen" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #f8f9fa;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
            ">
                <div class="error-content" style="
                    text-align: center;
                    padding: 40px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                ">
                    <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: #dc3545; margin-bottom: 20px;"></i>
                    <h2 style="color: #333; margin-bottom: 15px;">加载失败</h2>
                    <p style="color: #666; margin-bottom: 30px;">${message}</p>
                    <button onclick="location.reload()" style="
                        background: #007bff;
                        color: white;
                        border: none;
                        padding: 12px 24px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 16px;
                    ">
                        <i class="fas fa-refresh"></i> 重新加载
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }

    initializeComponents() {
        this.renderTools();
        this.setupEventListeners();
        this.initializeKeyboardShortcuts();
        this.updateStatistics();
    }

    renderTools() {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) {
            console.warn('未找到 toolsGrid 元素');
            return;
        }

        const filteredAndSortedTools = this.getFilteredAndSortedTools();
        
        toolsGrid.innerHTML = '';
        
        if (filteredAndSortedTools.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-tools" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                ">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>暂无工具数据</h3>
                    <p>请检查网络连接或刷新页面重试</p>
                </div>
            `;
            return;
        }
        
        filteredAndSortedTools.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });

        console.log(`✅ 渲染了 ${filteredAndSortedTools.length} 个工具`);
    }

    getFilteredAndSortedTools() {
        let tools = [...this.tools];

        // 应用类型筛选
        if (this.currentTypeFilter !== 'all') {
            tools = tools.filter(tool => tool.type === this.currentTypeFilter);
        }

        // 应用价格筛选
        if (this.currentPriceFilter !== 'all') {
            tools = tools.filter(tool => tool.price === this.currentPriceFilter);
        }

        // 应用排序
        switch (currentSort) {
            case 'name':
                tools.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating':
                tools.sort((a, b) => b.rating - a.rating);
                break;
            case 'users':
                tools.sort((a, b) => {
                    const usersA = parseInt(a.users.replace(/[^\d]/g, '')) || 0;
                    const usersB = parseInt(b.users.replace(/[^\d]/g, '')) || 0;
                    return usersB - usersA;
                });
                break;
            case 'updated':
                tools.sort((a, b) => new Date(b.updated) - new Date(a.updated));
                break;
            default: // popularity
                tools.sort((a, b) => (a._config?.priority || 999) - (b._config?.priority || 999));
        }

        return tools;
    }

    createToolCard(tool) {
        const card = document.createElement('div');
        card.className = 'tool-card';
        card.dataset.toolId = tool.id;

        // 生成功能标签
        const featuresHTML = tool.features.slice(0, 4).map(feature => 
            `<span class="feature-tag">${feature}</span>`
        ).join('');

        // 生成平台标签
        const platformsHTML = tool.platforms.slice(0, 3).map(platform => 
            `<span class="platform-tag">${platform}</span>`
        ).join('');

        card.innerHTML = `
            <div class="tool-header">
                <div class="tool-icon">
                    <i class="${tool.logo}"></i>
                </div>
                <div class="tool-status">
                    <span class="status-badge status-${tool.status}">
                        <i class="fas fa-${this.getStatusIcon(tool.status)}"></i>
                        ${this.getStatusText(tool.status)}
                    </span>
                </div>
            </div>
            
            <div class="tool-content">
                <h3 class="tool-name">${tool.name}</h3>
                <p class="tool-category">${tool.category}</p>
                <p class="tool-description">${tool.description}</p>
                
                <div class="tool-features">
                    ${featuresHTML}
                </div>
                
                <div class="tool-meta">
                    <div class="rating">
                        <span class="stars">${this.generateStars(tool.rating)}</span>
                        <span class="rating-value">${tool.rating}</span>
                    </div>
                    <div class="users">
                        <i class="fas fa-users"></i>
                        <span>${tool.users}</span>
                    </div>
                    <div class="price">
                        <i class="fas fa-tag"></i>
                        <span>${this.getPriceText(tool.price)}</span>
                    </div>
                </div>
                
                <div class="tool-platforms">
                    ${platformsHTML}
                </div>
            </div>
            
            <div class="tool-actions">
                <button class="btn btn-primary" onclick="app.openToolWebsite('${tool.website}')">
                    <i class="fas fa-external-link-alt"></i>
                    访问官网
                </button>
                <button class="btn btn-secondary" onclick="app.showToolDetails('${tool.id}')">
                    <i class="fas fa-info-circle"></i>
                    详细信息
                </button>
                <button class="btn btn-outline compare-btn" onclick="app.toggleToolSelection('${tool.id}')">
                    <i class="fas fa-plus"></i>
                    对比
                </button>
            </div>
        `;

        return card;
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }

        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }

    updateStatistics() {
        if (!this.toolsManager) return;
        
        try {
            const stats = this.toolsManager.getStatistics();
            
            // 更新统计显示
            const totalToolsElement = document.getElementById('total-tools');
            const avgRatingElement = document.getElementById('avg-rating');
            const totalUsersElement = document.getElementById('total-users');

            if (totalToolsElement) totalToolsElement.textContent = stats.total;
            if (avgRatingElement) avgRatingElement.textContent = stats.averageRating.toFixed(1);
            if (totalUsersElement) totalUsersElement.textContent = `${Math.round(stats.totalUsers / 1000)}K+`;
        } catch (error) {
            console.warn('更新统计信息失败:', error);
        }
    }

    // 工具相关方法
    openToolWebsite(url) {
        window.open(url, '_blank');
    }

    showToolDetails(toolId) {
        const tool = this.toolsManager.getTool(toolId);
        if (!tool) return;

        // 创建详情模态框
        const modal = this.createToolDetailsModal(tool);
        document.body.appendChild(modal);
        
        // 显示模态框
        setTimeout(() => modal.classList.add('show'), 10);
    }

    createToolDetailsModal(tool) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.id = 'tool-details-modal';

        const prosHTML = tool.pros.map(pro => `<li><i class="fas fa-check text-success"></i> ${pro}</li>`).join('');
        const consHTML = tool.cons.map(con => `<li><i class="fas fa-times text-danger"></i> ${con}</li>`).join('');
        const languagesHTML = tool.supported_languages.map(lang => `<span class="tech-tag">${lang}</span>`).join('');
        const tutorialsHTML = tool.extensions?.tutorials?.map(tutorial => `
            <div class="tutorial-item">
                <h4>${tutorial.title}</h4>
                <span class="level-badge level-${tutorial.level}">${tutorial.level}</span>
            </div>
        `).join('') || '<p>暂无教程</p>';

        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <div class="tool-info">
                        <i class="${tool.logo} tool-icon-large"></i>
                        <div>
                            <h2>${tool.name}</h2>
                            <p class="tool-category">${tool.category}</p>
                        </div>
                    </div>
                    <button class="close-btn" onclick="app.hideToolDetails()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="detail-section">
                        <h3>工具描述</h3>
                        <p>${tool.description}</p>
                    </div>
                    
                    <div class="detail-section">
                        <h3>主要功能</h3>
                        <div class="features-grid">
                            ${tool.features.map(feature => `<span class="feature-badge">${feature}</span>`).join('')}
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>支持的编程语言</h3>
                        <div class="tech-grid">
                            ${languagesHTML}
                        </div>
                    </div>
                    
                    <div class="detail-grid">
                        <div class="detail-section">
                            <h3>优点</h3>
                            <ul class="pros-list">
                                ${prosHTML}
                            </ul>
                        </div>
                        
                        <div class="detail-section">
                            <h3>缺点</h3>
                            <ul class="cons-list">
                                ${consHTML}
                            </ul>
                        </div>
                    </div>
                    
                    <div class="detail-section">
                        <h3>相关教程</h3>
                        <div class="tutorials-list">
                            ${tutorialsHTML}
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="app.openToolWebsite('${tool.website}')">
                        <i class="fas fa-external-link-alt"></i>
                        访问官网
                    </button>
                    <button class="btn btn-secondary" onclick="app.openToolWebsite('${tool.documentation}')">
                        <i class="fas fa-book"></i>
                        查看文档
                    </button>
                    ${tool.github ? `
                        <button class="btn btn-outline" onclick="app.openToolWebsite('${tool.github}')">
                            <i class="fab fa-github"></i>
                            GitHub
                        </button>
                    ` : ''}
                </div>
            </div>
        `;

        return modal;
    }

    hideToolDetails() {
        const modal = document.getElementById('tool-details-modal');
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        }
    }

    toggleToolSelection(toolId) {
        if (selectedTools.has(toolId)) {
            selectedTools.delete(toolId);
        } else {
            if (selectedTools.size >= 4) {
                alert('最多只能选择4个工具进行对比');
                return;
            }
            selectedTools.add(toolId);
        }

        this.updateToolCardSelection(toolId);
        this.updateCompareButton();
    }

    updateToolCardSelection(toolId) {
        const card = document.querySelector(`[data-tool-id="${toolId}"]`);
        const compareBtn = card?.querySelector('.compare-btn');
        
        if (card && compareBtn) {
            if (selectedTools.has(toolId)) {
                card.classList.add('selected');
                compareBtn.innerHTML = '<i class="fas fa-check"></i> 已选择';
                compareBtn.classList.remove('btn-outline');
                compareBtn.classList.add('btn-success');
            } else {
                card.classList.remove('selected');
                compareBtn.innerHTML = '<i class="fas fa-plus"></i> 对比';
                compareBtn.classList.remove('btn-success');
                compareBtn.classList.add('btn-outline');
            }
        }
    }

    updateCompareButton() {
        const compareButton = document.getElementById('compareBtn');
        if (compareButton) {
            if (selectedTools.size >= 2) {
                compareButton.disabled = false;
                compareButton.innerHTML = `<i class="fas fa-balance-scale"></i> 对比选中的工具 (${selectedTools.size})`;
                const countSpan = document.getElementById('compareCount');
                if (countSpan) countSpan.textContent = selectedTools.size;
            } else {
                compareButton.disabled = true;
                compareButton.innerHTML = '<i class="fas fa-balance-scale"></i> 对比选中的工具 (0)';
                const countSpan = document.getElementById('compareCount');
                if (countSpan) countSpan.textContent = '0';
            }
        }
    }

    showComparison() {
        if (selectedTools.size < 2) {
            alert('请至少选择2个工具进行对比');
            return;
        }

        // 显示对比区域
        const compareSection = document.getElementById('compare');
        const toolsSection = document.getElementById('tools');
        
        if (compareSection && toolsSection) {
            toolsSection.style.display = 'none';
            compareSection.style.display = 'block';
            
            // 生成对比表格
            this.generateComparisonTable();
            
            // 滚动到对比区域
            compareSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    generateComparisonTable() {
        const compareTable = document.getElementById('compareTable');
        if (!compareTable || !this.toolsManager) return;

        const selectedToolsData = Array.from(selectedTools).map(id => 
            this.toolsManager.getTool(id)
        ).filter(Boolean);

        if (selectedToolsData.length === 0) return;

        // 对比维度
        const comparisons = [
            { key: 'name', label: '工具名称' },
            { key: 'category', label: '分类' },
            { key: 'description', label: '描述' },
            { key: 'rating', label: '评分' },
            { key: 'users', label: '用户数' },
            { key: 'price', label: '价格模式' },
            { key: 'platforms', label: '支持平台' },
            { key: 'features', label: '主要功能' },
            { key: 'supported_languages', label: '支持语言' },
            { key: 'pros', label: '优势' },
            { key: 'cons', label: '劣势' }
        ];

        let tableHTML = '<thead><tr><th>对比项目</th>';
        selectedToolsData.forEach(tool => {
            tableHTML += `<th><div class="tool-header"><i class="${tool.logo}"></i> ${tool.name}</div></th>`;
        });
        tableHTML += '</tr></thead><tbody>';

        comparisons.forEach(comp => {
            tableHTML += `<tr><td class="compare-label">${comp.label}</td>`;
            selectedToolsData.forEach(tool => {
                let value = tool[comp.key];
                
                if (Array.isArray(value)) {
                    value = value.slice(0, 5).join(', ');
                    if (tool[comp.key].length > 5) value += '...';
                } else if (comp.key === 'rating') {
                    value = `${value} ⭐`;
                } else if (comp.key === 'price') {
                    value = this.getPriceText(value);
                }
                
                tableHTML += `<td>${value}</td>`;
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</tbody>';
        compareTable.innerHTML = tableHTML;
    }

    hideComparison() {
        const compareSection = document.getElementById('compare');
        const toolsSection = document.getElementById('tools');
        
        if (compareSection && toolsSection) {
            compareSection.style.display = 'none';
            toolsSection.style.display = 'block';
            
            // 滚动到工具区域
            toolsSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // 筛选和排序
    setFilter(filterType, filterValue) {
        if (filterType === 'type') {
            this.currentTypeFilter = filterValue;
        } else if (filterType === 'price') {
            this.currentPriceFilter = filterValue;
        }
        this.renderTools();
    }

    setSort(sort) {
        currentSort = sort;
        this.renderTools();
    }

    searchTools(query) {
        if (!this.toolsManager) return;
        
        const results = this.toolsManager.searchTools(query);
        this.displaySearchResults(results);
    }

    displaySearchResults(results) {
        const toolsGrid = document.getElementById('toolsGrid');
        if (!toolsGrid) return;

        toolsGrid.innerHTML = '';
        
        if (results.length === 0) {
            toolsGrid.innerHTML = `
                <div class="no-results" style="
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 60px 20px;
                    color: #666;
                ">
                    <i class="fas fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
                    <h3>未找到相关工具</h3>
                    <p>请尝试使用其他关键词搜索</p>
                </div>
            `;
            return;
        }

        results.forEach(tool => {
            const toolCard = this.createToolCard(tool);
            toolsGrid.appendChild(toolCard);
        });
    }

    // 事件监听器设置
    setupEventListeners() {
        // 搜索功能
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length === 0) {
                    this.renderTools();
                } else {
                    this.searchTools(query);
                }
            });
        }

        // 筛选功能
        const typeFilter = document.getElementById('typeFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortSelect = document.getElementById('sortSelect');

        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.setFilter('type', e.target.value);
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', (e) => {
                this.setFilter('price', e.target.value);
            });
        }

        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.setSort(e.target.value);
            });
        }

        // 对比按钮
        const compareButton = document.getElementById('compareBtn');
        if (compareButton) {
            compareButton.addEventListener('click', () => {
                this.showComparison();
            });
        }

        // 关闭对比按钮
        const closeCompareButton = document.getElementById('closeCompare');
        if (closeCompareButton) {
            closeCompareButton.addEventListener('click', () => {
                this.hideComparison();
            });
        }

        // 模态框关闭
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.hideToolDetails();
            }
        });

        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideToolDetails();
            }
        });
    }

    // 键盘快捷键
    initializeKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K 聚焦搜索框
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }

            // 数字键快速筛选
            if (e.key >= '1' && e.key <= '9') {
                const filterButtons = document.querySelectorAll('.filter-btn');
                const index = parseInt(e.key) - 1;
                if (filterButtons[index]) {
                    filterButtons[index].click();
                }
            }
        });
    }
}

// 创建全局应用实例
const app = new App();

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('页面加载完成，开始初始化应用...');
    app.initialize().catch(error => {
        console.error('应用初始化出错:', error);
    });
});

// 导出全局应用实例
window.app = app; 