const fs = require('fs');

const unifiedCss = fs.readFileSync('scratch/unified_page_styles.css', 'utf8');

// 1. Update css/style.css
let styleCss = fs.readFileSync('css/style.css', 'utf8');
const marker = '/* ── Perspectives Pages Styles (Plain HTML) ── */';
const markerIdx = styleCss.indexOf(marker);

if (markerIdx === -1) {
  console.error('Marker not found in css/style.css!');
  process.exit(1);
}

styleCss = styleCss.substring(0, markerIdx) + unifiedCss.trim() + '\n';
fs.writeFileSync('css/style.css', styleCss, 'utf8');
console.log('Successfully updated css/style.css');

// 2. Clean about-us.html
let aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const aboutMatch = aboutHtml.match(/\s*<style>[\s\S]*?<\/style>/i);
if (aboutMatch) {
  aboutHtml = aboutHtml.replace(aboutMatch[0], '');
  fs.writeFileSync('about-us.html', aboutHtml, 'utf8');
  console.log('Successfully removed <style> from about-us.html');
} else {
  console.log('No <style> in about-us.html');
}

// 3. Clean company.html
let companyHtml = fs.readFileSync('company.html', 'utf8');
const companyMatch = companyHtml.match(/\s*<style>[\s\S]*?<\/style>/i);
if (companyMatch) {
  companyHtml = companyHtml.replace(companyMatch[0], '');
  fs.writeFileSync('company.html', companyHtml, 'utf8');
  console.log('Successfully removed <style> from company.html');
} else {
  console.log('No <style> in company.html');
}

// 4. Clean perspectives.html
let perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');
const perspectivesMatch = perspectivesHtml.match(/\s*<style>[\s\S]*?<\/style>/i);
if (perspectivesMatch) {
  perspectivesHtml = perspectivesHtml.replace(perspectivesMatch[0], '');
  fs.writeFileSync('perspectives.html', perspectivesHtml, 'utf8');
  console.log('Successfully removed <style> from perspectives.html');
} else {
  console.log('No <style> in perspectives.html');
}
