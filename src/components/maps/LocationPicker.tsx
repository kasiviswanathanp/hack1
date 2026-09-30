import React, { useState, useEffect } from 'react';
import { ComplaintLocation } from '@/types';
import {
  TAMIL_NADU_DISTRICTS,
  TAMIL_NADU_MUNICIPALITIES,
  TamilNaduDistrict,
  resolveTamilNaduJurisdiction,
  getMunicipalitiesByDistrict,
} from '@/data/tamilNaduJurisdictions';
import {
  MapPin,
  Navigation,
  Compass,
  AlertCircle,
  CheckCircle2,
  Building,
  Layers,
  Sparkles,
  ExternalLink,
  LocateFixed,
} from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { cn } from '@/utils';

export interface LocationPickerProps {
  location: ComplaintLocation;
  onChange: (location: ComplaintLocation) => void;
  isDetecting: boolean;
  onDetect: () => void;
  permissionDenied?: boolean;
  error?: string | null;
  className?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  location,
  onChange,
  isDetecting,
  onDetect,
  permissionDenied,
  error,
  className,
}) => {
  // Cascading Selection States initialized from current location
  const [selectedDistrict, setSelectedDistrict] = useState<TamilNaduDistrict>(
    (location.district as TamilNaduDistrict) || 'Chennai'
  );

  const currentMuniName = location.municipality || 'Chennai (Greater Chennai Corporation)';
  const [selectedMunicipalityName, setSelectedMunicipalityName] = useState<string>(currentMuniName);
  const [selectedZoneName, setSelectedZoneName] = useState<string>(location.zone || 'Zone 8 (Central - Anna Nagar)');
  const [selectedWardName, setSelectedWardName] = useState<string>(location.ward || 'Ward 102');

  // Keep cascading states synchronized when location prop changes from GPS
  useEffect(() => {
    if (location.district) {
      setSelectedDistrict(location.district as TamilNaduDistrict);
    }
    if (location.municipality) {
      setSelectedMunicipalityName(location.municipality);
    }
    if (location.zone) {
      setSelectedZoneName(location.zone);
    }
    if (location.ward) {
      setSelectedWardName(location.ward);
    }
  }, [location]);

  // Derived available municipalities in chosen district
  const availableMunicipalities = getMunicipalitiesByDistrict(selectedDistrict);
  const currentMunicipality =
    availableMunicipalities.find((m) => m.name === selectedMunicipalityName) ||
    availableMunicipalities[0] ||
    TAMIL_NADU_MUNICIPALITIES[0];

  // Derived available zones in chosen municipality
  const availableZones = currentMunicipality.zones;
  const currentZone =
    availableZones.find((z) => z.zoneName === selectedZoneName) ||
    availableZones[0];

  // Derived available wards in chosen zone
  const availableWards = currentZone?.wards || [];

  /**
   * Handle District Change: cascades to primary municipality, zone, ward & updates map coordinates
   */
  const handleDistrictChange = (dist: TamilNaduDistrict) => {
    setSelectedDistrict(dist);
    const munis = getMunicipalitiesByDistrict(dist);
    const primaryMuni = munis[0] || TAMIL_NADU_MUNICIPALITIES[0];
    setSelectedMunicipalityName(primaryMuni.name);

    const primaryZone = primaryMuni.zones[0];
    setSelectedZoneName(primaryZone.zoneName);

    const primaryWard = primaryZone.wards[0];
    setSelectedWardName(primaryWard.ward);

    const pin = primaryWard.pinCode ? ` - ${primaryWard.pinCode}` : '';
    onChange({
      latitude: primaryWard.lat,
      longitude: primaryWard.lng,
      district: dist,
      municipality: primaryMuni.name,
      zone: primaryZone.zoneName,
      ward: primaryWard.ward,
      area: primaryWard.area,
      readableAddress: `${primaryWard.area}, ${primaryWard.ward}, ${primaryMuni.name}, ${dist} District${pin}`,
    });
  };

  /**
   * Handle Municipality / Corporation Change
   */
  const handleMunicipalityChange = (muniName: string) => {
    setSelectedMunicipalityName(muniName);
    const muni = availableMunicipalities.find((m) => m.name === muniName) || availableMunicipalities[0];
    const primaryZone = muni.zones[0];
    setSelectedZoneName(primaryZone.zoneName);
    const primaryWard = primaryZone.wards[0];
    setSelectedWardName(primaryWard.ward);

    const pin = primaryWard.pinCode ? ` - ${primaryWard.pinCode}` : '';
    onChange({
      latitude: primaryWard.lat,
      longitude: primaryWard.lng,
      district: muni.district,
      municipality: muni.name,
      zone: primaryZone.zoneName,
      ward: primaryWard.ward,
      area: primaryWard.area,
      readableAddress: `${primaryWard.area}, ${primaryWard.ward}, ${muni.name}, ${muni.district} District${pin}`,
    });
  };

  /**
   * Handle Zone Change
   */
  const handleZoneChange = (zoneName: string) => {
    setSelectedZoneName(zoneName);
    const zone = availableZones.find((z) => z.zoneName === zoneName) || availableZones[0];
    const primaryWard = zone.wards[0];
    setSelectedWardName(primaryWard.ward);

    const pin = primaryWard.pinCode ? ` - ${primaryWard.pinCode}` : '';
    onChange({
      ...location,
      zone: zone.zoneName,
      ward: primaryWard.ward,
      area: primaryWard.area,
      latitude: primaryWard.lat,
      longitude: primaryWard.lng,
      readableAddress: `${primaryWard.area}, ${primaryWard.ward}, ${currentMunicipality.name}, ${selectedDistrict} District${pin}`,
    });
  };

  /**
   * Handle Ward Change
   */
  const handleWardChange = (wardNum: string) => {
    setSelectedWardName(wardNum);
    const wardObj = availableWards.find((w) => w.ward === wardNum) || availableWards[0];

    const pin = wardObj.pinCode ? ` - ${wardObj.pinCode}` : '';
    onChange({
      ...location,
      ward: wardObj.ward,
      area: wardObj.area,
      latitude: wardObj.lat,
      longitude: wardObj.lng,
      readableAddress: `${wardObj.area}, ${wardObj.ward}, ${currentMunicipality.name}, ${selectedDistrict} District${pin}`,
    });
  };

  /**
   * Clicking on the Interactive Map: Automatically reverse-geocodes Tamil Nadu Jurisdiction
   */
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Map bounds for Tamil Nadu:
    // Lat: 8.0 (Kanyakumari) to 13.5 (Tiruvallur/Chennai)
    // Lng: 76.2 (Nilgiris/Coimbatore) to 80.4 (Chennai/Cuddalore/Bay of Bengal)
    const normalizedY = y / rect.height;
    const normalizedX = x / rect.width;

    const clickedLat = Number((13.5 - normalizedY * (13.5 - 8.0)).toFixed(5));
    const clickedLng = Number((76.2 + normalizedX * (80.4 - 76.2)).toFixed(5));

    // Automatically resolve Tamil Nadu District, Municipality, Zone and Ward!
    const autoResolved = resolveTamilNaduJurisdiction(clickedLat, clickedLng);
    onChange(autoResolved);
  };

  return (
    <div className={cn('rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs text-left space-y-6', className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-blue-600" />
            <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
              Step 2: Tamil Nadu Civic Jurisdiction & Geolocation
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Auto-detects your District, Municipal Corporation, Zone, and Ward from live GPS coordinates.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={onDetect}
          isLoading={isDetecting}
          leftIcon={<Navigation className="w-4 h-4 text-white" />}
          className="shadow-sm shadow-blue-500/25 shrink-0"
        >
          {isDetecting ? 'Detecting Live GPS...' : 'Detect My Live Location'}
        </Button>
      </div>

      {/* Permission warning if denied */}
      {permissionDenied && (
        <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Browser GPS Permission Required for Auto-Detect:</span>
            <p className="leading-relaxed">
              Browser location permission was not granted. You can pick your district, municipal corporation, zone, and ward below, or click anywhere on the Tamil Nadu map!
            </p>
          </div>
        </div>
      )}

      {/* AUTOMATICALLY RESOLVED JURISDICTION STATUS BADGE CARD */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-blue-50 to-indigo-50 border border-emerald-200/80 p-4 text-left shadow-2xs space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Automatically Resolved Jurisdiction (Google Live Geolocation)</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded-full border border-slate-200">
            GPS: {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">District (38 TN)</span>
            <span className="font-extrabold text-slate-900 truncate block">{location.district || 'Chennai'}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Municipality / Corp</span>
            <span className="font-extrabold text-blue-700 truncate block">{location.municipality || 'Greater Chennai Corporation'}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Assigned Zone</span>
            <span className="font-bold text-slate-800 truncate block">{location.zone || 'Zone 8'}</span>
          </div>
          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Ward & Area</span>
            <span className="font-extrabold text-indigo-700 truncate block">{location.ward} - {location.area}</span>
          </div>
        </div>
      </div>

      {/* INTERACTIVE TAMIL NADU MAP CANVAS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Interactive Tamil Nadu Map (Click anywhere to auto-resolve location):</span>
          </span>
          <span className="text-slate-400 text-[11px]">Pin auto-updates Corporation & Ward</span>
        </div>

        <div
          onClick={handleMapClick}
          className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border-2 border-slate-300 bg-slate-900 cursor-crosshair group shadow-inner"
          title="Click anywhere in Tamil Nadu to auto-detect district and municipal zone"
        >
          {/* Subtle grid pattern background */}
          <div
            className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
          />

          {/* Map Vector Graphic of Tamil Nadu coastline & key landmarks */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 400" preserveAspectRatio="none">
            {/* Tamil Nadu State Outline representation */}
            <path
              d="M 120 40 L 420 40 L 440 90 L 390 190 L 410 270 L 360 380 L 190 380 L 140 280 L 110 150 Z"
              fill="rgba(30, 41, 59, 0.7)"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            {/* Major Tamil Nadu city markers */}
            {[
              { name: 'Chennai', x: 420, y: 70 },
              { name: 'Avadi', x: 395, y: 65 },
              { name: 'Tambaram', x: 410, y: 95 },
              { name: 'Vellore', x: 330, y: 80 },
              { name: 'Hosur', x: 250, y: 85 },
              { name: 'Salem', x: 265, y: 160 },
              { name: 'Erode', x: 235, y: 185 },
              { name: 'Coimbatore', x: 190, y: 200 },
              { name: 'Tiruppur', x: 220, y: 195 },
              { name: 'Trichy', x: 295, y: 215 },
              { name: 'Thanjavur', x: 325, y: 215 },
              { name: 'Dindigul', x: 250, y: 250 },
              { name: 'Madurai', x: 260, y: 285 },
              { name: 'Sivakasi', x: 230, y: 320 },
              { name: 'Tirunelveli', x: 230, y: 360 },
              { name: 'Thoothukudi', x: 270, y: 355 },
              { name: 'Nagercoil', x: 205, y: 390 },
            ].map((city) => (
              <g key={city.name}>
                <circle cx={city.x} cy={city.y} r="3" fill="#38bdf8" />
                <text x={city.x + 6} y={city.y + 3} fill="#94a3b8" fontSize="9" fontFamily="Inter, sans-serif">
                  {city.name}
                </text>
              </g>
            ))}
          </svg>

          {/* Interactive Live Pin Marker positioned relative to location coordinates */}
          {(() => {
            // Lat 8 to 13.5 -> Y: 100% to 0%
            // Lng 76.2 to 80.4 -> X: 0% to 100%
            const topPct = Math.min(94, Math.max(6, ((13.5 - location.latitude) / (13.5 - 8.0)) * 100));
            const leftPct = Math.min(94, Math.max(6, ((location.longitude - 76.2) / (80.4 - 76.2)) * 100));

            return (
              <div
                style={{ top: `${topPct}%`, left: `${leftPct}%` }}
                className="absolute -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-300 z-30"
              >
                {/* Pulsing beacon */}
                <div className="relative flex flex-col items-center">
                  <div className="px-2 py-0.5 rounded-md bg-rose-600 text-white text-[10px] font-extrabold shadow-lg whitespace-nowrap mb-1">
                    📍 {location.area || 'Selected Location'} ({location.ward})
                  </div>
                  <div className="relative">
                    <MapPin className="w-8 h-8 text-rose-500 fill-rose-600 filter drop-shadow-lg" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1.5 bg-rose-500/50 rounded-full animate-ping" />
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Overlay instruction */}
          <div className="absolute bottom-3 left-3 bg-slate-900/85 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-white text-xs flex items-center gap-2">
            <LocateFixed className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="font-mono text-[11px]">
              {location.latitude.toFixed(4)}° N, {location.longitude.toFixed(4)}° E • {location.municipality}
            </span>
          </div>

          <div className="absolute top-3 right-3 bg-blue-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-xs">
            Tamil Nadu GIS Grid
          </div>
        </div>

        {/* Quick jump to major Tamil Nadu cities */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-500 uppercase">Quick Jump:</span>
          {[
            { label: 'Chennai', dist: 'Chennai' as const },
            { label: 'Coimbatore', dist: 'Coimbatore' as const },
            { label: 'Madurai', dist: 'Madurai' as const },
            { label: 'Trichy', dist: 'Tiruchirappalli' as const },
            { label: 'Salem', dist: 'Salem' as const },
            { label: 'Tiruppur', dist: 'Tiruppur' as const },
            { label: 'Tambaram', dist: 'Chengalpattu' as const },
            { label: 'Avadi', dist: 'Tiruvallur' as const },
            { label: 'Tirunelveli', dist: 'Tirunelveli' as const },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleDistrictChange(item.dist)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer border',
                selectedDistrict === item.dist
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 4 CASCADING SELECTORS (District -> Municipality -> Zone -> Ward) */}
      <div className="space-y-3 pt-2 border-t border-slate-100">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-blue-600" />
          <span>Manual Administrative Override (All 38 Districts & Corporations)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* 1. All 38 Tamil Nadu Districts */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              1. District (38 Districts)
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value as TamilNaduDistrict)}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {TAMIL_NADU_DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d} District
                </option>
              ))}
            </select>
          </div>

          {/* 2. Municipal Corporation / Municipality in District */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              2. Municipality / Corporation
            </label>
            <select
              value={selectedMunicipalityName}
              onChange={(e) => handleMunicipalityChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {availableMunicipalities.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Zone in Municipality */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              3. Administrative Zone
            </label>
            <select
              value={selectedZoneName}
              onChange={(e) => handleZoneChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {availableZones.map((z) => (
                <option key={z.zoneName} value={z.zoneName}>
                  {z.zoneName}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Ward & Area in Zone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              4. Ward & Neighborhood
            </label>
            <select
              value={selectedWardName}
              onChange={(e) => handleWardChange(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 bg-slate-50 font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {availableWards.map((w) => (
                <option key={w.ward} value={w.ward}>
                  {w.ward} ({w.area})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Address Text Input */}
        <div className="pt-2">
          <Input
            label="Specific Street / Door No. / Landmark"
            value={location.readableAddress}
            onChange={(e) => onChange({ ...location, readableAddress: e.target.value })}
            placeholder="e.g. 2nd Avenue, near Roundtana Metro Station Exit B"
            prefixIcon={<MapPin className="w-4 h-4 text-blue-600" />}
            helperText="Provides field engineers with exact ground reference to resolve grievance within SLA deadline"
          />
        </div>
      </div>
    </div>
  );
};
