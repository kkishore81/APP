
import type { ParsedExpense } from '../types';

export const parseExpenseFromString = async (prompt: string, members: string[]): Promise<ParsedExpense | null> => {
  if (!prompt) {
    return null;
  }
  
  try {
    const response = await fetch('/api/parse-expense', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, members }),
    });

    if (!response.ok) {
      console.error("API call failed with status:", response.status);
      return null;
    }

    const data = await response.json();
    return data as ParsedExpense;

  } catch (error) {
    console.error("Error calling parse expense endpoint:", error);
    return null;
  }
};