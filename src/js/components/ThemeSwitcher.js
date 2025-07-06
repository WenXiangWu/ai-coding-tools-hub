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
        
        // 监听主题变化
        this.themeManager.addObserver((theme) => {
            this.updateCurrentTheme();
        });
    }

    /**
     * 初始化组件
     */
    init() {
        // 组件初始化逻辑
        this.updateCurrentTheme();
    }

    /**
     * 获取翻译文本
     */
    t(key, fallback = key) {
        try {
            // 尝试获取i18n管理器
            const i18nManager = window.__i18nManager;
            if (i18nManager && typeof i18nManager.t === 'function') {
                const translated = i18nManager.t(key);
                return translated !== key ? translated : fallback;
            }
        } catch (error) {
            console.warn('获取翻译文本失败:', key, error);
        }
        return fallback;
    }

    /**
     * 获取组件模板
     */
    getTemplate() {
        const themes = this.themeManager.getAvailableThemes();
        const currentTheme = this.themeManager.getCurrentTheme();
        
        return `
            <div class="theme-switcher-trigger" aria-label="${this.t('theme.switchTheme', '切换主题')}" role="button" tabindex="0">
                <div class="theme-switcher-current">
                    <span class="theme-icon">${currentTheme.icon || '🎨'}</span>
                    <span class="theme-text" data-i18n="theme.title">${this.t('theme.title', '主题')}</span>
                    <i class="fas fa-chevron-down theme-arrow"></i>
                </div>
            </div>
            
            <div class="theme-switcher-dropdown" role="menu">
                <div class="theme-switcher-header">
                    <h3 data-i18n="theme.selectTheme">${this.t('theme.selectTheme', '选择主题')}</h3>
                    <p data-i18n="theme.personalizeExperience">${this.t('theme.personalizeExperience', '个性化您的体验')}</p>
                </div>
                
                <div class="theme-options">
                    ${themes.map(theme => this.getThemeOptionTemplate(theme)).join('')}
                </div>
                
                <div class="theme-switcher-footer">
                    <small data-i18n="theme.preferencesAutoSaved">${this.t('theme.preferencesAutoSaved', '主题偏好会自动保存')}</small>
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
        
        // 获取翻译的主题名称和描述
        const themeName = this.t(`theme.themes.${theme.id}.name`, theme.name);
        const themeDescription = this.t(`theme.themes.${theme.id}.description`, theme.description);
        
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
                    <div class="theme-option-name" data-i18n="theme.themes.${theme.id}.name">${themeName}</div>
                    <div class="theme-option-description" data-i18n="theme.themes.${theme.id}.description">${themeDescription}</div>
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
     * 渲染主题切换器到指定容器
     */
    async render(container) {
        if (!container) {
            console.error('❌ ThemeSwitcher: 未提供容器');
            return;
        }
        
        // 清空容器以防止重复内容
        container.innerHTML = '';
        
        const switcherElement = document.createElement('div');
        switcherElement.className = 'theme-switcher';
        switcherElement.innerHTML = this.getTemplate();
        
        this.container = switcherElement;
        container.appendChild(switcherElement);
        
        // 绑定事件
        this.bindEvents();
        this.updateCurrentTheme();
        
        console.log('✅ ThemeSwitcher: 渲染完成');
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

        // 重置位置为默认向下展开
        dropdown.style.left = '';
        dropdown.style.right = '0';
        dropdown.style.top = 'calc(100% + 0.5rem)';
        dropdown.style.bottom = 'auto';
        dropdown.style.marginBottom = '0';
        dropdown.style.marginTop = '0';
        dropdown.style.transform = '';

        // 强制重绘以获取准确的位置信息
        dropdown.offsetHeight;

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

        // 只有当下拉菜单确实超出视口下边界很多时才向上显示
        const spaceBelow = viewportHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = rect.height;
        
        // 如果下方空间不足，且上方空间更充足，则向上显示
        if (spaceBelow < 20 && spaceAbove > dropdownHeight + 20) {
            dropdown.style.top = 'auto';
            dropdown.style.bottom = '100%';
            dropdown.style.marginBottom = '0.5rem';
            dropdown.style.marginTop = '0';
            console.log('🔄 ThemeSwitcher: 下拉菜单向上展开');
        } else {
            console.log('🔄 ThemeSwitcher: 下拉菜单向下展开');
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
                this.showNotification(this.t('theme.notifications.switched', '主题已更换'), 'success');
            } else {
                this.showNotification(this.t('theme.notifications.switchFailed', '主题切换失败'), 'error');
            }
        } catch (error) {
            console.error('主题切换错误:', error);
            this.showNotification(this.t('theme.notifications.switchError', '主题切换出错'), 'error');
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
        const themeText = this.container.querySelector('.theme-text');
        const options = this.container.querySelectorAll('.theme-option');

        // 更新触发器图标
        if (icon) {
            icon.textContent = currentTheme.icon || '🎨';
        }

        // 更新主题文本
        if (themeText) {
            themeText.textContent = this.t('theme.title', '主题');
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

        // 更新下拉菜单中的文本
        this.updateDropdownTexts();
    }

    /**
     * 更新下拉菜单中的文本
     */
    updateDropdownTexts() {
        if (!this.container) return;

        const header = this.container.querySelector('.theme-switcher-header h3');
        const subtitle = this.container.querySelector('.theme-switcher-header p');
        const footer = this.container.querySelector('.theme-switcher-footer small');

        if (header) {
            header.textContent = this.t('theme.selectTheme', '选择主题');
        }
        if (subtitle) {
            subtitle.textContent = this.t('theme.personalizeExperience', '个性化您的体验');
        }
        if (footer) {
            footer.textContent = this.t('theme.preferencesAutoSaved', '主题偏好会自动保存');
        }

        // 更新主题选项的名称和描述
        const options = this.container.querySelectorAll('.theme-option');
        options.forEach(option => {
            const themeId = option.dataset.themeId;
            const nameElement = option.querySelector('.theme-option-name');
            const descElement = option.querySelector('.theme-option-description');
            
            if (nameElement) {
                const theme = this.themeManager.getTheme(themeId);
                if (theme) {
                    nameElement.textContent = this.t(`theme.themes.${themeId}.name`, theme.name);
                }
            }
            if (descElement) {
                const theme = this.themeManager.getTheme(themeId);
                if (theme) {
                    descElement.textContent = this.t(`theme.themes.${themeId}.description`, theme.description);
                }
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
     * 刷新组件（用于语言切换后重新渲染）
     */
    refresh() {
        if (!this.container || !this.container.parentNode) return;
        
        const parentContainer = this.container.parentNode;
        this.render(parentContainer);
    }
}

export default ThemeSwitcher; 