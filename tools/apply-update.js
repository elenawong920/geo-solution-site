#!/usr/bin/env node
/* ============================================================
   应用编辑模式导出的更新 → 写回 assets/data/content.js
   用法：node tools/apply-update.js geo-update-home.json
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CONTENT_FILE = path.join(ROOT, 'assets', 'data', 'content.js');

const args = process.argv.slice(2);
if (!args.length) {
  console.error('用法：node tools/apply-update.js <geo-update-xxx.json> [更多文件...]');
  process.exit(1);
}

/* 读取当前 content.js（JS 对象字面量，用 vm 求值） */
function readContent() {
  const src = fs.readFileSync(CONTENT_FILE, 'utf8');
  const start = src.indexOf('{');
  const end = src.lastIndexOf('}');
  if (start < 0 || end < 0) throw new Error('content.js 结构异常');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'content.js' });
  if (!sandbox.window.SITE_DATA) throw new Error('未找到 SITE_DATA');
  return { src, json: sandbox.window.SITE_DATA };
}

function getPath(obj, p) {
  return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function setPath(obj, p, val) {
  const parts = p.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    if (cur[parts[i]] == null) cur[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {};
    cur = cur[parts[i]];
  }
  cur[parts[parts.length - 1]] = val;
}

const { src, json } = readContent();
let applied = 0;
const missing = [];

for (const file of args) {
  const payload = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  const page = json.pages[payload.page];
  if (!page) {
    console.error(`✗ 跳过 ${file}：找不到页面 ${payload.page}`);
    continue;
  }
  for (const [p, val] of Object.entries(payload.overrides || {})) {
    const target = getPath(page, p);
    if (typeof target !== 'string') {
      missing.push(`${payload.page} → ${p}`);
      continue;
    }
    setPath(page, p, val);
    applied++;
  }
  if (payload.updated) {
    json.meta.updated = payload.updated;
  }
  console.log(`✓ ${payload.page}：已应用 ${Object.keys(payload.overrides || {}).length} 处`);
}

if (missing.length) {
  console.warn(`\n⚠ ${missing.length} 处路径未匹配（已跳过）：`);
  missing.slice(0, 10).forEach(m => console.warn('  ' + m));
}

/* 写回，保留头部注释 */
const headerEnd = src.indexOf('*/') + 2;
const header = src.slice(0, headerEnd);
const body = 'window.SITE_DATA = ' + JSON.stringify(json, null, 2) + ';\n';
fs.writeFileSync(CONTENT_FILE, header + '\n\n' + body);

console.log(`\n共应用 ${applied} 处更新，已写入 assets/data/content.js`);
console.log(`版本：${json.meta.version} · 更新于 ${json.meta.updated}`);
