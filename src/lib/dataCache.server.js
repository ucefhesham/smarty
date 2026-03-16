const fs = require('fs/promises'); // Use promises version
const path = require('path');

class DataCache {
  constructor() {
    this.cache = new Map();
    this.isInitialized = false;
  }
  
  async init() {
    if (this.isInitialized) return;
    
    // Load all required data files in parallel
    const [catsData, brandsData, attrsData, productBrandsData] = await Promise.all([
      this.loadJsonFile('temp_cats.json'),
      this.loadJsonFile('temp_brands.json'),
      this.loadJsonFile('temp_attrs.json'),
      this.loadJsonFile('temp_product_brands.json')
    ]);
    
    // Create optimized lookup structures
    this.cache.set('categoriesById', new Map(catsData.map(c => [c.id, c])));
    this.cache.set('categoriesBySlug', new Map(catsData.map(c => [c.slug, c])));
    this.cache.set('brandsById', new Map(brandsData.map(b => [b.id, b])));
    this.cache.set('brandsBySlug', new Map(brandsData.map(b => [b.slug, b])));
    this.cache.set('productBrands', productBrandsData);
    // Add other lookups as needed
    
    this.isInitialized = true;
  }
  
  async loadJsonFile(filename) {
    const filePath = path.join(process.cwd(), filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Failed to load ${filename}:`, error);
      return []; // Return empty array as fallback
    }
  }
  
  // Getter methods for specific data
  getCategoriesById() { return this.cache.get('categoriesById'); }
  getCategoriesBySlug() { return this.cache.get('categoriesBySlug'); }
  getBrandsById() { return this.cache.get('brandsById'); }
  getBrandsBySlug() { return this.cache.get('brandsBySlug'); }
  getProductBrands() { return this.cache.get('productBrands'); }
  // Add other getters as needed
}

// Export singleton instance
module.exports = new DataCache();
