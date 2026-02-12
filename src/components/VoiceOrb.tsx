import { motion, AnimatePresence } from 'framer-motion';
import { Mic, AlertTriangle } from 'lucide-react';
import type { Language } from '@/components/LanguageSelector';
import { t } from '@/lib/translations';

export type OrbState = 'idle' | 'listening' | 'processing' | 'responding' | 'emergency';

interface VoiceOrbProps {
  state: OrbState;
  audioLevel: number;
  onTap: () => void;
  isExpanded: boolean;
  language: Language;
}

const stateColors = {
  idle: {
    primary: 'from-accent to-primary',
    glow: 'shadow-glow-primary',
    ring: 'border-primary/30',
  },
  listening: {
    primary: 'from-safe to-emerald-400',
    glow: 'shadow-glow-safe',
    ring: 'border-safe/30',
  },
  processing: {
    primary: 'from-warning to-amber-400',
    glow: 'shadow-glow-warning',
    ring: 'border-warning/30',
  },
  responding: {
    primary: 'from-accent to-primary',
    glow: 'shadow-glow-primary',
    ring: 'border-primary/30',
  },
  emergency: {
    primary: 'from-emergency to-red-400',
    glow: 'shadow-glow-emergency',
    ring: 'border-emergency/30',
  },
};

const stateLabels = {
  idle: 'tapToSpeak',
  listening: 'listening',
  processing: 'processing',
  responding: 'responding',
  emergency: 'emergency',
} as const;

export function VoiceOrb({ state, audioLevel, onTap, isExpanded, language }: VoiceOrbProps) {
  const colors = stateColors[state];
  const labelKey = stateLabels[state];
  const label = t[labelKey][language];
  
  // Scale based on audio level for listening state
  const audioScale = state === 'listening' ? 1 + (audioLevel * 0.15) : 1;
  
  return (
    <div className="relative flex flex-col items-center gap-6">
      {/* Ripple waves */}
      <AnimatePresence>
        {(state === 'listening' || state === 'emergency') && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute rounded-full bg-gradient-to-r ${colors.primary}`}
                initial={{ width: 120, height: 120, opacity: 0.6 }}
                animate={{ 
                  width: [120, 280], 
                  height: [120, 280], 
                  opacity: [0.4, 0] 
                }}
                transition={{
                  duration: state === 'emergency' ? 1 : 2,
                  repeat: Infinity,
                  delay: i * (state === 'emergency' ? 0.3 : 0.6),
                  ease: 'easeOut',
                }}
                style={{ 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  marginTop: '-60px',
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Main Orb Container */}
      <motion.button
        onPointerDown={onTap}
        type="button"
        className="relative z-10 focus:outline-none"
        whileTap={{ scale: 0.95 }}
        animate={{ scale: isExpanded ? 1.1 : 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Outer glow ring */}
        <motion.div
          className={`absolute inset-0 rounded-full border-4 ${colors.ring}`}
          animate={{ 
            scale: audioScale * 1.2,
            opacity: state === 'idle' ? 0.3 : 0.6,
          }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          style={{ width: 160, height: 160, top: -20, left: -20 }}
        />

        {/* Main orb */}
        <motion.div
          className={`
            relative w-[120px] h-[120px] rounded-full 
            bg-gradient-to-br ${colors.primary}
            ${colors.glow}
            flex items-center justify-center
            overflow-hidden
          `}
          animate={{ 
            scale: audioScale,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
        >
          {/* Inner glass effect */}
          <div className="absolute inset-2 rounded-full bg-white/20 backdrop-blur-sm" />
          
          {/* Shine effect */}
          <motion.div
            className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/40 blur-sm"
            animate={{ opacity: [0.4, 0.7, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10"
            animate={{ 
              scale: state === 'listening' ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 0.5, repeat: state === 'listening' ? Infinity : 0 }}
          >
            {state === 'emergency' ? (
              <AlertTriangle className="w-12 h-12 text-white drop-shadow-lg" />
            ) : state === 'listening' ? (
              <Mic className="w-12 h-12 text-white drop-shadow-lg" />
            ) : state === 'processing' ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full" />
              </motion.div>
            ) : state === 'responding' ? (
              <Mic className="w-12 h-12 text-white drop-shadow-lg" />
            ) : (
              <Mic className="w-12 h-12 text-white drop-shadow-lg" />
            )}
          </motion.div>

          {/* Audio level bars */}
          <AnimatePresence>
            {state === 'listening' && (
              <motion.div
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 bg-white/80 rounded-full"
                    animate={{ 
                      height: [4, 8 + Math.random() * audioLevel * 12, 4] 
                    }}
                    transition={{ 
                      duration: 0.3, 
                      repeat: Infinity, 
                      delay: i * 0.1,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>

      {/* Status Label */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={state}
      >
        <p className={`text-lg font-semibold ${
          state === 'emergency' ? 'text-emergency' : 
          state === 'listening' ? 'text-safe' :
          state === 'processing' ? 'text-warning' :
          state === 'responding' ? 'text-primary' :
          'text-muted-foreground'
        }`}>
          {label}
        </p>
      </motion.div>
    </div>
  );
}
