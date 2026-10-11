import React from 'react';
import { Search, User, Menu } from 'lucide-react';
import { useFieldSession } from '../../context/field-session-context.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';

export const Header: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const isField = state.currentView === 'field';

  if (isField) {
    return null;
  }

  const isHome = state.currentView === 'home';
  const isExplore = state.currentView === 'categories' || state.currentView === 'setup' || state.currentView === 'reveal';
  const isJournal = state.currentView === 'archive' || state.currentView === 'detail';
  const isProfile = state.currentView === 'profile';

  return (
    <header className="border-b border-stone/80 bg-paper-bright/95 backdrop-blur-sm sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => navigate('categories')}
            className="md:hidden p-2 text-ink-muted hover:text-ink rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Disciplines Menu"
          >
            <Menu className="w-5 h-5 text-ink" />
          </button>

          <button
            onClick={() => navigate('home')}
            className="group flex items-center space-x-2 text-left focus:outline-none"
            aria-label="FIELDNOTE Home"
          >
            <BotanicalLeafSprig className="w-6 h-6 text-forest group-hover:scale-105 transition-transform" />
            <div className="flex flex-col">
              <span className="font-serif tracking-tight font-medium text-2xl sm:text-3xl text-ink leading-none">
                FIELDNOTE
              </span>
              <span className="md:hidden text-[10px] font-serif italic text-forest -mt-0.5">
                AI that teaches you to notice.
              </span>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main Navigation">
          <button
            onClick={() => navigate('home')}
            className={`relative py-1 text-sm font-sans font-medium transition-colors ${
              isHome ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span>Home</span>
            {isHome && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-forest rounded-full transition-all duration-300" />
            )}
          </button>
          <button
            onClick={() => navigate('categories')}
            className={`relative py-1 text-sm font-sans font-medium transition-colors ${
              isExplore ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span>Explore</span>
            {isExplore && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-forest rounded-full transition-all duration-300" />
            )}
          </button>
          <button
            onClick={() => navigate('archive')}
            className={`relative py-1 text-sm font-sans font-medium transition-colors flex items-center ${
              isJournal ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span>Journal</span>
            {state.journalEntries.length > 0 && (
              <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-stone-light text-forest font-semibold">
                {state.journalEntries.length}
              </span>
            )}
            {isJournal && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-forest rounded-full transition-all duration-300" />
            )}
          </button>
          <button
            onClick={() => navigate('profile')}
            className={`relative py-1 text-sm font-sans font-medium transition-colors ${
              isProfile ? 'text-ink font-semibold' : 'text-ink-muted hover:text-ink'
            }`}
          >
            <span>Profile</span>
            {isProfile && (
              <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-forest rounded-full transition-all duration-300" />
            )}
          </button>
        </nav>

        {/* Right Action: Desktop Primary Button / Mobile Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Mobile Right: Search & Profile Icons */}
          <div className="flex md:hidden items-center space-x-1">
            <button
              onClick={() => navigate('archive')}
              className="p-2 text-ink-muted hover:text-ink rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Search Journal"
            >
              <Search className="w-5 h-5 text-ink" />
            </button>
            <button
              onClick={() => navigate('profile')}
              className={`p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors ${
                isProfile ? 'text-forest bg-forest/10' : 'text-ink-muted hover:text-ink'
              }`}
              aria-label="Naturalist Profile"
            >
              <User className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Right: Begin Investigation Button */}
          <button
            onClick={() => {
              if (state.activeInvestigation) {
                navigate('reveal');
              } else {
                navigate('categories');
              }
            }}
            className="hidden md:inline-flex items-center px-5 py-2.5 rounded-full text-sm font-sans font-semibold bg-forest hover:bg-forest-deep text-paper shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Begin Investigation
          </button>
        </div>
      </div>
    </header>
  );
};

