import React, { createContext, useContext, useEffect, useReducer } from 'react';
import {
  Investigation,
  Observation,
  Reflection,
  Discovery,
  JournalEntry,
  SensoryNotes,
  AIStructuredError,
} from '@fieldnote/shared';
import { AppView, FieldSetupPreferences } from '../types/index.js';
import {
  generateInvestigationLive,
  generateReflectionLive,
  getOfflineInvestigationFallback,
  getOfflineReflectionFallback,
} from '../services/ai-generator.js';

interface FieldSessionState {
  currentView: AppView;
  preferences: FieldSetupPreferences;
  activeInvestigation: Investigation | null;
  activeObservation: Observation | null;
  activeReflection: Reflection | null;
  activeDiscovery: Discovery | null;
  journalEntries: JournalEntry[];
  selectedEntry: JournalEntry | null;
  screenAwaySeconds: number;
  isFieldActive: boolean;
  isGenerating: boolean;
  nextSequenceNumber: number;
  aiError: AIStructuredError | null;
}

type FieldSessionAction =
  | { type: 'SET_VIEW'; payload: AppView }
  | { type: 'SET_PREFERENCES'; payload: Partial<FieldSetupPreferences> }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_AI_ERROR'; payload: AIStructuredError | null }
  | { type: 'SET_INVESTIGATION'; payload: Investigation }
  | { type: 'SELECT_ENTRY'; payload: JournalEntry | null }
  | { type: 'ENTER_FIELD' }
  | { type: 'INCREMENT_SCREEN_AWAY' }
  | { type: 'LEAVE_FIELD' }
  | {
      type: 'SET_OBSERVATION_AND_REFLECTION';
      payload: { observation: Observation; reflection: Reflection; discovery: Discovery };
    }
  | { type: 'COMMIT_ENTRY_TO_JOURNAL' }
  | { type: 'SET_JOURNAL_ENTRIES'; payload: JournalEntry[] }
  | { type: 'RESET_SESSION' };

const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [];

const initialState: FieldSessionState = {
  currentView: 'home',
  preferences: {
    durationMinutes: 10,
    intention: 'notice',
    category: 'science',
  },
  activeInvestigation: null,
  activeObservation: null,
  activeReflection: null,
  activeDiscovery: null,
  journalEntries: INITIAL_JOURNAL_ENTRIES,
  selectedEntry: null,
  screenAwaySeconds: 0,
  isFieldActive: false,
  isGenerating: false,
  nextSequenceNumber: 1,
  aiError: null,
};

function sessionReducer(state: FieldSessionState, action: FieldSessionAction): FieldSessionState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };

    case 'SELECT_ENTRY':
      return {
        ...state,
        selectedEntry: action.payload,
        currentView: action.payload ? 'detail' : 'archive',
      };

    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      };

    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };

    case 'SET_AI_ERROR':
      return { ...state, aiError: action.payload, isGenerating: false };

    case 'SET_INVESTIGATION':
      return {
        ...state,
        activeInvestigation: action.payload,
        currentView: 'reveal',
        isGenerating: false,
        aiError: null,
      };

    case 'ENTER_FIELD':
      return {
        ...state,
        currentView: 'field',
        isFieldActive: true,
        screenAwaySeconds: 0,
      };

    case 'INCREMENT_SCREEN_AWAY':
      return {
        ...state,
        screenAwaySeconds: state.screenAwaySeconds + 1,
      };

    case 'LEAVE_FIELD':
      return {
        ...state,
        currentView: 'return',
        isFieldActive: false,
      };

    case 'SET_OBSERVATION_AND_REFLECTION':
      return {
        ...state,
        activeObservation: action.payload.observation,
        activeReflection: action.payload.reflection,
        activeDiscovery: action.payload.discovery,
        currentView: 'reflect',
        isGenerating: false,
        aiError: null,
      };

    case 'COMMIT_ENTRY_TO_JOURNAL': {
      if (!state.activeInvestigation || !state.activeObservation || !state.activeReflection || !state.activeDiscovery) {
        return { ...state, currentView: 'archive' };
      }
      const newEntry: JournalEntry = {
        id: `entry_${Date.now()}`,
        investigation: state.activeInvestigation,
        observation: state.activeObservation,
        reflection: state.activeReflection,
        discovery: state.activeDiscovery,
        createdAt: new Date().toISOString(),
      };

      // Also persist to server SQLite asynchronously
      fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEntry),
      }).catch(() => {});

      return {
        ...state,
        journalEntries: [newEntry, ...state.journalEntries],
        activeInvestigation: null,
        activeObservation: null,
        activeReflection: null,
        activeDiscovery: null,
        nextSequenceNumber: state.nextSequenceNumber + 1,
        currentView: 'archive',
      };
    }

    case 'SET_JOURNAL_ENTRIES': {
      const maxSeq = action.payload.reduce(
        (max, e) => Math.max(max, e.investigation?.sequenceNumber || 0),
        0
      );
      return {
        ...state,
        journalEntries: action.payload,
        nextSequenceNumber: Math.max(state.nextSequenceNumber, maxSeq + 1),
      };
    }

    case 'RESET_SESSION':
      return {
        ...state,
        activeInvestigation: null,
        activeObservation: null,
        activeReflection: null,
        activeDiscovery: null,
        currentView: 'home',
        isFieldActive: false,
        screenAwaySeconds: 0,
        aiError: null,
      };

    default:
      return state;
  }
}

