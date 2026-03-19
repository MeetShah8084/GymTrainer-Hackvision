import React, { useState } from 'react';
import { Dumbbell, Flame, Activity, LayoutDashboard, Settings, Bell, Plus, Weight, Edit, Trash2, AlertTriangle, Repeat, CalendarDays, LineChart, User, ArrowLeft, Timer, Trophy, Menu, X } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  timeInfo: string;
  sets: number;
  reps: string;
  weight: string;
  imageAlt: string;
  imageSrc: string;
  icon: React.ReactNode;
}

const initialExercises: Exercise[] = [
  {
    id: '1',
    name: 'Barbell Bench Press',
    timeInfo: '14:20 • Muscle Pump Gym • Chest',
    sets: 4,
    reps: '10, 8, 8, 6',
    weight: '85 kg',
    imageAlt: 'Close up of a heavy barbell in a gym',
    imageSrc: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=200&fit=crop',
    icon: <Dumbbell className="hidden md:block w-7 h-7" />
  },
  {
    id: '2',
    name: 'Dumbbell Lateral Raise',
    timeInfo: '12:15 • Muscle Pump Gym • Shoulders',
    sets: 3,
    reps: '15, 15, 12',
    weight: '12 kg',
    imageAlt: 'Dumbbells on a rack in a premium gym',
    imageSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop',
    icon: <Activity className="hidden md:block w-7 h-7" />
  },
  {
    id: '3',
    name: 'Seated Row',
    timeInfo: '10:30 • Muscle Pump Gym • Back',
    sets: 4,
    reps: '12, 10, 10, 8',
    weight: '60 kg',
    imageAlt: 'Seated Row machine',
    imageSrc: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200&h=200&fit=crop',
    icon: <Activity className="hidden md:block w-7 h-7" />
  },
  {
    id: '4',
    name: 'Cable Tricep Pushdown',
    timeInfo: '08:45 • Home Gym • Triceps',
    sets: 3,
    reps: '12, 12, 12',
    weight: '25 kg',
    imageAlt: 'Lat pull down machine detail',
    imageSrc: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=200&h=200&fit=crop',
    icon: <Repeat className="hidden md:block w-7 h-7" />
  }
];

interface WorkoutsProps {
  navigateTo: (page: 'dashboard' | 'workouts' | 'analysis' | 'records') => void;
}

