const fs = require('fs');

let content = fs.readFileSync('scratch/user_pasted_artifact.html', 'utf8');
const tIdx = content.indexOf('<truncated');
let validPrefix = content.slice(0, tIdx).trimEnd();

if (validPrefix.endsWith('text-[#C')) {
  validPrefix = validPrefix.slice(0, -9);
}

const ctaCompletion = ` text-[#C6FF00]",children:"PARTNER WITH US"}),
p("h2",{className:"mt-3 text-[26px] sm:text-[34px] font-black tracking-tight text-white leading-[1.1]",children:"Ready to Elevate Your Facility Operations?"}),
p("p",{className:"mt-2 text-[14px] text-white/80 max-w-[560px]",children:"Connect with ABM FM experts to design a strategic, resilient, and forward-looking facility management framework."})
]}),
S("div",{className:"flex items-center gap-3",children:[
p("button",{className:"h-[46px] px-7 rounded-full bg-[#C6FF00] text-[#0A1931] text-[13.5px] font-extrabold shadow hover:bg-[#b0e600] transition",children:"Get in Touch"}),
p("button",{className:"h-[46px] px-6 rounded-full bg-white/10 border border-white/20 text-white text-[13.5px] font-bold hover:bg-white/20 transition",children:"Explore Services"})
]})
]})
]})
]})
]});
}
Qc.createRoot(document.getElementById("root")).render(p(bu,{}));
</script></body></html>`;

const fullHtml = validPrefix + ctaCompletion;

const m = fullHtml.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
if (m) {
  try {
    new Function(m[1]);
    console.log('SUCCESS! Full script syntax is VALID!');
    fs.writeFileSync('scratch/preview_artifact.html', fullHtml);
  } catch (err) {
    console.error('Syntax error:', err.message);
  }
}
