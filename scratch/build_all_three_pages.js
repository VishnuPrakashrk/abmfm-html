const fs = require('fs');

// Read preview artifact for clean styles and script
const origContent = fs.readFileSync('scratch/preview_artifact.html', 'utf8');

// 1. Scoped CSS
const styleStart = origContent.indexOf('<style>');
const styleEnd = origContent.indexOf('</style>');
let styleCss = origContent.slice(styleStart + 7, styleEnd);

const classIdx = styleCss.indexOf('.absolute{');
let preflight = styleCss.slice(0, classIdx);
let utilities = styleCss.slice(classIdx);

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

utilities = utilities.replace(/#root,body,html\{min-height:100%\}body\{[^}]+\}/g, '');

const scopedStyle = preflight + utilities;

// 2. Script slices
const m = origContent.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
const script = m[1];

const s1 = script.lastIndexOf('p("div",{id:"hero"');
const s2 = script.lastIndexOf('p("div",{id:"provide"');
const s3 = script.lastIndexOf('p("div",{id:"expertise"');
const sCta = script.lastIndexOf('S("div",{id:"cta"');

const headerIdx = script.indexOf('S("header",');
const mainIdx = script.indexOf('S("main",');

const beforeHeader = script.slice(0, headerIdx);
const mainOpen = script.slice(mainIdx, s1);

const slide1 = script.slice(s1, s2 - 1);
const slide2 = script.slice(s2, s3 - 1).replace('mt-8 bg-white', 'bg-white');
const slide3 = script.slice(s3, sCta - 1).replace('mt-8 bg-white', 'bg-white');
const cta = script.slice(sCta);

const script1 = beforeHeader + mainOpen + slide1 + ',' + cta;
const script2 = beforeHeader + mainOpen + slide2 + ',' + cta;
const script3 = beforeHeader + mainOpen + slide3 + ',' + cta;

// Template generator
function generatePage({ title, pageTitle, subtitle, breadcrumbs, scriptContent, canonical }) {
  return `<!doctype html>
<html lang="en-US">

<head>
  <meta charset="UTF-8">
  <title>${title} | ABM FM — Building Maintenance & Facility Services</title>
  
  <!-- Official Favicon -->
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="favicon.png">
  
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="Discover ABM FM - ${pageTitle}. ${subtitle}">
  <link rel="canonical" href="${canonical}">
  
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
          ${breadcrumbs}
        </div>
        
        <h1 class="page-banner-title mb-3">${pageTitle}</h1>
        <p class="page-banner-subtitle">
          ${subtitle}
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
  <script src="js/components.js?v=20260913"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="js/abm-animated.js"></script>

  <!-- React Slides Component -->
  <script type="module">
${scriptContent}
  </script>
</body>

</html>`;
}

// 1. Generate about-us.html
const html1 = generatePage({
  title: 'Who We Are',
  pageTitle: 'Who We Are',
  subtitle: 'Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.',
  breadcrumbs: `<i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Who We Are</span>`,
  scriptContent: script1,
  canonical: 'about-us.html'
});
fs.writeFileSync('about-us.html', html1);
console.log('Successfully generated about-us.html');

// 2. Generate what-we-provide.html
const html2 = generatePage({
  title: 'What We Provide',
  pageTitle: 'What We Provide',
  subtitle: 'Integrated Solutions. Tailored Services. End-to-End FM.',
  breadcrumbs: `<i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <a href="about-us.html">Who We Are</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>What We Provide</span>`,
  scriptContent: script2,
  canonical: 'what-we-provide.html'
});
fs.writeFileSync('what-we-provide.html', html2);
console.log('Successfully generated what-we-provide.html');

// 3. Generate expertise-value.html
const html3 = generatePage({
  title: 'Expertise & Value',
  pageTitle: 'Expertise & Value',
  subtitle: 'Expertise You Can Trust. Value Beyond The Building.',
  breadcrumbs: `<i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <a href="about-us.html">Who We Are</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Expertise & Value</span>`,
  scriptContent: script3,
  canonical: 'expertise-value.html'
});
fs.writeFileSync('expertise-value.html', html3);
console.log('Successfully generated expertise-value.html');
