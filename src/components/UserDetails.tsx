import { useState } from 'react';
import companyIcon from '../assets/company_icon.png';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function UserDetails() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    age: '',
    height: '',
    weight: '',
    phone: '',
    bodyType: 'Mesomorph'
  });

  const setProfile = (field: keyof typeof profileForm, value: string) => setProfileForm(f => ({ ...f, [field]: value }));

  const handleBuildProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    // Validate numeric inputs up front to prevent NaN being sent to Supabase
    const ageVal = Number(profileForm.age);
    const heightVal = Number(profileForm.height);
    const weightVal = Number(profileForm.weight);

    if (!profileForm.fullName.trim()) { setError('Full name is required'); setIsSaving(false); return; }
    if (!profileForm.age || isNaN(ageVal)) { setError('Please enter a valid age'); setIsSaving(false); return; }
    if (!profileForm.height || isNaN(heightVal)) { setError('Please enter a valid height'); setIsSaving(false); return; }
    if (!profileForm.weight || isNaN(weightVal)) { setError('Please enter a valid weight'); setIsSaving(false); return; }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user || !session?.access_token) throw new Error("Not authenticated or missing token");

      const updatePayload = {
        name: profileForm.fullName,
        age: ageVal,
        height: heightVal,
        weight: weightVal,
        phone_number: profileForm.phone,
        body_type: profileForm.bodyType
      };

      console.log('[Profile Save] Sending authenticated fetch for user:', user.id);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/profiles?user_id=eq.${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updatePayload)
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('[Profile Save] Server error:', errText);
        throw new Error(`Profile update failed: ${response.statusText}`);
      }

      const responseData = await response.json();
      console.log('[Profile Save] Result data:', responseData);

      if (responseData.length === 0) {
        throw new Error("Profile not found or access denied. Please verify your session.");
      }

      navigate('/dashboard');
    } catch (err: any) {
      console.error('Failed to save profile', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0C0C0C] text-[#F8F8F8]">
      {/* Left panel - branding */}
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
            Please complete your profile so the AI trainer can properly calibrate your experience.
          </p>
        </div>
      </div>

      {/* Right panel - Dynamic Flow */}
      <div className="flex-1 flex flex-col items-center justify-start lg:justify-center p-6 pt-16 lg:p-12 relative bg-[#1A110B] lg:bg-transparent overflow-hidden">
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 lg:hidden w-80 h-80 rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #F97316, transparent)' }} />

        <div className="w-full max-w-md relative z-10 w-full mt-8 lg:mt-0">
          <div className="flex items-center gap-2 mb-10 lg:hidden text-[#F8F8F8]">
            <img src={companyIcon} alt="Logo" className="w-10 h-10 rounded-xl object-contain filter invert brightness-0" />
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 22, letterSpacing: 0.5 }}>PROGRESSIVE TRAINER</span>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col w-full text-left">
            <div className="inline-block px-3 py-1 text-[10px] font-bold rounded-lg mb-4 text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/20 self-start">
              STEP 2 OF 2
            </div>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, marginBottom: 4 }}>BUILD YOUR PROFILE</h2>
            <p className="text-[#A3A3A3] text-sm mb-8">Help your AI trainer personalize your experience</p>

            {error && <div className="text-red-500 text-sm mb-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl">{error}</div>}

            <form onSubmit={handleBuildProfile} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">FULL NAME *</label>
                <input
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                  type="text" placeholder="Alex Rivers" required
                  value={profileForm.fullName} onChange={e => setProfile('fullName', e.target.value)}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">AGE</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    type="number" placeholder="25" required
                    value={profileForm.age} onChange={e => setProfile('age', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">HEIGHT (cm)</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    type="number" placeholder="175" required
                    value={profileForm.height} onChange={e => setProfile('height', e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">WEIGHT (kg)</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    type="number" step="0.1" placeholder="75.0" required
                    value={profileForm.weight} onChange={e => setProfile('weight', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-1">PHONE NUMBER</label>
                  <input
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#F97316] transition-colors"
                    type="tel" placeholder="+1234567890" required
                    value={profileForm.phone} onChange={e => setProfile('phone', e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-[#A3A3A3] tracking-wider block mb-2">BODY TYPE</label>
                <div className="flex gap-2">
                  {['Ectomorph', 'Mesomorph', 'Endomorph'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setProfile('bodyType', type)}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors border ${profileForm.bodyType === type
                          ? 'bg-transparent border-[#F97316] text-[#F97316]'
                          : 'bg-[#1A1A1A] border-[#333] text-[#A3A3A3] hover:text-white'
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isSaving}
                className="w-full py-3 rounded-lg flex items-center justify-center gap-2 mt-4 bg-[#F97316] hover:bg-[#EA580C] text-white disabled:opacity-50 font-medium transition-colors">
                <span>{isSaving ? 'Saving...' : 'Start Training'}</span><ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut();
                  navigate('/login');
                }}
                className="w-full mt-4 py-2 text-sm text-[#A3A3A3] hover:text-white transition-colors"
              >
                Cancel and Sign Out
              </button>
            </form>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
