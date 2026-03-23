import { useState, useRef, useCallback } from 'react';
import companyIcon from '../assets/company_icon.png';
import {
  Dumbbell, LayoutDashboard, LineChart,
  Bell, BellOff, Settings, TrendingUp, TrendingDown, Search, Trophy,
  Menu,
  X, ArrowLeft, Share2, CalendarDays, MessageSquare
} from 'lucide-react';

interface ProgressAnalysisProps {
  userName?: string;
  setUserName?: (name: string) => void;
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => void;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
}

export default function ProgressAnalysis({ userName = 'User', navigateTo, notificationsEnabled = true, toggleNotifications }: ProgressAnalysisProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeChart, setActiveChart] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Total Volume Load</p>
                  <div className="flex items-center gap-1 shrink-0 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-bold text-[10px] lg:text-xs">+12.5%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">124,500 <span className="text-[10px] md:text-sm font-normal text-slate-500">kg</span></h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Max Squat <span className="hidden lg:inline">(1RM)</span></p>
                  <div className="flex items-center gap-1 shrink-0 text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                    <TrendingDown className="w-3 h-3" />
                    <span className="font-bold text-[10px] lg:text-xs">-2.1%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">185 <span className="text-[10px] md:text-sm font-normal text-slate-500">kg</span></h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <div className="flex flex-row items-start justify-between gap-2 mb-1 md:mb-2 z-10 relative">
                  <p className="text-slate-500 dark:text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-wider leading-tight">Avg Intensity</p>
                  <div className="flex items-center gap-1 shrink-0 text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    <TrendingUp className="w-3 h-3" />
                    <span className="font-bold text-[10px] lg:text-xs">+4.3%</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 z-10 relative">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">84 <span className="text-[10px] md:text-sm font-normal text-slate-500">%</span></h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%] rounded-full"></div>
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
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">24 <span className="hidden md:inline text-[10px] md:text-sm font-normal text-slate-500">/ 30</span></h3>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[80%] rounded-full"></div>
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
                      <span className="text-xs font-semibold text-primary whitespace-nowrap">Last 6 Months</span>
                    </div>
                    <div className="flex-1 w-full flex items-end justify-between gap-1 relative aspect-[16/9] mt-2">
                      <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm h-[30%]" title="Day 1: 4,200kg"></div>
                      <div className="flex-1 bg-primary/30 hover:bg-primary/40 transition-all rounded-t-sm h-[45%]" title="Day 2: 5,100kg"></div>
                      <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm h-[25%]" title="Day 3: 3,800kg"></div>
                      <div className="flex-1 bg-primary/40 hover:bg-primary/50 transition-all rounded-t-sm h-[60%]" title="Day 4: 7,200kg"></div>
                      <div className="flex-1 bg-primary/50 hover:bg-primary/60 transition-all rounded-t-sm h-[55%]" title="Day 5: 6,800kg"></div>
                      <div className="flex-1 bg-primary/40 hover:bg-primary/50 transition-all rounded-t-sm h-[70%]" title="Day 6: 8,400kg"></div>
                      <div className="flex-1 bg-primary/60 hover:bg-primary/70 transition-all rounded-t-sm h-[85%]" title="Day 7: 10,200kg"></div>
                    </div>
                    <div className="flex justify-between mt-2 px-1 text-[8px] text-slate-500 font-medium uppercase">
                      <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: Strength Progression */}
                <div className="snap-center shrink-0 w-full px-1">
                  <div className="bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/20 rounded-xl p-4 flex flex-col h-[400px]">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">Strength Progression</h4>
                      <div className="flex gap-3">
                        <div className="flex items-center gap-1.5">
                          <div className="size-2 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Squat</span>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-40">
                          <div className="size-2 rounded-full bg-slate-400"></div>
                          <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-300">Deadlift</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 relative flex items-center justify-center">
                      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="strengthGradientMobile" x1="0%" x2="0%" y1="0%" y2="100%">
                            <stop offset="0%" stopColor="#ec5b13" stopOpacity="0.2"></stop>
                            <stop offset="100%" stopColor="#ec5b13" stopOpacity="0"></stop>
                          </linearGradient>
                        </defs>
                        <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="40" y2="40" className="dark:stroke-primary/10"></line>
                        <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="80" y2="80" className="dark:stroke-primary/10"></line>
                        <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="120" y2="120" className="dark:stroke-primary/10"></line>
                        <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="160" y2="160" className="dark:stroke-primary/10"></line>
                        <path d="M0,150 L50,140 L100,145 L150,120 L200,100 L250,105 L300,85 L350,60 L400,55 L400,200 L0,200 Z" fill="url(#strengthGradientMobile)"></path>
                        <path d="M0,150 L50,140 L100,145 L150,120 L200,100 L250,105 L300,85 L350,60 L400,55" fill="none" stroke="#ec5b13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                        <circle cx="0" cy="150" fill="#ec5b13" r="4"></circle>
                        <circle cx="100" cy="145" fill="#ec5b13" r="4"></circle>
                        <circle cx="200" cy="100" fill="#ec5b13" r="4"></circle>
                        <circle cx="300" cy="85" fill="#ec5b13" r="4"></circle>
                        <circle cx="400" cy="55" fill="#ec5b13" r="4"></circle>
                      </svg>
                      <div className="absolute top-[25%] right-0 translate-x-1/2 -translate-y-full bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl">
                        185kg (PR)
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 px-1 text-[8px] text-slate-500 font-medium">
                      <span>JAN 01</span><span>JAN 08</span><span>JAN 15</span><span>JAN 22</span><span>JAN 29</span>
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

            {/* DESKTOP: Grid Layout */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* VOLUME PROGRESSION CHART */}
              <div className="bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-primary/10 rounded-xl p-8 flex flex-col h-[450px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white">Volume Progression</h4>
                    <p className="text-slate-400 text-sm">Cumulative weight moved per session (30-day view)</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-xs text-slate-400"><span className="size-2 rounded-full bg-primary"></span> Volume</span>
                    <span className="flex items-center gap-1 text-xs text-slate-400"><span className="size-2 rounded-full bg-slate-300 dark:bg-slate-600 border border-primary/30"></span> Baseline</span>
                  </div>
                </div>
                <div className="flex-1 w-full flex items-end justify-between gap-2 relative">
                  <div className="flex absolute inset-0 flex-col justify-between pointer-events-none py-2">
                    <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                    <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                    <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                    <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                    <div className="w-full border-t border-slate-200 dark:border-primary/10"></div>
                  </div>
                  <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm h-[30%]" title="Day 1: 4,200kg"></div>
                  <div className="flex-1 bg-primary/30 hover:bg-primary/40 transition-all rounded-t-sm h-[45%]" title="Day 2: 5,100kg"></div>
                  <div className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm h-[25%]" title="Day 3: 3,800kg"></div>
                  <div className="flex-1 bg-primary/40 hover:bg-primary/50 transition-all rounded-t-sm h-[60%]" title="Day 4: 7,200kg"></div>
                  <div className="flex-1 bg-primary/50 hover:bg-primary/60 transition-all rounded-t-sm h-[55%]" title="Day 5: 6,800kg"></div>
                  <div className="flex-1 bg-primary/40 hover:bg-primary/50 transition-all rounded-t-sm h-[70%]" title="Day 6: 8,400kg"></div>
                  <div className="flex-1 bg-primary/60 hover:bg-primary/70 transition-all rounded-t-sm h-[85%]" title="Day 7: 10,200kg"></div>
                  <div className="flex-1 bg-primary/30 hover:bg-primary/40 transition-all rounded-t-sm h-[40%]" title="Day 8: 4,900kg"></div>
                  <div className="flex-1 bg-primary/50 hover:bg-primary/60 transition-all rounded-t-sm h-[65%]" title="Day 9: 7,800kg"></div>
                  <div className="flex-1 bg-primary/70 hover:bg-primary/80 transition-all rounded-t-sm h-[95%]" title="Day 10: 11,500kg"></div>
                  <div className="flex-1 bg-primary/40 hover:bg-primary/50 transition-all rounded-t-sm h-[50%]" title="Day 11: 6,100kg"></div>
                  <div className="flex-1 bg-primary/60 hover:bg-primary/70 transition-all rounded-t-sm h-[80%]" title="Day 12: 9,600kg"></div>
                </div>
                <div className="flex justify-between mt-4 px-2 text-[10px] text-slate-500 font-bold uppercase">
                  <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
                </div>
              </div>

              {/* STRENGTH PROGRESSION CHART */}
              <div className="bg-slate-100 dark:bg-surface-dark border border-slate-200 dark:border-primary/10 rounded-xl p-8 flex flex-col h-[450px]">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h4 className="text-xl font-bold">Strength Progression</h4>
                    <p className="text-slate-400 text-sm">Estimated 1RM for main lifts</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-primary shadow-sm shadow-primary/40"></div>
                      <span className="text-xs font-semibold">Squat</span>
                    </div>
                    <div className="flex items-center gap-1.5 opacity-40">
                      <div className="size-2 rounded-full bg-slate-400"></div>
                      <span className="text-xs font-semibold">Deadlift</span>
                    </div>
                  </div>
                </div>
                <div className="flex-1 relative flex items-center justify-center">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 400 200">
                    <defs>
                      <linearGradient id="strengthGradient" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor="#ec5b13" stopOpacity="0.2"></stop>
                        <stop offset="100%" stopColor="#ec5b13" stopOpacity="0"></stop>
                      </linearGradient>
                    </defs>
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="40" y2="40" className="dark:stroke-primary/10"></line>
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="80" y2="80" className="dark:stroke-primary/10"></line>
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="120" y2="120" className="dark:stroke-primary/10"></line>
                    <line stroke="#e2e8f0" strokeWidth="0.5" x1="0" x2="400" y1="160" y2="160" className="dark:stroke-primary/10"></line>
                    <path d="M0,150 L50,140 L100,145 L150,120 L200,100 L250,105 L300,85 L350,60 L400,55 L400,200 L0,200 Z" fill="url(#strengthGradient)"></path>
                    <path d="M0,150 L50,140 L100,145 L150,120 L200,100 L250,105 L300,85 L350,60 L400,55" fill="none" stroke="#ec5b13" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
                    <circle cx="0" cy="150" fill="#ec5b13" r="4"></circle>
                    <circle cx="100" cy="145" fill="#ec5b13" r="4"></circle>
                    <circle cx="200" cy="100" fill="#ec5b13" r="4"></circle>
                    <circle cx="300" cy="85" fill="#ec5b13" r="4"></circle>
                    <circle cx="400" cy="55" fill="#ec5b13" r="4"></circle>
                  </svg>
                  <div className="absolute top-[55px] right-0 translate-x-1/2 -translate-y-full bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-xl">
                    185kg (PR)
                  </div>
                </div>
              </div>
            </div>

            {/* --- DETAILED STRENGTH STATS (MOBILE) --- */}
            <div className="md:hidden space-y-4">
              <h2 className="text-slate-900 dark:text-white text-lg font-bold tracking-tight mb-4">Strength Breakdown</h2>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Deadlift</p>
                    <p className="text-xs text-slate-500">Last: 210 kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">225 kg <span className="text-[10px] text-primary">1RM</span></p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">+8.5%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Bench Press</p>
                    <p className="text-xs text-slate-500">Last: 120 kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">130 kg <span className="text-[10px] text-primary">1RM</span></p>
                  <p className="text-[10px] text-emerald-500 font-bold uppercase">+2.1%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-primary/5 border border-slate-200 dark:border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">Overhead Press</p>
                    <p className="text-xs text-slate-500">Last: 75 kg</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">82 kg <span className="text-[10px] text-primary">1RM</span></p>
                  <p className="text-[10px] text-amber-500 font-bold uppercase">+0.0%</p>
                </div>
              </div>
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
                      <th className="px-6 py-4">Prev 1RM</th>
                      <th className="px-6 py-4">Current 1RM</th>
                      <th className="px-6 py-4">Change</th>
                      <th className="px-6 py-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200 dark:divide-primary/10">
                    <tr className="hover:bg-slate-200/50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold">Low Bar Back Squat</td>
                      <td className="px-6 py-4 text-slate-400">175.0 kg</td>
                      <td className="px-6 py-4">185.0 kg</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">+5.7%</td>
                      <td className="px-6 py-4"><LineChart className="w-5 h-5 text-emerald-500" /></td>
                    </tr>
                    <tr className="hover:bg-slate-200/50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold">Conventional Deadlift</td>
                      <td className="px-6 py-4 text-slate-400">210.0 kg</td>
                      <td className="px-6 py-4">225.0 kg</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">+7.1%</td>
                      <td className="px-6 py-4"><LineChart className="w-5 h-5 text-emerald-500" /></td>
                    </tr>
                    <tr className="hover:bg-slate-200/50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold">Bench Press</td>
                      <td className="px-6 py-4 text-slate-400">125.0 kg</td>
                      <td className="px-6 py-4">122.5 kg</td>
                      <td className="px-6 py-4 text-rose-500 font-bold">-2.0%</td>
                      <td className="px-6 py-4"><TrendingDown className="w-5 h-5 text-rose-500" /></td>
                    </tr>
                    <tr className="hover:bg-slate-200/50 dark:hover:bg-primary/5 transition-colors">
                      <td className="px-6 py-4 font-bold">Overhead Press</td>
                      <td className="px-6 py-4 text-slate-400">80.0 kg</td>
                      <td className="px-6 py-4">85.0 kg</td>
                      <td className="px-6 py-4 text-emerald-500 font-bold">+6.2%</td>
                      <td className="px-6 py-4"><LineChart className="w-5 h-5 text-emerald-500" /></td>
                    </tr>
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
