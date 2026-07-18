import React, { useState, useEffect } from 'react';
import { BookOpen, Clock, Heart, Flame } from 'lucide-react';
import api from '../services/api';

export const Recipes: React.FC = () => {
  // Hardcoded curated recipes for illustration.
  // In production we pull from `GET /api/recipes`
  const mockRecipes = [
    {
      name: 'High Protein Oats Bowl',
      image: 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=500&auto=format&fit=crop&q=60',
      prepTime: 10,
      calories: 450,
      protein: 22,
      carbs: 58,
      fat: 14,
      ingredients: ['100g Paneer', '50g Oats', '1 cup almond milk', '1 Banana', 'Honey'],
      steps: [
        'Boil oats in almond milk for 5 minutes until soft.',
        'Cut paneer into small cubes and toast lightly on a pan.',
        'Layer toasted paneer and sliced banana over the cooked oats.',
        'Drizzle a tablespoon of honey on top and serve hot.'
      ]
    },
    {
      name: 'Lemon Grilled Chicken with Broccoli',
      image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=500&auto=format&fit=crop&q=60',
      prepTime: 20,
      calories: 320,
      protein: 48,
      carbs: 7,
      fat: 8,
      ingredients: ['150g Chicken Breast', '100g Broccoli', '1 Lemon', 'Olive Oil', 'Pepper', 'Garlic'],
      steps: [
        'Marinate chicken breast with lemon juice, salt, minced garlic, and pepper for 10 minutes.',
        'Heat oil in a grill pan and sear chicken for 6 minutes each side.',
        'Steam broccoli florets in a container with a splash of water for 3 minutes.',
        'Serve chicken hot alongside steamed broccoli.'
      ]
    }
  ];

  const [recipes, setRecipes] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/food/recipes');
      setRecipes(res.data);
      if (res.data && res.data.length > 0) {
        setSelectedRecipe(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setRecipes(mockRecipes);
      setSelectedRecipe(mockRecipes[0]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Recipes Library</h2>
        <p className="text-xs text-slate-400">Discover nutritionist-approved dishes, ingredients lists, and preparation guides</p>
      </div>

      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of recipes */}
          <div className="lg:col-span-1 space-y-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Available Dishes</span>
            <div className="space-y-3">
              {recipes.map((rec, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedRecipe(rec)}
                  className={`glass-card p-3 border-slate-200/45 dark:border-slate-800/40 cursor-pointer flex gap-3 items-center hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors ${selectedRecipe?.name === rec.name ? 'border-emerald-500/30 bg-emerald-500/5' : ''}`}
                >
                  <img src={rec.image} alt={rec.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0 text-xs">
                    <h4 className="font-bold truncate">{rec.name}</h4>
                    <div className="flex gap-2 text-[10px] text-slate-400 font-semibold mt-1">
                      <span className="flex items-center gap-0.5"><Clock size={12} /> {rec.prepTime || rec.preparationTime}m</span>
                      <span className="flex items-center gap-0.5"><Flame size={12} /> {rec.calories} kcal</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Recipe detail card */}
        <div className="lg:col-span-2 glass-card p-6 border-slate-200/50 dark:border-slate-800/40 min-h-[400px] text-xs">
          {selectedRecipe ? (
            <div className="space-y-4">
              <div className="h-48 overflow-hidden rounded-2xl relative">
                <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 bg-slate-900/80 text-white font-extrabold text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Clock size={12} /> {selectedRecipe.prepTime || selectedRecipe.preparationTime} mins
                </div>
              </div>

              <h3 className="font-extrabold text-lg text-emerald-500">{selectedRecipe.name}</h3>

              <div className="grid grid-cols-4 gap-2 pt-2 border-y dark:border-slate-800 py-3 text-center text-[10px]">
                <div>
                  <span className="text-slate-400 font-bold block">Energy</span>
                  <span className="font-extrabold text-emerald-500 text-xs">{selectedRecipe.calories} kcal</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Protein</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200 text-xs">{selectedRecipe.protein}g</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Carbs</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200 text-xs">{selectedRecipe.carbs}g</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block">Fat</span>
                  <span className="font-extrabold text-slate-700 dark:text-slate-200 text-xs">{selectedRecipe.fat}g</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Ingredients</span>
                <ul className="list-disc pl-4 space-y-1">
                  {selectedRecipe.ingredients.map((ing: string, idx: number) => (
                    <li key={idx} className="font-medium">{ing}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Cooking Steps</span>
                <ol className="list-decimal pl-4 space-y-2">
                  {(selectedRecipe.steps || selectedRecipe.cookingSteps || []).map((step: string, idx: number) => (
                    <li key={idx} className="font-medium leading-relaxed">{step}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
              Select a dish from the left catalog to display instructions.
            </div>
          )}
        </div>
      </div>
    )}
  </div>
  );
};
