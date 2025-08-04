#!/bin/bash

# 配置区
PROJECT_DIR=/root/vben5admin
DEPLOY_DIR=/var/www/my-site
BRANCH=main

echo "📁 切换到项目目录：$PROJECT_DIR"
cd $PROJECT_DIR || { echo "❌ 项目目录不存在，请先 git clone 项目"; exit 1; }

echo "🔄 拉取最新代码..."
git reset --hard
git pull origin $BRANCH

if [ $? -ne 0 ]; then
  echo "❌ 拉取代码失败，请检查网络或权限"
  exit 1
fi

echo "📦 安装依赖..."
pnpm install

echo "🏗 开始打包项目..."
pnpm run build

if [ $? -ne 0 ]; then
  echo "❌ 打包失败，请检查错误日志"
  exit 1
fi

echo "🧹 清空旧部署目录：$DEPLOY_DIR"
rm -rf $DEPLOY_DIR/*

echo "📤 拷贝 dist 内容到部署目录"
cp -r dist/* $DEPLOY_DIR/

echo "✅ 部署成功！时间: $(date)"
