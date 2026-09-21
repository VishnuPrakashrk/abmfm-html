const fs = require('fs');

const unified = fs.readFileSync('scratch/unified_page_styles.css', 'utf8');

const files = ['about-us.html', 'company.html', 'perspectives.html'];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const style = html.match(/<style>([\s\S]*?)<\/style>/i)[1];
  
  // extract all selectors before {
  const selectors = style.match(/([^{}]+)\{/g) || [];
  let missing = 0;
  selectors.forEach(s => {
    const cleanSel = s.replace(/\{/, '').trim();
    if (cleanSel.startsWith('@')) return; // media query
    // check if cleanSel is in unified
    if (!unified.includes(cleanSel)) {
      missing++;
      // console.log('Missing sel:', cleanSel);
    }
  });
  console.log(f, 'Total selectors:', selectors.length, 'Missing selectors:', missing);
});
