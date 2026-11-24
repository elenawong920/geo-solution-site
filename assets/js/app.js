/* ============================================================
   京东科技 GEO 产品介绍站 · 渲染引擎
   所有页面内容由 assets/data/content.js 提供，修改数据文件即可更新站点
   路径体系：sections.N.blocks.M.items.K.field —— 可精确定位到内容树
   ============================================================ */
(function () {
  'use strict';

  var D = window.SITE_DATA || (window.SITE_DATA = {});
  /* 中文数据单独留一份引用：切到英文时 window.SITE_DATA 会被英文覆盖，
     没有这份引用就切不回中文了 */
  var DATA_ZH = D;
  var uidCounter = 0;
  /* 单文件模式下当前页容器（多文件版本为 null，即整页） */
  var PAGE_SCOPE = null;
  function currentScope() { return PAGE_SCOPE || document; }

  /* ---------- 多语言：中文（已内联）/ 英文（按需懒加载） ---------- */
  var LANGS = {
    zh: { file: 'assets/data/content.js', global: 'SITE_DATA', htmlLang: 'zh-CN', label: '中', full: '中文' },
    en: { file: 'assets/data/content.en.js', global: 'SITE_DATA_EN', htmlLang: 'en', label: 'EN', full: 'English' }
  };
  var LANG_KEY = 'geo-lang';
  var curLang = 'zh';

  function detectLang() {
    /* 1. URL 参数优先（便于把英文链接直接发给客户） */
    try {
      var q = new URLSearchParams(location.search).get('lang');
      if (q && LANGS[q]) return q;
    } catch (e) {}
    /* 2. 上次选择 */
    try {
      var saved = localStorage.getItem(LANG_KEY);
      if (saved && LANGS[saved]) return saved;
    } catch (e) {}
    /* 3. 浏览器语言 */
    var nav = (navigator.language || 'zh').toLowerCase();
    if (nav.indexOf('zh') !== 0 && nav.indexOf('en') === 0) return 'en';
    return 'zh';
  }

  /* 懒加载某语言的数据文件；中文已在 HTML 中内联，无需再取 */
  function loadLangData(lang, cb) {
    if (lang === 'zh') { cb(DATA_ZH); return; }
    if (window.SITE_DATA_EN) { cb(window.SITE_DATA_EN); return; }
    var s = document.createElement('script');
    s.src = LANGS.en.file + '?v=20261118';
    s.onload = function () { cb(window.SITE_DATA_EN); };
    s.onerror = function () { cb(DATA_ZH); };
    document.head.appendChild(s);
  }

  /* 切换语言前记录界面状态，切换后原样恢复 */
  function captureUIState() {
    var root = currentScope();
    var st = { tabs: [], faq: [], scrollY: window.scrollY, hash: location.hash };
    /* 用「第几个 tabs 组件」做键，而不是 data-group —— 后者每次渲染都会重新生成 */
    Array.prototype.forEach.call(root.querySelectorAll('.tabs'), function (bar) {
      var btns = bar.querySelectorAll('.tabs__btn');
      var act = bar.querySelector('.tabs__btn.is-active');
      st.tabs.push(act ? Array.prototype.indexOf.call(btns, act) : 0);
    });
    var faqItems = root.querySelectorAll('.faq__item');
    Array.prototype.forEach.call(faqItems, function (item, i) {
      if (item.querySelector('.faq__q.is-open')) st.faq.push(i);
    });
    return st;
  }

  function restoreUIState(st) {
    if (!st) return;
    var root = currentScope();
    /* 恢复选中的 tab */
    Array.prototype.forEach.call(root.querySelectorAll('.tabs'), function (bar, i) {
      var idx = (st.tabs || [])[i];
      if (idx == null) return;
      var btns = bar.querySelectorAll('.tabs__btn');
      if (btns[idx]) btns[idx].click();
    });
    /* 恢复展开的 FAQ */
    var items = root.querySelectorAll('.faq__item');
    (st.faq || []).forEach(function (i) {
      var item = items[i];
      if (item) {
        var q = item.querySelector('.faq__q');
        if (q && !q.classList.contains('is-open')) q.click();
      }
    });
    /* 恢复滚动位置与锚点：只处理页内 #section，不把单文件 #/page 路由当选择器 */
    if (st.hash && /^#[A-Za-z][\w-]*$/.test(st.hash)) {
      var t = root.querySelector(st.hash);
      if (t) { t.scrollIntoView(); return; }
    }
    window.scrollTo(0, st.scrollY || 0);
  }

  function applyLangToDoc(lang) {
    document.documentElement.setAttribute('lang', LANGS[lang].htmlLang);
    var meta = document.querySelector('meta[name="description"]');
    if (meta && meta.getAttribute('data-zh')) {
      meta.setAttribute('content', lang === 'en' ? meta.getAttribute('data-en') : meta.getAttribute('data-zh'));
    }
  }

  function syncLangUrl(lang) {
    try {
      var u = new URL(location.href);
      if (lang === 'en') u.searchParams.set('lang', 'en');
      else u.searchParams.delete('lang');
      history.replaceState(null, '', u.toString());
    } catch (e) {}
  }

  function switchLang(lang, cb) {
    if (!LANGS[lang] || lang === curLang) { if (cb) cb(); return; }
    var st = captureUIState();
    loadLangData(lang, function (data) {
      curLang = lang;
      D = data || D;
      window.SITE_DATA = D;
      try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
      syncLangUrl(lang);
      applyLangToDoc(lang);
      renderPage(currentPageKey());
      propagateShareCode();
      restoreUIState(st);
      if (cb) cb();
    });
  }
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* 编辑模式：带 data-edit 的节点可被编辑，路径用于回写数据 */
  var ED = { on: false, overrides: {} };

  function t(path, val) {
    if (val == null) return '';
    /* 兜底：内容项若误传对象，取其中的文本字段，绝不输出 [object Object] */
    if (typeof val === 'object' && !Array.isArray(val)) {
      var field = ['text', 'label', 'title', 'desc', 'value', 'name'].filter(function (k) {
        return typeof val[k] === 'string';
      })[0];
      if (!field) return '';
      path = path + '.' + field;
      val = val[field];
    }
    if (!ED.on) return esc(val);
    return '<span data-edit="' + esc(path) + '" contenteditable="true">' + esc(val) + '</span>';
  }

  /* 富文本：把白名单里的行内标签原样保留，其余内容一律转义。
     —— 内容里写的 <b>分类名</b> 要真正加粗，而不是把标签当文字显示出来。
     实现上先把标签抠出来、普通文本转义后再拼回去，因此无需「反转义」，
     也天然挡住了 <script> 与带属性的标签（如 <b onclick=...>）。
     编辑模式下用 data-raw 保存原文，回写时按原文写回，不会丢标签。 */
  var RICH_TAGS = ['b', 'strong', 'em', 'i', 'br', 'span'];
  var RICH_RE = new RegExp('<\\/?(?:' + RICH_TAGS.join('|') + ')\\s*>', 'gi');

  function rich(path, val) {
    if (val == null) return '';
    if (typeof val === 'object' && !Array.isArray(val)) return t(path, val);
    var raw = String(val);
    var out = '';
    var last = 0;
    raw.replace(RICH_RE, function (m, offset) {
      out += esc(raw.slice(last, offset));
      out += m;
      last = offset + m.length;
      return m;
    });
    out += esc(raw.slice(last));
    if (!ED.on) return out;
    return '<span data-edit="' + esc(path) + '" data-raw="' + esc(raw) + '" contenteditable="true">' + out + '</span>';
  }

  /* 去掉富文本原文里的标签，用于判断用户是否真的改动了这段文字 */
  function stripTags(s) {
    return String(s == null ? '' : s).replace(/<\/?[a-zA-Z][^>]*>/g, '');
  }

  /* ---------- 区块渲染器：每个函数接收 (block, pathPrefix) ---------- */
  var R = {};

  R.hero = function (b, p) {
    var h = '';
    var demo = b.demo && b.demo.q ? b.demo : null;
    h += '<section class="hero"><canvas class="hero__fx" aria-hidden="true"></canvas><div class="hero__grid"></div>' +
         '<div class="container hero__inner' + (demo ? ' hero__inner--demo' : '') + '"><div class="hero__copy">';
    if (b.kicker) h += '<div class="eyebrow">' + t(p + '.kicker', b.kicker) + '</div>';
    h += '<h1 class="hero__title">' + (b.title || []).map(function (line, i) {
      var isAccent = (b.accentLines || []).indexOf(i) >= 0;
      return '<span' + (isAccent ? ' class="accent"' : '') + '>' + t(p + '.title.' + i, line) + '</span>';
    }).join('') + '</h1>';
    if (b.desc) h += '<p class="hero__desc">' + t(p + '.desc', b.desc) + '</p>';
    if (b.sub) h += '<p class="hero__sub">' + t(p + '.sub', b.sub) + '</p>';
    if (b.buttons && b.buttons.length) {
      h += '<div class="btn-row">';
      b.buttons.forEach(function (bt, i) {
        var cls = 'btn ' + (bt.style === 'ghost' ? 'btn--ghost' : 'btn--primary');
        var label = t(p + '.buttons.' + i + '.label', bt.label);
        /* action:"menu" 的按钮直接展开导航里的解决方案面板 */
        if (bt.action === 'menu') {
          h += '<button type="button" class="' + cls + '" data-open-menu>' + label + '</button>';
        } else {
          h += '<a class="' + cls + '" href="' + esc(bt.href || '#') + '">' + label + '</a>';
        }
      });
      h += '</div>';
    }
    h += '</div>';
    if (demo) h += heroDemo(demo, p + '.demo');
    if (b.meta && b.meta.length) {
      h += '<div class="hero__meta">';
      b.meta.forEach(function (m, i) {
        h += '<div class="hero__meta-item"><b>' + t(p + '.meta.' + i + '.value', m.value) + '</b>' + t(p + '.meta.' + i + '.label', m.label) + '</div>';
      });
      h += '</div>';
    }
    h += '</div></section>';
    return h;
  };

  /* 首屏右侧「AI 回答示意」面板：问题 → 推荐清单 → 引用信源 → 指标，逐步出现 */
  function heroDemo(d, p) {
    var h = '<div class="demo" data-demo>' +
      '<div class="demo__bar"><span class="demo__dots"><i></i><i></i><i></i></span>' +
        '<span>' + t(p + '.title', d.title) + '</span><span class="demo__live">LIVE</span></div>' +
      '<div class="demo__body">' +
        '<div class="demo__q" data-step' + (ED.on ? '' : ' data-type') + '>' + t(p + '.q', d.q) + '</div>' +
        '<div class="demo__a"><span class="demo__avatar" data-step aria-hidden="true">AI</span><div class="demo__main">';
    if (d.lead) h += '<p class="demo__lead" data-step>' + t(p + '.lead', d.lead) + '</p>';
    h += '<ul class="demo__picks">';
    (d.picks || []).forEach(function (it, i) {
      var base = p + '.picks.' + i;
      h += '<li class="demo__pick' + (it.badge ? ' demo__pick--top' : '') + '" data-step>' +
        '<div class="demo__pickname">' + t(base + '.name', it.name) +
          (it.badge ? '<span class="demo__badge">' + t(base + '.badge', it.badge) + '</span>' : '') + '</div>' +
        (it.text ? '<div class="demo__picktext">' + t(base + '.text', it.text) + '</div>' : '') + '</li>';
    });
    h += '</ul>';
    if (d.sources && d.sources.length) {
      h += '<div class="demo__src" data-step>' + t(p + '.srcLabel', d.srcLabel || '') +
        d.sources.map(function (x, i) { return '<span>' + t(p + '.sources.' + i, x) + '</span>'; }).join('') + '</div>';
    }
    h += '</div></div></div>';
    if (d.stats && d.stats.length) {
      h += '<div class="demo__stats" data-step>';
      d.stats.forEach(function (x, i) {
        h += '<div class="demo__stat"><b>' + t(p + '.stats.' + i + '.value', x.value) + '</b>' + t(p + '.stats.' + i + '.label', x.label) + '</div>';
      });
      h += '</div>';
    }
    if (d.foot) h += '<div class="demo__foot">' + t(p + '.foot', d.foot) + '</div>';
    return h + '</div>';
  }

  /* 指标值不是数字（如平台名、「执行中」）时换成正文字体，避免大号数字体排中文 */
  function metricCls(v) {
    return /^[\s+\-−≥≤]*\d/.test(String(v == null ? '' : v)) ? 'metric__value' : 'metric__value metric__value--text';
  }

  R.secHead = function (b, p) {
    var h = '<div class="sec-head' + (b.center ? ' sec-head--center' : '') + ' reveal">';
    if (b.kicker) h += '<div class="eyebrow">' + t(p + '.kicker', b.kicker) + '</div>';
    /* 「A → B → C」形式的标题渲染成流程节点（编辑模式保持整段文本，便于回写） */
    var parts = typeof b.title === 'string' && !ED.on && !/[：:]/.test(b.title) ? b.title.split(/\s*→\s*/) : [];
    if (parts.length >= 3) {
      h += '<h2 class="h2 h2--pipe">' + parts.map(function (x) {
        return '<span class="pipe__node">' + esc(x) + '</span>';
      }).join('<i class="pipe__arrow" aria-hidden="true"></i>') + '</h2>';
    } else if (b.title) h += '<h2 class="h2">' + t(p + '.title', b.title) + '</h2>';
    if (b.desc) h += '<p class="lede">' + t(p + '.desc', b.desc) + '</p>';
    h += '</div>';
    return h;
  };

  R.stats = function (b, p) {
    var h = '<div class="statgrid' + (b.cols === 2 ? ' statgrid--2' : b.cols === 3 ? ' statgrid--3' : '') + ' reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="stat"><div class="stat__num">' + t(p + '.items.' + i + '.value', it.value) + '</div>' +
           '<div class="stat__label">' + t(p + '.items.' + i + '.label', it.label) + '</div></div>';
    });
    return h + '</div>';
  };

  R.eras = function (b, p) {
    var h = '<div class="eras reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="era' + (it.now ? ' era--now' : '') + '">' +
           '<div class="era__kicker">' + t(p + '.items.' + i + '.kicker', it.kicker) + '</div>' +
           '<div class="era__title">' + t(p + '.items.' + i + '.title', it.title) + '</div>' +
           '<p class="era__desc">' + t(p + '.items.' + i + '.desc', it.desc) + '</p></div>';
    });
    return h + '</div>';
  };

  R.cards = function (b, p) {
    var h = '<div class="cards' + (b.cols === 2 ? ' cards--2' : b.cols === 3 ? ' cards--3' : b.cols === 4 ? ' cards--4' : b.cols === 5 ? ' cards--5' : '') + ' reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="card' + (it.accent ? ' card--accent' : '') + '">';
      if (it.no) h += '<div class="card__no">' + t(p + '.items.' + i + '.no', it.no) + '</div>';
      if (it.title) h += '<h3 class="card__title">' + t(p + '.items.' + i + '.title', it.title) + '</h3>';
      if (it.desc) h += '<p class="card__desc">' + t(p + '.items.' + i + '.desc', it.desc) + '</p>';
      if (it.list && it.list.length) {
        h += '<ul class="card__list">';
        it.list.forEach(function (li, j) { h += '<li>' + t(p + '.items.' + i + '.list.' + j, li) + '</li>'; });
        h += '</ul>';
      }
      h += '</div>';
    });
    return h + '</div>';
  };

  R.compare = function (b, p) {
    var h = '<div class="compare reveal">';
    h += '<div class="compare__cell compare__cell--head"></div>';
    h += '<div class="compare__cell compare__cell--head is-seo">' + t(p + '.head.0', (b.head || [])[0] || '') + '</div>';
    h += '<div class="compare__cell compare__cell--head is-geo">' + t(p + '.head.1', (b.head || [])[1] || '') + '</div>';
    (b.rows || []).forEach(function (r, i) {
      h += '<div class="compare__cell compare__cell--key">' + t(p + '.rows.' + i + '.0', r[0]) + '</div>';
      h += '<div class="compare__cell">' + t(p + '.rows.' + i + '.1', r[1]) + '</div>';
      h += '<div class="compare__cell compare__cell--geo">' + t(p + '.rows.' + i + '.2', r[2]) + '</div>';
    });
    return h + '</div>';
  };

  R.table = function (b, p) {
    var wrapCls = 'table-wrap reveal' + (b.stack ? ' table-wrap--stack' : '');
    /* 三列及以上的表格在手机上改成「一行一张卡」，不需要左右滑动 */
    var stack = b.stack || (b.head || []).length >= 3;
    var tblCls = 'table' + (stack ? ' table--stack' : '');
    var h = '<div class="' + wrapCls + '"><table class="' + tblCls + '"><thead><tr>';
    (b.head || []).forEach(function (c, i) { h += '<th>' + t(p + '.head.' + i, c) + '</th>'; });
    h += '</tr></thead><tbody>';
    (b.rows || []).forEach(function (r, i) {
      var hl = (b.highlight || []).indexOf(i) >= 0 ? ' class="hl"' : '';
      h += '<tr' + hl + '>';
      r.forEach(function (c, j) {
        /* 窄屏堆叠时用表头做小标签 */
        var lb = ' data-label="' + esc(stripTags((b.head || [])[j] || '')) + '"';
        var tdCls = (b.numCols && b.numCols.indexOf(j) >= 0 ? 'num' : '') + (/^\+\d/.test(String(c)) ? ' up' : '');
        h += '<td' + (tdCls ? ' class="' + tdCls.replace(/^ /, '') + '"' : '') + lb + '>' + t(p + '.rows.' + i + '.' + j, c) + '</td>';
      });
      h += '</tr>';
    });
    h += '</tbody></table></div>';
    if (b.note) h += '<p class="bar__note" style="margin-top:12px">' + t(p + '.note', b.note) + '</p>';
    return h;
  };

  R.flow = function (b, p) {
    var h = '<div class="flow reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="flow__step"><div class="flow__no">' + t(p + '.items.' + i + '.no', it.no) + '</div>' +
           '<div class="flow__title">' + t(p + '.items.' + i + '.title', it.title) + '</div>' +
           '<p class="flow__desc">' + t(p + '.items.' + i + '.desc', it.desc) + '</p></div>';
    });
    return h + '</div>';
  };

  R.roadmap = R.flow;

  /* 解析带量纲的数值：'3.13 亿' → 3.13e8，'9227 万' → 9.227e7，'72%' → 72 */
  function parseMetric(raw) {
    if (typeof raw === 'number') return { n: raw, pct: false };
    if (raw == null) return { n: NaN, pct: false };
    var s = String(raw).trim();
    var isPct = s.indexOf('%') >= 0;
    var m = s.match(/^([\d.]+)\s*(亿|万|千|[TBMK])?/i);
    if (!m) return { n: NaN, pct: isPct };
    var n = parseFloat(m[1]);
    if (isNaN(n)) return { n: NaN, pct: isPct };
    switch ((m[2] || '').toUpperCase()) {
      case '亿': return { n: n * 1e8, pct: false };
      case '万': return { n: n * 1e4, pct: false };
      case '千': return { n: n * 1e3, pct: false };
      case 'T': return { n: n * 1e12, pct: false };
      case 'B': return { n: n * 1e9, pct: false };
      case 'M': return { n: n * 1e6, pct: false };
      case 'K': return { n: n * 1e3, pct: false };
      default: return { n: n, pct: isPct };
    }
  }

  R.bars = function (b, p) {
    var items = b.items || [];
    var vals = items.map(function (it) { return parseMetric(it.value); });

    /* 标尺规则：
       · 全部为百分比 → 用 max（缺省 100），表示「占整体的比例」
       · 带量纲（亿/万）→ 按组内最大值归一，即原图口径「按 X 归一化」 */
    var allPct = vals.length > 0 && vals.every(function (v) { return v.pct; });
    var denom;
    if (allPct) {
      denom = (b.max != null) ? parseMetric(b.max).n : 100;
    } else {
      var nums = vals.map(function (v) { return v.n; }).filter(function (v) { return !isNaN(v); });
      denom = nums.length ? Math.max.apply(null, nums) : 1;
    }
    if (!denom || isNaN(denom) || denom <= 0) denom = 1;

    var h = '<div class="bars reveal">';
    items.forEach(function (it, i) {
      var v = vals[i].n;
      var pct = isNaN(v) ? 0 : (v / denom) * 100;
      pct = Math.max(0, Math.min(100, pct));
      /* 值为 0 时不保留最小宽度：否则轨道上会留一个小红点，看起来像「有一点点」 */
      var zero = !(v > 0) ? ' style="min-width:0"' : '';
      h += '<div class="bar"><div class="bar__top"><span class="bar__label">' + t(p + '.items.' + i + '.label', it.label) + '</span>' +
           '<span class="bar__val">' + t(p + '.items.' + i + '.value', it.value) + '</span></div>' +
           '<div class="bar__track"><div class="bar__fill"' + zero + ' data-pct="' + pct.toFixed(2) + '"></div></div>';
      if (it.note) h += '<div class="bar__note">' + t(p + '.items.' + i + '.note', it.note) + '</div>';
      h += '</div>';
    });
    h += '</div>';
    if (b.note) h += '<p class="bar__note" style="margin-top:14px">' + t(p + '.note', b.note) + '</p>';
    return h;
  };

  R.checks = function (b, p) {
    var h = '<div class="reveal">';
    if (b.title) h += '<h3 class="h3">' + t(p + '.title', b.title) + '</h3>';
    if (b.desc) h += '<p class="card__desc" style="margin-bottom:16px">' + t(p + '.desc', b.desc) + '</p>';
    h += '<ul class="checks">';
    (b.items || []).forEach(function (it, i) { h += '<li>' + t(p + '.items.' + i, it) + '</li>'; });
    h += '</ul></div>';
    return h;
  };

  R.plats = function (b, p) {
    var h = '<div class="plats reveal">';
    (b.items || []).forEach(function (it, i) {
      /* 词条有两种写法：纯字符串，或 { text, hot } 对象（hot 用于高亮品牌词） */
      var obj = (it !== null && typeof it === 'object');
      var field = obj ? (typeof it.text === 'string' ? 'text' : (typeof it.label === 'string' ? 'label' : '')) : '';
      var text = obj ? (field ? it[field] : '') : it;
      var hot = obj ? !!it.hot : false;
      var path = obj ? p + '.items.' + i + (field ? '.' + field : '') : p + '.items.' + i;
      h += '<span class="plat' + (hot ? ' plat--red' : '') + '">' + t(path, text) + '</span>';
    });
    return h + '</div>';
  };

  R.split = function (b, p) {
    var h = '<div class="split' + (b.wide ? ' split--wide' : '') + ' reveal">';
    h += '<div>' + (b.left ? R[b.left.type](b.left, p + '.left') : '') + '</div>';
    h += '<div>' + (b.right ? R[b.right.type](b.right, p + '.right') : '') + '</div>';
    return h + '</div>';
  };

  R.cases = function (b, p) {
    var h = '<div class="cases reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="case"><div class="case__head">';
      if (it.tag) h += '<span class="case__tag">' + t(p + '.items.' + i + '.tag', it.tag) + '</span>';
      if (it.title) h += '<h3 class="card__title" style="margin-bottom:8px">' + t(p + '.items.' + i + '.title', it.title) + '</h3>';
      if (it.desc) h += '<p class="card__desc">' + t(p + '.items.' + i + '.desc', it.desc) + '</p>';
      h += '</div><div class="case__body">';
      if (it.body) h += t(p + '.items.' + i + '.body', it.body);
      if (it.metrics && it.metrics.length) {
        h += '<div class="case__metrics">';
        it.metrics.forEach(function (m, j) {
          h += '<div class="metric"><div class="metric__label">' + t(p + '.items.' + i + '.metrics.' + j + '.label', m.label) + '</div>' +
               '<div class="' + metricCls(m.value) + '">' + t(p + '.items.' + i + '.metrics.' + j + '.value', m.value) + '</div></div>';
        });
        h += '</div>';
      }
      if (it.foot) h += '<p class="bar__note" style="margin-top:14px">' + t(p + '.items.' + i + '.foot', it.foot) + '</p>';
      h += '</div></div>';
    });
    return h + '</div>';
  };

  /* 行业切换栏：医药健康 / 保险 / 汽车 / B2B …… 新增行业时在数据里加一项即可 */
  R.industryBar = function (b, p) {
    var h = '<div class="indbar"><div class="container indbar__inner">';
    (b.items || []).forEach(function (it, i) {
      var label = t(p + '.items.' + i + '.label', it.label);
      if (it.active) {
        h += '<span class="indbar__item is-active" aria-current="page">' + label + '</span>';
      } else if (it.href) {
        h += '<a class="indbar__item" href="' + esc(it.href) + '">' + label + '</a>';
      } else {
        h += '<span class="indbar__item is-soon">' + label +
             '<em>' + t(p + '.items.' + i + '.note', it.note || '即将上线') + '</em></span>';
      }
    });
    h += '</div></div>';
    return h;
  };

  /* 行业案例详解：痛点 / 方案 / 结果 / 洞察 四段结构 */
  R.caseStudy = function (b, p) {
    var L = b.labels || {};
    var h = '<div class="cs-list reveal">';
    (b.items || []).forEach(function (it, i) {
      var base = p + '.items.' + i;
      h += '<article class="cs">';
      /* 头部 */
      h += '<div class="cs__head">';
      if (it.no) h += '<div class="cs__no">' + t(base + '.no', it.no) + '</div>';
      h += '<div class="cs__headmain">';
      if (it.tag) h += '<span class="cs__tag">' + t(base + '.tag', it.tag) + '</span>';
      if (it.title) h += '<h3 class="cs__title">' + t(base + '.title', it.title) + '</h3>';
      if (it.sub) h += '<p class="cs__sub">' + t(base + '.sub', it.sub) + '</p>';
      h += '</div></div>';
      /* 指标 */
      if (it.metrics && it.metrics.length) {
        h += '<div class="cs__metrics">';
        it.metrics.forEach(function (m, j) {
          h += '<div class="metric"><div class="metric__label">' + t(base + '.metrics.' + j + '.label', m.label) + '</div>' +
               '<div class="' + metricCls(m.value) + '">' + t(base + '.metrics.' + j + '.value', m.value) + '</div></div>';
        });
        h += '</div>';
      }
      /* 三栏：痛点 / 方案 / 结果（缺哪栏就少哪栏） */
      var nCols = (it.pains && it.pains.length ? 1 : 0) + (it.solutions && it.solutions.length ? 1 : 0) + (it.result ? 1 : 0);
      h += '<div class="cs__cols cs__cols--' + (nCols || 1) + '">';
      if (it.pains && it.pains.length) {
        h += '<div class="cs__col cs__col--pain"><h4 class="cs__label">' + esc(L.pains || '行业痛点') + '</h4><ul>';
        it.pains.forEach(function (x, j) { h += '<li>' + t(base + '.pains.' + j, x) + '</li>'; });
        h += '</ul></div>';
      }
      if (it.solutions && it.solutions.length) {
        h += '<div class="cs__col cs__col--sol"><h4 class="cs__label">' + esc(L.solutions || '解决方案') + '</h4><ul>';
        it.solutions.forEach(function (x, j) { h += '<li>' + t(base + '.solutions.' + j, x) + '</li>'; });
        h += '</ul></div>';
      }
      if (it.result) {
        h += '<div class="cs__col cs__col--res"><h4 class="cs__label">' + esc(L.result || '执行结果') + '</h4>' +
             '<p class="cs__result">' + t(base + '.result', it.result) + '</p></div>';
      }
      h += '</div>';
      /* 洞察 / 客户评价 */
      if (it.note) {
        h += '<div class="cs__note"><span class="cs__notelabel">' + esc(L.note || '核心洞察') + '</span>' +
             '<p>' + t(base + '.note', it.note) + '</p></div>';
      }
      if (it.quote && it.quote.text) {
        h += '<blockquote class="cs__quote"><p>' + t(base + '.quote.text', it.quote.text) + '</p>';
        if (it.quote.by) h += '<cite>' + t(base + '.quote.by', it.quote.by) + '</cite>';
        h += '</blockquote>';
      }
      h += '</article>';
    });
    return h + '</div>';
  };

  /* 视频：src 用绝对地址（单文件版不内联 10MB 视频），poster 走图片池 */
  R.video = function (b, p) {
    var h = '<div class="video-wrap reveal">';
    if (b.title) h += '<h3 class="video__title">' + t(p + '.title', b.title) + '</h3>';
    h += '<video class="video" controls playsinline preload="' + esc(b.preload || 'metadata') + '"' +
         (b.poster ? ' poster="' + esc(b.poster) + '"' : '') + '>' +
         '<source src="' + esc(b.src) + '" type="video/mp4">' +
         '您的浏览器不支持内嵌视频，可<a href="' + esc(b.src) + '">下载后观看</a>。</video>';
    if (b.note) h += '<p class="video__note">' + t(p + '.note', b.note) + '</p>';
    return h + '</div>';
  };

  /* 代码块：深底等宽，窄屏内部横向滚动 */
  R.code = function (b, p) {
    var h = '<div class="codeblock reveal">';
    if (b.title) h += '<div class="codeblock__title">' + t(p + '.title', b.title) + '</div>';
    h += '<pre><code>' + t(p + '.code', b.code || '') + '</code></pre></div>';
    return h;
  };

  R.gallery = function (b, p) {
    var cls = '';
    if (b.layout === 'stack') cls = ' gallery--stack';
    else if (b.layout === 'narrow') cls = ' gallery--narrow';
    else if (b.layout === 'duo') cls = ' gallery--duo';
    else if (b.layout === 'phones') cls = ' gallery--phones';
    else if (b.layout === 'quad') cls = ' gallery--quad';
    else if (b.layout === 'trio') cls = ' gallery--trio';
    var h = '<div class="gallery' + cls + ' reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<figure class="shot" style="margin:0"><img src="' + esc(it.src) + '" alt="' + esc(it.alt || '') + '" decoding="async">' +
           '<figcaption class="shot__cap">' + rich(p + '.items.' + i + '.cap', it.cap) + '</figcaption></figure>';
    });
    return h + '</div>';
  };

  R.platforms = function (b, p) {
    var h = '<div class="cards reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="card card--accent"><div class="card__no">' + t(p + '.items.' + i + '.no', it.no) + '</div>';
      h += '<h3 class="card__title">' + t(p + '.items.' + i + '.name', it.name) + '</h3>';
      h += '<p class="card__desc" style="margin-bottom:12px">' + t(p + '.items.' + i + '.role', it.role) + '</p>';
      h += '<div class="bar__note" style="margin-bottom:4px"><b>' + esc(it.handlesLabel || '主要抓手') + '</b></div><ul class="card__list">';
      (it.handles || []).forEach(function (x, j) { h += '<li>' + t(p + '.items.' + i + '.handles.' + j, x) + '</li>'; });
      h += '</ul>';
      h += '<div class="bar__note" style="margin:14px 0 4px"><b>' + esc(it.resultsLabel || '核心结果') + '</b></div><ul class="card__list">';
      (it.results || []).forEach(function (x, j) { h += '<li>' + t(p + '.items.' + i + '.results.' + j, x) + '</li>'; });
      h += '</ul>';
      if (it.goal) h += '<div class="bar__note" style="margin-top:12px">' + esc(it.goalLabel || '优化目标') + '：' + t(p + '.items.' + i + '.goal', it.goal) + '</div>';
      h += '</div>';
    });
    return h + '</div>';
  };

  R.faq = function (b, p) {
    var h = '<div class="faq reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="faq__item"><button class="faq__q" type="button">' + t(p + '.items.' + i + '.q', it.q) + '</button>' +
           '<div class="faq__a"><div class="faq__a-inner">' + t(p + '.items.' + i + '.a', it.a) + '</div></div></div>';
    });
    return h + '</div>';
  };

  R.notice = function (b, p) {
    return '<div class="notice' + (b.tone === 'neutral' ? ' notice--neutral' : '') + ' reveal">' +
      '<div class="notice__icon">' + (b.icon || '※') + '</div><div>' +
      (b.title ? '<b>' + t(p + '.title', b.title) + '</b>　' : '') + t(p + '.desc', b.desc) + '</div></div>';
  };

  R.cta = function (b, p) {
    var h = '<div class="cta reveal"><div class="cta__inner"><div>';
    h += '<h3 class="cta__title">' + t(p + '.title', b.title) + '</h3>';
    h += '<p class="cta__desc">' + t(p + '.desc', b.desc) + '</p></div><div class="btn-row">';
    (b.buttons || []).forEach(function (bt, i) {
      var cls = bt.style === 'ghost' ? 'btn--outline-light' : 'btn--primary';
      h += '<a class="btn ' + cls + '" href="' + esc(bt.href || '#') + '">' + t(p + '.buttons.' + i + '.label', bt.label) + '</a>';
    });
    return h + '</div></div></div>';
  };

  R.tabs = function (b, p) {
    var uid = 't' + (uidCounter++);
    var h = '<div class="tabs reveal" role="tablist" data-group="' + uid + '">';
    (b.items || []).forEach(function (it, i) {
      h += '<button class="tabs__btn' + (i === 0 ? ' is-active' : '') + '" role="tab" data-tab="tab-' + uid + '-' + i + '">' + t(p + '.items.' + i + '.label', it.label) + '</button>';
    });
    h += '</div>';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="tab-panel' + (i === 0 ? ' is-active' : '') + '" id="tab-' + uid + '-' + i + '" data-group="' + uid + '" role="tabpanel">';
      (it.panels || []).forEach(function (panel, j) {
        h += R[panel.type] ? R[panel.type](panel, p + '.items.' + i + '.panels.' + j) : '';
      });
      h += '</div>';
    });
    return h;
  };

  /* ---------- 页面装配 ---------- */
  function renderPage(pageKey) {
    var page = (D.pages || {})[pageKey];
    if (!page) return;

    document.title = (page.title || D.meta.title) + ' · ' + (D.meta.brand || '京东科技');

    /* 导航 */
    var nav = document.getElementById('nav');
    if (nav) {
      nav.innerHTML =
        '<div class="container nav__inner">' +
          '<a class="nav__logo" href="index.html"><img src="assets/img/logo-jd.png" alt="' + esc(D.meta.brand || '京东科技') + '"><span class="nav__tag">GEO</span></a>' +
          '<button class="nav__toggle" id="navToggle" type="button" aria-label="展开导航" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<div class="nav__links" id="navLinks">' +
            (page.nav || []).map(function (n) {
              if (n.menu && n.menu.length) {
                var subs = n.menu.map(function (m) {
                  return '<a href="' + esc(m.href) + '">' + esc(m.label) + '</a>';
                }).join('');
                return '<div class="navmenu" data-menu>' +
                  '<button type="button" class="navmenu__btn" aria-expanded="false" aria-haspopup="true">' +
                    esc(n.label) + '<i class="navmenu__caret" aria-hidden="true"></i></button>' +
                  '<div class="navmenu__panel" role="menu">' + subs + '</div></div>';
              }
              return '<a href="' + esc(n.href) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
            }).join('') +
          '</div>' +
          '<div class="lang" id="langSwitch" role="group" aria-label="Language">' +
            '<button type="button" class="lang__btn' + (curLang === 'zh' ? ' is-active' : '') + '" data-lang="zh">中</button>' +
            '<button type="button" class="lang__btn' + (curLang === 'en' ? ' is-active' : '') + '" data-lang="en">EN</button>' +
          '</div>' +
        '</div>';
    }

    /* 主体 */
    var main = document.getElementById('main');
    if (main) {
      var html = '';
      (page.sections || []).forEach(function (s, si) {
        if (!s.type) return;
        var base = 'sections.' + si;
        if (s.type === 'section') {
          var cls = 'section';
          if (s.tone === 'surface') cls += ' section--surface';
          if (s.tone === 'dark') cls += ' section--dark';
          if (s.tone === 'border') cls += ' section--border';
          if (s.tight) cls += ' section--tight';
          var inner = (s.blocks || []).map(function (b, bi) {
            var fn = R[b.type];
            if (!fn) return '';
            return fn(b, base + '.blocks.' + bi);
          }).join('');
          html += '<section class="' + cls + '"' + (s.id ? ' id="' + esc(s.id) + '"' : '') + '>' +
                  '<div class="container">' + inner + '</div></section>';
        } else {
          var f2 = R[s.type];
          if (f2) html += f2(s, base);
        }
      });
      main.innerHTML = html;
    }

    /* 页脚 */
    var foot = document.getElementById('footer');
    if (foot && D.footer) {
      foot.innerHTML =
        '<div class="container">' +
        '<div class="footer__top"><div class="footer__brand">' +
          '<img src="assets/img/logo-jd.png" alt="' + esc(D.meta.brand || '京东科技') + '">' +
          '<p>' + esc(D.footer.brand) + '</p></div>' +
        '<div class="footer__cols">' +
          (D.footer.cols || []).map(function (c) {
            var cls = 'footer__col' + (c.kind === 'industry' ? ' footer__col--industry' : '');
            return '<div class="' + cls + '"><h4>' + esc(c.title) + '</h4>' +
              '<div class="footer__links">' + (c.items || []).map(function (it) {
                if (!it.href) return '<span>' + esc(it.text) + '</span>';
                /* 站外链接（如京东灵境官网）新开标签，不打断当前方案页 */
                var ext = /^https?:/i.test(it.href) ? ' target="_blank" rel="noopener noreferrer"' : '';
                /* 站外条目标一个箭头，提示会跳出本站 */
                var mark = ext ? ' <span class="footer__ext" aria-hidden="true">\u2197</span>' : '';
                return '<a href="' + esc(it.href) + '"' + ext + '>' + esc(it.text) + mark + '</a>';
              }).join('') + '</div></div>';
          }).join('') +
        '</div></div>' +
        '<div class="footer__bottom"><span>' + esc(D.footer.copy) + '</span>' +
          '<span class="footer__ver">' + esc(D.meta.version) + ' · ' + esc(D.meta.updatedLabel || '更新于') + ' ' + esc(D.meta.updated) + '</span>' +
        '</div></div>';
    }

    buildToc(pageKey);
    initInteractions();
  }

  /* ---------- 交互 ---------- */
  function initInteractions(scope) {
    var q = function (sel) { return Array.prototype.slice.call((scope || document).querySelectorAll(sel)); };
    var q1 = function (sel) { return (scope || document).querySelector(sel); };

    /* 语言切换 */
    var langBox = q1('#langSwitch');
    if (langBox) {
      langBox.addEventListener('click', function (e) {
        var btn = e.target.closest ? e.target.closest('.lang__btn') : null;
        if (!btn) return;
        var lang = btn.getAttribute('data-lang');
        if (!lang || lang === curLang) return;
        btn.classList.add('is-loading');
        switchLang(lang, function () {
          btn.classList.remove('is-loading');
        });
      });
    }

    /* 导航「解决方案」下拉 */
    var menuBtns = q('.navmenu__btn');
    menuBtns.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        var wrap = btn.parentNode;
        var open = !wrap.classList.contains('is-open');
        q('.navmenu').forEach(function (w) { w.classList.remove('is-open'); });
        wrap.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    });
    if (!document.__menuBound) {
      document.__menuBound = true;
      document.addEventListener('click', function (e) {
        /* 点下拉本身或首屏的展开按钮，不收起 */
        var t2 = e.target;
        if (t2 && t2.closest && (t2.closest('.navmenu') || t2.closest('[data-open-menu]'))) return;
        Array.prototype.forEach.call(document.querySelectorAll('.navmenu'), function (w) {
          w.classList.remove('is-open');
          var b = w.querySelector('.navmenu__btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* 移动端导航展开 */
    var navToggle = q1('#navToggle');
    var navLinks = q1('#navLinks');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', function () {
        var open = document.body.classList.toggle('nav-open');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      navLinks.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          document.body.classList.remove('nav-open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    /* FAQ 手风琴 */
    q('.faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var ans = btn.nextElementSibling;
        var open = btn.classList.toggle('is-open');
        ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
      });
    });

    /* Tabs */
    q('.tabs').forEach(function (bar) {
      var btns = bar.querySelectorAll('.tabs__btn');
      var group = bar.getAttribute('data-group');
      var panels = group ? q('.tab-panel[data-group="' + group + '"]') : [];
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          Array.prototype.forEach.call(btns, function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          Array.prototype.forEach.call(panels, function (p) {
            p.classList.toggle('is-active', p.id === target);
          });
          /* 切到新面板时立即给条形图赋值：隐藏面板里的条在 IntersectionObserver
             第一次回调时不可见，不补这一步会出现「切换后条形是空的」 */
          var cur = document.getElementById(target);
          if (cur) {
            Array.prototype.forEach.call(cur.querySelectorAll('.bar__fill'), function (f) {
              f.style.width = f.getAttribute('data-pct') + '%';
            });
          }
          observeReveal(scope);
        });
      });
    });

    observeReveal(scope);
    observeBars(scope);
    observeNav(scope);
    initFx(scope);
  }

  function observeReveal(scope) {
    var els = Array.prototype.slice.call((scope || document).querySelectorAll('.reveal:not(.is-in)'));
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .01 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  function observeBars(scope) {
    var fills = Array.prototype.slice.call((scope || document).querySelectorAll('.bar__fill'));
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(fills, function (f) { f.style.width = f.getAttribute('data-pct') + '%'; });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.style.width = en.target.getAttribute('data-pct') + '%';
          io.unobserve(en.target);
        }
      });
    }, { threshold: .3 });
    Array.prototype.forEach.call(fills, function (f) { io.observe(f); });
  }

  /* ---------- 章节浮标（长页面目录） ---------- */
  function buildToc(pageKey) {
    var old = document.getElementById('toc');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    var page = (D.pages || {})[pageKey];
    if (!page) return;

    /* 单文件版所有页面同时在 DOM 里，同名的 #why 会有多个，必须按当前页容器取 */
    var scopeEl = document.querySelector('.page[data-for="' + pageKey + '"]') || document;

    var items = [];
    (page.sections || []).forEach(function (s) {
      if (!s.id) return;
      var head = null;
      (s.blocks || []).forEach(function (b) {
        if (!head && b.type === 'secHead' && b.kicker) head = b;
      });
      if (!head) return;
      items.push({ id: s.id, label: head.kicker });
    });
    if (items.length < 3) return;          /* 短页面不需要目录 */

    var en = curLang === 'en';
    var rail = items.map(function (it) {
      return '<a class="toc__item" href="#' + esc(it.id) + '" data-sec="' + esc(it.id) + '">' +
        '<span class="toc__label">' + esc(it.label) + '</span><i class="toc__dot"></i></a>';
    }).join('');
    var list = items.map(function (it) {
      return '<a href="#' + esc(it.id) + '" data-sec="' + esc(it.id) + '">' + esc(it.label) + '</a>';
    }).join('');

    var root = document.createElement('nav');
    root.id = 'toc';
    root.className = 'toc';
    root.setAttribute('aria-label', en ? 'Sections' : '章节导航');
    root.innerHTML =
      '<div class="toc__rail">' + rail + '</div>' +
      '<button type="button" class="toc__ball" aria-expanded="false">' + (en ? 'Sections' : '目录') + '</button>' +
      '<div class="toc__sheet"><div class="toc__sheet-title">' + (en ? 'On this page' : '本页目录') + '</div>' + list + '</div>';
    document.body.appendChild(root);

    var ball = root.querySelector('.toc__ball');
    ball.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = root.classList.toggle('is-open');
      ball.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    root.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('[data-sec]') : null;
      if (!a) return;
      e.preventDefault();
      var el = scopeEl.querySelector('#' + a.getAttribute('data-sec'));
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      root.classList.remove('is-open');
      ball.setAttribute('aria-expanded', 'false');
    });

    /* 点空白处收起浮层 */
    if (window.__tocDocClick) document.removeEventListener('click', window.__tocDocClick);
    window.__tocDocClick = function (e) {
      var t = document.getElementById('toc');
      if (t && !t.contains(e.target)) t.classList.remove('is-open');
    };
    document.addEventListener('click', window.__tocDocClick);

    var links = Array.prototype.slice.call(root.querySelectorAll('[data-sec]'));
    var els = items.map(function (it) { return scopeEl.querySelector('#' + it.id); });

    var onScroll = function () {
      var y = window.pageYOffset + 150;
      var cur = items[0].id;
      items.forEach(function (it, i) {
        var el = els[i];
        if (!el) return;
        if (el.getBoundingClientRect().top + window.pageYOffset <= y) cur = it.id;
      });
      links.forEach(function (a) {
        a.classList.toggle('is-active', a.getAttribute('data-sec') === cur);
      });
      root.classList.toggle('is-scrolled', window.pageYOffset > 320);
    };
    /* 重渲染会重新绑定，先摘掉旧的，避免滚动时越挂越多 */
    if (window.__tocScroll) window.removeEventListener('scroll', window.__tocScroll);
    window.__tocScroll = onScroll;
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function observeNav(scope) {
    var root = scope || document;
    var links = Array.prototype.slice.call(root.querySelectorAll('[data-nav]'));
    if (!links.length) return;
    var sections = links.map(function (a) {
      var href = a.getAttribute('data-nav');
      /* 单文件跨页路由形如 #/pharma，不是页内元素 ID，不能传给 querySelector */
      if (!/^#[A-Za-z][\w-]*$/.test(href)) return null;
      return root.querySelector(href);
    }).filter(Boolean);
    if (!sections.length) return;
    var onScroll = function () {
      var y = window.scrollY + 120;
      var cur = null;
      sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
      links.forEach(function (a) {
        var h = a.getAttribute('data-nav');
        a.classList.toggle('is-active', h === '#' + cur);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 路径读写 ---------- */
  function setPath(obj, path, val) {
    var parts = path.split('.');
    var cur = obj;
    for (var i = 0; i < parts.length - 1; i++) {
      if (cur[parts[i]] == null) cur[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {};
      cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = val;
  }

  function getPath(obj, path) {
    return path.split('.').reduce(function (o, k) { return (o == null) ? undefined : o[k]; }, obj);
  }

  /* ---------- 编辑模式 ---------- */
  function initEditor(pageKey) {
    if (!/[?&]edit=1/.test(location.search)) return false;

    ED.on = true;
    document.body.classList.add('editing');

    var storeKey = 'geo-overrides-' + pageKey + '-' + curLang;
    try { ED.overrides = JSON.parse(localStorage.getItem(storeKey) || '{}'); } catch (e) { ED.overrides = {}; }

    /* 应用本机已保存的覆盖 */
    var page = D.pages[pageKey];
    Object.keys(ED.overrides).forEach(function (p) {
      var target = getPath(page, p);
      if (typeof target === 'string') setPath(page, p, ED.overrides[p]);
    });

    renderPage(pageKey);

    var bar = document.createElement('div');
    bar.className = 'edit-bar';
    bar.innerHTML =
      '<span class="edit-hint">编辑模式：点文字即可改，改动存本机浏览器</span>' +
      '<button type="button" id="edExport">导出更新</button>' +
      '<button type="button" id="edReset" class="is-primary">重置</button>';
    document.body.appendChild(bar);

    document.getElementById('edExport').addEventListener('click', function () {
      /* 以页面当前显示内容为准，与已保存的覆盖合并，避免丢失历史改动 */
      var ov = {};
      Array.prototype.forEach.call(document.querySelectorAll('[data-edit]'), function (el) {
        var p = el.getAttribute('data-edit');
        /* 富文本节点用 data-raw 存原文（保留 <b> 等标签）。
           若用户确实改了这段文字，则以用户输入的纯文本为准。 */
        var raw = el.getAttribute('data-raw');
        var v;
        if (raw == null) {
          v = el.textContent;
        } else {
          v = (el.textContent === stripTags(raw)) ? raw : el.textContent;
        }
        if (getPath(page, p) !== v) ov[p] = v;
      });
      var merged = {};
      Object.keys(ED.overrides).forEach(function (k) { merged[k] = ED.overrides[k]; });
      Object.keys(ov).forEach(function (k) { merged[k] = ov[k]; });
      try { localStorage.setItem(storeKey, JSON.stringify(merged)); } catch (e) {}
      var payload = { page: pageKey, lang: curLang, updated: new Date().toISOString().slice(0, 10), overrides: merged };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'geo-update-' + pageKey + '-' + curLang + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      alert('已导出 ' + Object.keys(merged).length + ' 处更新（' + LANGS[curLang].full + '）。\n把这个文件发给我，我就能同步到线上链接。');
    });

    document.getElementById('edReset').addEventListener('click', function () {
      try { localStorage.removeItem(storeKey); } catch (e) {}
      location.href = location.pathname + location.search;
    });

    return true;
  }

  /* ---------- 分享码与语言参数透传 ---------- */
  function propagateShareCode() {
    var code = new URLSearchParams(location.search).get('sharecode');
    var lang = curLang === 'en' ? 'en' : '';
    if (!code && !lang) return;
    var links = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:|javascript:)/.test(href)) return;
      /* 保持 #锚点在最后：page.html#sec?code= 是错的 */
      var hash = '';
      var hi = href.indexOf('#');
      if (hi >= 0) { hash = href.slice(hi); href = href.slice(0, hi); }
      var sep = href.indexOf('?') >= 0 ? '&' : '?';
      var extra = [];
      if (code && href.indexOf('sharecode=') < 0) extra.push('sharecode=' + encodeURIComponent(code));
      if (lang && href.indexOf('lang=') < 0) extra.push('lang=' + lang);
      if (!extra.length) return;
      a.setAttribute('href', href + sep + extra.join('&') + hash);
    });
  }

  /* 图片兜底：锚点直达或弱网时个别图可能没解码，补一次带参数的重新请求 */
  function healShotImages() {
    var imgs = document.querySelectorAll('.shot img');
    Array.prototype.forEach.call(imgs, function (im) {
      if (!im.complete || im.naturalWidth > 0) return;
      var src = im.getAttribute('src') || '';
      if (!src || src.indexOf('data:') === 0 || src.indexOf('retry=') > 0) return;
      im.setAttribute('src', src + (src.indexOf('?') > 0 ? '&' : '?') + 'retry=1');
    });
  }
  window.addEventListener('load', function () {
    setTimeout(healShotImages, 1500);
    setTimeout(healShotImages, 4000);
  });
  window.addEventListener('hashchange', function () { setTimeout(healShotImages, 800); });

  /* 站外链接兜底：预览 iframe、沙箱或拦截弹窗的环境里，target="_blank" 会被静默丢弃，
     点了没反应。这里先尝试开新标签，开不出来就退回当前窗口跳转，保证"点了有反应"。 */
  document.addEventListener('click', function (e) {
    var el = e.target;
    var a = el && el.closest ? el.closest('a[href^="http"]') : null;
    if (!a) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    var win = null;
    try { win = window.open(a.href, '_blank'); } catch (err) { win = null; }
    if (win) { e.preventDefault(); return; }
    /* 新窗口被拦：去掉 target，让浏览器按默认方式在当前上下文打开 */
    a.removeAttribute('target');
  });

  /* 首屏「查看全部解决方案」按钮：展开导航里的下拉 */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('[data-open-menu]') : null;
    if (!btn) return;
    e.preventDefault();
    var mob = window.innerWidth <= 900;
    if (mob) document.body.classList.add('nav-open');
    var t = document.querySelector('.navmenu__btn');
    if (t) t.click();
  });

  /* ============================================================
     视觉动效层（纯增强：任何一项失败或被禁用，内容都照常完整显示）
     ============================================================ */
  var FX = { raf: 0, timers: [], io: null };
  var REDUCED = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function initFx(scope) {
    var root = scope || document;
    FX.timers.forEach(clearTimeout);
    FX.timers = [];
    try { fxFitTitle(root); } catch (e) {}
    try { fxHero(root); } catch (e) {}
    try { fxDemo(root); } catch (e) {}
    try { fxCount(root); } catch (e) {}
    try { fxSpot(root); } catch (e) {}
    try { fxProgress(); } catch (e) {}
    try { fxLightbox(); } catch (e) {}
  }

  /* --- 首屏主标题：某一行只差一点就会折行时，略微缩小字号让它保持一行
         （只在缩小幅度不超过 22% 时生效；更长的标题仍按正常规则换行） --- */
  function fxFitTitle(root) {
    var h = root.querySelector('.hero__title');
    if (!h) return;
    h.style.fontSize = '';
    var cw = h.clientWidth;
    if (!cw) return;
    var fs = parseFloat(window.getComputedStyle(h).fontSize) || 0;
    h.style.whiteSpace = 'nowrap';
    var max = 0;
    Array.prototype.forEach.call(h.children, function (sp) { max = Math.max(max, sp.scrollWidth); });
    h.style.whiteSpace = '';
    if (!fs || max <= cw) return;
    var k = cw / max;
    if (k >= .78) h.style.fontSize = (Math.floor(fs * k * 10) / 10 - .2) + 'px';
  }

  /* --- 首屏节点网络：白色低透明度节点 + 连线 + 沿线流动的光点 --- */
  function fxHero(root) {
    if (FX.raf) { cancelAnimationFrame(FX.raf); FX.raf = 0; }
    if (FX.io) { FX.io.disconnect(); FX.io = null; }
    var cv = root.querySelector('.hero__fx');
    if (!cv || !cv.getContext) return;
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    var W = 0, H = 0, dpr = 1, nodes = [], pulses = [], visible = true, last = 0;
    var LINK = 150;

    function size() {
      var r = cv.getBoundingClientRect();
      if (!r.width || !r.height) return false;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = r.width; H = r.height;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = W < 720 ? 22 : Math.min(54, Math.round(W / 28));
      LINK = W < 720 ? 120 : 160;
      nodes = [];
      for (var i = 0; i < n; i++) {
        nodes.push({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
          r: Math.random() < .16 ? 2.4 : 1.3
        });
      }
      pulses = [];
      return true;
    }

    function draw(move) {
      ctx.clearRect(0, 0, W, H);
      var i, j, a, b, dx, dy, d;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        if (move) {
          a.x += a.vx; a.y += a.vy;
          if (a.x < -20) a.x = W + 20; else if (a.x > W + 20) a.x = -20;
          if (a.y < -20) a.y = H + 20; else if (a.y > H + 20) a.y = -20;
        }
      }
      ctx.lineWidth = 1;
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        for (j = i + 1; j < nodes.length; j++) {
          b = nodes[j];
          dx = a.x - b.x; dy = a.y - b.y;
          d = dx * dx + dy * dy;
          if (d < LINK * LINK) {
            d = Math.sqrt(d);
            ctx.strokeStyle = 'rgba(255,255,255,' + (.2 * (1 - d / LINK)).toFixed(3) + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
            if (move && pulses.length < 9 && Math.random() < .0016) pulses.push({ a: a, b: b, t: 0 });
          }
        }
      }
      for (i = 0; i < nodes.length; i++) {
        a = nodes[i];
        ctx.fillStyle = a.r > 2 ? 'rgba(255,255,255,.75)' : 'rgba(255,255,255,.42)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, 6.2832); ctx.fill();
        if (a.r > 2) {
          ctx.strokeStyle = 'rgba(255,255,255,.2)';
          ctx.beginPath(); ctx.arc(a.x, a.y, a.r + 4, 0, 6.2832); ctx.stroke();
        }
      }
      for (i = pulses.length - 1; i >= 0; i--) {
        var pu = pulses[i];
        pu.t += .014;
        if (pu.t >= 1) { pulses.splice(i, 1); continue; }
        var px = pu.a.x + (pu.b.x - pu.a.x) * pu.t, py = pu.a.y + (pu.b.y - pu.a.y) * pu.t;
        ctx.fillStyle = 'rgba(255,255,255,.95)';
        ctx.beginPath(); ctx.arc(px, py, 1.9, 0, 6.2832); ctx.fill();
        ctx.fillStyle = 'rgba(255,255,255,.22)';
        ctx.beginPath(); ctx.arc(px, py, 5, 0, 6.2832); ctx.fill();
      }
    }

    function loop(ts) {
      FX.raf = 0;
      if (!cv.isConnected && !document.body.contains(cv)) return;
      if (visible && !document.hidden) {
        /* 约 30fps，足够顺滑，也给手机省电 */
        if (ts - last > 30) { last = ts; draw(true); }
        FX.raf = requestAnimationFrame(loop);
      }
    }
    function start() { if (!FX.raf && !REDUCED) FX.raf = requestAnimationFrame(loop); }

    if (!size()) return;
    draw(false);
    if (REDUCED) return;
    start();
    if ('IntersectionObserver' in window) {
      FX.io = new IntersectionObserver(function (en) {
        visible = en[0].isIntersecting;
        if (visible) start();
      });
      FX.io.observe(cv);
    }
    if (!window.__fxHeroBound) {
      window.__fxHeroBound = true;
      var rt = 0, lastW = window.innerWidth;
      window.addEventListener('resize', function () {
        /* 手机上地址栏收起也会触发 resize，只在宽度变化时重建，避免闪动 */
        if (window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        clearTimeout(rt);
        rt = setTimeout(function () { try { fxFitTitle(currentScope()); fxHero(currentScope()); } catch (e) {} }, 200);
      });
      document.addEventListener('visibilitychange', function () {
        if (!document.hidden && window.__fxHeroResume) window.__fxHeroResume();
      });
    }
    window.__fxHeroResume = start;
  }

  /* --- 首屏示意面板：问题逐字打出，回答分步出现 --- */
  function fxDemo(root) {
    var box = root.querySelector('[data-demo]');
    if (!box || REDUCED || ED.on) return;
    var steps = Array.prototype.slice.call(box.querySelectorAll('[data-step]'));
    if (!steps.length) return;
    box.classList.add('is-anim');
    var later = function (fn, ms) { FX.timers.push(setTimeout(fn, ms)); };
    var qEl = box.querySelector('[data-type]');
    var delay = 500;
    if (qEl) {
      var full = qEl.textContent;
      var chars = Array.from ? Array.from(full) : full.split('');
      var per = Math.max(28, Math.min(70, 1100 / chars.length));
      qEl.setAttribute('aria-label', full);
      var paint = function (n) {
        qEl.innerHTML = '';
        qEl.appendChild(document.createTextNode(chars.slice(0, n).join('')));
        if (n < chars.length) {
          var caret = document.createElement('span'); caret.className = 'typed__caret'; qEl.appendChild(caret);
          /* 未打出的部分透明占位，气泡宽度从一开始就固定，不会边打边撑开 */
          var rest = document.createElement('span'); rest.className = 'typed__rest';
          rest.appendChild(document.createTextNode(chars.slice(n).join(''))); qEl.appendChild(rest);
        }
      };
      paint(0);
      later(function () { qEl.classList.add('is-on'); }, 350);
      chars.forEach(function (_, i) { later(function () { paint(i + 1); }, delay + per * (i + 1)); });
      delay += per * chars.length + 380;
      steps = steps.slice(1);
    }
    steps.forEach(function (el, i) {
      later(function () { el.classList.add('is-on'); }, delay + i * 300);
    });
    /* 兜底：无论计时器是否被后台节流，到点一律显示完整内容 */
    later(function () {
      Array.prototype.forEach.call(box.querySelectorAll('[data-step]'), function (el) { el.classList.add('is-on'); });
    }, delay + steps.length * 300 + 1500);
  }

  /* --- 数字滚动：只处理「纯数字 + 单位」的值，区间 / 箭头 / 文字原样显示 --- */
  var COUNT_RE = /^(\s*[+]?)(\d[\d,]*(?:\.\d+)?)(\D*)$/;
  function fxCount(root) {
    if (REDUCED || ED.on || !('IntersectionObserver' in window) || !window.requestAnimationFrame) return;
    var els = Array.prototype.slice.call(root.querySelectorAll('.hero__meta-item b, .stat__num, .metric__value, .demo__stat b'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        run(en.target);
      });
    }, { threshold: .4 });
    function run(el) {
      var full = el.__full, m = el.__m;
      var num = parseFloat(m[2].replace(/,/g, ''));
      var dec = (m[2].split('.')[1] || '').length;
      var comma = m[2].indexOf(',') >= 0;
      var t0 = 0, dur = 1300;
      /* 示意面板里的数字要等面板出现后再滚 */
      var st = el.closest ? el.closest('.demo.is-anim [data-step]') : null;
      var wait = st && !st.classList.contains('is-on') ? 2600 : 0;
      function fmt(v) {
        var s = v.toFixed(dec);
        if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return m[1] + s + m[3];
      }
      function tick(ts) {
        if (!t0) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        var e = 1 - Math.pow(1 - k, 4);
        el.textContent = k < 1 ? fmt(num * e) : full;
        if (k < 1) requestAnimationFrame(tick);
      }
      el.textContent = fmt(0);
      FX.timers.push(setTimeout(function () { requestAnimationFrame(tick); }, wait));
      /* 兜底：后台标签页里 rAF 不跑，定时把最终值写回 */
      FX.timers.push(setTimeout(function () { el.textContent = full; }, wait + dur + 1200));
    }
    els.forEach(function (el) {
      if (el.__m || el.children.length) return;
      var full = el.textContent;
      var m = COUNT_RE.exec(full);
      if (!m || parseFloat(m[2].replace(/,/g, '')) === 0) return;
      el.__full = full; el.__m = m;
      /* 固定最小宽度，滚动时旁边的文字不抖 */
      io.observe(el);
    });
  }

  /* --- 卡片光斑：鼠标位置写进 CSS 变量（仅有鼠标的设备） --- */
  function fxSpot(root) {
    if (!window.matchMedia || !window.matchMedia('(hover: hover)').matches) return;
    Array.prototype.forEach.call(root.querySelectorAll('.card, .case, .stat, .flow__step'), function (el) {
      if (el.__spot) return;
      el.__spot = true;
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        el.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* --- 顶部阅读进度条 --- */
  function fxProgress() {
    if (window.__fxProgress) return;
    window.__fxProgress = true;
    var bar = document.createElement('div');
    bar.className = 'scrollbar';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);
    var tick = false;
    function upd() {
      tick = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var y = window.pageYOffset || doc.scrollTop || 0;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0).toFixed(4) + ')';
    }
    window.addEventListener('scroll', function () {
      if (!tick) { tick = true; (window.requestAnimationFrame || setTimeout)(upd); }
    }, { passive: true });
    upd();
  }

  /* --- 截图放大：点图打开，再点一下放大到可读，点空白或 × 关闭 --- */
  function fxLightbox() {
    if (window.__fxLb) return;
    window.__fxLb = true;
    var lb = null, img = null, hint = null;
    function tip() {
      var en = curLang === 'en';
      if (lb.classList.contains('is-zoom')) return en ? 'Tap image to shrink · tap × to close' : '再点图片缩小 · 点 × 关闭';
      return en ? 'Tap image to zoom · tap outside to close' : '点图片放大 · 点空白处关闭';
    }
    function build() {
      lb = document.createElement('div');
      lb.className = 'lb';
      lb.setAttribute('role', 'dialog');
      lb.setAttribute('aria-modal', 'true');
      lb.innerHTML = '<button type="button" class="lb__close" aria-label="Close">\u00D7</button>' +
        '<div class="lb__stage"><img class="lb__img" alt=""></div><div class="lb__hint"></div>';
      document.body.appendChild(lb);
      img = lb.querySelector('.lb__img');
      hint = lb.querySelector('.lb__hint');
      lb.addEventListener('click', function (e) {
        if (e.target === img) {
          lb.classList.toggle('is-zoom');
          lb.scrollTop = 0; lb.scrollLeft = 0;
          hint.textContent = tip();
          return;
        }
        close();
      });
    }
    function close() {
      if (!lb) return;
      lb.classList.remove('is-open', 'is-zoom');
      document.body.classList.remove('lb-open');
    }
    document.addEventListener('click', function (e) {
      var el = e.target;
      if (!el || el.tagName !== 'IMG' || !el.closest || !el.closest('.shot')) return;
      if (ED.on || !el.naturalWidth) return;
      if (!lb) build();
      img.src = el.currentSrc || el.src;
      img.alt = el.alt || '';
      lb.classList.remove('is-zoom');
      lb.classList.add('is-open');
      lb.scrollTop = 0;
      hint.textContent = tip();
      document.body.classList.add('lb-open');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || e.keyCode === 27) close();
    });
  }


  /* ---------- 启动 ---------- */
  var pageKey = document.body.getAttribute('data-page') || 'home';
  function currentPageKey() { return pageKey; }

  curLang = detectLang();
  loadLangData(curLang, function (data) {
    if (data) { D = data; window.SITE_DATA = D; }
    applyLangToDoc(curLang);
    if (!initEditor(pageKey)) renderPage(pageKey);
    propagateShareCode();
  });
})();
