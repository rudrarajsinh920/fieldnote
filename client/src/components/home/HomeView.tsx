import React, { useState } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { ArrowRight, BookOpen, Compass, ShieldCheck, WifiOff, MapPinOff, ChevronDown, ChevronUp } from 'lucide-react';

export const HomeView: React.FC = () => {
  const { navigate } = useFieldSession();
  const [showRitual, setShowRitual] = useState(false);

  return (
    <div className="space-y-10 sm:space-y-14 animate-journal-entry">
      {/* Top Editorial Crest */}
      <section className="text-center pt-2 sm:pt-6 space-y-6">
        <div className="inline-flex items-center space-x-2 border-b border-stone-deep/40 pb-2">
          <span className="text-terracotta text-sm select-none">🌿</span>
          <span className="font-mono text-[11px] sm:text-xs tracking-[0.25em] text-ink-muted uppercase">
            Field Instrument • Hacktoberfest 2026
          </span>
        </div>

        {/* Brand Title */}
        <div className="space-y-2">
          <h1 className="font-serif text-5xl sm:text-7xl font-medium tracking-tight text-ink leading-none">
            FIELDNOTE
          </h1>
          <p className="font-serif italic text-xl sm:text-2xl text-forest tracking-tight">
            “AI that teaches you to notice.”
          </p>
        </div>

        {/* Tactile Concentric Botanical Graphic (Engraved Instrument) */}
        <div className="relative py-4 sm:py-6 flex items-center justify-center">
          <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-full border border-stone-deep/60 flex items-center justify-center relative bg-paper-bright/40 shadow-journal-subtle">
            {/* Concentric rings of observation */}
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full border border-dashed border-moss/40 flex items-center justify-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-stone-deep/80 flex items-center justify-center bg-paper-bright shadow-journal-subtle">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-forest/30 flex items-center justify-center bg-forest/5">
                  <span className="text-terracotta text-base sm:text-lg select-none">✦</span>
                </div>
              </div>
            </div>
            {/* Cardinal marks */}
            <span className="absolute top-2 font-mono text-[10px] text-ink-faint tracking-widest select-none">N</span>
            <span className="absolute bottom-2 font-mono text-[10px] text-ink-faint tracking-widest select-none">S</span>
            <span className="absolute left-2 font-mono text-[10px] text-ink-faint tracking-widest select-none">W</span>
            <span className="absolute right-2 font-mono text-[10px] text-ink-faint tracking-widest select-none">E</span>
          </div>
        </div>

        {/* Purpose Statement */}
        <div className="max-w-lg mx-auto space-y-3 px-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-ink leading-snug">
            NOTICE
            <span className="block font-serif italic text-ink-muted font-normal text-xl sm:text-2xl">
              the world around you.
            </span>
          </h2>
          <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            A field journal designed to make itself unnecessary. It generates micro-investigations that guide you to look closely, put your phone away, and touch the physical earth.
          </p>
        </div>

        {/* Primary Call to Action */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <TactileButton
            onClick={() => navigate('setup')}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold"
          >
            <Compass className="w-4 h-4 mr-2" />
            Begin Investigation
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>

          <TactileButton
            onClick={() => navigate('archive')}
            variant="secondary"
            className="w-full sm:w-auto px-6 py-3.5 text-base"
          >
            <BookOpen className="w-4 h-4 mr-2 text-moss" />
            Open Field Journal
          </TactileButton>
        </div>

        {/* Grounding Pillars */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 text-xs font-mono text-ink-muted">
          <span className="inline-flex items-center px-2.5 py-1 rounded-[2px] bg-forest/10 border border-forest/30 font-semibold text-forest">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-forest" />
            Gemini & On-Device AI
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-[2px] bg-stone-light/60 border border-stone-deep/40">
            <WifiOff className="w-3.5 h-3.5 mr-1.5 text-terracotta" />
            100% On-Device
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-[2px] bg-stone-light/60 border border-stone-deep/40">
            <MapPinOff className="w-3.5 h-3.5 mr-1.5 text-moss" />
            No GPS Required
          </span>
        </div>
      </section>

      {/* Progressive Disclosure: The Naturalist Ritual */}
      <section className="journal-page p-5 sm:p-7 border border-stone-deep/40 rounded-sm bg-paper-bright">
        <button
          onClick={() => setShowRitual(!showRitual)}
          className="w-full flex items-center justify-between text-left focus-visible:outline-offset-2"
          aria-expanded={showRitual}
        >
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs tracking-widest uppercase text-terracotta font-semibold">
              The Observation Ritual
            </span>
            <span className="text-[11px] font-serif italic text-ink-muted hidden sm:inline">
              — How FIELDNOTE works
            </span>
          </div>
          <span className="text-xs font-mono text-ink-muted flex items-center">
            {showRitual ? 'Hide' : 'View loop'}
            {showRitual ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1 text-ink-muted" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1 text-ink-muted" />
            )}
          </span>
        </button>

        {showRitual && (
          <div className="pt-5 mt-4 border-t border-stone-deep/30 space-y-4 animate-investigation-unfold">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left">
              {[
                { step: '01', label: 'PREPARE', desc: 'Choose a time and sensory focus.' },
                { step: '02', label: 'STEP OUT', desc: 'Read your directive and step outside.' },
                { step: '03', label: 'OBSERVE', desc: 'Put phone in pocket. Observe with eyes and hands.' },
                { step: '04', label: 'RETURN', desc: 'Log what your senses collected.' },
                { step: '05', label: 'REFLECT', desc: 'Local AI synthesizes ecological dynamics.' },
                { step: '06', label: 'DISCOVER', desc: 'Seal the field note into your permanent logbook.' },
              ].map((item) => (
                <div
                  key={item.step}
                  className="p-3 rounded-[2px] bg-paper border border-stone-deep/30 flex flex-col justify-between"
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

            <p className="text-center font-serif italic text-xs text-ink-muted pt-2 border-t border-stone/50">
              “The better you use FIELDNOTE, the less you need to look at your phone.”
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
