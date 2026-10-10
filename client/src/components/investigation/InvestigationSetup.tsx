import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import {
  BotanicalLeafSprig,
  BotanicalCornerFoliage,
} from '../common/BotanicalIllustrations.js';
import { FieldCategory } from '../../types/index.js';
import {
  Clock,
  Eye,
  BarChart2,
  BookOpen,
  PenTool,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertCircle,
  RefreshCw,
  Check,
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

  const categoryMap: Record<FieldCategory, { title: string; subtitle: string }> = {
    science: {
      title: 'Botanical Science',
      subtitle: 'Plant anatomy, leaf venation, lichen symbiosis...',
    },
    community: {
      title: 'Community & Environment',
      subtitle: 'Trees, waterways, neighborhood ecosystems...',
    },
    everyday: {
      title: 'Everyday Discovery',
      subtitle: 'Micro-habitats, textures, patterns...',
    },
    edge: {
      title: 'Built vs. Wild',
      subtitle: 'Masonry borders, asphalt fissures, micro-climates...',
    },
  };

  const currentCat = categoryMap[preferences.category || 'science'];

  const durationOptions: Array<{
    value: InvestigationDurationMinutes;
    label: string;
    sublabel: string;
  }> = [
    { value: 10, label: '10 min', sublabel: 'Brief' },
    { value: 20, label: '20 min', sublabel: 'Recommended' },
    { value: 30, label: '30 min', sublabel: 'Extended' },
  ];

  const intentionOptions: Array<{
    value: InvestigationIntention;
    label: string;
    description: string;
    icon: React.ReactNode;
  }> = [
    {
      value: 'notice',
      label: 'Observe',
      description: 'Notice patterns',
      icon: <Eye className="w-5 h-5 text-forest" />,
    },
    {
      value: 'explore',
      label: 'Compare',
      description: 'Find differences',
      icon: <BarChart2 className="w-5 h-5 text-forest" />,
    },
    {
      value: 'understand',
      label: 'Understand',
      description: 'Learn mechanisms',
      icon: <BookOpen className="w-5 h-5 text-forest" />,
    },
    {
      value: 'create',
      label: 'Create',
      description: 'Sketch / map',
      icon: <PenTool className="w-5 h-5 text-forest" />,
    },
  ];

  const handleGenerate = async () => {
    try {
      await createInvestigation();
    } catch {
      // Handled via context
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-16 relative">
      {/* Corner Botanical Foliage */}
      <div className="absolute -bottom-8 -right-8 pointer-events-none z-10 hidden sm:block">
        <BotanicalCornerFoliage position="bottom-right" className="w-36 h-36 opacity-80" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('categories')}
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px]"
          aria-label="Back to categories"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Disciplines
        </button>
        <BotanicalLeafSprig className="w-5 h-5 text-forest opacity-80" />
      </div>

      {/* Title & Selected Category */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Set Your Investigation
        </h1>
        <div className="flex items-center space-x-2 pt-0.5">
          <span className="font-serif text-base text-forest font-medium">
            {currentCat.title}
          </span>
          <button
            onClick={() => navigate('categories')}
            className="text-[11px] font-mono uppercase text-ink-muted hover:text-forest underline"
          >
            (Change)
          </button>
        </div>
      </div>

      {/* Structured Error State Banner */}
      {state.aiError && (
        <div className="p-4 rounded-2xl border border-terracotta/40 bg-[#FBF4EE] space-y-2">
          <div className="flex items-center space-x-2 text-terracotta text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.aiError.message}</span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={handleGenerate}
              className="text-xs font-mono uppercase font-bold text-terracotta hover:underline flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry AI
            </button>
            <button
              onClick={dismissAiError}
              className="text-xs font-mono text-ink-muted hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* SECTION: OBSERVATION WINDOW */}
      <section className="space-y-3 relative z-10">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-forest" />
          <h2 className="font-sans text-xs tracking-wider uppercase text-ink font-semibold">
            Observation Window
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {durationOptions.map((opt) => {
            const isSelected = preferences.durationMinutes === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ durationMinutes: opt.value })}
                className={`py-3.5 px-3 rounded-2xl border text-center transition-all ${
                  isSelected
                    ? 'bg-forest text-paper border-forest shadow-sm'
                    : 'bg-paper-bright text-ink border-stone hover:border-forest/50'
                }`}
              >
                <div className={`font-sans font-bold text-base sm:text-lg ${isSelected ? 'text-paper' : 'text-ink'}`}>
                  {opt.label}
                </div>
                <div className={`text-[10px] font-mono tracking-wider mt-0.5 ${isSelected ? 'text-paper/85' : 'text-ink-muted'}`}>
                  {opt.sublabel}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION: YOUR INTENTION (2x2 Grid) */}
      <section className="space-y-3 relative z-10">
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-forest" />
          <h2 className="font-sans text-xs tracking-wider uppercase text-ink font-semibold">
            Your Intention
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {intentionOptions.map((opt) => {
            const isSelected = preferences.intention === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => updatePreferences({ intention: opt.value })}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between min-h-[96px] ${
                  isSelected
                    ? 'bg-paper-bright border-forest ring-2 ring-forest shadow-sm'
                    : 'bg-paper-bright border-stone hover:border-forest/50'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-8 h-8 rounded-xl bg-paper border border-stone/60 flex items-center justify-center">
                    {opt.icon}
                  </div>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-forest text-paper flex items-center justify-center">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <div className="font-serif text-base font-medium text-ink">
                    {opt.label}
                  </div>
                  <div className="font-sans text-xs text-ink-muted">
                    {opt.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* SECTION: OPTIONAL FOCUS */}
      <section className="space-y-2 relative z-10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-forest" />
          <label
            htmlFor="optionalFocus"
            className="font-sans text-xs tracking-wider uppercase text-ink font-semibold"
          >
            Optional Focus
          </label>
        </div>
        <input
          id="optionalFocus"
          type="text"
          value={preferences.optionalFocus || ''}
          onChange={(e) => updatePreferences({ optionalFocus: e.target.value })}
          placeholder="e.g. trees, rocks, water, insects..."
          className="w-full px-4 py-3.5 rounded-2xl border border-stone bg-paper-bright text-ink font-sans text-sm placeholder:text-ink-muted/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-all shadow-journal-subtle"
        />
      </section>

      {/* PRIMARY ACTION: GENERATE FIELD DIRECTIVE */}
      <div className="pt-2 relative z-10">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-deep disabled:bg-stone text-paper font-sans font-semibold text-base flex items-center justify-center space-x-2 shadow-journal transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span>Formulating Directive...</span>
            </>
          ) : (
            <>
              <span>Generate Field Directive</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
