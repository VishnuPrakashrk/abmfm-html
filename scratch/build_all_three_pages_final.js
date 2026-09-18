const fs = require('fs');
const path = require('path');

// ==========================================
// 1. HELPER FUNCTIONS
// ==========================================

function extractStyleAndMain(fileContent) {
  const styleMatch = fileContent.match(/<style>([\s\S]*?)<\/style>/);
  const style = styleMatch ? styleMatch[1] : '';

  const mainStart = fileContent.indexOf('<main');
  const mainEnd = fileContent.indexOf('</main>', mainStart) + '</main>'.length;
  const main = fileContent.substring(mainStart, mainEnd);

  return { style, main };
}

function extractFullStandaloneHtml(fileContent) {
  // Extract from <!DOCTYPE html> to </html>, removing the <script type="module">...</script>
  let html = fileContent.replace(/<script type="module">[\s\S]*?<\/script>/gi, '');
  return html;
}

function createOfficialSitePage({
  title,
  canonical,
  description,
  breadcrumbs,
  bannerTitle,
  bannerSubtitle,
  scopedStyle,
  mainContent
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
${scopedStyle}
    #root {
      position: relative;
      z-index: 1;
      font-family: 'Inter', sans-serif;
    }
  </style>
</head>

<body class="wp-singular page-template page-template-page-${canonical.replace('.html', '')} page wp-theme-abmfm">
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
${mainContent}
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

// ==========================================
// 2. PROCESS WHO WE ARE
// ==========================================
console.log('Building Who We Are...');
const whoWeDump = fs.readFileSync('scratch/who-we-fixed.html', 'utf8');
const { style: whoWeStyle, main: whoWeMain } = extractStyleAndMain(whoWeDump);

// Update CTA buttons to active links
const whoWeMainClean = whoWeMain
  .replace(/<button class="([^"]*bg-\[#C6FF00\][^"]*)">Start a Conversation<\/button>/g, '<a href="contact-us.html" class="$1 inline-flex items-center justify-center">Start a Conversation</a>')
  .replace(/<button class="([^"]*border border-white\/20[^"]*)">View Our Services<\/button>/g, '<a href="solutions.html" class="$1 inline-flex items-center justify-center">View Our Services</a>');

// 2a. about-us.html
const aboutUsHtml = createOfficialSitePage({
  title: 'Who We Are',
  canonical: 'about-us.html',
  description: 'Discover ABM FM - Who We Are. Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Who We Are</span>`,
  bannerTitle: 'Who We Are',
  bannerSubtitle: 'Built Around Better Facilities. Safe. Efficient. Reliable. Future-Ready.',
  scopedStyle: whoWeStyle,
  mainContent: whoWeMainClean
});
fs.writeFileSync('about-us.html', aboutUsHtml, 'utf8');
console.log('Saved about-us.html! Size:', aboutUsHtml.length);

// 2b. page/Abm-Fm-Who-We.html (clean standalone)
const whoWeStandalone = extractFullStandaloneHtml(whoWeDump);
fs.writeFileSync('page/Abm-Fm-Who-We.html', whoWeStandalone, 'utf8');
console.log('Saved page/Abm-Fm-Who-We.html! Size:', whoWeStandalone.length);

// ==========================================
// 3. PROCESS PERSPECTIVES
// ==========================================
console.log('\nBuilding Perspectives...');
const perspectivesDump = fs.readFileSync('scratch/clean-perspectives.html', 'utf8');
const { style: perspectivesStyle, main: perspectivesMain } = extractStyleAndMain(perspectivesDump);

// Update CTA buttons to active links
const perspectivesMainClean = perspectivesMain
  .replace(/<button class="([^"]*bg-\[#C6FF00\][^"]*)">Book a Consultation<\/button>/g, '<a href="contact-us.html" class="$1 inline-flex items-center justify-center">Book a Consultation</a>')
  .replace(/<a href="#contact" class="([^"]*bg-\[#FF7A00\][^"]*)">Contact Us([\s\S]*?)<\/a>/g, '<a href="contact-us.html" class="$1">Contact Us$2</a>')
  .replace(/<a href="#verticals" class="([^"]*bg-white\/10[^"]*)">Explore Verticals<\/a>/g, '<a href="commercial-hospitality.html" class="$1">Explore Verticals</a>');

// 3a. perspectives.html
const perspectivesHtml = createOfficialSitePage({
  title: 'Perspectives',
  canonical: 'perspectives.html',
  description: 'ABM FM Perspectives: Creating Better Places to Work, Live and Thrive through Beyond Maintenance, People First, and Smarter Facilities.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Perspectives</span>`,
  bannerTitle: 'Perspectives',
  bannerSubtitle: 'Creating Better Places to Work, Live and Thrive.',
  scopedStyle: perspectivesStyle,
  mainContent: perspectivesMainClean
});
fs.writeFileSync('perspectives.html', perspectivesHtml, 'utf8');
console.log('Saved perspectives.html! Size:', perspectivesHtml.length);

// 3b. page/Abm-Fm-Perspectives-Colorful.html (clean standalone)
const perspectivesStandalone = extractFullStandaloneHtml(perspectivesDump);
fs.writeFileSync('page/Abm-Fm-Perspectives-Colorful.html', perspectivesStandalone, 'utf8');
console.log('Saved page/Abm-Fm-Perspectives-Colorful.html! Size:', perspectivesStandalone.length);

// ==========================================
// 4. PROCESS COMPANY
// ==========================================
console.log('\nBuilding Company...');
const companyDump = fs.readFileSync('scratch/clean-company.html', 'utf8');
const { style: companyStyle, main: companyMain } = extractStyleAndMain(companyDump);

// Update CTA buttons to active links
const companyMainClean = companyMain
  .replace(/<button class="([^"]*bg-\[#C6FF00\][^"]*)">Contact Us<\/button>/g, '<a href="contact-us.html" class="$1 inline-flex items-center justify-center">Contact Us</a>')
  .replace(/<button class="([^"]*border border-white\/20[^"]*)">News &amp; Events<\/button>/g, '<a href="perspectives.html" class="$1 inline-flex items-center justify-center">News &amp; Events</a>');

// 4a. company.html
const companyHtml = createOfficialSitePage({
  title: 'Company',
  canonical: 'company.html',
  description: 'Discover ABM FM: One Partner. Multiple Capabilities. Global Reach. Complete Facility & Asset Lifecycle Management.',
  breadcrumbs: `<a href="index.html">Home</a>
          <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
          <span>Company</span>`,
  bannerTitle: 'Company Overview',
  bannerSubtitle: 'One Partner. Multiple Capabilities. Global Reach.',
  scopedStyle: companyStyle,
  mainContent: companyMainClean
});
fs.writeFileSync('company.html', companyHtml, 'utf8');
console.log('Saved company.html! Size:', companyHtml.length);

// 4b. page/Abm-Fm-Company-Colorful.html (clean standalone)
const companyStandalone = extractFullStandaloneHtml(companyDump);
fs.writeFileSync('page/Abm-Fm-Company-Colorful.html', companyStandalone, 'utf8');
console.log('Saved page/Abm-Fm-Company-Colorful.html! Size:', companyStandalone.length);

console.log('\nAll 6 pages generated successfully as clean, normal plain HTML with zero design compromise!');
