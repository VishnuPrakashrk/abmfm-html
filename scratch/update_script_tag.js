const fs = require('fs');

let content = fs.readFileSync('about-us.html', 'utf8');
content = content.replace('src="js/components.js"', 'src="js/components.js?v=' + Date.now() + '"');
fs.writeFileSync('about-us.html', content);
console.log('Successfully updated components.js tag in about-us.html');
