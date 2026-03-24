import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Schedule from './components/Schedule'
import AIChat from './components/AIChat'
import Settings from './components/Settings'
import Login from './components/Login'
import { supabase } from './lib/supabase'
import { Dumbbell } from 'lucide-react'
import { listDetailedSessions, syncPersonalRecords } from './lib/n8nApi'
import './index.css'

import type { Exercise } from './data/exercises'

export interface PRRecord {
  id: string;
  exerciseName: string;
  weight: number; // in kg
  improvement: number; // in kg
  date: string; // e.g. "MAR 10, 2026"
}

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat'>('dashboard')
  const [userName, setUserName] = useState<string>("Loading...");
  const [userId, setUserId] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Lifted state for exercises — start empty, loaded from backend
  const [incompleteExercises, setIncompleteExercises] = useState<Exercise[]>([]);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>([]);

  // Lifted state for personal records — start empty, loaded from backend
  const [personalRecords, setPersonalRecords] = useState<PRRecord[]>([]);

  // Fetch user on mount
  useEffect(() => {
    const fetchUserData = async (user: any) => {
      if (user) {
        setUserId(user.id);
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);

        try {
          const [sessionsRes, prsRes] = await Promise.all([
            listDetailedSessions(user.id),
            syncPersonalRecords(user.id)
          ]);

          // Handle PRs mapping
          let prData = [];
          const anyPrsRes = prsRes as any;
          if (Array.isArray(anyPrsRes) && anyPrsRes[0]?.data) {
            prData = anyPrsRes[0].data;
          } else if (anyPrsRes?.data) {
            prData = anyPrsRes.data;
          } else if (Array.isArray(anyPrsRes)) {
            prData = anyPrsRes;
          }
          if (prData.length > 0) {
            setPersonalRecords(prData.map((r: any) => ({
              id: r.id,
              exerciseName: r.exercise_name,
              weight: parseFloat(r.max_weight) || 0,
              improvement: 0,
              date: r.updated_at ? new Date(r.updated_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).toUpperCase() : 'NOT SET'
            })));
          }

          // Handle Sessions mapping
          let sessionsData = [];
          const anySessionsRes = sessionsRes as any;
          if (Array.isArray(anySessionsRes) && anySessionsRes[0]?.data) {
            sessionsData = anySessionsRes[0].data;
          } else if (anySessionsRes?.data) {
            sessionsData = anySessionsRes.data;
          } else if (Array.isArray(anySessionsRes)) {
            sessionsData = anySessionsRes;
          }

          const loadedExercises: Exercise[] = [];
          for (const session of sessionsData) {
            for (const ex of session.exercises || []) {
              loadedExercises.push({
                id: ex.exercise_id,
                name: ex.exercise_name,
                timeInfo: `Past Session • ${session.muscle_group}`,
                date: session.session_date ? session.session_date.split('T')[0] : '',
                sets: ex.sets?.length || 0,
                reps: (ex.sets || []).map((s: any) => s.reps).join(', '),
                weight: (ex.sets?.[0]?.weight || 0) + ' kg',
                imageAlt: ex.exercise_name,
                imageSrc: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200&h=200&fit=crop',
                icon: <Dumbbell className="hidden md:block w-7 h-7" />,
                setIds: (ex.sets || []).map((s: any) => s.set_id)
              });
            }
          }
          setCompletedExercises(loadedExercises);
        } catch (err) {
          console.error("Failed to load historical sessions:", err);
        }
      }
    };

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      fetchUserData(user);
    };
    getUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchUserData(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const commonProps = {
    navigateTo: setCurrentPage,
    notificationsEnabled,
    toggleNotifications,
    setNotificationsEnabled,
    incompleteExercises,
    setIncompleteExercises,
    completedExercises,
    setCompletedExercises,
    userName,
    setUserName,
    userId,
    personalRecords,
    setPersonalRecords
  };

  return (
    <>
      {currentPage === 'login' && <Login navigateTo={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard {...commonProps} />}
      {currentPage === 'workouts' && <Workouts {...commonProps} />}
      {currentPage === 'analysis' && <ProgressAnalysis {...commonProps} />}
      {currentPage === 'records' && <PersonalRecords {...commonProps} />}
      {currentPage === 'schedule' && <Schedule {...commonProps} />}
      {currentPage === 'settings' && <Settings {...commonProps} />}
      {currentPage === 'aichat' && <AIChat {...commonProps} />}
    </>
  )
}

export default App
