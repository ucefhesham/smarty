"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { cn, parsePrice } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { Link } from "@/navigation";
import { useRouter } from '@/navigation';
import { useCartStore } from '@/store/cartStore';
import AddToCartButton from './AddToCartButton';
import CustomProductOptions from './CustomProductOptions';
import ProductAttributes from './ProductAttributes';
import type { WPCFieldGroup } from '@/lib/wordpress';

interface ProductPurchaseActionsProps {
  product: any;
  categoryOptions: WPCFieldGroup[] | null;
  variations?: any[];
  locale: string;
}

export default function ProductPurchaseActions({ product, categoryOptions, variations = [], locale }: ProductPurchaseActionsProps) {
  const t = useTranslations('common');
  const [quantity, setQuantity] = useState(1);
  const [extraPrice, setExtraPrice] = useState(0);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedVariation, setSelectedVariation] = useState<any>(null);
  
  const router = useRouter();
  const addItem = useCartStore(state => state.addItem);
  const clearCart = useCartStore(state => state.clearCart);
  
  const basePrice = selectedVariation ? parsePrice(selectedVariation.price) : (parsePrice(product.price) || 0);
  const totalPrice = (basePrice + extraPrice) * quantity;
  const isOutOfStock = selectedVariation ? selectedVariation.stock_status === 'outofstock' : (product.stock_status === 'outofstock');

  // PREPARE VARIATION MAP
  // Key format: attrName1:option1|attrName2:option2|...
  const variationMap = useMemo(() => {
    const map = new Map<string, any>();
    variations.forEach(v => {
      const sortedAttrs = [...v.attributes].sort((a, b) => a.name.localeCompare(b.name));
      const key = sortedAttrs.map((attr: any) => `${attr.name}:${attr.option}`).join('|');
      map.set(key, v);
    });
    return map;
  }, [variations]);

  // Handle variation matching
  useEffect(() => {
    if (variations.length > 0 && Object.keys(selectedAttributes).length > 0) {
      const sortedSelectedEntries = Object.entries(selectedAttributes).sort((a, b) => a[0].localeCompare(b[0]));
      const queryKey = sortedSelectedEntries.map(([name, option]) => `${name}:${option}`).join('|');
      
      const match = variationMap.get(queryKey);
      setSelectedVariation(match || null);
    }
  }, [selectedAttributes, variations, variationMap]);

  const handleQuantityChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    if (isOutOfStock || (product.type === 'variable' && !selectedVariation)) return;
    
    clearCart();
    addItem({
      id: selectedVariation?.id || product.id,
      name: product.name + (selectedVariation ? ` - ${selectedVariation.attributes?.map((a:any) => a.option).join(', ')}` : ''),
      price: basePrice + extraPrice,
      quantity: quantity,
      image: selectedVariation?.image?.src || product.images?.[0]?.src
    });
    router.push('/checkout');
  };
 kitchen:;

  return (
    <div className="space-y-8">
      {/* Dynamic Price Display */}
      <div className="mb-8">
        <div className="flex items-baseline gap-4 mb-2">
          <span className="text-4xl font-black text-primary">
            {totalPrice.toLocaleString()} {t('currency')}
          </span>
          {product.on_sale && quantity === 1 && extraPrice === 0 && (
            <span className="text-xl text-slate-300 line-through font-bold">
              {product.regular_price} {t('currency')}
            </span>
          )}
        </div>
        {!isOutOfStock && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-[11px] uppercase tracking-wider">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {t('stock_ready')}
          </div>
        )}
      </div>

      {/* Attributes & Custom Options */}
      <div className="space-y-10 pb-10 border-b border-slate-100 mb-10">
         {product.attributes && product.attributes.length > 0 && (
           <ProductAttributes 
              attributes={product.attributes} 
              onSelect={setSelectedAttributes}
           />
         )}
         
         <CustomProductOptions 
            product={product} 
            categoryOptions={categoryOptions} 
            onPriceChange={setExtraPrice}
         />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-4 mb-10">
        <div className="flex items-center border-2 border-slate-200 rounded-lg px-2 h-[56px] bg-white">
          <button 
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-10 h-full flex items-center justify-center font-bold text-lg text-slate-900 hover:text-primary transition-colors"
          >
            -
          </button>
          <input 
            type="number" 
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-12 text-center font-black text-slate-900 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" 
          />
          <button 
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-10 h-full flex items-center justify-center font-bold text-lg text-slate-900 hover:text-primary transition-colors"
          >
            +
          </button>
        </div>
        
        <AddToCartButton 
          product={{
            ...product, 
            price: (basePrice + extraPrice).toString(),
            variation_id: selectedVariation?.id
          }} 
          disabled={isOutOfStock || (product.type === 'variable' && !selectedVariation)}
          className="px-12 h-[56px] rounded-lg font-black text-[13px] uppercase tracking-wider shadow-lg shadow-primary/10"
        >
           {t('add_to_cart')}
        </AddToCartButton>
        
        <button 
          onClick={handleBuyNow}
          disabled={isOutOfStock || (product.type === 'variable' && !selectedVariation)}
          className={cn(
            "px-12 h-[56px] rounded-lg font-black text-[13px] uppercase tracking-wider transition-all shadow-lg flex items-center justify-center",
            isOutOfStock || (product.type === 'variable' && !selectedVariation)
              ? "bg-slate-300 text-white cursor-not-allowed shadow-none" 
              : "bg-[#78b13f] text-white hover:bg-[#6a9d37] shadow-green-600/10"
          )}
        >
           {t('buy_now')}
        </button>

        {/* WhatsApp Button */}
        <a 
          href={`https://wa.me/962795644030?text=${encodeURIComponent(t('whatsapp_message') + product.name)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 h-[56px] bg-[#25D366] text-white rounded-lg font-black text-[12px] uppercase tracking-wider hover:bg-[#128C7E] transition-all flex items-center justify-center gap-3 shadow-lg shadow-green-400/10"
        >
           <MessageCircle size={18} fill="currentColor" />
           {t('order_whatsapp')}
        </a>
      </div>
    </div>
  );
}
