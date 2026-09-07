import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface AiInputProps {
  onSend: (message: string) => void;
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
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={isLoading}
        className="w-full h-11 pl-3.5 pr-11 bg-surface-secondary border border-border rounded-xl text-xs text-ink placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-petroleum transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={!text.trim() || isLoading}
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
  );
};
