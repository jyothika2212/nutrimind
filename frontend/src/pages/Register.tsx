import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import api from '../services/api';
import { Sparkles, User, Mail, Lock, UserCheck } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please write a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['User', 'Dietitian', 'Nutritionist']),
});

type RegisterSchemaType = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'User' },
  });

  const onSubmit = async (data: RegisterSchemaType) => {
    setErrorMsg('');
    try {
      const res = await api.post('/auth/register', data);
      dispatch(loginSuccess(res.data));
      
      if (data.role === 'User') {
        navigate('/dashboard');
      } else {
        navigate('/dietitian-dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative">
      <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl -z-10" />

      <div className="w-full max-w-md glass-card p-8 border-slate-200/50 dark:border-slate-800/40 space-y-6">
        <div className="text-center space-y-2">
          <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-500 inline-block mb-2">
            <Sparkles size={28} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight">Create NutriMind Account</h2>
          <p className="text-xs text-slate-400">Join the smart wellness platform</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-2.5 rounded-lg font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="John Doe"
                {...register('name')}
                className="glass-input pl-11 w-full"
              />
            </div>
            {errors.name && <p className="text-[10px] text-rose-500 font-bold">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="name@domain.com"
                {...register('email')}
                className="glass-input pl-11 w-full"
              />
            </div>
            {errors.email && <p className="text-[10px] text-rose-500 font-bold">{errors.email.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="Min 6 characters"
                {...register('password')}
                className="glass-input pl-11 w-full"
              />
            </div>
            {errors.password && <p className="text-[10px] text-rose-500 font-bold">{errors.password.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase">Register As</label>
            <div className="relative flex items-center">
              <UserCheck className="absolute left-3.5 text-slate-400" size={18} />
              <select
                {...register('role')}
                className="glass-input pl-11 w-full appearance-none bg-transparent"
              >
                <option value="User">Regular User (Track Health)</option>
                <option value="Dietitian">Certified Dietitian</option>
                <option value="Nutritionist">Wellness Nutritionist</option>
              </select>
            </div>
            {errors.role && <p className="text-[10px] text-rose-500 font-bold">{errors.role.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full py-2.5 text-sm"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          <span>Already have an account? </span>
          <Link to="/login" className="text-emerald-500 font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};
