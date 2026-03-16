import { getProducts, getCategories } from '@/lib/wordpress';
import PromoSliderClient from './PromoSliderClient';
import { getTranslations } from 'next-intl/server';

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
    const allCategories = await getCategories(locale);
    // Try to find by slug directly first
    let cat = allCategories.find((c: any) => c.slug === categorySlug);
    
    // If not found and in Arabic, try to find the English counterpart and use its translation
    if (!cat && locale === 'ar') {
      const enCategories = await getCategories('en');
      const enCat = enCategories.find((c: any) => c.slug === categorySlug);
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
