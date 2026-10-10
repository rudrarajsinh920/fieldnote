import React from 'react';
import { Header } from './Header.js';
import { useFieldSession } from '../../context/field-session-context.js';

export const JournalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state } = useFieldSession();
  const isField = state.currentView === 'field';

  return (
    <div
      className={`min-h-screen w-full overflow-x-hidden transition-colors duration-700 ${
        isField ? 'bg-field-bg text-field-text' : 'bg-paper text-ink'
      }`}
      data-theme={isField ? 'field-mode' : 'journal-mode'}
    >
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
    </div>
  );
};
