"use client";

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/navigation';
import { useLocale, useTranslations } from 'next-intl';

interface CategoryItem {
  id: string;
  name: string;
  img: string;
  slug: string;
  localizedSlug: string;
  count: number;
}

interface CategorySliderClientProps {
  categories: CategoryItem[];
}

export default function CategorySliderClient({ categories }: CategorySliderClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('common');

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      if (isRtl) {
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
  }, [categories, isRtl]);

  const scroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
      setTimeout(checkScroll, 500);
    }
  };

  return (
    <div className="relative group/categories px-4 md:px-12 lg:px-24 max-w-[1600px] mx-auto mb-4 md:mb-10 mt-1 md:mt-4">
      {/* Navigation Arrows */}
      <button
        onClick={() => scroll('left')}
        className={`absolute top-[40%] left-12 md:left-16 lg:left-20 z-10 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 border border-slate-100 transition-all hover:scale-110 active:scale-95 ${!canScrollLeft && 'opacity-0 pointer-events-none'}`}
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => scroll('right')}
        className={`absolute top-[40%] right-12 md:right-16 lg:right-20 z-10 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-900 border border-slate-100 transition-all hover:scale-110 active:scale-95 ${!canScrollRight && 'opacity-0 pointer-events-none'}`}
      >
        <ChevronRight size={20} />
      </button>

      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-2 md:gap-12 overflow-x-auto no-scrollbar py-2 md:py-8"
      >
        {categories.map((cat, index) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03 }}
            className="flex-shrink-0 w-[calc((100%-1.5rem)/2.5)] sm:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-6*2rem)/7)]"
          >
            <Link
              href={`/shop/${cat.localizedSlug}`}
              className="luxury-card group/item flex flex-col h-full bg-white overflow-hidden relative border border-slate-100 rounded-[10px] p-2 md:p-4 transition-all duration-300"
            >
              {/* Image Container matching ProductCard */}
              <div className="relative aspect-square overflow-hidden bg-white block mb-2 w-full">
                <Image
                  src={cat.img}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 120px, 150px"
                  className="object-contain p-2 group-hover/item:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              
              <div className="flex flex-col items-center text-center mt-auto">
                <span className="text-sm md:text-base font-bold text-slate-800 group-hover/item:text-primary transition-colors line-clamp-1 leading-tight mb-1">
                    {cat.name}
                </span>
                <span className="text-[11px] md:text-xs font-medium text-slate-400">
                    {t('products_count', { count: cat.count })}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
