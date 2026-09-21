const fs = require('fs');

const aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const companyHtml = fs.readFileSync('company.html', 'utf8');
const perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');

const getStyle = html => {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : '';
};

const styles = [getStyle(aboutHtml), getStyle(companyHtml), getStyle(perspectivesHtml)];

// We want to combine the 3 styles:
// Notice:
// 1. Scoped base resets:
// :where(#root) *, :where(#root) :after, :where(#root) :before { ... }
// :where(#root) ::backdrop { ... }
// :where(#root) *, :where(#root) :after, :where(#root) :before { box-sizing: border-box; border: 0 solid #e5e7eb; }
// :where(#root) h1, :where(#root) h2, :where(#root) h3, :where(#root) h4, :where(#root) h5, :where(#root) h6 { font-size: inherit; font-weight: inherit; }
// :where(#root) a { color: inherit; text-decoration: inherit; }
// :where(#root) button, :where(#root) input, :where(#root) optgroup, :where(#root) select, :where(#root) textarea { font-family: inherit; font-size: 100%; ... }
// :where(#root) [role=button], :where(#root) button { cursor: pointer; }
// :where(#root) audio, :where(#root) canvas, :where(#root) embed, :where(#root) iframe, :where(#root) img, :where(#root) object, :where(#root) svg, :where(#root) video { display: block; vertical-align: middle; }

// Let's inspect the rule breakdown across the 3 files.
console.log('Done setup');
