/**
 * 主题切换器组件 - 提供美观的主题选择界面
 * 设计原则：用户友好、响应式、可访问性
 */
class ThemeSwitcher {
    constructor(themeManager) {
        this.themeManager = themeManager;
        this.container = null;
        this.isOpen = false;
        this.selectedTheme = null;
        
        this.init();
    }

    /**
     * 初始化主题切换器
     */
    init() {
        this.render();
        this.bindEvents();
        this.updateCurrentTheme();
        
        // 监听主题变化
        this.themeManager.addObserver((theme) => {
            this.updateCurrentTheme();
        });
    }

    /**
     * 渲染主题切换器
     */
    render() {
        const container = document.createElement('div');
        container.className = 'theme-switcher';
        container.innerHTML = this.getTemplate();
        
        this.container = container;
        this.attachToDOM();
    }

    /**
     * 获取组件模板
     */
    getTemplate() {
        const themes = this.themeManager.getAvailableThemes();
        const currentTheme = this.themeManager.getCurrentTheme();
        
        return `
            <div class="theme-switcher-trigger" aria-label="切换主题" role="button" tabindex="0">
                <div class="theme-switcher-current">
                    <span class="theme-icon">${currentTheme.icon || '🎨'}</span>
                    <span class="theme-text">主题</span>
                    <i class="fas fa-chevron-down theme-arrow"></i>
                </div>
            </div>
            
            <div class="theme-switcher-dropdown" role="menu">
                <div class="theme-switcher-header">
                    <h3>选择主题</h3>
                    <p>个性化您的体验</p>
                </div>
                
                <div class="theme-options">
                    ${themes.map(theme => this.getThemeOptionTemplate(theme)).join('')}
                </div>
                
                <div class="theme-switcher-footer">
                    <small>主题偏好会自动保存</small>
                </div>
            </div>
        `;
    }

