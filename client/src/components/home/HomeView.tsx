import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import {
  SpecimenArtwork,
  BotanicalCornerFoliage,
  BotanicalLeafSprig,
} from '../common/BotanicalIllustrations.js';
import { FieldCategory } from '../../types/index.js';
import {
  ArrowRight,
  Calendar,
} from 'lucide-react';

interface CategoryCardItem {
  id: FieldCategory;
  title: string;
  subtitle: string;
  description: string;
  categoryType: 'science' | 'community' | 'everyday';
}

const CATEGORIES: CategoryCardItem[] = [
  {
    id: 'science',
    title: 'School & Science',
    subtitle: 'Plant anatomy & venation',
    description: 'Plant anatomy, leaf venation, lichen symbiosis, and structural biomechanics.',
    categoryType: 'science',
  },
  {
    id: 'community',
    title: 'Community & Environment',
    subtitle: 'Trees & urban canopy',
    description: 'Trees, waterways, neighborhood micro-climates, and local ecosystems.',
    categoryType: 'community',
  },
  {
    id: 'everyday',
    title: 'Everyday Discovery',
    subtitle: 'Pavement & micro-habitats',
    description: 'Notice organisms, textures, patterns, and micro-habitats in pavement and stone.',
    categoryType: 'everyday',
  },
];

