const fs = require('fs');

const content = fs.readFileSync('scratch/preview_artifact.html', 'utf8');
const m = content.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
const script = m[1];

const s1 = script.lastIndexOf('p("div",{id:"hero"', 151601);
const s2 = script.lastIndexOf('p("div",{id:"provide"', 155741);
const s3 = script.lastIndexOf('p("div",{id:"expertise"', 160701);
const sCta = script.lastIndexOf('S("div",{id:"cta"', 165506);

console.log('s1:', s1, script.slice(s1 - 20, s1 + 30));
console.log('s2:', s2, script.slice(s2 - 20, s2 + 30));
console.log('s3:', s3, script.slice(s3 - 20, s3 + 30));
console.log('sCta:', sCta, script.slice(sCta - 20, sCta + 30));
