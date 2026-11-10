import { useCallback, useEffect, useRef, useState } from 'react';
import type { Language } from '@/components/LanguageSelector';

/**
 * BCP-47 codes used for SpeechSynthesis voice matching.
 */
const langCodes: Record<Language, string> = {
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  mr: 'mr-IN',
  en: 'en-US',
};

/* ── Google Translate TTS fallback ──
 * When the browser has no SpeechSynthesis voice for a language (common for
 * Kannada on Chrome/Windows), we fall back to Google Translate's TTS endpoint
 * via an <audio> element. The endpoint has a ~200-char limit per request, so
 * we split long text into chunks at natural break points. */

function chunkText(text: string, maxLen = 180): string[] {
  if (text.length <= maxLen) return [text];
  const chunks: string[] = [];
  let rest = text;
  while (rest.length > 0) {
    if (rest.length <= maxLen) {
      chunks.push(rest);
      break;
    }
    // Try to break at sentence-ending punctuation, then comma, then space
    let i = rest.lastIndexOf('।', maxLen); // Devanagari / Kannada danda
    if (i < maxLen * 0.3) i = rest.lastIndexOf('.', maxLen);
    if (i < maxLen * 0.3) i = rest.lastIndexOf(',', maxLen);
    if (i < maxLen * 0.3) i = rest.lastIndexOf(' ', maxLen);
    if (i < maxLen * 0.3) i = maxLen;
    chunks.push(rest.slice(0, i + 1).trim());
    rest = rest.slice(i + 1).trim();
  }
  return chunks.filter(Boolean);
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const googleAudioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);

  /* ── Load voices (async on Chrome/Android) ── */
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const load = () => {
      voicesRef.current = synth.getVoices();
      console.info(`TTS: ${voicesRef.current.length} voices loaded`);
    };

    load();
    synth.onvoiceschanged = load;
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  /* ── Pick the best voice for a language ── */
  const pickVoice = useCallback((language: Language): SpeechSynthesisVoice | null => {
    const code = langCodes[language].toLowerCase();
    const prefix = code.split('-')[0];

    const voices = voicesRef.current.length
      ? voicesRef.current
      : window.speechSynthesis.getVoices();

    // 1. Exact BCP-47 match
    let match = voices.find((v) => v.lang.toLowerCase() === code);
    if (match) return match;

    // 2. Prefix match (kn-*)
    match = voices.find((v) => v.lang.toLowerCase().startsWith(prefix));
    if (match) return match;

    return null;
  }, []);

  /* ── Chrome long-utterance keep-alive ── */
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearKeepAlive = useCallback(() => {
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
    }
  }, []);

  /* ── Google Translate TTS (plays audio chunks sequentially) ── */
  const speakViaGoogleTTS = useCallback(
    async (text: string, language: Language) => {
      const tl = langCodes[language].split('-')[0]; // 'kn', 'hi', etc.
      const chunks = chunkText(text);

      console.info('TTS: Using Google Translate TTS fallback for', tl, `(${chunks.length} chunk(s))`);
      abortRef.current = false;
      setIsSpeaking(true);

      try {
        for (const chunk of chunks) {
          if (abortRef.current) break;
          await new Promise<void>((resolve, reject) => {
            const encoded = encodeURIComponent(chunk);
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${tl}&client=tw-ob&q=${encoded}`;
            const audio = new Audio(url);
            googleAudioRef.current = audio;
            audio.onended = () => resolve();
            audio.onerror = () => reject(new Error('Google TTS chunk failed'));
            audio.play().catch(reject);
          });
        }
      } catch (err) {
        console.error('TTS: Google TTS fallback failed →', err);
      } finally {
        setIsSpeaking(false);
        googleAudioRef.current = null;
      }
    },
    [],
  );

  /* ── Speak ── */
  const speak = useCallback(
    (text: string, language: Language) => {
      const synth = window.speechSynthesis;
      if (!text?.trim()) {
        console.warn('TTS: empty text, skipping');
        return;
      }

      // Cancel anything currently playing
      synth?.cancel();
      clearKeepAlive();
      abortRef.current = true;
      if (googleAudioRef.current) {
        googleAudioRef.current.pause();
        googleAudioRef.current = null;
      }

      const voice = pickVoice(language);

      // ── No native voice → use Google Translate TTS audio fallback ──
      if (!voice) {
        console.warn(`TTS: No SpeechSynthesis voice for ${langCodes[language]} → Google TTS fallback`);
        speakViaGoogleTTS(text, language);
        return;
      }

      // ── Normal SpeechSynthesis path ──
      if (!synth) {
        console.error('TTS: SpeechSynthesis API not available');
        speakViaGoogleTTS(text, language);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCodes[language];
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.voice = voice;
      console.info('TTS: voice →', voice.name, voice.lang);

      utterance.onstart = () => {
        console.info('TTS: speech started');
        setIsSpeaking(true);
        keepAliveRef.current = setInterval(() => {
          if (synth.speaking && !synth.paused) {
            synth.pause();
            synth.resume();
          }
        }, 5000);
      };

      utterance.onend = () => {
        console.info('TTS: speech ended');
        clearKeepAlive();
        setIsSpeaking(false);
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted') return;
        console.error('TTS: SpeechSynthesis error →', e.error ?? e);
        clearKeepAlive();
        setIsSpeaking(false);
        // If SpeechSynthesis fails, try Google TTS as last resort
        console.info('TTS: Falling back to Google TTS after SpeechSynthesis error');
        speakViaGoogleTTS(text, language);
      };

      synth.speak(utterance);
      console.info('TTS: speak() queued', {
        lang: utterance.lang,
        textLen: text.length,
        voiceName: voice.name,
      });
    },
    [pickVoice, clearKeepAlive, speakViaGoogleTTS],
  );

  /* ── Stop ── */
  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    clearKeepAlive();
    abortRef.current = true;
    if (googleAudioRef.current) {
      googleAudioRef.current.pause();
      googleAudioRef.current = null;
    }
    setIsSpeaking(false);
  }, [clearKeepAlive]);

  return { speak, stop, isSpeaking };
}
