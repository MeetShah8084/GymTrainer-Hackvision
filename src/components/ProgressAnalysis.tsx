import { useState, useRef, useCallback, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import { getProgressAnalytics } from '../lib/n8nApi';
import {
  Dumbbell, LayoutDashboard, LineChart,
  Bell, BellOff, Settings, TrendingUp, TrendingDown, Search, Trophy,
  Menu,
  X, ArrowLeft, ArrowRight, Share2, CalendarDays, MessageSquare
} from 'lucide-react';

interface ProgressAnalysisProps {
  userName?: string;
  setUserName?: (name: string) => void;
  userId?: string;
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => void;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
}

interface VolumeData {
  date: string;
  volume: number;
}

interface StrengthHistoryEntry {
  date: string;
  '1rm': number;
}

interface StrengthProgression {
  exercise: string;
  history: StrengthHistoryEntry[];
}

interface DetailedStrength {
  exercise: string;
  last: number;
  current: number;
  change: number;
  trend: 'up' | 'down';
}

interface KeyMetrics {
  total_volume_load: number;
  volume_load_change: number;
  max_squat: number;
  avg_intensity: number;
  sessions_completed: number;
  sessions_target: number;
}

interface AnalyticsData {
  volume_progression: VolumeData[];
  strength_progression: StrengthProgression[];
  detailed_strength: DetailedStrength[];
  key_metrics: KeyMetrics;
}

export default function ProgressAnalysis({ userName = 'User', userId = '', navigateTo, notificationsEnabled = true, toggleNotifications }: ProgressAnalysisProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const [currentStrengthExerciseIndex, setCurrentStrengthExerciseIndex] = useState(0);


  useEffect(() => {
    if (userId) {
      setAnalyticsLoading(true);
      getProgressAnalytics(userId)
        .then(data => setAnalyticsData(data))
        .catch(err => console.error('Failed to fetch analytics:', err))
        .finally(() => setAnalyticsLoading(false));
    } else {
      setAnalyticsLoading(false);
    }
  }, [userId]);

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigateTo(page);
    }, 300);
  };

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const index = Math.round(scrollLeft / clientWidth);
    setActiveChart(index);
  }, []);

  const scrollToChart = useCallback((index: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * scrollRef.current.clientWidth, behavior: 'smooth' });
  }, []);
  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">

      {/* Sidebar (Desktop) */}
      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('dashboard')}>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('workouts')}>
            <span>Workouts</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('analysis')}>
            <span>Statistics</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('records')}>
            <span>Personal Records</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('schedule')}>
            <span>Schedule</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('settings')}>
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
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Progress Analysis</h1>
              <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Advanced metrics and performance trends</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button 
                onClick={toggleNotifications}
                className="flex size-10 cursor-pointer items-center justify-center rounded-xl transition-colors shrink-0"
                style={{
                  backgroundColor: notificationsEnabled ? 'rgba(236, 91, 19, 0.12)' : '#BFC9D1',
                  color: notificationsEnabled ? 'rgb(236, 91, 19)' : '#4b5563',
                }}
                title={notificationsEnabled ? 'Mute notifications' : 'Unmute notifications'}
              >
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
              <h1 className="text-xl font-bold leading-tight tracking-tight">Progress Analysis</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Meso-cycle Trends</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 overflow-y-auto custom-gradient relative md:pb-8">
          <div className="p-4 md:p-8 lg:p-12 xl:px-24 mx-auto max-w-7xl space-y-6 md:space-y-8 pb-24 md:pb-8">

            {/* --- MOBILE TABS (Removed) --- */}

            {/* --- DESKTOP PAGE TITLE & TABS --- */}
            <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Progress Analysis</h1>
                <p className="text-slate-400 text-lg">Advanced metrics and performance trends for the current mesocycle.</p>
              </div>
              {/* Tabs removed as requested */}
            </div>

            {/* --- COMMON KEY METRICS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Total Volume Load</p>
                  <div className={`flex items-center gap-1 shrink-0 px-1.5 py-0.5 rounded ${(analyticsData?.key_metrics?.volume_load_change ?? 0) >= 0 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                    {(analyticsData?.key_metrics?.volume_load_change ?? 0) >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    <span className="font-bold text-[10px] lg:text-xs">{analyticsData ? `${(analyticsData.key_metrics.volume_load_change ?? 0) > 0 ? '+' : ''}${analyticsData.key_metrics.volume_load_change ?? 0}%` : '+12.5%'}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {analyticsData ? `${(analyticsData.key_metrics.total_volume_load / 1000).toFixed(1)}k` : (analyticsLoading ? '...' : '0')}
                    <span className="text-[10px] md:text-sm font-normal text-slate-500"> kg</span>
                  </h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Max Squat <span className="hidden lg:inline">(PR)</span></p>
                  <div className="flex items-center gap-1 shrink-0 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <Trophy className="w-3 h-3" />
                    <span className="font-bold text-[10px] lg:text-xs">PR</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {analyticsData ? analyticsData.key_metrics.max_squat : (analyticsLoading ? '...' : '0')}
                    <span className="text-[10px] md:text-sm font-normal text-slate-500"> kg</span>
                  </h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{width: '92%'}}></div>
                </div>
              </div>


              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Sessions Completed</p>
                  <div className="flex items-center gap-1 shrink-0 text-slate-400 bg-slate-400/10 px-1.5 py-0.5 rounded">
                    <span className="font-bold text-[10px] lg:text-xs">Month</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                    {analyticsData ? analyticsData.key_metrics.sessions_completed : (analyticsLoading ? '...' : '0')}
                    <span className="hidden md:inline text-[10px] md:text-sm font-normal text-slate-500"> / {analyticsData?.key_metrics?.sessions_target ?? 30}</span>
                  </h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{width: `${analyticsData ? Math.min((analyticsData.key_metrics.sessions_completed / analyticsData.key_metrics.sessions_target) * 100, 100) : 0}%`}}></div>
                </div>
              </div>
            </div>

            {/* --- CHARTS SECTION --- */}

            {/* MOBILE: Swipe Carousel */}
            <div className="md:hidden">
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-0"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
              >
                {/* Card 1: Volume Progression */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl p-4 flex flex-col h-[400px]">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Volume Progression</h4>
                      <span className="text-xs font-semibold text-primary whitespace-nowrap">Current Month</span>
                    </div>
                    <p className="text-slate-400 text-[10px] mb-2">Cumulative weight moved per session</p>
                    <div className="flex-1 w-full flex items-end justify-between gap-0.5 relative aspect-[16/9] mt-2">
                      {analyticsData?.volume_progression?.map((d, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-primary/30 hover:bg-primary/50 transition-all rounded-t-[1px]" 
                          style={{ height: `${Math.max(((d.volume ?? 0) / Math.max(...(analyticsData?.volume_progression?.map(v => v.volume || 1) ?? [1]))) * 100, 2)}%` }}
                          title={`${d.date}: ${d.volume}kg`}
                        ></div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 px-1 text-[8px] text-slate-500 font-medium uppercase">
                      <span>Start</span><span>Mid</span><span>End</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Strength Progression */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl p-4 flex flex-col h-[400px]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                          {analyticsData?.strength_progression?.[currentStrengthExerciseIndex]?.exercise || 'Strength Progression'}
                        </h4>
                        <p className="text-slate-400 text-[10px]">1RM progress for selected exercise</p>
                      </div>
                      {(analyticsData?.strength_progression?.length ?? 0) > 1 && (
                        <div className="flex gap-1 ml-2">
                          <button 
                            onClick={() => setCurrentStrengthExerciseIndex(prev => (prev > 0 ? prev - 1 : (analyticsData?.strength_progression?.length ?? 1) - 1))}
                            className="p-1 rounded-full bg-primary/10 text-primary"
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                          <button 
                            onClick={() => setCurrentStrengthExerciseIndex(prev => (prev < (analyticsData?.strength_progression?.length ?? 1) - 1 ? prev + 1 : 0))}
                            className="p-1 rounded-full bg-primary/10 text-primary"
                          >
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 relative flex items-center justify-center mt-4">
                      {(analyticsData?.strength_progression?.[currentStrengthExerciseIndex]?.history?.length ?? 0) > 0 ? (
                        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                          <defs>
                            <linearGradient id="strengthGradientMobile" x1="0%" x2="0%" y1="0%" y2="100%">
                              <stop offset="0%" stopColor="#ec5b13" stopOpacity="0.2"></stop>
                              <stop offset="100%" stopColor="#ec5b13" stopOpacity="0"></stop>
                            </linearGradient>
                          </defs>
                          {/* Grid lines */}
                          {[40, 80, 120, 160].map(y => (
                            <line key={y} stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1={y} y2={y} className="dark:stroke-primary/10" />
                          ))}
                          
                          {(() => {
                            const strengthProg = analyticsData?.strength_progression?.[currentStrengthExerciseIndex];
                            if (!strengthProg || !strengthProg.history || strengthProg.history.length === 0) return null;
                            
                            const history = strengthProg.history;
                            const max1rm = Math.max(...history.map(h => h['1rm']));
                            const min1rm = Math.min(...history.map(h => h['1rm']));
                            const range = max1rm - min1rm || 1;
                            const points = history.map((h, idx) => {
                              const x = (idx / (history.length - 1 || 1)) * 400;
                              const y = 160 - ((h['1rm'] - min1rm) / range) * 120; // Use middle 120px for better vertical range
                              return { x, y, val: h['1rm'], date: h.date };
                            });

                            const pathData = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
                            const areaData = `${pathData} L${points[points.length-1].x},200 L0,200 Z`;

                            return (
                              <>
                                <path d={areaData} fill="url(#strengthGradientMobile)" />
                                <path d={pathData} fill="none" stroke="#ec5b13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                                {points.map((p, idx) => (
                                  <circle key={idx} cx={p.x} cy={p.y} fill="#ec5b13" r="4" />
                                ))}
                                {/* PR Label on last point */}
                                <g transform={`translate(${points[points.length-1].x}, ${points[points.length-1].y - 15})`}>
                                  <rect x="-35" y="-12" width="70" height="20" rx="4" fill="#ec5b13" />
                                  <text x="0" y="2" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                    {points[points.length-1].val}kg (PR)
                                  </text>
                                </g>
                              </>
                            );
                          })()}
                        </svg>
                      ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                          <LineChart className="w-12 h-12 mb-2 opacity-20" />
                          <p className="text-sm">No strength data for this exercise today</p>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between mt-4 px-1 text-[8px] text-slate-500 font-medium">
                      <span>START OF MONTH</span><span>END OF MONTH</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dot Indicators */}
              <div className="flex justify-center gap-2 mt-3">
                {[0, 1].map((i) => (
                  <button
                    key={i}
                    onClick={() => scrollToChart(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${activeChart === i
                      ? 'w-6 bg-primary'
                      : 'w-2 bg-slate-300 dark:bg-slate-600'
                      }`}
                  />
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VOLUME PROGRESSION CHART */}
              <div className="bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-primary/10 rounded-xl p-8 flex flex-col h-[450px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Volume Progression</h4>
                    <p className="text-slate-400 text-sm">Cumulative weight moved per session</p>
                  </div>
                </div>
                <div className="flex-1 w-full flex items-end justify-between gap-1 relative">
                  <div className="flex absolute inset-0 flex-col justify-between pointer-events-none py-2">
                    {[0, 1, 2, 3, 4].map(y => (
                      <div key={y} className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                    ))}
                  </div>
                  {analyticsData?.volume_progression?.map((d, i) => (
                    <div 
                      key={i} 
                      className="flex-1 bg-primary/30 hover:bg-primary/50 transition-all rounded-t-sm" 
                      style={{ height: `${Math.max(((d.volume ?? 0) / Math.max(...(analyticsData?.volume_progression?.map(v => v.volume || 1) ?? [1]))) * 100, 2)}%` }}
                      title={`${d.date}: ${d.volume}kg`}
                    ></div>
                  ))}
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-bold uppercase">
                  <span>Start of Month</span><span>Mid Month</span><span>End of Month</span>
                </div>
              </div>

              {/* STRENGTH PROGRESSION CHART */}
              <div className="bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-primary/10 rounded-xl p-8 flex flex-col h-[450px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-xl font-bold">{analyticsData?.strength_progression?.[currentStrengthExerciseIndex]?.exercise || 'Strength Progression'}</h4>
                    <p className="text-slate-400 text-sm">1RM progress for selected exercise</p>
                  </div>
                  {(analyticsData?.strength_progression?.length ?? 0) > 1 && (
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentStrengthExerciseIndex(prev => (prev > 0 ? prev - 1 : (analyticsData?.strength_progression?.length ?? 1) - 1))}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => setCurrentStrengthExerciseIndex(prev => (prev < (analyticsData?.strength_progression?.length ?? 1) - 1 ? prev + 1 : 0))}
                        className="p-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 transition-all"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex-1 relative flex items-center justify-center">
                  {(analyticsData?.strength_progression?.[currentStrengthExerciseIndex]?.history?.length ?? 0) > 0 ? (
                    <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="strengthGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                          <stop offset="0%" stopColor="#ec5b13" stopOpacity="0.2"></stop>
                          <stop offset="100%" stopColor="#ec5b13" stopOpacity="0"></stop>
                        </linearGradient>
                      </defs>
                      {[40, 80, 120, 160].map(y => (
                        <line key={y} stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1={y} y2={y} className="dark:stroke-primary/10" />
                      ))}
                      
                      {(() => {
                        const strengthProg = analyticsData?.strength_progression?.[currentStrengthExerciseIndex];
                        if (!strengthProg || !strengthProg.history || strengthProg.history.length === 0) return null;

                        const history = strengthProg.history;
                        const max1rm = Math.max(...history.map(h => h['1rm']));
                        const min1rm = Math.min(...history.map(h => h['1rm']));
                        const range = max1rm - min1rm || 1;
                        const points = history.map((h, idx) => {
                          const x = (idx / (history.length - 1 || 1)) * 400;
                          const y = 160 - ((h['1rm'] - min1rm) / range) * 120;
                          return { x, y, val: h['1rm'] };
                        });

                        const pathData = `M${points.map(p => `${p.x},${p.y}`).join(' L')}`;
                        const areaData = `${pathData} L${points[points.length-1].x},200 L0,200 Z`;

                        return (
                          <>
                            <path d={areaData} fill="url(#strengthGradient)" />
                            <path d={pathData} fill="none" stroke="#ec5b13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                            {points.map((p, idx) => (
                              <circle key={idx} cx={p.x} cy={p.y} fill="#ec5b13" r="4" />
                            ))}
                            <g transform={`translate(${points[points.length-1].x}, ${points[points.length-1].y - 15})`}>
                              <rect x="-35" y="-12" width="70" height="20" rx="4" fill="#ec5b13" />
                              <text x="0" y="2" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
                                {points[points.length-1].val}kg (PR)
                              </text>
                            </g>
                          </>
                        );
                      })()}
                    </svg>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 text-center">
                      <TrendingUp className="w-16 h-16 mb-4 opacity-20" />
                      <p className="text-lg font-medium">No strength data for this exercise today</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="md:hidden space-y-4">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight mb-4">Strength Breakdown</h2>

              {(analyticsData?.detailed_strength?.length ?? 0) > 0 ? (
                analyticsData?.detailed_strength?.map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Dumbbell className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{s.exercise}</p>
                        <p className="text-xs text-slate-500">Last: {s.last} kg</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{s.current} kg <span className="text-[10px] text-primary">1RM</span></p>
                      <p className={`text-[10px] font-bold uppercase ${s.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.change >= 0 ? '+' : ''}{s.change}%
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center bg-white dark:bg-primary/5 rounded-xl border border-dashed border-slate-300 dark:border-primary/20">
                  <p className="text-slate-500 text-sm">No strength milestones recorded yet.</p>
                </div>
              )}
            </div>



            {/* --- EXERCISE DETAILS TABLE (DESKTOP MAINLY) --- */}
            <div className="hidden md:block bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-primary/10 rounded-xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 dark:border-primary/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h4 className="text-xl font-bold">Main Lift Performance</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input className="bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg pl-10 pr-4 py-2 text-sm w-full md:w-64 focus:ring-1 focus:ring-primary text-slate-900 dark:text-slate-200 placeholder-slate-500" placeholder="Search exercises..." type="text" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-200 dark:border-primary/10">
                      <th className="px-6 py-4">Exercise</th>
                      <th className="px-6 py-4">Prev PR</th>
                      <th className="px-6 py-4">Current PR</th>
                      <th className="px-6 py-4">Change</th>
                      <th className="px-6 py-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-primary/10">
                    {(analyticsData?.detailed_strength?.length ?? 0) > 0 ? (
                      analyticsData?.detailed_strength?.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-200/50 dark:hover:bg-primary/5 transition-colors">
                          <td className="px-6 py-4 font-bold">{s.exercise}</td>
                          <td className="px-6 py-4 text-slate-400">{s.last} kg</td>
                          <td className="px-6 py-4">{s.current} kg</td>
                          <td className={`px-6 py-4 font-bold ${s.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{s.change >= 0 ? '+' : ''}{s.change}%</td>
                          <td className="px-6 py-4">{s.trend === 'up' ? <LineChart className="w-5 h-5 text-emerald-500" /> : <TrendingDown className="w-5 h-5 text-rose-500" />}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic font-medium">
                          No exercise performance data available for the current period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>



          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
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
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('settings')}>
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Settings</span>
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
