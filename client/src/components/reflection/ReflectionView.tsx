import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import {
  BotanicalWaxSeal,
  BotanicalLeafSprig,
} from '../common/BotanicalIllustrations.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import {
  BookOpen,
  Compass,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  Eye,
  Calendar,
  AlertCircle,
  Download,
} from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { state, saveEntryToJournal, navigate } = useFieldSession();
  const { activeInvestigation, activeObservation, activeReflection, activeDiscovery } = state;
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [sealTarget, setSealTarget] = useState<'archive' | 'setup'>('archive');
  const [showHerbarium, setShowHerbarium] = useState<boolean>(false);

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
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-8">
      {/* 1. EDITORIAL FIELD REPORT MASTHEAD */}
      <div className="border-b border-stone/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <BotanicalWaxSeal className="w-12 h-12 shrink-0" label="SEALED" />
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-ink-faint uppercase block">
              Naturalist Synthesis Report
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-terracotta uppercase font-bold">
              FIELD REPORT NO. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
          <div className="flex items-center space-x-1.5 text-moss">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          <span className="text-stone-deep">•</span>
          <div className="flex items-center space-x-1.5 text-forest">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="font-semibold">
              {activeReflection.modelMetadata.provider === 'gemini-cloud'
                ? 'Google Gemini AI'
                : activeReflection.modelMetadata.provider === 'ollama'
                ? 'Local Naturalist (llama3.2:3b)'
                : 'Naturalist AI Engine'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. REPORT TITLE */}
      <div className="space-y-1.5">
        <span className="font-mono text-[10px] uppercase tracking-widest text-forest font-semibold">
          Ecological Synthesis
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium tracking-tight">
          {activeInvestigation.title}
        </h1>
        <p className="font-serif italic text-sm text-ink-muted">
          Physical dynamics revealed through sensory fieldwork.
        </p>
      </div>

      {/* 3. REPORT ORGANIZED INTO THE 5 KEY FIELD REPORT SECTIONS */}
      <div className="space-y-6">
        {/* SECTION 1: WHAT YOU NOTICED (Observer's Ground Evidence) */}
        <section className="p-5 sm:p-6 rounded-sm bg-paper border border-stone-deep/50 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-deep/30 pb-2">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-forest" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                1. What You Noticed
              </h2>
            </div>
            <span className="font-mono text-[11px] text-ink-muted">
              {activeObservation.actualDurationSeconds > 0
                ? `${activeObservation.actualDurationSeconds}s screen-away notice`
                : 'Direct Sensory Record'}
            </span>
          </div>

          <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
            “{activeObservation.rawNotes}”
          </p>

          {activeObservation.photoUri && (
            <div className="pt-2">
              <div className="inline-block border border-stone-deep/60 p-1 bg-paper-bright rounded-[2px] shadow-sm">
                <img
                  src={activeObservation.photoUri}
                  alt="Observed physical specimen"
                  className="w-56 h-36 object-cover rounded-[2px]"
                />
              </div>
            </div>
          )}
        </section>

        {/* SECTION 2: WHAT IT MIGHT MEAN (Probabilistic Ecological Synthesis) */}
        <section className="p-5 sm:p-6 rounded-sm bg-paper-deep/30 border border-stone-deep/50 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-deep/30 pb-2">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-botanical-teal" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-botanical-teal font-bold">
                2. What It Might Mean
              </h2>
            </div>
            <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider bg-stone-light/80 px-2 py-0.5 rounded-[2px] border border-stone-deep/30">
              Probabilistic Hypothesis
            </span>
          </div>

          <p className="font-serif text-base sm:text-lg text-ink leading-relaxed">
            {activeReflection.syntheticInsight}
          </p>

          <div className="pt-2 border-t border-stone-deep/20 flex items-center space-x-2 text-[11px] font-mono text-ink-faint">
            <AlertCircle className="w-3.5 h-3.5 text-moss shrink-0" />
            <span>
              Uncertainty communicated: hypotheses are deduced strictly from your reported evidence.
            </span>
          </div>
        </section>

        {/* SECTION 3: QUESTION TO CARRY */}
        <section className="p-5 sm:p-6 rounded-sm bg-terracotta/5 border border-terracotta/30 space-y-2.5">
          <div className="flex items-center space-x-2 border-b border-terracotta/20 pb-2">
            <HelpCircle className="w-4 h-4 text-terracotta" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-terracotta font-bold">
              3. Question to Carry
            </h2>
          </div>

          <p className="font-serif text-base sm:text-lg text-ink font-medium leading-relaxed italic">
            “{activeReflection.deepeningQuestion}”
          </p>

          <p className="font-sans text-xs text-ink-muted">
            Carry this inquiry into your next walk without needing an immediate answer.
          </p>
        </section>

        {/* SECTION 4: FIELD DISCOVERY UNLOCKED */}
        {activeDiscovery && (
          <section className="p-5 sm:p-6 rounded-sm bg-stone-light/60 border border-stone-deep/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest text-ink-faint uppercase block">
                4. Field Discovery Unlocked
              </span>
              <span className="font-serif text-lg text-ink font-semibold flex items-center">
                <BotanicalLeafSprig className="w-4 h-4 text-forest mr-2" />
                {activeDiscovery.fieldCategory}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {activeReflection.curiosityTags.map((tag) => (
                <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
              ))}
            </div>
          </section>
        )}

        {/* SECTION 5: NEXT INVESTIGATION (Continuous Nature-Learning Pathway) */}
        <section className="p-5 sm:p-6 rounded-sm bg-forest/5 border border-forest/30 space-y-2.5">
          <div className="flex items-center justify-between border-b border-forest/20 pb-2">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-forest" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                5. Next Investigation Pathway
              </h2>
            </div>
            <span className="font-mono text-[10px] text-forest uppercase font-semibold">
              Curiosity Loop
            </span>
          </div>

          <p className="font-sans text-sm text-ink leading-relaxed">
            Take note of whether the same micro-dynamics repeat at different times of day. Revisit this site during changing weather or follow the drainage channel to its terminus.
          </p>
        </section>
      </div>

      {/* Trust & Provenance Footer */}
      <div className="p-3.5 bg-stone-light/30 border border-stone-deep/20 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-ink-faint">
        <span className="flex items-center">
          <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-moss" />
          Processed Locally • Private On-Device Persistence
        </span>
        <span>Cryptographically Sealed in SQLite</span>
      </div>

      {/* Sealing Feedback Overlay / Toast State */}
      {isSealing && (
        <div className="p-4 bg-forest text-paper rounded-sm flex items-center justify-center space-x-3 animate-pulse shadow-journal">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span className="font-mono text-xs uppercase tracking-wider font-semibold">
            ✦ Inscribing Folio No. {String(activeInvestigation.sequenceNumber).padStart(3, '0')} into {sealTarget === 'archive' ? 'Field Journal' : 'Next Setup'}...
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowHerbarium(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-sm border border-stone-deep/60 bg-paper-bright text-xs font-mono uppercase tracking-wider text-forest font-semibold hover:border-botanical-teal transition-all min-h-[48px] flex items-center justify-center"
        >
          <Download className="w-3.5 h-3.5 mr-2 text-terracotta" />
          Export Herbarium Plate (.PNG)
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <TactileButton
            onClick={handleSaveAndArchive}
            disabled={isSealing}
            variant="secondary"
            className="w-full sm:w-auto px-6 min-h-[48px] text-sm"
          >
            <BookOpen className="w-4 h-4 mr-2 text-moss" />
            Seal Folio & View Journal
          </TactileButton>

          <TactileButton
            onClick={handleSaveAndNext}
            disabled={isSealing}
            variant="primary"
            className="w-full sm:w-auto px-8 min-h-[48px] text-sm font-semibold shadow-journal"
          >
            <Compass className="w-4 h-4 mr-2" />
            Seal & Begin Next Investigation
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </div>

      {/* Herbarium Plate Modal */}
      {showHerbarium && (
        <HerbariumModal
          entry={{
            id: `temp_${Date.now()}`,
            investigation: activeInvestigation,
            observation: activeObservation,
            reflection: activeReflection,
            discovery: activeDiscovery || {
              id: `disc_${Date.now()}`,
              investigationId: activeInvestigation.id,
              reflectionId: activeReflection.id,
              title: activeInvestigation.title,
              fieldCategory: 'Botanical Field Study',
              significanceScore: 5,
              unlockedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
          }}
          onClose={() => setShowHerbarium(false)}
        />
      )}
    </article>
  );
};
