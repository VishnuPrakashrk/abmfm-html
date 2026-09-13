const fs = require('fs');

const content = fs.readFileSync('about-us.html', 'utf8');
const m = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
let script = m[1];

const idx = script.indexOf('S("header",');
const mainIdx = script.indexOf('S("main",');

const modifiedScript = script.slice(0, idx) + script.slice(mainIdx);

try {
  new Function(modifiedScript);
  console.log('Modified script is 100% VALID!');
} catch (e) {
  console.error('Validation failed:', e.message);
}
