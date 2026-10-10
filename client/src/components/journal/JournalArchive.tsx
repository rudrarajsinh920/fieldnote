import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import {
  BotanicalLeafSprig,
  BotanicalWaxSeal,
} from '../common/BotanicalIllustrations.js';
import { CollectorPassport } from './CollectorPassport.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import { JournalEntry } from '@fieldnote/shared';
import {
  Compass,
  Calendar,
  Pocket,
  ArrowLeft,
  ShieldCheck,
  Search,
  Award,
  Download,
} from 'lucide-react';

export const JournalArchive: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const { journalEntries } = state;
  const [viewMode, setViewMode] = useState<'folios' | 'passport'>('folios');
  const [activeFilter, setActiveFilter] = useState<'all' | 'science' | 'community' | 'everyday' | 'edge'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHerbariumEntry, setSelectedHerbariumEntry] = useState<JournalEntry | null>(null);

  const filterTabs = [
    { id: 'all' as const, label: 'All Folios', count: journalEntries.length },
    {
      id: 'science' as const,
      label: 'School & Science',
      count: journalEntries.filter((e) =>
        e.discovery?.fieldCategory?.toLowerCase().includes('science') ||
        e.discovery?.fieldCategory?.toLowerCase().includes('botan') ||
        e.investigation.title?.toLowerCase().includes('venation') ||
        e.investigation.title?.toLowerCase().includes('botan')
      ).length,
    },
    {
      id: 'community' as const,
      label: 'Community & Environment',
      count: journalEntries.filter((e) =>
        e.discovery?.fieldCategory?.toLowerCase().includes('community') ||
        e.discovery?.fieldCategory?.toLowerCase().includes('environ') ||
        e.investigation.title?.toLowerCase().includes('canopy') ||
        e.investigation.title?.toLowerCase().includes('water')
      ).length,
    },
    {
      id: 'everyday' as const,
      label: 'Everyday Discovery',
      count: journalEntries.filter((e) =>
        e.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
        e.discovery?.fieldCategory?.toLowerCase().includes('micro') ||
        e.investigation.title?.toLowerCase().includes('lichen') ||
        e.investigation.title?.toLowerCase().includes('shadow')
      ).length,
    },
    {
      id: 'edge' as const,
      label: 'Built vs. Wild',
      count: journalEntries.filter((e) =>
        e.discovery?.fieldCategory?.toLowerCase().includes('edge') ||
        e.discovery?.fieldCategory?.toLowerCase().includes('border') ||
        e.investigation.title?.toLowerCase().includes('mortar') ||
        e.investigation.title?.toLowerCase().includes('edge')
      ).length,
    },
  ];

  const filteredEntries = journalEntries.filter((entry) => {
    // Text search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = entry.investigation.title.toLowerCase().includes(q);
      const matchNotes = entry.observation.rawNotes.toLowerCase().includes(q);
      const matchPrompt = entry.investigation.prompt.toLowerCase().includes(q);
      const matchCategory = entry.discovery?.fieldCategory.toLowerCase().includes(q);
      if (!matchTitle && !matchNotes && !matchPrompt && !matchCategory) {
        return false;
      }
    }

    // Category tab filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'science') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('science') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('botan') ||
        entry.investigation.title?.toLowerCase().includes('venation') ||
        entry.investigation.title?.toLowerCase().includes('botan')
      );
    }
    if (activeFilter === 'community') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('community') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('environ') ||
        entry.investigation.title?.toLowerCase().includes('canopy') ||
        entry.investigation.title?.toLowerCase().includes('water')
      );
    }
    if (activeFilter === 'everyday') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('micro') ||
        entry.investigation.title?.toLowerCase().includes('lichen') ||
        entry.investigation.title?.toLowerCase().includes('shadow')
      );
    }
    if (activeFilter === 'edge') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('edge') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('border') ||
        entry.investigation.title?.toLowerCase().includes('mortar') ||
        entry.investigation.title?.toLowerCase().includes('edge')
      );
    }
    return true;
  });

  if (viewMode === 'passport') {
    return (
      <CollectorPassport
        entries={journalEntries}
        onBackToNotes={() => setViewMode('folios')}
      />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-journal-entry">
      {/* 1. ARCHIVE MASTHEAD */}
      <section className="journal-page p-6 sm:p-10 border border-stone-deep/40 rounded-sm bg-paper-bright flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-journal">
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <BotanicalLeafSprig className="w-5 h-5 text-forest" />
            <span className="font-mono text-xs tracking-widest text-ink-faint uppercase font-semibold">
              Permanent Field Archive • {journalEntries.length} {journalEntries.length === 1 ? 'Folio' : 'Folios'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium tracking-tight">
            The Naturalist's Logbook
          </h1>
          <p className="font-serif italic text-sm sm:text-base text-ink-muted max-w-lg">
            A permanent chronological record of physical observations and synthesized ecological dynamics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {/* Sub-view toggle: Folios vs Collector's Passport */}
          <button
            type="button"
            onClick={() => setViewMode('passport')}
            className="px-4 py-3 rounded-sm border border-terracotta/60 bg-terracotta/5 hover:bg-terracotta/10 text-xs font-mono uppercase tracking-wider text-terracotta font-semibold transition-colors flex items-center min-h-[48px]"
          >
            <Award className="w-4 h-4 mr-1.5" />
            Collector's Passport
          </button>

          <TactileButton
            onClick={() => navigate('setup')}
            variant="primary"
            className="px-6 py-3.5 text-sm font-semibold shadow-journal min-h-[48px]"
          >
            <Compass className="w-4 h-4 mr-2" />
            New Investigation
          </TactileButton>
        </div>
      </section>

      {/* 2. SEARCH & DISCIPLINE FILTER TABS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-deep/40 pb-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5" role="tablist">
          {filterTabs.map((tab) => {
            const isTabActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-[2px] text-xs font-mono tracking-wide transition-all min-h-[38px] flex items-center ${
                  isTabActive
                    ? 'bg-forest text-paper font-semibold shadow-journal-subtle'
                    : 'bg-paper text-ink-muted hover:text-ink hover:bg-stone-light/60 border border-stone-deep/30'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span
                    className={`ml-1.5 text-[10px] px-1.5 py-0.2 rounded-full ${
                      isTabActive ? 'bg-terracotta text-paper' : 'bg-stone-deep/40 text-ink'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search field records..."
            className="w-full pl-9 pr-3 py-1.5 rounded-[2px] border border-stone-deep/40 bg-paper-bright text-ink text-xs font-sans placeholder:text-ink-faint focus:border-forest focus:outline-none min-h-[38px]"
          />
        </div>
      </div>

      {/* 3. EMPTY STATE OR RECORD LIST */}
      {journalEntries.length === 0 ? (
        <div className="journal-page p-8 sm:p-14 text-center border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full border border-stone-deep/60 flex items-center justify-center text-forest bg-paper">
            <BotanicalWaxSeal className="w-10 h-10" label="OPEN" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <span className="font-mono text-xs tracking-widest text-ink-faint uppercase font-semibold block">
              Folio Open • Uninscribed
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl text-ink font-medium">
              The Logbook Lies Open
            </h2>
            <p className="font-serif italic text-sm text-ink-muted leading-relaxed">
              No field notes have been sealed yet. Step outside, let your phone rest in your pocket, and record your first physical observation.
            </p>
          </div>
          <div className="pt-2">
            <TactileButton
              onClick={() => navigate('setup')}
              variant="primary"
              className="min-h-[48px] px-8 text-sm font-semibold shadow-journal"
            >
              <Compass className="w-4 h-4 mr-2" />
              Begin First Investigation
            </TactileButton>
          </div>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="journal-page p-8 text-center border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-3">
          <p className="font-serif italic text-base text-ink-muted">
            No field notes match the selected filter or search query.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-forest uppercase tracking-wider underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        /* Vertical Journal Flow (Editorial Collectible Field Notes) */
        <div className="space-y-8">
          {filteredEntries.map((entry) => {
            const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <article
                key={entry.id}
                className="journal-page p-6 sm:p-10 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-6 hover:border-forest/40 transition-colors"
              >
                {/* 1. Header: Folio No & Meaningful Date */}
                <div className="border-b border-stone/80 pb-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-center space-x-2.5">
                    <BotanicalLeafSprig className="w-4 h-4 text-forest" />
                    <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
                      FOLIO NO. {String(entry.investigation.sequenceNumber).padStart(3, '0')}
                    </span>
                    <span className="text-stone-deep">•</span>
                    <span className="font-mono text-xs text-forest uppercase font-semibold">
                      {entry.discovery?.fieldCategory || 'Botanical Note'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono text-ink-muted">
                    {/* Herbarium Plate Export Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedHerbariumEntry(entry)}
                      className="px-2.5 py-1 rounded-[2px] bg-paper border border-stone-deep/50 hover:border-forest text-[11px] text-forest font-semibold flex items-center transition-colors"
                      title="Export as 18th-century Herbarium Specimen Sheet"
                    >
                      <Download className="w-3 h-3 mr-1 text-terracotta" />
                      Herbarium Plate
                    </button>

                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-moss" />
                      <span>{dateStr}</span>
                    </div>

                    {entry.observation.actualDurationSeconds > 0 && (
                      <>
                        <span className="text-stone-deep font-mono">•</span>
                        <span className="text-moss flex items-center">
                          <Pocket className="w-3.5 h-3.5 mr-1 text-terracotta" />
                          {entry.observation.actualDurationSeconds}s notice
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Investigation Title & Prompt */}
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-4xl text-ink font-medium tracking-tight">
                    {entry.investigation.title}
                  </h2>
                  <div className="border-l-2 border-stone-deep/60 pl-3.5 py-1 bg-paper-deep/20 rounded-r-sm">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint block">
                      Field Directive
                    </span>
                    <p className="font-serif italic text-sm text-ink-muted leading-relaxed">
                      “{entry.investigation.prompt}”
                    </p>
                  </div>
                </div>

                {/* 3. Observation Evidence (Observer's notes + photo/audio) */}
                <section className="space-y-3 border-l-2 border-forest pl-4 sm:pl-6 bg-paper py-3 rounded-r-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-forest font-semibold block">
                      Observed Evidence
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">Direct Record</span>
                  </div>
                  <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
                    “{entry.observation.rawNotes}”
                  </p>

                  {/* Photo Thumbnail if attached */}
                  {entry.observation.photoUri && (
                    <div className="pt-2">
                      <div className="inline-block border border-stone-deep/60 p-1 bg-paper-bright rounded-[2px] shadow-sm">
                        <img
                          src={entry.observation.photoUri}
                          alt="Field record specimen"
                          className="w-56 h-36 object-cover rounded-[2px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Audio note if recorded */}
                  {entry.observation.audioUri && (
                    <div className="pt-2">
                      <audio controls src={entry.observation.audioUri} className="h-8 max-w-xs" />
                    </div>
                  )}
                </section>

                {/* 4. Naturalist Reflection */}
                <section className="space-y-2 border-l-2 border-botanical-teal pl-4 sm:pl-6 py-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-botanical-teal font-semibold block">
                      Naturalist Synthesis
                    </span>
                    <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">
                      (Probabilistic)
                    </span>
                  </div>
                  <p className="font-serif text-sm sm:text-base text-ink-muted leading-relaxed">
                    {entry.reflection.syntheticInsight}
                  </p>
                </section>

                {/* 5. Question to Carry */}
                <section className="space-y-1 border-l-2 border-terracotta pl-4 sm:pl-6 bg-terracotta/5 py-2.5 rounded-r-sm">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold block">
                    Question to Carry
                  </span>
                  <p className="font-serif italic text-base text-ink font-medium leading-relaxed">
                    “{entry.reflection.deepeningQuestion}”
                  </p>
                </section>

                {/* 6. Curiosity Tags & Discovery Category */}
                <div className="p-3.5 rounded-sm bg-stone-light/50 border border-stone-deep/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <span className="font-serif text-sm font-semibold text-forest flex items-center">
                    <BotanicalLeafSprig className="w-3.5 h-3.5 mr-1.5 text-forest" />
                    {entry.discovery?.fieldCategory || 'Specimen Sealed'}
                  </span>

                  <div className="flex flex-wrap gap-1.5">
                    {entry.reflection.curiosityTags.map((tag) => (
                      <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
                    ))}
                  </div>
                </div>

                {/* Bottom Provenance Strip */}
                <div className="pt-2 border-t border-stone-deep/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] font-mono text-ink-faint">
                  <span className="flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-moss" />
                    {entry.reflection.modelMetadata?.provider === 'gemini-cloud'
                      ? 'Google Gemini AI (Cloud)'
                      : entry.reflection.modelMetadata?.provider === 'ollama'
                      ? `Local AI • ${entry.reflection.modelMetadata?.modelName || 'llama3.2:3b'}`
                      : 'Naturalist AI Engine'}
                  </span>
                  <span>Inscribed in SQLite Logbook</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Herbarium Plate Modal */}
      {selectedHerbariumEntry && (
        <HerbariumModal
          entry={selectedHerbariumEntry}
          onClose={() => setSelectedHerbariumEntry(null)}
        />
      )}

      {/* Back button */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('home')}
          className="min-h-[44px] px-4 inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Return to Editorial Masthead
        </button>
      </div>
    </div>
  );
};
