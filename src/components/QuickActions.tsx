import { motion } from 'framer-motion';
import { MapPin, Phone } from 'lucide-react';
import type { Language } from '@/components/LanguageSelector';
import { t } from '@/lib/translations';

interface QuickActionsProps {
  onFindHospital: () => void;
  onCallAmbulance: () => void;
  language: Language;
}

export function QuickActions({ onFindHospital, onCallAmbulance, language }: QuickActionsProps) {
  const actions = [
    {
      id: 'hospital',
      icon: MapPin,
      label: t.findHospital[language],
      onClick: onFindHospital,
      color: 'from-accent to-primary',
    },
    {
      id: 'ambulance',
      icon: Phone,
      label: t.callAmbulance[language],
      sub: '108',
      onClick: onCallAmbulance,
      color: 'from-emergency to-red-400',
    },
  ];

  return (
    <div className="flex gap-4 w-full">
      {actions.map((action, index) => (
        <motion.button
          key={action.id}
          onClick={action.onClick}
          className={`
            flex-1 py-4 px-4 rounded-2xl
            bg-gradient-to-br ${action.color}
            text-white
            flex flex-col items-center gap-2
            shadow-soft hover:shadow-lg
            transition-shadow
          `}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
        >
          <action.icon className="w-8 h-8" />
          <div className="text-center">
            <p className="font-semibold">{action.label}</p>
            {action.sub && <p className="text-xs opacity-80">{action.sub}</p>}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
