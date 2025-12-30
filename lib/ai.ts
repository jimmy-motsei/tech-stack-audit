import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize lazily or check inside function to verify key presence at runtime
const genAI = process.env.GOOGLE_GEMINI_API_KEY 
  ? new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY) 
  : null;

export async function generateAIResponse(prompt: string): Promise<string> {
  if (!genAI) {
    throw new Error('Missing GOOGLE_GEMINI_API_KEY environment variable');
  }
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}
