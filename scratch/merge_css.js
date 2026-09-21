const fs = require('fs');

// Read existing style.css
const styleCss = fs.readFileSync('css/style.css', 'utf8');

// Read inline styles from all 3 files
const aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const companyHtml = fs.readFileSync('company.html', 'utf8');
const perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');

const aboutStyle = aboutHtml.match(/<style>([\s\S]*?)<\/style>/i)[1];
const companyStyle = companyHtml.match(/<style>([\s\S]*?)<\/style>/i)[1];
const perspectivesStyle = perspectivesHtml.match(/<style>([\s\S]*?)<\/style>/i)[1];

console.log('About CSS length:', aboutStyle.length);
console.log('Company CSS length:', companyStyle.length);
console.log('Perspectives CSS length:', perspectivesStyle.length);
