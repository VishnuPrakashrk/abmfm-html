const fs = require('fs');

function dumpComponent(filename, outname) {
  const content = fs.readFileSync(filename, 'utf8');
  const m = content.match(/<script type="module">([\s\S]*?)<\/script>/);
  if (!m) return;
  const code = m[1];
  // Find where the main component starts
  // Look for render call
  const renderIdx = code.indexOf('.render(');
  if (renderIdx === -1) return;
  // Get the last 30,000 characters before render
  const sub = code.slice(Math.max(0, renderIdx - 35000), renderIdx + 100);
  fs.writeFileSync(outname, sub, 'utf8');
  console.log(`Wrote ${sub.length} bytes to ${outname}`);
}

dumpComponent('about-us.html', 'scratch/about-us-comp.js');
dumpComponent('what-we-provide.html', 'scratch/what-we-provide-comp.js');
dumpComponent('expertise-value.html', 'scratch/expertise-value-comp.js');
