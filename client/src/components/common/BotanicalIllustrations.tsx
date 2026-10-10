import React from 'react';

/**
 * BotanicalCornerFoliage
 * Rich botanical branch and leaf sprigs used for organic framing
 * on corners (top-left, bottom-right) matching Screens 1, 2, 3, 4, 6 in reference.
 */
export const BotanicalCornerFoliage: React.FC<{
  position?: 'top-left' | 'top-right' | 'bottom-right' | 'bottom-left';
  className?: string;
}> = ({ position = 'bottom-right', className = 'w-32 h-32' }) => {
  if (position === 'top-left') {
    return (
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        {/* Main hanging stem */}
        <path d="M-10 -10 C30 20 60 70 80 120" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M-10 15 C25 35 45 65 60 95" stroke="#235340" strokeWidth="1.8" strokeLinecap="round" />
        
        {/* Leaf 1 */}
        <path d="M20 15 C45 10 65 25 55 45 C40 55 25 35 20 15 Z" fill="#2D5A47" opacity="0.9" />
        <path d="M20 15 Q40 28 55 45" stroke="#7CB39A" strokeWidth="0.8" />
        
        {/* Leaf 2 */}
        <path d="M35 40 C65 35 85 55 70 75 C55 85 40 60 35 40 Z" fill="#3D735C" opacity="0.85" />
        <path d="M35 40 Q55 58 70 75" stroke="#8DC4AC" strokeWidth="0.8" />

        {/* Leaf 3 */}
        <path d="M50 70 C80 70 100 95 85 115 C65 120 55 95 50 70 Z" fill="#235340" opacity="0.95" />
        
        {/* Leaf 4 (hanging tip) */}
        <path d="M75 110 C95 125 105 145 90 155 C80 155 70 135 75 110 Z" fill="#4B856D" opacity="0.9" />
        
        {/* Leftward side leaves */}
        <path d="M10 35 C0 55 5 75 25 70 C35 60 25 45 10 35 Z" fill="#1C4535" opacity="0.9" />
        <path d="M25 65 C15 85 20 105 40 100 C50 90 40 75 25 65 Z" fill="#336650" opacity="0.85" />
        
        {/* Delicate bud accents */}
        <circle cx="58" cy="48" r="2" fill="#C96B4B" />
        <circle cx="73" cy="78" r="2" fill="#C96B4B" />
      </svg>
    );
  }

  if (position === 'top-right') {
    return (
      <svg
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`pointer-events-none select-none ${className}`}
        aria-hidden="true"
      >
        <path d="M170 -10 C130 20 100 70 80 120" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M140 15 C115 10 95 25 105 45 C120 55 135 35 140 15 Z" fill="#2D5A47" opacity="0.9" />
        <path d="M125 40 C95 35 75 55 90 75 C105 85 120 60 125 40 Z" fill="#3D735C" opacity="0.85" />
        <path d="M110 70 C80 70 60 95 75 115 C95 120 105 95 110 70 Z" fill="#235340" opacity="0.95" />
        <path d="M85 110 C65 125 55 145 70 155 C80 155 90 135 85 110 Z" fill="#4B856D" opacity="0.9" />
      </svg>
    );
  }

  // Default: bottom-right corner foliage (prominently seen across screens 2, 3, 4, 6)
  return (
    <svg
      viewBox="0 0 180 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none ${className}`}
      aria-hidden="true"
    >
      {/* Primary Stem rising from bottom-right */}
      <path d="M190 190 C150 150 110 110 70 80" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M160 170 C125 130 90 90 50 60" stroke="#235340" strokeWidth="1.8" strokeLinecap="round" />
      
      {/* Lower Leaf pair */}
      <path d="M150 160 C120 170 100 150 115 130 C135 120 155 140 150 160 Z" fill="#1C4535" opacity="0.9" />
      <path d="M160 145 C175 120 160 95 140 110 C130 125 145 145 160 145 Z" fill="#2D5A47" opacity="0.95" />
      
      {/* Middle Leaf pair */}
      <path d="M115 130 C85 140 65 120 80 100 C100 90 120 110 115 130 Z" fill="#3D735C" opacity="0.85" />
      <path d="M125 110 C140 85 125 60 105 75 C95 90 110 110 125 110 Z" fill="#4B856D" opacity="0.9" />

      {/* Upper Leaf pair */}
      <path d="M80 100 C50 110 30 90 45 70 C65 60 85 80 80 100 Z" fill="#235340" opacity="0.95" />
      <path d="M90 80 C105 55 90 30 70 45 C60 60 75 80 90 80 Z" fill="#336650" opacity="0.85" />

      {/* Terminal Bud / Top Leaf */}
      <path d="M50 60 C25 65 15 45 30 30 C45 25 55 45 50 60 Z" fill="#5A9E82" opacity="0.9" />

      {/* Terracotta Botanical Seed Accents */}
      <circle cx="118" cy="115" r="2.2" fill="#C96B4B" />
      <circle cx="83" cy="85" r="2" fill="#C96B4B" />
      <circle cx="52" cy="50" r="1.8" fill="#C96B4B" />
    </svg>
  );
};

