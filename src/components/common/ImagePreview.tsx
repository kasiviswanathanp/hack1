import React, { useState } from 'react';
import { Modal } from './Modal';
import { ZoomIn, ExternalLink } from 'lucide-react';
import { cn } from '@/utils';

export const ImagePreview: React.FC<{
  src: string;
  alt?: string;
  caption?: string;
  className?: string;
  heightClass?: string;
}> = ({ src, alt = 'Evidence image', caption, className, heightClass = 'h-48' }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          'group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100 cursor-pointer shadow-xs',
          heightClass,
          className
        )}
        onClick={() => setIsOpen(true)}
      >
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 text-xs font-semibold backdrop-blur-xs">
            <ZoomIn className="w-3.5 h-3.5" /> Enlarge Photo
          </span>
        </div>
        {caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-[11px] text-white font-medium truncate">
            {caption}
          </div>
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} maxWidth="4xl" title={caption || alt}>
        <div className="space-y-3">
          <div className="max-h-[75vh] overflow-hidden rounded-xl bg-slate-950 flex items-center justify-center">
            <img src={src} alt={alt} className="max-h-[75vh] w-auto object-contain" />
          </div>
          <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
            <span>{caption || alt}</span>
            <a
              href={src}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:underline font-semibold"
            >
              Open original file <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
};
