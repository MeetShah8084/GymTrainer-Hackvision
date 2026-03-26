import { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Schedule from './components/Schedule'
import AIChat from './components/AIChat'
import Settings from './components/Settings'
import Login from './components/Login'
import UserDetails from './components/UserDetails'
import OAuthCompletion from './components/OAuthCompletion'
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
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [userId, setUserId] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
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

        // Fetch name from profiles table for accuracy
        const { data: profileData } = await supabase
          .from('profiles')
          .select('name, avatar_url')
          .eq('user_id', user.id)
          .single();

        const name = profileData?.name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
        setUserName(name);
        setAvatarUrl(profileData?.avatar_url || null);

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
      } else {
        // Handle log out/no user
        setUserId('');
        setUserName('User');
        setAvatarUrl(null);
        setCompletedExercises([]);
        setPersonalRecords([]);
        if (location.pathname !== '/login' && location.pathname !== '/signup' && location.pathname !== '/oauth') {
          navigate('/login');
        }
      }
    };

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUserId(session.user.id);
          await fetchUserData(session.user);
        } else {
          setUserId('');
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth Event:", event, session?.user?.id);
      if (session) {
        setUserId(session.user.id);
        fetchUserData(session.user);
      } else {
        fetchUserData(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const commonProps = {
    notificationsEnabled,
    toggleNotifications,
    setNotificationsEnabled,
    incompleteExercises,
    setIncompleteExercises,
    completedExercises,
    setCompletedExercises,
    userName,
    setUserName,
    avatarUrl,
    setAvatarUrl,
    userId,
    personalRecords,
    setPersonalRecords
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="size-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse">Loading Trainer...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Login initialMode="login" />} />
      <Route path="/signup" element={<Login initialMode="signup" />} />
      <Route path="/oauth" element={<OAuthCompletion />} />
      <Route path="/user-details" element={userId ? <UserDetails /> : <Navigate to="/login" replace />} />
      <Route path="/dashboard" element={userId ? <Dashboard {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/workouts" element={userId ? <Workouts {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/analysis" element={userId ? <ProgressAnalysis {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/records" element={userId ? <PersonalRecords {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/schedule" element={userId ? <Schedule {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/settings" element={userId ? <Settings {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/aichat" element={userId ? <AIChat {...commonProps} /> : <Navigate to="/login" replace />} />
      <Route path="/" element={<Navigate to={userId ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={userId ? "/dashboard" : "/login"} replace />} />
    </Routes>
  )
}

export default App
