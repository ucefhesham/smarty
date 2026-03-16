"use client";

import { Home, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { Link, usePathname } from '@/navigation';
import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';

export default function MobileBottomNav() {
  const t = useTranslations('common');
  const pathname = usePathname();
  const { openCart } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const cartCount = useCartStore((state) => state.totalItems());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = [
    {
      label: t('home'),
      href: '/',
      icon: Home,
    },
    {
      label: t('shop'),
      href: '/shop',
      icon: ShoppingBag,
    },
    {
      label: t('wishlist_nav'),
      href: '/wishlist',
      icon: Heart,
      count: wishlistCount,
    },
    {
      label: t('cart'),
      href: '/cart',
      icon: ShoppingCart,
      count: cartCount,
    },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[90] bg-white/80 backdrop-blur-lg border-t border-slate-100 pb-safe">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          if (item.href === '/cart') {
            return (
              <button
                key={item.label}
                onClick={openCart}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative text-slate-400"
                )}
              >
                <div className="relative">
                  <Icon size={22} strokeWidth={2} />
                  {mounted && item.count !== undefined && item.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 border-2 border-white">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-tight">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full transition-colors relative",
                isActive ? "text-primary" : "text-slate-400"
              )}
            >
              <div className="relative">
                <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                {mounted && item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[10px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full px-1 border-2 border-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
