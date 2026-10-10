import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, AlertCircle } from 'lucide-react';

interface TactileAudioPlayerProps {
  src: string;
  className?: string;
  label?: string;
}

export const TactileAudioPlayer: React.FC<TactileAudioPlayerProps> = ({
  src,
  className = '',
  label = 'Bioacoustic Memo',
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setHasError(true);
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
          setHasError(false);
        })
        .catch((err) => {
          console.warn('[Audio Playback] iOS unlock or format fallback:', err);
          setIsPlaying(false);
        });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = Number(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleRestart = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      className={`p-3 rounded-sm border border-stone-deep/60 bg-paper-bright shadow-journal-subtle flex flex-col gap-2 ${className}`}
    >
      {/* Hidden native audio element configured specifically for iOS Safari */}
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        playsInline
        aria-hidden="true"
      />

      <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted">
        <div className="flex items-center space-x-1.5">
          <Volume2 className="w-3.5 h-3.5 text-forest" />
          <span className="uppercase tracking-wider font-semibold text-forest">
            {label}
          </span>
        </div>
        <span>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      {hasError ? (
        <div className="p-2 rounded bg-terracotta/10 border border-terracotta/30 text-terracotta text-xs flex items-center space-x-2 font-mono">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Audio format decoding issue on this browser.</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-forest text-paper flex items-center justify-center hover:bg-forest/90 transition-transform active:scale-95 shadow-sm min-h-[36px] min-w-[36px]"
            aria-label={isPlaying ? 'Pause audio note' : 'Play audio note'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-paper" />
            ) : (
              <Play className="w-4 h-4 fill-paper ml-0.5" />
            )}
          </button>

          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 text-ink-muted hover:text-ink transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
            title="Restart from beginning"
            aria-label="Restart audio note"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Scrubber Progress Bar */}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 accent-forest h-1.5 bg-stone-light/80 rounded cursor-pointer"
            aria-label="Audio scrubber"
          />
        </div>
      )}
    </div>
  );
};
