import React, { useEffect, useState } from 'react';
import { BotanicalLeafSprig } from './BotanicalIllustrations.js';
import './BotanicalIntro.css';

/**
 * Botanical Leaf SVG Specimen Components
 * High-craft, authentic botanical vector specimens with rich organic curves,
 * dark ink contours, and solid naturalist fills — completely eliminating ghosting.
 */

// 1. Quercus robur (English Oak) — Deep Forest Green
const OakLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#143D2D',
}) => (
  <svg viewBox="0 0 140 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M70 172 Q67 125 70 85" stroke="#0B2319" strokeWidth="2.6" strokeLinecap="round" />
    <path
      d="M70 162 C48 154 38 138 46 122 C32 116 26 96 38 82 C24 72 28 52 44 42 C40 26 56 12 72 8 C88 12 104 26 100 42 C116 52 120 72 106 82 C118 96 112 116 98 122 C106 138 96 154 74 162 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#0B2319"
      strokeWidth="1.8"
    />
    <path d="M70 20 Q69 90 70 162" stroke="#0B2319" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M70 48 Q84 40 92 44 M70 52 Q56 42 48 44" stroke="#0B2319" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    <path d="M70 86 Q88 76 96 84 M70 90 Q52 78 44 84" stroke="#0B2319" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
    <path d="M70 124 Q86 116 92 124 M70 126 Q54 116 48 124" stroke="#0B2319" strokeWidth="1.4" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 2. Ginkgo biloba (Maidenhair Fan) — Warm Antique Amber Olive
const GinkgoLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#8C6F2D',
}) => (
  <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M80 134 C76 110 72 90 76 68" stroke="#3D2E0B" strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M76 68 C46 68 18 52 10 32 C18 18 45 20 68 32 C73 26 77 26 82 32 C105 20 132 18 140 32 C132 52 106 68 76 68 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#3D2E0B"
      strokeWidth="1.8"
    />
    <path d="M76 68 Q52 48 26 32" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
    <path d="M76 68 Q62 42 46 25" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
    <path d="M76 68 Q72 44 68 28" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
    <path d="M76 68 Q82 44 86 28" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
    <path d="M76 68 Q92 42 106 25" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
    <path d="M76 68 Q102 48 126 32" stroke="#3D2E0B" strokeWidth="1.2" opacity="0.5" />
  </svg>
);

// 3. Polypodiophyta (Mountain Fern Frond) — Gracefully Arched Pinnate Silhouette
const FernFrond: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#3D684D',
}) => (
  <svg viewBox="0 0 160 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M35 192 C55 145 88 95 125 18" stroke="#12372A" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M120 28 C135 22 146 25 152 32 C142 37 130 35 120 30 Z" fill={color} fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M110 44 C95 38 85 41 78 50 C89 53 100 50 110 46 Z" fill={color} fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M106 60 C124 52 138 56 146 66 C134 71 120 68 106 63 Z" fill="#2E523A" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M96 78 C80 70 66 74 58 85 C71 88 84 84 96 80 Z" fill="#2E523A" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M90 96 C112 86 128 92 136 104 C122 108 106 104 90 99 Z" fill={color} fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M78 116 C60 108 44 114 34 126 C49 129 64 124 78 119 Z" fill={color} fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M70 136 C92 126 108 132 116 144 C102 148 86 144 70 139 Z" fill="#2E523A" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
    <path d="M58 156 C42 148 28 154 20 166 C34 168 48 164 58 159 Z" fill="#2E523A" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.3" />
  </svg>
);

