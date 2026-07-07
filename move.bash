# 进入仓库根目录
cd ~/Projects/jfm-frontend

# 移动除 node_modules 外的所有内容（包括隐藏文件）
shopt -s dotglob  # 开启匹配隐藏文件（如 .gitignore）
for item in new-jfm-frontend/*; do
  if [ "$item" != "new-jfm-frontend/node_modules" ]; then
    git mv "$item" ./
  fi
done
shopt -u dotglob  # 关闭匹配隐藏文件

# 删除已经为空的 new-jfm-frontend 文件夹（注意：node_modules 还在里面）
git rm -r new-jfm-frontend