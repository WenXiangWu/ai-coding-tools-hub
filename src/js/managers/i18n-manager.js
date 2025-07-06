/**
 * 国际化管理器
 * 负责管理多语言支持、文本翻译和语言切换
 */

import { EventBus } from '../core/EventBus.js';
import { Store } from '../core/Store.js';

export class I18nManager {
    constructor() {
        this.eventBus = new EventBus();
        this.store = Store.getInstance();
        this.currentLanguage = 'zh-CN';
        this.supportedLanguages = ['zh-CN', 'en-US'];
        this.translations = {};
        this.urlMappings = {};
        this.isInitialized = false;
        
        this.init();
    }

    /**
     * 初始化国际化系统
     */
    async init() {
        try {
            // 从本地存储获取语言设置
            const savedLanguage = localStorage.getItem('ai-tools-language');
            if (savedLanguage && this.supportedLanguages.includes(savedLanguage)) {
                this.currentLanguage = savedLanguage;
            } else {
                // 检测浏览器语言
                const browserLanguage = this.detectBrowserLanguage();
                this.currentLanguage = browserLanguage;
            }

            // 加载语言文件
            await this.loadLanguageFiles();
            
            // 更新HTML lang属性
            this.updateHTMLLang();
            
            // 初始化完成
            this.isInitialized = true;
            
            // 触发初始化完成事件
            this.eventBus.emit('i18n:initialized', {
                language: this.currentLanguage,
                translations: this.translations[this.currentLanguage]
            });
            
            console.log('✅ 国际化系统初始化成功:', this.currentLanguage);
            
        } catch (error) {
            console.error('❌ 国际化系统初始化失败:', error);
            throw error;
        }
    }

    /**
     * 检测浏览器语言
     */
    detectBrowserLanguage() {
        const browserLang = navigator.language || navigator.userLanguage;
        
        // 检查是否完全匹配支持的语言
        if (this.supportedLanguages.includes(browserLang)) {
            return browserLang;
        }
        
        // 检查语言前缀匹配
        const langPrefix = browserLang.split('-')[0];
        const matchedLang = this.supportedLanguages.find(lang => 
            lang.startsWith(langPrefix)
        );
        
        return matchedLang || 'zh-CN'; // 默认中文
    }

    /**
     * 加载语言文件
     */
    async loadLanguageFiles() {
        const loadPromises = this.supportedLanguages.map(async (lang) => {
            try {
                const module = await import(`../locales/${lang}.js`);
                this.translations[lang] = module.default || module;
                this.urlMappings[lang] = module.urlMappings || {};
            } catch (error) {
                console.error(`❌ 加载语言文件失败: ${lang}`, error);
                throw error;
            }
        });
        
        await Promise.all(loadPromises);
    }

    /**
     * 切换语言
     */
    async switchLanguage(language) {
        if (!this.supportedLanguages.includes(language)) {
            throw new Error(`不支持的语言: ${language}`);
        }
        
        if (this.currentLanguage === language) {
            return;
        }
        
        const oldLanguage = this.currentLanguage;
        this.currentLanguage = language;
        
        // 保存到本地存储
        localStorage.setItem('ai-tools-language', language);
        
        // 更新HTML lang属性
        this.updateHTMLLang();
        
        // 触发语言切换事件
        this.eventBus.emit('i18n:languageChanged', {
            oldLanguage,
            newLanguage: language,
            translations: this.translations[language]
        });
        
        console.log(`🌍 语言已切换: ${oldLanguage} → ${language}`);
    }

    /**
     * 获取翻译文本
     */
    t(key, params = {}) {
        if (!this.isInitialized) {
            console.warn('⚠️ 国际化系统尚未初始化');
            return key;
        }
        
        const translation = this.getNestedValue(this.translations[this.currentLanguage], key);
        
        if (!translation) {
            console.warn(`⚠️ 找不到翻译: ${key} (${this.currentLanguage})`);
            return key;
        }
        
        // 替换参数
        return this.replaceParams(translation, params);
    }

    /**
     * 获取嵌套对象值
     */
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }

    /**
     * 替换参数
     */
    replaceParams(text, params) {
        if (typeof text !== 'string') {
            return text;
        }
        
        return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return params[key] !== undefined ? params[key] : match;
        });
    }

    /**
     * 获取当前语言的URL映射
     */
    getUrl(key) {
        const mapping = this.urlMappings[this.currentLanguage] || {};
        return mapping[key] || key;
    }

    /**
     * 获取当前语言
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * 获取支持的语言列表
     */
    getSupportedLanguages() {
        return this.supportedLanguages.map(lang => ({
            code: lang,
            name: this.t(`languages.${lang}`),
            nativeName: this.translations[lang]?.meta?.nativeName || lang
        }));
    }

    /**
     * 更新HTML lang属性
     */
    updateHTMLLang() {
        document.documentElement.lang = this.currentLanguage;
    }

    /**
     * 翻译HTML元素
     */
    translateElement(element) {
        if (!element) return;
        
        // 翻译文本内容
        const textKey = element.getAttribute('data-i18n');
        if (textKey) {
            const translatedText = this.t(textKey);
            element.textContent = translatedText;
        }
        
        // 翻译属性
        const attributes = ['title', 'placeholder', 'alt'];
        attributes.forEach(attr => {
            const attrKey = element.getAttribute(`data-i18n-${attr}`);
            if (attrKey) {
                const translatedAttr = this.t(attrKey);
                element.setAttribute(attr, translatedAttr);
            }
        });
    }

    /**
     * 翻译页面中的所有元素
     */
    translatePage() {
        const elements = document.querySelectorAll('[data-i18n], [data-i18n-title], [data-i18n-placeholder], [data-i18n-alt]');
        elements.forEach(element => this.translateElement(element));
    }

    /**
     * 监听语言变化
     */
    onLanguageChange(callback) {
        this.eventBus.on('i18n:languageChanged', callback);
    }

    /**
     * 取消监听语言变化
     */
    offLanguageChange(callback) {
        this.eventBus.off('i18n:languageChanged', callback);
    }

    /**
     * 获取语言显示名称
     */
    getLanguageDisplayName(langCode) {
        const langMap = {
            'zh-CN': '简体中文',
            'en-US': 'English'
        };
        return langMap[langCode] || langCode;
    }

    /**
     * 获取语言原生名称
     */
    getLanguageNativeName(langCode) {
        const langMap = {
            'zh-CN': '简体中文',
            'en-US': 'English'
        };
        return langMap[langCode] || langCode;
    }

    /**
     * 销毁国际化系统
     */
    destroy() {
        this.eventBus.removeAllListeners();
        this.translations = {};
        this.urlMappings = {};
        this.isInitialized = false;
    }
}

// 创建单例实例
let i18nManagerInstance = null;

export function getI18nManager() {
    if (!i18nManagerInstance) {
        i18nManagerInstance = new I18nManager();
    }
    return i18nManagerInstance;
}

export function t(key, params = {}) {
    return getI18nManager().t(key, params);
}

export function getCurrentLanguage() {
    return getI18nManager().getCurrentLanguage();
}

export function switchLanguage(language) {
    return getI18nManager().switchLanguage(language);
} 