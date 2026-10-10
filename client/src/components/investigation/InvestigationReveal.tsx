import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import {
  Eye,
  ArrowLeft,
  Clock,
  EyeOff,
  HelpCircle,
  Pocket,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const InvestigationReveal: React.FC = () => {
  const { state, enterField, navigate } = useFieldSession();
  const investigation = state.activeInvestigation;

  if (!investigation) {
    return (
      <div className="journal-page p-8 sm:p-12 text-center space-y-4 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal">
        <p className="font-serif text-lg text-ink-muted">No active field directive found in the logbook.</p>
        <TactileButton onClick={() => navigate('setup')} variant="primary">
          Configure Field Directive
        </TactileButton>
      </div>
    );
  }

  const formattedSeq = String(investigation.sequenceNumber).padStart(3, '0');

  return (
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/50 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-8">
      {/* 1. EDITORIAL FIELD NOTE MASTHEAD */}
      <div className="border-b border-stone/80 pb-4 sm:pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <BotanicalLeafSprig className="w-5 h-5 text-forest" />
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-ink-faint uppercase block">
              Botanical Field Directive
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-terracotta font-bold uppercase block">
              FOLIO NO. {formattedSeq}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <span className="text-forest uppercase font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-forest" />
            Naturalist AI Engine
          </span>
          <span className="text-stone-deep">•</span>
          <div className="flex items-center space-x-1.5 text-moss">
            <Clock className="w-3.5 h-3.5" />
            <span>{investigation.targetDurationSeconds}s silent notice</span>
          </div>
        </div>
      </div>

      {/* 2. PROMINENT INVESTIGATION TITLE */}
      <div className="space-y-3">
        <span className="font-mono text-[11px] tracking-widest uppercase text-terracotta font-semibold">
          Observation Study
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-ink leading-tight">
          {investigation.title}
        </h1>
        <div className="flex flex-wrap gap-2 pt-1">
          {investigation.sensoryFocus.map((focus) => (
            <EditorialBadge key={focus} label={focus} variant="moss" />
          ))}
          <span className="inline-flex items-center text-xs font-mono text-ink-muted bg-stone-light/60 px-2 py-0.5 rounded-[2px] border border-stone-deep/30">
            Physical Specimen
          </span>
        </div>
      </div>

      {/* 3. FIELD-JOURNAL INSTRUCTION CARD (Visual hierarchy without chat bubbles) */}
      <div className="p-6 sm:p-8 rounded-sm bg-paper-deep/30 border border-stone-deep/50 space-y-6">
        {/* Core Directive */}
        <div className="space-y-2 border-l-2 border-forest pl-4 sm:pl-6 py-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-forest font-semibold block">
            The Directive
          </span>
          <p className="font-serif text-xl sm:text-2xl text-ink leading-relaxed italic">
            “{investigation.prompt}”
          </p>
        </div>

        {/* Grounding Constraint */}
        <div className="border-t border-stone-deep/30 pt-4 space-y-1.5 pl-4 sm:pl-6 border-l-2 border-moss">
          <div className="flex items-center space-x-2">
            <EyeOff className="w-4 h-4 text-terracotta" />
            <span className="font-mono text-xs uppercase tracking-wider text-moss font-semibold">
              Grounding Constraint
            </span>
          </div>
          <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
            {investigation.groundingConstraint}
          </p>
        </div>

        {/* Inquiry Question */}
        <div className="border-t border-stone-deep/30 pt-4 space-y-1.5 pl-4 sm:pl-6 border-l-2 border-terracotta bg-terracotta/5 p-4 rounded-r-sm">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-terracotta" />
            <span className="font-mono text-xs uppercase tracking-wider text-terracotta font-semibold">
              Inquiry Question to Carry
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg text-ink font-medium leading-relaxed italic">
            {investigation.inquiryQuestion}
          </p>
        </div>
      </div>

      {/* 4. THE PHONE-AWAY MANDATE CALLOUT */}
      <div className="p-4 sm:p-5 rounded-sm bg-stone-light/70 border border-stone-deep/40 text-xs sm:text-sm text-ink-muted font-sans flex items-start space-x-3.5">
        <div className="w-7 h-7 rounded-full bg-forest text-paper flex items-center justify-center shrink-0 mt-0.5">
          <Pocket className="w-4 h-4" />
        </div>
        <div className="space-y-1 leading-relaxed">
          <strong className="text-forest font-semibold block">Field Observation Protocol:</strong>
          <p>
            When you tap <strong>Begin Observation</strong>, the screen will dim and gracefully fade to black. Place the device in your pocket. Touch bark, observe shadow lines, and breathe the air. Tap the screen when ready to return.
          </p>
        </div>
      </div>

      {/* 5. ACTION FOOTER */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <button
          onClick={() => navigate('setup')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Adjust Window or Intention
        </button>

        <TactileButton
          onClick={enterField}
          variant="primary"
          className="w-full sm:w-auto px-10 py-4 text-base tracking-wider uppercase font-semibold shadow-journal min-h-[52px]"
        >
          <Eye className="w-4 h-4 mr-2" />
          Begin Observation
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </div>
    </article>
  );
};
