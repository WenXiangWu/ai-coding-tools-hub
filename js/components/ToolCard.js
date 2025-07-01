/**
 * 工具卡片组件
 * 展示单个AI工具的详细信息
 */
import { Component } from '../core/Component.js';
import { eventBus } from '../core/EventBus.js';
import { STATUS_TEXT_MAP, TYPE_TEXT_MAP, PRICE_TEXT_MAP, CSS_CLASSES } from '../constants/AppConstants.js';
import { truncateText, formatDate } from '../utils/helpers.js';

class ToolCard extends Component {
    constructor(props) {
        super(props);
        
        // 验证必要的工具数据
        if (!props.tool) {
            throw new Error('ToolCard: 缺少必要的工具数据');
        }
        
        if (!props.tool.id) {
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
    }

    render() {
        const card = this.createElement('div', {
            className: this.getCardClasses(),
            'data-tool-id': this.tool.id
        });

        card.innerHTML = this.getCardHTML();
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
                <div class="tool-logo">
                    <div class="${this.tool.logo}"></div>
                </div>
                <div class="tool-badges">
                    ${this.renderStatusBadge()}
                    ${this.renderTypeBadge()}
                </div>
                ${this.showCompareButton ? this.renderCompareButton() : ''}
            </div>
            
            <div class="tool-card-body">
                <div class="tool-header-info">
                    <h3 class="tool-name" title="${this.tool.name}">
                        ${this.tool.name}
                    </h3>
                    <div class="tool-rating">
                        ${this.renderStars()}
                        <span class="rating-text">${this.tool.rating}</span>
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
                        <i class="fas fa-desktop" title="支持平台"></i>
                        <span>${this.renderPlatforms()}</span>
                    </div>
                    <div class="tool-users">
                        <i class="fas fa-users" title="用户数量"></i>
                        <span>${this.tool.users}</span>
                    </div>
                    <div class="tool-updated">
                        <i class="fas fa-clock" title="最后更新"></i>
                        <span>${formatDate(this.tool.updated)}</span>
                    </div>
                </div>
            </div>
            
            <div class="tool-card-footer">
                <div class="tool-price">
                    ${this.renderPriceBadge()}
                </div>
                <div class="tool-actions">
                    <button class="btn btn-outline btn-sm" data-action="website" title="访问官网">
                        <i class="fas fa-external-link-alt"></i>
                        <span>访问</span>
                    </button>
                    <button class="btn btn-primary btn-sm" data-action="details" title="查看详情">
                        <i class="fas fa-info-circle"></i>
                        <span>详情</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 渲染状态徽章
     * @returns {string} 状态徽章HTML
     */
    renderStatusBadge() {
        const statusText = STATUS_TEXT_MAP[this.tool.status] || this.tool.status;
        return `
            <span class="badge badge-status badge-${this.tool.status}" title="工具状态">
                ${statusText}
            </span>
        `;
    }

    /**
     * 渲染类型徽章
     * @returns {string} 类型徽章HTML
     */
    renderTypeBadge() {
        const typeText = TYPE_TEXT_MAP[this.tool.type] || this.tool.type;
        return `
            <span class="badge badge-type badge-${this.tool.type}" title="工具类型">
                ${typeText}
            </span>
        `;
    }

    /**
     * 渲染价格徽章
     * @returns {string} 价格徽章HTML
     */
    renderPriceBadge() {
        const priceText = PRICE_TEXT_MAP[this.tool.price] || this.tool.price;
        return `
            <span class="badge badge-price badge-${this.tool.price}" title="价格模式">
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
        const isSelected = this.isSelected;
        const icon = isSelected ? 'check-square' : 'square';
        const title = isSelected ? '取消选择' : '选择对比';
        
        return `
            <button class="btn-compare ${isSelected ? 'selected' : ''}" 
                    data-action="compare" 
                    title="${title}">
                <i class="fas fa-${icon}"></i>
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
            featuresHTML += `<span class="feature-tag more" title="还有${remaining}个功能">+${remaining}</span>`;
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

        // 卡片点击事件
        this.addEventListener(this.element, 'click', (e) => {
            // 如果点击的是按钮，不触发卡片点击
            if (e.target.closest('button') || e.target.closest('.btn-compare')) {
                return;
            }
            this.handleCardClick(e);
        });

        // 按钮点击事件
        const buttons = this.element.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            this.addEventListener(button, 'click', (e) => {
                e.stopPropagation();
                this.handleActionClick(button.dataset.action, e);
            });
        });

        // 键盘事件支持
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
     * 处理卡片点击
     * @param {Event} e - 事件对象
     */
    handleCardClick(e) {
        // Ctrl/Cmd + 点击 = 选择比较
        if ((e.ctrlKey || e.metaKey) && this.showCompareButton) {
            this.handleCompareToggle();
        } else {
            // 普通点击 = 查看详情
            this.handleViewDetails();
        }
    }

    /**
     * 处理按钮点击
     * @param {string} action - 动作类型
     * @param {Event} e - 事件对象
     */
    handleActionClick(action, e) {
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
                console.warn(`未知的动作: ${action}`);
        }
    }

    /**
     * 处理键盘事件
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyDown(e) {
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                this.handleViewDetails();
                break;
            case 'c':
            case 'C':
                if (this.showCompareButton) {
                    e.preventDefault();
                    this.handleCompareToggle();
                }
                break;
            case 'w':
            case 'W':
                e.preventDefault();
                this.handleVisitWebsite();
                break;
        }
    }

    /**
     * 处理查看详情
     */
    handleViewDetails() {
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
        
        if (this.onViewDetails) {
            this.onViewDetails(eventData);
        }
        
        eventBus.emit('toolCard:detailsClicked', eventData);
    }

    /**
     * 处理访问网站
     */
    handleVisitWebsite() {
        if (!this.tool) {
            console.error('❌ ToolCard: 工具数据为空，无法访问网站');
            return;
        }
        
        if (this.tool.website) {
            window.open(this.tool.website, '_blank', 'noopener,noreferrer');
            
            eventBus.emit('toolCard:websiteClicked', {
                toolId: this.tool.id,
                url: this.tool.website
            });
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
                icon.className = `fas fa-${isSelected ? 'check-square' : 'square'}`;
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