interface FieldSessionContextType {
  state: FieldSessionState;
  navigate: (view: AppView) => void;
  updatePreferences: (prefs: Partial<FieldSetupPreferences>) => void;
  createInvestigation: () => Promise<void>;
  useOfflineInvestigation: () => void;
  useOfflineReflection: () => void;
  dismissAiError: () => void;
  enterField: () => void;
  returnFromField: () => void;
  submitObservationAndReflect: (
    rawNotes: string,
    sensoryDetails?: SensoryNotes,
    photoUri?: string,
    audioUri?: string
  ) => Promise<void>;
  saveEntryToJournal: () => void;
  viewEntryDetail: (entry: JournalEntry) => void;
  clearSelectedEntry: () => void;
  resetSession: () => void;
}

const FieldSessionContext = createContext<FieldSessionContextType | null>(null);

export const FieldSessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sessionReducer, initialState, (init) => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('fieldnote_session_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...init,
            ...parsed,
            isGenerating: false,
            isFieldActive: false,
            aiError: null,
          };
        } catch {
          // ignore
        }
      }
    }
    return init;
  });

  // Sync real journal entries from server SQLite on mount
  useEffect(() => {
    fetch('/api/journal')
      .then((res) => (res.ok ? res.json() : []))
      .then((entries: JournalEntry[]) => {
        if (entries && Array.isArray(entries) && entries.length > 0) {
          dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: entries });
        }
      })
      .catch(() => {});
  }, []);

  // Local storage persistence
  useEffect(() => {
    localStorage.setItem(
      'fieldnote_session_v3',
      JSON.stringify({
        preferences: state.preferences,
        journalEntries: state.journalEntries,
        nextSequenceNumber: state.nextSequenceNumber,
      })
    );
  }, [state.preferences, state.journalEntries, state.nextSequenceNumber]);

  // Screen-away time tracking (Page Visibility API)
  useEffect(() => {
    if (!state.isFieldActive) return;

    let intervalId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User put phone in pocket / screen off
        intervalId = setInterval(() => {
          dispatch({ type: 'INCREMENT_SCREEN_AWAY' });
        }, 1000);
      } else {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId) clearInterval(intervalId);
    };
  }, [state.isFieldActive]);

  const navigate = (view: AppView) => {
    dispatch({ type: 'SET_AI_ERROR', payload: null });
    dispatch({ type: 'SET_VIEW', payload: view });
  };

  const updatePreferences = (prefs: Partial<FieldSetupPreferences>) => {
    dispatch({ type: 'SET_PREFERENCES', payload: prefs });
  };

  const createInvestigation = async () => {
    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_AI_ERROR', payload: null });

    const outcome = await generateInvestigationLive(
      state.preferences.intention,
      state.preferences.durationMinutes,
      state.nextSequenceNumber,
      state.preferences.optionalFocus
    );

    if (outcome.data) {
      dispatch({ type: 'SET_INVESTIGATION', payload: outcome.data });
    } else if (outcome.error) {
      dispatch({ type: 'SET_AI_ERROR', payload: outcome.error });
    }
  };

  const useOfflineInvestigation = () => {
    const fallback = getOfflineInvestigationFallback(
      state.preferences.intention,
      state.preferences.durationMinutes,
      state.nextSequenceNumber
    );
    dispatch({ type: 'SET_INVESTIGATION', payload: fallback });
  };

  const enterField = () => dispatch({ type: 'ENTER_FIELD' });

  const returnFromField = () => dispatch({ type: 'LEAVE_FIELD' });

  const submitObservationAndReflect = async (
    rawNotes: string,
    sensoryDetails?: SensoryNotes,
    photoUri?: string,
    audioUri?: string
  ) => {
    if (!state.activeInvestigation) return;

    dispatch({ type: 'SET_GENERATING', payload: true });
    dispatch({ type: 'SET_AI_ERROR', payload: null });

    const observation: Observation = {
      id: `obs_${Date.now()}`,
      investigationId: state.activeInvestigation.id,
      recordedAt: new Date().toISOString(),
      actualDurationSeconds: state.activeInvestigation.targetDurationSeconds,
      rawNotes,
      sensoryDetails,
      photoUri,
      audioUri,
      putAwayComplied: state.screenAwaySeconds >= 10,
    };

    const outcome = await generateReflectionLive(state.activeInvestigation, observation);

    if (outcome.data) {
      dispatch({
        type: 'SET_OBSERVATION_AND_REFLECTION',
        payload: {
          observation,
          reflection: outcome.data.reflection,
          discovery: outcome.data.discovery,
        },
      });
    } else if (outcome.error) {
      // Store observation in state so no data is ever lost!
      dispatch({ type: 'SET_AI_ERROR', payload: outcome.error });
    }
  };

  const useOfflineReflection = () => {
    if (!state.activeInvestigation) return;
    const observation: Observation = state.activeObservation || {
      id: `obs_${Date.now()}`,
      investigationId: state.activeInvestigation.id,
      recordedAt: new Date().toISOString(),
      actualDurationSeconds: state.activeInvestigation.targetDurationSeconds,
      rawNotes: 'Field observation logged.',
      putAwayComplied: true,
    };

    const fallback = getOfflineReflectionFallback(state.activeInvestigation, observation);
    dispatch({
      type: 'SET_OBSERVATION_AND_REFLECTION',
      payload: {
        observation,
        reflection: fallback.reflection,
        discovery: fallback.discovery,
      },
    });
  };

  const dismissAiError = () => dispatch({ type: 'SET_AI_ERROR', payload: null });

  const saveEntryToJournal = () => dispatch({ type: 'COMMIT_ENTRY_TO_JOURNAL' });

  const viewEntryDetail = (entry: JournalEntry) => {
    dispatch({ type: 'SELECT_ENTRY', payload: entry });
  };

  const clearSelectedEntry = () => {
    dispatch({ type: 'SELECT_ENTRY', payload: null });
  };

  const resetSession = () => dispatch({ type: 'RESET_SESSION' });

  return (
    <FieldSessionContext.Provider
      value={{
        state,
        navigate,
        updatePreferences,
        createInvestigation,
        useOfflineInvestigation,
        useOfflineReflection,
        dismissAiError,
        enterField,
        returnFromField,
        submitObservationAndReflect,
        saveEntryToJournal,
        viewEntryDetail,
        clearSelectedEntry,
        resetSession,
      }}
    >
      {children}
    </FieldSessionContext.Provider>
  );
};

export function useFieldSession(): FieldSessionContextType {
  const context = useContext(FieldSessionContext);
  if (!context) {
    throw new Error('useFieldSession must be used within a FieldSessionProvider');
  }
  return context;
}
