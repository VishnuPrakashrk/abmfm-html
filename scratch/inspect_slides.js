const fs = require('fs');

function extractComponentInfo(filename) {
  console.log(`\n================== ${filename} ==================`);
  const content = fs.readFileSync(filename, 'utf8');
  const m = content.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!m) return;
  const code = m[1];
  
  // Find all sections or headings
  const headings = [];
  const regex = /children:\s*\[?\"([^\"]{3,100})\"/g;
  let match;
  while ((match = regex.exec(code)) !== null) {
    const text = match[1];
    if (!text.includes('tw-') && !text.includes('M') && !text.startsWith('http') && !text.includes('=')) {
      headings.push(text);
    }
  }
  console.log('Sample text elements:', headings.filter(h => h.length > 3));
}

extractComponentInfo('about-us.html');
extractComponentInfo('what-we-provide.html');
extractComponentInfo('expertise-value.html');
