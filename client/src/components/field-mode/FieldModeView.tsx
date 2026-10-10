import React, { useState, useEffect, useCallback } from 'react';
import { Investigation } from '@fieldnote/shared';
import { TactileButton } from '../common/TactileButton.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import { Pocket, ArrowRight, ChevronUp } from 'lucide-react';

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
  const [isDimmed, setIsDimmed] = useState<boolean>(false);

  // Live countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Screen wake lock support (if supported by device)
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

  // Gentle progressive dimming after 10s of quiet observation
  useEffect(() => {
    if (isDimmed) return;
    const timeout = setTimeout(() => setIsDimmed(true), 12000);
    return () => clearTimeout(timeout);
  }, [isDimmed]);

  const handleWake = useCallback(() => {
    setIsDimmed(false);
  }, []);

  // Format MM:SS
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  // Calculate circular stroke progress
  const progressPercent = (targetSeconds - secondsLeft) / targetSeconds;
  const strokeDashoffset = 283 - 283 * progressPercent;

  return (
    <div
      role="region"
      aria-label="Field Mode Immersion"
      onClick={handleWake}
      className="fixed inset-0 bg-[#0B1510] text-[#E7E0D3] z-50 flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden transition-colors duration-1000"
    >
      {/* 1. TOP STATUS BAR */}
      <header
        className={`flex items-center justify-between transition-opacity duration-700 ${
          isDimmed ? 'opacity-30' : 'opacity-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-[#2F8175] animate-pulse" />
          <span className="font-mono text-xs tracking-[0.25em] text-[#859189] uppercase font-semibold">
            Field Mode
          </span>
        </div>

        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-[2px] bg-[#16251E] border border-[#22392E] text-xs font-mono text-[#859189]">
          <Pocket className="w-3.5 h-3.5 text-[#2F8175]" />
          <span>{screenAwaySeconds > 0 ? `Screen Away (${screenAwaySeconds}s)` : 'Screen Away'}</span>
        </div>
      </header>

      {/* 2. CENTER CONTENT: CIRCULAR TIMER & BOTANICAL PLANT ON STONE */}
      <main className="my-auto max-w-sm mx-auto text-center space-y-8">
        {/* CIRCULAR TIMER DIAL */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto flex items-center justify-center">
          {/* SVG Circular Progress Track & Indicator */}
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-[#182921]"
              strokeWidth="3"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Progress Active Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-[#2F8175] transition-all duration-1000"
              strokeWidth="3.5"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
            />
          </svg>

          {/* Center Timer Time & Plant Graphic */}
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            {/* Seedling on mossy stone vector art */}
            <div className="w-12 h-12 flex items-center justify-center">
              <BotanicalLeafSprig className="w-10 h-10 text-[#46A093] opacity-90" />
            </div>

            <div className="font-mono text-4xl sm:text-5xl font-medium tracking-tight text-[#FCFBF7]">
              {formattedTime}
            </div>

            <span className="font-mono text-[11px] tracking-widest uppercase text-[#859189]">
              {secondsLeft === 0 ? 'Observation Concluded' : 'Silent Notice'}
            </span>
          </div>
        </div>

        {/* GUIDANCE MESSAGE */}
        <div className="space-y-3 px-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#FCFBF7] leading-tight">
            Go outside. Put your phone away.
          </h2>
          <p className="font-serif italic text-sm text-[#859189] leading-relaxed">
            “The world reveals itself only to those who stay long enough to see.”
          </p>
        </div>

        {/* DIRECTIVE SNIPPET */}
        <div className="p-3.5 rounded-sm bg-[#13221B]/80 border border-[#233B2F] text-xs font-serif italic text-[#C8D3CA]">
          “{investigation.prompt}”
        </div>
      </main>

      {/* 3. RETURN ACTION FOOTER */}
      <footer className="max-w-sm mx-auto w-full space-y-3" onClick={(e) => e.stopPropagation()}>
        <TactileButton
          onClick={onReturn}
          variant="primary"
          className="w-full py-4 text-base font-semibold shadow-journal min-h-[52px] bg-[#2F8175] hover:bg-[#256a60] border-transparent text-[#FCFBF7]"
        >
          I'm Back / Record Observation
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>

        <div className="flex items-center justify-center text-[11px] font-mono text-[#859189] space-x-1">
          <ChevronUp className="w-3.5 h-3.5 animate-bounce" />
          <span>Tap button when your observation is complete</span>
        </div>
      </footer>
    </div>
  );
};
