import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 在 prebuild 階段會將 ../../src/data/content.json 複製到 ./data/content.json
import * as contentData from "./data/content.json";

// 從 .env 讀取 API Key (部署時 Firebase 會自動載入 .env 檔案)
// 本地測試請確保 functions/.env 存在
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export const chatWithAI = onRequest(
  {
    cors: true, // 允許所有來源 (Vercel 或 localhost) 存取
  },
  async (req, res) => {
    try {
      // 確保只接受 POST 請求
      if (req.method !== "POST") {
        res.status(405).json({ error: "Method Not Allowed" });
        return;
      }

      const { question } = req.body;
      if (!question) {
        res.status(400).json({ error: "Bad Request: Missing 'question' in body" });
        return;
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        logger.error("GEMINI_API_KEY is not set.");
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      
      // 將 content.json 轉為字串
      const backgroundKnowledge = JSON.stringify(contentData, null, 2);

      // 設定 System Prompt
      const systemPrompt = `
你是亞洲論壇影響力中心 (Impact Asia Center) 的「年會小助手」。
請根據以下提供的 JSON 背景資料回答關於 2026 年鳳凰城年會的問題。
如果資料中沒有提到使用者的問題，請引導使用者留下聯繫方式，不要自行編造答案。

背景資料：
${backgroundKnowledge}
      `.trim();

      // 初始化 Gemini 1.5 Flash，並帶入 System Prompt
      const modelConfig: any = {
        model: "gemini-1.5-flash",
        systemInstruction: systemPrompt
      };
      const model = genAI.getGenerativeModel(modelConfig);

      // 產生內容
      const result = await model.generateContent(question);
      const responseText = result.response.text();

      // 回傳結果
      res.status(200).json({ answer: responseText });
    } catch (error) {
      logger.error("Error calling Gemini API:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  }
);
