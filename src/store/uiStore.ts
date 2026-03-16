import { create } from 'zustand';

interface UIStore {
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isCompareOpen: boolean;
  isMobileMenuOpen: boolean;
  quickViewProduct: any | null;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  openMobileMenu: () => void;
  closeMobileMenu: () => void;
  toggleMobileMenu: () => void;
  setQuickViewProduct: (product: any | null) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isCartOpen: false,
  isWishlistOpen: false,
  isCompareOpen: false,
  isMobileMenuOpen: false,
  quickViewProduct: null,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  openWishlist: () => set({ isWishlistOpen: true }),
  closeWishlist: () => set({ isWishlistOpen: false }),
  openCompare: () => set({ isCompareOpen: true }),
  closeCompare: () => set({ isCompareOpen: false }),
  openMobileMenu: () => set({ isMobileMenuOpen: true }),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  setQuickViewProduct: (product) => set({ quickViewProduct: product }),
}));
