import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import { supabase } from '../lib/supabase';
import { updateProfile } from '../lib/n8nApi';
import {
  Menu, Settings as SettingsIcon, ArrowLeft,
  Bell as BellIcon, BellOff, Mail, Phone,
  Camera, Shield, Edit3, X, Dumbbell, LineChart,
  LayoutDashboard, CalendarDays, Trophy, DoorOpen, MessageSquare
} from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

interface SettingsProps {
  userName?: string;
  setUserName?: (name: string) => void;
  userId?: string;
  avatarUrl?: string | null;
  setAvatarUrl?: (url: string | null) => void;
  
  notificationsEnabled?: boolean;
  setNotificationsEnabled?: (value: boolean) => void;
}

export default function Settings({ 
  userName = 'User', 
  setUserName, 
  userId = '',
  avatarUrl = null,
  setAvatarUrl,
  notificationsEnabled = true, 
  setNotificationsEnabled 
}: SettingsProps) {
  const navigate = useNavigate();
  const navigateTo = (path: string) => navigate('/' + path);
  const { showNotification } = useNotification();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string>('Loading...');
  const [memberSince, setMemberSince] = useState<string>('');

  // Editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('+1 (555) 902-1234');
  const [editHeight, setEditHeight] = useState('');
  const [editWeight, setEditWeight] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [localNotificationsEnabled, setLocalNotificationsEnabled] = useState(notificationsEnabled);

  // Toggles state
  const [toggles, setToggles] = useState({
    workoutReminder: true,
    twoFactorAuth: false,
  });

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (user && !error) {
        setUserEmail(user.email || 'No email');

        // Fetch name from profiles table for accuracy
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, avatar_url, phone_number, height, weight')
          .eq('user_id', user.id)
          .single();

        const fullName = profileData?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        if (setUserName) setUserName(fullName);
        setEditName(fullName);
        setEditEmail(user.email || '');
        if (profileData?.avatar_url && setAvatarUrl) setAvatarUrl(profileData.avatar_url);
        
        if (profileData?.height) setEditHeight(profileData.height.toString());
        if (profileData?.weight) setEditWeight(profileData.weight.toString());

        // Use phone from profiles table, fall back to metadata
        if (profileData?.phone_number) {
          setEditPhone(profileData.phone_number);
        } else if (user.user_metadata?.phone) {
          setEditPhone(user.user_metadata.phone);
        }

        // Format creation date
        const date = new Date(user.created_at);
        const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
        setMemberSince(`Member since ${date.toLocaleDateString(undefined, options)}`);
      }
    }
    fetchUser();
  }, []);

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigateTo(page);
    }, 300);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigateTo('login');
  };

  const handleSaveSettings = async (shouldNavigate: boolean = false) => {
    // Save notifications
    if (setNotificationsEnabled) setNotificationsEnabled(localNotificationsEnabled);

    // Save profile if in edit mode or if edits were made
    if (isEditingProfile && editName.trim() && editEmail.trim()) {
      setIsSavingProfile(true);
      try {
        await supabase.auth.updateUser({
          email: editEmail,
          data: { full_name: editName, phone: editPhone }
        });

        const { data: { user } } = await supabase.auth.getUser();
        
        const hVal = editHeight ? parseInt(editHeight) : null;
        const wVal = editWeight ? parseFloat(editWeight) : null;

        await supabase.from('profiles').update({ name: editName, phone_number: editPhone, height: hVal, weight: wVal }).eq('user_id', user?.id || '');

        updateProfile(
          user?.id || '',
          editName,
          editEmail,
          editPhone,
          wVal || undefined,
          hVal || undefined
        ).catch(err => console.warn("Failed to ping n8n webhook", err));

        if (setUserName) setUserName(editName);
        setUserEmail(editEmail);
      } catch (err) {
        console.error('Failed to update profile:', err);
      } finally {
        setIsSavingProfile(false);
        setIsEditingProfile(false);
      }
    }

    if (shouldNavigate) {
      navigateTo('dashboard');
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;
      const file = e.target.files[0];
      setIsUploading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(fileName);

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('user_id', user.id);
      if (updateError) throw updateError;
      
      if (setAvatarUrl) setAvatarUrl(publicUrl);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      showNotification('Failed to upload avatar. Please make sure the avatars storage bucket exists and is properly configured in Supabase.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark font-sans overflow-hidden">

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 size-8 bg-primary rounded-lg flex items-center justify-center p-1">
              <img src={companyIcon} alt="Progressive Trainer" className="w-full h-full object-contain filter invert brightness-0" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">ProgressiveTrainer</h2>
          </div>
          <button className="shrink-0 text-slate-500 hover:text-primary cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4 font-['Poppins']">
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('dashboard')}>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('workouts')}>
            <span>Workouts</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('analysis')}>
            <span>Statistics</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('records')}>
            <span>Personal Records</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('schedule')}>
            <span>Schedule</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('settings')}>
            <span>Settings</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('aichat')}>
            <span>AI Chat</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">

        {/* Desktop Header */}
        <header className="hidden md:flex shrink-0 z-20 items-center justify-between px-8 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Settings</h1>
              <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Manage your account preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="shrink-0 size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm overflow-hidden relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <>{userName.charAt(0).toUpperCase()}</>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 shrink-0 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-primary/10">
          <div className="flex items-center gap-3">
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-900 dark:text-white">Settings</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Preferences</p>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 flex flex-col items-center overflow-y-auto w-full custom-gradient">
          <div className="w-full max-w-[800px] px-4 md:px-8 py-6 md:py-8 flex flex-col gap-8 pb-32">

            {/* Profile Section */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-primary/10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold dark:text-white">Profile Information</h3>
                {!isEditingProfile ? (
                  <button onClick={() => setIsEditingProfile(true)} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                    Edit <Edit3 className="size-4" />
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button onClick={() => setIsEditingProfile(false)} disabled={isSavingProfile} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-sm font-bold transition-colors">
                      Cancel
                    </button>
                    <button onClick={() => handleSaveSettings(false)} disabled={isSavingProfile} className="bg-primary hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-50">
                      {isSavingProfile ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
                <div className="relative shrink-0">
                  <div className="size-24 rounded-full border-4 border-primary/20 bg-primary/10 shadow-inner flex items-center justify-center text-primary font-bold text-5xl overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <>{userName.charAt(0).toUpperCase()}</>
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 size-8 bg-primary rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center text-white hover:bg-orange-600 transition-colors cursor-pointer disabled:opacity-50">
                    {isUploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Camera className="size-4" />}
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={isUploading} />
                  </label>
                </div>
                <div className="text-center sm:text-left w-full sm:w-auto flex-1">
                  {!isEditingProfile ? (
                    <>
                      <h4 className="text-lg font-bold dark:text-white">{userName}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">{memberSince}</p>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 max-w-sm">
                      <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Display Name</label>
                      <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-[#1A1A1A] border border-slate-200 dark:border-[#333] rounded-lg text-sm focus:outline-none focus:border-primary transition-colors text-slate-900 dark:text-white" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{memberSince}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                  <div className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors " + (isEditingProfile ? "bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#333] focus-within:border-primary" : "bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-primary/10")}>
                    <Mail className="size-5 text-slate-400 shrink-0" />
                    {!isEditingProfile ? (
                      <span className="text-sm dark:text-slate-200 truncate">{userEmail}</span>
                    ) : (
                      <input type="email" value={editEmail} onChange={e => setEditEmail(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Phone Number</label>
                  <div className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors " + (isEditingProfile ? "bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#333] focus-within:border-primary" : "bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-primary/10")}>
                    <Phone className="size-5 text-slate-400 shrink-0" />
                    {!isEditingProfile ? (
                      <span className="text-sm dark:text-slate-200">{editPhone}</span>
                    ) : (
                      <input type="tel" value={editPhone} onChange={e => setEditPhone(e.target.value)} className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Weight (kg)</label>
                  <div className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors " + (isEditingProfile ? "bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#333] focus-within:border-primary" : "bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-primary/10")}>
                    {!isEditingProfile ? (
                      <span className="text-sm dark:text-slate-200">{editWeight ? `${editWeight} kg` : '-'}</span>
                    ) : (
                      <input type="number" step="0.1" value={editWeight} onChange={e => setEditWeight(e.target.value)} placeholder="e.g. 75.5" className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Height (cm)</label>
                  <div className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors " + (isEditingProfile ? "bg-slate-50 dark:bg-[#1A1A1A] border-slate-200 dark:border-[#333] focus-within:border-primary" : "bg-slate-50 dark:bg-background-dark border-slate-200 dark:border-primary/10")}>
                    {!isEditingProfile ? (
                      <span className="text-sm dark:text-slate-200">{editHeight ? `${editHeight} cm` : '-'}</span>
                    ) : (
                      <input type="number" value={editHeight} onChange={e => setEditHeight(e.target.value)} placeholder="e.g. 180" className="w-full bg-transparent border-none outline-none text-sm text-slate-900 dark:text-white" />
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Toggles */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                <div
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: localNotificationsEnabled ? 'rgba(236, 91, 19, 0.12)' : '#BFC9D1',
                    color: localNotificationsEnabled ? 'rgb(236, 91, 19)' : '#4b5563',
                  }}
                >
                  {localNotificationsEnabled
                    ? <BellIcon className="size-5" />
                    : <BellOff className="size-5" />}
                </div>
                <h3 className="text-xl font-bold dark:text-white">Notification Settings</h3>
                {!localNotificationsEnabled && <span className="ml-auto text-xs font-semibold uppercase tracking-wider text-slate-400">Muted</span>}
              </div>
              <div className="flex flex-col gap-4">

                {/* Workout Reminder */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <p className="font-medium dark:text-slate-200">Workout Reminder</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Daily alerts to keep you on track</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={localNotificationsEnabled}
                      onChange={() => setLocalNotificationsEnabled(prev => !prev)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-[#1a0e08] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-slate-300 dark:border-[#333]"></div>
                  </label>
                </div>

              </div>
            </section>

            {/* Privacy & Security */}
            <section className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-primary/10">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Shield className="size-5" />
                </div>
                <h3 className="text-xl font-bold dark:text-white">Privacy & Security</h3>
              </div>
              <div className="flex flex-col gap-4">
                {/* Two Factor Authentication */}
                <div className="flex items-center justify-between py-2">
                  <div className="flex flex-col">
                    <p className="font-medium dark:text-slate-200">Two-Factor Authentication</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={toggles.twoFactorAuth} onChange={() => handleToggle('twoFactorAuth')} />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-[#1a0e08] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-slate-300 dark:border-[#333]"></div>
                  </label>
                </div>
              </div>
            </section>

            {/* Account Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between mt-4">
              <button
                className="px-6 py-3 rounded-xl flex items-center justify-center gap-2 border border-slate-300 dark:border-white/20 text-slate-700 dark:text-white font-bold hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                onClick={handleSignOut}
              >
                <DoorOpen className="w-5 h-5" />
                Sign Out
              </button>
              <div className="flex flex-col sm:flex-row gap-4 justify-end">
                <button
                  className="px-8 py-3 rounded-xl border border-slate-200 dark:border-primary/20 font-bold dark:text-white hover:bg-slate-100 dark:hover:bg-primary/5 transition-colors"
                  onClick={async () => {
                    setLocalNotificationsEnabled(notificationsEnabled);
                    if (setAvatarUrl) setAvatarUrl(null);
                    
                    // Persist the reset to Supabase
                    if (userId) {
                      await supabase
                        .from('profiles')
                        .update({ avatar_url: null })
                        .eq('user_id', userId);
                    }
                    
                    navigateTo('dashboard');
                  }}
                >
                  Discard Changes
                </button>
                <button
                  className="px-8 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:brightness-110 transition-all"
                  onClick={() => handleSaveSettings(true)}
                >
                  Save Settings
                </button>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Train</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('schedule')}>
            <CalendarDays className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Sched</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('settings')}>
            <SettingsIcon className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Settings</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('aichat')}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">AI Chat</span>
          </a>
        </div>
      </nav>

    </div>
  );
}
