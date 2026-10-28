# 京东科技 GEO 产品介绍站 · 使用与更新说明

## 〇、微信里打不开？先看这里

微信内置浏览器（iOS/Android）**打不开** WorkBuddy 分享链接 —— 是分享网关按 UA 拦截的，改网页代码无法绕过。
**详细方案见同目录 `微信打开方案.md`**，里面有两条可落地的路：

- **方案 A（推荐，已完成）**：GitHub Pages，微信可直开、且能持续更新
- **方案 B（零配置）**：单文件版 `geo-site-singlefile/京东科技GEO解决方案.html`，直接当文件发微信

本 README 讲的是站点本身的结构与内容更新方法。

---

## 一、这是什么

把多份 GEO 产品与行业材料整合成一个**对外可分享的产品介绍网站**。目前共 7 个页面：

| 页面 | 文件 | 内容来源 |
|---|---|---|
| 国内 GEO 解决方案 | `index.html` | 通用版对外介绍 + 内部手册（去内部信息）+ OnePage |
| 海外 GEO 解决方案 | `overseas.html` | 海外 GEO 产品介绍 202608 |
| AI 用户意图洞察 | `insight.html` | 京东空调豆包意图洞察报告 |
| 医药健康行业方案 | `pharma.html` | 京东科技 GEO 医药健康行业方案（含案例）1010 |
| 金融保险行业方案 | `insurance.html` | 保险行业 GEO 通用方案 202608 + 消费金融适用方案与实证案例 |
| 文旅行业方案 | `tourism.html` | 京东科技 GEO 对外介绍版【文旅】含案例 20261009 |
| 工业品与 B2B 采购方案 | `industrial.html` | 京东科技 GEO 工业品行业方案 1028（京东工业） |

**工业品与 B2B 的页面关系**：工业品有独立的采购语言、参数口径、工况与验收场景，因此单独建页；
导航中合并为“工业品 / B2B”一个入口，不再保留空的泛 B2B 页面，避免两个相似页面分散流量。
后续若补充企业服务等其他 B2B 垂类，可按同一方法新增独立页。

**2026-10-27 信息架构优化**：首页“什么是 GEO”与“核心价值”合并；交付统一为五阶段；
指标合并为“定义 + 口径 + 管理用途”一张表；全站移除重复的“获取方案”按钮，
销售联系集中放在页脚。行业客户可直接进入各自的独立页面，并通过行业栏切换。

**中英双语**：导航栏右侧有 `中 / EN` 切换按钮，七个页面都已完整翻译。
访问 `?lang=en` 可直接进入英文版（分享给海外客户时用这个链接）。

**目录结构**

```
geo-site/
├── index.html                  国内 GEO 主页
├── overseas.html               海外 GEO 主页
├── insight.html                意图洞察报告页
├── pharma.html                 医药健康行业方案页
├── insurance.html              金融保险行业方案页（保险 + 消费金融）
├── tourism.html                文旅行业方案页
├── industrial.html             工业品与 B2B 采购方案页
├── assets/
│   ├── data/content.js         ★ 中文文案（改这个就够了）
│   ├── data/content.en.js      ★ 英文文案（与中文文件结构完全一致）
│   ├── css/main.css            样式（京东红 KV、响应式）
│   ├── js/app.js               渲染引擎 + 语言切换 + 编辑模式逻辑
│   └── img/                    图片资源
└── tools/
    ├── build-i18n.js           中英文结构一致性校验（改完务必跑一次）
    ├── build-singlefile.js     生成单文件版
    ├── apply-update.js         把编辑模式导出的 JSON 回写到内容文件
    ├── sync-ai-rankings.py     从「AI 三榜对比」HTML 同步首页三榜数据
    └── push-github.js          推送 GitHub Pages
```

---

## 二、语言切换怎么工作

| 项 | 说明 |
|---|---|
| 切换按钮 | 导航栏右侧 `中 / EN`，桌面与移动端都有 |
| 语言判定优先级 | URL `?lang=en` → 上次选择（localStorage）→ 浏览器语言 → 中文 |
| 切换时保留 | 当前选中的 Tab、展开的 FAQ、滚动位置、所在页面 |
| 跨页保持 | 站内链接自动带上 `?lang=en`，即使 localStorage 不可用也不丢 |
| 分享链接 | `...?lang=en&sharecode=XXX` 可直接发英文版给海外客户 |

**改英文文案**：编辑 `assets/data/content.en.js`，与中文文件一一对应。
改完必须跑一次结构校验：

