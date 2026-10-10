import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { FieldCategory } from '../../types/index.js';
import {
  BotanicalLeafSprig,
  BotanicalCornerFoliage,
  BotanicalCategoryIllustration,
  BotanicalElementsDecor,
} from '../common/BotanicalIllustrations.js';
import { ArrowLeft, ArrowRight, Dices } from 'lucide-react';

interface CategoryOption {
  id: FieldCategory;
  numberBadge: string;
  title: string;
  subtitle: string;
  description: string;
  imageSrc?: string;
  categoryType: 'science' | 'community' | 'everyday';
}

export const CategorySelectionView: React.FC = () => {
  const { navigate, updatePreferences } = useFieldSession();

  const categories: CategoryOption[] = [
    {
      id: 'science',
      numberBadge: '01',
      title: 'Botanical Science',
      subtitle: 'Plant anatomy & venation',
      description: 'Plant anatomy, leaf venation, lichen symbiosis, and structural biomechanics.',
      imageSrc: '/images/moss-on-stone.jpg',
      categoryType: 'science',
    },
    {
      id: 'community',
      numberBadge: '02',
      title: 'Community & Environment',
      subtitle: 'Trees & urban canopy',
      description: 'Trees, waterways, neighborhood micro-climates, and local ecosystems.',
      imageSrc: '/images/community-environment.jpg',
      categoryType: 'community',
    },
    {
      id: 'everyday',
      numberBadge: '03',
      title: 'Everyday Discovery',
      subtitle: 'Pavement & micro-habitats',
      description: 'Notice organisms, textures, patterns, and micro-habitats in pavement and stone.',
      imageSrc: '/images/ant-trails.jpg',
      categoryType: 'everyday',
    },
  ];

  const handleSelectCategory = (cat: FieldCategory) => {
    updatePreferences({ category: cat });
    navigate('setup');
  };

  const handleSurpriseMe = () => {
    const list: FieldCategory[] = ['science', 'community', 'everyday'];
    const randomCat = list[Math.floor(Math.random() * list.length)];
    const intentions = ['notice', 'explore', 'understand', 'create'] as const;
    const randomIntention = intentions[Math.floor(Math.random() * intentions.length)];
    updatePreferences({
      category: randomCat,
      intention: randomIntention,
    });
    navigate('setup');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-16 relative">
      {/* Subtle Botanical Elements Background Watermark */}
      <div className="absolute -top-12 -right-8 pointer-events-none z-0 hidden sm:block opacity-15">
        <BotanicalElementsDecor className="w-56 h-auto" />
      </div>

      {/* Botanical Corner Foliage in bottom-right */}
      <div className="absolute -bottom-8 -right-8 pointer-events-none z-10 hidden sm:block">
        <BotanicalCornerFoliage position="bottom-right" className="w-36 h-36 opacity-85" />
      </div>

      {/* Top Header Bar */}
      <div className="flex items-center justify-between relative z-10">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px]"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Home
        </button>
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-5 h-5 text-forest opacity-80" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
            Sensory Lenses
          </span>
        </div>
      </div>

      {/* Screen Title */}
      <div className="space-y-1.5 text-center sm:text-left relative z-10">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Choose a Discipline
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-muted">
          Select a sensory lens to frame your fieldwork.
        </p>
      </div>

      {/* Illustrated Discipline Cards List (Reference Screen 2) */}
      <div className="space-y-4 pt-1 relative z-10">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => handleSelectCategory(cat.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleSelectCategory(cat.id);
              }
            }}
            className="group p-4 sm:p-5 rounded-3xl border border-stone bg-paper-bright hover:border-forest/70 hover:shadow-journal transition-all cursor-pointer flex items-center gap-4 sm:gap-5"
          >
            {/* Left Illustrated Artwork Thumbnail */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-stone-light/40 border border-stone/70 shadow-sm shrink-0 flex items-center justify-center relative">
              {cat.imageSrc ? (
                <img
                  src={cat.imageSrc}
                  alt={cat.title}
                  className="w-full h-full object-cover select-none scale-[1.08] group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <BotanicalCategoryIllustration
                  category={cat.categoryType}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>

            {/* Middle Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-forest font-semibold">
                  Discipline {cat.numberBadge}
                </span>
                <span className="hidden sm:inline-block text-[10px] font-mono text-ink-muted uppercase">
                  {cat.subtitle}
                </span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-ink group-hover:text-forest transition-colors leading-tight">
                {cat.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            {/* Right Arrow */}
            <div className="shrink-0 p-2 text-ink-muted group-hover:text-forest group-hover:translate-x-1 transition-all">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        ))}

        {/* Surprise Me Card (Reference Screen 2) */}
        <div
          onClick={handleSurpriseMe}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleSurpriseMe();
            }
          }}
          className="group p-4 sm:p-5 rounded-3xl border border-dashed border-stone-dark/40 bg-[#FAF7F0] hover:border-terracotta/70 hover:shadow-journal-subtle transition-all cursor-pointer flex items-center gap-4 sm:gap-5"
        >
          {/* Terracotta Dice Box */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#FDF6F0] border border-terracotta/30 flex items-center justify-center shrink-0 text-terracotta group-hover:scale-105 transition-transform">
            <Dices className="w-8 h-8 text-terracotta" />
          </div>

          <div className="flex-1 min-w-0 space-y-1">
            <div className="text-[11px] font-mono uppercase tracking-wider text-terracotta font-semibold">
              Surprise Directive
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-medium text-ink group-hover:text-terracotta transition-colors leading-tight">
              Surprise Me
            </h2>
            <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed">
              A random directive tailored to your surroundings.
            </p>
          </div>

          <div className="shrink-0 p-2 text-ink-muted group-hover:text-terracotta group-hover:translate-x-1 transition-all">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </div>
  );
};
