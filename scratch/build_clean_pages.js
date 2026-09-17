const fs = require('fs');
const path = require('path');

// 1. Read existing scoped styles from about-us.html
const origAbout = fs.readFileSync('about-us.html', 'utf8');
const styleMatch = origAbout.match(/<style>([\s\S]*?)<\/style>/);
const scopedCss = styleMatch ? styleMatch[1] : '';

// 2. Read clean extracted HTMLs
let aboutHtml = fs.readFileSync('scratch/about-us-clean.html', 'utf8');
let provideHtml = fs.readFileSync('scratch/what-we-provide-clean.html', 'utf8');
let expertiseHtml = fs.readFileSync('scratch/expertise-value-clean.html', 'utf8');

// Function to fix buttons into links in the CTA section
function upgradeCtaButtons(html) {
  return html
    .replace(
      /<button class="([^"]*bg-\[#C6FF00\][^"]*)">Get in Touch<\/button>/g,
      '<a href="contact-us.html" class="$1 inline-flex items-center justify-center">Get in Touch</a>'
    )
    .replace(
      /<button class="([^"]*bg-white\/10[^"]*)">Explore Services<\/button>/g,
      '<a href="solutions.html" class="$1 inline-flex items-center justify-center">Explore Services</a>'
    );
}

aboutHtml = upgradeCtaButtons(aboutHtml);

// Fix unicode / mojibake characters in what-we-provide
provideHtml = upgradeCtaButtons(provideHtml)
  .replace(/ΓÜÖ∩╕Å/g, '⚙️')
  .replace(/≡ƒ¢á∩╕Å/g, '🛠️')
  .replace(/Γ£¿/g, '✨')
  .replace(/≡ƒ¢í∩╕Å/g, '🛡️')
  .replace(/≡ƒÅó/g, '🏢')
  .replace(/≡ƒöº/g, '🔧')
  .replace(/≡ƒº╣/g, '🧹')
  .replace(/≡ƒöÆ/g, '🔒')
  .replace(/ΓÜí/g, '⚡')
  .replace(/≡ƒî┐/g, '🌿')
  .replace(/≡ƒî│/g, '🌳')
  .replace(/≡ƒÆ╝/g, '💼')
  .replace(/Γùì/g, '🎯');

// Fix unicode / mojibake characters in expertise-value
expertiseHtml = upgradeCtaButtons(expertiseHtml)
  .replace(/≡ƒñ¥/g, '🤝')
  .replace(/≡ƒÄ»/g, '🎯')
  .replace(/≡ƒö¡/g, '🔭')
  .replace(/Γ£ª/g, '✦')
  .replace(/Γåæ/g, '↑')
  .replace(/Γåô/g, '↓')
  .replace(/≡ƒÆí/g, '💡')
  .replace(/ΓÇö/g, '—');

function createPage({
  title,
  canonical,
  description,
  breadcrumbs,
  bannerTitle,
  bannerSubtitle,
  innerHtml
}) {
  return `<!doctype html>
<html lang="en-US">

<head>
  <meta charset="UTF-8">
  <title>${title} | ABM FM — Building Maintenance & Facility Services</title>
  
  <!-- Official Favicon -->
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="favicon.png">
  
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="${description}">
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
${scopedCss}
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
          ${breadcrumbs}
        </div>
        
        <h1 class="page-banner-title mb-3">${bannerTitle}</h1>
        <p class="page-banner-subtitle">
          ${bannerSubtitle}
        </p>
      </div>
    </section>

    <!-- Master Presentation Deck Section -->
    <section class="solution-slide-section py-4" style="background-color: #F8FAFF;">
      <div id="root">
${innerHtml}
      </div>
    </section>

    <!-- Official Site Footer Placeholder (Loaded dynamically by components.js) -->
    <div id="site-footer-placeholder"></div>

  </main>

  <!-- JS Scripts -->
  <script src="js/jquery.min.js"></script>
  <script src="js/components.js?v=20260913"></script>
  <script src="js/bootstrap.bundle.min.js"></script>
  <script src="js/abm-animated.js"></script>

</body>

</html>
`;
}

// 1. Build about-us.html
const aboutPage = createPage({
  title: 'Who We Are',
  canonical: 'about-us.html',
  description: 'Discover ABM FM - Who We Are. Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Who We Are</span>`,
  bannerTitle: 'Who We Are',
  bannerSubtitle: 'Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.',
  innerHtml: aboutHtml
});
fs.writeFileSync('about-us.html', aboutPage, 'utf8');
console.log('Saved about-us.html! Size:', aboutPage.length);

// 2. Build what-we-provide.html
const providePage = createPage({
  title: 'What We Provide',
  canonical: 'what-we-provide.html',
  description: 'Discover ABM FM - What We Provide. Integrated Solutions. Tailored Services. End-to-End FM.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <a href="about-us.html">Who We Are</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>What We Provide</span>`,
  bannerTitle: 'What We Provide',
  bannerSubtitle: 'Integrated Solutions. Tailored Services. End-to-End FM.',
  innerHtml: provideHtml
});
fs.writeFileSync('what-we-provide.html', providePage, 'utf8');
console.log('Saved what-we-provide.html! Size:', providePage.length);

// 3. Build expertise-value.html
const expertisePage = createPage({
  title: 'Expertise & Value',
  canonical: 'expertise-value.html',
  description: 'Discover ABM FM - Expertise You Can Rely On & Creating Value Beyond the Facility.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <a href="about-us.html">Who We Are</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Expertise & Value</span>`,
  bannerTitle: 'Expertise & Value',
  bannerSubtitle: 'Expertise You Can Trust. Value Beyond The Building.',
  innerHtml: expertiseHtml
});
fs.writeFileSync('expertise-value.html', expertisePage, 'utf8');
console.log('Saved expertise-value.html! Size:', expertisePage.length);
