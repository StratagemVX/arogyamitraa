import { useState, useEffect, useCallback, useRef } from 'react';

type MicStatus = 'idle' | 'requesting' | 'granted' | 'denied' | 'error';

export function useAudioLevel(isListening: boolean) {
  const [audioLevel, setAudioLevel] = useState(0);
  const [micStatus, setMicStatus] = useState<MicStatus>('idle');
  const [micError, setMicError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>(0);

  const startAnalyzing = useCallback(async () => {
    try {
      setMicStatus('requesting');
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      setMicStatus('granted');

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
        setAudioLevel(average / 255);
        animationRef.current = requestAnimationFrame(updateLevel);
      };

      updateLevel();
    } catch (error) {
      const err = error as Error & { name?: string };
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setMicStatus('denied');
      } else {
        setMicStatus('error');
      }
      setMicError(err?.message ?? 'Microphone error');
      console.error('Failed to access microphone:', error);
    }
  }, []);

  const requestMicPermission = useCallback(async () => {
    try {
      setMicStatus('requesting');
      setMicError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setMicStatus('granted');
    } catch (error) {
      const err = error as Error & { name?: string };
      if (err?.name === 'NotAllowedError' || err?.name === 'PermissionDeniedError') {
        setMicStatus('denied');
      } else {
        setMicStatus('error');
      }
      setMicError(err?.message ?? 'Microphone error');
      console.error('Failed to request microphone permission:', error);
    }
  }, []);

  const stopAnalyzing = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevel(0);
    setMicStatus('idle');
  }, []);

  useEffect(() => {
    if (isListening) {
      startAnalyzing();
    } else {
      stopAnalyzing();
    }

    return () => stopAnalyzing();
  }, [isListening, startAnalyzing, stopAnalyzing]);

  return { audioLevel, micStatus, micError, requestMicPermission };
}
