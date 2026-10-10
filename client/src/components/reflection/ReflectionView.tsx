import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import {
  BotanicalLeafSprig,
  SpecimenArtwork,
} from '../common/BotanicalIllustrations.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Eye,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Share2,
  Check,
} from 'lucide-react';

export const ReflectionView: React.FC = () => {
  const { state, saveEntryToJournal, navigate } = useFieldSession();
  const { activeInvestigation, activeObservation, activeReflection, activeDiscovery } = state;
  const [isSealing, setIsSealing] = useState<boolean>(false);
  const [showHerbarium, setShowHerbarium] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

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

  const handleShare = async () => {
    const text = `FIELDNOTE: ${activeInvestigation.title}\n“${activeObservation.rawNotes}”\nInterpretation: ${activeReflection.syntheticInsight}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FIELDNOTE: ${activeInvestigation.title}`,
          text,
          url: window.location.href,
        });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const durationMin = Math.round((activeObservation.actualDurationSeconds || activeInvestigation.targetDurationSeconds || 600) / 60) || 10;
  const seqNum = String(activeInvestigation.sequenceNumber || 1).padStart(2, '0');
  const categoryLabel = activeDiscovery?.fieldCategory || 'Botany';

  // Determine specimen artwork type
  let specType = 'leaf_venation';
  if (activeObservation.photoUri?.startsWith('specimen:')) {
    specType = activeObservation.photoUri.replace('specimen:', '');
  } else {
    const t = activeInvestigation.title.toLowerCase();
    if (t.includes('moss')) specType = 'moss_on_stone';
    else if (t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) specType = 'weathering';
    else if (t.includes('water') || t.includes('rain')) specType = 'rainwater_flow';
    else if (t.includes('lichen')) specType = 'lichen_crusts';
    else if (t.includes('ant')) specType = 'ant_trails';
    else if (t.includes('diurnal') || t.includes('movement')) specType = 'diurnal_leaves';
    else if (t.includes('leaf') || t.includes('venation')) specType = 'leaf_venation';
  }

  const isCustomPhoto = activeObservation.photoUri && !activeObservation.photoUri.startsWith('specimen:');

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-16">
      {/* 1. TOP HEADER / APP BAR */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('return')}
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Observation
        </button>

        <span className="font-mono text-xs uppercase tracking-widest text-forest font-semibold">
          AI Field Report
        </span>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={handleShare}
            className="p-2 rounded-xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-ink min-h-[40px] min-w-[40px] flex items-center justify-center transition-colors"
            title="Share Report"
            aria-label="Share Report"
          >
            {isCopied ? <Check className="w-4 h-4 text-forest" /> : <Share2 className="w-4 h-4" />}
          </button>
          <span className="font-mono text-xs text-terracotta font-semibold">
            Folio {seqNum}
          </span>
        </div>
      </div>

      {/* 2. SPECIMEN HERO PLATE */}
      <div className="rounded-2xl sm:rounded-3xl border border-stone bg-paper-bright overflow-hidden shadow-journal-subtle relative">
        <div className="aspect-[16/10] sm:aspect-[2/1] w-full bg-stone-light/40 relative overflow-hidden">
          {isCustomPhoto ? (
            <img
              src={activeObservation.photoUri}
              alt={activeInvestigation.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <SpecimenArtwork type={specType} className="w-full h-full object-cover" />
          )}

          {/* Top Folio Ribbon Badge */}
          <div className="absolute top-3 left-3 bg-paper-bright/95 backdrop-blur-sm border border-stone/70 rounded-md px-2.5 py-1 text-[11px] font-mono text-terracotta uppercase font-bold tracking-wider shadow-sm flex items-center space-x-1.5">
            <BotanicalLeafSprig className="w-3.5 h-3.5" />
            <span>Folio No. {seqNum} · {categoryLabel}</span>
          </div>

          {/* Duration Badge */}
          <div className="absolute top-3 right-3 bg-paper-bright/95 backdrop-blur-sm border border-stone/70 rounded-md px-2.5 py-1 text-[11px] font-mono text-forest font-semibold shadow-sm flex items-center space-x-1">
            <Clock className="w-3 h-3 text-moss" />
            <span>{durationMin} min</span>
          </div>
        </div>

        {/* Specimen Title & Metadata */}
        <div className="p-6 sm:p-7 space-y-2 border-t border-stone/60">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink font-medium tracking-tight">
            {activeInvestigation.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono text-ink-muted">
            <span className="flex items-center text-forest font-semibold">
              <Calendar className="w-3.5 h-3.5 mr-1 text-moss" />
              {formattedDate}
            </span>
            <span>•</span>
            <span>{durationMin} min notice</span>
            <span>•</span>
            <span className="text-botanical-teal font-semibold">{categoryLabel}</span>
          </div>
        </div>
      </div>

      {/* 3. REPORT SECTIONS */}
      <div className="space-y-5 sm:space-y-6">
        {/* SECTION 1: WHAT YOU NOTICED */}
        <section className="rounded-2xl sm:rounded-3xl border border-stone bg-paper-bright p-5 sm:p-7 shadow-journal-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-stone/60 pb-3">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-forest" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                What You Noticed
              </h2>
            </div>
            <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider bg-stone-light/60 px-2 py-0.5 rounded border border-stone/40">
              Direct Observation
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
            “{activeObservation.rawNotes}”
          </p>
          {activeObservation.sensoryDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone/30 text-xs font-sans text-ink-muted">
              {activeObservation.sensoryDetails.visual && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink block font-semibold">Visual Evidence:</span>
                  {activeObservation.sensoryDetails.visual}
                </div>
              )}
              {activeObservation.sensoryDetails.tactile && (
                <div>
                  <span className="font-mono text-[10px] uppercase text-ink block font-semibold">Tactile Evidence:</span>
                  {activeObservation.sensoryDetails.tactile}
                </div>
              )}
            </div>
          )}
        </section>

        {/* SECTION 2: WHAT IT MIGHT MEAN */}
        <section className="rounded-2xl sm:rounded-3xl border border-botanical-teal/30 bg-[#F4F9F7] p-5 sm:p-7 shadow-journal-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-botanical-teal/20 pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-botanical-teal" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-botanical-teal font-bold">
                What It Might Mean
              </h2>
            </div>
            <span className="font-mono text-[10px] text-botanical-teal uppercase tracking-wider bg-white/80 px-2 py-0.5 rounded border border-botanical-teal/30 font-semibold">
              Hypothesis
            </span>
          </div>
          <p className="font-serif text-base sm:text-lg text-ink leading-relaxed">
            {activeReflection.syntheticInsight}
          </p>
        </section>

        {/* SECTION 3: SCIENTIFIC UNCERTAINTY NOTICE */}
        <div className="p-4 rounded-xl sm:rounded-2xl border border-stone bg-paper-bright/90 flex items-start space-x-3 text-xs text-ink-muted">
          <AlertCircle className="w-4 h-4 text-moss shrink-0 mt-0.5" />
          <p className="leading-relaxed font-sans">
            <strong className="text-ink">Scientific Grounding:</strong> AI interpretations are hypotheses to explore, not verified scientific facts. They are deduced strictly from your observed evidence.
          </p>
        </div>

        {/* SECTION 4: QUESTION TO CARRY */}
        <section className="rounded-2xl sm:rounded-3xl border border-terracotta/30 bg-[#FAF4ED] p-5 sm:p-7 shadow-journal-subtle space-y-3">
          <div className="flex items-center space-x-2 border-b border-terracotta/20 pb-3">
            <HelpCircle className="w-4 h-4 text-terracotta" />
            <h2 className="font-mono text-xs uppercase tracking-widest text-terracotta font-bold">
              Question to Carry
            </h2>
          </div>
          <p className="font-serif italic text-base sm:text-lg text-ink font-medium leading-relaxed">
            “{activeReflection.deepeningQuestion}”
          </p>
        </section>

        {/* SECTION 5: NEXT INVESTIGATION */}
        <section className="rounded-2xl sm:rounded-3xl border border-forest/30 bg-forest/5 p-5 sm:p-7 shadow-journal-subtle space-y-3">
          <div className="flex items-center justify-between border-b border-forest/20 pb-3">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-forest" />
              <h2 className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                Next Investigation
              </h2>
            </div>
            <span className="font-mono text-[10px] text-forest uppercase font-semibold">
              Field Path
            </span>
          </div>
          <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
            {activeReflection.nextInvestigationSeed ||
              'Compare with a nearby organism or surface under different lighting to observe physical variations.'}
          </p>
        </section>

        {/* Curiosity Tags */}
        {activeReflection.curiosityTags && activeReflection.curiosityTags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {activeReflection.curiosityTags.map((tag) => (
              <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
            ))}
          </div>
        )}
      </div>

      {/* Sealing toast */}
      {isSealing && (
        <div className="p-4 bg-forest text-paper rounded-2xl flex items-center justify-center space-x-2 animate-pulse text-xs font-mono shadow-journal">
          <Sparkles className="w-4 h-4 text-terracotta" />
          <span>Inscribing Folio No. {seqNum} into your Field Journal...</span>
        </div>
      )}

      {/* 4. ACTIONS FOOTER */}
      <div className="pt-4 border-t border-stone flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowHerbarium(true)}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-stone bg-paper-bright text-xs font-mono uppercase tracking-wider text-forest font-semibold hover:border-forest transition-colors min-h-[48px] flex items-center justify-center shadow-journal-subtle"
        >
          <Download className="w-3.5 h-3.5 mr-2 text-terracotta" />
          Export Plate (.PNG)
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <TactileButton
            onClick={handleSaveAndNext}
            disabled={isSealing}
            variant="secondary"
            className="w-full sm:w-auto px-5 min-h-[48px] text-sm"
          >
            <Compass className="w-4 h-4 mr-2" />
            Next Investigation
          </TactileButton>

          <TactileButton
            onClick={handleSaveAndArchive}
            disabled={isSealing}
            variant="primary"
            className="w-full sm:w-auto px-8 min-h-[48px] text-sm font-semibold shadow-journal"
          >
            Save to Journal
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
              fieldCategory: categoryLabel,
              significanceScore: 5,
              unlockedAt: new Date().toISOString(),
            },
            createdAt: new Date().toISOString(),
          }}
          onClose={() => setShowHerbarium(false)}
        />
      )}
    </div>
  );
};
