const fs = require('fs');

['clean-who-we.html', 'clean-perspectives.html', 'clean-company.html'].forEach(file => {
  const html = fs.readFileSync('scratch/' + file, 'utf8');
  // Check between <div id="root"> and </div>
  const rootStart = html.indexOf('<div id="root">');
  const rootEnd = html.lastIndexOf('</div>');
  const inner = html.substring(rootStart, rootEnd);
  const nonAscii = [...new Set(inner.match(/[^\x00-\x7F]/g) || [])];
  console.log(`=== ${file} non-ASCII ===`);
  console.log(nonAscii.join(' '));
});
