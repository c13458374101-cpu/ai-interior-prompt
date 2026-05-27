# GitHub + Vercel 上线步骤

## 1. 注册账号

- GitHub: https://github.com
- Vercel: https://vercel.com

Vercel 建议直接使用 GitHub 登录。

## 2. 安装 Git

这台电脑当前没有检测到 `git` 命令。先安装 Git：

https://git-scm.com/download/win

安装完成后，重新打开终端，进入项目目录：

```powershell
cd C:\Users\24979\Documents\Codex\2026-05-26\new-chat-9
```

检查：

```powershell
git --version
```

## 3. 初始化并提交代码

```powershell
git init
git add .
git commit -m "first commit"
```

`.env.local` 已经被 `.gitignore` 排除，不会上传。

## 4. 创建 GitHub 仓库

在 GitHub 创建一个新仓库，例如：

```text
ai-interior-prompt
```

不要勾选自动生成 README，因为项目里已经有 README。

## 5. 推送到 GitHub

把下面命令里的 `YOUR_USERNAME` 换成你的 GitHub 用户名：

```powershell
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-interior-prompt.git
git push -u origin main
```

## 6. Vercel 导入项目

1. 打开 https://vercel.com
2. 使用 GitHub 登录
3. 点击 Add New Project
4. 选择 `ai-interior-prompt`
5. Framework Preset 保持 Next.js
6. 添加 Environment Variables：

```text
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-5.4-mini
```

7. 点击 Deploy

## 7. 上线后

Vercel 会生成公开网址，例如：

```text
https://ai-interior-prompt.vercel.app
```

之后每次你把代码推送到 GitHub，Vercel 会自动重新部署。
