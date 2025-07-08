/**
 * 工具卡片组件
 * 展示单个AI工具的详细信息
 */
import { Component } from '../core/Component.js';
import { eventBus } from '../core/EventBus.js';
import { CSS_CLASSES, getStatusTextMap, getTypeTextMap, getPriceTextMap } from '../constants/AppConstants.js';
import { truncateText, formatDate } from '../utils/helpers.js';
import { getToolIcon } from '../config/icon-config.js';
import { getI18nManager } from '../managers/i18n-manager.js';

class ToolCard extends Component {
    constructor(props) {
        super(props);
        
        console.log('🎯 创建工具卡片组件，工具ID:', props.tool?.id);
        
        // 验证必要的工具数据
        if (!props.tool) {
            console.error('❌ ToolCard: 缺少必要的工具数据');
            throw new Error('ToolCard: 缺少必要的工具数据');
        }
        
        if (!props.tool.id) {
            console.error('❌ ToolCard: 工具ID缺失');
            throw new Error('ToolCard: 工具ID缺失');
        }
        
        if (!props.tool.name) {
            console.warn('⚠️ ToolCard: 工具名称缺失', props.tool);
        }
        
        this.tool = props.tool;
        this.isSelected = props.isSelected || false;
        this.onSelect = props.onSelect;
        this.onViewDetails = props.onViewDetails;
        this.showCompareButton = props.showCompareButton !== false;
        this.i18nManager = getI18nManager();
        
        console.log('✅ 工具卡片组件创建完成:', {
            id: this.tool.id,
            name: this.tool.name,
            isSelected: this.isSelected,
            showCompareButton: this.showCompareButton
        });
    }

    render() {
        console.log('🎨 开始渲染工具卡片:', this.tool.id);
        
        const card = this.createElement('div', {
            className: this.getCardClasses(),
            'data-tool-id': this.tool.id
        });

        card.innerHTML = this.getCardHTML();
        
        // 保存元素引用
        this.element = card;
        
        // 绑定事件
        this.bindEvents();
        
        console.log('✅ 工具卡片渲染完成:', this.tool.id);
        return card;
    }

    /**
     * 获取卡片样式类
     * @returns {string} 样式类字符串
     */
    getCardClasses() {
        const classes = [CSS_CLASSES.TOOL_CARD];
        
        if (this.isSelected) {
            classes.push(CSS_CLASSES.SELECTED);
        }
        
        if (this.tool._config?.featured) {
            classes.push('featured');
        }
        
        classes.push(`type-${this.tool.type}`);
        classes.push(`price-${this.tool.price}`);
        classes.push(`status-${this.tool.status}`);
        
        return classes.join(' ');
    }

