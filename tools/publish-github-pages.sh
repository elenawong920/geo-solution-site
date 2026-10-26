#!/usr/bin/env bash
# ============================================================
# 一键推送到 GitHub Pages
# 前提：已在 github.com/elenawong920 下手动创建公开仓库 geo-solution-site
# 用法：bash tools/publish-github-pages.sh
# ============================================================
set -euo pipefail

OWNER="elenawong920"
REPO="geo-solution-site"
BRANCH="main"
SRC="$(cd "$(dirname "$0")/.." && pwd)"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

echo "▶ 准备推送目录…"
# 只推送站点运行必需的文件（排除 README / tools / .nojekyll 之外的全量）
mkdir -p "$TMP/repo"
cd "$SRC"
for f in index.html overseas.html insight.html .nojekyll; do
  cp "$f" "$TMP/repo/"
done
mkdir -p "$TMP/repo/assets/css" "$TMP/repo/assets/js" "$TMP/repo/assets/data" "$TMP/repo/assets/img"
cp assets/css/main.css          "$TMP/repo/assets/css/"
cp assets/js/app.js             "$TMP/repo/assets/js/"
cp assets/data/content.js       "$TMP/repo/assets/data/"
cp assets/img/*                 "$TMP/repo/assets/img/"

cd "$TMP/repo"
git init -q
git checkout -q -b "$BRANCH"
git config user.name "WorkBuddy"
git config user.email "workbuddy@local"
git add -A
git commit -q -m "更新 GEO 站点内容"

echo "▶ 推送到 GitHub…"
git push -q "https://github.com/$OWNER/$REPO.git" "$BRANCH:$BRANCH"

echo ""
echo "✅ 已推送。"
echo ""
echo "接下来请在浏览器完成两步："
echo "  1) 打开 https://github.com/$OWNER/$REPO/settings/pages"
echo "     Source 选择「Deploy from a branch」，Branch 选 main，目录选 / (root)，保存"
echo "  2) 等 1–2 分钟，访问："
echo "     https://$OWNER.github.io/$REPO/"
echo ""
echo "（微信内置浏览器可正常打开此域名）"
