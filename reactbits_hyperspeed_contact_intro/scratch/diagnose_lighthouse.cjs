const fs = require('fs');

const data = JSON.parse(fs.readFileSync('scratch/lighthouse_contact_baseline.json', 'utf8'));
const auds = data.audits || {};

console.log('--- LCP Element ---');
console.log(auds['largest-contentful-paint-element']?.displayValue);
if (auds['largest-contentful-paint-element']?.details?.items) {
  console.log(JSON.stringify(auds['largest-contentful-paint-element'].details.items, null, 2));
}

console.log('\n--- Main Thread Work Breakdown ---');
if (auds['mainthread-work-breakdown']?.details?.items) {
  console.log(JSON.stringify(auds['mainthread-work-breakdown'].details.items.slice(0, 8), null, 2));
}

console.log('\n--- JavaScript Bootup Time (Evaluation) ---');
if (auds['bootup-time']?.details?.items) {
  console.log(JSON.stringify(auds['bootup-time'].details.items, null, 2));
}

console.log('\n--- Long Tasks ---');
if (auds['long-tasks']?.details?.items) {
  console.log(JSON.stringify(auds['long-tasks'].details.items.slice(0, 8), null, 2));
}

console.log('\n--- Network Requests ---');
if (auds['network-requests']?.details?.items) {
  const items = auds['network-requests'].details.items.map(it => ({
    url: it.url.split('/').pop(),
    transferSize: it.transferSize,
    resourceType: it.resourceType
  }));
  console.log(JSON.stringify(items, null, 2));
}
