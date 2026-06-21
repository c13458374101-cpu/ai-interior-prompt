# StudioRender Offline Translate Service

这个服务用于把网页里的“关键细节 / 关键词”从中文离线翻译为英文，不消耗 OpenAI API token。

## 服务器要求

- Ubuntu 22.04 / 24.04
- 2 核 CPU
- 4GB 内存
- Docker

## 构建

在项目根目录执行：

```bash
docker build -t studiorender-translate ./translate-service
```

## 运行

先生成一个足够长的密钥，例如：

```bash
openssl rand -hex 32
```

启动服务：

```bash
docker run -d \
  --name studiorender-translate \
  --restart unless-stopped \
  -p 8088:8088 \
  -e TRANSLATE_API_SECRET=替换成你的密钥 \
  studiorender-translate
```

第一次请求会自动下载并安装 Argos Translate 的中文到英文模型，所以首次翻译可能较慢。

## 测试

```bash
curl -X POST http://127.0.0.1:8088/translate \
  -H "Content-Type: application/json" \
  -H "X-Translate-Secret: 替换成你的密钥" \
  -d '{"text":"保留原始墙体结构，增加木饰面和隐藏灯带","source":"zh","target":"en"}'
```

正常返回：

```json
{"translatedText":"Keep the original wall structure, add wood veneer and hidden light strips"}
```

实际翻译结果会根据 Argos 模型略有差异。

## Vercel 环境变量

在 Vercel 项目的 Environment Variables 添加：

```text
TRANSLATE_API_URL=http://你的香港服务器IP:8088/translate
TRANSLATE_API_SECRET=替换成你的密钥
```

如果后续绑定域名并配置 HTTPS，把 `TRANSLATE_API_URL` 改成：

```text
TRANSLATE_API_URL=https://你的域名/translate
```

配置完成后需要 Redeploy 一次 Vercel 项目。
