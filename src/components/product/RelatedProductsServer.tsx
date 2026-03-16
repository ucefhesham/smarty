import React from 'react';
import { getProducts } from '@/lib/wordpress';
import ProductCard from '@/components/product/ProductCard';
import ProductSkeleton from '@/components/product/ProductSkeleton';
import { getTranslations } from 'next-intl/server';

interface RelatedProductsServerProps {
  relatedIds: number[];
  locale: string;
}

export default async function RelatedProductsServer({ relatedIds, locale }: RelatedProductsServerProps) {
  if (!relatedIds || relatedIds.length === 0) return null;

  const [t, { products: relatedProducts }] = await Promise.all([
    getTranslations('common'),
    getProducts(`include=${relatedIds.slice(0, 4).join(',')}`, locale)
  ]);

  if (!relatedProducts || relatedProducts.length === 0) return null;

  return (
    <div className="bg-slate-50 py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">{t('related_products')}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((p: any) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function RelatedProductsSkeleton() {
  return (
    <div className="bg-slate-50 py-24">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="text-center mb-16 animate-pulse">
          <div className="h-8 bg-slate-200 rounded-lg w-48 mx-auto mb-4"></div>
          <div className="w-20 h-1 bg-slate-200 mx-auto rounded-full" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-[20px] shadow-sm animate-pulse border border-slate-100">
                <ProductSkeleton />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
