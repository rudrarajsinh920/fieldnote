import React, { useState, useRef } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { Camera, Mic, Square, Trash2, ArrowRight, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

export const ReturnView: React.FC = () => {
  const {
    state,
    submitObservationAndReflect,
    dismissAiError,
    enterField,
  } = useFieldSession();
  const { activeInvestigation, isGenerating, screenAwaySeconds } = state;

  const [rawNotes, setRawNotes] = useState('');
  const [visualDetail, setVisualDetail] = useState('');
  const [tactileDetail, setTactileDetail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [audioUri, setAudioUri] = useState<string | undefined>(undefined);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  if (!activeInvestigation) {
    return null;
  }

  // Handle Photo File Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUri(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Voice Note Recording using MediaRecorder API
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = (event) => {
          setAudioUri(event.target?.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch {
      alert('Microphone access unavailable or declined.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !rawNotes.trim()) return;

    await submitObservationAndReflect(
      rawNotes.trim(),
      {
        visual: visualDetail.trim() || undefined,
        tactile: tactileDetail.trim() || undefined,
      },
      photoUri,
      audioUri
    );
  };

  return (
    <article className="journal-page p-6 sm:p-10 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-journal-entry space-y-7 sm:space-y-8">
      {/* Header */}
      <div className="border-b border-stone/80 pb-4 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widest text-terracotta uppercase">
          Field Return • Inv NO. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
        </span>
        {screenAwaySeconds > 0 && (
          <span className="font-mono text-xs text-moss">
            ✓ Screen away honored ({screenAwaySeconds}s)
          </span>
        )}
      </div>

      {/* Main Headline */}
      <div className="space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium tracking-tight">
          WHAT DID YOU NOTICE?
        </h1>
        <p className="font-sans text-sm text-ink-muted">
          Record what your senses gathered before the recollection fades.
        </p>
      </div>

      {/* Structured AI Error Banner if Ollama is unavailable */}
      {state.aiError && (
        <div className="p-4 sm:p-5 rounded-[2px] bg-paper-deep/60 border border-terracotta/40 space-y-3 animate-journal-entry">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terracotta flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline" />
              {state.aiError.aiStatus === 'LOCAL_MODEL_UNAVAILABLE'
                ? 'Local Model Offline'
                : state.aiError.aiStatus === 'AI_TIMEOUT'
                ? 'Inference Window Elapsed'
                : `AI Status: ${state.aiError.aiStatus}`}
            </span>
            <button
              type="button"
              onClick={dismissAiError}
              className="text-xs font-mono text-ink-muted hover:text-ink px-2 py-1 min-h-[32px]"
            >
              ✕ Dismiss
            </button>
          </div>
          <p className="font-serif text-sm text-ink leading-relaxed">
            {state.aiError.message}
          </p>
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <TactileButton
              type="button"
              onClick={(e) => handleSubmit(e)}
              variant="terracotta"
              className="text-xs py-2 px-4 min-h-[36px]"
            >
              <RefreshCw className="w-3 h-3 mr-1.5" />
              Retry Synthesis
            </TactileButton>
          </div>
        </div>
      )}

      {/* Reflection Processing State (Requirement 5) */}
      {isGenerating && (
        <div className="p-6 rounded-[2px] bg-paper-deep/40 border border-moss/30 text-center space-y-3 animate-journal-entry">
          <div className="w-10 h-10 mx-auto rounded-full border border-forest/30 flex items-center justify-center animate-observation-breath">
            <span className="w-2 h-2 rounded-full bg-forest" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs tracking-widest uppercase text-forest font-semibold">
              Distilling Naturalist Reflection...
            </p>
            <p className="font-serif italic text-xs text-ink-muted">
              Correlating raw physical observations with ecological dynamics.
            </p>
          </div>
        </div>
      )}

      {/* Directive Reference */}
      <div className="p-3.5 rounded-[2px] bg-paper-deep/30 border border-stone-deep/30 text-xs sm:text-sm font-serif italic text-ink-muted">
        Directive: “{activeInvestigation.prompt}”
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Primary Observation Textarea */}
        <div className="space-y-2">
          <label htmlFor="rawNotes" className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold">
            Raw Physical Observation <span className="text-terracotta">*</span>
          </label>
          <textarea
            id="rawNotes"
            rows={5}
            required
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            placeholder="e.g., The bark was darker on the side facing the ground. Deep moss gathered in the crevice where rainwater pooled, while the upper side was chalky and dry..."
            className="w-full p-4 rounded-[2px] border border-stone-deep/60 bg-paper text-ink font-serif text-base leading-relaxed placeholder:text-ink-faint/60 focus:bg-paper-bright focus:border-forest focus:outline-none transition-all shadow-inner min-h-[140px]"
          />
        </div>

        {/* Sensory Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="visualDetail" className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Visual Nuance (Optional)
            </label>
            <input
              id="visualDetail"
              type="text"
              value={visualDetail}
              onChange={(e) => setVisualDetail(e.target.value)}
              placeholder="e.g., Shadow angles, color contrast..."
              className="w-full px-3 py-2.5 rounded-[2px] border border-stone-deep/40 bg-paper text-ink font-sans text-sm focus:border-forest focus:outline-none min-h-[44px]"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tactileDetail" className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted">
              Tactile Nuance (Optional)
            </label>
            <input
              id="tactileDetail"
              type="text"
              value={tactileDetail}
              onChange={(e) => setTactileDetail(e.target.value)}
              placeholder="e.g., Damp, cold, rough grit..."
              className="w-full px-3 py-2.5 rounded-[2px] border border-stone-deep/40 bg-paper text-ink font-sans text-sm focus:border-forest focus:outline-none min-h-[44px]"
            />
          </div>
        </div>

        {/* Deferred Media Section (Unlocked only after physical observation) */}
        <div className="border-t border-stone-deep/30 pt-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-wider text-forest font-semibold">
              Deferred Field Media
            </span>
            <span className="text-[11px] font-serif italic text-ink-muted">
              Unlocked post-observation
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Photo capture trigger */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {!photoUri ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center px-4 py-2.5 rounded-[2px] border border-stone-deep/60 bg-paper hover:bg-stone-light/60 text-xs font-mono text-ink tracking-wide transition-colors min-h-[44px]"
              >
                <Camera className="w-3.5 h-3.5 mr-2 text-moss" />
                Attach Photo
              </button>
            ) : (
              <div className="flex items-center space-x-2 p-1.5 rounded border border-stone-deep/40 bg-paper">
                <img src={photoUri} alt="Field observation" className="w-10 h-10 object-cover rounded-[2px]" />
                <span className="text-xs font-mono text-ink">Photo attached</span>
                <button
                  type="button"
                  onClick={() => setPhotoUri(undefined)}
                  className="p-2 text-terracotta hover:text-terracotta-deep min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remove photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Voice Memo trigger */}
            {!audioUri ? (
              <button
                type="button"
                onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
                className={`inline-flex items-center px-4 py-2.5 rounded-[2px] border text-xs font-mono tracking-wide transition-colors min-h-[44px] ${
                  isRecordingAudio
                    ? 'border-terracotta bg-terracotta/10 text-terracotta animate-pulse'
                    : 'border-stone-deep/60 bg-paper hover:bg-stone-light/60 text-ink'
                }`}
              >
                {isRecordingAudio ? (
                  <>
                    <Square className="w-3.5 h-3.5 mr-2" />
                    Stop Voice Memo
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5 mr-2 text-moss" />
                    Record Voice Memo
                  </>
                )}
              </button>
            ) : (
              <div className="flex items-center space-x-2 p-2 rounded border border-stone-deep/40 bg-paper">
                <audio controls src={audioUri} className="h-7 w-44" />
                <button
                  type="button"
                  onClick={() => setAudioUri(undefined)}
                  className="p-2 text-terracotta hover:text-terracotta-deep min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remove voice memo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={enterField}
            className="text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors min-h-[44px] inline-flex items-center"
          >
            ← Return to Field Mode
          </button>

          <TactileButton
            type="submit"
            disabled={isGenerating || !rawNotes.trim()}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3.5 text-base tracking-wider uppercase font-semibold"
          >
            <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
            Record Observation & Synthesize with AI
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </form>
    </article>
  );
};
