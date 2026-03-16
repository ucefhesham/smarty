"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight,  Search,
  Globe,
  LayoutGrid,
  Award,
  Smartphone,
  Info
} from 'lucide-react';
import { Link, useRouter, usePathname } from '@/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { useUIStore } from '@/store/uiStore';
import { cn } from '@/lib/utils';
import { JordanFlag, USFlag } from '../ui/Flags';

interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  children?: any[];
}

interface Brand {
  id: number;
  name: string;
  slug: string;
}

interface MobileMenuProps {
  categories: any[];
  brands: any[];
}

export default function MobileMenu({ categories = [], brands = [] }: MobileMenuProps) {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isMobileMenuOpen, closeMobileMenu } = useUIStore();
  const [activeTab, setActiveTab] = useState<'categories' | 'brands'>('categories');
  const [searchQuery, setSearchQuery] = useState('');

  // Close menu on route change
  useEffect(() => {
    closeMobileMenu();
  }, [pathname, closeMobileMenu]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const toggleLanguage = () => {
    const nextLocale = locale === 'en' ? 'ar' : 'en';
    router.replace(pathname, { locale: nextLocale });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeMobileMenu();
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Build category tree (shallow for mobile menu)
  const categoryTree = categories.filter(cat => cat.parent === 0);

  const menuVariants = {
    closed: {
      x: locale === 'ar' ? '100%' : '-100%',
      transition: {
        type: "tween" as const,
        duration: 0.3
      }
    } as any,
    opened: {
      x: 0,
      transition: {
        type: "tween" as const,
        duration: 0.3
      }
    } as any
  };

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
          />

          {/* Menu Drawer */}
          <motion.div
            initial="closed"
            animate="opened"
            exit="closed"
            variants={menuVariants}
            className={cn(
              "fixed top-0 bottom-0 w-[85%] max-w-[400px] bg-white z-[120] md:hidden flex flex-col shadow-2xl",
              locale === 'ar' ? "right-0" : "left-0"
            )}
          >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-50">
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                {t('menu')}
              </span>
              <button
                onClick={closeMobileMenu}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-500 active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Search */}
            <div className="px-6 py-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('search')}
                  className="w-full bg-slate-50 border-none rounded-2xl py-3 px-12 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                />
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              </form>
            </div>

            {/* Tabs Trigger */}
            <div className="px-6 py-2">
              <div className="flex p-1 bg-slate-50 rounded-2xl">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
                    activeTab === 'categories' ? "bg-white text-primary shadow-sm" : "text-slate-400"
                  )}
                >
                  <LayoutGrid size={16} />
                  {t('categories')}
                </button>
                <button
                  onClick={() => setActiveTab('brands')}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all",
                    activeTab === 'brands' ? "bg-white text-primary shadow-sm" : "text-slate-400"
                  )}
                >
                  <Award size={16} />
                  {t('footer_brands_title')}
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-grow overflow-y-auto px-6 py-4 no-scrollbar">
              <AnimatePresence mode="wait">
                {activeTab === 'categories' ? (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-1"
                  >
                    {categoryTree.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop/${cat.slug}`}
                        className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 active:bg-slate-100 transition-colors group"
                      >
                        <span className="text-[15px] font-medium text-slate-700 group-hover:text-primary transition-colors">
                          {cat.name.replace(/&amp;/g, '&')}
                        </span>
                        <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-all group-hover:translate-x-1" />
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="brands"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-2 gap-3"
                  >
                    {brands.map((brand) => (
                      <Link
                        key={brand.id}
                        href={`/shop/brand/${brand.slug}`}
                        className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 hover:bg-primary/5 hover:text-primary transition-all text-center border border-transparent hover:border-primary/10"
                      >
                        <span className="text-[13px] font-bold text-slate-700 group-hover:text-primary">
                          {brand.name}
                        </span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer / Account / Lang */}
            <div className="p-6 border-t border-slate-50 bg-slate-50/50 space-y-4">
              <button
                onClick={toggleLanguage}
                className="w-full flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm active:scale-[0.98] transition-all"
              >
                <div className="flex items-center gap-3">
                  {locale === 'en' ? <JordanFlag className="w-6 h-4" /> : <USFlag className="w-6 h-4" />}
                  <span className="text-sm font-bold text-slate-900 uppercase">
                    {locale === 'en' ? t('arabic') : t('english')}
                  </span>
                </div>
                <Globe size={18} className="text-slate-400" />
              </button>

              <div className="flex items-center justify-between px-2">
                 <Link href="/account" className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
                    {t('login')}
                 </Link>
                 <span className="text-[10px] text-slate-300">Smarty v1.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
