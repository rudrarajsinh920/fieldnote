import { InvestigationGenerationInput, ReflectionGenerationInput } from '@fieldnote/shared';

export const FIELDNOTE_NATURALIST_SYSTEM_PROMPT = `
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
7. AVOID private-property trespassing.
8. AVOID environmental damage or disturbing natural ground.
9. NEVER require touching unknown plants, mushrooms, or animals.
10. NEVER require approaching wildlife.
11. NEVER claim certainty about an unidentified species.
12. AVOID any instructions that create physical risk.
13. NEVER act as a conversational chatbot. Never say "Sure!", "Great!", "Absolutely!", "Let me help you...", or provide preamble/conversational chit-chat.

OUTPUT FORMAT: Return raw, valid JSON only. No markdown formatting, no code fences, no conversational prose.
`.trim();

export function buildInvestigationPrompt(input: InvestigationGenerationInput): string {
  const priors = input.priorObservations && input.priorObservations.length > 0
    ? `Prior observations logged by user:
${input.priorObservations.slice(-3).map((p, i) => `${i + 1}. [${p.curiosityTags.join(', ')}] ${p.title}: "${p.rawNotes.slice(0, 100)}"`).join('\n')}`
    : 'This is the user\'s first field investigation.';

  const environmentNotes = [
    input.environment?.weatherHint ? `Current conditions: ${input.environment.weatherHint}.` : '',
    input.environment?.habitatHint ? `Naturalist's local focus: ${input.environment.habitatHint}.` : '',
  ].filter(Boolean);
  const envText = environmentNotes.length ? `${environmentNotes.join('\n')}\n` : '';

  return `
GENERATE FIELD INVESTIGATION NO. ${String(input.sequenceNumber).padStart(3, '0')}.
Target Duration: ${input.durationMinutes} minutes.
Perceptual Intention: ${input.intention.toUpperCase()}.
${envText}${priors}

Generate a structured JSON investigation matching EXACTLY this JSON schema:
{
  "title": "Short title in 2-4 uppercase words (e.g. WEATHERING, SHADOW EDGES)",
  "directive": "One concise imperative sentence directing physical attention (e.g. Find something that has changed because of the weather.)",
  "groundingRule": "Strict phone-away physical directive (e.g. Don't photograph it yet. Observe it for 30 seconds.)",
  "inquiryQuestion": "Single inquiry sharpening their perception (e.g. What evidence of the process is visible?)",
  "sensoryTags": ["visual", "tactile"],
  "estimatedMinutes": ${input.durationMinutes},
  "intention": "${input.intention}"
}
`.trim();
}

export function buildReflectionPrompt(input: ReflectionGenerationInput): string {
  const { investigation, observationText, visualNote, tactileNote, optionalPhotoMetadata, optionalAudioMetadata } = input;

  return `
ANALYZE FIELD OBSERVATION FOR: "${investigation.title}"
Investigation Directive was: "${investigation.prompt}"

USER'S RECORDED OBSERVATION:
Text: "${observationText.trim()}"
${visualNote ? `Visual note: "${visualNote.trim()}"` : ''}
${tactileNote ? `Tactile note: "${tactileNote.trim()}"` : ''}
${optionalPhotoMetadata?.hasPhoto ? 'Photo attached: Yes (captured after direct observation).' : ''}
${optionalAudioMetadata?.hasAudio ? 'Voice note attached: Yes.' : ''}

ANALYSIS RULES:
1. Strictly distinguish OBSERVATION vs INTERPRETATION.
2. If the user's observation lacks sufficient physical detail, factual evidence, or is too vague (under 4 descriptive words or nonsensical), DO NOT invent an explanation. Set whatItMightMean to: "Your observation isn't enough to support a confident interpretation yet." and generate a better observation question.
3. Never present speculation as fact. Always use cautious probabilistic language: "may", "could", "one possibility".
4. Reward careful noticing, not guessing.
5. Return concise, grounded natural history analysis.

Generate a structured JSON reflection matching EXACTLY this JSON schema:
{
  "whatUserNoticed": "Concise summary of what the user physically noticed directly from their text (1 sentence)",
  "whatItMightMean": "Grounded ecological, physical, or temporal dynamic that could explain the phenomenon, or 'Your observation isn't enough to support a confident interpretation yet.' if evidence is sparse (1-2 sentences)",
  "questionToCarry": "One deep reflective question the user can contemplate throughout their day (1 sentence)",
  "fieldDiscovery": "Category title of the observed phenomenon (e.g. Weather Artifacts, Micro-Ecologies)",
  "discoveryCategory": "A category badge (e.g. Weathering, Structural Tension, Lichen Dynamics)",
  "nextInvestigationSeed": "One brief seed for their next physical outdoor walk (1 sentence)"
}
`.trim();
}
