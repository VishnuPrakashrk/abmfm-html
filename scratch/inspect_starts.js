const fs = require('fs');

const aboutStyle = fs.readFileSync('about-us.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/i)[1];
const companyStyle = fs.readFileSync('company.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/i)[1];
const perspectivesStyle = fs.readFileSync('perspectives.html', 'utf8').match(/<style>([\s\S]*?)<\/style>/i)[1];

console.log('About start (500 chars):\n', aboutStyle.slice(0, 500));
console.log('Company start (500 chars):\n', companyStyle.slice(0, 500));
console.log('Perspectives start (500 chars):\n', perspectivesStyle.slice(0, 500));
