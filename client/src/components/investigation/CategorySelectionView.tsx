import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { FieldCategory } from '../../types/index.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import { ArrowLeft, Dices, ArrowRight } from 'lucide-react';

interface CategoryOption {
  id: FieldCategory;
  num: string;
  title: string;
  description: string;
  iconBg: string;
  borderColor: string;
  accentColor: string;
  svgType: 'science' | 'community' | 'everyday';
}

export const CategorySelectionView: React.FC = () => {
  const { navigate, updatePreferences } = useFieldSession();

  const categories: CategoryOption[] = [
    {
      id: 'science',
      num: '01',
      title: 'Botanical Science',
      description: 'Plant anatomy, leaf venation, lichen symbiosis, and micro-physics.',
      iconBg: 'bg-[#2F8175]/10',
      borderColor: 'border-[#2F8175]/40',
      accentColor: '#2F8175',
      svgType: 'science',
    },
    {
      id: 'community',
      num: '02',
      title: 'Community & Environment',
      description: 'Map tree canopy, runoff channels, shade lines and local ecosystems.',
      iconBg: 'bg-[#12372A]/10',
      borderColor: 'border-[#12372A]/40',
      accentColor: '#12372A',
      svgType: 'community',
    },
    {
      id: 'everyday',
      num: '03',
      title: 'Everyday Discovery',
      description: 'Notice organisms, textures, patterns and micro-habitats.',
      iconBg: 'bg-[#C96B4B]/10',
      borderColor: 'border-[#C96B4B]/40',
      accentColor: '#C96B4B',
      svgType: 'everyday',
    },
  ];

  const handleSelectCategory = (cat: FieldCategory) => {
    updatePreferences({ category: cat });
    navigate('setup');
  };

  const handleSurpriseMe = () => {
    const list: FieldCategory[] = ['science', 'community', 'everyday', 'edge'];
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
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-12">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('home')}
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px] min-w-[44px]"
          aria-label="Back to home"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back
        </button>
        <BotanicalLeafSprig className="w-6 h-6 text-forest opacity-80" />
      </div>

      {/* Screen Title */}
      <div className="text-center space-y-2 pt-2">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Choose a Discipline
        </h1>
        <p className="font-serif italic text-sm sm:text-base text-ink-muted max-w-md mx-auto">
          Select a sensory lens to formulate your field directive.
        </p>
      </div>

      {/* Category Cards List */}
      <div className="space-y-4 pt-2">
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
            className="group p-5 sm:p-6 rounded-sm border border-stone-deep/60 bg-paper-bright hover:border-forest/70 hover:shadow-journal-subtle transition-all cursor-pointer flex items-center justify-between gap-4"
          >
            {/* Left Botanical Thumbnail */}
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[2px] ${cat.iconBg} border ${cat.borderColor} flex items-center justify-center shrink-0 p-2 group-hover:scale-105 transition-transform`}
            >
              <BotanicalLeafSprig
                className="w-10 h-10"
                color={cat.accentColor}
                accent={cat.accentColor === '#C96B4B' ? '#12372A' : '#C96B4B'}
              />
            </div>

            {/* Middle Content */}
            <div className="flex-1 min-w-0 space-y-1">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-ink group-hover:text-forest transition-colors leading-tight">
                {cat.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-ink-muted leading-relaxed line-clamp-2">
                {cat.description}
              </p>
            </div>

            {/* Right Badge / Arrow */}
            <div className="flex flex-col items-end justify-between self-stretch shrink-0">
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-[2px] bg-stone-light/70 text-ink-muted border border-stone-deep/40">
                {cat.num}
              </span>
              <span className="text-forest opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Surprise Me Card */}
      <div className="pt-2">
        <div className="text-center pb-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-ink-muted">
            Not sure? Try a surprise mission
          </span>
        </div>

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
          className="group p-5 rounded-sm border border-terracotta/40 bg-[#FAF4ED] hover:border-terracotta hover:shadow-journal-subtle transition-all cursor-pointer flex items-center justify-between gap-4"
        >
          <div className="w-12 h-12 rounded-[2px] bg-terracotta/10 border border-terracotta/30 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <Dices className="w-6 h-6 text-terracotta" />
          </div>

          <div className="flex-1 min-w-0 space-y-0.5">
            <h3 className="font-serif text-lg font-medium text-ink group-hover:text-terracotta transition-colors">
              Surprise Me
            </h3>
            <p className="font-sans text-xs text-ink-muted">
              A random directive tailored to your surroundings.
            </p>
          </div>

          <ArrowRight className="w-5 h-5 text-terracotta shrink-0 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
