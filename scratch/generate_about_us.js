const fs = require('fs');

let content = fs.readFileSync('scratch/user_pasted_artifact.html', 'utf8');

// Strip any <USER_REQUEST> tags
if (content.startsWith('<USER_REQUEST>')) {
  content = content.replace('<USER_REQUEST>', '').trimStart();
}

const tIdx = content.indexOf('<truncated');
let validPrefix = content.slice(0, tIdx).trimEnd();

if (validPrefix.endsWith('text-[#C')) {
  validPrefix = validPrefix.slice(0, -9);
}

// Replace title and add favicon/meta
validPrefix = validPrefix.replace(
  '<title>React Artifact</title>',
  `<title>Who We Are | ABM FM — Building Maintenance & Facility Services</title>
  <link rel="icon" href="favicon.png" type="image/png">
  <link rel="apple-touch-icon" href="favicon.png">
  <meta name="description" content="Discover ABM FM - Who We Are, What We Provide, and our expertise in creating safe, efficient, reliable, and future-ready facilities.">`
);

// CTA completion with functional action buttons
const ctaCompletion = ` text-[#C6FF00]",children:"PARTNER WITH US"}),
p("h2",{className:"mt-3 text-[26px] sm:text-[34px] font-black tracking-tight text-white leading-[1.1]",children:"Ready to Elevate Your Facility Operations?"}),
p("p",{className:"mt-2 text-[14px] text-white/80 max-w-[560px]",children:"Connect with ABM FM experts to design a strategic, resilient, and forward-looking facility management framework."})
]}),
S("div",{className:"flex items-center gap-3",children:[
p("a",{href:"contact-us.html",className:"inline-flex items-center justify-center h-[46px] px-7 rounded-full bg-[#C6FF00] text-[#0A1931] text-[13.5px] font-extrabold shadow hover:bg-[#b0e600] transition no-underline",children:"Get in Touch"}),
p("a",{href:"solutions.html",className:"inline-flex items-center justify-center h-[46px] px-6 rounded-full bg-white/10 border border-white/20 text-white text-[13.5px] font-bold hover:bg-white/20 transition no-underline",children:"Explore Services"})
]})
]})
]})
]})
]});
}
Qc.createRoot(document.getElementById("root")).render(p(bu,{}));
</script></body></html>`;

const fullHtml = validPrefix + ctaCompletion;

// Validate script syntax
const m = fullHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
if (!m) {
  console.error('Could not find script block');
  process.exit(1);
}

try {
  new Function(m[1]);
  console.log('Script syntax verified valid.');
  fs.writeFileSync('about-us.html', fullHtml);
  console.log('Successfully wrote to about-us.html!');
} catch (e) {
  console.error('Syntax error when validating script:', e.message);
  process.exit(1);
}
