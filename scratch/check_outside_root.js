const fs = require('fs');

['about-us.html', 'company.html', 'perspectives.html'].forEach(file => {
  const html = fs.readFileSync(file, 'utf8');
  // extract classes before id="root"
  const beforeRoot = html.substring(0, html.indexOf('id="root"'));
  const afterRootClose = html.substring(html.lastIndexOf('</div>\n    </section>'));
  
  const extractClasses = str => {
    const matches = str.match(/class="([^"]+)"/g) || [];
    const set = new Set();
    matches.forEach(m => {
      const cls = m.replace('class="', '').replace('"', '').split(/\s+/);
      cls.forEach(c => set.add(c));
    });
    return Array.from(set);
  };
  
  console.log(file, 'Classes outside #root before:', extractClasses(beforeRoot));
  console.log(file, 'Classes outside #root after:', extractClasses(afterRootClose));
});
