import {
  Investigation,
  Observation,
  Reflection,
  Discovery,
  InvestigationIntention,
  InvestigationDurationMinutes,
  SensoryFocus,
} from '@fieldnote/shared';

// API Key can come from localStorage or environment variable (VITE_GEMINI_API_KEY)
export function getGeminiApiKey(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('fieldnote_gemini_api_key');
    if (stored) return stored.trim();
  }
  return ((import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim();
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('fieldnote_gemini_api_key', key.trim());
  }
}

const SYSTEM_PROMPT = `
You are FIELDNOTE's naturalist investigation engine.
Your purpose is NOT to entertain the user.
Your purpose is to help the user notice physical reality.

CRITICAL INVARIANTS:
1. Require direct physical observation of everyday outdoor phenomena (weathering, shadow lines, acoustics, textures, fissures, water flow).
2. Must be possible without internet and without GPS.
3. Minimize phone interaction. The user must be able to put their phone away after reading.
4. Contain a specific, concrete, observable physical phenomenon.
5. Encourage quiet curiosity.
6. AVOID all dangerous activities, climbing, heights, or road traffic hazards.
7. NEVER require touching unknown plants, mushrooms, or animals.
8. NEVER act as a conversational chatbot. Never say "Sure!", "Great!", "Here is...".

OUTPUT FORMAT: Return raw, valid JSON only. No markdown formatting, no code fences.
`.trim();

async function callGeminiApi(prompt: string, apiKey: string): Promise<any> {
  const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-2.5-flash', 'gemini-1.5-flash'];
  let lastError: Error | null = null;

  for (const model of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: {
              parts: [{ text: SYSTEM_PROMPT }],
            },
            contents: [
              {
                role: 'user',
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              response_mime_type: 'application/json',
              temperature: 0.4,
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API HTTP ${response.status}: ${errText}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error('Empty response from Gemini API');
      }

      const cleaned = text.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, '$1').trim();
      return JSON.parse(cleaned);
    } catch (err: any) {
      lastError = err;
      // Try next model if 404/model not found
      if (err.message?.includes('404') || err.message?.includes('not found')) {
        continue;
      }
      throw err;
    }
  }

  throw lastError || new Error('Failed to connect to Gemini API');
}

