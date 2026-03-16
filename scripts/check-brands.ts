import { getBrands } from './src/lib/wordpress';

async function test() {
  const enBrands = await getBrands('en');
  const arBrands = await getBrands('ar');
  
  console.log('EN BRANDS:', JSON.stringify(enBrands.map(b => ({ name: b.name, slug: b.slug })), null, 2));
  console.log('AR BRANDS:', JSON.stringify(arBrands.map(b => ({ name: b.name, slug: b.slug })), null, 2));
}

test();
