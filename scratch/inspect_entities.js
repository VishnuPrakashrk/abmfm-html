const fs = require('fs');

['who-we-main.html', 'perspectives-main.html', 'company-main.html'].forEach(file => {
  console.log(`\n=================== Inspecting ${file} ===================`);
  const html = fs.readFileSync('scratch/' + file, 'utf8');

  // Check for buttons
  const buttons = [...html.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)].map(m => m[0].replace(/<[^>]+>/g, '').trim());
  console.log('Buttons:', buttons);

  // Check for non-ascii / potential mojibake
  const nonAscii = [...new Set(html.match(/[^\x00-\x7F]/g) || [])];
  console.log('Non-ASCII characters found:', nonAscii.map(c => `${c} (\\u${c.charCodeAt(0).toString(16)})`));

  // Check for images
  const images = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map(m => m[1]);
  console.log('Images count:', images.length);
  images.slice(0, 5).forEach(src => console.log('  Image src:', src.startsWith('data:') ? src.slice(0, 40) + '...' : src));
});
