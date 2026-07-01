import { Request, Response } from 'express';
import Food from '../models/Food';

export const searchFoods = async (req: Request, res: Response) => {
  try {
    const query = req.query.q?.toString() || '';
    const category = req.query.category?.toString() || '';
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (query) {
      // Perform text search or regex matching
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ];
    }

    if (category) {
      filter.category = category;
    }

    const foods = await Food.find(filter)
      .skip(skip)
      .limit(limit);

    const total = await Food.countDocuments(filter);

    res.status(200).json({
      foods,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getFoodCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Food.distinct('category');
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createFoodItem = async (req: Request, res: Response) => {
  try {
    const foodData = req.body;
    const newFood = new Food(foodData);
    await newFood.save();
    res.status(201).json({ message: 'Food item created successfully', food: newFood });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
