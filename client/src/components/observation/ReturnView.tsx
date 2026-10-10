import React, { useState, useRef, useEffect } from 'react';
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
  MapPin,
  Square,
  Trash2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Check,
  Bookmark,
} from 'lucide-react';

export const ReturnView: React.FC = () => {
  const {
    state,
    submitObservationAndReflect,
    dismissAiError,
    enterField,
  } = useFieldSession();
  const { activeInvestigation, isGenerating } = state;

  const [rawNotes, setRawNotes] = useState('');
  const [photoUri, setPhotoUri] = useState<string | undefined>(undefined);
  const [audioUri, setAudioUri] = useState<string | undefined>(undefined);
  const [locationTag, setLocationTag] = useState<string | undefined>(undefined);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [showSketchpad, setShowSketchpad] = useState(false);
  const [showPhotoPicker, setShowPhotoPicker] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Load draft from localStorage if present
  useEffect(() => {
    if (activeInvestigation) {
      const saved = localStorage.getItem(`fieldnote_draft_${activeInvestigation.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.rawNotes) setRawNotes(parsed.rawNotes);
          if (parsed.photoUri) setPhotoUri(parsed.photoUri);
          if (parsed.locationTag) setLocationTag(parsed.locationTag);
        } catch {}
      }
    }
  }, [activeInvestigation]);

  if (!activeInvestigation) {
    return null;
  }

  // Handle Photo Selection
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUri(event.target?.result as string);
        setShowPhotoPicker(false);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Geolocation Pin
  const handleGetLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocationTag(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        },
        () => {
          setLocationTag('Local Specimen Terrain (GPS unavailable)');
        },
        { timeout: 5000 }
      );
    } else {
      setLocationTag('Local Specimen Site');
    }
  };

  // Voice Note Recording
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });

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

      recorder.start(250);
      setIsRecordingAudio(true);
      setRecordingSeconds(0);

      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
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
    }
  };

  const handleSaveDraft = () => {
    if (activeInvestigation) {
      localStorage.setItem(
        `fieldnote_draft_${activeInvestigation.id}`,
        JSON.stringify({ rawNotes, photoUri, locationTag, timestamp: Date.now() })
      );
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating || !rawNotes.trim()) return;

    if (activeInvestigation) {
      localStorage.removeItem(`fieldnote_draft_${activeInvestigation.id}`);
    }

    await submitObservationAndReflect(
      rawNotes.trim(),
      {
        visual: undefined,
        tactile: undefined,
      },
      photoUri,
      audioUri
    );
  };

  return (
    <article className="journal-page p-6 sm:p-10 lg:p-12 border border-stone-deep/40 rounded-sm bg-paper-bright shadow-journal animate-journal-entry space-y-7 max-w-2xl mx-auto">
      {/* 1. Header with Folio and Directive */}
      <div className="border-b border-stone/80 pb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BotanicalLeafSprig className="w-5 h-5 text-forest" />
          <span className="font-mono text-xs tracking-widest text-terracotta uppercase font-bold">
            Folio No. {String(activeInvestigation.sequenceNumber).padStart(3, '0')}
          </span>
        </div>
        <button
          type="button"
          onClick={enterField}
          className="text-xs font-mono tracking-wider text-ink-muted hover:text-ink transition-colors"
        >
          ← Back to Field Mode
        </button>
      </div>

      {/* 2. Main Title */}
      <div className="space-y-1.5">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Record Your Observation
        </h1>
        <p className="font-serif italic text-sm text-ink-muted">
          Document what you saw, heard, and felt.
        </p>
      </div>

      {/* Directive Reminder Card */}
      <div className="p-3.5 rounded-sm bg-paper-deep/30 border border-stone-deep/40 text-xs font-serif italic text-ink-muted">
        <strong className="font-mono text-[10px] uppercase text-forest font-bold not-italic mr-1.5">
          Directive:
        </strong>
        “{activeInvestigation.prompt}”
      </div>

      {/* AI Error State */}
      {state.aiError && (
        <div className="p-4 rounded-[2px] bg-paper-deep/60 border border-terracotta/40 space-y-2 animate-journal-entry">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-terracotta flex items-center">
              <AlertCircle className="w-3.5 h-3.5 mr-1.5 inline" />
              AI Status: {state.aiError.aiStatus}
            </span>
            <button
              type="button"
              onClick={dismissAiError}
              className="text-xs font-mono text-ink-muted hover:text-ink"
            >
              ✕
            </button>
          </div>
          <p className="font-serif text-xs text-ink leading-relaxed">
            {state.aiError.message}
          </p>
          <TactileButton
            type="button"
            onClick={(e) => handleSubmit(e)}
            variant="terracotta"
            className="text-xs py-1.5 px-3 min-h-[32px]"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Retry
          </TactileButton>
        </div>
      )}

      {/* Generating State */}
      {isGenerating && (
        <div className="p-6 rounded-[2px] bg-paper-deep/40 border border-botanical-teal/30 text-center space-y-2 animate-journal-entry">
          <div className="w-10 h-10 mx-auto rounded-full border border-forest/30 flex items-center justify-center animate-observation-breath">
            <span className="w-2 h-2 rounded-full bg-forest" />
          </div>
          <p className="font-mono text-xs tracking-widest uppercase text-forest font-semibold">
            Synthesizing AI Field Report...
          </p>
        </div>
      )}

      {/* Hidden file inputs */}
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

      {/* 3. FOUR ACTION TOOL BUTTONS (Photo, Audio, Location, Sketch) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Tool 1: Photo */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            className={`w-full p-3.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center min-h-[78px] space-y-1.5 ${
              photoUri
                ? 'bg-forest/10 border-forest text-forest'
                : 'bg-paper-bright border-stone-deep/60 hover:bg-stone-light/50 text-ink'
            }`}
          >
            <Camera className="w-5 h-5 text-forest" />
            <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
              {photoUri ? 'Photo Attached' : 'Add Photo'}
            </span>
          </button>

          {/* Photo Dropdown (Camera vs Gallery) */}
          {showPhotoPicker && (
            <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-paper-bright border border-stone-deep/80 rounded-sm shadow-journal py-1 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoPicker(false);
                  cameraInputRef.current?.click();
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
              >
                <Camera className="w-3.5 h-3.5 text-forest" />
                <span>Camera</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowPhotoPicker(false);
                  galleryInputRef.current?.click();
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-light/60 flex items-center space-x-2 text-ink"
              >
                <GalleryIcon className="w-3.5 h-3.5 text-botanical-teal" />
                <span>Gallery</span>
              </button>
            </div>
          )}
        </div>

        {/* Tool 2: Audio */}
        <button
          type="button"
          onClick={
            audioUri
              ? () => setAudioUri(undefined)
              : isRecordingAudio
              ? stopRecordingAudio
              : startRecordingAudio
          }
          className={`p-3.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center min-h-[78px] space-y-1.5 ${
            isRecordingAudio
              ? 'bg-terracotta/10 border-terracotta text-terracotta animate-pulse'
              : audioUri
              ? 'bg-forest/10 border-forest text-forest'
              : 'bg-paper-bright border-stone-deep/60 hover:bg-stone-light/50 text-ink'
          }`}
        >
          {isRecordingAudio ? (
            <Square className="w-5 h-5 text-terracotta fill-terracotta" />
          ) : (
            <Mic className="w-5 h-5 text-moss" />
          )}
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
            {isRecordingAudio
              ? `Stop (${recordingSeconds}s)`
              : audioUri
              ? 'Audio Attached'
              : 'Add Audio'}
          </span>
        </button>

        {/* Tool 3: Location */}
        <button
          type="button"
          onClick={handleGetLocation}
          className={`p-3.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center min-h-[78px] space-y-1.5 ${
            locationTag
              ? 'bg-forest/10 border-forest text-forest'
              : 'bg-paper-bright border-stone-deep/60 hover:bg-stone-light/50 text-ink'
          }`}
        >
          <MapPin className="w-5 h-5 text-botanical-teal" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
            {locationTag ? 'Located' : 'Add Location'}
          </span>
        </button>

        {/* Tool 4: Sketch */}
        <button
          type="button"
          onClick={() => setShowSketchpad(!showSketchpad)}
          className={`p-3.5 rounded-sm border text-center transition-all flex flex-col items-center justify-center min-h-[78px] space-y-1.5 ${
            showSketchpad
              ? 'bg-forest text-paper border-forest'
              : 'bg-paper-bright border-stone-deep/60 hover:bg-stone-light/50 text-ink'
          }`}
        >
          <PenTool className="w-5 h-5 text-terracotta" />
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold">
            Add Sketch
          </span>
        </button>
      </div>

      {/* Previews of attached tools */}
      {photoUri && (
        <div className="flex items-center space-x-3 p-2 rounded-sm border border-stone-deep/50 bg-paper-bright">
          <img
            src={photoUri}
            alt="Specimen"
            className="w-12 h-12 object-cover rounded-[2px]"
          />
          <div className="flex-1 min-w-0">
            <span className="text-xs font-mono text-ink block truncate font-medium">
              Specimen Photo / Sketch Attached
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPhotoUri(undefined)}
            className="p-2 text-terracotta hover:text-terracotta-deep"
            aria-label="Remove photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {audioUri && (
        <div className="flex items-center space-x-2">
          <TactileAudioPlayer src={audioUri} className="flex-1" label="Bioacoustic Memo" />
          <button
            type="button"
            onClick={() => setAudioUri(undefined)}
            className="p-2 text-terracotta hover:text-terracotta-deep"
            aria-label="Remove audio"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {locationTag && (
        <div className="flex items-center justify-between p-2.5 rounded-sm bg-botanical-teal-faint/60 border border-botanical-teal/20 text-xs font-mono text-botanical-teal">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationTag}</span>
          </div>
          <button
            type="button"
            onClick={() => setLocationTag(undefined)}
            className="text-xs text-ink-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sketchpad Drawer */}
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

      {/* 4. MAIN NOTES FORM WITH 0/1000 CHAR COUNTER */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="block font-mono text-xs uppercase tracking-wider text-ink font-semibold"
          >
            Observation Notes
          </label>
          <div className="relative">
            <textarea
              id="notes"
              rows={6}
              required
              maxLength={1000}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Describe what you noticed in as much detail as possible..."
              className="w-full p-4 pb-8 rounded-sm border border-stone-deep/80 bg-paper text-ink font-serif text-base sm:text-lg leading-relaxed placeholder:text-ink-faint/60 focus:border-forest focus:outline-none min-h-[160px]"
            />
            {/* 0/1000 Counter */}
            <span className="absolute bottom-2.5 right-3 font-mono text-[11px] text-ink-muted">
              {rawNotes.length}/1000
            </span>
          </div>
        </div>

        {/* Draft feedback notice */}
        {draftSaved && (
          <div className="p-2.5 rounded-[2px] bg-forest/10 border border-forest/30 font-mono text-xs text-forest flex items-center space-x-2">
            <Check className="w-3.5 h-3.5" />
            <span>Draft saved to your device.</span>
          </div>
        )}

        {/* 5. BOTTOM ACTIONS: Save Draft & Submit Observation */}
        <div className="pt-4 border-t border-stone/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <TactileButton
            type="button"
            onClick={handleSaveDraft}
            variant="secondary"
            className="w-full sm:w-auto px-6 py-3.5 text-xs font-semibold uppercase tracking-wider min-h-[48px]"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5 text-moss" />
            Save Draft
          </TactileButton>

          <TactileButton
            type="submit"
            disabled={isGenerating || !rawNotes.trim()}
            variant="primary"
            className="w-full sm:w-auto px-8 py-3.5 text-sm font-semibold tracking-wider uppercase shadow-journal min-h-[48px]"
          >
            <Sparkles className="w-4 h-4 mr-2 text-terracotta" />
            Submit Observation
            <ArrowRight className="w-4 h-4 ml-2" />
          </TactileButton>
        </div>
      </form>
    </article>
  );
};
