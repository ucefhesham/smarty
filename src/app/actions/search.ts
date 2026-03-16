"use server";

import { searchProducts } from "@/lib/wordpress";

export async function searchAction(query: string, lang: string = 'en') {
  if (!query || query.length < 2) return [];
  try {
    // Fetch a bit more than we need to allow for filtering
    const results = await searchProducts(query, lang, 20);
    
    // Filter to only include products that match in the title
    const filtered = results.filter((p: any) => 
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    
    // Return top 6 title matches
    return filtered.slice(0, 6);
  } catch (error) {
    console.error("Search Action Error:", error);
    return [];
  }
}
