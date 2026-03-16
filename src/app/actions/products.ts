"use server";

import { getProductById, fetchFromWP, getProductVariations } from "@/lib/wordpress";

export async function getProductVariationsAction(productId: number, lang: string = 'en') {
  try {
    return await getProductVariations(productId, lang);
  } catch (error) {
    console.error("Get Variations Server Error:", error);
    return [];
  }
}

export async function syncCompareItems(items: { id: number; sku?: string }[], lang: string = 'en') {
  try {
    const products = await Promise.all(
      items.map(async item => {
        if (item.sku) {
          try {
            const res = await fetchFromWP(`/wc/v3/products?sku=${item.sku}&lang=${lang}`);
            const results = Array.isArray(res) ? res : (res.data || []);
            if (results.length > 0) return results[0];
          } catch (e) {
            console.error(`Sync by SKU failed for ${item.sku}:`, e);
          }
        }
        return getProductById(item.id, lang).catch(() => null);
      })
    );
    return products;
  } catch (error) {
    console.error("Sync Compare Items Error:", error);
    return [];
  }
}
