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
  Sparkles,
  HelpCircle,
  Eye,
  Calendar,
  AlertCircle,
  Download,
  MapPin,
} from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { state, saveEntryToJournal, navigate } = useFieldSession();
  const { activeInvestigation, activeObservation, activeReflection, activeDiscovery } = state;
  const [activeTab, setActiveTab] = useState<'insights' | 'details' | 'map'>('insights');
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [showHerbarium, setShowHerbarium] = useState<boolean>(false);

  if (!activeInvestigation || !activeObservation || !activeReflection) {
    return null;
  }

  const handleSaveAndArchive = () => {
    setIsSealing(true);
    setTimeout(() => {
      saveEntryToJournal();
      navigate('archive');
    }, 500);
  };

  const handleSaveAndNext = () => {
    setIsSealing(true);
    setTimeout(() => {
      saveEntryToJournal();
      navigate('setup');
    }, 500);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-investigation-unfold space-y-7 max-w-2xl mx-auto">
      {/* 1. Header with Seal and Folio Number */}
      <div className="border-b border-stone/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <BotanicalWaxSeal className="w-10 h-10 shrink-0" label="SEALED" />
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-ink-faint uppercase block">
              AI Field Report
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-terracotta uppercase font-bold">
              FOLIO NO. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted">
          <Calendar className="w-3.5 h-3.5 text-moss" />
          <span>{formattedDate}</span>
          <span>•</span>
          <span className="text-forest font-semibold">
            {activeReflection.modelMetadata.provider === 'gemini-cloud'
              ? 'Gemini 3.8 Flash'
              : 'Local Naturalist'}
          </span>
        </div>
      </div>

      {/* 2. Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          {activeInvestigation.title}
        </h1>
        <p className="font-serif italic text-sm text-ink-muted">
          Physical dynamics revealed through sensory fieldwork.
        </p>
      </div>

      {/* 3. TABS: Insights | Details | Map */}
      <div className="flex items-center space-x-1 border-b border-stone-deep/30 pb-1" role="tablist">
        {(['insights', 'details', 'map'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-[2px] text-xs font-mono uppercase tracking-wider transition-colors min-h-[40px] ${
              activeTab === tab
                ? 'border-b-2 border-forest text-forest font-bold bg-paper-bright/60'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Specimen Photo (if captured) */}
      {activeObservation.photoUri && (
        <div className="rounded-sm border border-stone-deep overflow-hidden">
          <img
            src={activeObservation.photoUri}
            alt="Field specimen"
            className="w-full h-56 sm:h-72 object-cover"
          />
        </div>
      )}

      {/* TAB 1: INSIGHTS */}
      {activeTab === 'insights' && (
        <div className="space-y-6">
          {/* WHAT YOU NOTICED */}
          <section className="p-5 sm:p-6 rounded-sm bg-paper border border-stone-deep/60 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-deep/30 pb-2">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-forest" />
                <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                  What You Noticed
                </h2>
              </div>
              <span className="font-mono text-[10px] text-ink-muted">
                Direct Human Evidence
              </span>
            </div>
            <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
              “{activeObservation.rawNotes}”
            </p>
          </section>

          {/* WHAT IT MIGHT MEAN */}
          <section className="p-5 sm:p-6 rounded-sm bg-paper-deep/30 border border-stone-deep/60 space-y-2.5">
            <div className="flex items-center justify-between border-b border-stone-deep/30 pb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-botanical-teal" />
                <h2 className="font-mono text-xs uppercase tracking-widest text-botanical-teal font-bold">
                  What It Might Mean
                </h2>
              </div>
              <span className="font-mono text-[10px] text-ink-faint uppercase tracking-wider bg-stone-light/80 px-2 py-0.5 rounded-[2px] border border-stone-deep/30">
                Hypothesis
              </span>
            </div>
            <p className="font-serif text-base sm:text-lg text-ink leading-relaxed">
              {activeReflection.syntheticInsight}
            </p>
          </section>

          {/* QUESTION TO CARRY */}
          <section className="p-5 sm:p-6 rounded-sm bg-terracotta/5 border border-terracotta/30 space-y-2">
            <div className="flex items-center space-x-2 border-b border-terracotta/20 pb-2">
              <HelpCircle className="w-4 h-4 text-terracotta" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-terracotta font-bold">
                Question to Carry
              </h2>
            </div>
            <p className="font-serif italic text-base sm:text-lg text-ink font-medium leading-relaxed">
              “{activeReflection.deepeningQuestion}”
            </p>
          </section>

          {/* FIELD DISCOVERY */}
          {activeDiscovery && (
            <section className="p-4 sm:p-5 rounded-sm bg-stone-light/60 border border-stone-deep/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono tracking-widest text-ink-faint uppercase block">
                  Field Discovery
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

          {/* NEXT INVESTIGATION */}
          <section className="p-5 sm:p-6 rounded-sm bg-forest/5 border border-forest/30 space-y-2">
            <div className="flex items-center justify-between border-b border-forest/20 pb-2">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-forest" />
                <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                  Next Investigation
                </h2>
              </div>
              <span className="font-mono text-[10px] text-forest uppercase font-semibold">
                Path
              </span>
            </div>
            <p className="font-sans text-sm text-ink leading-relaxed">
              {activeReflection.nextInvestigationSeed ||
                'Take note of whether the same micro-dynamics repeat under different moisture or lighting conditions.'}
            </p>
          </section>

          {/* SCIENTIFIC UNCERTAINTY NOTICE BOX */}
          <div className="p-3.5 bg-paper rounded-sm border border-stone-deep/60 flex items-start space-x-2.5 text-xs text-ink-muted">
            <AlertCircle className="w-4 h-4 text-moss shrink-0 mt-0.5" />
            <p className="leading-relaxed font-sans">
              <strong>Note:</strong> AI interpretations are hypotheses to explore, not verified scientific facts. They are deduced strictly from your observed evidence.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: DETAILS */}
      {activeTab === 'details' && (
        <div className="space-y-4 p-5 rounded-sm border border-stone-deep/60 bg-paper-bright text-xs font-mono text-ink-muted leading-relaxed">
          <div>
            <strong className="text-ink uppercase block">Directive Prompt:</strong>
            {activeInvestigation.prompt}
          </div>
          <div>
            <strong className="text-ink uppercase block">Grounding Constraint:</strong>
            {activeInvestigation.groundingConstraint}
          </div>
          <div>
            <strong className="text-ink uppercase block">Inquiry Question:</strong>
            {activeInvestigation.inquiryQuestion}
          </div>
          <div>
            <strong className="text-ink uppercase block">Observation Duration:</strong>
            {activeObservation.actualDurationSeconds} seconds
          </div>
          <div>
            <strong className="text-ink uppercase block">Inference Provider:</strong>
            {activeReflection.modelMetadata.provider} ({activeReflection.modelMetadata.modelName})
          </div>
        </div>
      )}

      {/* TAB 3: MAP */}
      {activeTab === 'map' && (
        <div className="p-8 rounded-sm border border-stone-deep/60 bg-paper-bright text-center space-y-3">
          <MapPin className="w-8 h-8 text-botanical-teal mx-auto" />
          <h3 className="font-serif text-lg font-medium text-ink">Observation Site</h3>
          <p className="font-serif italic text-xs text-ink-muted max-w-sm mx-auto">
            Grounded locally. Sensory data remains confidential and persisted on-device.
          </p>
        </div>
      )}

      {/* Sealing toast */}
      {isSealing && (
        <div className="p-3.5 bg-forest text-paper rounded-sm flex items-center justify-center space-x-2 animate-pulse text-xs font-mono">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span>Sealing Folio No. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}...</span>
        </div>
      )}

      {/* 4. ACTIONS */}
      <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowHerbarium(true)}
          className="w-full sm:w-auto px-4 py-3 rounded-sm border border-stone-deep/70 bg-paper-bright text-xs font-mono uppercase tracking-wider text-forest font-semibold hover:border-forest transition-colors min-h-[48px] flex items-center justify-center"
        >
          <Download className="w-3.5 h-3.5 mr-2 text-terracotta" />
          Export Plate (.PNG)
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <TactileButton
            onClick={handleSaveAndArchive}
            disabled={isSealing}
            variant="secondary"
            className="w-full sm:w-auto px-6 min-h-[48px] text-sm"
          >
            <BookOpen className="w-4 h-4 mr-2 text-moss" />
            Save to Journal
          </TactileButton>

          <TactileButton
            onClick={handleSaveAndNext}
            disabled={isSealing}
            variant="primary"
            className="w-full sm:w-auto px-8 min-h-[48px] text-sm font-semibold shadow-journal"
          >
            <Compass className="w-4 h-4 mr-2" />
            Next Investigation
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </div>

      {/* Herbarium Modal */}
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