export async function generateInvestigationWithGemini(
  intention: InvestigationIntention,
  durationMinutes: InvestigationDurationMinutes,
  sequenceNumber: number,
  apiKey: string
): Promise<Investigation> {
  const prompt = `
GENERATE FIELD INVESTIGATION NO. ${String(sequenceNumber).padStart(3, '0')}.
Target Duration: ${durationMinutes} minutes.
Perceptual Intention: ${intention.toUpperCase()}.

Generate a structured JSON investigation matching EXACTLY this JSON schema:
{
  "title": "Short title in 2-4 uppercase words (e.g. WEATHERING, SHADOW EDGES)",
  "directive": "One concise imperative sentence directing physical attention (e.g. Find something that has changed because of the weather.)",
  "groundingRule": "Strict phone-away physical directive (e.g. Don't photograph it yet. Observe it for 30 seconds.)",
  "inquiryQuestion": "Single inquiry sharpening perception (e.g. What evidence of the process is visible?)",
  "sensoryTags": ["visual", "tactile"],
  "estimatedMinutes": ${durationMinutes},
  "intention": "${intention}"
}
`.trim();

  const data = await callGeminiApi(prompt, apiKey);

  return {
    id: `inv_gemini_${String(sequenceNumber).padStart(3, '0')}_${Date.now()}`,
    sequenceNumber,
    title: (data.title || 'FIELD PHENOMENON').toUpperCase(),
    prompt: data.directive || data.prompt || 'Observe something altered by current outdoor conditions.',
    groundingConstraint: data.groundingRule || data.groundingConstraint || "Don't photograph it yet. Observe silently for 30 seconds.",
    inquiryQuestion: data.inquiryQuestion || 'What physical evidence reveals the ongoing process?',
    sensoryFocus: (data.sensoryTags as SensoryFocus[]) || ['visual', 'tactile'],
    targetDurationSeconds: 30,
    fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
}

export async function generateReflectionWithGemini(
  investigation: Investigation,
  observation: Observation,
  apiKey: string
): Promise<{ reflection: Reflection; discovery: Discovery }> {
  const observationText = observation.rawNotes?.trim() || '';
  const wordCount = observationText.split(/\s+/).filter(Boolean).length;

  if (wordCount < 4 || observationText.length < 12) {
    const reflection: Reflection = {
      id: `ref_gemini_${Date.now()}`,
      observationId: observation.id,
      investigationId: investigation.id,
      syntheticInsight: "Your observation isn't enough to support a confident interpretation yet.",
      deepeningQuestion: 'What subtle shifts in texture, temperature, or moisture might reveal more if observed for a full minute?',
      curiosityTags: ['preliminary', 'perceptual-focus'],
      nextInvestigationSeed: 'Return to this exact location and observe silently for 60 seconds without moving.',
      modelMetadata: {
        modelName: 'gemini-3.8-flash',
        inferenceDurationMs: 50,
        provider: 'gemini/anti-hallucination',
      },
      createdAt: new Date().toISOString(),
    };

    const discovery: Discovery = {
      id: `disc_gemini_${Date.now()}`,
      investigationId: investigation.id,
      reflectionId: reflection.id,
      title: 'Preliminary Observation',
      fieldCategory: 'Preliminary Notice',
      significanceScore: 4,
      unlockedAt: new Date().toISOString(),
    };

    return { reflection, discovery };
  }

  const prompt = `
ANALYZE FIELD OBSERVATION FOR: "${investigation.title}"
Investigation Directive was: "${investigation.prompt}"

USER'S RECORDED OBSERVATION:
Text: "${observationText}"
${observation.sensoryDetails?.visual ? `Visual note: "${observation.sensoryDetails.visual}"` : ''}
${observation.sensoryDetails?.tactile ? `Tactile note: "${observation.sensoryDetails.tactile}"` : ''}
${observation.photoUri ? 'Photo attached: Yes (captured after direct observation).' : ''}
${observation.audioUri ? 'Voice note attached: Yes.' : ''}

ANALYSIS RULES:
1. Strictly distinguish OBSERVATION vs INTERPRETATION.
2. If the user's observation lacks sufficient physical detail, DO NOT invent an explanation. Set whatItMightMean to: "Your observation isn't enough to support a confident interpretation yet."
3. Always use cautious probabilistic language: "may", "could", "one possibility".
4. Reward careful noticing.

Generate a structured JSON reflection matching EXACTLY this JSON schema:
{
  "whatUserNoticed": "Concise summary of what the user physically noticed directly from their text (1 sentence)",
  "whatItMightMean": "Grounded ecological or physical dynamic explaining the phenomenon (1-2 sentences)",
  "questionToCarry": "One deep reflective question to contemplate throughout their day (1 sentence)",
  "fieldDiscovery": "Category title of the observed phenomenon (e.g. Weather Artifacts)",
  "discoveryCategory": "A category badge (e.g. Weathering, Micro-Ecologies)",
  "nextInvestigationSeed": "One brief seed for their next physical outdoor walk (1 sentence)"
}
`.trim();

  const data = await callGeminiApi(prompt, apiKey);

  const reflection: Reflection = {
    id: `ref_gemini_${Date.now()}`,
    observationId: observation.id,
    investigationId: investigation.id,
    syntheticInsight: data.whatItMightMean || 'Physical factors such as moisture and exposure may be altering this surface over time.',
    deepeningQuestion: data.questionToCarry || 'What changes when environmental conditions shift?',
    curiosityTags: [data.discoveryCategory?.toLowerCase().replace(/\s+/g, '-') || 'weathering', 'field-observation', 'micro-climate'],
    nextInvestigationSeed: data.nextInvestigationSeed || 'Follow the threshold where this phenomenon meets unaffected ground.',
    modelMetadata: {
      modelName: 'gemini-3.8-flash',
      inferenceDurationMs: 300,
      provider: 'gemini-cloud',
    },
    createdAt: new Date().toISOString(),
  };

  const discovery: Discovery = {
    id: `disc_gemini_${Date.now()}`,
    investigationId: investigation.id,
    reflectionId: reflection.id,
    title: data.fieldDiscovery || data.discoveryCategory || 'Field Discovery',
    fieldCategory: data.discoveryCategory || data.fieldCategory || 'Natural Phenomenon',
    significanceScore: 4,
    unlockedAt: new Date().toISOString(),
  };

  return { reflection, discovery };
}

export async function testGeminiApiKey(
  apiKey: string
): Promise<{ success: boolean; message?: string; modelUsed?: string }> {
  try {
    const testPrompt = `Respond with valid JSON: {"status":"connected","engine":"FIELDNOTE Naturalist"}`;
    const result = await callGeminiApi(testPrompt, apiKey);
    if (result && (result.status === 'connected' || result.status || result.engine)) {
      return { success: true, modelUsed: 'gemini-3.8-flash' };
    }
    return { success: true, modelUsed: 'gemini-flash' };
  } catch (err: any) {
    const msg = err?.message || 'Unable to connect to Google Gemini API';
    if (msg.includes('400') || msg.includes('API_KEY_INVALID') || msg.includes('invalid')) {
      return { success: false, message: 'Invalid API Key. Please verify in Google AI Studio.' };
    }
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      return { success: false, message: 'API quota limit reached. Please check Google AI Studio.' };
    }
    return { success: false, message: msg };
  }
}

