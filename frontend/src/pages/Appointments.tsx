import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, Clock, Video, FileText } from 'lucide-react';

export const Appointments: React.FC = () => {
  const [dietitians, setDietitians] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [selectedDietitian, setSelectedDietitian] = useState('');
  const [apptDate, setApptDate] = useState('');
  const [apptTime, setApptTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [booking, setBooking] = useState(false);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const resList = await api.get('/dietitian/list');
      setDietitians(resList.data);

      const resAppts = await api.get('/dietitian/appointments');
      setAppointments(resAppts.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDietitian || !apptDate) return;

    setBooking(true);
    try {
      const combinedDateTime = new Date(`${apptDate}T${apptTime}:00`);
      await api.post('/dietitian/appointment', {
        dietitianId: selectedDietitian,
        date: combinedDateTime.toISOString(),
        duration: 30,
        notes
      });

      alert('Appointment booked successfully!');
      setSelectedDietitian('');
      setApptDate('');
      setNotes('');
      fetchAppointments();
    } catch (err) {
      console.error(err);
    } finally {
      setBooking(false);
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
      <div>
        <h2 className="font-extrabold text-2xl tracking-tight">Consultations Scheduler</h2>
        <p className="text-xs text-slate-400">Book clinical health reviews and launch secure video consulting rooms</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Form panel */}
        <div className="glass-card p-5 border-slate-200/50 dark:border-slate-800/40 space-y-4 text-xs h-fit">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <Calendar size={18} className="text-emerald-500" /> Book Consult
          </h3>

          <form onSubmit={handleBook} className="space-y-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase">Select Dietitian</label>
              <select
                value={selectedDietitian}
                onChange={(e) => setSelectedDietitian(e.target.value)}
                className="glass-input w-full"
                required
              >
                <option value="">-- Choose Specialist --</option>
                {dietitians.map((d) => (
                  <option key={d._id} value={d._id}>{d.name} ({d.dietitianDetails?.specialties?.join(', ') || 'Nutrition'})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Date</label>
                <input
                  type="date"
                  value={apptDate}
                  onChange={(e) => setApptDate(e.target.value)}
                  className="glass-input w-full"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-400 uppercase">Time Slot</label>
                <select
                  value={apptTime}
                  onChange={(e) => setApptTime(e.target.value)}
                  className="glass-input w-full"
                >
                  <option value="10:00">10:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                  <option value="14:00">02:00 PM</option>
                  <option value="15:30">03:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-400 uppercase">Add Consultation Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe your current targets or questions..."
                className="glass-input w-full h-20 resize-none"
              />
            </div>

            <button type="submit" disabled={booking} className="btn-primary w-full py-2.5">
              {booking ? 'Scheduling...' : 'Reserve Video Slot'}
            </button>
          </form>
        </div>

        {/* Appointments history list */}
        <div className="lg:col-span-2 space-y-4 text-xs">
          <h3 className="font-extrabold text-sm flex items-center gap-2">
            <Clock size={18} className="text-emerald-500" /> Upcoming & Historical Sessions
          </h3>

          <div className="space-y-3">
            {appointments.length === 0 ? (
              <div className="glass-card p-8 border-slate-200/50 dark:border-slate-800/40 text-center text-slate-400 text-xs">
                No session times booked yet. Submit the form to schedule consultation blocks.
              </div>
            ) : (
              appointments.map((appt) => (
                <div key={appt._id} className="glass-card p-4 border-slate-200/40 dark:border-slate-800/40 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500">
                        <Video size={16} />
                      </div>
                      <div>
                        <p className="font-bold">Session with {appt.dietitianId?.name || 'Dietitian'}</p>
                        <p className="text-[10px] text-slate-400 font-semibold">{new Date(appt.date).toLocaleString()}</p>
                      </div>
                    </div>

                    <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                      appt.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      appt.status === 'Pending' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-slate-100 text-slate-400'
                    }`}>{appt.status}</span>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">Notes: "{appt.notes || 'No description notes added.'}"</p>

                  {appt.status === 'Approved' && appt.videoLink && (
                    <a
                      href={appt.videoLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary py-1.5 text-center text-emerald-500 font-extrabold border-emerald-500/20 block"
                    >
                      Join Jitsi Video Room
                    </a>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
