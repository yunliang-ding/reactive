#!/bin/bash

# 发布包
# 用法: ./publish.sh [patch|minor|major]
# npm config set //registry.npmjs.org/:_authToken=新的TOKEN值

set -e

VERSION_TYPE=${1:-patch}
DIR=$(cd "$(dirname "$0")" && pwd)

cd "$DIR"

echo ">>> 升版本 ($VERSION_TYPE)"
npm version "$VERSION_TYPE" --no-git-tag-version

echo ">>> 构建"
pnpm run build

echo ">>> 发布"
pnpm publish --no-git-checks --access public --ignore-scripts

echo ">>> 完成！"