export const HomeView: React.FC = () => {
  const { state, updatePreferences, navigate, viewEntryDetail } = useFieldSession();

  const handleCategorySelect = (categoryId: FieldCategory) => {
    updatePreferences({ category: categoryId });
    navigate('setup');
  };

  const handleBeginInvestigation = () => {
    if (state.activeInvestigation) {
      navigate('reveal');
    } else {
      navigate('categories');
    }
  };

  // Up to 4 recent discoveries
  const recentEntries = state.journalEntries.slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-14 animate-journal-entry relative">
      {/* ============================================================ */}
      {/* 1. DESKTOP & TABLET HERO ( >= 768px )                        */}
      {/* Two-column split: Text (Left ~50%), Artwork (Right ~50%)     */}
      {/* ============================================================ */}
      <section className="hidden md:block">
        <div className="relative rounded-3xl border border-stone bg-paper-bright overflow-hidden shadow-journal-subtle">
          {/* Decorative botanical branch framing top-left inside card boundary */}
          <div className="absolute top-0 left-0 hidden md:block z-20 pointer-events-none">
            <BotanicalCornerFoliage position="top-left" className="w-16 h-16 xl:w-20 xl:h-20" />
          </div>

          {/* Top Half: 12-col split with Headline & Actions (Left) and Mountain Illustration (Right) */}
          <div className="grid grid-cols-12 items-center">
            {/* Left Column: Editorial Headline & Actions */}
            <div className="col-span-6 p-6 md:p-8 xl:p-12 flex flex-col justify-between z-10 relative">
              <div className="space-y-3.5 xl:space-y-4 relative z-10">
                <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-forest font-semibold">
                  <BotanicalLeafSprig className="w-4 h-4 text-forest" />
                  <span>Field Journal & Sensory Instrument</span>
                </div>

                <h1 className="font-serif text-3xl md:text-4xl lg:text-[44px] xl:text-5xl text-ink font-medium tracking-tight leading-[1.15]">
                  Step outside.
                  <br />
                  Notice more.
                  <br />
                  Understand deeper.
                </h1>

                <p className="font-sans text-xs md:text-sm xl:text-base text-ink-muted leading-relaxed max-w-md pt-1">
                  A physical-first field journal that makes itself unnecessary. Put your phone away and explore the world around you.
                </p>
              </div>

              <div className="pt-6 space-y-6 relative z-10">
                {/* Primary Action Button */}
                <div>
                  <button
                    type="button"
                    onClick={handleBeginInvestigation}
                    className="inline-flex items-center space-x-3 px-6 md:px-7 py-3 md:py-3.5 rounded-xl bg-forest hover:bg-forest-deep text-paper font-sans font-semibold text-sm tracking-wide shadow-journal transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span>Begin an Investigation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Three Naturalist Stat Counters */}
                <div className="relative pt-5 border-t border-stone-light/60">
                  <div className="relative z-10 grid grid-cols-3 gap-3 md:gap-4 xl:gap-6 divide-x divide-stone-light/60">
                    <div className="pr-2">
                      <div className="font-serif text-2xl xl:text-3xl font-medium text-ink">3</div>
                      <div className="font-mono text-[10px] xl:text-[11px] tracking-wider uppercase text-ink-muted mt-0.5">
                        Disciplines
                      </div>
                    </div>
                    <div className="px-2 md:px-3 xl:px-4">
                      <div className="font-serif text-2xl xl:text-3xl font-medium text-ink">10+</div>
                      <div className="font-mono text-[10px] xl:text-[11px] tracking-wider uppercase text-ink-muted mt-0.5">
                        Minutes Outdoors
                      </div>
                    </div>
                    <div className="pl-2 md:px-3 xl:pl-4">
                      <div className="font-serif text-2xl xl:text-3xl font-medium text-ink">∞</div>
                      <div className="font-mono text-[10px] xl:text-[11px] tracking-wider uppercase text-ink-muted mt-0.5">
                        Real Discoveries
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: High-Resolution Mountain Artwork with Zero Cropping */}
            <div className="col-span-6 p-3 md:p-4 lg:p-4 xl:p-5 flex items-center justify-center border-l border-stone/50 bg-[#FAF7F0] self-stretch">
              <img
                src="/images/hero-illustration.png"
                alt="Mountain peaks, evergreen forest, lake and sunrise illustration"
                className="w-full h-auto block select-none rounded-2xl shadow-journal-subtle border border-stone/40"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>

          {/* Bottom Row: 3 Wide Integrated Category Cards matching Reference */}
          <div className="border-t border-stone/70 bg-[#FAF7F0] p-4 md:p-6 xl:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 xl:gap-6">
              {CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleCategorySelect(cat.id);
                    }
                  }}
                  className="group rounded-2xl border border-stone bg-paper-bright p-4 md:p-5 hover:border-forest/60 hover:shadow-journal-subtle transition-all cursor-pointer flex items-center space-x-3.5 md:space-x-4"
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-stone-light/40 shrink-0 border border-stone/60">
                    {cat.id === 'science' ? (
                      <img src="/images/moss-on-stone.jpg" alt="Botanical Science" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : cat.id === 'community' ? (
                      <img src="/images/community-environment.jpg" alt="Community & Environment" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <img src="/images/ant-trails.jpg" alt="Everyday Discovery" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-sm md:text-base font-semibold text-ink group-hover:text-forest transition-colors truncate">
                      {cat.title}
                    </h3>
                    <p className="font-sans text-xs text-ink-muted line-clamp-2 mt-0.5 leading-snug">
                      {cat.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-ink-muted group-hover:text-forest group-hover:translate-x-1 transition-all shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. MOBILE HERO ( < 768px )                                   */}
      {/* ============================================================ */}
      <section className="block md:hidden space-y-5">
        {/* Mobile Illustrated Landscape Hero Card */}
        <div className="rounded-3xl border border-stone bg-paper-bright shadow-journal-subtle p-5 sm:p-7 space-y-5 relative">
          <div className="space-y-2.5">
            <div className="flex items-center space-x-2 text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
              <BotanicalLeafSprig className="w-3.5 h-3.5 text-forest" />
              <span>Field Journal & Sensory Instrument</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight leading-tight">
              Step outside.
              <br />
              Notice more.
              <br />
              Understand deeper.
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed">
              A physical-first field journal that makes itself unnecessary. Put your phone away and explore the world around you.
            </p>
          </div>

          <button
            type="button"
            onClick={handleBeginInvestigation}
            className="w-full py-3.5 px-5 rounded-xl bg-forest hover:bg-forest-deep text-paper font-sans font-semibold text-sm flex items-center justify-center space-x-2 shadow-journal transition-transform active:scale-[0.98]"
          >
            <span>Begin an Investigation</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Three Naturalist Stat Counters on Mobile */}
          <div className="pt-4 border-t border-stone-light/60">
            <div className="grid grid-cols-3 divide-x divide-stone-light/60 text-center">
              <div className="px-1.5">
                <div className="font-serif text-2xl font-medium text-ink">3</div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase text-ink-muted mt-0.5 leading-tight">
                  Disciplines
                </div>
              </div>
              <div className="px-1.5">
                <div className="font-serif text-2xl font-medium text-ink">10+</div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase text-ink-muted mt-0.5 leading-tight">
                  Minutes Outdoors
                </div>
              </div>
              <div className="px-1.5">
                <div className="font-serif text-2xl font-medium text-ink">∞</div>
                <div className="font-mono text-[9px] sm:text-[10px] uppercase text-ink-muted mt-0.5 leading-tight">
                  Real Discoveries
                </div>
              </div>
            </div>
          </div>

          {/* Illustrated Landscape Artwork Stacked Below Text */}
          <div className="w-full pt-1">
            <img
              src="/images/hero-illustration.png"
              alt="Mountain peaks, evergreen forest, lake and sunrise illustration"
              className="w-full h-auto block select-none rounded-2xl shadow-journal-subtle border border-stone/40"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. DISCIPLINE CARDS ("Choose a path" - Mobile)               */}
      {/* Reference Screen 1: 3-column compact horizontal grid          */}
      {/* ============================================================ */}
      <section className="block md:hidden space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-xl sm:text-2xl text-ink font-medium tracking-tight">
              Choose a path
            </h2>
            <p className="font-sans text-xs text-ink-muted">
              Select a sensory lens to formulate your fieldwork.
            </p>
          </div>
          <button
            onClick={() => navigate('categories')}
            className="text-xs font-mono uppercase tracking-wider text-forest hover:underline inline-flex items-center"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>

        {/* 3 Compact Columns Matching Reference Screen 1 */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCategorySelect(cat.id);
                }
              }}
              className="group rounded-2xl border border-stone bg-paper-bright p-3 sm:p-4 hover:border-forest/60 hover:shadow-journal-subtle transition-all cursor-pointer flex flex-col items-center text-center justify-between min-h-[140px]"
            >
              {/* Circular Specimen / Icon Artwork */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden bg-stone-light/40 border border-stone/70 shadow-sm shrink-0 flex items-center justify-center">
                {cat.id === 'science' ? (
                  <img src="/images/moss-on-stone.jpg" alt="Botanical Science" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : cat.id === 'community' ? (
                  <img src="/images/community-environment.jpg" alt="Community & Environment" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                ) : (
                  <img src="/images/ant-trails.jpg" alt="Everyday Discovery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                )}
              </div>

              {/* Title & Micro-Kicker */}
              <div className="mt-2 space-y-0.5">
                <h3 className="font-serif text-xs sm:text-sm font-semibold text-ink group-hover:text-forest transition-colors leading-tight line-clamp-2">
                  {cat.title}
                </h3>
              </div>

              <div className="mt-1 text-[10px] font-mono text-ink-muted group-hover:text-forest transition-colors flex items-center">
                <span>Start</span>
                <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. RECENT DISCOVERIES SECTION                                */}
      {/* ============================================================ */}
      {recentEntries.length > 0 && (
        <section className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                Recent Discoveries
              </h2>
              <span className="font-mono text-xs text-ink-muted">
                (2 of {state.journalEntries.length})
              </span>
            </div>
            <button
              onClick={() => navigate('archive')}
              className="text-xs font-mono uppercase tracking-wider text-forest hover:underline inline-flex items-center"
            >
              <span>View Journal</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>

          {/* Responsive Grid of Saved Discoveries (2 cols on mobile, 4 on desktop) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {recentEntries.map((entry) => {
              let specType = 'moss_on_stone';
              if (entry.observation.photoUri?.startsWith('specimen:')) {
                specType = entry.observation.photoUri.replace('specimen:', '');
              } else {
                const t = entry.investigation.title.toLowerCase();
                if (t.includes('moss')) specType = 'moss_on_stone';
                else if (t.includes('weather') || t.includes('shale') || (t.includes('stone') && !t.includes('moss')) || t.includes('rock')) specType = 'weathering';
                else if (t.includes('rain') || t.includes('water')) specType = 'rainwater_flow';
                else if (t.includes('lichen')) specType = 'lichen_crusts';
                else if (t.includes('ant')) specType = 'ant_trails';
                else if (t.includes('diurnal') || t.includes('movement')) specType = 'diurnal_leaves';
                else if (t.includes('leaf') || t.includes('vein')) specType = 'leaf_venation';
              }
              const isCustom = entry.observation.photoUri && !entry.observation.photoUri.startsWith('specimen:');
              const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });
              const durationMin = Math.round((entry.observation.actualDurationSeconds || 600) / 60) || 10;
              const seq = String(entry.investigation.sequenceNumber || 1).padStart(2, '0');

              return (
                <div
                  key={entry.id}
                  onClick={() => viewEntryDetail(entry)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      viewEntryDetail(entry);
                    }
                  }}
                  className="group rounded-3xl border border-stone bg-paper-bright overflow-hidden hover:border-forest/60 hover:shadow-journal transition-all cursor-pointer flex flex-col justify-between"
                >
                  {/* Thumbnail Image */}
                  <div className="aspect-[16/10] w-full overflow-hidden bg-stone-light/40 relative">
                    {isCustom ? (
                      <img
                        src={entry.observation.photoUri}
                        alt={entry.investigation.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <SpecimenArtwork type={specType} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                    <div className="absolute top-2.5 right-2.5 bg-paper-bright/95 backdrop-blur-sm border border-stone/60 rounded-md px-1.5 py-0.5 text-[10px] font-mono text-forest font-semibold shadow-sm">
                      {durationMin} min
                    </div>
                    <div className="absolute top-2.5 left-2.5 bg-paper-bright/95 backdrop-blur-sm border border-stone/60 rounded-md px-1.5 py-0.5 text-[10px] font-mono text-terracotta font-semibold shadow-sm">
                      Folio {seq}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 space-y-2">
                    <div>
                      <h3 className="font-serif text-base sm:text-lg font-medium text-ink group-hover:text-forest transition-colors line-clamp-1">
                        {entry.investigation.title}
                      </h3>
                      <p className="font-serif italic text-xs text-ink-muted line-clamp-2 mt-1 leading-relaxed">
                        “{entry.observation.rawNotes}”
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-light/50 flex items-center justify-between text-[11px] font-mono text-ink-muted">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1 text-moss" />
                        {dateStr}
                      </span>
                      <span className="text-forest font-semibold">
                        {entry.discovery?.fieldCategory || 'Botany'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
