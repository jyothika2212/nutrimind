import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import api from '../services/api';
import { Search, ChevronLeft, ChevronRight, Sparkles, Plus, X } from 'lucide-react';

export const FoodDatabase: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const [foods, setFoods] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

  // New food creation states
  const [addModal, setAddModal] = useState(false);
  const [foodForm, setFoodForm] = useState({
    name: '',
    category: 'Grains',
    servingSize: '100g',
    calories: 100,
    protein: 5,
    carbs: 15,
    fat: 2,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    potassium: 0,
    image: ''
  });
  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSubmitting) return;
    setFormError('');
    setFormSubmitting(true);
    try {
      await api.post('/food/create', foodForm);
      setAddModal(false);
      setFoodForm({
        name: '',
        category: 'Grains',
        servingSize: '100g',
        calories: 100,
        protein: 5,
        carbs: 15,
        fat: 2,
        fiber: 0,
        sugar: 0,
        sodium: 0,
        potassium: 0,
        image: ''
      });
      fetchFoods();
      fetchCategories();
    } catch (err: any) {
      console.error(err);
      setFormError(err.response?.data?.error || 'Failed to create food item');
    } finally {
      setFormSubmitting(false);
    }
  };

  const fetchFoods = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/food/search?q=${query}&category=${category}&page=${page}&limit=8`);
      setFoods(res.data.foods);
      setPages(res.data.pagination.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/food/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [query, category, page]);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="font-extrabold text-2xl tracking-tight">Food Database</h2>
          <p className="text-xs text-slate-400">Search nutritional indexes spanning global and Indian cuisines</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setAddModal(true)}
            className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5"
          >
            <Plus size={14} /> Add New Food
          </button>
        )}
      </div>

      {/* Query panel and Filter Row */}
      <div className="glass-card p-4 border-slate-200/50 dark:border-slate-800/40 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex items-center w-full md:max-w-md">
          <Search className="absolute left-3.5 text-slate-400" size={18} />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search food item: e.g. Roti, Oats, Boiled Eggs"
            className="glass-input pl-11 w-full text-xs py-2"
          />
        </div>

        {/* Category list dropdown */}
        <div className="flex gap-2 flex-wrap items-center">
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`btn-secondary py-1.5 px-3 text-[10px] uppercase font-extrabold tracking-wider ${category === '' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`btn-secondary py-1.5 px-3 text-[10px] uppercase font-extrabold tracking-wider ${category === cat ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : ''}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Data listing cards */}
      {loading ? (
        <div className="py-12 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {foods.length === 0 ? (
              <p className="col-span-4 text-center py-12 text-slate-400 text-xs">No food records match search inputs.</p>
            ) : (
              foods.map((food) => (
                <div key={food._id} className="glass-card overflow-hidden border-slate-200/40 dark:border-slate-800/40 flex flex-col justify-between">
                  <div className="h-32 overflow-hidden relative">
                    <img src={food.image} alt={food.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">{food.category}</span>
                  </div>

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between text-xs">
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate">{food.name}</h4>
                      <p className="text-[10px] text-slate-400">Serving Size: {food.servingSize}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-lg border dark:border-slate-900 text-center text-[10px]">
                      <div>
                        <span className="text-slate-400 font-bold block">Energy</span>
                        <span className="font-semibold text-emerald-500">{food.calories} kcal</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">Protein</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{food.protein}g</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">Carbs</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{food.carbs}g</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">Fat</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{food.fat}g</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination Controls */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4 text-xs font-bold">
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="btn-secondary py-1.5 px-3"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <span>Page {page} of {pages}</span>
              <button
                onClick={() => setPage(p => Math.min(p + 1, pages))}
                disabled={page === pages}
                className="btn-secondary py-1.5 px-3"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add New Food Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-6 rounded-20px shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="font-extrabold text-lg">Add New Food Catalog Item</h3>
              <button onClick={() => setAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            
            {formError && (
              <div className="bg-rose-500/10 text-rose-500 border border-rose-500/20 p-3 rounded-lg text-xs font-semibold">
                {formError}
              </div>
            )}

            <form onSubmit={handleAddFood} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Food Name *</label>
                  <input
                    type="text"
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    placeholder="e.g. Avocado Salad"
                    className="glass-input w-full"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Category *</label>
                  <select
                    value={foodForm.category}
                    onChange={(e) => setFoodForm({ ...foodForm, category: e.target.value })}
                    className="glass-input w-full font-semibold"
                  >
                    <option value="Grains">Grains</option>
                    <option value="Protein">Protein</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Serving Size *</label>
                  <input
                    type="text"
                    value={foodForm.servingSize}
                    onChange={(e) => setFoodForm({ ...foodForm, servingSize: e.target.value })}
                    placeholder="e.g. 100g, 1 piece"
                    className="glass-input w-full"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Calories (kcal) *</label>
                  <input
                    type="number"
                    value={foodForm.calories}
                    onChange={(e) => setFoodForm({ ...foodForm, calories: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                    required
                  />
                </div>
              </div>

              <h4 className="font-bold text-[10px] text-emerald-500 uppercase tracking-widest border-b pb-1 dark:border-slate-800">Macronutrients (per serving)</h4>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Protein (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodForm.protein}
                    onChange={(e) => setFoodForm({ ...foodForm, protein: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Carbs (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodForm.carbs}
                    onChange={(e) => setFoodForm({ ...foodForm, carbs: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Fat (g) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodForm.fat}
                    onChange={(e) => setFoodForm({ ...foodForm, fat: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                    required
                  />
                </div>
              </div>

              <h4 className="font-bold text-[10px] text-indigo-500 uppercase tracking-widest border-b pb-1 dark:border-slate-800">Micronutrients & Extras (Optional)</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Fiber (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodForm.fiber}
                    onChange={(e) => setFoodForm({ ...foodForm, fiber: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Sugar (g)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={foodForm.sugar}
                    onChange={(e) => setFoodForm({ ...foodForm, sugar: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Sodium (mg)</label>
                  <input
                    type="number"
                    value={foodForm.sodium}
                    onChange={(e) => setFoodForm({ ...foodForm, sodium: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Potassium (mg)</label>
                  <input
                    type="number"
                    value={foodForm.potassium}
                    onChange={(e) => setFoodForm({ ...foodForm, potassium: Number(e.target.value) })}
                    className="glass-input w-full"
                    min="0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Image URL (Optional)</label>
                <input
                  type="url"
                  value={foodForm.image}
                  onChange={(e) => setFoodForm({ ...foodForm, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="glass-input w-full"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t dark:border-slate-800">
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="btn-primary flex-1 py-2.5 text-xs font-bold"
                >
                  {formSubmitting ? 'Creating...' : 'Create Item'}
                </button>
                <button
                  type="button"
                  onClick={() => setAddModal(false)}
                  className="btn-secondary flex-1 py-2.5 text-xs font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
