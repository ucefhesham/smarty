'use client';

import React from 'react';
import { Link, usePathname } from '@/navigation';
import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    
    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      {/* Previous Page */}
      <Link
        href={createPageURL(currentPage - 1)}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors",
          currentPage <= 1 && "pointer-events-none opacity-50"
        )}
      >
        <ChevronLeft size={20} />
      </Link>

      {/* Page Numbers */}
      {pages.map((page) => (
        <Link
          key={page}
          href={createPageURL(page)}
          className={cn(
            "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition-all",
            currentPage === page
              ? "bg-primary text-white shadow-luxury"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          )}
        >
          {page}
        </Link>
      ))}

      {/* Next Page */}
      <Link
        href={createPageURL(currentPage + 1)}
        className={cn(
          "w-10 h-10 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
      >
        <ChevronRight size={20} />
      </Link>
    </nav>
  );
};

export default Pagination;
