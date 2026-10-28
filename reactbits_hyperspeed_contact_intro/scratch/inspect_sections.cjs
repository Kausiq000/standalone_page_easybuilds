const fs = require('fs');
const content = fs.readFileSync('contactpage.html', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('// ===')) {
    console.log(idx + 1, l.trim());
  }
});
