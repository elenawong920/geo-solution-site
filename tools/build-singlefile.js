#!/usr/bin/env node
/* ============================================================
   把三页站点打包成单个自包含 HTML 文件
   · CSS / JS 内联，图片转 base64 data URI
   · 用 hash 路由在同一文件内切换三个页面
   产物：geo-site-singlefile/京东科技GEO解决方案.html
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');

const SRC = path.resolve(__dirname, '..');
const OUT = path.resolve(SRC, '..', 'geo-site-singlefile');
fs.mkdirSync(OUT, { recursive: true });

const read = (p) => fs.readFileSync(path.join(SRC, p.replace(/^\/+/, '')), 'utf8');
const readBin = (p) => fs.readFileSync(path.join(SRC, p.replace(/^\/+/, '')));

/* ---- 图片转 data URI ---- */
const imgExt = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
const dataUri = (rel) => {
  const abs = path.join(SRC, rel.replace(/^\/+/, ''));
  const ext = path.extname(rel).toLowerCase();
  return `data:${imgExt[ext] || 'application/octet-stream'};base64,` + readBin(rel).toString('base64');
};

/* ---- CSS 内联 ---- */
const css = read('assets/css/main.css');

/* ---- content.js：把图片路径换成 data URI ---- */
let contentJs = read('assets/data/content.js');
const imgRefs = [...contentJs.matchAll(/'(assets\/img\/[^']+)'/g)].map(m => m[1]);
[...new Set(imgRefs)].forEach(rel => {
  contentJs = contentJs.split(`'${rel}'`).join(`'${dataUri(rel)}'`);
});

/* ---- app.js：加 hash 路由 ---- */
let appJs = read('assets/js/app.js');

/* app.js 里的 logo 路径也换成 data URI */
appJs = appJs.split('"assets/img/logo-jd.png"').join(`"${dataUri('assets/img/logo-jd.png')}"`);
appJs = appJs.split("'assets/img/logo-jd.png'").join(`'${dataUri('assets/img/logo-jd.png')}'`);

/* 把「按 body 属性取页面」改成「按 hash 取页面」，并把三页合并渲染 */
appJs = appJs.replace(
  /var pageKey = document\.body\.getAttribute\('data-page'\) \|\| 'home';/,
  `var pageKey = (location.hash || '').replace(/^#\\/?/, '') || 'home';
  if (!['home', 'overseas', 'insight'].includes(pageKey)) pageKey = 'home';
  document.body.setAttribute('data-page', pageKey);`
);

/* 路由切换：切页时重绘当前页
   注意：必须注入到 app.js 主 IIFE 内部，否则拿不到 pageKey / renderPage
   hash 形如 #/overseas（切页）或 #/overseas#delivery（切页+滚动到区块）*/
appJs = appJs.replace(
  `  if (!initEditor(pageKey)) renderPage(pageKey);
  propagateShareCode();
})();`,
  `  if (!initEditor(pageKey)) renderPage(pageKey);
  propagateShareCode();

  /* ---------- hash 路由（单文件模式） ---------- */
  var PAGES = ['home', 'overseas', 'insight'];
  function parseHash() {
    var raw = (location.hash || '').replace(/^#\\/?/, '');
    var sec = '';
    var hi = raw.indexOf('#');
    if (hi >= 0) { sec = raw.slice(hi + 1); raw = raw.slice(0, hi); }
    var pg = raw || 'home';
    if (PAGES.indexOf(pg) < 0) pg = 'home';
    return { page: pg, section: sec };
  }
  window.addEventListener('hashchange', function () {
    var h = parseHash();
    if (h.page !== pageKey) {
      pageKey = h.page;
      document.body.setAttribute('data-page', h.page);
      renderPage(h.page);
    }
    if (h.section) {
      var target = document.querySelector('.page[data-for="' + h.page + '"] #' + h.section);
      if (target) setTimeout(function () { target.scrollIntoView({ behavior: 'smooth' }); }, 60);
    } else {
      window.scrollTo(0, 0);
    }
  });
})();`
);

