import { useState, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../contexts/NotificationContext';

export default function ResetPassword() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVerifyingLink, setIsVerifyingLink] = useState(true);

  const [remoteVerified, setRemoteVerified] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      // Find reqId in search or hash
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const reqId = urlParams.get('reqId') || hashParams.get('reqId');
      
      const localReqId = localStorage.getItem('forgot_req_id');

      const processSession = async (activeSession: any) => {
        if (reqId && reqId !== localReqId) {
          // This is Device B
          const channel = supabase.channel(`reset-${reqId}`);
          channel.subscribe(async (status) => {
            if (status === 'SUBSCRIBED') {
              await channel.send({
                type: 'broadcast',
                event: 'verified',
                payload: {
                  access_token: activeSession.access_token,
                  refresh_token: activeSession.refresh_token
                }
              });
              
              // Clear the session on Device B since Device A will use it
              await supabase.auth.signOut();
              
              setIsVerifyingLink(false);
              setRemoteVerified(true);
            }
          });
        } else {
          // This is Device A
          localStorage.removeItem('forgot_req_id');
          setIsVerifyingLink(false);
        }
      };

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await processSession(session);
      } else {
        // Fallback: wait briefly to see if auth state updates
        setTimeout(async () => {
          const { data: { session: delayedSession } } = await supabase.auth.getSession();
          if (delayedSession) {
            await processSession(delayedSession);
          } else {
            // Also accept if they land directly here and somehow already have a valid token logic handled
            showNotification('Invalid or expired reset link. Please request a new one.');
            navigate('/forgot-password');
          }
        }, 1500);
      }
    };
    
    checkSession();
  }, [navigate]); // Intentionally omitting showNotification from deps so it doesn't re-run

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification("Passwords don't match");
      return;
    }
    if (newPassword.length < 8) {
      showNotification("Password must be at least 8 characters");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      showNotification(`Error updating password: ${error.message}`);
      return;
    }

    // Password changed correctly. Log out and navigate to login to ensure clean state
    await supabase.auth.signOut();
    showNotification('Password updated successfully! Please sign in with your new password.');
    navigate('/login');
  };

  if (isVerifyingLink) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0C0C0C]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-[#F97316]/20 border-t-[#F97316] animate-spin" />
          <p className="text-[#A3A3A3] font-medium animate-pulse">Verifying secure link...</p>
        </div>
      </div>
    );
  }

  if (remoteVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0C0C0C]">
        <div className="flex flex-col items-center gap-6 text-center max-w-md p-6">
          <div className="size-20 rounded-full bg-[#F97316]/10 flex items-center justify-center text-[#F97316]">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
             <h2 className="text-3xl font-bold text-[#F8F8F8] font-['Barlow_Condensed'] mb-2">SUCCESSFULLY VERIFIED</h2>
             <p className="text-[#A3A3A3] text-[15px] leading-relaxed">
               Your email has been verified. You can now close this window and continue setting your new password on the device where you originally requested the reset link.
             </p>
          </div>
        </div>
      </div>
    );
  }

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

          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 36, marginBottom: 4 }}>CREATE NEW PASSWORD</h2>
          <p className="text-[#A3A3A3] text-sm mb-8">Enter a strong, secure, and new password below.</p>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            
            {/* New Password Field */}
            <div className="w-full">
              <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">NEW PASSWORD</label>
              <input
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                type="password" placeholder="••••••••" required
                value={newPassword} onChange={e => setNewPassword(e.target.value)}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="w-full">
              <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">CONFIRM PASSWORD</label>
              <input
                className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                type="password" placeholder="••••••••" required
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit"
              className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-medium transition-colors">
              <span>Update Password</span>
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
