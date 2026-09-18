const fs = require('fs');

function analyze(name, file) {
  const content = fs.readFileSync('scratch/' + file, 'utf8');
  console.log(`\n============================= ${name} (${file}) =============================`);
  console.log('Total length:', content.length);
  
  // Style tag
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  console.log('Style block length:', styleMatch ? styleMatch[1].length : 'none');

  // Root content
  const rootStart = content.indexOf('<div id="root">');
  const rootEnd = content.lastIndexOf('</div>');
  const inner = content.substring(rootStart + '<div id="root">'.length, rootEnd);
  console.log('Inner HTML length:', inner.length);

  // Check major containers inside inner
  // What is the immediate child of #root?
  const firstTagMatch = inner.match(/^\s*<([a-z0-9-]+)([^>]*)>/i);
  console.log('Root first child tag:', firstTagMatch ? firstTagMatch[0] : 'none');

  // Check headers / navs
  const headers = [...inner.matchAll(/<header[^>]*>([\s\S]*?)<\/header>/gi)];
  console.log('Headers inside root:', headers.length);
  if (headers.length > 0) {
    console.log('Header preview:', headers[0][0].slice(0, 300));
  }

  // Check main
  const mains = [...inner.matchAll(/<main[^>]*>([\s\S]*?)<\/main>/gi)];
  console.log('Mains inside root:', mains.length);
  if (mains.length > 0) {
    console.log('Main attributes:', mains[0][0].slice(0, 150));
  }

  // Check sections
  const sections = [...inner.matchAll(/<section[^>]*>([\s\S]*?)<\/section>/gi)];
  console.log('Sections inside root:', sections.length);
  sections.forEach((s, idx) => {
    const titleMatch = s[0].match(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/i);
    console.log(`  Section ${idx+1}: tag=${s[0].slice(0, 80)}... heading=${titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'none'}`);
  });

  // Check div containers with id
  const idDivs = [...inner.matchAll(/<div[^>]*id="([^"]+)"[^>]*>/gi)].map(m => m[1]);
  console.log('Div IDs:', idDivs);
}

analyze('Who We Are', 'dump-who-we.html');
analyze('Perspectives', 'dump-perspectives-colorful.html');
analyze('Company', 'dump-company-colorful.html');
