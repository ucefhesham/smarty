"use client";

import React, { useState } from 'react';
import { Link, useRouter, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ChevronDown, ListFilter } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface SidebarProps {
  categories: any[];
  brands: any[];
  attributes: any[];
  activeCategory?: string;
  activeBrand?: string;
}

const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  blue: '#0ea5e9',
  red: '#ef4444',
  green: '#22c55e',
  silver: '#c0c0c0',
  gold: '#ffd700',
  gray: '#6b7280',
  charcoal: '#374151',
  champagne: '#f7e7ce',
  'black-de': '#000000',
  'blue-de': '#0ea5e9',
};

export default function Sidebar({ categories, brands, attributes, activeCategory, activeBrand }: SidebarProps) {
  const t = useTranslations('common');
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentCategory = activeCategory || searchParams.get('category');
  const currentBrand = activeBrand || searchParams.get('brand');
  const currentMinPrice = searchParams.get('min_price') || '0';
  const currentMaxPrice = searchParams.get('max_price') || '2000';

  const [priceRange, setPriceRange] = useState({ min: currentMinPrice, max: currentMaxPrice });
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    price: true,
    categories: true,
    brands: true,
    status: true,
    ...attributes.reduce((acc, attr) => ({ ...acc, [attr.slug]: true }), {})
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (key === 'category') {
      const cat = categories.find(c => String(c.id) === value);
      const targetSlug = cat?.slug || '';
      
      if (currentCategory === value) {
        router.push('/shop');
      } else {
        router.push(`/shop/${targetSlug}?${params.toString()}`);
      }
      return;
    }

    if (key === 'brand') {
      if (currentBrand === value) {
        params.delete('brand');
        params.delete('product_brand');
        router.push(`${pathname}?${params.toString()}`);
      } else {
        router.push(`/shop/brand/${value}?${params.toString()}`);
      }
      return;
    }

    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete('per_page'); 
    router.push(`${pathname}?${params.toString()}`);
  };

  const handlePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('min_price', priceRange.min);
    params.set('max_price', priceRange.max);
    router.push(`${pathname}?${params.toString()}`);
  };

  const FilterSection = ({ title, id, children }: { title: string, id: string, children: React.ReactNode }) => (
    <div className="border-b border-slate-50 py-4 last:border-0">
      <button 
        onClick={() => toggleSection(id)}
        className="flex items-center justify-between w-full text-left group"
      >
        <h3 className="text-[11px] font-bold text-slate-400 tracking-widest uppercase">{title}</h3>
        <ChevronDown 
          size={14} 
          className={cn(
            "text-slate-300 transition-transform duration-300",
            openSections[id] ? "rotate-180" : ""
          )} 
        />
      </button>
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        openSections[id] ? "max-h-[500px] mt-4 opacity-100" : "max-h-0 opacity-0"
      )}>
        {children}
      </div>
    </div>
  );

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  return (
    <div className="w-full lg:w-72 space-y-1 h-fit">
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
        className="lg:hidden w-full flex items-center justify-between bg-white px-6 py-4 rounded-[10px] border border-slate-100 shadow-luxury mb-4"
      >
        <div className="flex items-center gap-3">
          <ListFilter size={18} className="text-primary" />
          <span className="text-sm font-bold text-slate-800">{t('sidebar_filters') || 'Filters'}</span>
        </div>
        <ChevronDown 
          size={18} 
          className={cn("text-slate-400 transition-transform duration-300", isMobileFiltersOpen ? "rotate-180" : "")} 
        />
      </button>

      {/* Main Sidebar Content */}
      <div className={cn(
        "bg-white rounded-[10px] p-6 border border-slate-100 shadow-luxury overflow-hidden transition-all duration-500",
        "lg:block",
         isMobileFiltersOpen ? "block max-h-[2000px] opacity-100" : "hidden lg:block lg:opacity-100"
      )}>
      <FilterSection title={t('sidebar_categories')} id="categories">
        <ul className="space-y-2 pb-2 text-[13px]">
          {categories.filter(c => c.count > 0).map((cat) => (
            <li key={cat.id}>
              <button 
                onClick={() => updateFilters('category', String(cat.id))}
                className={cn(
                  "flex items-center justify-between w-full text-left transition-colors hover:text-primary",
                  currentCategory === String(cat.id) ? "text-primary font-bold" : "text-slate-400"
                )}
              >
                <span>{cat.name}</span>
                <span className="text-[10px] text-slate-300 font-bold">{cat.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </FilterSection>

      {/* Price Filter */}
      <div className="border-b border-slate-50 py-4">
        <button 
          onClick={() => toggleSection('price')}
          className="flex items-center justify-between w-full text-left mb-6"
        >
          <h3 className="text-[13px] font-normal text-slate-400 tracking-tight">{t('sidebar_filter_price')}</h3>
          <ChevronDown size={14} className={cn("text-slate-300 transition-transform", openSections.price ? "rotate-180" : "")} />
        </button>
        
        <div className={cn("space-y-6 transition-all duration-300 overflow-hidden", openSections.price ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0")}>
          <div className="relative h-4 flex items-center group">
            <div className="absolute w-full h-[3px] bg-slate-100 rounded-full" />
            {/* Theoretical active bar - simplification for UI match */}
            <div className="absolute inset-x-0 h-[3px] bg-primary rounded-full mx-1" />
            <div className="absolute left-0 w-0.5 h-3.5 bg-primary rounded-full" />
            <div className="absolute right-0 w-0.5 h-3.5 bg-primary rounded-full" />
            
            <input 
              type="range" 
              min="0" 
              max="2000" 
              step="50"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
              className="absolute w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <div className="flex justify-between items-center bg-white">
            <div className="text-[13px] text-slate-400">
              {t('sidebar_price_label')}: <span className="text-slate-500 font-normal">{priceRange.min} JOD — {priceRange.max} JOD</span>
            </div>
            <button 
              onClick={handlePriceFilter}
              className="bg-[#edf2ff] text-primary text-[11px] font-normal uppercase tracking-wider px-5 py-2 rounded-md transition-colors hover:bg-primary hover:text-white"
            >
              {t('sidebar_filter_btn')}
            </button>
          </div>
        </div>
      </div>

      <FilterSection title={t('sidebar_status') || 'Status'} id="status">
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => updateFilters('stock_status', 'instock')}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                "w-3.5 h-3.5 rounded border transition-all",
                searchParams.get('stock_status') === 'instock' ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
              )} />
              <span className={cn(
                "text-[13px] transition-colors",
                searchParams.get('stock_status') === 'instock' ? "text-primary font-bold" : "text-slate-400 group-hover:text-primary"
              )}>{t('sidebar_in_stock') || 'In Stock'}</span>
            </button>
          </li>
          <li>
            <button 
              onClick={() => updateFilters('on_sale', 'true')}
              className="flex items-center gap-3 w-full text-left group"
            >
              <div className={cn(
                "w-3.5 h-3.5 rounded border transition-all",
                searchParams.get('on_sale') === 'true' ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
              )} />
              <span className={cn(
                "text-[13px] transition-colors",
                searchParams.get('on_sale') === 'true' ? "text-primary font-bold" : "text-slate-400 group-hover:text-primary"
              )}>{t('sidebar_on_sale') || 'On Sale'}</span>
            </button>
          </li>
        </ul>
      </FilterSection>

      <FilterSection title={t('sidebar_filter_brands')} id="brands">
        <ul className="space-y-3">
          {brands.length > 0 ? brands.map(brand => {
            const isActive = currentBrand === brand.slug;
            return (
              <li key={brand.id}>
                <button 
                  onClick={() => updateFilters('brand', brand.slug)}
                  className="flex items-center gap-3 w-full text-left group"
                >
                  <div className={cn(
                    "w-3.5 h-3.5 rounded border transition-all",
                    isActive ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
                  )} />
                  <span className={cn(
                    "text-[13px] transition-colors",
                    isActive ? "text-primary font-bold" : "text-slate-400 group-hover:text-primary"
                  )}>{brand.name}</span>
                </button>
              </li>
            );
          }) : (
            <span className="text-xs text-slate-400 italic">{t('sidebar_no_brands')}</span>
          )}
        </ul>
      </FilterSection>

      {attributes.map(attr => (
        <FilterSection key={attr.id} title={attr.name} id={attr.slug}>
          {attr.slug === 'pa_color' ? (
            <div className="flex flex-wrap gap-2">
              {attr.terms.map((term: any) => {
                const isActive = searchParams.get(attr.slug) === term.slug;
                const bgColor = colorMap[term.slug.toLowerCase()] || '#cccccc';
                return (
                  <button 
                    key={term.id}
                    onClick={() => updateFilters(attr.slug, term.slug)}
                    title={term.name}
                    className={cn(
                      "w-6 h-6 rounded-full border border-slate-200 p-0.5 transition-all hover:scale-110",
                      isActive ? "border-primary ring-2 ring-primary ring-offset-2" : "border-slate-100"
                    )}
                  >
                    <div 
                      className="w-full h-full rounded-full" 
                      style={{ backgroundColor: bgColor }}
                    />
                  </button>
                );
              })}
            </div>
          ) : (
            <ul className="space-y-3">
              {attr.terms.map((term: any) => {
                const isActive = searchParams.get(attr.slug) === term.slug;
                return (
                  <li key={term.id}>
                    <button 
                      onClick={() => updateFilters(attr.slug, term.slug)}
                      className="flex items-center gap-3 w-full text-left group"
                    >
                      <div className={cn(
                        "w-3.5 h-3.5 rounded border transition-all",
                        isActive ? "bg-primary border-primary" : "border-slate-200 group-hover:border-primary"
                      )} />
                      <span className={cn(
                        "text-[13px] transition-colors",
                        isActive ? "text-primary font-bold" : "text-slate-400 group-hover:text-primary"
                      )}>{term.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </FilterSection>
      ))}
      </div>
    </div>
  );
}
