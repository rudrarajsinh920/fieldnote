import React, { useState, useRef } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { TactileButton } from '../common/TactileButton.js';
import { BotanicalLeafSprig } from '../common/BotanicalIllustrations.js';
import { FieldSketchpad } from './FieldSketchpad.js';
import { TactileAudioPlayer } from '../common/TactileAudioPlayer.js';
import {
  Camera,
  Image as GalleryIcon,
  PenTool,
  Mic,
  Square,
  Trash2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Pocket,
  FileText,
  ShieldCheck,
} from 'lucide-react';

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
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showSketchpad, setShowSketchpad] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  if (!activeInvestigation) {
    return null;
  }

  // Handle Photo Selection (Camera or Gallery)
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

  // Cross-platform Voice Note Recording (iOS Safari + Chrome Android compatible)
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

      // Probe codecs in order of reliability for iOS Safari & Android Chrome
      const candidates = [
        'audio/mp4',
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/aac',
        '',
      ];
      let recorder: MediaRecorder | null = null;
      let chosenMime = '';

      for (const candidate of candidates) {
        if (!candidate) {
          try {
            recorder = new MediaRecorder(stream);
            chosenMime = recorder.mimeType || 'audio/mp4';
            break;
          } catch {
            continue;
          }
        }
        if (
          typeof MediaRecorder !== 'undefined' &&
          typeof MediaRecorder.isTypeSupported === 'function' &&
          MediaRecorder.isTypeSupported(candidate)
        ) {
          try {
            recorder = new MediaRecorder(stream, { mimeType: candidate });
            chosenMime = candidate;
            break;
          } catch {
            continue;
          }
        }
      }

      if (!recorder) {
        recorder = new MediaRecorder(stream);
        chosenMime = recorder.mimeType || 'audio/mp4';
      }

      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const finalType = recorder?.mimeType || chosenMime || 'audio/mp4';
        const audioBlob = new Blob(audioChunksRef.current, { type: finalType });
        const reader = new FileReader();
        reader.onload = (event) => {
          setAudioUri(event.target?.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start(250); // Slice chunks every 250ms for reliable iOS buffering
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      // Live recording duration counter
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      if ('vibrate' in navigator) navigator.vibrate(20);
    } catch (err) {
      console.warn('[Microphone] Access failed or rejected:', err);
      alert('Microphone access is unavailable or was declined.');
    }
  };

  const stopRecordingAudio = () => {
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if ('vibrate' in navigator) navigator.vibrate([15, 50, 15]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !rawNotes.trim()) return;

    if ('vibrate' in navigator) navigator.vibrate(25);

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
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-journal-entry space-y-8">
      {/* 1. EDITORIAL HEADER */}
      <div className="border-b border-stone/80 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <BotanicalLeafSprig className="w-5 h-5 text-forest" />
          <div>
            <span className="font-mono text-[10px] tracking-[0.25em] text-ink-faint uppercase block">
              Naturalist Ledger
            </span>
            <span className="font-mono text-xs sm:text-sm tracking-widest text-terracotta uppercase font-bold">
              RETURN FOLIO • NO. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
            </span>
          </div>
        </div>

        {screenAwaySeconds > 0 && (
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-[2px] bg-forest/10 border border-forest/30 font-mono text-xs text-forest">
            <Pocket className="w-3.5 h-3.5 text-terracotta" />
            <span>Screen-away honored ({screenAwaySeconds}s)</span>
          </div>
        )}
      </div>

      {/* 2. MAIN HEADLINE */}
      <div className="space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-ink font-medium tracking-tight">
          What Did You Notice?
        </h1>
        <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed max-w-xl">
          Record your sensory findings directly onto this field sheet before details fade from memory.
        </p>
      </div>

      {/* AI Error State */}
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

      {/* Generating State */}
      {isGenerating && (
        <div className="p-7 rounded-[2px] bg-paper-deep/40 border border-botanical-teal/30 text-center space-y-3 animate-journal-entry">
          <div className="w-12 h-12 mx-auto rounded-full border border-forest/30 flex items-center justify-center animate-observation-breath">
            <span className="w-2.5 h-2.5 rounded-full bg-forest" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-xs tracking-widest uppercase text-forest font-semibold">
              Distilling Naturalist Synthesis...
            </p>
            <p className="font-serif italic text-xs text-ink-muted">
              Correlating raw evidence with botanical and ecological dynamics.
            </p>
          </div>
        </div>
      )}

      {/* Directive Reference Card */}
      <div className="p-4 rounded-sm bg-paper-deep/30 border border-stone-deep/40 text-xs sm:text-sm font-serif italic text-ink-muted flex items-start space-x-2.5">
        <span className="font-mono text-[10px] uppercase tracking-wider text-terracotta font-semibold not-italic shrink-0 pt-0.5">
          Directive Reminder:
        </span>
        <span className="leading-relaxed">“{activeInvestigation.prompt}”</span>
      </div>

      {/* 3. OBSERVATION FORM (DISTINGUISHING USER EVIDENCE FROM AI INTERPRETATION) */}
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* SECTION A: OBSERVER EVIDENCE (RAW HUMAN SENSORY RECORD) */}
        <div className="p-5 sm:p-7 rounded-sm border border-stone-deep/60 bg-paper space-y-5">
          <div className="flex items-center justify-between border-b border-stone-deep/30 pb-3">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-forest" />
              <span className="font-mono text-xs uppercase tracking-widest text-forest font-bold">
                Observer Evidence (Human Record)
              </span>
            </div>
            <span className="text-[11px] font-mono text-ink-faint">
              Authentic Sensory Data
            </span>
          </div>

          {/* Primary Textarea */}
          <div className="space-y-2">
            <label
              htmlFor="rawNotes"
              className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold"
            >
              Primary Physical Observation <span className="text-terracotta">*</span>
            </label>
            <textarea
              id="rawNotes"
              rows={5}
              required
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="e.g., The bark was damper on the north-facing crevice where rainwater pooled. A ring of silver-green lichen clung to the rough surface, while the sunny upper branch was chalky and dry..."
              className="w-full p-4 rounded-sm border border-stone-deep/70 bg-paper-bright text-ink font-serif text-base sm:text-lg leading-relaxed placeholder:text-ink-faint/60 focus:border-forest focus:ring-1 focus:ring-forest/30 focus:outline-none transition-all min-h-[140px]"
            />
          </div>

          {/* Nuance Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label
                htmlFor="visualDetail"
                className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted"
              >
                Visual Nuance (Optional)
              </label>
              <input
                id="visualDetail"
                type="text"
                value={visualDetail}
                onChange={(e) => setVisualDetail(e.target.value)}
                placeholder="e.g., Angular shadow, emerald-to-ochre gradations..."
                className="w-full px-3.5 py-2.5 rounded-sm border border-stone-deep/50 bg-paper-bright text-ink font-sans text-sm focus:border-forest focus:outline-none min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="tactileDetail"
                className="block font-mono text-[11px] uppercase tracking-wider text-ink-muted"
              >
                Tactile Nuance (Optional)
              </label>
              <input
                id="tactileDetail"
                type="text"
                value={tactileDetail}
                onChange={(e) => setTactileDetail(e.target.value)}
                placeholder="e.g., Gritty, cool moisture, brittle dried fibers..."
                className="w-full px-3.5 py-2.5 rounded-sm border border-stone-deep/50 bg-paper-bright text-ink font-sans text-sm focus:border-forest focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* SECTION B: DEFERRED SPECIMEN MEDIA (CAMERA, GALLERY, CHARCOAL SKETCH, VOICE) */}
          <div className="pt-4 border-t border-stone-deep/20 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] uppercase tracking-wider text-ink font-semibold">
                Deferred Specimen Media & Sketches
              </span>
              <span className="text-[10px] font-serif italic text-ink-faint">
                Unlocked post-observation
              </span>
            </div>

            {/* Hidden file inputs: one for live camera, one for gallery/files */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <input
              type="file"
              accept="image/*"
              ref={galleryInputRef}
              onChange={handlePhotoUpload}
              className="hidden"
            />

            {/* Media Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* 1. Take Photo (Camera) */}
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="inline-flex items-center px-3.5 py-2.5 rounded-sm border border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-xs font-mono text-ink tracking-wide transition-colors min-h-[44px]"
              >
                <Camera className="w-3.5 h-3.5 mr-2 text-moss" />
                Take Photo (Camera)
              </button>

              {/* 2. Choose from Gallery / Album (New or Old Photos) */}
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="inline-flex items-center px-3.5 py-2.5 rounded-sm border border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-xs font-mono text-ink tracking-wide transition-colors min-h-[44px]"
              >
                <GalleryIcon className="w-3.5 h-3.5 mr-2 text-botanical-teal" />
                Choose from Gallery
              </button>

              {/* 3. Field Charcoal Rubbing Sketchpad */}
              <button
                type="button"
                onClick={() => setShowSketchpad(!showSketchpad)}
                className={`inline-flex items-center px-3.5 py-2.5 rounded-sm border text-xs font-mono tracking-wide transition-colors min-h-[44px] ${
                  showSketchpad
                    ? 'bg-forest text-paper border-forest'
                    : 'border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-ink'
                }`}
              >
                <PenTool className="w-3.5 h-3.5 mr-2 text-terracotta" />
                Charcoal Sketchpad
              </button>

              {/* 4. Voice Memo Recorder */}
              {!audioUri ? (
                <button
                  type="button"
                  onClick={isRecordingAudio ? stopRecordingAudio : startRecordingAudio}
                  className={`inline-flex items-center px-3.5 py-2.5 rounded-sm border text-xs font-mono tracking-wide transition-colors min-h-[44px] ${
                    isRecordingAudio
                      ? 'border-terracotta bg-terracotta/10 text-terracotta font-semibold'
                      : 'border-stone-deep/60 bg-paper-bright hover:bg-stone-light/50 text-ink'
                  }`}
                >
                  {isRecordingAudio ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-terracotta animate-ping mr-2" />
                      <Square className="w-3.5 h-3.5 mr-1.5 text-terracotta fill-terracotta" />
                      Stop Recording ({Math.floor(recordingSeconds / 60)}:{recordingSeconds % 60 < 10 ? '0' : ''}{recordingSeconds % 60})
                    </>
                  ) : (
                    <>
                      <Mic className="w-3.5 h-3.5 mr-2 text-moss" />
                      Record Voice Memo
                    </>
                  )}
                </button>
              ) : null}
            </div>

            {/* Attached Photo Preview */}
            {photoUri && (
              <div className="flex items-center space-x-3 p-2 rounded-sm border border-stone-deep/50 bg-paper-bright">
                <img
                  src={photoUri}
                  alt="Observed specimen"
                  className="w-12 h-12 object-cover rounded-[2px] border border-stone-deep/40"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-mono text-ink block truncate font-medium">
                    Specimen Image / Sketch Attached
                  </span>
                  <span className="text-[10px] font-mono text-ink-muted">Ready for archival folio</span>
                </div>
                <button
                  type="button"
                  onClick={() => setPhotoUri(undefined)}
                  className="p-2 text-terracotta hover:text-terracotta-deep min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Remove specimen photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Attached Voice Memo Preview */}
            {audioUri && (
              <div className="flex items-center space-x-2">
                <TactileAudioPlayer
                  src={audioUri}
                  className="flex-1"
                  label="Bioacoustic Voice Memo"
                />
                <button
                  type="button"
                  onClick={() => setAudioUri(undefined)}
                  className="p-2 text-terracotta hover:text-terracotta-deep min-h-[44px] min-w-[44px] flex items-center justify-center self-center"
                  aria-label="Remove audio"
                  title="Remove recorded audio"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Inline Charcoal Rubbing Sketchpad Drawer */}
            {showSketchpad && (
              <div className="pt-2">
                <FieldSketchpad
                  onSaveSketch={(dataUrl) => {
                    setPhotoUri(dataUrl);
                    setShowSketchpad(false);
                  }}
                  onCancel={() => setShowSketchpad(false)}
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION C: DISTINCTION OF AI SYNTHESIS */}
        <div className="p-4 rounded-sm bg-stone-light/40 border border-stone-deep/40 flex items-start space-x-3 text-xs text-ink-muted">
          <ShieldCheck className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          <div className="space-y-0.5 leading-relaxed font-sans">
            <strong className="text-forest font-semibold block">Separation of Evidence & Interpretation:</strong>
            <p>
              Your notes and attached images represent primary ground truth. The AI synthesis on the next screen will treat your observations as immutable evidence and will never invent facts not observed by you.
            </p>
          </div>
        </div>

        {/* 4. ACTIONS */}
        <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-4">
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
            className="w-full sm:w-auto px-8 py-4 text-base tracking-wider uppercase font-semibold shadow-journal min-h-[52px]"
          >
            <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
            Submit Evidence & Synthesize Reflection
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </form>
    </article>
  );
};
