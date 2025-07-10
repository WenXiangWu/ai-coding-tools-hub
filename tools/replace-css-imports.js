// 自动化替换CSS入口引用脚本（自动读取迁移清单）
// 用法：node tools/replace-css-imports.js
// 依赖：npm install glob

const fs = require('fs');
const glob = require('glob');
const path = require('path');

// 自动读取迁移清单，动态生成已迁移css文件列表
const CONFIG_PATH = path.resolve(__dirname, 'migrate-config.json');
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
const migratedCss = Array.from(new Set(
  config.map(item => item.target)
)).sort(); // 可自定义排序

const newLinks = migratedCss.map(f => `<link rel="stylesheet" href="${f}">`).join('\n');

// 支持增量迁移：如果main.css还有未迁移内容，则保留main.css引用
function updateHtmlFile(file) {
  let content = fs.readFileSync(file, 'utf-8');
  const mainCssRegex = /<link[^>]+src\/styles\/main\.css[^>]+>/g;
  if (mainCssRegex.test(content)) {
    // 检查main.css是否还需保留
    let keepMain = false;
    try {
      const mainCss = fs.readFileSync(path.resolve(__dirname, '../src/styles/main.css'), 'utf-8');
      if (mainCss.trim().length > 0) keepMain = true;
    } catch (e) { keepMain = false; }
    const replacement = keepMain ? (newLinks + '\n<link rel="stylesheet" href="src/styles/main.css">') : newLinks;
    content = content.replace(mainCssRegex, replacement);
    fs.writeFileSync(file, content, 'utf-8');
    console.log(`已更新: ${file}`);
  }
}

glob.sync('**/*.html', { ignore: 'node_modules/**' }).forEach(updateHtmlFile);
console.log('CSS入口引用批量替换完成。'); 