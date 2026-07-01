import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { History as HistIcon, Flame, Droplet, TrendingDown, BedDouble } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const History: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/progress/history?limit=10');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
          <HistIcon className="text-emerald-500" /> Historical Progress
        </h2>
        <p className="text-xs text-slate-400">View weight trends, sleep hours, and water intake logs over the last 10 days</p>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-12 text-center text-xs text-slate-400 border-slate-200/50 dark:border-slate-800/40">
          No logs entered. Enter details on the dashboard to populate graphs.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Calorie consumed vs burned */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flame size={14} className="text-emerald-500" /> Calorie Logs (kcal)
            </h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="totalCaloriesConsumed" name="Consumed" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Area type="monotone" dataKey="totalCaloriesBurned" name="Burned" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.05} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 2: Weight Timeline */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingDown size={14} className="text-emerald-500" /> Weight Tracking Timeline (kg)
            </h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history.filter(h => h.weight)}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
                  <Area type="monotone" dataKey="weight" name="Weight" stroke="#60a5fa" fill="#60a5fa" fillOpacity={0.1} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 3: Hydration Bars */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Droplet size={14} className="text-blue-500" /> Water Hydration (ml)
            </h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
                  <Bar dataKey="waterIntake" name="Hydration" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chart 4: Sleep duration */}
          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BedDouble size={14} className="text-indigo-500" /> Sleep Logs (hours)
            </h3>
            <div className="h-64 text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={history.filter(h => h.sleepDuration)}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff' }} />
                  <Bar dataKey="sleepDuration" name="Sleep" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
