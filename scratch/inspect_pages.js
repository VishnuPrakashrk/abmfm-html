const fs = require('fs');

function inspectDump(filename) {
  console.log(`=== Inspecting ${filename} ===`);
  const content = fs.readFileSync('scratch/' + filename, 'utf8');
  const rootStart = content.indexOf('<div id="root">');
  console.log('rootStart:', rootStart);
  if (rootStart !== -1) {
    const rootEnd = content.lastIndexOf('</div>');
    console.log('rootEnd:', rootEnd);
    const inner = content.substring(rootStart + '<div id="root">'.length, rootEnd);
    console.log('Inner HTML length:', inner.length);
    // Find headings (h1, h2, h3)
    const headings = [...inner.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
    console.log('Headings found:', headings.slice(0, 10));
    // Check if there is an inlined header or nav in inner
    console.log('Contains header tag:', /<header/i.test(inner));
    console.log('Contains nav tag:', /<nav/i.test(inner));
  }
}

inspectDump('dump-company-colorful.html');
inspectDump('dump-perspectives-colorful.html');
inspectDump('dump-who-we.html');
