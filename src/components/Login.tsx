import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface LoginProps {
  navigateTo: (page: 'dashboard' | 'workouts' | 'analysis' | 'records') => void;
}

export default function Login({ navigateTo }: LoginProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Check if we are coming back from an OAuth redirect or already have a session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // We have a session! Show the success screen (Image 3)
        transitionToStep(3);
        
        // After showing success for 2 seconds, go to dashboard
        setTimeout(() => {
          navigateTo('dashboard');
        }, 2000);
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && step !== 3) {
        transitionToStep(3);
        setTimeout(() => {
          navigateTo('dashboard');
        }, 2000);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigateTo, step]);

  const transitionToStep = (newStep: 1 | 2 | 3) => {
    setIsFading(true);
    setTimeout(() => {
      setStep(newStep);
      setIsFading(false);
    }, 300); // 300ms fade transition
  };

  const handleSignInClick = async () => {
    // Prevent multiple clicks
    if (step !== 1) return;

    // Transition to step 2 (waiting for confirmation)
    transitionToStep(2);

    // Wait a brief moment to let the UI update and show Image 2 before redirecting/calling auth
    setTimeout(async () => {
      try {
        // We attempt an anonymous sign-in if enabled, or just a dummy request to trigger REAL supabase network traffic.
        // For a seamless demo that matches the 3-image flow without redirecting away:
        const { error } = await supabase.auth.signInAnonymously();

        if (error) {
          console.log('Supabase Auth Info or Error:', error.message, '- Falling back to simulated delay for presentation flow.');
          // Fallback simulation if Anonymous auth isn't configured, so the demo still works flawlessly
          setTimeout(() => {
            transitionToStep(3);
            setTimeout(() => {
              navigateTo('dashboard');
            }, 2000);
          }, 3000);
        }
      } catch (err) {
        console.error('Unexpected error during sign in:', err);
      }
    }, 800);
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex justify-center items-center">
      {/* 
        Image 1: Initial Login Screen 
      */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${step === 1 && !isFading ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        style={{
          backgroundImage: "url('/loginpage.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        {/* Invisible clickable area over the "Sign In" button. 
            Adjust the formatting parameters (top, left, width, height) based on the actual image layout. 
            For now, setting a central large clickable area. */}
        {step === 1 && (
          <button 
            onClick={handleSignInClick}
            className="absolute bottom-[10%] left-[10%] w-[80%] h-[15%] opacity-0 cursor-pointer"
            aria-label="Sign In"
          />
        )}
      </div>

      {/* 
        Image 2: Waiting for Confirmation 
      */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${step === 2 && !isFading ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        style={{
          backgroundImage: "url('/loginpage2.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* 
        Image 3: Success / Welcome Screen
      */}
      <div 
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${step === 3 && !isFading ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        style={{
          backgroundImage: "url('/loginpage3.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
    </div>
  );
}