// 4. Tilia cordata (Linden Heart Leaf) — Warm Botanical Terracotta Ochre
const HeartLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#B85D38',
}) => (
  <svg viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M70 152 C65 125 68 100 70 82" stroke="#6F3018" strokeWidth="2.4" strokeLinecap="round" />
    <path
      d="M70 18 C96 32 116 60 112 96 C108 126 88 142 70 152 C52 142 32 126 28 96 C24 60 44 32 70 18 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#6F3018"
      strokeWidth="1.8"
    />
    <path d="M70 20 L70 152" stroke="#6F3018" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    <path d="M70 48 Q88 42 102 54 M70 48 Q52 42 38 54" stroke="#6F3018" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    <path d="M70 80 Q92 76 106 90 M70 80 Q48 76 34 90" stroke="#6F3018" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
    <path d="M70 112 Q88 114 98 126 M70 112 Q52 114 42 126" stroke="#6F3018" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 5. Laurus nobilis (Noble Laurel Sprig) — Multi-leaf Botanical Cluster
const LaurelSprig: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#265338',
}) => (
  <svg viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M70 192 C68 140 70 80 70 18" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
    {/* Terminal leaf */}
    <path d="M70 18 C85 36 92 65 84 95 C78 106 72 112 70 118 C68 112 62 106 56 95 C48 65 55 36 70 18 Z" fill={color} fillOpacity="0.96" stroke="#12372A" strokeWidth="1.5" />
    {/* Left leaf */}
    <path d="M68 95 C46 88 24 100 16 122 C22 134 34 136 50 130 C60 126 66 118 68 112 Z" fill="#356648" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.4" />
    {/* Right leaf */}
    <path d="M72 118 C94 110 116 120 124 142 C118 154 106 156 90 150 C80 146 74 138 72 132 Z" fill="#356648" fillOpacity="0.96" stroke="#12372A" strokeWidth="1.4" />
    {/* Terracotta berry accents */}
    <circle cx="62" cy="116" r="3" fill="#B85D38" />
    <circle cx="78" cy="138" r="3" fill="#B85D38" />
  </svg>
);

// 6. Acer campestre (Field Maple) — 5-Lobed Palmate Leaf, Earth Forest Green
const MapleLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#2C5A3E',
}) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M80 152 L80 108" stroke="#102E20" strokeWidth="2.8" strokeLinecap="round" />
    <path
      d="M80 108 C68 105 52 118 38 110 C38 96 48 84 46 70 C32 70 18 60 16 46 C30 44 44 50 54 44 C56 30 64 18 74 12 C80 26 80 34 80 36 C80 34 80 26 86 12 C96 18 104 30 106 44 C116 50 130 44 144 46 C142 60 128 70 114 70 C112 84 122 96 122 110 C108 118 92 105 80 108 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#102E20"
      strokeWidth="1.8"
    />
    <path d="M80 108 L80 36" stroke="#102E20" strokeWidth="1.6" opacity="0.7" />
    <path d="M80 100 L40 54" stroke="#102E20" strokeWidth="1.4" opacity="0.6" />
    <path d="M80 100 L120 54" stroke="#102E20" strokeWidth="1.4" opacity="0.6" />
  </svg>
);

