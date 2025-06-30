export function init(container) {
    container.innerHTML = `
        <textarea id="jsonInput" placeholder="请输入JSON字符串" rows="8"></textarea>
        <button id="parseBtn">解析</button>
        <pre id="jsonOutput"></pre>
    `;
    const input = container.querySelector('#jsonInput');
    const output = container.querySelector('#jsonOutput');
    const btn = container.querySelector('#parseBtn');
    btn.onclick = () => {
        try {
            const obj = JSON.parse(input.value);
            output.textContent = JSON.stringify(obj, null, 2);
            output.style.color = '#2563eb';
        } catch (e) {
            output.textContent = '解析失败：' + e.message;
            output.style.color = '#ef4444';
        }
    };
} 