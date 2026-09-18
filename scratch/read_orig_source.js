const fs = require('fs');

['Abm-Fm-Who-We.html', 'Abm-Fm-Perspectives-Colorful.html', 'Abm-Fm-Company-Colorful.html'].forEach(file => {
  const c = fs.readFileSync('page/' + file, 'utf8');
  console.log(`=== page/${file} ===`);
  // Let's check how unicode is represented in the bundle
  const emojis = c.match(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
  console.log('Has native emoji:', !!emojis);
  const unicodeEscapes = c.match(/\\u[0-9a-fA-F]{4}/g);
  console.log('Has \\u escapes:', unicodeEscapes ? unicodeEscapes.length : 0);
  if (unicodeEscapes) {
    console.log('Sample \\u escapes:', [...new Set(unicodeEscapes)].slice(0, 10));
  }
});
