import Sidebar from './Sidebar';
import { getCategories, getBrands, getAttributes, getAttributeTerms } from '@/lib/wordpress';
import { getTranslations } from 'next-intl/server';

interface SidebarServerProps {
  locale: string;
  activeCategory?: string;
  activeBrand?: string;
}

export default async function SidebarServer({ locale, activeCategory, activeBrand }: SidebarServerProps) {
  // Fetch all data in parallel for the sidebar
  const [categories, realBrands, rawAttributes] = await Promise.all([
    getCategories(locale),
    getBrands(locale),
    getAttributes(locale)
  ]);

  const allCategories = Array.isArray(categories) ? categories : [];
  const allBrands = Array.isArray(realBrands) ? realBrands : [];
  const allAttributes = Array.isArray(rawAttributes) ? rawAttributes : [];

  // Fetch terms for all attributes - switch to sequential to avoid overwhelming the server
  const attributesWithTerms = [];
  for (const attr of allAttributes) {
    try {
      const terms = await getAttributeTerms(String(attr.id), locale);
      attributesWithTerms.push({ 
        ...attr, 
        terms: Array.isArray(terms) ? terms.filter((t: any) => t.count > 0) : [] 
      });
    } catch (e) {
      console.error(`Failed to fetch terms for attribute ${attr.id}:`, e);
      attributesWithTerms.push({ ...attr, terms: [] });
    }
  }

  return (
    <Sidebar 
      categories={allCategories} 
      brands={allBrands} 
      attributes={attributesWithTerms}
      activeCategory={activeCategory} 
      activeBrand={activeBrand}
    />
  );
}
