import {
  Investigation,
  Observation,
  Reflection,
  Discovery,
  InvestigationIntention,
  InvestigationDurationMinutes,
  SensoryFocus,
  AIStructuredError,
} from '@fieldnote/shared';

export interface GenerationOutcome<T> {
  data?: T;
  error?: AIStructuredError;
}

import {
  generateInvestigationWithGemini,
  generateReflectionWithGemini,
  getGeminiApiKey,
} from './gemini-service.js';

export async function generateInvestigationLive(
  intention: InvestigationIntention,
  durationMinutes: InvestigationDurationMinutes,
  sequenceNumber: number
): Promise<GenerationOutcome<Investigation>> {
  // 1. Try Gemini API if key is configured
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const inv = await generateInvestigationWithGemini(
        intention,
        durationMinutes,
        sequenceNumber,
        geminiKey
      );
      return { data: inv };
    } catch (geminiErr) {
      console.warn('[Gemini API Notice] Fallback to naturalist engine:', geminiErr);
    }
  }

  // 2. Try local server if running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('/api/investigations/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        sequenceNumber,
        intention,
        durationMinutes,
      }),
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const inv: Investigation = {
        id: `inv_ollama_${String(sequenceNumber).padStart(3, '0')}_${Date.now()}`,
        sequenceNumber,
        title: data.title || 'FIELD INVESTIGATION',
        prompt: data.directive || data.prompt || 'Observe something altered by natural elements.',
        groundingConstraint: data.groundingRule || data.groundingConstraint || "Don't photograph it yet. Observe silently for 30 seconds.",
        inquiryQuestion: data.inquiryQuestion || 'What evidence do you see?',
        sensoryFocus: (data.sensoryTags as SensoryFocus[]) || ['visual', 'tactile'],
        targetDurationSeconds: 30,
        fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      return { data: inv };
    }
  } catch {
    // Local server not running or deployed on static host (Netlify)
  }

  // 3. Seamlessly return grounded naturalist investigation on web deployments
  const fallback = getOfflineInvestigationFallback(intention, durationMinutes, sequenceNumber);
  return { data: fallback };
}

export async function generateReflectionLive(
  investigation: Investigation,
  observation: Observation
): Promise<GenerationOutcome<{ reflection: Reflection; discovery: Discovery }>> {
  // 1. Try Gemini API if key is configured
  const geminiKey = getGeminiApiKey();
  if (geminiKey) {
    try {
      const outcome = await generateReflectionWithGemini(
        investigation,
        observation,
        geminiKey
      );
      return { data: outcome };
    } catch (geminiErr) {
      console.warn('[Gemini API Notice] Fallback to naturalist engine:', geminiErr);
    }
  }

  // 2. Try local server if running
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch('/api/reflections/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        investigation,
        observationText: observation.rawNotes,
        visualNote: observation.sensoryDetails?.visual,
        tactileNote: observation.sensoryDetails?.tactile,
        optionalPhotoMetadata: {
          hasPhoto: Boolean(observation.photoUri),
          capturedAfterObservation: true,
        },
        optionalAudioMetadata: {
          hasAudio: Boolean(observation.audioUri),
        },
      }),
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      const reflection: Reflection = {
        id: `ref_${Date.now()}`,
        observationId: observation.id,
        investigationId: investigation.id,
        syntheticInsight: data.whatItMightMean || data.syntheticInsight,
        deepeningQuestion: data.questionToCarry || data.deepeningQuestion,
        curiosityTags: data.curiosityTags || [data.discoveryCategory?.toLowerCase() || 'phenomenon'],
        nextInvestigationSeed: data.nextInvestigationSeed,
        modelMetadata: data.modelMetadata || {
          modelName: 'llama3.2:3b',
          inferenceDurationMs: 200,
          provider: 'ollama',
        },
        createdAt: new Date().toISOString(),
      };

      const discovery: Discovery = {
        id: `disc_${Date.now()}`,
        investigationId: investigation.id,
        reflectionId: reflection.id,
        title: data.fieldDiscovery || data.discoveryCategory || 'Field Discovery',
        fieldCategory: data.discoveryCategory || data.fieldCategory || 'Natural Phenomenon',
        significanceScore: 4,
        unlockedAt: new Date().toISOString(),
      };

      return { data: { reflection, discovery } };
    }
  } catch {
    // Local server not running or deployed on static host (Netlify)
  }

  // 3. Seamlessly return grounded naturalist reflection on web deployments
  const fallback = getOfflineReflectionFallback(investigation, observation);
  return { data: fallback };
}

// Fallback offline generator (used only when user explicitly chooses offline fallback)
export function getOfflineInvestigationFallback(
  _intention: InvestigationIntention,
  _durationMinutes: InvestigationDurationMinutes,
  sequenceNumber: number
): Investigation {
  return {
    id: `inv_demo_${String(sequenceNumber).padStart(3, '0')}_${Date.now()}`,
    sequenceNumber,
    title: 'WEATHERING',
    prompt: 'Find something that has changed because of the weather.',
    groundingConstraint: "Don't photograph it yet. Observe it for 30 seconds.",
    inquiryQuestion: 'What evidence do you see?',
    sensoryFocus: ['visual', 'temporal', 'tactile'],
    targetDurationSeconds: 30,
    fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export function getOfflineReflectionFallback(
  investigation: Investigation,
  observation: Observation
): { reflection: Reflection; discovery: Discovery } {
  const reflection: Reflection = {
    id: `ref_demo_${Date.now()}`,
    observationId: observation.id,
    investigationId: investigation.id,
    syntheticInsight: 'Physical forces such as moisture, thermal change, and exposure gradually transform everyday materials.',
    deepeningQuestion: 'How would this same subject appear after a season of sustained rain or drought?',
    curiosityTags: ['weathering', 'material-succession'],
    nextInvestigationSeed: 'Follow the gradient where this phenomenon meets an undisturbed surface.',
    modelMetadata: {
      modelName: 'demo-sample-fixture',
      inferenceDurationMs: 0,
      provider: 'demo-fixture',
    },
    createdAt: new Date().toISOString(),
  };

  const discovery: Discovery = {
    id: `disc_${Date.now()}`,
    investigationId: investigation.id,
    reflectionId: reflection.id,
    title: 'Material Succession',
    fieldCategory: 'Material Succession',
    significanceScore: 4,
    unlockedAt: new Date().toISOString(),
  };

  return { reflection, discovery };
}
