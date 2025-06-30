import { toolsManager } from './js/managers/tools-manager.js';

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

function getPriceText(price) {
    switch (price) {
        case 'free': return '免费';
        case 'freemium': return '部分免费';
        case 'paid': return '付费';
        default: return price;
    }
}

async function renderToolDetail() {
    const id = getQueryParam('id');
    await toolsManager.initialize();
    const tool = toolsManager.getTool(id);

    const container = document.getElementById('toolDetailContainer');
    if (!tool) {
        container.innerHTML = '<h2>未找到该工具</h2>';
        return;
    }

    const changelog = tool.changelog || (tool.extensions?.news ? tool.extensions.news.map(n => ({
        version: n.title,
        date: n.date,
        content: n.summary || ''
    })) : []);
    const tutorials = tool.extensions?.tutorials || [];

    container.innerHTML = `
        <div class="tool-detail-card-v2">
            <div class="tool-detail-header">
                <div class="tool-detail-icon">
                    <i class="${tool.logo}"></i>
                </div>
                <div class="tool-detail-maininfo">
                    <h1>${tool.name}</h1>
                    <div class="tool-detail-meta">
                        <span class="tool-detail-category">${tool.category}</span>
                        <span class="tool-detail-rating"><i class="fas fa-star"></i> ${tool.rating}</span>
                        <span class="tool-detail-users"><i class="fas fa-users"></i> ${tool.users}</span>
                        <span class="tool-detail-price"><i class="fas fa-tag"></i> ${getPriceText(tool.price)}</span>
                    </div>
                </div>
            </div>
            <div class="tool-detail-desc">${tool.description}</div>
            <div class="tool-detail-section">
                <h2>主要功能</h2>
                <ul class="tool-detail-features">
                    ${tool.features.map(f => `<li><i class=\"fas fa-check-circle\"></i> ${f}</li>`).join('')}
                </ul>
            </div>
            <div class="tool-detail-section">
                <h2>更新日志</h2>
                <ul class="tool-detail-changelog">
                    ${changelog.slice(0, 5).map(log => `
                        <li>
                            <div class="changelog-title">
                                <span class="changelog-version">${log.version || log.title}</span>
                                <span class="changelog-date">${log.date}</span>
                            </div>
                            <div class="changelog-content">${log.content || log.summary || ''}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
            <div class="tool-detail-section">
                <h2>教程区</h2>
                <div class="tool-detail-tutorials">
                    ${tutorials.length > 0 ? tutorials.map(t => `
                        <div class="tutorial-card">
                            <a href="${t.url}" target="_blank">${t.title}</a>
                            <span class="tutorial-level">${t.level || ''}</span>
                        </div>
                    `).join('') : '<div class="tutorial-card">暂无教程</div>'}
                </div>
            </div>
            <div class="tool-detail-actions">
                <a class="btn btn-primary" href="${tool.website}" target="_blank">访问官网</a>
                <a class="btn btn-secondary" href="index.html">返回首页</a>
            </div>
        </div>
    `;
}

renderToolDetail(); 