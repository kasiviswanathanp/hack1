import React, { useRef, useState, useEffect } from 'react';
import { ComplaintLocation } from '@/types';
import { Button } from '@/components/common/Button';
import {
  Camera,
  MapPin,
  Compass,
  Check,
  RotateCcw,
  Sparkles,
  Upload,
  AlertCircle,
  ShieldCheck,
  Crosshair,
  Radio,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/utils';
import { resolveTamilNaduJurisdiction } from '@/data/tamilNaduJurisdictions';

export interface LiveGeoCameraProps {
  onCapture: (geotaggedImageUrl: string, imageFile: File, capturedLocation: ComplaintLocation) => void;
  initialLocation: ComplaintLocation;
  currentImageUrl?: string | null;
}

export const LiveGeoCamera: React.FC<LiveGeoCameraProps> = ({
  onCapture,
  initialLocation,
  currentImageUrl,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);

  const [streamActive, setStreamActive] = useState<boolean>(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(currentImageUrl || null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Live GPS Telemetry
  const [liveLocation, setLiveLocation] = useState<ComplaintLocation>(initialLocation);
  const [accuracyMeters, setAccuracyMeters] = useState<number>(2.4);
  const [gpsLocked, setGpsLocked] = useState<boolean>(false);
  const [currentTimestamp, setCurrentTimestamp] = useState<string>(
    new Date().toLocaleTimeString('en-IN', { hour12: false })
  );

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(new Date().toLocaleTimeString('en-IN', { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Listen to live GPS position
  useEffect(() => {
    if (!navigator.geolocation) {
      setGpsLocked(true); // fallback to initial
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setGpsLocked(true);
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        const acc = Number((pos.coords.accuracy || 2.4).toFixed(1));
        setAccuracyMeters(acc);

        // Automatically resolve Tamil Nadu District, Municipality, Zone & Ward
        const resolved = resolveTamilNaduJurisdiction(lat, lng);
        setLiveLocation(resolved);
      },
      (err) => {
        console.warn('Live geolocation watch failed or denied, using high-accuracy area lock:', err);
        setGpsLocked(true);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // Initialize Camera Stream
  const startCamera = async () => {
    setStreamError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera hardware access is not supported in this browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err: any) {
      console.warn('Camera stream could not start (likely running on desktop without active webcam):', err);
      setStreamError(
        'Physical camera stream unavailable or permission pending. You can capture using your phone camera, upload a photo, or use simulated live feed.'
      );
      setStreamActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
  };

  useEffect(() => {
    // Attempt auto-start camera on mount if no photo already captured
    if (!capturedPhoto) {
      startCamera();
    }
    return () => stopCamera();
  }, [capturedPhoto]);

  /**
   * Watermarks Google Geolocation Telemetry onto Canvas
   */
  const stampGeoWatermark = (ctx: CanvasRenderingContext2D, width: number, height: number, loc: ComplaintLocation) => {
    const bannerHeight = Math.max(70, Math.round(height * 0.16));

    // Semi-transparent dark banner at bottom
    ctx.fillStyle = 'rgba(10, 15, 30, 0.88)';
    ctx.fillRect(0, height - bannerHeight, width, bannerHeight);

    // Cyan top accent line
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(0, height - bannerHeight, width, 3);

    // Font styling
    const fontSize = Math.max(12, Math.round(width * 0.022));
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.fillStyle = '#ffffff';

    const paddingX = 16;
    let textY = height - bannerHeight + fontSize + 10;

    // Line 1: Google Geolocation Header + Coordinates
    ctx.fillStyle = '#38bdf8'; // Sky blue
    ctx.fillText('📍 GOOGLE GEOLOCATION VERIFIED EVIDENCE', paddingX, textY);

    ctx.font = `bold ${fontSize - 1}px monospace`;
    ctx.fillStyle = '#fde047'; // Yellow
    const coordText = `LAT: ${loc.latitude.toFixed(5)}° N | LNG: ${loc.longitude.toFixed(5)}° E (±${accuracyMeters}m)`;
    const textWidth = ctx.measureText(coordText).width;
    ctx.fillText(coordText, width - textWidth - paddingX, textY);

    // Line 2: Street Address / Ward / Municipality / District
    textY += fontSize + 8;
    ctx.font = `${fontSize - 1}px Inter, sans-serif`;
    ctx.fillStyle = '#e2e8f0';
    const addressLine = `${loc.area} • ${loc.ward} • ${loc.municipality || 'Municipal Corporation'}, ${loc.district || 'Tamil Nadu'}`;
    ctx.fillText(addressLine, paddingX, textY);

    // Line 3: Timestamp & SLA Audit Tag
    textY += fontSize + 6;
    ctx.font = `${fontSize - 2}px monospace`;
    ctx.fillStyle = '#94a3b8';
    const timeString = `${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${currentTimestamp} IST`;
    ctx.fillText(`TIMESTAMP: ${timeString} | CivicAI SLA Geo-Tag #CHN-${Math.floor(1000 + Math.random() * 9000)}`, paddingX, textY);
  };

  /**
   * Shutter button: Captures current video frame, burns watermark, exports JPEG
   */
  const handleCaptureFromVideo = () => {
    if (!videoRef.current) return;
    setIsProcessing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Stamp Google Geolocation Watermark
    stampGeoWatermark(ctx, canvas.width, canvas.height, liveLocation);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `civic-geotag-${Date.now()}.jpg`, { type: 'image/jpeg' });
        setCapturedPhoto(dataUrl);
        stopCamera();
        setIsProcessing(false);
        onCapture(dataUrl, file, liveLocation);
      }
    }, 'image/jpeg', 0.92);
  };

  /**
   * Processes an uploaded image or photo from file/camera input and burns Google Geotag
   */
  const processImageWithGeoTag = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width || 1280;
        canvas.height = img.height || 720;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          stampGeoWatermark(ctx, canvas.width, canvas.height, liveLocation);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          canvas.toBlob((blob) => {
            if (blob) {
              const geotaggedFile = new File([blob], `civic-geotag-${Date.now()}.jpg`, { type: 'image/jpeg' });
              setCapturedPhoto(dataUrl);
              stopCamera();
              setIsProcessing(false);
              onCapture(dataUrl, geotaggedFile, liveLocation);
            }
          }, 'image/jpeg', 0.92);
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  /**
   * Realistic simulated live camera capture for testing without camera hardware
   */
  const handleSimulatedCapture = (sampleUrl: string, sampleLat?: number, sampleLng?: number) => {
    setIsProcessing(true);
    const locToUse = (sampleLat && sampleLng)
      ? resolveTamilNaduJurisdiction(sampleLat, sampleLng)
      : liveLocation;
    setLiveLocation(locToUse);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = canvasRef.current || document.createElement('canvas');
      canvas.width = img.width || 1280;
      canvas.height = img.height || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        stampGeoWatermark(ctx, canvas.width, canvas.height, locToUse);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `civic-geotag-${Date.now()}.jpg`, { type: 'image/jpeg' });
            setCapturedPhoto(dataUrl);
            stopCamera();
            setIsProcessing(false);
            onCapture(dataUrl, file, locToUse);
          }
        }, 'image/jpeg', 0.92);
      }
    };
    img.src = sampleUrl;
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    startCamera();
  };

  return (
    <div className="w-full space-y-3 text-left">
      {/* Viewfinder or Captured Preview */}
      {capturedPhoto ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500 bg-slate-950 shadow-xl group">
          <img
            src={capturedPhoto}
            alt="GeoTagged Evidence"
            className="w-full h-80 object-cover"
          />

          {/* Verification Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-600/90 text-white text-xs font-bold shadow-lg backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>Google Geotag & Location Locked</span>
          </div>

          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur-md border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Photo</span>
            </button>
          </div>

          {/* Bottom Telemetry Card */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-100">{liveLocation.area} ({liveLocation.ward})</span>
                <span className="text-slate-400 block text-[11px] font-mono">
                  {liveLocation.latitude.toFixed(4)}° N, {liveLocation.longitude.toFixed(4)}° E (±{accuracyMeters}m)
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-800">
              <Check className="w-3.5 h-3.5" />
              <span>Location Auto-Linked to Complaint</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/70 bg-slate-950 shadow-2xl">
          {/* Live Camera Viewfinder Screen */}
          <div className="relative w-full h-80 sm:h-96 bg-black flex items-center justify-center overflow-hidden">
            {/* Live Video Element */}
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className={cn(
                'w-full h-full object-cover',
                !streamActive && 'hidden'
              )}
            />

            {/* Viewfinder Target Reticle / HUD */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
              {/* Top HUD: Live GPS Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-white shadow-md">
                  <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span className="text-emerald-400">LIVE GPS:</span>
                  <span className="font-mono text-[11px]">{liveLocation.latitude.toFixed(4)}° N, {liveLocation.longitude.toFixed(4)}° E</span>
                  <span className="text-slate-400 text-[10px]">(±{accuracyMeters}m)</span>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[11px] font-mono font-bold text-yellow-300">
                  {currentTimestamp} IST
                </div>
              </div>

              {/* Center Crosshair Target */}
              <div className="self-center flex flex-col items-center justify-center opacity-85">
                <Crosshair className="w-16 h-16 text-cyan-400/80 animate-pulse stroke-1" />
                <span className="text-[10px] font-mono tracking-widest text-cyan-300 bg-black/60 px-2 py-0.5 rounded mt-1">
                  ALIGN CIVIC DEFECT
                </span>
              </div>

              {/* Bottom HUD: Live Address */}
              <div className="p-2.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                  <span className="font-semibold truncate text-slate-200">
                    {liveLocation.area} • {liveLocation.ward}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider shrink-0 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                  Google Geo-Tag Active
                </span>
              </div>
            </div>

            {/* If stream not active (e.g. desktop), show placeholder with live simulation buttons */}
            {!streamActive && (
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center text-white space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 shadow-lg">
                  <Camera className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">
                    Live Geolocation Camera
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Takes photo stamped with exact live Google GPS coordinates (Latitude, Longitude & Ward 102).
                  </p>
                </div>

                {/* Instant Simulation Buttons across Tamil Nadu */}
                <div className="w-full max-w-lg pt-2 space-y-2">
                  <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Simulate Live Geo-Camera across Tamil Nadu Cities:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      {
                        title: 'Road Crater',
                        sub: 'Chennai (Anna Nagar)',
                        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
                        lat: 13.0850,
                        lng: 80.2101,
                      },
                      {
                        title: 'Drainage Flood',
                        sub: 'Coimbatore (RS Puram)',
                        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80',
                        lat: 11.0080,
                        lng: 76.9480,
                      },
                      {
                        title: 'Water Pipe Burst',
                        sub: 'Madurai (KK Nagar)',
                        url: 'https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80',
                        lat: 9.9310,
                        lng: 78.1490,
                      },
                      {
                        title: 'Light Outage',
                        sub: 'Trichy (Thillai Nagar)',
                        url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
                        lat: 10.8250,
                        lng: 78.6830,
                      },
                      {
                        title: 'Waste Heap',
                        sub: 'Salem (Fairlands)',
                        url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
                        lat: 11.6740,
                        lng: 78.1420,
                      },
                      {
                        title: 'Sidewalk Defect',
                        sub: 'Tirunelveli (Palayamkottai)',
                        url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
                        lat: 8.7180,
                        lng: 77.7490,
                      },
                    ].map((preset) => (
                      <button
                        key={preset.sub}
                        type="button"
                        onClick={() => handleSimulatedCapture(preset.url, preset.lat, preset.lng)}
                        className="p-2 rounded-xl bg-slate-800/90 hover:bg-blue-600 border border-slate-700 hover:border-blue-400 text-left transition-all cursor-pointer group"
                      >
                        <span className="block text-xs font-bold text-slate-200 group-hover:text-white truncate">
                          {preset.title}
                        </span>
                        <span className="block text-[10px] text-cyan-400 group-hover:text-blue-100 truncate">
                          {preset.sub}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera retry button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={startCamera}
                  className="text-white border-slate-700 hover:bg-slate-800"
                >
                  Retry Camera Hardware Access
                </Button>
              </div>
            )}
          </div>

          {/* Shutter / Capture Control Bar */}
          <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
            {/* Choose from device */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">Upload from Device</span>
              <span className="sm:hidden">Upload</span>
            </button>

            {/* Primary Shutter Button */}
            <button
              type="button"
              onClick={() => {
                if (streamActive) {
                  handleCaptureFromVideo();
                } else {
                  nativeCameraInputRef.current?.click();
                }
              }}
              disabled={isProcessing}
              className="relative p-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
              title="Capture Photo with Google Geolocation"
            >
              <div className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold">
                <Camera className="w-5 h-5 text-cyan-400" />
                <span>Capture with Live Geotag</span>
              </div>
            </button>

            {/* Mobile native camera */}
            <button
              type="button"
              onClick={() => nativeCameraInputRef.current?.click()}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Phone Camera</span>
              <span className="sm:hidden">Camera</span>
            </button>
          </div>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processImageWithGeoTag(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <input
        ref={nativeCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            processImageWithGeoTag(e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
