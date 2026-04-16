import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import companyIcon from '../assets/company_icon.png';
import { LayoutDashboard, Dumbbell, LineChart, Trophy, CalendarDays, Menu, X, Bell, BellOff, Settings, ArrowLeft, Plus, Flame, ChevronLeft, ChevronRight, MessageSquare, Trash2 } from 'lucide-react';
import { ResponsiveTimeRange } from '@nivo/calendar';
import { EXERCISES_BY_MUSCLE, type Exercise } from '../data/exercises';
import { supabase } from '../lib/supabase';
import { getCalendarData, getWorkoutCalendarMetrics, getPlannedWorkouts, savePlannedWorkout, type WorkoutCalendarMetrics, type PlannedWorkout } from '../lib/n8nApi';
import { useNotification } from '../contexts/NotificationContext';

interface ScheduleProps {
  userName?: string;
  setUserName?: (name: string) => void;
  userId?: string;
  avatarUrl?: string | null;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
  completedExercises: Exercise[];
}

const Schedule: React.FC<ScheduleProps> = ({
  userName = "Loading...",
  userId = '',
  avatarUrl = null,
  notificationsEnabled = true, toggleNotifications, completedExercises }) => {
  const navigate = useNavigate();
  const navigateTo = (path: string) => navigate('/' + path);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarData, setCalendarData] = useState<{day: string; value: number}[]>([]);
  const [metrics, setMetrics] = useState<WorkoutCalendarMetrics | null>(null);
  const currentYear = new Date().getFullYear();

  const { showNotification } = useNotification();
  const [planningMuscleGroup, setPlanningMuscleGroup] = useState<string>('Chest');
  const [planningExerciseName, setPlanningExerciseName] = useState<string>('');
  const [planningSets, setPlanningSets] = useState<string>('');
  const [planningReps, setPlanningReps] = useState<string>('');
  const [planningWeight, setPlanningWeight] = useState<string>('');
  const [plannedExercises, setPlannedExercises] = useState<PlannedWorkout[]>([]);

  useEffect(() => {
    if (userId) {
      getPlannedWorkouts(userId)
        .then(data => {
          if (Array.isArray(data)) {
            setPlannedExercises(data);
          }
        })
        .catch(console.error);
    }
  }, [userId]);

  // Merge API calendar data with locally completed exercises for the heatmap
  // Only add local exercises for dates NOT already covered by API data
  const mergedCalendarData = React.useMemo(() => {
    const map = new Map<string, number>();
    // Add API data first (this is the source of truth from the backend)
    calendarData.forEach(d => {
      map.set(d.day, d.value);
    });
    // Only add locally completed exercises for dates that have NO API data
    completedExercises.forEach(ex => {
      if (ex.date && !map.has(ex.date)) {
        map.set(ex.date, (map.get(ex.date) || 0) + 1);
      }
    });
    return Array.from(map.entries()).map(([day, value]) => ({ day, value }));
  }, [calendarData, completedExercises]);

  const localStreak = React.useMemo(() => {
    if (!mergedCalendarData.length) return 0;
    
    const dates = mergedCalendarData.map(d => {
      const [y, m, dNum] = d.day.split('-').map(Number);
      return new Date(y, m - 1, dNum).getTime();
    }).sort((a, b) => b - a);
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const todayTime = today.getTime();
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTime = yesterday.getTime();
    
    const pastDates = dates.filter(t => t <= todayTime);
    
    if (!pastDates.length) return 0;
    
    let currentStreak = 0;
    if (pastDates[0] === todayTime || pastDates[0] === yesterdayTime) {
      currentStreak = 1;
      let expectedTime = pastDates[0] - 86400000;
      
      for (let i = 1; i < pastDates.length; i++) {
        if (pastDates[i] === expectedTime) {
          currentStreak++;
          expectedTime -= 86400000;
        } else if (pastDates[i] > expectedTime) {
          continue; // skip duplicates
        } else {
          break; // found gap
        }
      }
    }
    
    return currentStreak;
  }, [mergedCalendarData]);

  const [monthOffset, setMonthOffset] = useState(0);
  const [signupDate, setSignupDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 5);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Fetch calendar data from n8n API
  useEffect(() => {
    if (userId) {
      getCalendarData(userId)
        .then((response: any) => {
          let rows: any[] = [];
          if (Array.isArray(response)) {
            rows = response;
          } else if (response && typeof response === 'object') {
            const possibleArrays = ['data', 'rows', 'items', 'result'];
            for (const key of possibleArrays) {
              if (Array.isArray(response[key])) {
                rows = response[key];
                break;
              }
            }
            if (rows.length === 0 && (response.session_date || response.day || response.date)) {
              rows = [response];
            }
          }

          if (rows.length > 0) {
            const mapped = rows
              .map((d: any) => {
                const day = d.day || d.date || d.session_date || d.workout_date;
                const value = d.value || d.count || d.exercise_count || d.total || 1;
                if (!day) return null;
                return { day: String(day).split('T')[0], value: Number(value) || 1 };
              })
              .filter(Boolean) as { day: string; value: number }[];
            setCalendarData(mapped);
          }
        })
        .catch(err => console.error('Failed to fetch calendar data:', err));

      getWorkoutCalendarMetrics(userId)
        .then(data => setMetrics(data))
        .catch(err => console.error('Failed to fetch calendar metrics:', err));
    }
  }, [userId]);

  React.useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && user.created_at) {
        const d = new Date(user.created_at);
        d.setHours(0, 0, 0, 0);
        setSignupDate(d);
      }
    };
    fetchUser();
  }, []);

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
    // use local format string for YYYY-MM-DD
    const dateStr = [
      thisDate.getFullYear(),
      ('0' + (thisDate.getMonth() + 1)).slice(-2),
      ('0' + thisDate.getDate()).slice(-2)
    ].join('-');
    const dayExercises = completedExercises.filter(ex => ex.date === dateStr);
    const hasWorkout = dayExercises.length > 0;
    const dayPlanned = plannedExercises.filter(ex => ex.planned_date === dateStr);
    const hasPlanned = dayPlanned.length > 0;

    const isToday = currentYearCalendar === currentYearToday && currentMonthCalendar === currentMonthToday && d === currentDateCalendar;
    const isBeforeSignup = thisDate < signupDate;
    const isFuture = thisDate > today;

    let content = null;

    if (!isBeforeSignup) {
      if (isToday && !hasWorkout && !hasPlanned) {
        content = <div className="w-full h-8 mt-auto border border-primary border-dashed rounded-md flex items-center justify-center text-[10px] font-bold text-primary">PLANNING...</div>;
      } else if (hasWorkout) {
        content = <div className="w-full h-8 mt-auto bg-primary text-white rounded-md flex items-center justify-center text-[10px] font-bold">WORKOUT</div>;
      } else if (hasPlanned) {
        if (!isFuture && !isToday) {
          content = <div className="w-full h-8 mt-auto rounded-md flex items-center justify-center text-[10px] font-bold text-white shadow-sm" style={{ backgroundColor: '#950606' }}>PLANNED</div>;
        } else {
          content = <div className="w-full h-8 mt-auto rounded-md flex items-center justify-center text-[10px] font-bold text-neutral-900" style={{ backgroundColor: '#fbe52b' }}>PLANNED</div>;
        }
      } else if (!isFuture && !isToday) {
        content = <span className="text-[10px] text-slate-400 font-bold uppercase mt-auto">Rest Day</span>;
      }
    }

    desktopCells.push(
      <div 
        key={`day-${d}`} 
        onClick={() => { if (!isBeforeSignup) setSelectedDate(dateStr); }}
        className={`bg-white dark:bg-background-dark min-h-[100px] p-3 flex flex-col items-end relative group ${!isBeforeSignup ? 'cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-dark transition-colors' : ''} ${isToday ? 'ring-2 ring-primary ring-inset' : ''} ${isBeforeSignup ? 'opacity-40 grayscale bg-slate-50 dark:bg-surface-dark cursor-not-allowed' : ''} ${selectedDate === dateStr && !isBeforeSignup ? 'ring-2 ring-primary ring-inset' : ''}`}>
        <span className={`text-sm font-semibold mb-auto ${isToday ? 'font-extrabold text-primary' : (isBeforeSignup ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300')}`}>{d}</span>
        {content}
      </div>
    );
  }

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
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
            <div className="shrink-0 size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm overflow-hidden">
              {avatarUrl ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" /> : userName.charAt(0).toUpperCase()}
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
                  <p className="text-primary tracking-tight text-xl md:text-3xl font-black">{localStreak} Days</p>
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
                  <p className="text-slate-900 dark:text-slate-100 tracking-tight text-xl md:text-3xl font-black">{metrics?.completion_rate || 0}%</p>
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
                  <p className="text-slate-900 dark:text-slate-100 tracking-tight text-xl md:text-3xl font-black">
                    <span className="md:hidden">{calendarData.filter(d => {
                      const date = new Date(d.day);
                      return date.getMonth() === currentMonthToday && date.getFullYear() === currentYearToday;
                    }).length}</span>
                    <span className="hidden md:inline">{metrics?.total_workouts || 0}</span>
                  </p>
                  <div className="flex items-center gap-1 text-primary md:hidden mt-1">
                    <p className="text-xs font-medium">Goal: {daysInMonth}</p>
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
                    // use local format string for YYYY-MM-DD
                    const dateStr = [
                      thisDate.getFullYear(),
                      ('0' + (thisDate.getMonth() + 1)).slice(-2),
                      ('0' + thisDate.getDate()).slice(-2)
                    ].join('-');
                    const dayExercises = completedExercises.filter(ex => ex.date === dateStr);
                    const hasWorkout = dayExercises.length > 0;
                    const dayPlanned = plannedExercises.filter(ex => ex.planned_date === dateStr);
                    const hasPlanned = dayPlanned.length > 0;

                    const isToday = currentYearCalendar === currentYearToday && currentMonthCalendar === currentMonthToday && d === currentDateCalendar;
                    const isBeforeSignup = thisDate < signupDate;
                    const isFuture = thisDate > today;

                    let bgClass = '';
                    let textClass = '';
                    let blurClass = '';
                    let customStyle: React.CSSProperties | undefined = undefined;

                    if (isToday && !hasWorkout && !hasPlanned) {
                      bgClass = 'border-2 border-primary border-dashed';
                      textClass = 'text-primary';
                    } else if (hasWorkout) {
                      bgClass = 'bg-primary opacity-60';
                      textClass = 'text-white';
                    } else if (hasPlanned) {
                      if (!isFuture && !isToday) {
                        customStyle = { backgroundColor: '#950606' };
                        textClass = 'text-white';
                      } else {
                        customStyle = { backgroundColor: '#fbe52b' };
                        textClass = 'text-neutral-900';
                      }
                    } else if (isBeforeSignup) {
                      textClass = 'text-slate-300 dark:text-slate-600';
                      blurClass = 'grayscale opacity-40 cursor-not-allowed';
                    } else if (!isFuture) {
                      bgClass = 'border border-slate-200 dark:border-primary/20';
                      textClass = 'text-slate-900 dark:text-slate-100';
                    } else {
                      bgClass = 'border border-slate-200 dark:border-primary/20';
                      textClass = 'text-slate-900 dark:text-slate-100';
                    }

                    return (
                      <div 
                        key={`m-day-${d}`} 
                        className={`aspect-square flex items-center justify-center relative ${!isBeforeSignup ? 'cursor-pointer' : ''} ${blurClass}`}
                        onClick={() => { if (!isBeforeSignup) setSelectedDate(dateStr); }}
                      >
                        <span className={`z-10 text-sm font-semibold ${textClass}`}>{d}</span>
                        {!isBeforeSignup && (
                          <div className={`absolute inset-1 rounded-full ${bgClass} ${selectedDate === dateStr ? 'ring-2 ring-primary ring-offset-1 dark:ring-offset-background-dark' : ''}`} style={customStyle}></div>
                        )}
                      </div>
                    );
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
                  <span className="text-slate-400 font-medium">/ {calendarData.filter(d => {
                    const date = new Date(d.day);
                    return date.getMonth() === currentMonthCalendar && date.getFullYear() === currentYearCalendar;
                  }).length} Workouts</span>
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
                  data={mergedCalendarData}
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
                        data={mergedCalendarData}
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
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('aichat')}>
            <MessageSquare className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">AI Chat</span>
          </a>
        </div>
      </nav>

      {/* Exercise Details Sidebar Overlay */}
      {selectedDate && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] transition-opacity"
          onClick={() => setSelectedDate(null)}
        />
      )}

      {/* Exercise Details Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-[70] flex flex-col w-full max-w-lg bg-white dark:bg-[#111111] text-slate-900 dark:text-white shadow-2xl transform transition-transform duration-300 ease-in-out ${selectedDate ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedDate && (() => {
          const [y, m, d] = selectedDate.split('-').map(Number);
          const sd = new Date(y, m - 1, d);
          const td = new Date(); td.setHours(0,0,0,0);
          const isFuture = sd > td;

          if (isFuture) {
            const dayPlanned = plannedExercises.filter(ex => ex.planned_date === selectedDate);
            return (
              <div className="flex flex-col h-full bg-white dark:bg-[#111111] font-['Poppins'] text-slate-800 dark:text-slate-200">
                {/* Sidebar Header */}
                <div className="p-4 md:p-6 flex items-center justify-center relative">
                  <button className="absolute left-4 md:left-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer" onClick={() => setSelectedDate(null)}>
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center flex items-center justify-center gap-4">
                    <div className="relative flex items-center justify-center text-primary shrink-0">
                      <CalendarDays className="w-10 h-10 md:w-12 md:h-12 stroke-[1.5]" />
                      <span className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#111111] px-1 text-sm md:text-base font-black leading-none pt-0.5 rounded-sm">{selectedDate?.split('-')[2]}</span>
                    </div>
                    <span>Workout Planning</span>
                  </h2>
                </div>
                <div className="border-b-2 border-primary/20 w-full" />

                <div className="p-4 text-center border-b border-primary/30 bg-slate-50 dark:bg-transparent">
                  <p className="text-xl font-medium text-slate-700 dark:text-slate-200">Planned exercises:</p>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-20 md:pb-6">
                  <div className="flex flex-col">
                    {dayPlanned.length === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center gap-3 opacity-60">
                        <CalendarDays className="w-12 h-12 text-slate-400 mb-2" />
                        <p className="text-xl font-semibold text-slate-500 dark:text-slate-400">No exercises planned yet.</p>
                      </div>
                    ) : (
                      dayPlanned.map(ex => (
                        <div key={ex.id} className="relative p-6 border-b border-primary/20 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                          <h3 className="text-xl md:text-2xl font-bold text-center tracking-tight">{ex.exercise_name}</h3>
                          <p className="text-primary font-medium tracking-wide text-center text-lg">
                            number of sets: {ex.sets}, reps per set: {ex.reps}, weight: {ex.weight}
                          </p>
                          <button
                            onClick={async () => {
                              setPlannedExercises(prev => prev.filter(p => p.id !== ex.id));
                              if (ex.id) {
                                try {
                                  await supabase.from('planned_workouts').delete().eq('id', ex.id);
                                } catch(e) {
                                  console.error(e);
                                }
                              }
                            }}
                            className="absolute right-4 top-4 p-2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-4 text-center border-t border-b border-primary/30 bg-slate-50 dark:bg-transparent mt-4">
                    <p className="text-xl font-medium text-slate-700 dark:text-slate-200">Add exercise:</p>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-lg font-medium text-slate-600 dark:text-slate-400">Muscle Group</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans"
                        value={planningMuscleGroup}
                        onChange={(e) => {
                          setPlanningMuscleGroup(e.target.value);
                          setPlanningExerciseName('');
                        }}
                      >
                        {Object.keys(EXERCISES_BY_MUSCLE).map(mg => (
                          <option key={mg} value={mg}>{mg}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-lg font-medium text-slate-600 dark:text-slate-400">Exercise Name</label>
                      <select
                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans"
                        value={planningExerciseName}
                        onChange={(e) => setPlanningExerciseName(e.target.value)}
                      >
                        <option value="" disabled>Select an exercise</option>
                        {(EXERCISES_BY_MUSCLE[planningMuscleGroup] || []).map(exName => (
                          <option key={exName} value={exName}>{exName}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-lg font-medium text-slate-600 dark:text-slate-400">Sets</label>
                        <input
                          type="number" min="1"
                          className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans"
                          value={planningSets}
                          onChange={(e) => setPlanningSets(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-lg font-medium text-slate-600 dark:text-slate-400">Weight (kg)</label>
                        <input
                          type="number" min="0" step="1"
                          className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans"
                          value={planningWeight}
                          onChange={(e) => setPlanningWeight(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-lg font-medium text-slate-600 dark:text-slate-400">Reps per set</label>
                      <input
                        type="text"
                        placeholder="e.g. 10, 8, 8"
                        className="w-full bg-slate-50 dark:bg-[#1a1a1a] border border-primary/30 rounded-xl p-3 text-slate-800 dark:text-white outline-none focus:border-primary transition-colors font-sans placeholder:text-slate-400"
                        value={planningReps}
                        onChange={(e) => setPlanningReps(e.target.value)}
                      />
                      <span className="text-sm text-slate-500 italic mt-1">* Use commas for different reps each set</span>
                    </div>

                    <div className="pt-4">
                      <button 
                        onClick={() => {
                          if (!planningExerciseName) return;

                          // Validation
                          const numSets = Number(planningSets) || 0;
                          if (numSets <= 0) {
                            showNotification("Please enter a valid number of sets.");
                            return;
                          }
                          
                          const repValues = planningReps.split(',').map(v => v.trim()).filter(v => v !== '');
                          if (repValues.length === 0) {
                            showNotification("Please enter reps per set.");
                            return;
                          }
                          if (repValues.length !== 1 && repValues.length !== numSets) {
                            showNotification(`Error: You entered ${numSets} sets, but provided ${repValues.length} rep values.`);
                            return;
                          }

                          const plan: PlannedWorkout = {
                            user_id: userId,
                            planned_date: selectedDate || '',
                            muscle_group: planningMuscleGroup,
                            exercise_name: planningExerciseName,
                            sets: numSets,
                            reps: planningReps,
                            weight: Number(planningWeight) || 0
                          };
                          
                          const tempId = Math.random().toString(36).substring(7);
                          setPlannedExercises(prev => [...prev, { ...plan, id: tempId }]);
                          setPlanningExerciseName('');
                          setPlanningSets('');
                          setPlanningReps('');
                          setPlanningWeight('');

                          savePlannedWorkout(plan).catch(err => {
                            console.error('Failed to save planned workout', err);
                          });
                        }}
                        className="w-full py-3 bg-transparent border-2 border-dashed border-primary/60 text-primary font-bold text-xl rounded-2xl transition-all cursor-pointer hover:bg-primary/10 hover:border-primary"
                      >
                        + Add exercise to plan
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 border-t border-primary/20 bg-white dark:bg-[#111111]">
                  <button
                    onClick={() => {
                      setSelectedDate(null);
                      showNotification("Workout plan saved.");
                    }}
                    className="w-full py-4 bg-primary text-white font-bold text-2xl tracking-widest rounded-2xl shadow-lg shadow-primary/20 hover:bg-[#c54a0d] transition-all active:scale-[0.98] cursor-pointer"
                  >
                    SAVE PLAN
                  </button>
                </div>
              </div>
            );
          } else {
            const dayExercises = completedExercises.filter(ex => ex.date === selectedDate);
            const dayPlanned = plannedExercises.filter(ex => ex.planned_date === selectedDate);
            return (
              <div className="flex flex-col h-full bg-white dark:bg-[#111111] font-['Poppins'] text-slate-800 dark:text-slate-200">
                <div className="p-4 md:p-6 flex items-center justify-center relative">
                  <button className="absolute left-4 md:left-6 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer" onClick={() => setSelectedDate(null)}>
                    <X className="w-6 h-6" />
                  </button>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-center flex items-center justify-center gap-4">
                    <div className="relative flex items-center justify-center text-primary shrink-0">
                      <CalendarDays className="w-10 h-10 md:w-12 md:h-12 stroke-[1.5]" />
                      <span className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#111111] px-1 text-sm md:text-base font-black leading-none pt-0.5 rounded-sm">{selectedDate?.split('-')[2]}</span>
                    </div>
                    <span>Workout summary</span>
                  </h2>
                </div>
                <div className="border-b-2 border-primary/20 w-full" />

                <div className="flex-1 overflow-y-auto no-scrollbar pb-20 md:pb-6">
                  {dayPlanned.length > 0 && (
                    <div className="flex flex-col">
                      <div className="p-4 text-center border-b border-primary/30 bg-slate-50 dark:bg-transparent">
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-200">Planned exercises:</p>
                      </div>
                      {dayPlanned.map((ex, index) => {
                        const isCompleted = dayExercises.some(done => done.name === ex.exercise_name);
                        return (
                          <div key={ex.id || `planned-${index}`} className={`relative p-6 border-b border-primary/20 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors ${isCompleted ? 'opacity-50 grayscale' : ''}`}>
                            <h3 className={`text-xl md:text-2xl font-bold text-center tracking-tight flex items-center justify-center gap-2 ${isCompleted ? 'text-slate-500' : 'text-red-500/80 dark:text-red-400/80'}`} style={!isCompleted ? { color: 'color-mix(in srgb, currentColor 90%, red 10%)' } : {}}>
                              {ex.exercise_name}
                              {isCompleted && (
                                <div className="bg-emerald-500 rounded-full flex items-center justify-center text-white" style={{ width: '24px', height: '24px' }}>
                                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                              )}
                            </h3>
                            <p className={`font-medium tracking-wide text-center text-sm md:text-base ${isCompleted ? 'text-slate-500' : 'text-primary'}`}>
                              number of sets: {ex.sets}, reps per set: {ex.reps}, weight: {ex.weight}kg
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <div className="p-4 text-center border-b border-primary/30 bg-slate-50 dark:bg-transparent mt-2">
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-200">List of exercises done:</p>
                  </div>

                  <div className="flex flex-col">
                    {dayExercises.length === 0 ? (
                      <div className="p-12 text-center flex flex-col items-center gap-3 opacity-60">
                        <CalendarDays className="w-12 h-12 text-slate-400 mb-2" />
                        <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">Rest Day</p>
                        <p className="text-sm text-slate-400">No workouts recorded for this date.</p>
                      </div>
                    ) : (
                      dayExercises.map(ex => (
                        <div key={ex.id} className="p-6 border-b border-primary/20 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-primary/5 transition-colors">
                          <h3 className="text-xl md:text-2xl font-bold text-center tracking-tight">{ex.name}</h3>
                          <p className="text-primary font-medium tracking-wide text-center text-sm md:text-base">
                            number of sets: {ex.sets}, reps per set: {ex.reps}, weight: {ex.weight}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            );
          }
        })()}
      </aside>

    </div>
  );
};

export default Schedule;
