const fs = require('fs');

['about-us.html', 'company.html', 'perspectives.html'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/href="css\/style\.css(?:\?v=[^"]*)?"/g, 'href="css/style.css?v=20260921"');
  fs.writeFileSync(f, c, 'utf8');
  console.log('Updated cachebuster in', f);
});
