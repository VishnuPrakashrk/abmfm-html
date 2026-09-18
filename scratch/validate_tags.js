const fs = require('fs');

function checkTags(filename) {
  console.log(`\n=================== Checking ${filename} ===================`);
  const content = fs.readFileSync(filename, 'utf8');

  // Simple tag stack checker for div, section, main
  const tagRegex = /<\/?([a-z0-9-]+)(?:\s+[^>]*?)?(\/?)>/gi;
  const stack = [];
  const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

  let match;
  let line = 1;
  let lastIndex = 0;

  while ((match = tagRegex.exec(content)) !== null) {
    const textBefore = content.substring(lastIndex, match.index);
    line += (textBefore.match(/\n/g) || []).length;
    lastIndex = match.index;

    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isSelfClosing = match[2] === '/' || voidTags.has(tagName);
    const isClosing = fullTag.startsWith('</');

    if (['div', 'section', 'main', 'body', 'html'].includes(tagName)) {
      if (isClosing) {
        if (stack.length === 0) {
          console.error(`Line ${line}: Unexpected closing </${tagName}>, stack empty!`);
        } else {
          const top = stack.pop();
          if (top.tagName !== tagName) {
            console.error(`Line ${line}: Mismatched closing </${tagName}>, expected </${top.tagName}> (opened at line ${top.line})`);
          }
        }
      } else if (!isSelfClosing) {
        stack.push({ tagName, line, fullTag: fullTag.slice(0, 50) });
      }
    }
  }

  if (stack.length > 0) {
    console.error(`Unclosed tags at end of file (${stack.length}):`);
    stack.forEach(s => console.error(`  Line ${s.line}: <${s.tagName}>: ${s.fullTag}`));
  } else {
    console.log('All tags are perfectly balanced!');
  }
}

checkTags('perspectives.html');
checkTags('about-us.html');
checkTags('company.html');
