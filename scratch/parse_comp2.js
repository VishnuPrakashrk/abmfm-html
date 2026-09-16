const fs = require('fs');

function inspectCompBody(filename) {
  const code = fs.readFileSync(filename, 'utf8');
  // Find "function " near the end
  const matches = [...code.matchAll(/function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/g)];
  console.log(`Functions in ${filename}:`, matches.map(m => m[0]));
  if (matches.length > 0) {
    const last = matches[matches.length - 1];
    console.log(`Last function starts at index ${last.index}:`);
    console.log(code.slice(last.index, last.index + 2000));
  }
}

inspectCompBody('scratch/about-us-comp.js');
