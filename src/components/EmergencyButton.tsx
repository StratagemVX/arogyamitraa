import { motion, AnimatePresence } from 'framer-motion';
import { Phone, AlertTriangle } from 'lucide-react';
import type { Language } from '@/components/LanguageSelector';
import { t } from '@/lib/translations';

interface EmergencyButtonProps {
  onCall: () => void;
  isVisible: boolean;
  language: Language;
}

export function EmergencyButton({ onCall, isVisible, language }: EmergencyButtonProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          className="w-full"
        >
          <motion.button
            onClick={onCall}
            className="
              w-full py-5 px-6 rounded-3xl
              bg-emergency text-emergency-foreground
              font-semibold text-xl
              shadow-glow-emergency
              flex items-center justify-center gap-4
              relative overflow-hidden
            "
            whileTap={{ scale: 0.98 }}
            animate={{ 
              boxShadow: [
                '0 8px 40px -8px hsl(var(--emergency) / 0.5)',
                '0 12px 60px -8px hsl(var(--emergency) / 0.7)',
                '0 8px 40px -8px hsl(var(--emergency) / 0.5)',
              ]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <motion.div
              className="absolute inset-0 bg-emergency-foreground/20"
              animate={{ opacity: [0, 0.3, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            
            <Phone className="w-8 h-8" />
            <div className="flex flex-col items-start">
              <span className="text-lg">{t.ambulanceCall[language]}</span>
              <span className="text-sm opacity-80">108</span>
            </div>
            <AlertTriangle className="w-6 h-6 ml-auto animate-pulse" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
