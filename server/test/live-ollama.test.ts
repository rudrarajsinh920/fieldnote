import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { OllamaModelProvider } from '../src/services/ai/ollama-provider.js';

describe('FIELDNOTE Real Ollama Integration (llama3.2:3b)', () => {
  const provider = new OllamaModelProvider({
    baseUrl: 'http://127.0.0.1:11434',
    modelName: 'llama3.2:3b',
    temperature: 0.4,
    timeoutMs: 90000,
    maxInvestigationTokens: 256,
    maxReflectionTokens: 384,
  });

  it('should verify live Ollama health and model availability', async () => {
    const health = await provider.checkHealth();
    console.log('Live Ollama Health:', health);
    assert.equal(health.available, true);
    assert.equal(health.model, 'llama3.2:3b');
    assert.equal(health.aiStatus, 'READY');
  });

  it('should generate a live naturalist investigation from llama3.2:3b', async () => {
    const result = await provider.generateInvestigation({
      sequenceNumber: 1,
      durationMinutes: 10,
      intention: 'notice',
    });

    console.log('Generated Live Investigation:', result);
    assert.ok(result.title);
    assert.ok(result.directive);
    assert.ok(result.groundingRule);
    assert.ok(result.inquiryQuestion);
    assert.equal(result.estimatedMinutes, 10);
  });

  it('should generate a live naturalist reflection from llama3.2:3b', async () => {
    const result = await provider.generateReflection({
      investigation: {
        id: 'inv_live_01',
        sequenceNumber: 1,
        title: 'WEATHERING',
        prompt: 'Find something that has changed because of the weather.',
        groundingConstraint: "Don't photograph it yet. Observe it for 30 seconds.",
        inquiryQuestion: 'What evidence do you see?',
        sensoryFocus: ['visual', 'tactile'],
        targetDurationSeconds: 30,
        fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
        status: 'observed',
        createdAt: new Date().toISOString(),
      },
      observationText:
        'The concrete base of the gate is darker and slightly crumbly where rainwater pooled on the northeast side. Small green moss patches are growing in the fissure.',
      visualNote: 'Clear moisture boundary between pale dry cement and dark damp concrete.',
      tactileNote: 'Crumbling sand-like grit on fingertips.',
    });

    console.log('Generated Live Reflection:', result);
    assert.ok(result.whatUserNoticed);
    assert.ok(result.whatItMightMean);
    assert.ok(result.questionToCarry);
    assert.ok(result.fieldDiscovery);
  });
});
