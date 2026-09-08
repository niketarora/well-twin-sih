import React from 'react';
import { Bot, User, AlertCircle, Loader2 } from 'lucide-react';
import { AiMessage as AiMessageType } from '../types/ai';
import { ConfidenceBadge } from './ConfidenceBadge';
import { EvidenceList } from './EvidenceList';
import { AiActionButton } from './AiActionButton';
import { ComparisonTable } from './ComparisonTable';
import { DataSufficiencyNotice } from './DataSufficiencyNotice';
import { AudioPlayer } from '../../ai-navigator/components/AudioPlayer';

interface AiMessageProps {
  message: AiMessageType;
  onActionExecuted?: () => void;
}

export const AiMessage: React.FC<AiMessageProps> = ({ message, onActionExecuted }) => {
  const isUser = message.role === 'user';

  // Helper to format basic markdown (bold, bullets, paragraphs)
  const renderFormattedText = (text: string) => {
    const paragraphs = text.split('\n\n');
    return paragraphs.map((p, pIdx) => {
      const lines = p.split('\n');
      return (
        <p key={pIdx} className="leading-relaxed mb-2 last:mb-0">
          {lines.map((line, lIdx) => {
            // Replace **text** with <strong>
            const parts = line.split(/(\*\*.*?\*\*)/g);
            return (
              <React.Fragment key={lIdx}>
                {parts.map((part, i) => {
                  if (part.startsWith('**') && part.endsWith('**')) {
                    return (
                      <strong key={i} className="font-semibold text-ink">
                        {part.slice(2, -2)}
                      </strong>
                    );
                  }
                  return part;
                })}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </p>
      );
    });
  };

  return (
    <div className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}>
      {/* Assistant Icon */}
      {!isUser && (
        <div className="w-7 h-7 rounded-lg bg-petroleum/10 border border-petroleum/20 flex items-center justify-center text-petroleum dark:text-cyan-400 shrink-0 mt-0.5 shadow-2xs">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Message Bubble */}
      <div
        className={`max-w-[88%] rounded-xl p-3.5 space-y-2.5 shadow-subtle ${
          isUser
            ? 'bg-petroleum text-white'
            : 'bg-surface border border-border text-ink'
        }`}
      >
        {/* Loading placeholder with truthful stage progression */}
        {message.isLoading && (
          <div className="flex items-center gap-2 text-ink-muted text-xs py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-petroleum dark:text-cyan-400" />
            <span className="font-mono text-[11px] animate-pulse">
              {message.loadingStage || 'Analyzing surveillance data & multi-physics twin...'}
            </span>
          </div>
        )}

        {/* Text Content */}
        {!message.isLoading && message.content && (
          <div className={`text-xs ${isUser ? 'text-white' : 'text-ink-secondary'}`}>
            {renderFormattedText(message.content)}
          </div>
        )}

        {/* Voice Audio Playback (Sarvam Bulbul / Web Speech) */}
        {!isUser && !message.isLoading && message.content && (
          <AudioPlayer
            audioBase64={message.audioBase64 || message.response?.audioBase64}
            textToSpeak={message.content}
            autoPlay={message.isVoice}
          />
        )}

        {/* Data Sufficiency Notice (Hallucination Prevention) */}
        {!isUser && message.response?.dataSufficiency && (
          <DataSufficiencyNotice dataSufficiency={message.response.dataSufficiency} />
        )}

        {/* Multi-Well Comparison Table */}
        {!isUser && message.response?.comparison && message.response.comparison.length > 0 && (
          <ComparisonTable comparison={message.response.comparison} />
        )}

        {/* Error Notification */}
        {message.error && (
          <div className="flex items-center gap-1.5 p-2 rounded bg-red-500/10 border border-red-500/25 text-[11px] text-red-700 dark:text-red-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{message.error}</span>
          </div>
        )}

        {/* Confidence Badge */}
        {!isUser && message.response?.confidence !== undefined && (
          <div className="flex items-center justify-between pt-1">
            <ConfidenceBadge confidence={message.response.confidence} />
            <span className="text-[10px] text-ink-muted font-mono">{message.timestamp}</span>
          </div>
        )}

        {/* Physical Evidence List */}
        {!isUser && message.response?.evidence && message.response.evidence.length > 0 && (
          <EvidenceList evidence={message.response.evidence} />
        )}

        {/* Navigation Action Buttons */}
        {!isUser && message.response?.actions && message.response.actions.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2 border-t border-border/60">
            {message.response.actions.map((act, aIdx) => (
              <AiActionButton key={aIdx} action={act} onExecuted={onActionExecuted} />
            ))}
          </div>
        )}
      </div>

      {/* User Icon */}
      {isUser && (
        <div className="w-7 h-7 rounded-lg bg-surface-secondary border border-border flex items-center justify-center text-ink-secondary shrink-0 mt-0.5 shadow-2xs">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  );
};
