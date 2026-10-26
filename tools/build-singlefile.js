#!/usr/bin/env node
/* ============================================================
   把三页站点打包成单个自包含 HTML 文件
   · CSS / JS 内联，图片转 base64 data URI
   · 中英文两套内容都内联，语言切换无需联网
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
  const ext = path.extname(rel).toLowerCase();
  return `data:${imgExt[ext] || 'application/octet-stream'};base64,` + readBin(rel).toString('base64');
};

/* ---- CSS 内联 ---- */
const css = read('assets/css/main.css');

/* ---- 图片池：两份内容共用同一份 base64，避免重复内联 ---- */
const IMG_POOL = {};
function poolImage(rel) {
  if (!IMG_POOL[rel]) IMG_POOL[rel] = dataUri(rel);
  return IMG_POOL[rel];
}

/* ---- 内容文件：图片路径改为引用图片池 + 跨页链接转 hash ---- */
function prepContent(rel) {
  let s = read(rel);
  const imgRefs = [...new Set([...s.matchAll(/["'](assets\/img\/[^"']+)["']/g)].map(m => m[1]))];
  imgRefs.forEach(r => {
    poolImage(r);
    /* 图片路径 → window.__IMG["assets/img/x.jpg"]，同时兼容单双引号数据文件 */
    s = s.split(`'${r}'`).join(`window.__IMG[${JSON.stringify(r)}]`);
    s = s.split(`"${r}"`).join(`window.__IMG[${JSON.stringify(r)}]`);
  });
  /* 跨页链接转 hash 路由 */
  const routes = {
    'index.html#contact': '#/home#contact',
    'index.html': '#/home',
    'overseas.html': '#/overseas',
    'insight.html': '#/insight',
    'pharma.html': '#/pharma',
    'insurance.html': '#/insurance',
    'tourism.html': '#/tourism'
  };
  Object.keys(routes).forEach(href => {
    s = s.split(`'${href}'`).join(`'${routes[href]}'`);
    s = s.split(`"${href}"`).join(`"${routes[href]}"`);
  });
  return s;
}

const contentZh = prepContent('assets/data/content.js');
const contentEn = prepContent('assets/data/content.en.js');

/* ---- app.js：加 hash 路由 ---- */
let appJs = read('assets/js/app.js');

/* app.js 里的 logo 路径也换成 data URI */
appJs = appJs.split('"assets/img/logo-jd.png"').join(`"${dataUri('assets/img/logo-jd.png')}"`);
appJs = appJs.split("'assets/img/logo-jd.png'").join(`'${dataUri('assets/img/logo-jd.png')}'`);

/* 把「按 body 属性取页面」改成「按 hash 取页面」 */
appJs = appJs.replace(
  /var pageKey = document\.body\.getAttribute\('data-page'\) \|\| 'home';/,
  `var __initialHash = (location.hash || '').replace(/^#\\/?/, '');
  var __initialSection = '';
  var __initialSectionPos = __initialHash.indexOf('#');
  if (__initialSectionPos >= 0) {
    __initialSection = __initialHash.slice(__initialSectionPos + 1);
    __initialHash = __initialHash.slice(0, __initialSectionPos);
  }
  var pageKey = __initialHash || 'home';
  if (!['home', 'overseas', 'insight', 'pharma', 'insurance', 'tourism'].includes(pageKey)) pageKey = 'home';
  document.body.setAttribute('data-page', pageKey);`
);

/* 路由切换：切页时重绘当前页
   注意：必须注入到 app.js 主 IIFE 内部，否则拿不到 pageKey / renderPage
   hash 形如 #/overseas（切页）或 #/overseas#delivery（切页+滚动到区块）*/
