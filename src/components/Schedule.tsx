import React, { useState } from 'react';
import companyIcon from '../assets/company_icon.png';
import { LayoutDashboard, Dumbbell, LineChart, Trophy, CalendarDays, User, Menu, X, Bell, Settings, ArrowLeft, Plus, Flame } from 'lucide-react';

interface ScheduleProps {
  navigateTo: (page: 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule') => void;
}

const Schedule: React.FC<ScheduleProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNavigation = (page: 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule') => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigateTo(page);
    }, 300);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
      
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop) */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-primary/10 bg-background-light dark:bg-background-dark transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="shrink-0 size-8 bg-primary rounded-lg flex items-center justify-center p-1">
              <img src={companyIcon} alt="Progressive Trainer" className="w-full h-full object-contain filter invert brightness-0" />
            </div>
            <h2 className="text-base font-bold tracking-tight text-slate-900 dark:text-white truncate">ProgressiveTrainer</h2>
          </div>
          <button className="shrink-0 text-slate-500 hover:text-primary cursor-pointer lg:hidden" onClick={() => setIsSidebarOpen(false)}>
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
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('schedule')}>
            <span>Schedule</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
            <span>Profile</span>
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
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Workout Calendar</h1>
              <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Track your consistency and plan your gains</p>
            </div>
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
        <header className="md:hidden sticky top-0 z-20 shrink-0 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-primary/10">
          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <ArrowLeft className="w-6 h-6" />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight flex-1 text-center">October 2023</h2>
          <div className="flex w-10 items-center justify-end">
            <button className="flex items-center justify-center rounded-xl h-10 w-10 bg-primary/10 text-primary">
              <span className="material-symbols-outlined fill-icon bg-primary/20 p-1.5 rounded-full"><Trophy className="w-4 h-4 fill-primary"/></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full custom-gradient relative md:pb-8">
          <div className="max-w-6xl mx-auto w-full p-4 md:p-10 pb-28 md:pb-10 space-y-6 md:space-y-8">
            
            {/* Quick Stats Grid */}
            <div className="flex md:grid md:grid-cols-3 gap-3 md:gap-6 overflow-x-auto no-scrollbar md:overflow-visible pb-2 md:pb-0">
              
              {/* Stat 1 */}
              <div className="flex min-w-[140px] md:min-w-0 flex-1 flex-col gap-1 rounded-xl p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider md:mb-1">Current Streak</p>
                  <p className="text-primary tracking-tight text-xl md:text-3xl font-black">12 Days</p>
                  <div className="flex items-center gap-1 md:hidden mt-1">
                    <span className="text-emerald-500 font-bold">+2%</span>
                  </div>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-orange-500/10 rounded-lg items-center justify-center text-primary">
                  <Flame className="w-7 h-7" />
                </div>
              </div>

              {/* Stat 2 */}
              <div className="flex min-w-[140px] md:min-w-0 flex-1 flex-col gap-1 rounded-xl p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider md:mb-1">Completion</p>
                  <p className="text-slate-900 dark:text-slate-100 tracking-tight text-xl md:text-3xl font-black">85%</p>
                  <div className="flex items-center gap-1 md:hidden mt-1">
                    <span className="text-emerald-500 font-bold">+5%</span>
                  </div>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-green-500/10 rounded-lg items-center justify-center text-emerald-500">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>

              {/* Stat 3 (Monthly Total on Mobile, Total Workouts on Desktop) */}
              <div className="flex min-w-[140px] md:min-w-0 flex-1 flex-col gap-1 rounded-xl p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm md:flex-row md:items-center md:justify-between md:p-6">
                <div>
                  <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider md:mb-1"><span className="md:hidden">Monthly Total</span><span className="hidden md:inline">Total Workouts</span></p>
                  <p className="text-slate-900 dark:text-slate-100 tracking-tight text-xl md:text-3xl font-black"><span className="md:hidden">24</span><span className="hidden md:inline">156</span></p>
                  <div className="flex items-center gap-1 text-primary md:hidden mt-1">
                    <p className="text-xs font-medium">Goal: 28</p>
                  </div>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-blue-500/10 rounded-lg items-center justify-center text-blue-400">
                  <Dumbbell className="w-7 h-7" />
                </div>
              </div>
            </div>

            {/* Calendar View Mobile (Mobile Only) */}
            <div className="md:hidden">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-primary/10 p-4 shadow-sm">
                <div className="grid grid-cols-7 mb-4">
                  <div className="text-center text-xs font-bold text-slate-400 py-2">S</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">M</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">T</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">W</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">T</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">F</div>
                  <div className="text-center text-xs font-bold text-slate-400 py-2">S</div>
                </div>
                <div className="grid grid-cols-7 gap-y-2">
                  <div className="aspect-square flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm">28</div>
                  <div className="aspect-square flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm">29</div>
                  <div className="aspect-square flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm">30</div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">1</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-20"></div>
                    <div className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">2</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-40"></div>
                    <div className="absolute bottom-1.5 w-1 h-1 bg-primary rounded-full"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center">
                    <span className="text-sm font-semibold">3</span>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">4</span>
                    <div className="absolute inset-1 bg-primary rounded-full"></div>
                  </div>
                  {/* Row 2 */}
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">5</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-60"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">6</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-80"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold text-white">7</span>
                    <div className="absolute inset-1 bg-primary rounded-full"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">8</span>
                    <div className="absolute inset-1 border-2 border-primary rounded-full"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">9</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-30"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">10</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-50"></div>
                  </div>
                  <div className="aspect-square flex items-center justify-center relative">
                    <span className="z-10 text-sm font-semibold">11</span>
                    <div className="absolute inset-1 bg-primary rounded-full opacity-90"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Full Calendar (Desktop Only) */}
            <div className="hidden md:block bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-primary/10 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <span>October 2023</span>
                  <span className="text-slate-400 font-medium">/ 22 Workouts</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <button className="p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg hover:bg-slate-200 dark:hover:bg-primary/10 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500 rotate-180" />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-primary/10 overflow-hidden rounded-lg border border-slate-200 dark:border-primary/10">
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Sun</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Mon</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Tue</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Wed</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Thu</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Fri</div>
                <div className="bg-white dark:bg-background-dark py-3 text-center text-xs font-bold text-slate-500 uppercase tracking-widest">Sat</div>

                <div className="bg-white dark:bg-background-dark min-h-[100px] p-2 opacity-30"></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">1</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">LEG DAY</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">2</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">PUSH (A)</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end relative group">
                  <span className="text-sm font-semibold mb-auto text-slate-500">3</span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <X className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase mt-auto">Skipped</span>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">4</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">PULL (B)</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">5</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">ABS</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">6</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">HIIT</div>
                </div>
                {/* Row 2 */}
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto text-slate-500">7</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Rest Day</span>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">8</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">LEGS (B)</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end">
                  <span className="text-sm font-semibold mb-auto">9</span>
                  <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">PUSH (B)</div>
                </div>
                {/* Today */}
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end ring-2 ring-primary ring-inset">
                  <span className="text-sm font-extrabold text-primary mb-auto">10</span>
                  <div className="w-full h-8 border border-primary border-dashed rounded-md flex items-center justify-center text-[10px] font-bold text-primary">PLANNING...</div>
                </div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">11</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">12</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">13</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">14</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">15</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">16</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">17</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">18</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">19</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">20</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">21</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">22</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">23</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">24</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">25</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">26</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">27</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">28</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">29</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">30</span></div>
                <div className="bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end"><span className="text-sm font-semibold mb-auto text-slate-400">31</span></div>
              </div>

              <div className="mt-6 flex items-center space-x-6 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-primary rounded-sm"></span>
                  <span>Completed</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 bg-transparent border border-primary border-dashed rounded-sm"></span>
                  <span>Scheduled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <X className="w-3.5 h-3.5 text-slate-400" />
                  <span>Skipped</span>
                </div>
              </div>
            </div>

            {/* Desktop Heatmap (Desktop Only) */}
            <section className="hidden md:block bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-primary/10 p-8 shadow-xl">
              <h3 className="text-lg font-bold mb-6">Yearly Consistency</h3>
              <div className="flex flex-col md:flex-row">
                {/* Simulated Heatmap Container */}
                <div className="flex items-end space-x-1 overflow-x-auto pb-4 flex-1">
                  <div className="flex flex-col space-y-2 text-[10px] text-slate-500 font-bold uppercase pr-4 shrink-0">
                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                  </div>
                  {/* Grid of squares mocking github heatmap. It's a demo so we hardcode some blocks */}
                  <div className="flex gap-1">
                    {Array.from({length: 52}).map((_, colIndex) => (
                      <div key={colIndex} className="flex flex-col gap-1">
                        {Array.from({length: 7}).map((_, rowIndex) => {
                          // Randomize opacity to simulate heatmap
                          const rand = Math.random();
                          let opacityClass = 'opacity-10 dark:opacity-[0.05] bg-slate-300 dark:bg-slate-700';
                          if (rand > 0.8) opacityClass = 'bg-primary opacity-100 shadow-[0_0_4px_rgba(236,91,19,0.5)]';
                          else if (rand > 0.6) opacityClass = 'bg-primary opacity-80';
                          else if (rand > 0.4) opacityClass = 'bg-primary opacity-50';
                          else if (rand > 0.2) opacityClass = 'bg-primary opacity-30';
                          
                          return <div key={`${colIndex}-${rowIndex}`} className={`w-3 h-3 rounded-sm ${opacityClass}`}></div>
                        })}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center justify-end md:items-end space-x-2 text-[10px] text-slate-500 font-bold uppercase shrink-0">
                  <span>Less</span>
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 rounded-sm opacity-10 dark:opacity-[0.05] bg-slate-300 dark:bg-slate-700"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary opacity-30"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary opacity-50"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary opacity-80"></div>
                    <div className="w-3 h-3 rounded-sm bg-primary opacity-100 shadow-[0_0_4px_rgba(236,91,19,0.5)]"></div>
                  </div>
                  <span>More</span>
                </div>
              </div>
            </section>

            {/* Mobile Activity Intensity (Mobile Only) */}
            <div className="md:hidden pt-4">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight mb-4">Activity Intensity</h3>
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-primary/10 p-6 shadow-sm">
                <div className="flex items-end justify-between gap-2 h-32 mb-4 px-2">
                  <div className="w-full bg-primary/10 rounded-t-lg relative group">
                    <div className="absolute bottom-0 w-full bg-primary/30 rounded-t-lg" style={{height: '35%'}}></div>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{height: '15%'}}></div>
                  </div>
                  <div className="w-full bg-primary/10 rounded-t-lg relative">
                    <div className="absolute bottom-0 w-full bg-primary/40 rounded-t-lg" style={{height: '60%'}}></div>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{height: '25%'}}></div>
                  </div>
                  <div className="w-full bg-primary/10 rounded-t-lg relative">
                    <div className="absolute bottom-0 w-full bg-primary/50 rounded-t-lg" style={{height: '100%'}}></div>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{height: '70%'}}></div>
                  </div>
                  <div className="w-full bg-primary/10 rounded-t-lg relative">
                    <div className="absolute bottom-0 w-full bg-primary/40 rounded-t-lg" style={{height: '45%'}}></div>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{height: '20%'}}></div>
                  </div>
                  <div className="w-full bg-primary/10 rounded-t-lg relative">
                    <div className="absolute bottom-0 w-full bg-primary/60 rounded-t-lg" style={{height: '85%'}}></div>
                    <div className="absolute bottom-0 w-full bg-primary rounded-t-lg" style={{height: '55%'}}></div>
                  </div>
                </div>
                <div className="flex justify-between px-2">
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Week 1</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Week 2</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Week 3</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Week 4</p>
                  <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Week 5</p>
                </div>
              </div>
            </div>

            {/* Upcoming Workouts (Mobile Only - we could show on desktop optionally but mockups show it on mobile) */}
            <div className="md:hidden pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">Upcoming</h3>
                <button className="text-primary text-sm font-bold">View All</button>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 font-bold">HIIT Session</p>
                    <p className="text-slate-500 text-xs">Tomorrow • 07:30 AM</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-900 dark:text-slate-100 font-bold">Upper Body Power</p>
                    <p className="text-slate-500 text-xs">Oct 14 • 06:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="md:hidden fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center z-20">
        <Plus className="w-8 h-8" />
      </button>

      {/* Bottom Navigation Bar (Mobile) - UPDATED with 5 items max maybe limit or shrink? Wait, Dash, Workouts, Schedule, Stats, Records. Let's make it 5 items. */}
      {/* If I add a 6th, it squashes. The prompt says "In mobile version, the navbar does not have entry for the schedule page, so make sure to add it there and use the calender icon." */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-semibold uppercase tracking-widest">Train</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('schedule')}>
            <CalendarDays className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Sched</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => {}}>
            <User className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Profile</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default Schedule;
