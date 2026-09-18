const fs = require('fs');

function checkMain(name, filename) {
  const c = fs.readFileSync('scratch/' + filename, 'utf8');
  const mainStart = c.indexOf('<main');
  const mainEnd = c.indexOf('</main>', mainStart) + '</main>'.length;
  const mainHtml = c.substring(mainStart, mainEnd);
  console.log(`=== ${name} ===`);
  console.log('Main starts with:', mainHtml.slice(0, 150));
  console.log('Main ends with:', mainHtml.slice(-150));
  console.log('Main length:', mainHtml.length);
}

checkMain('Who We Are', 'clean-who-we.html');
checkMain('Perspectives', 'clean-perspectives.html');
checkMain('Company', 'clean-company.html');
