import { Response } from 'express';
import User from '../models/User';
import Appointment from '../models/Appointment';
import MealPlan from '../models/MealPlan';

export const getDietitians = async (req: any, res: Response) => {
  try {
    const dietitians = await User.find(
      { role: { $in: ['Dietitian', 'Nutritionist'] } },
      'name email profilePicture dietitianDetails'
    );
    res.status(200).json(dietitians);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const assignDietitian = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { dietitianId } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User profile not found' });

    const dietitian = await User.findById(dietitianId);
    if (!dietitian || !['Dietitian', 'Nutritionist'].includes(dietitian.role)) {
      return res.status(400).json({ error: 'Selected dietitian is invalid' });
    }

    if (user.userDetails) {
      user.userDetails.assignedDietitian = dietitianId;
      await user.save();
    }

    res.status(200).json({ message: 'Dietitian assigned successfully', user });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getClients = async (req: any, res: Response) => {
  try {
    const dietitianId = req.user.id;

    // Find users whose assigned dietitian is the logging in dietitian
    const clients = await User.find(
      { 'userDetails.assignedDietitian': dietitianId },
      'name email profilePicture userDetails'
    );

    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createAppointment = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const { dietitianId, date, duration, notes } = req.body;

    const meetingLink = `https://meet.jit.si/NutriMind-${Math.random().toString(36).substring(2, 10)}`;

    const newAppt = new Appointment({
      userId,
      dietitianId,
      date,
      duration,
      notes,
      videoLink: meetingLink,
      status: 'Pending'
    });

    await newAppt.save();
    res.status(201).json({ message: 'Appointment requested successfully', appointment: newAppt });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getAppointments = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};
    if (role === 'User') {
      query = { userId };
    } else if (role === 'Dietitian' || role === 'Nutritionist') {
      query = { dietitianId: userId };
    } else {
      // Admin gets all appointments
      query = {};
    }

    const appointments = await Appointment.find(query)
      .populate('userId', 'name email profilePicture')
      .populate('dietitianId', 'name email profilePicture dietitianDetails')
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateAppointmentStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Approved, Cancelled, Completed

    const appt = await Appointment.findById(id);
    if (!appt) {
      return res.status(404).json({ error: 'Appointment not found' });
    }

    appt.status = status;
    await appt.save();

    res.status(200).json({ message: `Appointment status set to ${status}`, appointment: appt });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createMealPlan = async (req: any, res: Response) => {
  try {
    const creatorId = req.user.id;
    const { userId, title, startDate, endDate, days, totalCaloriesLimit } = req.body;

    const newPlan = new MealPlan({
      title,
      userId,
      creatorId,
      startDate,
      endDate,
      days,
      totalCaloriesLimit
    });

    await newPlan.save();
    res.status(201).json({ message: 'Meal Plan assigned to client successfully', plan: newPlan });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getMealPlans = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};
    if (role === 'User') {
      query = { userId, status: 'Active' };
    } else {
      query = { creatorId: userId };
    }

    const plans = await MealPlan.find(query)
      .populate('userId', 'name email')
      .populate('creatorId', 'name email dietitianDetails')
      .sort({ createdAt: -1 });

    res.status(200).json(plans);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};
