import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export const FoodDatabase: React.FC = () => {
  const [foods, setFoods] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(false);

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
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Food Database</h2>
        <p className="text-xs text-slate-400">Search nutritional indexes spanning global and Indian cuisines</p>
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
    </div>
  );
};
