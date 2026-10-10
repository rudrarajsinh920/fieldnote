import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import {
  BotanicalCategoryIllustration,
  BotanicalLeafSprig,
} from '../common/BotanicalIllustrations.js';
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

  const categoryOptions: Array<{
    id: FieldCategory;
    title: string;
    discipline: string;
    desc: string;
  }> = [
    {
      id: 'science',
      title: 'School & Science',
      discipline: 'BOTANY & CELLULAR INQUIRY',
      desc: 'Plant anatomy, leaf venation, lichen symbiosis, and micro-physics.',
    },
    {
      id: 'community',
      title: 'Community & Environment',
      discipline: 'URBAN CANOPY & WATERSHEDS',
      desc: 'Neighborhood tree health, runoff channels, shade lines, and corridors.',
    },
    {
      id: 'everyday',
      title: 'Everyday Discovery',
      discipline: 'MICRO-HABITATS & TEXTURES',
      desc: 'Pavement seams, moss colonies, loose pebbles, and diurnal shifts.',
    },
  ];

  const durationOptions: Array<{
    value: InvestigationDurationMinutes;
    label: string;
    sub: string;
    badge: string;
  }> = [
    { value: 10, label: '10 MIN', sub: 'Perimeter notice', badge: 'Brief' },
    { value: 20, label: '20 MIN', sub: 'Standard immersion', badge: 'Recommended' },
    { value: 30, label: '30 MIN', sub: 'Deep naturalist study', badge: 'Extended' },
  ];

  const intentionOptions: Array<{
    value: InvestigationIntention;
    label: string;
    subtitle: string;
    description: string;
  }> = [
    {
      value: 'notice',
      label: 'NOTICE',
      subtitle: 'Acuity & Organisms',
      description: 'Micro-phenomena, quiet textures, small insects & subtle movement.',
    },
    {
      value: 'explore',
      label: 'EXPLORE',
      subtitle: 'Boundaries & Edges',
      description: 'Shadow lines, drainage routes & tension between built brick and wild soil.',
    },
    {
      value: 'understand',
      label: 'UNDERSTAND',
      subtitle: 'Ecological Mechanics',
      description: 'Atmospheric weathering, moisture dynamics, decay & material resilience.',
    },
    {
      value: 'create',
      label: 'CREATE',
      subtitle: 'Tactile Cartography',
      description: 'Sensory bark rubbings, mental maps & physical comparisons.',
    },
    {
      value: 'surprise',
      label: 'SURPRISE ME',
      subtitle: 'Spontaneous Curiosity',
      description: 'Unpredictable field directive testing peripheral perceptual acuity.',
    },
  ];

  const handleGenerate = () => {
    if (isGenerating) return;
    createInvestigation();
  };

  return (
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-9">
      {/* 1. Header with back link and Folio Number */}
      <div className="border-b border-stone/80 pb-4 flex items-center justify-between">
        <button
          onClick={() => navigate('home')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Back to Masthead
        </button>
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-4 h-4 text-forest" />
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-semibold">
            Preparation • Folio No. {String(state.nextSequenceNumber).padStart(3, '0')}
          </span>
        </div>
      </div>

      {/* 2. Title & Narrative */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium tracking-tight">
          Mission Setup
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-muted max-w-xl leading-relaxed">
          Select your discipline, sensory window, and perceptual intention before stepping out into the physical landscape.
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
              Formulating Botanical Directive...
            </p>
            <p className="font-serif italic text-xs text-ink-muted">
              Distilling an observation constraint grounded in physical nature.
            </p>
          </div>
        </div>
      )}

      {/* 3. SECTION: BOTANICAL CATEGORY SELECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <div className="flex items-center space-x-2">
            <span className="text-terracotta text-sm">✦</span>
            <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-semibold">
              1. Botanical Discipline
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-faint">Tactile Focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categoryOptions.map((cat) => {
            const isSelected = preferences.category === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => updatePreferences({ category: cat.id })}
                className={`text-left rounded-sm border transition-all duration-200 flex flex-col justify-between overflow-hidden bg-paper-bright min-h-[190px] active:translate-y-px ${
                  isSelected
                    ? 'border-forest ring-2 ring-forest/30 shadow-journal'
                    : 'border-stone-deep/50 hover:border-botanical-teal/60 opacity-85 hover:opacity-100'
                }`}
              >
                {/* Visual Header Artwork */}
                <div className="relative border-b border-stone-deep/30 bg-paper overflow-hidden">
                  <BotanicalCategoryIllustration category={cat.id} className="w-full h-24" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-forest text-paper p-1 rounded-full shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="font-mono text-[9px] uppercase tracking-wider text-terracotta font-semibold block">
                      {cat.discipline}
                    </span>
                    <h3 className="font-serif text-base font-medium text-ink leading-snug">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="font-sans text-[11px] text-ink-muted leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. SECTION: DURATION SELECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-moss" />
            <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-semibold">
              2. Observation Window (Time)
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-faint">Silent Immersion</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map((opt) => {
            const isSelected = preferences.durationMinutes === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ durationMinutes: opt.value })}
                className={`p-4 text-center rounded-sm border transition-all duration-150 active:translate-y-px min-h-[76px] flex flex-col justify-between ${
                  isSelected
                    ? 'bg-forest text-paper border-forest-deep shadow-journal'
                    : 'bg-paper-bright text-ink border-stone-deep/60 hover:bg-stone-light/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs tracking-wider uppercase opacity-75">
                    {opt.badge}
                  </span>
                  {isSelected && <span className="text-terracotta text-xs font-mono">✦</span>}
                </div>
                <div>
                  <span className="block font-mono text-base sm:text-lg font-bold tracking-wider">
                    {opt.label}
                  </span>
                  <span
                    className={`block text-[11px] font-sans mt-0.5 ${
                      isSelected ? 'text-paper-deep/80' : 'text-ink-muted'
                    }`}
                  >
                    {opt.sub}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. SECTION: INTENTION SELECTION */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
          <div className="flex items-center space-x-2">
            <Compass className="w-4 h-4 text-moss" />
            <h2 className="font-mono text-xs tracking-wider uppercase text-ink font-semibold">
              3. Perceptual Intention
            </h2>
          </div>
          <span className="font-mono text-[11px] text-ink-faint">Sensory Stance</span>
        </div>

        <div className="space-y-2.5">
          {intentionOptions.map((opt) => {
            const isSelected = preferences.intention === opt.value;

            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ intention: opt.value })}
                className={`w-full text-left p-4 rounded-sm border transition-all duration-150 flex items-start justify-between min-h-[60px] active:translate-y-px ${
                  isSelected
                    ? 'bg-forest/5 border-forest text-ink shadow-journal-subtle ring-1 ring-forest/20'
                    : 'bg-paper/70 border-stone-deep/50 text-ink hover:bg-paper-bright'
                }`}
              >
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center space-x-2.5">
                    <span
                      className={`font-mono text-xs tracking-widest font-semibold uppercase ${
                        isSelected ? 'text-forest' : 'text-ink'
                      }`}
                    >
                      {opt.label}
                    </span>
                    <span className="text-stone-deep">•</span>
                    <span className="font-mono text-[11px] text-ink-muted">
                      {opt.subtitle}
                    </span>
                    {isSelected && (
                      <span className="text-terracotta text-xs font-mono ml-auto">
                        ✦ Selected
                      </span>
                    )}
                  </div>
                  <p className="font-serif italic text-xs sm:text-sm text-ink-muted leading-relaxed pt-0.5">
                    {opt.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Grounding Engine Status Bar */}
      <div className="pt-2 border-t border-stone-deep/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono text-ink-muted">
        <div className="flex items-center space-x-2 text-moss">
          <ShieldCheck className="w-3.5 h-3.5 text-forest" />
          <span className="font-semibold text-forest uppercase tracking-wider">
            Naturalist AI Engine Active
          </span>
        </div>
        <span className="text-[11px] text-ink-faint">
          Private • Zero Hallucination Protocol
        </span>
      </div>

      {/* 6. PRIMARY ACTION FOOTER */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-ink-muted font-sans text-center sm:text-left max-w-sm leading-relaxed">
          Generates an observation directive tailored to your discipline and sensory stance.
        </p>

        <TactileButton
          onClick={handleGenerate}
          disabled={isGenerating}
          variant="primary"
          className="w-full sm:w-auto px-8 py-4 text-base min-w-[260px] font-semibold shadow-journal"
        >
          <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
          Generate Field Directive
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </div>
    </article>
  );
};
