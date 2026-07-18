import React, { useState, useEffect } from 'react';
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

  const handleGoogleLoginResponse = async (response: any) => {
    setErrorMsg('');
    try {
      const res = await api.post('/auth/google', {
        idToken: response.credential,
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
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Google Sign-In verification failed');
    }
  };

  const handleMockGoogleLogin = async () => {
    setErrorMsg('');
    try {
      const res = await api.post('/auth/google-mock', {
        name: 'Mock Google User',
        email: 'mockgoogle@example.com',
        googleId: '1234567890',
        profilePicture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'
      });
      dispatch(loginSuccess(res.data));
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.error || 'Mock Google login failed');
    }
  };

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (typeof window !== 'undefined' && (window as any).google) {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';
        try {
          (window as any).google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleLoginResponse,
          });
          (window as any).google.accounts.id.renderButton(
            document.getElementById('google-signin-btn'),
            { theme: 'outline', size: 'large', width: 384 }
          );
        } catch (err) {
          console.error('Error initializing Google login:', err);
        }
      }
    };

    const timer = setTimeout(initializeGoogleSignIn, 500);
    return () => clearTimeout(timer);
  }, []);

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

          <div id="google-signin-btn" className="w-full flex justify-center"></div>
          <button
            type="button"
            onClick={handleMockGoogleLogin}
            className="w-full btn-secondary py-2 text-xs font-bold flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-amber-500" />
            Bypass Google OAuth (Mock Login)
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
