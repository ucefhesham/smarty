"use client";

import { useUIStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag, Check, Star, ArrowRight, Share2 } from "lucide-react";
import Image from "next/image";
import { Link } from "@/navigation";
import { useEffect, useState, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import ProductAttributes from "./ProductAttributes";
import { getProductVariationsAction } from "@/app/actions/products";
import { cn, parsePrice } from "@/lib/utils";
import { useRouter } from "@/navigation";

export default function QuickViewModal() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { quickViewProduct, setQuickViewProduct, openCart } = useUIStore();
  const addItem = useCartStore(state => state.addItem);
  const clearCart = useCartStore(state => state.clearCart);
  const router = useRouter();
  
  const [variations, setVariations] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (quickViewProduct) {
      setQuantity(1);
      setSelectedAttributes({});
      setSelectedVariation(null);
      
      if (quickViewProduct.type === 'variable') {
        setIsLoading(true);
        getProductVariationsAction(quickViewProduct.id, locale)
          .then(res => setVariations(res || []))
          .finally(() => setIsLoading(false));
      }
    } else {
      setVariations([]);
    }
  }, [quickViewProduct, locale]);

  // PREPARE VARIATION MAP
  const variationMap = useMemo(() => {
    const map = new Map<string, any>();
    variations.forEach(v => {
      const sortedAttrs = [...v.attributes].sort((a, b) => a.name.localeCompare(b.name));
      const key = sortedAttrs.map((attr: any) => `${attr.name}:${attr.option}`).join('|');
      map.set(key, v);
    });
    return map;
  }, [variations]);

  // Handle Variation Matching
  useEffect(() => {
    if (variations.length > 0 && Object.keys(selectedAttributes).length > 0) {
      const sortedSelectedEntries = Object.entries(selectedAttributes).sort((a, b) => a[0].localeCompare(b[0]));
      const queryKey = sortedSelectedEntries.map(([name, option]) => `${name}:${option}`).join('|');
      
      const match = variationMap.get(queryKey);
      setSelectedVariation(match || null);
    }
  }, [selectedAttributes, variations, variationMap]);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const basePrice = selectedVariation ? parsePrice(selectedVariation.price) : parsePrice(product.price);
  const totalPrice = basePrice * quantity;
  const isOutOfStock = product.stock_status === 'outofstock' || (selectedVariation && selectedVariation.stock_status === 'outofstock');

  const handleAddToCart = () => {
    addItem({
      id: selectedVariation?.id || product.id,
      name: product.name + (selectedVariation ? ` - ${selectedVariation.attributes?.map((a:any) => a.option).join(', ')}` : ''),
      price: basePrice,
      quantity: quantity,
      image: selectedVariation?.image?.src || product.images?.[0]?.src,
      variation_id: selectedVariation?.id
    } as any);
    
    setQuickViewProduct(null);
    setTimeout(openCart, 300);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    
    clearCart();
    addItem({
      id: selectedVariation?.id || product.id,
      name: product.name + (selectedVariation ? ` - ${selectedVariation.attributes?.map((a:any) => a.option).join(', ')}` : ''),
      price: basePrice,
      quantity: quantity,
      image: selectedVariation?.image?.src || product.images?.[0]?.src,
      variation_id: selectedVariation?.id
    } as any);
    
    setQuickViewProduct(null);
    router.push('/checkout');
  };
 kitchen:;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setQuickViewProduct(null)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-full"
        >
          {/* Close Button */}
          <button 
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-slate-400 hover:text-primary transition-all active:scale-95"
          >
            <X size={20} />
          </button>

          {/* Left: Gallery (Simplified) */}
          <div className="w-full md:w-1/2 bg-white relative p-8 flex items-center justify-center overflow-hidden border-r border-slate-50">
             <div className="relative w-full aspect-square">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].src} 
                    alt={product.name} 
                    fill 
                    className="object-contain mix-blend-multiply"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-black text-slate-200">SMARTY</div>
                )}
             </div>
             
             {/* Badges */}
             <div className="absolute top-8 left-8 flex flex-col gap-2">
                {product.on_sale && (
                  <span className="bg-primary text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-primary/20">
                    SALE
                  </span>
                )}
                <span className="bg-white text-slate-900 text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg">
                  NEW
                </span>
             </div>
          </div>

          {/* Right: Info */}
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto no-scrollbar flex flex-col">
            <div className="space-y-8">
               {/* Brand & Title */}
               <div className="space-y-3">
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brands?.[0]?.name || 'Smarty'}</span>
                     <div className="w-1 h-1 rounded-full bg-slate-200" />
                     <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill="#fbbf24" className="text-[#fbbf24]" />)}
                        <span className="text-[10px] font-bold text-slate-400 ml-1">(4.8)</span>
                     </div>
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">
                    {product.name}
                  </h2>
               </div>

               {/* Price */}
               <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    {totalPrice.toFixed(2)} <span className="text-xl font-bold ml-1">{t('currency')}</span>
                  </span>
                  {product.on_sale && (
                    <span className="text-xl text-slate-300 line-through font-bold">
                      {product.regular_price}
                    </span>
                  )}
               </div>

               {/* Description Snippet */}
               <div className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium" dangerouslySetInnerHTML={{ __html: product.short_description || product.description }} />

               {/* Attributes */}
               <div className="space-y-6">
                  {isLoading ? (
                    <div className="space-y-4 animate-pulse">
                      <div className="h-4 w-24 bg-slate-100 rounded" />
                      <div className="flex gap-2">
                        <div className="h-10 w-10 bg-slate-100 rounded-full" />
                        <div className="h-10 w-10 bg-slate-100 rounded-full" />
                      </div>
                    </div>
                  ) : (
                    product.attributes && product.attributes.length > 0 && (
                      <ProductAttributes 
                        attributes={product.attributes} 
                        onSelect={setSelectedAttributes} 
                      />
                    )
                  )}
               </div>

               {/* Quantity & Buy */}
               <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <div className="h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl flex items-center px-2 w-full sm:w-auto">
                     <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors font-bold text-lg">-</button>
                     <span className="px-6 font-black text-slate-900">{quantity}</span>
                     <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-primary transition-colors font-bold text-lg">+</button>
                  </div>
                  
                  <div className="flex flex-col gap-2 flex-grow w-full">
                    <button 
                      disabled={isOutOfStock}
                      onClick={handleAddToCart}
                      className="h-14 bg-slate-100 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-200 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase text-[10px] tracking-widest px-8"
                    >
                      <ShoppingBag size={18} />
                      {t('add_to_cart')}
                    </button>
                    
                    {!isOutOfStock && (
                      <button 
                        onClick={handleBuyNow}
                        className="h-14 bg-primary text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 transition-all shadow-xl shadow-primary/20 active:scale-[0.98] uppercase text-[10px] tracking-widest px-8"
                      >
                        {t('buy_now')}
                      </button>
                    )}
                    
                    {isOutOfStock && (
                      <div className="h-14 bg-slate-300 text-white rounded-2xl font-black flex items-center justify-center uppercase text-[10px] tracking-widest px-8">
                        {t('out_of_stock')}
                      </div>
                    )}
                  </div>
               </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-10 flex items-center justify-between border-t border-slate-100 mt-12">
               <Link 
                 href={`/product/${product.slug}`} 
                 onClick={() => setQuickViewProduct(null)}
                 className="text-xs font-black text-slate-400 hover:text-primary flex items-center gap-2 transition-colors uppercase tracking-widest"
               >
                   {t('view_full_details')}
                   <ArrowRight size={14} />
               </Link>
               
               <button className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Share2 size={16} />
               </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
