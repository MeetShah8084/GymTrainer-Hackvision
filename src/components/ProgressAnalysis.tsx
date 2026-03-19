import { useState, useRef, useCallback } from 'react';
import {
  Dumbbell, LayoutDashboard, Activity, LineChart, CalendarDays,
  User, Bell, Settings, TrendingUp, TrendingDown, Search, Sparkles, Trophy
} from 'lucide-react';

interface ProgressAnalysisProps {
  navigateTo: (page: 'dashboard' | 'workouts' | 'analysis' | 'records') => void;
}

export default function ProgressAnalysis({ navigateTo }: ProgressAnalysisProps) {
  const [activeChart, setActiveChart] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

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
      <aside className="hidden md:flex flex-col w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark">
        <div className="p-6 flex items-center gap-3">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <Dumbbell className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ProgressiveTrainer</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Activity className="w-5 h-5" />
            <span>Workouts</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5" />
            <span>Statistics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5" />
            <span>Personal Records</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => { }}>
            <CalendarDays className="w-5 h-5" />
            <span>Schedule</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => { }}>
            <User className="w-5 h-5" />
            <span>Profile</span>
          </a>
        </nav>

        {/* Attribution */}
        <div className="p-4 border-t border-primary/10 space-y-4">
          <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
            <a href="https://www.flaticon.com/free-icons/trainer" title="trainer icons" className="hover:text-primary underline">Trainer icons created by Freepik - Flaticon</a>
          </div>
          <div className="bg-primary/10 rounded-xl p-4">
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Premium Tier</p>
            <p className="text-sm dark:text-slate-300">Next billing: Oct 12</p>
          </div>
        </div>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">

        {/* Desktop Header */}
        <header className="hidden md:flex shrink-0 z-20 items-center justify-between px-8 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Progress Analysis</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Advanced metrics and performance trends</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all">
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuKnEGAJLw_uJw2VMxs25mta_OgaPiA2mKgyRXMjPTdj-GR8mCXyew3b4Bi75YnziIODw-afQkW_1qetLtJXYBrObwTtimIbmQ9MnIlF4T6I4TJIr5_nZ7MsNB9_MVfud6sa_5IZj5twfAl7jx56RxN3_kNq5WhkXFEp-CQjEh4P9njY3kdlm8ceNFFBcFCGsI1qZOcma-uXn57vTN-yfJ1LOW5eP7tyWnJ1btFqnVbkJA4t2FCRtsLvvfm8n6ztpZC_GM9J-iEK99')" }}></div>
          </div>
        </header>

        {/* Mobile Header */}
        <div className="md:hidden flex shrink-0 z-20 items-center p-4 justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
          <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border-2 border-primary">
            <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVrzpsn6_U1odECZkvw4RS520J75eoPMqvh9YQ0JbkGmUJcjso9-P6XoCX8c3Z09xexCRYGXmwGJ8JqZQJtZmNcdG-3j74bfXinTwW9OMizO4NAgHyVwigVwOfsCzlSBl3SNSa50DM9Of5-J8XpJ8rORai6IkrZUllEe9kkDIeaJ8R3R_KcVLZFHoGZzFibHIDxx4x1eMSTtOm_kHt_tHtVb7NESWjUNT1XuA5Fhn9-zzkUw3ZbKTG1M5JI0TAG6kreGxSlJcSlpHt" />
          </div>
          <div className="flex flex-col ml-3 flex-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Progress</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">Analysis</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-primary transition-colors">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto custom-gradient relative md:pb-8">
          <div className="p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">

            {/* --- MOBILE TABS --- */}
            <div className="md:hidden overflow-x-auto no-scrollbar">
              <div className="flex gap-6 border-b border-slate-200 dark:border-primary/10">
                <a className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-2 whitespace-nowrap" href="#">
                  <p className="text-sm font-bold tracking-wide">Overview</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 whitespace-nowrap" href="#">
                  <p className="text-sm font-medium">Strength</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 whitespace-nowrap" href="#">
                  <p className="text-sm font-medium">Volume</p>
                </a>
                <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 dark:text-slate-400 pb-3 pt-2 whitespace-nowrap" href="#">
                  <p className="text-sm font-medium">History</p>
                </a>
              </div>
            </div>

            {/* --- DESKTOP PAGE TITLE & TABS --- */}
            <div className="hidden md:flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-2">Progress Analysis</h1>
                <p className="text-slate-400 text-lg">Advanced metrics and performance trends for the current mesocycle.</p>
              </div>
              <div className="flex bg-slate-200 dark:bg-surface-dark p-1 rounded-xl shrink-0">
                <button className="px-6 py-2 bg-primary rounded-lg text-sm font-bold text-white shadow-lg shadow-primary/20">Overview</button>
                <button className="px-6 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Volume</button>
                <button className="px-6 py-2 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors">Strength</button>
              </div>
            </div>

            {/* --- COMMON KEY METRICS GRID --- */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold md:font-bold uppercase tracking-wider mb-0 md:mb-1">Total Volume Load</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-3xl font-bold md:font-black text-slate-900 dark:text-white">124,500 <span className="text-[10px] md:text-sm font-normal text-slate-500">kg</span></h3>
                </div>
                <div className="flex items-center gap-1 mt-1 md:absolute md:top-6 md:right-6 md:mt-0">
                  <span className="md:hidden text-emerald-500 font-bold flex items-center gap-1 text-[10px]">
                    <TrendingUp className="w-3 h-3" /> +12.5%
                  </span>
                  <span className="hidden md:flex text-emerald-500 text-xs font-bold items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> 12.5%
                  </span>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold md:font-bold uppercase tracking-wider mb-0 md:mb-1">Max Squat (1RM)</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-3xl font-bold md:font-black text-slate-900 dark:text-white">185 <span className="text-[10px] md:text-sm font-normal text-slate-500">kg</span></h3>
                </div>
                <div className="flex items-center gap-1 mt-1 md:absolute md:top-6 md:right-6 md:mt-0">
                  <span className="md:hidden text-emerald-500 font-bold flex items-center gap-1 text-[10px]">
                    <TrendingUp className="w-3 h-3" /> +5.2%
                  </span>
                  <span className="hidden md:flex text-rose-500 text-xs font-bold items-center gap-1">
                    <TrendingDown className="w-4 h-4" /> 2.1%
                  </span>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[92%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold md:font-bold uppercase tracking-wider mb-0 md:mb-1">Avg Intensity</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-3xl font-bold md:font-black text-slate-900 dark:text-white">84 <span className="text-[10px] md:text-sm font-normal text-slate-500">%</span></h3>
                </div>
                <div className="flex items-center gap-1 mt-1 md:absolute md:top-6 md:right-6 md:mt-0">
                  <span className="md:hidden text-emerald-500 font-bold flex items-center gap-1 text-[10px]">
                    <TrendingUp className="w-3 h-3" /> +3.1%
                  </span>
                  <span className="hidden md:flex text-emerald-500 text-xs font-bold items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> 4.3%
                  </span>
                </div>
                <div className="hidden md:block mt-4 h-1 bg-slate-200 dark:bg-primary/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[84%] rounded-full"></div>
                </div>
              </div>

              <div className="bg-white dark:bg-primary/5 md:bg-slate-100 md:dark:bg-surface-dark border border-slate-200 dark:border-primary/20 md:border-slate-200 md:dark:border-primary/10 rounded-xl p-4 md:p-6 relative overflow-hidden group shadow-sm flex flex-col md:block gap-1">
                <div className="hidden md:block absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>
                <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold md:font-bold uppercase tracking-wider mb-0 md:mb-1">Sessions Completed</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl md:text-3xl font-bold md:font-black text-slate-900 dark:text-white">24 <span className="hidden md:inline text-[10px] md:text-sm font-normal text-slate-500">/ 30</span></h3>
                </div>
                <div className="flex items-center gap-1 mt-1 md:absolute md:top-6 md:right-6 md:mt-0">
                  <span className="md:hidden text-slate-500 font-bold flex items-center gap-1 text-[10px] uppercase">
                    Month
                  </span>
                  <span className="hidden md:flex text-slate-500 text-xs font-bold">Month</span>
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

            {/* --- PREMIUM PROMO INSIGHT (MOBILE) --- */}
            <div className="md:hidden">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-[#ff8c52] p-6 shadow-lg shadow-primary/20">
                <div className="relative z-10">
                  <h3 className="text-white text-lg font-bold">Smart Recommendations</h3>
                  <p className="text-white/80 text-sm mt-1 max-w-[240px]">Based on your 1RM, you are ready to increase Squat intensity by 2.5% next week.</p>
                  <button className="mt-4 px-4 py-2 bg-white text-primary text-xs font-bold rounded-full shadow-sm">View Details</button>
                </div>
                <Sparkles className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 rotate-12" />
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

            {/* Mobile Footer Attribution */}
            <div className="md:hidden mt-8 mb-4 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                <a href="https://www.flaticon.com/free-icons/trainer" title="trainer icons" className="hover:text-primary transition-colors underline">Trainer icons created by Freepik - Flaticon</a>
              </span>
            </div>

          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Workouts</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-6 h-6 stroke-[3px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => { }}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Profile</span>
          </a>
        </div>
      </nav>

    </div>
  );
}
