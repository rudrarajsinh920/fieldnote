import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import {
  BotanicalLeafSprig,
  SpecimenArtwork,
  BotanicalSproutEmptyState,
} from '../common/BotanicalIllustrations.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import { FieldObservationMap } from './FieldObservationMap.js';
import { CollectorPassport } from './CollectorPassport.js';
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
  LayoutGrid,
  List as ListIcon,
  Plus,
  Home,
  BookOpen,
  User,
  ArrowRight,
  MapPin,
} from 'lucide-react';

export const JournalArchive: React.FC = () => {
  const { state, navigate, viewEntryDetail } = useFieldSession();
  const { journalEntries } = state;
  const [currentSection, setCurrentSection] = useState<'journal' | 'map' | 'profile'>(() => {
    if (typeof window !== 'undefined') {
      const sec = new URLSearchParams(window.location.search).get('section');
      if (sec === 'map' || sec === 'profile') return sec;
    }
    return 'journal';
  });
  const [activeFilter, setActiveFilter] = useState<'all' | 'botany' | 'community' | 'everyday'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
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
      lines.push(`- **Observation Duration**: ${entry.observation.actualDurationSeconds}s`);
      lines.push('');
      lines.push(`### Investigation Directive`);
      lines.push(`> "${entry.investigation.prompt}"`);
      lines.push('');
      lines.push(`### Ground Truth Observation (User Evidence)`);
      lines.push(`> "${entry.observation.rawNotes}"`);
      lines.push('');
      lines.push(`### Ecological Synthesis`);
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
        entry.investigation.title?.toLowerCase().includes('botan') ||
        entry.investigation.title?.toLowerCase().includes('moss')
      );
    }
    if (activeFilter === 'community') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('community') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('environ') ||
        entry.investigation.title?.toLowerCase().includes('canopy') ||
        entry.investigation.title?.toLowerCase().includes('water') ||
        entry.investigation.title?.toLowerCase().includes('rain')
      );
    }
    if (activeFilter === 'everyday') {
      return (
        entry.discovery?.fieldCategory?.toLowerCase().includes('everyday') ||
        entry.discovery?.fieldCategory?.toLowerCase().includes('micro') ||
        entry.investigation.title?.toLowerCase().includes('ant') ||
        entry.investigation.title?.toLowerCase().includes('lichen')
      );
    }
    return true;
  });

  const getSpecimenType = (entry: JournalEntry) => {
    if (entry.observation.photoUri?.startsWith('specimen:')) {
      return entry.observation.photoUri.replace('specimen:', '');
    }
    const t = entry.investigation.title.toLowerCase();
    if (t.includes('moss')) return 'moss_on_stone';
    if (t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) return 'weathering';
    if (t.includes('rain') || t.includes('water')) return 'rainwater_flow';
    if (t.includes('lichen')) return 'lichen_crusts';
    if (t.includes('ant')) return 'ant_trails';
    if (t.includes('diurnal') || t.includes('movement')) return 'diurnal_leaves';
    return 'leaf_venation';
  };

  const getDiscoverySubtitle = (entry: JournalEntry) => {
    const t = entry.investigation.title.toLowerCase();
    if (t.includes('moss')) return 'Shaded wall, moist surface';
    if (t.includes('weather') || t.includes('shale') || t.includes('rock')) return 'Natural outcrop, flaking layers';
    if (t.includes('rain') || t.includes('water')) return 'Sidewalk channel';
    if (t.includes('lichen')) return 'Tree bark texture';
    if (t.includes('leaf') || t.includes('venation')) return 'Backlit leaf study';
    if (t.includes('ant')) return 'Pavement edge';
    if (t.includes('diurnal') || t.includes('movement')) return 'Plant orientation';
    return entry.observation.rawNotes;
  };

  return (
    <div className="animate-journal-entry pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ============================================================ */}
        {/* DESKTOP SIDEBAR NAVIGATION (lg:col-span-3)                    */}
        {/* ============================================================ */}
        <aside className="hidden lg:block lg:col-span-3 rounded-3xl border border-stone bg-paper-bright p-6 shadow-journal-subtle sticky top-24 space-y-6">
          <div className="flex items-center space-x-2.5 pb-4 border-b border-stone/60">
            <BotanicalLeafSprig className="w-6 h-6 text-forest" />
            <div>
              <span className="font-serif font-medium text-lg text-ink block leading-tight">
                FIELDNOTE
              </span>
              <span className="text-[10px] font-mono tracking-wider text-ink-muted uppercase">
                Field Journal
              </span>
            </div>
          </div>

          <nav className="space-y-1.5" aria-label="Desktop Journal Navigation">
            <button
              type="button"
              onClick={() => navigate('home')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium text-ink-muted hover:text-ink hover:bg-stone-light/40 transition-colors"
            >
              <Home className="w-4 h-4 text-ink-muted" />
              <span>Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('categories')}
              className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans font-medium text-ink-muted hover:text-ink hover:bg-stone-light/40 transition-colors"
            >
              <Compass className="w-4 h-4 text-ink-muted" />
              <span>Explore</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSection('journal')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-sans transition-colors ${
                currentSection === 'journal'
                  ? 'font-semibold bg-forest text-paper shadow-sm'
                  : 'font-medium text-ink-muted hover:text-ink hover:bg-stone-light/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <BookOpen className={`w-4 h-4 ${currentSection === 'journal' ? 'text-paper' : 'text-ink-muted'}`} />
                <span>Journal</span>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                currentSection === 'journal' ? 'bg-paper/20 text-paper font-bold' : 'bg-stone-light text-ink-muted font-medium'
              }`}>
                {journalEntries.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSection('map')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-colors ${
                currentSection === 'map'
                  ? 'font-semibold bg-forest text-paper shadow-sm'
                  : 'font-medium text-ink-muted hover:text-ink hover:bg-stone-light/40'
              }`}
              aria-label="Field Observation Map"
            >
              <MapPin className={`w-4 h-4 ${currentSection === 'map' ? 'text-paper' : 'text-ink-muted'}`} />
              <span>Map</span>
            </button>

            <button
              type="button"
              onClick={() => setCurrentSection('profile')}
              className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-sans transition-colors ${
                currentSection === 'profile'
                  ? 'font-semibold bg-forest text-paper shadow-sm'
                  : 'font-medium text-ink-muted hover:text-ink hover:bg-stone-light/40'
              }`}
              aria-label="Collector Passport Profile"
            >
              <User className={`w-4 h-4 ${currentSection === 'profile' ? 'text-paper' : 'text-ink-muted'}`} />
              <span>Profile</span>
            </button>
          </nav>

          {/* Decorative Naturalist Botanical Leaf Branch */}
          <div className="pt-6 border-t border-stone/60 text-center space-y-2">
            <BotanicalLeafSprig className="w-14 h-14 mx-auto text-forest opacity-80" />
            <p className="font-serif italic text-xs text-ink-muted leading-relaxed">
              “Same sky. New eyes.”
            </p>
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN JOURNAL CONTENT (lg:col-span-9)                         */}
        {/* ============================================================ */}
        <main className="lg:col-span-9 space-y-6 sm:space-y-8">
          {/* Mobile section switcher */}
          <div className="lg:hidden flex items-center space-x-2 pb-1 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => setCurrentSection('journal')}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap transition-colors ${
                currentSection === 'journal'
                  ? 'bg-forest text-paper shadow-sm'
                  : 'bg-stone-light/60 text-ink-muted hover:text-ink'
              }`}
            >
              Folios ({journalEntries.length})
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('map')}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
                currentSection === 'map'
                  ? 'bg-forest text-paper shadow-sm'
                  : 'bg-stone-light/60 text-ink-muted hover:text-ink'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Observation Map</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentSection('profile')}
              className={`px-3 py-1.5 rounded-full text-xs font-sans font-medium whitespace-nowrap flex items-center space-x-1.5 transition-colors ${
                currentSection === 'profile'
                  ? 'bg-forest text-paper shadow-sm'
                  : 'bg-stone-light/60 text-ink-muted hover:text-ink'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Passport</span>
            </button>
          </div>

          {currentSection === 'map' ? (
            <FieldObservationMap
              entries={journalEntries}
              onSelectEntry={viewEntryDetail}
              onBackToJournal={() => setCurrentSection('journal')}
            />
          ) : currentSection === 'profile' ? (
            <CollectorPassport
              entries={journalEntries}
              onBackToNotes={() => setCurrentSection('journal')}
            />
          ) : (
            <>
              {/* 1. ARCHIVE MASTHEAD */}
          <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone/70 pb-5">
            <div className="space-y-1">
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
                My Field Journal
              </h1>
              <p className="font-sans text-xs sm:text-sm text-ink-muted">
                Your growing record of observations, insights, and questions.
              </p>
            </div>

            <div className="flex items-center space-x-2.5 self-start sm:self-auto">
              {/* New Observation CTA */}
              <button
                type="button"
                onClick={() => navigate('categories')}
                className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-deep text-paper font-sans font-semibold text-xs tracking-wide shadow-sm flex items-center space-x-1.5 transition-all active:scale-[0.98]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Observation</span>
              </button>

              {/* View Mode Toggle: Grid vs List vs Map */}
              <div className="flex items-center rounded-xl border border-stone bg-paper-bright p-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSection('journal');
                    setViewMode('grid');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-stone-light text-forest font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  aria-label="Grid View"
                  title="Grid View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCurrentSection('journal');
                    setViewMode('list');
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-stone-light text-forest font-semibold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                  aria-label="List View"
                  title="List View"
                >
                  <ListIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection('map')}
                  className="p-2 rounded-lg transition-colors text-ink-muted hover:text-ink"
                  aria-label="Terrain Map View"
                  title="Terrain Map View"
                >
                  <MapPin className="w-4 h-4" />
                </button>
              </div>

              {/* Export Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="px-3 py-2 rounded-xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-ink font-semibold flex items-center min-h-[38px] shadow-journal-subtle"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5 text-forest" />
                  <ChevronDown className="w-3 h-3 ml-1 text-ink-muted" />
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl border border-stone bg-paper-bright shadow-journal z-20 py-1.5 text-xs font-mono">
                    <button
                      type="button"
                      onClick={handleExportMarkdown}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
                    >
                      <FileText className="w-4 h-4 text-forest" />
                      <span>Markdown (.md)</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
                    >
                      <Database className="w-4 h-4 text-botanical-teal" />
                      <span>JSON Backup</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 2. SEARCH & FILTER ROW */}
          <div className="space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your discoveries..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone bg-paper-bright text-ink text-sm font-sans placeholder:text-ink-faint focus:border-forest focus:outline-none min-h-[46px] shadow-journal-subtle"
              />
            </div>

            {/* Category Filter Pills */}
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
                        : 'bg-paper-bright text-ink-muted hover:text-ink border border-stone'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. DISCOVERIES DISPLAY */}
          {journalEntries.length === 0 ? (
            /* EMPTY STATE: SPECIFICATION FROM REFERENCE */
            <div className="rounded-3xl border border-stone bg-paper-bright p-10 sm:p-14 text-center shadow-journal-subtle space-y-5 max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto flex items-center justify-center">
                <BotanicalSproutEmptyState className="w-24 h-24" />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                  No discoveries yet
                </h2>
                <p className="font-serif italic text-xs sm:text-sm text-ink-muted leading-relaxed">
                  Step outside and start your first field investigation.
                </p>
              </div>
              <TactileButton
                onClick={() => navigate('categories')}
                variant="primary"
                className="min-h-[48px] px-7 text-xs uppercase tracking-wider font-semibold shadow-journal"
              >
                <Compass className="w-4 h-4 mr-2" />
                Begin an Investigation
              </TactileButton>
            </div>
          ) : filteredEntries.length === 0 ? (
            /* NO SEARCH RESULTS */
            <div className="rounded-3xl border border-stone bg-paper-bright p-10 text-center space-y-3">
              <BotanicalSproutEmptyState className="w-16 h-16 mx-auto opacity-60" />
              <p className="font-serif italic text-sm text-ink-muted">
                No entries match your search criteria.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-mono text-forest uppercase font-semibold underline"
              >
                Reset Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            /* ============================================================ */
            /* GRID VIEW: 3-COLUMN EDITORIAL CARD GRID MATCHING REFERENCE   */
            /* ============================================================ */
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredEntries.map((entry) => {
                const specType = getSpecimenType(entry);
                const isCustom = entry.observation.photoUri && !entry.observation.photoUri.startsWith('specimen:');
                const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                const durationMin = Math.round((entry.observation.actualDurationSeconds || 600) / 60) || 10;
                const subtitle = getDiscoverySubtitle(entry);

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
                    className="group rounded-3xl border border-stone bg-paper-bright overflow-hidden hover:border-forest/70 hover:shadow-journal transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Thumbnail / Specimen Artwork */}
                      <div className="aspect-[16/10] w-full bg-stone-light/40 relative overflow-hidden">
                        {isCustom ? (
                          <img
                            src={entry.observation.photoUri}
                            alt={entry.investigation.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <SpecimenArtwork
                            type={specType}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="p-5 space-y-1">
                        <h3 className="font-serif text-lg sm:text-xl font-medium text-ink group-hover:text-forest transition-colors line-clamp-1">
                          {entry.investigation.title}
                        </h3>
                        <p className="font-sans text-xs text-ink-muted line-clamp-1">
                          {subtitle}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer: Date & Duration */}
                    <div className="p-5 pt-0">
                      <div className="pt-2.5 border-t border-stone-light/50 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                        <span>
                          {dateStr} • {durationMin} min
                        </span>
                        <span className="text-forest font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
                          Inspect <ArrowRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ============================================================ */
            /* LIST VIEW: COMPACT MOBILE-FRIENDLY ROWS                      */
            /* ============================================================ */
            <div className="space-y-3.5">
              {filteredEntries.map((entry) => {
                const specType = getSpecimenType(entry);
                const isCustom = entry.observation.photoUri && !entry.observation.photoUri.startsWith('specimen:');
                const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                const durationMin = Math.round((entry.observation.actualDurationSeconds || 600) / 60) || 10;
                const categoryName = entry.discovery?.fieldCategory || 'Botany';
                const subtitle = getDiscoverySubtitle(entry);

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
                    className="group p-4 sm:p-5 rounded-3xl border border-stone bg-paper-bright hover:border-forest/60 hover:shadow-journal-subtle transition-all cursor-pointer flex items-center justify-between gap-4"
                  >
                    {/* Left Specimen Thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-stone-light/40 border border-stone overflow-hidden shrink-0 flex items-center justify-center relative">
                      {isCustom ? (
                        <img
                          src={entry.observation.photoUri}
                          alt={entry.investigation.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <SpecimenArtwork
                          type={specType}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      )}
                    </div>

                    {/* Middle Content */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <h3 className="font-serif text-base sm:text-lg font-medium text-ink group-hover:text-forest transition-colors truncate">
                        {entry.investigation.title}
                      </h3>
                      <p className="font-sans text-xs text-ink-muted line-clamp-1">
                        {subtitle}
                      </p>
                      <div className="flex items-center space-x-2 text-[11px] font-mono text-ink-muted pt-0.5">
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

                    {/* Right Arrow */}
                    <div className="text-right shrink-0">
                      <span className="text-forest text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Inspect →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

          {/* Herbarium Plate Modal */}
          {selectedHerbariumEntry && (
            <HerbariumModal
              entry={selectedHerbariumEntry}
              onClose={() => setSelectedHerbariumEntry(null)}
            />
          )}

          {/* Back to Home Link */}
          <div className="text-center pt-4">
            <button
              onClick={() => navigate('home')}
              className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px] inline-flex items-center"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Home
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
