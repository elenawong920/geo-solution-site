#!/usr/bin/env node
/**
 * 双语结构校验器
 * ---------------------------------------------------------------
 * 对比 assets/data/content.js（中文）与 assets/data/content.en.js（英文），
 * 校验两者结构完全一致：
 *   - 对象键集合相同
 *   - 数组长度相同
 *   - 叶子类型相同（string / number / boolean）
 *   - 非字符串字面量（数字、开关、枚举）必须完全相同
 *
 * 用法：
 *   node tools/build-i18n.js          # 校验并输出报告
 *   node tools/build-i18n.js --fix    # 校验 + 打印未翻译的中文串
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const ZH_FILE = path.join(ROOT, 'assets/data/content.js');
const EN_FILE = path.join(ROOT, 'assets/data/content.en.js');

/* 读取并执行数据文件，拿到站点数据（中文用 SITE_DATA，英文用 SITE_DATA_EN） */
function load(file) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  const w = ctx.window;
  return w.SITE_DATA || w.SITE_DATA_EN;
}

/* 结构签名：把数据树转成可比对的形状 */
function shape(node, path, out) {
  out = out || { keys: [], arrays: [], leaves: [] };
  path = path || '';
  if (Array.isArray(node)) {
    out.arrays.push({ path, len: node.length });
    node.forEach((v, i) => shape(v, path + '[' + i + ']', out));
  } else if (node && typeof node === 'object') {
    const ks = Object.keys(node);
    out.keys.push({ path, keys: ks });
    ks.forEach(k => shape(node[k], path ? path + '.' + k : k, out));
  } else {
    out.leaves.push({ path, type: typeof node, value: node });
  }
  return out;
}

const zh = load(ZH_FILE);
const en = load(EN_FILE);

const zhShape = shape(zh);
const enShape = shape(en);

const errors = [];
const warnings = [];

/* ---- 1. 顶层键一致 ---- */
const zhTop = Object.keys(zh).sort().join(',');
const enTop = Object.keys(en).sort().join(',');
if (zhTop !== enTop) errors.push(`顶层键不一致：\n  中文：${zhTop}\n  英文：${enTop}`);

/* ---- 2. 对象键集合一致 ---- */
const zhKeyMap = new Map(zhShape.keys.map(k => [k.path, k.keys.join('|')]));
const enKeyMap = new Map(enShape.keys.map(k => [k.path, k.keys.join('|')]));
for (const [p, v] of zhKeyMap) {
  if (!enKeyMap.has(p)) errors.push(`英文缺少对象：${p}`);
  else if (enKeyMap.get(p) !== v) {
    const a = v.split('|'), b = enKeyMap.get(p).split('|');
    const onlyZh = a.filter(x => !b.includes(x));
    const onlyEn = b.filter(x => !a.includes(x));
    errors.push(`对象键不一致 @ ${p}\n  中文独有：${onlyZh.join(',') || '无'}\n  英文独有：${onlyEn.join(',') || '无'}`);
  }
}
for (const p of enKeyMap.keys()) {
  if (!zhKeyMap.has(p)) errors.push(`英文多出对象：${p}`);
}

/* ---- 3. 数组长度一致 ---- */
const zhArrMap = new Map(zhShape.arrays.map(a => [a.path, a.len]));
const enArrMap = new Map(enShape.arrays.map(a => [a.path, a.len]));
for (const [p, len] of zhArrMap) {
  if (!enArrMap.has(p)) errors.push(`英文缺少数组：${p}`);
  else if (enArrMap.get(p) !== len) errors.push(`数组长度不一致 @ ${p}：中文 ${len} / 英文 ${enArrMap.get(p)}`);
}
for (const p of enArrMap.keys()) {
  if (!zhArrMap.has(p)) errors.push(`英文多出数组：${p}`);
}

/* ---- 4. 叶子类型一致 + 非字符串字面量必须相同 ---- */
const zhLeafMap = new Map(zhShape.leaves.map(l => [l.path, l]));
const enLeafMap = new Map(enShape.leaves.map(l => [l.path, l]));
for (const [p, zl] of zhLeafMap) {
  const el = enLeafMap.get(p);
  if (!el) { errors.push(`英文缺少叶子：${p}`); continue; }
  if (zl.type !== el.type) errors.push(`叶子类型不一致 @ ${p}：中文 ${zl.type} / 英文 ${el.type}`);
  /* 非字符串值必须完全一致（数字、布尔、结构标记） */
  if (zl.type !== 'string' && String(zl.value) !== String(el.value)) {
    errors.push(`非文本值不一致 @ ${p}：中文 ${JSON.stringify(zl.value)} / 英文 ${JSON.stringify(el.value)}`);
  }
}
for (const p of enLeafMap.keys()) {
  if (!zhLeafMap.has(p)) errors.push(`英文多出叶子：${p}`);
}

/* ---- 5. 英文文件里残留的中文 ---- */
/**
 * 有意保留中文的区域（白名单）：
 *   洞察页的「种子词」区展示的是豆包平台上的真实中文搜索词，
 *   属于原始数据，不应翻译——英文版采用「中文原文 (English gloss)」的呈现方式。
 */
const KEEP_CJK = [
  'pages.insight.sections[2]'   /* 种子词分析区：中文原文 + 英文释义 */
];
const isKeepCjk = p => KEEP_CJK.some(pre => p === pre || p.startsWith(pre + '.') || p.startsWith(pre + '['));

const HAN = /[\u4e00-\u9fa5]/;
const residual = [];
const kept = [];
for (const [p, el] of enLeafMap) {
  if (el.type !== 'string' || !HAN.test(el.value)) continue;
  if (isKeepCjk(p)) kept.push({ path: p, value: el.value });
  else residual.push({ path: p, value: el.value });
}
residual.forEach(r => warnings.push(`英文残留中文（未翻译）@ ${r.path}\n  「${r.value}」`));

/* ---- 6. 统计 ---- */
const zhStr = zhShape.leaves.filter(l => l.type === 'string');
const enStr = enShape.leaves.filter(l => l.type === 'string');
const zhHan = zhStr.filter(l => HAN.test(l.value));
const enHan = enStr.filter(l => HAN.test(l.value));

console.log('══════════════════════════════════════════════');
console.log('  双语结构校验 · content.js  ⇄  content.en.js');
console.log('══════════════════════════════════════════════');
console.log(`  叶子总数      中文 ${zhStr.length}  /  英文 ${enStr.length}`);
console.log(`  对象节点 ${zhShape.keys.length}   数组节点 ${zhShape.arrays.length}`);
console.log(`  英文中含中文  ${enHan.length} 条  →  未翻译 ${residual.length} 条 / 有意保留 ${kept.length} 条`);
console.log('──────────────────────────────────────────────');

if (warnings.length) {
  console.log(`\n⚠️  警告 ${warnings.length} 条：`);
  warnings.forEach(w => console.log('  ' + w));
} else {
  console.log('\n✅ 英文文件无未翻译残留（白名单区域的中文原文为有意保留）');
}

if (errors.length) {
  console.log(`\n❌ 结构错误 ${errors.length} 条：`);
  errors.slice(0, 40).forEach(e => console.log('  ' + e));
  if (errors.length > 40) console.log(`  ... 还有 ${errors.length - 40} 条`);
  console.log('');
  process.exit(1);
} else {
  console.log('\n✅ 结构完全一致 —— 可以安全发布');
}
