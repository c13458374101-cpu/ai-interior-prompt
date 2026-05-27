# AI 室内设计 Prompt 生成器

一个基于 Next.js 的 AI 室内设计 Prompt 生成器，支持关键词输入、AI 优化、复制 Prompt 和生成可分享链接。

## 本地运行

```bash
npm install
npm run dev
```

打开：

```text
http://localhost:3000
```

## OpenAI API 配置

不要把 API Key 写进代码，也不要提交 `.env.local`。

本地创建 `.env.local`：

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-5.4-mini
```

Vercel 部署时，在项目后台的 Environment Variables 里添加：

```text
OPENAI_API_KEY
OPENAI_MODEL
```

`OPENAI_MODEL` 可以使用默认值：

```text
gpt-5.4-mini
```

## 部署到 Vercel

1. 注册并登录 GitHub。
2. 创建一个新的 GitHub 仓库。
3. 把本项目提交并推送到 GitHub。
4. 登录 Vercel，选择用 GitHub 登录。
5. 在 Vercel 中导入这个 GitHub 仓库。
6. Framework Preset 选择 Next.js。
7. 添加环境变量 `OPENAI_API_KEY` 和 `OPENAI_MODEL`。
8. 点击 Deploy。

部署完成后会得到类似这样的公开网址：

```text
https://your-project-name.vercel.app
```

## 注意事项

- `.env.local` 已被 `.gitignore` 排除，不会进入仓库。
- 分享链接只保存页面配置，不包含 OpenAI API Key。
- OpenAI API 请求只在 Next.js 服务端接口中执行，不会把 Key 暴露到浏览器。
