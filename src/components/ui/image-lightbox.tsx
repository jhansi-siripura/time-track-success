import React, { useEffect, useState, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setCurrentIndex((prev) => (prev + 1) % images.length);
      if (e.key === 'ArrowLeft') setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] bg-black/90 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/80"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCurrentIndex((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-black/80"
          >
            <ChevronRight />
          </button>
        </>
      )}

      {/* Image Box */}
      <div className="relative max-w-[90%] max-h-[85vh]">
        <img
          src={images[currentIndex]}
          className="object-contain w-full h-full rounded"
          alt={`Slide ${currentIndex + 1}`}
          draggable={false}
        />

        {/* Close button inside */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-2 right-2 z-30 p-2 bg-black/70 text-white rounded-full hover:bg-black/90"
          aria-label="Close"
        >
          <X />
        </button>
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
};