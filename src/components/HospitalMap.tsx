import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Phone, X, Loader2, Hospital, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Language } from '@/components/LanguageSelector';
import { t } from '@/lib/translations';

interface Location {
  lat: number;
  lng: number;
}

interface HospitalMapProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export function HospitalMap({ isOpen, onClose, language }: HospitalMapProps) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(() => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLoading(false);
      },
      (err) => {
        setError('Unable to get your location. Please enable location access.');
        setIsLoading(false);
        console.error('Geolocation error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    if (isOpen && !location) {
      getCurrentLocation();
    }
  }, [isOpen, location, getCurrentLocation]);

  const openGoogleMaps = useCallback(() => {
    if (location) {
      const url = `https://www.google.com/maps/search/hospital+near+me/@${location.lat},${location.lng},14z`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://www.google.com/maps/search/hospital+near+me', '_blank', 'noopener,noreferrer');
    }
  }, [location]);

  const openDirections = useCallback(() => {
    if (location) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=hospital+near+me&travelmode=driving`;
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://www.google.com/maps/search/hospital+near+me', '_blank', 'noopener,noreferrer');
    }
  }, [location]);

  const callEmergency = useCallback(() => {
    window.location.href = 'tel:108';
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-background/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="w-full max-w-lg bg-card rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Hospital className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">{t.nearbyHospitals[language]}</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Location Status */}
              <div className="p-4 rounded-2xl bg-muted/50">
                {isLoading ? (
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{t.findingLocation[language]}</span>
                  </div>
                ) : error ? (
                  <div className="flex items-center gap-3 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{error}</span>
                  </div>
                ) : location ? (
                  <div className="flex items-center gap-3 text-safe">
                    <MapPin className="w-5 h-5" />
                    <span>{t.locationDetected[language]}</span>
                  </div>
                ) : null}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3">
                <motion.button
                  onClick={openGoogleMaps}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Hospital className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{t.viewHospitals[language]}</p>
                  </div>
                  <MapPin className="w-6 h-6 ml-auto" />
                </motion.button>

                <motion.button
                  onClick={openDirections}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-accent to-safe text-white shadow-lg"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Navigation className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{t.getDirections[language]}</p>
                  </div>
                  <Navigation className="w-6 h-6 ml-auto" />
                </motion.button>

                <motion.button
                  onClick={callEmergency}
                  className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-br from-emergency to-red-400 text-emergency-foreground shadow-glow-emergency"
                  whileTap={{ scale: 0.98 }}
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-lg">{t.call108[language]}</p>
                  </div>
                  <Phone className="w-6 h-6 ml-auto animate-pulse" />
                </motion.button>
              </div>

              {/* Tip */}
              <p className="text-xs text-center text-muted-foreground pt-2">
                {t.govtHospitalTip[language]}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
