
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Server, ServerStatus } from "../types";

const genAI = new GoogleGenerativeAI(process.env.VITE_API_KEY || "");

export const discoverServers = async (query: string) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Find 3 to 5 recent and active private gaming servers based on this query: "${query}".
    Focus on finding: Title, IP/Domain, Game Version, and a short description.
    Return the data in a clear list format.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Note: Grounding metadata is not available in the free tier or basic usage
    return {
      text,
      sources: [] // Simplified, as grounding requires specific setup
    };
  } catch (error) {
    console.error("AI Discovery Error:", error);
    throw error;
  }
};

export const parseAiResponseToServers = async (aiText: string): Promise<Partial<Server>[]> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `Extract server entities from this text as a JSON array. Each server should have title, shortDescription, ip, version, gameId (choose one: g1 for Lineage, g2 for GTA RP, g3 for CRMP).

Text: ${aiText}

Return only valid JSON array.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Remove any markdown formatting if present
    const jsonText = text.replace(/```json\n?|\n?```/g, '').trim();

    return JSON.parse(jsonText || "[]");
  } catch (error) {
    console.error("AI Parse Error:", error);
    return [];
  }
};
