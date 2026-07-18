import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import {
  Plus,
  Flame,
  Droplet,
  TrendingDown,
  BedDouble,
  Heart,
  PlusCircle,
  Activity,
  PlusSquare,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export const UserDashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [todayData, setTodayData] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form modal inputs
  const [foodModal, setFoodModal] = useState(false);
  const [mealType, setMealType] = useState('breakfast');
  const [foodForm, setFoodForm] = useState({ name: '', calories: 150, protein: 10, carbs: 20, fat: 5, quantity: 1 });

  const [waterAmount, setWaterAmount] = useState(250);
  const [workoutForm, setWorkoutForm] = useState({ name: 'Walk', duration: 30, caloriesBurned: 150, intensity: 'Medium' });
  const [workoutModal, setWorkoutModal] = useState(false);

  const [vitalsForm, setVitalsForm] = useState({ weight: 78, sleepDuration: 7, heartRate: 72 });
  const [vitalsModal, setVitalsModal] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const resToday = await api.get('/progress/today');
      setTodayData(resToday.data);

      const resHist = await api.get('/progress/history?limit=7');
      setHistory(resHist.data);
    } catch (err) {
      console.error('Error fetching dashboard records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/progress/meal', {
        mealType,
        foodItem: foodForm
      });
      setFoodModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Log meal failed:', err);
    }
  };

  const handleLogWater = async (amount: number) => {
    try {
      await api.post('/progress/water', { amount });
      fetchDashboardData();
    } catch (err) {
      console.error('Log water failed:', err);
    }
  };

  const handleLogWorkout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/progress/workout', workoutForm);
      setWorkoutModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Log workout failed:', err);
    }
  };

  const handleLogVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/progress/vitals', vitalsForm);
      setVitalsModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Log vitals failed:', err);
    }
  };

  if (loading || !todayData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Calorie calculations
  const calorieGoal = user?.userDetails?.calorieGoal || 2000;
  const consumed = todayData.totalCaloriesConsumed || 0;
  const burned = todayData.totalCaloriesBurned || 0;
  const net = consumed - burned;
  const remaining = calorieGoal - net;

  // Pie chart macros breakdown data
  const macroData = [
    { name: 'Protein', value: todayData.totalProteinConsumed || 0, color: '#34d399' }, // Emerald
    { name: 'Carbs', value: todayData.totalCarbsConsumed || 0, color: '#60a5fa' }, // Blue
    { name: 'Fat', value: todayData.totalFatConsumed || 0, color: '#fb7185' } // Rose
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Top Banner Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Calorie Progress Ring Mock */}
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 col-span-1 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-slate-500 text-sm">Caloric Balance</span>
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
              <Flame size={16} />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative flex items-center justify-center w-28 h-28">
              {/* Radial background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="currentColor" className="text-slate-100 dark:text-slate-800" fill="transparent" />
                <circle cx="56" cy="56" r="46" strokeWidth="8" stroke="currentColor" className="text-emerald-500" fill="transparent"
                  strokeDasharray={289}
                  strokeDashoffset={289 - (Math.min(consumed, calorieGoal) / calorieGoal) * 289}
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black block">{net}</span>
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">NET KCAL</span>
              </div>
            </div>

            <div className="space-y-2 flex-1 text-xs">
              <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                <span className="text-slate-400">Target Budget</span>
                <span className="font-bold">{calorieGoal}</span>
              </div>
              <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                <span className="text-slate-400">Food Intake</span>
                <span className="font-bold text-emerald-500">+{consumed}</span>
              </div>
              <div className="flex justify-between border-b pb-1 dark:border-slate-800">
                <span className="text-slate-400">Workout Burn</span>
                <span className="font-bold text-amber-500">-{burned}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-slate-400">Remaining</span>
                <span className={`font-bold ${remaining < 0 ? 'text-rose-500' : 'text-slate-800 dark:text-slate-100'}`}>{remaining}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Circle */}
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-500 text-sm">Macros Logged</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Grams</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-24 h-24">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={macroData.filter(d => d.value > 0).length > 0 ? macroData : [{ name: 'Empty', value: 1, color: '#94a3b8' }]}
                    cx="50%"
                    cy="50%"
                    innerRadius={28}
                    outerRadius={38}
                    dataKey="value"
                  >
                    {macroData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 space-y-1.5 text-[11px] font-bold">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Pro:</span>
                <span>{todayData.totalProteinConsumed || 0}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> Carb:</span>
                <span>{todayData.totalCarbsConsumed || 0}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Fat:</span>
                <span>{todayData.totalFatConsumed || 0}g</span>
              </div>
            </div>
          </div>
        </div>

        {/* Water Hydration Quick Widget */}
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-500 text-sm">Water Intake</span>
            <div className="bg-blue-500/10 p-2 rounded-lg text-blue-500">
              <Droplet size={16} />
            </div>
          </div>

          <div className="py-2 text-center">
            <div className="text-2xl font-black text-blue-500">{todayData.waterIntake || 0} ml</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Goal: {user?.userDetails?.waterGoal || 2500} ml</div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => handleLogWater(250)} className="btn-secondary flex-1 py-1.5 text-xs font-extrabold hover:text-blue-500">
              +250ml
            </button>
            <button onClick={() => handleLogWater(500)} className="btn-secondary flex-1 py-1.5 text-xs font-extrabold hover:text-blue-500">
              +500ml
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Logging and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Caloric logger area */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-lg">Daily Nutrition Journal</h2>
            <button onClick={() => setFoodModal(true)} className="btn-primary py-1.5 px-3 text-xs">
              <Plus size={14} /> Add Food
            </button>
          </div>

          {/* Meals breakdown categories */}
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((cat) => {
            const mealsList = todayData.meals[cat] || [];
            const subtotal = mealsList.reduce((acc: number, curr: any) => acc + (curr.calories * (curr.quantity || 1)), 0);

            return (
              <div key={cat} className="glass-card p-4 border-slate-200/50 dark:border-slate-800/40">
                <div className="flex justify-between items-center border-b pb-2 mb-2 dark:border-slate-800">
                  <span className="font-bold text-sm capitalize">{cat}</span>
                  <span className="text-xs font-bold text-slate-400">{subtotal} kcal</span>
                </div>

                {mealsList.length === 0 ? (
                  <p className="text-xs text-slate-400 py-2">No items logged yet.</p>
                ) : (
                  <div className="divide-y dark:divide-slate-800">
                    {mealsList.map((meal: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 text-xs">
                        <div>
                          <p className="font-semibold">{meal.name}</p>
                          <p className="text-[10px] text-slate-400">{meal.quantity} serving ({meal.servingSize}) • P: {meal.protein}g C: {meal.carbs}g F: {meal.fat}g</p>
                        </div>
                        <span className="font-bold">{meal.calories * meal.quantity} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Health Tracker metrics and charts */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-lg">Health Vitals</h2>
            <div className="flex gap-2">
              <button onClick={() => setWorkoutModal(true)} className="btn-primary py-1 px-2.5 text-xs">
                Log Workout
              </button>
              <button onClick={() => setVitalsModal(true)} className="btn-secondary py-1 px-2.5 text-xs">
                Log Vital
              </button>
            </div>
          </div>

          {/* Vitals row widgets */}
          <div className="grid grid-cols-3 gap-3">
            <div className="glass-card p-3 border-slate-200/40 dark:border-slate-800/40 text-center">
              <TrendingDown className="text-emerald-500 mx-auto mb-1.5" size={18} />
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Weight</span>
              <span className="text-sm font-black">{todayData.weight || user?.userDetails?.weight || '--'} kg</span>
            </div>

            <div className="glass-card p-3 border-slate-200/40 dark:border-slate-800/40 text-center">
              <BedDouble className="text-indigo-500 mx-auto mb-1.5" size={18} />
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Sleep</span>
              <span className="text-sm font-black">{todayData.sleepDuration || '--'} hr</span>
            </div>

            <div className="glass-card p-3 border-slate-200/40 dark:border-slate-800/40 text-center">
              <Heart className="text-rose-500 mx-auto mb-1.5" size={18} />
              <span className="text-[9px] text-slate-400 font-bold block uppercase">Vitals HR</span>
              <span className="text-sm font-black">{todayData.heartRate || '--'} bpm</span>
            </div>
          </div>

          {/* Weight progress timeline chart */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Caloric Intake History (Last 7 Days)</h3>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorCal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="totalCaloriesConsumed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Workouts Logged list */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-4">Workouts Logged Today</h3>
            {todayData.workouts && todayData.workouts.length > 0 ? (
              <div className="divide-y dark:divide-slate-800">
                {todayData.workouts.map((w: any, i: number) => (
                  <div key={i} className="flex justify-between items-center py-2 text-xs">
                    <div>
                      <p className="font-semibold">{w.name}</p>
                      <p className="text-[10px] text-slate-400">{w.duration} mins • Intensity: {w.intensity}</p>
                    </div>
                    <span className="font-bold text-amber-500">-{w.caloriesBurned} kcal</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No workouts logged today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Food Log Modal */}
      {foodModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-20px shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg">Log Food Item</h3>
            <form onSubmit={handleLogMeal} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Meal Category</label>
                <select value={mealType} onChange={(e) => setMealType(e.target.value)} className="glass-input w-full">
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snacks">Snacks</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Food Name</label>
                <input type="text" value={foodForm.name} onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })} placeholder="e.g. Scrambled Eggs" className="glass-input w-full" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Calories (kcal)</label>
                  <input type="number" value={foodForm.calories} onChange={(e) => setFoodForm({ ...foodForm, calories: Number(e.target.value) })} className="glass-input w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Serving Quantity</label>
                  <input type="number" value={foodForm.quantity} onChange={(e) => setFoodForm({ ...foodForm, quantity: Number(e.target.value) })} className="glass-input w-full" required />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Protein (g)</label>
                  <input type="number" value={foodForm.protein} onChange={(e) => setFoodForm({ ...foodForm, protein: Number(e.target.value) })} className="glass-input w-full" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Carbs (g)</label>
                  <input type="number" value={foodForm.carbs} onChange={(e) => setFoodForm({ ...foodForm, carbs: Number(e.target.value) })} className="glass-input w-full" />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Fat (g)</label>
                  <input type="number" value={foodForm.fat} onChange={(e) => setFoodForm({ ...foodForm, fat: Number(e.target.value) })} className="glass-input w-full" />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1 py-2.5">Save Entry</button>
                <button type="button" onClick={() => setFoodModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vitals Log Modal */}
      {vitalsModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-20px shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg">Log Health Vitals</h3>
            <form onSubmit={handleLogVitals} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Weight (kg)</label>
                <input type="number" step="0.1" value={vitalsForm.weight} onChange={(e) => setVitalsForm({ ...vitalsForm, weight: Number(e.target.value) })} className="glass-input w-full" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Sleep Duration (hours)</label>
                <input type="number" step="0.5" value={vitalsForm.sleepDuration} onChange={(e) => setVitalsForm({ ...vitalsForm, sleepDuration: Number(e.target.value) })} className="glass-input w-full" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Heart Rate (bpm)</label>
                <input type="number" value={vitalsForm.heartRate} onChange={(e) => setVitalsForm({ ...vitalsForm, heartRate: Number(e.target.value) })} className="glass-input w-full" required />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1 py-2.5">Save Vitals</button>
                <button type="button" onClick={() => setVitalsModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workout Log Modal */}
      {workoutModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md p-6 rounded-20px shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg">Log Workout</h3>
            <form onSubmit={handleLogWorkout} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Workout Name</label>
                <input type="text" value={workoutForm.name} onChange={(e) => setWorkoutForm({ ...workoutForm, name: e.target.value })} placeholder="e.g. Jogging" className="glass-input w-full" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Duration (mins)</label>
                  <input type="number" value={workoutForm.duration} onChange={(e) => setWorkoutForm({ ...workoutForm, duration: Number(e.target.value) })} className="glass-input w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Calories Burned (kcal)</label>
                  <input type="number" value={workoutForm.caloriesBurned} onChange={(e) => setWorkoutForm({ ...workoutForm, caloriesBurned: Number(e.target.value) })} className="glass-input w-full" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Intensity</label>
                <select value={workoutForm.intensity} onChange={(e) => setWorkoutForm({ ...workoutForm, intensity: e.target.value })} className="glass-input w-full">
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1 py-2.5">Save Workout</button>
                <button type="button" onClick={() => setWorkoutModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
