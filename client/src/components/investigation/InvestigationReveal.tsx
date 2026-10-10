import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import {
  BotanicalLeafSprig,
  BotanicalRevealBorder,
} from '../common/BotanicalIllustrations.js';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  HelpCircle,
} from 'lucide-react';

export const InvestigationReveal: React.FC = () => {
  const { state, enterField, navigate } = useFieldSession();
  const investigation = state.activeInvestigation;

  if (!investigation) {
    return (
      <div className="p-8 sm:p-12 text-center space-y-4 border border-stone rounded-3xl bg-paper-bright shadow-sm max-w-xl mx-auto">
        <p className="font-serif text-lg text-ink-muted">No active field directive found in the logbook.</p>
        <button
          onClick={() => navigate('setup')}
          className="px-6 py-3.5 rounded-xl bg-forest text-paper font-semibold text-sm"
        >
          Configure Field Directive
        </button>
      </div>
    );
  }

  const formattedSeq = String(investigation.sequenceNumber || 1).padStart(2, '0');

  return (
    <div className="max-w-xl mx-auto space-y-6 sm:space-y-8 animate-investigation-unfold pb-16 relative">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('setup')}
          className="inline-flex items-center text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Setup
        </button>
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-4 h-4 text-forest" />
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
            {formattedSeq} · Field Directive
          </span>
        </div>
      </div>

      {/* Lush Foliage Garland Framing: Top */}
      <div className="-mb-3">
        <BotanicalRevealBorder position="top" className="w-full h-12 text-forest" />
      </div>

      {/* Screen Headline */}
      <div className="text-center space-y-1.5 px-4">
        <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-forest font-semibold block">
          01 · Field Directive
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight leading-tight">
          {investigation.title || 'Notice the Micro-World Around You'}
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-muted">
          Small details often tell the biggest stories.
        </p>
      </div>

      {/* Notebook-Style Mission Card with Left Stitched Spine */}
      <div className="relative rounded-3xl border border-stone bg-paper-bright shadow-journal overflow-hidden">
        {/* Left red stitched margin line */}
        <div className="absolute left-6 top-0 bottom-0 w-[1.5px] bg-[#E59882] opacity-60 hidden sm:block pointer-events-none" />

        <div className="p-6 sm:p-8 sm:pl-12 space-y-6">
          {/* YOUR MISSION */}
          <div className="space-y-2">
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-terracotta flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-terracotta" />
              <span>YOUR MISSION</span>
            </div>
            <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed font-normal">
              {investigation.prompt}
            </p>
          </div>

          {/* Grounding Rule Section */}
          <div className="pt-4 border-t border-stone-light/60 space-y-1.5">
            <div className="flex items-center space-x-2 text-forest">
              <Eye className="w-4 h-4 text-forest shrink-0" />
              <span className="font-sans text-xs font-semibold tracking-wide uppercase">
                Grounding Rule
              </span>
            </div>
            <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed pl-6">
              {investigation.groundingConstraint || 'Observe only what you can actually see. No guessing.'}
            </p>
          </div>

          {/* Inquiry Question Section */}
          <div className="pt-4 border-t border-stone-light/60 space-y-1.5">
            <div className="flex items-center space-x-2 text-terracotta">
              <HelpCircle className="w-4 h-4 text-terracotta shrink-0" />
              <span className="font-sans text-xs font-semibold tracking-wide uppercase">
                Inquiry Question
              </span>
            </div>
            <p className="font-serif italic text-sm sm:text-base text-ink leading-relaxed pl-6">
              “{investigation.inquiryQuestion || 'How does this organism adapt to its surface and surrounding conditions?'}”
            </p>
          </div>
        </div>
      </div>

      {/* Lush Foliage Garland Framing: Bottom */}
      <div className="-mt-3">
        <BotanicalRevealBorder position="bottom" className="w-full h-12 text-forest" />
      </div>

      {/* Primary Action: Start Field Mode */}
      <div className="pt-1">
        <button
          type="button"
          onClick={enterField}
          className="w-full py-4 px-6 rounded-2xl bg-forest hover:bg-forest-deep text-paper font-sans font-semibold text-base flex items-center justify-center space-x-2 shadow-journal transition-all hover:scale-[1.01] active:scale-[0.99]"
        >
          <span>I'm Ready. Start Field Mode</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
