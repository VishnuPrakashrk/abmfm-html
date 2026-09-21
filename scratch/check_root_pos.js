const fs = require('fs');

['about-us.html', 'company.html', 'perspectives.html'].forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  const rootIndex = html.indexOf('id="root"');
  console.log(f, 'root index:', rootIndex);
  
  // Find where main starts
  const mainIndex = html.indexOf('<main');
  console.log(f, 'main index:', mainIndex);
});