appJs = appJs.replace(
  `  curLang = detectLang();
  loadLangData(curLang, function (data) {
    if (data) { D = data; window.SITE_DATA = D; }
    applyLangToDoc(curLang);
    if (!initEditor(pageKey)) renderPage(pageKey);
    propagateShareCode();
  });
})();`,
  `  curLang = detectLang();
  loadLangData(curLang, function (data) {
    if (data) { D = data; window.SITE_DATA = D; }
    applyLangToDoc(curLang);
    if (!initEditor(pageKey)) renderPage(pageKey);
    propagateShareCode();
    if (__initialSection) {
      setTimeout(function () {
        var initialTarget = document.querySelector('.page[data-for="' + pageKey + '"] #' + __initialSection);
        if (initialTarget) initialTarget.scrollIntoView();
      }, 60);
    }
  });

  /* ---------- hash 路由（单文件模式） ---------- */
  var PAGES = ['home', 'overseas', 'insight', 'pharma', 'insurance', 'tourism'];
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
      if (target) setTimeout(function () { target.scrollIntoView(); }, 60);
    } else {
      window.scrollTo(0, 0);
    }
  });
})();`
);

/* 三页外壳：把每个 HTML 的 body 内联进一个模板，用 JS 切换 */
function shell(pageKey) {
  return `
<div class="page" data-for="${pageKey}"${pageKey === 'home' ? '' : ' hidden'}>
  <nav class="nav"></nav>
  <main></main>
  <footer class="footer"></footer>
</div>`;
}

/* 渲染引擎改造：按 page 找对应容器，并记录当前作用域 */
appJs = appJs.replace(
  `  function renderPage(pageKey) {
    var page = (D.pages || {})[pageKey];
    if (!page) return;`,
  `  function renderPage(pageKey) {
    var page = (D.pages || {})[pageKey];
    if (!page) return;
    var scoped = document.querySelector('.page[data-for="' + pageKey + '"]');
    if (!scoped) scoped = document.body;
    PAGE_SCOPE = scoped;`
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

/* 页面切换时同步显示/隐藏 */
appJs = appJs.replace(
  `    initInteractions();
  }`,
  `    var all = document.querySelectorAll('.page');
    Array.prototype.forEach.call(all, function (el) {
      el.hidden = (el.getAttribute('data-for') !== pageKey);
    });

    initInteractions(scoped);
  }`
);

/* 导航链接：单文件模式下带上当前页前缀，形如 #/home#delivery */
appJs = appJs.replace(
  `            (page.nav || []).map(function (n) {
              return '<a href="' + esc(n.href) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
            }).join('') +`,
  `            (page.nav || []).map(function (n) {
              var href = /\\.html$/i.test(n.href)
                ? '#/' + n.href.replace(/\\.html$/i, '')
                : '#/' + pageKey + '#' + n.href.replace(/^#/, '');
              return '<a href="' + esc(href) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
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
  `      location.href = location.pathname + location.search;`,
  `      location.href = location.pathname + '#/' + pageKey;`
);

/* 单文件模式下不改写 URL（避免 file:// 地址被加上查询参数） */
appJs = appJs.replace(
  `  function syncLangUrl(lang) {
    try {`,
  `  function syncLangUrl(lang) {
    if (location.protocol === 'file:') return;
    try {`
);

/* ---- 组装单文件 ---- */
const pages = ['home', 'overseas', 'insight', 'pharma', 'insurance', 'tourism'];

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>京东科技 GEO 生成式引擎优化</title>
<meta name="description" data-zh="京东科技企业级生成式引擎优化（GEO）解决方案：覆盖豆包、千问、DeepSeek、元宝等主流 AI 场景，提供 AI 认知体检、意图问题库、AIGC 内容与信源策略、采信提权、监测复盘的全链路交付。" data-en="JD Technology enterprise-grade Generative Engine Optimization (GEO): covering Doubao, Qwen, DeepSeek, Yuanbao and other leading AI scenarios, with end-to-end delivery across AI perception audits, intent question banks, AIGC content and source strategy, citation boosting, and monitoring and review." content="京东科技企业级生成式引擎优化（GEO）解决方案：覆盖豆包、千问、DeepSeek、元宝等主流 AI 场景，提供 AI 认知体检、意图问题库、AIGC 内容与信源策略、采信提权、监测复盘的全链路交付。">
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
${pages.map(p => shell(p)).join('\n')}
<script>
window.__IMG = ${JSON.stringify(IMG_POOL, null, 0)};
</script>
<script>
${contentZh}
</script>
<script>
${contentEn}
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
