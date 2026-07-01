import mongoose, { Schema, Document } from 'mongoose';

export interface IRecipe extends Document {
  name: string;
  ingredients: string[];
  cookingSteps: string[];
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  cuisine: string; // e.g. "Indian", "Italian", "Mexican"
  preparationTime: number; // minutes
  dietType: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free';
  image?: string;
  ratings: {
    userId: mongoose.Types.ObjectId;
    score: number; // 1 to 5
    comment?: string;
    createdAt: Date;
  }[];
  averageRating: number;
  bookmarks: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    ingredients: [{ type: String, required: true }],
    cookingSteps: [{ type: String, required: true }],
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    cuisine: { type: String, default: 'Global' },
    preparationTime: { type: Number, default: 20 },
    dietType: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Gluten-Free'], default: 'Vegetarian' },
    image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
    ratings: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        score: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    averageRating: { type: Number, default: 5 },
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
);

RecipeSchema.index({ name: 'text', cuisine: 'text' });

export default mongoose.model<IRecipe>('Recipe', RecipeSchema);
