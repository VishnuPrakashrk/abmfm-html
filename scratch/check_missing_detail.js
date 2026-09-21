const fs = require('fs');

const unified = fs.readFileSync('scratch/unified_page_styles.css', 'utf8');

const html = fs.readFileSync('company.html', 'utf8');
const style = html.match(/<style>([\s\S]*?)<\/style>/i)[1];

const selectors = style.match(/([^{}]+)\{/g) || [];
selectors.forEach(s => {
  const clean = s.replace(/\{/, '').trim();
  if (!clean.startsWith('@') && !unified.includes(clean)) {
    console.log(clean);
  }
});
