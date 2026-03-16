"use client";

import { useCompareStore } from "@/store/compareStore";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X, ChevronRight, BarChart2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";

export default function CompareBar() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { items, removeItem, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-2xl"
      >
        <div className="bg-white/80 border border-slate-100 rounded-3xl p-4 shadow-luxury backdrop-blur-xl flex items-center justify-between gap-4">
           <div className="flex items-center gap-3 ml-2">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
                 <GitCompare size={20} />
              </div>
              <div className="hidden sm:block">
                 <p className="text-slate-900 text-xs font-black uppercase tracking-widest leading-none mb-1">{t('compare')}</p>
                 <p className="text-slate-400 text-[10px] font-bold">{t('products_selected', { count: items.length })}</p>
              </div>
           </div>

           <div className="flex-grow flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {items.map((item) => (
                <div key={item.id} className="relative group flex-shrink-0">
                   <div className="w-14 h-14 bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden p-2 group-hover:border-primary/50 transition-colors">
                      {item.image && <Image src={item.image} alt={item.name} width={40} height={40} className="object-contain" />}
                   </div>
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform"
                   >
                     <X size={10} />
                   </button>
                </div>
              ))}
              
              {/* Slots */}
              {[...Array(Math.max(0, 4 - items.length))].map((_, i) => (
                <div key={i} className="w-14 h-14 border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-200">
                   <BarChart2 size={16} />
                </div>
              ))}
           </div>

           <div className="flex items-center gap-2">
              <button 
                onClick={clearCompare}
                className="hidden sm:block text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest px-4"
              >
                {t('remove')}
              </button>
              <Link 
                href="/compare"
                className="h-12 bg-slate-900 text-white px-6 rounded-2xl font-black text-xs flex items-center gap-2 hover:bg-primary transition-all active:scale-95"
              >
                 {t('compare_now')}
                 <ChevronRight size={14} />
              </Link>
           </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
