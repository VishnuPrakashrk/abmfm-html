const fs = require('fs');
const html = fs.readFileSync('scratch/clean-who-we.html', 'utf8');

// Find all matches where non-ascii or replacement characters occur
const regex = /.{0,30}[^\x00-\x7F].{0,30}/g;
let m;
while ((m = regex.exec(html)) !== null) {
  if (m[0].includes('\uFFFD') || m[0].includes('')) {
    console.log('Surrogate match:', m[0]);
  }
}
