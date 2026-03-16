const dataCache = require('./src/lib/dataCache.server');

async function main() {
  // Initialize cache if not already done
  await dataCache.init();

  const brands = dataCache.getProductBrands();
  console.log(JSON.stringify(brands.map(b => ({ name: b.name, slug: b.slug })), null, 2));
}

main().catch(err => {
  console.error('Error in log_brands.js:', err);
  process.exit(1);
});
