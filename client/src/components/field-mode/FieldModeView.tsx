import React, { useState, useEffect, useCallback } from 'react';
import { Investigation } from '@fieldnote/shared';
import { TactileButton } from '../common/TactileButton.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
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
  const [isDimmed, setIsDimmed] = useState<boolean>(false);

  // Progressive disappearance reset handler
  const resetDimTimer = useCallback(() => {
    setIsDimmed(false);
  }, []);

  // Inactivity disappearance timer (~7 seconds into pure dark observation)
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

  return (
    <div
      role="region"
      aria-label="Field Observation Mode"
      className="fixed inset-0 bg-[#0B0F0D] text-[#E7E0D3] z-50 flex flex-col justify-between p-6 sm:p-12 lg:p-16 select-none transition-colors duration-1000 overflow-hidden cursor-pointer"
      onClick={resetDimTimer}
    >
      {/* 1. TOP MINIMAL STATUS BAR: Fades out completely after 7s */}
      <header
        className={`flex items-center justify-between transition-opacity duration-1000 ${
          isDimmed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex items-center space-x-2.5">
          <span className="w-2 h-2 rounded-full bg-[#46A093] animate-pulse" />
          <span className="font-mono text-xs tracking-[0.25em] text-[#859189] uppercase">
            Field Immersion • Folio {String(investigation.sequenceNumber).padStart(3, '0')}
          </span>
        </div>

        {/* Quiet Presence indicator */}
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-[2px] bg-[#17201B]/80 border border-[#22332A] text-xs font-mono text-[#859189]">
          <Pocket className="w-3.5 h-3.5 text-[#46A093]" />
          <span>
            {screenAwaySeconds > 0 ? `Phone Away (${screenAwaySeconds}s)` : 'Quiet Notice Active'}
          </span>
        </div>
      </header>

      {/* 2. CENTER CORE: Calm, generous whitespace, botanical breath */}
      <main
        className={`max-w-lg mx-auto my-auto text-center space-y-10 transition-all duration-1000 ${
          isDimmed ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
        }`}
      >
        {/* Core Nature Directives */}
        <div className="space-y-4 tracking-[0.3em] uppercase font-light text-3xl sm:text-4xl lg:text-5xl text-[#FCFBF7] leading-tight">
          <p className="opacity-60">LOOK.</p>
          <p className="text-[#46A093] font-normal">NOTICE.</p>
          <p className="opacity-60">REMEMBER.</p>
        </div>

        {/* Essential directive reminder */}
        <div className="py-6 px-4 border-y border-[#22332A] max-w-md mx-auto space-y-3">
          <p className="font-serif italic text-lg sm:text-xl text-[#F7F4EC] leading-relaxed">
            “{investigation.prompt}”
          </p>

          <p className="text-xs font-mono text-[#859189] flex items-center justify-center space-x-2 pt-1">
            <EyeOff className="w-3.5 h-3.5 text-[#46A093]" />
            <span>Put your phone in your pocket. Feel the physical world.</span>
          </p>
        </div>

        {/* Quiet breathing naturalist ring */}
        <div className="flex justify-center pt-2">
          <div className="relative w-16 h-16 rounded-full border border-[#22332A] flex items-center justify-center animate-observation-breath">
            <div className="w-8 h-8 rounded-full border border-[#46A093]/40 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-[#46A093]" />
            </div>
          </div>
        </div>
      </main>

      {/* Screen Empty Whisper (Gentle hint when screen is completely dimmed) */}
      {isDimmed && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-1000">
          <BotanicalLeafSprig className="w-6 h-6 text-[#22332A] mb-3 opacity-40 animate-pulse" />
          <p className="text-[11px] font-mono text-[#859189]/40 tracking-[0.35em] uppercase">
            Observing Physical Earth • Tap Anywhere to Return
          </p>
        </div>
      )}

      {/* 3. RETURN ACTION FOOTER: Fades out in deep observation, reappears on touch */}
      <footer
        className={`max-w-md mx-auto w-full transition-all duration-1000 ${
          isDimmed ? 'opacity-0 pointer-events-none translate-y-3' : 'opacity-100 translate-y-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <TactileButton
          onClick={onReturn}
          variant="field"
          className="w-full py-4 text-sm sm:text-base tracking-wider uppercase font-medium border-[#3D5648] hover:border-[#46A093] hover:text-[#46A093] min-h-[52px]"
        >
          Return to Record Observation
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </footer>
    </div>
  );
};
