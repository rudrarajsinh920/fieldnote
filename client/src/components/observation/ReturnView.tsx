import React, { useState, useRef, useEffect } from 'react';
import { useFieldSession } from '../../context/field-session-context.js';
import { FieldSketchpad } from './FieldSketchpad.js';
import { TactileAudioPlayer } from '../common/TactileAudioPlayer.js';
import { BotanicalCornerFoliage } from '../common/BotanicalIllustrations.js';
import {
  Camera,
  Image as GalleryIcon,
  PenTool,
  Mic,
  MapPin,
  Square,
  Trash2,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Check,
  Plus,
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

  // Quick Tags
  const [tags, setTags] = useState<string[]>(['Plant']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  const availableTags = ['Plant', 'Moss', 'Insect', 'Rock'];

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<number | null>(null);

  // Load draft from localStorage
  useEffect(() => {
    if (activeInvestigation) {
      const saved = localStorage.getItem(`fieldnote_draft_${activeInvestigation.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.rawNotes) setRawNotes(parsed.rawNotes);
          if (parsed.photoUri) setPhotoUri(parsed.photoUri);
          if (parsed.locationTag) setLocationTag(parsed.locationTag);
          if (parsed.tags) setTags(parsed.tags);
        } catch {}
      }
    }
  }, [activeInvestigation]);

  if (!activeInvestigation) {
    return null;
  }

  const handleToggleTag = (tag: string) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTagInput.trim() && !tags.includes(customTagInput.trim())) {
      setTags([...tags, customTagInput.trim()]);
      setCustomTagInput('');
      setShowCustomTagInput(false);
    }
  };

  // Photo
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

  // Location
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

  // Audio Recording
  const startRecordingAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAudioUri(reader.result as string);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecordingAudio(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } catch {
      alert('Microphone access was denied or is unavailable on this device.');
    }
  };

  const stopRecordingAudio = () => {
    if (mediaRecorderRef.current && isRecordingAudio) {
      mediaRecorderRef.current.stop();
      setIsRecordingAudio(false);
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }
    }
  };

  const handleSaveDraft = () => {
    if (activeInvestigation) {
      localStorage.setItem(
        `fieldnote_draft_${activeInvestigation.id}`,
        JSON.stringify({ rawNotes, photoUri, locationTag, tags })
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

    const tagContext = tags.length > 0 ? ` [Tags: ${tags.join(', ')}]` : '';
    const fullNotes = rawNotes.trim() + tagContext;

    await submitObservationAndReflect(
      fullNotes,
      {
        visual: undefined,
        tactile: undefined,
      },
      photoUri,
      audioUri
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 sm:space-y-8 animate-journal-entry pb-16 relative">
      {/* Decorative Corner Foliage */}
      <div className="absolute -top-4 -right-4 pointer-events-none z-10 hidden sm:block">
        <BotanicalCornerFoliage position="top-right" className="w-28 h-28 opacity-80" />
      </div>
      <div className="absolute -bottom-8 -right-8 pointer-events-none z-10 hidden sm:block">
        <BotanicalCornerFoliage position="bottom-right" className="w-36 h-36 opacity-80" />
      </div>

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={enterField}
          className="inline-flex items-center text-xs font-mono uppercase tracking-wider text-ink-muted hover:text-ink min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Field Mode
        </button>
        <span className="font-mono text-xs text-forest font-semibold">
          Folio {String(activeInvestigation.sequenceNumber || 1).padStart(2, '0')}
        </span>
      </div>

      {/* Screen Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium tracking-tight">
          Record Your Observation
        </h1>
        <p className="font-sans text-xs sm:text-sm text-ink-muted">
          What did you notice?
        </p>
      </div>

      {/* Directive Summary */}
      <div className="p-3.5 rounded-2xl bg-paper-bright border border-stone text-xs font-serif italic text-ink-muted">
        <strong className="font-mono text-[10px] uppercase text-forest font-bold not-italic mr-1.5">
          Directive:
        </strong>
        “{activeInvestigation.prompt}”
      </div>

      {/* Error state */}
      {state.aiError && (
        <div className="p-4 rounded-xl border border-terracotta/40 bg-[#FBF4EE] space-y-2">
          <div className="flex items-center space-x-2 text-terracotta text-sm font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{state.aiError.message}</span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <button
              onClick={(e) => handleSubmit(e)}
              className="text-xs font-mono uppercase font-bold text-terracotta hover:underline flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1" /> Retry
            </button>
            <button
              onClick={dismissAiError}
              className="text-xs font-mono text-ink-muted hover:text-ink"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isGenerating && (
        <div className="p-6 rounded-2xl bg-paper-bright border border-forest/30 text-center space-y-2">
          <RefreshCw className="w-6 h-6 mx-auto text-forest animate-spin" />
          <p className="font-mono text-xs uppercase tracking-wider text-forest font-semibold">
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

      {/* 4 ACTION CAPTURE BUTTONS (Photo, Audio, Location, Sketch) */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
        {/* Photo Button */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowPhotoPicker(!showPhotoPicker)}
            className={`w-full py-4 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 min-h-[82px] ${
              photoUri
                ? 'bg-forest/10 border-forest text-forest'
                : 'bg-paper-bright border-stone hover:border-forest/50 text-ink'
            }`}
          >
            <Camera className="w-5 h-5 text-forest" />
            <span className="text-[11px] font-sans font-medium">
              Photo
            </span>
          </button>

          {showPhotoPicker && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-20 bg-paper-bright border border-stone rounded-xl shadow-lg py-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setShowPhotoPicker(false);
                  cameraInputRef.current?.click();
                }}
                className="w-full px-3 py-2 text-left hover:bg-stone-light/50 flex items-center space-x-2"
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
                className="w-full px-3 py-2 text-left hover:bg-stone-light/50 flex items-center space-x-2"
              >
                <GalleryIcon className="w-3.5 h-3.5 text-forest" />
                <span>Gallery</span>
              </button>
            </div>
          )}
        </div>

        {/* Audio Button */}
        <button
          type="button"
          onClick={
            audioUri
              ? () => setAudioUri(undefined)
              : isRecordingAudio
              ? stopRecordingAudio
              : startRecordingAudio
          }
          className={`py-4 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 min-h-[82px] ${
            isRecordingAudio
              ? 'bg-terracotta/10 border-terracotta text-terracotta animate-pulse'
              : audioUri
              ? 'bg-forest/10 border-forest text-forest'
              : 'bg-paper-bright border-stone hover:border-forest/50 text-ink'
          }`}
        >
          {isRecordingAudio ? (
            <Square className="w-5 h-5 text-terracotta fill-terracotta" />
          ) : (
            <Mic className="w-5 h-5 text-forest" />
          )}
          <span className="text-[11px] font-sans font-medium">
            {isRecordingAudio ? `${recordingSeconds}s` : 'Audio'}
          </span>
        </button>

        {/* Location Button */}
        <button
          type="button"
          onClick={handleGetLocation}
          className={`py-4 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 min-h-[82px] ${
            locationTag
              ? 'bg-forest/10 border-forest text-forest'
              : 'bg-paper-bright border-stone hover:border-forest/50 text-ink'
          }`}
        >
          <MapPin className="w-5 h-5 text-forest" />
          <span className="text-[11px] font-sans font-medium">
            Location
          </span>
        </button>

        {/* Sketch Button */}
        <button
          type="button"
          onClick={() => setShowSketchpad(!showSketchpad)}
          className={`py-4 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1.5 min-h-[82px] ${
            showSketchpad
              ? 'bg-forest text-paper border-forest'
              : 'bg-paper-bright border-stone hover:border-forest/50 text-ink'
          }`}
        >
          <PenTool className="w-5 h-5 text-forest" />
          <span className="text-[11px] font-sans font-medium">
            Sketch
          </span>
        </button>
      </div>

      {/* Previews */}
      {photoUri && (
        <div className="flex items-center space-x-3 p-3 rounded-2xl border border-stone bg-paper-bright">
          <img src={photoUri} alt="Specimen" className="w-12 h-12 object-cover rounded-lg" />
          <span className="text-xs font-mono text-ink flex-1 truncate">Photo Attached</span>
          <button
            type="button"
            onClick={() => setPhotoUri(undefined)}
            className="p-1.5 text-terracotta hover:text-terracotta-deep"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {audioUri && (
        <div className="flex items-center space-x-2">
          <TactileAudioPlayer src={audioUri} className="flex-1" label="Field Audio Memo" />
          <button
            type="button"
            onClick={() => setAudioUri(undefined)}
            className="p-2 text-terracotta"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {locationTag && (
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-forest/10 border border-forest/20 text-xs font-mono text-forest">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{locationTag}</span>
          </div>
          <button type="button" onClick={() => setLocationTag(undefined)}>✕</button>
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

      {/* Observation Notes Textarea */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={6}
              required
              maxLength={1000}
              value={rawNotes}
              onChange={(e) => setRawNotes(e.target.value)}
              placeholder="Describe what you actually observed... (e.g., shape, texture, color, behavior, environment)"
              className="w-full p-4 pb-8 rounded-2xl border border-stone bg-paper-bright text-ink font-sans text-sm leading-relaxed placeholder:text-ink-muted/60 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest min-h-[160px]"
            />
            <span className="absolute bottom-3 right-4 font-mono text-[11px] text-ink-muted">
              {rawNotes.length}/1000
            </span>
          </div>
        </div>

        {/* Quick Tags Section */}
        <div className="space-y-2">
          <div className="font-sans text-xs uppercase tracking-wider text-ink font-semibold">
            Quick Tags
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {availableTags.map((tag) => {
              const isSelected = tags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-sans font-medium transition-all ${
                    isSelected
                      ? 'bg-forest text-paper shadow-sm'
                      : 'bg-paper-bright border border-stone text-ink hover:border-forest/50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}

            {/* Custom tags added */}
            {tags
              .filter((t) => !availableTags.includes(t))
              .map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleToggleTag(tag)}
                  className="px-3 py-1.5 rounded-xl text-xs font-sans font-medium bg-forest text-paper flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <span>×</span>
                </button>
              ))}

            {showCustomTagInput ? (
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => setCustomTagInput(e.target.value)}
                  placeholder="Tag name"
                  className="px-2 py-1 text-xs rounded-lg border border-stone bg-paper-bright"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  className="px-2 py-1 text-xs rounded-lg bg-forest text-paper"
                >
                  Add
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowCustomTagInput(true)}
                className="px-3 py-1.5 rounded-xl text-xs font-sans font-medium bg-paper-bright border border-dashed border-stone text-ink-muted hover:text-ink flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Tag</span>
              </button>
            )}
          </div>
        </div>

        {/* Draft notice */}
        {draftSaved && (
          <div className="p-3 rounded-xl bg-forest/10 border border-forest/20 text-xs font-mono text-forest flex items-center space-x-2">
            <Check className="w-4 h-4" />
            <span>Draft saved to device.</span>
          </div>
        )}

        {/* Bottom Actions: Save Draft & Submit */}
        <div className="pt-3 flex items-center space-x-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex-1 py-3.5 px-4 rounded-2xl border border-stone bg-paper-bright hover:bg-stone-light/40 text-ink font-sans font-semibold text-sm transition-all"
          >
            Save Draft
          </button>

          <button
            type="submit"
            disabled={isGenerating || !rawNotes.trim()}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-forest hover:bg-forest-deep disabled:bg-stone text-paper font-sans font-semibold text-sm flex items-center justify-center space-x-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>Submit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
