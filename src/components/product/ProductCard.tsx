"use client";

import { Link, useRouter } from '@/navigation';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';
import { Star, Check, GitCompare, Eye, Heart } from 'lucide-react';
import { cn, parsePrice } from '@/lib/utils';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCompareStore } from '@/store/compareStore';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import React from 'react';

export default function ProductCard({ product }: { product: any }) {
  const t = useTranslations('common');
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { isInCompare, addItem: addToCompare, removeItem: removeFromCompare } = useCompareStore();
  const { setQuickViewProduct } = useUIStore();
  const addItem = useCartStore(state => state.addItem);
  const clearCart = useCartStore(state => state.clearCart);
  const openCart = useUIStore(state => state.openCart);
  const router = useRouter();

  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const discount = product.on_sale && product.regular_price 
    ? Math.round((1 - (parseFloat(product.price) / parseFloat(product.regular_price))) * 100)
    : 0;

  const brand = (product.brands?.[0]?.name || product.brand || "Smarty");

  const isFavorite = mounted && isInWishlist(product.id);
  const isCompared = mounted && isInCompare(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src,
        slug: product.slug
      });
    }
  };

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCompare(product.id)) {
      removeFromCompare(product.id);
    } else {
      addToCompare({
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        image: product.images?.[0]?.src,
        slug: product.slug,
        short_description: product.short_description,
        stock_status: product.stock_status,
        attributes: product.attributes
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.type === 'simple') {
      clearCart();
      addItem({
        id: product.id,
        name: product.name,
        price: parsePrice(product.price),
        quantity: 1,
        image: product.images?.[0]?.src
      });
      router.push('/checkout');
    } else {
      setQuickViewProduct(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.type === 'simple') {
      addItem({
        id: product.id,
        name: product.name,
        price: parsePrice(product.price),
        quantity: 1,
        image: product.images?.[0]?.src
      });
      openCart();
    } else {
      setQuickViewProduct(product);
    }
  };

  return (
    <div className="luxury-card group flex flex-col h-full bg-white overflow-hidden relative border border-slate-100 rounded-[10px] p-4 transition-all duration-300">
      {/* Discount Badge */}
      {product.on_sale && (
        <div className={cn("absolute top-4 z-10", isRtl ? "right-4" : "left-4")}>
          <span className="bg-primary text-white text-[9px] font-bold px-3 py-1 rounded-full flex items-center justify-center min-w-[35px]">
            -{discount}%
          </span>
        </div>
      )}

      {/* Image Wrapper */}
      <div className="relative aspect-square overflow-hidden bg-white block mb-4">
        <Link href={`/product/${product.slug || product.id}`}>
          {product.images?.[0] ? (
            <Image 
              src={product.images[0].src} 
              alt={product.name}
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-primary/5 font-black text-2xl font-sans">SMARTY</div>
          )}
        </Link>

        {/* Hover Actions Container */}
        <div className={cn(
          "absolute top-4 z-30 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] hidden md:block",
          isRtl ? "left-[-60px] group-hover:left-3" : "right-[-60px] group-hover:right-3"
        )}>
           <div className="flex flex-col bg-white shadow-luxury rounded-xl overflow-hidden border border-slate-100">
                <button 
                  onClick={toggleCompare}
                  className={cn(
                    "w-10 h-10 flex items-center justify-center transition-all group/action relative border-b border-slate-50",
                    isCompared ? "text-primary bg-primary/5" : "text-slate-400 hover:bg-slate-50 hover:text-primary"
                  )}
                >
                   <GitCompare size={18} />
                   <div className={cn(
                     "absolute px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap rounded-md opacity-0 group-hover/action:opacity-100 transition-all pointer-events-none shadow-xl",
                     isRtl ? "left-full ml-3 translate-x-[-8px] group-hover/action:translate-x-0" : "right-full mr-3 translate-x-2 group-hover/action:translate-x-0"
                   )}>
                     {t('compare')}
                     <div className={cn("absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45", isRtl ? "-left-1" : "-right-1")} />
                   </div>
                </button>

                <button 
                  onClick={handleQuickView}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-primary transition-all group/action relative border-b border-slate-50"
                >
                   <Eye size={18} />
                   <div className={cn(
                     "absolute px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap rounded-md opacity-0 group-hover/action:opacity-100 transition-all pointer-events-none shadow-xl",
                     isRtl ? "left-full ml-3 translate-x-[-8px] group-hover/action:translate-x-0" : "right-full mr-3 translate-x-2 group-hover/action:translate-x-0"
                   )}>
                     {t('quick_view')}
                     <div className={cn("absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45", isRtl ? "-left-1" : "-right-1")} />
                   </div>
                </button>

                <button 
                   onClick={toggleWishlist}
                   className={cn(
                     "w-10 h-10 flex items-center justify-center transition-all group/action relative",
                     isFavorite ? "text-red-500 bg-red-50" : "text-slate-400 hover:bg-slate-50 hover:text-red-500"
                   )}
                >
                   <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                   <div className={cn(
                     "absolute px-2.5 py-1.5 bg-slate-900 text-white text-[10px] font-bold whitespace-nowrap rounded-md opacity-0 group-hover/action:opacity-100 transition-all pointer-events-none shadow-xl",
                     isRtl ? "left-full ml-3 translate-x-[-8px] group-hover/action:translate-x-0" : "right-full mr-3 translate-x-2 group-hover/action:translate-x-0"
                   )}>
                     {t('wishlist')}
                     <div className={cn("absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 rotate-45", isRtl ? "-left-1" : "-right-1")} />
                   </div>
                </button>
           </div>
        </div>
      </div>

      {/* Content */}
      <div className={cn("flex flex-col flex-grow", isRtl ? "text-right" : "text-left")}>
        <Link href={`/product/${product.slug || product.id}`} className="block mb-0.5">
          <h3 className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors leading-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>

        <div className={cn("mb-2", isRtl ? "text-right" : "text-left")}>
          <span className="text-[11px] text-slate-400 font-medium tracking-tight">
            {(() => {
              const name = product.categories?.[0]?.name || "Luxury Tech";
              return name.includes('%') ? decodeURIComponent(name) : name;
            })()}
          </span>
        </div>

        {/* Rating */}
        <div className={cn("flex items-center gap-0.5 mb-2")}>
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={14} fill="#fbbf24" className="text-[#fbbf24]" />
          ))}
        </div>

        {/* Variations / Attributes Preview */}
        {product.attributes && product.attributes.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.attributes.map((attr: any) => (
              <div key={attr.name} className="flex gap-1">
                {attr.options.slice(0, 3).map((opt: string) => (
                  <div 
                    key={opt}
                    className={cn(
                      "w-4 h-4 rounded-full border border-slate-200",
                      (attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('لون')) ? "" : "bg-slate-50 flex items-center justify-center text-[8px] font-bold"
                    )}
                    style={{ 
                      backgroundColor: (attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('لون')) ? (opt.toLowerCase() === 'white' ? '#fff' : opt.toLowerCase()) : undefined 
                    }}
                  >
                    {!(attr.name.toLowerCase().includes('color') || attr.name.toLowerCase().includes('لون')) && opt[0]}
                  </div>
                ))}
                {attr.options.length > 3 && <span className="text-[8px] font-bold text-slate-400">+{attr.options.length - 3}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Stock Status */}
        <div className={cn("flex items-center gap-1.5 mb-3")}>
          <Check size={14} className="text-primary font-bold" strokeWidth={3} />
          <span className="text-xs font-bold text-slate-800">{t('in_stock')}</span>
        </div>

        {/* Pricing Row */}
        <div className={cn("flex items-center mb-4 mt-auto")}>
          <div className="flex items-center gap-2">
            {product.on_sale && (
              <span className="text-xs text-slate-300 line-through font-medium">
                {product.regular_price} JOD
              </span>
            )}
            <span className="text-base font-bold text-primary">
              {product.price} JOD
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 mb-4">
          <button 
            onClick={handleAddToCart}
            className="w-full h-10 bg-primary text-white md:bg-slate-100 md:text-slate-900 rounded-lg font-bold text-xs transition-all hover:bg-primary/90 md:hover:bg-slate-200 active:scale-95 shadow-sm uppercase tracking-widest"
          >
            {product.type === 'simple' ? t('add_to_cart') : t('select_options')}
          </button>
          
          {product.type === 'simple' && (
            <button 
              onClick={handleBuyNow}
              className="hidden md:block w-full h-10 bg-primary text-white rounded-lg font-bold text-xs transition-all hover:bg-slate-900 active:scale-95 shadow-lg shadow-primary/5 uppercase tracking-widest"
            >
              {t('buy_now')}
            </button>
          )}
        </div>

        {/* Brand Instead of SKU */}
        <div className={cn("flex items-center")}>
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
            {t('brand_label')}: <span className="text-primary font-black tracking-normal text-[11px] decoration-primary/20">
              {brand.includes('%') ? decodeURIComponent(brand) : brand}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
