import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import { FieldCategory } from '../../types/index.js';
import {
  Clock,
  Compass,
  Sparkles,
  ArrowLeft,
  AlertCircle,
  RefreshCw,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
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

  const categoryMap: Record<FieldCategory, { title: string; discipline: string; desc: string }> = {
    science: {
      title: 'Botanical Science',
      discipline: 'PLANT BIOLOGY & VENATION',
      desc: 'Plant anatomy, leaf venation, lichen symbiosis, and micro-physics.',
    },
    community: {
      title: 'Community & Environment',
      discipline: 'URBAN CANOPY & CORRIDORS',
      desc: 'Neighborhood tree health, runoff channels, shade lines, and corridors.',
    },
    everyday: {
      title: 'Everyday Discovery',
      discipline: 'MICRO-HABITATS & TEXTURES',
      desc: 'Pavement seams, moss colonies, loose pebbles, and diurnal shifts.',
    },
    edge: {
      title: 'Built vs. Wild',
      discipline: 'URBAN EDGES & TENSION',
      desc: 'Masonry borders, asphalt fissures, moss colonization & micro-climates.',
    },
  };

  const currentCat = categoryMap[preferences.category || 'science'];

  const durationOptions: Array<{
    value: InvestigationDurationMinutes;
    label: string;
    badge: string;
  }> = [
    { value: 10, label: '10 MIN', badge: 'Perimeter' },
    { value: 20, label: '20 MIN', badge: 'Standard' },
    { value: 30, label: '30 MIN', badge: 'Deep study' },
  ];

  const intentionOptions: Array<{
    value: InvestigationIntention;
    label: string;
    subtitle: string;
    description: string;
  }> = [
    {
      value: 'notice',
      label: 'Observe',
      subtitle: 'Acuity & Organisms',
      description: 'Micro-phenomena, quiet textures, small organisms & subtle movement.',
    },
    {
      value: 'explore',
      label: 'Compare',
      subtitle: 'Boundaries & Edges',
      description: 'Compare light vs shade, wet vs dry, or masonry vs living soil.',
    },
    {
      value: 'understand',
      label: 'Understand',
      subtitle: 'Ecological Mechanics',
      description: 'Atmospheric weathering, decay, drainage paths & resilience.',
    },
    {
      value: 'create',
      label: 'Create',
      subtitle: 'Tactile Cartography',
      description: 'Mental maps, physical rubs, and creative sensory framing.',
    },
  ];

  const handleGenerate = () => {
    if (isGenerating) return;
    createInvestigation();
  };

  return (
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-8 max-w-2xl mx-auto">
      {/* 1. Header with back link and Folio Number */}
      <div className="border-b border-stone/80 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('categories')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Change Discipline
        </button>
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-4 h-4 text-forest" />
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-semibold">
            Setup • Folio No. {String(state.nextSequenceNumber).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* 2. Title & Selected Category Pill */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
            Set Your Investigation
          </h1>
          <button
            type="button"
            onClick={() => navigate('categories')}
            className="inline-flex items-center text-xs font-mono text-forest bg-forest/10 border border-forest/30 px-3 py-1 rounded-[2px] hover:bg-forest/20 transition-colors"
          >
            <Layers className="w-3 h-3 mr-1.5" />
            {currentCat.title}
            <span className="ml-1 text-[10px] text-ink-muted underline">Change</span>
          </button>
        </div>
        <p className="font-sans text-sm text-ink-muted leading-relaxed">
          Fine-tune your observation window, sensory intention, and optional focus before heading into the field.
        </p>
      </div>

      {/* AI Error State */}
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

      {/* Generating State */}
      {isGenerating && (
        <div className="p-7 rounded-[2px] bg-paper-deep/40 border border-botanical-teal/30 text-center space-y-3 animate-journal-entry">
          <div className="w-12 h-12 mx-auto rounded-full border border-forest/30 flex items-center justify-center animate-observation-breath">
            <span className="w-2.5 h-2.5 rounded-full bg-forest" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs tracking-widest uppercase text-forest font-semibold">
              Formulating Field Directive...
            </p>
            <p className="font-serif italic text-xs text-ink-muted">
              Synthesizing an observation prompt tailored to your parameters.
            </p>
          </div>
        </div>
      )}

      {/* 3. SECTION: OBSERVATION WINDOW (DURATION) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-moss" />
            <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-semibold">
              Observation Window
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-faint">Minutes</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map((opt) => {
            const isSelected = preferences.durationMinutes === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ durationMinutes: opt.value })}
                className={`p-3.5 sm:p-4 text-center rounded-sm border transition-all duration-150 min-h-[68px] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-forest text-paper border-forest shadow-journal'
                    : 'bg-paper-bright text-ink border-stone-deep/60 hover:bg-stone-light/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-[10px] tracking-wider uppercase opacity-75">
                    {opt.badge}
                  </span>
                  {isSelected && <span className="text-terracotta text-xs font-mono">✦</span>}
                </div>
                <span className="block font-mono text-base sm:text-lg font-bold tracking-wider">
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: INTENTION SELECTION (2x2 Grid) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-moss" />
            <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-semibold">
              Your Intention
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-faint">Perceptual Goal</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {intentionOptions.map((opt) => {
            const isSelected = preferences.intention === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ intention: opt.value })}
                className={`text-left p-4 rounded-sm border transition-all duration-150 flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'bg-forest/5 border-forest text-ink shadow-journal-subtle ring-1 ring-forest/30'
                    : 'bg-paper/70 border-stone-deep/50 text-ink hover:bg-paper-bright'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-serif text-base font-semibold text-ink">
                    {opt.label}
                  </span>
                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-forest text-paper flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="font-sans text-xs text-ink-muted leading-relaxed mt-1">
                  {opt.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. SECTION: OPTIONAL OBSERVATION FOCUS */}
      <section className="space-y-2">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <label
            htmlFor="optionalFocus"
            className="font-mono text-xs tracking-wider uppercase text-ink font-semibold"
          >
            Observation Focus (Optional)
          </label>
          <span className="font-mono text-[11px] text-ink-faint">Custom Anchor</span>
        </div>
        <input
          id="optionalFocus"
          type="text"
          value={preferences.optionalFocus || ''}
          onChange={(e) => updatePreferences({ optionalFocus: e.target.value })}
          placeholder="e.g. fallen leaves, moss on brick, shadow patterns, sidewalk cracks"
          className="w-full px-4 py-3 rounded-sm border border-stone-deep/70 bg-paper-bright text-ink font-serif text-sm focus:border-forest focus:outline-none min-h-[46px]"
        />
        <p className="font-serif italic text-xs text-ink-muted">
          Leave blank to let the Naturalist formulate an unconstrained directive.
        </p>
      </section>

      {/* Grounding Status Strip */}
      <div className="pt-2 border-t border-stone-deep/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ink-muted">
        <div className="flex items-center space-x-2 text-moss">
          <ShieldCheck className="w-3.5 h-3.5 text-forest" />
          <span className="font-semibold text-forest uppercase tracking-wider">
            Naturalist AI Active
          </span>
        </div>
        <span className="text-[11px] text-ink-faint">
          Private • Zero Hallucination Protocol
        </span>
      </div>

      {/* 6. PRIMARY ACTION */}
      <div className="pt-4 border-t border-stone/80">
        <TactileButton
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="primary"
          className="w-full py-4 text-base font-semibold shadow-journal min-h-[52px]"
        >
          <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
          Generate Field Directive
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </div>
    </article>
  );
};
