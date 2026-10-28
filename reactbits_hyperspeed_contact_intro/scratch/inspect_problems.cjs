const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/components/ContactStudio.jsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

console.log('Total lines:', lines.length);

// 1. Check for class= instead of className=
const classMatches = [];
lines.forEach((l, i) => {
  if (/\bclass=/.test(l) && !l.includes('className')) {
    classMatches.push({ line: i + 1, text: l.trim() });
  }
});
console.log('class= occurrences:', classMatches.length);

// 2. Check for for= instead of htmlFor=
const forMatches = [];
lines.forEach((l, i) => {
  if (/<[a-z0-9]+\s+[^>]*\bfor=/i.test(l)) {
    forMatches.push({ line: i + 1, text: l.trim() });
  }
});
console.log('for= occurrences:', forMatches.length);

// 3. Check for stroke-width or other kebab-case SVG attributes in JSX
const svgKebabMatches = [];
const kebabAttrs = ['stroke-width', 'stroke-linecap', 'stroke-linejoin', 'fill-rule', 'clip-rule', 'clip-path', 'stop-color', 'stop-opacity'];
lines.forEach((l, i) => {
  for (const attr of kebabAttrs) {
    if (l.includes(attr + '=')) {
      svgKebabMatches.push({ line: i + 1, attr, text: l.trim() });
    }
  }
});
console.log('Kebab SVG attrs count:', svgKebabMatches.length);
if (svgKebabMatches.length > 0) {
  console.log('Sample kebab attrs:', svgKebabMatches.slice(0, 5));
}

// 4. Check for unescaped HTML entities in JSX text
// In JSX, raw quotes ", ' or unescaped &
const unescapedEntities = [];
let inJSX = false;
lines.forEach((l, i) => {
  // basic heuristic
  if (l.includes('<p') || l.includes('<span') || l.includes('<div') || l.includes('<h') || l.includes('<li') || l.includes('<button') || l.includes('<blockquote')) {
    if (/[a-zA-Z]['"][a-zA-Z]/.test(l)) {
      unescapedEntities.push({ line: i + 1, text: l.trim() });
    }
  }
});
console.log('Potential unescaped apostrophes count:', unescapedEntities.length);

// 5. Check style attributes as strings
const styleStringMatches = [];
lines.forEach((l, i) => {
  if (/style\s*=\s*["'][^\{]/.test(l)) {
    styleStringMatches.push({ line: i + 1, text: l.trim() });
  }
});
console.log('style as string count:', styleStringMatches.length);

// 6. Check for duplicate IDs
const idRegex = /\bid=["']([^"']+)["']/g;
const ids = new Map();
let m;
while ((m = idRegex.exec(content)) !== null) {
  const count = ids.get(m[1]) || 0;
  ids.set(m[1], count + 1);
}
const duplicateIds = Array.from(ids.entries()).filter(([k, v]) => v > 1);
console.log('Duplicate IDs count:', duplicateIds.length, duplicateIds);

