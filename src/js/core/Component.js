/**
 * 基础组件类
 * 为所有UI组件提供统一的基础结构和生命周期管理
 */
class Component {
    constructor(props = {}) {
        this.props = props;
        this.element = null;
        this.children = [];
        this.events = new Map();
        this.mounted = false;
    }

    /**
     * 渲染组件 - 子类必须实现
     * @returns {HTMLElement} 组件的DOM元素
     */
    render() {
        throw new Error('render方法必须被子类实现');
    }

    /**
     * 挂载组件到父元素
     * @param {HTMLElement} parent - 父元素
     */
    mount(parent) {
        if (this.mounted) return;
        
        this.element = this.render();
        parent.appendChild(this.element);
        this.bindEvents();
        this.mounted = true;
        this.onMounted();
    }

    /**
     * 卸载组件
     */
    unmount() {
        if (!this.mounted) return;
        
        this.unbindEvents();
        this.children.forEach(child => child.unmount());
        
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        
        this.mounted = false;
        this.onUnmounted();
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 子类可以重写此方法
    }

    /**
     * 解绑事件
     */
    unbindEvents() {
        this.events.forEach((handler, element) => {
            element.removeEventListener('click', handler);
        });
        this.events.clear();
    }

    /**
     * 添加事件监听
     * @param {HTMLElement} element - DOM元素
     * @param {string} event - 事件名称
     * @param {Function} handler - 事件处理函数
     */
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.events.set(element, handler);
    }

    /**
     * 更新组件属性
     * @param {Object} newProps - 新的属性
     */
    updateProps(newProps) {
        this.props = { ...this.props, ...newProps };
        this.update();
    }

    /**
     * 更新组件
     */
    update() {
        if (!this.mounted) return;
        
        const newElement = this.render();
        if (this.element.parentNode) {
            this.element.parentNode.replaceChild(newElement, this.element);
        }
        
        this.unbindEvents();
        this.element = newElement;
        this.bindEvents();
    }

    /**
     * 组件挂载后回调
     */
    onMounted() {
        // 子类可以重写此方法
    }

    /**
     * 组件卸载后回调
     */
    onUnmounted() {
        // 子类可以重写此方法
    }

    /**
     * 创建DOM元素的辅助方法
     * @param {string} tag - 标签名称
     * @param {Object} attrs - 属性对象
     * @param {string|HTMLElement|Array} children - 子元素
     * @returns {HTMLElement} 创建的DOM元素
     */
    createElement(tag, attrs = {}, children = []) {
        const element = document.createElement(tag);
        
        // 设置属性
        Object.entries(attrs).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
        
        // 添加子元素
        if (typeof children === 'string') {
            element.textContent = children;
        } else if (children instanceof HTMLElement) {
            element.appendChild(children);
        } else if (Array.isArray(children)) {
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child instanceof HTMLElement) {
                    element.appendChild(child);
                }
            });
        }
        
        return element;
    }
}

export { Component }; 