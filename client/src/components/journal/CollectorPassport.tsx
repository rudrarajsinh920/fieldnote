import React from 'react';
import { JournalEntry } from '@fieldnote/shared';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';

interface CollectorPassportProps {
  entries: JournalEntry[];
  onBackToNotes: () => void;
}

interface PassportStamp {
  id: string;
  name: string;
  sub: string;
  discipline: string;
  earned: boolean;
  earnedDate?: string;
  iconText: string;
  description: string;
}

export const CollectorPassport: React.FC<CollectorPassportProps> = ({
  entries,
  onBackToNotes,
}) => {
  const totalScreenAwaySeconds = entries.reduce(
    (sum, e) => sum + (e.observation.actualDurationSeconds || 0),
    0
  );

  const hasScience = entries.some(
    (e) =>
      e.discovery?.fieldCategory?.toLowerCase().includes('science') ||
      e.discovery?.fieldCategory?.toLowerCase().includes('botan') ||
      e.investigation.title?.toLowerCase().includes('venation')
  );

  const hasCommunity = entries.some(
    (e) =>
      e.discovery?.fieldCategory?.toLowerCase().includes('community') ||
      e.discovery?.fieldCategory?.toLowerCase().includes('canopy') ||
      e.discovery?.fieldCategory?.toLowerCase().includes('water')
  );

  const hasEveryday = entries.some(
    (e) =>
      e.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
      e.discovery?.fieldCategory?.toLowerCase().includes('micro') ||
      e.discovery?.fieldCategory?.toLowerCase().includes('lichen')
  );

  const hasDeepPresence = entries.some(
    (e) => (e.observation.actualDurationSeconds || 0) >= 30
  );

  const hasPhotoSpecimen = entries.some((e) => Boolean(e.observation.photoUri));

  const hasMultipleFolios = entries.length >= 3;

  const STAMPS: PassportStamp[] = [
    {
      id: 'venation',
      name: 'Foliar Venation',
      sub: 'BOTANICAL CELLULAR MATRIX',
      discipline: 'School & Science',
      earned: hasScience,
      iconText: '🌿',
      description: 'Traced leaf vascular architecture and cellular fluid networks.',
    },
    {
      id: 'canopy',
      name: 'Urban Canopy',
      sub: 'COMMUNITY ARBOREAL CORRIDORS',
      discipline: 'Community & Environment',
      earned: hasCommunity,
      iconText: '🌳',
      description: 'Mapped neighborhood shade corridors, soil drainage, and bio-pathways.',
    },
    {
      id: 'micro',
      name: 'Micro-Habitats',
      sub: 'CRYPTOGAMIC CRUSTS & FISSURES',
      discipline: 'Everyday Discovery',
      earned: hasEveryday,
      iconText: '✦',
      description: 'Examined pavement seams, moss colonies, and organisms living in stone cracks.',
    },
    {
      id: 'presence',
      name: 'Deep Presence',
      sub: 'POCKET PROTOCOL HONORED',
      discipline: 'Sensory Immersion',
      earned: hasDeepPresence,
      iconText: '⏱',
      description: 'Put phone away for 30+ seconds to observe physical reality directly.',
    },
    {
      id: 'herbarium',
      name: 'Herbarium Keeper',
      sub: 'PHYSICAL SPECIMEN COLLECTED',
      discipline: 'Archival Study',
      earned: hasPhotoSpecimen,
      iconText: '📷',
      description: 'Attached an authentic photographic or charcoal specimen record to a folio.',
    },
    {
      id: 'naturalist',
      name: 'Field Naturalist',
      sub: 'TRIO OF COMPLETED FOLIOS',
      discipline: 'Logbook Inscription',
      earned: hasMultipleFolios,
      iconText: '🎖',
      description: 'Sealed three or more physical field investigations into your permanent journal.',
    },
  ];

  const earnedCount = STAMPS.filter((s) => s.earned).length;

  return (
    <div className="space-y-8 animate-journal-entry">
      {/* Passport Header Banner */}
      <section className="p-6 sm:p-10 rounded-sm border border-stone-deep/60 bg-[#FAF6ED] shadow-journal space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-deep/40 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <BotanicalLeafSprig className="w-5 h-5 text-forest" />
              <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
                Naturalist Field Passport
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium tracking-tight">
              Collector's Credential
            </h1>
            <p className="font-serif italic text-sm text-ink-muted">
              Authentic inked stamps certifying physical observation fieldwork.
            </p>
          </div>

          <button
            onClick={onBackToNotes}
            className="text-xs font-mono uppercase tracking-wider text-forest hover:text-botanical-teal transition-colors self-start sm:self-auto min-h-[44px] flex items-center"
          >
            ← Back to Folios
          </button>
        </div>

        {/* Physical Stats Ribbon */}
        <div className="grid grid-cols-3 gap-3 pt-2 text-center">
          <div className="p-3 rounded-[2px] bg-paper-bright border border-stone-deep/40">
            <span className="block font-mono text-2xl font-bold text-forest">
              {entries.length}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              Folios Inscribed
            </span>
          </div>

          <div className="p-3 rounded-[2px] bg-paper-bright border border-stone-deep/40">
            <span className="block font-mono text-2xl font-bold text-terracotta">
              {totalScreenAwaySeconds}s
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              Screen-Away Notice
            </span>
          </div>

          <div className="p-3 rounded-[2px] bg-paper-bright border border-stone-deep/40">
            <span className="block font-mono text-2xl font-bold text-botanical-teal">
              {earnedCount} / {STAMPS.length}
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-ink-muted">
              Stamps Inked
            </span>
          </div>
        </div>
      </section>

      {/* Grid of Inked Passport Stamps */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-deep/30 pb-2">
          <h2 className="font-serif text-xl sm:text-2xl text-ink font-medium">
            Inked Botanical Seals
          </h2>
          <span className="font-mono text-xs text-ink-faint">
            Earned through physical presence
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {STAMPS.map((stamp) => (
            <div
              key={stamp.id}
              className={`p-5 rounded-sm border transition-all flex flex-col justify-between min-h-[220px] relative overflow-hidden ${
                stamp.earned
                  ? 'bg-paper-bright border-forest/60 shadow-journal-subtle'
                  : 'bg-paper/40 border-stone-deep/30 opacity-60'
              }`}
            >
              {/* Authenticated Inked Rubber Stamp Graphic */}
              <div className="flex items-start justify-between">
                <div
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-xl select-none rotate-[-6deg] transition-transform ${
                    stamp.earned
                      ? 'border-[#C96B4B] text-[#C96B4B] bg-[#C96B4B]/10 shadow-sm'
                      : 'border-stone-deep/60 text-ink-faint border-dashed'
                  }`}
                >
                  <span>{stamp.iconText}</span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-[2px] font-mono text-[9px] uppercase tracking-wider font-semibold ${
                    stamp.earned
                      ? 'bg-forest/10 text-forest border border-forest/30'
                      : 'bg-stone-light/60 text-ink-faint'
                  }`}
                >
                  {stamp.earned ? '✓ INKED' : 'AWAITING'}
                </span>
              </div>

              {/* Title & Narrative */}
              <div className="space-y-1 my-3">
                <span className="font-mono text-[9px] uppercase tracking-wider text-terracotta font-semibold block">
                  {stamp.sub}
                </span>
                <h3 className="font-serif text-lg font-medium text-ink leading-snug">
                  {stamp.name}
                </h3>
                <p className="font-sans text-xs text-ink-muted leading-relaxed">
                  {stamp.description}
                </p>
              </div>

              {/* Discipline Footer */}
              <div className="pt-2 border-t border-stone-deep/20 text-[10px] font-mono text-ink-faint flex items-center justify-between">
                <span>{stamp.discipline}</span>
                {stamp.earned && <span className="text-forest font-semibold">Certified</span>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
