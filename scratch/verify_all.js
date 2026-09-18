const { execFileSync } = require('child_process');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const urls = [
  'http://localhost/abmfm-html/about-us.html',
  'http://localhost/abmfm-html/perspectives.html',
  'http://localhost/abmfm-html/company.html',
  'http://localhost/abmfm-html/page/Abm-Fm-Who-We.html',
  'http://localhost/abmfm-html/page/Abm-Fm-Perspectives-Colorful.html',
  'http://localhost/abmfm-html/page/Abm-Fm-Company-Colorful.html'
];

urls.forEach(url => {
  console.log(`\nVerifying ${url}...`);
  try {
    const stdout = execFileSync(chromePath, [
      '--headless=new',
      '--disable-gpu',
      '--virtual-time-budget=2000',
      '--dump-dom',
      url
    ], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

    console.log(`  Length: ${stdout.length}`);
    console.log(`  Has <main>: ${stdout.includes('<main')}`);
    console.log(`  Has NO React runtime: ${!stdout.includes('ReactCurrentDispatcher') && !stdout.includes('react.production.min.js')}`);
    if (url.includes('about-us.html') || url.includes('perspectives.html') || url.includes('company.html')) {
      console.log(`  Has floating header: ${stdout.includes('site-header-abm-floating')}`);
      console.log(`  Has direct Perspectives link: ${stdout.includes('href="perspectives.html">Perspectives</a>')}`);
      console.log(`  Has direct Who We Are link: ${stdout.includes('href="about-us.html">Who We Are</a>')}`);
      console.log(`  Has direct Company link: ${stdout.includes('href="company.html">Company</a>')}`);
      console.log(`  Has NO perspectivesDropdown: ${!stdout.includes('id="perspectivesDropdown"')}`);
      console.log(`  Has NO whoWeAreDropdown: ${!stdout.includes('id="whoWeAreDropdown"')}`);
      console.log(`  Has NO companyDropdown: ${!stdout.includes('id="companyDropdown"')}`);
    }
  } catch (err) {
    console.error(`  Error verifying ${url}:`, err.message);
  }
});
