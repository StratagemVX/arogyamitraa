import { useState, useEffect, useCallback, useRef } from 'react';
import type { Language } from '@/components/LanguageSelector';

/* ─────────────────────────────────────────────
 *  BCP-47 codes that SpeechRecognition expects
 * ───────────────────────────────────────────── */
const langCodes: Record<Language, string> = {
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  en: 'en-US',
};

/* ─────────────────────────────────────────────
 *  Props
 * ───────────────────────────────────────────── */
export interface UseVoiceRecognitionProps {
  /** The language the recogniser should listen for. */
  language: Language;
  /** Called with the final transcript. */
  onResult: (transcript: string, language: Language) => void;
  /** Called when a recognition error occurs. */
  onError?: (error: string) => void;
  /** Called when the recognition session ends (regardless of result). */
  onEnd?: (finalTranscript: string, language: Language) => void;
  /** Max milliseconds the mic stays open before auto-stopping. */
  maxListenMs?: number;
}

export type RecognitionStatus =
  | 'idle'
  | 'unsupported'
  | 'ready'
  | 'starting'
  | 'listening'
  | 'error';

/* ─────────────────────────────────────────────
 *  Web Speech API browser type shim
 * ───────────────────────────────────────────── */
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}
interface SpeechRecognitionResultList {
  readonly length: number;
  [index: number]: SpeechRecognitionResult;
}
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  [index: number]: SpeechRecognitionAlternative;
}
interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}
interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  onstart: (() => void) | null;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

/* ─────────────────────────────────────────────
 *  Hook
 * ───────────────────────────────────────────── */
export function useVoiceRecognition({
  language,
  onResult,
  onError,
  onEnd,
  maxListenMs = 15_000,
}: UseVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [recognitionStatus, setRecognitionStatus] = useState<RecognitionStatus>('idle');

  const recRef = useRef<SpeechRecognitionInstance | null>(null);
  const timerRef = useRef<number | null>(null);
  const resultRef = useRef(''); // accumulated transcript during session
  const silenceTimerRef = useRef<number | null>(null);

  /* ── Create recognition instance once ── */
  useEffect(() => {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setRecognitionStatus('unsupported');
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
      return;
    }

    const rec = new Ctor();
    rec.continuous = true;         // keep listening for the full sentence
    rec.interimResults = true;     // get partial results so we know user is still speaking
    rec.maxAlternatives = 1;
    rec.lang = langCodes[language];

    recRef.current = rec;
    setIsSupported(true);
    setRecognitionStatus('ready');
    console.info('SpeechRecognition: created, lang =', rec.lang);

    return () => {
      rec.abort();
      recRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally run once
  }, []);

  /* ── Keep lang in sync whenever selectedLanguage changes ── */
  useEffect(() => {
    if (recRef.current) {
      recRef.current.lang = langCodes[language];
      console.info('SpeechRecognition: lang updated →', langCodes[language]);
    }
  }, [language]);

  /* ── Helpers ── */
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const clearSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      window.clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  /* ── Start listening ── */
  const startListening = useCallback(() => {
    const rec = recRef.current;
    if (!rec) {
      setRecognitionStatus('unsupported');
      return;
    }

    // Ensure the language is set right before start
    rec.lang = langCodes[language];
    resultRef.current = '';
    setRecognitionStatus('starting');
    clearTimer();
    clearSilenceTimer();

    /* — event handlers (re-attached each session for fresh closure) — */

    rec.onstart = () => {
      console.info('SR: listening in', rec.lang);
      setIsListening(true);
      setRecognitionStatus('listening');
    };

    rec.onresult = (event: SpeechRecognitionEvent) => {
      if (!event.results || event.results.length === 0) return;

      // Accumulate all final results + the latest interim result
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentText = (finalTranscript + interimTranscript).trim();
      console.info('SR: result →', { final: finalTranscript.trim(), interim: interimTranscript.trim() });

      if (currentText) {
        resultRef.current = currentText;

        // Reset the silence timer on every new result — user is still speaking
        clearSilenceTimer();
        silenceTimerRef.current = window.setTimeout(() => {
          // 2 seconds of silence after last speech → finalize
          console.info('SR: silence detected, finalizing with:', resultRef.current);
          if (resultRef.current) {
            onResult(resultRef.current, language);
          }
          rec.stop();
        }, 2000);
      }
    };

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      const code = event.error;
      console.error('SR: error →', code);

      if (code !== 'no-speech' && code !== 'aborted') {
        setRecognitionStatus('error');
        onError?.(friendlyError(code));
      }
    };

    rec.onend = () => {
      console.info('SR: session ended');
      clearTimer();
      clearSilenceTimer();
      setIsListening(false);
      setRecognitionStatus('ready');
      onEnd?.(resultRef.current, language);
    };

    /* — absolute max timeout safety — */
    timerRef.current = window.setTimeout(() => {
      console.info('SR: maxListenMs reached, stopping');
      if (resultRef.current) {
        onResult(resultRef.current, language);
      }
      rec.stop();
    }, maxListenMs);

    /* — start — */
    try {
      rec.start();
    } catch (err) {
      console.error('SR: start() threw', err);
      setRecognitionStatus('error');
      onError?.('Could not start recognition. Check microphone permissions.');
    }
  }, [language, maxListenMs, onResult, onError, onEnd, clearTimer, clearSilenceTimer]);

  /* ── Stop listening ── */
  const stopListening = useCallback(() => {
    clearTimer();
    clearSilenceTimer();
    // Deliver whatever we've accumulated so far
    if (resultRef.current) {
      onResult(resultRef.current, language);
    }
    recRef.current?.stop();
    setIsListening(false);
  }, [clearTimer, clearSilenceTimer, onResult, language]);

  /* ── Toggle ── */
  const toggleListening = useCallback(() => {
    if (isListening) stopListening();
    else startListening();
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    isSupported,
    recognitionStatus,
    startListening,
    stopListening,
    toggleListening,
  };
}

/* ── Human-friendly error messages ── */
function friendlyError(code: string): string {
  switch (code) {
    case 'not-allowed':
      return 'Microphone permission denied. Please allow mic access in your browser settings.';
    case 'network':
      return 'Network error — speech recognition requires an internet connection on most browsers.';
    case 'service-not-allowed':
      return 'Speech service blocked. Make sure the page is served over HTTPS.';
    case 'audio-capture':
      return 'No microphone found. Please connect a mic and try again.';
    default:
      return `Recognition error: ${code}`;
  }
}
