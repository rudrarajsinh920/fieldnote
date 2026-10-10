import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import {
  ArrowLeft,
  Clock,
  EyeOff,
  HelpCircle,
  Pocket,
  ArrowRight,
  ShieldCheck,
  Compass,
} from 'lucide-react';

export const InvestigationReveal: React.FC = () => {
  const { state, enterField, navigate } = useFieldSession();
  const investigation = state.activeInvestigation;

  if (!investigation) {
    return (
      <div className="journal-page p-8 sm:p-12 text-center space-y-4 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal max-w-xl mx-auto">
        <p className="font-serif text-lg text-ink-muted">No active field directive found in the logbook.</p>
        <TactileButton onClick={() => navigate('setup')} variant="primary">
          Configure Field Directive
        </TactileButton>
      </div>
    );
  }

  const formattedSeq = String(investigation.sequenceNumber).padStart(3, '0');
  const durationMinutes = Math.round(investigation.targetDurationSeconds / 60) || 10;

  return (
    <article className="max-w-xl mx-auto space-y-6 sm:space-y-8 animate-investigation-unfold">
      {/* Top Back / Status Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('setup')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Adjust Setup
        </button>
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-4 h-4 text-forest" />
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
            Folio No. {formattedSeq}
          </span>
        </div>
      </div>

      {/* PAPER FIELD NOTEBOOK CARD (Spiral Top Perforations Treatment) */}
      <div className="relative rounded-sm border border-stone-deep/70 bg-paper-bright shadow-journal overflow-hidden">
        {/* Spiral Notebook Perforations Header */}
        <div className="bg-[#EFE9DC] border-b border-stone-deep/60 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="w-2.5 h-2.5 rounded-full bg-paper border border-stone-deep inline-block"
              />
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-widest uppercase text-ink-muted font-semibold">
            Field Directive Sheet
          </span>
          <div className="flex items-center space-x-1.5 text-xs font-mono text-moss">
            <Clock className="w-3.5 h-3.5" />
            <span>{durationMinutes} min</span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* YOUR MISSION BADGE */}
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center text-[11px] font-mono tracking-widest uppercase font-bold text-forest bg-forest/10 border border-forest/30 px-2.5 py-1 rounded-[2px]">
              <Compass className="w-3 h-3 mr-1.5" />
              Your Mission
            </span>
            <span className="font-mono text-[10px] text-ink-faint uppercase">
              Physical Earth
            </span>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-4xl font-medium tracking-tight text-ink leading-tight">
              {investigation.title}
            </h1>
            <div className="flex flex-wrap gap-1.5">
              {investigation.sensoryFocus.map((focus) => (
                <EditorialBadge key={focus} label={focus} variant="moss" />
              ))}
            </div>
          </div>

          {/* Primary Directive Quote */}
          <div className="p-4 sm:p-5 rounded-sm bg-paper-deep/30 border-l-3 border-forest space-y-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-forest font-bold block">
              Core Inquiry
            </span>
            <p className="font-serif italic text-lg sm:text-xl text-ink leading-relaxed">
              “{investigation.prompt}”
            </p>
          </div>

          {/* Grounding Rule Box */}
          <div className="p-4 rounded-sm border border-moss/40 bg-moss/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-moss">
              <EyeOff className="w-4 h-4 text-forest shrink-0" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold text-forest">
                Grounding Rule
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-ink leading-relaxed pl-6">
              {investigation.groundingConstraint}
            </p>
          </div>

          {/* Inquiry Question to Carry */}
          <div className="p-4 rounded-sm border border-terracotta/40 bg-terracotta/5 space-y-1.5">
            <div className="flex items-center space-x-2 text-terracotta">
              <HelpCircle className="w-4 h-4 shrink-0" />
              <span className="font-mono text-xs uppercase tracking-wider font-bold">
                Inquiry Question
              </span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-ink leading-relaxed pl-6">
              “{investigation.inquiryQuestion}”
            </p>
          </div>

          {/* Put Phone Away Protocol Callout */}
          <div className="p-3.5 rounded-[2px] bg-stone-light/50 border border-stone-deep/40 text-xs font-sans text-ink-muted flex items-start space-x-2.5">
            <Pocket className="w-4 h-4 text-forest shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              When you begin, your screen will dim and guide you into silent observation. Put your phone away and look closely at the earth.
            </p>
          </div>
        </div>

        {/* Card Footer / Primary Action */}
        <div className="p-5 sm:p-6 bg-paper border-t border-stone-deep/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-ink-muted flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-forest" />
            Zero-Distraction Protocol
          </span>

          <TactileButton
            onClick={enterField}
            variant="primary"
            className="w-full sm:w-auto px-8 py-4 text-sm sm:text-base font-semibold shadow-journal min-h-[50px]"
          >
            I'm Ready. Start Field Mode
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </div>
    </article>
  );
};
