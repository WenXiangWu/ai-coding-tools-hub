// devtools/devtools.js
// 统一管理所有开发小工具的包

import * as jsonTool from './json.js';
import * as diffTool from './diff.js';
import * as cronTool from './cron.js';
import * as timestampTool from './timestamp.js';
import * as qrcodeTool from './qrcode.js';
import * as regexTool from './regex.js';

export const DevTools = {
    json: jsonTool,
    diff: diffTool,
    cron: cronTool,
    timestamp: timestampTool,
    qrcode: qrcodeTool,
    regex: regexTool
}; 