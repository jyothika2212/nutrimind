import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'User' | 'Dietitian' | 'Nutritionist' | 'Admin';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  otp?: {
    code: string;
    expiresAt: Date;
  };
  googleId?: string;
  profilePicture?: string;
  createdAt: Date;
  updatedAt: Date;
  // Specific fields for Dietitians / Nutritionists
  dietitianDetails?: {
    specialties: string[];
    experience: number; // in years
    licenseNumber: string;
    bio: string;
    rating: number;
    hourlyRate: number;
    availability: string[]; // e.g. ["Monday", "Wednesday"]
  };
  // Specific fields for Regular Users
  userDetails?: {
    age?: number;
    gender?: 'Male' | 'Female' | 'Other';
    weight?: number; // kg
    height?: number; // cm
    bmi?: number;
    activityLevel?: 'Sedentary' | 'Lightly Active' | 'Moderately Active' | 'Very Active';
    medicalConditions?: string[];
    allergies?: string[];
    dietaryPreference?: 'Vegetarian' | 'Non-Vegetarian' | 'Vegan' | 'Keto' | 'Gluten-Free';
    calorieGoal?: number;
    waterGoal?: number; // ml
    weightGoal?: 'Lose' | 'Maintain' | 'Gain';
    targetWeight?: number;
    assignedDietitian?: mongoose.Types.ObjectId;
  };
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: { type: String, enum: ['User', 'Dietitian', 'Nutritionist', 'Admin'], default: 'User' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    otp: {
      code: { type: String },
      expiresAt: { type: Date }
    },
    googleId: { type: String },
    profilePicture: { type: String, default: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' },
    dietitianDetails: {
      specialties: [{ type: String }],
      experience: { type: Number, default: 0 },
      licenseNumber: { type: String },
      bio: { type: String },
      rating: { type: Number, default: 5 },
      hourlyRate: { type: Number, default: 0 },
      availability: [{ type: String }]
    },
    userDetails: {
      age: { type: Number },
      gender: { type: String, enum: ['Male', 'Female', 'Other'] },
      weight: { type: Number },
      height: { type: Number },
      bmi: { type: Number },
      activityLevel: { type: String, enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active'] },
      medicalConditions: [{ type: String }],
      allergies: [{ type: String }],
      dietaryPreference: { type: String, enum: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Keto', 'Gluten-Free'] },
      calorieGoal: { type: Number },
      waterGoal: { type: Number, default: 2500 },
      weightGoal: { type: String, enum: ['Lose', 'Maintain', 'Gain'] },
      targetWeight: { type: Number },
      assignedDietitian: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);
