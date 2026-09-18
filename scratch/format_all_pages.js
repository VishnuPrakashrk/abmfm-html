const fs = require('fs');

function formatHtmlFile(filePath, isSitePage) {
  let html = fs.readFileSync(filePath, 'utf8');
  html = html.replace(/\r\n/g, '\n');

  // If this is a site page, replace inner <main class="relative z-10... with <div class="...
  if (isSitePage) {
    html = html.replace(
      /(<div id="root">\s*)<main(\s+class="[^"]*")/gi,
      '$1<div$2'
    );
    html = html.replace(
      /(<\/footer>\s*)<\/main>(\s*<\/div>\s*<\/section>)/gi,
      '$1</div>$2'
    );
  }

  // Flatten all <svg ...>...</svg> blocks to single line
  html = html.replace(/<svg[\s\S]*?<\/svg>/gi, (svg) => {
    return svg.replace(/\s+/g, ' ').replace(/> </g, '><');
  });

  // Replace text newlines that were for line breaks (like Strategic\nAlignment) with <br>
  html = html.replace(/>([^<]+)</g, (match, text) => {
    if (text.includes('\n') && !text.trim().startsWith('/*') && !text.includes('{')) {
      if (!text.trim()) return match;
      const cleaned = text.split('\n').map(s => s.trim()).filter(Boolean).join('<br>');
      return `>${cleaned}<`;
    }
    return match;
  });

  // Tokenize tags, comments, doctype, scripts, styles, text
  const tokens = [];
  const regex = /(<!--[\s\S]*?-->|<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<svg[\s\S]*?<\/svg>|<\/?[a-zA-Z0-9\-]+(?:\s+[^>]*)?\/?>|[^<]+)/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const tok = m[0];
    if (tok.trim().length > 0) {
      tokens.push(tok);
    }
  }

  const voidTags = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'
  ]);

  let indent = 0;
  const lines = [];

  for (let i = 0; i < tokens.length; i++) {
    const tok = tokens[i];

    if (tok.startsWith('<!--') || tok.startsWith('<!DOCTYPE')) {
      lines.push('  '.repeat(indent) + tok.trim());
      continue;
    }

    if (tok.startsWith('<style') || tok.startsWith('<script')) {
      lines.push('  '.repeat(indent) + tok.trim());
      continue;
    }

    if (tok.startsWith('</')) {
      indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + tok.trim());
      continue;
    }

    if (tok.startsWith('<')) {
      const tagMatch = tok.match(/^<([a-zA-Z0-9\-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = tok.endsWith('/>') || voidTags.has(tagName);

      // Check if this is an SVG (already flattened)
      if (tagName === 'svg') {
        lines.push('  '.repeat(indent) + tok.trim());
        continue;
      }

      // Check for leaf element with short plain text: <tag>text</tag>
      if (!isSelfClosing && i + 2 < tokens.length && tokens[i + 2] === `</${tagName}>` && !tokens[i + 1].startsWith('<')) {
        const textContent = tokens[i + 1].trim();
        if (textContent.length < 120 && !textContent.includes('\n')) {
          lines.push('  '.repeat(indent) + tok.trim() + textContent + `</${tagName}>`);
          i += 2;
          continue;
        }
      }

      lines.push('  '.repeat(indent) + tok.trim());
      if (!isSelfClosing) {
        indent++;
      }
      continue;
    }

    // Text content
    const trimmed = tok.trim();
    if (trimmed.length > 0) {
      lines.push('  '.repeat(indent) + trimmed);
    }
  }

  const result = lines.join('\n') + '\n';
  fs.writeFileSync(filePath, result, 'utf8');
  console.log(`Formatted ${filePath}: ${lines.length} lines`);
}

// Format the site pages
formatHtmlFile('perspectives.html', true);
formatHtmlFile('about-us.html', true);
formatHtmlFile('company.html', true);

// Format the standalone pages
formatHtmlFile('page/Abm-Fm-Perspectives-Colorful.html', false);
formatHtmlFile('page/Abm-Fm-Who-We.html', false);
formatHtmlFile('page/Abm-Fm-Company-Colorful.html', false);
