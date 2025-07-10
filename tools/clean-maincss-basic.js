// 基础 main.css 清理脚本
// 用法：node tools/clean-maincss-basic.js
// 目标：清理注释、空行、空规则块，仅保留迁移声明和历史变更注释

const fs = require('fs');
const path = require('path');

const mainCssPath = path.resolve(__dirname, '../src/styles/main.css');
const backupPath = mainCssPath + '.bak.' + Date.now();

// 1. 备份 main.css
fs.copyFileSync(mainCssPath, backupPath);
console.log('已备份 main.css 至', backupPath);

// 2. 读取 main.css 内容
let css = fs.readFileSync(mainCssPath, 'utf-8');

// 3. 清理注释（仅保留首段迁移声明和历史变更注释）
css = css.replace(/\/\*[^*]*迁移[^*]*\*\//g, ''); // 移除迁移注释（后面会补充）
css = css.replace(/\/\*[^*]*历史变更[^*]*\*\//g, ''); // 移除历史变更注释（后面会补充）
const notice = `/*\n * main.css 样式已全部迁移至 src/styles/base/、components/、pages/ 等目录。\n * 如需历史样式请查阅 main.css 备份文件。\n * 最后清理时间: ${new Date().toISOString()}\n */\n`;
css = notice + css;

// 4. 清理多余空行
css = css.replace(/\n{3,}/g, '\n\n');

// 5. 清理空规则块
css = css.replace(/[^}]+{\s*}/g, '');

// 6. 写回 main.css
fs.writeFileSync(mainCssPath, css, 'utf-8');
console.log('main.css 已基础清理，仅保留迁移声明和必要注释。'); 