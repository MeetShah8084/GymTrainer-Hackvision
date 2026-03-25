import React, { useState, useRef, useEffect } from 'react';
import companyIcon from '../assets/company_icon.png';
import chatIcon from '../assets/chat_icon (Edited).png';
import { sendTrainerAIMessage } from '../lib/n8nApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  LayoutDashboard, Settings, Dumbbell, LineChart, Trophy, CalendarDays,
  Menu, X, MessageSquare, Plus, Mic, Send
} from 'lucide-react';

interface AIChatProps {
  userName?: string;
  userId?: string;
  navigateTo: (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => void;
}

const AIChat: React.FC<AIChatProps> = ({ userName = "Loading...", userId = '', navigateTo }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<{ sender: 'user' | 'ai', text: string }[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sessionIdRef = useRef(`session-${Date.now()}`);

  useEffect(() => {
    if (textareaRef.current) {
      const isMobile = window.innerWidth < 768;
      const baseHeight = isMobile ? 60 : 72;
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.max(baseHeight, textareaRef.current.scrollHeight) + 'px';
    }
  }, [inputValue]);

  const handleNavigation = (page: 'login' | 'dashboard' | 'workouts' | 'analysis' | 'records' | 'schedule' | 'settings' | 'aichat') => {
    setIsSidebarOpen(false);
    navigateTo(page);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue("");
    setHasStarted(true);
    setIsTyping(true);

    try {
      const response = await sendTrainerAIMessage(userMsg, sessionIdRef.current, userId);
      const aiText = typeof response === 'string' ? response : (response?.output || response?.text || response?.message || JSON.stringify(response));
      setMessages(prev => [...prev, { sender: 'ai', text: aiText }]);
    } catch (err) {
      console.error('AI Chat error:', err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen bg-background-light dark:bg-background-dark font-display overflow-hidden">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-slate-200 dark:border-primary/10 bg-background-light dark:bg-background-dark transform transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
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
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('records')}>
            <span>Personal Records</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('schedule')}>
            <span>Schedule</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-primary/10 hover:text-primary transition-all cursor-pointer" onClick={() => handleNavigation('settings')}>
            <span>Settings</span>
          </a>
          <a className="flex items-center px-4 py-3 rounded-xl bg-primary text-white font-semibold cursor-pointer" onClick={() => handleNavigation('aichat')}>
            <span>AI Chat</span>
          </a>
        </nav>
      </aside>

      {/* Main Content Area Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background-light dark:bg-background-dark relative">

        {/* Desktop Header */}
        <header className="hidden md:flex shrink-0 items-center justify-between bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-md px-8 py-4 border-b border-slate-200 dark:border-primary/10 z-10 transition-colors duration-300">
          <div className="flex items-center gap-4">
            <button className="p-2.5 rounded-xl bg-slate-200 dark:bg-surface-dark text-slate-600 dark:text-slate-300 hover:bg-primary/20 hover:text-primary transition-all cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">Progressive Trainer</h1>
              <p className="text-sm font-medium text-slate-500 dark:text-primary/70">AI Engine Active</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-3">
              <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-surface-dark text-slate-100 hover:bg-primary/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button onClick={() => handleNavigation('settings')} className="ml-2 h-10 w-10 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold border-2 border-primary/30 uppercase cursor-pointer hover:bg-primary/20 transition-colors shadow-[0_0_15px_rgba(236,91,19,0.3)]">
                {userName.charAt(0)}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="md:hidden flex shrink-0 items-center justify-between px-4 py-4 border-b border-primary/10 bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
          <button className="flex items-center justify-center size-10 rounded-full hover:bg-white/5 transition-colors cursor-pointer" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-slate-400" />
          </button>
          <div className="flex flex-col items-center">
            <h2 className="text-white text-base font-bold leading-tight tracking-tight">Progressive AI</h2>
            <div className="flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">Online Coach</span>
            </div>
          </div>
          <div className="flex items-center justify-end size-10">
            <button onClick={() => handleNavigation('settings')} className="size-8 rounded-full flex items-center justify-center bg-primary/10 text-primary font-bold border border-primary/30 uppercase p-0.5 overflow-hidden text-xs shadow-[0_0_10px_rgba(236,91,19,0.3)] cursor-pointer">
              {userName.charAt(0)}
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto w-full custom-gradient px-4 py-6 md:px-8 space-y-6 md:space-y-8 no-scrollbar pb-36 md:pb-48 bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 flex flex-col">
          <div className="mx-auto w-full max-w-[960px] flex flex-col gap-6 md:gap-8 flex-1">

            {/* Messages Loop */}
            <div className={`transition-opacity duration-700 w-full flex flex-col gap-6 md:gap-8 ${hasStarted ? 'opacity-100' : 'opacity-0'}`}>
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-3 w-full md:max-w-none max-w-[85%] ${msg.sender === 'user' ? 'justify-end ml-auto' : 'items-start justify-start'}`}>
                  <div className={`flex flex-1 flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end text-right' : 'items-start'}`}>
                    {msg.sender === 'user' && (
                      <p className="text-[11px] md:text-[13px] font-semibold uppercase tracking-wider text-slate-400 mr-1 md:mr-0">Me</p>
                    )}
                    <div className={`flex ${msg.sender === 'ai' ? 'items-start gap-3' : ''}`}>
                      {msg.sender === 'ai' && (
                        <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/20 border border-primary/30 p-0.5">
                          <img src={chatIcon} alt="AI" className="w-full h-full object-contain filter invert brightness-0" />
                        </div>
                      )}
                      <div className={`px-4 py-3 md:px-5 md:py-4 shadow-sm border ${msg.sender === 'user'
                        ? 'rounded-2xl rounded-br-none bg-primary text-white border-primary shadow-lg shadow-primary/20'
                        : 'rounded-2xl rounded-tl-none md:bg-surface-dark border-slate-700/50 md:border-accent-muted/30 bg-slate-800/50 md:bg-surface-dark text-slate-200'
                        }`}>
                        {msg.sender === 'ai' ? (
                          <div className="prose prose-invert prose-sm md:prose-base max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }: any) => <p className="text-sm md:text-base leading-relaxed mb-4 last:mb-0">{children}</p>,
                                strong: ({ children }: any) => <strong className="text-primary font-bold">{children}</strong>,
                                em: ({ children }: any) => <em className="text-slate-300 italic">{children}</em>,
                                ul: ({ children }: any) => <ul className="list-disc list-inside space-y-2 mb-4 last:mb-0 text-sm md:text-base marker:text-primary">{children}</ul>,
                                ol: ({ children }: any) => <ol className="list-decimal list-inside space-y-2 mb-4 last:mb-0 text-sm md:text-base marker:text-primary">{children}</ol>,
                                li: ({ children }: any) => <li className="text-slate-200 leading-relaxed">{children}</li>,
                                h1: ({ children }: any) => <h1 className="text-xl font-black text-primary mb-4 mt-6 first:mt-0">{children}</h1>,
                                h2: ({ children }: any) => <h2 className="text-lg font-bold text-primary mb-3 mt-5 first:mt-0">{children}</h2>,
                                h3: ({ children }: any) => <h3 className="text-base font-bold text-primary mb-2 mt-4 first:mt-0">{children}</h3>,
                                code: ({ children, className }: any) => {
                                  const isInline = !className;
                                  return isInline
                                    ? <code className="bg-black/40 text-primary px-1.5 py-0.5 rounded text-xs font-mono border border-primary/10">{children}</code>
                                    : <code className="block bg-black/40 p-4 rounded-xl text-xs font-mono overflow-x-auto mb-4 border border-primary/10 shadow-inner">{children}</code>;
                                },
                                table: ({ children }: any) => (
                                  <div className="overflow-x-auto mb-6 rounded-xl border border-primary/20 shadow-lg shadow-black/20">
                                    <table className="w-full text-left border-collapse min-w-[400px]">
                                      {children}
                                    </table>
                                  </div>
                                ),
                                thead: ({ children }: any) => <thead className="bg-[#1e1511] border-b border-primary/20">{children}</thead>,
                                th: ({ children }: any) => <th className="px-4 py-3 text-xs font-black uppercase tracking-wider text-primary">{children}</th>,
                                td: ({ children }: any) => <td className="px-4 py-3 text-sm text-slate-300 border-b border-white/5">{children}</td>,
                                tr: ({ children }: any) => <tr className="hover:bg-white/5 transition-colors">{children}</tr>,
                                a: ({ children, href }: any) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium hover:text-primary/80 transition-colors">{children}</a>,
                                blockquote: ({ children }: any) => <blockquote className="border-l-4 border-primary/30 pl-4 py-1 italic text-slate-400 mb-4 bg-primary/5 rounded-r-lg">{children}</blockquote>,
                              }}
                            >
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm md:text-base leading-relaxed">
                            {msg.text}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="hidden md:flex h-10 w-10 shrink-0 rounded-full items-center justify-center bg-primary/10 text-primary font-bold border border-primary/30 uppercase shadow-[0_0_10px_rgba(236,91,19,0.2)]">
                      {userName.charAt(0)}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-start justify-start w-full">
                <div className="flex flex-col gap-1.5 items-start">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full bg-primary shadow-md shadow-primary/20 border border-primary/30 p-0.5">
                      <img src={chatIcon} alt="AI" className="w-full h-full object-contain filter invert brightness-0" />
                    </div>
                    <div className="px-4 py-3 md:px-5 md:py-4 shadow-sm border rounded-2xl rounded-tl-none bg-slate-800/50 md:bg-surface-dark border-slate-700/50 text-slate-200">
                      <div className="flex gap-1.5 items-center h-5">
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Animated Input Footer */}
        <footer
          className={`fixed left-0 right-0 z-30 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${!hasStarted
            ? 'bottom-[50vh] translate-y-1/2 px-4 md:px-8 bg-transparent border-t-0'
            : 'bottom-[72px] md:bottom-0 translate-y-0 pt-4 pb-4 md:pt-6 md:pb-10 px-4 md:px-8 bg-background-dark/95 backdrop-blur-xl border-t border-primary/10'
            }`}
        >
          <div className="mx-auto flex flex-col w-full max-w-[960px]">
            {/* Expanded Greeting */}
            <div
              className={`flex flex-col items-center justify-center transition-all duration-700 ease-in-out origin-bottom ${!hasStarted ? 'opacity-100 max-h-24 mb-6 translate-y-0' : 'opacity-0 max-h-0 mb-0 -translate-y-4 overflow-hidden'
                }`}
            >
              <h2 className="text-3xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                Hi, {userName}
              </h2>
            </div>

            {/* Input Row */}
            <div className="flex w-full items-end gap-3 md:gap-4">
              <button
                className="shrink-0 flex items-center justify-center rounded-[16px] md:rounded-[20px] text-slate-400 hover:text-primary transition-all duration-500 h-[60px] w-[60px] md:h-[72px] md:w-[72px] border border-primary/20 bg-[#1e1511] shadow-lg shadow-black/20"
              >
                <Plus className="w-6 h-6 md:w-7 md:h-7" />
              </button>

              <div className="relative flex-1 flex flex-col justify-end">
                <textarea
                  ref={textareaRef}
                  className="w-full outline-none resize-none overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] rounded-[24px] md:rounded-[36px] border border-primary/20 bg-[#1e1511] pt-[19px] pb-[19px] md:pt-[23px] md:pb-[23px] pl-5 md:pl-6 pr-12 md:pr-16 text-slate-100 text-sm md:text-base placeholder:text-slate-400 focus:border-primary/50 shadow-lg shadow-black/20 min-h-[60px] md:min-h-[72px]"
                  placeholder="Ask coach..."
                  rows={1}
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    const isMobile = window.innerWidth < 768;
                    const baseHeight = isMobile ? 60 : 72;
                    e.target.style.height = 'auto'; // Reset to auto to calculate scrollHeight properly
                    e.target.style.height = Math.max(baseHeight, e.target.scrollHeight) + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <button className="absolute right-4 md:right-5 bottom-[20px] md:bottom-[24px] text-slate-500 hover:text-primary transition-all duration-500">
                  <Mic className="hidden md:block w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              <button
                className="shrink-0 flex items-center justify-center rounded-[16px] md:rounded-[20px] bg-[#ec5b13] text-white hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg shadow-primary/30 h-[60px] w-[60px] md:h-[72px] md:w-[72px]"
                onClick={handleSendMessage}
              >
                <Send className="text-white ml-0.5 w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </footer>

      </div>

      {/* Bottom Navigation Bar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 dark:border-primary/10 bg-white dark:bg-background-dark/95 backdrop-blur-md px-2 pb-6 pt-2">
        <div className="flex items-center justify-between">
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => handleNavigation('dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Dash</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => handleNavigation('workouts')}>
            <Dumbbell className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Train</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => handleNavigation('schedule')}>
            <CalendarDays className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Sched</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => handleNavigation('analysis')}>
            <LineChart className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Stats</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-slate-400 dark:text-slate-500 cursor-pointer" onClick={() => handleNavigation('records')}>
            <Trophy className="w-5 h-5" />
            <span className="text-[9px] font-medium uppercase tracking-widest">Records</span>
          </a>
          <a className="flex flex-1 flex-col items-center gap-1 text-primary cursor-pointer" onClick={() => handleNavigation('aichat')}>
            <MessageSquare className="w-5 h-5 stroke-[3px]" />
            <span className="text-[9px] font-bold uppercase tracking-widest">AI Chat</span>
          </a>
        </div>
      </nav>

    </div>
  );
};

export default AIChat;
