import "dotenv/config";
import express from "express";
import OpenAI from "openai";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const imageModel = process.env.OPENAI_IMAGE_MODEL || "gpt-image-2";

app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    hasApiKey: Boolean(process.env.OPENAI_API_KEY),
    imageModel
  });
});

function cleanWord(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 80);
}

app.post("/api/generate-image", async (req, res) => {
  const word = cleanWord(req.body?.word);
  const meaning = cleanWord(req.body?.meaning);

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "服务器没有配置 OPENAI_API_KEY。请复制 .env.example 为 .env 并填入 API Key。"
    });
  }
  if (!word) {
    return res.status(400).json({ error: "请输入英文单词。" });
  }

  const prompt = `
Create one memorable educational vocabulary image for the English word "${word}".
Chinese meaning/context: "${meaning || "not provided"}".

Goal: help a learner remember the meaning through a strong visual association.
Show one clear, concrete real-world scene that naturally represents the word.
Use vivid but tasteful colors, strong composition, natural lighting, and a friendly premium educational illustration/photo aesthetic.
Avoid unrelated objects, confusing symbolism, watermarks, logos, and long text.
Do not put the English word or Chinese translation in the image unless it is naturally part of the scene.
Square composition, centered subject, suitable for a vocabulary flashcard.
`;

  try {
    const result = await client.images.generate({
      model: imageModel,
      prompt,
      size: "1024x1024",
      quality: "medium"
    });

    const item = result?.data?.[0];
    if (!item?.b64_json) {
      return res.status(502).json({ error: "图片 API 没有返回可显示的图片。" });
    }

    res.json({
      ok: true,
      word,
      image: `data:image/png;base64,${item.b64_json}`,
      model: imageModel
    });
  } catch (err) {
    console.error(err);
    const message = err?.error?.message || err?.message || "OpenAI 图片生成失败";
    res.status(500).json({ error: message });
  }
});

app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api/")) {
    return res.sendFile(path.join(__dirname, "public", "index.html"));
  }
  next();
});

app.listen(port, () => {
  console.log(`WordLens AI running at http://localhost:${port}`);
});
