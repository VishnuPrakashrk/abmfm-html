const fs = require('fs');

['dump-who-we.html', 'dump-perspectives-colorful.html', 'dump-company-colorful.html'].forEach(file => {
  console.log(`\n================== ${file} ==================`);
  const html = fs.readFileSync('scratch/' + file, 'utf8');
  const rootStart = html.indexOf('<div id="root">');
  const snippet = html.substring(rootStart, rootStart + 3000);
  console.log(snippet.slice(0, 1000));
  
  // Look for header/nav
  const headerMatch = snippet.match(/<header[\s\S]*?<\/header>/i);
  if (headerMatch) {
    console.log('--- FOUND HEADER in snippet ---');
    console.log(headerMatch[0].slice(0, 500));
  }
  
  // Look for footer
  const rootEnd = html.lastIndexOf('</div>');
  const endSnippet = html.substring(rootEnd - 2000, rootEnd);
  const footerMatch = endSnippet.match(/<footer[\s\S]*?<\/footer>/i);
  if (footerMatch) {
    console.log('--- FOUND FOOTER in end snippet ---');
    console.log(footerMatch[0].slice(0, 500));
  }
});
