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
      const categoriesBySlug = new Map<string, any>(allCategories.map((c: any) => [c.slug, c]));
      let cat = categoriesBySlug.get(categorySlug as string);
      
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
    } else if (resolvedType === 'brand') {
      const allBrands = await getBrands(locale);
      const brandsBySlug = new Map<string, any>(allBrands.map((b: any) => [b.slug, b]));
      let brand = brandsBySlug.get(brandSlug as string);
      
      if (!brand && locale === 'ar') {
        const enBrands = await getBrands('en');
        const enBrandsBySlug = new Map<string, any>(enBrands.map((b: any) => [b.slug, b]));
        const enBrand = enBrandsBySlug.get(brandSlug as string);
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
