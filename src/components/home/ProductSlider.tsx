import { getProducts, getCategories, getBrands } from '@/lib/wordpress';
import ProductSliderClient from './ProductSliderClient';
import { getTranslations } from 'next-intl/server';

interface ProductSliderProps {
  categoryId?: string;
  categorySlug?: string;
  brandSlug?: string;
  title: string;
  locale: string;
}

export default async function ProductSlider({ 
  categoryId, 
  categorySlug,
  brandSlug, 
  title, 
  locale 
}: ProductSliderProps) {
  const t = await getTranslations('common');
  
  // Construct query
  let query = 'per_page=12&status=publish';
  let viewAllLink = '/shop';
  let resolvedId = categoryId;

  // Fallback if ID is missing but slug is present (helpful for localization)
  if (!resolvedId && (categorySlug || brandSlug)) {
    const requestedSlug = (categorySlug || brandSlug);
    const resolvedType = categorySlug ? 'category' : 'brand';
    
    if (resolvedType === 'category') {
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
    } else if (resolvedType === 'brand') {
      const allBrands = await getBrands(locale);
      let brand = allBrands.find((b: any) => b.slug === brandSlug);
      
      if (!brand && locale === 'ar') {
        const enBrands = await getBrands('en');
        const enBrand = enBrands.find((b: any) => b.slug === brandSlug);
        if (enBrand && enBrand.translations && enBrand.translations.ar) {
          resolvedId = String(enBrand.translations.ar);
        }
      } else if (brand) {
        resolvedId = String(brand.id);
      }
    }
  }

  if (resolvedId) {
    if (categorySlug) {
      query += `&category=${resolvedId}`;
      viewAllLink = `/shop/${categorySlug}`;
    } else if (brandSlug) {
      // For brands, we use the custom brand query logic in getProducts
      query += `&brand=${resolvedId}`;
      viewAllLink = `/shop/brand/${brandSlug}`;
    } else {
      query += `&category=${resolvedId}`;
      viewAllLink = `/shop?category=${resolvedId}`;
    }
  } else if (brandSlug) {
    query += `&brand=${brandSlug}`;
    viewAllLink = `/shop/brand/${brandSlug}`;
  }

  let { products } = await getProducts(query, locale);

  // Fallback: if no products in category, show recent products so section isn't empty
  if (!products || products.length === 0) {
    const fallbackRes = await getProducts('per_page=12&status=publish', locale);
    products = fallbackRes.products;
  }

  if (!products || products.length === 0) return null;

  return (
    <ProductSliderClient
      products={products}
      title={title}
      viewAllLink={viewAllLink}
      viewAllText={t('view_all')}
    />
  );
}
