import { useState, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ArrowRight, CheckCircle2, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';

interface LoginProps {
  initialMode?: 'login' | 'signup';
}

export default function Login({ initialMode = 'login' }: LoginProps) {
  const navigate = useNavigate();

  // step 1: Login, 2: Waiting/Auth, 3: Success
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [waitMode, setWaitMode] = useState<'auth' | 'email'>('auth');
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState<string | null>(null);

  const set = (field: keyof typeof form, value: string) => setForm(f => ({ ...f, [field]: value }));

  const checkOnboardingState = async (userId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        navigate('/login');
        return;
      }

      console.log('[Onboarding Check] Fetching for user:', userId);
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?user_id=eq.${userId}&select=height`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`
        }
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const rows = await res.json();
      console.log('[Onboarding Check] Profile rows:', rows);

      if (!rows || rows.length === 0 || rows[0].height === null) {
        navigate('/user-details');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Onboarding check exception:", err);
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    // If the URL changes to /login or /signup, update mode
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await checkOnboardingState(session.user.id);
      }
    };
    checkSession();

    // This listens for auth state changes. If user authenticates in Tab B (the email link),
    // LocalStorage updates, and this fires in Tab A immediately.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        if (_event === 'SIGNED_IN') {
          // If we were waiting for email confirmation, show success then redirect
          if (step === 2 && waitMode === 'email') {
            setStep(3);
            setTimeout(() => checkOnboardingState(session.user.id), 1500);
          } else {
            // Small buffer to allow trigger to create DB copy before checking
            setTimeout(() => checkOnboardingState(session.user.id), 500);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password || 'dummy-password'
      });

      if (error) {
        setError(error.message);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) await checkOnboardingState(session.user.id);
      }
    } catch (err: any) {
      console.error('Error during sign in:', err);
      setError(err.message || 'An unexpected error occurred');
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email) return;
    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setWaitMode('auth');
    setStep(2); // Transition to waiting

    setTimeout(async () => {
      try {
        // Server-side check to see if the account already exists
        const { data: emailExists, error: rpcError } = await supabase.rpc('check_email_exists', {
          lookup_email: form.email
        });

        if (rpcError) {
          console.error("RPC Error:", rpcError);
        }

        if (emailExists) {
          setError("Account already created");
          setStep(1);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password || 'dummy-password',
          options: {
            emailRedirectTo: `${window.location.origin}/oauth`
          }
        });

        if (error) {
          setError(error.message);
          setStep(1);
        } else if (data.session === null) {
          // Email confirmation is required
          setWaitMode('email');
        } else {
          // Actually success without confirmation
          navigate('/dashboard');
        }
      } catch (err: any) {
        console.error('Error during sign up:', err);
        setError(err.message || 'An unexpected error occurred');
        setStep(1);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex bg-[#0C0C0C] text-[#F8F8F8]">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-center w-[45%] p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #1A0E08 0%, #0C0C0C 100%)' }}>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full opacity-8"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />

        <div className="absolute top-12 left-12 flex items-center gap-3 z-10 text-[#F8F8F8]">
          <img src={companyIcon} alt="Logo" className="w-10 h-10 rounded-xl object-contain filter invert brightness-0" />
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: 1 }}>
            PROGRESSIVE TRAINER
          </span>
        </div>

        <div className="relative z-10">
          <div className="inline-block px-3 py-1 text-xs font-bold rounded-lg mb-4 text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20">
            AI-POWERED FITNESS
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 52, lineHeight: 1.05, marginBottom: 16 }}>
            TRACK EVERY<br />
            <span className="text-[#F97316]">REP. EVERY</span><br />
            MILESTONE.
          </h1>
          <p className="text-[#A3A3A3] text-[15px] leading-[1.7] max-w-[360px]">
            Log workouts, break PRs, and get personalized coaching from an AI that knows your training history inside out.
          </p>

          <div className="flex gap-6 mt-8">
            {[['10k+', 'Athletes'], ['94%', 'Consistency'], ['450k', 'KG Lifted']].map(([val, label]) => (
              <div key={label}>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 28 }} className="text-[#F97316]">{val}</div>
                <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: 1 }} className="text-[#A3A3A3] uppercase">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-6 pt-16 lg:p-12 relative bg-[#1A110B] lg:bg-transparent overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 lg:hidden w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />

        <div className="w-full max-w-md relative z-10 mt-8 lg:mt-0">
          <div className="flex items-center gap-2 mb-10 lg:hidden text-[#F8F8F8]">
            <img src={companyIcon} alt="Logo" className="w-10 h-10 rounded-xl object-contain filter invert brightness-0" />
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>PROGRESSIVE TRAINER</span>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && mode === 'login' && (
              <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 4 }}>WELCOME BACK</h2>
                <p className="text-[#A3A3A3] text-sm mb-8">Sign in to continue your journey</p>
                {error && <div className="text-red-500 text-sm mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">EMAIL ADDRESS</label>
                    <input
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                      type="email" placeholder="you@example.com" required
                      value={form.email} onChange={e => set('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">PASSWORD</label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                        type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                        value={form.password} onChange={e => set('password', e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-white">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium transition-colors">
                    <span>Sign In</span><ArrowRight size={16} />
                  </button>
                </form>

                <p className="text-center mt-6 text-sm text-[#A3A3A3] flex flex-col gap-2">
                  <span>
                    New here?{' '}
                    <Link to="/signup" className="font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                      Create account
                    </Link>
                  </span>
                  <Link to="/forgot-password" className="font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    Forgot Password?
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 1 && mode === 'signup' && (
              <motion.div key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 4 }}>CREATE ACCOUNT</h2>
                <p className="text-[#A3A3A3] text-sm mb-8">Start tracking your progress today</p>
                {error && <div className="text-red-500 text-sm mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

                <form onSubmit={handleSignup} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">EMAIL ADDRESS</label>
                    <input
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                      type="email" placeholder="you@example.com" required
                      value={form.email} onChange={e => set('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">PASSWORD</label>
                    <div className="relative">
                      <input
                        className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 pr-10 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                        type={showPass ? 'text' : 'password'} placeholder="Min. 8 characters" required
                        value={form.password} onChange={e => set('password', e.target.value)}
                      />
                      <button type="button" onClick={() => setShowPass(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] hover:text-white">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">CONFIRM PASSWORD</label>
                    <input
                      className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                      type="password" placeholder="••••••••" required
                      value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)}
                    />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium transition-colors">
                    <span>Create Account</span><ArrowRight size={16} />
                  </button>
                </form>

                <p className="text-center mt-6 text-sm text-[#A3A3A3]">
                  Already have an account?{' '}
                  <Link to="/login" className="font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    Sign in
                  </Link>
                </p>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center justify-center text-center py-12">
                <div className="relative mb-8">
                  <div className="w-20 h-20 rounded-full border-4 border-[#333] flex items-center justify-center relative">
                    <motion.div
                      className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[#F97316]"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    <Mail size={32} className="text-[#F97316]" />
                  </div>
                </div>

                <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>
                  {waitMode === 'email' ? 'CHECK YOUR EMAIL' : 'WAITING CONFIRMATION'}
                </h2>
                <p className="text-[#A3A3A3] text-[15px] leading-relaxed max-w-[280px]">
                  {waitMode === 'email'
                    ? 'A verification link has been sent to your email address. This page will automatically redirect once confirmed.'
                    : 'Connecting to Supabase to securely authenticate your session. Please hold on...'}
                </p>
                {waitMode === 'email' && (
                  <button onClick={() => setStep(1)} className="mt-8 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
                    Back to login
                  </button>
                )}
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-[#1A0E08] border border-[#F97316]/30 text-[#F97316] flex items-center justify-center mb-8"
                >
                  <CheckCircle2 size={40} />
                </motion.div>

                <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 8 }}>AUTHENTICATED</h2>
                <p className="text-[#A3A3A3] text-sm">
                  Redirecting to your dashboard...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
