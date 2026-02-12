import { motion } from 'framer-motion';
import {
  Activity,
  Bandage,
  Brain,
  HeartPulse,
  Pill,
  Thermometer,
  Wind,
} from 'lucide-react';
import type { Language } from '@/components/LanguageSelector';

interface SymptomQuickPickProps {
  language: Language;
  onSelect: (symptomText: string) => void;
}

const symptoms = [
  {
    id: 'fever',
    icon: Thermometer,
    labels: {
      kn: 'ಜ್ವರ',
      hi: 'बुखार',
      ta: 'காய்ச்சல்',
      te: 'జ్వరం',
      mr: 'ताप',
      en: 'Fever',
    },
  },
  {
    id: 'headache',
    icon: Brain,
    labels: {
      kn: 'ತಲೆನೋವು',
      hi: 'सिरदर्द',
      ta: 'தலைவலி',
      te: 'తలనొప్పి',
      mr: 'डोकेदुखी',
      en: 'Headache',
    },
  },
  {
    id: 'chest-pain',
    icon: HeartPulse,
    labels: {
      kn: 'ಎದೆ ನೋವು',
      hi: 'छाती में दर्द',
      ta: 'நெஞ்சு வலி',
      te: 'ఛాతీ నొప్పి',
      mr: 'छातीत दुखणे',
      en: 'Chest pain',
    },
  },
  {
    id: 'cough',
    icon: Wind,
    labels: {
      kn: 'ಖಾಸಿ',
      hi: 'खांसी',
      ta: 'இருமல்',
      te: 'దగ్గు',
      mr: 'खोकला',
      en: 'Cough',
    },
  },
  {
    id: 'stomach-pain',
    icon: Pill,
    labels: {
      kn: 'ಹೊಟ್ಟೆ ನೋವು',
      hi: 'पेट दर्द',
      ta: 'வயிற்று வலி',
      te: 'కడుపు నొప్పి',
      mr: 'पोटदुखी',
      en: 'Stomach pain',
    },
  },
  {
    id: 'dizziness',
    icon: Activity,
    labels: {
      kn: 'ತಲೆಸುತ್ತು',
      hi: 'चक्कर',
      ta: 'மயக்கம்',
      te: 'తల తిరగడం',
      mr: 'चक्कर',
      en: 'Dizziness',
    },
  },
  {
    id: 'injury',
    icon: Bandage,
    labels: {
      kn: 'ಗಾಯ',
      hi: 'चोट',
      ta: 'காயம்',
      te: 'గాయం',
      mr: 'जखम',
      en: 'Injury',
    },
  },
  {
    id: 'breathing',
    icon: Wind,
    labels: {
      kn: 'ಉಸಿರಾಟ ತೊಂದರೆ',
      hi: 'सांस में तकलीफ',
      ta: 'மூச்சு சிரமம்',
      te: 'శ్వాస సమస్య',
      mr: 'श्वास घेण्यास त्रास',
      en: 'Breathing trouble',
    },
  },
];

export function SymptomQuickPick({ language, onSelect }: SymptomQuickPickProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-foreground">Tap a symptom</h2>
        <span className="text-xs text-muted-foreground">No mic needed</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {symptoms.map((symptom, index) => (
          <motion.button
            key={symptom.id}
            type="button"
            onClick={() => onSelect(symptom.labels[language])}
            aria-label={symptom.labels[language]}
            className="
              rounded-2xl border border-border/60 bg-card/80 px-3 py-3
              flex items-center gap-3 shadow-soft transition
              hover:shadow-lg hover:-translate-y-0.5
            "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <symptom.icon className="w-5 h-5" />
            </span>
            <span className="text-xs font-medium text-left">{symptom.labels[language]}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
