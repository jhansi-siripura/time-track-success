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

  // Reset image index and zoom state on open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && images.length > 1)
        setCurrentIndex((prev) => (prev + 1) % images.length);
      else if (e.key === 'ArrowLeft' && images.length > 1)
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    // Close only if clicked outside image
    if (e.target === e.currentTarget) onClose();
  };

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full hover:bg-black/80"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Image + Close inside */}
      <div className="relative max-w-[95%] sm:max-w-[80%] max-h-[90vh] sm:max-h-[80vh]">
        <img
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          className="rounded-lg object-contain w-full h-full"
          draggable={false}
        />

        {/* Close inside image */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-20 p-1 bg-black/60 text-white rounded-full hover:bg-black/80"
          aria-label="Close lightbox"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/50 text-white text-sm rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};