```bash
node tools/build-i18n.js
```

它会检查两个文件的键、数组长度、叶子类型是否完全一致，并列出未翻译的中文。
（洞察页「种子词」区的中文是**有意保留**的原始数据，白名单已登记。）

---

## 三、三种更新方式（按省事程度排序）

### 方式 A：手机上直接改（最省事，适合临时改几个字）

在网址后加 `?edit=1`，例如：

```
https://你的链接/index.html?edit=1
```

- 页面上所有文字都可以**直接点击修改**
- 改动自动保存在你本机浏览器里
- 改完点右下角「**导出更新**」，会下载一个 `geo-update-home-zh.json` 或 `geo-update-home-en.json`
  （文件名后缀标明语言，中英文各存各的，不会互相覆盖）
- 把这个文件发给我，我帮你同步到线上链接，客户就能看到最新内容
- 点「重置」可放弃本机所有改动
- 要改英文版，先点导航栏的 `EN` 切到英文，再加 `?edit=1`

> 适合：改个数字、换个说法、加一句活动信息
> 注意：改动只存在你的手机/电脑上，换设备看不到；正式生效以我同步到线上为准。

### 方式 B：改内容文件（适合批量改）

用任何文本编辑器打开 `assets/data/content.js`（中文）或 `assets/data/content.en.js`（英文），
改里面的文字或数字，保存即可。

> 改完英文文件后，**务必跑一次** `node tools/build-i18n.js` 校验结构一致。

结构长这样：

```js
pages: {
  home: {
    sections: [
      { type: 'hero', title: ['驾驭 AI 时代', '赢得未来流量'], ... },
      { type: 'section', id: 'cases', blocks: [ ... ] }
    ]
  }
}
```

常见改法：

```js
// 改 Hero 大标题
title: ['驾驭 AI 时代', '赢得未来流量']

// 改底部版本号和更新日期（会显示在页脚）
meta: { version: 'v1.1', updated: '2026-11-05' }

// 改某个案例的指标
metrics: [
  { label: '首月整体曝光份额', value: '34% → 65%' }
]
```

### 方式 C：让我改（最推荐）

直接把要改的内容告诉我，比如：

> 「首页案例 3 的曝光份额改成 3% → 30%，页脚版本号改 v1.1」

我改完直接重新发布，线上链接立即更新。

---

## 四、线上发布与同步

- 站点发布后，链接地址**固定不变**，每次更新都是覆盖同一份内容
- 客户已经打开的链接会在刷新后看到新内容
- 你不需要重新发链接给客户

---

## 五、常见问题

**Q：手机上分享效果怎么样？**
已按微信内置浏览器做过适配：390px 宽单列布局、顶部折叠菜单、表格可左右滑动、字体与间距都为移动端调过。

**Q：客户能不能改我的页面？**
不能。`?edit=1` 只是你自己用的编辑视图，普通访问看不到编辑条。

**Q：能不能去掉某些内容？**
可以。告诉我删哪一块，或者把 `content.js` 里对应的 `section` 删掉即可。

**Q：能加新页面吗？**
可以。新建一个 `.html`，把 `data-page` 改成对应页面名，再在 `content.js` 里加一个 `pages.xxx` 即可。

---

## 六、素材来源与说明

站内引用的市场数据与案例数据均来自你提供的材料，未做外部估算：

- 六大指标计算口径、平台用户画像 → 内部介绍手册（画像引自 QuestMobile《2026 年 AI 电商与消费品类 GEO 研究报告》）
- 金融保险意图模型、合规机制与金融案例 → 京东科技面向保险行业 GEO 通用方案介绍 202608；
  消费金融的适用范围、用户问题与合规红线基于本页方案框架归纳，案例沿用该材料中的消费信贷与互联网银行项目
- 文旅场景、产品矩阵与六组案例 → 京东科技 GEO 对外介绍版【文旅】含案例 20261009
- 工业品采购场景、六层能力、指标与五金城案例 → 京东科技 GEO 工业品行业方案 1028（京东工业）
- AI 大模型三榜数据 → 内部介绍手册内嵌图（更新日期 2026-10-21），含 A 榜 C 端 App MAU（国内基模 / 海外模型两个子榜）、B 榜 B 端 Web 月访问量、C 榜 API 调用量
- 国内案例、海外案例、ChatGPT 广告与 Reddit 数据 → 通用版对外介绍、海外 GEO 产品介绍
- 种子词与意图分布 → 京东空调豆包意图洞察报告（数据范围 2026-08-17 ~ 2026-09-15）

