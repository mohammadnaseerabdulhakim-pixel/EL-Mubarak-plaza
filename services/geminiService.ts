import { GoogleGenAI } from "@google/genai";
import { Sale, Expense, Product } from '../types';

export const generateBusinessInsight = async (
  sales: Sale[],
  expenses: Expense[],
  inventory: Product[]
): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "API Key not found. Please configure the environment.";
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare data for the prompt
  const today = new Date().toISOString().split('T')[0];
  const todaysSales = sales.filter(s => s.date.startsWith(today));
  const totalSalesRevenue = todaysSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const lowStockItems = inventory.filter(p => p.stock < 10).map(p => `${p.name} (${p.size})`);

  // Format sales for prompt to be concise but informative about items
  const formattedSales = todaysSales.slice(0, 5).map(s => ({
    time: s.date.split('T')[1].substring(0, 5),
    items: s.items.map(i => `${i.name} ${i.size} (x${i.quantity})`).join(', '),
    total: s.totalAmount
  }));

  const prompt = `
    You are a business consultant for a beverage shop called 'Elmubarak Plaza'.
    Analyze the following daily data:

    Date: ${today}
    Total Sales Revenue Today: ₦${totalSalesRevenue}
    Number of Transactions Today: ${todaysSales.length}
    Low Stock Items: ${lowStockItems.join(', ') || 'None'}
    
    Recent Sales Transactions (Last 5):
    ${JSON.stringify(formattedSales)}

    Provide a concise summary in 3 bullet points:
    1. A sales performance comment.
    2. An inventory warning or advice.
    3. A tip to increase profit based on this data.
    
    Keep the tone professional yet encouraging.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Could not generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service.";
  }
};