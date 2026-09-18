const fs = require('fs');

let html = fs.readFileSync('scratch/clean-who-we.html', 'utf8');

// The original emojis in Abm-Fm-Who-We.html are:
// Operations: ⚙️
// Maintenance: 🛠️
// Hygiene: ✨
// Security: 🛡️
// Facility Operations: 🏢
// Building Maintenance: 🔧
// Cleaning & Hygiene: 🧹
// Security Coordination: 🔒
// Technical Services: ⚡
// Energy Management: 🌿
// Landscaping: 🌳
// Workplace Support: 💼
// Zero Disruption Goal: 🎯
// Client-Centric Approach: 🤝
// Priority Identification: 🎯
// Challenge Anticipation: 🔭
// Practical Solutions: ✦
// Our Focus: 💡

// Let's replace any broken replacement chars or surrogates with these exact clean unicode characters:
html = html
  // 4 capability cards on slide 2
  .replace(/(<span class="text-\[11px\]">)[^<]*(<\/span><\/div><span class="text-\[11px\] font-bold tracking-\[0\.06em\] text-white uppercase leading-\[1\.1\]">Operations<\/span>)/g, '$1⚙️$2')
  .replace(/(<span class="text-\[11px\]">)[^<]*(<\/span><\/div><span class="text-\[11px\] font-bold tracking-\[0\.06em\] text-white uppercase leading-\[1\.1\]">Maintenance<\/span>)/g, '$1🛠️$2')
  .replace(/(<span class="text-\[11px\]">)[^<]*(<\/span><\/div><span class="text-\[11px\] font-bold tracking-\[0\.06em\] text-white uppercase leading-\[1\.1\]">Hygiene<\/span>)/g, '$1✨$2')
  .replace(/(<span class="text-\[11px\]">)[^<]*(<\/span><\/div><span class="text-\[11px\] font-bold tracking-\[0\.06em\] text-white uppercase leading-\[1\.1\]">Security<\/span>)/g, '$1🛡️$2')

  // 8 service cards
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Facility Operations<\/div>)/g, '$1🏢$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Building Maintenance<\/div>)/g, '$1🔧$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Cleaning &amp; Hygiene<\/div>)/g, '$1🧹$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Security Coordination<\/div>)/g, '$1🔒$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Technical Services<\/div>)/g, '$1⚡$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Energy Management<\/div>)/g, '$1🌿$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Landscaping<\/div>)/g, '$1🌳$2')
  .replace(/(<div class="w-9 h-9 rounded-\[12px\] flex items-center justify-center text-\[16px\]"[^>]*>)[^<]*(<\/div><div class="mt-2\.5 text-\[12\.5px\] font-extrabold leading-\[1\.2\] text-\[#0A1931\]">Workplace Support<\/div>)/g, '$1💼$2')

  // Zero Disruption
  .replace(/(<div class="w-7 h-7 rounded-full bg-\[#0A4AB0\] text-white flex items-center justify-center text-\[12px\]">)[^<]*(<\/div>)/g, '$1🎯$2')

  // Slide 3 cards
  .replace(/(<div class="w-8 h-8 rounded-\[10px\] flex items-center justify-center text-\[14px\]"[^>]*>)[^<]*(<\/div><div class="mt-2 text-\[11\.5px\] font-bold leading-\[1\.2\] text-\[#0A1931\]">Client-Centric Approach<\/div>)/g, '$1🤝$2')
  .replace(/(<div class="w-8 h-8 rounded-\[10px\] flex items-center justify-center text-\[14px\]"[^>]*>)[^<]*(<\/div><div class="mt-2 text-\[11\.5px\] font-bold leading-\[1\.2\] text-\[#0A1931\]">Priority Identification<\/div>)/g, '$1🎯$2')
  .replace(/(<div class="w-8 h-8 rounded-\[10px\] flex items-center justify-center text-\[14px\]"[^>]*>)[^<]*(<\/div><div class="mt-2 text-\[11\.5px\] font-bold leading-\[1\.2\] text-\[#0A1931\]">Challenge Anticipation<\/div>)/g, '$1🔭$2')
  .replace(/(<div class="w-8 h-8 rounded-\[10px\] flex items-center justify-center text-\[14px\]"[^>]*>)[^<]*(<\/div><div class="mt-2 text-\[11\.5px\] font-bold leading-\[1\.2\] text-\[#0A1931\]">Practical Solutions<\/div>)/g, '$1✦$2')

  // Slide 3 bulb
  .replace(/(<div class="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-\[#0F5BFF\] shrink-0">)[^<]*(<\/div>)/g, '$1💡$2');

fs.writeFileSync('scratch/who-we-fixed.html', html, 'utf8');
console.log('Fixed who-we icons saved to scratch/who-we-fixed.html!');
