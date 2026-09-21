const fs = require('fs');

const aboutHtml = fs.readFileSync('about-us.html', 'utf8');
const companyHtml = fs.readFileSync('company.html', 'utf8');
const perspectivesHtml = fs.readFileSync('perspectives.html', 'utf8');

const getStyle = html => {
  const m = html.match(/<style>([\s\S]*?)<\/style>/i);
  return m ? m[1] : '';
};

const aboutStyle = getStyle(aboutHtml);
const companyStyle = getStyle(companyHtml);
const perspectivesStyle = getStyle(perspectivesHtml);

console.log('About length:', aboutStyle.length);
console.log('Company length:', companyStyle.length);
console.log('Perspectives length:', perspectivesStyle.length);