// 7. Salix (Slender Willow Leaf) — Graceful Arching Lanceolate, Deep Pine
const WillowLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#17432F',
}) => (
  <svg viewBox="0 0 100 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path
      d="M50 12 C72 45 84 98 70 154 C62 174 54 186 50 196 C46 186 38 174 30 154 C16 98 28 45 50 12 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#0C261A"
      strokeWidth="1.6"
    />
    <path d="M50 16 Q48 100 50 196" stroke="#0C261A" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />
    <path d="M50 56 Q66 42 78 50 M50 78 Q32 64 22 72" stroke="#0C261A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
    <path d="M50 106 Q68 92 78 102 M50 128 Q30 114 20 124" stroke="#0C261A" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

// 8. Castanea sativa (Sweet Chestnut / Serrated Beech) — Rich Forest Olive
const ChestnutLeaf: React.FC<{ className?: string; color?: string }> = ({
  className = 'nature-reveal-svg',
  color = '#224D36',
}) => (
  <svg viewBox="0 0 130 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-hidden="true">
    <path d="M65 194 Q62 140 65 90" stroke="#0D271A" strokeWidth="2.5" strokeLinecap="round" />
    <path
      d="M65 18 C78 28 88 42 84 56 C96 66 102 82 96 98 C108 110 110 128 100 144 C104 158 96 172 80 180 L65 186 L50 180 C34 172 26 158 30 144 C20 128 22 110 34 98 C28 82 34 66 46 56 C42 42 52 28 65 18 Z"
      fill={color}
      fillOpacity="0.96"
      stroke="#0D271A"
      strokeWidth="1.8"
    />
    <path d="M65 22 Q64 100 65 186" stroke="#0D271A" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
    <path d="M65 58 Q82 48 92 56 M65 60 Q48 50 38 58" stroke="#0D271A" strokeWidth="1.3" opacity="0.5" />
    <path d="M65 100 Q86 88 98 98 M65 102 Q44 90 32 100" stroke="#0D271A" strokeWidth="1.3" opacity="0.5" />
    <path d="M65 144 Q84 134 94 144 M65 146 Q46 136 36 146" stroke="#0D271A" strokeWidth="1.3" opacity="0.5" />
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
 * 2.5s Full-Screen Botanical Leaf Reveal across Desktop, Laptop, Tablet, and Mobile.
 */
export const BotanicalIntro: React.FC<BotanicalIntroProps> = ({
  onUnveil,
  onComplete,
}) => {
  const [replayKey, setReplayKey] = useState<number>(0);
  const [shouldPlay, setShouldPlay] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;

    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return false;

    // Optional query parameter to disable intro for automated testing
    if (window.location.search.includes('disableIntro')) return false;

    // Show on every visit and browser refresh!
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
        setReplayKey((k) => k + 1);
      };

      (window as any).disableBotanicalIntro = () => {
        setIsFinished(true);
        setShouldPlay(false);
      };
    }
  }, []);

  // Animation timeline lifecycle (Total: 2500ms / 2.5 seconds)
  useEffect(() => {
    if (!shouldPlay || isFinished) return;

    // Lock body scroll and mark document active
    document.documentElement.classList.add('nature-reveal-active');
    const originalBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // 2.0 seconds: Begin veil dissolve & homepage emergence (Phase 4)
    const unveilTimer = setTimeout(() => {
      setIsUnveiling(true);
      document.documentElement.classList.add('nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
      onUnveil?.();
    }, 2000);

    // 2.5 seconds: Complete animation and remove overlay completely from DOM
    const finishTimer = setTimeout(() => {
      setIsFinished(true);
      document.documentElement.classList.remove('nature-reveal-active', 'nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
      onComplete?.();
    }, 2500);

    return () => {
      clearTimeout(unveilTimer);
      clearTimeout(finishTimer);
      document.documentElement.classList.remove('nature-reveal-active', 'nature-reveal-unveiling');
      document.body.style.overflow = originalBodyOverflow;
    };
  }, [shouldPlay, isFinished, replayKey, onUnveil, onComplete]);

  // If finished or disabled, unmount completely
  if (!shouldPlay || isFinished) {
    return null;
  }

  return (
    <aside
      key={replayKey}
      aria-label="FIELDNOTE Opening Botanical Reveal"
      aria-live="polite"
      className={`nature-reveal-overlay ${
        isUnveiling ? 'nature-reveal-veil-dissolve' : ''
      }`}
    >
      {/* Phase 1 (0.0s – 1.4s): Central Botanical Brand Mark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 px-4">
        <div className="nature-reveal-brand flex flex-col items-center justify-center text-center">
          <BotanicalLeafSprig className="w-10 h-10 sm:w-12 sm:h-12 text-forest mb-2.5" />
          <span className="font-serif tracking-tight font-medium text-3xl sm:text-4xl lg:text-5xl text-ink leading-none">
            FIELDNOTE
          </span>
        </div>
      </div>

      {/* Full-Screen Botanical Canopy (8 Generous Leaves distributed across the entire viewport) */}
      {/* Leaf 1: Top-Left (Quercus Oak, Deep Forest) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-1 z-22">
        <OakLeaf color="#143D2D" />
      </div>

      {/* Leaf 2: Top-Center (Ginkgo Maidenhair, Antique Amber Olive) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-2 z-24">
        <GinkgoLeaf color="#8C6F2D" />
      </div>

      {/* Leaf 3: Mid-Left (Arched Mountain Fern, Sage Green) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-3 z-23">
        <FernFrond color="#3D684D" />
      </div>

      {/* Leaf 4: Mid-Right (Tilia Heart Leaf, Botanical Terracotta) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-4 z-22">
        <HeartLeaf color="#B85D38" />
      </div>

      {/* Leaf 5: Top-Right (Laurus Laurel Sprig, Noble Moss) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-5 z-21">
        <LaurelSprig color="#265338" />
      </div>

      {/* Leaf 6: Lower-Center-Left (Acer Field Maple, Earth Green) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-6 z-25">
        <MapleLeaf color="#2C5A3E" />
      </div>

      {/* Leaf 7: Mid-Far-Right (Salix Willow, Deep Pine) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-7 z-24">
        <WillowLeaf color="#17432F" />
      </div>

      {/* Leaf 8: Lower-Center-Right (Castanea Chestnut, Forest Olive) */}
      <div className="nature-reveal-leaf nature-reveal-leaf-8 z-23">
        <ChestnutLeaf color="#224D36" />
      </div>
    </aside>
  );
};

export default BotanicalIntro;
