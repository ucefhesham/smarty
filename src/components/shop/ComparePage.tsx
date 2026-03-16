"use client";

import { useCompareStore } from "@/store/compareStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, Trash2, ShoppingCart, ArrowRight, ShieldCheck, Zap, Award, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { cn, parsePrice } from "@/lib/utils";
import { useState, useEffect } from "react";
import { syncCompareItems } from "@/app/actions/products";

export default function ComparePage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { items, removeItem, clearCompare } = useCompareStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const [syncedItems, setSyncedItems] = useState(items);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    async function sync() {
      if (items.length === 0) {
        setSyncedItems([]);
        return;
      }
      
      setIsSyncing(true);
      try {
        const syncPayload = items.map(item => ({ id: item.id, sku: item.sku }));
        const updatedProducts = await syncCompareItems(syncPayload, locale);
        
        if (updatedProducts && updatedProducts.length > 0) {
          const synced = items.map((originalItem, index) => {
            const fresh = updatedProducts[index];
            if (!fresh) return originalItem;
            
            return {
              ...originalItem,
              id: fresh.id,
              name: fresh.name,
              slug: fresh.slug,
              sku: fresh.sku,
              price: fresh.price,
              short_description: fresh.short_description,
              stock_status: fresh.stock_status,
              attributes: fresh.attributes
            };
          });
          setSyncedItems(synced);
        }
      } catch (err) {
        console.error("Sync error:", err);
      } finally {
        setIsSyncing(false);
      }
    }
    
    sync();
  }, [locale, items.length]);

  const handleAddToCart = (item: any) => {
    addItem({
      id: item.id,
      name: item.name,
      price: parsePrice(item.price),
      quantity: 1,
      image: item.image,
    });
    openCart();
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] pb-24">
      {/* Header Section */}
      <div className="bg-white border-b border-slate-100 pt-32 pb-16 md:pt-48 md:pb-24">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col items-center text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-2"
           >
              <GitCompare size={32} strokeWidth={1.5} />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter flex items-center justify-center gap-4"
           >
             {t('compare_products')}
             {isSyncing && <Loader2 className="animate-spin text-primary w-10 h-10" />}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs"
           >
             {t('ultimate_battle')}
           </motion.p>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-6 mt-12">
        <AnimatePresence mode="popLayout">
          {syncedItems.length > 0 ? (
            <div className="space-y-12">
               {/* Comparison Table Grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-slate-100 border border-slate-100 rounded-[3rem] overflow-hidden shadow-luxury">
                  {syncedItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white p-8 md:p-10 flex flex-col relative group"
                    >
                       {/* Remove Button */}
                       <button 
                         onClick={() => removeItem(item.id)}
                         className="absolute top-6 right-6 w-8 h-8 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 z-20"
                       >
                          <Trash2 size={14} />
                       </button>

                       {/* Product Info */}
                       <div className="space-y-8 flex-grow">
                          <Link href={`/product/${item.slug}`} className="block relative aspect-square bg-white rounded-3xl p-6 group-hover:scale-105 transition-transform duration-500 border border-slate-50">
                             {item.image ? (
                               <Image src={item.image} alt={item.name} fill className="object-contain" />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center font-black text-slate-200">SMARTY</div>
                             )}
                          </Link>
                          
                          <div className="space-y-4">
                             {/* Stock Status - Real Data */}
                             <div className="flex items-center gap-2 mb-2">
                                <div className={cn(
                                  "w-2 h-2 rounded-full animate-pulse",
                                  item.stock_status === 'outofstock' ? "bg-red-500" : "bg-green-500"
                                )} />
                                <span className={cn(
                                  "text-[10px] font-black uppercase tracking-widest",
                                  item.stock_status === 'outofstock' ? "text-red-500" : "text-green-500"
                                )}>
                                  {item.stock_status === 'outofstock' ? t('out_of_stock') : t('in_stock')}
                                </span>
                             </div>

                             <Link href={`/product/${item.slug}`}>
                                <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                                   {item.name}
                                </h3>
                             </Link>
                             <p className="text-3xl font-black text-primary tracking-tighter">{item.price} {t('currency')}</p>
                          </div>

                          {/* Short Description - Real Data */}
                          {item.short_description && (
                            <div 
                              className="text-xs text-slate-400 font-medium leading-relaxed line-clamp-3"
                              dangerouslySetInnerHTML={{ __html: item.short_description }}
                            />
                          )}

                          {/* Real Attributes Display */}
                          <div className="space-y-6 pt-6 border-t border-slate-50">
                             {item.attributes && item.attributes.length > 0 ? (
                                item.attributes.map((attr: any) => (
                                  <div key={attr.name} className="space-y-2">
                                     <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block font-lexend">{attr.name}</span>
                                     <div className="flex flex-wrap gap-2">
                                        {attr.options.map((opt: string) => (
                                          <span key={opt} className="px-3 py-1 bg-slate-50 rounded-lg text-[11px] font-bold text-slate-900 border border-slate-100">
                                            {opt}
                                          </span>
                                        ))}
                                     </div>
                                  </div>
                                ))
                             ) : (
                               <div className="py-4 font-bold text-[10px] text-slate-300 uppercase tracking-widest">
                                  {t('no_details_available')}
                               </div>
                             )}
                          </div>
                       </div>

                       {/* CTA */}
                       <button 
                         onClick={() => handleAddToCart(item)}
                         className="mt-12 h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95"
                       >
                          <ShoppingCart size={18} />
                          {t('add_to_cart')}
                       </button>
                    </motion.div>
                  ))}
                  
                  {/* Empty Slots */}
                  {[...Array(Math.max(0, 4 - syncedItems.length))].map((_, i) => (
                    <div key={i} className="bg-slate-50/50 p-10 flex flex-col items-center justify-center border-l border-slate-100 first:border-l-0">
                       <div className="w-16 h-16 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-200 mb-4">
                          <Check size={24} />
                       </div>
                       <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Available Slot</p>
                    </div>
                  ))}
               </div>

               <div className="flex justify-center">
                  <button 
                    onClick={clearCompare}
                    className="h-14 px-10 border-2 border-slate-200 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
                  >
                    {t('clear_comparison')}
                  </button>
               </div>
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-32 space-y-8"
            >
               <div className="w-32 h-32 bg-white rounded-[3rem] shadow-luxury flex items-center justify-center text-slate-100">
                  <GitCompare size={64} strokeWidth={1.5} />
               </div>
               <div className="text-center space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{t('nothing_to_compare')}</h2>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">{t('compare_description')}</p>
               </div>
               <Link 
                 href="/shop" 
                 className="h-16 px-12 bg-primary text-white rounded-2xl font-black flex items-center gap-4 hover:bg-slate-900 transition-all shadow-xl shadow-primary/20 group"
               >
                  {locale === 'ar' ? 'استكشف المجموعات' : 'Explore Collections'}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
               </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
