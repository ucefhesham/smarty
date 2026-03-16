"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import { useUIStore } from "@/store/uiStore";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { cn, parsePrice } from "@/lib/utils";

export default function AddToCartButton({ 
  product, 
  className, 
  children,
  disabled 
}: { 
  product: any, 
  className?: string, 
  children?: React.ReactNode,
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUIStore((state) => state.openCart);

  const handleAdd = () => {
    if (disabled) return;
    setLoading(true);
    addItem({
      id: product.id,
      name: product.name,
      price: parsePrice(product.price),
      quantity: 1,
      image: product.images?.[0]?.src,
    });
    
    setTimeout(() => {
      setLoading(false);
      openCart();
    }, 500);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading || disabled}
      className={cn(
        "rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-all duration-300 gap-3 px-6 h-[50px]",
        (loading || disabled) && "opacity-50 cursor-not-allowed scale-95",
        disabled && "bg-slate-300 hover:bg-slate-300",
        className
      )}
    >
       {loading ? (
          <ShoppingCart size={20} className="animate-bounce" />
       ) : (
          children || <ShoppingCart size={22} />
       )}
    </button>
  );
}
