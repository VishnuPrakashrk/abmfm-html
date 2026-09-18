const fs = require('fs');

function checkFile(file) {
  console.log('=== Checking: ' + file + ' ===');
  const content = fs.readFileSync(file, 'utf8');
  
  const tagRegex = /<\/?([a-zA-Z0-9\-]+)(\s+[^>]*)?\/?>/g;
  let match;
  const stack = [];
  const voidTags = new Set([
    'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr',
    // SVG self closing or void-like
    'path','circle','rect','line','polygon','polyline','ellipse','use','stop'
  ]);
  
  let line = 1;
  let lastPos = 0;
  let errors = 0;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1].toLowerCase();
    const isClosing = fullTag.startsWith('</');
    const isSelfClosing = fullTag.endsWith('/>') || voidTags.has(tagName);
    
    // update line count
    const textBetween = content.substring(lastPos, match.index);
    const lineBreaks = (textBetween.match(/\n/g) || []).length;
    line += lineBreaks;
    lastPos = match.index;
    
    if (isSelfClosing) continue;
    
    if (!isClosing) {
      stack.push({ tag: tagName, line, snippet: fullTag.substring(0, 50).replace(/\n/g, ' ') });
    } else {
      if (stack.length === 0) {
        console.log(`ERROR: Unexpected closing tag </${tagName}> at line ${line}`);
        errors++;
      } else {
        const top = stack[stack.length - 1];
        if (top.tag === tagName) {
          stack.pop();
        } else {
          // Search backwards in stack to see if it was an unclosed tag inside
          let foundIdx = -1;
          for (let i = stack.length - 1; i >= 0; i--) {
            if (stack[i].tag === tagName) {
              foundIdx = i;
              break;
            }
          }
          if (foundIdx !== -1) {
            console.log(`ERROR at line ${line}: closing </${tagName}> but unclosed tags inside:`);
            for (let j = stack.length - 1; j > foundIdx; j--) {
              console.log(`   unclosed <${stack[j].tag}> from line ${stack[j].line}: ${stack[j].snippet}`);
              errors++;
            }
            stack.splice(foundIdx);
          } else {
            console.log(`ERROR at line ${line}: closing tag </${tagName}> has NO matching open tag! Top of stack is <${top.tag}> from line ${top.line}`);
            errors++;
          }
        }
      }
    }
  }
  
  if (stack.length > 0) {
    console.log(`ERROR: ${stack.length} tags remained unclosed at end of file:`);
    for (const item of stack) {
      console.log(`   unclosed <${item.tag}> opened at line ${item.line}: ${item.snippet}`);
    }
  }
  
  if (errors === 0 && stack.length === 0) {
    console.log('SUCCESS: All tags perfectly matched!');
  } else {
    console.log(`Total errors: ${errors + stack.length}`);
  }
}

const targetFiles = process.argv.slice(2).length > 0 ? process.argv.slice(2) : [
  'perspectives.html',
  'about-us.html',
  'company.html',
  'page/Abm-Fm-Perspectives-Colorful.html',
  'page/Abm-Fm-Who-We.html',
  'page/Abm-Fm-Company-Colorful.html'
];

targetFiles.forEach(checkFile);

