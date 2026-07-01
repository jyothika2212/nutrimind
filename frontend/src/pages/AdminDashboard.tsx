import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Shield, Users, Server, BookOpen, UserMinus, Plus, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      const resStats = await api.get('/admin/stats');
      setStats(resStats.data);

      const resUsers = await api.get('/admin/users');
      setUsersList(resUsers.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleUpdateRole = async (userId: string, role: string) => {
    try {
      await api.post('/admin/user/role', { userId, role });
      alert('User role updated successfully');
      fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user profile?')) return;
    try {
      await api.delete(`/admin/user/${userId}`);
      fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading || !stats) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Sample analytics chart data
  const chartData = [
    { name: 'Users', count: stats.totalUsers },
    { name: 'Dietitians', count: stats.totalDietitians },
    { name: 'Foods Catalog', count: stats.totalFoods / 10 }, // scaled
    { name: 'Recipes', count: stats.totalRecipes },
    { name: 'Vitals Logs', count: stats.totalLogs }
  ];

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight flex items-center gap-2">
          <Shield className="text-emerald-500" /> Admin Command Terminal
        </h2>
        <p className="text-xs text-slate-400">Configure role allocations, inspect active user files, and check server metrics logs</p>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Clients</span>
          <span className="text-3xl font-black text-slate-700 dark:text-slate-100">{stats.totalUsers}</span>
        </div>
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Certified Dietitians</span>
          <span className="text-3xl font-black text-slate-700 dark:text-slate-100">{stats.totalDietitians}</span>
        </div>
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Food Database Catalog</span>
          <span className="text-3xl font-black text-slate-700 dark:text-slate-100">{stats.totalFoods}</span>
        </div>
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
          <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Daily Logs Tracked</span>
          <span className="text-3xl font-black text-emerald-500">{stats.totalLogs}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Users Management list table */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Users size={20} className="text-emerald-500" /> Platform Accounts Directory
          </h3>

          <div className="glass-card border-slate-200/50 dark:border-slate-800/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 dark:bg-slate-900 font-bold text-slate-400 uppercase border-b dark:border-slate-800">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-800">
                  {usersList.map((usr) => (
                    <tr key={usr._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/20">
                      <td className="p-4 font-semibold">{usr.name}</td>
                      <td className="p-4 text-slate-400">{usr.email}</td>
                      <td className="p-4">
                        <select
                          value={usr.role}
                          onChange={(e) => handleUpdateRole(usr._id, e.target.value)}
                          className="bg-transparent font-semibold focus:ring-1 focus:ring-emerald-500 rounded border border-slate-200 dark:border-slate-800 px-2 py-1"
                        >
                          <option value="User">User</option>
                          <option value="Dietitian">Dietitian</option>
                          <option value="Nutritionist">Nutritionist</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleDeleteUser(usr._id)}
                          className="text-rose-500 hover:underline flex items-center gap-1"
                        >
                          <UserMinus size={14} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Analytics bar chart */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Server size={20} className="text-emerald-500" /> Platform Allocations
          </h3>

          <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                  <YAxis stroke="#94a3b8" fontSize={9} />
                  <Tooltip contentStyle={{ background: '#1e293b', border: 'none', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
