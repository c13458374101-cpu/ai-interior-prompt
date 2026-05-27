# 香港/新加坡 VPS 部署方案

适用目标：让中国大陆用户比 Vercel 更稳定地访问。

## 推荐服务器

优先选择香港或新加坡节点：

- 腾讯云轻量应用服务器 Lighthouse，地区选香港或新加坡
- 阿里云轻量应用服务器，地区选香港或新加坡
- 其他支持 Docker 的香港/新加坡 VPS

基础配置建议：

```text
2 核 CPU
2GB 内存
40GB 硬盘
Ubuntu 22.04 或 Ubuntu 24.04
```

## 服务器初始化

SSH 登录服务器后执行：

```bash
sudo apt update
sudo apt install -y git ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable --now docker
```

## 拉取项目

```bash
git clone https://github.com/c13458374101-cpu/ai-interior-prompt.git
cd ai-interior-prompt
```

## 配置环境变量

```bash
cp .env.production.example .env.production
nano .env.production
```

填入：

```env
OPENAI_API_KEY=你的 OpenAI API Key
OPENAI_MODEL=gpt-5.4-mini
```

保存后退出。

## 启动网站

```bash
sudo docker compose up -d --build
```

检查：

```bash
sudo docker compose ps
curl http://127.0.0.1:3000
```

如果云服务器安全组已放行 3000 端口，可以先用：

```text
http://服务器公网IP:3000
```

访问。

## 正式域名和 HTTPS

建议后续绑定域名，并用 Nginx Proxy Manager、Caddy 或 Nginx 配 HTTPS。

最简单的 Caddy 示例：

```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install -y caddy
```

Caddyfile：

```text
your-domain.com {
  reverse_proxy 127.0.0.1:3000
}
```

重启：

```bash
sudo systemctl reload caddy
```

## 更新网站

以后本地推送 GitHub 后，在服务器执行：

```bash
cd ai-interior-prompt
git pull
sudo docker compose up -d --build
```

## 注意

- `.env.production` 不要提交到 GitHub。
- 服务器必须能访问 OpenAI API，否则 AI 优化仍然不可用。
- 香港/新加坡节点通常不需要备案；国内大陆节点通常需要备案。
