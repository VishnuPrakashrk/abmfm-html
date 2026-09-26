const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
let css = fs.readFileSync(cssPath, 'utf8');

const target = `.hero-content-wrap {
  position: relative;
  z-index: 10;
  margin-top: -60px;
}`;

// Normalize line endings for replacement
const targetCRLF = target.replace(/\r?\n/g, '\r\n');
const targetLF = target.replace(/\r?\n/g, '\n');

const replacement = `.hero-content-wrap {
  position: relative;
  z-index: 10;
  margin-top: -60px;
  max-width: calc(100% - 3rem) !important;
  width: 100% !important;
  padding-left: 28px !important;
  padding-right: 28px !important;
  margin-left: auto !important;
  margin-right: auto !important;
}

@media (max-width: 991.98px) {
  .hero-content-wrap {
    padding-left: 18px !important;
    padding-right: 18px !important;
  }
}

@media (max-width: 576px) {
  .hero-content-wrap {
    max-width: calc(100% - 1.5rem) !important;
    padding-left: 14px !important;
    padding-right: 14px !important;
  }
}`;

let found = false;
if (css.includes(targetCRLF)) {
  css = css.replace(targetCRLF, replacement.replace(/\r?\n/g, '\r\n'));
  found = true;
} else if (css.includes(targetLF)) {
  css = css.replace(targetLF, replacement.replace(/\r?\n/g, '\n'));
  found = true;
}

if (!found) {
  console.error('Target .hero-content-wrap not found');
  process.exit(1);
}

fs.writeFileSync(cssPath, css, 'utf8');
console.log('Successfully updated .hero-content-wrap padding in style.css');
