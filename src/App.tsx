import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Schedule from './components/Schedule'
import AIChat from './components/AIChat'
import Settings from './components/Settings'
import Login from './components/Login'
import './index.css'

import { initialCompletedExercises, initialIncompleteExercises } from './data/exercises'
import type { Exercise } from './data/exercises'

export interface PRRecord {
  id: string;
  exerciseName: string;
  weight: number; // in kg
  improvement: number; // in kg
  date: string; // e.g. "MAR 10, 2026"
}

const ALL_EXERCISES = [
  'Barbell Bench Press', 'Incline Dumbbell Press', 'Chest Flyes', 'Push-ups', 'Cable Crossovers', 'Decline Press',
  'Pull-ups', 'Barbell Row', 'Lat Pulldown', 'Deadlift', 'T-Bar Row', 'Seated Cable Row',
  'Squats', 'Leg Press', 'Lunges', 'Romanian Deadlift', 'Calf Raises', 'Leg Extensions',
  'Bicep Curls', 'Tricep Extensions', 'Hammer Curls', 'Skullcrushers', 'Preacher Curls', 'Tricep Dips',
  'Crunches', 'Planks', 'Cable Crunches', 'Leg Raises', 'Russian Twists', 'Ab Wheel Rollouts'
];

const initialPRs: PRRecord[] = ALL_EXERCISES.map((name, i) => ({
  id: `pr-default-${i}`,
  exerciseName: name,
  weight: 0,
  improvement: 0,
  date: 'NOT SET',
}));

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat'>('dashboard')
  const [userName, setUserName] = useState<string>("Loading...");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Lifted state for exercises
  const [incompleteExercises, setIncompleteExercises] = useState<Exercise[]>(initialIncompleteExercises);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>(initialCompletedExercises);

  // Lifted state for personal records
  const [personalRecords, setPersonalRecords] = useState<PRRecord[]>(initialPRs);

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

