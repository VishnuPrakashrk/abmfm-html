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

// 1. Base reset (scoped to :where(#root))
const baseReset = `:where(#root) *, :where(#root) :after, :where(#root) :before{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }
:where(#root) ::backdrop{--tw-border-spacing-x:0;--tw-border-spacing-y:0;--tw-translate-x:0;--tw-translate-y:0;--tw-rotate:0;--tw-skew-x:0;--tw-skew-y:0;--tw-scale-x:1;--tw-scale-y:1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness:proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-color:rgba(59,130,246,.5);--tw-ring-offset-shadow:0 0 #0000;--tw-ring-shadow:0 0 #0000;--tw-shadow:0 0 #0000;--tw-shadow-colored:0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }
:where(#root) *, :where(#root) :after, :where(#root) :before{box-sizing:border-box;border:0 solid #e5e7eb}
:where(#root) :after, :where(#root) :before{--tw-content:""}
:where(#root) hr{height:0;color:inherit;border-top-width:1px}
:where(#root) h1, :where(#root) h2, :where(#root) h3, :where(#root) h4, :where(#root) h5, :where(#root) h6{font-size:inherit;font-weight:inherit}
:where(#root) a{color:inherit;text-decoration:inherit}
:where(#root) b, :where(#root) strong{font-weight:bolder}
:where(#root) button, :where(#root) input, :where(#root) optgroup, :where(#root) select, :where(#root) textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}
:where(#root) [role=button], :where(#root) button{cursor:pointer}
:where(#root) audio, :where(#root) canvas, :where(#root) embed, :where(#root) iframe, :where(#root) img, :where(#root) object, :where(#root) svg, :where(#root) video{display:block;vertical-align:middle}
:where(#root) img, :where(#root) video{max-width:100%;height:auto}
:where(#root) [hidden]:where(:not([hidden=until-found])){display:none}`;

// 2. Keyframes
const keyframes = `@keyframes pulse {
  50% { opacity: .5 }
}`;

// 3. Unique utility classes
const seenSel = new Set();
const utilityRules = [];

[getStyle(aboutHtml), getStyle(companyHtml), getStyle(perspectivesHtml)].forEach(css => {
  const rules = parseCSS(css);
  rules.forEach(rule => {
    if (rule.startsWith('@')) return;
    const selMatch = rule.match(/^[^{]+/);
    if (!selMatch) return;
    const sel = selMatch[0].trim();
    if (sel.startsWith('*') || sel.startsWith(':host') || sel.startsWith('body') || 
        sel.startsWith('h1') || sel.startsWith('a') || sel.startsWith('button') || 
        sel.startsWith('img') || sel.startsWith('input') || sel.startsWith('table') || 
        sel.startsWith('small') || sel.startsWith('sub') || sel.startsWith('progress') ||
        sel.startsWith('summary') || sel.startsWith('blockquote') || sel.startsWith('fieldset') ||
        sel.startsWith('menu') || sel.startsWith('dialog') || sel.startsWith('textarea') ||
        sel.startsWith('hr') || sel.startsWith('abbr') || sel.startsWith('b,') ||
        sel.startsWith('code') || sel.startsWith('audio') || sel.startsWith('[hidden]') ||
        sel.startsWith('::-webkit') || sel.startsWith(':-moz') || sel.startsWith('::backdrop') ||
        sel.startsWith('.company-') || sel.startsWith('.perspective-') || sel.startsWith('#root') || sel.startsWith('.display')) {
      return;
    }
    if (!seenSel.has(sel)) {
      seenSel.add(sel);
      utilityRules.push(rule);
    }
  });
});

// 4. Media queries
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

let mediaString = '';
for (const cond of [
  '@media (min-width: 640px)',
  '@media (min-width: 768px)',
  '@media (min-width: 1024px)',
  '@media (min-width: 1280px)',
  '@media (min-width: 1536px)',
  '@media (max-width: 767px)'
]) {
  if (mediaBlocks[cond] && mediaBlocks[cond].length > 0) {
    mediaString += `${cond} {\n  ${mediaBlocks[cond].join('\n  ')}\n}\n\n`;
  }
}

// 5. Custom component classes
const customRules = `
#root {
  position: relative;
  z-index: 1;
  font-family: 'Inter', sans-serif;
}

.display {
  font-family: 'Plus Jakarta Sans', sans-serif;
}

.company-image-card {
  position: relative;
  border-radius: 32px;
  overflow: hidden;
  background-color: #0A1931;
  box-shadow: 0 30px 80px -20px rgba(10, 74, 176, 0.45);
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  height: 100%;
}

@media (min-width: 1024px) {
  .company-image-card {
    padding: 18px;
    gap: 16px;
  }
}

.company-img-container {
  position: relative;
  width: 100%;
  border-radius: 20px;
  overflow: hidden;
  background-color: #051024;
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;
}

.company-full-img {
  width: 100%;
  height: auto;
  display: block;
  object-fit: contain;
}

.company-badges-wrapper {
  position: relative;
  width: 100%;
  z-index: 10;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.company-badge-box {
  border-radius: 22px;
  background: linear-gradient(135deg, #0D6EFD 0%, #0A4AB0 100%);
  padding: 20px;
  box-shadow: 0 20px 40px rgba(10, 74, 176, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.company-banner-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.15rem, 1.6vw, 1.38rem);
  font-weight: 700;
  line-height: 1.28;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.company-pillar-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.22;
  text-align: center;
  margin-top: 8px;
}

.perspective-banner-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.15rem, 1.6vw, 1.38rem);
  font-weight: 700;
  line-height: 1.28;
  color: #FFFFFF;
  margin-bottom: 16px;
}

.perspective-pillar-name {
  font-family: 'Plus Jakarta Sans', sans-serif;
  font-size: 0.78rem;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.22;
  text-align: center;
  margin-top: 8px;
}
`;

const fullUnifiedCSS = `
/* ── Unified Page Presentation Styles (about-us.html, company.html, perspectives.html) ── */
${baseReset}

${keyframes}

${utilityRules.join('\n')}

${mediaString}
${customRules}
`;

fs.writeFileSync('scratch/unified_page_styles.css', fullUnifiedCSS, 'utf8');
console.log('Saved scratch/unified_page_styles.css. Total size:', fullUnifiedCSS.length);
