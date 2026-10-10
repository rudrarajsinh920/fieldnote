import {
  AIProviderConfig,
  AIStructuredError,
  IAIModelService,
  InvestigationAISchema,
  InvestigationGenerationInput,
  InvestigationGenerationResult,
  ModelHealthStatus,
  ReflectionAISchema,
  ReflectionGenerationInput,
  ReflectionGenerationResult,
  SensoryFocus,
} from '@fieldnote/shared';
import {
  FIELDNOTE_NATURALIST_SYSTEM_PROMPT,
  buildInvestigationPrompt,
  buildReflectionPrompt,
} from './prompts.js';

export class OllamaModelProvider implements IAIModelService {
  private config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  public updateConfig(newConfig: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public async checkHealth(): Promise<ModelHealthStatus> {
    const startTime = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const response = await fetch(`${this.config.baseUrl}/api/tags`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          available: false,
          model: this.config.modelName,
          provider: 'ollama',
          latencyMs: Date.now() - startTime,
          aiStatus: 'LOCAL_MODEL_UNAVAILABLE',
          error: `Ollama returned HTTP status ${response.status}`,
        };
      }

      const data = (await response.json()) as { models?: Array<{ name: string }> };
      const modelList = data.models?.map((m) => m.name) || [];
      const modelExists = modelList.some(
        (name) => name === this.config.modelName || name.startsWith(this.config.modelName.split(':')[0])
      );

      if (!modelExists) {
        return {
          available: false,
          model: this.config.modelName,
          provider: 'ollama',
          latencyMs: Date.now() - startTime,
          aiStatus: 'MODEL_NOT_FOUND',
          error: `Model '${this.config.modelName}' is not installed in local Ollama library.`,
          availableModels: modelList,
        };
      }

      return {
        available: true,
        model: this.config.modelName,
        provider: 'ollama',
        latencyMs: Date.now() - startTime,
        aiStatus: 'READY',
        availableModels: modelList,
      };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return {
        available: false,
        model: this.config.modelName,
        provider: 'ollama',
        latencyMs: Date.now() - startTime,
        aiStatus: 'LOCAL_MODEL_UNAVAILABLE',
        error: `Could not connect to Ollama at ${this.config.baseUrl}: ${errorMessage}`,
      };
    }
  }

  public async generateInvestigation(
    input: InvestigationGenerationInput
  ): Promise<InvestigationGenerationResult> {
    const health = await this.checkHealth();
    if (!health.available) {
      throw this.buildModelUnavailableError(health);
    }

    const prompt = buildInvestigationPrompt(input);
    const rawResponse = await this.callOllamaApi(prompt, this.config.maxInvestigationTokens);
    const parsed = this.parseAndValidateInvestigationJson(rawResponse, input);

    return {
      title: parsed.title,
      directive: parsed.directive,
      prompt: parsed.directive,
      groundingRule: parsed.groundingRule,
      groundingConstraint: parsed.groundingRule,
      inquiryQuestion: parsed.inquiryQuestion,
      sensoryTags: parsed.sensoryTags,
      sensoryFocus: (parsed.sensoryTags as SensoryFocus[]) || ['visual', 'tactile'],
      estimatedMinutes: parsed.estimatedMinutes || input.durationMinutes,
      targetDurationSeconds: 30,
      intention: parsed.intention || input.intention,
      fieldModeNotice: 'LOOK. NOTICE. REMEMBER.',
    };
  }

  public async generateReflection(
    input: ReflectionGenerationInput
  ): Promise<ReflectionGenerationResult> {
    // Anti-hallucination pre-check: verify observation has sufficient evidence
    const observationText = input.observationText?.trim() || '';
    const wordCount = observationText.split(/\s+/).filter(Boolean).length;

    if (wordCount < 4 || observationText.length < 12) {
      // Insufficient evidence observed
      return {
        whatUserNoticed: observationText || 'Brief or sparse note recorded.',
        whatItMightMean: "Your observation isn't enough to support a confident interpretation yet.",
        syntheticInsight: "Your observation isn't enough to support a confident interpretation yet.",
        questionToCarry: 'What subtle shifts in texture, temperature, or moisture might reveal more if observed for a full minute?',
        deepeningQuestion: 'What subtle shifts in texture, temperature, or moisture might reveal more if observed for a full minute?',
        fieldDiscovery: 'Preliminary Observation',
        discoveryCategory: 'Preliminary Notice',
        fieldCategory: 'Preliminary Notice',
        curiosityTags: ['preliminary', 'perceptual-focus'],
        nextInvestigationSeed: 'Return to this exact location and observe silently for 60 seconds without moving.',
        modelMetadata: {
          modelName: this.config.modelName,
          inferenceDurationMs: 15,
          provider: 'ollama/anti-hallucination',
        },
      };
    }

    const health = await this.checkHealth();
    if (!health.available) {
      throw this.buildModelUnavailableError(health);
    }

    const prompt = buildReflectionPrompt(input);
    const rawResponse = await this.callOllamaApi(prompt, this.config.maxReflectionTokens);
    const parsed = this.parseAndValidateReflectionJson(rawResponse, observationText);

    return {
      whatUserNoticed: parsed.whatUserNoticed,
      whatItMightMean: parsed.whatItMightMean,
      syntheticInsight: parsed.whatItMightMean,
      questionToCarry: parsed.questionToCarry,
      deepeningQuestion: parsed.questionToCarry,
      fieldDiscovery: parsed.fieldDiscovery,
      discoveryCategory: parsed.discoveryCategory,
      fieldCategory: parsed.discoveryCategory,
      curiosityTags: [parsed.discoveryCategory.toLowerCase().replace(/\s+/g, '-'), 'field-observation', 'micro-climate'],
      nextInvestigationSeed: parsed.nextInvestigationSeed,
      modelMetadata: {
        modelName: this.config.modelName,
        inferenceDurationMs: 250,
        provider: 'ollama',
      },
    };
  }

  private async callOllamaApi(prompt: string, maxTokens: number): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(`${this.config.baseUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: this.config.modelName,
          prompt,
          system: FIELDNOTE_NATURALIST_SYSTEM_PROMPT,
          format: 'json',
          stream: false,
          options: {
            temperature: this.config.temperature,
            num_predict: maxTokens,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama returned status ${response.status}: ${await response.text()}`);
      }

      const data = (await response.json()) as { response: string };
      return data.response;
    } catch (err: unknown) {
      const isAbort =
        (err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError' || err.message?.toLowerCase().includes('abort'))) ||
        (typeof err === 'object' && err !== null && 'name' in err && (err as any).name === 'AbortError');

      if (isAbort) {
        const timeoutError: AIStructuredError = {
          error: 'Local AI generation timed out',
          aiStatus: 'AI_TIMEOUT',
          message: 'The local model took too long to respond. Your field notes are safe.',
          retryable: true,
        };
        throw timeoutError;
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private parseAndValidateInvestigationJson(
    rawText: string,
    input: InvestigationGenerationInput
  ): InvestigationAISchema {
    try {
      const cleaned = this.extractJson(rawText);
      const parsed = JSON.parse(cleaned);

      if (!parsed.directive && !parsed.prompt) {
        throw new Error('Missing directive in AI JSON');
      }

      return {
        title: (parsed.title || 'FIELD PHENOMENON').toUpperCase(),
        directive: parsed.directive || parsed.prompt || 'Observe something altered by current outdoor conditions.',
        groundingRule: parsed.groundingRule || parsed.groundingConstraint || "Don't photograph it yet. Observe silently for 30 seconds.",
        inquiryQuestion: parsed.inquiryQuestion || 'What physical evidence reveals the ongoing process?',
        sensoryTags: Array.isArray(parsed.sensoryTags) ? parsed.sensoryTags : ['visual', 'tactile'],
        estimatedMinutes: Number(parsed.estimatedMinutes) || input.durationMinutes,
        intention: parsed.intention || input.intention,
      };
    } catch (err) {
      const malformedError: AIStructuredError = {
        error: 'Malformed JSON from local AI',
        aiStatus: 'MALFORMED_AI_RESPONSE',
        message: 'The local model generated an unparseable response. Retrying with conservative heuristics.',
        retryable: true,
      };
      throw malformedError;
    }
  }

  private parseAndValidateReflectionJson(
    rawText: string,
    observationText: string
  ): ReflectionAISchema {
    try {
      const cleaned = this.extractJson(rawText);
      const parsed = JSON.parse(cleaned);

      return {
        whatUserNoticed: parsed.whatUserNoticed || observationText.slice(0, 120),
        whatItMightMean: parsed.whatItMightMean || 'Physical factors such as moisture and exposure may be altering this surface over time.',
        questionToCarry: parsed.questionToCarry || 'What changes when environmental conditions shift?',
        fieldDiscovery: parsed.fieldDiscovery || 'Weather Dynamics',
        discoveryCategory: parsed.discoveryCategory || 'Weather Artifacts',
        nextInvestigationSeed: parsed.nextInvestigationSeed || 'Follow the threshold where this phenomenon meets unaffected ground.',
      };
    } catch (err) {
      const malformedError: AIStructuredError = {
        error: 'Malformed reflection JSON from local AI',
        aiStatus: 'MALFORMED_AI_RESPONSE',
        message: 'The local model response was not valid JSON.',
        retryable: true,
      };
      throw malformedError;
    }
  }

  private extractJson(text: string): string {
    const trimmed = text.trim();
    // Remove markdown code fences if model enclosed them
    const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) {
      return fenceMatch[1].trim();
    }
    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      return trimmed.slice(firstBrace, lastBrace + 1);
    }
    return trimmed;
  }

  private buildModelUnavailableError(health: ModelHealthStatus): AIStructuredError {
    if (health.aiStatus === 'MODEL_NOT_FOUND') {
      return {
        error: 'Model not installed',
        aiStatus: 'MODEL_NOT_FOUND',
        message: `Model '${this.config.modelName}' is not installed in local Ollama library. Available models: ${health.availableModels?.join(', ') || 'none'}.`,
        retryable: false,
      };
    }

    return {
      error: 'Local AI currently unavailable',
      aiStatus: 'LOCAL_MODEL_UNAVAILABLE',
      message: 'Your field note is safe. Local AI is currently unavailable. You can continue recording your observation and reflect later.',
      retryable: true,
    };
  }
}
