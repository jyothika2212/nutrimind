import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Food from '../models/Food';
import Recipe from '../models/Recipe';
import Appointment from '../models/Appointment';
import Progress from '../models/Progress';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutrimind';

const mockFoods = [
  {
    name: 'Oats (Cooked)',
    calories: 120,
    protein: 4,
    fat: 2.5,
    carbs: 22,
    fiber: 4,
    sugar: 0.5,
    sodium: 2,
    potassium: 115,
    servingSize: '100g',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Whole Egg (Boiled)',
    calories: 155,
    protein: 13,
    fat: 11,
    carbs: 1.1,
    fiber: 0,
    sugar: 1.1,
    sodium: 124,
    potassium: 126,
    servingSize: '100g',
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Chicken Breast (Grilled)',
    calories: 165,
    protein: 31,
    fat: 3.6,
    carbs: 0,
    fiber: 0,
    sugar: 0,
    sodium: 74,
    potassium: 256,
    servingSize: '100g',
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Paneer (Cottage Cheese)',
    calories: 265,
    protein: 18,
    fat: 20,
    carbs: 3.5,
    fiber: 0,
    sugar: 2.6,
    sodium: 15,
    potassium: 90,
    servingSize: '100g',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Wheat Roti (Chapatis)',
    calories: 260,
    protein: 8,
    fat: 3,
    carbs: 52,
    fiber: 7,
    sugar: 0.5,
    sodium: 4,
    potassium: 130,
    servingSize: '100g',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'White Rice (Cooked)',
    calories: 130,
    protein: 2.7,
    fat: 0.3,
    carbs: 28,
    fiber: 0.4,
    sugar: 0.1,
    sodium: 1,
    potassium: 35,
    servingSize: '100g',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1536304997881-a372c179924b?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Yellow Dal (Cooked)',
    calories: 116,
    protein: 7,
    fat: 3.5,
    carbs: 15,
    fiber: 4.5,
    sugar: 1,
    sodium: 180,
    potassium: 160,
    servingSize: '100g',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Broccoli (Steamed)',
    calories: 35,
    protein: 2.8,
    fat: 0.4,
    carbs: 7,
    fiber: 2.6,
    sugar: 1.7,
    sodium: 33,
    potassium: 316,
    servingSize: '100g',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Banana',
    calories: 89,
    protein: 1.1,
    fat: 0.3,
    carbs: 23,
    fiber: 2.6,
    sugar: 12,
    sodium: 1,
    potassium: 358,
    servingSize: '100g',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Apple',
    calories: 52,
    protein: 0.3,
    fat: 0.2,
    carbs: 14,
    fiber: 2.4,
    sugar: 10,
    sodium: 1,
    potassium: 107,
    servingSize: '100g',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=60'
  }
];

const mockRecipes = [
  {
    name: 'High Protein Paneer & Oats Bowl',
    ingredients: ['100g Paneer', '50g Oats', '1 cup almond milk', '1 Banana', 'Honey'],
    cookingSteps: [
      'Boil oats in almond milk for 5 minutes until soft.',
      'Cut paneer into small cubes and toast lightly on a pan.',
      'Layer toasted paneer and sliced banana over the cooked oats.',
      'Drizzle a tablespoon of honey on top and serve hot.'
    ],
    calories: 450,
    protein: 22,
    fat: 14,
    carbs: 58,
    cuisine: 'Indian',
    preparationTime: 10,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Lemon Grilled Chicken with Broccoli',
    ingredients: ['150g Chicken Breast', '100g Broccoli', '1 Lemon', 'Olive Oil', 'Black Pepper', 'Garlic'],
    cookingSteps: [
      'Marinate chicken breast with lemon juice, salt, minced garlic, and pepper for 10 minutes.',
      'Heat oil in a grill pan and sear chicken for 6 minutes each side.',
      'Steam broccoli florets in a container with a splash of water for 3 minutes.',
      'Serve chicken hot alongside steamed broccoli.'
    ],
    calories: 320,
    protein: 48,
    fat: 8,
    carbs: 7,
    cuisine: 'Global',
    preparationTime: 20,
    dietType: 'Non-Vegetarian',
    image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60'
  }
];

