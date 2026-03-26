"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generatePostText = generatePostText;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
async function generatePostText(prompt) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`You are helping a developer write a social media post for a dev community forum.
    
        The user wants to post about: "${prompt}"

        Write an engaging post (2-4 sentences).
        - Professional but conversational tone
        - Add 2-3 relevant emojis naturally  
        - No hashtags
        - Return ONLY the post text, nothing else`);
    return result.response.text().trim();
}
