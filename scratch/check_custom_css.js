const fs = require('fs');

const files = ['about-us.html', 'company.html', 'perspectives.html'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/i);
  if (!styleMatch) return;
  const pageCss = styleMatch[1];
  
  // Look at lines after media queries or custom classes (like .company-, .perspective-, etc.)
  const lines = pageCss.split('\n');
  console.log('=== ' + f + ' ===');
  // Check the last 80 lines
  console.log(lines.slice(-60).join('\n'));
});
