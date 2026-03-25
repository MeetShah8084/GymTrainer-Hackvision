import React, { useState, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import { supabase } from '../lib/supabase';
import {
  Dumbbell,
  LayoutDashboard,
  LineChart,
  Bell,
  Settings,
  Flame,
  RotateCcw,
  CheckCircle,
  TrendingUp,
  BarChart,
  Trophy,
  Menu,
  X,
  CalendarDays,
  BellOff, // Added BellOff import
  MessageSquare,
  ArrowLeft,
  MoreHorizontal,
  Trash2
} from 'lucide-react';

const EXERCISES_BY_MUSCLE: Record<string, string[]> = {
  Chest: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Push-ups', 'Cable Crossovers', 'Decline Press'],
  Back: ['Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift', 'T-Bar Row', 'Seated Cable Row'],
  Legs: ['Squats', 'Leg Press', 'Lunges', 'Romanian Deadlift', 'Calf Raises', 'Leg Extensions'],
  Arms: ['Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skullcrushers', 'Preacher Curls', 'Tricep Dips'],
  Abs: ['Crunches', 'Planks', 'Cable Crunches', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts']
};

interface ExerciseCard {
  id: string;
  exerciseName: string;
  weight: string;
  sets: string;
  reps: string;
  isPR: boolean;
  showPR: boolean;
  removing?: boolean;
  prChecking?: boolean;
  prError?: string;
}

interface TargetMuscleLoggerProps {
  muscleGroup: string;
  onBack: () => void;
  onSaveSession: (exercises: any[]) => void;
  onAddPRs?: (prs: { exerciseName: string; weight: number }[]) => void;
  personalRecords?: PRRecord[];
  userId?: string;
}

const TargetMuscleLogger: React.FC<TargetMuscleLoggerProps> = ({ muscleGroup, onBack, onSaveSession, onAddPRs, personalRecords = [], userId = '' }) => {
  const exerciseOptions = EXERCISES_BY_MUSCLE[muscleGroup] || ['Custom Exercise'];

  const createCard = (): ExerciseCard => ({
    id: `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    exerciseName: exerciseOptions[0],
    weight: '',
    sets: '',
    reps: '',
    isPR: false,
    showPR: false,
  });

  const [cards, setCards] = useState<ExerciseCard[]>([createCard()]);
  const [animatingIds, setAnimatingIds] = useState<Set<string>>(new Set());

  // Reset when muscle group changes
  useEffect(() => {
    setCards([createCard()]);
    setAnimatingIds(new Set());
  }, [muscleGroup]);

  const updateCard = (id: string, field: keyof ExerciseCard, value: any) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const addCard = () => {
    const newCard = createCard();
    setCards(prev => [...prev, newCard]);
    // Trigger slide-in animation
    setAnimatingIds(prev => new Set(prev).add(newCard.id));
    setTimeout(() => {
      setAnimatingIds(prev => {
        const next = new Set(prev);
        next.delete(newCard.id);
        return next;
      });
    }, 50);
  };

  const removeCard = (id: string) => {
    // Trigger slide-out animation
    setCards(prev => prev.map(c => c.id === id ? { ...c, removing: true } : c));
    setTimeout(() => {
      setCards(prev => prev.filter(c => c.id !== id));
    }, 400);
  };

  const handleSaveSession = () => {
    const validCards = cards.filter(c => !c.removing && c.exerciseName && c.sets && c.reps && c.weight);
    if (validCards.length === 0) {
      alert("Please fill in at least one exercise completely.");
      return;
    }

    // Validation & formatting for reps
    for (const c of validCards) {
      const numSets = parseInt(c.sets);
      const repsArr = c.reps.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));

      if (repsArr.length === 1) {
        c.reps = Array(numSets).fill(repsArr[0]).join(', ');
      } else if (repsArr.length !== numSets) {
        alert("enter reps for all the sets");
        return;
      }
    }

    const todayDate = new Date();
    const sessionDateStr = `${todayDate.getFullYear()}-${String(todayDate.getMonth() + 1).padStart(2, '0')}-${String(todayDate.getDate()).padStart(2, '0')}`;
    const exercises = validCards.map(c => ({
      id: `logged-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: c.exerciseName,
      timeInfo: `Current Session • ${muscleGroup}`,
      date: sessionDateStr,
      sets: parseInt(c.sets),
      reps: c.reps,
      weight: `${c.weight} kg`,
      imageAlt: c.exerciseName,
      imageSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop',
      icon: <Dumbbell className="hidden md:block w-7 h-7" />
    }));
    onSaveSession(exercises);

    // Call n8n logWorkout API
    if (userId) {
      // PR Check
      let prMessages: string[] = [];
      for (const c of validCards) {
        const weightVal = parseFloat(c.weight) || 0;
        if (weightVal > 0) {
          const existingPR = personalRecords?.find(pr => pr.exerciseName === c.exerciseName);
          if (!existingPR || weightVal > existingPR.weight) {
            prMessages.push(`🎉 New Personal Record for ${c.exerciseName}: ${weightVal} kg!`);
          }
        }
      }
      if (prMessages.length > 0) {
        alert(prMessages.join('\\n'));
      }

      const apiExercises: LogWorkoutExercise[] = validCards.map(c => {
        const repsArr = c.reps.split(',').map(r => parseInt(r.trim())).filter(r => !isNaN(r));
        const numSets = parseInt(c.sets) || repsArr.length;
        const sets = Array.from({ length: numSets }, (_, i) => ({
          set_number: i + 1,
          reps: repsArr[i] || repsArr[0] || 0,
          weight: parseFloat(c.weight) || 0,
        }));
        return { name: c.exerciseName, sets };
      });
      logWorkout(userId, sessionDateStr, muscleGroup, apiExercises)
        .catch(err => console.error('Failed to log workout:', err));
    }

    // Push PR-flagged exercises
    const prCards = validCards.filter(c => c.isPR);
    if (prCards.length > 0 && onAddPRs) {
      onAddPRs(prCards.map(c => ({ exerciseName: c.exerciseName, weight: parseFloat(c.weight) })));
    }
    onBack();
  };

  return (
    <div className="w-full h-full flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
      {/* Logger Header */}
      <div className="flex shrink-0 items-center justify-start gap-4 px-6 py-4 md:px-8 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full border border-primary/20 text-primary hover:bg-primary/20 transition-colors flex items-center justify-center cursor-pointer shadow-sm">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl md:text-2xl font-black dark:text-primary tracking-tight">{muscleGroup} Workout</h1>
      </div>

      {/* Logger Main Content */}
      <main className="flex-1 overflow-y-auto custom-gradient p-4 md:p-8 flex flex-col items-center pb-24 md:pb-8">
        {/* 3D Model Placeholder */}
        <div className="w-full max-w-[1000px] aspect-square rounded-[32px] border border-slate-700/50 bg-black/20 flex flex-col items-center justify-center mb-10 shadow-inner relative overflow-hidden">
          <span className="text-slate-500 font-medium z-10">3d model</span>
        </div>

        {/* Log your Progress */}
        <div className="w-full max-w-[1000px]">
          <h2 className="text-2xl md:text-3xl font-black text-slate-200 tracking-tight">Log your Progress</h2>
          <p className="text-primary text-sm font-medium mb-6 mt-1">
            Record your intensity and volume for {muscleGroup} session.
          </p>

          {/* Exercise Cards */}
          <div className="space-y-6 overflow-hidden">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] ${card.removing
                  ? 'translate-x-full opacity-0 max-h-0 mb-0 overflow-hidden'
                  : animatingIds.has(card.id)
                    ? 'translate-x-full opacity-0'
                    : 'translate-x-0 opacity-100'
                  }`}
                style={{ transitionProperty: 'transform, opacity, max-height, margin' }}
              >
                <div className="flex items-center gap-3">
                  {/* Card */}
                  <div className="flex-1 border border-primary/50 rounded-[28px] p-6 md:p-8 bg-surface-dark/40 shadow-xl shadow-black/10 relative">
                    <div className="flex flex-col gap-6 md:gap-8">
                      {/* Exercise name */}
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                        <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider w-36 shrink-0">Exercise name:</label>
                        <select
                          value={card.exerciseName}
                          onChange={(e) => updateCard(card.id, 'exerciseName', e.target.value)}
                          className="flex-1 bg-transparent border border-primary/40 rounded-xl px-4 py-3 text-white outline-none focus:border-primary appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ec5b13'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: `right 16px center`, backgroundRepeat: `no-repeat`, backgroundSize: `20px` }}
                        >
                          {exerciseOptions.map(ex => (
                            <option key={ex} value={ex} className="bg-[#1e1511]">{ex}</option>
                          ))}
                        </select>
                      </div>

                      {/* Weight & Sets row */}
                      <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4 justify-between">
                        <div className="flex items-center gap-3">
                          <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider shrink-0">Weight:</label>
                          <input type="number"
                            min="0"
                            value={card.weight}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || parseFloat(val) >= 0) updateCard(card.id, 'weight', val);
                            }}
                            className="w-24 bg-transparent border border-primary/40 rounded-xl px-3 py-2 text-white outline-none focus:border-primary text-center" />
                          <span className="text-primary font-bold">kg</span>
                        </div>
                        <div className="flex items-center gap-3 mt-2 md:mt-0">
                          <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Number of sets:</label>
                          <input type="number"
                            min="0"
                            value={card.sets}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '' || parseInt(val) >= 0) updateCard(card.id, 'sets', val);
                            }}
                            className="w-24 bg-transparent border border-primary/40 rounded-xl px-3 py-2 text-white outline-none focus:border-primary text-center" />
                        </div>
                      </div>

                      {/* Reps per set */}
                      <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-6 relative">
                        <div className="flex flex-col">
                          <label className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Number of reps per set:</label>
                          <span className="text-slate-500 text-[11px] leading-tight mt-1 opacity-80">comma separated entries;<br />Eg: 10,2,2,4</span>
                        </div>
                        <input type="text"
                          value={card.reps}
                          onChange={(e) => {
                            const val = e.target.value;
                            // Only allow digits, commas, and spaces
                            if (/^[0-9, ]*$/.test(val)) updateCard(card.id, 'reps', val);
                          }}
                          className="w-full md:w-40 bg-transparent border border-primary/40 rounded-xl px-4 py-3 text-white outline-none focus:border-primary" />

                        <div className="absolute right-0 bottom-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
                          <button
                            onClick={() => updateCard(card.id, 'showPR', !card.showPR)}
                            className={`p-2 border rounded-[10px] transition-colors cursor-pointer ${card.showPR ? 'border-primary text-primary bg-primary/10' : 'border-slate-600 text-slate-400 hover:text-white hover:border-slate-500'}`}
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delete icon - outside the card, vertically centered */}
                  {index > 0 && (
                    <button
                      onClick={() => removeCard(card.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Add to PR - shown only when three dots is clicked */}
                <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${card.showPR ? 'max-h-32 opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'}`}>
                  <div
                    className={`border rounded-[20px] px-5 py-4 flex items-center gap-4 transition-colors cursor-pointer ${card.isPR ? 'border-primary/60 bg-primary/5' : 'border-slate-700/60 bg-surface-dark/20 hover:bg-surface-dark/40'}`}
                    onClick={() => {
                      if (card.isPR) {
                        updateCard(card.id, 'isPR', false);
                        updateCard(card.id, 'prError', '');
                        return;
                      }
                      const w = parseFloat(card.weight);
                      if (!w || w <= 0) {
                        updateCard(card.id, 'prError', 'Enter a valid weight first');
                        setTimeout(() => updateCard(card.id, 'prError', ''), 2000);
                        return;
                      }
                      // Start spinner
                      updateCard(card.id, 'prChecking', true);
                      updateCard(card.id, 'prError', '');
                      setTimeout(() => {
                        const existing = personalRecords.find(pr => pr.exerciseName === card.exerciseName);
                        const currentPR = existing ? existing.weight : 0;
                        if (w > currentPR) {
                          updateCard(card.id, 'isPR', true);
                          updateCard(card.id, 'prChecking', false);
                        } else {
                          updateCard(card.id, 'prChecking', false);
                          updateCard(card.id, 'prError', `Weight must exceed current PR (${currentPR} kg)`);
                          setTimeout(() => updateCard(card.id, 'prError', ''), 3000);
                        }
                      }, 1000);
                    }}
                  >
                    <div className={`w-6 h-6 rounded flex flex-shrink-0 items-center justify-center transition-colors ${card.prChecking ? '' : card.isPR ? 'bg-primary border-primary' : 'border border-slate-600 bg-transparent'}`}>
                      {card.prChecking ? (
                        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      ) : card.isPR ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : null}
                    </div>
                    <div className="flex flex-col">
                      <label className="text-slate-200 text-base font-semibold cursor-pointer select-none">Add to PR</label>
                      {card.prError && <span className="text-red-400 text-xs mt-0.5">{card.prError}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add exercise button */}
          <button
            className="w-full mt-6 border-[2px] border-dashed border-primary/40 rounded-[24px] py-5 text-primary tracking-wide text-lg font-bold hover:bg-primary/5 hover:border-primary/60 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            onClick={addCard}
          >
            <span className="text-xl mt-0.5">+</span> Add exercise
          </button>

          {/* Save Session button */}
          <button
            className="w-full mt-6 border-[2px] border-dashed border-slate-600 rounded-[24px] py-5 text-slate-300 tracking-wide text-lg font-bold hover:bg-slate-700/30 hover:border-slate-500 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
            onClick={handleSaveSession}
          >
            Save session
          </button>

        </div>
      </main>
    </div>
  );
};

