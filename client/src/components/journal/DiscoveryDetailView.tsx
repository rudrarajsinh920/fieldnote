import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import {
  BotanicalLeafSprig,
  SpecimenArtwork,
} from '../common/BotanicalIllustrations.js';
import { TactileButton } from '../common/TactileButton.js';
import { TactileAudioPlayer } from '../common/TactileAudioPlayer.js';
import { HerbariumModal } from '../common/HerbariumModal.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
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
  AlertCircle,
  Image as ImageIcon,
  Pencil,
} from 'lucide-react';

export const DiscoveryDetailView: React.FC = () => {
  const { state, clearSelectedEntry, navigate } = useFieldSession();
  const { selectedEntry } = state;
  const [activeTab, setActiveTab] = useState<'overview' | 'insights' | 'map' | 'media' | 'notes'>('overview');
  const [showHerbarium, setShowHerbarium] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedNotes, setEditedNotes] = useState(selectedEntry?.observation.rawNotes || '');

  React.useEffect(() => {
    if (selectedEntry) {
      setEditedNotes(selectedEntry.observation.rawNotes);
    }
  }, [selectedEntry]);

  if (!selectedEntry) {
    return (
      <div className="text-center py-20 space-y-4 max-w-md mx-auto">
        <p className="font-serif text-lg text-ink-muted">No discovery folio selected.</p>
        <TactileButton onClick={() => navigate('archive')} variant="primary">
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
  const seq = String(selectedEntry.investigation.sequenceNumber || 1).padStart(2, '0');

  // Specimen Artwork Type Resolution
  let specType = 'leaf_venation';
  if (selectedEntry.observation.photoUri?.startsWith('specimen:')) {
    specType = selectedEntry.observation.photoUri.replace('specimen:', '');
  } else {
    const t = selectedEntry.investigation.title.toLowerCase();
    if (t.includes('moss')) specType = 'moss_on_stone';
    else if (t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) specType = 'weathering';
    else if (t.includes('rain') || t.includes('water')) specType = 'rainwater_flow';
    else if (t.includes('lichen')) specType = 'lichen_crusts';
    else if (t.includes('ant')) specType = 'ant_trails';
    else if (t.includes('diurnal') || t.includes('movement')) specType = 'diurnal_leaves';
  }

  const isCustomPhoto = selectedEntry.observation.photoUri && !selectedEntry.observation.photoUri.startsWith('specimen:');

  const handleShare = async () => {
    const text = `FIELDNOTE: ${selectedEntry.investigation.title}\n“${selectedEntry.observation.rawNotes}”\nEcological Synthesis: ${selectedEntry.reflection.syntheticInsight}`;
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
      <div className="space-y-6 sm:space-y-8 animate-journal-entry pb-16">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={clearSelectedEntry}
            className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px]"
            aria-label="Back to Journal Archive"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Back to Journal
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              className="p-2.5 rounded-2xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-ink min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors shadow-journal-subtle"
              title="Share Discovery"
              aria-label="Share Discovery"
            >
              {isCopied ? <Check className="w-4 h-4 text-forest" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setShowHerbarium(true)}
              className="px-4 py-2.5 rounded-2xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-forest font-semibold min-h-[44px] flex items-center transition-colors shadow-journal-subtle"
              title="Export Printable Plate"
            >
              <Download className="w-3.5 h-3.5 mr-1.5 text-terracotta" />
              Plate (.PNG)
            </button>
          </div>
        </div>

        {/* ============================================================ */}
        {/* RESPONSIVE EDITORIAL SPLIT LAYOUT (Desktop & Mobile)         */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ---------------------------------------------------------- */}
          {/* LEFT COLUMN: HERO SPECIMEN & EVIDENCE (lg:col-span-5)      */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-6">
            {/* Specimen Artwork Frame */}
            <div className="rounded-3xl border border-stone overflow-hidden bg-paper-bright shadow-journal-subtle relative">
              <div className="aspect-[4/3] w-full bg-stone-light/40 relative overflow-hidden">
                {isCustomPhoto ? (
                  <img
                    src={selectedEntry.observation.photoUri}
                    alt={selectedEntry.investigation.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <SpecimenArtwork type={specType} className="w-full h-full object-cover" />
                )}

                {/* Folio Ribbon Badge */}
                <div className="absolute top-3 left-3 bg-paper-bright/95 backdrop-blur-sm border border-stone/70 rounded-md px-2.5 py-1 text-[11px] font-mono text-terracotta uppercase font-bold tracking-wider shadow-sm flex items-center space-x-1.5">
                  <BotanicalLeafSprig className="w-3.5 h-3.5" />
                  <span>Folio No. {seq} · {categoryLabel}</span>
                </div>

                {/* Duration Badge */}
                <div className="absolute top-3 right-3 bg-paper-bright/95 backdrop-blur-sm border border-stone/70 rounded-md px-2.5 py-1 text-[11px] font-mono text-forest font-semibold shadow-sm flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-moss" />
                  <span>{durationMin} min</span>
                </div>
              </div>

              {/* Bioacoustic Record Player if available */}
              {selectedEntry.observation.audioUri && (
                <div className="p-4 border-t border-stone/60 bg-paper space-y-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-forest font-semibold block">
                    Bioacoustic Audio Note
                  </span>
                  <TactileAudioPlayer
                    src={selectedEntry.observation.audioUri}
                    label="Field Voice Recording"
                  />
                </div>
              )}
            </div>

            {/* Sensory Details Card */}
            {selectedEntry.observation.sensoryDetails && (
              <div className="rounded-3xl border border-stone bg-paper-bright p-5 shadow-journal-subtle space-y-3">
                <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold block border-b border-stone/60 pb-2">
                  Sensory Field Evidence
                </span>
                <div className="space-y-2 text-xs font-sans text-ink-muted">
                  {selectedEntry.observation.sensoryDetails.visual && (
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-ink block">Visual Evidence:</strong>
                      <p className="font-serif italic text-ink">{selectedEntry.observation.sensoryDetails.visual}</p>
                    </div>
                  )}
                  {selectedEntry.observation.sensoryDetails.tactile && (
                    <div>
                      <strong className="font-mono text-[10px] uppercase text-ink block">Tactile Evidence:</strong>
                      <p className="font-serif italic text-ink">{selectedEntry.observation.sensoryDetails.tactile}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------- */}
          {/* RIGHT COLUMN: EDITORIAL CONTENT & TABS (lg:col-span-7)     */}
          {/* ---------------------------------------------------------- */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title & Metadata Header */}
            <div className="space-y-2.5 border-b border-stone/60 pb-5">
              <div className="flex items-center space-x-2 text-xs font-mono text-terracotta uppercase font-bold tracking-wider">
                <span>Folio {seq}</span>
                <span>•</span>
                <span>{categoryLabel}</span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink font-medium tracking-tight">
                  {selectedEntry.investigation.title}
                </h1>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone bg-paper-bright hover:bg-stone-light/50 text-xs font-mono uppercase tracking-wider text-forest font-semibold transition-colors flex items-center space-x-1.5 shadow-sm shrink-0"
                  title="Edit Folio"
                >
                  <Pencil className="w-3.5 h-3.5 text-terracotta" />
                  <span>{isEditing ? 'Done' : 'Edit'}</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-ink-muted pt-1">
                <span className="flex items-center text-forest font-semibold">
                  <Calendar className="w-3.5 h-3.5 mr-1 text-moss" />
                  {dateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {durationMin} min duration
                </span>
                <span>•</span>
                <span className="text-forest font-semibold">
                  Verified Local Evidence
                </span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-1 border-b border-stone/60 pb-1" role="tablist">
              {(['overview', 'insights', 'map', 'media', 'notes'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors min-h-[40px] ${
                    activeTab === tab
                      ? 'bg-forest text-paper font-semibold shadow-sm'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {tab === 'insights' ? 'AI Insights' : tab}
                </button>
              ))}
            </div>

            {/* ======================================================== */}
            {/* TAB CONTENT                                              */}
            {/* ======================================================== */}
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-5 animate-journal-entry">
                {/* 1. My Observation Section */}
                <section className="rounded-3xl border border-stone bg-paper-bright p-5 sm:p-7 shadow-journal-subtle space-y-3">
                  <div className="flex items-center justify-between border-b border-stone/60 pb-3">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-bold">
                      <Eye className="w-4 h-4 text-forest" />
                      <span>My Observation</span>
                    </div>
                    <span className="font-mono text-[10px] text-ink-muted uppercase bg-stone-light/50 px-2 py-0.5 rounded">
                      Human Notice
                    </span>
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedNotes}
                        onChange={(e) => setEditedNotes(e.target.value)}
                        rows={4}
                        className="w-full p-3.5 rounded-2xl border border-stone bg-paper font-serif text-base text-ink focus:outline-none focus:ring-1 focus:ring-forest leading-relaxed resize-none shadow-inner"
                        placeholder="Edit observation notes..."
                      />
                      <div className="flex justify-between items-center text-xs font-mono text-ink-muted">
                        <span>{editedNotes.length} characters</span>
                        <button
                          type="button"
                          onClick={() => {
                            selectedEntry.observation.rawNotes = editedNotes;
                            setIsEditing(false);
                          }}
                          className="px-4 py-1.5 rounded-xl bg-forest text-paper text-xs font-mono uppercase font-semibold hover:bg-forest-deep transition-colors shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="font-serif text-base sm:text-lg leading-relaxed text-ink italic">
                      “{editedNotes || selectedEntry.observation.rawNotes}”
                    </p>
                  )}
                </section>

                {/* 2. Ecological Synthesis Section */}
                <section className="rounded-3xl border border-botanical-teal/30 bg-[#F4F9F7] p-5 sm:p-7 shadow-journal-subtle space-y-3">
                  <div className="flex items-center justify-between border-b border-botanical-teal/20 pb-3">
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-botanical-teal font-bold">
                      <Sparkles className="w-4 h-4 text-botanical-teal" />
                      <span>What It Might Mean</span>
                    </div>
                    <span className="font-mono text-[10px] text-botanical-teal uppercase bg-white/80 px-2 py-0.5 rounded border border-botanical-teal/30 font-semibold">
                      Hypothesis
                    </span>
                  </div>
                  <p className="font-serif text-base text-ink leading-relaxed">
                    {selectedEntry.reflection.syntheticInsight}
                  </p>
                </section>

                {/* 3. Scientific Uncertainty Note */}
                <div className="p-4 rounded-2xl border border-stone bg-paper-bright/90 flex items-start space-x-3 text-xs text-ink-muted">
                  <AlertCircle className="w-4 h-4 text-moss shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-sans">
                    <strong className="text-ink">Scientific Grounding:</strong> AI interpretations are hypotheses to explore, not verified scientific facts. They are deduced strictly from your observed evidence.
                  </p>
                </div>

                {/* 4. Question to Carry */}
                <section className="rounded-3xl border border-terracotta/30 bg-[#FAF4ED] p-5 sm:p-7 shadow-journal-subtle space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-terracotta font-bold border-b border-terracotta/20 pb-3">
                    <HelpCircle className="w-4 h-4 text-terracotta" />
                    <span>Question to Carry</span>
                  </div>
                  <p className="font-serif italic text-base text-ink leading-relaxed">
                    “{selectedEntry.reflection.deepeningQuestion}”
                  </p>
                </section>

                {/* 5. Next Investigation Seed */}
                {selectedEntry.reflection.nextInvestigationSeed && (
                  <section className="rounded-3xl border border-forest/30 bg-forest/5 p-5 sm:p-7 shadow-journal-subtle space-y-3">
                    <div className="flex items-center justify-between border-b border-forest/20 pb-3">
                      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-bold">
                        <Compass className="w-4 h-4 text-forest" />
                        <span>Next Investigation Seed</span>
                      </div>
                      <span className="font-mono text-[10px] text-forest uppercase font-semibold">
                        Field Path
                      </span>
                    </div>
                    <p className="font-sans text-sm sm:text-base text-ink leading-relaxed">
                      {selectedEntry.reflection.nextInvestigationSeed}
                    </p>
                  </section>
                )}
              </div>
            )}

            {/* TAB 2: AI INSIGHTS */}
            {activeTab === 'insights' && (
              <div className="rounded-3xl border border-stone bg-paper-bright p-6 sm:p-8 space-y-5 shadow-journal-subtle animate-journal-entry">
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    Naturalist Model Synthesis
                  </h3>
                  <p className="font-sans text-xs text-ink-muted">
                    Inference generated from observed physical sensory inputs.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-stone-light/40 border border-stone/50 space-y-2 text-xs font-mono text-ink-muted">
                  <div className="flex justify-between">
                    <span>Provider:</span>
                    <strong className="text-ink">{selectedEntry.reflection.modelMetadata.provider}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Model Engine:</span>
                    <strong className="text-ink">{selectedEntry.reflection.modelMetadata.modelName}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Inference Duration:</span>
                    <strong className="text-ink">{selectedEntry.reflection.modelMetadata.inferenceDurationMs} ms</strong>
                  </div>
                </div>

                {selectedEntry.reflection.curiosityTags && (
                  <div className="space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold block">
                      Curiosity Tags
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {selectedEntry.reflection.curiosityTags.map((tag) => (
                        <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MAP */}
            {activeTab === 'map' && (
              <div className="rounded-3xl border border-stone bg-paper-bright p-8 sm:p-12 text-center space-y-4 shadow-journal-subtle animate-journal-entry">
                <div className="w-14 h-14 mx-auto rounded-full bg-stone-light/50 flex items-center justify-center text-botanical-teal">
                  <MapPin className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-medium text-ink">Observation Micro-Site</h3>
                  <p className="font-serif italic text-xs text-ink-muted max-w-sm mx-auto leading-relaxed">
                    Field observations are local-first and privacy-preserving. Sensory coordinates remain exclusively on your device.
                  </p>
                </div>
                <div className="inline-block px-3.5 py-1.5 rounded-full bg-stone-light/60 font-mono text-xs text-ink border border-stone/50">
                  Micro-Habitat Sector: {selectedEntry.discovery?.fieldCategory || 'Local Terrain'}
                </div>
              </div>
            )}

            {/* TAB 4: MEDIA */}
            {activeTab === 'media' && (
              <div className="space-y-4 animate-journal-entry">
                <div className="rounded-3xl border border-stone bg-paper-bright overflow-hidden shadow-journal-subtle p-5 space-y-3">
                  <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-bold">
                    <ImageIcon className="w-4 h-4 text-forest" />
                    <span>Visual Specimen Archive</span>
                  </div>
                  <div className="rounded-2xl border border-stone overflow-hidden aspect-[16/10] bg-stone-light/40">
                    {isCustomPhoto ? (
                      <img
                        src={selectedEntry.observation.photoUri}
                        alt={selectedEntry.investigation.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <SpecimenArtwork type={specType} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                {selectedEntry.observation.audioUri && (
                  <div className="rounded-3xl border border-stone bg-paper-bright p-5 shadow-journal-subtle space-y-2">
                    <span className="font-mono text-xs uppercase tracking-wider text-forest font-bold block">
                      Bioacoustic Audio Recording
                    </span>
                    <TactileAudioPlayer src={selectedEntry.observation.audioUri} label="Audio Note" />
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: NOTES */}
            {activeTab === 'notes' && (
              <div className="rounded-3xl border border-stone bg-paper-bright p-6 sm:p-8 space-y-5 shadow-journal-subtle animate-journal-entry">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-ink font-bold border-b border-stone/60 pb-3">
                  <FileText className="w-4 h-4 text-forest" />
                  <span>Full Fieldwork Directive Log</span>
                </div>
                <div className="space-y-3 text-xs font-mono text-ink-muted leading-relaxed">
                  <div>
                    <strong className="text-ink uppercase block">Directive Prompt:</strong>
                    <p className="font-serif text-sm text-ink pt-0.5">{selectedEntry.investigation.prompt}</p>
                  </div>
                  <div>
                    <strong className="text-ink uppercase block">Grounding Constraint:</strong>
                    <p className="font-serif text-sm text-ink pt-0.5">{selectedEntry.investigation.groundingConstraint}</p>
                  </div>
                  <div>
                    <strong className="text-ink uppercase block">Inquiry Question:</strong>
                    <p className="font-serif text-sm text-ink pt-0.5">{selectedEntry.investigation.inquiryQuestion}</p>
                  </div>
                  <div>
                    <strong className="text-ink uppercase block">Silent Field Duration:</strong>
                    <p className="font-serif text-sm text-ink pt-0.5">{selectedEntry.observation.actualDurationSeconds} seconds</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-stone flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={clearSelectedEntry}
                className="text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px] flex items-center"
              >
                ← Back to Journal Archive
              </button>

              <TactileButton
                onClick={() => setShowHerbarium(true)}
                variant="primary"
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold uppercase tracking-wider min-h-[46px] shadow-journal"
              >
                <Download className="w-4 h-4 mr-2 text-terracotta" />
                Export Herbarium Plate (.PNG)
              </TactileButton>
            </div>
          </div>
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
