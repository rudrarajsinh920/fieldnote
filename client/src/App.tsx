import React from 'react';
import { FieldSessionProvider, useFieldSession } from './context/field-session-context.js';
import { JournalLayout } from './components/layout/JournalLayout.js';
import { HomeView } from './components/home/HomeView.js';
import { InvestigationSetup } from './components/investigation/InvestigationSetup.js';
import { InvestigationReveal } from './components/investigation/InvestigationReveal.js';
import { FieldModeView } from './components/field-mode/FieldModeView.js';
import { ReturnView } from './components/observation/ReturnView.js';
import { ReflectionView } from './components/reflection/ReflectionView.js';
import { JournalArchive } from './components/journal/JournalArchive.js';

import { CategorySelectionView } from './components/investigation/CategorySelectionView.js';
import { DiscoveryDetailView } from './components/journal/DiscoveryDetailView.js';
import { CollectorPassport } from './components/journal/CollectorPassport.js';
import { BotanicalIntro } from './components/common/BotanicalIntro.js';

const FieldSessionRouter: React.FC = () => {
  const { state, returnFromField, navigate } = useFieldSession();

  // Field Mode is completely full-screen & distraction-free
  if (state.currentView === 'field' && state.activeInvestigation) {
    return (
      <FieldModeView
        investigation={state.activeInvestigation}
        screenAwaySeconds={state.screenAwaySeconds}
        onReturn={returnFromField}
      />
    );
  }

  return (
    <JournalLayout>
      <div key={state.currentView} className="animate-journal-entry">
        {state.currentView === 'home' && <HomeView />}
        {state.currentView === 'categories' && <CategorySelectionView />}
        {state.currentView === 'setup' && <InvestigationSetup />}
        {state.currentView === 'reveal' && <InvestigationReveal />}
        {state.currentView === 'return' && <ReturnView />}
        {state.currentView === 'reflect' && <ReflectionView />}
        {state.currentView === 'archive' && <JournalArchive />}
        {state.currentView === 'profile' && (
          <CollectorPassport
            entries={state.journalEntries}
            onBackToNotes={() => navigate('archive')}
          />
        )}
        {state.currentView === 'detail' && <DiscoveryDetailView />}
      </div>
    </JournalLayout>
  );
};

export const App: React.FC = () => {
  return (
    <FieldSessionProvider>
      <BotanicalIntro />
      <FieldSessionRouter />
    </FieldSessionProvider>
  );
};

export default App;
