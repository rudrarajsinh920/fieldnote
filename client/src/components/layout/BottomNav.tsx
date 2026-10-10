import React from 'react';
import { Home, Compass, BookOpen, User } from 'lucide-react';
import { useFieldSession } from '../../context/field-session-context.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';

export const BottomNav: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const isField = state.currentView === 'field';

  if (isField) return null;

  const isHome = state.currentView === 'home';
  const isCategories = state.currentView === 'categories';
  const isJournal = state.currentView === 'archive' || state.currentView === 'detail';

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper-bright/95 backdrop-blur-md border-t border-stone/80 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-lg transition-all"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-between max-w-sm mx-auto relative px-2">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => navigate('home')}
          className={`flex flex-col items-center justify-center p-1 min-w-[50px] min-h-[44px] transition-colors ${
            isHome ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium">Home</span>
        </button>

        {/* 2. Explore */}
        <button
          type="button"
          onClick={() => navigate('categories')}
          className={`flex flex-col items-center justify-center p-1 min-w-[50px] min-h-[44px] transition-colors ${
            isCategories ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Explore Disciplines"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium">Explore</span>
        </button>

        {/* 3. Center Action Button: Leaf Circle Button */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            type="button"
            onClick={() => {
              if (state.activeInvestigation) {
                navigate('reveal');
              } else {
                navigate('categories');
              }
            }}
            className="w-12 h-12 rounded-full bg-forest text-paper shadow-journal flex items-center justify-center hover:scale-105 active:scale-95 transition-all border-2 border-paper-bright"
            aria-label="Begin Investigation"
            title="Begin Investigation"
          >
            <BotanicalLeafSprig className="w-6 h-6 text-paper" color="#FCFBF7" accent="#E5B869" />
          </button>
        </div>

        {/* 4. Journal Archive */}
        <button
          type="button"
          onClick={() => navigate('archive')}
          className={`flex flex-col items-center justify-center p-1 min-w-[50px] min-h-[44px] transition-colors relative ${
            isJournal ? 'text-forest font-bold' : 'text-ink-muted hover:text-ink'
          }`}
          aria-label="Journal Archive"
        >
          <BookOpen className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium">Journal</span>
        </button>

        {/* 5. Profile */}
        <button
          type="button"
          onClick={() => navigate('archive')}
          className="flex flex-col items-center justify-center p-1 min-w-[50px] min-h-[44px] text-ink-muted hover:text-ink transition-colors"
          aria-label="Profile"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-sans font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};
