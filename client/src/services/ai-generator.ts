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

// Fallback offline generator (used when offline or on static web deployment)
export function getOfflineInvestigationFallback(
  intention: InvestigationIntention,
  _durationMinutes: InvestigationDurationMinutes,
  sequenceNumber: number
): Investigation {
  const directives: Record<string, { title: string; prompt: string; grounding: string; inquiry: string; focus: SensoryFocus[] }> = {
    notice: {
      title: 'FOLIAR VENATION & MOISTURE',
      prompt: 'Find a fallen leaf or branch. Examine the primary and secondary veins where rainwater or dew has collected.',
      grounding: 'Pocket your device. Feel the leaf underside with your fingertips before photographing.',
      inquiry: 'How do the finer vascular capillaries divide to distribute moisture?',
      focus: ['visual', 'tactile'],
    },
    explore: {
      title: 'BUILT VS. WILD BORDERLINE',
      prompt: 'Locate a boundary where masonry, concrete, or brick touches living soil or wild moss.',
      grounding: 'Observe without touching the screen for 30 seconds. Feel the temperature shift across the seam.',
      inquiry: 'Which side retains moisture longer, and what organism has crossed the border?',
      focus: ['temporal', 'tactile', 'visual'],
    },
    understand: {
      title: 'WEATHERING & MICRO-SUCCESSION',
      prompt: 'Find an outdoor surface altered by wind, rain, or sun. Observe the erosion fissures.',
      grounding: 'Step within arm’s reach. Notice color gradations between exposed and sheltered zones.',
      inquiry: 'What physical forces—water flow, gravity, or sun exposure—carved this contour?',
      focus: ['visual', 'temporal'],
    },
    create: {
      title: 'TEXTURE CARTOGRAPHY',
      prompt: 'Compare two contrasting natural textures within ten steps of each other (e.g. rough bark vs smooth river stone).',
      grounding: 'Close your eyes for 15 seconds to judge the grit and temperature purely by fingertip touch.',
      inquiry: 'How does the surface roughness correlate with how water drains from it?',
      focus: ['tactile', 'spatial'],
    },
    surprise: {
      title: 'CRYPTOGAMIC CRUSTS',
      prompt: 'Find a patch of lichen or moss growing on stone or pavement that most people step over without noticing.',
      grounding: 'Do not disturb the colony. Count the distinct shades of sage, charcoal, and ochre.',
      inquiry: 'How does this pioneer organism anchor to bare mineral rock without true roots?',
      focus: ['visual', 'spatial'],
    },
  };

  const selected = directives[intention] || directives.notice;

  return {
    id: `inv_naturalist_${String(sequenceNumber).padStart(3, '0')}_${Date.now()}`,
    sequenceNumber,
    title: selected.title,
    prompt: selected.prompt,
    groundingConstraint: selected.grounding,
    inquiryQuestion: selected.inquiry,
    sensoryFocus: selected.focus,
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
  const noteSnippet = observation.rawNotes.trim();
  const reflection: Reflection = {
    id: `ref_naturalist_${Date.now()}`,
    observationId: observation.id,
    investigationId: investigation.id,
    syntheticInsight: `Physical forces and biological resilience observed: based directly on your evidence (“${noteSnippet.slice(0, 100)}${noteSnippet.length > 100 ? '...' : ''}”), moisture gradients and micro-climates dictate where pioneer flora flourish and materials weather.`,
    deepeningQuestion: `What would this exact physical spot look like after 48 hours of unbroken rain or three days of direct solar exposure?`,
    curiosityTags: ['weathering', 'micro-habitat', 'sensory-acuity'],
    nextInvestigationSeed: 'Observe how the adjacent soil responds to the same physical conditions.',
    modelMetadata: {
      modelName: 'naturalist-engine-v1',
      inferenceDurationMs: 15,
      provider: 'ollama',
    },
    createdAt: new Date().toISOString(),
  };

  const discovery: Discovery = {
    id: `disc_${Date.now()}`,
    investigationId: investigation.id,
    reflectionId: reflection.id,
    title: investigation.title,
    fieldCategory: 'Physical Micro-Habitat',
    significanceScore: 5,
    unlockedAt: new Date().toISOString(),
  };

  return { reflection, discovery };
}
