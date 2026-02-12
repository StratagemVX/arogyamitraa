import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, XCircle } from 'lucide-react';

export type Status = 'safe' | 'monitor' | 'emergency';

interface StatusIndicatorProps {
  status: Status;
  message?: string;
}

const statusConfig = {
  safe: {
    icon: CheckCircle,
    label: { kn: 'ಸುರಕ್ಷಿತ', en: 'Safe' },
    color: 'bg-safe/10 text-safe border-safe/30',
    iconColor: 'text-safe',
  },
  monitor: {
    icon: AlertCircle,
    label: { kn: 'ಗಮನಿಸಿ', en: 'Monitor' },
    color: 'bg-warning/10 text-warning border-warning/30',
    iconColor: 'text-warning',
  },
  emergency: {
    icon: XCircle,
    label: { kn: 'ತುರ್ತು', en: 'Emergency' },
    color: 'bg-emergency/10 text-emergency border-emergency/30',
    iconColor: 'text-emergency',
  },
};

export function StatusIndicator({ status, message }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-2xl border
        ${config.color}
      `}
    >
      <Icon className={`w-6 h-6 ${config.iconColor}`} />
      <div className="flex-1">
        <p className="font-semibold">{config.label.kn}</p>
        {message && (
          <p className="text-sm opacity-80 mt-0.5">{message}</p>
        )}
      </div>
    </motion.div>
  );
}
