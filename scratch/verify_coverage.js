const fs = require('fs');

const unifiedCss = fs.readFileSync('scratch/unified_page_styles.css', 'utf8');

const files = ['about-us.html', 'company.html', 'perspectives.html'];

files.forEach(f => {
  const html = fs.readFileSync(f, 'utf8');
  // find all class="..." inside html
  const matches = html.match(/class="([^"]+)"/g) || [];
  const missing = new Set();
  matches.forEach(m => {
    const list = m.replace('class="', '').replace('"', '').split(/\s+/);
    list.forEach(cls => {
      // escape regex special chars
      const escaped = cls.replace(/([\[\]\#\/\:\.\%])/g, '\\$1');
      if (!unifiedCss.includes('.' + cls) && !unifiedCss.includes('.' + escaped)) {
        // exclude standard classes known to be in style.css or bootstrap
        if (![
          'wp-singular', 'page-template', 'page-template-page-about-us', 'page-template-page-company',
          'page-template-page-perspectives', 'page', 'wp-theme-abmfm', 'site-main',
          'page-banner-hero', 'container-fluid', 'px-lg-5', 'page-banner-content',
          'breadcrumb-abm', 'fa-solid', 'fa-chevron-right', 'page-banner-title', 'mb-3',
          'page-banner-subtitle', 'solution-slide-section', 'py-4', 'lucide'
        ].includes(cls)) {
          missing.add(cls);
        }
      }
    });
  });
  console.log(f, 'Missing classes count:', missing.size);
  if (missing.size > 0) {
    console.log(f, 'Sample missing:', Array.from(missing).slice(0, 15));
  }
});
