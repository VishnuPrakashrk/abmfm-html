const fs = require('fs');

const content = fs.readFileSync('scratch/preview_artifact.html', 'utf8');
const m = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
const script = m[1];

const s1 = script.lastIndexOf('p("div",{id:"hero"');
const s2 = script.lastIndexOf('p("div",{id:"provide"');
const s3 = script.lastIndexOf('p("div",{id:"expertise"');
const sCta = script.lastIndexOf('S("div",{id:"cta"');

const headerIdx = script.indexOf('S("header",');
const mainIdx = script.indexOf('S("main",');

const beforeHeader = script.slice(0, headerIdx);
// From main opening up to start of slide 1
const mainOpen = script.slice(mainIdx, s1);

const slide1 = script.slice(s1, s2 - 1); // remove trailing comma
const slide2 = script.slice(s2, s3 - 1); // remove trailing comma
const slide3 = script.slice(s3, sCta - 1); // remove trailing comma
const cta = script.slice(sCta);

// Test building Page 1 (Who We Are: slide 1 + cta)
const script1 = beforeHeader + mainOpen + slide1 + ',' + cta;

// Test building Page 2 (What We Provide: slide 2 + cta)
// Note: slide 2 has mt-8 by default; for standalone page, let's remove mt-8 from its top div class
const slide2NoMt = slide2.replace('mt-8 bg-white', 'bg-white');
const script2 = beforeHeader + mainOpen + slide2NoMt + ',' + cta;

// Test building Page 3 (Expertise & Value: slide 3 + cta)
const slide3NoMt = slide3.replace('mt-8 bg-white', 'bg-white');
const script3 = beforeHeader + mainOpen + slide3NoMt + ',' + cta;

console.log('Testing script1 syntax...');
new Function(script1);
console.log('script1 is VALID!');

console.log('Testing script2 syntax...');
new Function(script2);
console.log('script2 is VALID!');

console.log('Testing script3 syntax...');
new Function(script3);
console.log('script3 is VALID!');
