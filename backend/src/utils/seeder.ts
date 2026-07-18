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
  },
  {
    name: 'Idli (Steamed)',
    calories: 120,
    protein: 4,
    fat: 0.5,
    carbs: 25,
    fiber: 2,
    sugar: 0.5,
    sodium: 150,
    potassium: 60,
    servingSize: '2 pieces (100g)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Masala Dosa',
    calories: 168,
    protein: 3.9,
    fat: 3.7,
    carbs: 29,
    fiber: 1.5,
    sugar: 0.8,
    sodium: 320,
    potassium: 110,
    servingSize: '1 medium (150g)',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Almonds',
    calories: 579,
    protein: 21,
    fat: 49,
    carbs: 22,
    fiber: 12,
    sugar: 4.3,
    sodium: 1,
    potassium: 733,
    servingSize: '100g',
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Greek Yogurt',
    calories: 59,
    protein: 10,
    fat: 0.4,
    carbs: 3.6,
    fiber: 0,
    sugar: 3.2,
    sodium: 36,
    potassium: 141,
    servingSize: '100g',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Grilled Salmon',
    calories: 206,
    protein: 22,
    fat: 12,
    carbs: 0,
    fiber: 0,
    sugar: 0,
    sodium: 61,
    potassium: 363,
    servingSize: '100g',
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1485921325814-a50431496cc9?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Avocado',
    calories: 160,
    protein: 2,
    fat: 15,
    carbs: 9,
    fiber: 7,
    sugar: 0.7,
    sodium: 7,
    potassium: 485,
    servingSize: '100g',
    category: 'Fruits',
    image: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Sweet Potato (Baked)',
    calories: 90,
    protein: 2,
    fat: 0.2,
    carbs: 21,
    fiber: 3.3,
    sugar: 6,
    sodium: 36,
    potassium: 475,
    servingSize: '100g',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Mixed Salad',
    calories: 25,
    protein: 1.5,
    fat: 0.2,
    carbs: 5,
    fiber: 2.2,
    sugar: 2,
    sodium: 45,
    potassium: 220,
    servingSize: '100g',
    category: 'Vegetables',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Quinoa (Cooked)',
    calories: 120,
    protein: 4.4,
    fat: 1.9,
    carbs: 21,
    fiber: 2.8,
    sugar: 0.9,
    sodium: 7,
    potassium: 172,
    servingSize: '100g',
    category: 'Grains',
    image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Tofu (Firm)',
    calories: 144,
    protein: 17,
    fat: 8,
    carbs: 2.8,
    fiber: 1.2,
    sugar: 0.5,
    sodium: 12,
    potassium: 240,
    servingSize: '100g',
    category: 'Protein',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
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
  },
  {
    name: 'Oatmeal Banana Pancakes',
    ingredients: ['1 cup Rolled Oats', '2 ripe Bananas', '2 Eggs', '1/2 cup Almond Milk', '1 tsp Cinnamon'],
    cookingSteps: [
      'Blend all ingredients in a blender until smooth.',
      'Heat a non-stick skillet over medium heat and grease lightly with butter.',
      'Pour batter in small circles and cook until bubbles form, then flip.',
      'Cook for 2 more minutes until golden brown and serve with fresh berries.'
    ],
    calories: 350,
    protein: 12,
    fat: 6,
    carbs: 62,
    cuisine: 'American',
    preparationTime: 15,
    dietType: 'Gluten-Free',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Keto Avocado Chicken Salad',
    ingredients: ['150g Shredded Chicken', '1 ripe Avocado', '2 tbsp Mayonnaise', '1 tbsp Lemon Juice', 'Celery'],
    cookingSteps: [
      'Dice the avocado and celery into small pieces.',
      'In a bowl, mix the mayonnaise, lemon juice, salt, and pepper.',
      'Fold in the shredded chicken, avocado, and celery.',
      'Chill for 10 minutes before serving on lettuce wraps.'
    ],
    calories: 450,
    protein: 34,
    fat: 32,
    carbs: 6,
    cuisine: 'Mexican',
    preparationTime: 10,
    dietType: 'Keto',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Quinoa Vegetable Stir Fry',
    ingredients: ['1 cup Quinoa', '1 Bell Pepper', '1 Zucchini', '2 tbsp Soy Sauce', '1 tbsp Sesame Oil'],
    cookingSteps: [
      'Rinse quinoa and boil in 2 cups of water for 15 minutes.',
      'Chop bell pepper and zucchini into thin strips.',
      'Heat sesame oil in a wok and stir-fry the vegetables for 5 minutes.',
      'Toss in the cooked quinoa and soy sauce, stirring for 2 minutes.'
    ],
    calories: 310,
    protein: 10,
    fat: 7,
    carbs: 52,
    cuisine: 'Asian',
    preparationTime: 20,
    dietType: 'Vegan',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Healthy Paneer Butter Masala',
    ingredients: ['150g Paneer', '2 Tomatoes', '1 Onion', '1/2 cup Greek Yogurt', '1 tsp Kasuri Methi'],
    cookingSteps: [
      'Boil chopped onions and tomatoes, then blend into a smooth puree.',
      'Cook the puree with ginger-garlic paste and spices for 8 minutes.',
      'Lower the heat, stir in Greek yogurt instead of heavy cream.',
      'Add paneer cubes and simmer for 3 minutes. Garnish with kasuri methi.'
    ],
    calories: 380,
    protein: 18,
    fat: 26,
    carbs: 18,
    cuisine: 'Indian',
    preparationTime: 25,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Baked Garlic Herb Salmon',
    ingredients: ['150g Salmon Fillet', '2 cloves Garlic', '1 tbsp Olive Oil', 'Dill Leaves', 'Lemon slices'],
    cookingSteps: [
      'Preheat oven to 400°F (200°C).',
      'Rub salmon with olive oil, minced garlic, salt, and pepper.',
      'Top with fresh dill and thin lemon slices.',
      'Bake for 12-15 minutes until salmon flakes easily with a fork.'
    ],
    calories: 420,
    protein: 36,
    fat: 28,
    carbs: 2,
    cuisine: 'Mediterranean',
    preparationTime: 15,
    dietType: 'Gluten-Free',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Mediterranean Chickpea Salad',
    ingredients: ['1 can Chickpeas', '1 Cucumber', '10 Cherry Tomatoes', '50g Feta Cheese', 'Olive Oil'],
    cookingSteps: [
      'Rinse and drain chickpeas thoroughly.',
      'Dice cucumber and halve cherry tomatoes.',
      'Toss chickpeas, cucumber, tomatoes, and crumbled feta in a large bowl.',
      'Drizzle with olive oil and a squeeze of fresh lemon juice.'
    ],
    calories: 290,
    protein: 11,
    fat: 12,
    carbs: 35,
    cuisine: 'Mediterranean',
    preparationTime: 10,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Keto Spinach Egg Muffins',
    ingredients: ['6 Eggs', '1 cup Fresh Spinach', '50g Cheddar Cheese', '1/4 cup heavy cream', 'Salt & Pepper'],
    cookingSteps: [
      'Preheat oven to 375°F (190°C) and grease a muffin pan.',
      'Whisk eggs, heavy cream, salt, and pepper in a bowl.',
      'Divide chopped spinach and cheese evenly among muffin cups.',
      'Pour egg mixture over and bake for 18-20 minutes until set.'
    ],
    calories: 260,
    protein: 16,
    fat: 20,
    carbs: 3,
    cuisine: 'American',
    preparationTime: 25,
    dietType: 'Keto',
    image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Vegan French Lentil Soup',
    ingredients: ['1 cup Brown Lentils', '1 Carrot', '1 Celery Stalk', '1 Onion', 'Vegetable Broth'],
    cookingSteps: [
      'Sauté diced onion, carrot, and celery in a pot until soft.',
      'Add rinsed lentils and 4 cups of vegetable broth.',
      'Bring to a boil, then cover and simmer for 30 minutes.',
      'Season with salt, pepper, and fresh parsley before serving.'
    ],
    calories: 240,
    protein: 15,
    fat: 2,
    carbs: 41,
    cuisine: 'French',
    preparationTime: 40,
    dietType: 'Vegan',
    image: 'https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Tofu Scramble with Spinach',
    ingredients: ['200g Firm Tofu', '1 cup Baby Spinach', '1/2 tsp Turmeric', '1 tbsp nutritional yeast', 'Olive Oil'],
    cookingSteps: [
      'Crumble tofu with a fork or hands into egg-like pieces.',
      'Heat oil in a skillet and add turmeric, salt, and crumbled tofu.',
      'Stir-fry for 5 minutes, then add spinach and nutritional yeast.',
      'Cook for 2 more minutes until spinach is wilted and serve hot.'
    ],
    calories: 210,
    protein: 18,
    fat: 12,
    carbs: 8,
    cuisine: 'Global',
    preparationTime: 12,
    dietType: 'Vegan',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Chicken Tikka Skewers',
    ingredients: ['200g Chicken Breast', '1/2 cup Yogurt', '1 tbsp Tikka Masala Powder', '1 Bell Pepper', '1 Onion'],
    cookingSteps: [
      'Cut chicken, bell pepper, and onions into bite-sized squares.',
      'Marinate chicken in yogurt and tikka masala spices for 15 minutes.',
      'Thread chicken and vegetables alternately onto wooden skewers.',
      'Grill on a hot pan or oven at 400°F for 15 minutes, turning occasionally.'
    ],
    calories: 340,
    protein: 42,
    fat: 9,
    carbs: 12,
    cuisine: 'Indian',
    preparationTime: 30,
    dietType: 'Non-Vegetarian',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3e73ae83b?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Mexican Bean & Rice Bowl',
    ingredients: ['1/2 cup Brown Rice', '1/2 cup Black Beans', '1/2 cup Corn', 'Salsa', 'Cilantro'],
    cookingSteps: [
      'Boil brown rice until fully tender.',
      'Warm the black beans and corn in a small pan with cumin.',
      'Layer brown rice at the bottom of a serving bowl.',
      'Add beans, corn, fresh salsa, and garnish with cilantro.'
    ],
    calories: 410,
    protein: 12,
    fat: 3,
    carbs: 80,
    cuisine: 'Mexican',
    preparationTime: 20,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Greek Yogurt Berry Parfait',
    ingredients: ['200g Greek Yogurt', '1/2 cup Mixed Berries', '2 tbsp Granola', '1 tsp Honey'],
    cookingSteps: [
      'Spoon half the Greek yogurt into a glass.',
      'Add a layer of mixed berries and granola.',
      'Add the remaining yogurt and top with remaining berries.',
      'Drizzle honey on top and enjoy immediately.'
    ],
    calories: 280,
    protein: 20,
    fat: 5,
    carbs: 38,
    cuisine: 'Greek',
    preparationTime: 5,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Spaghetti Squash Carbonara',
    ingredients: ['1 Spaghetti Squash', '50g Bacon', '1 Egg', '1/4 cup Parmesan', 'Black Pepper'],
    cookingSteps: [
      'Cut squash in half, remove seeds, and roast at 400°F for 35 minutes.',
      'Use a fork to scrape the squash flesh into strands.',
      'Cook bacon in a pan until crispy, then toss in squash strands.',
      'Turn off heat, stir in whisked egg and parmesan quickly to create sauce.'
    ],
    calories: 360,
    protein: 18,
    fat: 24,
    carbs: 16,
    cuisine: 'Italian',
    preparationTime: 45,
    dietType: 'Keto',
    image: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Grilled Tofu with Asparagus',
    ingredients: ['200g Firm Tofu', '100g Asparagus', '1 tbsp Soy Sauce', '1 tsp Sesame Seeds', 'Olive Oil'],
    cookingSteps: [
      'Press tofu to remove excess water, then slice into slabs.',
      'Marinate tofu in soy sauce and ginger powder for 5 minutes.',
      'Grill tofu slices and asparagus in a pan with olive oil for 5 minutes.',
      'Garnish with toasted sesame seeds and serve.'
    ],
    calories: 230,
    protein: 18,
    fat: 12,
    carbs: 10,
    cuisine: 'Asian',
    preparationTime: 15,
    dietType: 'Vegan',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Berry Chia Seed Pudding',
    ingredients: ['3 tbsp Chia Seeds', '1 cup Almond Milk', '1 tsp Vanilla extract', 'Maple Syrup', 'Blueberries'],
    cookingSteps: [
      'In a jar, whisk chia seeds, almond milk, vanilla, and maple syrup.',
      'Let sit for 5 minutes, stir again, then cover and refrigerate for 2 hours.',
      'Once thickened to a pudding consistency, top with fresh blueberries.',
      'Serve cold as a nutritious snack or breakfast.'
    ],
    calories: 190,
    protein: 6,
    fat: 9,
    carbs: 22,
    cuisine: 'Global',
    preparationTime: 120,
    dietType: 'Vegan',
    image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Nutritious Vegetable Khichdi',
    ingredients: ['1/2 cup Moong Dal', '1/2 cup Rice', 'Mixed vegetables (Carrot, Peas)', 'Ghee', 'Cumin'],
    cookingSteps: [
      'Wash rice and moong dal together and drain.',
      'Heat ghee in a pressure cooker, splutter cumin seeds, and sauté vegetables.',
      'Add rice, dal, turmeric, salt, and 3.5 cups of water.',
      'Close cooker and cook for 3 whistles until soft and mushy.'
    ],
    calories: 320,
    protein: 12,
    fat: 6,
    carbs: 54,
    cuisine: 'Indian',
    preparationTime: 25,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Shrimp Stir Fry with Zoodle Noodles',
    ingredients: ['150g Shrimp', '2 Zucchini (spiralized)', '2 cloves Garlic', '1 tbsp Soy Sauce', 'Olive Oil'],
    cookingSteps: [
      'Sauté minced garlic in a wok with olive oil for 1 minute.',
      'Add shrimp and cook for 3-4 minutes until pink.',
      'Add spiralized zucchini noodles (zoodles) and stir-fry for 2 minutes.',
      'Stir in soy sauce, toss well, and serve immediately.'
    ],
    calories: 280,
    protein: 28,
    fat: 14,
    carbs: 9,
    cuisine: 'Asian',
    preparationTime: 15,
    dietType: 'Keto',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Lentil Shepherd Pie',
    ingredients: ['1 cup Brown Lentils', '2 Potatoes', '1 cup Peas & Carrots mix', 'Tomato Paste', 'Butter'],
    cookingSteps: [
      'Boil potatoes and mash with a splash of milk, butter, and salt.',
      'Cook brown lentils in vegetable broth with tomato paste and vegetables.',
      'Transfer cooked lentil mixture to a baking dish.',
      'Spread mashed potatoes on top and bake at 375°F for 20 minutes until golden.'
    ],
    calories: 390,
    protein: 16,
    fat: 8,
    carbs: 64,
    cuisine: 'British',
    preparationTime: 40,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Beef and Broccoli Stir Fry',
    ingredients: ['150g Beef strips', '1 cup Broccoli florets', '1 tbsp Oyster Sauce', 'Ginger', 'Sesame Oil'],
    cookingSteps: [
      'Sauté minced ginger in sesame oil for 1 minute.',
      'Add beef strips and stir-fry on high heat for 4 minutes.',
      'Toss in broccoli florets and oyster sauce, cooking for 3 minutes.',
      'Serve hot as a high-protein dinner.'
    ],
    calories: 460,
    protein: 38,
    fat: 26,
    carbs: 14,
    cuisine: 'Asian',
    preparationTime: 15,
    dietType: 'Non-Vegetarian',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=500&auto=format&fit=crop&q=60'
  },
  {
    name: 'Healthy Masala Oats',
    ingredients: ['50g Rolled Oats', '1/2 Onion (diced)', '1/2 Tomato (diced)', '1/2 tsp Garam Masala', 'Coriander'],
    cookingSteps: [
      'Sauté diced onion and tomato in a pan with a splash of oil.',
      'Add spices, salt, oats, and 1.5 cups of water.',
      'Cook on medium heat for 6 minutes until creamy.',
      'Garnish with chopped coriander and serve warm.'
    ],
    calories: 290,
    protein: 8,
    fat: 5,
    carbs: 52,
    cuisine: 'Indian',
    preparationTime: 10,
    dietType: 'Vegetarian',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=500&auto=format&fit=crop&q=60'
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