const seed = async () => {
  try {
    console.log('Seeding Database Started...');
    try {
      await mongoose.connect(MONGODB_URI);
      console.log('Connected to Atlas DB for seeding.');
    } catch (atlasError) {
      console.warn('Atlas DB Connection failed. Trying local MongoDB fallback...');
      await mongoose.connect('mongodb://127.0.0.1:27017/nutrimind');
      console.log('Connected to Local MongoDB for seeding.');
    }

    // Clear existing
    await User.deleteMany({});
    await Food.deleteMany({});
    await Recipe.deleteMany({});
    await Appointment.deleteMany({});
    await Progress.deleteMany({});

    console.log('Cleared existing data.');

    // Create standard users
    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('nutri123', salt);

    const dietitianId = new mongoose.Types.ObjectId();
    const userId = new mongoose.Types.ObjectId();

    const users = [
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'NutriMind Admin',
        email: 'admin@nutrimind.ai',
        password: commonPassword,
        role: 'Admin',
        isVerified: true
      },
      {
        _id: dietitianId,
        name: 'Dr. Sarah Miller',
        email: 'sarah@nutrimind.ai',
        password: commonPassword,
        role: 'Dietitian',
        isVerified: true,
        dietitianDetails: {
          specialties: ['Weight Loss', 'Keto Diet', 'Diabetes Management'],
          experience: 8,
          licenseNumber: 'LIC-DIET-8871',
          bio: 'Dr. Sarah has over 8 years experience helping clients lose weight and reclaim vitality through customized organic plans.',
          rating: 4.9,
          hourlyRate: 50,
          availability: ['Monday', 'Wednesday', 'Friday']
        }
      },
      {
        _id: userId,
        name: 'Manoj Kumar',
        email: 'manoj@example.com',
        password: commonPassword,
        role: 'User',
        isVerified: true,
        userDetails: {
          age: 28,
          gender: 'Male',
          weight: 78,
          height: 175,
          bmi: 25.47,
          activityLevel: 'Moderately Active',
          medicalConditions: [],
          allergies: ['Gluten'],
          dietaryPreference: 'Vegetarian',
          calorieGoal: 2100,
          waterGoal: 3000,
          weightGoal: 'Lose',
          targetWeight: 70,
          assignedDietitian: dietitianId
        }
      }
    ];

    await User.insertMany(users);
    console.log('Seeded Users: Admin, Dietitian, User.');

    // Seed foods
    await Food.insertMany(mockFoods);
    console.log(`Seeded ${mockFoods.length} Food items.`);

    // Seed recipes
    await Recipe.insertMany(mockRecipes);
    console.log(`Seeded ${mockRecipes.length} Recipe items.`);

    // Seed mock progress tracker for user
    const dateString = new Date().toISOString().split('T')[0];
    const progress = new Progress({
      userId: userId,
      date: dateString,
      waterIntake: 1250,
      weight: 78,
      sleepDuration: 7.5,
      meals: {
        breakfast: [
          {
            name: 'Oats (Cooked)',
            calories: 120,
            protein: 4,
            carbs: 22,
            fat: 2.5,
            servingSize: '100g',
            quantity: 2
          }
        ],
        lunch: [],
        dinner: [],
        snacks: []
      },
      workouts: [
        {
          name: 'Jogging',
          duration: 30,
          caloriesBurned: 240,
          intensity: 'Medium'
        }
      ]
    });
    await progress.save();
    console.log('Seeded User Daily Progress Tracker.');

    console.log('\x1b[32mSeeding Database Completed Successfully!\x1b[0m');
    process.exit(0);
  } catch (error) {
    console.error('Seeder failed:', error);
    process.exit(1);
  }
};

seed();
