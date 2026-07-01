import React, { useState } from 'react';
import api from '../services/api';
import { Sparkles, MessageSquare, Calendar, BookOpen, Camera, Send, Plus, Check } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'weekly' | 'recipe' | 'scanner'>('chat');

  // AI Chat states
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'model'; parts: string }[]>([
    { role: 'model', parts: 'Hello! I am your NutriMind AI Nutritionist. Ask me anything about foods, diets, caloric limits, or meal recipes!' }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  // AI Weekly plan states
  const [weeklyPlan, setWeeklyPlan] = useState<any[] | null>(null);
  const [weeklyLoading, setWeeklyLoading] = useState(false);

  // AI Recipe states
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [itemInput, setItemInput] = useState('');
  const [generatedRecipe, setGeneratedRecipe] = useState<any | null>(null);
  const [recipeLoading, setRecipeLoading] = useState(false);

  // AI Scanner states
  const [scannerDesc, setScannerDesc] = useState('');
  const [scannerResult, setScannerResult] = useState<any | null>(null);
  const [scannerLoading, setScannerLoading] = useState(false);

  // 1. AI Chat Submission
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    setChatHistory((prev) => [...prev, { role: 'user', parts: userMessage }]);
    setChatLoading(true);

    try {
      const cleanHistory = chatHistory.map(h => ({ role: h.role, parts: h.parts }));
      const res = await api.post('/ai/chat', { message: userMessage, history: cleanHistory });
      setChatHistory((prev) => [...prev, { role: 'model', parts: res.data.reply }]);
    } catch (err) {
      console.error(err);
      setChatHistory((prev) => [...prev, { role: 'model', parts: 'I encountered an error analyzing your request. Please check your network or key credentials.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  // 2. AI Weekly Diet Plan Generation
  const handleGenerateWeeklyPlan = async () => {
    setWeeklyLoading(true);
    try {
      const res = await api.post('/ai/weekly-diet', {});
      setWeeklyPlan(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setWeeklyLoading(false);
    }
  };

  // 3. AI Recipe Generation
  const handleAddIngredient = () => {
    if (itemInput.trim()) {
      setIngredients((prev) => [...prev, itemInput.trim()]);
      setItemInput('');
    }
  };

  const handleGenerateRecipe = async () => {
    if (ingredients.length === 0) return;
    setRecipeLoading(true);
    try {
      const res = await api.post('/ai/recipe-generator', { ingredients });
      setGeneratedRecipe(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setRecipeLoading(false);
    }
  };

  // 4. AI Food Scanner
  const handleScanFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannerDesc.trim()) return;
    setScannerLoading(true);
    try {
      const res = await api.post('/ai/analyze-food', { description: scannerDesc });
      setScannerResult(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setScannerLoading(false);
    }
  };

  const handleLogScannerFood = async () => {
    if (!scannerResult) return;
    try {
      await api.post('/progress/meal', {
        mealType: 'lunch',
        foodItem: {
          name: scannerResult.foodName,
          calories: scannerResult.calories,
          protein: scannerResult.protein,
          carbs: scannerResult.carbs,
          fat: scannerResult.fat,
          servingSize: scannerResult.servingSize,
          quantity: 1
        }
      });
      alert('Logged food analysis into daily lunch journal!');
      setScannerResult(null);
      setScannerDesc('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Title & Tab buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 dark:border-slate-800">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
            <Sparkles className="text-emerald-500" /> NutriMind AI Workspace
          </h2>
          <p className="text-xs text-slate-400">Generate diet plans, cook recipes, and inspect macro profiles</p>
        </div>

        {/* Action Tabs selection */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('chat')}
            className={`btn-secondary py-2 px-4 text-xs font-bold ${activeTab === 'chat' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
          >
            <MessageSquare size={14} /> AI Chat
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`btn-secondary py-2 px-4 text-xs font-bold ${activeTab === 'weekly' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
          >
            <Calendar size={14} /> Weekly Planner
          </button>
          <button
            onClick={() => setActiveTab('recipe')}
            className={`btn-secondary py-2 px-4 text-xs font-bold ${activeTab === 'recipe' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
          >
            <BookOpen size={14} /> Recipe Generator
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`btn-secondary py-2 px-4 text-xs font-bold ${activeTab === 'scanner' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
          >
            <Camera size={14} /> Food Analyzer
          </button>
        </div>
      </div>

      {/* Workspace Display panels */}
      <div className="glass-card p-6 border-slate-200/50 dark:border-slate-800/40 min-h-[400px] flex flex-col">
        {/* Tab 1: AI Chatbot */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col justify-between h-[450px]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 max-h-[360px]">
              {chatHistory.map((ch, i) => (
                <div
                  key={i}
                  className={`flex ${ch.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed ${
                      ch.role === 'user'
                        ? 'bg-emerald-500 text-white rounded-tr-none'
                        : 'bg-slate-100 dark:bg-slate-900 rounded-tl-none border dark:border-slate-800'
                    }`}
                  >
                    {ch.parts}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-900 rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2 border dark:border-slate-800">
                    <span className="animate-pulse">Analyzing...</span>
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2 border-t pt-4 dark:border-slate-800 mt-4">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask your nutritionist: e.g. What contains more protein, egg whites or oats?"
                className="glass-input flex-1 text-xs"
                disabled={chatLoading}
              />
              <button type="submit" disabled={chatLoading} className="btn-primary py-2.5 px-4">
                <Send size={14} /> Send
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Weekly Plan */}
        {activeTab === 'weekly' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg">Weekly Meal Recommendation</h3>
                <p className="text-xs text-slate-400">Generate a custom 7-day diet according to weight goals, calories, and allergies.</p>
              </div>
              <button
                onClick={handleGenerateWeeklyPlan}
                disabled={weeklyLoading}
                className="btn-primary text-xs"
              >
                {weeklyLoading ? 'Planning...' : 'Generate 7-Day Plan'}
              </button>
            </div>

            {weeklyPlan ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 pt-4">
                {weeklyPlan.map((dayPlan: any, i: number) => (
                  <div key={i} className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 p-4 rounded-xl space-y-2 text-xs">
                    <h4 className="font-black text-emerald-500 border-b pb-1 dark:border-slate-800 uppercase text-[10px] tracking-wider">{dayPlan.day}</h4>
                    <div>
                      <p className="font-bold text-[10px] text-slate-400 uppercase">Breakfast</p>
                      <p className="font-medium text-[11px]">{dayPlan.breakfast}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-slate-400 uppercase">Lunch</p>
                      <p className="font-medium text-[11px]">{dayPlan.lunch}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-slate-400 uppercase">Dinner</p>
                      <p className="font-medium text-[11px]">{dayPlan.dinner}</p>
                    </div>
                    <div>
                      <p className="font-bold text-[10px] text-slate-400 uppercase">Snacks</p>
                      <p className="font-medium text-[11px]">{dayPlan.snacks}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-xs text-slate-400">
                Click generate to invoke the Gemini API profile compiler.
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Recipe Generator */}
        {activeTab === 'recipe' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 space-y-4">
              <h3 className="font-extrabold text-lg">Pantry Chef</h3>
              <p className="text-xs text-slate-400">Input what you have left in the fridge to let AI compose detailed cooking directions.</p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  placeholder="e.g. Tofu"
                  className="glass-input flex-1 text-xs py-2"
                />
                <button onClick={handleAddIngredient} className="btn-secondary py-2 px-3">
                  <Plus size={16} />
                </button>
              </div>

              {/* Tag clouds */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {ingredients.map((ing, i) => (
                  <span key={i} className="bg-emerald-500/10 text-emerald-500 text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                    {ing}
                    <button onClick={() => setIngredients(ingredients.filter((_, idx) => idx !== i))} className="hover:text-rose-500">×</button>
                  </span>
                ))}
              </div>

              <button
                onClick={handleGenerateRecipe}
                disabled={recipeLoading || ingredients.length === 0}
                className="btn-primary w-full text-xs py-2.5"
              >
                {recipeLoading ? 'Cooking...' : 'Compose Recipe'}
              </button>
            </div>

            <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-5 text-xs">
              {generatedRecipe ? (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-base text-emerald-500">{generatedRecipe.name || generatedRecipe.recipeName}</h4>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Time Limit</span>
                    <span>{generatedRecipe.prepTime || generatedRecipe.preparationTime} minutes</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Ingredients Used</span>
                    <p>{(generatedRecipe.ingredients || []).join(', ')}</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-400 uppercase tracking-wider block text-[9px] mb-1">Cooking Instructions</span>
                    <ol className="list-decimal pl-4 space-y-1">
                      {(generatedRecipe.steps || generatedRecipe.cookingSteps || []).map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2 border-t dark:border-slate-800">
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Calories</span>
                      <span className="font-bold">{generatedRecipe.nutrition?.calories || generatedRecipe.calories} kcal</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Protein</span>
                      <span className="font-bold">{generatedRecipe.nutrition?.protein || generatedRecipe.protein}g</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Carbs</span>
                      <span className="font-bold">{generatedRecipe.nutrition?.carbs || generatedRecipe.carbs}g</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 font-bold uppercase">Fat</span>
                      <span className="font-bold">{generatedRecipe.nutrition?.fat || generatedRecipe.fat}g</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
                  No recipe composed. Input ingredients and click build.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Food Scanner */}
        {activeTab === 'scanner' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg">AI Meal Parser</h3>
              <p className="text-xs text-slate-400">Describe or drop food items details. The system uses clinical databases and Gemini estimates to extract macronutrient breakdowns.</p>
              
              <form onSubmit={handleScanFood} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Describe Plate / Dish</label>
                  <textarea
                    value={scannerDesc}
                    onChange={(e) => setScannerDesc(e.target.value)}
                    placeholder="e.g. A bowl of brown rice with grilled paneer and steamed broccoli florets"
                    className="glass-input w-full text-xs h-24 resize-none"
                    required
                  />
                </div>

                {/* Mock Image Upload drop area */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                  <Camera className="mx-auto text-slate-400 mb-2" size={24} />
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Simulate Food Camera Scanner</span>
                  <span className="text-[9px] text-slate-400 block mt-1">Upload dish photos for OCR scanning (Mocked to description)</span>
                </div>

                <button type="submit" disabled={scannerLoading} className="btn-primary w-full text-xs py-2.5">
                  {scannerLoading ? 'Analyzing...' : 'Parse Food Stats'}
                </button>
              </form>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border dark:border-slate-800 rounded-xl p-5 text-xs flex flex-col justify-between">
              {scannerResult ? (
                <div className="space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-extrabold text-base border-b pb-2 dark:border-slate-800 flex items-center justify-between">
                      <span>{scannerResult.foodName}</span>
                      <span className="bg-emerald-500/10 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold">1 serving ({scannerResult.servingSize})</span>
                    </h4>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-slate-950 p-4 border dark:border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Estimated Energy</span>
                        <span className="text-xl font-black text-emerald-500">{scannerResult.calories} kcal</span>
                      </div>
                      <div className="bg-white dark:bg-slate-950 p-4 border dark:border-slate-800 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Sugar / Fiber</span>
                        <span className="text-sm font-black">{scannerResult.sugar || 0}g / {scannerResult.fiber || 0}g</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 text-[11px] font-bold">
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-400">Protein</span>
                        <span>{scannerResult.protein}g</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-400">Carbs</span>
                        <span>{scannerResult.carbs}g</span>
                      </div>
                      <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                        <span className="text-slate-400">Fat</span>
                        <span>{scannerResult.fat}g</span>
                      </div>
                    </div>
                  </div>

                  <button onClick={handleLogScannerFood} className="btn-primary w-full py-2.5 mt-4">
                    <Check size={14} /> Log to Daily Journal
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs py-12">
                  No active food analysis result. Scan or write a description.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
