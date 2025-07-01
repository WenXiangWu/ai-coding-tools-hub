/**
 * 应用入口文件
 * 负责初始化和启动整个应用
 */
import { App } from './core/App.js';

// 全局应用实例
window.app = null;

/**
 * 应用初始化
 */
async function initializeApp() {
    try {
        console.log('🔧 准备启动AI工具应用...');
        
        // 创建应用实例
        window.app = new App();
        
        // 初始化应用
        await window.app.initialize();
        
        console.log('🎉 AI工具应用启动成功！');
        
    } catch (error) {
        console.error('❌ 应用启动失败:', error);
        showErrorMessage('应用启动失败，请刷新页面重试');
    }
}

/**
 * 显示错误消息
 * @param {string} message - 错误消息
 */
function showErrorMessage(message) {
    const errorContainer = document.getElementById('errorMessage') || document.body;
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message critical';
    errorElement.innerHTML = `
        <div class="error-content">
            <i class="fas fa-exclamation-triangle"></i>
            <span>${message}</span>
            <button onclick="location.reload()" class="btn btn-sm btn-primary">
                <i class="fas fa-refresh"></i> 刷新页面
            </button>
        </div>
    `;
    
    if (errorContainer === document.body) {
        errorElement.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 10000;
            background: #dc3545;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
    }
    
    errorContainer.appendChild(errorElement);
}

/**
 * DOM准备就绪后初始化
 */
function onDOMReady() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
}

/**
 * 检查浏览器兼容性
 */
function checkBrowserCompatibility() {
    const features = [
        'Promise',
        'fetch',
        'Map',
        'Set',
        'WeakMap',
        'WeakSet',
        'Symbol'
    ];
    
    const missing = features.filter(feature => !window[feature]);
    
    if (missing.length > 0) {
        console.warn('⚠️ 浏览器缺少以下特性:', missing);
        showErrorMessage('您的浏览器版本过低，请升级到最新版本以获得最佳体验');
        return false;
    }
    
    return true;
}

/**
 * 设置全局错误处理
 */
function setupGlobalErrorHandling() {
    // 捕获未处理的错误
    window.addEventListener('error', (event) => {
        console.error('全局JavaScript错误:', event.error);
        if (!window.app) {
            showErrorMessage('应用发生错误，请刷新页面');
        }
    });
    
    // 捕获未处理的Promise拒绝
    window.addEventListener('unhandledrejection', (event) => {
        console.error('未处理的Promise拒绝:', event.reason);
        if (!window.app) {
            showErrorMessage('应用发生错误，请刷新页面');
        }
    });
}

/**
 * 启动应用
 */
function startApp() {
    // 设置全局错误处理
    setupGlobalErrorHandling();
    
    // 检查浏览器兼容性
    if (!checkBrowserCompatibility()) {
        return;
    }
    
    // 初始化应用
    onDOMReady();
}

// 启动应用
startApp();

// 导出全局函数供HTML中使用
window.restartApp = async function() {
    if (window.app) {
        window.app.destroy();
        window.app = null;
    }
    await initializeApp();
};

