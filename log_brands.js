
const fs = require('fs');
const brands = JSON.parse(fs.readFileSync('temp_product_brands.json', 'utf8'));
console.log(JSON.stringify(brands.map(b => ({ name: b.name, slug: b.slug })), null, 2));
