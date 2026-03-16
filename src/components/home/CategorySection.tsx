import { Link } from '@/navigation';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

// Static Image Imports
import catLaptop from "../../../public/images/cat-laptop.png";
import catAudio from "../../../public/images/cat-audio.png";
import catPhone from "../../../public/images/cat-phone.png";
import catWatch from "../../../public/images/cat-watch.png";
import catSecurity from "../../../public/images/cat-security.png";
import catAcc from "../../../public/images/cat-acc.png";

interface Category {
  id: number;
  name: string;
  count: number;
  image: any; // Using any for StaticImageData to avoid extra imports if not needed, or import from next/image
}

const categories: Category[] = [
  { id: 1, name: "Smart Laptops", count: 12, image: catLaptop },
  { id: 2, name: "Premium Audio", count: 8, image: catAudio },
  { id: 3, name: "Smartphones", count: 15, image: catPhone },
  { id: 4, name: "Wearables", count: 10, image: catWatch },
  { id: 5, name: "Security", count: 6, image: catSecurity },
  { id: 6, name: "Accessories", count: 24, image: catAcc },
];

export default async function CategorySection() {
  const t = await getTranslations('common');
  
  return (
    <section className="py-24 px-10 md:px-20 lg:px-32 max-w-[1440px] mx-auto">
      <div className="flex justify-between items-end mb-16">
        <div className="space-y-4">
          <span className="text-primary font-medium uppercase text-[10px] tracking-[0.3em] bg-primary/5 px-4 py-1.5 rounded-full">Explore Our World</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-tighter text-slate-900 line-tight">Popular <span className="text-primary italic">Categories</span></h2>
        </div>
        <Link href="/shop" className="group flex items-center gap-2 font-medium text-[11px] uppercase tracking-widest text-slate-400 hover:text-primary transition-all">
          View All Collection
          <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
        {categories.map((cat) => (
          <Link 
            key={cat.id} 
            href={`/shop?category=${cat.id}`}
            className="group block"
          >
            <div className="relative aspect-square rounded-[2.5rem] bg-white shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] group-hover:-translate-y-2 transition-all duration-500 overflow-hidden flex items-center justify-center p-8">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="relative w-full h-full">
                  <Image 
                     src={cat.image || "/placeholder.webp"} 
                     alt={cat.name} 
                     fill 
                     priority={cat.id <= 3}
                     className="object-contain group-hover:scale-110 transition-transform duration-700"
                  />
               </div>
            </div>
            <div className="mt-8 text-center space-y-1">
              <h3 className="font-medium text-sm text-slate-900 uppercase tracking-wider group-hover:text-primary transition-colors">{cat.name}</h3>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.1em]">{cat.count} Products</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
