import React from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { EditorialBadge } from '../common/EditorialBadge.js';
import { Compass, Calendar, Pocket, ArrowLeft, ShieldCheck } from 'lucide-react';

export const JournalArchive: React.FC = () => {
  const { state, navigate } = useFieldSession();
  const { journalEntries } = state;

  return (
    <div className="space-y-8 animate-journal-entry max-w-2xl mx-auto">
      {/* Archive Header */}
      <section className="journal-page p-5 sm:p-8 border border-stone-deep/40 rounded-sm bg-paper-bright flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-journal">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-terracotta text-sm">🌿</span>
            <span className="font-mono text-xs tracking-widest text-ink-faint uppercase font-semibold">
              Field Archive • {journalEntries.length} {journalEntries.length === 1 ? 'Entry' : 'Entries'}
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-ink font-medium tracking-tight">
            The Naturalist's Logbook
          </h1>
          <p className="font-serif italic text-sm text-ink-muted">
            Chronological impressions and synthesized physical dynamics.
          </p>
        </div>

        <div className="flex items-center">
          <TactileButton
            onClick={() => navigate('setup')}
            variant="primary"
            className="w-full sm:w-auto px-6 min-h-[44px] text-sm"
          >
            <Compass className="w-4 h-4 mr-2" />
            New Investigation
          </TactileButton>
        </div>
      </section>

      {/* Empty State */}
      {journalEntries.length === 0 ? (
        <div className="journal-page p-8 sm:p-14 text-center border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full border border-stone-deep/60 flex items-center justify-center text-moss bg-paper-deep/40">
            <span className="font-serif text-2xl italic select-none">🌿</span>
          </div>
          <div className="space-y-2">
            <span className="font-mono text-xs tracking-widest text-ink-faint uppercase font-medium block">
              Folio Open • Uninscribed
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              The Logbook Lies Open
            </h2>
            <p className="font-serif italic text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
              No field notes have been inscribed yet. Step outside, allow your phone to rest in your pocket, and gather your first physical observation.
            </p>
          </div>
          <div className="pt-2">
            <TactileButton
              onClick={() => navigate('setup')}
              variant="primary"
              className="min-h-[44px] px-6 text-sm"
            >
              <Compass className="w-4 h-4 mr-2" />
              Begin First Investigation
            </TactileButton>
          </div>
        </div>
      ) : (
        /* Vertical Journal Flow (Collectible Field Notes) */
        <div className="space-y-8">
          {journalEntries.map((entry) => {
            const dateStr = new Date(entry.createdAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <article
                key={entry.id}
                className="journal-page p-5 sm:p-8 md:p-10 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal space-y-6"
              >
                {/* 1. Header: FIELD NOTE NO. 00X & Date */}
                <div className="border-b border-stone/80 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-terracotta text-xs">✦</span>
                    <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
                      FIELD NOTE NO. {String(entry.investigation.sequenceNumber).padStart(3, '0')}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs font-mono text-ink-muted">
                    <Calendar className="w-3.5 h-3.5 text-moss" />
                    <span>{dateStr}</span>
                    {entry.observation.actualDurationSeconds > 0 && (
                      <>
                        <span className="text-stone-deep font-mono">•</span>
                        <span className="text-moss flex items-center">
                          <Pocket className="w-3.5 h-3.5 mr-1 text-terracotta" />
                          {entry.observation.actualDurationSeconds}s notice
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* 2. Title & Directive */}
                <div className="space-y-2">
                  <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium tracking-tight">
                    {entry.investigation.title}
                  </h2>
                  <div className="border-l-2 border-stone-deep/60 pl-3 py-1 bg-paper-deep/20 rounded-r-sm">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint block">
                      Directive
                    </span>
                    <p className="font-serif italic text-sm text-ink-muted leading-relaxed">
                      “{entry.investigation.prompt}”
                    </p>
                  </div>
                </div>

                {/* 3. Observation */}
                <section className="space-y-2 border-l-2 border-forest pl-4 bg-paper-deep/25 py-2.5 rounded-r-sm">
                  <span className="font-mono text-[11px] tracking-widest uppercase text-forest font-semibold block">
                    Observation
                  </span>
                  <p className="font-serif text-base sm:text-lg text-ink leading-relaxed italic">
                    “{entry.observation.rawNotes}”
                  </p>

                  {/* Photo Thumbnail if attached */}
                  {entry.observation.photoUri && (
                    <div className="pt-2">
                      <div className="inline-block border border-stone-deep/60 p-1 bg-paper rounded-[2px] shadow-sm">
                        <img
                          src={entry.observation.photoUri}
                          alt="Field record specimen"
                          className="w-48 h-32 object-cover rounded-[2px]"
                        />
                      </div>
                    </div>
                  )}

                  {/* Audio note if recorded */}
                  {entry.observation.audioUri && (
                    <div className="pt-2">
                      <audio controls src={entry.observation.audioUri} className="h-8 max-w-xs" />
                    </div>
                  )}
                </section>

                {/* 4. Reflection */}
                <section className="space-y-1.5 border-l-2 border-moss pl-4 py-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] tracking-widest uppercase text-moss font-semibold block">
                      Reflection
                    </span>
                    <span className="text-[10px] font-mono text-ink-faint uppercase tracking-wider">
                      (Probabilistic)
                    </span>
                  </div>
                  <p className="font-serif text-sm sm:text-base text-ink-muted leading-relaxed">
                    {entry.reflection.syntheticInsight}
                  </p>
                </section>

                {/* 5. Discovery */}
                <section className="p-3.5 rounded-[2px] bg-stone-light/50 border border-stone-deep/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] tracking-widest uppercase text-ink-faint block">
                      Discovery
                    </span>
                    <span className="font-serif text-base font-semibold text-forest block">
                      ✦ {entry.discovery.fieldCategory}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {entry.reflection.curiosityTags.map((tag) => (
                      <EditorialBadge key={tag} label={`#${tag}`} variant="stone" />
                    ))}
                  </div>
                </section>

                {/* 6. Question to Carry */}
                <section className="space-y-1 border-l-2 border-terracotta pl-4 bg-terracotta/5 py-2.5 rounded-r-sm">
                  <span className="font-mono text-[10px] tracking-widest uppercase text-terracotta font-semibold block">
                    Question to Carry
                  </span>
                  <p className="font-serif italic text-base text-ink font-medium leading-relaxed">
                    “{entry.reflection.deepeningQuestion}”
                  </p>
                </section>

                {/* Bottom Provenance */}
                <div className="pt-2 border-t border-stone-deep/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 text-[11px] font-mono text-ink-faint">
                  <span className="flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1 text-moss" />
                    {entry.reflection.modelMetadata?.provider === 'gemini-cloud'
                      ? 'Google Gemini AI (Cloud)'
                      : entry.reflection.modelMetadata?.provider === 'ollama'
                      ? `Local AI • ${entry.reflection.modelMetadata?.modelName || 'llama3.2:3b'}`
                      : 'Naturalist AI Engine'}
                  </span>
                  <span>Inscribed in SQLite Logbook</span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Back button */}
      <div className="text-center pt-4">
        <button
          onClick={() => navigate('home')}
          className="min-h-[44px] px-4 inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Return to Home
        </button>
      </div>
    </div>
  );
};
