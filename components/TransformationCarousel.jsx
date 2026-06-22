'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function TransformationCarousel({ customSlides }) {
  const [index, setIndex] = useState(0);

  // Fallback default list if no dynamic database list is provided yet
  const defaultSlides = [
    { id: 1, img: "/trans1.jpg" },
    { id: 2, img: "/trans2.jpg" },
    { id: 3, img: "/trans3.jpg" }
  ];

  const slides = customSlides || defaultSlides;

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Auto-swipe every 5 seconds securely tracking state resets
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  return (
    <section className="relative w-full bg-black py-20 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gymGold-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="text-center mb-12 px-4 z-10">
        <h2 className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight">
          THE <span className="text-gymGold-500">PROVEN RESULTS</span>
        </h2>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
          Elite physical frameworks built by Team Dinesh
        </p>
      </div>

      <div className="relative w-full max-w-xs md:max-w-sm h-[400px] flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {slides.map((item, i) => {
            let offset = i - index;
            if (offset < -3) offset += slides.length;
            if (offset > 3) offset -= slides.length;

            const isActive = offset === 0;
            const absOffset = Math.abs(offset);

            const rotateY = offset * 35; 
            const translateZ = isActive ? 0 : -140 * absOffset; 
            const opacity = absOffset > 3 ? 0 : 1 - absOffset * 0.3;

            return (
              <motion.div
                key={item.id || i}
                className="absolute w-[250px] h-[360px] rounded-2xl overflow-hidden border border-zinc-800/60 bg-zinc-950 shadow-[0_20px_40px_rgba(0,0,0,0.9)]"
                animate={{
                  rotateY: rotateY,
                  z: translateZ,
                  opacity: opacity,
                  scale: isActive ? 1 : 0.85,
                }}
                transition={{ type: "spring", stiffness: 130, damping: 15 }}
                style={{
                  pointerEvents: isActive ? "auto" : "none",
                  zIndex: slides.length - absOffset,
                }}
              >
                <div className="relative w-full h-full">
                  <img 
                    src={item.img} 
                    alt="Transformation" 
                    className="w-full h-full object-contain bg-zinc-950"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {slides.length > 1 && (
        <div className="flex gap-4 mt-6 z-10">
          <button onClick={prevSlide} className="w-10 h-10 flex items-center justify-center border border-zinc-800 text-zinc-500 rounded-full bg-zinc-900/20 text-sm">←</button>
          <button onClick={nextSlide} className="w-10 h-10 flex items-center justify-center bg-gymGold-500 text-black rounded-full font-black text-sm">→</button>
        </div>
      )}
    </section>
  );
}