/* 三页外壳：把每个 HTML 的 body 内联进一个模板，用 JS 切换 */
function shell(pageKey, title, desc) {
  return `
<div class="page" data-for="${pageKey}"${pageKey === 'home' ? '' : ' hidden'}>
  <nav class="nav" id="nav-${pageKey}"></nav>
  <main id="main-${pageKey}"></main>
  <footer class="footer" id="footer-${pageKey}"></footer>
</div>`;
}

/* 渲染引擎改造：按 page 找对应容器 */
appJs = appJs.replace(
  `  function renderPage(pageKey) {
    var page = (D.pages || {})[pageKey];
    if (!page) return;`,
  `  function renderPage(pageKey) {
    var page = (D.pages || {})[pageKey];
    if (!page) return;
    var scoped = document.querySelector('.page[data-for="' + pageKey + '"]');
    if (!scoped) scoped = document.body;`
);
appJs = appJs.replace(
  `    var nav = document.getElementById('nav');
    if (nav) {`,
  `    var nav = scoped.querySelector('.nav');
    if (nav) {`
);
appJs = appJs.replace(
  `    var main = document.getElementById('main');
    if (main) {`,
  `    var main = scoped.querySelector('main');
    if (main) {`
);
appJs = appJs.replace(
  `    var foot = document.getElementById('footer');
    if (foot && D.footer) {`,
  `    var foot = scoped.querySelector('.footer');
    if (foot && D.footer) {`
);

/* 页面切换时同步显示/隐藏，并把交互绑定限制在当前页容器内 */
appJs = appJs.replace(
  `    initInteractions();
  }`,
  `    /* 单文件模式：切换显示的 page 容器 */
    var all = document.querySelectorAll('.page');
    Array.prototype.forEach.call(all, function (el) {
      el.hidden = (el.getAttribute('data-for') !== pageKey);
    });

    initInteractions(scoped);
  }`
);

/* initInteractions 支持限定容器，避免多页重复绑定 */
appJs = appJs.replace(
  `  function initInteractions() {`,
  `  function initInteractions(scope) {
    var q = function (sel) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
    var q1 = function (sel) { return (scope || document).querySelector(sel); };`
);
appJs = appJs.replace(
  `    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');`,
  `    var navToggle = q1('#navToggle');
    var navLinks = q1('#navLinks');`
);
appJs = appJs.replace(
  `    Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {`,
  `    q('.faq__q').forEach(function (btn) {`
);
appJs = appJs.replace(
  `    Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (bar) {`,
  `    q('.tabs').forEach(function (bar) {`
);
appJs = appJs.replace(
  `      var panels = group ? document.querySelectorAll('.tab-panel[data-group="' + group + '"]') : [];
      Array.prototype.forEach.call(btns, function (btn) {`,
  `      var panels = group ? q('.tab-panel[data-group="' + group + '"]') : [];
      btns.forEach(function (btn) {`
);
appJs = appJs.replace(
  `    observeReveal();
    observeBars();
    observeNav();`,
  `    observeReveal(scope);
    observeBars(scope);
    observeNav(scope);`
);
appJs = appJs.replace(
  `  function observeReveal() {
    var els = document.querySelectorAll('.reveal:not(.is-in)');`,
  `  function observeReveal(scope) {
    var els = Array.prototype.slice.call((scope || document).querySelectorAll('.reveal:not(.is-in)'));`
);
appJs = appJs.replace(
  `  function observeBars() {
    var fills = document.querySelectorAll('.bar__fill');`,
  `  function observeBars(scope) {
    var fills = Array.prototype.slice.call((scope || document).querySelectorAll('.bar__fill'));`
);
appJs = appJs.replace(
  `  function observeNav() {
    var links = document.querySelectorAll('[data-nav]');`,
  `  function observeNav(scope) {
    var links = Array.prototype.slice.call((scope || document).querySelectorAll('[data-nav]'));`
);
appJs = appJs.replace(
  `    var sections = Array.prototype.map.call(links, function (a) {`,
  `    var sections = links.map(function (a) {`
);
appJs = appJs.replace(
  `      var href = a.getAttribute('data-nav');
      if (href.indexOf('#') !== 0) return null;
      return document.querySelector(href);
    }).filter(Boolean);`,
  `      var href = a.getAttribute('data-nav');
      if (href.indexOf('#') !== 0) return null;
      return (scope || document).querySelector(href);
    }).filter(Boolean);`
);
appJs = appJs.replace(
  `      Array.prototype.forEach.call(links, function (a) {
        var h = a.getAttribute('data-nav');`,
  `      links.forEach(function (a) {
        var h = a.getAttribute('data-nav');`
);

