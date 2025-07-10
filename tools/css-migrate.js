// 自动化CSS迁移脚本
// 用法：node tools/css-migrate.js
// 依赖：npm install css glob

const fs = require('fs');
const path = require('path');
const css = require('css');
const glob = require('glob');

const CONFIG_PATH = path.resolve(__dirname, 'migrate-config.json');
const MAIN_CSS_PATH = path.resolve(__dirname, '../src/styles/main.css');

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function loadMainCss() {
  return fs.readFileSync(MAIN_CSS_PATH, 'utf-8');
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function formatDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function extractRulesBySelectors(ast, selectors) {
  // 支持模糊匹配（如.btn 匹配 .btn:hover/.main .btn）
  return ast.stylesheet.rules.filter(rule =>
    rule.type === 'rule' && rule.selectors.some(sel =>
      selectors.some(s => sel === s || (s.startsWith('.') && sel.includes(s)) || (s.startsWith('#') && sel.includes(s)))
    )
  );
}

function rulesToCss(rules, rawCss) {
  // 保留原始注释和格式，直接用css-stringify更好，这里简单拼接
  return rules.map(rule => {
    const start = rule.position.start.line - 1;
    const end = rule.position.end.line;
    const lines = rawCss.split('\n').slice(start, end).join('\n');
    return lines;
  }).join('\n\n');
}

function migrateBlock({ type, selectors, desc, target }, ast, rawCss) {
  const rules = extractRulesBySelectors(ast, selectors);
  if (!rules.length) return false;
  const cssBlock = rulesToCss(rules, rawCss);
  const lines = rules.map(r => r.position.start.line).join(',');
  const comment = `/*\n * 迁移自main.css 行号: ${lines}\n * 迁移时间: ${formatDate()}\n * 描述: ${desc}\n */\n`;
  ensureDir(target);
  let old = '';
  if (fs.existsSync(target)) {
    old = fs.readFileSync(target, 'utf-8');
    // 避免重复迁移
    if (old.includes(comment)) return false;
  }
  const content = comment + '\n' + cssBlock + '\n' + (old ? old : '');
  fs.writeFileSync(target, content, 'utf-8');
  return true;
}

function main() {
  const config = loadConfig();
  const rawCss = loadMainCss();
  const ast = css.parse(rawCss, { source: MAIN_CSS_PATH });
  let migrated = 0;
  config.forEach(item => {
    if (migrateBlock(item, ast, rawCss)) {
      console.log(`已迁移: ${item.type} → ${item.target}`);
      migrated++;
    } else {
      console.log(`跳过: ${item.type}（无匹配或已迁移）`);
    }
  });
  if (migrated) {
    console.log(`\n迁移完成，共迁移 ${migrated} 个模块。请手动从main.css中删除已迁移内容并进行页面验证。`);
  } else {
    console.log('无可迁移内容。');
  }
}

main(); 