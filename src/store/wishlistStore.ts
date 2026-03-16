import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image?: string;
  slug: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  isInWishlist: (id: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        if (!get().items.some(item => item.id === newItem.id)) {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      isInWishlist: (id) => get().items.some(item => item.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'smarty-wishlist-storage',
    }
  )
);
