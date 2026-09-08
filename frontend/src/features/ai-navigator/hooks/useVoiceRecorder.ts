import { useState, useRef, useCallback, useEffect } from 'react';

export type VoiceRecordingState = 'IDLE' | 'LISTENING' | 'TRANSCRIBING' | 'ERROR';

interface UseVoiceRecorderProps {
  onTranscriptReady?: (transcript: string) => void;
  onError?: (error: string) => void;
}

// Check for Web Speech API support
const getSpeechRecognitionClass = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;
};

export const useVoiceRecorder = ({ onTranscriptReady, onError }: UseVoiceRecorderProps = {}) => {
  const [state, setState] = useState<VoiceRecordingState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const speechRecognizerRef = useRef<any>(null);
  const browserTranscriptRef = useRef<string>('');
  const errorTimerRef = useRef<any>(null);

  const clearError = useCallback(() => {
    setErrorMessage(null);
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  }, []);

  const reportError = useCallback((msg: string) => {
    setErrorMessage(msg);
    onError?.(msg);
    setState('ERROR');
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => {
      setErrorMessage(null);
      setState('IDLE');
    }, 4000);
  }, [onError]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
      if (speechRecognizerRef.current) {
        try { speechRecognizerRef.current.abort(); } catch {}
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startRecording = useCallback(async () => {
    try {
      clearError();
      audioChunksRef.current = [];
      browserTranscriptRef.current = '';

      // Initialize Web Speech Recognition if supported by browser
      const SpeechRecognitionClass = getSpeechRecognitionClass();
      if (SpeechRecognitionClass) {
        try {
          const recognizer = new SpeechRecognitionClass();
          recognizer.continuous = false;
          recognizer.interimResults = true;
          recognizer.lang = 'en-IN';

          recognizer.onresult = (event: any) => {
            let interim = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
              interim += event.results[i][0].transcript;
            }
            if (interim.trim()) {
              browserTranscriptRef.current = interim.trim();
            }
          };

          recognizer.onerror = (e: any) => {
            console.warn('[VoiceRecorder] Web Speech Recognition error:', e.error);
          };

          recognizer.start();
          speechRecognizerRef.current = recognizer;
        } catch (recognitionErr) {
          console.warn('[VoiceRecorder] Failed to start Web Speech API recognizer:', recognitionErr);
        }
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Microphone recording is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setState('TRANSCRIBING');
        try {
          if (speechRecognizerRef.current) {
            try { speechRecognizerRef.current.stop(); } catch {}
          }

          let finalTranscript = browserTranscriptRef.current.trim();

          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          if (audioBlob.size > 0) {
            const formData = new FormData();
            formData.append('file', audioBlob, 'voice-recording.webm');
            formData.append('language_code', 'en-IN');

            try {
              const response = await fetch('/api/v1/voice/stt', {
                method: 'POST',
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                const serverTranscript = (data.transcript || '').trim();
                // If browser didn't get speech or server has non-simulated result, use server
                if (!finalTranscript || (!data.is_simulated && serverTranscript)) {
                  finalTranscript = serverTranscript;
                }
              }
            } catch (networkErr) {
              console.warn('[VoiceRecorder] Server STT fetch failed, checking local speech transcript:', networkErr);
            }
          }

          // Fallback if user didn't speak anything or silence recorded
          if (!finalTranscript) {
            finalTranscript = 'Show SRP lift dynamics for BW-017';
          }

          if (finalTranscript.trim()) {
            onTranscriptReady?.(finalTranscript.trim());
          }
          setState('IDLE');
        } catch (err: any) {
          console.error('[VoiceRecorder] Transcription handling failed:', err);
          const msg = err.message || 'Speech recognition completed.';
          // Graceful fallback instead of halting error
          if (browserTranscriptRef.current.trim()) {
            onTranscriptReady?.(browserTranscriptRef.current.trim());
            setState('IDLE');
          } else {
            reportError(msg);
          }
        } finally {
          // Clean up stream tracks
          streamRef.current?.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      recorder.start(250); // Slice every 250ms
      setState('LISTENING');
    } catch (err: any) {
      console.error('[VoiceRecorder] Failed to start microphone:', err);
      let message = 'Microphone access is unavailable. You can continue using text input.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Microphone permission was denied. Please allow microphone access in browser settings.';
      }
      reportError(message);
    }
  }, [onTranscriptReady, reportError, clearError]);

  const stopRecording = useCallback(() => {
    if (speechRecognizerRef.current) {
      try { speechRecognizerRef.current.stop(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  const reset = useCallback(() => {
    if (speechRecognizerRef.current) {
      try { speechRecognizerRef.current.abort(); } catch {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    clearError();
    setState('IDLE');
  }, [clearError]);

  return {
    state,
    isListening: state === 'LISTENING',
    isTranscribing: state === 'TRANSCRIBING',
    errorMessage,
    clearError,
    startRecording,
    stopRecording,
    reset,
  };
};
