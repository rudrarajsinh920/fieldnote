import React, { useState } from 'react';
import { JournalEntry } from '@fieldnote/shared';
import { SpecimenArtwork, BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import {
  MapPin,
  ArrowRight,
  Clock,
  Calendar,
  Compass,
  CheckCircle2,
} from 'lucide-react';

interface FieldObservationMapProps {
  entries: JournalEntry[];
  onSelectEntry: (entry: JournalEntry) => void;
  onBackToJournal: () => void;
}

interface MapCoordinate {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  sector: string;
  elevation: string;
}

// Fixed botanical coordinates for canonical reference specimens
const SECTOR_COORDINATES: Record<string, MapCoordinate> = {
  entry_moss_stone: { x: 28, y: 36, sector: 'Shaded Granite Outcrop', elevation: '142m' },
  entry_rainwater_flow: { x: 68, y: 72, sector: 'Concrete Drainage Basin', elevation: '136m' },
  entry_lichen_crusts: { x: 78, y: 28, sector: 'Ancient Oak Stand', elevation: '149m' },
  entry_leaf_vein: { x: 44, y: 22, sector: 'Sunlit Deciduous Canopy', elevation: '145m' },
  entry_ant_trails: { x: 62, y: 56, sector: 'Mortar Seam Corridor', elevation: '138m' },
  entry_diurnal_leaves: { x: 22, y: 68, sector: 'Meadow Light Gradient', elevation: '140m' },
};

export const FieldObservationMap: React.FC<FieldObservationMapProps> = ({
  entries,
  onSelectEntry,
  onBackToJournal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'botany' | 'community' | 'everyday'>('all');
  const [selectedEntryId, setSelectedEntryId] = useState<string>(entries[0]?.id || '');
  const [mapLayer, setMapLayer] = useState<'topo' | 'grid'>('topo');

  const filteredEntries = entries.filter((entry) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'botany') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('botan') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('science') ||
        entry.investigation.title?.toLowerCase().includes('venation') ||
        entry.investigation.title?.toLowerCase().includes('moss')
      );
    }
    if (activeFilter === 'community') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('community') ||
        entry.investigation.title?.toLowerCase().includes('flow')
      );
    }
    if (activeFilter === 'everyday') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
        entry.investigation.title?.toLowerCase().includes('ant') ||
        entry.investigation.title?.toLowerCase().includes('lichen')
      );
    }
    return true;
  });

  const selectedEntry = entries.find((e) => e.id === selectedEntryId) || filteredEntries[0] || entries[0];

  // Helper to determine coordinates for any entry (canonical or custom)
  const getEntryCoordinate = (entry: JournalEntry, index: number): MapCoordinate => {
    if (SECTOR_COORDINATES[entry.id]) {
      return SECTOR_COORDINATES[entry.id];
    }
    // Deterministic pseudo-coordinates for dynamically added observations
    const seed = entry.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const x = 20 + ((seed * 17 + index * 23) % 60);
    const y = 20 + ((seed * 13 + index * 29) % 60);
    return {
      x,
      y,
      sector: entry.discovery?.fieldCategory || 'Local Field Sector',
      elevation: `${135 + (seed % 20)}m`,
    };
  };

  const selectedCoord = selectedEntry ? getEntryCoordinate(selectedEntry, 0) : null;
  let specType = 'moss_on_stone';
  if (selectedEntry?.observation?.photoUri?.startsWith('specimen:')) {
    specType = selectedEntry.observation.photoUri.replace('specimen:', '');
  } else if (selectedEntry) {
    const t = selectedEntry.investigation.title.toLowerCase();
    if (t.includes('moss')) specType = 'moss_on_stone';
    else if (t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) specType = 'weathering';
    else if (t.includes('rain') || t.includes('water')) specType = 'rainwater_flow';
    else if (t.includes('lichen')) specType = 'lichen_crusts';
    else if (t.includes('ant')) specType = 'ant_trails';
    else if (t.includes('diurnal') || t.includes('movement')) specType = 'diurnal_leaves';
    else if (t.includes('leaf') || t.includes('vein')) specType = 'leaf_venation';
  }
  const isCustomPhoto = selectedEntry?.observation?.photoUri && !selectedEntry.observation.photoUri.startsWith('specimen:');
  const durationMin = Math.round((selectedEntry?.observation?.actualDurationSeconds || 600) / 60) || 10;
  const dateStr = selectedEntry
    ? new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="space-y-6 sm:space-y-8 animate-journal-entry">
      {/* 1. Header & Map Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-semibold">
            <Compass className="w-4 h-4 text-forest" />
            <span>Field Cartography & Micro-Sites</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
            Observation Terrain Map
          </h1>
          <p className="font-sans text-xs sm:text-sm text-ink-muted">
            Locally indexed discovery waypoints and micro-climate quadrants.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start sm:self-auto">
          {/* Layer Toggle */}
          <div className="flex items-center rounded-xl border border-stone bg-paper-bright p-0.5 shadow-journal-subtle">
            <button
              type="button"
              onClick={() => setMapLayer('topo')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                mapLayer === 'topo'
                  ? 'bg-forest text-paper font-semibold shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Topographic
            </button>
            <button
              type="button"
              onClick={() => setMapLayer('grid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${
                mapLayer === 'grid'
                  ? 'bg-forest text-paper font-semibold shadow-sm'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Grid
            </button>
          </div>

          <button
            type="button"
            onClick={onBackToJournal}
            className="px-4 py-2 rounded-xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-ink font-semibold flex items-center transition-all shadow-journal-subtle"
          >
            <span>Folio Grid</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>

      {/* 2. Filter Tabs Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1" role="tablist">
          {(['all', 'botany', 'community', 'everyday'] as const).map((tab) => {
            const isSelected = activeFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all min-h-[36px] whitespace-nowrap ${
                  isSelected
                    ? 'bg-forest text-paper font-semibold shadow-journal-subtle'
                    : 'bg-paper-bright text-ink-muted hover:text-ink border border-stone'
                }`}
              >
                {tab === 'all' ? 'All Sites' : tab}
              </button>
            );
          })}
        </div>

        <div className="hidden sm:flex items-center space-x-2 text-xs font-mono text-ink-muted">
          <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
          <span>{filteredEntries.length} Active Waypoints</span>
        </div>
      </div>

      {/* 3. Main Map Grid: Interactive Canvas (Left 7-8 cols) + Selected Folio Card (Right 4-5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Interactive Topographic Map Canvas */}
        <div className="lg:col-span-8 rounded-3xl border border-stone bg-[#F7F4EB] overflow-hidden shadow-journal relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center select-none">
          {/* Background Vector Topographic Contours */}
          <svg
            viewBox="0 0 800 600"
            className="w-full h-full absolute inset-0 object-cover pointer-events-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="fieldGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2DAC9" strokeWidth="0.8" opacity="0.6" />
              </pattern>
            </defs>

            {/* Subtle Grid */}
            <rect width="800" height="600" fill="#F8F5EC" />
            <rect width="800" height="600" fill="url(#fieldGrid)" opacity={mapLayer === 'grid' ? 0.9 : 0.35} />

            {/* Topographic Elevation Contour Lines */}
            <g stroke="#C8BFAB" strokeWidth="1.2" opacity="0.75" strokeDasharray="4 2">
              <path d="M-50 200 C150 160 300 240 500 180 C680 130 750 220 850 180" />
              <path d="M-50 280 C180 230 350 310 520 250 C700 200 780 290 850 250" />
              <path d="M-50 360 C160 320 330 400 550 330 C720 280 800 370 850 330" />
              <path d="M-50 440 C140 400 310 470 520 420 C690 380 770 460 850 420" />
            </g>

            {/* River / Drainage Channel Vector (Community sector) */}
            <path
              d="M480 0 C500 150 620 280 650 450 C670 540 680 600 680 600"
              stroke="#A8CEBE"
              strokeWidth="18"
              strokeLinecap="round"
              opacity="0.55"
            />
            <path
              d="M480 0 C500 150 620 280 650 450 C670 540 680 600 680 600"
              stroke="#7CB39D"
              strokeWidth="2.5"
              fill="none"
              opacity="0.8"
            />

            {/* Shaded Stone Outcrop Ridge (Botany Sector) */}
            <path
              d="M120 180 C180 160 280 220 340 320 C320 420 220 450 140 380 Z"
              fill="#E3DDD0"
              stroke="#BDB4A1"
              strokeWidth="1.5"
              opacity="0.65"
            />
            <text x="180" y="270" fill="#8C816E" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2">
              GRANITE LEDGE
            </text>

            {/* Forest Canopy Quadrant */}
            <circle cx="360" cy="140" r="95" fill="#E0EBE3" opacity="0.6" />
            <text x="320" y="145" fill="#4A7560" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="2">
              CANOPY SECTOR
            </text>

            {/* Drainage Basin Label */}
            <text x="570" y="520" fill="#4B7A6E" fontFamily="JetBrains Mono, monospace" fontSize="10" letterSpacing="1.5">
              DRAINAGE CHANNEL
            </text>

            {/* Compass Rose Accent */}
            <g transform="translate(60, 80)" opacity="0.6">
              <circle cx="0" cy="0" r="28" stroke="#8C816E" strokeWidth="1" strokeDasharray="3 3" fill="none" />
              <polygon points="0,-24 5,-6 0,0 -5,-6" fill="#12372A" />
              <polygon points="0,24 5,6 0,0 -5,6" fill="#8C816E" />
              <text x="0" y="-28" textAnchor="middle" fill="#12372A" fontFamily="JetBrains Mono, monospace" fontSize="10" fontWeight="bold">N</text>
            </g>
          </svg>

          {/* Map Waypoint Pins */}
          {filteredEntries.map((entry, index) => {
            const coord = getEntryCoordinate(entry, index);
            const isSelected = selectedEntry?.id === entry.id;
            const seq = String(entry.investigation.sequenceNumber || index + 1).padStart(2, '0');

            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntryId(entry.id)}
                style={{ left: `${coord.x}%`, top: `${coord.y}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 transition-all ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                }`}
                aria-label={`Waypoint ${seq}: ${entry.investigation.title}`}
                title={`Folio ${seq}: ${entry.investigation.title}`}
              >
                {/* Pulse Ring when Selected */}
                {isSelected && (
                  <span className="absolute -inset-2 rounded-full bg-forest/25 animate-ping" />
                )}

                {/* Waypoint Marker Disc */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all shadow-md border-2 ${
                    isSelected
                      ? 'bg-forest text-paper border-paper-bright shadow-journal ring-2 ring-forest/50'
                      : 'bg-paper-bright text-forest border-stone hover:border-forest hover:bg-stone-light/50'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-paper' : 'text-forest'}`} />
                </div>

                {/* Hover / Active Badge Label */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-1.5 px-2 py-0.5 rounded-md bg-paper-bright/95 backdrop-blur-sm border border-stone shadow-sm whitespace-nowrap text-[10px] font-mono transition-opacity ${
                    isSelected ? 'opacity-100 text-forest font-semibold' : 'opacity-0 group-hover:opacity-100 text-ink-muted'
                  }`}
                >
                  Folio {seq}
                </div>
              </button>
            );
          })}

          {/* Micro-Site Compass / Watermark in Corner */}
          <div className="absolute bottom-4 left-4 bg-paper-bright/90 backdrop-blur-sm border border-stone/70 rounded-xl px-3 py-1.5 text-[11px] font-mono text-ink-muted shadow-sm flex items-center space-x-2">
            <BotanicalLeafSprig className="w-3.5 h-3.5 text-forest" />
            <span>FIELDNOTE LOCAL SENSORY GRID</span>
          </div>
        </div>

        {/* Selected Folio Inspection Panel (Right 4 cols) */}
        {selectedEntry && (
          <div className="lg:col-span-4 rounded-3xl border border-stone bg-paper-bright overflow-hidden shadow-journal p-5 sm:p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Waypoint Header */}
              <div className="flex items-center justify-between border-b border-stone-light/70 pb-3">
                <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
                  <span className="w-2 h-2 rounded-full bg-forest" />
                  <span>Selected Micro-Site</span>
                </div>
                <span className="font-mono text-xs text-terracotta font-semibold">
                  Folio {String(selectedEntry.investigation.sequenceNumber || 1).padStart(2, '0')}
                </span>
              </div>

              {/* Specimen Thumbnail Plate */}
              <div className="aspect-[16/10] w-full rounded-2xl overflow-hidden bg-stone-light/40 border border-stone/60 relative shadow-sm">
                {isCustomPhoto ? (
                  <img
                    src={selectedEntry.observation.photoUri}
                    alt={selectedEntry.investigation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <SpecimenArtwork type={specType} className="w-full h-full object-cover" />
                )}
                <div className="absolute bottom-2.5 right-2.5 bg-paper-bright/95 backdrop-blur-sm border border-stone/60 rounded-md px-2 py-0.5 text-[10px] font-mono text-forest font-semibold shadow-sm flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-moss" />
                  <span>{durationMin} min</span>
                </div>
              </div>

              {/* Title & Micro-Site Info */}
              <div className="space-y-1.5">
                <h3 className="font-serif text-xl sm:text-2xl font-medium text-ink leading-tight">
                  {selectedEntry.investigation.title}
                </h3>
                {selectedCoord && (
                  <p className="font-mono text-xs text-forest flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedCoord.sector} • Elev {selectedCoord.elevation}</span>
                  </p>
                )}
              </div>

              {/* Ground Truth User Observation Quote */}
              <div className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-stone/60 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted block font-semibold">
                  Field Evidence
                </span>
                <p className="font-serif italic text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-3">
                  “{selectedEntry.observation.rawNotes}”
                </p>
              </div>

              {/* Metadata Badges */}
              <div className="flex items-center justify-between text-xs font-mono text-ink-muted pt-1">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1 text-moss" />
                  {dateStr}
                </span>
                <span className="text-forest font-semibold uppercase">
                  {selectedEntry.discovery?.fieldCategory || 'Botany'}
                </span>
              </div>
            </div>

            {/* Inspect Folio Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onSelectEntry(selectedEntry)}
                className="w-full py-3 px-4 rounded-xl bg-forest hover:bg-forest-deep text-paper font-sans font-semibold text-xs tracking-wide shadow-journal flex items-center justify-center space-x-2 transition-all active:scale-[0.98]"
              >
                <span>Inspect Complete Folio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Quick Waypoint Strip */}
      <div className="rounded-2xl border border-stone bg-paper-bright p-4 sm:p-5 shadow-journal-subtle space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold">
            All Field Observation Waypoints ({filteredEntries.length})
          </span>
          <span className="text-xs font-mono text-ink-muted">Click any waypoint to center</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {filteredEntries.map((entry, idx) => {
            const isSelected = selectedEntry?.id === entry.id;
            const seq = String(entry.investigation.sequenceNumber || idx + 1).padStart(2, '0');
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setSelectedEntryId(entry.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-forest bg-forest/5 shadow-sm ring-1 ring-forest'
                    : 'border-stone hover:border-forest/50 bg-[#FAF7F0]'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-ink-muted">
                  <span>No. {seq}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-forest" />}
                </div>
                <div className="font-serif text-xs font-semibold text-ink truncate mt-1">
                  {entry.investigation.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
