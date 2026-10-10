import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { Clock, Compass, Sparkles, ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import { InvestigationDurationMinutes, InvestigationIntention } from '@fieldnote/shared';

export const InvestigationSetup: React.FC = () => {
  const {
    state,
    updatePreferences,
    createInvestigation,
    dismissAiError,
    navigate,
  } = useFieldSession();
  const { preferences, isGenerating } = state;

  const durationOptions: Array<{ value: InvestigationDurationMinutes; label: string; sub: string }> = [
    { value: 10, label: '10 MIN', sub: 'Brief perimeter walk' },
    { value: 20, label: '20 MIN', sub: 'Standard immersion' },
    { value: 30, label: '30 MIN', sub: 'Deep naturalist study' },
  ];

  const intentionOptions: Array<{
    value: InvestigationIntention;
    label: string;
    description: string;
  }> = [
    {
      value: 'notice',
      label: 'NOTICE',
      description: 'Micro-phenomena, textures, small organisms & quiet movements.',
    },
    {
      value: 'explore',
      label: 'EXPLORE',
      description: 'Shadow lines, drainage routes & edges between built and wild.',
    },
    {
      value: 'understand',
      label: 'UNDERSTAND',
      description: 'Atmospheric weathering, moisture dynamics & material tension.',
    },
    {
      value: 'create',
      label: 'CREATE',
      description: 'Sensory rubbings, mental cartography & tactile comparisons.',
    },
    {
      value: 'surprise',
      label: 'SURPRISE ME',
      description: 'Unpredictable field directive testing perceptual acuity.',
    },
  ];

  const handleGenerate = () => {
    if (isGenerating) return;
    createInvestigation();
  };

  return (
    <article className="journal-page p-6 sm:p-10 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-8">
      {/* Header */}
      <div className="border-b border-stone/80 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Journal
        </button>
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase">
            Setup • Inv No. {String(state.nextSequenceNumber).padStart(3, '0')}
          </span>
        </div>
      </div>

      <div className="space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Field Preparation
        </h1>
        <p className="font-sans text-sm text-ink-muted">
          Define your sensory window before stepping into the physical world.
        </p>
      </div>

      {/* AI Error State: Polished, Native Presentation */}
      {state.aiError && (
        <div className="p-4 sm:p-5 rounded-[2px] bg-paper-deep/60 border border-terracotta/40 space-y-3 animate-journal-entry">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terracotta flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline" />
              {state.aiError.aiStatus === 'LOCAL_MODEL_UNAVAILABLE'
                ? 'Local Model Offline'
                : state.aiError.aiStatus === 'MODEL_NOT_FOUND'
                ? 'Model Not Found in Ollama'
                : state.aiError.aiStatus === 'AI_TIMEOUT'
                ? 'Inference Window Elapsed'
                : `AI Status: ${state.aiError.aiStatus}`}
            </span>
            <button
              onClick={dismissAiError}
              className="text-xs font-mono text-ink-muted hover:text-ink px-2 py-1 min-h-[32px]"
            >
              ✕ Dismiss
            </button>
          </div>
          <p className="font-serif text-sm text-ink leading-relaxed">
            {state.aiError.message}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <TactileButton
              type="button"
              onClick={createInvestigation}
              variant="terracotta"
              className="text-xs py-2 px-4 min-h-[36px]"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Retry Generation
            </TactileButton>
          </div>
        </div>
      )}

      {/* Generating State: Native Calm Organic Pacing */}
      {isGenerating && (
        <div className="p-6 rounded-[2px] bg-paper-deep/40 border border-moss/30 text-center space-y-3 animate-journal-entry">
          <div className="w-10 h-10 mx-auto rounded-full border border-forest/30 flex items-center justify-center animate-observation-breath">
            <span className="w-2 h-2 rounded-full bg-forest" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs tracking-widest uppercase text-forest font-semibold">
              Consulting Local Naturalist Engine...
            </p>
            <p className="font-serif italic text-xs text-ink-muted">
              Formulating an observation directive for physical reality.
            </p>
          </div>
        </div>
      )}

      {/* Time Selection */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-moss" />
          <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-medium">
            Observation Window (Time)
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
          {durationOptions.map((opt) => {
            const isSelected = preferences.durationMinutes === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ durationMinutes: opt.value })}
                className={`p-3 sm:p-4 text-center rounded-[2px] border transition-all duration-150 active:translate-y-px min-h-[60px] flex flex-col justify-center ${
                  isSelected
                    ? 'bg-forest text-paper border-forest-deep shadow-journal-subtle'
                    : 'bg-paper text-ink border-stone-deep/60 hover:bg-stone-light/60'
                }`}
              >
                <span className="block font-mono text-sm sm:text-base font-semibold tracking-wider">
                  {opt.label}
                </span>
                <span
                  className={`block text-[11px] font-sans mt-0.5 ${
                    isSelected ? 'text-paper-deep/80' : 'text-ink-muted'
                  }`}
                >
                  {opt.sub}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Intention Selection */}
      <section className="space-y-3">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-moss" />
          <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-medium">
            Perceptual Intention
          </h2>
        </div>

        <div className="space-y-2">
          {intentionOptions.map((opt) => {
            const isSelected = preferences.intention === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ intention: opt.value })}
                className={`w-full text-left p-3.5 sm:p-4 rounded-[2px] border transition-all duration-150 flex items-start justify-between min-h-[52px] active:translate-y-px ${
                  isSelected
                    ? 'bg-forest/5 border-forest text-ink shadow-journal-subtle'
                    : 'bg-paper/60 border-stone-deep/40 text-ink hover:bg-stone-light/40'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`font-mono text-xs tracking-widest font-semibold uppercase ${
                        isSelected ? 'text-forest' : 'text-ink'
                      }`}
                    >
                      {opt.label}
                    </span>
                    {isSelected && (
                      <span className="text-terracotta text-xs font-mono">✦ Selected</span>
                    )}
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Engine Status Bar */}
      <div className="pt-2 border-t border-stone-deep/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-mono text-moss">
          <span className="w-2 h-2 rounded-full bg-forest animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">
            Naturalist AI Engine
          </span>
        </div>
        <span className="font-mono text-[10px] text-ink-faint">
          Private • Grounded in Physical Reality
        </span>
      </div>

      {/* Generate Action */}
      <div className="pt-2 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-ink-muted font-sans text-center sm:text-left">
          AI will distill an observation directive grounded in physical sensory reality.
        </p>

        <TactileButton
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="primary"
          className="w-full sm:w-auto px-8 py-3.5 text-base min-w-[240px] font-semibold"
        >
          <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
          Generate Investigation
        </TactileButton>
      </div>
    </article>
  );
};
