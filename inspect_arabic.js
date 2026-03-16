
const fs = require('fs');
const API_URL = 'https://smartyjo.com/wp-json';
const AUTH = 'Basic ' + Buffer.from('saif.alzayed:SEkB JsJR 9Vdd HGuy 7Nov DiLk').toString('base64');

async function fetchData(endpoint) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: { 'Authorization': AUTH }
  });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  return res.json();
}

async function main() {
  try {
    const cats = await fetchData('/wc/v3/products/categories?lang=ar&per_page=100');
    const brands = await fetchData('/wp/v2/product_brand?lang=ar&per_page=100');
    
    const data = {
      categories: cats.map(c => ({
        id: c.id, 
        name: c.name, 
        slug: decodeURIComponent(c.slug),
        translations: c.translations
      })),
      brands: brands.map(b => ({
        id: b.id, 
        name: b.name, 
        slug: decodeURIComponent(b.slug),
        translations: b.translations
      }))
    };
    
    fs.writeFileSync('d:/Work/smarty/ar_data.json', JSON.stringify(data, null, 2));
    console.log('Saved to ar_data.json');
  } catch (e) {
    console.error(e);
  }
}

main();
