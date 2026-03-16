"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ShoppingCart } from "lucide-react";
import { useTranslations, useLocale } from 'next-intl';
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Static Component Imports
import HeroImage from "./HeroImage";

// Hero content handled directly for single-slide impact

export default function Hero() {
  const t = useTranslations('home');
  const locale = useLocale();
  const isRtl = locale === 'ar';

  return (
    <section className="relative w-full px-4 md:px-8 mt-2">
      <div className="relative h-[250px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-slate-900 shadow-luxury group">
        
        {/* Background Component */}
        <div className="absolute inset-0">
           <HeroImage />
          {/* Elegant Overlay Gradients - Flipped for RTL */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            isRtl 
              ? "bg-gradient-to-l from-slate-950/80 via-slate-950/20 to-transparent" 
              : "bg-gradient-to-r from-slate-950/80 via-slate-950/20 to-transparent"
          )} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex items-center max-w-[1440px] mx-auto px-8 md:px-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl space-y-5 md:space-y-8"
          >
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="hidden md:inline-block text-primary bg-primary/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.3em] border border-primary/20"
              >
                Experience the Future
              </motion.span>
              
              <h1 className="text-2xl md:text-5xl lg:text-7xl font-normal text-white leading-[1.1] rtl:leading-[1.3] tracking-tight rtl:font-arabic">
                {t('title_line1')} <br />
                <span className="text-primary font-heading rtl:font-arabic">{t('title_line2')}</span>
              </h1>
              
              <p className="text-slate-300 text-[10px] md:text-base lg:text-lg max-w-sm md:max-w-lg leading-relaxed font-light rtl:font-arabic">
                {t('description')}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 md:gap-4 pt-1 md:pt-4">
              <Link 
                href="/shop" 
                className="h-9 md:h-12 px-6 md:px-10 bg-primary text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] rounded-lg md:rounded-xl flex items-center justify-center hover:bg-slate-900 hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95 group font-sans rtl:font-arabic"
              >
                {t('shop_cta')}
                <ArrowRight className="ms-2 w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="/new-arrivals" 
                className="hidden md:flex h-12 px-10 bg-white/10 backdrop-blur-md text-white text-xs font-bold uppercase tracking-[0.15em] rounded-xl items-center justify-center border border-white/20 hover:bg-white hover:text-slate-900 transition-all active:scale-95 font-sans rtl:font-arabic"
              >
                {t('arrivals_cta')}
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Product Detail Card - Desktop Only */}
        <motion.div
            initial={{ opacity: 0, scale: 0.9, x: isRtl ? -50 : 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={cn(
                "absolute bottom-10 z-20 transition-all hidden md:flex",
                isRtl ? "left-10 lg:left-20" : "right-10 lg:right-20"
            )}
        >
            <div className="bg-white rounded-[1.5rem] p-4 flex items-center gap-4 max-w-[320px] border border-slate-100 shadow-2xl">
                <div className="relative w-16 h-16 bg-slate-50 rounded-xl overflow-hidden shrink-0">
                    <Image 
                        src="https://smartyjo.com/wp-content/uploads/2025/02/OIP-24.jpeg" 
                        alt={t('floating_product.alt')}
                        fill
                        className="object-contain p-2"
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <h4 className="text-slate-900 text-sm font-bold leading-tight rtl:font-arabic">
                        {t('floating_product.title')}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest rtl:font-arabic">
                        {t('floating_product.subtitle')}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-primary font-bold text-lg rtl:font-arabic">
                            {t('floating_product.price')}
                        </span>
                        <Link href="/shop/indoor-wifi-camera-2" className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white transition-transform hover:scale-110 rtl:font-arabic">
                            <ShoppingCart size={14} />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>

        {/* Floating Accent Shapes - Desktop Only */}
        <div className={cn(
            "absolute top-20 w-32 h-32 bg-primary/20 rounded-full blur-[80px] animate-pulse hidden md:block",
            isRtl ? "left-20" : "right-20"
        )} />
        <div className={cn(
            "absolute bottom-20 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse delay-1000 hidden md:block",
            isRtl ? "left-40" : "right-40"
        )} />
      </div>
    </section>
  );
}
