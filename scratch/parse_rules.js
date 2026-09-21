const fs = require('fs');

const aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const companyHtml = fs.readFileSync('company.html', 'utf8');
const perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');

const getStyle = html => {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : '';
};

// Function to parse CSS into top-level rules and @media blocks
function parseCSS(css) {
  const rules = [];
  let i = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, ''); // strip comments
  
  while (i < css.length) {
    // skip whitespace
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    
    // Check for @media or @keyframes
    if (css[i] === '@') {
      const atStart = i;
      let depth = 0;
      let atEnd = i;
      while (i < css.length) {
        if (css[i] === '{') depth++;
        else if (css[i] === '}') {
          depth--;
          if (depth === 0) {
            atEnd = i + 1;
            i++;
            break;
          }
        }
        i++;
      }
      rules.push(css.substring(atStart, atEnd).trim());
    } else {
      // standard rule
      const ruleStart = i;
      while (i < css.length && css[i] !== '{') i++;
      if (i >= css.length) break;
      while (i < css.length && css[i] !== '}') i++;
      if (i < css.length && css[i] === '}') i++;
      rules.push(css.substring(ruleStart, i).trim());
    }
  }
  return rules;
}

const aboutRules = parseCSS(getStyle(aboutHtml));
const companyRules = parseCSS(getStyle(companyHtml));
const perspectivesRules = parseCSS(getStyle(perspectivesHtml));

console.log('About rules count:', aboutRules.length);
console.log('Company rules count:', companyRules.length);
console.log('Perspectives rules count:', perspectivesRules.length);
