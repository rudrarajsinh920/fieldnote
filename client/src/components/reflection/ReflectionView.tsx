import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { BookOpen, Compass, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { state, saveEntryToJournal, navigate } = useFieldSession();
  const { activeInvestigation, activeObservation, activeReflection, activeDiscovery } = state;
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [sealTarget, setSealTarget] = useState<'archive' | 'setup'>('archive');

  if (!activeInvestigation || !activeObservation || !activeReflection) {
    return null;
  }

  const handleSaveAndNext = () => {
    setIsSealing(true);
    setSealTarget('setup');
    setTimeout(() => {
      saveEntryToJournal();
      navigate('setup');
    }, 600);
  };

  const handleSaveAndArchive = () => {
    setIsSealing(true);
    setSealTarget('archive');
    setTimeout(() => {
      saveEntryToJournal();
      navigate('archive');
    }, 600);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="journal-page p-5 sm:p-10 md:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-7 max-w-2xl mx-auto">
      {/* Journal Masthead */}
      <div className="border-b border-stone/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-terracotta text-sm">✦</span>
          <span className="font-mono text-xs tracking-widest text-ink-muted uppercase font-semibold">
            FIELD NOTE NO. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
          </span>
          <span className="text-stone-deep font-mono text-xs">•</span>
          <span className="font-mono text-xs text-ink-faint">{formattedDate}</span>
        </div>

        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-moss" />
          <span className="text-moss font-semibold">
            {activeReflection.modelMetadata.provider === 'gemini-cloud'
              ? 'Google Gemini AI (Cloud)'
              : activeReflection.modelMetadata.provider === 'ollama'
              ? 'Local AI (llama3.2:3b)'
              : 'Naturalist AI Engine'}
          </span>
        </div>
      </div>

      {/* Main Title & Field Context */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-medium tracking-tight">
          {activeInvestigation.title}
        </h1>
        <p className="font-serif italic text-sm text-ink-muted">
          Physical dynamics revealed through focused attention.
        </p>
      </div>

      {/* SECTION 1: OBSERVATION ("You Noticed") */}
      <section className="space-y-2 border-l-2 border-forest pl-4 sm:pl-6 bg-paper-deep/25 py-3 rounded-r-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
            Observation
          </h2>
          {activeObservation.actualDurationSeconds > 0 && (
            <span className="font-mono text-[11px] text-ink-faint">
              {activeObservation.actualDurationSeconds}s screen-away presence
            </span>
          )}
        </div>
        <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
          “{activeObservation.rawNotes}”
        </p>
        {activeObservation.photoUri && (
          <div className="pt-2">
            <div className="inline-block border border-stone-deep/60 p-1 bg-paper rounded-[2px] shadow-sm">
              <img
                src={activeObservation.photoUri}
                alt="Observed physical specimen"
                className="w-48 h-32 object-cover rounded-[2px]"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: REFLECTION ("What It Might Mean") */}
      <section className="space-y-2 pl-4 sm:pl-6 border-l-2 border-moss">
        <div className="flex items-center space-x-2">
          <h2 className="font-mono text-xs uppercase tracking-widest text-moss font-semibold">
            Naturalist Reflection
          </h2>
          <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">
            (Probabilistic)
          </span>
        </div>
        <p className="font-serif text-base sm:text-lg text-ink leading-relaxed">
          {activeReflection.syntheticInsight}
        </p>
      </section>

      {/* SECTION 3: DISCOVERY UNLOCKED */}
      {activeDiscovery && (
        <section className="p-3.5 rounded-[2px] bg-stone-light/60 border border-stone-deep/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono tracking-widest text-ink-faint uppercase block">
              Field Discovery Unlocked
            </span>
            <span className="font-serif text-base text-ink font-semibold block">
              ✦ {activeDiscovery.fieldCategory}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {activeReflection.curiosityTags.map((tag) => (
              <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
            ))}
          </div>
        </section>
      )}

      {/* SECTION 4: A QUESTION TO CARRY */}
      <section className="space-y-2 pl-4 sm:pl-6 border-l-2 border-terracotta bg-terracotta/5 py-3 rounded-r-sm">
        <h2 className="font-mono text-xs uppercase tracking-widest text-terracotta font-semibold">
          Question to Carry
        </h2>
        <p className="font-serif text-base sm:text-lg text-ink font-medium leading-relaxed italic">
          “{activeReflection.deepeningQuestion}”
        </p>
      </section>

      {/* Trust & Provenance Footer */}
      <div className="p-3 bg-stone-light/30 border border-stone-deep/20 rounded-[2px] flex items-center justify-between text-[11px] font-mono text-ink-faint">
        <span>Processed 100% On-Device • Zero Cloud Transmission</span>
        <span>Local SQLite Persistence</span>
      </div>

      {/* Sealing Feedback Overlay / Toast State */}
      {isSealing && (
        <div className="p-4 bg-forest text-paper rounded-[2px] flex items-center justify-center space-x-3 animate-pulse shadow-sm">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
            ✦ Inscribing Field Note No. {String(activeInvestigation.sequenceNumber).padStart(3, '0')} into {sealTarget === 'archive' ? 'Archive' : 'Logbook'}...
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <TactileButton
          onClick={handleSaveAndArchive}
          disabled={isSealing}
          variant="secondary"
          className="w-full sm:w-auto px-6 min-h-[44px] text-sm"
        >
          <BookOpen className="w-4 h-4 mr-2 text-moss" />
          Seal & View Journal
        </TactileButton>

        <TactileButton
          onClick={handleSaveAndNext}
          disabled={isSealing}
          variant="primary"
          className="w-full sm:w-auto px-8 min-h-[44px] text-sm"
        >
          <Compass className="w-4 h-4 mr-2" />
          Seal & Next Investigation
          <ArrowRight className="w-4 h-4 ml-2" />
        </TactileButton>
      </div>
    </article>
  );
};