/**
 * BotanicalRevealBorder
 * Lush foliage garland border framing the top and bottom of Screen 4 (Investigation Reveal).
 */
export const BotanicalRevealBorder: React.FC<{
  position?: 'top' | 'bottom';
  className?: string;
}> = ({ position = 'top', className = 'w-full h-16' }) => {
  const isTop = position === 'top';
  return (
    <svg
      viewBox="0 0 400 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full overflow-hidden pointer-events-none select-none ${className} ${isTop ? '' : 'rotate-180'}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {/* Background branch line */}
      <path d="M-10 10 Q100 25 200 15 T410 15" stroke="#12372A" strokeWidth="2" strokeLinecap="round" />
      
      {/* Garland of botanical leaves hanging down */}
      <g fill="#1E4738" opacity="0.9">
        <path d="M20 15 C10 35 30 50 45 40 C55 30 40 18 20 15 Z" />
        <path d="M60 18 C50 42 75 55 90 42 C98 32 80 20 60 18 Z" fill="#2E634F" />
        <path d="M110 20 C100 45 125 58 140 45 C148 35 130 22 110 20 Z" />
        <path d="M160 18 C150 42 175 55 190 42 C198 32 180 20 160 18 Z" fill="#3E7D64" />
        <path d="M210 16 C200 40 225 53 240 40 C248 30 230 18 210 16 Z" />
        <path d="M260 18 C250 42 275 55 290 42 C298 32 280 20 260 18 Z" fill="#2E634F" />
        <path d="M310 17 C300 41 325 54 340 41 C348 31 330 19 310 17 Z" />
        <path d="M360 16 C350 40 375 53 390 40 C398 30 380 18 360 16 Z" fill="#1E4738" />
      </g>
      
      {/* Secondary overlapping layer */}
      <g fill="#4E8C72" opacity="0.8">
        <path d="M40 16 C32 32 48 44 60 36 C68 28 55 18 40 16 Z" />
        <path d="M90 19 C82 35 98 47 110 39 C118 31 105 21 90 19 Z" />
        <path d="M140 19 C132 35 148 47 160 39 C168 31 155 21 140 19 Z" />
        <path d="M190 17 C182 33 198 45 210 37 C218 29 205 19 190 17 Z" />
        <path d="M240 17 C232 33 248 45 260 37 C268 29 255 19 240 17 Z" />
        <path d="M290 18 C282 34 298 46 310 38 C318 30 305 20 290 18 Z" />
        <path d="M340 17 C332 33 348 45 360 37 C368 29 355 19 340 17 Z" />
      </g>

      {/* Terracotta bud dots */}
      <circle cx="50" cy="22" r="2.5" fill="#C96B4B" />
      <circle cx="100" cy="25" r="2.5" fill="#C96B4B" />
      <circle cx="150" cy="25" r="2.5" fill="#C96B4B" />
      <circle cx="200" cy="23" r="2.5" fill="#C96B4B" />
      <circle cx="250" cy="23" r="2.5" fill="#C96B4B" />
      <circle cx="300" cy="24" r="2.5" fill="#C96B4B" />
      <circle cx="350" cy="23" r="2.5" fill="#C96B4B" />
    </svg>
  );
};

/**
 * DarkForestBackdrop
 * Immersive, atmospheric dark pine forest background for Field Mode (Screen 5).
 * Deep forest green (#07150E), towering pine trunks, and sunlight filtering through foliage.
 */
