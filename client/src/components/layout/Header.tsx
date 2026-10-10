import React from 'react';
import { Compass, BookOpen } from 'lucide-react';
import { useFieldSession } from '../../context/field-session-context.js';

export const Header: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const isField = state.currentView === 'field';

  if (isField) {
    // In field mode, header disappears completely to avoid distraction
    return null;
  }

  const isInvestigateActive =
    state.currentView === 'setup' || state.currentView === 'reveal' || state.currentView === 'return' || state.currentView === 'reflect';
  const isJournalActive = state.currentView === 'archive';

  return (
    <header className="border-b border-stone/80 bg-paper-bright/90 backdrop-blur-sm sticky top-0 z-30 transition-all duration-300">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand Home Link */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('home')}
            className="flex items-center space-x-2 text-left focus-visible:outline-offset-4 rounded-sm"
            aria-label="FIELDNOTE Home"
          >
            <span className="text-terracotta text-lg select-none">🌿</span>
            <span className="font-serif tracking-tight font-medium text-lg text-ink">
              FIELDNOTE
            </span>
          </button>
          <span className="hidden sm:inline-flex items-center text-[10px] font-mono text-moss bg-moss/10 px-2 py-0.5 rounded-[2px] border border-moss/20">
            <span className="w-1.5 h-1.5 rounded-full bg-forest mr-1.5 animate-pulse" />
            Naturalist AI Engine
          </span>
        </div>

        {/* Primary View Navigation */}
        <nav className="flex items-center space-x-1" aria-label="Main Navigation">
          <button
            onClick={() => {
              if (state.activeInvestigation) {
                navigate('reveal');
              } else {
                navigate('setup');
              }
            }}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
              isInvestigateActive
                ? 'bg-forest/10 text-forest font-semibold'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-current={isInvestigateActive ? 'page' : undefined}
          >
            <Compass className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Investigate
          </button>

          <button
            onClick={() => navigate('archive')}
            className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded transition-colors ${
              isJournalActive
                ? 'bg-forest/10 text-forest font-semibold'
                : 'text-ink-muted hover:text-ink'
            }`}
            aria-current={isJournalActive ? 'page' : undefined}
          >
            <BookOpen className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
            Journal
          </button>
        </nav>
      </div>
    </header>
  );
};
