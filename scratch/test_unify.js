const fs = require('fs');

const aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const companyHtml = fs.readFileSync('company.html', 'utf8');
const perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');

const getStyle = html => {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : '';
};

function parseCSS(css) {
  const rules = [];
  let i = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  
  while (i < css.length) {
    while (i < css.length && /\s/.test(css[i])) i++;
    if (i >= css.length) break;
    
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

// Map for deduplicating media rules
// Normalizing conditions like '@media (min-width: 1024px)' and '@media (min-width:1024px)'
function normMediaCond(cond) {
  return cond.replace(/\s+/g, ' ').replace(/\s*:\s*/g, ': ').trim();
}

const mediaBlocks = {
  '@media (min-width: 640px)': [],
  '@media (min-width: 768px)': [],
  '@media (min-width: 1024px)': [],
  '@media (min-width: 1280px)': [],
  '@media (min-width: 1536px)': [],
  '@media (max-width: 767px)': []
};

const seenMediaRules = new Set();

[getStyle(aboutHtml), getStyle(companyHtml), getStyle(perspectivesHtml)].forEach(css => {
  const rules = parseCSS(css);
  rules.forEach(rule => {
    if (!rule.startsWith('@media')) return;
    const condMatch = rule.match(/@media[^{]+/);
    if (!condMatch) return;
    const cond = normMediaCond(condMatch[0]);
    const body = rule.substring(rule.indexOf('{') + 1, rule.lastIndexOf('}')).trim();
    const innerRules = parseCSS(body);
    if (!mediaBlocks[cond]) mediaBlocks[cond] = [];
    innerRules.forEach(ir => {
      const key = cond + '::' + ir;
      if (!seenMediaRules.has(key)) {
        seenMediaRules.add(key);
        mediaBlocks[cond].push(ir);
      }
    });
  });
});

for (const k in mediaBlocks) {
  console.log(k, 'unique inner rules:', mediaBlocks[k].length);
}
