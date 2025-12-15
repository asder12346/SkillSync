
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI, Type } from "@google/genai";
import { CareerPathway, Skill } from "../types";

export const generateCareerPathway = async (goal: string, background: string): Promise<CareerPathway> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

  return JSON.parse(response.text);
};

export const analyzeSkillGap = async (currentSkills: string[], targetRole: string): Promise<Skill[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
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

  return JSON.parse(response.text);
};

export const getCareerAdvice = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are an expert career coach and industry analyst. Provide encouraging, data-driven advice to help users bridge the gap between education and employment.',
    },
    // Note: Use initial contents if needed, but SDK chat handles history in sendMessage
  });

  // Re-assembling history for the Chat API if needed, but sendMessage handles context
  const response = await chat.sendMessage({ message });
  return response.text;
};
