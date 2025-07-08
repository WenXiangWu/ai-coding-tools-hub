/**
 * Cursor工具内容入口文件
 * 统一导出所有内容模块
 */

// 前言部分
export { default as what_is_cursor } from './introduction/what-is-cursor';
export { default as why_cursor } from './introduction/why-cursor';
export { default as core_features } from './introduction/core-features';

// 教程部分 - 学习路线
export { default as env_setup } from './tutorials/learning-path/env-setup';
export { default as basic_concepts } from './tutorials/learning-path/basic-concepts';
export { default as mini_program_setup } from './tutorials/learning-path/mini-program/setup';
export { default as mini_program_dev } from './tutorials/learning-path/mini-program/development';
export { default as mini_program_debug } from './tutorials/learning-path/mini-program/debugging';

// 教程部分 - 入门教程
export { default as interface_intro } from './tutorials/basic/interface-intro';
export { default as basic_operations } from './tutorials/basic/basic-operations';
export { default as ai_features } from './tutorials/basic/ai-features';

// 教程部分 - 进阶教程
export { default as composer_guide } from './tutorials/advanced/composer-guide';
export { default as ai_prompts } from './tutorials/advanced/ai-prompts';
export { default as custom_settings } from './tutorials/advanced/custom-settings';

// 教程部分 - 实战项目
export { default as web_app } from './tutorials/projects/web-app';
export { default as api_service } from './tutorials/projects/api-service';
export { default as data_analysis } from './tutorials/projects/data-analysis';

// 教程部分 - 常见问题
export { default as installation_issues } from './tutorials/faq/installation-issues';
export { default as ai_issues } from './tutorials/faq/ai-issues';
export { default as performance_issues } from './tutorials/faq/performance-issues';

// 最佳实践部分 - 官方最佳实践
export { default as project_structure } from './best-practices/official/project-structure';
export { default as coding_standards } from './best-practices/official/coding-standards';
export { default as ai_collaboration } from './best-practices/official/ai-collaboration';

// 最佳实践部分 - 开发经验
export { default as workflow_optimization } from './best-practices/development/workflow-optimization';
export { default as debugging_skills } from './best-practices/development/debugging-skills';
export { default as performance_tuning } from './best-practices/development/performance-tuning';

// 最佳实践部分 - 团队落地实践
export { default as team_workflow } from './best-practices/team/team-workflow';
export { default as code_review } from './best-practices/team/code-review';
export { default as training_guide } from './best-practices/team/training-guide'; 