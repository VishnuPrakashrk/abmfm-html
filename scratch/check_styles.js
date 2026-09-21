const fs = require('fs');

const styleCss = fs.readFileSync('css/style.css', 'utf8');

const files = ['about-us.html', 'company.html', 'perspectives.html'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return;
  const pageCss = styleMatch[1];
  
  // Find classes used in the page CSS that might not be in styleCss
  const classMatches = pageCss.match(/\.([a-zA-Z0-9_\-\\:\[\]\#\/\%]+)\s*\{/g) || [];
  const missing = [];
  classMatches.forEach(cm => {
    const rawName = cm.replace(/\{/, '').trim();
    if (!styleCss.includes(rawName)) {
      missing.push(rawName);
    }
  });
  console.log(f, 'Total CSS rules:', classMatches.length, 'Missing from style.css:', missing.length);
  if (missing.length > 0 && missing.length < 30) {
    console.log('Missing sample:', missing.slice(0, 10));
  } else if (missing.length >= 30) {
    console.log('Missing sample (first 10):', missing.slice(0, 10));
  }
});
