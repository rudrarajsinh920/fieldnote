import React, { useState, useEffect, useCallback } from 'react';
import { Investigation } from '@fieldnote/shared';
import { TactileButton } from '../common/TactileButton.js';
import { EyeOff, Pocket, ArrowRight } from 'lucide-react';

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
  const [isDimmed, setIsDimmed] = useState(false);

  // Progressive disappearance reset handler
  const resetDimTimer = useCallback(() => {
    setIsDimmed(false);
  }, []);

  // Inactivity disappearance timer (~7 seconds)
  useEffect(() => {
    if (isDimmed) return;

    const timeoutId = setTimeout(() => {
      setIsDimmed(true);
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, [isDimmed]);

  // Awaken controls gently on touch or pointer interaction
  useEffect(() => {
    const handleInteraction = () => {
      resetDimTimer();
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('pointerdown', handleInteraction, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('pointerdown', handleInteraction);
      window.removeEventListener('mousemove', handleInteraction);
    };
  }, [resetDimTimer]);

  // Screen wake lock support (if supported by browser)
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

  return (
    <div
      role="region"
      aria-label="Field Observation Mode"
      className="fixed inset-0 bg-field-bg text-field-text z-50 flex flex-col justify-between p-6 sm:p-12 select-none transition-colors duration-1000 overflow-hidden"
    >
      {/* Top minimal status bar: Fades out completely after 7s */}
      <header
        className={`flex items-center justify-between transition-opacity duration-1000 ${
          isDimmed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-field-accent animate-pulse" />
          <span className="font-mono text-xs tracking-[0.25em] text-field-muted uppercase">
            Field Mode • Inv {String(investigation.sequenceNumber).padStart(3, '0')}
          </span>
        </div>

        {/* Quiet Presence indicator (not a gamified stopwatch) */}
        <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-[2px] bg-field-surface/70 border border-field-border text-xs font-mono text-field-muted">
          <Pocket className="w-3.5 h-3.5 text-field-accent" />
          <span>
            {screenAwaySeconds > 0 ? 'Phone Away Honored' : 'Quiet Presence Active'}
          </span>
        </div>
      </header>

      {/* Center Core: Progressive Vanishing Visual State */}
      <main
        className={`max-w-md mx-auto my-auto text-center space-y-8 transition-all duration-1000 ${
          isDimmed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Core Notice Directive */}
        <div className="space-y-4 font-sans tracking-[0.25em] uppercase font-light text-3xl sm:text-4xl text-field-text leading-tight">
          <p className="tracking-[0.3em]">LOOK.</p>
          <p className="tracking-[0.3em] text-field-accent font-normal">NOTICE.</p>
          <p className="tracking-[0.3em]">REMEMBER.</p>
        </div>

        {/* Essential directive reminder */}
        <div className="py-4 border-y border-field-border/60 max-w-sm mx-auto space-y-3">
          <p className="font-serif italic text-base sm:text-lg text-field-text/90 leading-relaxed">
            “{investigation.prompt}”
          </p>

          <p className="text-xs font-mono text-field-muted flex items-center justify-center space-x-1.5 pt-1">
            <EyeOff className="w-3.5 h-3.5 text-field-accent/80" />
            <span>The phone is no longer the main character.</span>
          </p>
        </div>

        {/* Quiet breathing beacon */}
        <div className="flex justify-center pt-2">
          <div className="w-12 h-12 rounded-full border border-field-border flex items-center justify-center animate-observation-breath">
            <span className="w-2 h-2 rounded-full bg-field-accent/70" />
          </div>
        </div>
      </main>

      {/* Screen Empty Whisper (Subtle hint when dimmed) */}
      {isDimmed && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-1000">
          <p className="text-[11px] font-mono text-field-muted/30 tracking-[0.3em] uppercase animate-pulse">
            Observe the physical world
          </p>
        </div>
      )}

      {/* Return Action: Fades out in deep observation, reappears on tap */}
      <footer
        className={`max-w-md mx-auto w-full transition-all duration-1000 ${
          isDimmed ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-100 translate-y-0'
        }`}
      >
        <TactileButton
          onClick={onReturn}
          variant="field"
          className="w-full py-4 text-sm sm:text-base tracking-wider uppercase font-medium border-field-border hover:border-field-accent hover:text-field-accent"
        >
          I Have Observed — Return to Journal
          <ArrowRight className="w-4 h-4 ml-2 text-field-accent" />
        </TactileButton>
      </footer>
    </div>
  );
};
