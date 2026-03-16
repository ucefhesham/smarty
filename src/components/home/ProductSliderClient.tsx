"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import ProductCard from '../product/ProductCard';
import { Link } from '@/navigation';
import { useLocale } from 'next-intl';

interface ProductSliderClientProps {
  products: any[];
  title: string;
  viewAllLink: string;
  viewAllText: string;
}

export default function ProductSliderClient({
  products,
  title,
  viewAllLink,
  viewAllText
}: ProductSliderClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;

      if (isRtl) {
        // In RTL, scrollLeft is 0 at the start (right) and negative as you scroll left
        setCanScrollLeft(Math.abs(scrollLeft) < scrollWidth - clientWidth - 10);
        setCanScrollRight(Math.abs(scrollLeft) > 10);
      } else {
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [products, isRtl]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const firstItem = containerRef.current.firstElementChild as HTMLElement;
      if (!firstItem) return;

      const itemWidth = firstItem.offsetWidth;
      const gap = parseInt(window.getComputedStyle(containerRef.current).columnGap) || 0;
      const scrollAmount = itemWidth + gap;

      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });

      // Delay check to allow smooth scroll to finish
      setTimeout(checkScroll, 500);
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-2 md:py-12 px-4 md:px-12 lg:px-20 max-w-[1600px] mx-auto overflow-hidden">
      <div className="flex items-center justify-between mb-4 md:mb-8">
        <h2 className="text-lg md:text-4xl font-black text-slate-900 tracking-tight font-lexend">
          {title}
        </h2>
        <Link
          href={viewAllLink}
          className="group flex items-center gap-1.5 md:gap-2 text-xs md:text-sm font-bold text-primary hover:text-slate-900 transition-colors bg-primary/5 px-4 md:px-8 py-2 md:py-4 rounded-full"
        >
          {viewAllText}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1" />
        </Link>
      </div>

      <div className="relative group/slider">
        {/* Navigation Arrows - Desktop Only */}
        <div className="hidden md:block">
          <button
            onClick={() => scroll('left')}
            className={`absolute top-1/2 -left-6 z-20 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-900 border border-slate-100 transition-all hover:scale-110 active:scale-95 ${!canScrollLeft && 'opacity-0 pointer-events-none'}`}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute top-1/2 -right-6 z-20 -translate-y-1/2 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-slate-900 border border-slate-100 transition-all hover:scale-110 active:scale-95 ${!canScrollRight && 'opacity-0 pointer-events-none'}`}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Swipe Container */}
        <div
          ref={containerRef}
          onScroll={checkScroll}
          className="flex gap-2.5 md:gap-4 overflow-x-auto snap-x snap-mandatory custom-scrollbar pb-6 -mx-4 px-4 md:mx-0 md:px-0"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-shrink-0 w-[calc(50%-6px)] sm:w-[calc(50%-8px)] md:w-[calc(25%-18px)] lg:w-[calc(20%-19.2px)] snap-start"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