export const DarkForestBackdrop: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <svg
    viewBox="0 0 600 1000"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full object-cover overflow-hidden select-none pointer-events-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Atmospheric dark forest with tall pine trees"
  >
    <defs>
      <linearGradient id="forestDepth" x1="300" y1="0" x2="300" y2="1000" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#0B1A12" />
        <stop offset="40%" stopColor="#091810" />
        <stop offset="70%" stopColor="#06120C" />
        <stop offset="100%" stopColor="#040D08" />
      </linearGradient>

      {/* Sunbeam Angle */}
      <linearGradient id="sunBeam" x1="150" y1="0" x2="450" y2="800" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#89B49F" stopOpacity="0.22" />
        <stop offset="50%" stopColor="#4A7563" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#0B1A12" stopOpacity="0" />
      </linearGradient>

      {/* Canopy Light Speckles */}
      <radialGradient id="canopyGlow" cx="300" cy="180" r="250" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2D5A46" stopOpacity="0.4" />
        <stop offset="60%" stopColor="#122A20" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#07150E" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Base Forest Tone */}
    <rect width="600" height="1000" fill="url(#forestDepth)" />

    {/* Ambient Canopy Glow */}
    <rect width="600" height="500" fill="url(#canopyGlow)" />

    {/* Sunbeam Streams filtering through branches */}
    <polygon points="120,0 220,0 420,900 280,900" fill="url(#sunBeam)" />
    <polygon points="260,0 340,0 540,850 430,850" fill="url(#sunBeam)" opacity="0.7" />

    {/* Distant Tree Trunks (Misty Silhouettes) */}
    <g fill="#0E2319" opacity="0.6">
      <rect x="70" y="0" width="18" height="1000" />
      <rect x="180" y="0" width="14" height="1000" />
      <rect x="340" y="0" width="16" height="1000" />
      <rect x="440" y="0" width="22" height="1000" />
      <rect x="520" y="0" width="15" height="1000" />
    </g>

    {/* Mid-ground Tree Trunks */}
    <g fill="#091A12">
      <rect x="30" y="0" width="28" height="1000" />
      <rect x="130" y="0" width="32" height="1000" />
      <rect x="250" y="0" width="36" height="1000" />
      <rect x="390" y="0" width="30" height="1000" />
      <rect x="490" y="0" width="38" height="1000" />
    </g>

    {/* Foreground Pine Silhouette Trunks with Bark Texture */}
    <rect x="-10" y="0" width="45" height="1000" fill="#040D08" />
    <rect x="555" y="0" width="55" height="1000" fill="#040D08" />

    {/* Forest Canopy Needles / Foliage Drooping from Top */}
    <g fill="#143324" opacity="0.85">
      <path d="M0 0 C80 60 140 100 220 50 C290 10 340 70 420 30 C500 80 550 40 600 0 L600 0 L0 0 Z" />
      <path d="M0 40 C70 120 160 140 240 90 C320 60 380 130 460 70 C520 120 570 90 600 50 L600 0 L0 0 Z" fill="#0E271B" />
    </g>

    {/* Forest Floor Fern & Undergrowth silhouettes at bottom */}
    <g fill="#06120B">
      <path d="M0 920 C60 880 120 940 180 910 C240 870 300 930 360 890 C420 860 480 920 540 880 C570 870 590 900 600 890 L600 1000 L0 1000 Z" />
    </g>
  </svg>
);

/**
 * MountainLandscapeIllustration
 * Rich, multi-layered mountain landscape with warm golden sunrise,
 * naturalist on rocky bluff, soaring birds, pine ridges, and "Same Sky. New Eyes." seal.
 */
