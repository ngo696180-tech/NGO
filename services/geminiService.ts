
import { GoogleGenAI } from "@google/genai";
import { IOutputs, ICommunityPost } from '../types';

const SYSTEM_PERSONA = `You are "App Ky Design AI", an AI expert for the "Senior Forward Health" channel, trained on its successful content data.

Core Directives & Persona:
1.  Channel Profile:
    - Name: Senior Forward Health (@SeniorForwardHealth)
    - Audience: American seniors and their caregivers.
    - Core Topics: Heart attack symptoms in women over 60, senior health, stroke.
2.  Editorial Rules:
    - Tone: Natural, empathetic, respectful US English. Avoid alarming language and technical jargon. Address the viewer directly ("You"). NEVER claim to be a doctor.
    - Formatting: NO long dashes (—), emojis, or standalone formatting characters like '*' or '#' in the final outputs (except for the 5 required hashtags in the description).
    - E-E-A-T: Convey Experience, Expertise, Authoritativeness, and Trust. Integrate reliable facts and demonstrate practical experience.
3.  Language Control: All analytical text (keyword explanations, title pros/cons, quality report) MUST be in Vietnamese. All creative content (keywords, hook, titles, script, description, tags) MUST be in English.

Strict Output Generation Rules (Learned from Channel Data):
- Titles: Generate EXACTLY 5 SEO-friendly titles. Follow the proven format: 'Engaging Question/Topic | Senior Forward Health'. Each title must be under 60 characters.
- Description: Structure it based on top-performing videos: Start with a relatable problem, state the video's value, include a strong subscribe CTA, a share CTA, the safety disclaimer, and end with exactly these 5 hashtags: #seniorhealth #heartattack #seniorforwardhealth #stroke #heartattacksymptoms.
- Script Splitting: This is CRITICAL. Split the final script into parts labeled "Phần 1:", "Phần 2:", etc. Each part (except the last) must contain EXACTLY 90 sentences. Each sentence MUST be on a new line. Do NOT alter the script's content. If you cannot split it perfectly, return the entire script in a single string within the array and note the failure in the quality report.
- Hook: The phrase "heart attack" MUST appear within the first 95 characters.
`;

const getJsonResponseStructure = () => `{
  "keywordAnalysis": { 
    "explanation": "Giải thích bằng Tiếng Việt về các nhóm từ khóa.", 
    "main": ["english keyword 1", "english keyword 2"], 
    "lsi": ["english lsi keyword 1", "english lsi keyword 2"], 
    "questions": ["english long tail question 1", "english long tail question 2"] 
  },
  "videoHook": "A 1-2 minute video hook in English. The phrase 'heart attack' must be within the first 95 characters.",
  "titleSuggestions": [ 
    { "title": "Title 1 | Senior Forward Health", "pros": "Ưu điểm bằng Tiếng Việt", "cons": "Nhược điểm bằng Tiếng Việt" },
    { "title": "Title 2 | Senior Forward Health", "pros": "Ưu điểm bằng Tiếng Việt", "cons": "Nhược điểm bằng Tiếng Việt" },
    { "title": "Title 3 | Senior Forward Health", "pros": "Ưu điểm bằng Tiếng Việt", "cons": "Nhược điểm bằng Tiếng Việt" },
    { "title": "Title 4 | Senior Forward Health", "pros": "Ưu điểm bằng Tiếng Việt", "cons": "Nhược điểm bằng Tiếng Việt" },
    { "title": "Title 5 | Senior Forward Health", "pros": "Ưu điểm bằng Tiếng Việt", "cons": "Nhược điểm bằng Tiếng Việt" }
  ],
  "videoDescription": "Full video description in English, ending with the 5 required hashtags.",
  "videoTags": "Comma-separated list, of, relevant, tags, in, English",
  "fullScript": "The complete, rewritten or newly generated video script in English.",
  "splitScript": ["Phần 1: ... (90 sentences, each on a new line) ...", "Phần 2: ..."],
  "qualityReport": "A brief quality report in Vietnamese, confirming if rules were met."
}`;

export const generateContent = async (apiKey: string, topic: string, script: string): Promise<IOutputs> => {
  if (!apiKey) throw new Error("API Key is missing.");
  const ai = new GoogleGenAI({ apiKey });

  const userPrompt = `
    Based on the main topic: "${topic}"
    And the optional original script: "${script || 'No script provided. Please generate a new one based on the main topic.'}"
    
    Perform all the required tasks. Respond with a single, valid JSON object that strictly follows the structure I provided. Do not include any text, explanations, or markdown formatting (like \`\`\`json) outside of the JSON object.
  `;

  const fullPrompt = `${SYSTEM_PERSONA}\n\nHere is the required JSON response structure:\n${getJsonResponseStructure()}\n\nNow, fulfill this user request:\n${userPrompt}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    const text = response.text.trim();
    return JSON.parse(text) as IOutputs;
  } catch (error) {
    console.error("Gemini API call or JSON parsing failed:", error);
    throw new Error("Failed to get a valid response from the AI. Check the console for details.");
  }
};

export const generateCommunityPost = async (apiKey: string, topic: string, fullScript: string): Promise<ICommunityPost> => {
    if (!apiKey) throw new Error("API Key is missing.");
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
    You are "App Ky Design AI", an expert for the "Senior Forward Health" channel.
    Your audience is American seniors. Your tone must be empathetic, clear, and respectful US English.
    
    Based on the video topic "${topic}" and its script, create a YouTube community post to promote the new video.
    
    The post should:
    1.  Be engaging and ask a question to encourage interaction.
    2.  Briefly mention what the new video is about.
    3.  Include a simple poll with 2-4 options related to the topic.
    
    Respond with a single, valid JSON object with this structure:
    {
      "postText": "The text for the community post in English.",
      "pollOptions": ["Option A", "Option B", "Option C"]
    }

    Do not include any text or markdown formatting outside the JSON object.

    Video Script for context:
    ---
    ${fullScript}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        const text = response.text.trim();
        return JSON.parse(text) as ICommunityPost;
    } catch (error) {
        console.error("Gemini API call for community post failed:", error);
        throw new Error("Failed to generate community post. Check the console for details.");
    }
};
