const fs = require('fs');
const cats = JSON.parse(fs.readFileSync('d:/Work/smarty/temp_cats.json', 'utf8'));

const ids = [84, 62, 64, 63, 87, 330, 61, 324, 82, 81, 99, 322, 49, 45, 52, 321, 51, 46, 94, 337, 47];

const mapping = {};
ids.forEach(id => {
  const cat = cats.find(c => c.id === id);
  if (cat) {
    mapping[id] = cat.slug;
  }
});

fs.writeFileSync('d:/Work/smarty/slug_mapping.json', JSON.stringify(mapping, null, 2));
