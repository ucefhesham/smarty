
const fs = require('fs');
const path = require('path');
const cats = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'temp_cats.json'), 'utf8'));

const relevantCats = cats.map(c => ({ name: c.name, slug: c.slug }));
console.log(JSON.stringify(relevantCats, null, 2));
