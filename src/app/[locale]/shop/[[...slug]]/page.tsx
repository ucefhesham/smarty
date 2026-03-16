import { Link } from '@/navigation';
import React, { Suspense } from 'react';
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
import SidebarServer from '@/components/shop/SidebarServer';
import ProductGridServer from '@/components/shop/ProductGridServer';
import ProductSkeleton from '@/components/product/ProductSkeleton';

function SidebarSkeleton() {
  return (
    <div className="space-y-8 animate-pulse p-6 bg-white rounded-2xl shadow-sm">
      <div className="h-8 bg-slate-100 rounded-lg w-1/2 mb-6"></div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-10 bg-slate-50 rounded-xl w-full"></div>
        ))}
      </div>
    </div>
  );
}

function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <div key={i} className="bg-white rounded-[20px] shadow-sm animate-pulse border border-slate-100">
            <ProductSkeleton />
        </div>
      ))}
    </div>
  );
}

export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ locale: string, slug?: string[] }> 
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'common' });
  
  if (!slug || slug.length === 0) {
    return {
      title: t('shop_all_products'),
      description: t('site_description'),
      openGraph: {
        title: `${t('shop_all_products')} | ${t('title')}`,
        description: t('site_description'),
      }
    };
  }

  const lastSlug = decodeURIComponent(slug[slug.length - 1]);
  let displayName = lastSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  let seoTitle = "";

  try {
     if (slug[0] === 'brand' && slug[1]) {
        const brands = await getBrands(locale);
        const brand = brands.find((b: any) => b.slug === slug[1] || decodeURIComponent(b.slug) === slug[1]);
        if (brand) {
          displayName = brand.name;
          seoTitle = t('seo_brand_title', { brand: brand.name });
        }
     } else {
        const categories = await getCategories(locale);
        const category = categories.find((c: any) => c.slug === lastSlug || decodeURIComponent(c.slug) === lastSlug);
        if (category) {
          displayName = category.name;
          seoTitle = t('seo_category_title', { category: category.name });
        }
     }
  } catch (e) {
     console.error("SEO metadata fetch failed:", e);
  }

  const cleanName = displayName.includes('%') ? decodeURIComponent(displayName) : displayName;
  const siteName = t('title');
  const finalTitle = seoTitle || cleanName;

  return {
    title: `${finalTitle} | ${siteName}`,
    description: `${t('explore_tech')} - ${cleanName}`,
    openGraph: {
      title: `${finalTitle} | ${siteName}`,
      description: `${t('explore_tech')} - ${cleanName}`,
    },
    twitter: {
      title: `${finalTitle} | ${siteName}`,
      description: `${t('explore_tech')} - ${cleanName}`,
    }
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
    allSearchParams
  ] = await Promise.all([
    params,
    searchParams
  ]);
  
  const { min_price, max_price, orderby, order, per_page, view, page, search } = allSearchParams;

  setRequestLocale(locale);
  const t = await getTranslations('common');
  
  // 1. Resolve Category or Brand from slug (Quick lookup using cached data)
  let categoryId: string | undefined = undefined;
  let brandSlugArg: string | undefined = undefined;

  const [allCategories, allBrands] = await Promise.all([
    getCategories(locale),
    getBrands(locale)
  ]);

  const brandsBySlug = new Map(allBrands.map((b: any) => [decodeURIComponent(b.slug), b]));
  const brandsById = new Map(allBrands.map((b: any) => [b.id, b]));
  const categoriesBySlug = new Map(allCategories.map((c: any) => [decodeURIComponent(c.slug), c]));
  const categoriesById = new Map(allCategories.map((c: any) => [c.id, c]));

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
      const b = brandsBySlug.get(brandSlugArg) as any;
      if (b) {
        queryParams.set('product_brand', String(b.id));
        queryParams.set('brand', String(b.id));
      }
    } else {
      const slugToFind = slug[slug.length - 1];
      const decodedSlugToFind = decodeURIComponent(slugToFind);
      let cat = categoriesBySlug.get(decodedSlugToFind) as any;
      if (cat) categoryId = String(cat.id);
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
  
  const displayNameRaw = search
    ? `${t('search_results')}: "${search}"`
    : categoryId 
      ? (categoriesById.get(Number(categoryId)) as any)?.name 
      : brandSlugArg
        ? (brandsBySlug.get(brandSlugArg) as any)?.name || brandSlugArg
        : t('shop_all_products');

  const displayName = displayNameRaw?.includes('%') ? decodeURIComponent(displayNameRaw) : displayNameRaw;

  return (
    <div className="bg-[#f6f6f6] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-4 md:py-12 pt-4 md:pt-8">
        
        {/* Mobile Title */}
        <div className="mb-6 md:hidden">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            {displayName}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-72 shrink-0">
            <Suspense fallback={<SidebarSkeleton />}>
              <SidebarServer 
                locale={locale} 
                activeCategory={categoryId} 
                activeBrand={brandSlugArg} 
              />
            </Suspense>
          </aside>

          <div className="flex-grow">
             <ShopToolbar 
                categoryName={displayName}
                totalProducts={0} // Will be updated by client if needed or omitted
                perPage={per_page}
                orderby={orderby}
                order={order}
             />

             <Suspense fallback={<ProductGridSkeleton />}>
                <ProductGridServer 
                  locale={locale} 
                  queryParams={queryParams.toString()} 
                  view={view} 
                  page={page} 
                />
             </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
