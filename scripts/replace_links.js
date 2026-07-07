const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');
let changedCount = 0;

const replacements = [
  { from: /\/investments/g, to: '/proprietati' },
  { from: /\/oportunitati/g, to: '/proprietati' },
  { from: /\/resources/g, to: '/research' },
  { from: /\/osint/g, to: '/research' },
  { from: /\/apps/g, to: '/convenience' },
  { from: /\/calculators/g, to: '/convenience' },
  { from: /\/network/g, to: '/private-wealth' },
  { from: /(?<!private-)\/wealth/g, to: '/private-wealth' },
  { from: /\/off-market/g, to: '/private-wealth' },
  { from: /\/travel/g, to: '/concierge' }
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
    changedCount++;
  }
});

console.log(`Finished. Updated ${changedCount} files.`);