**已剔除的内部内容**：内部手册中标为「内部资料 · 请勿外传」的部分——采销流程、付款流程、报价与结算细节、供应商信息、内部交接说明——均未放入对外站点。

**已交叉核对**：站内所有百分比均与原 PDF 逐条比对，案例指标（京东空调 / 厨具 / 家政、海外四案例）与交付流程表已按原表校正。

---

## 七、推到 GitHub Pages（已打通，微信可直开）

仓库：`https://github.com/elenawong920/geo-solution-site`
线上：**https://elenawong920.github.io/geo-solution-site/**

**为什么需要这一步**：WorkBuddy 分享链接在微信内置浏览器里会被网关按 UA 拦截（403），
GitHub Pages 的 `github.io` 域名微信可以正常打开 —— 已用 MicroMessenger UA 实测通过。

**更新命令**（一条就够，脚本走 SSH，不需要 token）：

```bash
cd geo-site && node tools/push-github.js
```

脚本会：克隆仓库 → 同步本地站点文件 → 提交 → 推送 → 提示 Pages 重建（1–2 分钟）。
链接永远不变。

**AI 三榜每日同步**：每天 9:00 的三榜自动更新任务生成新图后，会调用

```bash
python3 tools/sync-ai-rankings.py "/Users/huangjia1/WorkBuddy/2026-08-18-16-07-00/AI大模型三榜对比_YYYYMMDD.html"
node tools/build-i18n.js
node tools/build-singlefile.js
node tools/push-github.js "chore: sync AI rankings YYYYMMDD"
```

把 A 榜（国内基模 / 海外模型）、B 榜、C 榜的数值、环比、数据日期与口径同步到官网首页，
并发布到 GitHub Pages。无新榜时不推送。

**SSH 前提**：本机已为该仓库配置专用 deploy key `~/.ssh/id_ed25519_geo_site`
（读权限 + 写权限）。换机器的话需要重新加一把：
https://github.com/elenawong920/geo-solution-site/settings/keys/new

> 注意：一把公钥只能当**一个**仓库的 deploy key，所以这个仓库用的是独立密钥，
> 和你其他项目的密钥不冲突。

---

## 八、新增一个行业方案页（汽车 / 其他 B2B 垂类 …）

已按可扩展的方式做好，新增行业只需三步，不用改渲染引擎：

**1. 建页面文件** —— 复制 `pharma.html`，改 `data-page` 和 `<title>`：

```html
<body data-page="insurance">
```

**2. 加内容** —— 在 `assets/data/content.js` 的 `pages` 里复制一份 `pages.pharma` 改成 `pages.insurance`，
英文同步写到 `assets/data/content.en.js`（结构必须一一对应）。

**3. 加进导航与单文件版**：

- 顶部导航：在 `pages.home.nav` / `pages.insight.nav` 里加一项 `{ label: '行业方案', href: 'insurance.html' }`
- 行业切换栏：更新每个行业页 `sections[0].items`（`type: 'industryBar'`），
  当前行业设 `active: true`；已上线行业填写 `href`，未上线行业只保留 `note: '即将上线'`。
  三个现有行业页都要同步，保证客户在任意行业页之间可直接切换。
- 单文件版：`tools/build-singlefile.js` 里的 `pages` 数组和启动白名单加页面名，
  并在 `prepContent()` 的 `routes` 中增加 `'industry.html': '#/industry'`。
- 推送清单：`tools/push-github.js` 的 `ITEMS` 中加入新 HTML 文件，避免漏发。

**可复用的区块类型**：`hero` `secHead` `cards` `eras` `stats` `compare` `table` `flow` `roadmap`
`checks` `notice` `cases` `cta` `split` `platforms` `bars` `gallery` `tabs` `plats`
`industryBar`（行业切换栏）`caseStudy`（案例详解：痛点/方案/结果/洞察）

**`caseStudy` 的数据结构**：

```js
{
  type: 'caseStudy',
  labels: { pains: '行业痛点', solutions: '解决方案', result: '执行结果', note: '核心洞察' },
  items: [{
    no: '01', tag: '行业标签', title: '案例标题', sub: '一句话背景',
    metrics: [{ label: '指标名', value: '18.3%' }],
    pains: ['痛点1'], solutions: ['方案1'], result: '执行结果',
    note: '核心洞察', quote: { text: '客户原话', by: '客户职位' }
  }]
}
```

改了内容后跑 `node tools/build-i18n.js` 校验中英文结构一致，再 `node tools/push-github.js` 上线。
