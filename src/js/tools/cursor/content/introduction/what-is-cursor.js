/**
 * 什么是Cursor内容模块
 */

export default {
    title: "什么是Cursor",
    
    // HTML内容
    html: `
        <div class="content-section">
            <h1>什么是Cursor</h1>
            
            <p class="lead">
                Cursor是一款革命性的AI驱动代码编辑器，基于VSCode构建并集成了强大的GPT-4模型，
                为开发者提供了前所未有的编程体验。
            </p>
            
            <div class="info-card">
                <div class="info-icon">
                    <i class="fas fa-info-circle"></i>
                </div>
                <div class="info-content">
                    <p>
                        Cursor由前Scale AI工程师团队开发，旨在将AI的力量带入日常编程工作流程，
                        帮助开发者更快速、更高效地编写代码。
                    </p>
                </div>
            </div>
            
            <h2>Cursor的定位</h2>
            
            <p>
                Cursor不仅仅是一个代码编辑器，更是一个智能编程助手。它通过深度集成AI能力，
                实现了代码补全、代码生成、代码解释等功能，让编程变得更加直观和高效。
            </p>
            
            <div class="image-container">
                <img src="https://cursor.sh/img/cursor-screenshot.png" alt="Cursor编辑器界面" class="responsive-img">
                <p class="caption">Cursor编辑器界面展示</p>
            </div>
            
            <h2>主要特点</h2>
            
            <ul class="feature-list">
                <li>
                    <strong>AI驱动</strong>：集成GPT-4模型，提供智能代码补全和生成
                </li>
                <li>
                    <strong>自然语言交互</strong>：使用自然语言描述需求，AI自动生成代码
                </li>
                <li>
                    <strong>代码解释</strong>：一键解释复杂代码，快速理解功能逻辑
                </li>
                <li>
                    <strong>多文件编辑</strong>：强大的Composer功能，同时处理多个文件
                </li>
                <li>
                    <strong>VSCode兼容</strong>：基于VSCode构建，支持大多数VSCode插件
                </li>
            </ul>
            
            <h2>适用场景</h2>
            
            <p>
                Cursor适用于各种开发场景，包括但不限于：
            </p>
            
            <div class="scenario-grid">
                <div class="scenario-card">
                    <div class="scenario-icon">
                        <i class="fas fa-globe"></i>
                    </div>
                    <h3>Web开发</h3>
                    <p>前端和后端开发，快速生成HTML、CSS、JavaScript代码</p>
                </div>
                
                <div class="scenario-card">
                    <div class="scenario-icon">
                        <i class="fas fa-mobile-alt"></i>
                    </div>
                    <h3>移动应用开发</h3>
                    <p>iOS、Android应用开发，提高代码编写效率</p>
                </div>
                
                <div class="scenario-card">
                    <div class="scenario-icon">
                        <i class="fas fa-server"></i>
                    </div>
                    <h3>后端服务开发</h3>
                    <p>API设计、数据库操作、服务器端逻辑实现</p>
                </div>
                
                <div class="scenario-card">
                    <div class="scenario-icon">
                        <i class="fas fa-chart-bar"></i>
                    </div>
                    <h3>数据分析</h3>
                    <p>数据处理、可视化和机器学习模型开发</p>
                </div>
            </div>
            
            <h2>技术架构</h2>
            
            <p>
                Cursor基于Electron框架构建，核心编辑功能继承自VSCode，并通过API与GPT-4模型进行深度集成。
                这种架构既保留了VSCode的强大功能和生态系统，又增加了AI的智能辅助能力。
            </p>
            
            <div class="code-block">
                <pre><code>
// Cursor示例：使用AI生成代码
// 在编辑器中输入注释描述需求
// 例如：

/**
 * 创建一个函数，接收一个数组，返回数组中的最大值和最小值
 */

// AI会生成如下代码：
function findMinMax(arr) {
    if (!arr || arr.length === 0) {
        return { min: undefined, max: undefined };
    }
    
    let min = arr[0];
    let max = arr[0];
    
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }
    
    return { min, max };
}
                </code></pre>
            </div>
            
            <div class="conclusion">
                <p>
                    Cursor代表了编程工具的未来发展方向，通过将AI与传统编辑器结合，
                    创造出更智能、更高效的编程体验。无论是初学者还是专业开发者，
                    都能从Cursor提供的AI辅助功能中获益，提高编程效率和代码质量。
                </p>
            </div>
        </div>
    `,
    
    // 元数据
    meta: {
        author: "AI工具箱团队",
        createTime: "2023-09-15",
        updateTime: "2023-12-01",
        readingTime: 5, // 分钟
        difficulty: "入门" // 入门、进阶、高级
    },
    
    // 相关内容推荐
    related: [
        "why_cursor",
        "core_features",
        "env_setup"
    ]
}; 