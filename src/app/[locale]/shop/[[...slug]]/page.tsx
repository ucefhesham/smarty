import { Link } from '@/navigation';
import React from 'react';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getProducts, getCategories, getBrands, getAttributes, getAttributeTerms } from '@/lib/wordpress';
import { redirect } from '@/navigation';
import ProductCard from '@/components/product/ProductCard';
import SectionHeader from '@/components/ui/SectionHeader';
import Sidebar from '@/components/shop/Sidebar';
import ShopToolbar from '@/components/shop/ShopToolbar';
import Pagination from '@/components/shop/Pagination';

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string, slug?: string[] }> 
}): Promise<Metadata> {
  const { slug } = await params;
  
  if (!slug || slug.length === 0) {
    return {
      title: 'Shop - Premium Electronics & Home Automation',
      description: 'Browse our extensive collection of smart home devices, security cameras, and networking solutions.',
    };
  }

  const titleRaw = slug[slug.length - 1].replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const title = decodeURIComponent(titleRaw);
  return {
    title: `${title} - SmartyJo Shop`,
    description: `Explore our collection of ${title} products at SmartyJo.`,
  };
}

export default async function ShopPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ locale: string, slug?: string[] }>,
  searchParams: Promise<{ 
    min_price?: string, 
    max_price?: string, 
    orderby?: string, 
    order?: string, 
    per_page?: string,
    view?: string,
    page?: string,
    search?: string,
    on_sale?: string,
    stock_status?: string,
    [key: string]: string | undefined
  }>
}) {
  const [
    { locale, slug }, 
    { min_price, max_price, orderby, order, per_page, view, page, search }
  ] = await Promise.all([
    params,
    searchParams
  ]);

  const allSearchParams = await searchParams; // To access dynamic keys
  
  setRequestLocale(locale);
  const t = await getTranslations('common');
  
  // 1. Resolve Category or Brand from slug
  let categoryId: string | undefined = undefined;
  let brandSlugArg: string | undefined = undefined;

  const [categories, realBrands, rawAttributes] = await Promise.all([
    getCategories(locale),
    getBrands(locale),
    getAttributes(locale)
  ]);

  const allCategories = Array.isArray(categories) ? categories : [];
  const allBrands = Array.isArray(realBrands) ? realBrands : [];
  const allAttributes = Array.isArray(rawAttributes) ? rawAttributes : [];

  // PREPARE LOOKUPS ONCE PER REQUEST
  const brandsBySlug = new Map(allBrands.map(b => [decodeURIComponent(b.slug), b]));
  const brandsById = new Map(allBrands.map(b => [b.id, b]));
  const categoriesBySlug = new Map(allCategories.map(c => [decodeURIComponent(c.slug), c]));
  const categoriesById = new Map(allCategories.map(c => [c.id, c]));

  // Fetch terms for all attributes sequentially to avoid overloading the API
  const attributesWithTerms = [];
  for (const attr of allAttributes) {
    const terms = await getAttributeTerms(String(attr.id), locale);
    attributesWithTerms.push({ 
      ...attr, 
      terms: Array.isArray(terms) ? terms.filter((t: any) => t.count > 0) : [] 
    });
  }

  const queryParams = new URLSearchParams();

  // Add all recognized pa_ attribute filters from searchParams
  Object.keys(allSearchParams).forEach(key => {
    if (key.startsWith('pa_')) {
      const val = allSearchParams[key as keyof typeof allSearchParams];
      if (val) queryParams.set(key, val);
    }
  });

  if (slug && slug.length > 0) {
    if (slug[0] === 'brand' && slug[1]) {
      brandSlugArg = decodeURIComponent(slug[1]);
      
      const b = brandsBySlug.get(brandSlugArg);
      if (b) {
        queryParams.set('product_brand', String(b.id));
        queryParams.set('brand', String(b.id));
      } else {
        // Brand redirect logic
        const otherLocale = locale === 'en' ? 'ar' : 'en';
        const otherBrands = await getBrands(otherLocale);
        const bOther = (otherBrands || []).find((b: any) => decodeURIComponent(b.slug) === brandSlugArg);
        
        if (bOther && bOther.translations && bOther.translations[locale]) {
          const targetId = bOther.translations[locale];
          const targetBrand = brandsById.get(targetId);
          if (targetBrand) {
            redirect({ href: `/shop/brand/${targetBrand.slug}`, locale });
          }
        }
        queryParams.set('brand', brandSlugArg); 
      }
    } else {
      const slugToFind = slug[slug.length - 1];
      const decodedSlugToFind = decodeURIComponent(slugToFind);
      let cat = categoriesBySlug.get(decodedSlugToFind);
      
      if (!cat) {
        const otherLocale = locale === 'en' ? 'ar' : 'en';
        const otherCategories = await getCategories(otherLocale);
        const otherCat = (otherCategories || []).find((c: any) => decodeURIComponent(c.slug) === decodedSlugToFind);
        
        if (otherCat && otherCat.translations && otherCat.translations[locale]) {
          const targetId = otherCat.translations[locale];
          const targetCat = categoriesById.get(targetId);
          if (targetCat) {
             redirect({ href: `/shop/${targetCat.slug}`, locale });
          }
        }
      } else {
        categoryId = String(cat.id);
      }
    }
  }

  if (categoryId) queryParams.set('category', categoryId);
  if (min_price) queryParams.set('min_price', min_price);
  if (max_price) queryParams.set('max_price', max_price);
  if (orderby) queryParams.set('orderby', orderby);
  if (order) queryParams.set('order', order);
  if (search) queryParams.set('search', search);
  if (allSearchParams.on_sale) queryParams.set('on_sale', allSearchParams.on_sale);
  if (allSearchParams.stock_status) queryParams.set('stock_status', allSearchParams.stock_status);

  queryParams.set('per_page', per_page || '12');
  queryParams.set('page', page || '1');
  
  const { products: displayProducts, total, totalPages } = await getProducts(queryParams.toString(), locale);

  const displayNameRaw = search
    ? `${t('search_results')}: "${search}"`
    : categoryId 
      ? categoriesById.get(Number(categoryId))?.name 
      : brandSlugArg
        ? brandsBySlug.get(brandSlugArg)?.name || brandSlugArg
        : t('shop_all_products');

  const displayName = displayNameRaw?.includes('%') ? decodeURIComponent(displayNameRaw) : displayNameRaw;

  const gridClasses = cn(
    "grid gap-4 md:gap-6",
    view === 'list_small' && "grid-cols-1",
    (!view || view === 'grid_mobile') && "grid-cols-2 lg:grid-cols-3",
    view === 'list' && "grid-cols-1",
    view === 'grid_4' && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    view === 'grid_3' && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  );

  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-12 pt-4 md:pt-8">
        
        {/* Mobile Title - Appears at the very top on mobile only */}
        <div className="mb-6 md:hidden">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {displayName}
          </h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
            {total} {t('products')}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-72 shrink-0">
            <Sidebar 
              categories={allCategories} 
              brands={allBrands} 
              attributes={attributesWithTerms}
              activeCategory={categoryId} 
              activeBrand={brandSlugArg}
            />
          </aside>

          <div className="flex-grow">
             <ShopToolbar 
                categoryName={displayName}
                totalProducts={total}
                perPage={per_page}
                orderby={orderby}
                order={order}
             />

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
             
             {displayProducts.length === 0 && (
               <div className="py-20 text-center space-y-4 bg-white rounded-[10px] shadow-luxury border border-slate-100 mt-8">
                  <h3 className="text-2xl font-bold">{t('shop_no_products')}</h3>
                  <p className="text-muted-foreground">{t('shop_adjust_filters')}</p>
                  <Link href="/shop" className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-slate-900 transition-all">
                     {t('shop_reset_filters')}
                  </Link>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
