const dataCache = require('./src/lib/dataCache.server');

async function main() {
  // Initialize cache if not already done
  await dataCache.init();

  const catsById = dataCache.getCategoriesById();
  const cats = Array.from(catsById.values());

  const relevantCats = cats.map(c => ({ name: c.name, slug: c.slug }));
  console.log(JSON.stringify(relevantCats, null, 2));
}

main().catch(err => {
  console.error('Error in process_cats.js:', err);
  process.exit(1);
});
