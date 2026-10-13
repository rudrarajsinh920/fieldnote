import React, { useEffect, useState } from 'react';
import { BotanicalLeafSprig } from './BotanicalIllustrations.js';
import './BotanicalIntro.css';

/**
 * Botanical Leaf SVG Components
 * High-craft, lightweight vector shapes representing distinct naturalist specimens.
 */

// 1. Oak Leaf (Quercus) - Forest Green
const OakLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-28 h-38',
  color = '#12372A',
}) => (
  <svg
    viewBox="0 0 80 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path
      d="M40 10 C46 16 54 18 50 28 C56 34 62 42 54 52 C60 62 62 74 52 82 C56 90 52 98 42 104 L40 114 L38 104 C28 98 24 90 28 82 C18 74 20 62 26 52 C18 42 24 34 30 28 C26 18 34 16 40 10 Z"
      fill={color}
      fillOpacity="0.9"
      stroke="#0B221A"
      strokeWidth="1.2"
    />
    <path d="M40 14 Q39 60 40 114" stroke="#0B221A" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
    <path d="M40 32 Q46 28 50 28 M40 34 Q34 29 30 28" stroke="#0B221A" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
    <path d="M40 54 Q48 48 54 52 M40 56 Q32 49 26 52" stroke="#0B221A" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
    <path d="M40 76 Q47 72 52 82 M40 78 Q33 73 28 82" stroke="#0B221A" strokeWidth="1" strokeLinecap="round" opacity="0.45" />
  </svg>
);

// 2. Laurel Leaf (Laurus) - Deep Moss Green
const LaurelLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-24 h-40',
  color = '#4F6F52',
}) => (
  <svg
    viewBox="0 0 60 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path
      d="M30 8 C44 26 52 56 42 88 C38 100 32 106 30 114 C28 106 22 100 18 88 C8 56 16 26 30 8 Z"
      fill={color}
      fillOpacity="0.88"
      stroke="#1B4D3C"
      strokeWidth="1.2"
    />
    <path d="M30 10 Q29 60 30 114" stroke="#1B4D3C" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
    <path d="M30 32 Q38 24 45 28 M30 46 Q22 38 15 42" stroke="#1B4D3C" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <path d="M30 60 Q39 52 44 58 M30 74 Q21 66 16 72" stroke="#1B4D3C" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <path d="M30 88 Q37 82 40 88 M30 96 Q24 90 20 94" stroke="#1B4D3C" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

// 3. Fern Frond (Polypodiophyta) - Sage Green
const FernFrond: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-26 h-44',
  color = '#698E6C',
}) => (
  <svg
    viewBox="0 0 70 130"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path d="M35 10 Q40 65 30 122" stroke="#12372A" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />
    <path d="M36 22 C44 19 50 21 54 26 C48 29 42 27 36 24 Z" fill={color} fillOpacity="0.88" stroke="#12372A" strokeWidth="1" />
    <path d="M35 32 C26 29 20 32 16 38 C22 40 28 37 35 34 Z" fill={color} fillOpacity="0.88" stroke="#12372A" strokeWidth="1" />
    <path d="M37 44 C47 40 55 43 60 50 C53 53 45 50 37 46 Z" fill="#4F6F52" fillOpacity="0.9" stroke="#12372A" strokeWidth="1" />
    <path d="M36 56 C25 52 17 56 12 63 C19 65 27 61 36 58 Z" fill="#4F6F52" fillOpacity="0.9" stroke="#12372A" strokeWidth="1" />
    <path d="M36 68 C48 64 58 68 62 76 C54 78 45 74 36 71 Z" fill={color} fillOpacity="0.88" stroke="#12372A" strokeWidth="1" />
    <path d="M34 82 C23 78 15 83 10 91 C18 92 26 88 34 84 Z" fill={color} fillOpacity="0.88" stroke="#12372A" strokeWidth="1" />
    <path d="M33 96 C43 92 51 96 54 104 C47 106 39 101 32 98 Z" fill="#4F6F52" fillOpacity="0.9" stroke="#12372A" strokeWidth="1" />
    <path d="M32 106 C24 103 18 107 14 113 C20 114 26 111 31 108 Z" fill={color} fillOpacity="0.88" stroke="#12372A" strokeWidth="1" />
  </svg>
);

