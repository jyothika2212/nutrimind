import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../store/authSlice';
import api from '../services/api';
import { Sparkles, Mail, Lock, Key, KeyRound } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please write a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long').optional(),
});

type LoginSchemaType = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errorMsg, setErrorMsg] = useState('');
  const [otpLogin, setOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setErrorMsg('');
    try {
      if (otpLogin) {
        // Request OTP
        await api.post('/auth/otp-request', { email: data.email });
        setOtpSent(true);
      } else {
        // Normal password login
        const res = await api.post('/auth/login', {
          email: data.email,
          password: data.password,
        });

        dispatch(loginSuccess(res.data));
        
        // Route according to user role
        if (res.data.user.role === 'Admin') {
          navigate('/admin-dashboard');
        } else if (['Dietitian', 'Nutritionist'].includes(res.data.user.role)) {
          navigate('/dietitian-dashboard');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Invalid credentials. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    setErrorMsg('');
    const email = getValues('email');
    try {
      const res = await api.post('/auth/otp-verify', { email, otp: otpCode });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'OTP verification failed');
    }
  };

  const handleGoogleMock = async () => {
    try {
      const res = await api.post('/auth/google-mock', {
        name: 'Manoj Kumar (Google)',
        email: 'manoj.google@example.com',
        googleId: 'g_1234567890',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
      });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err: any) {
      setErrorMsg('Google mock sign-in failed');
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
          <h2 className="text-2xl font-extrabold tracking-tight">Sign In to NutriMind</h2>
          <p className="text-xs text-slate-400">Track calorie metrics and consult clinical dietitians</p>
        </div>

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs px-4 py-2.5 rounded-lg font-bold">
            {errorMsg}
          </div>
        )}

        {!otpSent ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            {!otpLogin && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                  <Link to="/forgot-password" className="text-[10px] text-emerald-500 hover:underline">
                    Forgot?
                  </Link>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 text-slate-400" size={18} />
                  <input
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    className="glass-input pl-11 w-full"
                  />
                </div>
                {errors.password && <p className="text-[10px] text-rose-500 font-bold">{errors.password.message}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full py-2.5 text-sm"
            >
              {otpLogin ? 'Send Code' : 'Sign In'}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase">Verification OTP Code</label>
              <div className="relative flex items-center">
                <Key className="absolute left-3.5 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="glass-input pl-11 w-full"
                />
              </div>
            </div>

            <button
              onClick={handleVerifyOtp}
              className="btn-primary w-full py-2.5 text-sm"
            >
              Verify & Sign In
            </button>
            <button
              onClick={() => setOtpSent(false)}
              className="btn-secondary w-full py-2.5 text-sm"
            >
              Back to Email Input
            </button>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => setOtpLogin(!otpLogin)}
            className="w-full text-center text-xs font-bold text-emerald-500 hover:underline flex items-center justify-center gap-1.5"
          >
            <KeyRound size={14} />
            {otpLogin ? 'Sign In with Password' : 'Sign In with OTP verification'}
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-bold uppercase">Or continue with</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          </div>

          <button
            onClick={handleGoogleMock}
            className="btn-secondary w-full py-2.5 text-xs flex justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google OAuth Sign In
          </button>
        </div>

        <div className="text-center text-xs text-slate-400">
          <span>Don't have an account yet? </span>
          <Link to="/register" className="text-emerald-500 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};
