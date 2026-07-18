import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Users, Calendar, Clipboard, Plus, Shield, Send, Check } from 'lucide-react';

export const DietitianDashboard: React.FC = () => {
  const [clients, setClients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Meal Planner creator form
  const [plannerModal, setPlannerModal] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [planForm, setPlanForm] = useState({
    title: 'Custom Weight Loss Diet',
    totalCaloriesLimit: 1800,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    breakfastFood: 'Oats with Greek Yogurt',
    lunchFood: 'Brown Rice with Grilled Salmon',
    dinnerFood: 'Mixed Greens Salad with Tofu'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const resClients = await api.get('/dietitian/clients');
      setClients(resClients.data);

      const resAppt = await api.get('/dietitian/appointments');
      setAppointments(resAppt.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApptAction = async (apptId: string, status: 'Approved' | 'Cancelled' | 'Completed') => {
    try {
      await api.post(`/dietitian/appointment/${apptId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateMealPlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;

    try {
      const formattedDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => ({
        dayOfWeek: day,
        breakfast: [{ foodName: planForm.breakfastFood, calories: 400 }],
        lunch: [{ foodName: planForm.lunchFood, calories: 700 }],
        dinner: [{ foodName: planForm.dinnerFood, calories: 500 }],
        snacks: [{ foodName: 'Mixed Nuts', calories: 200 }]
      }));

      await api.post('/dietitian/mealplan', {
        userId: selectedClientId,
        title: planForm.title,
        totalCaloriesLimit: planForm.totalCaloriesLimit,
        startDate: planForm.startDate,
        endDate: planForm.endDate,
        days: formattedDays
      });

      alert('Meal plan created and assigned to user dashboard!');
      setPlannerModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Title */}
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Dietitian Portal</h2>
        <p className="text-xs text-slate-400">Manage clients, design scheduled diets, and approve video consultation sessions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client management grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg flex items-center gap-2">
              <Users size={20} className="text-emerald-500" /> Active Assigned Clients ({clients.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clients.length === 0 ? (
              <div className="col-span-2 glass-card p-8 border-slate-200/50 dark:border-slate-800/40 text-center text-xs text-slate-400">
                No active clients have assigned you yet. Tell users to select you in their dashboard lists.
              </div>
            ) : (
              clients.map((cli) => (
                <div key={cli._id} className="glass-card p-4 border-slate-200/40 dark:border-slate-800/40 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center gap-3">
                    <img src={cli.profilePicture} alt={cli.name} className="w-12 h-12 rounded-full border border-emerald-500/20" />
                    <div>
                      <p className="font-bold text-sm text-slate-850 dark:text-slate-100">{cli.name}</p>
                      <p className="text-[10px] text-slate-400">{cli.email}</p>
                    </div>
                  </div>

                  {cli.userDetails && (
                    <div className="grid grid-cols-3 gap-2 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border dark:border-slate-900 text-center text-[10px]">
                      <div>
                        <span className="text-slate-400 font-bold block">Weight Goal</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-250">{cli.userDetails.weightGoal || 'Gain'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">Weight / Target</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-250">{cli.userDetails.weight} / {cli.userDetails.targetWeight || '--'} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block">BMI Index</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-250">{cli.userDetails.bmi || '--'}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedClientId(cli._id);
                        setPlannerModal(true);
                      }}
                      className="btn-primary py-2 px-3 text-[10px] flex-1 font-extrabold uppercase tracking-wider"
                    >
                      Create Meal Plan
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Appointments column */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg flex items-center gap-2">
            <Calendar size={20} className="text-emerald-500" /> Consult Bookings
          </h3>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <p className="text-xs text-slate-400 glass-card p-6 border-slate-200/50 dark:border-slate-800/40 text-center">No video calls requested yet.</p>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} className="glass-card p-4 border-slate-200/40 dark:border-slate-800/40 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2.5">
                      <img src={appt.userId?.profilePicture} alt="" className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-xs font-bold">{appt.userId?.name}</p>
                        <p className="text-[9px] text-slate-400">{new Date(appt.date).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      appt.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>{appt.status}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">Notes: "{appt.notes || 'None'}"</p>

                  {appt.status === 'Pending' && (
                    <div className="flex gap-2 pt-1.5">
                      <button
                        onClick={() => handleApptAction(appt._id, 'Approved')}
                        className="btn-primary py-1 px-3 text-[10px] flex-1"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleApptAction(appt._id, 'Cancelled')}
                        className="btn-secondary py-1 px-3 text-[10px] flex-1 text-rose-500"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {appt.status === 'Approved' && appt.videoLink && (
                    <Link
                      to={`/meeting/${appt._id}`}
                      className="btn-secondary py-1.5 w-full text-[10px] text-center block text-emerald-500 font-extrabold border-emerald-500/20"
                    >
                      Join Video Consultation Room
                    </Link>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Meal Plan Modal */}
      {plannerModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg p-6 rounded-20px shadow-2xl space-y-4">
            <h3 className="font-extrabold text-lg">Design Meal Planner</h3>
            <form onSubmit={handleCreateMealPlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Plan Title</label>
                  <input type="text" value={planForm.title} onChange={(e) => setPlanForm({ ...planForm, title: e.target.value })} className="glass-input w-full" required />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-400 uppercase">Total Calorie Limit</label>
                  <input type="number" value={planForm.totalCaloriesLimit} onChange={(e) => setPlanForm({ ...planForm, totalCaloriesLimit: Number(e.target.value) })} className="glass-input w-full" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Breakfast Option</label>
                <input type="text" value={planForm.breakfastFood} onChange={(e) => setPlanForm({ ...planForm, breakfastFood: e.target.value })} className="glass-input w-full" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Lunch Option</label>
                <input type="text" value={planForm.lunchFood} onChange={(e) => setPlanForm({ ...planForm, lunchFood: e.target.value })} className="glass-input w-full" required />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Dinner Option</label>
                <input type="text" value={planForm.dinnerFood} onChange={(e) => setPlanForm({ ...planForm, dinnerFood: e.target.value })} className="glass-input w-full" required />
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="btn-primary flex-1 py-2.5">Publish & Assign</button>
                <button type="button" onClick={() => setPlannerModal(false)} className="btn-secondary flex-1 py-2.5">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
