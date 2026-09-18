const fs = require('fs');

function formatHtml(html) {
  // Replace inner <main with <div class="deck-main
  // and inner </main> with </div>
  // Specifically within #root
  
  // First, let's normalize \r\n to \n
  html = html.replace(/\r\n/g, '\n');
  
  // Replace literal newlines inside text nodes that were caused by React whitespace-pre-line
  // e.g. "Strategic\nAlignment" -> "Strategic<br>Alignment"
  // Let's do this carefully: inside tag text nodes
  html = html.replace(/>([^<]+)</g, (match, text) => {
    if (text.includes('\n') && !text.trim().startsWith('/*') && !text.includes('{')) {
      // If it's pure whitespace, keep as is
      if (!text.trim()) return match;
      // replace \n with <br> if it's text like "Strategic\nAlignment"
      const cleaned = text.split('\n').map(s => s.trim()).filter(Boolean).join('<br>');
      return `>${cleaned}<`;
    }
    return match;
  });

  // Tokenize tags, comments, doctype, text
  const tokens = [];
  const regex = /(<!--[\s\S]*?-->|<style[\s\S]*?<\/style>|<script[\s\S]*?<\/script>|<\/?[a-zA-Z0-9\-]+(?:\s+[^>]*)?\/?>|[^<]+)/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    const tok = m[0];
    if (tok.trim().length > 0) {
      tokens.push(tok);
    }
  }

  const voidTags = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr',
    'path','circle','rect','line','polygon','polyline','ellipse','use','stop'
  ]);
  
  // Tags that should stay inline with their content if content is short
  const inlineTags = new Set(['span', 'strong', 'b', 'em', 'i', 'small', 'br']);

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
      // Closing tag
      const tagMatch = tok.match(/^<\/([a-zA-Z0-9\-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      indent = Math.max(0, indent - 1);
      lines.push('  '.repeat(indent) + tok.trim());
      continue;
    }
    
    if (tok.startsWith('<')) {
      // Opening or self-closing tag
      const tagMatch = tok.match(/^<([a-zA-Z0-9\-]+)/);
      const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
      const isSelfClosing = tok.endsWith('/>') || voidTags.has(tagName);
      
      // Check if this is a leaf element with only simple text or short content
      // e.g. <span ...>Text</span> or <h1 ...>Text</h1> or <p ...>Text</p>
      if (!isSelfClosing && i + 2 < tokens.length && tokens[i + 2] === `</${tagName}>` && !tokens[i + 1].startsWith('<')) {
        const textContent = tokens[i + 1].trim();
        if (textContent.length < 120 && !textContent.includes('\n')) {
          lines.push('  '.repeat(indent) + tok.trim() + textContent + `</${tagName}>`);
          i += 2; // skip text and closing tag
          continue;
        }
      }
      
      // Check if this is an SVG tag with small contents (like Lucide icons)
      if (tagName === 'svg') {
        // Collect entire SVG if possible
        let svgEnd = -1;
        let svgContent = tok;
        for (let j = i + 1; j < tokens.length; j++) {
          svgContent += tokens[j];
          if (tokens[j] === '</svg>') {
            svgEnd = j;
            break;
          }
        }
        if (svgEnd !== -1 && svgContent.length < 500) {
          // Flatten small SVG onto one line
          const flatSvg = svgContent.replace(/\s+/g, ' ');
          lines.push('  '.repeat(indent) + flatSvg);
          i = svgEnd;
          continue;
        }
      }

      lines.push('  '.repeat(indent) + tok.trim());
      
      if (!isSelfClosing) {
        indent++;
      }
      continue;
    }
    
    // Pure text
    const trimmed = tok.trim();
    if (trimmed.length > 0) {
      lines.push('  '.repeat(indent) + trimmed);
    }
  }
  
  return lines.join('\n');
}

// Test on perspectives.html
const orig = fs.readFileSync('perspectives.html', 'utf8');
const formatted = formatHtml(orig);
fs.writeFileSync('scratch/perspectives_formatted.html', formatted);
console.log('Formatted perspectives.html lines:', formatted.split('\n').length);