    /**
     * 获取主题选项模板
     */
    getThemeOptionTemplate(theme) {
        const currentTheme = this.themeManager.getCurrentTheme();
        const isActive = theme.id === currentTheme.id;
        
        return `
            <div class="theme-option ${isActive ? 'active' : ''}" 
                 data-theme-id="${theme.id}" 
                 role="menuitem" 
                 tabindex="0"
                 aria-checked="${isActive}">
                <div class="theme-option-preview">
                    <div class="theme-preview-circle theme-preview-${theme.id}">
                        <span class="theme-option-icon">${theme.icon}</span>
                    </div>
                </div>
                <div class="theme-option-info">
                    <div class="theme-option-name">${theme.name}</div>
                    <div class="theme-option-description">${theme.description}</div>
                </div>
                <div class="theme-option-status">
                    ${isActive ? '<i class="fas fa-check"></i>' : ''}
                </div>
            </div>
        `;
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        if (!this.container) return;

        const trigger = this.container.querySelector('.theme-switcher-trigger');
        const dropdown = this.container.querySelector('.theme-switcher-dropdown');
        const options = this.container.querySelectorAll('.theme-option');

        // 触发器点击事件
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // 键盘支持
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });

        // 主题选项点击事件
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const themeId = option.dataset.themeId;
                this.selectTheme(themeId);
            });

            option.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const themeId = option.dataset.themeId;
                    this.selectTheme(themeId);
                }
            });

            // 悬停预览效果
            option.addEventListener('mouseenter', () => {
                this.previewTheme(option.dataset.themeId);
            });

            option.addEventListener('mouseleave', () => {
                this.clearPreview();
            });
        });

        // 点击外部关闭
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // 监听全局关闭下拉菜单事件
        document.addEventListener('close-all-dropdowns', () => {
            if (this.isOpen) {
                this.close();
            }
        });
    }

    /**
     * 将组件附加到DOM
     */
    attachToDOM() {
        // 查找导航栏
        let targetElement = null;
        
        // 检测是否为详情页
        const isDetailPage = document.body.classList.contains('tool-detail-page');
        
        if (isDetailPage) {
            // 详情页特殊处理，优先查找新的主题切换器容器
            targetElement = document.querySelector('#themeSwitcher');
            if (!targetElement) {
                // 如果不存在，查找其他可能的容器
                targetElement = document.querySelector('.theme-switcher-container');
            }
            if (!targetElement) {
                // 如果还是不存在，查找工具内容区域
                targetElement = document.querySelector('.tool-detail-content');
            }
        } else {
            // 主页面的优先级查找合适的容器
            const selectors = [
                '.main-nav',
                '.header-content', 
                '.demo-nav',  // 演示页面的导航
                'header'
            ];
            
            for (const selector of selectors) {
                targetElement = document.querySelector(selector);
                if (targetElement) {
                    console.log(`🎨 主题切换器将插入到: ${selector}`);
                    break;
                }
            }
        }
        
        if (targetElement) {
            // 为详情页添加特殊的容器类
            if (isDetailPage) {
                this.container.classList.add('theme-switcher-detail-page');
            }
            targetElement.appendChild(this.container);
        } else {
            console.warn('❌ 未找到合适的容器，主题切换器将插入到body');
            document.body.appendChild(this.container);
        }
    }

    /**
     * 切换下拉菜单显示状态
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * 打开下拉菜单
     */
    open() {
        this.isOpen = true;
        this.container.classList.add('open');
        
        // 通知其他下拉菜单关闭
        document.dispatchEvent(new CustomEvent('theme-switcher-open'));
        
        // 调整下拉菜单位置，防止超出视口
        this.adjustDropdownPosition();
        
        // 聚焦到第一个主题选项
        const firstOption = this.container.querySelector('.theme-option');
        if (firstOption) {
            firstOption.focus();
        }

        // 添加打开动画
        const dropdown = this.container.querySelector('.theme-switcher-dropdown');
        dropdown.style.animation = 'fadeInUp 0.2s ease-out';
    }

    /**
     * 调整下拉菜单位置，防止超出视口
     */
    adjustDropdownPosition() {
        const dropdown = this.container.querySelector('.theme-switcher-dropdown');
        if (!dropdown) return;

        // 重置位置
        dropdown.style.left = '';
        dropdown.style.right = '0';
        dropdown.style.transform = '';

        // 获取下拉菜单和视口的尺寸
        const rect = dropdown.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // 检查是否超出右边界
        if (rect.right > viewportWidth) {
            const overflowRight = rect.right - viewportWidth;
            dropdown.style.right = `${-overflowRight - 20}px`; // 留20px边距
        }

        // 检查是否超出左边界
        if (rect.left < 0) {
            dropdown.style.left = '20px';
            dropdown.style.right = 'auto';
        }

        // 检查是否超出下边界，如果超出则向上显示
        if (rect.bottom > viewportHeight) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = '100%';
            dropdown.style.marginBottom = '0.5rem';
            dropdown.style.marginTop = '0';
        }
    }

    /**
     * 关闭下拉菜单
     */
    close() {
        this.isOpen = false;
        this.container.classList.remove('open');
        this.clearPreview();
    }

    /**
     * 选择主题
     */
    async selectTheme(themeId) {
        // 立即更新UI，减少延迟感
        this.updateCurrentTheme();
        this.close();
        
        // 短暂的加载状态
        this.setLoadingState(true);
        
        try {
            const success = await this.themeManager.switchTheme(themeId);
            if (success) {
                // 再次确保UI状态正确
                this.updateCurrentTheme();
                
                // 显示成功提示
                this.showNotification('主题已更换', 'success');
            } else {
                this.showNotification('主题切换失败', 'error');
            }
        } catch (error) {
            console.error('主题切换错误:', error);
            this.showNotification('主题切换出错', 'error');
        } finally {
            // 延迟很短时间再移除loading状态，确保用户感知到操作已完成
            setTimeout(() => {
                this.setLoadingState(false);
            }, 200);
        }
    }

    /**
     * 预览主题（悬停效果）
     */
    previewTheme(themeId) {
        const option = this.container.querySelector(`[data-theme-id="${themeId}"]`);
        if (option) {
            option.classList.add('preview');
        }
    }

    /**
     * 清除预览效果
     */
    clearPreview() {
        const options = this.container.querySelectorAll('.theme-option');
        options.forEach(option => option.classList.remove('preview'));
    }

    /**
     * 更新当前主题显示
     */
    updateCurrentTheme() {
        if (!this.container) return;

        const currentTheme = this.themeManager.getCurrentTheme();
        const icon = this.container.querySelector('.theme-icon');
        const options = this.container.querySelectorAll('.theme-option');

        // 更新触发器图标
        if (icon) {
            icon.textContent = currentTheme.icon || '🎨';
        }

        // 更新活动状态
        options.forEach(option => {
            const isActive = option.dataset.themeId === currentTheme.id;
            option.classList.toggle('active', isActive);
            option.setAttribute('aria-checked', isActive);
            
            const status = option.querySelector('.theme-option-status');
            if (status) {
                status.innerHTML = isActive ? '<i class="fas fa-check"></i>' : '';
            }
        });
    }

    /**
     * 设置加载状态
     */
    setLoadingState(loading) {
        if (!this.container) return;
        
        this.container.classList.toggle('loading', loading);
        const trigger = this.container.querySelector('.theme-switcher-trigger');
        if (trigger) {
            trigger.style.pointerEvents = loading ? 'none' : '';
        }
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `theme-notification theme-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => notification.classList.add('show'), 100);
        
        // 自动移除
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    /**
     * 更新主题选项
     */
    updateOptions() {
        const optionsContainer = this.container.querySelector('.theme-options');
        if (optionsContainer) {
            const themes = this.themeManager.getAvailableThemes();
            optionsContainer.innerHTML = themes.map(theme => 
                this.getThemeOptionTemplate(theme)
            ).join('');
            
            // 重新绑定事件
            this.bindOptionEvents();
        }
    }

    /**
     * 重新绑定选项事件
     */
    bindOptionEvents() {
        const options = this.container.querySelectorAll('.theme-option');
        options.forEach(option => {
            // 移除旧的事件监听器（通过克隆节点）
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
        });
        
        // 重新绑定所有事件
        this.bindEvents();
    }

    /**
     * 销毁组件
     */
    destroy() {
        if (this.container && this.container.parentNode) {
            this.container.parentNode.removeChild(this.container);
        }
        this.container = null;
        this.isOpen = false;
    }

    /**
     * 刷新组件
     */
    refresh() {
        this.updateCurrentTheme();
        this.updateOptions();
    }
}

export default ThemeSwitcher; 