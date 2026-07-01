import { Response } from 'express';
import { AIService } from '../services/ai.service';
import User from '../models/User';

export const getDietRecommendation = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const profile = {
      age: user.userDetails?.age,
      gender: user.userDetails?.gender,
      weight: user.userDetails?.weight,
      height: user.userDetails?.height,
      activityLevel: user.userDetails?.activityLevel,
      medicalConditions: user.userDetails?.medicalConditions,
      allergies: user.userDetails?.allergies,
      dietaryPreference: user.userDetails?.dietaryPreference,
      weightGoal: user.userDetails?.weightGoal
    };

    const recommendationText = await AIService.getDietRecommendation(profile);
    
    let recommendationJSON;
    try {
      recommendationJSON = JSON.parse(recommendationText);
    } catch {
      recommendationJSON = { rawText: recommendationText };
    }

    // Save calorie & water goals back to user profile if generated
    if (recommendationJSON.calories && user.userDetails) {
      user.userDetails.calorieGoal = Number(recommendationJSON.calories);
      await user.save();
    }

    res.status(200).json(recommendationJSON);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getWeeklyDietPlan = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    const planText = await AIService.getWeeklyDietPlan({
      weightGoal: user.userDetails?.weightGoal,
      dietaryPreference: user.userDetails?.dietaryPreference,
      calories: user.userDetails?.calorieGoal,
      allergies: user.userDetails?.allergies
    });

    let planJSON;
    try {
      planJSON = JSON.parse(planText);
    } catch {
      planJSON = { rawText: planText };
    }

    res.status(200).json(planJSON);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const generateRecipe = async (req: any, res: Response) => {
  try {
    const { ingredients, dietType } = req.body;
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Ingredients array must be provided' });
    }

    const recipeText = await AIService.generateRecipe(ingredients, dietType);
    let recipeJSON;
    try {
      recipeJSON = JSON.parse(recipeText);
    } catch {
      recipeJSON = { rawText: recipeText };
    }

    res.status(200).json(recipeJSON);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const analyzeFoodDesc = async (req: any, res: Response) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ error: 'Food description string is required' });
    }

    const analysisText = await AIService.analyzeFood(description);
    let analysisJSON;
    try {
      analysisJSON = JSON.parse(analysisText);
    } catch {
      analysisJSON = { rawText: analysisText };
    }

    res.status(200).json(analysisJSON);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const chatWithNutritionist = async (req: any, res: Response) => {
  try {
    const { message, history } = req.body; // history shape: [{role: 'user'|'model', parts: 'string'}]
    if (!message) {
      return res.status(400).json({ error: 'Chat message is required' });
    }

    const response = await AIService.chatReply(history || [], message);
    res.status(200).json({ reply: response });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
