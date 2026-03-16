"use client";

import React from 'react';
import { Link, useRouter, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { Menu, ChevronDown, Grid2X2, Square, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface ShopToolbarProps {
  totalProducts?: number;
  categoryId?: string;
  categoryName?: string;
  perPage?: string;
  orderby?: string;
  order?: string;
}

export default function ShopToolbar({ 
  categoryName, 
  totalProducts = 0,
  perPage = "12",
  orderby = "date",
  order = "desc"
}: ShopToolbarProps) {
  const t = useTranslations('common');
  categoryName = categoryName || t('shop_all_products');
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sort, orderVal] = e.target.value.split('_');
    const params = new URLSearchParams(searchParams.toString());
    params.set('orderby', sort || 'date');
    params.set('order', orderVal || 'desc');
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageLink = (count: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('per_page', String(count));
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 bg-white py-3 px-4 md:px-6 rounded-[10px] border border-slate-100 shadow-luxury gap-4 md:gap-6">
      <div className="hidden md:flex flex-col">
        <h1 className="text-xl font-bold text-slate-800 leading-none">
          {categoryName}
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-12 text-sm justify-between w-full md:w-auto">
          {/* Show Counts - Desktop Only */}
          <div className="hidden lg:flex items-center gap-3">
            <span className="text-slate-400 font-normal">{t('shop_show')} :</span>
            <div className="flex items-center gap-2 font-normal text-slate-800">
              {[9, 12, 18, 24].map((count) => {
                const isCurrent = perPage === String(count);
                return (
                  <React.Fragment key={count}>
                    <Link 
                      href={getPageLink(count)}
                      className={cn(
                        "transition-all",
                        isCurrent ? "text-slate-900 underline underline-offset-4" : "text-slate-400 hover:text-primary"
                      )}
                    >
                      {count}
                    </Link>
                    {count !== 24 && <span className="text-slate-200">/</span>}
                  </React.Fragment>
                );
              })}
            </div>
          </div>

          {/* Product Count - Mobile Only */}
          <div className="md:hidden flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t('products')}</span>
            <span className="text-[13px] font-black text-slate-900">{totalProducts || 0}</span>
          </div>

          {/* View Switchers - Desktop */}
          <div className="hidden sm:flex items-center gap-5 text-slate-300 border-l border-slate-100 ps-10">
            <Link 
              href={`${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), view: 'list' }).toString()}`}
              className={cn("hover:text-slate-600 transition-colors", searchParams.get('view') === 'list' ? "text-slate-900" : "text-slate-300")}
            >
              <Menu size={20} className="stroke-[1.5]" />
            </Link>
            
            <Link 
              href={`${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), view: 'grid_3' }).toString()}`}
              className={cn("flex items-center gap-1 cursor-pointer transition-colors hover:text-slate-600", (searchParams.get('view') === 'grid_3' || !searchParams.get('view')) ? "text-slate-900" : "text-slate-300")}
            >
              <div className="grid grid-cols-2 gap-0.5">
                <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                <div className="w-1.5 h-1.5 bg-current rounded-sm" />
                <div className="w-1.5 h-1.5 bg-current rounded-sm" />
              </div>
            </Link>

            <Link 
              href={`${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), view: 'grid_4' }).toString()}`}
              className={cn("hover:text-slate-600 transition-colors", searchParams.get('view') === 'grid_4' ? "text-slate-900" : "text-slate-300")}
            >
              <div className="grid grid-cols-3 gap-0.5">
                <div className="w-1 h-1 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm" />
                <div className="w-1 h-1 bg-current rounded-sm" />
              </div>
            </Link>
          </div>

          {/* Mobile Grid Switcher (1 vs 2 rows) */}
          <div className="md:hidden flex items-center gap-4 text-slate-300 border-l border-slate-100 ps-4">
            <Link 
              href={`${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), view: 'list_small' }).toString()}`}
              className={cn("transition-colors", searchParams.get('view') === 'list_small' ? "text-primary" : "text-slate-300")}
            >
              <Square size={20} className="stroke-[2]" />
            </Link>
            
            <Link 
              href={`${pathname}?${new URLSearchParams({ ...Object.fromEntries(searchParams.entries()), view: 'grid_mobile' }).toString()}`}
              className={cn("transition-colors", (searchParams.get('view') === 'grid_mobile' || !searchParams.get('view')) ? "text-primary" : "text-slate-300")}
            >
              <Grid2X2 size={20} className="stroke-[2]" />
            </Link>
          </div>

        {/* Sorting Dropdown - WoodMart Style */}
        <div className="relative">
          <select 
            defaultValue={`${orderby}_${order}`}
            onChange={handleSortChange}
            className="bg-white border border-slate-200 text-slate-500 text-[13px] font-normal px-4 py-2.5 rounded-[5px] appearance-none focus:outline-none focus:border-slate-300 cursor-pointer min-w-[180px]"
          >
            <option value="date_desc">{t('sort_default')}</option>
            <option value="price_asc">{t('sort_price_asc')}</option>
            <option value="price_desc">{t('sort_price_desc')}</option>
            <option value="title_asc">{t('sort_name_asc')}</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
            <ChevronDown size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}
