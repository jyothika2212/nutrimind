import mongoose, { Schema, Document } from 'mongoose';

export interface IFood extends Document {
  name: string;
  calories: number; // kcal per serving
  protein: number; // g
  fat: number; // g
  carbs: number; // g
  fiber: number; // g
  sugar: number; // g
  sodium: number; // mg
  potassium: number; // mg
  vitaminA: number; // mcg
  vitaminC: number; // mg
  iron: number; // mg
  calcium: number; // mg
  servingSize: string; // e.g. "100g", "1 cup"
  category: string; // e.g. "Vegetables", "Fruits", "Grains", "Dairy", "Protein"
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FoodSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    fat: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fiber: { type: Number, default: 0 },
    sugar: { type: Number, default: 0 },
    sodium: { type: Number, default: 0 },
    potassium: { type: Number, default: 0 },
    vitaminA: { type: Number, default: 0 },
    vitaminC: { type: Number, default: 0 },
    iron: { type: Number, default: 0 },
    calcium: { type: Number, default: 0 },
    servingSize: { type: String, required: true, default: '100g' },
    category: { type: String, required: true },
    image: { type: String, default: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' }
  },
  { timestamps: true }
);

FoodSchema.index({ name: 'text' });

export default mongoose.model<IFood>('Food', FoodSchema);