const Workouts: React.FC<WorkoutsProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [exercises, setExercises] = useState<Exercise[]>(initialExercises);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setExercises(exercises.filter(e => e.id !== id));
    setDeletingId(null);
  };

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
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
              <Dumbbell className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">ProgressiveTrainer</h2>
          </div>
          <button className="text-slate-500 hover:text-primary cursor-pointer" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Activity className="w-5 h-5" />
            <span>Workouts</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-5 h-5" />
            <span>Statistics</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5" />
            <span>Personal Records</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
            <CalendarDays className="w-5 h-5" />
            <span>Schedule</span>
          </a>
          <a className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer">
            <User className="w-5 h-5" />
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Workout Sessions</h1>
            <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Activity from the last 24 hours</p>
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
          <div className="flex items-center gap-3">
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Last 24h Sessions</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Premium Member</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary">
            <CalendarDays className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto w-full custom-gradient relative md:pb-8">
          <div className="max-w-6xl mx-auto w-full p-4 md:p-10 pb-28 md:pb-10 space-y-6 md:space-y-8">
            
            {/* Desktop Action Header */}
            <div className="hidden md:flex items-center justify-end">
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                <Plus className="w-5 h-5 stroke-[3px]" />
                New Session
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
              <div className="col-span-1 md:col-span-1 flex flex-col gap-1 md:gap-2 rounded-xl md:rounded-2xl p-4 md:p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm relative overflow-hidden group">
                <div className="hidden md:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Weight className="w-12 h-12" />
                </div>
                <p className="text-slate-500 dark:text-primary/70 text-xs md:text-sm font-semibold uppercase tracking-wider">Total Volume</p>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">12,450</p>
                  <p className="text-xs md:text-base font-medium md:font-bold text-slate-400">kg</p>
                </div>
                <div className="hidden md:flex items-center gap-1 text-emerald-500 font-bold text-sm mt-2">
                  <Activity className="w-4 h-4" />
                  <span>+12% vs yesterday</span>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-1 flex flex-col gap-1 md:gap-2 rounded-xl md:rounded-2xl p-4 md:p-6 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm relative overflow-hidden group hidden sm:flex">
                <div className="hidden md:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Flame className="w-12 h-12" />
                </div>
                <p className="text-slate-500 dark:text-primary/70 text-xs md:text-sm font-semibold uppercase tracking-wider">Calories</p>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight">420</p>
                  <p className="text-xs md:text-base font-medium md:font-bold text-slate-400">kcal</p>
                </div>
                <div className="hidden md:flex items-center gap-1 text-emerald-500 font-bold text-sm mt-2">
                  <Activity className="w-4 h-4" />
                  <span>+5% intensity</span>
                </div>
              </div>

              <div className="col-span-1 sm:hidden flex flex-col gap-1 rounded-xl p-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/10 shadow-sm">
                <p className="text-slate-500 dark:text-primary/70 text-xs font-semibold uppercase tracking-wider">Exercises</p>
                <p className="text-2xl font-black leading-tight">14</p>
              </div>
              
              <div className="col-span-2 sm:col-span-1 flex flex-col gap-1 md:gap-2 rounded-xl md:rounded-2xl p-4 md:p-6 bg-primary text-white shadow-lg shadow-primary/20 relative overflow-hidden group">
                <div className="hidden md:block absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Timer className="w-12 h-12" />
                </div>
                <p className="text-white/80 md:text-white/90 text-xs md:text-sm font-semibold uppercase tracking-wider">Avg Intensity</p>
                <div className="flex items-baseline gap-1 md:gap-2">
                  <p className="text-2xl md:text-3xl font-black text-white leading-tight">85%</p>
                </div>
                <div className="hidden md:flex items-center gap-1 text-white/80 font-bold text-sm mt-2">
                  <CalendarDays className="w-4 h-4" />
                  <span>Target: 60 min</span>
                </div>
              </div>
            </div>

            {/* Exercise List Section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Completed Exercises</h3>
                <span className="text-xs font-medium md:font-bold px-3 py-1 bg-slate-100 dark:bg-primary/10 rounded-full text-slate-600 dark:text-primary">{exercises.length} Sessions Total</span>
              </div>
              
              <div className="space-y-4">
                {exercises.map((exercise) => {
                  if (deletingId === exercise.id) {
                    return (
                      <div key={exercise.id} className="group relative overflow-hidden rounded-xl bg-red-50 dark:bg-red-950/20 border-2 md:border md:border-red-500/30 border-red-200 dark:border-red-900/40 p-4 md:p-0 md:bg-white md:dark:bg-surface-dark shadow-sm">
                        <div className="md:bg-red-500/5 md:p-6 flex items-center justify-between gap-4 md:gap-6 flex-wrap">
                          <div className="flex items-center gap-4">
                            <div className="hidden md:flex size-14 rounded-xl bg-red-500/20 items-center justify-center text-red-500">
                              <AlertTriangle className="w-7 h-7" />
                            </div>
                            <div className="flex flex-col">
                              <p className="text-sm md:text-lg font-bold text-slate-900 dark:text-slate-100">Delete {exercise.name}?</p>
                              <p className="text-xs md:text-sm text-red-600 dark:text-slate-400 font-medium md:mt-1">This action cannot be undone.</p>
                            </div>
                          </div>
                          <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0 items-center">
                            <button type="button" className="md:hidden size-10 rounded-full bg-slate-200 dark:bg-slate-800 dark:text-slate-300 text-slate-600 flex items-center justify-center shrink-0" onClick={() => setDeletingId(null)}>
                              <ArrowLeft className="w-5 h-5" />
                            </button>
                            <button type="button" className="hidden md:block px-6 py-2 rounded-lg font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-background-dark transition-colors border border-transparent" onClick={() => setDeletingId(null)}>
                                Cancel
                            </button>
                            <button type="button" className="flex-1 md:flex-none px-4 md:px-6 py-2 bg-red-600 text-white text-xs md:text-sm font-bold rounded-lg shadow-lg shadow-red-600/20" onClick={() => handleDelete(exercise.id)}>
                              CONFIRM DELETE
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (editingId === exercise.id) {
                    return (
                      <div key={exercise.id} className="group relative overflow-hidden rounded-xl bg-primary/5 border-2 border-primary p-4 md:p-6 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                          <div className="flex items-start md:items-center gap-4">
                            <div className="relative size-16 md:size-14 shrink-0 overflow-hidden rounded-lg md:rounded-xl shadow-[0_0_0_2px_rgba(236,91,19,1)] md:bg-primary/20 md:flex md:items-center md:justify-center md:text-primary md:border-none">
                              <img className="h-full w-full object-cover md:hidden" alt={exercise.imageAlt} src={exercise.imageSrc}/>
                              {exercise.icon}
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-center justify-between">
                                <p className="text-base md:text-lg font-bold text-slate-900 dark:text-slate-100">{exercise.name}</p>
                                <div className="md:hidden flex items-center gap-1 bg-primary text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                                  <Edit className="w-3 h-3" /> EDITING
                                </div>
                              </div>
                              <p className="hidden md:block text-sm font-medium text-primary mt-0.5">Editing session data...</p>
                            </div>
                          </div>
                          
                          <form className="mt-1 md:mt-0 flex-1 md:flex-initial" onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const sets = Number(formData.get('sets'));
                            const reps = String(formData.get('reps'));
                            const weightStr = String(formData.get('weight'));
                            const weight = weightStr.includes('kg') ? weightStr : `${weightStr} kg`;
                            setExercises(exercises.map(ex => ex.id === exercise.id ? { ...ex, sets, reps, weight } : ex));
                            setEditingId(null);
                          }}>
                            <div className="flex items-center gap-2 md:gap-4 md:ml-0 md:w-[350px] w-full mt-2 md:mt-0">
                              <div className="flex flex-col flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 md:hidden">Sets</span>
                                <input name="sets" className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 rounded-lg text-sm px-2 py-1.5 md:py-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white" type="number" defaultValue={exercise.sets} />
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 md:hidden">Reps</span>
                                <input name="reps" className="w-full bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 rounded-lg text-sm px-2 py-1.5 md:py-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all text-slate-900 dark:text-white" type="text" defaultValue={exercise.reps} />
                              </div>
                              <div className="flex flex-col flex-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1 md:hidden">Weight</span>
                                <input name="weight" className="w-full text-primary font-bold bg-white dark:bg-background-dark border border-slate-200 dark:border-primary/30 rounded-lg text-sm px-2 py-1.5 md:py-2 focus:ring-1 focus:ring-primary focus:border-primary transition-all" type="text" defaultValue={parseInt(exercise.weight)} />
                              </div>
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                              <button type="button" className="px-3 md:px-4 py-1.5 text-xs md:text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight md:hover:bg-primary/10 md:rounded-lg" onClick={() => setEditingId(null)}>Cancel</button>
                              <button type="submit" className="px-4 md:px-6 py-1.5 bg-primary text-white text-xs md:text-sm font-bold rounded-lg uppercase tracking-tight shadow-md">Save Changes</button>
                            </div>
                          </form>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={exercise.id} className="group relative overflow-hidden rounded-xl bg-white dark:bg-surface-dark md:dark:bg-surface-dark border border-slate-200 dark:border-primary/10 p-4 md:p-6 transition-all shadow-sm active:scale-[0.98] md:active:scale-100">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
                        <div className="flex items-start md:items-center gap-4">
                          <div className="relative size-16 md:size-14 shrink-0 overflow-hidden rounded-lg md:rounded-xl md:bg-slate-100 md:dark:bg-background-dark md:flex md:items-center md:justify-center md:text-primary md:border md:border-primary/10">
                            <img className="h-full w-full object-cover md:hidden" alt={exercise.imageAlt} src={exercise.imageSrc}/>
                            {exercise.icon}
                          </div>
                          <div className="flex flex-1 flex-col">
                            <div className="flex items-center justify-between md:hidden">
                              <p className="text-base font-bold text-slate-900 dark:text-slate-100">{exercise.name}</p>
                              <div className="flex gap-2">
                                <button className="text-slate-400 hover:text-primary transition-colors" onClick={() => { setEditingId(exercise.id); setDeletingId(null); }}>
                                  <Edit className="w-5 h-5" />
                                </button>
                                <button className="text-slate-400 hover:text-red-500 transition-colors" onClick={() => { setDeletingId(exercise.id); setEditingId(null); }}>
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                            <h3 className="hidden md:block text-lg font-bold text-slate-900 dark:text-slate-100">{exercise.name}</h3>
                            <p className="text-xs md:text-sm font-medium text-slate-500 dark:text-primary/60 md:dark:text-slate-400 mt-0.5 md:mt-0">{exercise.timeInfo}</p>
                          </div>
                        </div>
                        
                        <div className="mt-1 md:mt-0 flex items-center md:gap-12 gap-6 flex-wrap md:ml-0 ml-[80px]">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Sets</span>
                            <span className="text-sm md:text-xl font-bold md:font-black text-slate-900 dark:text-slate-100">{exercise.sets}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Reps</span>
                            <span className="text-sm md:text-xl font-bold md:font-black text-slate-900 dark:text-slate-100">{exercise.reps}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Weight</span>
                            <span className="text-sm md:text-xl font-bold md:font-black text-primary">{exercise.weight}</span>
                          </div>
                          
                          {/* Desktop actions */}
                          <div className="hidden md:flex gap-2 ml-auto">
                            <button className="size-10 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-background-dark text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" onClick={() => { setEditingId(exercise.id); setDeletingId(null); }}>
                              <Edit className="w-5 h-5" />
                            </button>
                            <button className="size-10 rounded-lg flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all" onClick={() => { setDeletingId(exercise.id); setEditingId(null); }}>
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Progress Chart Placeholder */}
            <div className="hidden md:block mt-8 p-8 rounded-3xl bg-[linear-gradient(135deg,rgba(236,91,19,0.1)_0%,transparent_100%)] border border-primary/10 relative overflow-hidden">
              <div className="relative z-10 flex flex-col justify-between items-center gap-6">
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Performance Trend</h3>
                  <p className="text-slate-500 dark:text-slate-400">You've hit 95% of your volume goal for today.</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="size-16 rounded-full border-4 border-primary border-t-transparent flex items-center justify-center mb-2">
                      <span className="text-sm font-black text-primary">95%</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Daily Target</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="size-16 rounded-full border-4 border-slate-300 dark:border-surface-dark border-r-primary flex items-center justify-center mb-2">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">45 Min</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Streak</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Bottom Action Footer */}
          <footer className="hidden md:flex mt-auto p-6 border-t border-slate-200 dark:border-primary/10 bg-white/50 dark:bg-background-dark/50 backdrop-blur-sm sticky bottom-0">
            <div className="max-w-6xl w-full mx-auto flex justify-between items-center gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">© 2024 Progressive Trainer. Keep pushing your limits.</p>
              <div className="flex gap-4">
                <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Privacy</a>
                <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Terms of Service</a>
                <a href="#" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Privacy Policy</a>
                <a className="text-xs font-bold text-slate-400 hover:text-primary transition-colors" href="#">Help Center</a>
              </div>
            </div>
          </footer>

        </main>
      </div>

      {/* Floating Action Button (Mobile) */}
      <button className="md:hidden fixed bottom-24 right-6 size-14 rounded-full bg-primary text-white shadow-xl shadow-primary/30 flex items-center justify-center z-20">
        <Plus className="w-8 h-8" />
      </button>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-6 h-6 stroke-[3px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Workouts</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('analysis')}>
            <LineChart className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => {}}>
            <User className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Profile</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default Workouts;
