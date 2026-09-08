import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2 } from 'lucide-react';

interface AudioPlayerProps {
  audioBase64?: string | null;
  textToSpeak?: string;
  autoPlay?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioBase64, textToSpeak, autoPlay }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioBase64) {
      const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
      audioRef.current = audio;

      audio.onended = () => setIsPlaying(false);
      audio.onpause = () => setIsPlaying(false);
      audio.onplay = () => setIsPlaying(true);

      if (autoPlay) {
        audio.play().catch((err) => {
          console.warn('[AudioPlayer] Auto-playback was restricted or failed:', err);
          setIsPlaying(false);
        });
      }

      return () => {
        audio.pause();
        audioRef.current = null;
      };
    } else if (autoPlay && textToSpeak && 'speechSynthesis' in window) {
      // Auto-play via speech synthesis fallback
      const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    }
  }, [audioBase64, autoPlay]);

  const handleTogglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((err) => {
          console.error('[AudioPlayer] Playback error:', err);
          setIsPlaying(false);
        });
      }
      return;
    }

    // Fallback: Browser Web Speech API if no base64 audio is provided
    if ('speechSynthesis' in window && textToSpeak) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleReplay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => setIsPlaying(false));
      setIsPlaying(true);
    } else if (textToSpeak) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak.replace(/[*#]/g, ''));
        utterance.rate = 1.0;
        utterance.onend = () => setIsPlaying(false);
        setIsPlaying(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  if (!audioBase64 && !textToSpeak) return null;

  return (
    <div className="mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-petroleum/10 border border-petroleum/20 text-petroleum dark:text-cyan-400 text-xs shadow-2xs">
      <Volume2 className="w-3.5 h-3.5 shrink-0" />
      <span className="text-[11px] font-medium font-sans">Voice Audio</span>

      {/* Waveform Micro-animation */}
      {isPlaying && (
        <div className="flex items-center gap-0.5 h-3 px-1">
          <span className="w-0.5 h-2 bg-petroleum dark:bg-cyan-400 animate-pulse" />
          <span className="w-0.5 h-3 bg-petroleum dark:bg-cyan-400 animate-pulse delay-75" />
          <span className="w-0.5 h-1.5 bg-petroleum dark:bg-cyan-400 animate-pulse delay-150" />
        </div>
      )}

      {/* Play / Pause Toggle */}
      <button
        type="button"
        onClick={handleTogglePlay}
        className="p-1 rounded hover:bg-petroleum/20 transition-colors"
        title={isPlaying ? 'Pause Voice' : 'Play Voice'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      {/* Replay */}
      <button
        type="button"
        onClick={handleReplay}
        className="p-1 rounded hover:bg-petroleum/20 text-ink-muted hover:text-ink transition-colors"
        title="Replay Voice"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
};
