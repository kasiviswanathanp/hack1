import { useState, useCallback } from 'react';
import { ComplaintLocation } from '@/types';
import { resolveTamilNaduJurisdiction } from '@/data/tamilNaduJurisdictions';

export function useGeolocation() {
  const [location, setLocation] = useState<ComplaintLocation>(() => {
    return resolveTamilNaduJurisdiction(13.0850, 80.2101);
  });
  const [isDetecting, setIsDetecting] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setPermissionDenied(true);
      return;
    }

    setIsDetecting(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsDetecting(false);
        setPermissionDenied(false);

        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));

        // Automatically resolve Tamil Nadu District, Municipality, Zone & Ward from live GPS
        const resolved = resolveTamilNaduJurisdiction(lat, lng);
        setLocation(resolved);
      },
      (err) => {
        setIsDetecting(false);
        setPermissionDenied(true);
        if (err.code === err.PERMISSION_DENIED) {
          setError('Location permission denied. You can manually select your district, municipality, zone and ward below.');
        } else {
          setError('Unable to retrieve your location. Please select manually.');
        }
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  }, []);

  const updateCoordinates = (lat: number, lng: number) => {
    const resolved = resolveTamilNaduJurisdiction(lat, lng);
    setLocation(resolved);
  };

  const updateCustomAddress = (address: string) => {
    setLocation((prev) => ({ ...prev, readableAddress: address }));
  };

  return {
    location,
    setLocation,
    isDetecting,
    permissionDenied,
    error,
    detectLocation,
    updateCoordinates,
    updateCustomAddress,
  };
}
