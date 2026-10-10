import React from 'react';
import { Investigation } from '@fieldnote/shared';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { TactileButton } from '../common/TactileButton.js';
import { Eye, ArrowRight, Clock } from 'lucide-react';

interface InvestigationCardProps {
  investigation: Investigation;
  onBegin: () => void;
}

export const InvestigationCard: React.FC<InvestigationCardProps> = ({
  investigation,
  onBegin,
}) => {
  return (
    <article className="journal-page p-6 sm:p-10 border border-stone-deep/40 rounded-sm bg-paper-light shadow-journal animate-investigation-unfold">
      {/* Editorial Header */}
      <div className="flex items-center justify-between border-b border-stone/80 pb-4 mb-6">
        <div className="flex items-center space-x-2">
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase">
            Investigation {String(investigation.sequenceNumber).padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center space-x-1 text-ink-muted text-xs font-mono">
          <Clock className="w-3.5 h-3.5 inline text-moss mr-1" />
          <span>{investigation.targetDurationSeconds}s silent notice</span>
        </div>
      </div>

      {/* Title */}
      <h1 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight mb-4">
        {investigation.title}
      </h1>

      {/* Primary Directive */}
      <blockquote className="my-6 pl-4 border-l-2 border-forest text-lg sm:text-xl font-serif text-ink italic leading-relaxed bg-paper-deep/30 py-2 pr-3">
        “{investigation.prompt}”
      </blockquote>

      {/* Grounding Constraint (Phone-Away rule) */}
      <div className="my-6 p-4 rounded bg-stone-light/60 border border-stone-deep/40 text-sm text-ink-muted leading-relaxed">
        <strong className="text-forest block mb-1 font-medium font-sans">
          The Grounding Rule:
        </strong>
        {investigation.groundingConstraint}
      </div>

      {/* Inquiry Question */}
      <div className="mb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-ink-faint block mb-1">
          Inquiry Focus
        </span>
        <p className="font-serif text-base text-ink font-medium">
          {investigation.inquiryQuestion}
        </p>
      </div>

      {/* Sensory Focus Badges */}
      <div className="flex flex-wrap gap-2 mb-8">
        {investigation.sensoryFocus.map((focus) => (
          <EditorialBadge key={focus} label={focus} variant="moss" />
        ))}
      </div>

      {/* Transition Action to Field Mode */}
      <div className="pt-4 border-t border-stone/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-ink-muted font-sans text-center sm:text-left">
          When ready, step outside. The phone will be silenced and minimized.
        </p>
        <TactileButton onClick={onBegin} variant="primary" className="w-full sm:w-auto">
          <Eye className="w-4 h-4 mr-2" />
          Go Outside
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </div>
    </article>
  );
};
