import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getDatabase } from './db/database.js';
import { aiService } from './services/ai/index.js';
import { AIStructuredError, InvestigationGenerationInput, ReflectionGenerationInput } from '@fieldnote/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '5mb' }));

  // Initialize SQLite database
  const db = getDatabase();

  // Health check for Render and monitoring
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  // Root system & AI health check
  app.get('/api/system/health', async (_req: Request, res: Response) => {
    try {
      const aiHealth = await aiService.checkHealth();
      res.json({
        status: 'ok',
        service: 'FIELDNOTE Core API',
        version: '0.2.0',
        timestamp: new Date().toISOString(),
        ai: aiHealth,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({
        status: 'error',
        error: message,
      });
    }
  });

  // Generate Investigation endpoint
  app.post('/api/investigations/generate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        sequenceNumber = 1,
        intention = 'notice',
        durationMinutes = 10,
        preferredSensoryFocus,
        environment,
        priorObservations,
      } = req.body;

      const input: InvestigationGenerationInput = {
        sequenceNumber: Number(sequenceNumber) || 1,
        intention: intention || 'notice',
        durationMinutes: (Number(durationMinutes) as 10 | 20 | 30) || 10,
        preferredSensoryFocus,
        environment,
        priorObservations,
      };

      const result = await aiService.generateInvestigation(input);
      res.json(result);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'aiStatus' in err) {
        const aiError = err as AIStructuredError;
        res.status(503).json(aiError);
        return;
      }
      next(err);
    }
  });

  // Generate Reflection endpoint
  app.post('/api/reflections/generate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        investigation,
        observationText = '',
        visualNote,
        tactileNote,
        optionalPhotoMetadata,
        optionalAudioMetadata,
      } = req.body;

      if (!investigation) {
        res.status(400).json({
          error: 'Missing investigation context',
          aiStatus: 'MALFORMED_AI_RESPONSE',
          message: 'An investigation is required to generate a reflection.',
          retryable: false,
        });
        return;
      }

      const input: ReflectionGenerationInput = {
        investigation,
        observationText: String(observationText || ''),
        visualNote: visualNote ? String(visualNote) : undefined,
        tactileNote: tactileNote ? String(tactileNote) : undefined,
        optionalPhotoMetadata,
        optionalAudioMetadata,
      };

      const result = await aiService.generateReflection(input);
      res.json(result);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'aiStatus' in err) {
        const aiError = err as AIStructuredError;
        res.status(503).json(aiError);
        return;
      }
      next(err);
    }
  });

  // Journal Persistence: GET all entries
  app.get('/api/journal', (_req: Request, res: Response) => {
    try {
      const stmt = db.prepare(`
        SELECT 
          i.id as inv_id, i.sequence_number, i.title as inv_title, i.prompt, i.grounding_constraint,
          i.inquiry_question, i.sensory_focus, i.target_duration_seconds, i.created_at as inv_created_at,
          o.id as obs_id, o.raw_notes, o.sensory_details, o.photo_uri, o.audio_uri, o.actual_duration_seconds, o.recorded_at,
          r.id as ref_id, r.synthetic_insight, r.deepening_question, r.curiosity_tags, r.next_investigation_seed, r.model_name, r.provider, r.inference_duration_ms,
          d.id as disc_id, d.title as disc_title, d.field_category
        FROM investigations i
        LEFT JOIN observations o ON o.investigation_id = i.id
        LEFT JOIN reflections r ON r.investigation_id = i.id
        LEFT JOIN discoveries d ON d.investigation_id = i.id
        WHERE i.status = 'completed'
        ORDER BY i.sequence_number DESC
      `);

      const rows = stmt.all() as any[];
      const entries = rows.map((row) => ({
        id: `entry_${row.inv_id}`,
        createdAt: row.recorded_at || row.inv_created_at,
        investigation: {
          id: row.inv_id,
          sequenceNumber: row.sequence_number,
          title: row.inv_title,
          prompt: row.prompt,
          groundingConstraint: row.grounding_constraint,
          inquiryQuestion: row.inquiry_question,
          sensoryFocus: JSON.parse(row.sensory_focus || '[]'),
          targetDurationSeconds: row.target_duration_seconds,
          fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
          status: 'completed',
          createdAt: row.inv_created_at,
        },
        observation: {
          id: row.obs_id,
          investigationId: row.inv_id,
          recordedAt: row.recorded_at,
          actualDurationSeconds: row.actual_duration_seconds,
          rawNotes: row.raw_notes,
          sensoryDetails: row.sensory_details ? JSON.parse(row.sensory_details) : undefined,
          photoUri: row.photo_uri || undefined,
          audioUri: row.audio_uri || undefined,
          putAwayComplied: true,
        },
        reflection: {
          id: row.ref_id,
          observationId: row.obs_id,
          investigationId: row.inv_id,
          syntheticInsight: row.synthetic_insight,
          deepeningQuestion: row.deepening_question,
          curiosityTags: JSON.parse(row.curiosity_tags || '[]'),
          nextInvestigationSeed: row.next_investigation_seed || undefined,
          modelMetadata: {
            modelName: row.model_name || 'llama3.2:3b',
            inferenceDurationMs: row.inference_duration_ms || 0,
            provider: row.provider || 'ollama',
          },
          createdAt: row.recorded_at,
        },
        discovery: {
          id: row.disc_id,
          investigationId: row.inv_id,
          reflectionId: row.ref_id,
          title: row.disc_title,
          fieldCategory: row.field_category,
          significanceScore: 4,
          unlockedAt: row.recorded_at,
        },
      }));

      res.json(entries);
    } catch (err: unknown) {
      console.error('[Journal GET Error]', err);
      res.status(500).json({ error: 'Failed to retrieve journal entries' });
    }
  });

  // Journal Persistence: POST new entry
  app.post('/api/journal', (req: Request, res: Response) => {
    try {
      const { investigation, observation, reflection, discovery } = req.body;
      if (!investigation || !observation || !reflection) {
        res.status(400).json({ error: 'Incomplete journal entry' });
        return;
      }

      // Insert investigation
      const insertInv = db.prepare(`
        INSERT OR REPLACE INTO investigations (
          id, sequence_number, title, prompt, grounding_constraint, inquiry_question,
          sensory_focus, target_duration_seconds, field_mode_notice, status, created_at, completed_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'completed', datetime('now'), datetime('now'))
      `);
      insertInv.run(
        investigation.id,
        investigation.sequenceNumber,
        investigation.title,
        investigation.prompt || investigation.directive,
        investigation.groundingConstraint || investigation.groundingRule,
        investigation.inquiryQuestion,
        JSON.stringify(investigation.sensoryFocus || investigation.sensoryTags || []),
        investigation.targetDurationSeconds || 30,
        'LOOK. NOTICE. REMEMBER.'
      );

      // Insert observation
      const insertObs = db.prepare(`
        INSERT OR REPLACE INTO observations (
          id, investigation_id, recorded_at, actual_duration_seconds, raw_notes,
          sensory_details, photo_uri, audio_uri, put_away_complied
        ) VALUES (?, ?, datetime('now'), ?, ?, ?, ?, ?, ?)
      `);
      insertObs.run(
        observation.id,
        investigation.id,
        observation.actualDurationSeconds || 30,
        observation.rawNotes,
        observation.sensoryDetails ? JSON.stringify(observation.sensoryDetails) : null,
        observation.photoUri || null,
        observation.audioUri || null,
        observation.putAwayComplied ? 1 : 0
      );

      // Insert reflection
      const insertRef = db.prepare(`
        INSERT OR REPLACE INTO reflections (
          id, observation_id, investigation_id, synthetic_insight, deepening_question,
          curiosity_tags, next_investigation_seed, model_name, inference_duration_ms, provider, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
      `);
      insertRef.run(
        reflection.id,
        observation.id,
        investigation.id,
        reflection.syntheticInsight || reflection.whatItMightMean,
        reflection.deepeningQuestion || reflection.questionToCarry,
        JSON.stringify(reflection.curiosityTags || []),
        reflection.nextInvestigationSeed || null,
        reflection.modelMetadata?.modelName || 'llama3.2:3b',
        reflection.modelMetadata?.inferenceDurationMs || 0,
        reflection.modelMetadata?.provider || 'ollama'
      );

      // Insert discovery
      if (discovery) {
        const insertDisc = db.prepare(`
          INSERT OR REPLACE INTO discoveries (
            id, investigation_id, reflection_id, title, field_category, significance_score, unlocked_at
          ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        insertDisc.run(
          discovery.id,
          investigation.id,
          reflection.id,
          discovery.title || discovery.fieldCategory,
          discovery.fieldCategory,
          discovery.significanceScore || 4
        );
      }

      res.status(201).json({ status: 'saved', id: investigation.id });
    } catch (err: unknown) {
      console.error('[Journal Save Error]', err);
      res.status(500).json({ error: 'Failed to persist journal entry' });
    }
  });

  // Serve static client production build if present (Unified Render/production deployment)
  const clientDist = path.resolve(__dirname, '../../client/dist');
  if (fs.existsSync(clientDist)) {
    app.use(express.static(clientDist));
    app.get('*', (req: Request, res: Response, next: NextFunction) => {
      if (req.path.startsWith('/api') || req.path === '/healthz') {
        return next();
      }
      res.sendFile(path.join(clientDist, 'index.html'));
    });
  }

  // Global Error Handler - Never crash the server
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[FIELDNOTE Unhandled Error]', err);
    res.status(500).json({
      error: 'Internal Field Server Error',
      message: err.message || 'Unknown server error',
    });
  });

  return app;
}
