import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageLightboxProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  // Reset index & zoom when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  // Touch swipe logic
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const dx = touchStart.x - touchEnd.x;
    const dy = touchStart.y - touchEnd.y;
    const isHorizontal = Math.abs(dx) > Math.abs(dy);

    if (!isZoomed && isHorizontal) {
      if (dx > 50) {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      } else if (dx < -50) {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      }
    }
  }, [touchStart, touchEnd, isZoomed, images.length]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsZoomed(!isZoomed);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Previous Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
          }}
          className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next Button */}
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
          }}
          className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/60 text-white p-2 rounded-full hover:bg-black"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Image + Close Button inside */}
      <div className="relative pointer-events-none">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className={cn(
            "transition-all duration-300 select-none object-contain",
            "rounded-lg max-w-[95vw] max-h-[90vh]",
            isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in"
          )}
          onClick={handleImageClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          draggable={false}
        />

        {/* Close button INSIDE image */}
        <button
          onClick={handleClose}
          className="pointer-events-auto absolute top-2 right-2 z-30 bg-black/70 text-white p-1 rounded-full hover:bg-black"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full z-20">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};