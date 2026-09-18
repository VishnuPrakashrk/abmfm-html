const fs = require('fs');

function extractMainAndStyle(filename) {
  const content = fs.readFileSync('scratch/' + filename, 'utf8');

  // Extract style
  const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1] : '';

  // Extract between <main and </main>
  const mainStart = content.indexOf('<main');
  if (mainStart === -1) {
    console.error('No <main> in', filename);
    return null;
  }
  const mainEnd = content.indexOf('</main>', mainStart) + '</main>'.length;
  const mainHtml = content.substring(mainStart, mainEnd);

  console.log(`=== ${filename} ===`);
  console.log('Style length:', style.length);
  console.log('Main HTML length:', mainHtml.length);

  return { style, mainHtml };
}

const whoWe = extractMainAndStyle('dump-who-we.html');
const perspectives = extractMainAndStyle('dump-perspectives-colorful.html');
const company = extractMainAndStyle('dump-company-colorful.html');

fs.writeFileSync('scratch/who-we-main.html', whoWe.mainHtml, 'utf8');
fs.writeFileSync('scratch/who-we-style.css', whoWe.style, 'utf8');

fs.writeFileSync('scratch/perspectives-main.html', perspectives.mainHtml, 'utf8');
fs.writeFileSync('scratch/perspectives-style.css', perspectives.style, 'utf8');

fs.writeFileSync('scratch/company-main.html', company.mainHtml, 'utf8');
fs.writeFileSync('scratch/company-style.css', company.style, 'utf8');

console.log('Successfully extracted mains and styles!');
