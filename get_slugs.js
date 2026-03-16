const fs = require('fs');
const path = require('path');
const dataCache = require('./src/lib/dataCache.server');

async function main() {
  // Initialize cache if not already done
  await dataCache.init();

  const ids = [84, 62, 64, 63, 87, 330, 61, 324, 82, 81, 99, 322, 49, 45, 52, 321, 51, 46, 94, 337, 47];

  const mapping = {};
  ids.forEach(id => {
    const cat = dataCache.getCategoriesById().get(id);
    if (cat) {
      mapping[id] = cat.slug;
    }
  });

  const outputPath = path.join(process.cwd(), 'slug_mapping.json');
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2));
  console.log(`Successfully wrote slug mapping to ${outputPath}`);
}

main().catch(err => {
  console.error('Error in get_slugs.js:', err);
  process.exit(1);
});
