import { useState } from 'react';
import { supabase } from '../lib/supabase';
import companyIcon from '../assets/company_icon.png';
import { Link } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

export default function ForgotPassword() {
  const { showNotification } = useNotification();

  const [email, setEmail] = useState('');
  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showNotification('Please enter your email first.');
      return;
    }
    
    // Send password recovery link via Supabase
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) {
      showNotification(`Error: ${error.message}`);
      return;
    }

    showNotification('Recovery link sent to ' + email);
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

          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 4 }}>RESET PASSWORD</h2>
          <p className="text-[#A3A3A3] text-sm mb-8">Enter your details to create a new password</p>

          <form onSubmit={handleSendLink} className="flex flex-col gap-4">
            
            {/* Email Field with Send Link Button*/}
            <div>
              <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">EMAIL ADDRESS</label>
              <input
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                type="email" placeholder="you@example.com" required
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <button type="submit"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium transition-colors">
              <span>Send Recovery Link</span>
            </button>

          </form>

          <p className="text-center mt-6 text-sm text-[#A3A3A3]">
             Back to{' '}
             <Link to="/login" className="font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
               Sign in
             </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
