import ProductCard from '../product/ProductCard';
import { getProducts } from '@/lib/wordpress';
import { getTranslations } from 'next-intl/server';
import Pagination from './Pagination';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductGridServerProps {
  locale: string;
  queryParams: string;
  view?: string;
  page?: string;
}

export default async function ProductGridServer({ locale, queryParams, view, page }: ProductGridServerProps) {
  const t = await getTranslations('common');
  const { products: displayProducts, total, totalPages } = await getProducts(queryParams, locale);

  const gridClasses = cn(
    "grid gap-4 md:gap-6",
    view === 'list_small' && "grid-cols-1",
    (!view || view === 'grid_mobile') && "grid-cols-2 lg:grid-cols-3",
    view === 'list' && "grid-cols-1",
    view === 'grid_4' && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    view === 'grid_3' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  );

  if (displayProducts.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 bg-white rounded-[10px] shadow-luxury border border-slate-100 mt-8">
        <h3 className="text-2xl font-bold">{t('shop_no_products')}</h3>
        <p className="text-muted-foreground">{t('shop_adjust_filters')}</p>
        <Link href="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-slate-900 transition-all">
          {t('shop_reset_filters')}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className={gridClasses}>
        {displayProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <Pagination 
            currentPage={parseInt(page || '1', 10)} 
            totalPages={totalPages} 
          />
        </div>
      )}
    </>
  );
}
