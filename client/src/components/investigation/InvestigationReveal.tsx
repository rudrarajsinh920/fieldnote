import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { Eye, ArrowLeft, Clock, EyeOff } from 'lucide-react';

export const InvestigationReveal: React.FC = () => {
  const { state, enterField, navigate } = useFieldSession();
  const investigation = state.activeInvestigation;

  if (!investigation) {
    return (
      <div className="journal-page p-8 text-center space-y-4">
        <p className="font-serif text-lg text-ink-muted">No active investigation loaded.</p>
        <TactileButton onClick={() => navigate('setup')} variant="primary">
          Configure Investigation
        </TactileButton>
      </div>
    );
  }

  const formattedSeq = String(investigation.sequenceNumber).padStart(3, '0');

  return (
    <article className="journal-page p-6 sm:p-12 border border-stone-deep/50 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-7 sm:space-y-8">
      {/* Editorial Field Note Header */}
      <div className="border-b border-stone/80 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-0.5">
          <span className="font-mono text-xs tracking-[0.25em] text-ink-faint uppercase block">
            Field Investigation
          </span>
          <span className="font-mono text-sm tracking-widest text-terracotta font-semibold uppercase block">
            NO. {formattedSeq}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          {investigation.id.includes('gemini') ? (
            <span className="text-moss uppercase font-semibold">
              ✦ Google Gemini AI
            </span>
          ) : (
            <span className="text-moss uppercase font-semibold">
              ✦ Naturalist AI Engine
            </span>
          )}
          <span className="text-stone-deep">•</span>
          <div className="flex items-center space-x-1.5 text-moss">
            <Clock className="w-3.5 h-3.5" />
            <span>{investigation.targetDurationSeconds}s silent notice</span>
          </div>
        </div>
      </div>

      {/* Investigation Title */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-ink uppercase leading-tight">
          {investigation.title}
        </h1>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {investigation.sensoryFocus.map((focus) => (
            <EditorialBadge key={focus} label={focus} variant="moss" />
          ))}
        </div>
      </div>

      {/* Primary Directive Quote */}
      <div className="py-4 my-1 border-l-2 border-forest pl-5 sm:pl-7 space-y-4 bg-paper-deep/20 rounded-r-sm">
        <p className="font-serif text-xl sm:text-2xl text-ink leading-relaxed italic">
          “{investigation.prompt}”
        </p>

        {/* Grounding Directive */}
        <div className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed space-y-1">
          <p className="font-medium text-forest flex items-center">
            <EyeOff className="w-4 h-4 mr-2 text-terracotta inline flex-shrink-0" />
            <span>{investigation.groundingConstraint}</span>
          </p>
        </div>

        {/* Inquiry Question */}
        <p className="font-serif text-base sm:text-lg text-ink font-medium pt-2 border-t border-stone-deep/30">
          {investigation.inquiryQuestion}
        </p>
      </div>

      {/* The Phone-Away Mandate */}
      <div className="p-4 rounded-[2px] bg-stone-light/70 border border-stone-deep/40 text-xs sm:text-sm text-ink-muted font-sans flex items-start space-x-3">
        <span className="text-terracotta font-mono font-bold text-base leading-none select-none">!</span>
        <p className="leading-relaxed">
          <strong className="text-forest">Field Protocol:</strong> Upon pressing Begin, the interface will minimize and fade to black. Place your phone in your pocket. Observe silently with your senses before touching the screen again.
        </p>
      </div>

      {/* Action Footer */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate('setup')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Adjust Window
        </button>

        <TactileButton
          onClick={enterField}
          variant="primary"
          className="w-full sm:w-auto px-10 py-4 text-base tracking-wider uppercase font-semibold"
        >
          <Eye className="w-4 h-4 mr-2 text-paper-deep" />
          Begin
        </TactileButton>
      </div>
    </article>
  );
};
