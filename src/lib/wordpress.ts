const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  price: string;
  images: Array<{ src: string; alt: string }>;
  categories: Array<{ id: number; name: string; slug: string }>;
  brands?: Array<{ id: number; name: string; slug: string }>;
  related_ids?: number[];
  [key: string]: any;
}

export interface GetProductsResponse {
  products: Product[];
  total: number;
  totalPages: number;
}

export async function fetchFromWP(endpoint: string, options: RequestInit = {}): Promise<any> {
  if (!API_URL) {
    console.error("NEXT_PUBLIC_WORDPRESS_API_URL is not defined");
    return { data: [], total: 0, totalPages: 0 };
  }
  
  // Ensure we don't have double slashes if API_URL has trailing slash
  const cleanBase = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${cleanBase}${cleanEndpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  // Add auth if available
  if (process.env.WORDPRESS_AUTH_USER && process.env.WORDPRESS_AUTH_PASS) {
    const auth = Buffer.from(`${process.env.WORDPRESS_AUTH_USER}:${process.env.WORDPRESS_AUTH_PASS}`).toString('base64');
    headers['Authorization'] = `Basic ${auth}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      next: { revalidate: 3600, ...options.next }, // Default 1 hour revalidation
    });
  } catch (error: any) {
    console.error(`Fetch failed for URL: ${url}. Error: ${error?.message || error}`);
    throw error;
  }

  if (!response.ok) {
    // Handle WooCommerce "out of range" page requests gracefully
    if (response.status === 400) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.code === 'rest_post_invalid_page_number') {
        return { data: [], total: 0, totalPages: 0 };
      }
    }
    throw new Error(`Failed to fetch from WordPress: ${response.statusText}`);
  }

  const data = await response.json();
  
  // If it's a list with pagination headers, return them too
  const total = response.headers.get('X-WP-Total');
  const totalPages = response.headers.get('X-WP-TotalPages');

  if (total && totalPages) {
    return {
      data,
      total: parseInt(total, 10),
      totalPages: parseInt(totalPages, 10),
    };
  }

  return data;
}

export async function getProducts(query = '', lang = 'en'): Promise<GetProductsResponse> {
  const baseParams = new URLSearchParams(query.startsWith('?') ? query.slice(1) : query);
  if (!baseParams.has('lang')) baseParams.set('lang', lang);
  
  // Add page if not present
  if (!baseParams.has('page')) baseParams.set('page', '1');
  
  // 1. Handle Stock and Sale filters (Native WooCommerce supported)
  if (baseParams.get('on_sale') === 'true') {
    baseParams.set('on_sale', 'true');
  } else {
    baseParams.delete('on_sale');
  }

  const stockStatus = baseParams.get('stock_status');
  if (stockStatus) {
    baseParams.set('stock_status', stockStatus);
  }

  // 2. Handle Industry Standard Brand and Attribute filtering
  // Strategy: If advanced filters (brand or custom attributes) are present, 
  // we perform a pre-fetch from the WP Taxonomy API to get valid product IDs.
  
  const brandValue = baseParams.get('product_brand') || baseParams.get('brand');
  const attributeFilters: Record<string, string> = {};
  
  // Identify custom attribute filters (keys starting with pa_)
  for (const [key, value] of baseParams.entries()) {
    if (key.startsWith('pa_')) {
      attributeFilters[key] = value;
    }
  }

  let taxonomyFilteredIds: number[] | null = null;

  // If we have brand or attribute filters, intersect their results
  if (brandValue || Object.keys(attributeFilters).length > 0) {
    try {
      let filterQuery = '';
      
      // Handle Brand
      if (brandValue) {
        let brandId = brandValue;
        if (!/^\d+$/.test(brandValue)) {
          const allBrands = await getBrands(lang);
          const brand = allBrands.find((b: any) => decodeURIComponent(b.slug) === decodeURIComponent(brandValue));
          if (brand) brandId = String(brand.id);
        }
        if (/^\d+$/.test(brandId)) {
          filterQuery += `&product_brand=${brandId}`;
        }
      }

      // Handle Attributes (e.g., pa_color, pa_size)
      // Note: WP REST API taxonomy filtering usually works with term IDs
      for (const [taxonomy, slug] of Object.entries(attributeFilters)) {
        // We need the ID for the term slug
        const terms = await getAttributeTerms(taxonomy, lang);
        const term = terms.find((t: any) => t.slug === slug);
        if (term) {
          filterQuery += `&${taxonomy}=${term.id}`;
        }
      }

      if (filterQuery) {
        // Fetch product IDs from WordPress API
        const wpRes = await fetchFromWP(`/wp/v2/product?per_page=100&lang=${lang}${filterQuery}`);
        const wpProducts = wpRes.data || wpRes;
        
        if (Array.isArray(wpProducts)) {
          taxonomyFilteredIds = wpProducts.map((p: any) => p.id);
        } else {
          taxonomyFilteredIds = [];
        }
      }
    } catch (e) {
      console.error("Advanced filtering failed:", e);
    }
    
    // Cleanup params that we've handled via intersection
    baseParams.delete('brand');
    baseParams.delete('product_brand');
    for (const key of Object.keys(attributeFilters)) {
      baseParams.delete(key);
    }
  }

  // If we filtered but found no matching IDs, return empty early
  if (taxonomyFilteredIds !== null && taxonomyFilteredIds.length === 0) {
    return { products: [], total: 0, totalPages: 0 };
  }

  // Add intersected IDs to the final WooCommerce query
  if (taxonomyFilteredIds && taxonomyFilteredIds.length > 0) {
    baseParams.set('include', taxonomyFilteredIds.join(','));
  }

  const finalQuery = baseParams.toString();
  const res = await fetchFromWP(`/wc/v3/products?${finalQuery}`).catch(e => {
    console.error("fetchFromWP Error in getProducts:", e);
    return { data: [], total: 0, totalPages: 0 };
  });
  
  if (res && res.data) {
    return {
      products: res.data,
      total: res.total || 0,
      totalPages: res.totalPages || 0
    };
  }
  
  const products = Array.isArray(res) ? res : [];
  return {
    products,
    total: products.length,
    totalPages: 1
  };
}

export async function searchProducts(query: string, lang = 'en', perPage = 5): Promise<Product[]> {
  const res = await fetchFromWP(`/wc/v3/products?search=${encodeURIComponent(query)}&lang=${lang}&per_page=${perPage}&status=publish`);
  return Array.isArray(res) ? res : (res.data || []);
}

export async function getProductBySlug(slug: string, lang = 'en') {
  const res = await fetchFromWP(`/wc/v3/products?slug=${slug}&lang=${lang}`);
  const products = res.data || res;
  return Array.isArray(products) && products.length > 0 ? products[0] : null;
}

export async function getProductById(id: number, lang = 'en') {
  return await fetchFromWP(`/wc/v3/products/${id}?lang=${lang}`);
}

export async function getProductVariations(productId: number, lang = 'en') {
  const res = await fetchFromWP(`/wc/v3/products/${productId}/variations?lang=${lang}&per_page=100`);
  return Array.isArray(res) ? res : (res.data || []);
}

export async function getCategories(lang = 'en') {
  const res = await fetchFromWP(`/wc/v3/products/categories?lang=${lang}&per_page=100`, { 
    next: { revalidate: 86400 } // 24 hours for categories
  });
  const data = res.data || res;
  return Array.isArray(data) ? data : [];
}

export async function getBrands(lang = 'en') {
  try {
    const res = await fetchFromWP(`/wp/v2/product_brand?lang=${lang}&per_page=100`, {
      next: { revalidate: 86400 } // 24 hours for brands
    });
    const data = res.data || res;
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('product_brand taxonomy not found, returning empty');
    return [];
  }
}

export async function getPage(slug: string, lang = 'en') {
  const pages = await fetchFromWP(`/wp/v2/pages?slug=${slug}&lang=${lang}`);
  return pages[0];
}

export async function getMenus() {
  // WordPress menus often need a specific plugin or custom endpoint
  // For now, we'll try a common one or mock it
  try {
    return await fetchFromWP('/wp-api-menus/v2/menus');
  } catch (e) {
    console.warn('Menus endpoint not found, returning empty');
    return [];
  }
}

export async function getAttributes(lang = 'en') {
  try {
    const res = await fetchFromWP(`/wc/v3/products/attributes?lang=${lang}`, {
      next: { revalidate: 86400 }
    });
    return Array.isArray(res) ? res : (res.data || []);
  } catch (e) {
    console.error("getAttributes error:", e);
    return [];
  }
}

export async function getAttributeTerms(taxonomy: string, lang = 'en') {
  try {
    // taxonomy could be an ID (from attribute.id) or a slug (like pa_color)
    // WooCommerce REST API /wc/v3/products/attributes/<id>/terms
    // But we might only have the slug. We need the ID.
    let attrId = taxonomy;
    if (isNaN(Number(taxonomy))) {
      const allAttrs = await getAttributes(lang);
      const attr = allAttrs.find((a: any) => a.slug === taxonomy);
      if (attr) attrId = String(attr.id);
    }

    const res = await fetchFromWP(`/wc/v3/products/attributes/${attrId}/terms?lang=${lang}&per_page=100`, {
      next: { revalidate: 86400 }
    });
    return Array.isArray(res) ? res : (res.data || []);
  } catch (e) {
    console.error(`getAttributeTerms error for ${taxonomy}:`, e);
    return [];
  }
}
// Simple PHP serialized string parser for WPC option data
function parsePhpSerialized(str: string): any {
  try {
    let pos = 0;
    
    function parse(): any {
      if (pos >= str.length) return null;
      const type = str[pos];
      
      if (type === 'a') {
        // Array: a:SIZE:{...}
        pos += 2; // skip 'a:'
        const sizeEnd = str.indexOf(':', pos);
        const size = parseInt(str.substring(pos, sizeEnd));
        pos = sizeEnd + 2; // skip ':{' 
        const result: Record<string, any> = {};
        for (let i = 0; i < size; i++) {
          const key = parse();
          const value = parse();
          result[String(key)] = value;
        }
        pos++; // skip '}'
        return result;
      } else if (type === 's') {
        // String: s:LENGTH:"VALUE";
        pos += 2; // skip 's:'
        const lenEnd = str.indexOf(':', pos);
        const len = parseInt(str.substring(pos, lenEnd));
        pos = lenEnd + 2; // skip ':"'
        
        // PHP strings are byte-indexed, but JS strings are UTF-16.
        // For our purposes (extra options), we can just read until the closing ";
        // WPC specific: strings end with ";
        const endQuote = str.indexOf('";', pos);
        const value = str.substring(pos, endQuote);
        pos = endQuote + 2;
        return value;
      } else if (type === 'i' || type === 'd') {
        // Integer or Double: i:VALUE; or d:VALUE;
        pos += 2;
        const end = str.indexOf(';', pos);
        const valStr = str.substring(pos, end);
        const value = type === 'i' ? parseInt(valStr) : parseFloat(valStr);
        pos = end + 1;
        return value;
      } else if (type === 'b') {
        // Boolean: b:0; or b:1;
        pos += 2;
        const val = str[pos] === '1';
        pos += 3; // skip '0;' or '1;'
        return val;
      } else if (type === 'N') {
        // Null: N;
        pos += 2;
        return null;
      }
      return null;
    }
    
    return parse();
  } catch (e) {
    console.error('Failed to parse PHP serialized data:', e);
    return null;
  }
}

export interface WPCOption {
  id: string;
  name: string;
  price: string;
  priceType: string;
}

export interface WPCFieldGroup {
  type: string;
  title: string;
  options: WPCOption[];
}

export async function getCategoryWPC(categoryName: string, lang: string = 'en'): Promise<WPCFieldGroup[] | null> {
  try {
    // The WPC Product Options plugin stores options as custom post type 'wpc_product_option'
    // Each option post has:
    //   - wpcpo-fields: serialized PHP array of field groups with options
    //   - wpcpo-apply-for: "product_cat" (applies to categories)  
    //   - wpcpo-apply: serialized PHP array of category slugs
    //
    // Known option posts:
    //   - ID 5818: "Smart Lock Extra Options" -> applies to smart-lock-2 category
    //   - ID 5679: "Camera Extra Options" -> applies to camera categories
    
    // Fetch both WPC option posts via the custom endpoint in parallel
    const wpcPostIds = [5818, 5679]; // Known WPC option post IDs
    
    const postsData = await Promise.all(
      wpcPostIds.map(postId => fetchFromWP(`/smarty/v1/wpc-post-meta/${postId}`).catch(() => null))
    );
    
    for (const postData of postsData) {
      if (!postData || !postData.meta) continue;
      
      // Check if this option post applies to any of the product's categories
      const applyForField = postData.meta['wpcpo-apply']?.[0];
      if (!applyForField) continue;
      
      const applySlugs = parsePhpSerialized(applyForField);
      if (!applySlugs) continue;
      
      // Get category slugs from the product
      // categoryName might be a display name like "Smart lock", so we need flexible matching
      const slugValues = Object.values(applySlugs).map((s: any) => decodeURIComponent(String(s)).toLowerCase());
      
      // Check if any slug matches the category name (fuzzy match)
      const catNameLower = categoryName.toLowerCase().replace(/\s+/g, '-');
      const matches = slugValues.some((slug: string) => {
        return slug.includes(catNameLower) || catNameLower.includes(slug.replace(/-\d+$/, ''));
      });
      
      if (!matches) continue;
      
      // Parse the fields
      const fieldsStr = postData.meta['wpcpo-fields']?.[0];
      if (!fieldsStr) continue;
      
      const fields = parsePhpSerialized(fieldsStr);
      if (!fields) continue;
      
      // Convert to our WPCFieldGroup format
      const fieldGroups: WPCFieldGroup[] = [];
      
      for (const fieldKey of Object.keys(fields)) {
        const field = fields[fieldKey];
        if (!field || !field.options) continue;
        
        const options: WPCOption[] = [];
        for (const optKey of Object.keys(field.options)) {
          const opt = field.options[optKey];
          if (!opt) continue;
          options.push({
            id: optKey,
            name: opt.name || '',
            price: opt.price || '0',
            priceType: opt.price_type || 'flat',
          });
        }
        
        fieldGroups.push({
          type: field.type || 'checkbox',
          title: field.title || '',
          options,
        });
      }
      
      if (fieldGroups.length > 0) return fieldGroups;
    }
    
    return null;
  } catch (error) {
    console.error("Failed to fetch WPC options:", error);
    return null;
  }
}

export async function getShippingMethods() {
  try {
    const res = await fetchFromWP('/wc/v3/shipping_methods');
    return Array.isArray(res) ? res : (res.data || []);
  } catch (e) {
    console.error('getShippingMethods error:', e);
    return [];
  }
}

export async function getPaymentGateways() {
  try {
    const res = await fetchFromWP('/wc/v3/payment_gateways');
    const data = Array.isArray(res) ? res : (res.data || []);
    return data.filter((gateway: any) => gateway.enabled);
  } catch (e) {
    console.error('getPaymentGateways error:', e);
    return [];
  }
}