export const MountainLandscapeIllustration: React.FC<{
  className?: string;
  showHiker?: boolean;
  showQuote?: boolean;
}> = ({ className = 'w-full h-auto', showHiker = true, showQuote = true }) => (
  <svg
    viewBox="0 0 960 520"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`overflow-hidden select-none ${className}`}
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Mountain landscape with naturalist observing wilderness at dawn"
  >
    <defs>
      {/* Sky Gradient: Morning pale teal-mist to warm parchment cream */}
      <linearGradient id="mntSkyGrad" x1="480" y1="0" x2="480" y2="520" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#E2EBE5" />
        <stop offset="28%" stopColor="#ECE9DF" />
        <stop offset="65%" stopColor="#F6F3EA" />
        <stop offset="100%" stopColor="#FAF7F0" />
      </linearGradient>

      {/* Sun Radiant Aura */}
      <radialGradient id="mntSunAura" cx="720" cy="180" r="220" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FDE6B8" stopOpacity="0.8" />
        <stop offset="35%" stopColor="#F8C472" stopOpacity="0.45" />
        <stop offset="68%" stopColor="#EFA450" stopOpacity="0.16" />
        <stop offset="100%" stopColor="#FAF7F0" stopOpacity="0" />
      </radialGradient>

      {/* Golden Sunrise Sun Disc Core */}
      <radialGradient id="mntSunCore" cx="715" cy="175" r="82" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFF2C6" />
        <stop offset="45%" stopColor="#F7C15B" />
        <stop offset="100%" stopColor="#E69334" />
      </radialGradient>

      {/* Tier 1: Distant Alpine Peaks (Lit East Faces) */}
      <linearGradient id="tier1Lit" x1="480" y1="90" x2="680" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#B6D3C8" />
        <stop offset="50%" stopColor="#9ABFB2" />
        <stop offset="100%" stopColor="#79A394" />
      </linearGradient>

      {/* Tier 1: Distant Alpine Peaks (Shaded West Faces) */}
      <linearGradient id="tier1Shade" x1="260" y1="90" x2="480" y2="300" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#96B8AC" />
        <stop offset="50%" stopColor="#769C8E" />
        <stop offset="100%" stopColor="#5B8374" />
      </linearGradient>

      {/* Tier 2: Mid Mountain Ridge */}
      <linearGradient id="tier2Mid" x1="480" y1="180" x2="480" y2="390" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4A7968" />
        <stop offset="50%" stopColor="#356152" />
        <stop offset="100%" stopColor="#254B3E" />
      </linearGradient>

      {/* Tier 3: Coniferous Fore-Ridge */}
      <linearGradient id="tier3Fore" x1="480" y1="280" x2="480" y2="520" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#214A3A" />
        <stop offset="50%" stopColor="#153629" />
        <stop offset="100%" stopColor="#0B2118" />
      </linearGradient>

      {/* Winding Alpine River */}
      <linearGradient id="riverGrad" x1="200" y1="320" x2="650" y2="345" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#A8CFBE" />
        <stop offset="50%" stopColor="#82AD9C" />
        <stop offset="100%" stopColor="#5F8C7C" />
      </linearGradient>

      {/* Rock Bluff Promontory */}
      <linearGradient id="bluffRock" x1="720" y1="250" x2="940" y2="520" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2D4137" />
        <stop offset="40%" stopColor="#1E2F26" />
        <stop offset="100%" stopColor="#0D1913" />
      </linearGradient>
    </defs>

    {/* Sky Backdrop */}
    <rect width="960" height="520" fill="url(#mntSkyGrad)" />

    {/* Golden Sunrise Orb & Radiant Aura */}
    <circle cx="720" cy="180" r="210" fill="url(#mntSunAura)" />
    <circle cx="720" cy="180" r="76" fill="url(#mntSunCore)" />

    {/* Distant Ridge Cross / Survey Pin */}
    <line x1="720" y1="135" x2="720" y2="158" stroke="#1D392E" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />
    <line x1="715" y1="143" x2="725" y2="143" stroke="#1D392E" strokeWidth="1.8" strokeLinecap="round" opacity="0.7" />

    {/* Soaring Alpine Birds */}
    <g stroke="#1A382C" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85">
      <path d="M260 90 Q267 82 274 88 Q281 82 288 90" />
      <path d="M295 105 Q300 99 305 103 Q310 99 315 105" />
      <path d="M235 115 Q239 110 243 113 Q247 110 251 115" />
      <path d="M430 70 Q436 62 442 68 Q448 62 454 70" />
      <path d="M465 82 Q470 76 475 80 Q480 76 485 82" />
      <path d="M510 98 Q515 92 520 96 Q525 92 530 98" />
      <path d="M620 120 Q625 114 630 118 Q635 114 640 120" />
    </g>

    {/* Mountain Layer 1: Distant Alpine Peaks (Organic & Sculpted) */}
    {/* West Shadow Facets */}
    <path
      d="M0 260 L90 190 L170 220 L275 130 L360 200 L480 105 L590 190 L680 155 L780 215 L960 180 L960 380 L0 380 Z"
      fill="url(#tier1Shade)"
      opacity="0.92"
    />
    {/* East Lit Facets */}
    <path
      d="M275 130 L360 200 L480 105 L590 190 L680 155 L780 215 L960 180 L960 380 L480 380 Z"
      fill="url(#tier1Lit)"
      opacity="0.88"
    />
    {/* Snowfield / Couloir Highlights on High Peaks */}
    <path
      d="M275 130 L260 162 L275 152 L290 162 Z M480 105 L458 142 L480 132 L502 142 Z M680 155 L666 182 L680 174 L694 182 Z"
      fill="#F5FCF7"
      opacity="0.85"
    />

    {/* Soft Valley Mist Drift Band 1 */}
    <path
      d="M0 270 C160 240 320 280 490 250 C650 225 800 260 960 235 L960 305 C790 290 620 315 450 290 C280 300 120 285 0 305 Z"
      fill="#F7F4EB"
      opacity="0.75"
    />

    {/* Mountain Layer 2: Mid-Distance Forested Range */}
    <path
      d="M0 315
         C80 260 180 245 280 275
         C370 225 480 230 580 270
         C670 235 770 245 870 280
         L960 270 L960 440 L0 440 Z"
      fill="url(#tier2Mid)"
      opacity="0.95"
    />

    {/* Mid Ridge Conifer Tree Clusters */}
    <g fill="#214A3B" opacity="0.8">
      {[40, 75, 115, 150, 190, 230, 275, 320, 365, 410, 455, 505, 550, 595, 640, 685, 730, 775].map((x, i) => (
        <polygon
          key={`mid-${i}`}
          points={`${x},${280 + (i % 3) * 12} ${x - 9},${318 + (i % 3) * 12} ${x + 9},${318 + (i % 3) * 12}`}
        />
      ))}
    </g>

    {/* Alpine Glacial River in Valley Basin */}
    <path
      d="M110 338
         C230 330 310 348 430 332
         C520 320 600 336 680 324
         L700 334
         C610 348 530 332 440 344
         C320 360 220 344 90 350 Z"
      fill="url(#riverGrad)"
    />
    <path
      d="M170 338 C280 334 380 345 490 334"
      stroke="#D6ECE2"
      strokeWidth="1.8"
      strokeLinecap="round"
      opacity="0.7"
    />

    {/* Valley Mist Soft Band 2 */}
    <path
      d="M0 350 C180 320 380 355 580 330 C720 315 820 340 960 345 L960 380 C800 365 520 385 260 360 L0 375 Z"
      fill="#F5F3EC"
      opacity="0.6"
    />

    {/* Mountain Layer 3: Foreground Pine Ridges */}
    <path
      d="M0 360
         C70 325 140 315 210 348
         C290 305 380 318 460 360
         C550 320 640 330 730 380
         C800 360 880 370 960 405
         L960 520 L0 520 Z"
      fill="url(#tier3Fore)"
    />

    {/* Dense Conifer Trees across Foreground Ridges */}
    <g fill="#0C251A">
      {[15, 35, 60, 90, 120, 155, 190, 225, 260, 300, 340, 380, 420, 460, 505, 550, 595, 640, 685].map((x, i) => (
        <g key={`fg-${i}`}>
          {/* Tree Trunk */}
          <rect x={x - 1.5} y={375 + (i % 4) * 10} width="3" height="30" fill="#241B14" />
          {/* Lower Tier */}
          <polygon points={`${x},${360 + (i % 4) * 10} ${x - 13},${398 + (i % 4) * 10} ${x + 13},${398 + (i % 4) * 10}`} />
          {/* Middle Tier */}
          <polygon points={`${x},${348 + (i % 4) * 10} ${x - 10},${378 + (i % 4) * 10} ${x + 10},${378 + (i % 4) * 10}`} fill="#102D20" />
          {/* Top Tier */}
          <polygon points={`${x},${336 + (i % 4) * 10} ${x - 7},${360 + (i % 4) * 10} ${x + 7},${360 + (i % 4) * 10}`} fill="#163929" />
        </g>
      ))}
    </g>

    {/* Rocky Bluff Promontory on the Right */}
    <path
      d="M680 520
         L720 420
         L760 395
         L795 345
         L830 320
         L860 300
         L900 300
         L935 320
         L960 340
         L960 520 Z"
      fill="url(#bluffRock)"
    />

    {/* Rock Crags, Highlights & Fractures */}
    <g stroke="#486E5B" strokeWidth="1.5" strokeLinecap="round" opacity="0.65">
      <path d="M795 345 L825 385 L845 450" />
      <path d="M830 320 L860 370 L890 460" />
      <path d="M860 300 L885 340 L910 420" />
      <path d="M740 405 L780 445" />
      <path d="M800 415 L850 480" />
    </g>
    {/* Rock Edge Highlight */}
    <path
      d="M795 345 L830 320 L860 300 L900 300"
      stroke="#79A893"
      strokeWidth="2"
      strokeLinecap="round"
      opacity="0.8"
    />

    {/* Naturalist / Hiker Silhouette Figure */}
    {showHiker && (
      <g id="naturalist-figure">
        {/* Stone Shadow Under Boots */}
        <ellipse cx="880" cy="303" rx="14" ry="3.5" fill="#08140E" opacity="0.85" />

        {/* Sturdy Hiking Boots */}
        <line x1="875" y1="284" x2="874" y2="302" stroke="#12231A" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="884" y1="284" x2="885" y2="302" stroke="#12231A" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M870 302 H877" stroke="#251810" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M881 302 H889" stroke="#251810" strokeWidth="3.5" strokeLinecap="round" />

        {/* Trousers */}
        <path d="M873 268 L875 286" stroke="#1A3326" strokeWidth="5.5" strokeLinecap="round" />
        <path d="M883 268 L885 286" stroke="#1A3326" strokeWidth="5.5" strokeLinecap="round" />

        {/* Field Coat & Torso */}
        <rect x="871" y="246" width="16" height="30" rx="3.5" fill="#274838" />

        {/* Naturalist Backpack / Rucksack with Terracotta Accent */}
        <rect x="862" y="248" width="11" height="22" rx="3" fill="#C96B4B" />
        <path d="M862 258 H873" stroke="#9E4627" strokeWidth="1.5" />
        <path d="M862 264 H873" stroke="#9E4627" strokeWidth="1.2" />

        {/* Head & Naturalist Wide-Brimmed Field Hat */}
        <circle cx="879" cy="236" r="5.5" fill="#E4D2B8" />
        <ellipse cx="879" cy="231" rx="9.5" ry="2.5" fill="#1C3829" />
        <path d="M874 231 C874 225 884 225 884 231 Z" fill="#1C3829" />

        {/* Left Arm & Naturalist Walking Staff */}
        <path d="M873 252 L862 272 L858 304" stroke="#5E3E20" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M874 252 L868 266" stroke="#274838" strokeWidth="3.8" strokeLinecap="round" />

        {/* Right Arm Resting on Hip */}
        <path d="M885 252 L891 264 L886 272" stroke="#274838" strokeWidth="3.8" strokeLinecap="round" />
      </g>
    )}

    {/* "Same Sky. New Eyes." Artistic Naturalist Seal Stamp */}
    {showQuote && (
      <g transform="translate(750, 395)" className="select-none pointer-events-none">
        {/* Background Seal Disk */}
        <circle cx="85" cy="45" r="44" fill="#FCFBF7" stroke="#E7E0D3" strokeWidth="1.8" />
        {/* Inner Dotted Ring */}
        <circle cx="85" cy="45" r="39" fill="none" stroke="#2F5C4A" strokeWidth="1" strokeDasharray="3.5 3.5" />
        {/* Center Botanical Leaf Sprig */}
        <path d="M79 53 C83 44 89 38 94 34" stroke="#12372A" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="86" cy="43" r="2.5" fill="#2F5C4A" />
        <circle cx="92" cy="37" r="2" fill="#C96B4B" />
        {/* Typography */}
        <text x="85" y="27" textAnchor="middle" fill="#12372A" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="11" fontWeight="600">
          Same Sky.
        </text>
        <text x="85" y="69" textAnchor="middle" fill="#12372A" fontFamily="Newsreader, Georgia, serif" fontStyle="italic" fontSize="11" fontWeight="600">
          New Eyes.
        </text>
      </g>
    )}

    {/* Hanging Botanical Leaf Sprig in Top-Left Corner */}
    <g transform="translate(0, 0)">
      <path d="M-10 -10 C30 18 65 60 85 102" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M22 18 C48 12 64 28 54 50 C38 60 28 38 22 18 Z" fill="#2D5A47" opacity="0.95" />
      <path d="M38 45 C68 40 84 62 68 84 C52 94 42 66 38 45 Z" fill="#3D735C" opacity="0.9" />
      <path d="M55 78 C82 78 96 98 86 114 C70 120 60 98 55 78 Z" fill="#235340" opacity="0.95" />
      <circle cx="58" cy="48" r="2.2" fill="#C96B4B" />
      <circle cx="75" cy="82" r="2" fill="#C96B4B" />
    </g>
  </svg>
);

