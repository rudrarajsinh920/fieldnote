import React from 'react';
import { Home, Compass, BookOpen, Settings, Plus } from 'lucide-react';
import { useFieldSession } from '../../context/field-session-context.js';

interface BottomNavProps {
  onOpenSettings: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onOpenSettings }) => {
  const { state, navigate } = useFieldSession();
  const isField = state.currentView === 'field';

  if (isField) return null;

  const isHome = state.currentView === 'home';
  const isCategories = state.currentView === 'categories';
  const isSetup =
    state.currentView === 'setup' ||
    state.currentView === 'reveal' ||
    state.currentView === 'return' ||
    state.currentView === 'reflect';
  const isJournal = state.currentView === 'archive' || state.currentView === 'detail';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper-bright/95 backdrop-blur-md border-t border-stone-deep/60 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg transition-all"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-md mx-auto relative">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded transition-colors ${
            isHome ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Home</span>
        </button>

        {/* 2. Explore / Categories */}
        <button
          type="button"
          onClick={() => navigate('categories')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded transition-colors ${
            isCategories ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Explore Disciplines"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Explore</span>
        </button>

        {/* 3. Center Action Button: Start Investigation */}
        <div className="relative -top-4 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (state.activeInvestigation) {
                navigate('reveal');
              } else {
                navigate('setup');
              }
            }}
            className={`w-13 h-13 rounded-full text-paper shadow-journal flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-paper-bright ${
              isSetup ? 'bg-botanical-teal ring-2 ring-forest' : 'bg-forest'
            }`}
            aria-label="Begin Investigation"
            title="Begin Investigation"
          >
            <Plus className="w-6 h-6 text-paper" />
          </button>
        </div>

        {/* 4. Journal Archive */}
        <button
          type="button"
          onClick={() => navigate('archive')}
          className={`flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded transition-colors relative ${
            isJournal ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Journal Archive"
        >
          <div className="relative">
            <BookOpen className="w-5 h-5 mb-0.5" />
            {state.journalEntries.length > 0 && (
              <span className="absolute -top-1 -right-2 text-[9px] font-mono px-1 py-0.2 rounded-full bg-terracotta text-paper font-bold leading-tight">
                {state.journalEntries.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-mono tracking-wider uppercase">Journal</span>
        </button>

        {/* 5. Settings / AI */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="flex flex-col items-center justify-center p-1.5 min-w-[56px] min-h-[48px] rounded text-ink-muted hover:text-ink transition-colors"
          aria-label="Naturalist AI Settings"
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-mono tracking-wider uppercase">Settings</span>
        </button>
      </div>
    </nav>
  );
};
