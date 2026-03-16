"use client";

import { useState } from 'react';
import { Link } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import {
  Laptop,
  Smartphone,
  Gamepad2,
  Tv,
  Camera,
  Home,
  Menu,
  ChevronRight,
  Headphones,
  Watch,
  Cpu,
  Keyboard,
  Zap,
  ShieldCheck,
  LayoutGrid,
  Monitor,
  Speaker,
  Mic2,
  Lock,
  Timer,
  Flame,
  Cloud,
  Mic,
  Router,
  Cctv,
  Disc,
  WashingMachine,
  Lightbulb,
  Plug,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion"; // Added
import { cn } from '@/lib/utils';

interface Category {
  id: string;
  name: string;
  icon: React.ElementType;
  slug: string;
}

import { ICON_MAP, DEFAULT_ICON } from '@/lib/icons';

const SORT_ORDER = [
  'amazon-alexa',
  'google',
  'smart-home',
  'wifi-smart-camera',
  'smart-lock-2',
  'network-access-points',
  'accessories',
  'smart-intercom',
  'robot-vacuum',
  'home-appliances'
];

interface StickyCategoryNavProps {
  initialCategories?: any[];
}

export default function StickyCategoryNav({ initialCategories = [] }: StickyCategoryNavProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);
  const [activeCategory, setActiveCategory] = useState<any | null>(null);

  // 1. Build a hierarchical tree from the flat WordPress categories
  const categoryTree = initialCategories
    .filter(cat => cat.parent === 0 && cat.name.toLowerCase() !== 'uncategorized')
    .map(parent => {
      const decodedSlug = decodeURIComponent(parent.slug);
      const name = parent.name.replace(/&amp;/g, '&').replace(/&/g, '&');
      const decodedName = name.includes('%') ? decodeURIComponent(name) : name;

      return {
        ...parent,
        name: decodedName,
        icon: ICON_MAP[parent.slug] || ICON_MAP[decodedSlug] || DEFAULT_ICON,
        children: initialCategories
          .filter(child => child.parent === parent.id)
          .map(child => {
            const cName = child.name.replace(/&amp;/g, '&').replace(/&/g, '&');
            return {
              ...child,
              name: cName.includes('%') ? decodeURIComponent(cName) : cName
            };
          })
      };
    })
    .sort((a, b) => {
      const indexA = SORT_ORDER.indexOf(a.slug);
      const indexB = SORT_ORDER.indexOf(b.slug);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    });

  // Fallback if no categories are fetched
  const displayCategories = categoryTree.length > 0 ? categoryTree : [
    { id: '1', name: 'Laptops & PCs', icon: Monitor, slug: 'laptops', children: [] },
    { id: '2', name: 'Smartphones', icon: Smartphone, slug: 'smartphones', children: [] },
    { id: '3', name: 'Audio Gear', icon: Speaker, slug: 'audio', children: [] },
    { id: '4', name: 'Smart Watches', icon: Watch, slug: 'wearables', children: [] },
    { id: '5', name: 'Gaming Consoles', icon: Gamepad2, slug: 'gaming', children: [] },
  ];

  return (
    <aside
      dir="ltr"
      className={cn(
        "fixed left-0 top-0 h-screen z-[101] bg-white transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-[width] group/sidebar",
        isHovered ? "w-[280px] shadow-[40px_0_80px_-15px_rgba(0,0,0,0.06)]" : "w-[70px]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveCategory(null);
      }}
    >
      {/* Top Pill Toggle */}
      <div className={cn(
        "absolute top-4 z-30 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        isHovered ? "left-[12.5px]" : "left-[12.5px]"
      )}>
        <div className={cn(
          "h-[45px] bg-primary flex items-center shadow-lg shadow-primary/10 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden",
          isHovered ? "w-60 rounded-full px-[12.5px]" : "w-[45px] rounded-full justify-center"
        )}>
          <div className={cn(
            "shrink-0 flex items-center justify-center transition-all duration-500",
            isHovered ? "ml-0" : (locale === 'ar' ? "ml-[83px]" : "ml-[99px]")
          )}>
            <Menu size={20} strokeWidth={2} className="text-white" />
          </div>

          <span className={cn(
            "ml-3 text-white font-medium text-sm whitespace-nowrap transition-all duration-500",
            isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
          )}>
            {t('all_categories')}
          </span>
        </div>
      </div>

      <div className="flex flex-col h-full pt-20">
        <div className="flex-grow py-2 overflow-y-auto no-scrollbar overflow-x-hidden">
          <nav className="space-y-0.5 px-0">
            {displayCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop/${cat.slug}`}
                onMouseEnter={() => setActiveCategory(cat)}
                className={cn(
                  "group flex items-center h-12 transition-all duration-300 relative overflow-hidden",
                  activeCategory?.id === cat.id ? "bg-slate-50 text-slate-900" : "text-slate-900 hover:bg-slate-50/30"
                )}
              >
                <div className="shrink-0 w-[70px] flex items-center justify-center relative z-10 transition-all duration-300">
                  <cat.icon size={22} strokeWidth={1.2} className={cn(
                    "transition-transform duration-500",
                    activeCategory?.id === cat.id ? "scale-105" : "group-hover:scale-105 focus:text-primary"
                  )} />
                </div>
                <span className={cn(
                  "ps-0 font-normal text-[13px] tracking-tight whitespace-nowrap transition-all duration-500 flex-grow relative z-10",
                  isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                )}>
                  {cat.name}
                </span>
                {isHovered && cat.children?.length > 0 && (
                  <ChevronRight size={14} strokeWidth={1.5} className={cn(
                    "me-6 transition-all duration-300 text-slate-300 group-hover:text-primary",
                    activeCategory?.id === cat.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                  )} />
                )}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mega Menu Panel */}
      <AnimatePresence>
        {isHovered && activeCategory && activeCategory.children?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            dir={locale === 'ar' ? 'rtl' : 'ltr'}
            className="absolute top-0 left-full h-screen w-[550px] bg-white shadow-[80px_0_100px_-20px_rgba(0,0,0,0.08)] border-l border-slate-50 p-12 z-[100] overflow-y-auto no-scrollbar"
          >
            <div className="min-h-full flex flex-col justify-between">
              <div className="space-y-12">
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.25em]">{t('explore_collection')}</span>
                  <h2 className="text-3xl font-normal text-slate-900 tracking-tight">
                    {activeCategory.name.includes('%') ? decodeURIComponent(activeCategory.name) : activeCategory.name}
                  </h2>
                </div>

                <div className={cn(
                  "grid gap-x-12 gap-y-6",
                  activeCategory.children.length > 6 ? "grid-cols-2" : "grid-cols-1"
                )}>
                  {activeCategory.children.map((child: any) => (
                    <Link
                      key={child.id}
                      href={`/shop/${child.slug}`}
                      className="group py-1.5 border-b border-transparent hover:border-slate-100 transition-all flex items-center justify-between"
                    >
                      <span className="text-sm font-medium text-slate-500 group-hover:text-primary transition-colors">
                        {child.name}
                      </span>
                      <ChevronRight size={14} className="text-primary/30 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Promo Banner inside Mega Menu (Luxury Touch) */}
              <div className="mt-20 rounded-[2rem] bg-slate-50 p-8 relative overflow-hidden group/promo">
                <div className="relative z-10 max-w-[60%]">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-2">{t('exclusive_release')}</h4>
                  <h3 className="text-xl font-normal text-slate-900 mb-2 leading-tight">
                    {t('next_gen_gear', {
                      category: activeCategory.name.includes('%') ? decodeURIComponent(activeCategory.name) : activeCategory.name
                    })}
                  </h3>
                  <p className="text-xs text-slate-500 mb-6 leading-relaxed">{t('promo_text')}</p>
                  <Link href={`/shop/${activeCategory.slug}`} className="inline-flex h-10 px-6 items-center bg-white text-[10px] font-bold text-slate-900 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95">
                    {t('shop_now_btn')}
                  </Link>
                </div>
                <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover/promo:bg-primary/20 transition-all duration-1000" />
                <div className="absolute top-8 right-8 text-primary opacity-10 group-hover/promo:scale-125 transition-transform duration-1000">
                  <activeCategory.icon size={120} strokeWidth={0.5} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}
