import {
  EnvironmentContext,
  Investigation,
  InvestigationDurationMinutes,
  InvestigationIntention,
  SensoryFocus,
} from './domain.js';

/**
 * AI Provider & Generation Contracts
 * Designed for Ollama / local open-weight inference with pluggable backend adapters.
 */

export interface AIProviderConfig {
  baseUrl: string;             // e.g. "http://127.0.0.1:11434"
  modelName: string;           // e.g. "llama3.2:3b", "mistral:7b", "phi3:mini"
  temperature: number;         // conservative (e.g. 0.4 - 0.5) for grounded editorial tone
  timeoutMs: number;
  maxInvestigationTokens: number; // default: 256
  maxReflectionTokens: number;    // default: 384
}

export type AIStatusCode =
  | 'READY'
  | 'LOCAL_MODEL_UNAVAILABLE'
  | 'MODEL_NOT_FOUND'
  | 'AI_TIMEOUT'
  | 'MALFORMED_AI_RESPONSE'
  | 'INSUFFICIENT_EVIDENCE';

export interface AIStructuredError {
  error: string;
  aiStatus: AIStatusCode;
  message: string;
  retryable: boolean;
}

export interface InvestigationAISchema {
  title: string;
  directive: string;
  groundingRule: string;
  inquiryQuestion: string;
  sensoryTags: string[];
  estimatedMinutes: number;
  intention: string;
}

export interface ReflectionAISchema {
  whatUserNoticed: string;
  whatItMightMean: string;
  questionToCarry: string;
  fieldDiscovery: string;
  discoveryCategory: string;
  nextInvestigationSeed: string;
}

export interface InvestigationGenerationInput {
  sequenceNumber: number;
  intention: InvestigationIntention;
  durationMinutes: InvestigationDurationMinutes;
  environment?: EnvironmentContext;
  priorObservations?: Array<{
    title: string;
    rawNotes: string;
    curiosityTags: string[];
  }>;
  preferredSensoryFocus?: SensoryFocus[];
}

export interface InvestigationGenerationResult {
  title: string;
  directive: string;
  prompt: string;               // Normalized to directive
  groundingRule: string;
  groundingConstraint: string;  // Normalized to groundingRule
  inquiryQuestion: string;
  sensoryTags: string[];
  sensoryFocus: SensoryFocus[];
  estimatedMinutes: number;
  targetDurationSeconds: number;
  intention: string;
  fieldModeNotice: string;
}

export interface ReflectionGenerationInput {
  investigation: Investigation;
  observationText: string;
  visualNote?: string;
  tactileNote?: string;
  optionalPhotoMetadata?: {
    capturedAfterObservation: boolean;
    hasPhoto?: boolean;
    fileSizeBytes?: number;
  };
  optionalAudioMetadata?: {
    durationSeconds?: number;
    hasAudio?: boolean;
  };
}

export interface ReflectionGenerationResult {
  whatUserNoticed: string;
  whatItMightMean: string;
  syntheticInsight: string;     // Normalized to whatItMightMean
  questionToCarry: string;
  deepeningQuestion: string;    // Normalized to questionToCarry
  fieldDiscovery: string;
  discoveryCategory: string;
  fieldCategory: string;        // Normalized to discoveryCategory
  curiosityTags: string[];
  nextInvestigationSeed: string;
  modelMetadata: {
    modelName: string;
    inferenceDurationMs: number;
    provider: string;
  };
}

export interface ModelHealthStatus {
  available: boolean;
  model: string;
  provider: 'ollama' | 'mock' | 'custom';
  latencyMs?: number;
  aiStatus: AIStatusCode;
  error?: string;
  availableModels?: string[];
}

export interface IAIModelService {
  checkHealth(): Promise<ModelHealthStatus>;
  generateInvestigation(input: InvestigationGenerationInput): Promise<InvestigationGenerationResult>;
  generateReflection(input: ReflectionGenerationInput): Promise<ReflectionGenerationResult>;
}
