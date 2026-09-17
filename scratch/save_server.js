const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const filePath = path.join(__dirname, `${data.name}-rendered.html`);
        fs.writeFileSync(filePath, data.html, 'utf8');
        console.log(`Saved ${filePath}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok', file: filePath }));
      } catch (err) {
        console.error(err);
        res.writeHead(500);
        res.end(err.message);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(3333, () => {
  console.log('Server running on http://localhost:3333');
});
