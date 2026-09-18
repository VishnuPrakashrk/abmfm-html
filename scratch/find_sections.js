const fs = require('fs');

['dump-who-we.html', 'dump-perspectives-colorful.html', 'dump-company-colorful.html'].forEach(file => {
  console.log(`\n================== Checking Sections in ${file} ==================`);
  const html = fs.readFileSync('scratch/' + file, 'utf8');
  const sections = [...html.matchAll(/<section[^>]*id="([^"]*)"[^>]*>/gi)].map(m => m[1]);
  console.log('Section IDs found:', sections);
  const divsWithId = [...html.matchAll(/<div[^>]*id="([^"]*)"[^>]*>/gi)].map(m => m[1]);
  console.log('Div IDs found:', divsWithId.filter(id => id !== 'root'));
});
