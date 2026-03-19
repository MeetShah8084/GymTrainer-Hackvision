import React from 'react';
import companyIcon from '../assets/company_icon.png';
import { 
  Dumbbell, 
  LayoutDashboard, 
  LineChart, 
  User, 
  Bell, 
  Settings, 
  Flame, 
  RotateCcw, 
  CheckCircle, 
  TrendingUp, 
  BarChart,
  Trophy,
  Menu,
  X
} from 'lucide-react';

interface DashboardProps {
  navigateTo: (page: 'dashboard' | 'workouts' | 'analysis' | 'records') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
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
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('workouts')}>
            <span>Workouts</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('analysis')}>
            <span>Statistics</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => navigateTo('records')}>
            <span>Personal Records</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => {}}>
            <span>Schedule</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => {}}>
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
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Good Morning, John</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ready for your push day today?</p>
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
        <div className="md:hidden flex shrink-0 z-20 items-center p-4 justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-primary/10">
          <div className="flex size-10 shrink-0 items-center overflow-hidden rounded-full border-2 border-primary">
            <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVrzpsn6_U1odECZkvw4RS520J75eoPMqvh9YQ0JbkGmUJcjso9-P6XoCX8c3Z09xexCRYGXmwGJ8JqZQJtZmNcdG-3j74bfXinTwW9OMizO4NAgHyVwigVwOfsCzlSBl3SNSa50DM9Of5-J8XpJ8rORai6IkrZUllEe9kkDIeaJ8R3R_KcVLZFHoGZzFibHIDxx4x1eMSTtOm_kHt_tHtVb7NESWjUNT1XuA5Fhn9-zzkUw3ZbKTG1M5JI0TAG6kreGxSlJcSlpHt" />
          </div>
          <div className="flex flex-col ml-3 flex-1">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Welcome back</span>
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">John Doe</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-primary transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="flex size-10 cursor-pointer items-center justify-center rounded-xl bg-slate-200 dark:bg-primary/10 text-slate-900 dark:text-primary transition-colors">
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
                  <h3 className="text-4xl font-bold mt-1">94%</h3>
                </div>
                <div className="bg-white/20 backdrop-blur-md rounded-lg p-2">
                  <TrendingUp className="w-6 h-6 stroke-[3px]" />
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <div className="flex-1 border-r border-white/20">
                  <p className="text-white/70 text-xs">Current Streak</p>
                  <p className="text-xl font-bold">12 Days</p>
                </div>
                <div className="flex-1">
                  <p className="text-white/70 text-xs">Total Workouts</p>
                  <p className="text-xl font-bold">148</p>
                </div>
              </div>
            </div>
            {/* Abstract Design Elements */}
            <div className="absolute -right-8 -top-8 size-32 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 size-32 rounded-full bg-black/10 blur-2xl"></div>
          </div>

          {/* Desktop Stats Overview */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Consistency</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">+2.4%</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">94%</p>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-4">
                <div className="bg-primary h-full rounded-full" style={{ width: '94%' }}></div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Workouts</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">+12</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">128</p>
              <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Total Sessions</p>
            </div>
            
            <div className="bg-white dark:bg-surface-dark p-6 rounded-xl border border-primary/5 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Volume</p>
                <span className="bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded">+5.2%</span>
              </div>
              <p className="text-3xl font-black text-slate-900 dark:text-white">450k <span className="text-lg font-medium text-slate-400">kg</span></p>
              <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest">Monthly Lifted</p>
            </div>
            
            <div className="bg-primary p-6 rounded-xl shadow-lg shadow-primary/20 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-white/80 text-sm font-medium">Daily Streak</p>
                <p className="text-3xl font-black">15 Days</p>
                <button className="mt-4 px-4 py-2 bg-white text-primary rounded-lg text-sm font-bold shadow-md hover:bg-slate-50 transition-colors">
                  View History
                </button>
              </div>
              <Flame className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          {/* Quick Actions (Mobile) */}
          <div className="md:hidden grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-primary py-3 px-4 font-bold text-white shadow-md transition-transform active:scale-95">
              <CheckCircle className="w-[18px] h-[18px]" />
              <span>Complete</span>
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl bg-slate-200 dark:bg-primary/20 py-3 px-4 font-bold text-slate-900 dark:text-primary transition-transform active:scale-95">
              <RotateCcw className="w-[18px] h-[18px]" />
              <span>Relog</span>
            </button>
          </div>

          {/* Action Section (Desktop) */}
          <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-surface-dark p-6 rounded-xl border-l-4 border-primary shadow-sm">
            <div>
              <h3 className="text-xl font-bold dark:text-white">Current Session: Push B (Heavy)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Started 45 minutes ago • 4/6 Exercises completed</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all">
                <RotateCcw className="w-5 h-5" />
                Relog
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20 hover:brightness-110 transition-all">
                <CheckCircle className="w-5 h-5" />
                Workout Complete
              </button>
            </div>
          </div>

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
                <div key={group.name} className="group cursor-pointer relative aspect-[4/5] md:h-64 md:aspect-auto w-full rounded-2xl overflow-hidden bg-slate-200 dark:bg-slate-800 shadow-sm transition-all hover:shadow-md">
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
          </div>

          {/* Recent Activity (Desktop only layout) */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8 pb-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-black dark:text-white">Recent PRs</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <TrendingUp className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Deadlift</p>
                      <p className="text-sm text-slate-500">New 1RM: 180kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">+15kg</p>
                    <p className="text-xs text-slate-400">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl border border-primary/5">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                      <TrendingUp className="w-6 h-6 stroke-[3px]" />
                    </div>
                    <div>
                      <p className="font-bold dark:text-white">Bench Press</p>
                      <p className="text-sm text-slate-500">New 5RM: 100kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">+5kg</p>
                    <p className="text-xs text-slate-400">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-black dark:text-white">Nutrition</h2>
              <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl border border-primary/5 shadow-sm space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">2,450</p>
                    <p className="text-sm text-slate-500 uppercase tracking-widest font-bold">Calories In</p>
                  </div>
                  <div className="size-16 border-4 border-primary border-t-transparent rounded-full flex items-center justify-center">
                    <p className="text-xs font-bold text-primary">85%</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-slate-500">Protein</span>
                    <span className="dark:text-white">180g / 200g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                    <div className="bg-primary h-full rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider pt-2">
                    <span className="text-slate-500">Carbs</span>
                    <span className="dark:text-white">210g / 300g</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full">
                    <div className="bg-orange-300 h-full rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Weekly Summary */}
          <div className="md:hidden mt-4">
            <div className="rounded-xl border border-slate-200 dark:border-primary/10 bg-white dark:bg-primary/5 p-4">
              <div className="flex items-center gap-3">
                <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <BarChart className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-slate-100 font-bold">Weekly Performance</p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">You are 8% ahead of last week</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Footer Attribution */}
            <div className="mt-8 mb-4 text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                <a href="https://www.flaticon.com/free-icons/trainer" title="trainer icons" className="hover:text-primary transition-colors underline">Trainer icons created by Freepik - Flaticon</a>
              </span>
            </div>
          </div>

          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-4 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-6 h-6 stroke-[3px]" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('workouts')}>
            <Dumbbell className="w-6 h-6" />
            <span className="text-[10px] font-medium uppercase tracking-widest">Workouts</span>
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

export default Dashboard;
