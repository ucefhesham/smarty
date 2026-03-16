import { getCategories } from '@/lib/wordpress';
import CategorySliderClient from './CategorySliderClient';
import { getTranslations } from 'next-intl/server';
import fs from 'fs';
import path from 'path';

interface CategoryItem {
  id: string;
  img: string;
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

  const localizedCategories = categories.map(cat => {
    let localizedSlug = cat.slug;
    let count = 0;

    // 1. Find the English category entry to get its ID and translations
    const enCatEntry = catMapping.find((c: any) => c.slug === cat.slug);
    
    if (enCatEntry) {
        const targetId = locale === 'ar' ? enCatEntry.translations?.ar : enCatEntry.id;
        
        // 2. Find the WP category in the current locale's list by ID
        const wpCat = allCategories.find((c: any) => c.id === targetId);
        if (wpCat) {
            localizedSlug = wpCat.slug;
            count = wpCat.count;
        }
    } else {
        // Fallback for categories not in mapping
        const wpCat = allCategories.find((c: any) => c.slug === cat.slug);
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
