/**
 * ProductGallery — Editorial zoomable gallery for ProductDetail page
 */
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, ChevronLeft, ChevronRight } from 'lucide-react';
import Modal from '../ui/Modal';
import { getDiscountPercent } from '../../utils/formatCurrency';

export default function ProductGallery({ images = [], name = '', tags = [], price = 0, discountPrice = 0 }) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const imageContainerRef = useRef(null);

  const discount = getDiscountPercent(price, discountPrice);

  const handleMouseMove = (e) => {
    if (!imageContainerRef.current) return;
    const { left, top, width, height } = imageContainerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const prev = () => setActiveIdx((i) => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:max-h-[560px] pb-2 lg:pb-0 shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative w-18 h-22 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                activeIdx === idx
                  ? 'border-gold shadow-sm scale-102'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`${name} preview ${idx + 1}`} className="w-full h-full object-cover object-center" />
            </button>
          ))}
        </div>
      )}

      {/* Main Image Container */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-card cursor-crosshair border border-gray-200/50 dark:border-gray-800"
        >
          {/* Main Image */}
          <motion.img
            key={activeIdx}
            src={images[activeIdx] || images[0]}
            alt={name}
            initial={false}
            animate={{ opacity: 1 }}
            className="w-full h-full object-cover object-center"
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: 'scale(1.8)',
                    transition: 'transform 0.1s ease-out',
                  }
                : {
                    transform: 'scale(1)',
                    transition: 'transform 0.3s ease-out',
                  }
            }
          />

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
            {discount > 0 && (
              <span className="bg-error text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                -{discount}% OFF
              </span>
            )}
            {tags.includes('new') && (
              <span className="bg-charcoal text-cream dark:bg-cream dark:text-charcoal text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                NEW RELEASE
              </span>
            )}
            {tags.includes('bestseller') && (
              <span className="bg-gold text-white text-xs font-bold px-2.5 py-1 rounded-md shadow-sm">
                BESTSELLER
              </span>
            )}
          </div>

          {/* Fullscreen Trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsLightboxOpen(true);
            }}
            className="absolute bottom-4 right-4 z-10 p-2.5 rounded-full bg-cream/80 dark:bg-charcoal/80 backdrop-blur-md text-charcoal dark:text-cream hover:bg-cream dark:hover:bg-charcoal shadow-sm transition-all"
            aria-label="Expand image"
          >
            <Maximize2 size={16} />
          </button>

          {/* Mobile swipe controls */}
          {images.length > 1 && (
            <div className="lg:hidden absolute inset-y-0 inset-x-2 flex items-center justify-between pointer-events-none">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                className="p-2 rounded-full bg-cream/80 dark:bg-charcoal/80 backdrop-blur-sm pointer-events-auto text-charcoal dark:text-cream shadow-sm"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                className="p-2 rounded-full bg-cream/80 dark:bg-charcoal/80 backdrop-blur-sm pointer-events-auto text-charcoal dark:text-cream shadow-sm"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Modal
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        maxWidth="max-w-4xl"
        title={name}
      >
        <div className="relative aspect-[3/4] sm:aspect-[4/3] w-full rounded-xl overflow-hidden bg-black/5">
          <img
            src={images[activeIdx]}
            alt={name}
            className="w-full h-full object-contain mx-auto"
          />
        </div>
      </Modal>
    </div>
  );
}
