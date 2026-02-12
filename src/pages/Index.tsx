import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, BookHeart, Plus, HeartPulse } from 'lucide-react';
import { VoiceOrb, type OrbState } from '@/components/VoiceOrb';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { LanguageSelector, type Language } from '@/components/LanguageSelector';
import { QuickActions } from '@/components/QuickActions';
import { Disclaimer } from '@/components/Disclaimer';
import { HospitalMap } from '@/components/HospitalMap';
import { FirstAidGuide } from '@/components/FirstAidGuide';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useAudioLevel } from '@/hooks/useAudioLevel';
import { useMedicalAnalysis } from '@/hooks/useMedicalAnalysis';
import { t } from '@/lib/translations';
import healthBg from '@/assets/health-bg.jpg';

const getDefaultLanguage = (): Language => {
  return 'kn'; // Default to Kannada
};

const Index = () => {
  // Single source of truth for language - user selected language ONLY
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(getDefaultLanguage);
  
  const [orbState, setOrbState] = useState<OrbState>('idle');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [lastHeard, setLastHeard] = useState('');
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showHospitalMap, setShowHospitalMap] = useState(false);
  const [showFirstAid, setShowFirstAid] = useState(false);
  const [insecureContext, setInsecureContext] = useState(false);
  
  const hasRespondedRef = useRef(false);
  const hasGreetedRef = useRef(false);
  const hasRequestedMicRef = useRef(false);
  const responseTimerRef = useRef<number | null>(null);

  const { analyze, getGreeting } = useMedicalAnalysis();
  const { speak, isSpeaking } = useTextToSpeech();

  // Handle voice recognition results - Use SELECTED language for response
  // Guard against duplicate calls (continuous mode may fire onResult multiple times)
  const lastProcessedRef = useRef('');

  const handleResult = useCallback((transcript: string, _languageHint: Language) => {
    const trimmed = transcript.trim();
    if (!trimmed) {
      console.info('Empty transcript received, ignoring');
      return;
    }

    // Deduplicate: skip if we already processed this exact transcript
    if (trimmed === lastProcessedRef.current) {
      console.info('Duplicate transcript, skipping:', trimmed);
      return;
    }
    lastProcessedRef.current = trimmed;

    console.info('Voice recognition result:', { transcript: trimmed, selectedLanguage });
    
    hasRespondedRef.current = true;
    setLastHeard(trimmed);
    setIsProcessing(true);

    // Analyze using the SELECTED language, NOT the detected one
    const analysis = analyze(trimmed, selectedLanguage);
    const response = analysis.response;

    console.info('AI Analysis:', { input: trimmed, language: selectedLanguage, response });

    if (responseTimerRef.current) {
      window.clearTimeout(responseTimerRef.current);
    }

    responseTimerRef.current = window.setTimeout(() => {
      setResponseText(response);
      setIsProcessing(false);
      // Speak in the SELECTED language
      speak(response, selectedLanguage);
      console.info('TTS: Speaking response in', selectedLanguage);
    }, 200);
  }, [selectedLanguage, analyze, speak]);

  const handleRecognitionEnd = useCallback((_finalTranscript: string, _languageHint: Language) => {
    console.info('Voice recognition ended');
    // Recognition end is handled automatically
  }, []);

  // Voice recognition - always uses selected language ONLY
  const { isListening, isSupported, recognitionStatus, toggleListening } = useVoiceRecognition({
    language: selectedLanguage,
    onResult: handleResult,
    onError: setSpeechError,
    onEnd: handleRecognitionEnd,
    maxListenMs: 15000,
  });

  const { audioLevel, micStatus, micError, requestMicPermission } = useAudioLevel(isListening);

  // Update orb state based on current activity
  useEffect(() => {
    if (isListening) {
      setIsExpanded(true);
      setOrbState('listening');
      hasRespondedRef.current = false;
      setSpeechError(null);
      return;
    }

    setIsExpanded(false);

    if (isProcessing) {
      setOrbState('processing');
      return;
    }

    if (isSpeaking) {
      setOrbState('responding');
      return;
    }

    setOrbState('idle');
  }, [isListening, isProcessing, isSpeaking]);

  // Request microphone permission on mount
  useEffect(() => {
    if (hasRequestedMicRef.current) {
      return;
    }
    hasRequestedMicRef.current = true;
    requestMicPermission();
  }, [requestMicPermission]);

  // Detect insecure context (mobile over HTTP won't support Speech API)
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.isSecureContext) {
      setInsecureContext(true);
      console.warn('Insecure context detected — Speech API requires HTTPS on mobile');
    }
  }, []);

  // Greet user on mount and when language changes (in selected language)
  useEffect(() => {
    if (hasGreetedRef.current) {
      return;
    }

    hasGreetedRef.current = true;
    const greeting = getGreeting(selectedLanguage);
    const timer = setTimeout(() => {
      setResponseText(greeting);
      speak(greeting, selectedLanguage);
      console.info('TTS: Greeting in', selectedLanguage);
    }, 1000);

    return () => clearTimeout(timer);
  }, [selectedLanguage, getGreeting, speak]);

  // Orb tap handler
  const handleOrbTap = useCallback(() => {
    console.info('Orb tapped', { isSupported, recognitionStatus, selectedLanguage });
    
    if (recognitionStatus === 'unsupported') {
      alert(t.unsupportedBrowser[selectedLanguage]);
      return;
    }
    
    try {
      toggleListening();
    } catch (error) {
      console.error('Failed to toggle listening:', error);
      setSpeechError('Failed to start listening. Please try again.');
    }
  }, [recognitionStatus, isSupported, toggleListening, selectedLanguage]);

  const handleOpenFirstAid = useCallback(() => {
    setShowFirstAid(true);
  }, []);

  const handleFindHospital = useCallback(() => {
    setShowHospitalMap(true);
  }, []);

  const handleCallAmbulance = useCallback(() => {
    window.location.href = 'tel:108';
  }, []);

  // Language change handler - key feature for strict language selection
  const handleLanguageChange = useCallback((lang: Language) => {
    console.info('Language changed:', { from: selectedLanguage, to: lang });
    setSelectedLanguage(lang);
    
    // Stop any ongoing speech or recognition
    if (isListening) {
      toggleListening();
    }
    
    // Clear previous conversation
    setLastHeard('');
    setResponseText('');
    setSpeechError(null);
    lastProcessedRef.current = '';
    
    // Greet in new language
    const greeting = getGreeting(lang);
    setTimeout(() => {
      setResponseText(greeting);
      speak(greeting, lang);
      console.info('TTS: Language changed, greeting in', lang);
    }, 300);
  }, [selectedLanguage, isListening, toggleListening, getGreeting, speak]);

  const statusHint = isListening
    ? t.listeningLong[selectedLanguage]
    : isProcessing
    ? t.processing[selectedLanguage]
    : isSpeaking
    ? t.responding[selectedLanguage]
    : '';

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: `url(${healthBg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/95" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 10% 20%, rgba(255,255,255,0.35) 0, transparent 40%),' +
            'radial-gradient(circle at 80% 10%, rgba(255,255,255,0.25) 0, transparent 45%),' +
            'radial-gradient(circle at 20% 85%, rgba(255,255,255,0.25) 0, transparent 45%)',
        }}
      />

      <motion.div
        className="absolute top-16 left-10 text-primary/30"
        animate={{ y: [0, -8, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <HeartPulse className="w-10 h-10" />
      </motion.div>
      <motion.div
        className="absolute bottom-24 right-12 text-safe/30"
        animate={{ y: [0, 10, 0], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <Plus className="w-8 h-8" />
      </motion.div>

      <div className="relative z-10 min-h-screen flex flex-col px-6 py-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-4"
        >
          <div className="flex items-center gap-3">
            <motion.div
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-glow-primary"
              animate={{ rotate: [0, 4, -4, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Heart className="w-6 h-6 text-primary-foreground" />
            </motion.div>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t.appName[selectedLanguage]}</h1>
              <p className="text-xs text-muted-foreground">{t.appSubtitle[selectedLanguage]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-full glass">
            <Shield className="w-4 h-4 text-safe" />
            <span className="text-xs font-medium text-safe">{t.safe[selectedLanguage]}</span>
          </div>
        </motion.header>

        {/* Language Selector - Prominent and Clear */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <LanguageSelector
            selected={selectedLanguage}
            onSelect={handleLanguageChange}
            disabled={isListening || isSpeaking}
          />
        </motion.div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 py-6">
          {/* First Aid Guide */}
          <motion.button
            onClick={handleOpenFirstAid}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-br from-safe/80 to-accent/80 text-white font-semibold flex items-center justify-center gap-3 shadow-soft"
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
          >
            <BookHeart className="w-6 h-6" />
            <span>{t.firstAid[selectedLanguage]}</span>
          </motion.button>

          {/* Response Bubble */}
          <TranscriptDisplay responseText={responseText} isSpeaking={isSpeaking} />

          {/* Last heard transcript */}
          {lastHeard && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center px-4"
            >
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                {t.heard[selectedLanguage]}
              </div>
              <div className="text-xs text-muted-foreground/80 font-medium">
                "{lastHeard}"
              </div>
            </motion.div>
          )}

          {/* Voice Orb - Central Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="relative"
          >
            <VoiceOrb
              state={orbState}
              audioLevel={audioLevel}
              onTap={handleOrbTap}
              isExpanded={isExpanded}
              language={selectedLanguage}
            />
          </motion.div>

          {/* Status hint */}
          {statusHint && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground font-medium"
            >
              {statusHint}
            </motion.p>
          )}

          {/* Debug info */}
          {isListening && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-muted-foreground/70 text-center px-4"
            >
              Mic: {micStatus}{micError ? ` • ${micError}` : ''}
            </motion.p>
          )}

          {/* Speech error */}
          {speechError && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] text-destructive text-center px-4 font-medium"
            >
              Error: {speechError}
            </motion.p>
          )}

          {/* Enable microphone button */}
          {(micStatus === 'denied' || micStatus === 'error') && (
            <motion.button
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={requestMicPermission}
              className="px-4 py-2 rounded-full border-2 border-primary text-sm text-primary hover:bg-primary/10 font-medium"
            >
              {t.enableMic[selectedLanguage]}
            </motion.button>
          )}

          {/* Insecure context warning for mobile users */}
          {insecureContext && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-center"
            >
              <p className="text-xs font-semibold text-amber-700">
                ⚠ {t.httpsWarning[selectedLanguage]}
              </p>
              <p className="text-[10px] text-amber-600 mt-1">
                {t.httpsSubtext[selectedLanguage]}
              </p>
            </motion.div>
          )}

          {/* Action Cards */}
          <QuickActions
            onFindHospital={handleFindHospital}
            onCallAmbulance={handleCallAmbulance}
            language={selectedLanguage}
          />
        </div>

        {/* Disclaimer */}
        <div className="flex justify-center pb-4">
          <Disclaimer language={selectedLanguage} />
        </div>
      </div>

      {/* Modals */}
      <HospitalMap
        isOpen={showHospitalMap}
        onClose={() => setShowHospitalMap(false)}
        language={selectedLanguage}
      />
      <FirstAidGuide
        isOpen={showFirstAid}
        onClose={() => setShowFirstAid(false)}
        language={selectedLanguage}
      />

      {/* Blur overlay when listening */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/40 backdrop-blur-md pointer-events-none z-0"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
