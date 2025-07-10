// CSS迁移一键工作流脚本
// 用法：node tools/css-migrate-workflow.js
// 依赖：node >= 14

const { execSync } = require('child_process');

function runStep(cmd, desc) {
  try {
    console.log(`\n=== ${desc} ===`);
    execSync(`node ${cmd}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`\n[错误] 执行 ${cmd} 失败，已中断工作流。`);
    process.exit(1);
  }
}

runStep('tools/css-migrate.js', '1. 迁移样式到新文件');
runStep('tools/replace-css-imports.js', '2. 替换HTML入口引用');
runStep('tools/remove-migrated-from-maincss.js', '3. 删除main.css中已迁移内容');

console.log('\n🎉 CSS迁移工作流全部完成！请进行页面验证和迁移日志记录。'); 