    /**
     * 生成卡片HTML
     * @returns {string} HTML字符串
     */
    getCardHTML() {
        return `
            <div class="tool-card-header">
                ${this.showCompareButton ? this.renderCompareButton() : ''}
            </div>
            
            <div class="tool-card-body">
                <div class="tool-title-section">
                    <div class="tool-logo-name">
                        <div class="tool-logo">
                            ${this.renderToolIcon()}
                        </div>
                        <h3 class="tool-name" title="${this.tool.name}">
                            ${this.tool.name}
                        </h3>
                    </div>
                    <div class="tool-info-row">
                        <div class="tool-rating">
                            ${this.renderStars()}
                            <span class="rating-text">${this.tool.rating}</span>
                        </div>
                        <div class="tool-badges">
                            ${this.renderStatusBadge()}
                            ${this.renderTypeBadge()}
                        </div>
                    </div>
                </div>
                
                <p class="tool-description" title="${this.tool.description}">
                    ${truncateText(this.tool.description, 120)}
                </p>
                
                <div class="tool-features">
                    ${this.renderFeatures()}
                </div>
                
                <div class="tool-meta">
                    <div class="tool-platforms">
                        <i class="fas fa-desktop" title="${this.i18nManager.t('tools.details.platforms') || '支持平台'}"></i>
                        <span>${this.renderPlatforms()}</span>
                    </div>
                </div>
            </div>
            
            <div class="tool-card-footer">
                <div class="tool-price">
                    ${this.renderPriceBadge()}
                </div>
                <div class="tool-actions">
                    <button class="btn btn-outline btn-sm" data-action="website" title="${this.i18nManager.t('tools.actions.visitWebsite') || '访问官网'}">
                        <i class="fas fa-external-link-alt"></i>
                        <span>${this.i18nManager.t('tools.actions.visitWebsite') || '官网'}</span>
                    </button>
                    <button class="btn btn-primary btn-sm" data-action="details" title="${this.i18nManager.t('tools.actions.viewDetails') || '查看详情'}">
                        <i class="fas fa-info-circle"></i>
                        <span>${this.i18nManager.t('tools.actions.viewDetails') || '详情'}</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 渲染工具图标
     * @returns {string} 工具图标HTML
     */
    renderToolIcon() {
        const iconPath = getToolIcon(this.tool.id);
        return `
            <img src="${iconPath}" 
                 alt="${this.tool.name} 图标" 
                 class="tool-icon-img" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                 loading="lazy">
            <div class="tool-icon-fallback" style="display: none;">
                <div class="${this.tool.logo || 'tool-icon tool-icon-default'}"></div>
            </div>
        `;
    }

    /**
     * 渲染状态徽章
     * @returns {string} 状态徽章HTML
     */
    renderStatusBadge() {
        const statusTextMap = getStatusTextMap();
        const statusText = statusTextMap[this.tool.status] || this.tool.status;
        return `
            <span class="badge badge-status badge-${this.tool.status}" title="${this.i18nManager.t('tools.details.status') || '工具状态'}">
                ${statusText}
            </span>
        `;
    }

    /**
     * 渲染类型徽章
     * @returns {string} 类型徽章HTML
     */
    renderTypeBadge() {
        const typeTextMap = getTypeTextMap();
        const typeText = typeTextMap[this.tool.type] || this.tool.type;
        return `
            <span class="badge badge-type badge-${this.tool.type}" title="${this.i18nManager.t('common.type') || '工具类型'}">
                ${typeText}
            </span>
        `;
    }

    /**
     * 渲染价格徽章
     * @returns {string} 价格徽章HTML
     */
    renderPriceBadge() {
        const priceTextMap = getPriceTextMap();
        const priceText = priceTextMap[this.tool.price] || this.tool.price;
        return `
            <span class="badge badge-price badge-${this.tool.price}" title="${this.i18nManager.t('tools.details.pricing') || '价格模式'}">
                <i class="fas fa-tag"></i>
                ${priceText}
            </span>
        `;
    }

    /**
     * 渲染比较按钮
     * @returns {string} 比较按钮HTML
     */
    renderCompareButton() {
        console.log('🔄 渲染比较按钮:', {
            toolId: this.tool.id,
            isSelected: this.isSelected
        });
        
        const state = this.store.getState();
        const selectedTools = state.selectedTools || new Set();
        
        // 确保 selectedTools 是 Set 类型
        const isSelected = selectedTools instanceof Set ? 
            selectedTools.has(this.tool.id) : 
            Array.isArray(selectedTools) ? 
                selectedTools.includes(this.tool.id) : 
                false;
        
        const buttonClass = isSelected ? 'selected' : '';
        const buttonText = isSelected ? 
            (this.i18nManager.t('tools.actions.removeFromComparison') || '移出对比') : 
            (this.i18nManager.t('tools.actions.addToComparison') || '加入对比');
        
        return `
            <button class="btn-compare ${buttonClass}" 
                    data-action="compare" 
                    title="${buttonText}"
                    aria-label="${buttonText}">
                <i class="fas fa-${isSelected ? 'check' : 'plus'}"></i>
            </button>
        `;
    }

    /**
     * 渲染星级评分
     * @returns {string} 星级HTML
     */
    renderStars() {
        const rating = this.tool.rating;
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
        
        return `<div class="stars" title="评分: ${rating}">${starsHTML}</div>`;
    }

    /**
     * 渲染功能标签
     * @returns {string} 功能标签HTML
     */
    renderFeatures() {
        const maxFeatures = 3;
        const features = this.tool.features.slice(0, maxFeatures);
        const hasMore = this.tool.features.length > maxFeatures;
        
        let featuresHTML = features.map(feature => 
            `<span class="feature-tag" title="${feature}">${truncateText(feature, 12)}</span>`
        ).join('');
        
        if (hasMore) {
            const remaining = this.tool.features.length - maxFeatures;
            const moreText = this.i18nManager.t('common.more') || '更多';
            featuresHTML += `<span class="feature-tag more" title="${this.i18nManager.t('tools.moreFeatures', {count: remaining}) || `还有${remaining}个功能`}">+${remaining}</span>`;
        }
        
        return featuresHTML;
    }

    /**
     * 渲染支持平台
     * @returns {string} 平台文本
     */
    renderPlatforms() {
        const maxPlatforms = 2;
        const platforms = this.tool.platforms.slice(0, maxPlatforms);
        const hasMore = this.tool.platforms.length > maxPlatforms;
        
        let text = platforms.join(', ');
        if (hasMore) {
            const remaining = this.tool.platforms.length - maxPlatforms;
            text += ` +${remaining}`;
        }
        
        return text;
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        if (!this.element) return;

        // 为所有带data-action的按钮绑定点击事件（包括比较按钮）
        const buttons = this.element.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            this.addEventListener(button, 'click', (e) => {
                e.stopPropagation();
                this.handleActionClick(button.dataset.action, e);
            });
        });

        // 移除键盘事件中的自动跳转详情，只保留必要的键盘交互
        this.addEventListener(this.element, 'keydown', (e) => {
            this.handleKeyDown(e);
        });

        // 鼠标悬停效果
        this.addEventListener(this.element, 'mouseenter', () => {
            this.element.classList.add('hover');
        });

        this.addEventListener(this.element, 'mouseleave', () => {
            this.element.classList.remove('hover');
        });
    }

    /**
     * 处理按钮点击
     * @param {string} action - 动作类型
     * @param {Event} e - 事件对象
     */
    handleActionClick(action, e) {
        console.log('🎯 处理按钮点击:', {
            action,
            toolId: this.tool.id,
            hasWebsite: !!this.tool.website,
            hasViewDetails: !!this.onViewDetails
        });
        
        try {
            switch (action) {
                case 'details':
                    this.handleViewDetails();
                    break;
                case 'website':
                    this.handleVisitWebsite();
                    break;
                case 'compare':
                    this.handleCompareToggle();
                    break;
                default:
                    console.warn(`⚠️ 未知的动作: ${action}`);
            }
        } catch (error) {
            console.error('❌ 处理按钮点击失败:', {
                action,
                toolId: this.tool.id,
                error: error.message
            });
        }
    }

    /**
     * 处理查看详情
     */
    handleViewDetails() {
        console.log('🔍 处理查看详情:', {
            toolId: this.tool.id,
            hasCallback: !!this.onViewDetails
        });
        
        // 验证工具数据
        if (!this.tool) {
            console.error('❌ ToolCard: 工具数据为空，无法查看详情');
            return;
        }
        
        if (!this.tool.id) {
            console.error('❌ ToolCard: 工具ID缺失，无法查看详情', this.tool);
            return;
        }
        
        const eventData = {
            toolId: this.tool.id,
            tool: this.tool
        };
        
        try {
            if (this.onViewDetails) {
                this.onViewDetails(eventData);
                console.log('✅ 详情回调执行成功');
            } else {
                // 如果没有提供回调，直接跳转到详情页面
                const detailUrl = `src/pages/tool.html?id=${encodeURIComponent(this.tool.id)}`;
                window.location.href = detailUrl;
                console.log('✅ 直接跳转到详情页面');
            }
            
            eventBus.emit('toolCard:detailsClicked', eventData);
            console.log('✅ 详情事件发送成功');
        } catch (error) {
            console.error('❌ 处理查看详情失败:', error);
        }
    }

    /**
     * 处理访问网站
     */
    handleVisitWebsite() {
        console.log('🌐 处理访问网站:', {
            toolId: this.tool.id,
            hasWebsite: !!this.tool?.website
        });
        
        if (!this.tool) {
            console.error('❌ ToolCard: 工具数据为空，无法访问网站');
            return;
        }
        
        if (this.tool.website) {
            try {
                // 使用 window.open 打开新标签页
                const newWindow = window.open(this.tool.website, '_blank');
                if (newWindow) {
                    newWindow.opener = null; // 安全措施：断开与父窗口的联系
                    console.log('✅ 网站链接打开成功:', this.tool.website);
                } else {
                    console.warn('⚠️ 弹出窗口被阻止，尝试直接跳转');
                    window.location.href = this.tool.website;
                }
                
                eventBus.emit('toolCard:websiteClicked', {
                    toolId: this.tool.id,
                    url: this.tool.website
                });
            } catch (error) {
                console.error('❌ 打开网站链接失败:', error);
            }
        } else {
            console.warn('⚠️ 工具没有网站链接:', this.tool.name);
        }
    }

    /**
     * 处理比较切换
     */
    handleCompareToggle() {
        if (!this.tool) {
            console.error('❌ ToolCard: 工具数据为空，无法切换比较状态');
            return;
        }
        
        if (!this.tool.id) {
            console.error('❌ ToolCard: 工具ID缺失，无法切换比较状态', this.tool);
            return;
        }
        
        if (this.onSelect) {
            const newState = this.onSelect(this.tool.id, this.tool);
            this.updateCompareButton(newState);
        }
        
        eventBus.emit('toolCard:compareToggled', {
            toolId: this.tool.id,
            selected: !this.isSelected
        });
    }

    /**
     * 更新比较按钮状态
     * @param {boolean} selected - 是否选中
     */
    updateCompareButton(selected) {
        this.isSelected = selected;
        
        const compareBtn = this.element.querySelector('.btn-compare');
        if (compareBtn) {
            const icon = compareBtn.querySelector('i');
            const isSelected = selected;
            
            compareBtn.classList.toggle('selected', isSelected);
            compareBtn.title = isSelected ? '取消选择' : '选择对比';
            
            if (icon) {
                icon.className = `fas fa-${isSelected ? 'check' : 'plus'}`;
            }
        }
        
        // 更新卡片样式
        this.element.classList.toggle(CSS_CLASSES.SELECTED, selected);
    }

    /**
     * 更新工具数据
     * @param {Object} newTool - 新的工具数据
     */
    updateTool(newTool) {
        this.tool = newTool;
        this.update();
    }

    /**
     * 高亮搜索关键词
     * @param {string} keyword - 搜索关键词
     */
    highlightKeyword(keyword) {
        if (!keyword || !this.element) return;
        
        const textNodes = [
            this.element.querySelector('.tool-name'),
            this.element.querySelector('.tool-description')
        ].filter(Boolean);
        
        textNodes.forEach(node => {
            const text = node.textContent;
            const highlightedText = text.replace(
                new RegExp(`(${keyword})`, 'gi'),
                '<mark>$1</mark>'
            );
            
            if (highlightedText !== text) {
                node.innerHTML = highlightedText;
            }
        });
    }

    /**
     * 清除高亮
     */
    clearHighlight() {
        if (!this.element) return;
        
        const marks = this.element.querySelectorAll('mark');
        marks.forEach(mark => {
            mark.outerHTML = mark.textContent;
        });
    }

    /**
     * 添加加载状态
     */
    setLoading(loading = true) {
        if (!this.element) return;
        
        this.element.classList.toggle('loading', loading);
        
        const buttons = this.element.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.disabled = loading;
        });
    }

    /**
     * 添加错误状态
     */
    setError(error = true) {
        if (!this.element) return;
        
        this.element.classList.toggle('error', error);
    }

    /**
     * 获取卡片尺寸信息
     * @returns {Object} 尺寸信息
     */
    getDimensions() {
        if (!this.element) return null;
        
        const rect = this.element.getBoundingClientRect();
        return {
            width: rect.width,
            height: rect.height,
            top: rect.top,
            left: rect.left
        };
    }

    /**
     * 滚动到卡片位置
     * @param {Object} options - 滚动选项
     */
    scrollIntoView(options = {}) {
        if (!this.element) return;
        
        this.element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
            ...options
        });
    }

    /**
     * 组件销毁时的清理
     */
    onUnmounted() {
        // 清理可能的高亮
        this.clearHighlight();
        
        // 触发销毁事件
        eventBus.emit('toolCard:destroyed', {
            toolId: this.tool.id
        });
    }
}

export { ToolCard }; 