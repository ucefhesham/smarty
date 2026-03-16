"use client";

import { Link, useRouter, usePathname } from '@/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Search, User, Menu, PhoneCall, Globe, Heart, ChevronDown, ArrowLeftRight, ShoppingCart, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CartIcon from './CartIcon';
import { cn } from '@/lib/utils';
import { searchAction } from '@/app/actions/search';
import { useUIStore } from '@/store/uiStore';
import { JordanFlag, USFlag } from '../ui/Flags';
// Static Image Imports
import logo from "../../../public/images/Smarty-Logo.webp";

interface HeaderProps {
  brands?: { id: number; name: string; slug: string }[];
}

export default function Header({ brands: wpBrands = [] }: HeaderProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toggleMobileMenu } = useUIStore();

  // Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Live Search Logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        setShowDropdown(true);
        const results = await searchAction(searchQuery, locale);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, locale]);

  // Handle Click Outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Main Navigation Links - Use ALL Brands from WordPress
  const brandsNav = wpBrands.map(b => ({
    name: b.name,
    href: `/shop/brand/${b.slug}`
  }));

  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          // Scrolling down
          setIsVisible(false);
        } else {
          // Scrolling up
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlHeader);
    return () => {
      window.removeEventListener('scroll', controlHeader);
    };
  }, [lastScrollY]);

  return (
    <header className={cn(
      "w-full md:w-[calc(100%-70px)] flex flex-col z-[100] bg-white transition-transform duration-300 fixed top-0 left-0 md:left-[70px]",
      isVisible ? "translate-y-0" : "-translate-y-full"
    )}>
      {/* ──────────── Row 1: Main Header (Logo + Search + Icons) ──────────── */}
      <div className="border-b border-slate-50" dir="ltr">
        <div className="max-w-[1440px] px-4 md:px-8 h-[70px] flex items-center gap-4 md:gap-10">
          
          {/* Logo Group */}
          <Link href="/" className="flex-shrink-0 flex items-center transition-all hover:opacity-80">
            <div className="relative w-24 md:w-32 h-10">
              <Image
                src={logo}
                alt="SmartyJo Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Search Bar - Professional & Sleek */}
          <div
            ref={searchRef}
            className="hidden md:flex flex-grow max-w-xl relative"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="w-full relative z-10"
            >
              <div className="flex w-full items-center border border-slate-200 rounded-full focus-within:border-primary/30 transition-all duration-300 bg-slate-50 overflow-hidden">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.length >= 2 && setShowDropdown(true)}
                  placeholder={t('search')}
                  className="flex-grow bg-transparent py-2.5 px-6 text-[13px] font-medium tracking-tight focus:outline-none placeholder:text-slate-400 text-slate-900"
                />
                <button
                  type="submit"
                  className="text-slate-500 p-2.5 me-1.5 hover:text-primary transition-all flex items-center justify-center min-w-[40px]"
                >
                  {isSearching ? <Loader2 size={18} className="animate-spin text-primary" /> : <Search size={18} strokeWidth={2} />}
                </button>
              </div>
            </form>

            {/* Ajax Search Results Dropdown */}
            <AnimatePresence>
              {showDropdown && (searchQuery.length >= 2) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 max-h-[480px] overflow-y-auto"
                >
                  {isSearching && searchResults.length === 0 ? (
                    <div className="p-8 text-center space-y-3">
                      <div className="flex justify-center">
                        <Loader2 className="animate-spin text-primary" size={32} />
                      </div>
                      <p className="text-[13px] font-medium text-slate-400 uppercase tracking-widest">{t('searching')}...</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      <div className="px-5 py-2 mb-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('found_results')}</span>
                      </div>
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.id}`}
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors group border-b border-slate-50 last:border-0"
                        >
                          <div className="relative w-12 h-12 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                            {product.images?.[0] && (
                              <Image
                                src={product.images[0].src}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            )}
                          </div>
                          <div className="flex-grow min-w-0">
                            <h4 className="text-[13px] font-bold text-slate-900 truncate group-hover:text-primary transition-colors">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[11px] font-bold text-primary">{product.price} {t('currency')}</span>
                              {product.on_sale && product.regular_price && (
                                <span className="text-[10px] text-slate-300 line-through font-medium">{product.regular_price} {t('currency')}</span>
                              )}
                            </div>
                          </div>
                          <ChevronDown className="text-slate-300 -rotate-90 group-hover:text-primary transition-all opacity-0 group-hover:opacity-100" size={14} />
                        </Link>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-primary hover:bg-slate-50 transition-all border-t border-slate-50"
                      >
                        {t('view_all_results')}
                      </button>
                    </div>
                  ) : !isSearching && (
                    <div className="p-10 text-center space-y-2">
                      <Search className="mx-auto text-slate-200" size={40} strokeWidth={1} />
                      <p className="text-[13px] font-bold text-slate-500">{t('no_results_found')}</p>
                      <p className="text-[11px] text-slate-400">{t('try_different_search')}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Support Info - Minimalist */}
          <div className="hidden xl:flex items-center gap-10 ml-auto text-left">
            <a
              href="https://wa.me/962795644030"
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-0.5 hover:opacity-70 transition-opacity"
            >
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-widest block font-lexend">{t('support_label')}</span>
              <span className="text-[13px] font-medium text-slate-900 tracking-tight">+962 795644030</span>
            </a>
          </div>

          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button 
              onClick={toggleLanguage} 
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg active:bg-slate-50 transition-all font-lexend"
            >
              {locale === 'en' ? <JordanFlag className="w-5 h-3.5" /> : <USFlag className="w-5 h-3.5" />}
              <span className="text-[10px] font-bold text-slate-900 uppercase">
                {locale === 'en' ? 'AR' : 'EN'}
              </span>
            </button>
            
            <button 
              onClick={toggleMobileMenu}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 active:scale-95 transition-all"
            >
              <Menu size={20} />
            </button>
          </div>

          {/* Action Icons Group */}
          <div className="hidden md:flex items-center gap-1 ml-auto md:ml-0">
            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }}>
              <Link href="/account" className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all group">
                <User size={20} className="text-slate-500 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="hidden md:block">
              <Link href="/compare" className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all group relative">
                <ArrowLeftRight size={20} className="text-slate-500 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </Link>
            </motion.div>

            <motion.div whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="hidden md:block">
              <Link href="/wishlist" className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all group relative">
                <Heart size={20} className="text-slate-500 group-hover:text-primary transition-colors" strokeWidth={1.5} />
              </Link>
            </motion.div>

            <div className="w-12 flex justify-center border-l border-slate-50 ml-2">
              <CartIcon />
            </div>
          </div>
        </div>
      </div>

      {/* ──────────── Row 2: Secondary Navigation Bar ──────────── */}
      <div className="border-b border-slate-100 hidden md:block bg-white/80 backdrop-blur-md" dir="ltr">
        <div className={cn("max-w-[1440px] px-8 h-12 flex items-center justify-between", locale === 'ar' && "flex-row-reverse")}>

          <nav className="flex items-center h-full space-x-2 overflow-x-auto no-scrollbar">
            {brandsNav.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-[11px] font-semibold text-slate-500 hover:text-primary transition-colors px-4 py-2 whitespace-nowrap uppercase tracking-wider font-lexend"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-6">
            <button onClick={toggleLanguage} className="flex items-center gap-2 cursor-pointer group hover:bg-slate-50 px-3 py-1.5 rounded-full transition-all">
              {locale === 'en' ? <JordanFlag className="w-5 h-3.5 shadow-sm" /> : <USFlag className="w-5 h-3.5 shadow-sm" />}
              <span className="text-[11px] font-black text-slate-900 tracking-wide uppercase font-lexend">
                {locale === 'en' ? t('arabic') : t('english')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
