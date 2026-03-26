import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyIcon from '../assets/company_icon.png';
import type { PRRecord } from '../App';
import { syncPersonalRecords } from '../lib/n8nApi';
import {
  Dumbbell,
  LayoutDashboard,
  LineChart,
  Trophy,
  TrendingUp,
  Bell,
  BellOff,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Share2,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

interface PersonalRecordsProps {
  userName?: string;
  setUserName?: (name: string) => void;
  userId?: string;
  
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
  personalRecords?: PRRecord[];
  setPersonalRecords?: (records: PRRecord[]) => void;
}

// All exercises across all muscle groups
const ALL_EXERCISES = [
  'Barbell Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Push-ups', 'Cable Crossovers', 'Decline Press',
  'Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift', 'T-Bar Row', 'Seated Cable Row',
  'Squats', 'Leg Press', 'Lunges', 'Romanian Deadlift', 'Calf Raises', 'Leg Extensions',
  'Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skullcrushers', 'Preacher Curls', 'Tricep Dips',
  'Crunches', 'Planks', 'Cable Crunches', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts'
];

const PersonalRecords: React.FC<PersonalRecordsProps> = ({
  userName = "Loading...",
  userId = '',
  notificationsEnabled = true, toggleNotifications,
  personalRecords = [], setPersonalRecords }) => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => navigate('/' + path);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Fetch personal records via n8n on mount
  useEffect(() => {
    if (userId && setPersonalRecords) {
      syncPersonalRecords(userId)
        .then((response: any) => {
          let data = [];
          if (Array.isArray(response) && response[0]?.data) {
            data = response[0].data;
          } else if (response?.data) {
            data = response.data;
          } else if (Array.isArray(response)) {
            data = response;
          }

          if (data && data.length > 0) {
            const records: PRRecord[] = data.map((r: any) => ({
              id: r.id,
              exerciseName: r.exercise_name,
              weight: parseFloat(r.max_weight) || 0,
              improvement: 0,
              date: r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : 'NOT SET'
            }));
            setPersonalRecords(records);
          }
        })
        .catch(err => console.error('Failed to fetch PRs from webhook:', err));
    }
  }, [userId]);

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigateTo(page);
    }, 300);
  };

  // Merge ALL exercises with actual PR data — show 0kg for missing exercises
  const allPRs: PRRecord[] = ALL_EXERCISES.map(name => {
    const existing = personalRecords.find(pr => pr.exerciseName === name);
    if (existing) return existing;
    return {
      id: `default-${name}`,
      exerciseName: name,
      weight: 0,
      improvement: 0,
      date: 'NOT SET'
    };
  });

  const sorted = [...allPRs].sort((a, b) => b.weight - a.weight);
  const gold = sorted[0];
  const silver = sorted[1];
  const bronze = sorted[2];

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('dashboard')}><span>Dashboard</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('workouts')}><span>Workouts</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('analysis')}><span>Statistics</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('records')}><span>Personal Records</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('schedule')}><span>Schedule</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('settings')}><span>Settings</span></a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('aichat')}><span>AI Chat</span></a>
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
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Personal Records</h1>
              <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Your all-time best lifts and achievements</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button onClick={toggleNotifications} className="flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors shrink-0"
                style={{ backgroundColor: notificationsEnabled ? 'rgba(236, 91, 19, 0.12)' : '#BFC9D1', color: notificationsEnabled ? 'rgb(236, 91, 19)' : '#4b5563' }}
                title={notificationsEnabled ? 'Mute notifications' : 'Unmute notifications'}>
                {notificationsEnabled ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
              </button>
              <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all" onClick={() => { setIsSidebarOpen(false); navigateTo('settings'); }}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="shrink-0 size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
              {userName.charAt(0).toUpperCase()}
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
              <h1 className="text-xl font-bold leading-tight tracking-tight">Personal Records</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Your Best Lifts</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full custom-gradient relative pb-24 md:pb-8">
          <div className="max-w-[1200px] mx-auto w-full px-4 lg:px-10 py-8">
            {/* Podium - always shown */}
            <div className="flex items-end justify-center gap-3 md:gap-6 mb-12 mt-4">
              {/* Silver - 2nd */}
              <div className="flex flex-col items-center w-1/3 max-w-[280px]">
                <span className="text-3xl md:text-4xl mb-2">🥈</span>
                <div className="w-full rounded-xl border border-slate-600 bg-surface-dark/60 p-4 md:p-5 text-center">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">2nd Place</p>
                  <p className="text-slate-300 text-sm font-bold truncate">{silver?.exerciseName || '—'}</p>
                  <p className="text-slate-100 text-xl md:text-2xl font-black mt-1">{silver?.weight || 0} kg</p>
                </div>
              </div>
              {/* Gold - 1st */}
              <div className="flex flex-col items-center w-1/3 max-w-[300px] -mb-2">
                <span className="text-4xl md:text-5xl mb-2">🏆</span>
                <div className="w-full rounded-xl border-2 border-amber-500 bg-surface-dark/80 p-5 md:p-6 text-center shadow-lg shadow-amber-500/10">
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">1st Place</p>
                  <p className="text-amber-400 text-sm md:text-base font-bold truncate">{gold?.exerciseName || '—'}</p>
                  <p className="text-white text-2xl md:text-3xl font-black mt-1">{gold?.weight || 0} kg</p>
                </div>
              </div>
              {/* Bronze - 3rd */}
              <div className="flex flex-col items-center w-1/3 max-w-[260px]">
                <span className="text-2xl md:text-3xl mb-2">🥉</span>
                <div className="w-full rounded-xl border border-primary/50 bg-surface-dark/60 p-3 md:p-4 text-center">
                  <p className="text-[10px] text-primary/60 font-bold uppercase tracking-widest mb-1">3rd Place</p>
                  <p className="text-primary/80 text-sm font-bold truncate">{bronze?.exerciseName || '—'}</p>
                  <p className="text-slate-100 text-lg md:text-xl font-black mt-1">{bronze?.weight || 0} kg</p>
                </div>
              </div>
            </div>
            {/* PR Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {sorted.slice(3).map((pr) => (
                <div key={pr.id} className="bg-surface-dark border border-slate-700/50 rounded-2xl p-5 md:p-6 hover:border-primary/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-slate-200 text-base font-bold">{pr.exerciseName}</h3>
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-teal-400 bg-teal-400/10 px-2.5 py-1 rounded-full">
                      <TrendingUp className="w-3 h-3" /> +{pr.improvement.toFixed(1)} kg
                    </span>
                  </div>
                  <p className="text-slate-100 text-4xl md:text-5xl font-black tracking-tight">
                    {pr.weight} <span className="text-lg font-semibold text-slate-400">kg</span>
                  </p>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-3">SET ON {pr.date}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">Train</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('schedule')}>
            <CalendarDays className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">Sched</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5 stroke-[3px]" /><span className="text-[9px] font-bold uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('settings')}>
            <Settings className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">Settings</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('aichat')}>
            <MessageSquare className="w-5 h-5" /><span className="text-[9px] font-medium uppercase tracking-widest">AI Chat</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default PersonalRecords;
