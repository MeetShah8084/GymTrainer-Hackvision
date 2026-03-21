import React, { useState } from 'react';
import companyIcon from '../assets/company_icon.png';
import { LayoutDashboard, Dumbbell, LineChart, Trophy, CalendarDays, Menu, X, Bell, BellOff, Settings, ArrowLeft, Plus, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { ResponsiveTimeRange } from '@nivo/calendar';

const currentYear = new Date().getFullYear();
const calendarData = Array.from({ length: 365 }).map((_, i) => {
  const d = new Date(`${currentYear}-12-31`);
  d.setDate(d.getDate() - i);
  return {
    day: d.toISOString().split('T')[0],
    value: Math.floor(Math.random() * 100)
  };
});

interface ScheduleProps {
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings') => void;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
}

const Schedule: React.FC<ScheduleProps> = ({ navigateTo, notificationsEnabled = true, toggleNotifications }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [monthOffset, setMonthOffset] = useState(0);

  // Dynamic Calendar Setup
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const currentYearToday = today.getFullYear();
  const currentMonthToday = today.getMonth(); // 0-11
  const currentDateCalendar = today.getDate();

  const displayedDate = new Date(currentYearToday, currentMonthToday + monthOffset, 1);
  const currentYearCalendar = displayedDate.getFullYear();
  const currentMonthCalendar = displayedDate.getMonth();

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const firstDayOfMonth = new Date(currentYearCalendar, currentMonthCalendar, 1).getDay();
  const daysInMonth = new Date(currentYearCalendar, currentMonthCalendar + 1, 0).getDate();
  
  // Mock signup date (5 days ago)
  const signupDate = new Date(today);
  signupDate.setDate(today.getDate() - 5);
  signupDate.setHours(0, 0, 0, 0);

  const displayedMonthAbsolute = currentYearCalendar * 12 + currentMonthCalendar;
  const signupMonthAbsolute = signupDate.getFullYear() * 12 + signupDate.getMonth();
  const canGoPrev = displayedMonthAbsolute > signupMonthAbsolute;

  const maxForwardMonthAbsolute = currentYearToday * 12 + currentMonthToday + 12; // Allow viewing up to 12 months into the future
  const canGoNext = displayedMonthAbsolute < maxForwardMonthAbsolute;

  const handlePrevMonth = () => { if (canGoPrev) setMonthOffset(prev => prev - 1); };
  const handleNextMonth = () => { if (canGoNext) setMonthOffset(prev => prev + 1); };

  // Generate Desktop Calendar Cells
  const desktopCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    desktopCells.push(<div key={`empty-${i}`} className="bg-white dark:bg-background-dark min-h-[100px] p-2 opacity-30"></div>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const thisDate = new Date(currentYearCalendar, currentMonthCalendar, d);
    thisDate.setHours(0, 0, 0, 0);

    const isToday = currentYearCalendar === currentYearToday && currentMonthCalendar === currentMonthToday && d === currentDateCalendar;
    const isBeforeSignup = thisDate < signupDate;
    const isFuture = thisDate > today;

    let content = null;
    if (isToday) {
      content = <div className="w-full h-8 border border-primary border-dashed rounded-md flex items-center justify-center text-[10px] font-bold text-primary">PLANNING...</div>;
    } else if (isBeforeSignup) {
      // blank content
    } else if (!isFuture) {
      const rand = (d * 7) % 3;
      if (rand === 0) content = <div className="w-full h-8 bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">WORKOUT</div>;
      else if (rand === 1) content = <span className="text-[10px] text-slate-400 font-bold uppercase mt-auto">Rest Day</span>;
      else content = (
        <>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <X className="w-8 h-8 text-slate-400" />
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase mt-auto">Skipped</span>
        </>
      );
    }

    desktopCells.push(
      <div key={`day-${d}`} className={`bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end relative group ${isToday ? 'ring-2 ring-primary ring-inset' : ''} ${isBeforeSignup ? 'opacity-30 bg-slate-50 dark:bg-surface-dark' : ''}`}>
        <span className={`text-sm font-semibold mb-auto ${isToday ? 'font-extrabold text-primary' : (isBeforeSignup ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300')}`}>{d}</span>
        {content}
      </div>
    );
  }

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings') => {
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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('settings')}>
            <span>Settings</span>
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
            <div className="size-10 rounded-full bg-cover bg-center border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuKnEGAJLw_uJw2VMxs25mta_OgaPiA2mKgyRXMjPTdj-GR8mCXyew3b4Bi75YnziIODw-afQkW_1qetLtJXYBrObwTtimIbmQ9MnIlF4T6I4TJIr5_nZ7MsNB9_MVfud6sa_5IZj5twfAl7jx56RxN3_kNq5WhkXFEp-CQjEh4P9njY3kdlm8ceNFFBcFCGsI1qZOcma-uXn57vTN-yfJ1LOW5eP7tyWnJ1btFqnVbkJA4t2FCRtsLvvfm8n6ztpZC_GM9J-iEK99')" }}></div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 shrink-0 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-primary/10">
          <div className="flex items-center gap-3">
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Workout Calendar</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Track your consistency</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary">
            <CalendarDays className="w-5 h-5" />
          </button>
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
                  {/* Empty cells for first week */}
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={`m-empty-${i}`} className="aspect-square flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm"></div>
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const d = i + 1;
                    const thisDate = new Date(currentYearCalendar, currentMonthCalendar, d);
                    thisDate.setHours(0, 0, 0, 0);
                    const isToday = currentYearCalendar === currentYearToday && currentMonthCalendar === currentMonthToday && d === currentDateCalendar;
                    const isBeforeSignup = thisDate < signupDate;
                    const isFuture = thisDate > today;

                    if (isToday) {
                      return (
                        <div key={`m-day-${d}`} className="aspect-square flex items-center justify-center relative">
                          <span className="z-10 text-sm font-semibold text-white">{d}</span>
                          <div className="absolute inset-1 bg-primary rounded-full"></div>
                        </div>
                      );
                    } else if (isBeforeSignup) {
                      return (
                        <div key={`m-day-${d}`} className="aspect-square flex items-center justify-center text-slate-300 dark:text-slate-600 text-sm">{d}</div>
                      );
                    } else if (!isFuture) {
                      return (
                        <div key={`m-day-${d}`} className="aspect-square flex items-center justify-center relative">
                          <span className="z-10 text-sm font-semibold">{d}</span>
                          <div className="absolute inset-1 bg-primary rounded-full opacity-60"></div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={`m-day-${d}`} className="aspect-square flex items-center justify-center relative">
                          <span className="z-10 text-sm font-semibold">{d}</span>
                          <div className="absolute inset-1 border-2 border-primary rounded-full"></div>
                        </div>
                      );
                    }
                  })}
                </div>
                
                {/* Mobile Month Navigation */}
                <div className="flex items-center justify-center gap-4 mt-6">
                  <button onClick={handlePrevMonth} disabled={!canGoPrev} className={`p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg transition-colors ${canGoPrev ? 'hover:bg-slate-200 dark:hover:bg-primary/10 text-primary cursor-pointer' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="w-[140px] text-center">
                    <span className="text-slate-900 dark:text-slate-100 font-bold text-lg">
                      {monthNames[currentMonthCalendar]} {currentYearCalendar}
                    </span>
                  </div>
                  <button onClick={handleNextMonth} disabled={!canGoNext} className={`p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg transition-colors ${canGoNext ? 'hover:bg-slate-200 dark:hover:bg-primary/10 text-primary cursor-pointer' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Full Calendar (Desktop Only) */}
            <div className="hidden md:block bg-white dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-primary/10 p-8 shadow-xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold flex items-center space-x-2">
                  <span>{monthNames[currentMonthCalendar]} {currentYearCalendar}</span>
                  <span className="text-slate-400 font-medium">/ 12 Workouts</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <button onClick={handlePrevMonth} disabled={!canGoPrev} className={`p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg transition-colors ${canGoPrev ? 'hover:bg-slate-200 dark:hover:bg-primary/10 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                    <ChevronLeft className="w-5 h-5 text-slate-500" />
                  </button>
                  <button onClick={handleNextMonth} disabled={!canGoNext} className={`p-2 bg-slate-100 dark:bg-background-dark border border-slate-200 dark:border-primary/10 rounded-lg transition-colors ${canGoNext ? 'hover:bg-slate-200 dark:hover:bg-primary/10 cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}>
                    <ChevronRight className="w-5 h-5 text-slate-500" />
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

                {desktopCells}
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
              <div className="h-[200px] w-full" style={{ color: 'black' }}>
                <ResponsiveTimeRange
                  data={calendarData}
                  from={`${currentYear}-01-01`}
                  to={`${currentYear}-12-31`}
                  emptyColor="rgba(200, 200, 200, 0.1)"
                  colors={['#ec5b1333', '#ec5b1366', '#ec5b1399', '#ec5b13cc', '#ec5b13']}
                  margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                  dayBorderWidth={2}
                  dayBorderColor="transparent"
                  theme={{
                    text: {
                      fontSize: 10,
                      fill: '#94a3b8',
                    },
                    tooltip: {
                      container: {
                        background: '#2a1e17',
                        color: '#f8fafc',
                        fontSize: 12,
                        borderRadius: 8,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }
                    }
                  }}
                />
              </div>
            </section>

            {/* Mobile Yearly Consistency (Mobile Only) */}
            <div className="md:hidden pt-4 pb-8">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight mb-4">Yearly Consistency</h3>
              <div className="flex flex-col gap-4">
                {[
                  { title: 'Jan - Mar', from: `${currentYear}-01-01`, to: `${currentYear}-03-31` },
                  { title: 'Apr - Jun', from: `${currentYear}-04-01`, to: `${currentYear}-06-30` },
                  { title: 'Jul - Sep', from: `${currentYear}-07-01`, to: `${currentYear}-09-30` },
                  { title: 'Oct - Dec', from: `${currentYear}-10-01`, to: `${currentYear}-12-31` },
                ].map((quarter, idx) => (
                  <div key={idx} className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-primary/10 p-4 shadow-sm overflow-hidden">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">{quarter.title}</h4>
                    <div className="h-[120px] w-full" style={{ color: 'black' }}>
                      <ResponsiveTimeRange
                        data={calendarData}
                        from={quarter.from}
                        to={quarter.to}
                        emptyColor="rgba(200, 200, 200, 0.1)"
                        colors={['#ec5b1333', '#ec5b1366', '#ec5b1399', '#ec5b13cc', '#ec5b13']}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                        dayBorderWidth={2}
                        dayBorderColor="transparent"
                        theme={{
                          text: {
                            fontSize: 10,
                            fill: '#94a3b8',
                          },
                          tooltip: {
                            container: {
                              background: '#2a1e17',
                              color: '#f8fafc',
                              fontSize: 12,
                              borderRadius: 8,
                              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                            }
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
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
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('settings')}>
            <Settings className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Settings</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default Schedule;
