import { Response } from 'express';
import Progress from '../models/Progress';

const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getProgressByDate = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const date = req.query.date?.toString() || getTodayDateString();

    let progress = await Progress.findOne({ userId, date });
    if (!progress) {
      // Create empty progress for this date
      progress = new Progress({
        userId,
        date,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: [],
        waterIntake: 0
      });
      await progress.save();
    }

    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logMeal = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { date, mealType, foodItem } = req.body; // mealType: breakfast, lunch, dinner, snacks
    const targetDate = date || getTodayDateString();

    if (!['breakfast', 'lunch', 'dinner', 'snacks'].includes(mealType)) {
      return res.status(400).json({ error: 'Invalid meal categorization type' });
    }

    let progress = await Progress.findOne({ userId, date: targetDate });
    if (!progress) {
      progress = new Progress({
        userId,
        date: targetDate,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: []
      });
    }

    const mealsObject = progress.meals as any;
    mealsObject[mealType].push(foodItem);
    await progress.save();

    res.status(200).json({ message: 'Meal logged successfully', progress });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logWater = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { date, amount } = req.body; // amount in ml
    const targetDate = date || getTodayDateString();

    let progress = await Progress.findOne({ userId, date: targetDate });
    if (!progress) {
      progress = new Progress({
        userId,
        date: targetDate,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: []
      });
    }

    progress.waterIntake = (progress.waterIntake || 0) + Number(amount);
    await progress.save();

    res.status(200).json({ message: 'Water intake logged', progress });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logWorkout = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { date, name, duration, caloriesBurned, intensity } = req.body;
    const targetDate = date || getTodayDateString();

    let progress = await Progress.findOne({ userId, date: targetDate });
    if (!progress) {
      progress = new Progress({
        userId,
        date: targetDate,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: []
      });
    }

    progress.workouts.push({ name, duration, caloriesBurned, intensity });
    await progress.save();

    res.status(200).json({ message: 'Workout logged successfully', progress });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const logVitals = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { date, weight, sleepDuration, heartRate, bloodSugar, systolic, diastolic } = req.body;
    const targetDate = date || getTodayDateString();

    let progress = await Progress.findOne({ userId, date: targetDate });
    if (!progress) {
      progress = new Progress({
        userId,
        date: targetDate,
        meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
        workouts: []
      });
    }

    if (weight !== undefined) progress.weight = Number(weight);
    if (sleepDuration !== undefined) progress.sleepDuration = Number(sleepDuration);
    if (heartRate !== undefined) progress.heartRate = Number(heartRate);
    if (bloodSugar !== undefined) progress.bloodSugar = Number(bloodSugar);
    if (systolic !== undefined && diastolic !== undefined) {
      progress.bloodPressure = { systolic: Number(systolic), diastolic: Number(diastolic) };
    }

    await progress.save();
    res.status(200).json({ message: 'Health indicators logged successfully', progress });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getProgressHistory = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const limit = Number(req.query.limit) || 7; // default last 7 entries

    const history = await Progress.find({ userId })
      .sort({ date: -1 })
      .limit(limit);

    res.status(200).json(history.reverse()); // send in chronological order
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
