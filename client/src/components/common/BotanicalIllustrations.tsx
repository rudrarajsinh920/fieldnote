import React from 'react';

/**
 * BotanicalHeroForest
 * Immersive illustrated forest canopy with layered teal and forest foliage,
 * gentle morning mist, and warm sunlight accents (inspired by Reference 1 & 3).
 */
export const BotanicalHeroForest: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 800 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto overflow-hidden ${className}`}
    preserveAspectRatio="xMidYMid slice"
    role="img"
    aria-label="Layered forest canopy and botanical landscape"
  >
    <defs>
      <linearGradient id="skyGrad" x1="400" y1="0" x2="400" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#EAF3EE" />
        <stop offset="50%" stopColor="#F5F3EC" />
        <stop offset="100%" stopColor="#F7F4EC" />
      </linearGradient>

      <linearGradient id="distantRidge" x1="0" y1="80" x2="800" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#4A7569" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#2F8175" stopOpacity="0.2" />
      </linearGradient>

      <linearGradient id="midTrees" x1="400" y1="110" x2="400" y2="280" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#285E53" />
        <stop offset="100%" stopColor="#1E473F" />
      </linearGradient>

      <linearGradient id="foreCanopy" x1="400" y1="160" x2="400" y2="320" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#184335" />
        <stop offset="100%" stopColor="#12372A" />
      </linearGradient>

      <radialGradient id="sunGlow" cx="240" cy="70" r="160" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FCEFD8" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#EAE5D4" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#F7F4EC" stopOpacity="0" />
      </radialGradient>

      <pattern id="leafVeinPattern" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M0 10 Q10 0 20 10 T40 10" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75" fill="none" />
      </pattern>
    </defs>

    {/* Atmospheric Sky Background */}
    <rect width="800" height="320" fill="url(#skyGrad)" />

    {/* Sun / Dawn Glow */}
    <circle cx="240" cy="70" r="120" fill="url(#sunGlow)" />

    {/* Distant Mountain / Forest Horizon */}
    <path
      d="M0 170 Q120 130 260 145 T540 130 T800 160 L800 320 L0 320 Z"
      fill="url(#distantRidge)"
    />

    {/* Layer 2: Mid-distance Pine & Deciduous Ridge */}
    <path
      d="M0 195 
         C40 185 70 175 100 190 
         C140 170 180 165 220 185 
         C270 160 320 165 370 180 
         C430 155 490 160 550 185 
         C610 165 670 175 730 185 
         L800 195 L800 320 L0 320 Z"
      fill="url(#midTrees)"
      opacity="0.88"
    />

    {/* Mid-ground Tree Silhouettes (Geometric botanicals) */}
    <g fill="#205045" opacity="0.75">
      {/* Pine clusters */}
      <polygon points="120,135 110,175 130,175" />
      <polygon points="120,120 112,150 128,150" />
      <polygon points="145,140 137,175 153,175" />
      <polygon points="340,130 330,170 350,170" />
      <polygon points="340,115 332,145 348,145" />
      <polygon points="580,125 570,165 590,165" />
      <polygon points="580,110 572,140 588,140" />
      <polygon points="610,135 602,170 618,170" />
    </g>

    {/* Morning Mist Drift */}
    <path
      d="M0 215 C200 200 400 225 600 205 C700 195 760 210 800 215 L800 235 C600 220 400 240 200 220 L0 235 Z"
      fill="#F5F3EC"
      opacity="0.55"
    />

    {/* Foreground Canopy: Rich Forest Green (#12372A / #184335) */}
    <path
      d="M-20 225 
         C30 190 90 200 140 220 
         C190 180 260 185 310 215 
         C370 175 440 180 490 210 
         C550 170 630 180 690 215 
         C740 190 780 200 820 225 
         L820 320 L-20 320 Z"
      fill="url(#foreCanopy)"
    />

    {/* Foreground Leaf Vein Overlays */}
    <rect y="210" width="800" height="110" fill="url(#leafVeinPattern)" />

    {/* Elegant Fern / Frond Details in Foreground Left */}
    <g stroke="#3D6B58" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.65">
      <path d="M40 320 C50 270 75 240 110 225" />
      <path d="M60 285 Q75 280 85 288" />
      <path d="M70 270 Q85 262 95 272" />
      <path d="M82 255 Q98 248 105 258" />
      <path d="M95 242 Q108 238 112 248" />
    </g>

    {/* Foreground Botanical Branch Right */}
    <g stroke="#3D6B58" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.65">
      <path d="M760 320 C750 270 725 245 690 230" />
      <path d="M740 285 Q725 280 715 288" />
      <path d="M730 270 Q715 262 705 272" />
      <path d="M718 255 Q702 248 695 258" />
    </g>

    {/* Warm Dawn Sun Dust / Spores */}
    <g fill="#DE8466" opacity="0.7">
      <circle cx="280" cy="110" r="1.5" />
      <circle cx="310" cy="95" r="1" />
      <circle cx="260" cy="130" r="1.2" />
      <circle cx="350" cy="120" r="1.5" />
      <circle cx="420" cy="140" r="1" />
    </g>

    {/* Elegant Cardinal Axis / Horizon Line */}
    <line x1="20" y1="318" x2="780" y2="318" stroke="#CEC5B5" strokeWidth="1" strokeDasharray="4 6" opacity="0.5" />
  </svg>
);

/**
 * BotanicalLeafSprig
 * Editorial leaf illustration (Reference 2 style) with botanical veins
 * and restrained terracotta berry/bud accent.
 */
export const BotanicalLeafSprig: React.FC<{ className?: string; color?: string; accent?: string }> = ({
  className = 'w-6 h-6',
  color = '#2F8175',
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
    {/* Central Stem */}
    <path d="M6 26 C12 20 18 12 26 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

    {/* Leaf Pairs */}
    {/* Bottom Left Leaf */}
    <path
      d="M10 22 C7 20 6 15 11 16 C14 17 13 21 10 22 Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Bottom Right Leaf */}
    <path
      d="M14 20 C18 21 21 19 20 15 C17 14 14 17 14 20 Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Middle Left Leaf */}
    <path
      d="M15 15 C12 13 11 8 16 9 C19 10 18 14 15 15 Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Middle Right Leaf */}
    <path
      d="M19 13 C23 14 26 12 25 8 C22 7 19 10 19 13 Z"
      fill={color}
      fillOpacity="0.25"
      stroke={color}
      strokeWidth="1.2"
    />
    {/* Terminal Leaf Top */}
    <path
      d="M22 8 C25 5 28 5 27 9 C25 11 23 10 22 8 Z"
      fill={color}
      fillOpacity="0.35"
      stroke={color}
      strokeWidth="1.2"
    />

    {/* Restrained Terracotta Botanical Bud */}
    <circle cx="21" cy="18" r="1.5" fill={accent} />
    <circle cx="11" cy="12" r="1.2" fill={accent} opacity="0.85" />
  </svg>
);

/**
 * BotanicalCategoryIllustration
 * Distinct, richly detailed visual artwork for the three disciplines:
 * 1. "science" = School & Science (Botany, Lichen, Dissection, Cellular Geometry)
 * 2. "community" = Community & Environment (Urban Canopy, Water Corridors, Foliage)
 * 3. "everyday" = Everyday Discovery (Sunlit Cobblestone, Fissures, Seedling)
 */
export const BotanicalCategoryIllustration: React.FC<{
  category: 'science' | 'community' | 'everyday' | 'edge';
  className?: string;
}> = ({ category, className = 'w-full h-36' }) => {
  if (category === 'edge') {
    return (
      <svg
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full overflow-hidden ${className}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Built vs Wild: Brick and asphalt boundary meeting living soil and moss"
      >
        <rect width="240" height="140" fill="#F8F4EE" rx="4" />
        {/* Left half: Man-made brick/mortar structure */}
        <rect x="0" y="0" width="118" height="140" fill="#F1ECE1" />
        <g stroke="#C96B4B" strokeWidth="1" opacity="0.6">
          <line x1="10" y1="35" x2="115" y2="35" />
          <line x1="10" y1="70" x2="115" y2="70" />
          <line x1="10" y1="105" x2="115" y2="105" />
          <line x1="50" y1="10" x2="50" y2="35" />
          <line x1="85" y1="35" x2="85" y2="70" />
          <line x1="35" y1="70" x2="35" y2="105" />
          <line x1="75" y1="105" x2="75" y2="135" />
        </g>

        {/* Central Boundary Division (The Edge) */}
        <line x1="118" y1="0" x2="118" y2="140" stroke="#17201B" strokeWidth="2" strokeDasharray="4 2" />

        {/* Right half: Wild soil & foliage */}
        <rect x="118" y="0" width="122" height="140" fill="#EAF3EE" />
        <circle cx="180" cy="70" r="50" fill="#4F6F52" fillOpacity="0.15" />

        {/* Living Moss Creeping Across the Boundary */}
        <g fill="#4F6F52">
          <circle cx="118" cy="45" r="7" fill="#4F6F52" />
          <circle cx="114" cy="52" r="5" fill="#2F8175" />
          <circle cx="124" cy="42" r="6" fill="#12372A" />
          <circle cx="118" cy="85" r="8" fill="#4F6F52" />
          <circle cx="110" cy="88" r="5" fill="#698E6C" />
          <circle cx="125" cy="82" r="6.5" fill="#2F8175" />
        </g>

        {/* Climbing Tendril / Ivy Root crossing border */}
        <path
          d="M170 125 C145 100 130 90 105 75 C85 62 80 50 65 45"
          stroke="#12372A"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Ivy Leaves */}
        <path d="M135 96 C138 90 148 92 144 100 Z" fill="#2F8175" />
        <path d="M102 74 C96 70 94 78 100 80 Z" fill="#4F6F52" />
        <path d="M78 52 C72 48 70 56 76 58 Z" fill="#2F8175" />

        {/* Specimen Index Badge in Mono */}
        <rect x="18" y="14" width="76" height="18" rx="2" fill="#FCFBF7" stroke="#CEC5B5" strokeWidth="0.75" />
        <text x="24" y="27" fill="#12372A" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
          BORDER • 04
        </text>
      </svg>
    );
  }
  if (category === 'science') {
    return (
      <svg
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full overflow-hidden ${className}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="School & Science: Botanical venation and anatomical study"
      >
        <rect width="240" height="140" fill="#EBF4F2" rx="4" />
        {/* Soft Teal Gradient Wash */}
        <circle cx="170" cy="40" r="80" fill="#2F8175" fillOpacity="0.12" />
        <circle cx="60" cy="110" r="60" fill="#4F6F52" fillOpacity="0.1" />

        {/* Delicate Geometric Micro-grid (Science / Laboratory Field Book) */}
        <g stroke="#2F8175" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.3">
          <line x1="20" y1="20" x2="220" y2="20" />
          <line x1="20" y1="70" x2="220" y2="70" />
          <line x1="20" y1="120" x2="220" y2="120" />
          <line x1="40" y1="10" x2="40" y2="130" />
          <line x1="120" y1="10" x2="120" y2="130" />
          <line x1="200" y1="10" x2="200" y2="130" />
        </g>

        {/* Large Botanical Leaf Venation Diagram */}
        <g stroke="#1E5850" strokeWidth="1.2" strokeLinecap="round">
          {/* Main Petiole / Midrib */}
          <path d="M40 115 C75 90 120 60 185 35" stroke="#12372A" strokeWidth="2" />
          {/* Lateral Secondary Veins */}
          <path d="M70 95 C60 80 62 65 72 58" />
          <path d="M85 85 C100 80 112 85 125 98" />
          <path d="M100 75 C90 60 96 48 108 42" />
          <path d="M120 65 C135 60 148 68 158 80" />
          <path d="M140 55 C132 40 140 32 152 28" />
          <path d="M160 46 C172 44 180 50 188 60" />
        </g>

        {/* Leaf Silhouette Wash */}
        <path
          d="M40 115 
             C30 90 50 55 100 35 
             C140 20 185 30 195 38 
             C185 65 160 95 120 110 
             C80 125 50 125 40 115 Z"
          fill="#2F8175"
          fillOpacity="0.14"
          stroke="#2F8175"
          strokeWidth="1.2"
        />

        {/* Magnifying Naturalist Focal Ring */}
        <circle cx="115" cy="68" r="32" stroke="#2F8175" strokeWidth="1.5" strokeDasharray="2 3" fill="none" />
        <circle cx="115" cy="68" r="28" fill="#FFFFFF" fillOpacity="0.35" />
        {/* Acuity Mark */}
        <circle cx="115" cy="68" r="2.5" fill="#C96B4B" />

        {/* Specimen Index Badge in Mono */}
        <rect x="18" y="14" width="70" height="18" rx="2" fill="#FCFBF7" stroke="#CEC5B5" strokeWidth="0.75" />
        <text x="24" y="27" fill="#12372A" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
          BOTANY • 01
        </text>
      </svg>
    );
  }

  if (category === 'community') {
    return (
      <svg
        viewBox="0 0 240 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`w-full overflow-hidden ${className}`}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label="Community & Environment: Urban canopy, watersheds, and bio-corridors"
      >
        <rect width="240" height="140" fill="#F4F3EB" rx="4" />
        {/* Soft Moss & Forest Background Wash */}
        <circle cx="60" cy="50" r="70" fill="#4F6F52" fillOpacity="0.15" />
        <circle cx="180" cy="90" r="75" fill="#12372A" fillOpacity="0.12" />

        {/* River / Water Corridor Meander */}
        <path
          d="M0 85 C50 75 80 100 120 90 C160 80 190 105 240 95"
          stroke="#46A093"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M0 85 C50 75 80 100 120 90 C160 80 190 105 240 95"
          stroke="#2F8175"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Connected Urban Tree Canopy Nodes */}
        <g fill="#12372A">
          {/* Tree Cluster Left */}
          <circle cx="65" cy="60" r="18" fill="#1B4D3C" fillOpacity="0.85" />
          <circle cx="50" cy="70" r="14" fill="#2E6953" fillOpacity="0.85" />
          <circle cx="75" cy="72" r="15" fill="#12372A" fillOpacity="0.9" />
          {/* Trunk */}
          <path d="M65 78 L65 98" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />

          {/* Tree Cluster Right */}
          <circle cx="175" cy="50" r="22" fill="#1B4D3C" fillOpacity="0.9" />
          <circle cx="195" cy="58" r="16" fill="#4F6F52" fillOpacity="0.85" />
          <circle cx="160" cy="62" r="15" fill="#12372A" fillOpacity="0.9" />
          {/* Trunk */}
          <path d="M175 72 L175 96" stroke="#12372A" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Bio-corridor Connector Dashline */}
        <path
          d="M65 60 Q120 30 175 50"
          stroke="#C96B4B"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          fill="none"
        />
        {/* Core Pollinator / Wildlife Node */}
        <circle cx="120" cy="38" r="4.5" fill="#C96B4B" />
        <circle cx="120" cy="38" r="8" stroke="#C96B4B" strokeWidth="0.75" strokeDasharray="2 2" />

        {/* Specimen Index Badge in Mono */}
        <rect x="18" y="14" width="76" height="18" rx="2" fill="#FCFBF7" stroke="#CEC5B5" strokeWidth="0.75" />
        <text x="24" y="27" fill="#12372A" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
          CANOPY • 02
        </text>
      </svg>
    );
  }

  // Everyday Discovery
  return (
    <svg
      viewBox="0 0 240 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full overflow-hidden ${className}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Everyday Discovery: Lichen in fissures, shadow shifts, tactile textures"
    >
      <rect width="240" height="140" fill="#FBF8EE" rx="4" />
      {/* Stone & Terracotta Warm Glow */}
      <circle cx="180" cy="35" r="70" fill="#DE8466" fillOpacity="0.14" />
      <circle cx="70" cy="100" r="60" fill="#CEC5B5" fillOpacity="0.25" />

      {/* Stone / Pavement Surface Fissure */}
      <path
        d="M20 120 
           L60 95 
           L85 100 
           L110 75 
           L145 80 
           L180 50 
           L220 40"
        stroke="#17201B"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.75"
      />
      {/* Subsidiary Fissure branching */}
      <path d="M110 75 L118 60 L135 55" stroke="#17201B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />
      <path d="M85 100 L95 118" stroke="#17201B" strokeWidth="1.2" strokeLinecap="round" opacity="0.5" />

      {/* Cryptogamic Moss / Lichen Colonies along Fissure */}
      <g fill="#4F6F52">
        <circle cx="106" cy="74" r="5" fill="#4F6F52" fillOpacity="0.8" />
        <circle cx="114" cy="72" r="3.5" fill="#698E6C" />
        <circle cx="111" cy="78" r="4" fill="#2F8175" fillOpacity="0.9" />
        <circle cx="140" cy="80" r="4.5" fill="#4F6F52" />
        <circle cx="147" cy="77" r="3" fill="#698E6C" />
        <circle cx="64" cy="94" r="4" fill="#4F6F52" />
      </g>

      {/* Young Seedling Sprouting from the Fissure */}
      <g stroke="#12372A" strokeWidth="1.5" strokeLinecap="round" fill="none">
        <path d="M110 75 C110 60 108 50 104 42" />
        {/* Left Cotyledon Leaf */}
        <path
          d="M104 45 C98 42 94 45 96 50 C99 53 103 48 104 45 Z"
          fill="#4F6F52"
          fillOpacity="0.85"
        />
        {/* Right Cotyledon Leaf */}
        <path
          d="M104 42 C110 39 114 42 112 47 C109 50 105 45 104 42 Z"
          fill="#2F8175"
          fillOpacity="0.9"
        />
      </g>

      {/* Sunlight Ray Beam */}
      <path d="M150 15 L120 70 L95 130" stroke="#C96B4B" strokeWidth="1" strokeDasharray="3 4" opacity="0.45" />

      {/* Specimen Index Badge in Mono */}
      <rect x="18" y="14" width="76" height="18" rx="2" fill="#FCFBF7" stroke="#CEC5B5" strokeWidth="0.75" />
      <text x="24" y="27" fill="#12372A" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.08em">
        MICRO • 03
      </text>
    </svg>
  );
};

/**
 * BotanicalCompassRose
 * Tactile naturalist observation compass dial with delicate leaf notches
 */
export const BotanicalCompassRose: React.FC<{ className?: string }> = ({ className = 'w-48 h-48' }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Naturalist observation compass"
  >
    {/* Outer Ring */}
    <circle cx="100" cy="100" r="92" stroke="#CEC5B5" strokeWidth="1.2" />
    <circle cx="100" cy="100" r="88" stroke="#12372A" strokeWidth="0.5" strokeOpacity="0.4" />

    {/* Concentric Observation Scale */}
    <circle cx="100" cy="100" r="72" stroke="#2F8175" strokeWidth="1" strokeDasharray="2 4" strokeOpacity="0.6" />
    <circle cx="100" cy="100" r="52" stroke="#CEC5B5" strokeWidth="0.75" />
    <circle cx="100" cy="100" r="32" fill="#FCFBF7" stroke="#12372A" strokeWidth="1" />

    {/* Subtle 30-degree Ticks */}
    <g stroke="#859189" strokeWidth="1">
      <line x1="100" y1="12" x2="100" y2="20" />
      <line x1="100" y1="180" x2="100" y2="188" />
      <line x1="12" y1="100" x2="20" y2="100" />
      <line x1="180" y1="100" x2="188" y2="100" />
    </g>

    {/* Cardinal Marks */}
    <text x="100" y="27" textAnchor="middle" fill="#17201B" fontSize="10" fontFamily="monospace" fontWeight="600">
      N
    </text>
    <text x="100" y="178" textAnchor="middle" fill="#859189" fontSize="9" fontFamily="monospace">
      S
    </text>
    <text x="25" y="103" textAnchor="middle" fill="#859189" fontSize="9" fontFamily="monospace">
      W
    </text>
    <text x="175" y="103" textAnchor="middle" fill="#859189" fontSize="9" fontFamily="monospace">
      E
    </text>

    {/* Central Botanical Star / Terracotta Leaf Point */}
    <g fill="#C96B4B">
      <polygon points="100,68 103,97 100,100 97,97" />
      <polygon points="100,132 103,103 100,100 97,103" fill="#A35034" opacity="0.7" />
      <polygon points="68,100 97,103 100,100 97,97" fill="#DE8466" opacity="0.8" />
      <polygon points="132,100 103,103 100,100 103,97" fill="#DE8466" opacity="0.8" />
    </g>
    <circle cx="100" cy="100" r="3.5" fill="#12372A" />
    <circle cx="100" cy="100" r="1.5" fill="#FCFBF7" />
  </svg>
);

/**
 * BotanicalWaxSeal
 * Authentic editorial wax/embossed naturalist seal for completed journal entries.
 */
export const BotanicalWaxSeal: React.FC<{ className?: string; label?: string }> = ({
  className = 'w-14 h-14',
  label = 'OBSERVED',
}) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label={`Botanical wax seal: ${label}`}
  >
    <circle cx="32" cy="32" r="30" fill="#12372A" />
    <circle cx="32" cy="32" r="26" stroke="#4F6F52" strokeWidth="1.2" strokeDasharray="3 2" />
    {/* Inner Leaf Emblem */}
    <path
      d="M32 16 C38 22 40 32 32 44 C24 32 26 22 32 16 Z"
      fill="#F7F4EC"
      fillOpacity="0.9"
    />
    <path d="M32 16 L32 44" stroke="#12372A" strokeWidth="1" />
    <path d="M32 26 Q36 24 38 26" stroke="#12372A" strokeWidth="0.75" />
    <path d="M32 32 Q28 30 26 32" stroke="#12372A" strokeWidth="0.75" />
    {/* Terracotta Central Core */}
    <circle cx="32" cy="32" r="2" fill="#C96B4B" />
  </svg>
);
