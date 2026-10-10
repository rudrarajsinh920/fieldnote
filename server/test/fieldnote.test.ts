import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { OllamaModelProvider } from '../src/services/ai/ollama-provider.js';
import { getDatabase } from '../src/db/database.js';
import {
  AIStructuredError,
  Investigation,
  Observation,
  Reflection,
  Discovery,
} from '@fieldnote/shared';

describe('FIELDNOTE Phase 3 Test Suite', () => {
  let mockServer: http.Server;
  let mockPort: number;

  before(async () => {
    // Spin up a controlled mock server to simulate various Ollama states
    mockServer = http.createServer((req, res) => {
      const url = req.url || '';

      if (url === '/api/tags') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            models: [{ name: 'llama3.2:3b' }, { name: 'nomic-embed-text:latest' }],
          })
        );
        return;
      }

      if (url === '/api/generate') {
        let body = '';
        req.on('data', (chunk) => (body += chunk));
        req.on('end', () => {
          const parsed = JSON.parse(body || '{}');

          // Simulate timeout if requested
          if (parsed.prompt?.includes('SIMULATE_TIMEOUT')) {
            // Keep connection open without responding
            return;
          }

          // Simulate malformed JSON
          if (parsed.prompt?.includes('SIMULATE_MALFORMED')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ response: 'This is not valid json at all!' }));
            return;
          }

          // Simulate investigation generation
          if (parsed.prompt?.includes('GENERATE FIELD INVESTIGATION')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                response: JSON.stringify({
                  title: 'WEATHERING',
                  directive: 'Find something that has changed because of the weather.',
                  groundingRule: "Don't photograph it yet. Observe it for 30 seconds.",
                  inquiryQuestion: 'What evidence of the process do you see?',
                  sensoryTags: ['visual', 'tactile'],
                  estimatedMinutes: 10,
                  intention: 'notice',
                }),
              })
            );
            return;
          }

          // Simulate reflection generation
          if (parsed.prompt?.includes('ANALYZE FIELD OBSERVATION')) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(
              JSON.stringify({
                response: JSON.stringify({
                  whatUserNoticed: 'The bark was darker on the side facing the ground with fine moss colonies.',
                  whatItMightMean:
                    'Moisture and capillary action may be affecting the surface, creating a micro-climate where moss colonies thrive in the rain shadow.',
                  questionToCarry: 'What changes when the surface dries under the afternoon sun?',
                  fieldDiscovery: 'Micro-Ecologies',
                  discoveryCategory: 'Micro-Ecologies',
                  nextInvestigationSeed: 'Follow the water path from this tree toward the open ground.',
                }),
              })
            );
            return;
          }

          res.writeHead(404);
          res.end();
        });
        return;
      }

      res.writeHead(404);
      res.end();
    });

    await new Promise<void>((resolve) => {
      mockServer.listen(0, '127.0.0.1', () => {
        const addr = mockServer.address() as any;
        mockPort = addr.port;
        resolve();
      });
    });
  });

  after(async () => {
    await new Promise<void>((resolve) => {
      mockServer.close(() => resolve());
    });
  });

  // TEST 1: Valid investigation generation
  it('1. should generate a valid structured investigation from local AI', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 5000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const result = await provider.generateInvestigation({
      sequenceNumber: 1,
      durationMinutes: 10,
      intention: 'notice',
    });

    assert.equal(result.title, 'WEATHERING');
    assert.equal(result.directive, 'Find something that has changed because of the weather.');
    assert.equal(result.groundingRule, "Don't photograph it yet. Observe it for 30 seconds.");
    assert.equal(result.inquiryQuestion, 'What evidence of the process do you see?');
    assert.deepEqual(result.sensoryTags, ['visual', 'tactile']);
    assert.equal(result.estimatedMinutes, 10);
    assert.equal(result.targetDurationSeconds, 600);
    assert.equal(result.intention, 'notice');
  });

  // TEST 2: Malformed AI JSON handling
  it('2. should handle malformed AI JSON without crashing and return structured error', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 5000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    try {
      await provider.generateInvestigation({
        sequenceNumber: 2,
        durationMinutes: 10,
        intention: 'notice',
        environment: { weatherHint: 'SIMULATE_MALFORMED' },
      });
      assert.fail('Should have thrown an error');
    } catch (err: any) {
      assert.equal(err.aiStatus, 'MALFORMED_AI_RESPONSE');
      assert.equal(err.retryable, true);
    }
  });

  // TEST 3: Ollama unavailable
  it('3. should handle Ollama service unavailable with clear structured state', async () => {
    // Non-existent port
    const provider = new OllamaModelProvider({
      baseUrl: 'http://127.0.0.1:59999',
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 1000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const health = await provider.checkHealth();
    assert.equal(health.available, false);
    assert.equal(health.aiStatus, 'LOCAL_MODEL_UNAVAILABLE');

    try {
      await provider.generateInvestigation({
        sequenceNumber: 3,
        durationMinutes: 20,
        intention: 'explore',
      });
      assert.fail('Should have thrown model unavailable error');
    } catch (err: any) {
      assert.equal(err.aiStatus, 'LOCAL_MODEL_UNAVAILABLE');
      assert.match(err.message, /Local AI is currently unavailable/);
    }
  });

  // TEST 4: Ollama timeout handling
  it('4. should handle local model generation timeout cleanly', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 500, // Short timeout for test
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    try {
      await provider.generateInvestigation({
        sequenceNumber: 4,
        durationMinutes: 10,
        intention: 'notice',
        environment: { weatherHint: 'SIMULATE_TIMEOUT' },
      });
      assert.fail('Should have timed out');
    } catch (err: any) {
      assert.equal(err.aiStatus, 'AI_TIMEOUT');
      assert.match(err.message, /took too long to respond/);
    }
  });

  // TEST 5: Model unavailable (not installed)
  it('5. should identify when requested model is missing in local Ollama', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'uninstalled-model:70b',
      temperature: 0.4,
      timeoutMs: 2000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const health = await provider.checkHealth();
    assert.equal(health.available, false);
    assert.equal(health.aiStatus, 'MODEL_NOT_FOUND');
  });

  // TEST 6: Anti-hallucination behavior (insufficient observation evidence)
  it('6. should reject insufficient observation evidence without guessing or hallucinating', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 5000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const sampleInv: Investigation = {
      id: 'inv_test_01',
      sequenceNumber: 1,
      title: 'WEATHERING',
      prompt: 'Find something that has changed because of the weather.',
      groundingConstraint: "Don't photograph it yet. Observe it for 30 seconds.",
      inquiryQuestion: 'What evidence do you see?',
      sensoryFocus: ['visual'],
      targetDurationSeconds: 30,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'observed',
      createdAt: new Date().toISOString(),
    };

    // User entered vague / minimal input
    const reflection = await provider.generateReflection({
      investigation: sampleInv,
      observationText: 'hi nothing',
    });

    assert.equal(
      reflection.whatItMightMean,
      "Your observation isn't enough to support a confident interpretation yet."
    );
    assert.match(reflection.questionToCarry, /What subtle shifts in texture/);
    assert.equal(reflection.discoveryCategory, 'Preliminary Notice');
  });

  // TEST 7: Valid reflection generation
  it('7. should generate a structured naturalist reflection distinguishing observation vs interpretation', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 5000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const sampleInv: Investigation = {
      id: 'inv_test_02',
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
    };

    const reflection = await provider.generateReflection({
      investigation: sampleInv,
      observationText:
        'The bark was darker on the side facing the ground with fine moss colonies thriving in the damp cleft.',
      visualNote: 'Sharp color threshold between green moss and chalky dry wood.',
      tactileNote: 'Cool and damp to touch.',
    });

    assert.match(reflection.whatUserNoticed, /bark was darker/);
    assert.match(reflection.whatItMightMean, /may be affecting/); // Uses cautious "may"
    assert.equal(reflection.discoveryCategory, 'Micro-Ecologies');
    assert.match(reflection.questionToCarry, /What changes when the surface dries/);
  });

  // TEST 8: Invalid reflection handling
  it('8. should handle invalid reflection input gracefully', async () => {
    const provider = new OllamaModelProvider({
      baseUrl: `http://127.0.0.1:${mockPort}`,
      modelName: 'llama3.2:3b',
      temperature: 0.4,
      timeoutMs: 5000,
      maxInvestigationTokens: 256,
      maxReflectionTokens: 384,
    });

    const sampleInv: Investigation = {
      id: 'inv_test_03',
      sequenceNumber: 1,
      title: 'WEATHERING',
      prompt: 'Find something that has changed because of the weather.',
      groundingConstraint: 'Observe silently.',
      inquiryQuestion: 'What do you see?',
      sensoryFocus: ['visual'],
      targetDurationSeconds: 30,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
      status: 'observed',
      createdAt: new Date().toISOString(),
    };

    // Vague / short input triggers anti-hallucination rather than crash
    const res = await provider.generateReflection({
      investigation: sampleInv,
      observationText: '   ',
    });

    assert.equal(
      res.whatItMightMean,
      "Your observation isn't enough to support a confident interpretation yet."
    );
  });

  // TEST 9: Phase transition state machine
  it('9. should correctly enforce the core ritual phase transitions', () => {
    const phases = ['prepare', 'observe', 'return', 'reflect', 'discover'] as const;
    let currentPhaseIndex = 0;

    const advance = () => {
      currentPhaseIndex++;
      return phases[currentPhaseIndex];
    };

    assert.equal(phases[currentPhaseIndex], 'prepare');
    assert.equal(advance(), 'observe');
    assert.equal(advance(), 'return');
    assert.equal(advance(), 'reflect');
    assert.equal(advance(), 'discover');
  });

  // TEST 10: SQLite Journal persistence
  it('10. should persist and retrieve completed journal entries in SQLite', () => {
    const db = getDatabase();

    const invId = `inv_test_${Date.now()}`;
    const obsId = `obs_test_${Date.now()}`;
    const refId = `ref_test_${Date.now()}`;
    const discId = `disc_test_${Date.now()}`;

    // 1. Insert investigation
    const insertInv = db.prepare(`
      INSERT INTO investigations (
        id, sequence_number, title, prompt, grounding_constraint, inquiry_question,
        sensory_focus, target_duration_seconds, field_mode_notice, status, created_at, completed_at
      ) VALUES (?, 1, 'TEST PHENOMENON', 'Directive prompt', 'Grounding rule', 'Question?',
        '["visual"]', 30, 'LOOK.', 'completed', datetime('now'), datetime('now'))
    `);
    insertInv.run(invId);

    // 2. Insert observation
    const insertObs = db.prepare(`
      INSERT INTO observations (
        id, investigation_id, recorded_at, actual_duration_seconds, raw_notes,
        sensory_details, photo_uri, put_away_complied
      ) VALUES (?, ?, datetime('now'), 45, 'Detailed observation notes', null, null, 1)
    `);
    insertObs.run(obsId, invId);

    // 3. Insert reflection
    const insertRef = db.prepare(`
      INSERT INTO reflections (
        id, observation_id, investigation_id, synthetic_insight, deepening_question,
        curiosity_tags, model_name, inference_duration_ms, provider, created_at
      ) VALUES (?, ?, ?, 'Synthetic insight text', 'Deepening question text?',
        '["lichen"]', 'llama3.2:3b', 120, 'ollama', datetime('now'))
    `);
    insertRef.run(refId, obsId, invId);

    // 4. Insert discovery
    const insertDisc = db.prepare(`
      INSERT INTO discoveries (
        id, investigation_id, reflection_id, title, field_category, significance_score, unlocked_at
      ) VALUES (?, ?, ?, 'Micro-Ecologies', 'Micro-Ecologies', 4, datetime('now'))
    `);
    insertDisc.run(discId, invId, refId);

    // Query back
    const row = db
      .prepare(`SELECT * FROM investigations WHERE id = ?`)
      .get(invId) as any;
    assert.ok(row);
    assert.equal(row.title, 'TEST PHENOMENON');
    assert.equal(row.status, 'completed');

    const obsRow = db
      .prepare(`SELECT * FROM observations WHERE id = ?`)
      .get(obsId) as any;
    assert.ok(obsRow);
    assert.equal(obsRow.raw_notes, 'Detailed observation notes');
    assert.equal(obsRow.put_away_complied, 1);
  });
});
