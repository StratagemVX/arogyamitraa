import { motion } from 'framer-motion';

export type Language = 'kn' | 'hi' | 'en' | 'ta' | 'te' | 'mr';

export interface LanguageOption {
  id: Language;
  label: string;
  name: string;
  code: string;
}

export const languages: LanguageOption[] = [
  { id: 'kn', label: 'ಕನ್ನಡ', name: 'Kannada', code: 'kn-IN' },
  { id: 'hi', label: 'हिंदी', name: 'Hindi', code: 'hi-IN' },
  { id: 'te', label: 'తెలుగు', name: 'Telugu', code: 'te-IN' },
  { id: 'ta', label: 'தமிழ்', name: 'Tamil', code: 'ta-IN' },
  { id: 'mr', label: 'मराठी', name: 'Marathi', code: 'mr-IN' },
  { id: 'en', label: 'EN', name: 'English', code: 'en-US' },
];

interface LanguageSelectorProps {
  selected: Language;
  onSelect: (lang: Language) => void;
  disabled?: boolean;
}

export function LanguageSelector({ selected, onSelect, disabled = false }: LanguageSelectorProps) {
  return (
    <div className="w-full">
      <div className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide snap-x snap-mandatory">
        {languages.map((lang) => {
          const isSelected = selected === lang.id;
          return (
            <motion.button
              key={lang.id}
              onClick={() => !disabled && onSelect(lang.id)}
              disabled={disabled}
              whileTap={{ scale: 0.95 }}
              className={`
                relative flex-shrink-0 min-w-[85px] px-5 py-4 rounded-2xl snap-start
                flex flex-col items-center gap-1 transition-all duration-200
                ${isSelected
                  ? 'bg-gradient-to-br from-teal-400 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                  : 'bg-white text-gray-700 shadow-md hover:shadow-lg border border-gray-100'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span className={`text-xl font-bold leading-tight ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                {lang.label}
              </span>
              <span className={`text-[11px] font-medium ${isSelected ? 'text-white/90' : 'text-gray-500'}`}>
                {lang.name}
              </span>
              {isSelected && (
                <motion.div
                  layoutId="langDot"
                  className="absolute -bottom-1.5 w-2 h-2 rounded-full bg-white shadow-sm"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