/* 导航链接：单文件模式下带上当前页前缀，形如 #/home#delivery */
appJs = appJs.replace(
  `            (page.nav || []).map(function (n) {
              return '<a href="' + esc(n.href) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
            }).join('') +`,
  `            (page.nav || []).map(function (n) {
              return '<a href="#/' + esc(pageKey) + '#' + esc(n.href.replace(/^#/, '')) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
            }).join('') +`
);

/* 页脚跨页链接 */
appJs = appJs.replace(
  `                return it.href ? '<a href="' + esc(it.href) + '">' + esc(it.text) + '</a>' : '<span>' + esc(it.text) + '</span>';`,
  `                return it.href ? '<a href="#/' + esc(it.href.replace(/[^a-z0-9-]/gi, '')) + '">' + esc(it.text) + '</a>' : '<span>' + esc(it.text) + '</span>';`
);

/* 顶部 CTA */
appJs = appJs.replace(
  `          '<a class="nav__cta" href="index.html#contact">' + esc(D.meta.ctaLabel || '获取方案') + '</a>' +`,
  `          '<a class="nav__cta" href="#/' + esc(pageKey) + '#contact">' + esc(D.meta.ctaLabel || '获取方案') + '</a>' +`
);

/* logo 链接：单文件模式下回到首页 */
appJs = appJs.replace(
  `          '<a class="nav__logo" href="index.html"><img src=`,
  `          '<a class="nav__logo" href="#/home"><img src=`
);

/* 重置编辑时回到当前页而不是根路径 */
appJs = appJs.replace(
  `      location.href = location.pathname;`,
  `      location.href = location.pathname + '#/' + pageKey;`
);

/* 内容里的跨页链接（.html）转 hash */
contentJs = contentJs.replace(/'index\.html#contact'/g, "'#/contact'");
contentJs = contentJs.replace(/'overseas\.html'/g, "'#/overseas'");
contentJs = contentJs.replace(/'insight\.html'/g, "'#/insight'");
contentJs = contentJs.replace(/href: 'index\.html'/g, "href: '#/home'");

/* ---- 组装单文件 ---- */
const pages = [
  { key: 'home', title: '国内 GEO 解决方案' },
  { key: 'overseas', title: '海外 GEO 解决方案' },
  { key: 'insight', title: 'AI 用户意图洞察' }
];

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>京东科技 GEO 生成式引擎优化</title>
<meta name="description" content="京东科技企业级生成式引擎优化（GEO）解决方案：覆盖豆包、千问、DeepSeek、元宝等主流 AI 场景，提供 AI 认知体检、意图问题库、AIGC 内容与信源策略、采信提权、监测复盘的全链路交付。">
<meta name="theme-color" content="#E1251B">
<meta property="og:type" content="website">
<meta property="og:title" content="京东科技 GEO 生成式引擎优化">
<meta property="og:description" content="驾驭 AI 时代，赢得未来流量。企业级生成式引擎优化（GEO）全链路解决方案。">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%23E1251B'/%3E%3Ctext x='16' y='23' font-size='19' font-family='sans-serif' font-weight='bold' fill='white' text-anchor='middle'%3EG%3C/text%3E%3C/svg%3E">
<style>
${css}
</style>
</head>
<body data-page="home">
${pages.map(p => shell(p.key)).join('\n')}
<script>
${contentJs}
</script>
<script>
${appJs}
</script>
</body>
</html>
`;

const outFile = path.join(OUT, '京东科技GEO解决方案.html');
fs.writeFileSync(outFile, html, 'utf8');
console.log('已生成单文件版：');
console.log('  ' + outFile);
console.log('  大小 ' + (fs.statSync(outFile).size / 1024 / 1024).toFixed(2) + ' MB');
