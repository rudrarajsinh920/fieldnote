import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import {
  BotanicalHeroForest,
  BotanicalLeafSprig,
  BotanicalCategoryIllustration,
} from '../common/BotanicalIllustrations.js';
import { FieldCategory } from '../../types/index.js';
import { getCurrentMicroSeason } from '../../services/phenology-calendar.js';
import {
  Compass,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Calendar,
  History,
} from 'lucide-react';

interface CategoryCardItem {
  id: FieldCategory;
  title: string;
  discipline: string;
  summary: string;
  directiveExample: string;
  specimenCount: string;
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'science',
    title: 'School & Science',
    discipline: 'BOTANICAL VENATION & BIOLOGY',
    summary: 'Study cellular venation, photosynthetic angles, lichen symbiotic crusts, and structural biomechanics.',
    directiveExample: '“Trace how water channels divide through primary and secondary leaf veins.”',
    specimenCount: 'Discipline 01',
  },
  {
    id: 'community',
    title: 'Community & Environment',
    discipline: 'URBAN CANOPY & CORRIDORS',
    summary: 'Map shared neighborhood tree canopies, runoff watersheds, heat islands, and public pollinator paths.',
    directiveExample: '“Identify where the tree canopy breaks to let sunlight reach the lower soil strata.”',
    specimenCount: 'Discipline 02',
  },
  {
    id: 'everyday',
    title: 'Everyday Discovery',
    discipline: 'MICRO-LANDSCAPES & HABITATS',
    summary: 'Notice organisms colonizing sidewalk cracks, moisture beneath loose stones, and diurnal shadow drift.',
    directiveExample: '“Find three distinct textures of moss flourishing in the shaded pavement seam.”',
    specimenCount: 'Discipline 03',
  },
];

