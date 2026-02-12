import { motion } from 'framer-motion';
import { Info } from 'lucide-react';
import type { Language } from '@/components/LanguageSelector';
import { t } from '@/lib/translations';

interface DisclaimerProps {
  language: Language;
}

export function Disclaimer({ language }: DisclaimerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-muted-foreground text-xs"
    >
      <Info className="w-4 h-4 flex-shrink-0" />
      <p className="font-medium">{t.disclaimer[language]}</p>
    </motion.div>
  );
}
