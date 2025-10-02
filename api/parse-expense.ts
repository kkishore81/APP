// This is a Vercel Serverless Function for the Node.js runtime.
// It will be deployed at the `/api/parse-expense` endpoint.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';

// This function will be executed on the server, so it's safe to use the API key here.
// process.env.API_KEY is securely provided by Vercel's environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { prompt, members } = req.body;

        if (!prompt || !members || !Array.isArray(members) || members.length === 0) {
            return res.status(400).json({ error: 'Missing prompt or members' });
        }
        
        const systemInstruction = `You are an expert at parsing expense strings. From the user's text, extract the expense description, total amount, who paid, and who the expense should be split with. The available group members are: [${members.join(', ')}].
        - The 'paidBy' field MUST be one of the provided member names.
        - The 'splitWith' array MUST ONLY contain names from the provided member list.
        - If any piece of information is unclear, return null for that specific field.
        - If the user says "everyone" or "all of us", split with all available members.
        - If the user mentions "me", assume it refers to the member named 'You'.
        - Provide the amount as a number, without currency symbols.
        - Be very precise.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Parse this expense: "${prompt}"`,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        description: { type: Type.STRING, description: "A brief description of the expense (e.g., 'Dinner', 'Groceries')." },
                        totalAmount: { type: Type.NUMBER, description: "The total cost of the expense as a number." },
                        paidBy: { type: Type.STRING, description: `The name of the person who paid. Must be one of [${members.join(', ')}].` },
                        splitWith: {
                            type: Type.ARRAY,
                            description: `An array of names to split the expense with. Must only contain names from [${members.join(', ')}].`,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["description", "totalAmount", "paidBy", "splitWith"],
                },
            },
        });
        
        const jsonText = response.text.trim();
        if (jsonText) {
            // Parse the JSON string from Gemini and send it as a JSON response
            return res.status(200).json(JSON.parse(jsonText));
        }
        return res.status(500).json({ error: 'Failed to parse expense from API response' });

    } catch (error) {
        console.error("Error in serverless function:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}