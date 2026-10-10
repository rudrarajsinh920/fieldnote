import React, { useState, useEffect } from 'react';
import { Investigation } from '@fieldnote/shared';
import { ArrowLeft, Bell, ArrowUp } from 'lucide-react';
import { DarkForestBackdrop } from '../common/BotanicalIllustrations.js';

interface FieldModeViewProps {
  investigation: Investigation;
  screenAwaySeconds: number;
  onReturn: () => void;
}

export const FieldModeView: React.FC<FieldModeViewProps> = ({
  investigation,
  screenAwaySeconds,
  onReturn,
}) => {
  const targetSeconds = investigation.targetDurationSeconds || 600;
  const [secondsLeft, setSecondsLeft] = useState<number>(targetSeconds);
  const [reminderSet, setReminderSet] = useState<boolean>(false);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Screen wake lock
  useEffect(() => {
    let wakeLock: any = null;
    if ('wakeLock' in navigator) {
      navigator.wakeLock
        .request('screen')
        .then((lock) => {
          wakeLock = lock;
        })
        .catch(() => {});
    }

    return () => {
      if (wakeLock) {
        wakeLock.release().catch(() => {});
      }
    };
  }, []);

  const handleReminderToggle = () => {
    setReminderSet(!reminderSet);
  };

  // Format MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Progress
  const progressPercent = (targetSeconds - secondsLeft) / targetSeconds;
  const strokeDashoffset = 283 - 283 * progressPercent;

  return (
    <div
      role="region"
      aria-label="Field Mode Immersion"
      className="fixed inset-0 bg-[#06120C] text-[#E7E0D3] z-50 flex flex-col justify-between p-6 sm:p-8 select-none overflow-hidden"
    >
      {/* Full-bleed Dark Forest Canopy Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <DarkForestBackdrop className="w-full h-full object-cover" />
      </div>

      {/* 1. TOP HEADER BAR */}
      <header className="relative z-10 flex items-center justify-between">
        <button
          type="button"
          onClick={onReturn}
          className="inline-flex items-center space-x-1.5 text-xs font-mono uppercase tracking-wider text-[#A3B8AC] hover:text-[#FCFBF7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Field Mode</span>
        </button>

        <button
          type="button"
          onClick={handleReminderToggle}
          className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full border text-xs font-mono transition-colors ${
            reminderSet
              ? 'bg-[#183628] border-[#2F8175] text-[#86D6B8]'
              : 'border-[#1C3627] text-[#859E8F] hover:text-[#FCFBF7]'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>{reminderSet ? 'Reminder On' : 'Set Reminder'}</span>
        </button>
      </header>

      {/* 2. CENTER SECTION: CIRCULAR TIMER & GLOWING SEEDLING */}
      <main className="relative z-10 my-auto max-w-sm mx-auto text-center space-y-6">
        {/* Prominent Circular Glowing Timer */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_15px_rgba(47,129,117,0.3)]" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#132B1F"
              strokeWidth="2.5"
              fill="transparent"
            />
            {/* Active Glow Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#2F8175"
              strokeWidth="3"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000"
            />
          </svg>

          {/* Time Readout */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="font-mono text-5xl sm:text-6xl font-light tracking-tight text-[#FCFBF7] drop-shadow-md">
              {formattedTime}
            </div>
            {screenAwaySeconds > 0 && (
              <span className="font-mono text-[10px] tracking-widest uppercase text-[#739483] mt-1">
                Away {screenAwaySeconds}s
              </span>
            )}
          </div>
        </div>

        {/* Notice Instruction */}
        <p className="font-sans text-sm text-[#A3B8AC] tracking-wide">
          Go outside. Put your phone away.
        </p>

        {/* Glowing Botanical Seedling in Center */}
        <div className="py-1 flex items-center justify-center">
          <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 drop-shadow-[0_0_16px_rgba(61,168,131,0.55)]">
            {/* Central glowing stem */}
            <path d="M40 70 C40 52 38 34 40 20" stroke="#4F8562" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Left Leaf (Lush green) */}
            <path d="M39 44 C22 38 16 24 26 18 C37 14 39 30 39 44 Z" fill="#2F8175" stroke="#4F8562" strokeWidth="1.4" />
            <path d="M39 44 Q28 28 26 18" stroke="#8DE3C4" strokeWidth="0.8" opacity="0.6" />

            {/* Right Leaf (Sage green) */}
            <path d="M41 34 C58 28 64 14 54 8 C43 4 41 20 41 34 Z" fill="#4F6F52" stroke="#2F8175" strokeWidth="1.4" />
            <path d="M41 34 Q52 18 54 8" stroke="#A8DFC7" strokeWidth="0.8" opacity="0.6" />

            {/* Tiny emerging top leaf bud */}
            <circle cx="40" cy="18" r="3" fill="#8CE0BD" />
          </svg>
        </div>

        {/* Naturalist Philosophical Quote */}
        <p className="font-serif italic text-base sm:text-lg text-[#C8DCD1] max-w-xs mx-auto leading-relaxed">
          “The world reveals itself to those who take time to notice.”
        </p>
      </main>

      {/* 3. BOTTOM RETURN BUTTON */}
      <footer className="relative z-10 max-w-sm mx-auto w-full pt-4 text-center">
        <button
          type="button"
          onClick={onReturn}
          className="w-full py-4 px-5 rounded-2xl bg-[#0F2B1D]/80 backdrop-blur-md hover:bg-[#183E2A] border border-[#27533B] text-[#FCFBF7] font-sans text-sm font-medium flex items-center justify-center space-x-2 transition-all active:scale-[0.98] shadow-lg"
        >
          <ArrowUp className="w-4 h-4 text-[#86D6B8] animate-bounce" />
          <span>Swipe up when you're back</span>
        </button>
      </footer>
    </div>
  );
};
