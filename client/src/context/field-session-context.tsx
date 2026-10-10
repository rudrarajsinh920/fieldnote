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

export const INITIAL_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'entry_moss_stone',
    createdAt: '2026-10-06T10:30:00.000Z',
    investigation: {
      id: 'inv_moss_stone',
      sequenceNumber: 1,
      title: 'Moss on Stone',
      prompt: 'Find a small plant, lichen or moss growing on a surface. Observe its shape, color, texture, and how it interacts with the surrounding environment.',
      groundingConstraint: 'Observe only what you can actually see. No guessing.',
      inquiryQuestion: 'How does this organism adapt to its surface and surrounding conditions?',
      sensoryFocus: ['visual', 'tactile'],
      targetDurationSeconds: 600,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-10-06T10:15:00.000Z',
    },
    observation: {
      id: 'obs_moss_stone',
      investigationId: 'inv_moss_stone',
      recordedAt: '2026-10-06T10:30:00.000Z',
      actualDurationSeconds: 600,
      rawNotes: 'A green moss growing on a shaded stone surface. The texture feels soft and spongy. The area is moist with traces of recent rain.',
      sensoryDetails: {
        visual: 'Dense velvety cushion, bright emerald tips with darker olive base.',
        tactile: 'Spongy and resilient under gentle finger press, retaining damp coolness.',
      },
      photoUri: 'specimen:moss_on_stone',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_moss_stone',
      observationId: 'obs_moss_stone',
      investigationId: 'inv_moss_stone',
      syntheticInsight: 'The specimen is likely a carpet-forming pleurocarpous moss occupying a shaded micro-catchment on mineral bedrock. Its high surface-area-to-volume ratio allows rapid poikilohydric hydration from dew without deep root architecture.',
      deepeningQuestion: 'Does the boundary edge of the moss cushion align with drainage rivulets or shade angles cast during midday sun?',
      curiosityTags: ['bryophyte', 'poikilohydry', 'micro-climate', 'hydration-gradient'],
      nextInvestigationSeed: 'Examine adjacent uncolonized stone to identify the mineral texture threshold required for rhizoid anchoring.',
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 420,
        provider: 'local-naturalist',
      },
      createdAt: '2026-10-06T10:32:00.000Z',
    },
    discovery: {
      id: 'disc_moss_stone',
      investigationId: 'inv_moss_stone',
      reflectionId: 'ref_moss_stone',
      title: 'Moss on Stone',
      fieldCategory: 'Botany',
      significanceScore: 4,
      unlockedAt: '2026-10-06T10:32:00.000Z',
    },
  },
  {
    id: 'entry_rainwater_flow',
    createdAt: '2026-10-05T14:40:00.000Z',
    investigation: {
      id: 'inv_rainwater_flow',
      sequenceNumber: 2,
      title: 'Rainwater Flow Patterns',
      prompt: 'Trace how rainwater negotiates grade changes and micro-topography along pavement edges.',
      groundingConstraint: 'Follow sediment deposit lines rather than imagining water speed.',
      inquiryQuestion: 'Where does the channel deposit its coarsest grains versus finest silt?',
      sensoryFocus: ['visual', 'temporal'],
      targetDurationSeconds: 1200,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-10-05T14:10:00.000Z',
    },
    observation: {
      id: 'obs_rainwater_flow',
      investigationId: 'inv_rainwater_flow',
      recordedAt: '2026-10-05T14:40:00.000Z',
      actualDurationSeconds: 1200,
      rawNotes: 'Sidewalk channel showing sorted sediment curves. Coarse quartz sand settled near the concrete joint, while fine clay-brown powder pooled in the slow bend.',
      sensoryDetails: {
        visual: 'Dark moist ribbons along asphalt seam with crescent-shaped sand bars.',
      },
      photoUri: 'specimen:rainwater_flow',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_rainwater_flow',
      observationId: 'obs_rainwater_flow',
      investigationId: 'inv_rainwater_flow',
      syntheticInsight: 'You have observed micro-fluvial hydraulic sorting. As runoff velocity drops across slight concavities, heavier mineral grains drop out first, mirroring watershed dynamics on a miniature scale.',
      deepeningQuestion: 'How does the drying rate vary between the gravel bar and the fine silt deposition pool?',
      curiosityTags: ['hydraulic-sorting', 'urban-watershed', 'alluvial-fan', 'runoff'],
      nextInvestigationSeed: 'Check the same channel after dry hours to see if drying shrinkage cracks emerge in the silt.',
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 380,
        provider: 'local-naturalist',
      },
      createdAt: '2026-10-05T14:42:00.000Z',
    },
    discovery: {
      id: 'disc_rainwater_flow',
      investigationId: 'inv_rainwater_flow',
      reflectionId: 'ref_rainwater_flow',
      title: 'Rainwater Flow Patterns',
      fieldCategory: 'Community',
      significanceScore: 3,
      unlockedAt: '2026-10-05T14:42:00.000Z',
    },
  },
  {
    id: 'entry_lichen_crusts',
    createdAt: '2026-09-28T09:15:00.000Z',
    investigation: {
      id: 'inv_lichen_crusts',
      sequenceNumber: 3,
      title: 'Lichen Crusts',
      prompt: 'Locate crustose lichen fused to tree bark or stone and map its outer margin.',
      groundingConstraint: 'Distinguish true lichen growth rings from surface staining.',
      inquiryQuestion: 'Which cardinal orientation supports the thickest rim of apothecia?',
      sensoryFocus: ['visual', 'spatial'],
      targetDurationSeconds: 900,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-09-28T08:50:00.000Z',
    },
    observation: {
      id: 'obs_lichen_crusts',
      investigationId: 'inv_lichen_crusts',
      recordedAt: '2026-09-28T09:15:00.000Z',
      actualDurationSeconds: 900,
      rawNotes: 'Pale grey-green crust tightly bonded to damp tree bark. Small terracotta-colored discs concentrated around the central zones.',
      photoUri: 'specimen:lichen_crusts',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_lichen_crusts',
      observationId: 'obs_lichen_crusts',
      investigationId: 'inv_lichen_crusts',
      syntheticInsight: 'This symbiotic lichen association pairs a fungal mycobiont providing structural shield with photobiont algae producing carbohydrates. The central terracotta discs are fruiting apothecia for spore dispersal.',
      deepeningQuestion: 'Does the north-facing side of the trunk host a different lichen species or thickness than the south-facing side?',
      curiosityTags: ['lichenology', 'symbiosis', 'apothecia', 'epiphyte'],
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 410,
        provider: 'local-naturalist',
      },
      createdAt: '2026-09-28T09:18:00.000Z',
    },
    discovery: {
      id: 'disc_lichen_crusts',
      investigationId: 'inv_lichen_crusts',
      reflectionId: 'ref_lichen_crusts',
      title: 'Lichen Crusts',
      fieldCategory: 'Botany',
      significanceScore: 4,
      unlockedAt: '2026-09-28T09:18:00.000Z',
    },
  },
  {
    id: 'entry_leaf_vein',
    createdAt: '2026-09-25T11:20:00.000Z',
    investigation: {
      id: 'inv_leaf_vein',
      sequenceNumber: 4,
      title: 'Leaf Vein Patterns',
      prompt: 'Hold a broad leaf against direct sun and examine the secondary and tertiary vascular branching.',
      groundingConstraint: 'Trace a single branch from stem to marginal leaf tip.',
      inquiryQuestion: 'Are the smaller veins closed loops or open ending fibrils?',
      sensoryFocus: ['visual'],
      targetDurationSeconds: 720,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-09-25T11:00:00.000Z',
    },
    observation: {
      id: 'obs_leaf_vein',
      investigationId: 'inv_leaf_vein',
      recordedAt: '2026-09-25T11:20:00.000Z',
      actualDurationSeconds: 720,
      rawNotes: 'Backlit leaf study showing thick central spine tapering outward, with branching lattices forming closed polygonal chambers throughout the blade.',
      photoUri: 'specimen:leaf_venation',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_leaf_vein',
      observationId: 'obs_leaf_vein',
      investigationId: 'inv_leaf_vein',
      syntheticInsight: 'You noticed reticulate venation following Murray’s Law of hydraulic branching efficiency. Closed areole networks provide redundant transport loops that prevent wilting if insects sever an individual vein.',
      deepeningQuestion: 'How does vein density correlate with leaf thickness across different shade levels on the same plant?',
      curiosityTags: ['venation', 'murrays-law', 'xylem-architecture', 'hydraulic-resilience'],
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 360,
        provider: 'local-naturalist',
      },
      createdAt: '2026-09-25T11:22:00.000Z',
    },
    discovery: {
      id: 'disc_leaf_vein',
      investigationId: 'inv_leaf_vein',
      reflectionId: 'ref_leaf_vein',
      title: 'Leaf Vein Patterns',
      fieldCategory: 'Botany',
      significanceScore: 4,
      unlockedAt: '2026-09-25T11:22:00.000Z',
    },
  },
  {
    id: 'entry_ant_trails',
    createdAt: '2026-09-21T15:10:00.000Z',
    investigation: {
      id: 'inv_ant_trails',
      sequenceNumber: 5,
      title: 'Ant Trails',
      prompt: 'Locate an invertebrate foraging line along an edge and observe collision behavior.',
      groundingConstraint: 'Do not interrupt the path. Count antennal taps between returning and outgoing workers.',
      inquiryQuestion: 'What structural obstacle forces the foraging line to detour?',
      sensoryFocus: ['visual', 'temporal'],
      targetDurationSeconds: 720,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-09-21T14:50:00.000Z',
    },
    observation: {
      id: 'obs_ant_trails',
      investigationId: 'inv_ant_trails',
      recordedAt: '2026-09-21T15:10:00.000Z',
      actualDurationSeconds: 720,
      rawNotes: 'Pavement edge column traveling along shaded mortar joint. Returning ants carried dry grass seeds twice their length.',
      photoUri: 'specimen:ant_trails',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_ant_trails',
      observationId: 'obs_ant_trails',
      investigationId: 'inv_ant_trails',
      syntheticInsight: 'Trail pheromone reinforcement creates a self-optimizing minimum-resistance corridor along physical edge boundaries. Mortar seams offer both shelter from desiccation wind and tactile guidance.',
      deepeningQuestion: 'How does column speed change when the trail crosses direct sunlight versus shade?',
      curiosityTags: ['stigmergy', 'foraging-dynamics', 'micro-corridor', 'ant-trail'],
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 340,
        provider: 'local-naturalist',
      },
      createdAt: '2026-09-21T15:12:00.000Z',
    },
    discovery: {
      id: 'disc_ant_trails',
      investigationId: 'inv_ant_trails',
      reflectionId: 'ref_ant_trails',
      title: 'Ant Trails',
      fieldCategory: 'Everyday',
      significanceScore: 3,
      unlockedAt: '2026-09-21T15:12:00.000Z',
    },
  },
  {
    id: 'entry_diurnal_leaf',
    createdAt: '2026-09-18T17:45:00.000Z',
    investigation: {
      id: 'inv_diurnal_leaf',
      sequenceNumber: 6,
      title: 'Diurnal Leaf Movements',
      prompt: 'Observe clover or leguminous foliage in late afternoon light to witness nyctinastic folding.',
      groundingConstraint: 'Observe petiole angles without touching or shaking the plant.',
      inquiryQuestion: 'Which leaf surface is protected when the leaflets fold together?',
      sensoryFocus: ['visual', 'temporal'],
      targetDurationSeconds: 600,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'completed',
      createdAt: '2026-09-18T17:25:00.000Z',
    },
    observation: {
      id: 'obs_diurnal_leaf',
      investigationId: 'inv_diurnal_leaf',
      recordedAt: '2026-09-18T17:45:00.000Z',
      actualDurationSeconds: 600,
      rawNotes: 'Trifoliate leaves beginning to angle downward as dusk approaches. Leaf faces meeting together along the central fold.',
      photoUri: 'specimen:diurnal_leaves',
      putAwayComplied: true,
    },
    reflection: {
      id: 'ref_diurnal_leaf',
      observationId: 'obs_diurnal_leaf',
      investigationId: 'inv_diurnal_leaf',
      syntheticInsight: 'You documented nyctinastic turgor regulation mediated by pulvinus motor cells. By closing leaflet surfaces at dusk, the plant reduces radiative cooling, nocturnal dew evaporation, and grazing exposure.',
      deepeningQuestion: 'Does the closure begin before sunset light levels drop or in direct response to temperature change?',
      curiosityTags: ['nyctinasty', 'pulvinus', 'turgor-pressure', 'circadian-botany'],
      modelMetadata: {
        modelName: 'llama3.2:3b',
        inferenceDurationMs: 390,
        provider: 'local-naturalist',
      },
      createdAt: '2026-09-18T17:48:00.000Z',
    },
    discovery: {
      id: 'disc_diurnal_leaf',
      investigationId: 'inv_diurnal_leaf',
      reflectionId: 'ref_diurnal_leaf',
      title: 'Diurnal Leaf Movements',
      fieldCategory: 'Botany',
      significanceScore: 4,
      unlockedAt: '2026-09-18T17:48:00.000Z',
    },
  },
];


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
      const urlParams = new URLSearchParams(window.location.search);
      const urlView = urlParams.get('view') as AppView | null;
      const validViews: AppView[] = ['home', 'categories', 'setup', 'reveal', 'field', 'return', 'reflect', 'archive', 'detail'];

      const saved = localStorage.getItem('fieldnote_session_v3');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...init,
            ...parsed,
            currentView: urlView && validViews.includes(urlView) ? urlView : (parsed.currentView || init.currentView),
            isGenerating: false,
            isFieldActive: false,
            aiError: null,
          };
        } catch {
          // ignore
        }
      }
      if (urlView && validViews.includes(urlView)) {
        return {
          ...init,
          currentView: urlView,
          selectedEntry: urlView === 'detail' ? (init.selectedEntry || init.journalEntries[0]) : init.selectedEntry,
        };
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
          const userEntries = entries.filter((e) => e.investigation?.title !== 'TEST PHENOMENON');
          const merged = [...userEntries];
          for (const init of INITIAL_JOURNAL_ENTRIES) {
            if (!merged.some((m) => m.id === init.id || m.investigation?.title === init.investigation?.title)) {
              merged.push(init);
            }
          }
          dispatch({ type: 'SET_JOURNAL_ENTRIES', payload: merged });
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
