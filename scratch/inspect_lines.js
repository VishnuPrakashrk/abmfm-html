const fs = require('fs');

const files = [
  'perspectives.html',
  'about-us.html',
  'company.html',
  'page/Abm-Fm-Perspectives-Colorful.html',
  'page/Abm-Fm-Who-We.html',
  'page/Abm-Fm-Company-Colorful.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n').length;
  console.log(`${f}: ${lines} lines, ${content.length} chars`);
});
