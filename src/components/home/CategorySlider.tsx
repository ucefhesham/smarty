import { getCategories } from '@/lib/wordpress';
import CategorySliderClient from './CategorySliderClient';
import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';

interface CategoryItem {
  id: string;
  img: any;
  slug: string;
}

interface CategorySliderProps {
  categories: CategoryItem[];
}

export default async function CategorySlider({ categories }: CategorySliderProps) {
  const t = await getTranslations('home.categories');
  const commonT = await getTranslations('common');
  const locale = commonT('english') === 'English' ? 'en' : 'ar';
  
  // Fetch categories to get counts
  const allCategories = await getCategories(locale);
  
  // Load translation mapping from temp_cats.json (which we know has the en -> ar ID mapping)
  let catMapping: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'temp_cats.json');
    if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        catMapping = JSON.parse(fileContent);
    }
  } catch (e) {
    console.error('Failed to load temp_cats.json', e);
  }

  // PREPARE LOOKUPS
  const catMappingBySlug = new Map<string, any>(catMapping.map(c => [c.slug, c]));
  const allCategoriesById = new Map<number, any>(allCategories.map((c: any) => [c.id, c]));
  const allCategoriesBySlug = new Map<string, any>(allCategories.map((c: any) => [c.slug, c]));

  const localizedCategories = categories.map(cat => {
    let localizedSlug = cat.slug;
    let count = 0;

    // 1. Find the English category entry to get its ID and translations
    const enCatEntry = catMappingBySlug.get(cat.slug);
    
    if (enCatEntry) {
        const targetId = locale === 'ar' ? enCatEntry.translations?.ar : enCatEntry.id;
        
        // 2. Find the WP category in the current locale's list by ID
        const wpCat = allCategoriesById.get(targetId);
        if (wpCat) {
            localizedSlug = wpCat.slug;
            count = wpCat.count;
        }
    } else {
        // Fallback for categories not in mapping
        const wpCat = allCategoriesBySlug.get(cat.slug);
        if (wpCat) {
            count = wpCat.count;
            localizedSlug = wpCat.slug;
        }
    }
    
    return {
      ...cat,
      name: t(cat.id),
      count: count,
      localizedSlug: localizedSlug
    };
  });

  return <CategorySliderClient categories={localizedCategories} />;
}

export function CategorySliderSkeleton() {
  return (
    <div className="relative px-4 md:px-12 lg:px-24 max-w-[1600px] mx-auto mb-4 md:mb-10 mt-1 md:mt-4 overflow-hidden">
      <div className="flex gap-2 md:gap-12 py-2 md:py-8">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className="flex-shrink-0 w-[calc((100%-1.5rem)/2.5)] sm:w-[calc((100%-3rem)/4)] lg:w-[calc((100%-6*2rem)/7)] animate-pulse">
            <div className="bg-white border border-slate-100 rounded-[10px] p-2 md:p-4 shadow-sm h-full">
              <div className="aspect-square bg-slate-50 rounded-lg mb-4" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 rounded w-3/4 mx-auto" />
                <div className="h-2 bg-slate-50 rounded w-1/2 mx-auto" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
