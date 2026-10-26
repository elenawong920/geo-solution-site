/* ============================================================
   京东科技 GEO 产品介绍站 · 渲染引擎
   所有页面内容由 assets/data/content.js 提供，修改数据文件即可更新站点
   路径体系：sections.N.blocks.M.items.K.field —— 可精确定位到内容树
   ============================================================ */
(function () {
  'use strict';

  var D = window.SITE_DATA || (window.SITE_DATA = {});
  var uidCounter = 0;
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };

  /* 编辑模式：带 data-edit 的节点可被编辑，路径用于回写数据 */
  var ED = { on: false, overrides: {} };

  function t(path, val) {
    if (val == null) return '';
    if (!ED.on) return esc(val);
    return '<span data-edit="' + esc(path) + '">' + esc(val) + '</span>';
  }

  /* ---------- 区块渲染器：每个函数接收 (block, pathPrefix) ---------- */
  var R = {};

  R.hero = function (b, p) {
    var h = '';
    h += '<section class="hero"><div class="hero__grid"></div><div class="container hero__inner">';
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
        h += '<a class="btn ' + (bt.style === 'ghost' ? 'btn--ghost' : 'btn--primary') + '" href="' + esc(bt.href || '#') + '">' + t(p + '.buttons.' + i + '.label', bt.label) + '</a>';
      });
      h += '</div>';
    }
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

  R.secHead = function (b, p) {
    var h = '<div class="sec-head' + (b.center ? ' sec-head--center' : '') + ' reveal">';
    if (b.kicker) h += '<div class="eyebrow">' + t(p + '.kicker', b.kicker) + '</div>';
    if (b.title) h += '<h2 class="h2">' + t(p + '.title', b.title) + '</h2>';
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
    var h = '<div class="table-wrap reveal"><table class="table"><thead><tr>';
    (b.head || []).forEach(function (c, i) { h += '<th>' + t(p + '.head.' + i, c) + '</th>'; });
    h += '</tr></thead><tbody>';
    (b.rows || []).forEach(function (r, i) {
      var hl = (b.highlight || []).indexOf(i) >= 0 ? ' class="hl"' : '';
      h += '<tr' + hl + '>';
      r.forEach(function (c, j) {
        var cls = b.numCols && b.numCols.indexOf(j) >= 0 ? ' class="num"' : '';
        h += '<td' + cls + '>' + t(p + '.rows.' + i + '.' + j, c) + '</td>';
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
      h += '<div class="bar"><div class="bar__top"><span class="bar__label">' + t(p + '.items.' + i + '.label', it.label) + '</span>' +
           '<span class="bar__val">' + t(p + '.items.' + i + '.value', it.value) + '</span></div>' +
           '<div class="bar__track"><div class="bar__fill" data-pct="' + pct.toFixed(2) + '"></div></div>';
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
      h += '<span class="plat' + (it.hot ? ' plat--red' : '') + '">' + t(p + '.items.' + i, it) + '</span>';
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
               '<div class="metric__value">' + t(p + '.items.' + i + '.metrics.' + j + '.value', m.value) + '</div></div>';
        });
        h += '</div>';
      }
      if (it.foot) h += '<p class="bar__note" style="margin-top:14px">' + t(p + '.items.' + i + '.foot', it.foot) + '</p>';
      h += '</div></div>';
    });
    return h + '</div>';
  };

  R.gallery = function (b, p) {
    var h = '<div class="gallery reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<figure class="shot" style="margin:0"><img src="' + esc(it.src) + '" alt="' + esc(it.alt || '') + '" loading="lazy">' +
           '<figcaption class="shot__cap">' + t(p + '.items.' + i + '.cap', it.cap) + '</figcaption></figure>';
    });
    return h + '</div>';
  };

  R.platforms = function (b, p) {
    var h = '<div class="cards reveal">';
    (b.items || []).forEach(function (it, i) {
      h += '<div class="card card--accent"><div class="card__no">' + t(p + '.items.' + i + '.no', it.no) + '</div>';
      h += '<h3 class="card__title">' + t(p + '.items.' + i + '.name', it.name) + '</h3>';
      h += '<p class="card__desc" style="margin-bottom:12px">' + t(p + '.items.' + i + '.role', it.role) + '</p>';
      h += '<div class="bar__note" style="margin-bottom:4px"><b>主要抓手</b></div><ul class="card__list">';
      (it.handles || []).forEach(function (x, j) { h += '<li>' + t(p + '.items.' + i + '.handles.' + j, x) + '</li>'; });
      h += '</ul>';
      h += '<div class="bar__note" style="margin:14px 0 4px"><b>核心结果</b></div><ul class="card__list">';
      (it.results || []).forEach(function (x, j) { h += '<li>' + t(p + '.items.' + i + '.results.' + j, x) + '</li>'; });
      h += '</ul>';
      if (it.goal) h += '<div class="bar__note" style="margin-top:12px">优化目标：' + t(p + '.items.' + i + '.goal', it.goal) + '</div>';
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
          '<a class="nav__logo" href="index.html"><img src="assets/img/logo-jd.png" alt="京东科技"><span class="nav__tag">GEO</span></a>' +
          '<button class="nav__toggle" id="navToggle" type="button" aria-label="展开导航" aria-expanded="false">' +
            '<span></span><span></span><span></span>' +
          '</button>' +
          '<div class="nav__links" id="navLinks">' +
            (page.nav || []).map(function (n) {
              return '<a href="' + esc(n.href) + '" data-nav="' + esc(n.href) + '">' + esc(n.label) + '</a>';
            }).join('') +
          '</div>' +
          '<a class="nav__cta" href="index.html#contact">' + esc(D.meta.ctaLabel || '获取方案') + '</a>' +
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
          '<img src="assets/img/logo-jd.png" alt="京东科技">' +
          '<p>' + esc(D.footer.brand) + '</p></div>' +
        '<div class="footer__cols">' +
          (D.footer.cols || []).map(function (c) {
            return '<div class="footer__col"><h4>' + esc(c.title) + '</h4>' +
              (c.items || []).map(function (it) {
                return it.href ? '<a href="' + esc(it.href) + '">' + esc(it.text) + '</a>' : '<span>' + esc(it.text) + '</span>';
              }).join('') + '</div>';
          }).join('') +
        '</div></div>' +
        '<div class="footer__bottom"><span>' + esc(D.footer.copy) + '</span>' +
          '<span class="footer__ver">' + esc(D.meta.version) + ' · 更新于 ' + esc(D.meta.updated) + '</span>' +
        '</div></div>';
    }

    initInteractions();
  }

  /* ---------- 交互 ---------- */
  function initInteractions() {
    /* 移动端导航展开 */
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
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
    Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
      btn.addEventListener('click', function () {
        var ans = btn.nextElementSibling;
        var open = btn.classList.toggle('is-open');
        ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
      });
    });

    /* Tabs */
    Array.prototype.forEach.call(document.querySelectorAll('.tabs'), function (bar) {
      var btns = bar.querySelectorAll('.tabs__btn');
      var group = bar.getAttribute('data-group');
      var panels = group ? document.querySelectorAll('.tab-panel[data-group="' + group + '"]') : [];
      Array.prototype.forEach.call(btns, function (btn) {
        btn.addEventListener('click', function () {
          var target = btn.getAttribute('data-tab');
          Array.prototype.forEach.call(btns, function (b) { b.classList.remove('is-active'); });
          btn.classList.add('is-active');
          Array.prototype.forEach.call(panels, function (p) {
            p.classList.toggle('is-active', p.id === target);
          });
          observeReveal();
        });
      });
    });

    observeReveal();
    observeBars();
    observeNav();
  }

  function observeReveal() {
    var els = document.querySelectorAll('.reveal:not(.is-in)');
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (e) { e.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
    Array.prototype.forEach.call(els, function (e) { io.observe(e); });
  }

  function observeBars() {
    var fills = document.querySelectorAll('.bar__fill');
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

  function observeNav() {
    var links = document.querySelectorAll('[data-nav]');
    if (!links.length) return;
    var sections = Array.prototype.map.call(links, function (a) {
      var href = a.getAttribute('data-nav');
      if (href.indexOf('#') !== 0) return null;
      return document.querySelector(href);
    }).filter(Boolean);
    if (!sections.length) return;
    var onScroll = function () {
      var y = window.scrollY + 120;
      var cur = null;
      sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
      Array.prototype.forEach.call(links, function (a) {
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

    var storeKey = 'geo-overrides-' + pageKey;
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
        var v = el.textContent;
        if (getPath(page, p) !== v) ov[p] = v;
      });
      var merged = {};
      Object.keys(ED.overrides).forEach(function (k) { merged[k] = ED.overrides[k]; });
      Object.keys(ov).forEach(function (k) { merged[k] = ov[k]; });
      try { localStorage.setItem(storeKey, JSON.stringify(merged)); } catch (e) {}
      var payload = { page: pageKey, updated: new Date().toISOString().slice(0, 10), overrides: merged };
      var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'geo-update-' + pageKey + '.json';
      a.click();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
      alert('已导出 ' + Object.keys(merged).length + ' 处更新。\n把这个文件发给我，我就能同步到线上链接。');
    });

    document.getElementById('edReset').addEventListener('click', function () {
      try { localStorage.removeItem(storeKey); } catch (e) {}
      location.href = location.pathname;
    });

    return true;
  }

  /* ---------- 分享码透传 ---------- */
  function propagateShareCode() {
    var code = new URLSearchParams(location.search).get('sharecode');
    if (!code) return;
    var links = document.querySelectorAll('a[href]');
    Array.prototype.forEach.call(links, function (a) {
      var href = a.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(https?:|mailto:|tel:|javascript:)/.test(href)) return;
      if (href.indexOf('sharecode=') >= 0) return;
      /* 保持 #锚点在最后：page.html#sec?code= 是错的 */
      var hash = '';
      var hi = href.indexOf('#');
      if (hi >= 0) { hash = href.slice(hi); href = href.slice(0, hi); }
      var sep = href.indexOf('?') >= 0 ? '&' : '?';
      a.setAttribute('href', href + sep + 'sharecode=' + encodeURIComponent(code) + hash);
    });
  }

  /* ---------- 启动 ---------- */
  var pageKey = document.body.getAttribute('data-page') || 'home';
  window.SITE_DATA = D;
  if (!initEditor(pageKey)) renderPage(pageKey);
  propagateShareCode();
})();
