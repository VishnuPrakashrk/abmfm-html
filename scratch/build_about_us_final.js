const fs = require('fs');

const content = fs.readFileSync('about-us.html', 'utf8');

// 1. Extract the <style>...</style> block from scratch/preview_artifact.html (the clean original)
const origContent = fs.readFileSync('scratch/preview_artifact.html', 'utf8');
const styleStart = origContent.indexOf('<style>');
const styleEnd = origContent.indexOf('</style>');
let styleCss = origContent.slice(styleStart + 7, styleEnd);

const classIdx = styleCss.indexOf('.absolute{');
let preflight = styleCss.slice(0, classIdx);
let utilities = styleCss.slice(classIdx);

// Scope universal reset rules using :where(#root) so specificity is 0 and utility classes ALWAYS win!
preflight = preflight
  .replace(/\*,\:after,\:before/g, ':where(#root) *, :where(#root) :after, :where(#root) :before')
  .replace(/\:\:backdrop/g, ':where(#root) ::backdrop')
  .replace(/h1,h2,h3,h4,h5,h6/g, ':where(#root) h1, :where(#root) h2, :where(#root) h3, :where(#root) h4, :where(#root) h5, :where(#root) h6')
  .replace(/button,input,optgroup,select,textarea/g, ':where(#root) button, :where(#root) input, :where(#root) optgroup, :where(#root) select, :where(#root) textarea')
  .replace(/\[role=button\],button/g, ':where(#root) [role=button], :where(#root) button')
  .replace(/blockquote,dd,dl,figure,h1,h2,h3,h4,h5,h6,hr,p,pre/g, ':where(#root) blockquote, :where(#root) dd, :where(#root) dl, :where(#root) figure, :where(#root) h1, :where(#root) h2, :where(#root) h3, :where(#root) h4, :where(#root) h5, :where(#root) h6, :where(#root) hr, :where(#root) p, :where(#root) pre')
  .replace(/audio,canvas,embed,iframe,img,object,svg,video/g, ':where(#root) audio, :where(#root) canvas, :where(#root) embed, :where(#root) iframe, :where(#root) img, :where(#root) object, :where(#root) svg, :where(#root) video')
  .replace(/a\{color:inherit;text-decoration:inherit\}/g, ':where(#root) a{color:inherit;text-decoration:inherit}')
  .replace(/body\{line-height:inherit\}/g, '')
  .replace(/:host,html\{[^}]+\}/g, '');

// Clean any global body resets in utilities
utilities = utilities
  .replace(/#root,body,html\{min-height:100%\}body\{[^}]+\}/g, '');

const scopedStyle = preflight + utilities;

// 2. Extract script
const m = origContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
let script = m[1];

// Remove S("header", ...)
const headerIdx = script.indexOf('S("header",');
const mainIdx = script.indexOf('S("main",');

if (headerIdx !== -1 && mainIdx !== -1) {
  script = script.slice(0, headerIdx) + script.slice(mainIdx);
}

// Validate script syntax
try {
  new Function(script);
  console.log('Script syntax is 100% VALID!');
} catch (e) {
  console.error('Validation error:', e.message);
  process.exit(1);
}

// 3. Assemble the full about-us.html
const finalHtml = `<!doctype html>
<html lang="en-US">

<head>
  <meta charset="UTF-8">
  <title>Who We Are | ABM FM — Building Maintenance & Facility Services</title>
  
  <!-- Official Favicon -->
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="favicon.png">
  
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Discover ABM FM - Who We Are, What We Provide, and our expertise in creating safe, efficient, reliable, and future-ready facilities.">
  <link rel="canonical" href="about-us.html">
  
  <!-- Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  
  <!-- Three.js 3D WebGL Engine -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>

  <!-- CSS Stylesheets -->
  <link rel="stylesheet" href="css/bootstrap.min.css">
  <link rel="stylesheet" href="css/style.css">

  <style>
    ${scopedStyle}
    #root {
      position: relative;
      z-index: 1;
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>

<body class="wp-singular page-template page-template-page-about-us page-template-page-about-us-php page page-id-9 wp-theme-abmfm">
  <main class="site-main">

    <!-- Official Floating Site Header Placeholder (Loaded dynamically by components.js) -->
    <div id="site-header-placeholder"></div>

    <!-- Official Page Banner Hero with Breadcrumbs -->
    <section class="page-banner-hero">
      <div class="container-fluid px-lg-5 page-banner-content">
        <div class="breadcrumb-abm">
          <a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Who We Are</span>
        </div>
        
        <h1 class="page-banner-title mb-3">Who We Are</h1>
        <p class="page-banner-subtitle">
          Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.
        </p>
      </div>
    </section>

    <!-- Master Presentation Slides Section -->
    <section class="solution-slide-section py-4" style="background-color: #F8FAFF;">
      <div id="root"></div>
    </section>

    <!-- Official Site Footer Placeholder (Loaded dynamically by components.js) -->
    <div id="site-footer-placeholder"></div>

  </main>

  <!-- JS Scripts -->
  <script src="js/jquery.min.js"></script>
  <script src="js/components.js"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="js/abm-animated.js"></script>

  <!-- React Slides Component -->
  <script type="module">
${script}
  </script>
</body>

</html>`;

fs.writeFileSync('about-us.html', finalHtml);
console.log('Successfully updated about-us.html with :where(#root) scoped resets!');
