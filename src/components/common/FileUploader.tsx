import React, { useRef, useState } from 'react';
import { Camera, UploadCloud, X, Check, Image as ImageIcon } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils';

export interface FileUploaderProps {
  onImageSelected: (dataUrl: string, file: File) => void;
  currentImageUrl?: string;
  label?: string;
  helperText?: string;
  className?: string;
  aspectRatio?: 'square' | 'video' | 'any';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onImageSelected,
  currentImageUrl,
  label = 'Damage Photo Evidence',
  helperText = 'Take a photo or upload clear visual evidence (JPG, PNG, WebP up to 10MB)',
  className,
  aspectRatio = 'video',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setPreview(dataUrl);
      onImageSelected(dataUrl, file);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  return (
    <div className={cn('w-full space-y-2 text-left', className)}>
      {label && <label className="block text-xs font-semibold text-slate-700 tracking-wide">{label}</label>}

      {preview ? (
        <div className="relative rounded-2xl overflow-hidden border-2 border-blue-500/50 bg-slate-900 shadow-md group">
          <img
            src={preview}
            alt="Complaint Preview"
            className="w-full h-56 object-cover transition-transform group-hover:scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Image Ready for AI Analysis</span>
          </div>
          <button
            type="button"
            onClick={clearImage}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors cursor-pointer"
            aria-label="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-xs text-white/90">
            <span className="flex items-center gap-1 font-mono">
              <ImageIcon className="w-3.5 h-3.5" /> High-res evidence
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1 rounded bg-white/20 hover:bg-white/30 text-xs font-semibold backdrop-blur-xs cursor-pointer"
            >
              Replace
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            'flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl border-2 border-dashed transition-all duration-200 text-center',
            isDragging
              ? 'border-blue-500 bg-blue-50/50'
              : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-slate-400'
          )}
        >
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-blue-600 shadow-xs mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>

          <p className="text-sm font-bold text-slate-800">
            Drag and drop your photo here, or browse
          </p>
          <p className="text-xs text-slate-500 max-w-xs mt-1 mb-5">{helperText}</p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<Camera className="w-4 h-4 text-slate-700" />}
              onClick={() => cameraInputRef.current?.click()}
            >
              Take Photo
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<UploadCloud className="w-4 h-4" />}
              onClick={() => fileInputRef.current?.click()}
            >
              Choose from Device
            </Button>
          </div>
        </div>
      )}

      {/* Hidden standard file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      {/* Hidden camera capture input */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
