import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function ImageLightbox({ 
  images, 
  initialIndex = 0, 
  isOpen, 
  onClose, 
  title 
}: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const isMobile = useIsMobile();

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 z-[9999] backdrop-blur-sm"
          />

          {/* Lightbox Container */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex flex-col items-center justify-center p-3 md:p-8"
          >
            {/* Header */}
            {title && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mb-4 md:mb-6 text-center"
              >
                <h3 className="text-base md:text-xl font-display text-white uppercase tracking-widest line-clamp-1">
                  {title}
                </h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">
                  {currentIndex + 1} / {images.length}
                </p>
              </motion.div>
            )}

            {/* Main Image Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full h-full max-h-[65vh] md:max-h-[75vh] flex items-center justify-center"
            >
              <img
                key={currentIndex}
                src={currentImage}
                alt={`Gallery ${currentIndex + 1}`}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-full object-contain rounded-lg"
              />

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevious}
                    className="absolute left-1 top-1/2 -translate-y-1/2 md:left-4 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm border border-white/20 hover:border-primary/50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={20} className="md:w-6 md:h-6" />
                  </button>

                  <button
                    onClick={goToNext}
                    className="absolute right-1 top-1/2 -translate-y-1/2 md:right-4 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm border border-white/20 hover:border-primary/50"
                    aria-label="Next image"
                  >
                    <ChevronRight size={20} className="md:w-6 md:h-6" />
                  </button>

                  {/* Thumbnail Navigation - only on desktop */}
                  {!isMobile && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full mt-6 md:mt-8 flex gap-2 md:gap-3 overflow-x-auto px-4 max-w-lg">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentIndex(idx)}
                          className={`flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                            idx === currentIndex
                              ? 'border-primary shadow-lg shadow-primary/50'
                              : 'border-white/20 hover:border-white/40 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img}
                            alt={`Thumbnail ${idx + 1}`}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </motion.div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={onClose}
              className="absolute top-3 md:top-8 right-3 md:right-8 p-2 md:p-4 rounded-full bg-white/10 hover:bg-white/20 transition-all text-white backdrop-blur-sm border border-white/20 hover:border-primary/50"
              aria-label="Close lightbox"
            >
              <X size={20} className="md:w-6 md:h-6" />
            </motion.button>

            {/* Info Text (on mobile) */}
            {!title && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 text-xs md:text-sm text-muted-foreground"
              >
                {currentIndex + 1} / {images.length}
              </motion.p>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
