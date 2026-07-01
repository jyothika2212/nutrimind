import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Standard Gemini client initialization
const apiKey = process.env.GEMINI_API_KEY || '';
let genAI: GoogleGenerativeAI | null = null;

if (apiKey) {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
  } catch (err) {
    console.error('Error initializing GoogleGenerativeAI:', (err as Error).message);
  }
}

export class AIService {
  private static getModel() {
    if (!genAI) {
      throw new Error('Gemini AI is not initialized. Please verify GEMINI_API_KEY in the backend .env configuration.');
    }
    // gemini-2.5-flash is fast, reliable and works great for structured text returns.
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * AI Diet recommendation based on profile stats
   */
  static async getDietRecommendation(profile: {
    age?: number;
    gender?: string;
    weight?: number;
    height?: number;
    activityLevel?: string;
    medicalConditions?: string[];
    allergies?: string[];
    dietaryPreference?: string;
    weightGoal?: string;
  }): Promise<string> {
    try {
      const model = this.getModel();
      const prompt = `
        Act as an elite Senior Clinical Dietitian and AI Nutritionist.
        Analyze this client profile:
        - Age: ${profile.age || 'N/A'} years old
        - Gender: ${profile.gender || 'N/A'}
        - Current Weight: ${profile.weight || 'N/A'} kg
        - Height: ${profile.height || 'N/A'} cm
        - Activity Level: ${profile.activityLevel || 'N/A'}
        - Weight Goal: ${profile.weightGoal || 'N/A'}
        - Medical Conditions: ${(profile.medicalConditions || []).join(', ') || 'None'}
        - Allergies: ${(profile.allergies || []).join(', ') || 'None'}
        - Dietary Preference: ${profile.dietaryPreference || 'Any'}

        Provide a structured JSON response containing:
        1. Recommended Daily Calorie Intake (Target)
        2. Macronutrient Distribution (Protein %, Carbs %, Fats % with brief explanation)
        3. 3 core dietary guidelines based on their medical conditions/allergies.
        4. 3 specific items to avoid.
        5. A sample daily menu breakdown (Breakfast, Lunch, Dinner, Snacks).

        Ensure the response is formatted as valid JSON ONLY. Do not write markdown tags outside the JSON block.
      `;

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return this.cleanJSONResponse(text);
    } catch (error) {
      console.error('Gemini getDietRecommendation failed:', (error as Error).message);
      return JSON.stringify({
        calories: 2000,
        macros: { protein: 25, carbs: 50, fat: 25 },
        guidelines: ['Drink plenty of water', 'Focus on whole foods'],
        avoid: ['Excess refined sugar'],
        sampleMenu: { breakfast: 'Oatmeal', lunch: 'Salad with grilled chicken', dinner: 'Baked salmon with steamed broccoli', snacks: 'Almonds' }
      });
    }
  }

  /**
   * Generates a complete 7-day Weekly Diet plan
   */
  static async getWeeklyDietPlan(profile: {
    weightGoal?: string;
    dietaryPreference?: string;
    calories?: number;
    allergies?: string[];
  }): Promise<string> {
    try {
      const model = this.getModel();
      const prompt = `
        Generate a detailed 7-day healthy weekly diet meal plan for a user whose goal is ${profile.weightGoal || 'Maintain Weight'}, dietary preference is ${profile.dietaryPreference || 'Vegetarian'}, calories target is ${profile.calories || 2000} kcal/day, and has allergies to: ${(profile.allergies || []).join(', ') || 'None'}.
        For each day (Monday to Sunday), outline:
        - Breakfast (Meal and approximate Calories)
        - Lunch (Meal and approximate Calories)
        - Dinner (Meal and approximate Calories)
        - Snacks (Meal and approximate Calories)

        Return this as a structured JSON array representing the week. Keep it valid JSON. No pre-amble.
      `;
      const result = await model.generateContent(prompt);
      return this.cleanJSONResponse(result.response.text());
    } catch (error) {
      console.error('Gemini getWeeklyDietPlan failed:', (error as Error).message);
      return JSON.stringify([
        { day: 'Monday', breakfast: 'Oats & Berries', lunch: 'Quinoa Bowl', dinner: 'Tofu stir-fry', snacks: 'Apple slice' }
      ]);
    }
  }

  /**
   * Custom Recipe Generator
   */
  static async generateRecipe(ingredients: string[], dietType?: string): Promise<string> {
    try {
      const model = this.getModel();
      const prompt = `
        Create a healthy recipe using these base ingredients: ${ingredients.join(', ')}.
        Preferred Diet Type: ${dietType || 'Vegetarian'}.

        Provide a structured response:
        - Recipe Name
        - Preparation Time (minutes)
        - Cooking Steps (numbered list)
        - Approximate Calories & Macros (Protein, Carbs, Fats)

        Return in clean, structured JSON format.
      `;
      const result = await model.generateContent(prompt);
      return this.cleanJSONResponse(result.response.text());
    } catch (error) {
      console.error('Gemini generateRecipe failed:', (error as Error).message);
      return JSON.stringify({
        name: 'Mixed Salad Bowl',
        prepTime: 10,
        steps: ['Chop ingredients', 'Mix together', 'Season with salt and pepper'],
        nutrition: { calories: 250, protein: 5, carbs: 12, fat: 20 }
      });
    }
  }

  /**
   * AI Food Analyzer from descriptive text
   */
  static async analyzeFood(description: string): Promise<string> {
    try {
      const model = this.getModel();
      const prompt = `
        Estimate the calories, protein (g), carbs (g), fat (g), fiber (g), and sugar (g) for the following food item or meal description: "${description}".
        Provide your best nutritional estimate for a single standard serving.
        
        Return a valid JSON object ONLY:
        {
          "foodName": "estimated name",
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number,
          "sugar": number,
          "servingSize": "estimated serving size"
        }
      `;
      const result = await model.generateContent(prompt);
      return this.cleanJSONResponse(result.response.text());
    } catch (error) {
      console.error('Gemini analyzeFood failed:', (error as Error).message);
      return JSON.stringify({
        foodName: description,
        calories: 300,
        protein: 10,
        carbs: 40,
        fat: 10,
        fiber: 3,
        sugar: 8,
        servingSize: '1 serving'
      });
    }
  }

  /**
   * Nutrition chatbot helper
   */
  static async chatReply(chatHistory: { role: 'user' | 'model'; parts: string }[], message: string): Promise<string> {
    try {
      const model = this.getModel();
      
      // Gemini's startChat history must begin with a 'user' message.
      // We filter out any leading greeting messages from the 'model'.
      const firstUserIndex = chatHistory.findIndex(h => h.role === 'user');
      const filteredHistory = firstUserIndex !== -1 ? chatHistory.slice(firstUserIndex) : [];

      // Form chat state
      const chat = model.startChat({
        history: filteredHistory.map(h => ({
          role: h.role,
          parts: [{ text: h.parts }]
        })),
        generationConfig: {
          maxOutputTokens: 1000
        }
      });
      const result = await chat.sendMessage(message);
      return result.response.text();
    } catch (error) {
      console.error('Gemini chatReply failed:', (error as Error).message);
      return 'I am sorry, I am experiencing temporary difficulties analyzing your diet right now. Please try again shortly!';
    }
  }

  /**
   * Helper to strip any markdown wrappers that LLMs sometimes add (e.g. ```json ... ```)
   */
  private static cleanJSONResponse(text: string): string {
    let clean = text.trim();
    if (clean.startsWith('```json')) {
      clean = clean.substring(7);
    } else if (clean.startsWith('```')) {
      clean = clean.substring(3);
    }
    if (clean.endsWith('```')) {
      clean = clean.substring(0, clean.length - 3);
    }
    return clean.trim();
  }
}
