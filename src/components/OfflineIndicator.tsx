import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff } from 'lucide-react';

interface OfflineIndicatorProps {
  isOnline: boolean;
}

export function OfflineIndicator({ isOnline }: OfflineIndicatorProps) {
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-caution text-caution-foreground flex items-center gap-2 shadow-lg"
        >
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">ಆಫ್‌ಲೈನ್ • Offline</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
