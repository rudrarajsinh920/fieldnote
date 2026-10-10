import React from 'react';
import { Compass, BookOpen, Menu, User } from 'lucide-react';
import { useFieldSession } from '../../context/field-session-context.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';

export const Header: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const isField = state.currentView === 'field';

  if (isField) {
    // In field mode, header disappears completely to avoid distraction
    return null;
  }

  const isInvestigateActive =
    state.currentView === 'setup' ||
    state.currentView === 'reveal' ||
    state.currentView === 'return' ||
    state.currentView === 'reflect' ||
    state.currentView === 'categories';
  const isJournalActive = state.currentView === 'archive' || state.currentView === 'detail';

  return (
    <header className="border-b border-stone-deep/60 bg-paper-bright/95 backdrop-blur-sm sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-15 py-2.5 flex items-center justify-between">
        {/* Left: Mobile Menu & Brand Link */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('categories')}
            className="md:hidden p-1.5 text-ink-muted hover:text-ink rounded min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Disciplines Menu"
            title="Choose a Discipline"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>

          <button
            onClick={() => navigate('home')}
            className="group flex items-center space-x-2 text-left focus-visible:outline-offset-4 rounded-sm"
            aria-label="FIELDNOTE Home"
          >
            <BotanicalLeafSprig className="w-5 h-5 text-forest group-hover:scale-105 transition-transform" />
            <span className="font-serif tracking-tight font-medium text-xl sm:text-2xl text-ink">
              FIELDNOTE
            </span>
          </button>
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-botanical-teal bg-botanical-teal-faint/60 px-2 py-0.5 rounded-[2px] border border-botanical-teal/20">
            <span className="w-1.5 h-1.5 rounded-full bg-botanical-teal mr-1.5 animate-pulse" />
            Botanical Journal & AI
          </span>
        </div>

        {/* Right: Primary View Navigation */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2" aria-label="Main Navigation">
          <button
            onClick={() => {
              if (state.activeInvestigation) {
                navigate('reveal');
              } else {
                navigate('categories');
              }
            }}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all min-h-[38px] flex items-center ${
              isInvestigateActive
                ? 'bg-forest text-paper font-semibold shadow-journal-subtle'
                : 'text-ink-muted hover:text-ink hover:bg-stone-light/40'
            }`}
            aria-current={isInvestigateActive ? 'page' : undefined}
          >
            <Compass className="w-3.5 h-3.5 mr-1.5" />
            <span className="hidden sm:inline">Investigate</span>
            <span className="sm:hidden">Explore</span>
          </button>

          <button
            onClick={() => navigate('archive')}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-all min-h-[38px] flex items-center ${
              isJournalActive
                ? 'bg-forest text-paper font-semibold shadow-journal-subtle'
                : 'text-ink-muted hover:text-ink hover:bg-stone-light/40'
            }`}
            aria-current={isJournalActive ? 'page' : undefined}
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Journal
            {state.journalEntries.length > 0 && (
              <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-terracotta text-paper">
                {state.journalEntries.length}
              </span>
            )}
          </button>

          {/* Profile / Naturalist Avatar */}
          <button
            onClick={() => navigate('archive')}
            className="p-2 text-ink-muted hover:text-ink hover:bg-stone-light/40 rounded transition-all min-h-[38px] min-w-[38px] flex items-center justify-center"
            title="My Field Logbook"
            aria-label="My Field Logbook"
          >
            <User className="w-4 h-4 text-ink-muted" />
          </button>
        </nav>
      </div>
    </header>
  );
};