export const HomeView: React.FC = () => {
  const { state, updatePreferences, navigate, viewEntryDetail } = useFieldSession();
  const [showRitual, setShowRitual] = useState<boolean>(false);
  const [showPhenology, setShowPhenology] = useState<boolean>(false);
  const microSeason = getCurrentMicroSeason();

  const handleCategorySelect = (categoryId: FieldCategory) => {
    updatePreferences({ category: categoryId });
    navigate('setup');
  };

  const recentEntries = state.journalEntries.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 animate-journal-entry">
      {/* 1. EDITORIAL MASTHEAD */}
      <header className="text-center pt-2 sm:pt-4 space-y-4">
        {/* Top Folio Strip */}
        <div className="inline-flex items-center space-x-2.5 border-b border-stone-deep/40 pb-2 px-3">
          <BotanicalLeafSprig className="w-4 h-4 text-forest" />
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-ink-muted uppercase font-semibold">
            Field Journal & Sensory Instrument • Folio MMXXVI
          </span>
          <span className="text-terracotta text-xs">✦</span>
        </div>

        {/* Brand Headline */}
        <div className="space-y-2">
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-ink leading-none">
            FIELDNOTE
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-forest tracking-tight">
            “AI that teaches you to notice.”
          </p>
        </div>

        <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl mx-auto px-2">
          A physical-first field journal designed to make itself unnecessary. Formulate a sensory directive, put your phone in your pocket, and examine the physical earth.
        </p>

        {/* The 72 Micro-Seasons Dial (Phenology Clock) */}
        <div className="pt-2 max-w-xl mx-auto px-2">
          <div className="rounded-sm border border-stone-deep/60 bg-paper-bright/95 shadow-journal-subtle overflow-hidden">
            <button
              type="button"
              onClick={() => setShowPhenology(!showPhenology)}
              className="w-full flex items-center justify-between p-3.5 text-left hover:bg-stone-light/40 transition-colors min-h-[48px]"
            >
              <div className="flex items-center space-x-3">
                <span className="text-terracotta text-sm">✦</span>
                <div>
                  <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold block">
                    Solar Phenology • 72 Micro-Seasons
                  </span>
                  <span className="font-serif text-sm sm:text-base font-medium text-ink">
                    {microSeason.name}{' '}
                    <span className="font-serif italic text-xs text-ink-muted">
                      — {microSeason.subSeason} ({microSeason.poeticName})
                    </span>
                  </span>
                </div>
              </div>
              <span className="font-mono text-[11px] text-ink-muted">
                {showPhenology ? 'Hide' : 'Phenology Directive'} {showPhenology ? '▴' : '▾'}
              </span>
            </button>

            {showPhenology && (
              <div className="p-4 border-t border-stone-deep/30 bg-paper-deep/20 space-y-2 text-left animate-investigation-unfold">
                <p className="font-serif italic text-xs sm:text-sm text-ink leading-relaxed">
                  <strong>Atmospheric Shift:</strong> {microSeason.botanicalFocus}
                </p>
                <div className="p-2.5 rounded-[2px] bg-forest/5 border border-forest/20 text-xs font-sans text-forest">
                  <strong>Micro-Season Inquiry:</strong> “{microSeason.phenologyDirective}”
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 2. NATURE-INSPIRED HERO CARD (Reference 1 & 3: Teal-green forest artwork & clean ivory card) */}
      <section className="relative rounded-sm border border-stone-deep/60 bg-paper-bright overflow-hidden shadow-journal">
        {/* Layered Botanical Artwork */}
        <div className="relative border-b border-stone-deep/30">
          <BotanicalHeroForest className="w-full h-44 sm:h-64 lg:h-72" />
          {/* Subtle Overlay Badge */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-paper-bright border border-stone-deep/60 px-3 py-1 rounded-[2px] flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-botanical-teal animate-pulse" />
            <span className="font-mono text-[10px] sm:text-xs text-ink uppercase tracking-wider font-semibold">
              Live Observation Canopy
            </span>
          </div>

          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-forest text-paper px-3 py-1 rounded-[2px] font-mono text-[10px] sm:text-xs tracking-widest uppercase">
            On-Device Engine
          </div>
        </div>

        {/* Hero Content & Primary Call to Action */}
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-paper-bright">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs text-terracotta tracking-widest uppercase font-semibold">
                Field Directive
              </span>
              <span className="text-stone-deep">•</span>
              <span className="font-mono text-xs text-ink-muted">Silent Immersion</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-ink font-medium leading-snug">
              Step outside. Notice more. Understand deeper.
            </h2>
            <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
              FIELDNOTE is an AI that teaches you to notice. Put your phone away, step into the physical earth, make authentic sensory observations, and return to reflect.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
            <TactileButton
              onClick={() => navigate('categories')}
              variant="primary"
              className="px-8 py-4 text-base font-semibold shadow-journal min-h-[52px]"
            >
              <Compass className="w-4 h-4 mr-2" />
              Begin an Investigation
              <ArrowRight className="w-4 h-4 ml-2" />
            </TactileButton>

            <TactileButton
              onClick={() => navigate('archive')}
              variant="secondary"
              className="px-6 py-3.5 text-sm min-h-[46px]"
            >
              <BookOpen className="w-4 h-4 mr-2 text-moss" />
              Open Field Journal ({state.journalEntries.length})
            </TactileButton>
          </div>
        </div>

        {/* Grounding Trust Strip */}
        <div className="border-t border-stone-deep/20 px-6 py-3 bg-stone-light/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-ink-muted">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-forest" />
            <span className="font-semibold text-forest">Private Naturalist Engine</span>
            <span>• 100% On-Device Persistence</span>
          </div>
          <div className="flex items-center space-x-3 text-[11px] text-ink-faint">
            <span>Offline Ready</span>
            <span>• Zero Cloud Dependency</span>
            <span>• No GPS Tracking</span>
          </div>
        </div>
      </section>

      {/* 3. FOUR BOTANICAL DISCIPLINE CATEGORIES (Including Built vs. Wild) */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone/80 pb-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-terracotta text-sm">✦</span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted font-semibold">
                Core Disciplines
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
              Select an Observation Discipline
            </h2>
          </div>
          <p className="font-serif italic text-xs sm:text-sm text-ink-muted">
            Choose a sensory lens to formulate your field directive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => {
            const isSelected = state.preferences.category === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={`group cursor-pointer rounded-sm border transition-all duration-200 flex flex-col justify-between bg-paper-bright overflow-hidden shadow-journal-subtle hover:shadow-journal hover:-translate-y-0.5 active:translate-y-0 ${
                  isSelected
                    ? 'border-forest ring-1 ring-forest/40'
                    : 'border-stone-deep/50 hover:border-botanical-teal/60'
                }`}
              >
                {/* Visual Category Illustration */}
                <div className="relative border-b border-stone-deep/30 bg-paper overflow-hidden">
                  <BotanicalCategoryIllustration
                    category={cat.id}
                    className="w-full h-36 transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 rounded-[2px] bg-paper-bright/90 border border-stone-deep/50 font-mono text-[9px] uppercase tracking-wider text-ink-muted font-semibold">
                      {cat.specimenCount}
                    </span>
                  </div>
                </div>

                {/* Card Editorial Body */}
                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold block">
                      {cat.discipline}
                    </span>
                    <h3 className="font-serif text-xl text-ink font-medium group-hover:text-forest transition-colors">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-xs text-ink-muted leading-relaxed">
                      {cat.summary}
                    </p>
                  </div>

                  {/* Specimen Directive Example */}
                  <div className="pt-2 border-t border-stone-deep/20 space-y-2">
                    <p className="font-serif italic text-[11px] text-ink-muted/80 leading-snug">
                      {cat.directiveExample}
                    </p>
                    <div className="flex items-center justify-between text-xs font-mono pt-1 text-forest group-hover:text-botanical-teal transition-colors">
                      <span className="font-semibold uppercase tracking-wider">
                        Explore Directive
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. SAVED DISCOVERIES / RECENT SPECIMEN FOLIOS (Reference 3: Nature-learning cards without SaaS clutter) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-stone/80 pb-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-terracotta text-sm">🌿</span>
              <span className="font-mono text-xs uppercase tracking-widest text-ink-muted font-semibold">
                Archival Folios
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
              Saved Field Discoveries
            </h2>
          </div>
          <button
            onClick={() => navigate('archive')}
            className="text-xs font-mono text-forest hover:text-botanical-teal transition-colors uppercase tracking-wider inline-flex items-center"
          >
            View Complete Logbook ({state.journalEntries.length}) →
          </button>
        </div>

        {recentEntries.length > 0 && (
          <div className="p-4 sm:p-5 rounded-sm border border-moss/40 bg-moss/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-start sm:items-center space-x-3">
              <span className="p-2 rounded bg-paper-bright text-forest border border-moss/30 shrink-0">
                <History className="w-4 h-4" />
              </span>
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] tracking-widest uppercase text-forest font-semibold block">
                  Slow Ecological Time • Comparative Revisit
                </span>
                <p className="font-serif italic text-ink text-sm">
                  “Folio No. {String(recentEntries[0].investigation.sequenceNumber).padStart(3, '0')} ({recentEntries[0].investigation.title}): Return to this exact spot to notice what has weathered or sprouted.”
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                updatePreferences({ category: 'edge' });
                navigate('setup');
              }}
              className="px-4 py-2 rounded-[2px] bg-forest text-paper font-mono uppercase tracking-wider text-[11px] shrink-0 font-semibold hover:bg-forest-deep transition-colors min-h-[36px]"
            >
              Revisit Spot →
            </button>
          </div>
        )}

        {recentEntries.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentEntries.map((entry) => {
              const entryDate = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });

              return (
                <article
                  key={entry.id}
                  onClick={() => viewEntryDetail(entry)}
                  className="p-5 rounded-sm border border-stone-deep/50 bg-paper-bright shadow-journal-subtle hover:shadow-journal hover:border-forest/60 transition-all cursor-pointer space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold">
                        NOTE NO. {String(entry.investigation.sequenceNumber).padStart(3, '0')}
                      </span>
                      <span className="font-mono text-[10px] text-ink-faint flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-moss" />
                        {entryDate}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg text-ink font-medium leading-snug line-clamp-1">
                      {entry.investigation.title}
                    </h3>

                    <p className="font-serif italic text-xs text-ink-muted line-clamp-2 leading-relaxed">
                      “{entry.observation.rawNotes}”
                    </p>
                  </div>

                  {entry.observation.photoUri && (
                    <div className="rounded-[2px] overflow-hidden border border-stone-deep/30 h-24">
                      <img
                        src={entry.observation.photoUri}
                        alt="Specimen record"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="pt-2 border-t border-stone-deep/20 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                    <span className="text-forest font-semibold">
                      ✦ {entry.discovery?.fieldCategory || 'Specimen Sealed'}
                    </span>
                    <span className="text-ink-faint">Inspect →</span>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Preview Discoveries for new users (educational field discovery specimens) */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                specimen: 'Hydromorphology of Limestone',
                category: 'SCHOOL & SCIENCE',
                notes: '“Rainwater pooling on the limestone ridge carved microscopic fissures that shelter micro-crusts.”',
                status: 'Awaiting Your First Fieldwork',
              },
              {
                specimen: 'Cryptogamic Lichen Crusts',
                category: 'COMMUNITY & ENVIRONMENT',
                notes: '“Gray-green foliose lichen anchoring to sidewalk aggregate, resilient to urban automotive exhaust.”',
                status: 'Awaiting Your First Fieldwork',
              },
              {
                specimen: 'Diurnal Shadow & Cotyledons',
                category: 'EVERYDAY DISCOVERY',
                notes: '“Sprouting dandelion roots wedging open pavement joints following morning condensation.”',
                status: 'Awaiting Your First Fieldwork',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-sm border border-stone-deep/40 bg-paper-bright/70 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-stone-deep/20 pb-2">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold">
                      SPECIMEN PREVIEW 0{idx + 1}
                    </span>
                    <span className="font-mono text-[10px] text-ink-faint">Exemplar</span>
                  </div>
                  <h3 className="font-serif text-lg text-ink font-medium leading-snug">
                    {item.specimen}
                  </h3>
                  <p className="font-serif italic text-xs text-ink-muted leading-relaxed">
                    {item.notes}
                  </p>
                </div>
                <div className="pt-2 border-t border-stone-deep/20 flex items-center justify-between text-[10px] font-mono text-ink-faint">
                  <span className="text-forest font-semibold">{item.category}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. PROGRESSIVE DISCLOSURE: THE OBSERVATION RITUAL */}
      <section className="journal-page p-6 sm:p-8 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal-subtle">
        <button
          onClick={() => setShowRitual(!showRitual)}
          className="w-full flex items-center justify-between text-left focus-visible:outline-offset-2 min-h-[44px]"
          aria-expanded={showRitual}
        >
          <div className="flex items-center space-x-2.5">
            <BotanicalLeafSprig className="w-4 h-4 text-forest" />
            <span className="font-mono text-xs tracking-widest uppercase text-terracotta font-semibold">
              The Naturalist Ritual
            </span>
            <span className="text-[11px] font-serif italic text-ink-muted hidden sm:inline">
              — The 6 steps of noticing
            </span>
          </div>
          <span className="text-xs font-mono text-ink-muted flex items-center">
            {showRitual ? 'Fold ritual' : 'Unfold loop'}
            {showRitual ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1 text-ink-muted" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-ink-muted" />
            )}
          </span>
        </button>

        {showRitual && (
          <div className="pt-6 mt-4 border-t border-stone-deep/30 space-y-5 animate-investigation-unfold">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-left">
              {[
                { step: '01', label: 'PREPARE', desc: 'Choose a sensory discipline and observation window.' },
                { step: '02', label: 'DIRECTIVE', desc: 'Read your botanical inquiry prompt and step outside.' },
                { step: '03', label: 'OBSERVE', desc: 'Put the phone in your pocket. Feel texture, light, and soil.' },
                { step: '04', label: 'RETURN', desc: 'Inscribe raw notes and optional deferred media.' },
                { step: '05', label: 'REFLECT', desc: 'Local AI synthesizes ecological dynamics without hallucination.' },
                { step: '06', label: 'SEAL', desc: 'Stamp the field note permanently into your private logbook.' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-3.5 rounded-[2px] bg-paper border border-stone-deep/30 flex flex-col justify-between"
                >
                  <span className="font-mono text-[10px] text-terracotta font-bold">
                    {item.step}
                  </span>
                  <strong className="font-sans text-xs tracking-wider text-ink block mt-1">
                    {item.label}
                  </strong>
                  <span className="font-serif italic text-xs text-ink-muted mt-1 leading-snug">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>

            <p className="text-center font-serif italic text-xs text-ink-muted pt-3 border-t border-stone/50">
              “The deeper you notice with your senses, the less you need a screen.”
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
