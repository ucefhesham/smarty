
const fs = require('fs');
const path = require('path');

const API_URL = "https://smartyjo.com/wp-json";
const AUTH_USER = "saif.alzayed";
const AUTH_PASS = "SEkB JsJR 9Vdd HGuy 7Nov DiLk";

async function testAttributes() {
  const auth = Buffer.from(`${AUTH_USER}:${AUTH_PASS}`).toString('base64');
  const headers = {
    'Authorization': `Basic ${auth}`,
    'Content-Type': 'application/json',
  };

  try {
    const res = await fetch(`${API_URL}/wc/v3/products/attributes`, { headers });
    const attributes = await res.json();
    console.log("Attributes list loaded.");

    const results = [];
    for (const attr of attributes) {
      const termsRes = await fetch(`${API_URL}/wc/v3/products/attributes/${attr.id}/terms`, { headers });
      const terms = await termsRes.json();
      results.push({
        id: attr.id,
        name: attr.name,
        slug: attr.slug,
        terms: Array.isArray(terms) ? terms.map(t => ({ id: t.id, name: t.name, slug: t.slug, count: t.count })) : []
      });
    }
    
    fs.writeFileSync(path.join(__dirname, 'attributes_full.json'), JSON.stringify(results, null, 2));
    console.log("Results saved to attributes_full.json");
  } catch (e) {
    console.error("Error:", e);
  }
}

testAttributes();
