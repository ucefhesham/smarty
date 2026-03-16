import { getProducts, getCategories } from '@/lib/wordpress';
import PromoSliderClient from './PromoSliderClient';
import { getTranslations } from 'next-intl/server';
import ProductSkeleton from '@/components/product/ProductSkeleton';

interface PromoSliderProps {
  categoryId?: string;
  categorySlug?: string;
  title: string;
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: any;
  locale: string;
}

export default async function PromoSlider({
  categoryId,
  categorySlug,
  title,
  bannerTitle,
  bannerSubtitle,
  bannerImage,
  locale
}: PromoSliderProps) {
  const t = await getTranslations('common');

  // Construct query
  let query = 'per_page=8&status=publish';
  let viewAllLink = '/shop';
  let resolvedId = categoryId;

  // Fallback if ID is missing but slug is present
  if (!resolvedId && categorySlug) {
    // Assuming 'category' is the resolvedType here, as this block specifically handles category slugs
    // If there were other types (e.g., tag, attribute), a 'resolvedType' prop or derivation would be needed.
    // For this change, we'll assume the context implies 'category' for this fallback block.
    const allCategories = await getCategories(locale);
    const categoriesBySlug = new Map<string, any>(allCategories.map((c: any) => [c.slug, c]));
    let cat = categoriesBySlug.get(categorySlug as string);
    
    // If not found and in Arabic, try to find the English counterpart and use its translation
    if (!cat && locale === 'ar') {
      const enCategories = await getCategories('en');
      const enCategoriesBySlug = new Map<string, any>(enCategories.map((c: any) => [c.slug, c]));
      const enCat = enCategoriesBySlug.get(categorySlug as string);
      if (enCat && enCat.translations && enCat.translations.ar) {
        resolvedId = String(enCat.translations.ar);
      }
    } else if (cat) {
      resolvedId = String(cat.id);
    }
  }

  if (resolvedId) {
    query += `&category=${resolvedId}`;
    if (categorySlug) {
      viewAllLink = `/shop/${categorySlug}`;
    } else {
      viewAllLink = `/shop?category=${resolvedId}`;
    }
  }

  let { products } = await getProducts(query, locale);

  // Ultimate fallback: if still no products, try to get recent products to at least show the banner
  if (!products || products.length === 0) {
    const fallbackRes = await getProducts('per_page=8&status=publish', locale);
    products = fallbackRes.products;
  }

  if (!products || products.length === 0) return null;

  return (
    <PromoSliderClient
      products={products}
      title={title}
      bannerTitle={bannerTitle}
      bannerSubtitle={bannerSubtitle}
      bannerImage={bannerImage}
      viewAllLink={viewAllLink}
      viewAllText={t('view_all')}
      shopNowText={t('shop_now')}
    />
  );
}



export function PromoSliderSkeleton() {
  return (
    <section className="py-12 px-4 md:px-12 lg:px-20 max-w-[1600px] mx-auto overflow-hidden animate-pulse">
      <div className="bg-slate-50 rounded-[40px] h-[500px] flex items-center p-12">
        <div className="w-1/3 space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-12 bg-slate-200 rounded w-3/4"></div>
          <div className="h-20 bg-slate-200 rounded w-full"></div>
          <div className="h-12 bg-slate-200 rounded-full w-40"></div>
        </div>
        <div className="flex-grow flex gap-4 ml-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-shrink-0 w-64 h-80 bg-white rounded-2xl shadow-sm">
                <ProductSkeleton />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
