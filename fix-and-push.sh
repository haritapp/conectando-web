#!/bin/bash
# conectando-web — ビルドエラー修正 & 再プッシュ
# Terminal で以下を実行: bash fix-and-push.sh

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "🗑️  古い package-lock.json を削除..."
rm -f package-lock.json

echo "📦 npm install (最新パッチ版で再生成)..."
npm install

echo "✅ 新しい package-lock.json をコミット..."
git add package-lock.json fix-and-push.sh
git commit -m "chore: regenerate package-lock.json (fix @tailwindcss/vite compat)"

echo "⬆️  プッシュ..."
git push

echo ""
echo "✅ 完了！Cloudflare Pages でデプロイが自動開始されます。"
