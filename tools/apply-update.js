#!/usr/bin/env node
/* ============================================================
   应用编辑模式导出的更新 → 写回内容数据文件
   ------------------------------------------------------------
   用法：node tools/apply-update.js geo-update-home-zh.json [...]

   · payload.lang = 'en' → 写入 assets/data/content.en.js
     payload.lang = 'zh' 或缺失 → 写入 assets/data/content.js
   · 采用「按行定位 + 就地替换」的方式写回，保留原文件的注释与排版
   · 同一段文字在文件中出现多次且只改了其中一处时，会跳过并报告，
     避免误改（这种情况请手动改一次）
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const FILES = {
  zh: { file: path.join(ROOT, 'assets', 'data', 'content.js'), global: 'SITE_DATA' },
  en: { file: path.join(ROOT, 'assets', 'data', 'content.en.js'), global: 'SITE_DATA_EN' }
};

const args = process.argv.slice(2);
if (!args.length) {
  console.error('用法：node tools/apply-update.js <geo-update-xxx.json> [更多文件...]');
  process.exit(1);
}

/* 读取数据文件并求值 */
function readData(target) {
  const src = fs.readFileSync(target.file, 'utf8');
  const sandbox = { window: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: path.basename(target.file) });
  const data = sandbox.window[target.global];
  if (!data) throw new Error(`${path.basename(target.file)} 中未找到 ${target.global}`);
  return { src, data };
}

function getPath(obj, p) {
  return p.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/* 把字符串渲染成 JS 字面量（与原文件风格一致：单引号） */
function literal(s) {
  return "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
}

/* 在源码中定位某个字符串字面量所在行；返回行号数组 */
function findLiteralLines(src, value) {
  const lit = literal(value);
  const alt = '"' + String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
  const lines = src.split('\n');
  const hits = [];
  lines.forEach((line, i) => {
    if (line.includes(lit) || line.includes(alt)) hits.push(i);
  });
  return hits;
}

/* ---------- 主流程 ---------- */
const byLang = { zh: [], en: [] };
for (const f of args) {
  const payload = JSON.parse(fs.readFileSync(path.resolve(f), 'utf8'));
  const lang = payload.lang === 'en' ? 'en' : 'zh';
  byLang[lang].push(payload);
}

let totalApplied = 0;
let totalSkipped = 0;

for (const lang of ['zh', 'en']) {
  const list = byLang[lang];
  if (!list.length) continue;
  const target = FILES[lang];
  const { src, data } = readData(target);

  let lines = src.split('\n');
  let applied = 0;
  const skipped = [];

  for (const payload of list) {
    const page = data.pages[payload.page];
    if (!page) {
      console.error(`✗ 跳过 ${payload.page}：找不到页面`);
      continue;
    }
    for (const [p, val] of Object.entries(payload.overrides || {})) {
      const old = getPath(page, p);
      if (typeof old !== 'string') { skipped.push(`${payload.page} → ${p}（路径不存在）`); continue; }
      if (old === val) continue;

      const hits = findLiteralLines(lines.join('\n'), old);
      if (hits.length === 1) {
        const i = hits[0];
        const lit = literal(old);
        const alt = '"' + String(old).replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
        lines[i] = lines[i].split(lit).join(literal(val)).split(alt).join(literal(val));
        applied++;
      } else if (hits.length === 0) {
        skipped.push(`${payload.page} → ${p}（原文未找到，可能已被改过）`);
      } else {
        skipped.push(`${payload.page} → ${p}（原文出现 ${hits.length} 次，需手动确认）`);
      }
    }
    if (payload.updated) data.meta.updated = payload.updated;
  }

  if (applied) {
    fs.writeFileSync(target.file, lines.join('\n'));
  }
  totalApplied += applied;
  totalSkipped += skipped.length;
  console.log(`✓ ${lang === 'en' ? '英文' : '中文'}：已应用 ${applied} 处 → ${path.basename(target.file)}`);
  if (skipped.length) {
    console.warn(`  ⚠ ${skipped.length} 处需手动处理：`);
    skipped.slice(0, 8).forEach(s => console.warn('    ' + s));
    if (skipped.length > 8) console.warn(`    ... 还有 ${skipped.length - 8} 处`);
  }
}

console.log(`\n共应用 ${totalApplied} 处更新${totalSkipped ? `，${totalSkipped} 处需手动处理` : ''}`);
console.log('提示：改完内容后运行  node tools/build-i18n.js  校验中英文结构是否仍然一致');
