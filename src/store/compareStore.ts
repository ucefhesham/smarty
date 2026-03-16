import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CompareItem {
  id: number;
  sku?: string;
  name: string;
  price: string;
  image?: string;
  slug: string;
  short_description?: string;
  stock_status?: string;
  attributes?: any[];
}

interface CompareStore {
  items: CompareItem[];
  addItem: (item: CompareItem) => void;
  removeItem: (id: number) => void;
  isInCompare: (id: number) => boolean;
  clearCompare: () => void;
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        if (get().items.length >= 4) return; // Limit to 4 items
        if (!get().items.some(item => item.id === newItem.id)) {
          set({ items: [...get().items, newItem] });
        }
      },
      removeItem: (id) => set({ items: get().items.filter(item => item.id !== id) }),
      isInCompare: (id) => get().items.some(item => item.id === id),
      clearCompare: () => set({ items: [] }),
    }),
    {
      name: 'smarty-compare-storage',
    }
  )
);
