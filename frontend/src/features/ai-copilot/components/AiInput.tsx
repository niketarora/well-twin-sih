import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Mic, MicOff, Square } from 'lucide-react';
import { useVoiceRecorder } from '../../ai-navigator/hooks/useVoiceRecorder';

interface AiInputProps {
  onSend: (message: string, isVoice?: boolean) => void;
  isLoading: boolean;
  placeholder?: string;
  initialValue?: string | null;
}

export const AiInput: React.FC<AiInputProps> = ({
  onSend,
  isLoading,
  placeholder = 'Ask the AI Copilot about well health, physics, or navigation...',
  initialValue,
}) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { isListening, isTranscribing, errorMessage, clearError, startRecording, stopRecording } =
    useVoiceRecorder({
      onTranscriptReady: (transcript) => {
        setText(transcript);
        onSend(transcript, true);
      },
    });

  useEffect(() => {
    if (initialValue) {
      setText(initialValue);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, [initialValue]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSend(text.trim(), false);
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Listening / Transcribing Status Pill */}
      {isListening && (
        <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-status-crit text-xs animate-in fade-in duration-150">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-status-crit animate-ping" />
            <span className="font-medium text-[11px]">Listening with Sarvam AI Saaras... Speak your query.</span>
          </div>
          <button
            type="button"
            onClick={stopRecording}
            className="flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-status-crit text-white hover:bg-red-700 transition-colors"
          >
            <Square className="w-2.5 h-2.5" />
            <span>Done</span>
          </button>
        </div>
      )}

      {isTranscribing && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-petroleum/10 border border-petroleum/30 text-petroleum dark:text-cyan-400 text-xs animate-in fade-in duration-150">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="font-mono text-[11px]">Transcribing speech audio with Sarvam AI...</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-red-500/10 border border-red-500/20 text-[11px] text-red-600 dark:text-red-400 animate-in fade-in duration-150">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={clearError}
            className="text-xs text-ink-muted hover:text-ink ml-2 px-1 rounded hover:bg-red-500/20"
            title="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Input Bar */}
      <form onSubmit={handleSubmit} className="relative flex items-center">
        {/* Microphone Voice Trigger */}
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isLoading || isTranscribing}
          className={`absolute left-2 p-1.5 rounded-lg transition-all ${
            isListening
              ? 'bg-status-crit text-white animate-pulse'
              : 'text-ink-muted hover:text-ink hover:bg-surface border border-transparent hover:border-border'
          }`}
          title={isListening ? 'Stop Recording' : 'Voice Input (Sarvam Saaras)'}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? 'Listening...' : placeholder}
          disabled={isLoading || isListening || isTranscribing}
          className="w-full h-11 pl-10 pr-11 bg-surface-secondary border border-border rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-petroleum transition-colors disabled:opacity-50"
        />

        <button
          type="submit"
          disabled={!text.trim() || isLoading || isListening || isTranscribing}
          className="absolute right-2 p-1.5 rounded-lg bg-petroleum hover:bg-petroleum-hover disabled:bg-border/60 text-white disabled:text-ink-muted transition-colors disabled:cursor-not-allowed shadow-xs"
          title="Send Question"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
