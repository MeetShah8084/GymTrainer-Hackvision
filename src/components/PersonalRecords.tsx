import React from 'react';
import companyIcon from '../assets/company_icon.png';
import { 
  Dumbbell, 
  LayoutDashboard, 
  Activity, 
  LineChart, 
  Trophy,
  ChevronRight,
  TrendingUp,
  Bell,
  BellOff,
  Settings,
  Menu,
  X,
  ArrowLeft,
  Share2,
  CalendarDays,
  MessageSquare
} from 'lucide-react';

interface PersonalRecordsProps {
  userName?: string;
  setUserName?: (name: string) => void;
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => void;
  notificationsEnabled?: boolean;
  toggleNotifications?: () => void;
}

const PersonalRecords: React.FC<PersonalRecordsProps> = ({
  userName = "Loading...",
   navigateTo, notificationsEnabled = true, toggleNotifications }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('dashboard')}>
            <span>Dashboard</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('workouts')}>
            <span>Workouts</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('analysis')}>
            <span>Statistics</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('records')}>
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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">
        
        {/* Desktop Header */}
        <header className="hidden md:flex shrink-0 z-20 items-center justify-between px-8 py-4 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-primary/10">
          <div className="flex items-center gap-4">
            <button className="p-2 -ml-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Personal Records</h1>
              <p className="text-sm text-slate-500 dark:text-primary/70 font-medium">Your all-time best lifts and achievements</p>
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
              <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all" onClick={() => { setIsSidebarOpen(false); navigateTo('settings'); }}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
            <div className="shrink-0 size-10 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden sticky top-0 z-20 shrink-0 flex items-center bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md p-4 justify-between border-b border-slate-200 dark:border-primary/10">
          <div className="flex items-center gap-3">
            <button className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary cursor-pointer" onClick={() => navigateTo('dashboard')}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold leading-tight tracking-tight">Elite Records</h1>
              <p className="text-xs text-slate-500 dark:text-primary/60 font-medium uppercase tracking-wider">Personal Best</p>
            </div>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full bg-slate-100 dark:bg-primary/10 text-slate-900 dark:text-primary">
            <Share2 className="w-5 h-5" />
          </button>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto w-full custom-gradient relative md:pb-8">
          
          {/* === DESKTOP LAYOUT === */}
          <div className="hidden md:flex flex-col max-w-[1200px] mx-auto w-full px-4 lg:px-10 py-8 pt-4">
            
            {/* Hero Section */}
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Elite League</span>
              </div>
              <h1 className="text-slate-100 text-5xl font-black leading-tight tracking-tighter">PERSONAL RECORDS</h1>
              <p className="text-slate-400 text-lg max-w-lg">Pushing the boundaries of human potential. Your journey to the elite tier starts with tracking every pound.</p>
            </div>
            <div className="flex gap-3 bg-surface-dark p-1 rounded-xl border border-primary/10">
              <button className="px-6 py-2 rounded-lg bg-primary text-white font-bold text-sm shadow-lg shadow-primary/20">Global</button>
              <button className="px-6 py-2 rounded-lg text-slate-400 font-bold text-sm hover:text-slate-100 transition-colors">Friends</button>
              <button className="px-6 py-2 rounded-lg text-slate-400 font-bold text-sm hover:text-slate-100 transition-colors">Personal</button>
            </div>
          </div>

          {/* Featured Record Card */}
          <div className="mb-12 group cursor-pointer">
            <div className="relative overflow-hidden rounded-2xl bg-surface-dark border border-primary/10 pr-gradient p-8 flex flex-col md:flex-row items-center gap-8 transition-all hover:border-primary/40">
              <div className="relative w-full md:w-1/3 aspect-square lg:aspect-video rounded-xl overflow-hidden shadow-2xl">
                <img className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Intense athlete preparing for a heavy deadlift" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC66F0apJ3zcdCj_yXakrzUDAJ78dFx8cbGmvk1Q7l6GQfsJeAslx003etTerV5jqJXA8ppq441PXpBdiafnxR4sdO2230hIlqQRyTI1tnB_D-KMGf3PO6RsQ5s9UWaxQO7nMPLkPXnF4FWymIA-snPuAbF_01DiKMRMliJy7e2-ySl6jkCQnEaEYnn96mi9jXmh4I8ijcGZW2XBWzqBmk7YJkmgYbryZM7pI_VmcnnUWhikStHfOCAKQC0A6morWCK8CtbN7ji6pbO"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background-dark/80 to-transparent"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-primary text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-tighter">Live Session</span>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Trophy className="w-4 h-4" />
                  <p className="text-sm font-bold tracking-widest uppercase">Current Peak Achievement</p>
                </div>
                <h3 className="text-slate-100 text-4xl font-black mb-4 group-hover:text-primary transition-colors">Deadlift: 585 lbs</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">World Rank</p>
                    <p className="text-slate-100 text-xl font-bold">#1 Global</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Weight Class</p>
                    <p className="text-slate-100 text-xl font-bold">198 lbs</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Lift Type</p>
                    <p className="text-slate-100 text-xl font-bold">Sumo</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button className="bg-primary hover:bg-primary/80 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    View Performance
                  </button>
                  <button className="border border-primary/20 hover:border-primary text-slate-300 font-bold py-3 px-6 rounded-xl transition-all">
                    Compare PRs
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
            {/* PR Card 1 */}
            <div className="bg-surface-dark border border-primary/10 p-6 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase">Personal Best</span>
                  <h4 className="text-2xl font-black text-slate-100">405 lbs</h4>
                </div>
              </div>
              <h5 className="text-xl font-bold text-slate-100 mb-1">Back Squat</h5>
              <p className="text-slate-500 text-sm mb-6">Advanced • 3 Rep Max</p>
              <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                <div className="flex -space-x-3">
                  <div className="size-8 rounded-full border-2 border-surface-dark bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDOSKhKQAIeIVESoTI4dfmMk6oZEuLB5egPlFn6P9MSfiEZD2lZrG9VZXMGRUF9KS8yBkpQCKbxdUbWEPK14FOp8DgY3rIn1wyzGj_r_VVls7_BBY7Ql7yCcbrD2-pqZk2fw9Icyy3RNOc-9l1AVy93SUHINmC-t194CTQZ3yMlTNkjge3xDaattMytZqXmUpExweUg5HxZNv1mTUM6UWt-v7VYA_sOeCHKH3upp4TiG_udYBaFWD8OmuJDdhAozqi82RaiXUrMJymb")'}}></div>
                  <div className="size-8 rounded-full border-2 border-surface-dark bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBDB6pp9BhjM97TF0QVP5vTZfxL4g_WG2aOT9YWphRLxuThcKqnolOXCBIQN_vgrh9_SCPyb_84pe6_5RgfGlxtBH_rKwBoo93f3siHEbd1JUj74d9qHzgQtX1yhGDuzsGQDNLiNENMcZfcBWsh7q4GvFUgnq4ydGXt28MU7C2qwPpNorc_KOUWAmWhGBKk757ZEV8vS8NpuFY0IRiYxyxPvROuTO1_NMv3kHM94kKGTMwtIwJcVVfAoCpHRk8cQYt7YPC8h7tsP7kM")'}}></div>
                  <div className="size-8 rounded-full border-2 border-surface-dark bg-primary flex items-center justify-center text-[10px] font-bold">+12</div>
                </div>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* PR Card 2 */}
            <div className="bg-surface-dark border border-primary/10 p-6 rounded-2xl hover:bg-primary/5 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Activity className="w-6 h-6" />
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-500 uppercase">Personal Best</span>
                  <h4 className="text-2xl font-black text-slate-100">315 lbs</h4>
                </div>
              </div>
              <h5 className="text-xl font-bold text-slate-100 mb-1">Bench Press</h5>
              <p className="text-slate-500 text-sm mb-6">Elite • 1 Rep Max</p>
              <div className="flex items-center justify-between border-t border-primary/10 pt-4">
                <div className="flex -space-x-3">
                  <div className="size-8 rounded-full border-2 border-surface-dark bg-cover bg-center" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDChryIjveTmg5msbtD1eJKzGZzp0v3ofiV6lTVAE1cTB8Iep9e632jbIiVS1eeWzrURM8ENAaFtpibx6JJzuZRmt-hjk25920sLzI0hvQkSIpEQNtljSzQu_Px5yBlql2LWLc6NsPPGI7P-Y9HfWLOsXtGzMh1-2m5UxNW8hX4WOgDecbguv6yefDH7HGa3RUwymWClW_1ljl8YqYxuytRzPTdAQJjYqPsmpxrup_j-9oqiqaeCdorjOOtkn7f0GXq5PGMZqYUTjET")'}}></div>
                  <div className="size-8 rounded-full border-2 border-surface-dark bg-primary flex items-center justify-center text-[10px] font-bold">+45</div>
                </div>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Details <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>

            {/* PR Card 3 */}
            <div className="bg-surface-dark border p-6 rounded-2xl hover:bg-primary/5 transition-all border-dashed border-primary/40 group relative">
              <div className="flex flex-col items-center justify-center h-full text-center py-4">
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-4xl text-primary font-light">+</span>
                </div>
                <h5 className="text-xl font-bold text-slate-100 mb-1">Log New Record</h5>
                <p className="text-slate-500 text-sm">Challenge your limits today</p>
              </div>
            </div>
          </div>

          {/* Detailed Table Leaderboard */}
          <div className="bg-surface-dark border border-primary/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-8 py-6 border-b border-primary/10 flex justify-between items-center">
              <h3 className="text-slate-100 text-xl font-bold">Global Bench Leaderboard</h3>
              <div className="flex gap-2">
                <select className="bg-background-dark border-primary/10 text-slate-300 text-sm rounded-lg px-3 py-1 outline-none">
                  <option>Weight Class: All</option>
                  <option>148 lbs</option>
                  <option>181 lbs</option>
                  <option>198 lbs</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-primary/10 bg-background-dark/30">
                    <th className="px-8 py-4">Rank</th>
                    <th className="px-8 py-4">Athlete</th>
                    <th className="px-8 py-4 text-center">Weight Class</th>
                    <th className="px-8 py-4 text-center">Wilks Score</th>
                    <th className="px-8 py-4 text-right">Max Lift</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-primary/10">
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-black">01</span>
                        <Trophy className="w-4 h-4 text-amber-500" />
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-cover bg-center border border-primary" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAY_3AkydklS4VSeU9DU9w5Do9p_RVemrbr147Q2qwPFYkgk4JOFrHrp3NOSRNiV-KuoqETen1NdNCXiClI1QI0Jlefz0rLoMV2ATXWo5NxQpOjllUl6LkwwacD87xnWgKPU0R6viyk8D1ad4n3aVivYjuvX3LprlUeISHMw7LpLG9wHUY93tGr5ndZ_Ondqw-3H1Hud_l8_m1TFAm8AHHdWYpkAyqeGh9ZJxX_D1F8jyk-NpRO5PhXHTGIK4wD1KDPheIJIpmhvbiA")'}}></div>
                        <div>
                          <p className="text-slate-100 font-bold">Marcus Sterling</p>
                          <p className="text-slate-500 text-xs uppercase">Pro Athlete</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-slate-300">198 lbs</td>
                    <td className="px-8 py-5 text-center text-slate-300">482.5</td>
                    <td className="px-8 py-5 text-right font-black text-primary text-lg">585 lbs</td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5 text-slate-500 font-bold">02</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-cover bg-center border border-primary/10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCtZirfskCGTprjPtWO1CV8d-cxdLa_heN0kYudso0NxY0dbFeUxIUe1DW660I-C0pZhzCnOVO6vU7d_CUkZN8dp8qOkuNoy_4lhlAK9jlqbuTIzH8qqGSqzhLuc4yeJXbbjeNdl1C9ZJWCiXnNf4h8hv9k9VMh-V8pFFCHHJ8VjnZlxVG2Vl6tti2WmxFphah4cWxfFrVP6xBIuLrSqoWlWkHL3LXWhGYTfnQ0ePNDryUQAsW293hNVABUisk6K1K0BJbK6z1xDUgM")'}}></div>
                        <div>
                          <p className="text-slate-100 font-bold">David Chen</p>
                          <p className="text-slate-500 text-xs uppercase">Elite Tier</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-slate-300">181 lbs</td>
                    <td className="px-8 py-5 text-center text-slate-300">465.2</td>
                    <td className="px-8 py-5 text-right font-black text-slate-100 text-lg">545 lbs</td>
                  </tr>
                  <tr className="hover:bg-primary/5 transition-colors group">
                    <td className="px-8 py-5 text-slate-500 font-bold">03</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-cover bg-center border border-primary/10" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAW1-9Khqt18C0peIbEqM3OjkXEwPlo9Xe7G2eVMgfQRpZbEPAsv1AwvQ9rhkHTdYh7MJqSQGcn1XQW764nvms05Wu54k9_q8MkNDykTXyS3AeniQn_sDMQJnHr9XhlN3NvzalY2o3Ci1iZaX9IW7ISMx58q5WgylFfbi8CODQJh5m9rkCjet956daCF2V6Bye40UfIZ3fdADzjcA8rA2ECDJsE1u1mCPX8IspEkrAgC_XFFeB5LPuMjkL0W8B_AR-EahYOum7jHT8Q")'}}></div>
                        <div>
                          <p className="text-slate-100 font-bold">Sarah Jenkins</p>
                          <p className="text-slate-500 text-xs uppercase">National Qualifier</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center text-slate-300">148 lbs</td>
                    <td className="px-8 py-5 text-center text-slate-300">441.8</td>
                    <td className="px-8 py-5 text-right font-black text-slate-100 text-lg">425 lbs</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="px-8 py-4 bg-background-dark/50 border-t border-primary/10 text-center">
              <button className="text-primary font-bold text-sm uppercase tracking-widest hover:text-white transition-colors">Show All Rankings</button>
            </div>
          </div>
        </div>


        {/* === MOBILE LAYOUT === */}
        <div className="md:hidden flex flex-col w-full pb-20">
          
          {/* Profile Section */}
          <div className="flex p-4">
            <div className="flex w-full flex-col gap-4 items-center bg-surface-dark/40 border border-primary/10 p-6 rounded-xl">
              <div className="flex gap-4 flex-col items-center">
                <div className="relative">
                  <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-28 w-28 border-2 border-primary" style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuB90eWpG4VA3uOuxAYNGXMjXCxl6oSxWt0W4CITTcgRHzPnIkv3U4_KLPJl-AZGx_qXZY0gaRJ-29cUvFYhunRZNP4_7GVM0-sohV-jUyiDpekZwou7VrOPJzbMAMOawUITKdWqE1vJMmBsyGc00yWLEHD8hI1O3HptLc5BGJb8oarsLrcxJsX6CD1_7aqAC5-rhZpdt_yRog0lZvwFQO_ZcV0hKl4BSa9lSv9oPBrXe2Oe8HnnyN3_8vWmfm4NdTCeDyWOp00N7KoU")'}}></div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <p className="text-slate-900 dark:text-slate-100 text-2xl font-extrabold leading-tight tracking-tight">Marcus Thorne</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-primary text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-primary/10 rounded-full">Pro Division</span>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Since 2021</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-[480px]">
                <button className="flex items-center justify-center rounded-xl h-11 bg-primary text-white text-sm font-bold tracking-tight">
                  <span className="truncate">Update PRs</span>
                </button>
                <button className="flex items-center justify-center rounded-xl h-11 bg-primary/10 text-slate-100 text-sm font-bold tracking-tight border border-primary/20">
                  <span className="truncate">Share Profile</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-4">
            <div className="flex border-b border-primary/10 justify-between">
              <a className="flex flex-col items-center justify-center border-b-2 border-primary text-primary pb-3 pt-4 flex-1">
                <p className="text-sm font-bold uppercase tracking-wider">My Progress</p>
              </a>
              <a className="flex flex-col items-center justify-center border-b-2 border-transparent text-slate-500 pb-3 pt-4 flex-1">
                <p className="text-sm font-bold uppercase tracking-wider">Leaderboards</p>
              </a>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="flex flex-wrap gap-3 p-4">
            <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl p-5 bg-surface-dark border border-primary/5 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Wilks Score</p>
              <p className="text-slate-100 text-2xl font-extrabold tracking-tight">442.8</p>
              <div className="flex items-center gap-1 text-[#0bda87]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">+12.4</span>
              </div>
            </div>
            <div className="flex min-w-[140px] flex-1 flex-col gap-1 rounded-xl p-5 bg-surface-dark border border-primary/5 shadow-xl">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Lift</p>
              <p className="text-slate-100 text-2xl font-extrabold tracking-tight">1,645<span className="text-xs font-normal ml-1">lbs</span></p>
              <div className="flex items-center gap-1 text-[#0bda87]">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold">+55.0</span>
              </div>
            </div>
          </div>

          {/* PR List / Leaderboard Hybrid */}
          <div className="px-4 py-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-900 dark:text-slate-100 text-lg font-extrabold tracking-tight">The Big Three</h3>
              <span className="text-primary text-xs font-bold uppercase tracking-widest">Verified Marks</span>
            </div>
            <div className="flex flex-col gap-4">
              {/* Squat Card */}
              <div className="flex items-center gap-4 rounded-xl p-4 bg-primary/5 border border-primary/10">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-slate-100 text-sm font-bold uppercase tracking-wider">Squat</p>
                  <p className="text-slate-100 text-xl font-extrabold">585 lbs</p>
                  <p className="text-primary text-xs font-medium">Rank #12 Global</p>
                </div>
                <div className="flex flex-col items-end">
                  <Trophy className="w-5 h-5 text-primary" />
                  <p className="text-slate-400 text-[10px] mt-1">OCT 24, 2023</p>
                </div>
              </div>

              {/* Bench Card */}
              <div className="flex items-center gap-4 rounded-xl p-4 bg-primary/5 border border-primary/10">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-slate-100 text-sm font-bold uppercase tracking-wider">Bench Press</p>
                  <p className="text-slate-100 text-xl font-extrabold">405 lbs</p>
                  <p className="text-primary text-xs font-medium">Rank #42 Global</p>
                </div>
                <div className="flex flex-col items-end">
                  <Trophy className="w-5 h-5 text-primary" />
                  <p className="text-slate-400 text-[10px] mt-1">NOV 12, 2023</p>
                </div>
              </div>

              {/* Deadlift Card */}
              <div className="flex items-center gap-4 rounded-xl p-4 bg-primary/5 border border-primary/10">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-slate-100 text-sm font-bold uppercase tracking-wider">Deadlift</p>
                  <p className="text-slate-100 text-xl font-extrabold">655 lbs</p>
                  <p className="text-primary text-xs font-medium">Rank #8 Global</p>
                </div>
                <div className="flex flex-col items-end">
                  <Trophy className="w-5 h-5 text-primary" />
                  <p className="text-slate-400 text-[10px] mt-1">JAN 05, 2024</p>
                </div>
              </div>
            </div>
          </div>



        </div>

      </main>
      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => navigateTo('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Dash</span>
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
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => navigateTo('records')}>
            <Trophy className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Records</span>
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

export default PersonalRecords;
