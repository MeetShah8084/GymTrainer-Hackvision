import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Schedule from './components/Schedule'
import Settings from './components/Settings'
import Login from './components/Login'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings'>('login')
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const toggleNotifications = () => setNotificationsEnabled(prev => !prev);

  const commonProps = {
    navigateTo: setCurrentPage,
    notificationsEnabled,
    toggleNotifications,
    setNotificationsEnabled,
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
