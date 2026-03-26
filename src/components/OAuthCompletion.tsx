import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { CheckCircle2, XCircle } from 'lucide-react';

export default function OAuthCompletion() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Verifying your session...');

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically parses the URL hash containing the access token
      // in 'supabase.auth.onAuthStateChange' or 'getSession' internally.
      // But we can manually check for a session.
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      if (data.session) {
        setStatus('success');
        setMessage('You are authenticated. Please close this tab.');
      } else {
        // If the hash is still processing or there's no session in the URL
        const hash = window.location.hash;
        if (hash && hash.includes('access_token')) {
          // It's still taking a moment for Supabase to persist the session
          // We let the supbase observer catch it if possible, so we just wait
          setTimeout(async () => {
            const { data: retryData } = await supabase.auth.getSession();
            if (retryData.session) {
              setStatus('success');
              setMessage('You are authenticated. Please close this tab.');
            } else {
              setStatus('error');
              setMessage("We couldn't verify your token. The link may have expired.");
            }
          }, 1500);
        } else {
          setStatus('error');
          setMessage("Invalid verification link or no session found.");
        }
      }
    };

    handleAuth();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#0C0C0C] text-[#F8F8F8] items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="flex flex-col items-center justify-center text-center p-8 bg-[#1A110B] border border-[#F97316]/20 rounded-2xl max-w-md w-full"
      >
        {status === 'processing' && (
          <div className="relative mb-6">
            <div className="w-16 h-16 rounded-full border-4 border-[#333] flex items-center justify-center relative">
              <motion.div
                className="absolute inset-[-4px] rounded-full border-4 border-transparent border-t-[#F97316]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-[#1A0E08] border border-[#F97316]/30 text-[#F97316] flex items-center justify-center mb-6"
          >
            <CheckCircle2 size={40} />
          </motion.div>
        )}

        {status === 'error' && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-16 h-16 rounded-full bg-red-900/20 border border-red-500/30 text-red-500 flex items-center justify-center mb-6"
          >
            <XCircle size={40} />
          </motion.div>
        )}

        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 32, marginBottom: 8 }}>
          {status === 'processing' ? 'VERIFYING...' : status === 'success' ? 'AUTHENTICATED' : 'VERIFICATION FAILED'}
        </h2>
        <p className="text-[#A3A3A3] text-[15px] leading-relaxed">
          {message}
        </p>

        {status === 'error' && (
          <a href="/login" className="mt-8 text-sm font-semibold text-[#F97316] hover:text-[#EA580C] transition-colors">
            Return to Log In
          </a>
        )}
      </motion.div>
    </div>
  );
}
