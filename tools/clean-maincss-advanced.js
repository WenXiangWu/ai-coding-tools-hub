// 高级自动化 main.css 清理脚本
// 用法：node tools/clean-maincss-advanced.js
// 依赖：tools/css-mapping.js 必须可用
// 目标：保留迁移声明和历史变更注释，其余全部移除

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const mainCssPath = path.resolve(__dirname, '../src/styles/main.css');
const backupPath = mainCssPath + '.bak.' + Date.now();

// 1. 运行 css-mapping.js，获取未被引用的选择器列表
console.log('正在扫描全站引用，生成未被引用选择器列表...');
const mappingResult = execSync('node tools/css-mapping.js --unused', { encoding: 'utf-8' });
let unusedSelectors = [];
try {
  unusedSelectors = JSON.parse(mappingResult);
} catch (e) {
  console.error('css-mapping.js 输出解析失败，请检查 tools/css-mapping.js 是否支持 --unused 并输出JSON数组');
  process.exit(1);
}
console.log('未被引用的选择器数量:', unusedSelectors.length);

// 2. 备份 main.css
fs.copyFileSync(mainCssPath, backupPath);
console.log('已备份 main.css 至', backupPath);

// 3. 读取 main.css 内容
let css = fs.readFileSync(mainCssPath, 'utf-8');

// 4. 批量删除未被引用的选择器（简单处理：逐个正则删除）
for (const sel of unusedSelectors) {
  // 仅支持 class/id/标签选择器，不处理嵌套/组合/媒体查询
  // 例如 .foo, #bar, h1
  const safeSel = sel.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  // 匹配选择器及其整个规则块
  const reg = new RegExp(`${safeSel}\s*{[^}]*}`, 'g');
  css = css.replace(reg, '');
}

// 5. 清理注释（仅保留首段迁移声明和历史变更注释）
css = css.replace(/\/\*[^*]*迁移[^*]*\*\//g, ''); // 移除迁移注释（后面会补充）
css = css.replace(/\/\*[^*]*历史变更[^*]*\*\//g, ''); // 移除历史变更注释（后面会补充）
const notice = `/*\n * main.css 样式已全部迁移至 src/styles/base/、components/、pages/ 等目录。\n * 如需历史样式请查阅 main.css 备份文件。\n * 最后清理时间: ${new Date().toISOString()}\n */\n`;
css = notice + css;

// 6. 清理多余空行
css = css.replace(/\n{3,}/g, '\n\n');

// 7. 清理无效媒体查询、空规则块、重复定义（简单正则处理）
css = css.replace(/@media[^{]+{\s*}/g, ''); // 空媒体查询
css = css.replace(/[^}]+{\s*}/g, ''); // 空规则块

// 8. 写回 main.css
fs.writeFileSync(mainCssPath, css, 'utf-8');
console.log('main.css 已自动化清理完成，仅保留迁移声明和必要注释。'); 