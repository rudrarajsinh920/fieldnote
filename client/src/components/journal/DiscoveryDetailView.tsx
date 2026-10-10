import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import { TactileButton } from '../common/TactileButton.js';
import { TactileAudioPlayer } from '../common/TactileAudioPlayer.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import {
  ArrowLeft,
  Share2,
  Download,
  Calendar,
  Clock,
  Compass,
  FileText,
  MapPin,
  Sparkles,
  HelpCircle,
  Eye,
  Check,
} from 'lucide-react';

export const DiscoveryDetailView: React.FC = () => {
  const { state, clearSelectedEntry, navigate } = useFieldSession();
  const { selectedEntry } = state;
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'media' | 'notes'>('overview');
  const [showHerbarium, setShowHerbarium] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!selectedEntry) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="font-mono text-sm text-ink-muted">No discovery folio selected.</p>
        <TactileButton onClick={() => navigate('archive')}>
          Return to Journal
        </TactileButton>
      </div>
    );
  }

  const dateFormatted = new Date(selectedEntry.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const durationMin = Math.round((selectedEntry.observation.actualDurationSeconds || 600) / 60) || 10;
  const categoryLabel = selectedEntry.discovery?.fieldCategory || 'Botany';

  const handleShare = async () => {
    const text = `FIELDNOTE: ${selectedEntry.investigation.title}\n“${selectedEntry.observation.rawNotes}”\nSynthesis: ${selectedEntry.reflection.syntheticInsight}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `FIELDNOTE: ${selectedEntry.investigation.title}`,
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

  return (
    <>
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-16">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={clearSelectedEntry}
            className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px] min-w-[44px]"
            aria-label="Back to Journal Archive"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Journal
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-sm border border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-ink min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              title="Share Discovery"
              aria-label="Share Discovery"
            >
              {isCopied ? <Check className="w-4 h-4 text-forest" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowHerbarium(true)}
              className="px-3 py-2 rounded-sm border border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-forest font-semibold min-h-[44px] flex items-center transition-colors"
              title="Export Printable Plate"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Plate (.PNG)
            </button>
          </div>
        </div>

        {/* Hero Specimen Image or Botanical Graphic */}
        <div className="rounded-sm border border-stone-deep overflow-hidden bg-paper-bright shadow-journal relative">
          {selectedEntry.observation.photoUri ? (
            <img
              src={selectedEntry.observation.photoUri}
              alt={selectedEntry.investigation.title}
              className="w-full h-64 sm:h-80 object-cover"
            />
          ) : (
            <div className="w-full h-56 sm:h-64 bg-[#F2EDE2] flex flex-col items-center justify-center p-6 space-y-3">
              <BotanicalLeafSprig className="w-16 h-16 text-forest opacity-70" />
              <span className="font-serif italic text-sm text-ink-muted">
                Tactile Field Observation Record Sealed
              </span>
            </div>
          )}

          {/* Botanical Badge Ribbon */}
          <div className="absolute top-4 left-4 bg-paper-bright/95 backdrop-blur-sm px-3 py-1 rounded-[2px] border border-stone-deep/60 shadow-sm flex items-center space-x-1.5 text-[11px] font-mono text-terracotta uppercase font-bold">
            <BotanicalLeafSprig className="w-3.5 h-3.5" />
            <span>Folio No. {String(selectedEntry.investigation.sequenceNumber).padStart(3, '0')}</span>
          </div>
        </div>

        {/* Title & Metadata Header */}
        <div className="space-y-2 border-b border-stone-deep/40 pb-4">
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
            {selectedEntry.investigation.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted">
            <span className="flex items-center text-forest font-semibold">
              <Calendar className="w-3.5 h-3.5 mr-1" />
              {dateFormatted}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1" />
              {durationMin} min
            </span>
            <span>•</span>
            <span className="uppercase text-botanical-teal font-semibold">
              {categoryLabel}
            </span>
          </div>
        </div>

        {/* Tab Navigation (Overview, Map, Media, Notes) */}
        <div className="flex items-center space-x-1 border-b border-stone-deep/30 pb-1" role="tablist">
          {(['overview', 'map', 'media', 'notes'] as const).map((tab) => (
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

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* My Observation Section */}
            <section className="p-5 sm:p-6 rounded-sm border border-stone-deep/60 bg-paper-bright space-y-3">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-bold">
                <Eye className="w-4 h-4 text-forest" />
                <span>My Observation</span>
              </div>
              <p className="font-serif text-base sm:text-lg leading-relaxed text-ink italic">
                “{selectedEntry.observation.rawNotes}”
              </p>
              {selectedEntry.observation.sensoryDetails && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-stone-deep/20 text-xs font-sans text-ink-muted">
                  {selectedEntry.observation.sensoryDetails.visual && (
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-ink block">Visual Evidence:</strong>
                      {selectedEntry.observation.sensoryDetails.visual}
                    </div>
                  )}
                  {selectedEntry.observation.sensoryDetails.tactile && (
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-ink block">Tactile Evidence:</strong>
                      {selectedEntry.observation.sensoryDetails.tactile}
                    </div>
                  )}
                </div>
              )}
            </section>

            {/* Ecological Synthesis Section */}
            <section className="p-5 sm:p-6 rounded-sm border border-botanical-teal/40 bg-[#F4F9F7] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-botanical-teal font-bold">
                <Sparkles className="w-4 h-4 text-botanical-teal" />
                <span>Ecological Synthesis</span>
              </div>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-ink">
                {selectedEntry.reflection.syntheticInsight}
              </p>
            </section>

            {/* Question to Carry */}
            <section className="p-5 sm:p-6 rounded-sm border border-terracotta/40 bg-[#FAF4ED] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-terracotta font-bold">
                <HelpCircle className="w-4 h-4 text-terracotta" />
                <span>Question to Carry</span>
              </div>
              <p className="font-serif italic text-sm sm:text-base leading-relaxed text-ink">
                “{selectedEntry.reflection.deepeningQuestion}”
              </p>
            </section>

            {/* Voice Memo if present */}
            {selectedEntry.observation.audioUri && (
              <div className="space-y-2">
                <span className="font-mono text-xs uppercase tracking-wider text-ink-muted font-semibold block">
                  Bioacoustic Record
                </span>
                <TactileAudioPlayer
                  src={selectedEntry.observation.audioUri}
                  label="Field Audio Note"
                />
              </div>
            )}

            {/* Next Investigation Seed */}
            {selectedEntry.reflection.nextInvestigationSeed && (
              <div className="p-4 rounded-sm border border-stone-deep/40 bg-stone-light/30 flex items-start space-x-3 text-xs">
                <Compass className="w-4 h-4 text-forest shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-mono uppercase text-forest font-semibold block">Next Investigation Seed:</strong>
                  <p className="text-ink-muted leading-relaxed font-serif">
                    {selectedEntry.reflection.nextInvestigationSeed}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MAP */}
        {activeTab === 'map' && (
          <div className="p-8 rounded-sm border border-stone-deep/60 bg-paper-bright text-center space-y-3">
            <MapPin className="w-8 h-8 text-botanical-teal mx-auto" />
            <h3 className="font-serif text-lg font-medium text-ink">Physical Micro-Site</h3>
            <p className="font-serif italic text-xs text-ink-muted max-w-sm mx-auto">
              Field observations are deliberately local-first and privacy-preserving. Coordinates are stored exclusively on your device.
            </p>
            <div className="inline-block px-3 py-1 rounded-[2px] bg-stone-light/60 font-mono text-xs text-ink">
              Micro-Habitat Sector: {selectedEntry.discovery?.fieldCategory || 'Local Terrain'}
            </div>
          </div>
        )}

        {/* TAB 3: MEDIA */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            {selectedEntry.observation.photoUri ? (
              <div className="rounded-sm border border-stone-deep overflow-hidden">
                <img
                  src={selectedEntry.observation.photoUri}
                  alt={selectedEntry.investigation.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-ink-muted border border-dashed rounded-sm">
                No visual photo attached to this folio.
              </div>
            )}
            {selectedEntry.observation.audioUri && (
              <TactileAudioPlayer src={selectedEntry.observation.audioUri} label="Audio Note" />
            )}
          </div>
        )}

        {/* TAB 4: NOTES */}
        {activeTab === 'notes' && (
          <div className="p-6 rounded-sm border border-stone-deep/60 bg-paper-bright space-y-4">
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-ink font-bold">
              <FileText className="w-4 h-4 text-forest" />
              <span>Full Investigation Log</span>
            </div>
            <div className="space-y-3 text-xs font-mono text-ink-muted leading-relaxed border-t border-stone-deep/30 pt-3">
              <div>
                <strong className="text-ink uppercase block">Directive Prompt:</strong>
                {selectedEntry.investigation.prompt}
              </div>
              <div>
                <strong className="text-ink uppercase block">Grounding Constraint:</strong>
                {selectedEntry.investigation.groundingConstraint}
              </div>
              <div>
                <strong className="text-ink uppercase block">Inquiry Question:</strong>
                {selectedEntry.investigation.inquiryQuestion}
              </div>
              <div>
                <strong className="text-ink uppercase block">Screen-Away Silent Duration:</strong>
                {selectedEntry.observation.actualDurationSeconds} seconds
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-4 border-t border-stone-deep/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={clearSelectedEntry}
            className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px] flex items-center"
          >
            ← Back to All Folios
          </button>

          <TactileButton
            onClick={() => setShowHerbarium(true)}
            variant="primary"
            className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider min-h-[46px]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Herbarium Plate (.PNG)
          </TactileButton>
        </div>
      </div>

      {/* Herbarium Modal */}
      {showHerbarium && (
        <HerbariumModal
          entry={selectedEntry}
          onClose={() => setShowHerbarium(false)}
        />
      )}
    </>
  );
};
