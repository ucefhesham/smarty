"use client";

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductGallery({ images }: { images: { src: string }[] }) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-white rounded-[3rem] flex items-center justify-center text-primary/10 font-bold text-4xl border border-slate-100">
        SMARTY
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      {/* Thumbnails - Left on desktop, bottom on mobile */}
      <div className="flex lg:flex-col gap-3 overflow-y-auto lg:h-full lg:max-h-[500px] scrollbar-hide order-2 lg:order-1 no-scrollbar min-w-[90px]">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "relative w-20 h-20 rounded-lg flex-shrink-0 border transition-all duration-300 overflow-hidden bg-white",
              active === i ? "border-primary shadow-lg ring-1 ring-primary/20 scale-[1.02]" : "border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200"
            )}
          >
            <Image src={img.src} alt="Thumbnail" fill className="object-contain p-2" />
          </button>
        ))}
        
        <div className="hidden lg:flex flex-col gap-2 mt-auto pb-4">
           {/* Navigation arrows like in the image could go here */}
           <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary transition-colors cursor-pointer capitalize">
              <span className="sr-only">previous image</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
           </div>
           <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:text-primary transition-colors cursor-pointer">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
           </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex-grow order-1 lg:order-2">
        <div className="relative aspect-[4/5] bg-white border border-slate-100 overflow-hidden group">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image 
                src={images[active].src} 
                alt="Product" 
                fill 
                priority
                className="object-contain p-4 lg:p-8 cursor-zoom-in" 
              />
            </motion.div>
          </AnimatePresence>
          
          {/* Zoom button */}
          <button className="absolute bottom-4 left-4 w-10 h-10 bg-white shadow-luxury rounded-full flex items-center justify-center text-slate-500 hover:text-primary transition-all opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
          </button>
        </div>
      </div>
    </div>
  );
}
