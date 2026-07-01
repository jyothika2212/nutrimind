import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Shield,
  Zap,
  CheckCircle,
  ChevronDown,
  ArrowRight,
  TrendingUp,
  Heart,
  MessageSquare
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const stats = [
    { value: '98%', label: 'Success Rate' },
    { value: '500k+', label: 'Active Users' },
    { value: '4.9/5', label: 'App Rating' },
    { value: '25M+', label: 'Calories Logged' }
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI Diet Generation',
      desc: 'Instant meal recommendations aligned to your medical files, weight goals, and allergies.'
    },
    {
      icon: Sparkles,
      title: 'AI Calorie Scanner',
      desc: 'Snap a picture of your dish to estimate macros and logs in real-time.'
    },
    {
      icon: MessageSquare,
      title: 'Dietitian Consultations',
      desc: 'Book secure video calls and chat live with fully licensed medical nutritionists.'
    },
    {
      icon: Shield,
      title: 'Health Vitals Vault',
      desc: 'Track heart rate, blood pressure, sugar logs, and BMI trends in a encrypted timeline.'
    }
  ];

  const faqs = [
    {
      q: 'How does the AI analyze my nutrition needs?',
      a: 'We leverage Gemini AI models mapped with clinical guidelines. Input your age, height, weight, activity indexes, allergies, and custom medical cases to compute daily calorie quotas.'
    },
    {
      q: 'Can I connect with human dietitians?',
      a: 'Yes! Our platform supports licensed dietitians and nutritionists. Assign a specialist to view your progress, edit recipes, and consult via video sessions.'
    },
    {
      q: 'Is there a free trial for the Premium Tier?',
      a: 'Absolutely. We offer a 14-day free trial on our Premium plan, giving access to weekly planners, grocery lists, and unlimited dietitian chats.'
    }
  ];

  return (
    <div className="bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 min-h-screen selection:bg-emerald-500 selection:text-white">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl text-white">
            <Sparkles size={20} />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-emerald-600 dark:from-white dark:to-green-400">
            NutriMind AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold hover:text-emerald-500 transition-colors">
            Login
          </Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 min-h-screen justify-center">
        {/* Background glow assets */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-400/20 dark:bg-emerald-500/10 rounded-full blur-3xl glow-accent -z-10" />

        <div className="flex-1 space-y-6 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4">
              AI-Powered Wellness
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none mb-6">
              Reclaim Your Health with <br className="hidden sm:inline" />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-green-500">
                NutriMind AI
              </span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              The ultimate personalized nutrition assistant. Real-time calorie logs, clinical dietary checks, instant recipes, and certified doctor support.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
          >
            <button onClick={() => navigate('/register')} className="btn-primary w-full sm:w-auto text-base py-3 px-8">
              Start Free Trial <ArrowRight size={18} />
            </button>
            <a href="#features" className="btn-secondary w-full sm:w-auto text-base py-3 px-8">
              Explore Features
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex-1 relative"
        >
          {/* Landing Illustration Mock */}
          <div className="glass-card p-6 border-slate-200/60 dark:border-slate-800/60 shadow-2xl relative">
            <div className="absolute -top-6 -right-6 bg-emerald-500 text-white font-bold p-4 rounded-2xl shadow-lg flex items-center gap-2 animate-bounce">
              <TrendingUp size={20} />
              <span>Target Achieved!</span>
            </div>
            
            {/* Visual representation of dashboard widgets */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                <span className="font-bold text-slate-700 dark:text-slate-200">Daily Calorie Balance</span>
                <span className="text-emerald-500 font-extrabold">1,450 / 2,100 kcal</span>
              </div>
              
              <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full" style={{ width: '70%' }} />
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center border dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Protein</span>
                  <span className="text-sm font-bold">95g / 120g</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center border dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Carbs</span>
                  <span className="text-sm font-bold">180g / 220g</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-center border dark:border-slate-800">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Fat</span>
                  <span className="text-sm font-bold">45g / 65g</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="bg-white/50 dark:bg-slate-900/30 py-12 border-y border-slate-200/50 dark:border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((st, i) => (
            <div key={i} className="text-center">
              <h3 className="text-3xl sm:text-4xl font-extrabold text-emerald-500 mb-1">{st.value}</h3>
              <p className="text-sm text-slate-400 font-medium">{st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything You Need to Live Healthy</h2>
          <p className="text-slate-400 text-sm">Powered by clinical databases and medical experts to streamline your diet logs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((ft, i) => {
            const Icon = ft.icon;
            return (
              <div key={i} className="glass-card p-6 border-slate-200/40 dark:border-slate-800/40 space-y-4 hover:-translate-y-1 transition-all duration-300">
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-500 inline-block">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">{ft.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{ft.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About / Mission Section */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-6 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">About NutriMind AI</h2>
          <p className="text-slate-400 text-sm">Empowering you to make informed lifestyle choices.</p>
        </div>
        <div className="glass-card p-8 border-slate-200/50 dark:border-slate-800/50 leading-relaxed text-slate-600 dark:text-slate-300 text-sm space-y-4">
          <p>
            In today’s fast-paced world, maintaining a balanced diet can be challenging, and <strong>NutriMind AI</strong> is designed to simplify this journey by offering personalized nutritional guidance and support. Whether aiming to improve eating habits, manage a health condition, or achieve fitness goals, this app serves as a comprehensive tool for better health and wellness.
          </p>
          <p>
            It leverages technology to provide features such as meal planning, dietary tracking, personalized recommendations, and access to educational resources. By incorporating extensive food databases, the app allows users to log meals, monitor calorie and nutrient intake, and gain insights into the nutritional value of various foods. It also offers recipe suggestions, grocery assistance, and interactive features for connecting with nutrition professionals.
          </p>
          <p>
            Designed to empower individuals to make informed lifestyle choices, NutriMind AI is ideal for managing weight, enhancing athletic performance, accommodating dietary restrictions, or simply adopting healthier habits.
          </p>
          <div className="border-t dark:border-slate-800 pt-4 mt-6 text-xs text-slate-400 italic">
            <strong>Disclaimer:</strong> While NutriMind AI offers valuable support, it should complement—not replace—professional medical or dietary advice, and users are encouraged to consult qualified healthcare providers for personalized recommendations.
          </div>
        </div>
      </section>

      {/* Pricing Models */}
      <section className="py-20 px-6 max-w-7xl mx-auto space-y-12 bg-white/50 dark:bg-slate-900/10 rounded-3xl border dark:border-slate-850">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold">Simple, Clear Subscription Plans</h2>
          <p className="text-slate-400 text-sm">Cancel anytime. Start building target diets today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-card p-8 border-slate-200/60 dark:border-slate-800/60 space-y-6 relative flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Standard Free</h3>
              <p className="text-slate-400 text-xs">Essential tracking tools for daily calories control.</p>
              <div className="text-3xl font-extrabold">$0 <span className="text-xs text-slate-400">/ forever</span></div>
              <ul className="space-y-3 pt-4 text-xs font-medium">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Daily Calorie Log</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Basic Water/Weight Logger</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> 10 Food Search Queries per Day</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="btn-secondary w-full py-2.5">
              Get Started
            </button>
          </div>

          {/* Plan 2 */}
          <div className="glass-card p-8 border-emerald-500/30 dark:border-emerald-500/20 bg-emerald-500/5 space-y-6 relative flex flex-col justify-between">
            <div className="absolute top-4 right-4 bg-emerald-500 text-white font-extrabold text-[10px] tracking-wider px-2.5 py-1 rounded-full uppercase">
              POPULAR
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-bold">Premium AI Pro</h3>
              <p className="text-slate-400 text-xs">Unlock clinical checks, AI scanning, and live nutritionists.</p>
              <div className="text-3xl font-extrabold">$14.99 <span className="text-xs text-slate-400">/ month</span></div>
              <ul className="space-y-3 pt-4 text-xs font-medium">
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Unlimited AI Weekly Planners</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Image Food scan parser</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Direct Messaging with private dietitian</li>
                <li className="flex items-center gap-2"><CheckCircle size={16} className="text-emerald-500" /> Advanced Health Vitals Aggregates</li>
              </ul>
            </div>
            <button onClick={() => navigate('/register')} className="btn-primary w-full py-2.5">
              Subscribe Now
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <h2 className="text-3xl font-bold text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card border-slate-200/50 dark:border-slate-800/50 overflow-hidden">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-sm sm:text-base"
              >
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`transform transition-transform ${faqOpen === idx ? 'rotate-180' : ''}`} />
              </button>
              {faqOpen === idx && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-slate-400 leading-relaxed border-t dark:border-slate-800 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 dark:border-slate-800/50 py-12 px-6 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-emerald-500" />
            <span className="font-extrabold text-slate-800 dark:text-slate-100">NutriMind AI</span>
          </div>
          <p className="text-xs text-slate-400">&copy; {new Date().getFullYear()} NutriMind AI Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
