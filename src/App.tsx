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

const initialPRs: PRRecord[] = [
  { id: 'pr-1', exerciseName: 'Bench Press', weight: 110, improvement: 5, date: 'MAR 10, 2026' },
  { id: 'pr-2', exerciseName: 'Squat', weight: 145, improvement: 5, date: 'FEB 28, 2026' },
  { id: 'pr-3', exerciseName: 'Deadlift', weight: 170, improvement: 5, date: 'MAR 05, 2026' },
  { id: 'pr-4', exerciseName: 'Overhead Press', weight: 70, improvement: 5, date: 'FEB 15, 2026' },
  { id: 'pr-5', exerciseName: 'Barbell Row', weight: 95, improvement: 5, date: 'MAR 01, 2026' },
];

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

