const fs = require('fs');

const content = fs.readFileSync('about-us.html', 'utf8');
const headerIdx = content.indexOf('S("header"');
const mainIdx = content.indexOf('S("main"');

console.log('headerIdx:', headerIdx);
console.log('mainIdx:', mainIdx);

if (headerIdx !== -1 && mainIdx !== -1) {
  console.log('Code between header and main:');
  console.log(content.slice(headerIdx, headerIdx + 300));
  console.log('...');
  console.log(content.slice(mainIdx - 100, mainIdx + 100));
}
