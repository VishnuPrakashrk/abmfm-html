const fs = require('fs');

function extractRoot(inputFile, outputFile) {
  if (!fs.existsSync(inputFile)) {
    console.log(`File not found: ${inputFile}`);
    return;
  }
  const content = fs.readFileSync(inputFile, 'utf8');
  const rootStart = content.indexOf('<div id="root">');
  if (rootStart === -1) {
    console.log(`Root not found in ${inputFile}`);
    return;
  }
  const sectionEnd = content.indexOf('</section>', rootStart);
  const snippet = content.substring(rootStart, sectionEnd);
  const lastDiv = snippet.lastIndexOf('</div>');
  const inner = snippet.substring('<div id="root">'.length, lastDiv);
  fs.writeFileSync(outputFile, inner.trim(), 'utf8');
  console.log(`Extracted to ${outputFile}, size: ${inner.trim().length}`);
}

extractRoot('scratch/dump.html', 'scratch/about-us-clean.html');
extractRoot('scratch/dump-what-we-provide.html', 'scratch/what-we-provide-clean.html');
extractRoot('scratch/dump-expertise-value.html', 'scratch/expertise-value-clean.html');
