const fs = require('fs');

function inspectComp(filename) {
  console.log(`\n============================\n${filename}\n============================`);
  const code = fs.readFileSync(filename, 'utf8');
  // Match string literals
  const matches = code.match(/"([^"\\]|\\.)*"/g) || [];
  const valid = [];
  for (const m of matches) {
    try {
      const val = JSON.parse(m);
      if (val.length > 2 && 
          !val.includes('tw-') && 
          !val.startsWith('M') && 
          !val.startsWith('http') && 
          !val.includes('px') && 
          !val.includes('rgba') &&
          !val.includes('#') &&
          !val.includes('grid-') &&
          !val.includes('flex') &&
          !val.includes('border') &&
          !val.includes('rounded') &&
          !val.includes('transition') &&
          !val.includes('hidden') &&
          !val.includes('shadow') &&
          !val.includes('overflow') &&
          !val.includes('align-') &&
          !val.includes('justify-') &&
          !val.includes('leading-') &&
          !val.includes('tracking-') &&
          !val.includes('uppercase') &&
          !val.includes('font-') &&
          !val.includes('text-') &&
          !val.includes('bg-') &&
          !val.includes('w-') &&
          !val.includes('h-') &&
          !val.includes('p-') &&
          !val.includes('m-') &&
          !val.includes('gap-') &&
          !val.includes('col-') &&
          !val.includes('row-') &&
          !val.includes('inset-') &&
          !val.includes('rotate-') &&
          !val.includes('opacity-') &&
          !val.includes('blur-') &&
          !val.includes('sm:') &&
          !val.includes('lg:') &&
          !val.includes('hover:')) {
        valid.push(val);
      }
    } catch(e) {}
  }
  // filter duplicates in sequence
  const unique = [];
  for (const v of valid) {
    if (unique[unique.length - 1] !== v) unique.push(v);
  }
  console.log(unique.join('\n---\n'));
}

inspectComp('scratch/about-us-comp.js');
inspectComp('scratch/what-we-provide-comp.js');
inspectComp('scratch/expertise-value-comp.js');