// 4. Heart Leaf (Tilia / Birch) - Warm Antique Ochre Accent
const HeartLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'w-26 h-36',
  color = '#C96B4B',
}) => (
  <svg
    viewBox="0 0 80 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path
      d="M40 10 C56 18 68 36 66 60 C64 80 52 94 40 102 C28 94 16 80 14 60 C12 36 24 18 40 10 Z"
      fill={color}
      fillOpacity="0.85"
      stroke="#A35034"
      strokeWidth="1.2"
    />
    <path d="M40 12 L40 106" stroke="#A35034" strokeWidth="1.3" strokeLinecap="round" opacity="0.6" />
    <path d="M40 30 Q52 28 60 38 M40 30 Q28 28 20 38" stroke="#A35034" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <path d="M40 50 Q56 50 63 60 M40 50 Q24 50 17 60" stroke="#A35034" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
    <path d="M40 70 Q52 72 58 80 M40 70 Q28 72 22 80" stroke="#A35034" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export interface BotanicalIntroProps {
  /** Optional callback triggered when animation begins unveiling homepage */
  onUnveil?: () => void;
  /** Optional callback triggered when animation finishes and unmounts */
  onComplete?: () => void;
}

/**
 * BotanicalIntro Component
 * "The Nature Reveal" — Premium Opening Animation for FIELDNOTE
 * Smooth 60/120fps hardware-accelerated presentation that shows on every visit & refresh.
 */
export const BotanicalIntro: React.FC<BotanicalIntroProps> = ({
  onUnveil,
  onComplete,
}) => {
  const [shouldPlay, setShouldPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    // Optional query parameter to disable intro for automated testing
    if (window.location.search.includes('disableIntro')) return false;

    // Show on every visit and every refresh!
    return true;
  });

  const [isUnveiling, setIsUnveiling] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  // Expose developer helpers on window
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).replayBotanicalIntro = () => {
        setIsFinished(false);
        setIsUnveiling(false);
        setShouldPlay(true);
      };

      (window as any).disableBotanicalIntro = () => {
        setIsFinished(true);
        setShouldPlay(false);
      };
    }
  }, []);

  // Animation timeline lifecycle (Total: 1700ms)
  useEffect(() => {
    if (!shouldPlay || isFinished) return;

    // Lock body scroll and mark document active
    document.documentElement.classList.add('nature-reveal-active');
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 1.5 seconds: Begin veil dissolve to reveal live homepage
    const unveilTimer = setTimeout(() => {
      setIsUnveiling(true);
      document.documentElement.classList.add('nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
      onUnveil?.();
    }, 1500);

    // 1.76 seconds: Complete animation and remove overlay completely from DOM
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      document.documentElement.classList.remove('nature-reveal-active', 'nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
      onComplete?.();
    }, 1760);

    return () => {
      clearTimeout(unveilTimer);
      clearTimeout(finishTimer);
      document.documentElement.classList.remove('nature-reveal-active', 'nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [shouldPlay, isFinished, onUnveil, onComplete]);

  // If finished or disabled, unmount completely
  if (!shouldPlay || isFinished) {
    return null;
  }

  return (
    <aside
      aria-label="FIELDNOTE Opening Botanical Reveal"
      aria-live="polite"
      className={`nature-reveal-overlay ${
        isUnveiling ? 'nature-reveal-veil-dissolve' : ''
      }`}
    >
      {/* 0.0s – 1.15s: Central Botanical Brand Mark Reveal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        <div className="nature-reveal-brand flex flex-col items-center justify-center text-center">
          <BotanicalLeafSprig className="w-10 h-10 sm:w-12 sm:h-12 text-forest mb-2.5" />
          <span className="font-serif tracking-tight font-medium text-3xl sm:text-4xl lg:text-5xl text-ink leading-none">
            FIELDNOTE
          </span>
        </div>
      </div>

      {/* 0.3s – 1.5s: Drifting Leaf Elements */}
      {/* Leaf 1: Top-Left (Oak Leaf) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-1 z-20">
        <OakLeaf className="w-24 h-34 sm:w-28 sm:h-40 md:w-34 md:h-48" />
      </div>

      {/* Leaf 2: Top-Right (Laurel Leaf) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-2 z-20">
        <LaurelLeaf className="w-22 h-36 sm:w-26 sm:h-44 md:w-30 md:h-52" />
      </div>

      {/* Leaf 3: Bottom-Left (Fern Frond) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-3 z-20">
        <FernFrond className="w-22 h-38 sm:w-26 sm:h-44 md:w-32 md:h-54" />
      </div>

      {/* Leaf 4: Bottom-Right (Heart Leaf with Warm Terracotta Accent) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-4 z-20">
        <HeartLeaf className="w-24 h-34 sm:w-28 sm:h-40 md:w-32 md:h-46" />
      </div>

      {/* Leaves 5, 6, 7: Tablet & Desktop Canopy Elements (Hidden on mobile for lightweight performance) */}
      {/* Leaf 5: Top-Center (Laurel Leaf) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-5 z-15 hidden md:block">
        <LaurelLeaf className="w-24 h-40 lg:w-28 lg:h-48" color="#1E5850" />
      </div>

      {/* Leaf 6: Mid-Left (Oak Leaf) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-6 z-15 hidden md:block">
        <OakLeaf className="w-24 h-34 lg:w-28 lg:h-42" color="#0B221A" />
      </div>

      {/* Leaf 7: Mid-Right (Fern Frond) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-7 z-15 hidden md:block">
        <FernFrond className="w-24 h-40 lg:w-28 lg:h-48" color="#698E6C" />
      </div>
    </aside>
  );
};
