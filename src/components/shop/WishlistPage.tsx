"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { useTranslations, useLocale } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ShoppingBag, ArrowRight, ShoppingCart, Sparkles } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { cn, parsePrice } from "@/lib/utils";

export default function WishlistPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { items, removeItem, clearWishlist } = useWishlistStore();
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

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
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center space-y-6">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="w-16 h-16 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-2"
           >
              <Heart size={32} fill="currentColor" strokeWidth={1} />
           </motion.div>
           <motion.h1 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter"
           >
             {locale === 'ar' ? 'المفضلة' : 'My Wishlist'}
           </motion.h1>
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs"
           >
             {items.length} {items.length === 1 ? 'Item' : 'Items'} Saved Forever
           </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-12">
        <AnimatePresence mode="popLayout">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              <div className="flex justify-end mb-4">
                 <button 
                   onClick={clearWishlist}
                   className="text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-[0.2em] flex items-center gap-2"
                 >
                    <Trash2 size={12} />
                    {locale === 'ar' ? 'مسح الكل' : 'Clear All'}
                 </button>
              </div>

              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-[2rem] p-6 md:p-8 border border-slate-100 flex flex-col md:flex-row items-center gap-8 group hover:shadow-luxury transition-all duration-500"
                >
                  {/* Image */}
                  <Link href={`/product/${item.slug}`} className="relative w-full md:w-32 h-32 md:h-32 bg-white border border-slate-100 rounded-2xl overflow-hidden p-4 group-hover:scale-105 transition-transform duration-500">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-contain" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-slate-200">SMARTY</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="flex-grow space-y-2 text-center md:text-left">
                     <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center justify-center md:justify-start gap-2">
                        <Sparkles size={12} />
                        {locale === 'ar' ? 'تقنية فاخرة' : 'Luxury Tech'}
                     </span>
                     <Link href={`/product/${item.slug}`}>
                        <h3 className="text-xl font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-2">{item.name}</h3>
                     </Link>
                     <p className="text-primary font-black text-lg">{item.price} JOD</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto mt-4 md:mt-0">
                     <button 
                       onClick={() => handleAddToCart(item)}
                       className="w-full sm:w-auto h-14 bg-slate-900 text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary transition-all shadow-xl active:scale-95"
                     >
                        <ShoppingCart size={18} />
                        {locale === 'ar' ? 'نقل إلى العربة' : 'Move to Cart'}
                     </button>
                     <button 
                        onClick={() => removeItem(item.id)}
                        className="w-full sm:w-14 h-14 border-2 border-slate-100 text-slate-300 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all active:scale-95"
                     >
                        <Trash2 size={20} />
                     </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="flex flex-col items-center justify-center py-32 space-y-8"
            >
               <div className="w-32 h-32 bg-white rounded-[3rem] shadow-luxury flex items-center justify-center text-slate-100 relative">
                  <Heart size={64} fill="currentColor" strokeWidth={1} />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full"
                  />
               </div>
               <div className="text-center space-y-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{locale === 'ar' ? 'قائمة الأمنيات فارغة' : 'Your wishlist is empty'}</h2>
                  <p className="text-slate-400 font-medium max-w-xs mx-auto">
                    {locale === 'ar' ? 'املأها بأفضل تقنيات المنزل الذكي في الأردن.' : 'Fill it with the best smart home technology in Jordan.'}
                  </p>
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
