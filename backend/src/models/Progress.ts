import mongoose, { Schema, Document } from 'mongoose';

export interface IMealLog {
  foodId?: mongoose.Types.ObjectId;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
  quantity: number;
}

export interface IWorkoutLog {
  name: string;
  duration: number; // in minutes
  caloriesBurned: number;
  intensity: 'Low' | 'Medium' | 'High';
}

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  date: string; // YYYY-MM-DD format for easy daily queries
  waterIntake: number; // ml
  weight?: number; // kg
  sleepDuration?: number; // hours
  heartRate?: number; // bpm
  bloodSugar?: number; // mg/dL
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  meals: {
    breakfast: IMealLog[];
    lunch: IMealLog[];
    dinner: IMealLog[];
    snacks: IMealLog[];
  };
  workouts: IWorkoutLog[];
  totalCaloriesConsumed: number;
  totalProteinConsumed: number;
  totalCarbsConsumed: number;
  totalFatConsumed: number;
  totalCaloriesBurned: number;
  createdAt: Date;
  updatedAt: Date;
}

const MealLogSchema = new Schema({
  foodId: { type: Schema.Types.ObjectId, ref: 'Food' },
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 },
  servingSize: { type: String, default: '100g' },
  quantity: { type: Number, default: 1 }
});

const WorkoutLogSchema = new Schema({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  caloriesBurned: { type: Number, required: true },
  intensity: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' }
});

const ProgressSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    waterIntake: { type: Number, default: 0 },
    weight: { type: Number },
    sleepDuration: { type: Number },
    heartRate: { type: Number },
    bloodSugar: { type: Number },
    bloodPressure: {
      systolic: { type: Number },
      diastolic: { type: Number }
    },
    meals: {
      breakfast: [MealLogSchema],
      lunch: [MealLogSchema],
      dinner: [MealLogSchema],
      snacks: [MealLogSchema]
    },
    workouts: [WorkoutLogSchema],
    totalCaloriesConsumed: { type: Number, default: 0 },
    totalProteinConsumed: { type: Number, default: 0 },
    totalCarbsConsumed: { type: Number, default: 0 },
    totalFatConsumed: { type: Number, default: 0 },
    totalCaloriesBurned: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Compound index to guarantee one document per user per day
ProgressSchema.index({ userId: 1, date: 1 }, { unique: true });

// Pre-save hook to calculate total macros
ProgressSchema.pre('save', function (next) {
  const self = this as any as IProgress;
  
  let calories = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  
  const categories: ('breakfast' | 'lunch' | 'dinner' | 'snacks')[] = ['breakfast', 'lunch', 'dinner', 'snacks'];
  for (const cat of categories) {
    if (self.meals[cat]) {
      for (const item of self.meals[cat]) {
        calories += (item.calories || 0) * (item.quantity || 1);
        protein += (item.protein || 0) * (item.quantity || 1);
        carbs += (item.carbs || 0) * (item.quantity || 1);
        fat += (item.fat || 0) * (item.quantity || 1);
      }
    }
  }
  
  let burned = 0;
  if (self.workouts) {
    for (const w of self.workouts) {
      burned += w.caloriesBurned || 0;
    }
  }
  
  self.totalCaloriesConsumed = calories;
  self.totalProteinConsumed = protein;
  self.totalCarbsConsumed = carbs;
  self.totalFatConsumed = fat;
  self.totalCaloriesBurned = burned;
  
  next();
});

export default mongoose.model<IProgress>('Progress', ProgressSchema);
