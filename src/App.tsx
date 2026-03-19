import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import Login from './components/Login'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'dashboard' | 'workouts' | 'analysis' | 'records'>('login')

  return (
    <>
      {currentPage === 'login' && <Login navigateTo={setCurrentPage} />}
      {currentPage === 'dashboard' && <Dashboard navigateTo={setCurrentPage} />}
      {currentPage === 'workouts' && <Workouts navigateTo={setCurrentPage} />}
      {currentPage === 'analysis' && <ProgressAnalysis navigateTo={setCurrentPage} />}
      {currentPage === 'records' && <PersonalRecords navigateTo={setCurrentPage} />}
    </>
  )
}

export default App
