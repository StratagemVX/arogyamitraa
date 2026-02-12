import { motion, AnimatePresence } from 'framer-motion';

interface TranscriptDisplayProps {
  responseText: string;
  isSpeaking: boolean;
}

export function TranscriptDisplay({ responseText, isSpeaking }: TranscriptDisplayProps) {
  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        <motion.div
          key={responseText || 'empty'}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          className="w-full rounded-3xl bg-card/80 border border-border/60 shadow-soft px-6 py-5 min-h-[96px]"
        >
          <p className="text-lg md:text-xl leading-relaxed text-foreground">
            {responseText || ' '}
          </p>
          {isSpeaking && (
            <motion.div
              className="mt-3 h-1 w-16 rounded-full bg-primary/60"
              animate={{ width: [24, 64, 24] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
