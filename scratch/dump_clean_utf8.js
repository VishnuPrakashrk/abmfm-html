const { execFileSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function dumpPage(url, outputFile) {
  console.log(`Dumping ${url} directly to ${outputFile}...`);
  const stdout = execFileSync(chromePath, [
    '--headless=new',
    '--disable-gpu',
    '--virtual-time-budget=3000',
    '--dump-dom',
    url
  ], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

  fs.writeFileSync(outputFile, stdout, 'utf8');
  console.log(`Saved ${outputFile}, length: ${stdout.length}`);
}

dumpPage('http://localhost/abmfm-html/page/Abm-Fm-Who-We.html', 'scratch/clean-who-we.html');
dumpPage('http://localhost/abmfm-html/page/Abm-Fm-Perspectives-Colorful.html', 'scratch/clean-perspectives.html');
dumpPage('http://localhost/abmfm-html/page/Abm-Fm-Company-Colorful.html', 'scratch/clean-company.html');
console.log('All 3 pages cleanly dumped with pure UTF-8!');
