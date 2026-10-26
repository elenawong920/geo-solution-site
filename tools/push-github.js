#!/usr/bin/env node
/* ============================================================
   把站点推送到 GitHub Pages 仓库
   ------------------------------------------------------------
   用法：
     node tools/push-github.js
   环境变量（都有默认值，可覆盖）：
     GH_REPO    默认 elenawong920/geo-solution-site
     GH_BRANCH  默认 main
     GH_SSH_KEY 默认 ~/.ssh/id_ed25519_geo_site（不存在则回退 id_ed25519）

   前提：本机已有一把注册到 GitHub 账号的 SSH 密钥
        （可用 `ssh -T git@github.com` 验证）。

   脚本做的事：
     1. 克隆仓库到临时目录
     2. 用本地 geo-site/ 的文件覆盖（.DS_Store 等杂项自动排除）
     3. 提交并推送
     4. 提示 Pages 重建时间
   ============================================================ */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const REPO = process.env.GH_REPO || 'elenawong920/geo-solution-site';
const BRANCH = process.env.GH_BRANCH || 'main';
/* 优先用本仓库专用密钥，回退到默认密钥 */
const KEY = process.env.GH_SSH_KEY ||
  (fs.existsSync(path.join(os.homedir(), '.ssh', 'id_ed25519_geo_site'))
    ? path.join(os.homedir(), '.ssh', 'id_ed25519_geo_site')
    : path.join(os.homedir(), '.ssh', 'id_ed25519'));
const SRC = path.resolve(__dirname, '..');

/* 站点里要同步的文件（与仓库结构一一对应） */
const ITEMS = [
  'index.html', 'overseas.html', 'insight.html', '.nojekyll',
  'README.md', '微信打开方案.md',
  'assets', 'tools'
];

function run(cmd, args, opts) {
  return execFileSync(cmd, args, Object.assign({ encoding: 'utf8', stdio: 'pipe' }, opts || {}));
}

function step(msg) { console.log('· ' + msg); }
function ok(msg) { console.log('✓ ' + msg); }

/* ---- 0. 前置检查 ---- */
if (!fs.existsSync(KEY)) {
  console.error(`✗ 找不到 SSH 私钥：${KEY}`);
  console.error('  如果你的密钥在别处，用 GH_SSH_KEY=/path/to/key 指定');
  process.exit(1);
}

console.log('检查 GitHub SSH 连接…');
/* 注意：GitHub 不提供 shell，认证成功时 ssh 的退出码仍是 1，
   所以必须看输出文本，不能只看退出码 */
let authOut = '';
try {
  authOut = run('ssh', ['-o', 'StrictHostKeyChecking=no', '-o', 'BatchMode=yes',
    '-o', 'ConnectTimeout=10', '-i', KEY, '-T', 'git@github.com'],
    { stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) {
  authOut = ((e.stdout || '') + '\n' + (e.stderr || '')).toString();
}
authOut = authOut.trim();
if (/successfully authenticated/i.test(authOut)) {
  ok(authOut.split('\n')[0]);
} else {
  console.error('✗ SSH 认证失败');
  if (/Permission denied|not accessible|denied/i.test(authOut)) {
    console.error('  ' + authOut.split('\n')[0]);
    console.error('  这把公钥可能没注册到 GitHub 账号：https://github.com/settings/keys');
  } else {
    console.error('  ' + (authOut || '没有返回信息').slice(0, 200));
  }
  process.exit(1);
}

/* ---- 1. 克隆 ---- */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'geo-push-'));
step(`临时目录 ${tmp}`);
const gitEnv = {
  ...process.env,
  GIT_SSH_COMMAND: `ssh -i ${KEY} -o StrictHostKeyChecking=no -o BatchMode=yes`
};
run('git', ['init', '-q'], { cwd: tmp });
run('git', ['remote', 'add', 'origin', `git@github.com:${REPO}.git`], { cwd: tmp });
run('git', ['fetch', '-q', 'origin', BRANCH], { cwd: tmp, env: gitEnv });
run('git', ['checkout', '-q', '-B', BRANCH, `origin/${BRANCH}`], { cwd: tmp, env: gitEnv });
ok(`已克隆 ${REPO} (${BRANCH})`);

/* ---- 2. 同步文件 ---- */
for (const item of ITEMS) {
  const from = path.join(SRC, item);
  const to = path.join(tmp, item);
  if (!fs.existsSync(from)) { console.warn(`  跳过（本地没有）：${item}`); continue; }
  fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
}
step('已同步站点文件');

/* ---- 3. 清理杂项 & 提交 ---- */
run('find', [tmp, '-name', '.DS_Store', '-delete']);

/* 提交身份：只设在这个临时克隆里，不动用户的全局 git 配置 */
const authorName = process.env.GH_AUTHOR_NAME || 'elenawong920';
const authorEmail = process.env.GH_AUTHOR_EMAIL || 'elenawong920@users.noreply.github.com';
run('git', ['config', 'user.name', authorName], { cwd: tmp });
run('git', ['config', 'user.email', authorEmail], { cwd: tmp });

run('git', ['add', '-A'], { cwd: tmp });
const status = run('git', ['status', '--porcelain'], { cwd: tmp }).trim();

if (!status) {
  console.log('\n· 本地与 GitHub 完全一致，无需提交');
  fs.rmSync(tmp, { recursive: true, force: true });
  process.exit(0);
}
console.log('\n变更清单：');
status.split('\n').forEach(l => console.log('  ' + l));

const msg = process.argv[2] ||
  'feat: 中英双语切换（新增 content.en.js、语言切换按钮、编辑模式按语言回写、双语结构校验脚本）';
run('git', ['commit', '-q', '-m', msg], { cwd: tmp, env: gitEnv });
const sha = run('git', ['rev-parse', '--short', 'HEAD'], { cwd: tmp }).trim();
ok(`已提交 ${sha}`);

/* ---- 4. 推送 ---- */
run('git', ['push', 'origin', `${BRANCH}:${BRANCH}`], { cwd: tmp, env: gitEnv });
ok(`已推送到 ${BRANCH}`);

fs.rmSync(tmp, { recursive: true, force: true });

const user = REPO.split('/')[0];
const name = REPO.split('/')[1];
console.log('\n完成。GitHub Pages 地址：');
console.log(`  https://${user}.github.io/${name}/`);
console.log('  Pages 重建通常 1–2 分钟，稍等刷新即可。');
console.log('\n后续更新：改完 geo-site/ 后跑一次 node tools/push-github.js 即可。');
