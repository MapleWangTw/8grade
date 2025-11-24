import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, QuestionType, SubjectTopic } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Define the JSON schema for the question generation
const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    content: {
      type: Type.STRING,
      description: "The question text in Traditional Chinese.",
    },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Array of 4 options if it is a choice question. Empty array if calculation or explanation.",
    },
    answer: {
      type: Type.STRING,
      description: "The correct answer key or value.",
    },
    explanation: {
      type: Type.STRING,
      description: "Detailed step-by-step explanation in Traditional Chinese.",
    },
  },
  required: ["content", "answer", "explanation"],
};

export const generateQuestion = async (topic: SubjectTopic, type: QuestionType): Promise<Question> => {
  const model = "gemini-2.5-flash";
  
  let promptDetails = "";
  switch (type) {
    case QuestionType.CHOICE:
      promptDetails = "Generate a multiple-choice question with 4 distinct options.";
      break;
    case QuestionType.CALCULATION:
      promptDetails = "Generate a numerical calculation problem relevant to 8th grade physics. Ensure numbers are clean (integers or simple decimals). Provide the numerical answer.";
      break;
    case QuestionType.EXPLANATION:
      promptDetails = "Generate a conceptual question asking 'Why' or 'How'. The user needs to explain a phenomenon (e.g., why sound travels faster in solids, how a convex lens forms an image).";
      break;
    case QuestionType.ANALYSIS:
      promptDetails = "Generate a question based on experimental data or a graph scenario. Describe the data/graph in text and ask for an interpretation.";
      break;
  }

  const prompt = `
    You are a strict and professional Physics/Chemistry teacher for Grade 8 students in Taiwan (Junior High School).
    Create a "${type}" practice problem about "${topic}".
    
    ${promptDetails}

    Language: Traditional Chinese (Taiwan).
    Difficulty: Moderate (Midterm Exam level).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: questionSchema,
        systemInstruction: "You are a Taiwanese Junior High School Science Teacher specializing in the Grade 8 curriculum (Nan-I, Han-Lin, Kang-Hsuan versions).",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    return {
      id: Date.now().toString(),
      type: type,
      topic: topic,
      content: data.content,
      options: data.options && data.options.length > 0 ? data.options : undefined,
      answer: data.answer,
      explanation: data.explanation,
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback mock data if API fails or key is missing (dev mode safety)
    return {
      id: "error-fallback",
      type: type,
      topic: topic,
      content: "目前無法連接 AI 題庫，請檢查 API Key 或稍後再試。(這是預設題目)",
      options: ["選項 A", "選項 B", "選項 C", "選項 D"],
      answer: "選項 A",
      explanation: "系統連線錯誤，請稍後再試。",
    };
  }
};
