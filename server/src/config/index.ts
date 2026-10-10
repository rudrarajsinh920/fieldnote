import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AIProviderConfig } from '@fieldnote/shared';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface AppConfig {
  port: number;
  host: string;
  dbPath: string;
  ollama: AIProviderConfig;
}

export const config: AppConfig = {
  port: parseInt(process.env.PORT || '4000', 10),
  host: process.env.HOST || '0.0.0.0',
  dbPath: process.env.DB_PATH || path.resolve(__dirname, '../../../fieldnote.sqlite'),
  ollama: {
    baseUrl: process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434',
    modelName: process.env.OLLAMA_MODEL || 'llama3.2:3b',
    temperature: parseFloat(process.env.OLLAMA_TEMPERATURE || '0.4'),
    timeoutMs: parseInt(process.env.OLLAMA_TIMEOUT_MS || '90000', 10),
    maxInvestigationTokens: parseInt(process.env.OLLAMA_MAX_INVESTIGATION_TOKENS || '256', 10),
    maxReflectionTokens: parseInt(process.env.OLLAMA_MAX_REFLECTION_TOKENS || '384', 10),
  },
};
