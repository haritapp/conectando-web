#!/bin/bash
# conectando-web — GitHub 初回プッシュ用スクリプト
# Terminal で以下を実行: bash setup-git.sh

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "📁 作業ディレクトリ: $DIR"

# 壊れた .git があれば削除してやり直し
if [ -d ".git" ]; then
  echo "🧹 既存の .git を削除してやり直します..."
  rm -rf .git
fi

echo "🚀 git init..."
git init
git branch -M main

echo "📦 ファイルを追加..."
git add .

echo "✅ コミット..."
git commit -m "Initial scaffold: Astro + Tailwind + i18n + 3 collections (case/blog/news)"

echo "🔗 リモートを設定..."
git remote add origin https://github.com/haritapp/conectando-web.git

echo "⬆️  プッシュ..."
git push -u origin main

echo ""
echo "✅ 完了！https://github.com/haritapp/conectando-web を確認してください。"
