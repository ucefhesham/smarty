const https = require('https');

https.get('https://smartyjo.com/wp-json/wc/v3/products/attributes/1/terms?lang=en&per_page=100', (res) => {
  console.log('Status Code:', res.statusCode);
  res.on('data', (d) => {
    // console.log(d.toString());
  });
}).on('error', (e) => {
  console.error('Fetch failed:', e.message);
});
