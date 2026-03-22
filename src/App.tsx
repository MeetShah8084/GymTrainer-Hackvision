import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Schedule from './components/Schedule'
import Settings from './components/Settings'
import Login from './components/Login'
import './index.css'

import { initialCompletedExercises, initialIncompleteExercises } from './data/exercises'
import type { Exercise } from './data/exercises'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings'>('login')
  const [userName, setUserName] = useState<string>("Loading...");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Lifted state for exercises
  const [incompleteExercises, setIncompleteExercises] = useState<Exercise[]>(initialIncompleteExercises);
  const [completedExercises, setCompletedExercises] = useState<Exercise[]>(initialCompletedExercises);

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
    setUserName
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
    </>
  )
}

export default App
