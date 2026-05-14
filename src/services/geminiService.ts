import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

export interface AIPrediction {
  coinId: string;
  prediction: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  targetPrice: number;
  rationale: string;
}

export async function getMarketPrediction(coinId: string, currentPrice: number, marketData: any): Promise<AIPrediction | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following market data for ${coinId} and provide a trading prediction.
      Current Price: $${currentPrice}
      Market Data: ${JSON.stringify(marketData)}
      
      Respond in JSON format.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            coinId: { type: Type.STRING },
            prediction: { type: Type.STRING, enum: ["bullish", "bearish", "neutral"] },
            confidence: { type: Type.NUMBER },
            targetPrice: { type: Type.NUMBER },
            rationale: { type: Type.STRING }
          },
          required: ["coinId", "prediction", "confidence", "targetPrice", "rationale"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Prediction Error:", error);
    return null;
  }
}

export async function getInvestmentInsights(portfolio: any[]): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a high-end crypto analyst. Review this portfolio and provide 3-5 sharp, futuristic investment insights or warnings. Portfolio: ${JSON.stringify(portfolio)}`,
      config: {
        systemInstruction: "You are an elite, cyberpunk-themed crypto analyst. Use technical but professional language. Keep it concise."
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Insights Error:", error);
    return "Unable to generate insights at this time.";
  }
}
