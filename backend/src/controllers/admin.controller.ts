import { Request, Response } from 'express';
import User from '../models/User';
import Food from '../models/Food';
import Recipe from '../models/Recipe';
import Appointment from '../models/Appointment';
import Progress from '../models/Progress';

export const getPlatformStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalDietitians = await User.countDocuments({ role: { $in: ['Dietitian', 'Nutritionist'] } });
    const totalFoods = await Food.countDocuments({});
    const totalRecipes = await Recipe.countDocuments({});
    const totalAppointments = await Appointment.countDocuments({});
    const totalLogs = await Progress.countDocuments({});

    // Simple aggregate to see sum of calories consumed across all logs
    const calorieAgg = await Progress.aggregate([
      { $group: { _id: null, totalCalories: { $sum: '$totalCaloriesConsumed' } } }
    ]);
    const totalCaloriesTracked = calorieAgg[0]?.totalCalories || 0;

    res.status(200).json({
      totalUsers,
      totalDietitians,
      totalFoods,
      totalRecipes,
      totalAppointments,
      totalLogs,
      totalCaloriesTracked
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req.body;
    if (!['User', 'Dietitian', 'Nutritionist', 'Admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role selection' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted from platform' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
