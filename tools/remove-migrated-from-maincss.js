// 自动移除main.css中已迁移样式的脚本
// 用法：node tools/remove-migrated-from-maincss.js
// 依赖：npm install css

const fs = require('fs');
const path = require('path');
const css = require('css');

const CONFIG_PATH = path.resolve(__dirname, 'migrate-config.json');
const MAIN_CSS_PATH = path.resolve(__dirname, '../src/styles/main.css');

function formatDate() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

function backupMainCss() {
  const backupPath = MAIN_CSS_PATH + '.bak_' + formatDate();
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(MAIN_CSS_PATH, backupPath);
    console.log('已备份main.css到: ' + backupPath);
  }
}

function loadConfig() {
  return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
}

function loadMainCss() {
  return fs.readFileSync(MAIN_CSS_PATH, 'utf-8');
}

function getAllMigratedSelectors(config) {
  // 扁平化所有迁移选择器
  return config.reduce((arr, item) => arr.concat(item.selectors), []);
}

function isSelectorMatch(sel, migratedSelectors) {
  // 支持模糊匹配：如.btn 匹配 .btn:hover/.main .btn
  return migratedSelectors.some(s => sel === s || (s.startsWith('.') && sel.includes(s)) || (s.startsWith('#') && sel.includes(s)));
}

function removeMigratedRules(ast, migratedSelectors) {
  const before = ast.stylesheet.rules.length;
  ast.stylesheet.rules = ast.stylesheet.rules.filter(rule => {
    if (rule.type !== 'rule') return true;
    // 只要有一个选择器命中就删除
    return !rule.selectors.some(sel => isSelectorMatch(sel, migratedSelectors));
  });
  const after = ast.stylesheet.rules.length;
  return before - after;
}

function main() {
  backupMainCss();
  const config = loadConfig();
  const migratedSelectors = getAllMigratedSelectors(config);
  const rawCss = loadMainCss();
  const ast = css.parse(rawCss, { source: MAIN_CSS_PATH });
  const removed = removeMigratedRules(ast, migratedSelectors);
  if (removed > 0) {
    const newCss = css.stringify(ast, { compress: false });
    fs.writeFileSync(MAIN_CSS_PATH, newCss, 'utf-8');
    console.log(`已从main.css中移除${removed}条已迁移样式规则。`);
  } else {
    console.log('main.css中无可移除的迁移样式。');
  }
}

main(); 