import { useEffect, useState } from 'react';

export function useServiceWorker() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('Service Worker registered:', reg);
          setRegistration(reg);
          setIsInstalled(true);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }

    // Online/Offline listeners
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const update = async () => {
    if (registration) {
      await registration.update();
    }
  };

  return {
    isOnline,
    isInstalled,
    update,
  };
}
