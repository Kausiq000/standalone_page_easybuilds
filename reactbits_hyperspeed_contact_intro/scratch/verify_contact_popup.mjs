import http from 'http';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '..', 'dist');

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.glb': 'model/gltf-binary',
};

// 1. Static file server with SPA fallback
const server = http.createServer((req, res) => {
  const urlPath = req.url.split('?')[0];
  let filePath = path.join(distDir, urlPath);

  if (urlPath === '/' || urlPath === '/contact') {
    filePath = path.join(distDir, 'index.html');
  } else if (!fs.existsSync(filePath)) {
    filePath = path.join(distDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
});

await new Promise((resolve) => server.listen(4173, '127.0.0.1', resolve));
console.log('Static server listening on http://127.0.0.1:4173');

// 2. Launch Chrome headless with remote debugging
const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const userDataDir = path.join(__dirname, 'chrome_test_profile');
fs.mkdirSync(userDataDir, { recursive: true });

const chrome = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  `--user-data-dir=${userDataDir}`,
  '--no-first-run',
  '--no-default-browser-check',
  '--disable-gpu-sandbox',
  '--enable-unsafe-webgpu',
  'http://127.0.0.1:4173/contact',
]);

// Wait for Chrome remote debugging endpoint
let versionData = null;
for (let i = 0; i < 30; i++) {
  try {
    const res = await fetch('http://127.0.0.1:9222/json/version');
    if (res.ok) {
      versionData = await res.json();
      break;
    }
  } catch (e) {
    await new Promise((r) => setTimeout(r, 200));
  }
}

if (!versionData) {
  console.error('Failed to connect to Chrome debugging endpoint');
  chrome.kill();
  server.close();
  process.exit(1);
}

console.log('Connected to Chrome:', versionData.Browser);

// Get pages
const listRes = await fetch('http://127.0.0.1:9222/json/list');
const pages = await listRes.json();
const page = pages.find((p) => p.type === 'page');

if (!page) {
  console.error('No page found');
  chrome.kill();
  server.close();
  process.exit(1);
}

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 1;
const pending = new Map();

ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    if (msg.error) reject(msg.error);
    else resolve(msg.result);
  }
};

await new Promise((resolve) => ws.onopen = resolve);

