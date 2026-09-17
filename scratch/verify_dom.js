const fs = require('fs');

const files = ['test-about-dom.html', 'test-provide-dom.html', 'test-expertise-dom.html'];

files.forEach(f => {
  const c = fs.readFileSync('scratch/' + f, 'utf8');
  console.log(`=== ${f} ===`);
  console.log('Has floating header:', c.includes('site-header-abm-floating'));
  console.log('Has footer:', c.includes('site-footer-dark') || c.includes('GLOBAL OFFICES'));
  console.log('Has slide section (#hero/#provide/#expertise):', c.includes('id="hero"') || c.includes('id="provide"') || c.includes('id="expertise"'));
  console.log('Has CTA banner:', c.includes('Ready to Elevate Your Facility Operations?'));
  console.log('Has active Get in Touch link:', c.includes('href="contact-us.html"'));
  console.log('Has active Explore Services link:', c.includes('href="solutions.html"'));
  console.log('Has NO React runtime script:', !c.includes('react.production.min.js') && !c.includes('ReactCurrentDispatcher'));
});