// 开发模式下的调试工具
window.debug = {
    app: () => window.app,
    store: () => window.app?.store,
    state: () => window.app?.store?.getState(),
    eventBus: () => window.app?.eventBus,
    components: () => window.app?.components,
    services: () => ({
        toolService: window.app?.toolService,
        compareService: window.app?.compareService
    }),
    tools: () => window.app?.toolService?.getAllTools(),
    toolsManager: () => window.app?.toolService?.toolsManager,
    checkTools: async () => {
        const app = window.app;
        if (!app) {
            console.log('❌ 应用未初始化');
            return;
        }
        
        console.log('📊 调试信息:');
        console.log('- Store状态:', app.store?.getState());
        console.log('- ToolService状态:', {
            initialized: !!app.toolService,
            toolsManager: !!app.toolService?.toolsManager,
            allTools: app.toolService?.getAllTools() || []
        });
        
        if (app.toolService?.toolsManager) {
            console.log('- ToolsManager状态:', {
                initialized: app.toolService.toolsManager.isInitialized(),
                tools: app.toolService.toolsManager.getAllTools(),
                loadingStatus: app.toolService.toolsManager.getLoadingStatus()
            });
        }
    },
    reloadTools: async () => {
        if (window.app?.toolService) {
            console.log('🔄 重新加载工具...');
            await window.app.toolService.reloadTools();
            console.log('✅ 工具重新加载完成');
            window.debug.checkTools();
        }
    },
    forceRender: () => {
        console.log('🎨 强制重新渲染工具...');
        if (window.app) {
            const state = window.app.store.getState();
            console.log('当前状态:', {
                tools: state.tools?.length || 0,
                filteredTools: state.filteredTools?.length || 0
            });
            
            // 如果有工具数据但filteredTools为空，强制设置
            if (state.tools?.length > 0 && (!state.filteredTools || state.filteredTools.length === 0)) {
                console.log('🔧 检测到数据不一致，强制设置filteredTools');
                window.app.store.setState({ 
                    filteredTools: state.tools 
                }, 'FORCE_RENDER');
            }
            
            // 强制重新渲染
            window.app.renderTools();
        }
    },
    
    forceInit: () => {
        console.log('🔄 强制重新初始化工具数据...');
        if (window.app?.toolService) {
            const tools = window.app.toolService.getAllTools();
            console.log(`📊 从ToolService获取 ${tools.length} 个工具`);
            
            if (tools.length > 0) {
                console.log('🎯 手动触发工具初始化事件');
                window.app.handleToolServiceInitialized(tools);
            } else {
                console.log('⚠️ ToolService中没有工具数据，尝试重新加载');
                window.debug.reloadTools();
            }
        } else {
            console.log('❌ ToolService不可用');
        }
    },
    
    diagnose: () => {
        console.log('🔍 === 系统诊断报告 ===');
        const app = window.app;
        
        // 检查应用状态
        console.log('1️⃣ 应用状态检查:');
        console.log('  - 应用实例:', app ? '✅ 存在' : '❌ 缺失');
        console.log('  - 初始化状态:', app?.initialized ? '✅ 已初始化' : '❌ 未初始化');
        
        // 检查DOM元素
        console.log('2️⃣ DOM元素检查:');
        const container = document.getElementById('toolsContainer');
        const count = document.getElementById('toolsCount');
        console.log('  - toolsContainer:', container ? '✅ 存在' : '❌ 缺失');
        console.log('  - toolsCount:', count ? '✅ 存在' : '❌ 缺失');
        console.log('  - App.elements:', app?.elements ? '✅ 已初始化' : '❌ 未初始化');
        console.log('  - App.elements.toolsContainer:', app?.elements?.toolsContainer ? '✅ 已绑定' : '❌ 未绑定');
        
        // 检查数据状态
        console.log('3️⃣ 数据状态检查:');
        const state = app?.store?.getState();
        console.log('  - Store状态:', state ? '✅ 存在' : '❌ 缺失');
        console.log('  - tools数据:', state?.tools?.length || 0, '个');
        console.log('  - filteredTools数据:', state?.filteredTools?.length || 0, '个');
        console.log('  - 加载状态:', state?.loading ? '⏳ 加载中' : '✅ 已完成');
        console.log('  - 错误状态:', state?.error ? '❌ 有错误' : '✅ 无错误');
        
        // 检查服务状态
        console.log('4️⃣ 服务状态检查:');
        console.log('  - ToolService:', app?.toolService ? '✅ 存在' : '❌ 缺失');
        console.log('  - ToolsManager:', app?.toolService?.toolsManager ? '✅ 存在' : '❌ 缺失');
        console.log('  - Manager工具数:', app?.toolService?.toolsManager?.getAllTools()?.length || 0);
        
        // 提供修复建议
        console.log('5️⃣ 修复建议:');
        if (!app) {
            console.log('  🔧 应用未初始化，请刷新页面');
        } else if (!app.elements || !app.elements.toolsContainer) {
            console.log('  🔧 DOM元素未绑定，尝试: window.debug.forceInit()');
        } else if (!state?.tools?.length) {
            console.log('  🔧 无工具数据，尝试: window.debug.reloadTools()');
        } else if (!state?.filteredTools?.length) {
            console.log('  🔧 筛选数据缺失，尝试: window.debug.forceRender()');
        } else {
            console.log('  ✅ 系统状态正常');
        }
        
        console.log('='.repeat(30));
        return {
            app: !!app,
            initialized: app?.initialized,
            domReady: !!container,
            elementsReady: !!app?.elements?.toolsContainer,
            hasTools: (state?.tools?.length || 0) > 0,
            hasFilteredTools: (state?.filteredTools?.length || 0) > 0
        };
    },
    
    // 开关：使用简化卡片
    useSimpleCards: false,
    
    toggleSimpleCards: () => {
        window.debug.useSimpleCards = !window.debug.useSimpleCards;
        console.log(`🔄 ${window.debug.useSimpleCards ? '启用' : '禁用'}简化卡片模式`);
        if (window.app) {
            window.app.renderTools();
        }
    },
    
    showDebugPanel: () => {
        // 如果面板已存在，先移除
        const existingPanel = document.getElementById('debugPanel');
        if (existingPanel) {
            existingPanel.remove();
        }
        
        // 创建调试面板
        const panel = document.createElement('div');
        panel.id = 'debugPanel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 400px;
            max-height: 500px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: monospace;
            font-size: 12px;
            overflow-y: auto;
        `;
        
        const updatePanel = () => {
            const app = window.app;
            const state = app?.store?.getState();
            const toolsManager = app?.toolService?.toolsManager;
            
            panel.innerHTML = `
                <div style="padding: 15px; border-bottom: 1px solid #eee; background: #f8f9fa;">
                    <h4 style="margin: 0; color: #333;">🔍 调试面板</h4>
                    <button onclick="document.getElementById('debugPanel').remove()" style="float: right; margin-top: -25px; background: none; border: none; font-size: 16px;">×</button>
                </div>
                <div style="padding: 15px;">
                    <h5>📊 应用状态</h5>
                    <div style="margin-bottom: 10px;">
                        <strong>应用初始化:</strong> ${app ? '✅ 已初始化' : '❌ 未初始化'}
                    </div>
                    
                    <h5>🏪 Store状态</h5>
                    <div style="margin-bottom: 5px;">
                        <strong>工具数据:</strong> ${state?.tools?.length || 0} 个
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>筛选结果:</strong> ${state?.filteredTools?.length || 0} 个
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>加载状态:</strong> ${state?.loading ? '加载中' : '已完成'}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>错误状态:</strong> ${state?.error || '无'}
                    </div>
                    
                    <h5>🔧 服务状态</h5>
                    <div style="margin-bottom: 5px;">
                        <strong>ToolService:</strong> ${app?.toolService ? '✅ 已初始化' : '❌ 未初始化'}
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>ToolsManager:</strong> ${toolsManager ? '✅ 已初始化' : '❌ 未初始化'}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>Manager工具数:</strong> ${toolsManager?.getAllTools().length || 0} 个
                    </div>
                    
                    <h5>🎨 DOM状态</h5>
                    <div style="margin-bottom: 5px;">
                        <strong>工具容器:</strong> ${document.getElementById('toolsContainer') ? '✅ 存在' : '❌ 缺失'}
                    </div>
                    <div style="margin-bottom: 5px;">
                        <strong>工具计数:</strong> ${document.getElementById('toolsCount')?.textContent || '未找到'}
                    </div>
                    <div style="margin-bottom: 10px;">
                        <strong>容器内容:</strong> ${document.getElementById('toolsContainer')?.children.length || 0} 个子元素
                    </div>
                    
                    <div style="margin-top: 15px;">
                        <button onclick="window.debug.diagnose()" style="margin: 2px; padding: 5px 10px; background: #6f42c1; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">🔍 系统诊断</button>
                        <button onclick="window.debug.forceInit()" style="margin: 2px; padding: 5px 10px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">强制初始化</button>
                        <button onclick="window.debug.forceRender()" style="margin: 2px; padding: 5px 10px; background: #ffc107; color: black; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">强制渲染</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="window.debug.checkTools()" style="margin: 2px; padding: 5px 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">检查工具</button>
                        <button onclick="window.debug.reloadTools()" style="margin: 2px; padding: 5px 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">重新加载</button>
                    </div>
                    <div style="margin-top: 10px;">
                        <button onclick="window.debug.toggleSimpleCards()" style="margin: 2px; padding: 5px 10px; background: ${window.debug?.useSimpleCards ? '#dc3545' : '#6c757d'}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">
                            ${window.debug?.useSimpleCards ? '禁用简化卡片' : '启用简化卡片'}
                        </button>
                        <button onclick="console.clear()" style="margin: 2px; padding: 5px 10px; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px;">清空控制台</button>
                    </div>
                </div>
            `;
        };
        
        updatePanel();
        document.body.appendChild(panel);
        
        // 每秒更新一次
        const interval = setInterval(() => {
            if (!document.getElementById('debugPanel')) {
                clearInterval(interval);
                return;
            }
            updatePanel();
        }, 1000);
        
        console.log('✅ 调试面板已创建并添加到页面');
        return '调试面板已创建';
    }
};

console.log('🔍 调试工具已加载 - 使用以下命令:');
console.log('- window.debug.diagnose() - 🔍 系统诊断报告 ⭐⭐⭐');
console.log('- window.debug.showDebugPanel() - 显示可视化调试面板 ⭐');
console.log('- window.debug.forceInit() - 强制重新初始化工具数据 🔧');
console.log('- window.debug.toggleSimpleCards() - 切换简化卡片模式 🔧');
console.log('- window.debug.checkTools() - 检查工具状态');
console.log('- window.debug.reloadTools() - 重新加载工具');
console.log('- window.debug.forceRender() - 强制重新渲染工具');
console.log('- window.debug.state() - 查看应用状态');
console.log('- window.debug.tools() - 查看工具列表');
console.log('');
console.log('💡 推荐首选: window.debug.diagnose() 获取诊断报告和修复建议');
console.log('💡 可视化面板: window.debug.showDebugPanel() 查看实时状态');
console.log('💡 如果初次加载无工具，请尝试: window.debug.forceInit()');
console.log('💡 如果工具无法显示，请尝试: window.debug.toggleSimpleCards()'); 