const fs = require('fs');

function reportLighthouse(filePath, label) {
  if (!fs.existsSync(filePath)) {
    console.log(`${label}: File not found (${filePath})`);
    return;
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const cats = data.categories || {};
  const auds = data.audits || {};

  console.log(`=== ${label} ===`);
  console.log(`Scores:`);
  console.log(`  Performance:    ${Math.round((cats.performance?.score || 0) * 100)}/100`);
  console.log(`  Accessibility:  ${Math.round((cats.accessibility?.score || 0) * 100)}/100`);
  console.log(`  Best Practices: ${Math.round((cats['best-practices']?.score || 0) * 100)}/100`);
  console.log(`  SEO:            ${Math.round((cats.seo?.score || 0) * 100)}/100`);
  console.log(`Core Web Vitals & Metrics:`);
  console.log(`  FCP:        ${auds['first-contentful-paint']?.displayValue || 'N/A'}`);
  console.log(`  LCP:        ${auds['largest-contentful-paint']?.displayValue || 'N/A'}`);
  console.log(`  TBT:        ${auds['total-blocking-time']?.displayValue || 'N/A'}`);
  console.log(`  CLS:        ${auds['cumulative-layout-shift']?.displayValue || 'N/A'}`);
  console.log(`  Speed Index:${auds['speed-index']?.displayValue || 'N/A'}`);
}

const arg = process.argv[2] || 'scratch/lighthouse_contact_baseline.json';
const label = process.argv[3] || 'Desktop Baseline';
reportLighthouse(arg, label);
