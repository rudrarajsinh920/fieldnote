/**
 * FIELDNOTE Domain Models
 * Core loop: PREPARE → GO OUTSIDE → OBSERVE → RETURN → REFLECT → DISCOVER
 * Philosophy: "The better you use FIELDNOTE, the less you need to look at your phone."
 */

export type SensoryFocus =
  | 'visual'
  | 'auditory'
  | 'tactile'
  | 'temporal'
  | 'spatial'
  | 'olfactory';

export type InvestigationStatus =
  | 'pending'
  | 'in_field'
  | 'observed'
  | 'reflected'
  | 'completed'
  | 'archived';

export type SessionPhase =
  | 'prepare'
  | 'observe'
  | 'return'
  | 'reflect'
  | 'discover';

export interface EnvironmentContext {
  timeOfDay?: 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night';
  weatherHint?: 'clear' | 'overcast' | 'rain' | 'windy' | 'cold' | 'humid' | string;
  habitatHint?: 'urban' | 'park' | 'forest' | 'waterway' | 'balcony' | 'yard' | string;
  season?: 'spring' | 'summer' | 'autumn' | 'winter';
}

export interface Investigation {
  id: string;
  sequenceNumber: number;
  title: string;
  prompt: string;               // Main directive, e.g. "Find something that has changed because of the weather."
  groundingConstraint: string;  // e.g. "Don't photograph it yet. Observe it for 30 seconds."
  inquiryQuestion: string;      // e.g. "What evidence do you see?"
  sensoryFocus: SensoryFocus[];
  targetDurationSeconds: number; // e.g. 30, 60, 120
  fieldModeNotice: string;      // "LOOK. NOTICE. REMEMBER. Put your phone away."
  status: InvestigationStatus;
  environmentContext?: EnvironmentContext;
  createdAt: string;            // ISO 8601
  completedAt?: string;         // ISO 8601
}

export interface SensoryNotes {
  visual?: string;
  auditory?: string;
  tactile?: string;
  temporal?: string;
  additional?: string;
}

export type InvestigationIntention =
  | 'notice'
  | 'explore'
  | 'understand'
  | 'create'
  | 'surprise';

export type InvestigationDurationMinutes = 10 | 20 | 30;

export interface Observation {
  id: string;
  investigationId: string;
  recordedAt: string;           // ISO 8601
  actualDurationSeconds: number;
  rawNotes: string;             // User's description of what was noticed
  sensoryDetails?: SensoryNotes;
  photoUri?: string;            // Deferred capture: taken AFTER direct observation
  audioUri?: string;            // Deferred capture: short field audio note
  putAwayComplied: boolean;     // Did user put the phone away during field observation?
}

export interface Reflection {
  id: string;
  observationId: string;
  investigationId: string;
  syntheticInsight: string;     // AI naturalist synthesis (not a chatbot reply; an editorial journal commentary)
  deepeningQuestion: string;    // Next layer prompt to sharpen perceptual acuity
  curiosityTags: string[];      // Micro-phenomena tags (e.g., ["patina", "moisture-gradient", "moss-growth"])
  nextInvestigationSeed?: string;// Naturalist seed suggestion for next field trip
  modelMetadata: {
    modelName: string;
    inferenceDurationMs: number;
    provider: string;           // "ollama" | "local-custom"
  };
  createdAt: string;            // ISO 8601
}

export interface Discovery {
  id: string;
  investigationId: string;
  reflectionId: string;
  title: string;
  fieldCategory: string;        // e.g. "Weather Artifacts", "Micro-Ecologies", "Structural Decay"
  significanceScore: number;    // Acuity score (1-5)
  unlockedAt: string;           // ISO 8601
}

export interface JournalEntry {
  id: string;
  investigation: Investigation;
  observation: Observation;
  reflection: Reflection;
  discovery: Discovery;
  createdAt: string;
}

export interface FieldSession {
  id: string;
  activeInvestigationId: string;
  currentPhase: SessionPhase;
  startedAt: string;            // ISO 8601
  fieldEnteredAt?: string;      // When user stepped outside / activated Field Mode
  returnedAt?: string;          // When user returned to log observations
  phoneAwaySeconds: number;     // Aggregated time screen was off or user had phone in pocket
}