function send(method, params = {}) {
  const msgId = id++;
  return new Promise((resolve, reject) => {
    pending.set(msgId, { resolve, reject });
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}

async function evalInPage(expression) {
  const res = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error(JSON.stringify(res.exceptionDetails));
  }
  return res.result.value;
}

// Enable Page and Runtime
await send('Page.enable');
await send('Runtime.enable');

console.log('Waiting for page to initialize and render...');
// Wait for React to mount and canvas/elements to appear
let ready = false;
for (let i = 0; i < 50; i++) {
  ready = await evalInPage(`
    !!(document.querySelector('main') && (document.querySelector('#webgl-canvas') || document.querySelector('canvas')))
  `);
  if (ready) break;
  await new Promise((r) => setTimeout(r, 200));
}

console.log('Page ready:', ready);

// Wait a bit for studioEngine or trigger contact popup
await new Promise((r) => setTimeout(r, 1000));

// Check if popup is open, or trigger it by opening modal
const modalStateBefore = await evalInPage(`
  !!document.getElementById('contact-card')
`);
console.log('Modal open initially:', modalStateBefore);

if (!modalStateBefore) {
  // Let's trigger opening the modal if not open:
  // In ContactStudio, clicking monitors or calling window openModal, or clicking #btn-close-contact-modal
  // Let's check what interactive triggers exist in DOM:
  console.log('Attempting to trigger Contact Information popup...');
  await evalInPage(`
    // Look for monitor trigger or dispatch click on canvas / buttons
    const canvas = document.getElementById('webgl-canvas');
    if (canvas) {
      // Simulate click at center where desk / monitors are
      const rect = canvas.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height * 0.58;
      canvas.dispatchEvent(new MouseEvent('pointerdown', { clientX: x, clientY: y, bubbles: true }));
      canvas.dispatchEvent(new MouseEvent('pointerup', { clientX: x, clientY: y, bubbles: true }));
      canvas.dispatchEvent(new MouseEvent('click', { clientX: x, clientY: y, bubbles: true }));
    }
  `);
  await new Promise((r) => setTimeout(r, 800));
}

// If not yet open, we can also check if React component can be opened or check DOM elements
let modalOpen = await evalInPage(`!!document.getElementById('contact-card')`);
console.log('Modal open after click:', modalOpen);

if (!modalOpen) {
  // Try triggering through window or React fiber if necessary
  await evalInPage(`
    // Find React fiber to set isModalOpen(true)
    const root = document.getElementById('root');
    function findFiber(dom) {
      for (const key in dom) {
        if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
          return dom[key];
        }
      }
      return null;
    }
    let fiber = findFiber(root.firstChild || root);
    let curr = fiber;
    while (curr) {
      if (curr.memoizedProps && curr.memoizedProps.openModal) {
        curr.memoizedProps.openModal();
        break;
      }
      if (curr.child) curr = curr.child;
      else break;
    }
  `);
  await new Promise((r) => setTimeout(r, 500));
  modalOpen = await evalInPage(`!!document.getElementById('contact-card')`);
  console.log('Modal open after fiber lookup:', modalOpen);
}

// Let's inspect the entire popup content
const popupInfo = await evalInPage(`
  (() => {
    const card = document.getElementById('contact-card');
    if (!card) return { found: false };

    // Get all links in the card
    const links = Array.from(card.querySelectorAll('a')).map(a => ({
      id: a.id,
      text: a.innerText.trim(),
      href: a.href,
      className: a.className
    }));

    // Check table rows
    const rows = Array.from(card.querySelectorAll('tbody tr')).map(tr => ({
      channel: tr.querySelector('.channel-pill')?.innerText.trim(),
      infoText: tr.querySelector('.td-info')?.innerText.trim(),
      infoHref: tr.querySelector('.td-info a')?.href,
      infoId: tr.querySelector('.td-info a')?.id
    }));

    // Check for any presence of wrong details in entire card
    const fullText = card.innerText;
    const hasOldSupportEmail = fullText.includes('support@easybuilds.com');
    const hasOldHelloEmail = fullText.includes('hello@easybuilds.com');
    const hasOldPhone = fullText.includes('+1 (800) 123-4567') || fullText.includes('123-4567');
    const hasNewEmail = fullText.includes('ranesh@easybuilds.shop');
    const hasNewPhone = fullText.includes('8072760943');

    // Buttons
    const privacyBtn = !!document.getElementById('btn-privacy-policy');
    const faqBtn = !!document.getElementById('eb-chat-toggle');

    return {
      found: true,
      links,
      rows,
      hasOldSupportEmail,
      hasOldHelloEmail,
      hasOldPhone,
      hasNewEmail,
      hasNewPhone,
      privacyBtn,
      faqBtn,
      welcomeTitle: card.querySelector('.contact-welcome-title')?.innerText.trim(),
      quote: card.querySelector('.contact-quote')?.innerText.trim()
    };
  })()
`);

console.log('Popup Info:', JSON.stringify(popupInfo, null, 2));

// Test Privacy Policy button click
console.log('Clicking Privacy Policy button...');
const privacyClicked = await evalInPage(`
  (() => {
    const btn = document.getElementById('btn-privacy-policy');
    if (!btn) return false;
    btn.click();
    return true;
  })()
`);
await new Promise((r) => setTimeout(r, 500));

const privacyView = await evalInPage(`
  (() => {
    const view = document.querySelector('.privacy-view');
    if (!view) return { found: false };
    return {
      found: true,
      title: view.querySelector('.privacy-title')?.innerText.trim(),
      emailLink: view.querySelector('.privacy-contact-box a[href^="mailto:"]')?.href,
      emailText: view.querySelector('.privacy-contact-box a[href^="mailto:"]')?.innerText.trim(),
      phoneLink: view.querySelector('.privacy-contact-box a[href^="tel:"]')?.href,
      phoneText: view.querySelector('.privacy-contact-box a[href^="tel:"]')?.innerText.trim()
    };
  })()
`);
console.log('Privacy View Info:', JSON.stringify(privacyView, null, 2));

// Return to contact hub
await evalInPage(`
  (() => {
    const returnBtn = document.querySelector('.privacy-view button');
    if (returnBtn) returnBtn.click();
  })()
`);
await new Promise((r) => setTimeout(r, 500));

// Test FAQ button click
console.log('Clicking FAQ button...');
const faqClicked = await evalInPage(`
  (() => {
    const btn = document.getElementById('eb-chat-toggle');
    if (!btn) return false;
    btn.click();
    return true;
  })()
`);
await new Promise((r) => setTimeout(r, 500));

const faqView = await evalInPage(`
  (() => {
    const chat = document.getElementById('eb-chat-window');
    if (!chat) return { found: false };
    return {
      found: true,
      isOpen: !chat.classList.contains('eb-hidden'),
      title: chat.querySelector('.eb-chat-title')?.innerText.trim(),
      options: Array.from(chat.querySelectorAll('.eb-chip-btn')).map(b => b.innerText.trim())
    };
  })()
`);
console.log('FAQ View Info:', JSON.stringify(faqView, null, 2));

// Clean up
ws.close();
chrome.kill();
server.close();
console.log('Verification finished successfully!');

