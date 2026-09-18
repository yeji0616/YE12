import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "season-trip-backend" });
});

// AI Travel Consultant Endpoint
app.post("/api/ai-travel-consultant", async (req: Request, res: Response) => {
  try {
    const { month, travelers, tripStyle, duration, question, prompt: customPrompt } = req.body;

    const userQuery = customPrompt || question || "시기별 최적의 해외여행지 추천";
    const detectedMonth = month || (typeof userQuery === 'string' && userQuery.match(/(\d{1,2})월/) ? parseInt(userQuery.match(/(\d{1,2})월/)![1], 10) : null);

    const ai = getGeminiClient();

    if (!ai) {
      // Fallback when API key is not configured in secrets
      const targetM = detectedMonth || 9;
      return res.json({
        success: true,
        source: "curated-fallback",
        recommendations: [
          {
            destination: targetM >= 6 && targetM <= 8 ? "스위스 인터라켄" : targetM >= 12 || targetM <= 2 ? "베트남 다낭" : targetM >= 9 && targetM <= 11 ? "체코 프라하" : "일본 교토",
            country: targetM >= 6 && targetM <= 8 ? "스위스" : targetM >= 12 || targetM <= 2 ? "베트남" : targetM >= 9 && targetM <= 11 ? "체코" : "일본",
            reason: `${targetM}월은 온화하고 맑은 기후가 이어져 도심 산책과 자연 경관 감상에 1년 중 가장 이상적인 황금기입니다.`,
            weather: "평균 기온 18~24℃, 쾌적하고 맑은 날씨 지속",
            highlights: ["도심 핵심 랜드마크 탐방", "현지 제철 미식 투어", "자연 경관 및 인생샷 명소"],
            packingTip: "일교차에 대비한 얇은 겉옷과 편안한 트래킹화, 자외선 차단제",
            budgetLevel: "스탠다드",
          },
          {
            destination: targetM >= 5 && targetM <= 9 ? "인도네시아 발리" : "필리핀 보라카이",
            country: targetM >= 5 && targetM <= 9 ? "인도네시아" : "필리핀",
            reason: "화창한 건기 시즌으로 에메랄드빛 바다 시야가 맑고 습도가 낮아 쾌적한 힐링 휴양을 즐길 수 있습니다.",
            weather: "평균 26~29℃, 시원한 바닷바람과 낮은 강수량",
            highlights: ["오션뷰 인피니티 풀 힐링", "선셋 세일링 및 호핑 투어", "신선한 해산물 바비큐"],
            packingTip: "수영복, 린넨 셔츠, 선글라스, 방수팩",
            budgetLevel: "알뜰",
          }
        ],
        advice: `${targetM}월 여행은 출발 2~3개월 전 항공권과 숙소를 예약하시면 가장 합리적인 비용으로 다녀오실 수 있습니다.`,
        message: "현재 기본 큐레이션 추천이 제공되었습니다. 더 상세한 실시간 AI 맞춤 추천은 Gemini API Key 설정 후 이용하실 수 있습니다.",
      });
    }

    const promptText = `당신은 세계 각국의 기후, 축제, 최적의 여행 시기에 정통한 전문 해외여행 컨설턴트입니다.
사용자의 질문과 여행 조건에 맞춰 가장 추천하는 해외 여행지 2~3곳과 구체적인 이유를 제안해주세요.

[사용자 요청]
- 질문 내용: ${userQuery}
${detectedMonth ? `- 감지된 여행 시기: ${detectedMonth}월` : ''}
${travelers ? `- 동행자: ${travelers}` : ''}
${tripStyle ? `- 여행 스타일: ${tripStyle}` : ''}

다음 JSON 규격으로만 응답해주세요 (마크다운 백틱 코드블록 없이 순수 JSON만 반환):
{
  "recommendations": [
    {
      "destination": "도시명 (예: 다낭)",
      "country": "국가명 (예: 베트남)",
      "reason": "해당 시기에 가야 하는 구체적인 이유 (날씨, 축제, 건기/우기 특성 등)",
      "weather": "그 시기 날씨 및 기온 요약 (예: 22~28℃, 맑고 건기)",
      "highlights": ["추천 스팟 또는 할 일 1", "스팟 2", "스팟 3"],
      "packingTip": "해당 시기 맞춤 옷차림 및 준비물 팁",
      "budgetLevel": "알뜰 | 스탠다드 | 럭셔리"
    }
  ],
  "advice": "해당 시기 항공권 예약 팁이나 여행 준비 조언 1~2문장"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const responseText = response.text || "{}";
    try {
      const parsed = JSON.parse(responseText);
      return res.json({
        success: true,
        source: "gemini",
        ...parsed,
      });
    } catch (parseError) {
      return res.json({
        success: true,
        source: "gemini-text",
        rawText: responseText,
      });
    }
  } catch (error: any) {
    console.error("AI Consultant API error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "여행 추천 생성 중 오류가 발생했습니다.",
    });
  }
});

// Vite middleware setup
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SeasonTrip server running at http://0.0.0.0:${PORT}`);
  });
}

start();
