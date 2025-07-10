/**
 * 网页转换器教程
 * 介绍如何使用网页转换器将网页内容转换为工具详情页内容
 */

const content = {
    title: '网页转换器使用教程',
    html: `
        <div class="tutorial-content">
            <h1>网页转换器使用教程</h1>
            
            <div class="tutorial-section">
                <h2>什么是网页转换器？</h2>
                <p>网页转换器是一个强大的工具，可以将任何网页的内容自动转换为符合我们项目样式和布局的代码，并可以轻松地将其插入到工具详情页导航栏中的任意标签页下作为子标签页内容。</p>
                <p>这个工具特别适合以下场景：</p>
                <ul>
                    <li>快速导入外部文档和教程到我们的平台</li>
                    <li>将网页内容结构化为符合我们系统的格式</li>
                    <li>保持内容的一致性和样式统一</li>
                    <li>节省手动复制粘贴和格式调整的时间</li>
                </ul>
            </div>
            
            <div class="tutorial-section">
                <h2>如何使用网页转换器</h2>
                <p>使用网页转换器非常简单，只需按照以下步骤操作：</p>
                
                <div class="step">
                    <h3>步骤 1：准备网页URL</h3>
                    <p>确定你想要转换的网页URL。这可以是任何公开可访问的网页，如官方文档、教程、博客文章等。</p>
                    <div class="code-block">
                        <pre><code>const url = "https://docs.cursor.com/welcome";</code></pre>
                    </div>
                </div>
                
                <div class="step">
                    <h3>步骤 2：创建网页转换器实例</h3>
                    <p>首先，我们需要导入并创建一个网页转换器实例：</p>
                    <div class="code-block">
                        <pre><code>import WebpageConverter from '../tools/common/WebpageConverter.js';

// 创建网页转换器实例
const converter = new WebpageConverter();</code></pre>
                    </div>
                </div>
                
                <div class="step">
                    <h3>步骤 3：转换网页内容</h3>
                    <p>使用转换器的convertWebpage方法将网页内容转换为工具详情页内容：</p>
                    <div class="code-block">
                        <pre><code>// 转换网页内容
const toolDetailContent = await converter.convertWebpage(url);</code></pre>
                    </div>
                    <p>这将返回一个包含欢迎页配置、导航结构和内容的对象。</p>
                </div>
                
                <div class="step">
                    <h3>步骤 4：将内容插入到导航中</h3>
                    <p>确定要将内容插入到哪个标签页下，然后使用insertIntoTab方法：</p>
                    <div class="code-block">
                        <pre><code>// 将内容插入到"教程"标签页下
const tabId = "tutorials";
const itemId = "webpage_content";
const updatedNavigation = converter.insertIntoTab(toolDetailContent, tabId, itemId);</code></pre>
                    </div>
                </div>
                
                <div class="step">
                    <h3>步骤 5：更新工具详情页</h3>
                    <p>最后，使用更新后的导航结构更新工具详情页：</p>
                    <div class="code-block">
                        <pre><code>// 获取导航管理器
import { getToolDetailNavigationManager } from '../managers/tool-detail-navigation-manager.js';
const navigationManager = getToolDetailNavigationManager('tool_id');

// 更新导航结构
navigationManager.config = updatedNavigation;

// 渲染导航
navigationManager.renderNavigation(container);</code></pre>
                    </div>
                </div>
            </div>
            
            <div class="tutorial-section">
                <h2>网页转换器的工作原理</h2>
                <p>网页转换器通过以下步骤将网页内容转换为工具详情页内容：</p>
                
                <ol>
                    <li><strong>获取网页内容</strong>：使用fetch API获取网页的HTML内容。</li>
                    <li><strong>解析网页结构</strong>：使用DOM解析器解析HTML内容，提取标题、副标题、描述、特性、导航和内容部分。</li>
                    <li><strong>转换为工具详情页格式</strong>：将解析后的网页结构转换为符合工具详情页格式的对象。</li>
                    <li><strong>生成导航结构</strong>：根据网页内容生成导航结构，包括标签页和子项。</li>
                    <li><strong>生成内容</strong>：为每个导航项生成对应的内容。</li>
                </ol>
                
                <div class="note">
                    <p><strong>注意</strong>：由于浏览器的同源策略限制，直接在前端获取其他域名的网页内容可能会遇到CORS（跨域资源共享）问题。在实际应用中，我们可能需要使用代理服务器或后端API来获取网页内容。</p>
                </div>
            </div>
            
            <div class="tutorial-section">
                <h2>高级用法</h2>
                
                <div class="subsection">
                    <h3>自定义选择器</h3>
                    <p>你可以自定义网页转换器使用的选择器，以适应不同网页的结构：</p>
                    <div class="code-block">
                        <pre><code>// 自定义选择器
converter.config.selectors = {
    title: ['h1.custom-title', '.page-title'],
    subtitle: ['.custom-subtitle'],
    // ... 其他选择器
};</code></pre>
                    </div>
                </div>
                
                <div class="subsection">
                    <h3>手动解析网页</h3>
                    <p>如果你需要更精细的控制，可以手动获取和解析网页内容：</p>
                    <div class="code-block">
                        <pre><code>// 手动获取网页内容
const html = await converter.fetchWebpage(url);

// 手动解析网页内容
const webpage = converter.parseWebpage(html);

// 手动转换为工具详情页内容
const toolDetailContent = converter.convertToToolDetail(webpage);</code></pre>
                    </div>
                </div>
                
                <div class="subsection">
                    <h3>处理特定网站</h3>
                    <p>对于特定网站，你可能需要编写专门的解析逻辑：</p>
                    <div class="code-block">
                        <pre><code>// 检查是否是特定网站
if (url.includes('example.com')) {
    // 使用特定的解析逻辑
    // ...
}</code></pre>
                    </div>
                </div>
            </div>
            
            <div class="tutorial-section">
                <h2>示例：转换Cursor文档</h2>
                <p>下面是一个完整的示例，演示如何将Cursor文档转换为工具详情页内容：</p>
                
                <div class="code-block">
                    <pre><code>import WebpageConverter from '../tools/common/WebpageConverter.js';
import { getToolDetailNavigationManager } from '../managers/tool-detail-navigation-manager.js';
import ToolDetail from '../core/ToolDetail.js';

// 创建网页转换器实例
const converter = new WebpageConverter();

// 转换Cursor文档
async function convertCursorDocs() {
    try {
        // 转换网页内容
        const url = "https://docs.cursor.com/welcome";
        const toolDetailContent = await converter.convertWebpage(url);
        
        // 将内容插入到"教程"标签页下
        const tabId = "tutorials";
        const itemId = "cursor_welcome";
        const updatedNavigation = converter.insertIntoTab(toolDetailContent, tabId, itemId);
        
        // 获取导航管理器
        const navigationManager = getToolDetailNavigationManager('cursor');
        
        // 更新导航结构
        navigationManager.config = updatedNavigation;
        
        // 渲染导航
        const navigationContainer = document.getElementById('navigation-container');
        navigationManager.renderNavigation(navigationContainer);
        
        // 创建工具详情页实例
        const toolDetail = new ToolDetail('cursor');
        await toolDetail.initialize();
        
        // 渲染欢迎页
        const contentContainer = document.getElementById('content-container');
        await toolDetail.renderWelcomePage(contentContainer);
        
        console.log('转换成功！');
    } catch (error) {
        console.error('转换失败:', error);
    }
}

// 调用转换函数
convertCursorDocs();</code></pre>
                </div>
            </div>
            
            <div class="tutorial-section">
                <h2>总结</h2>
                <p>网页转换器是一个强大的工具，可以帮助我们快速将外部网页内容转换为符合我们项目样式和布局的代码，并轻松地集成到我们的工具详情页中。通过使用这个工具，我们可以：</p>
                <ul>
                    <li>节省手动复制粘贴和格式调整的时间</li>
                    <li>保持内容的一致性和样式统一</li>
                    <li>快速导入外部文档和教程</li>
                    <li>将网页内容结构化为符合我们系统的格式</li>
                </ul>
                <p>希望这个教程能帮助你理解和使用网页转换器。如果你有任何问题或建议，请随时联系我们。</p>
            </div>
        </div>
    `
};

export default content; 