import {
  IAIModelService,
  InvestigationGenerationInput,
  InvestigationGenerationResult,
  ModelHealthStatus,
  ReflectionGenerationInput,
  ReflectionGenerationResult,
} from '@fieldnote/shared';
import { config } from '../../config/index.js';
import { OllamaModelProvider } from './ollama-provider.js';

export class AIService implements IAIModelService {
  private activeProvider: IAIModelService;

  constructor() {
    this.activeProvider = new OllamaModelProvider(config.ollama);
  }

  public setProvider(provider: IAIModelService): void {
    this.activeProvider = provider;
  }

  public getProvider(): IAIModelService {
    return this.activeProvider;
  }

  public async checkHealth(): Promise<ModelHealthStatus> {
    return this.activeProvider.checkHealth();
  }

  public async generateInvestigation(
    input: InvestigationGenerationInput
  ): Promise<InvestigationGenerationResult> {
    return this.activeProvider.generateInvestigation(input);
  }

  public async generateReflection(
    input: ReflectionGenerationInput
  ): Promise<ReflectionGenerationResult> {
    return this.activeProvider.generateReflection(input);
  }
}

export const aiService = new AIService();
