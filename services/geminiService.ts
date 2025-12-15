
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { CareerPathway, Skill } from "../types";

const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure your environment is configured correctly.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateCareerPathway = async (goal: string, background: string): Promise<CareerPathway> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate a personalized career learning pathway for a user wanting to become a ${goal}. User background: ${background}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            goal: { type: Type.STRING },
            marketDemand: { type: Type.STRING, description: "high, medium, or low" },
            estimatedSalary: { type: Type.STRING },
            matchPercentage: { type: Type.NUMBER },
            modules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  type: { type: Type.STRING, description: "course, project, or certification" },
                  skills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  status: { type: Type.STRING, description: "not_started" }
                },
                required: ["id", "title", "description", "duration", "type", "skills", "status"]
              }
            }
          },
          required: ["id", "goal", "marketDemand", "estimatedSalary", "matchPercentage", "modules"]
        }
      }
    });

    if (!response.text) {
      throw new Error("The AI returned an empty response. Please try again.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error (Pathway):", error);
    if (error.message?.includes("429")) {
      throw new Error("The AI service is currently busy (Rate Limit). Please wait a moment and try again.");
    }
    throw new Error(error.message || "Failed to generate your personalized pathway. Please check your connection and try again.");
  }
};

export const analyzeSkillGap = async (currentSkills: string[], targetRole: string): Promise<Skill[]> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the skill gap for a ${targetRole} based on these current skills: ${currentSkills.join(', ')}. Return a list of skills with levels (0-100) and target levels.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.NUMBER },
              targetLevel: { type: Type.NUMBER },
              category: { type: Type.STRING, description: "technical, soft, or domain" }
            },
            required: ["name", "level", "targetLevel", "category"]
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No text returned from the AI.");
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error("Gemini API Error (Skill Gap):", error);
    throw new Error("Failed to analyze skill gaps. Please verify the target role and try again.");
  }
};

export const getCareerAdvice = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  try {
    const ai = getAIClient();
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are an expert career coach and industry analyst. Provide encouraging, data-driven advice to help users bridge the gap between education and employment.',
      },
    });

    const response = await chat.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that. Could you rephrase your question?";
  } catch (error: any) {
    console.error("Gemini API Error (Coach):", error);
    if (error.message?.includes("429")) {
      throw new Error("Whoops! Too many messages. Please take a quick break and I'll be back in a second.");
    }
    throw new Error("I had trouble connecting to my knowledge base. Is your internet working?");
  }
};
