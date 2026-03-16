"use client";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

export default function CartDrawer() {
  const t = useTranslations('common');
  const { isCartOpen, closeCart } = useUIStore();
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <ShoppingBag className="text-primary" />
                <h2 className="text-xl font-black text-slate-900 attach-font-sans">{t('your_cart')}</h2>
                <span className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <button onClick={closeCart} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-300">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="text-slate-500 font-bold">{t('cart_empty')}</p>
                  <button 
                    onClick={closeCart}
                    className="text-primary font-bold hover:underline"
                  >
                    {t('start_shopping')}
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="relative w-24 h-24 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      {item.image ? (
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-300">SMARTY</div>
                      )}
                    </div>
                    <div className="flex-grow space-y-2">
                       <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                             <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-slate-900 font-bold hover:text-primary transition-colors">-</button>
                             <span className="px-2 font-black text-slate-900 text-sm min-w-[30px] text-center">{item.quantity}</span>
                             <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-slate-900 font-bold hover:text-primary transition-colors">+</button>
                          </div>
                          <p className="font-black text-primary">{(item.price * item.quantity).toFixed(2)} {t('currency')}</p>
                       </div>
                       <button 
                         onClick={() => removeItem(item.id)}
                         className="text-xs text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                       >
                         <Trash2 size={12} />
                         {t('remove')}
                       </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-8 border-t bg-slate-50 space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-bold">{t('subtotal')}</span>
                  <span className="text-2xl font-black text-slate-900">{totalPrice().toFixed(2)} {t('currency')}</span>
                </div>
                <div className="space-y-3">
                  <Link 
                    href="/checkout" 
                    onClick={closeCart}
                    className="w-full h-14 bg-primary text-white rounded-xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-primary/20"
                  >
                    {t('checkout_now')}
                    <ArrowRight size={20} />
                  </Link>
                  <button 
                    onClick={closeCart}
                    className="w-full h-14 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-black hover:bg-slate-50 transition-all duration-300"
                  >
                    {t('continue_shopping')}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
