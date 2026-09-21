const fs = require('fs');

const files = ['about-us.html', 'company.html', 'perspectives.html'];

const allStyles = {};

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  if (m) {
    allStyles[f] = m[1];
  }
});

console.log('Files with styles:', Object.keys(allStyles));
