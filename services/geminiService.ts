
import { GoogleGenAI, Type, Modality } from "@google/genai";

export const getAIWordSuggestions = async (word: string, sourceLang: string) => {
  if (!process.env.API_KEY) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide translations for the word "${word}" in 4 languages: English, Assamese, Tai Khamyang, and one other relevant regional language (like Hindi or Bengali). 
      Format the response as JSON.
      Target languages: English, Assamese, Tai Khamyang, and "additionalLang" (the 4th language). 
      Also provide a pronunciation guide, a short example sentence in the primary language, and the "sentenceMeaning" (translation/meaning of that sentence in English/Assamese).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            english: { type: Type.STRING },
            assamese: { type: Type.STRING },
            taiKhamyang: { type: Type.STRING },
            additionalLang: { type: Type.STRING, description: "A fourth regional language translation" },
            pronunciation: { type: Type.STRING },
            exampleSentence: { type: Type.STRING },
            sentenceMeaning: { type: Type.STRING, description: "The translation or explanation of the example sentence" }
          },
          required: ["english", "assamese", "taiKhamyang", "additionalLang", "exampleSentence", "sentenceMeaning"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return null;
  }
};

export const getAIPronunciation = async (word: string) => {
  if (!process.env.API_KEY || !word) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide only a short phonetic text-based pronunciation guide for the English word "${word}". 
      Keep it simple for non-native speakers. Example: for "Knowledge" return "No-ledge".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pronunciation: { type: Type.STRING }
          },
          required: ["pronunciation"]
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.pronunciation;
  } catch (error) {
    console.error("Pronunciation API Error:", error);
    return null;
  }
};

export const generateAIVoice = async (text: string): Promise<string | null> => {
  if (!process.env.API_KEY || !text) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say cheerfully: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("TTS API Error:", error);
    return null;
  }
};

export const generateSmsMessage = async (otp: string): Promise<string> => {
  if (!process.env.API_KEY) return `Your TaiHub verification code is ${otp}. Please do not share this with anyone.`;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a realistic, professional SMS message for a login OTP. The code is ${otp}. 
      The app name is "TaiHub Dictionary". Keep it under 100 characters. 
      Format: "Your [App] code is [Code]. [Security Warning]."`,
    });
    return response.text.trim();
  } catch (error) {
    return `Your TaiHub verification code is ${otp}. Do not share this code.`;
  }
};

/**
 * generateWordImage
 * @param context - Object containing translations to give AI the best context
 */
export const generateWordImage = async (context: { english: string; assamese: string; tai: string; category?: string }): Promise<string | null> => {
  if (!process.env.API_KEY || !context.english) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A cinematic, ultra-high-quality professional photograph representing the concept of "${context.english}" (Assamese: "${context.assamese}", Tai Khamyang: "${context.tai}").
    CULTURAL CONTEXT & ART STYLE:
    - This is for the Tai Khamyang (Shyam) community of Upper Assam/Northeast India.
    - VISUAL STYLE: Realistic documentary photography, National Geographic aesthetic, soft warm natural lighting, shallow depth of field.
    - AUTHENTIC ELEMENTS: Lush tropical Assam landscape (rainforests, tea gardens), traditional bamboo/stilt architecture (Chang-ghar), authentic hand-woven ethnic textiles (silk/cotton), Buddhist cultural motifs.
    - COMPOSITION: Sharp focus on the subject, vibrant colors, clear textures.
    - STRICT RULES: No text, no distorted human anatomy, no watermarks, no low-quality or cartoonish styles.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};

export const searchTaiHeritage = async (query: string) => {
  if (!process.env.API_KEY || !query) return null;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Research the following topic related to Tai Khamyang (Shyam) culture, history, or heritage: "${query}".
      Provide detailed information in both English and Assamese.
      Explain the cultural significance of this topic.
      Suggest 3-5 related topics for further exploration.
      Format the response as JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            englishContent: { type: Type.STRING },
            assameseContent: { type: Type.STRING },
            culturalSignificance: { type: Type.STRING },
            relatedTopics: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING }
            }
          },
          required: ["title", "englishContent", "assameseContent", "culturalSignificance", "relatedTopics"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Heritage Research Error:", error);
    return null;
  }
};
