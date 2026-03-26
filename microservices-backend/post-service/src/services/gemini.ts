import { GoogleGenerativeAI } from "@google/generative-ai"


const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generatePostText(prompt: string): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const result = await model.generateContent(
    `You are helping a developer write a social media post for a dev community forum.
    
        The user wants to post about: "${prompt}"

        Write an engaging post (2-4 sentences).
        - Professional but conversational tone
        - Add 2-3 relevant emojis naturally  
        - No hashtags
        - Return ONLY the post text, nothing else`
    );

  return result.response.text().trim();
}