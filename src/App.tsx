import { useState } from 'react'
import Dashboard from './components/Dashboard'
import Workouts from './components/Workouts'
import ProgressAnalysis from './components/ProgressAnalysis'
import PersonalRecords from './components/PersonalRecords'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'workouts' | 'analysis' | 'records'>('dashboard')

  return (
    <>
      {currentPage === 'dashboard' && <Dashboard navigateTo={setCurrentPage} />}
      {currentPage === 'workouts' && <Workouts navigateTo={setCurrentPage} />}
      {currentPage === 'analysis' && <ProgressAnalysis navigateTo={setCurrentPage} />}
      {currentPage === 'records' && <PersonalRecords navigateTo={setCurrentPage} />}
    </>
  )
}

export default App
