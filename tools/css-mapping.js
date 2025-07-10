// 自动化CSS映射表生成工具（升级版）
// 用法：node tools/css-mapping.js [--unused]

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const css = require('css'); // 需先 npm install css
const csvWriter = require('csv-writer').createObjectCsvWriter; // 需先 npm install csv-writer

// 递归扫描所有相关文件
const exts = ['html', 'js', 'jsx', 'ts', 'tsx'];
function getAllFiles() {
  let files = [];
  exts.forEach(ext => {
    files = files.concat(glob.sync(`**/*.${ext}`, { ignore: 'node_modules/**' }));
  });
  return files;
}

// 提取选择器（支持html/js/ts/tsx/jsx）
function extractSelectorsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const selectors = new Set();
  // class="xxx" 或 className="xxx"
  const classMatches = [...content.matchAll(/class(?:Name)?\s*=\s*["'`]([^"'`]+)["'`]/g)];
  classMatches.forEach(m => m[1].split(/\s+/).forEach(cls => selectors.add('.' + cls)));
  // id="xxx" 或 id='xxx'
  const idMatches = [...content.matchAll(/id\s*=\s*["'`]([^"'`]+)["'`]/g)];
  idMatches.forEach(m => selectors.add('#' + m[1]));
  // 直接字符串形式的class名（如'btn-primary'）
  const strMatches = [...content.matchAll(/["'`]([a-zA-Z0-9\-_]+)["'`]/g)];
  strMatches.forEach(m => {
    if (/^[a-zA-Z]/.test(m[1]) && m[1].length > 2 && !m[1].includes(' ')) {
      selectors.add('.' + m[1]);
    }
  });
  // 标签名
  const tagMatches = [...content.matchAll(/<([a-zA-Z0-9\-]+)[\s>]/g)];
  tagMatches.forEach(m => selectors.add(m[1]));
  return Array.from(selectors);
}

// 提取main.css选择器及行号
function extractCssSelectors(cssFile) {
  const content = fs.readFileSync(cssFile, 'utf-8');
  const ast = css.parse(content, { source: cssFile });
  const selectorMap = {};
  ast.stylesheet.rules.forEach(rule => {
    if (rule.type === 'rule') {
      rule.selectors.forEach(sel => {
        selectorMap[sel] = rule.position.start.line;
      });
    }
  });
  return selectorMap;
}

// 智能模糊匹配：页面用到.btn，css有.btn:hover/.main .btn等也算引用
function isSelectorMatch(pageSel, cssSel) {
  if (cssSel === pageSel) return true;
  // 只要cssSel包含pageSel且pageSel以.或#开头
  if ((pageSel.startsWith('.') || pageSel.startsWith('#')) && cssSel.includes(pageSel)) return true;
  // 标签名精确匹配
  if (!pageSel.startsWith('.') && !pageSel.startsWith('#') && cssSel === pageSel) return true;
  return false;
}

// 生成映射表
function generateMapping(pages, cssSelectors) {
  const mapping = [];
  for (const [file, selectors] of Object.entries(pages)) {
    selectors.forEach(sel => {
      // 找到所有匹配的css选择器
      const matchedCss = Object.entries(cssSelectors).filter(([cssSel]) => isSelectorMatch(sel, cssSel));
      if (matchedCss.length > 0) {
        matchedCss.forEach(([cssSel, line]) => {
          mapping.push({
            file,
            selector: sel,
            cssSelector: cssSel,
            cssLine: line,
            remark: ''
          });
        });
      } else {
        mapping.push({
          file,
          selector: sel,
          cssSelector: '',
          cssLine: '',
          remark: '未找到CSS定义'
        });
      }
    });
  }
  return mapping;
}

// 导出为CSV
async function exportToCsv(mapping, outFile) {
  const writer = csvWriter({
    path: outFile,
    header: [
      { id: 'file', title: '文件' },
      { id: 'selector', title: '页面/组件选择器' },
      { id: 'cssSelector', title: 'main.css选择器' },
      { id: 'cssLine', title: 'main.css行号' },
      { id: 'remark', title: '备注' }
    ]
  });
  await writer.writeRecords(mapping);
}

// 导出未被引用的CSS选择器
async function exportUnusedCss(cssSelectors, usedCssSelectors, outFile) {
  const unused = Object.entries(cssSelectors)
    .filter(([cssSel]) => !usedCssSelectors.has(cssSel))
    .map(([cssSel, line]) => ({ cssSelector: cssSel, cssLine: line }));
  const writer = csvWriter({
    path: outFile,
    header: [
      { id: 'cssSelector', title: '未被引用的main.css选择器' },
      { id: 'cssLine', title: 'main.css行号' }
    ]
  });
  await writer.writeRecords(unused);
}

// 新增：输出未被引用的CSS选择器JSON数组
function outputUnusedJson(cssSelectors, usedCssSelectors) {
  const unused = Object.entries(cssSelectors)
    .filter(([cssSel]) => !usedCssSelectors.has(cssSel))
    .map(([cssSel]) => cssSel);
  console.log(JSON.stringify(unused, null, 2));
}

// 主流程
(async () => {
  const files = getAllFiles();
  const pages = {};
  files.forEach(f => pages[f] = extractSelectorsFromFile(f));
  const cssSelectors = extractCssSelectors('src/styles/main.css');
  const mapping = generateMapping(pages, cssSelectors);
  // 统计所有被引用的css选择器
  const usedCssSelectors = new Set(mapping.map(m => m.cssSelector).filter(Boolean));

  if (process.argv.includes('--unused')) {
    // 只输出未被引用的选择器JSON数组
    outputUnusedJson(cssSelectors, usedCssSelectors);
    return;
  }

  await exportToCsv(mapping, 'css_mapping_full.csv');
  await exportUnusedCss(cssSelectors, usedCssSelectors, 'unused_css_selectors.csv');
  console.log('全量CSS映射表已导出到 css_mapping_full.csv');
  console.log('未被引用的CSS选择器已导出到 unused_css_selectors.csv');
})(); 