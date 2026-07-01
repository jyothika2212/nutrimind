import mongoose, { Schema, Document } from 'mongoose';

export interface IMealPlanItem {
  foodName: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface IMealPlan extends Document {
  title: string;
  userId: mongoose.Types.ObjectId; // Assigned User
  creatorId: mongoose.Types.ObjectId; // Dietitian who created it
  startDate: Date;
  endDate: Date;
  days: {
    dayOfWeek: string; // e.g. "Monday", "Tuesday"
    breakfast: IMealPlanItem[];
    lunch: IMealPlanItem[];
    dinner: IMealPlanItem[];
    snacks: IMealPlanItem[];
    notes?: string;
  }[];
  totalCaloriesLimit: number;
  status: 'Active' | 'Archived';
  createdAt: Date;
  updatedAt: Date;
}

const MealPlanItemSchema = new Schema({
  foodName: { type: String, required: true },
  serving: { type: String, default: '1 serving' },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 },
  carbs: { type: Number, default: 0 },
  fat: { type: Number, default: 0 }
});

const MealPlanSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    days: [
      {
        dayOfWeek: { type: String, required: true },
        breakfast: [MealPlanItemSchema],
        lunch: [MealPlanItemSchema],
        dinner: [MealPlanItemSchema],
        snacks: [MealPlanItemSchema],
        notes: { type: String }
      }
    ],
    totalCaloriesLimit: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Archived'], default: 'Active' }
  },
  { timestamps: true }
);

export default mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);
