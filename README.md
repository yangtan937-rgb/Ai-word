# WordLens AI：前端 + Node.js + OpenAI 生图 API

## 1. 准备 Node.js

建议 Node.js 20+。

检查：
```bash
node -v
npm -v
```

## 2. 安装依赖

在项目根目录运行：

```bash
npm install
```

## 3. 配置 API Key

复制：

```bash
cp .env.example .env
```

Windows PowerShell：

```powershell
Copy-Item .env.example .env
```

然后编辑 `.env`：

```env
OPENAI_API_KEY=你的_OpenAI_API_Key
OPENAI_IMAGE_MODEL=gpt-image-2
PORT=3000
```

API Key 不要放进 `public/index.html`，也不要提交到 GitHub。

## 4. 启动

```bash
npm start
```

浏览器打开：

http://localhost:3000

## 5. 工作方式

浏览器输入单词
→ POST /api/generate-image
→ Node.js 服务器读取 OPENAI_API_KEY
→ 调用 OpenAI Images API
→ 得到 base64 图片
→ 返回 data:image/png;base64,... 给前端
→ 网页显示图片。

## 6. 如果 gpt-image-2 不可用

打开 `.env`，把：

OPENAI_IMAGE_MODEL=gpt-image-2

改成你的 OpenAI 项目当前可用的 GPT Image 模型，然后重启服务器。

## 7. 部署

这个项目可以部署到支持 Node.js 的服务器/平台。部署时不要上传 `.env`；在平台的 Environment Variables / Secrets 中设置 OPENAI_API_KEY。

## 安全提醒

示例项目没有做生产级用户鉴权、计费、复杂限流或持久化图片存储。如果公开给大量用户使用，应继续增加登录、速率限制、配额、日志、图片对象存储等。