/**
 * SpecimenArtwork
 * High-fidelity, organic, and botanically rich illustrations for the 6 discoveries:
 * 1. moss_on_stone — velvet moss cushion on rough granite with water droplets
 * 2. rainwater_flow — damp sidewalk pavement with sorted quartz sediment curves
 * 3. lichen_crusts — weathered oak bark with mint and golden foliose lichen & apothecia
 * 4. leaf_venation — backlit translucent green leaf blade with intricate reticulated net
 * 5. ant_trails — concrete pavement seam with marching worker ants
 * 6. diurnal_leaves — plant stem with compound leaflets angled towards dawn light
 */
export const SpecimenArtwork: React.FC<{
  type: 'moss_on_stone' | 'weathering' | 'weathering_shale' | 'rainwater_flow' | 'lichen_crusts' | 'leaf_venation' | 'ant_trails' | 'diurnal_leaves' | string;
  className?: string;
}> = ({ type, className = 'w-full h-full object-cover' }) => {
  const norm = (type || '').toLowerCase().trim();

  let src = '/images/leaf-veins.jpg';
  let alt = 'Leaf Vein Patterns - Translucent backlit green leaf blade with reticulated venation';
  let bgColor = 'bg-[#122E1A]';

  if (norm === 'moss_on_stone' || norm.includes('moss')) {
    src = '/images/moss-on-stone.jpg';
    alt = 'Moss on Stone - Velvet cushions with spore capsules on rough stone';
    bgColor = 'bg-[#2D332B]';
  } else if (norm === 'weathering' || norm === 'weathering_shale' || norm.includes('weather') || norm.includes('shale') || (norm.includes('stone') && !norm.includes('moss')) || norm.includes('rock')) {
    src = '/images/weathering-shale.jpg';
    alt = 'Weathering - Geological outcrop of weathered, flaking shale rock layers and sediment';
    bgColor = 'bg-[#2B2B2B]';
  } else if (norm === 'rainwater_flow' || norm.includes('rain') || norm.includes('water') || norm.includes('flow')) {
    src = '/images/rainwater-flow.jpg';
    alt = 'Rainwater Flow Patterns - Clear stream water flowing over stones with ripples';
    bgColor = 'bg-[#1E2E2A]';
  } else if (norm === 'lichen_crusts' || norm.includes('lichen')) {
    src = '/images/lichen-crusts.jpg';
    alt = 'Lichen Crusts - Real grey-green and orange lichen with apothecia discs on oak bark';
    bgColor = 'bg-[#322A22]';
  } else if (norm === 'leaf_venation' || norm.includes('leaf') || norm.includes('vein')) {
    src = '/images/leaf-veins.jpg';
    alt = 'Leaf Vein Patterns - Translucent backlit green leaf blade with reticulated venation';
    bgColor = 'bg-[#122E1A]';
  } else if (norm === 'ant_trails' || norm.includes('ant')) {
    src = '/images/ant-trails.jpg';
    alt = 'Ant Trails - Wood ants foraging across natural foliage in macro detail';
    bgColor = 'bg-[#2A241E]';
  } else if (norm === 'diurnal_leaves' || norm.includes('diurnal') || norm.includes('movement')) {
    src = '/images/diurnal-leaves.jpg';
    alt = 'Diurnal Leaf Movements - Oxalis triangularis leaflets exhibiting nyctinastic folding';
    bgColor = 'bg-[#251A2C]';
  }

  return (
    <div className={`relative overflow-hidden ${bgColor} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover select-none transition-transform duration-500 hover:scale-105"
        loading="lazy"
      />
    </div>
  );
};

/**
 * BotanicalSproutEmptyState
 * Naturalist sprout emerging from soil mound for zero-discovery states.
 */
export const BotanicalSproutEmptyState: React.FC<{ className?: string }> = ({
  className = 'w-24 h-24',
}) => (
  <svg
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Seedling emerging from soil"
  >
    {/* Soil Mound */}
    <ellipse cx="60" cy="98" rx="42" ry="10" fill="#E7E0D3" />
    <ellipse cx="60" cy="96" rx="36" ry="7" fill="#C9BFAC" opacity="0.6" />
    <path
      d="M30 96 C42 93 54 94 60 96 C66 94 78 93 90 96"
      stroke="#12372A"
      strokeWidth="1.2"
      strokeLinecap="round"
      opacity="0.4"
    />
    
    {/* Main Stem */}
    <path
      d="M60 95 C60 75 58 55 60 40"
      stroke="#12372A"
      strokeWidth="2.5"
      strokeLinecap="round"
    />

    {/* Left Leaf */}
    <path
      d="M59 62 C40 58 35 44 44 40 C55 36 60 52 59 62 Z"
      fill="#4F6F52"
      stroke="#12372A"
      strokeWidth="1.5"
    />
    <path d="M59 62 C49 52 42 45 44 40" stroke="#FCFBF7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

    {/* Right Leaf */}
    <path
      d="M60 54 C78 50 82 36 74 32 C64 28 59 44 60 54 Z"
      fill="#4F6F52"
      stroke="#12372A"
      strokeWidth="1.5"
    />
    <path d="M60 54 C70 44 76 37 74 32" stroke="#FCFBF7" strokeWidth="1" strokeLinecap="round" opacity="0.6" />

    {/* Tiny Emerging Sprout Tip */}
    <circle cx="60" cy="38" r="2" fill="#2F8175" />
  </svg>
);

/**
 * BotanicalLeafSprig
 * Small decorative leaf sprig icon.
 */
export const BotanicalLeafSprig: React.FC<{
  className?: string;
  color?: string;
  accent?: string;
}> = ({
  className = 'w-6 h-6',
  color = '#12372A',
  accent = '#C96B4B',
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-hidden="true"
  >
    <path d="M6 26 C12 20 18 12 26 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    <path
      d="M10 22 C7 20 6 15 11 16 C14 17 13 21 10 22 Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M14 20 C18 21 21 19 20 15 C17 14 14 17 14 20 Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M15 15 C12 13 11 8 16 9 C19 10 18 14 15 15 Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M19 13 C23 14 26 12 25 8 C22 7 19 10 19 13 Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="1.2"
    />
    <path
      d="M22 8 C25 5 28 5 27 9 C25 11 23 10 22 8 Z"
      fill={color}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="1.2"
    />
    <circle cx="21" cy="18" r="1.5" fill={accent} />
    <circle cx="11" cy="12" r="1.2" fill={accent} opacity="0.85" />
  </svg>
);

/**
 * BotanicalCategoryIllustration
 * Illustrated cards for the 3 disciplines:
 * - science: Botanical leaves and venation
 * - community: Forest canopy and trees
 * - everyday: Pavement crack, moss and micro-texture
 */
export const BotanicalCategoryIllustration: React.FC<{
  category: 'science' | 'community' | 'everyday' | 'edge';
  className?: string;
}> = ({ category, className = 'w-full h-36' }) => {
  switch (category) {
    case 'science':
      return (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Botanical Science">
          <rect width="240" height="140" fill="#F4F8F5" rx="8" />
          {/* Detailed botanical branch */}
          <path d="M20 120 C60 90 120 50 200 30" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M50 100 C30 80 40 50 65 65 C80 75 70 95 50 100 Z" fill="#2E644E" opacity="0.9" />
          <path d="M85 85 C75 55 105 40 125 58 C135 70 115 85 85 85 Z" fill="#3D7D62" opacity="0.85" />
          <path d="M125 65 C115 35 145 20 165 38 C175 50 155 65 125 65 Z" fill="#4C9173" opacity="0.9" />
          <circle cx="100" cy="70" r="2.5" fill="#C96B4B" />
          <circle cx="140" cy="50" r="2.5" fill="#C96B4B" />
        </svg>
      );
    case 'community':
      return (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Community and Environment">
          <rect width="240" height="140" fill="#F0F7F5" rx="8" />
          {/* Layered Tree Canopies */}
          <circle cx="70" cy="75" r="45" fill="#2D6657" opacity="0.85" />
          <circle cx="120" cy="65" r="50" fill="#205244" opacity="0.95" />
          <circle cx="170" cy="80" r="42" fill="#3D7D6C" opacity="0.8" />
          <rect x="66" y="90" width="8" height="40" fill="#38291F" rx="2" />
          <rect x="116" y="85" width="9" height="45" fill="#291E16" rx="2" />
          <rect x="166" y="95" width="8" height="35" fill="#38291F" rx="2" />
        </svg>
      );
    case 'everyday':
    default:
      return (
        <svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} preserveAspectRatio="xMidYMid slice" role="img" aria-label="Everyday Discovery">
          <rect width="240" height="140" fill="#F9F5EE" rx="8" />
          {/* Concrete / Stone Cobblestone Texture */}
          <rect x="20" y="25" width="85" height="50" rx="6" fill="#E6DFD3" stroke="#D3C9BA" strokeWidth="1.5" />
          <rect x="115" y="25" width="105" height="50" rx="6" fill="#DFD7CB" stroke="#D3C9BA" strokeWidth="1.5" />
          <rect x="35" y="85" width="110" height="45" rx="6" fill="#DFD7CB" stroke="#D3C9BA" strokeWidth="1.5" />
          <rect x="155" y="85" width="65" height="45" rx="6" fill="#E6DFD3" stroke="#D3C9BA" strokeWidth="1.5" />
          {/* Moss cushion growing in the crack */}
          <ellipse cx="110" cy="75" rx="22" ry="12" fill="#4F8535" />
          <ellipse cx="150" cy="80" rx="15" ry="9" fill="#6EA84D" />
          <circle cx="108" cy="73" r="1.5" fill="#B2E06A" />
        </svg>
      );
  }
};

/**
 * BotanicalWaxSeal
 * Circular naturalist wax seal.
 */
export const BotanicalWaxSeal: React.FC<{
  className?: string;
  label?: string;
}> = ({ className = 'w-10 h-10', label = 'FIELDNOTE' }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Naturalist seal"
  >
    <circle cx="24" cy="24" r="22" fill="#12372A" />
    <circle cx="24" cy="24" r="19" stroke="#E7E0D3" strokeWidth="1" strokeDasharray="2 2" />
    <path d="M18 28 C21 23 25 19 30 16" stroke="#FCFBF7" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="22" cy="22" r="2" fill="#C96B4B" />
    <circle cx="27" cy="18" r="1.5" fill="#E7E0D3" />
    <text x="24" y="38" textAnchor="middle" fill="#E7E0D3" fontFamily="JetBrains Mono, monospace" fontSize="5" letterSpacing="1">
      {label}
    </text>
  </svg>
);

/**
 * BotanicalElementsDecor
 * Subtle decorative botanical artwork referencing daisies, ferns, and wildflowers
 * from reference 07. Botanical Elements (/images/botanical-elements.png).
 */
export const BotanicalElementsDecor: React.FC<{
  className?: string;
  style?: React.CSSProperties;
}> = ({ className = 'w-48 h-auto opacity-30 pointer-events-none select-none', style }) => (
  <div className={`overflow-hidden select-none pointer-events-none ${className}`} style={style}>
    <img
      src="/images/botanical-elements.png"
      alt="Subtle botanical elements"
      className="w-full h-full object-contain"
      loading="lazy"
    />
  </div>
);

