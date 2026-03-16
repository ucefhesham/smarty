"use client";

import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { ShoppingCart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CartIcon() {
  const t = useTranslations('common');
  const { totalItems, totalPrice } = useCartStore();
  const { toggleCart } = useUIStore();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex items-center gap-2">
      <ShoppingCart size={28} className="hidden md:block" />
      <div className="hidden lg:flex flex-col text-sm leading-tight">
        <span className="text-muted-foreground">{t('cart')}</span>
        <span className="font-bold">0.00 JOD</span>
      </div>
    </div>
  );

  return (
    <motion.div 
      onClick={toggleCart}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="relative cursor-pointer text-slate-500 hover:text-primary transition-colors flex items-center"
    >
      <div className="relative w-10 h-10 flex items-center justify-center hover:bg-slate-50 rounded-xl transition-all">
        <ShoppingCart size={22} strokeWidth={1.5} />
        <span className="absolute top-1 right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
          {totalItems()}
        </span>
      </div>
    </motion.div>
  );
}