import type { Exercise } from '../data/exercises';
import type { PRRecord } from '../App';
import { logWorkout, relogWorkout, getDashboardMetrics, type DashboardMetrics, type LogWorkoutExercise } from '../lib/n8nApi';

interface DashboardProps {
  userName?: string;
  setUserName?: (name: string) => void;
  userId?: string;
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => void;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
  incompleteExercises?: Exercise[];
  setIncompleteExercises?: (exercises: Exercise[]) => void;
  completedExercises?: Exercise[];
  setCompletedExercises?: (exercises: Exercise[]) => void;
  personalRecords?: PRRecord[];
  setPersonalRecords?: (records: PRRecord[]) => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  userName = "Loading...",
  setUserName,
  userId = '',
  navigateTo,
  notificationsEnabled = true,
  toggleNotifications,
  incompleteExercises = [],
  setIncompleteExercises,
  completedExercises = [],
  setCompletedExercises,
  personalRecords = [],
  setPersonalRecords
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);

  const now = new Date();
  const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const todayCompletedExercises = completedExercises.filter(ex => ex.date === todayDateStr);

  const handleCompleteExercise = (exerciseId: string) => {
    const exercise = incompleteExercises.find(e => e.id === exerciseId);
    if (!exercise || !setIncompleteExercises || !setCompletedExercises) return;
    setIncompleteExercises(incompleteExercises.filter(e => e.id !== exerciseId));

    const now = new Date();
    const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const completedEx = { ...exercise, date: todayDateStr };

    setCompletedExercises([...completedExercises, completedEx]);
  };

  const handleRelog = async () => {
    if (setIncompleteExercises) setIncompleteExercises([]);
    if (setCompletedExercises) {
      const now = new Date();
      const todayDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      setCompletedExercises(completedExercises.filter(ex => ex.date !== todayDateStr));
    }

    if (userId) {
      try {
        await relogWorkout(userId, todayDateStr);
      } catch (err) {
        console.error("Failed to relog workout on backend:", err);
      }
    }
  };

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        if (setUserName) setUserName(fullName);
      } else {
        if (setUserName) setUserName('Guest');
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    async function loadMetrics() {
      if (userId) {
        try {
          const m = await getDashboardMetrics(userId);
          setMetrics(m);
        } catch (err) {
          console.error("Failed to fetch dashboard metrics:", err);
        }
      }
    }
    loadMetrics();
  }, [userId]);


  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
    setIsSidebarOpen(false);
    setTimeout(() => {
      navigateTo(page);
    }, 300);
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
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('dashboard')}>
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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('settings')}>
            <span>Settings</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('aichat')}>
            <span>AI Chat</span>
          </a>
        </nav>

      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 overflow-hidden relative bg-background-light dark:bg-background-dark">
        <div className={`w-full h-full flex transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${selectedMuscleGroup ? '-translate-x-full' : 'translate-x-0'}`}>

          {/* Dashboard View */}
          <div className="w-full shrink-0 h-full flex flex-col relative min-w-full">
            {/* Desktop Header */}
            <header className="hidden md:flex shrink-0 z-20 items-center justify-between px-8 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
              <div className="flex items-center gap-4">
                <button className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
                  <Menu className="w-6 h-6" />
                </button>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white">Good Morning, {userName.split(' ')[0] || userName}</h1>
                  <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Ready for your push day today?</p>
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
                  <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all" onClick={() => handleNavigation('settings')}>
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
                <div className="shrink-0 size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
                  {userName.charAt(0).toUpperCase()}
                </div>
              </div>
            </header>

            {/* Mobile Header */}
            <div className="md:hidden flex shrink-0 z-20 items-center p-4 justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary font-bold text-lg shadow-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col ml-3 flex-1">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Welcome back</span>
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">{userName}</h2>
              </div>
              <div className="flex items-center gap-2">
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
                <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-primary transition-colors" onClick={() => navigateTo('settings')}>
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <main className="flex-1 overflow-y-auto custom-gradient relative md:pb-8">
              <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-6 md:space-y-8 pb-24 md:pb-8">

                {/* Mobile Hero Stats */}
                <div className="md:hidden relative overflow-hidden rounded-xl bg-primary p-6 text-white shadow-lg shadow-primary/20">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white/80 text-sm font-medium">Daily Consistency</p>
                        <h3 className="text-4xl font-bold mt-1">{metrics ? `${metrics.consistency}%` : '...'}</h3>
                      </div>
                      <div className="bg-white/20 backdrop-blur-md rounded-lg p-2">
                        <TrendingUp className="w-6 h-6 stroke-[3px]" />
                      </div>
                    </div>
                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="border-r border-white/20 pr-2">
                        <p className="text-white/70 text-[10px]">Streak</p>
                        <p className="text-lg font-bold">{metrics ? `${metrics.streak}d` : '...'}</p>
                      </div>
                      <div className="border-r border-white/20 pr-2">
                        <p className="text-white/70 text-[10px]">Workouts</p>
                        <p className="text-lg font-bold">{metrics ? metrics.workouts_total : '...'}</p>
                      </div>
                      <div>
                        <p className="text-white/70 text-[10px]">Calories</p>
                        <p className="text-lg font-bold">{metrics ? `${metrics.calories_today}` : '...'}<span className="text-xs font-normal ml-0.5">kcal</span></p>
                      </div>
                    </div>
                  </div>
                  {/* Abstract Design Elements */}
                  <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl"></div>
                  <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-black/10 blur-2xl"></div>
                </div>

                {/* Desktop Stats Overview */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Row 1 */}
                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Consistency</p>
                      {metrics && metrics.consistency_diff !== 0 && (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.consistency_diff > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {metrics.consistency_diff > 0 ? '+' : ''}{metrics.consistency_diff}%
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? `${metrics.consistency}%` : '...'}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${metrics ? metrics.consistency : 0}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Workouts</p>
                      {metrics && metrics.workouts_diff !== 0 && (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.workouts_diff > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {metrics.workouts_diff > 0 ? '+' : ''}{metrics.workouts_diff}
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? metrics.workouts_total : '...'}</p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Total Sessions</p>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Volume</p>
                      {metrics && metrics.volume_diff !== 0 && (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.volume_diff > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {metrics.volume_diff > 0 ? '+' : ''}{metrics.volume_diff}%
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? `${(metrics.volume_monthly / 1000).toFixed(1)}k` : '...'} <span className="text-lg font-medium text-slate-400">kg</span></p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">30-Day Lifted</p>
                  </div>

                  <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 text-white relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-white/80 text-sm font-medium">Daily Streak</p>
                      <p className="text-3xl font-black">{metrics ? `${metrics.streak} Days` : '...'}</p>
                      <p className="text-xs text-white/60 mt-2 uppercase tracking-widest">Keep it up!</p>
                    </div>
                    <Flame className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
                  </div>

                  {/* Row 2 – New metrics */}
                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Today's Volume</p>
                      {metrics && (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.volume_diff_yesterday >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {metrics.volume_diff_yesterday >= 0 ? '+' : ''}{metrics.volume_diff_yesterday.toFixed(0)}% vs yday
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? `${(metrics.volume_today / 1000).toFixed(1)}k` : '0'} <span className="text-lg font-medium text-slate-400">kg</span></p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Lifted Today</p>
                  </div>

                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Calories Burned</p>
                      </div>
                      {metrics && (
                        <span className={`text-xs font-bold px-2 py-1 rounded ${metrics.calories_diff_yesterday >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                          {metrics.calories_diff_yesterday >= 0 ? '+' : ''}{metrics.calories_diff_yesterday.toFixed(0)}%
                        </span>
                      )}
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? metrics.calories_today : '0'} <span className="text-lg font-medium text-slate-400">kcal</span></p>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Today's Burn Est.</p>
                  </div>


                  <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <BarChart className="w-4 h-4 text-primary" />
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Sessions (Month)</p>
                      </div>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics ? metrics.workouts_total : '...'}</p>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${metrics ? Math.min((metrics.workouts_total / daysInMonth) * 100, 100) : 0}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Goal: {daysInMonth} / month</p>
                  </div>
                </div>

                {/* Quick Actions (Mobile) */}
                <div className="md:hidden grid grid-cols-2 gap-3">
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-bold text-white shadow-md transition-transform active:scale-95"
                    onClick={() => incompleteExercises.length > 0 && handleCompleteExercise(incompleteExercises[0].id)}
                  >
                    <CheckCircle className="w-[18px] h-[18px]" />
                    <span>Complete</span>
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 dark:bg-primary/20 py-3 px-4 font-bold text-slate-900 dark:text-primary transition-transform active:scale-95"
                    onClick={handleRelog}
                  >
                    <RotateCcw className="w-[18px] h-[18px]" />
                    <span>Relog</span>
                  </button>
                </div>

                {/* Action Section (Desktop) */}
                <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-surface-dark p-6 rounded-xl border-l-4 border-primary shadow-sm">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">Current Session: {incompleteExercises.length > 0 ? incompleteExercises[0].name : "All Completed"}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Started 45 minutes ago • {todayCompletedExercises.length}/{todayCompletedExercises.length + incompleteExercises.length} Exercises completed</p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
                      onClick={handleRelog}
                    >
                      <RotateCcw className="w-5 h-5" />
                      Relog
                    </button>
                    <button
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all"
                      onClick={() => incompleteExercises.length > 0 && handleCompleteExercise(incompleteExercises[0].id)}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Complete Workout
                    </button>
                  </div>
                </div>

                {/* Incomplete Exercises List (Synced across session) */}
                {incompleteExercises.length > 0 && (
                  <div className="flex flex-col gap-3 mt-4">
                    {incompleteExercises.map((exercise) => (
                      <div key={exercise.id} className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-surface-dark border border-slate-200 dark:border-primary/5 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-xl bg-slate-100 dark:bg-background-dark/50 flex items-center justify-center text-primary shrink-0">
                            {exercise.icon}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-bold text-slate-900 dark:text-slate-100 text-base md:text-lg">{exercise.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                              {exercise.sets} sets • {exercise.reps} • {exercise.weight}
                            </p>
                          </div>
                        </div>
                        <button
                          className="w-full md:w-auto mt-2 md:mt-0 px-4 py-2 border-2 border-primary/20 text-primary font-bold rounded-lg hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                          onClick={() => handleCompleteExercise(exercise.id)}
                        >
                          <CheckCircle className="w-5 h-5" />
                          Complete Workout
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Muscle Group Grid */}
                <div>
                  <div className="flex items-center justify-between mb-4 md:mb-6">
                    <h2 className="text-xl md:text-2xl font-black dark:text-white leading-tight tracking-tight">Target Muscle Groups</h2>
                    <a className="text-primary font-bold text-sm hover:underline" href="#">View Details</a>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
                    {[
                      { name: "Chest", count: "8 Exercises", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCzGrQlmZiiGly8uNyGA6-XBGKTI_gS5sXWVT-CLq28p_mWuRATrROrpBMiAJAwyeHxECJkKc8L6PBlPJWJJ-pCn2kABXAj6f23o8kr8HNYJ1Umaw1crMOvhCA3pDCXG5cDFJmaeEczV0iQYm5q_1PJrcDb91oXkXrTj-v0zrjMfw9sAqRREmqnhCrqlIOLD8LFA7jugkOExHjbsaE2iMmVImKss2sn2fpFTJim5Kq58FlAmR2F5pJvmBgaeu1zS2vsElHtqVmZN_h9" },
                      { name: "Back", count: "12 Exercises", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCh7Mo4Sy-rjWyVdu8WADiL9FoFVUbq2nGX0xT7W1OCXXSQ6L1At4RVZhT6CP30-djO745HYFI_MH85F00keEo4HFasLZwTOBGesdkXjkBA_qVHWNLaEQsZjehmbLWjLcMyRuF6PQZEZvfIhY-pfM17wQRQGVcWC1fqZoAeOR5_zTLJAd3SJz7UsZLJw4LscESBtT-k4HcSIulRQ-CsooxarxXoEpqANELlBQMOSu2KnTNtE3x7F4NfRw7su72MtD_a1kMO5T1HVJDq" },
                      { name: "Legs", count: "15 Exercises", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCx2nKoTp9hIulqcJzftHscAPbTvJbtUWbR1d2huWsNSd8udVImqzEbU35zWy6u_01ZrVZPyc3Pq2eZWH0NT5-tcGNrBaBSbMWMf8jNfqRzOhm2-95jUAN9OeEvqt5FjZECkyzOmllQeE282Ws5S5MB-EPuXTp0HU2rVl9HSN20tvNECw19jP98eSne0VaWGCeFfUcR0lvwSP6Quj5LBzfSOZnm56eH0-w0IuDFXuv8NAEDMXgrJ4ZiJGQUYOiMTHt8qOgB4aFLKhFx" },
                      { name: "Arms", count: "10 Exercises", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDgRIsl9HlPIes_SV170T05M3aQb9Ej8T77LafGBpFXR8bXWQbF9MG6aXPgbpIhvWs5aC-ZmBAq9i__hEfgvJyAQS06hk1qYZKCkboLV9LLnwbGr3KyYUn6cHHj2Eq1TR3bHDWcECoHBzc_89VR_UIv5bnrflrgBVqqoIkIIIui3_HoAKFHWx9GeaSoBkVdeELSjem-UhmYFWXzBAmBt3c6Wec2QhVIp-qKufq6NM1WjsSGP6UvIAYcryGkTfMK_ySzFyD97rfymKqz" },
                      { name: "Abs", count: "6 Exercises", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBSChcSfb4tpFewa91NXIHObWJ5S6macUZuG9U_0Ugx19S5YdMZS0B0td-EZOrtEAVHuROgAf04mURpen7VOp008cyhgetpK2CtayG4obpse_sTKICajSw5ZOka0vwREja_st_DiiMz4kgUy7DvrRWsA5-khs5fCf9kc9eFHRjbj01oHg1uW88ttabAca-02pLcZrSOtzf_pK4iQ3BOC0ygp99X054ThI4nHk6HkZg60sUStf3XTcB2gbyMdZI3ZVZ5b-3GqTc7KsVm" },
                    ].map((group) => (
                      <div key={group.name} className="group cursor-pointer relative aspect-[4/5] md:h-64 md:aspect-auto w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-all hover:shadow-md" onClick={() => setSelectedMuscleGroup(group.name)}>
                        <img alt={`${group.name} Muscle Group`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" src={group.src} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 md:via-transparent to-transparent z-10"></div>
                        <div className="absolute bottom-4 left-4 z-20">
                          <p className="text-white text-lg md:text-xl font-bold md:font-black uppercase">{group.name}</p>
                          <div className="flex items-center gap-1">
                            <div className="hidden md:block size-1.5 rounded-full bg-primary"></div>
                            <p className="text-primary md:text-white/60 text-xs font-medium uppercase tracking-tighter md:tracking-normal">{group.count}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                           {/* Recent Activity */}
                <div className="pb-8 mt-10 md:mt-12">
                  <div className="space-y-6">
                    <h2 className="text-2xl font-black dark:text-white">Recent PRs</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {metrics?.recent_prs && metrics.recent_prs.length > 0 ? (
                        metrics.recent_prs.map((pr, idx) => (
                          <div key={idx} className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-primary/5">
                            <div className="flex items-center gap-4">
                              <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                                <TrendingUp className="w-6 h-6 stroke-[3px]" />
                              </div>
                              <div>
                                <p className="font-bold dark:text-white">{pr.exercise_name}</p>
                                <p className="text-sm text-slate-500">New {pr.reps}RM: {pr.new_weight}kg</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">+{ (Number(pr.new_weight) - Number(pr.prev_weight)).toFixed(1).replace(/\.0$/, '') }kg</p>
                              <p className="text-xs text-slate-400">
                                {(() => {
                                  const date = new Date(pr.achieved_at);
                                  const now = new Date();
                                  now.setHours(0, 0, 0, 0);
                                  const d = new Date(date);
                                  d.setHours(0, 0, 0, 0);
                                  const diffTime = now.getTime() - d.getTime();
                                  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
                                  if (diffDays === 0) return 'Today';
                                  if (diffDays === 1) return 'Yesterday';
                                  if (diffDays < 0) return 'Just now';
                                  return `${diffDays} days ago`;
                                })()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center bg-white dark:bg-surface-dark rounded-xl border border-dashed border-slate-700/50 col-span-full">
                          <Trophy className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                          <p className="text-slate-500 font-medium font-['Poppins']">No recent PRs. Keep crushing it!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
      </div>


              </div>
            </main>
          </div>

          {/* Logger View */}
          <div className="w-full shrink-0 h-full flex flex-col relative min-w-full">
            {selectedMuscleGroup && (
              <TargetMuscleLogger
                muscleGroup={selectedMuscleGroup}
                onBack={() => setSelectedMuscleGroup(null)}
                personalRecords={personalRecords}
                userId={userId}
                onSaveSession={(exercises) => {
                  if (setIncompleteExercises) {
                    setIncompleteExercises([...incompleteExercises, ...exercises]);
                  }
                }}
                onAddPRs={(prs) => {
                  if (setPersonalRecords) {
                    const now = new Date();
                    const dateStr = `${now.toLocaleString('en-US', { month: 'short' }).toUpperCase()} ${String(now.getDate()).padStart(2, '0')}, ${now.getFullYear()}`;
                    const updated = personalRecords.map(existing => {
                      const match = prs.find(p => p.exerciseName === existing.exerciseName);
                      if (match && match.weight > existing.weight) {
                        return {
                          ...existing,
                          improvement: match.weight - existing.weight,
                          weight: match.weight,
                          date: dateStr
                        };
                      }
                      return existing;
                    });
                    // Add any exercises not already in the list
                    const newOnes = prs
                      .filter(p => !personalRecords.some(e => e.exerciseName === p.exerciseName))
                      .map(p => ({
                        id: `pr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                        exerciseName: p.exerciseName,
                        weight: p.weight,
                        improvement: p.weight,
                        date: dateStr
                      }));
                    setPersonalRecords([...updated, ...newOnes]);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Dash</span>
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
};

export default Dashboard;
