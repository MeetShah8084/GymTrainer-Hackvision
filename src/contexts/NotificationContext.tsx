import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<{ message: string; id: number } | null>(null);
  const [progress, setProgress] = useState(100);

  const showNotification = useCallback((message: string) => {
    setNotification({ message, id: Date.now() });
    setProgress(100);
  }, []);

  const closeNotification = useCallback(() => {
    setNotification(null);
  }, []);

  useEffect(() => {
    if (!notification) return;

    const duration = 5000;
    const intervalTime = 50;
    const steps = duration / intervalTime;
    const decrement = 100 / steps;

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        if (prev <= decrement) {
          clearInterval(intervalId);
          closeNotification();
          return 0;
        }
        return prev - decrement;
      });
    }, intervalTime);

    // Timeout fallback just in case
    const timeoutId = setTimeout(() => {
      closeNotification();
    }, duration);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
    };
  }, [notification, closeNotification]);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] w-full max-w-sm px-4">
          <div className="bg-slate-900 border border-slate-800 shadow-xl rounded-xl overflow-hidden flex flex-col pointer-events-auto">
            <div className="flex items-start justify-between p-4 bg-slate-900">
              <p className="text-slate-200 text-sm font-medium mr-4 leading-relaxed">
                {notification.message}
              </p>
              <button
                onClick={closeNotification}
                className="text-slate-400 hover:text-white transition-colors shrink-0 p-1"
                aria-label="Close notification"
              >
                <X size={16} />
              </button>
            </div>
            {/* Progress bar */}
            <div className="h-1 bg-slate-800 w-full">
              <div 
                className="h-full bg-orange-500 transition-all duration-75 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}
