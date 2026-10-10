import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { BotanicalLeafSprig, BotanicalWaxSeal } from '../common/BotanicalIllustrations.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import { JournalEntry } from '@fieldnote/shared';
import {
  Compass,
  Calendar,
  Clock,
  ArrowLeft,
  Search,
  Download,
  FileText,
  Database,
  ChevronDown,
} from 'lucide-react';

export const JournalArchive: React.FC = () => {
  const { state, navigate, viewEntryDetail } = useFieldSession();
  const { journalEntries } = state;
  const [activeFilter, setActiveFilter] = useState<'all' | 'botany' | 'community' | 'everyday'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHerbariumEntry, setSelectedHerbariumEntry] = useState<JournalEntry | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  // Export full journal as formatted Markdown document
  const handleExportMarkdown = () => {
    setShowExportMenu(false);
    if (journalEntries.length === 0) {
      alert('Your logbook has no folios to export yet.');
      return;
    }

    const lines: string[] = [
      '# FIELDNOTE — NATURALIST FIELD LOGBOOK',
      `*Exported on ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} • ${journalEntries.length} Inscribed Folios*`,
      '',
      '---',
      '',
    ];

    journalEntries.forEach((entry, idx) => {
      const seq = String(entry.investigation.sequenceNumber || idx + 1).padStart(3, '0');
      const date = new Date(entry.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      lines.push(`## FOLIO NO. ${seq}: ${entry.investigation.title}`);
      lines.push(`- **Date Recorded**: ${date}`);
      lines.push(`- **Discipline**: ${entry.discovery?.fieldCategory || 'Botanical Study'}`);
      lines.push(`- **Silent Notice Duration**: ${entry.observation.actualDurationSeconds}s`);
      lines.push('');
      lines.push(`### Investigation Directive`);
      lines.push(`> "${entry.investigation.prompt}"`);
      lines.push('');
      lines.push(`### Ground Truth Observation (User Evidence)`);
      lines.push(`> "${entry.observation.rawNotes}"`);
      lines.push('');
      lines.push(`### Ecological Synthesis (Probabilistic Interpretation)`);
      lines.push(`${entry.reflection.syntheticInsight}`);
      lines.push('');
      lines.push(`### Reflective Question to Carry`);
      lines.push(`> "${entry.reflection.deepeningQuestion}"`);
      lines.push('');
      lines.push('---');
      lines.push('');
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldnote-journal-${new Date().toISOString().split('T')[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON backup
  const handleExportJson = () => {
    setShowExportMenu(false);
    if (journalEntries.length === 0) {
      alert('Your logbook has no folios to export yet.');
      return;
    }
    const dataStr = JSON.stringify(journalEntries, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fieldnote-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filterTabs = [
    { id: 'all' as const, label: 'All' },
    { id: 'botany' as const, label: 'Botany' },
    { id: 'community' as const, label: 'Community' },
    { id: 'everyday' as const, label: 'Everyday' },
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
    if (activeFilter === 'botany') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('botan') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('science') ||
        entry.investigation.title?.toLowerCase().includes('venation') ||
        entry.investigation.title?.toLowerCase().includes('botan')
      );
    }
    if (activeFilter === 'community') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('community') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('environ') ||
        entry.investigation.title?.toLowerCase().includes('canopy')
      );
    }
    if (activeFilter === 'everyday') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('micro') ||
        entry.investigation.title?.toLowerCase().includes('moss')
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-journal-entry max-w-2xl mx-auto pb-12">
      {/* 1. ARCHIVE MASTHEAD */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-deep/40 pb-5">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <BotanicalLeafSprig className="w-5 h-5 text-forest" />
            <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
              {journalEntries.length} {journalEntries.length === 1 ? 'Observation' : 'Observations'}
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
            My Field Journal
          </h1>
          <p className="font-serif italic text-xs sm:text-sm text-ink-muted">
            Permanent records of physical fieldwork and synthesized reflections.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          {/* Export Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="px-3.5 py-2 rounded-sm border border-stone-deep/70 bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-ink font-semibold flex items-center min-h-[42px]"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-forest" />
              Export
              <ChevronDown className="w-3 h-3 ml-1 text-ink-muted" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 rounded-sm border border-stone-deep bg-paper-bright shadow-journal z-20 py-1 text-xs font-mono">
                <button
                  type="button"
                  onClick={handleExportMarkdown}
                  className="w-full px-3 py-2 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
                >
                  <FileText className="w-3.5 h-3.5 text-forest" />
                  <span>Markdown (.md)</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="w-full px-3 py-2 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
                >
                  <Database className="w-3.5 h-3.5 text-botanical-teal" />
                  <span>JSON Backup</span>
                </button>
              </div>
            )}
          </div>

          <TactileButton
            onClick={() => navigate('categories')}
            variant="primary"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider min-h-[42px]"
          >
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            New
          </TactileButton>
        </div>
      </section>

      {/* 2. SEARCH BAR */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entries..."
          className="w-full pl-10 pr-4 py-2.5 rounded-sm border border-stone-deep/60 bg-paper-bright text-ink text-sm font-sans placeholder:text-ink-faint focus:border-forest focus:outline-none min-h-[44px]"
        />
      </div>

      {/* 3. CATEGORY FILTER CHIPS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1" role="tablist">
        {filterTabs.map((tab) => {
          const isSelected = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all min-h-[36px] whitespace-nowrap ${
                isSelected
                  ? 'bg-forest text-paper font-semibold shadow-journal-subtle'
                  : 'bg-paper-bright text-ink-muted hover:text-ink border border-stone-deep/60'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. SAVED OBSERVATION CARDS LIST */}
      {journalEntries.length === 0 ? (
        <div className="journal-page p-8 sm:p-12 text-center border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full border border-stone-deep/60 flex items-center justify-center text-forest bg-paper">
            <BotanicalWaxSeal className="w-9 h-9" label="OPEN" />
          </div>
          <div className="space-y-1 max-w-sm mx-auto">
            <h2 className="font-serif text-2xl text-ink font-medium">
              No Discoveries Yet
            </h2>
            <p className="font-serif italic text-xs sm:text-sm text-ink-muted">
              Step outside, observe the natural world, and inscribe your first field discovery.
            </p>
          </div>
          <TactileButton
            onClick={() => navigate('categories')}
            variant="primary"
            className="min-h-[46px] px-6 text-xs uppercase tracking-wider font-semibold"
          >
            <Compass className="w-4 h-4 mr-1.5" />
            Begin an Investigation
          </TactileButton>
        </div>
      ) : filteredEntries.length === 0 ? (
        <div className="p-8 text-center border border-stone-deep/40 rounded-sm bg-paper-bright space-y-2">
          <p className="font-serif italic text-sm text-ink-muted">
            No entries match your search criteria.
          </p>
          <button
            onClick={() => {
              setActiveFilter('all');
              setSearchQuery('');
            }}
            className="text-xs font-mono text-forest uppercase underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredEntries.map((entry) => {
            const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            });
            const durationMin = Math.round((entry.observation.actualDurationSeconds || 600) / 60) || 10;
            const categoryName = entry.discovery?.fieldCategory || 'Botany';

            return (
              <div
                key={entry.id}
                onClick={() => viewEntryDetail(entry)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    viewEntryDetail(entry);
                  }
                }}
                className="group p-4 sm:p-5 rounded-sm border border-stone-deep/60 bg-paper-bright hover:border-forest/60 hover:shadow-journal-subtle transition-all cursor-pointer flex items-center justify-between gap-4"
              >
                {/* Left Thumbnail */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] bg-paper border border-stone-deep/60 overflow-hidden shrink-0 flex items-center justify-center">
                  {entry.observation.photoUri ? (
                    <img
                      src={entry.observation.photoUri}
                      alt={entry.investigation.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <BotanicalLeafSprig className="w-8 h-8 text-forest opacity-70 group-hover:scale-105 transition-transform" />
                  )}
                </div>

                {/* Middle Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="font-serif text-lg sm:text-xl font-medium text-ink group-hover:text-forest transition-colors truncate">
                    {entry.investigation.title}
                  </h3>
                  <p className="font-serif italic text-xs text-ink-muted line-clamp-1">
                    “{entry.observation.rawNotes}”
                  </p>
                  <div className="flex items-center space-x-2 text-[11px] font-mono text-ink-muted pt-1">
                    <span className="flex items-center text-moss">
                      <Calendar className="w-3 h-3 mr-1" />
                      {dateStr}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {durationMin} min
                    </span>
                    <span>•</span>
                    <span className="uppercase text-forest font-semibold">
                      {categoryName}
                    </span>
                  </div>
                </div>

                {/* Right Arrow / Folio Badge */}
                <div className="text-right shrink-0 flex flex-col justify-between self-stretch">
                  <span className="font-mono text-[10px] text-ink-faint">
                    #{String(entry.investigation.sequenceNumber).padStart(3, '0')}
                  </span>
                  <span className="text-forest text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Inspect →
                  </span>
                </div>
              </div>
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

      {/* Back Link */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('home')}
          className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px] inline-flex items-center"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Home
        </button>
      </div>
    </div>
  );
};
