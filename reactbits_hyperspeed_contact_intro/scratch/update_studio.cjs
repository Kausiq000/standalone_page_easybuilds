const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/studioEngine.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Procedural screens replacement
const startScreens = code.indexOf('function createMonitor1ProjectsCanvas() {');
const endScreens = code.indexOf('// Architectural Wall Brand Tagline Canvas');

if (startScreens === -1 || endScreens === -1) {
  console.error('Could not find screen canvas boundaries', { startScreens, endScreens });
  process.exit(1);
}

const newScreensCode = `// Procedural Photorealistic Architectural Villa Visual Generator
    function drawArchitecturalVillaPreview(ctx, x, y, w, h, seed = 1) {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();

      // 1. Dusk Twilight Sky Gradient
      const skyGrad = ctx.createLinearGradient(x, y, x, y + h);
      skyGrad.addColorStop(0, '#0a1424');
      skyGrad.addColorStop(0.42, '#182945');
      skyGrad.addColorStop(0.70, '#363242');
      skyGrad.addColorStop(0.85, '#563e33');
      skyGrad.addColorStop(1, '#664228');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(x, y, w, h);

      // 2. Distant Stars & Gentle Foothills
      ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      for (let s = 0; s < 32; s++) {
        const sx = x + ((s * 73 + seed * 37) % Math.floor(w));
        const sy = y + ((s * 41 + seed * 19) % Math.floor(h * 0.44));
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      ctx.fillStyle = '#070b12';
      ctx.beginPath();
      ctx.moveTo(x, y + h * 0.64);
      ctx.bezierCurveTo(x + w * 0.3, y + h * 0.54, x + w * 0.7, y + h * 0.62, x + w, y + h * 0.58);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      ctx.fill();

      // 3. Modern Architectural Cantilevered Villa
      const vx = x + w * 0.14;
      const vy = y + h * 0.30;
      const vw = w * 0.80;
      const vh = h * 0.46;

      // Dark concrete upper cantilever roof & floor slabs
      ctx.fillStyle = '#1c2026';
      ctx.fillRect(vx - w * 0.05, vy - 14, vw + w * 0.08, 16);
      ctx.fillStyle = '#9c6f44';
      ctx.fillRect(vx - w * 0.05, vy + 2, vw + w * 0.08, 5);

      // Mezzanine floor slab
      ctx.fillStyle = '#1e222a';
      ctx.fillRect(vx, vy + vh * 0.48, vw, 12);
      ctx.fillStyle = '#8c603a';
      ctx.fillRect(vx, vy + vh * 0.48 + 12, vw, 4);

      // Feature timber vertical slat column on left
      ctx.fillStyle = '#2a221a';
      ctx.fillRect(vx, vy, vw * 0.22, vh);
      ctx.strokeStyle = '#3e3226';
      ctx.lineWidth = 1.5;
      for (let sl = vx; sl < vx + vw * 0.22; sl += 8) {
        ctx.beginPath(); ctx.moveTo(sl, vy); ctx.lineTo(sl, vy + vh); ctx.stroke();
      }

      // Upper floor warm glowing glass windows
      const gGrad1 = ctx.createLinearGradient(0, vy, 0, vy + vh * 0.48);
      gGrad1.addColorStop(0, 'rgba(255, 235, 170, 0.96)');
      gGrad1.addColorStop(0.7, 'rgba(255, 185, 90, 0.88)');
      gGrad1.addColorStop(1, 'rgba(215, 130, 50, 0.78)');
      ctx.fillStyle = gGrad1;
      ctx.fillRect(vx + vw * 0.25, vy + 7, vw * 0.72, vh * 0.41);

      // Ground floor warm glowing glass windows
      const gGrad2 = ctx.createLinearGradient(0, vy + vh * 0.52, 0, vy + vh);
      gGrad2.addColorStop(0, 'rgba(255, 240, 180, 0.96)');
      gGrad2.addColorStop(0.65, 'rgba(255, 195, 105, 0.88)');
      gGrad2.addColorStop(1, 'rgba(225, 145, 65, 0.78)');
      ctx.fillStyle = gGrad2;
      ctx.fillRect(vx + vw * 0.25, vy + vh * 0.52, vw * 0.72, vh * 0.45);

      // Black architectural window mullions
      ctx.fillStyle = '#141820';
      for (let m = vx + vw * 0.25; m <= vx + vw * 0.97; m += vw * 0.18) {
        ctx.fillRect(m, vy, 5, vh);
      }

      // Interior warm spotlight fixtures
      ctx.fillStyle = '#ffffff';
      for (let sp = vx + vw * 0.30; sp < vx + vw * 0.95; sp += vw * 0.12) {
        ctx.fillRect(sp, vy + 8, 5, 4);
        ctx.fillRect(sp, vy + vh * 0.54, 5, 4);
      }

      // 4. Ground Terrace & Warm Wooden Deck
      const deckY = vy + vh;
      ctx.fillStyle = '#423226';
      ctx.fillRect(x + w * 0.04, deckY, w * 0.94, 18);
      ctx.fillStyle = '#1a1d24';
      ctx.fillRect(x, deckY + 18, w, h - (deckY + 18 - y));

      // 5. Infinity Edge Swimming Pool with Amber Water Reflections
      const poolY = deckY + 26;
      const poolH = h - (poolY - y);
      const poolGrad = ctx.createLinearGradient(0, poolY, 0, y + h);
      poolGrad.addColorStop(0, '#0c223a');
      poolGrad.addColorStop(0.5, '#122c4a');
      poolGrad.addColorStop(1, '#081422');
      ctx.fillStyle = poolGrad;
      ctx.fillRect(x + w * 0.06, poolY, w * 0.88, poolH);

      // Glowing reflection ribbons on pool water
      ctx.fillStyle = 'rgba(255, 190, 90, 0.38)';
      ctx.fillRect(vx + vw * 0.25, poolY + 5, vw * 0.70, 9);
      ctx.fillStyle = 'rgba(255, 205, 110, 0.28)';
      ctx.fillRect(vx + vw * 0.30, poolY + 18, vw * 0.60, 7);
      ctx.fillStyle = 'rgba(255, 215, 130, 0.20)';
      ctx.fillRect(vx + vw * 0.35, poolY + 32, vw * 0.50, 6);

      // 6. Warm Amber Bloom
      const glowGrad = ctx.createRadialGradient(vx + vw * 0.6, vy + vh * 0.5, 30, vx + vw * 0.6, vy + vh * 0.5, vw * 0.75);
      glowGrad.addColorStop(0, 'rgba(255, 205, 115, 0.24)');
      glowGrad.addColorStop(0.6, 'rgba(255, 175, 75, 0.08)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(x, y, w, h);

      ctx.restore();
    }

    // Desktop Monitor 1 (Left): Project Dashboard (EasyBuilds 3D Studio) - 2048 x 1024
    function createMonitor1ProjectsCanvas() {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 1024;
      const ctx = c.getContext('2d');

      // Compensate for glTF 1PIC-0 screen mesh UV orientation
      ctx.save();
      ctx.translate(0, 1024);
      ctx.scale(1, -1);

      // Deep dark luxury dashboard background
      ctx.fillStyle = '#080a10';
      ctx.fillRect(0, 0, 2048, 1024);

      // Left Sidebar Navigation (w = 320)
      ctx.fillStyle = '#0e121a';
      ctx.fillRect(0, 0, 320, 1024);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(320, 0); ctx.lineTo(320, 1024); ctx.stroke();

      // Brand Logo in sidebar
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.arc(52, 54, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px "Space Grotesk", sans-serif';
      ctx.fillText('EasyBuilds', 82, 62);

      // Navigation Items
      const navItems = [
        { label: 'Overview', active: true },
        { label: 'Projects', active: false },
        { label: 'Clients', active: false },
        { label: 'Analytics', active: false },
        { label: 'Settings', active: false }
      ];

      navItems.forEach((item, idx) => {
        const ny = 140 + idx * 64;
        if (item.active) {
          ctx.fillStyle = 'rgba(218, 180, 124, 0.14)';
          ctx.fillRect(16, ny, 288, 48);
          ctx.fillStyle = '#dab47c';
          ctx.fillRect(16, ny, 4, 48);
          ctx.font = '700 20px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#f5f7fa';
        } else {
          ctx.font = '500 19px "Space Grotesk", sans-serif';
          ctx.fillStyle = '#8f9ba8';
        }
        ctx.fillText(item.label, 52, ny + 31);
      });

      // Main Area Header
      ctx.font = '800 38px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Project Dashboard', 360, 68);

      ctx.font = '500 20px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#8f9ba8';
      ctx.fillText('EasyBuilds 3D Studio', 360, 104);

      // Top-right status pill
      ctx.fillStyle = 'rgba(94, 201, 155, 0.12)';
      ctx.fillRect(1740, 44, 240, 44);
      ctx.strokeStyle = '#5ec99b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(1740, 44, 240, 44);
      ctx.fillStyle = '#5ec99b';
      ctx.font = '700 15px "JetBrains Mono", monospace';
      ctx.fillText('● SYSTEM ACTIVE', 1780, 72);

      // 3 Top Metric Telemetry Cards (w = 510, h = 165)
      const metricCards = [
        { stat: '12', label: 'Active Projects', sub: '4 in Design • 8 in Development' },
        { stat: '96%', label: 'Client Satisfaction', sub: 'Enterprise CSAT Score' },
        { stat: '24/7', label: 'Support & Uptime', sub: 'Global Infrastructure Monitoring' }
      ];

      metricCards.forEach((mc, i) => {
        const cx = 360 + i * 545;
        const cy = 140;
        const cw = 510;
        const ch = 165;

        ctx.fillStyle = '#101520';
        ctx.fillRect(cx, cy, cw, ch);
        ctx.strokeStyle = 'rgba(218, 180, 124, 0.25)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, cw, ch);

        ctx.font = '800 60px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(mc.stat, cx + 28, cy + 76);

        ctx.font = '700 20px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#dab47c';
        ctx.fillText(mc.label, cx + 28, cy + 114);

        ctx.font = '500 15px "Inter", sans-serif';
        ctx.fillStyle = '#8f9ba8';
        ctx.fillText(mc.sub, cx + 28, cy + 144);
      });

      // Section: Recent Projects
      ctx.font = '800 28px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Recent Projects', 360, 360);

      // 3 Side-by-side Project Cards (w = 510, h = 570)
      const recentProjects = [
        { name: 'Azure Horizon Villa', type: 'Residential 3D Experience', tag: 'DEPLOYED', seed: 1 },
        { name: 'Summit Alpine Retreat', type: 'Spatial Web Architecture', tag: 'LIVE', seed: 2 },
        { name: 'Onyx Pavilion', type: 'Interactive Configurator', tag: 'ACTIVE', seed: 3 }
      ];

      recentProjects.forEach((p, idx) => {
        const px = 360 + idx * 545;
        const py = 390;
        const pw = 510;
        const ph = 580;

        ctx.fillStyle = '#101520';
        ctx.fillRect(px, py, pw, ph);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(px, py, pw, ph);

        // Thumbnail render
        drawArchitecturalVillaPreview(ctx, px + 12, py + 12, pw - 24, 380, p.seed);

        // Card Info
        ctx.font = '700 24px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(p.name, px + 24, py + 436);

        ctx.font = '500 17px "Inter", sans-serif';
        ctx.fillStyle = '#8f9ba8';
        ctx.fillText(p.type, px + 24, py + 472);

        // Status Badge
        ctx.fillStyle = 'rgba(218, 180, 124, 0.16)';
        ctx.fillRect(px + 24, py + 504, 130, 36);
        ctx.fillStyle = '#dab47c';
        ctx.font = '700 14px "JetBrains Mono", monospace';
        ctx.fillText(p.tag, px + 40, py + 528);
      });

      ctx.restore();
      return c;
    }

    // Desktop Monitor 2 (Center): EasyBuilds Website / Portfolio Showcase - 2048 x 1024
    function createMonitor2BrandCanvas(isHovered) {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 1024;
      const ctx = c.getContext('2d');

      // Compensate for glTF 2PIC-0 screen mesh UV orientation
      ctx.save();
      ctx.translate(0, 1024);
      ctx.scale(1, -1);

      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, 2048, 1024);

      // Top Navigation Bar (h = 96)
      ctx.fillStyle = '#0f131c';
      ctx.fillRect(0, 0, 2048, 96);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 96); ctx.lineTo(2048, 96); ctx.stroke();

      // Brand Logo
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.arc(64, 48, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px "Space Grotesk", sans-serif';
      ctx.fillText('EasyBuilds', 98, 57);

      // Center Navigation Links
      const navLinks = ['Home', 'Services', 'Projects', 'About'];
      ctx.font = '600 20px "Space Grotesk", sans-serif';
      navLinks.forEach((link, i) => {
        ctx.fillStyle = (i === 0) ? '#dab47c' : '#c4cddb';
        ctx.fillText(link, 720 + i * 160, 56);
      });

      // Contact Button (Top-Right Golden Pill)
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.roundRect(1820, 24, 160, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#0c1017';
      ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Contact', 1900, 54);
      ctx.textAlign = 'left';

      // Left Column Hero (w = 980)
      ctx.font = '800 66px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Premium Web Experiences', 64, 250);
      ctx.fillText('for Modern Brands.', 64, 330);

      ctx.font = '600 24px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#dab47c';
      ctx.fillText('Web Development  •  3D Interactive  •  UI/UX Design', 64, 410);

      ctx.font = '400 20px "Inter", sans-serif';
      ctx.fillStyle = '#9aa5b6';
      ctx.fillText('We architect immersive, real-time 3D web applications, bespoke design systems,', 64, 475);
      ctx.fillText('and enterprise-grade digital platforms engineered for maximum impact.', 64, 510);

      // Gold CTA Pill Button: "VIEW OUR PROJECTS →"
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.roundRect(64, 570, 300, 64, 32);
      ctx.fill();
      ctx.fillStyle = '#0a0d14';
      ctx.font = '800 20px "Space Grotesk", sans-serif';
      ctx.fillText('VIEW OUR PROJECTS →', 96, 610);

      // Three Key Capability Pills
      const caps = ['WebGL2 & Three.js', 'Sub-50ms Edge Latency', '60 FPS Guaranteed'];
      caps.forEach((cap, idx) => {
        const cx = 64 + idx * 280;
        const cy = 700;
        ctx.fillStyle = '#101520';
        ctx.fillRect(cx, cy, 260, 52);
        ctx.strokeStyle = 'rgba(218, 180, 124, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx, cy, 260, 52);
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '600 16px "Space Grotesk", sans-serif';
        ctx.fillText(\`✓  \${cap}\`, cx + 20, cy + 32);
      });

      // Right Column: Realistic Modern Architectural Villa Rendering
      drawArchitecturalVillaPreview(ctx, 1060, 140, 930, 820, 4);
      ctx.strokeStyle = 'rgba(218, 180, 124, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1060, 140, 930, 820);

      ctx.restore();
      return c;
    }

    // Desktop Monitor 3 (Right): EasyBuilds Services & Management - 2048 x 1024
    function createMonitor3ServicesCanvas() {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 1024;
      const ctx = c.getContext('2d');

      // Compensate for glTF 3PIC-0 screen mesh UV orientation
      ctx.save();
      ctx.translate(0, 1024);
      ctx.scale(1, -1);

      ctx.fillStyle = '#07090e';
      ctx.fillRect(0, 0, 2048, 1024);

      // Top Navigation Bar (h = 96)
      ctx.fillStyle = '#0f131c';
      ctx.fillRect(0, 0, 2048, 96);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 96); ctx.lineTo(2048, 96); ctx.stroke();

      // Brand Logo
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.arc(64, 48, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px "Space Grotesk", sans-serif';
      ctx.fillText('EasyBuilds', 98, 57);

      // Center Navigation Links
      const navLinks = ['Home', 'Services', 'Projects', 'About'];
      ctx.font = '600 20px "Space Grotesk", sans-serif';
      navLinks.forEach((link, i) => {
        ctx.fillStyle = (i === 1) ? '#dab47c' : '#c4cddb';
        ctx.fillText(link, 720 + i * 160, 56);
      });

      // Contact Button (Top-Right Golden Pill)
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.roundRect(1820, 24, 160, 48, 24);
      ctx.fill();
      ctx.fillStyle = '#0c1017';
      ctx.font = '700 18px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Contact', 1900, 54);
      ctx.textAlign = 'left';

      // Headline Header
      ctx.font = '800 58px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Our Services', 64, 180);

      ctx.font = '500 22px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#8f9ba8';
      ctx.fillText('Complete digital solutions for modern businesses', 64, 220);

      // 4 Service Feature Cards in 2x2 Grid (w = 930, h = 330 each)
      const serviceCards = [
        {
          title: 'Website Development',
          sub: 'Modern, scalable web applications',
          desc: 'Full-stack engineering utilizing React, Next.js, WebGL2, and custom Three.js pipelines with zero latency and ultra-fast loading.',
          icon: '⟨ / ⟩'
        },
        {
          title: 'UI / UX Design',
          sub: 'User-centered digital experiences',
          desc: 'Bespoke design systems, dark luxury spatial interfaces, interactive wireframes, and ergonomic typography tailored for leading brands.',
          icon: '✦'
        },
        {
          title: 'Hosting & Deployment',
          sub: 'Reliable infrastructure solutions',
          desc: 'Global Edge CDN networks, automated continuous integration, instant SSL deployment, and 99.99% high-availability uptime guarantee.',
          icon: '☁'
        },
        {
          title: 'Website Management',
          sub: 'Ongoing support and optimization',
          desc: 'Proactive 24/7 security telemetry, routine database optimization, performance health audits, and direct engineering consultation.',
          icon: '⚙'
        }
      ];

      serviceCards.forEach((srv, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const sx = 64 + col * 970;
        const sy = 280 + row * 345;
        const sw = 930;
        const sh = 315;

        ctx.fillStyle = '#101522';
        ctx.fillRect(sx, sy, sw, sh);
        ctx.strokeStyle = 'rgba(218, 180, 124, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx, sy, sw, sh);

        // Gold Icon Badge
        ctx.fillStyle = 'rgba(218, 180, 124, 0.16)';
        ctx.fillRect(sx + 32, sy + 32, 64, 64);
        ctx.strokeStyle = '#dab47c';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sx + 32, sy + 32, 64, 64);

        ctx.fillStyle = '#dab47c';
        ctx.font = '800 28px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(srv.icon, sx + 64, sy + 74);
        ctx.textAlign = 'left';

        // Titles
        ctx.font = '800 32px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(srv.title, sx + 120, sy + 62);

        ctx.font = '600 18px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#dab47c';
        ctx.fillText(srv.sub, sx + 120, sy + 94);

        // Body Description
        ctx.font = '400 18px "Inter", sans-serif';
        ctx.fillStyle = '#9aa5b6';
        ctx.fillText(srv.desc.substring(0, 68), sx + 32, sy + 155);
        ctx.fillText(srv.desc.substring(68), sx + 32, sy + 185);

        // Learn More Link
        ctx.font = '700 16px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#dab47c';
        ctx.fillText('LEARN MORE →', sx + 32, sy + 255);
      });

      ctx.restore();
      return c;
    }

    // Laptop Screen Display: EasyBuilds Studio Workspace Preview - 2048 x 1280
    function createLaptopOSCanvas() {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 1280;
      const ctx = c.getContext('2d');

      // Compensate for glTF SCREEN-0.001 screen mesh UV orientation
      ctx.save();
      ctx.translate(0, 1280);
      ctx.scale(1, -1);

      ctx.fillStyle = '#07090f';
      ctx.fillRect(0, 0, 2048, 1280);

      // Window Header Bar
      ctx.fillStyle = '#101520';
      ctx.fillRect(0, 0, 2048, 80);

      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.arc(48, 40, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '800 24px "Space Grotesk", sans-serif';
      ctx.fillText('EasyBuilds Studio', 76, 48);

      // Laptop Hero Content
      ctx.font = '800 70px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('EasyBuilds Studio', 80, 260);

      ctx.font = '600 36px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#dab47c';
      ctx.fillText('Creating Digital Impact', 80, 330);

      ctx.font = '400 22px "Inter", sans-serif';
      ctx.fillStyle = '#9aa5b6';
      ctx.fillText('Bespoke web architectures, 3D interactive spaces, and next-generation design systems', 80, 420);
      ctx.fillText('engineered for modern brands that demand distinction and photorealism.', 80, 460);

      // Gold CTA Pill: "EXPLORE OUR WORK →"
      ctx.fillStyle = '#dab47c';
      ctx.beginPath();
      ctx.roundRect(80, 540, 320, 68, 34);
      ctx.fill();
      ctx.fillStyle = '#0a0d14';
      ctx.font = '800 20px "Space Grotesk", sans-serif';
      ctx.fillText('EXPLORE OUR WORK →', 115, 582);

      // Architectural Modern Villa Preview on right
      drawArchitecturalVillaPreview(ctx, 1080, 160, 900, 1020, 5);
      ctx.strokeStyle = 'rgba(218, 180, 124, 0.4)';
      ctx.lineWidth = 2;
      ctx.strokeRect(1080, 160, 900, 1020);

      ctx.restore();
      return c;
    }

    `;

code = code.substring(0, startScreens) + newScreensCode + code.substring(endScreens);

// 2. Ivory stone canvas, champagne brass canvas, and service boards
const startTagline = code.indexOf('function createBrandTaglineCanvas() {');
const endOak = code.indexOf('function createOakWoodCanvas() {');

if (startTagline === -1 || endOak === -1) {
  console.error('Could not find tagline / oak boundaries', { startTagline, endOak });
  process.exit(1);
}

const newPlaqueAndBoardsCode = `function createBrandTaglineCanvas() {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 256;
      const ctx = c.getContext('2d');
      ctx.clearRect(0, 0, 2048, 256);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 58px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#22262e';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('BUILT WITH PRECISION. DESIGNED FOR IMPACT.', 1024, 128);

      return c;
    }

    function createBasaltFloorCanvas() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#0f1218';
      ctx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 800; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.05)';
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 80 + 20, 2);
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.lineWidth = 4;
      for (let i = 0; i <= 1024; i += 256) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
      }
      return c;
    }

    function createGraphiteWallCanvas() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#161922';
      ctx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 1200; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.025)' : 'rgba(0,0,0,0.04)';
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 100 + 30, 2);
      }
      return c;
    }

    function createDeskWoodCanvas() {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 1024;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#1c1612';
      ctx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 1024; i += 4) {
        const wave = Math.sin(i * 0.035) * 10;
        ctx.fillStyle = (i % 8 === 0) ? 'rgba(38, 28, 22, 0.55)' : 'rgba(12, 8, 6, 0.48)';
        ctx.fillRect(0, i + wave, 1024, 2);
      }
      for (let j = 0; j < 600; j++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(54, 42, 32, 0.35)' : 'rgba(10, 6, 4, 0.35)';
        ctx.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 60 + 15, 1.5);
      }
      return c;
    }

    // 4 Architectural Service Frames with Champagne Brass Bevels & Exact Reference Subtitles
    function createServiceBoardCanvas(title, subtitle) {
      const c = document.createElement('canvas');
      c.width = 1024; c.height = 640;
      const ctx = c.getContext('2d');

      // Textured archival warm-white cotton rag paper backing
      ctx.fillStyle = '#fdfbf7';
      ctx.fillRect(0, 0, 1024, 640);

      // Fine linen grain
      for (let i = 0; i < 600; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.05)';
        ctx.fillRect(Math.random() * 1024, Math.random() * 640, Math.random() * 70 + 10, 2);
      }

      // Champagne Brass & Ivory Double Inner Mat Borders
      ctx.strokeStyle = '#c8b488';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(32, 32, 960, 576);

      ctx.strokeStyle = '#dfd6c0';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(44, 44, 936, 552);

      // Registration Tick Marks
      ctx.strokeStyle = '#9ca6b4';
      ctx.lineWidth = 2;
      const corners = [[32, 32], [992, 32], [32, 608], [992, 608]];
      for (const [cx, cy] of corners) {
        ctx.beginPath();
        ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy);
        ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12);
        ctx.stroke();
      }

      // Title in Bold Architectural Display Typography
      ctx.fillStyle = '#11141a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const words = title.split(' ');
      if (title.includes(' & ')) {
        const parts = title.split(' & ');
        ctx.font = '800 68px "Space Grotesk", sans-serif';
        ctx.fillText(parts[0].trim().toUpperCase() + ' &', 512, 230);
        ctx.fillText(parts[1].trim().toUpperCase(), 512, 320);
      } else if (title.includes('/')) {
        ctx.font = '800 72px "Space Grotesk", sans-serif';
        ctx.fillText('UI / UX', 512, 230);
        ctx.fillText('DESIGN', 512, 320);
      } else if (words.length === 2) {
        ctx.font = '800 68px "Space Grotesk", sans-serif';
        ctx.fillText(words[0].toUpperCase(), 512, 230);
        ctx.fillText(words[1].toUpperCase(), 512, 320);
      } else {
        ctx.font = '800 64px "Space Grotesk", sans-serif';
        ctx.fillText(title.toUpperCase(), 512, 275);
      }

      // Subtitle directly beneath title (Exact Reference Text)
      if (subtitle) {
        ctx.font = '700 20px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#5c6472';
        ctx.letterSpacing = '0.10em';
        ctx.fillText(subtitle.toUpperCase(), 512, 420);
      }

      // Bottom Studio Attribution
      ctx.fillStyle = '#8a95a4';
      ctx.font = '600 15px "JetBrains Mono", monospace';
      ctx.letterSpacing = '0.08em';
      ctx.fillText('EASYBUILDS ARCHITECTURAL PRACTICE', 512, 545);

      return c;
    }

    // Warm Ivory Honed Stone Wall Plaque Canvas
    function createIvoryStoneCanvas() {
      const c = document.createElement('canvas');
      c.width = 2048; c.height = 768;
      const ctx = c.getContext('2d');

      // Natural limestone / travertine gradient
      const grad = ctx.createLinearGradient(0, 0, 2048, 768);
      grad.addColorStop(0, '#f6f3eb');
      grad.addColorStop(0.5, '#eee8dc');
      grad.addColorStop(1, '#e7e0d3');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 768);

      // Fine stone mineral specks
      for (let i = 0; i < 2800; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.45)' : 'rgba(155, 140, 120, 0.16)';
        ctx.fillRect(Math.random() * 2048, Math.random() * 768, Math.random() * 4 + 1, Math.random() * 3 + 1);
      }

      // Subtle travertine natural veins
      for (let i = 0; i < 45; i++) {
        ctx.strokeStyle = 'rgba(175, 160, 138, 0.12)';
        ctx.lineWidth = Math.random() * 2.5 + 1;
        ctx.beginPath();
        let vx = Math.random() * 2048;
        let vy = Math.random() * 768;
        ctx.moveTo(vx, vy);
        for (let s = 0; s < 5; s++) {
          vx += (Math.random() - 0.5) * 140;
          vy += (Math.random() - 0.5) * 60;
          ctx.lineTo(vx, vy);
        }
        ctx.stroke();
      }

      // Inner perimeter bevel line
      ctx.strokeStyle = 'rgba(175, 158, 138, 0.35)';
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, 2000, 720);

      // Thin horizontal divider bar beneath wordmark
      ctx.fillStyle = '#2c2e35';
      ctx.fillRect(274, 520, 1500, 4);

      // Tagline inscription
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 48px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#22252b';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('BUILT WITH PRECISION. DESIGNED FOR IMPACT.', 1024, 585);

      return c;
    }

    // Champagne Brass Brushed Metal Canvas
    function createChampagneBrassCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 512, 512);
      grad.addColorStop(0, '#e8d4a6');
      grad.addColorStop(0.35, '#c8ad76');
      grad.addColorStop(0.70, '#dfc896');
      grad.addColorStop(1, '#ba9e64');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      for (let y = 0; y < 512; y += 2) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(70, 50, 20, 0.10)';
        ctx.fillRect(0, y, 512, 1);
      }
      return c;
    }

    `;

code = code.substring(0, startTagline) + newPlaqueAndBoardsCode + code.substring(endOak);

// 3. Add generate3DLetterMeshes right after createPictureFramePrim
const framePrimEnd = code.indexOf('function createPictureFramePrim(');
const framePrimBodyEnd = code.indexOf('return mergeBoxPrims([', framePrimEnd);
const framePrimReturnEnd = code.indexOf(');', framePrimBodyEnd) + 2;

const letterMeshCode = `

    // Genuine 3D Extruded Dimensional Letters for EASYBUILDS on Plaque
    function generate3DLetterMeshes(cx, cy, cz, totalW, letterH, depth) {
      const letters = [];
      const d = depth;
      const numLetters = 10;
      const spacing = totalW / numLetters;
      const startX = cx - (totalW / 2) + (spacing / 2);
      const stroke = letterH * 0.19;
      const w = spacing * 0.76;
      const h = letterH;

      for (let i = 0; i < numLetters; i++) {
        const char = 'EASYBUILDS'[i];
        const lx = startX + i * spacing;
        const ly = cy;
        const lz = cz;

        switch (char) {
          case 'E':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly, lz, stroke, h, d),
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx - stroke*0.2, ly, lz, w * 0.8, stroke, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d)
            );
            break;
          case 'A':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly - stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx, ly - stroke*0.2, lz, w, stroke * 0.85, d)
            );
            break;
          case 'S':
            letters.push(
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx - w/2 + stroke/2, ly + h/4, lz, stroke, h/2, d),
              createBoxPrim(lx, ly, lz, w, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - h/4, lz, stroke, h/2, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d)
            );
            break;
          case 'Y':
            letters.push(
              createBoxPrim(lx - w/4, ly + h/3.8, lz, stroke, h/2.1, d),
              createBoxPrim(lx + w/4, ly + h/3.8, lz, stroke, h/2.1, d),
              createBoxPrim(lx, ly - h/3.8, lz, stroke, h/2, d),
              createBoxPrim(lx, ly, lz, w * 0.55, stroke, d)
            );
            break;
          case 'B':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly, lz, stroke, h, d),
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx, ly, lz, w, stroke, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly + h/4, lz, stroke, h/2 - stroke/2, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - h/4, lz, stroke, h/2 - stroke/2, d)
            );
            break;
          case 'U':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly + stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly + stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d)
            );
            break;
          case 'I':
            letters.push(
              createBoxPrim(lx, ly, lz, stroke * 1.35, h, d)
            );
            break;
          case 'L':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly, lz, stroke, h, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d)
            );
            break;
          case 'D':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly, lz, stroke, h, d),
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly, lz, stroke, h - stroke * 1.2, d)
            );
            break;
        }
      }
      return mergeBoxPrims(letters);
    }`;

code = code.substring(0, framePrimReturnEnd) + letterMeshCode + code.substring(framePrimReturnEnd);

// 4. Update Light 2 in PBR_FS (Ceiling Spotlights)
const coveLightOld = `      // Light 2: Warm Wall Cove
      vec3 covePos = vec3(v_worldPos.x * 0.5, 2.75, -1.45);
      vec3 L2 = normalize(covePos - v_worldPos);
      vec3 H2 = normalize(V + L2);
      float coveDist = length(covePos - v_worldPos);
      vec3 coveRadiance = vec3(2.45, 1.62, 0.88) * u_introReveal / (1.0 + 0.32 * coveDist * coveDist);`;

const coveLightNew = `      // Light 2: 3 Ceiling Recessed Spotlights (Warm Architectural Downlight Scallops on Wall & Plaque)
      vec3 spotWallRad = vec3(0.0);
      float spotXs[3] = float[3](-0.75, 0.0, 0.75);
      vec3 spotDir = normalize(vec3(0.0, -0.92, -0.38));
      for (int s = 0; s < 3; s++) {
        vec3 sPos = vec3(spotXs[s], 3.25, -1.35);
        vec3 sL = normalize(sPos - v_worldPos);
        float sDist = length(sPos - v_worldPos);
        float sAngle = dot(-sL, spotDir);
        float sCone = smoothstep(0.68, 0.96, sAngle);
        spotWallRad += vec3(3.4, 2.5, 1.4) * sCone / (1.0 + 0.85 * sDist * sDist);
      }
      vec3 covePos = vec3(v_worldPos.x * 0.5, 2.75, -1.45);
      vec3 L2 = normalize(covePos - v_worldPos);
      vec3 H2 = normalize(V + L2);
      vec3 coveRadiance = spotWallRad * u_introReveal + vec3(1.2, 0.82, 0.45) * u_introReveal;`;

code = code.replace(coveLightOld, coveLightNew);

// 5. Update Texture Instantiations
const oldTexInit = `    const boardHostingTex = createTextureFromCanvas(createServiceBoardCanvas('HOSTING & DEPLOYMENT', true), false);
    const boardManagementTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE MANAGEMENT', false), false);
    const boardDesignTex = createTextureFromCanvas(createServiceBoardCanvas('UI / UX DESIGN', false), false);
    const boardDevTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE DEVELOPMENT', false), false);`;

const newTexInit = `    const ivoryStoneTex = createTextureFromCanvas(createIvoryStoneCanvas(), false);
    const champagneBrassTex = createTextureFromCanvas(createChampagneBrassCanvas(), true);

    const boardHostingTex = createTextureFromCanvas(createServiceBoardCanvas('HOSTING & DEPLOYMENT', 'SCALABLE INFRASTRUCTURE. SEAMLESS PERFORMANCE.'), false);
    const boardDesignTex = createTextureFromCanvas(createServiceBoardCanvas('UI / UX DESIGN', 'INTUITIVE EXPERIENCES. MEANINGFUL INTERFACES.'), false);
    const boardManagementTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE MANAGEMENT', 'MONITOR. OPTIMIZE. GROW.'), false);
    const boardDevTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE DEVELOPMENT', 'MODERN SOLUTIONS. REAL RESULTS.'), false);`;

code = code.replace(oldTexInit, newTexInit);

// 6. Update buildArchitecturalRoom: Wall Plaque, 3D extruded lettering, 4 frames, plants, accessories
const roomSectionStart = code.indexOf('// A. PHYSICALLY MOUNTED SINGLE 3D EASYBUILDS WALL WORDMARK & BRAND TAGLINE');
const roomSectionEnd = code.indexOf('// C. ARCHITECTURAL TASK DESK LAMP & PAPERWORK', roomSectionStart);

if (roomSectionStart === -1 || roomSectionEnd === -1) {
  console.error('Could not find room section boundaries', { roomSectionStart, roomSectionEnd });
  process.exit(1);
}

const newRoomGeometry = `// A. PHYSICAL WARM IVORY WALL PLAQUE & DIMENSIONAL 3D EASYBUILDS WORDMARK
      const plaqueWidth = 2.18, plaqueHeight = 0.74, plaqueThickness = 0.038;
      const plaqueZFront = -1.580 + plaqueThickness / 2;
      const plaqueBox = createBoxPrim(0.0, 1.95, -1.580, plaqueWidth, plaqueHeight, plaqueThickness);
      uploadMeshPrimitive(plaqueBox.pos, plaqueBox.nrm, plaqueBox.uv, plaqueBox.idx, identity, {
        name: 'IVORY_WALL_PLAQUE',
        texture: ivoryStoneTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.03,
        roughness: 0.65,
        castShadow: true
      });

      // Four Champagne Brass Standoff Mounting Bolts at Plaque Corners
      const boltRadius = 0.024, boltDepth = 0.020;
      const boltX = plaqueWidth / 2 - 0.10;
      const boltY = plaqueHeight / 2 - 0.09;
      const standoffBolts = [
        createBoxPrim(-boltX, 1.95 + boltY, plaqueZFront + boltDepth/2, boltRadius*2, boltRadius*2, boltDepth),
        createBoxPrim( boltX, 1.95 + boltY, plaqueZFront + boltDepth/2, boltRadius*2, boltRadius*2, boltDepth),
        createBoxPrim(-boltX, 1.95 - boltY, plaqueZFront + boltDepth/2, boltRadius*2, boltRadius*2, boltDepth),
        createBoxPrim( boltX, 1.95 - boltY, plaqueZFront + boltDepth/2, boltRadius*2, boltRadius*2, boltDepth),
        createBoxPrim(-boltX, 1.95 + boltY, plaqueZFront + boltDepth + 0.001, 0.014, 0.014, 0.006),
        createBoxPrim( boltX, 1.95 + boltY, plaqueZFront + boltDepth + 0.001, 0.014, 0.014, 0.006),
        createBoxPrim(-boltX, 1.95 - boltY, plaqueZFront + boltDepth + 0.001, 0.014, 0.014, 0.006),
        createBoxPrim( boltX, 1.95 - boltY, plaqueZFront + boltDepth + 0.001, 0.014, 0.014, 0.006),
      ];
      const mergedBolts = mergeBoxPrims(standoffBolts);
      uploadMeshPrimitive(mergedBolts.pos, mergedBolts.nrm, mergedBolts.uv, mergedBolts.idx, identity, {
        name: 'PLAQUE_STANDOFF_HARDWARE',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.74, 0.48, 1],
        metallic: 0.94,
        roughness: 0.22,
        castShadow: true
      });

      // Genuine 3D Extruded Dimensional EASYBUILDS Letter Meshes
      const letterDepth = 0.022;
      const letterMesh = generate3DLetterMeshes(0.0, 2.03, plaqueZFront + letterDepth/2, 1.62, 0.22, letterDepth);
      uploadMeshPrimitive(letterMesh.pos, letterMesh.nrm, letterMesh.uv, letterMesh.idx, identity, {
        name: 'EASYBUILDS_3D_EXTRUDED_WORDMARK',
        baseColor: [0.18, 0.19, 0.22, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });

      // Horizontal Metallic Divider Bar on Plaque
      const dividerBar = createBoxPrim(0.0, 1.835, plaqueZFront + 0.003, 1.58, 0.003, 0.005);
      uploadMeshPrimitive(dividerBar.pos, dividerBar.nrm, dividerBar.uv, dividerBar.idx, identity, {
        name: 'PLAQUE_DIVIDER_BAR',
        baseColor: [0.22, 0.23, 0.26, 1],
        metallic: 0.85,
        roughness: 0.30,
        castShadow: true
      });

      // Inscribed / Raised Tagline Plate directly on Ivory Plaque
      const taglinePlate = createBoxPrim(0.0, 1.765, plaqueZFront + 0.002, 1.58, 0.075, 0.004);
      uploadMeshPrimitive(taglinePlate.pos, taglinePlate.nrm, taglinePlate.uv, taglinePlate.idx, identity, {
        name: 'EASYBUILDS_WALL_BRAND_TAGLINE',
        texture: brandTaglineTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.45,
        roughness: 0.35,
        castShadow: false
      });

      // =======================================================================
      // B. FOUR ARCHITECTURAL SERVICE FRAMES (CHAMPAGNE BRASS FINISH)
      // =======================================================================
      const frameW = 0.66, frameH = 0.39, borderW = 0.024, frameDepth = 0.026;
      const leftColX = -1.48, rightColX = 1.48;
      const topRowY = 2.05, botRowY = 1.48;
      const frameZ = -1.560;
      const panelZ = -1.550;

      // 1. TOP-LEFT: HOSTING & DEPLOYMENT
      const frame1Molding = createPictureFramePrim(leftColX, topRowY, frameZ, frameW, frameH, borderW, frameDepth);
      uploadMeshPrimitive(frame1Molding.pos, frame1Molding.nrm, frame1Molding.uv, frame1Molding.idx, identity, {
        name: 'FRAME_CHAMPAGNE_HOSTING',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.76, 0.52, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });
      const frame1Panel = createBoxPrim(leftColX, topRowY, panelZ, frameW - borderW * 1.4, frameH - borderW * 1.4, 0.008);
      uploadMeshPrimitive(frame1Panel.pos, frame1Panel.nrm, frame1Panel.uv, frame1Panel.idx, identity, {
        name: 'PANEL_HOSTING_AND_DEPLOYMENT',
        texture: boardHostingTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.65,
        castShadow: false
      });

      // 2. BOTTOM-LEFT: UI / UX DESIGN
      const frame2Molding = createPictureFramePrim(leftColX, botRowY, frameZ, frameW, frameH, borderW, frameDepth);
      uploadMeshPrimitive(frame2Molding.pos, frame2Molding.nrm, frame2Molding.uv, frame2Molding.idx, identity, {
        name: 'FRAME_CHAMPAGNE_DESIGN',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.76, 0.52, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });
      const frame2Panel = createBoxPrim(leftColX, botRowY, panelZ, frameW - borderW * 1.4, frameH - borderW * 1.4, 0.008);
      uploadMeshPrimitive(frame2Panel.pos, frame2Panel.nrm, frame2Panel.uv, frame2Panel.idx, identity, {
        name: 'PANEL_UI_UX_DESIGN',
        texture: boardDesignTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.65,
        castShadow: false
      });

      // 3. TOP-RIGHT: WEBSITE MANAGEMENT
      const frame3Molding = createPictureFramePrim(rightColX, topRowY, frameZ, frameW, frameH, borderW, frameDepth);
      uploadMeshPrimitive(frame3Molding.pos, frame3Molding.nrm, frame3Molding.uv, frame3Molding.idx, identity, {
        name: 'FRAME_CHAMPAGNE_MANAGEMENT',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.76, 0.52, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });
      const frame3Panel = createBoxPrim(rightColX, topRowY, panelZ, frameW - borderW * 1.4, frameH - borderW * 1.4, 0.008);
      uploadMeshPrimitive(frame3Panel.pos, frame3Panel.nrm, frame3Panel.uv, frame3Panel.idx, identity, {
        name: 'PANEL_WEBSITE_MANAGEMENT',
        texture: boardManagementTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.65,
        castShadow: false
      });

      // 4. BOTTOM-RIGHT: WEBSITE DEVELOPMENT
      const frame4Molding = createPictureFramePrim(rightColX, botRowY, frameZ, frameW, frameH, borderW, frameDepth);
      uploadMeshPrimitive(frame4Molding.pos, frame4Molding.nrm, frame4Molding.uv, frame4Molding.idx, identity, {
        name: 'FRAME_CHAMPAGNE_DEVELOPMENT',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.76, 0.52, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });
      const frame4Panel = createBoxPrim(rightColX, botRowY, panelZ, frameW - borderW * 1.4, frameH - borderW * 1.4, 0.008);
      uploadMeshPrimitive(frame4Panel.pos, frame4Panel.nrm, frame4Panel.uv, frame4Panel.idx, identity, {
        name: 'PANEL_WEBSITE_DEVELOPMENT',
        texture: boardDevTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.65,
        castShadow: false
      });

      // Frame Mounting Studs
      const hangingAccessories = [
        createBoxPrim(leftColX,  topRowY + frameH/2 + 0.032, -1.565, 0.024, 0.024, 0.016),
        createBoxPrim(leftColX,  botRowY + frameH/2 + 0.032, -1.565, 0.024, 0.024, 0.016),
        createBoxPrim(rightColX, topRowY + frameH/2 + 0.032, -1.565, 0.024, 0.024, 0.016),
        createBoxPrim(rightColX, botRowY + frameH/2 + 0.032, -1.565, 0.024, 0.024, 0.016),
      ];
      const mergedHangers = mergeBoxPrims(hangingAccessories);
      uploadMeshPrimitive(mergedHangers.pos, mergedHangers.nrm, mergedHangers.uv, mergedHangers.idx, identity, {
        name: 'FRAME_HANGING_HARDWARE',
        texture: champagneBrassTex,
        baseColor: [0.88, 0.76, 0.52, 1],
        metallic: 0.92,
        roughness: 0.22,
        castShadow: true
      });

      // Left Indoor Desk Plant (Fluted Dark Ceramic Pot + Lush Botanical Foliage)
      const potX = -1.24, potY = 0.58, potZ = 0.26;
      const plantPot = createBoxPrim(potX, potY, potZ, 0.26, 0.44, 0.26);
      const plantPotRim = createBoxPrim(potX, potY + 0.22, potZ, 0.28, 0.04, 0.28);
      const plantSoil = createBoxPrim(potX, potY + 0.21, potZ, 0.24, 0.02, 0.24);
      const mergedPot = mergeBoxPrims([plantPot, plantPotRim, plantSoil]);
      uploadMeshPrimitive(mergedPot.pos, mergedPot.nrm, mergedPot.uv, mergedPot.idx, identity, {
        name: 'LEFT_PLANTER_POT',
        baseColor: [0.12, 0.13, 0.15, 1],
        metallic: 0.15,
        roughness: 0.40,
        castShadow: true
      });

      const leaves = [];
      const leafAngles = [0, 45, 90, 135, 180, 225, 270, 315, 25, 70, 115, 160, 205, 250, 295, 340];
      leafAngles.forEach((angDeg, i) => {
        const rad = angDeg * Math.PI / 180;
        const dist = 0.08 + (i % 3) * 0.05;
        const lx = potX + Math.cos(rad) * dist;
        const lz = potZ + Math.sin(rad) * dist;
        const ly = potY + 0.28 + (i * 0.025);
        const lw = 0.14 + (i % 2) * 0.04;
        const lh = 0.008;
        const ld = 0.16 + (i % 3) * 0.04;
        leaves.push(createBoxPrim(lx, ly, lz, lw, lh, ld));
      });
      const mergedLeaves = mergeBoxPrims(leaves);
      uploadMeshPrimitive(mergedLeaves.pos, mergedLeaves.nrm, mergedLeaves.uv, mergedLeaves.idx, identity, {
        name: 'LEFT_PLANT_FOLIAGE',
        baseColor: [0.12, 0.28, 0.15, 1],
        metallic: 0.04,
        roughness: 0.50,
        castShadow: true
      });

      // Top-Right Shelf Trailing Ivy / Pothos Plant
      const shelfPlantPot = createBoxPrim(3.38, 2.92, -0.45, 0.16, 0.12, 0.16);
      const trailingVines = [];
      for (let v = 0; v < 14; v++) {
        const vx = 3.34 + (Math.sin(v * 1.3) * 0.07);
        const vz = -0.42 + (Math.cos(v * 1.7) * 0.08);
        const vy = 2.88 - (v * 0.045);
        trailingVines.push(createBoxPrim(vx, vy, vz, 0.06, 0.035, 0.06));
      }
      const mergedTrailingPlant = mergeBoxPrims([shelfPlantPot, ...trailingVines]);
      uploadMeshPrimitive(mergedTrailingPlant.pos, mergedTrailingPlant.nrm, mergedTrailingPlant.uv, mergedTrailingPlant.idx, identity, {
        name: 'SHELF_TRAILING_PLANT',
        baseColor: [0.15, 0.35, 0.18, 1],
        metallic: 0.04,
        roughness: 0.55,
        castShadow: true
      });

      // Studio Ceramic Mug with EasyBuilds branding
      const mugX = 0.72, mugY = 0.816, mugZ = 0.12;
      const mugBase = createBoxPrim(mugX, mugY + 0.042, mugZ, 0.076, 0.084, 0.076);
      const mugHandle = createBoxPrim(mugX + 0.048, mugY + 0.042, mugZ, 0.024, 0.048, 0.016);
      const mergedMug = mergeBoxPrims([mugBase, mugHandle]);
      uploadMeshPrimitive(mergedMug.pos, mergedMug.nrm, mergedMug.uv, mergedMug.idx, identity, {
        name: 'STUDIO_CERAMIC_MUG',
        baseColor: [0.08, 0.09, 0.10, 1],
        metallic: 0.25,
        roughness: 0.30,
        castShadow: true
      });

      // Sleek remote control on desk
      const remote = createBoxPrim(-0.32, 0.816, 0.24, 0.042, 0.010, 0.14);
      uploadMeshPrimitive(remote.pos, remote.nrm, remote.uv, remote.idx, identity, {
        name: 'DESK_REMOTE_CONTROL',
        baseColor: [0.06, 0.07, 0.09, 1],
        metallic: 0.75,
        roughness: 0.25,
        castShadow: true
      });

      `;

code = code.substring(0, roomSectionStart) + newRoomGeometry + code.substring(roomSectionEnd);

// 7. Update CAMERA_VIEWS overview
const oldOverview = `      overview: {
        pos: [-0.55, 1.34, 1.92],
        target: [0.02, 1.05, -0.05],
        fov: 52
      },`;

const newOverview = `      overview: {
        pos: [-0.38, 1.30, 1.86],
        target: [0.00, 1.05, -0.05],
        fov: 52
      },`;

code = code.replace(oldOverview, newOverview);

// 8. Update setCameraView & click handling
const oldSetCam = `    function setCameraView(mode, openFormIfMonitor = true) {
      if (!hasEntered) return;
      activeView = mode;
      document.querySelectorAll('.cam-tab').forEach((btn) => {
        const isAct = btn.getAttribute('data-cam') === mode;
        btn.style.background = isAct ? 'rgba(218, 180, 124, 0.22)' : 'transparent';
        btn.style.color = isAct ? '#f3d29c' : '#9aa3b2';
      });

      if ((mode.startsWith('monitor') || mode === 'laptop') && openFormIfMonitor) {
        openContactModal();
      } else if (!mode.startsWith('monitor') && mode !== 'laptop') {
        closeContactModal(false);
      }
      scheduleRender();
    }`;

const newSetCam = `    function setCameraView(mode, openFormIfMonitor = false) {
      if (!hasEntered) return;
      activeView = mode;
      document.querySelectorAll('.cam-tab').forEach((btn) => {
        const isAct = btn.getAttribute('data-cam') === mode;
        btn.style.background = isAct ? 'rgba(218, 180, 124, 0.22)' : 'transparent';
        btn.style.color = isAct ? '#f3d29c' : '#9aa3b2';
      });

      if (openFormIfMonitor && (mode.startsWith('monitor') || mode === 'laptop')) {
        openContactModal();
      }
      scheduleRender();
    }`;

code = code.replace(oldSetCam, newSetCam);

// 9. Update canvas click listener to trigger device interfaces without opening contact modal
const oldClick = `          if (hitLap) {
            setCameraView('laptop', true);
          } else if (hitM1) {
            setCameraView('monitor1', true);
          } else if (hitM3) {
            setCameraView('monitor3', true);
          } else if (hitM2 || hitMon || isMonitorHovered) {
            setCameraView('monitor2', true);
          }`;

const newClick = `          if (hitLap) {
            setCameraView('laptop', false);
            if (options.onDeviceTrigger) options.onDeviceTrigger('studio');
          } else if (hitM1) {
            setCameraView('monitor1', false);
            if (options.onDeviceTrigger) options.onDeviceTrigger('dashboard');
          } else if (hitM3) {
            setCameraView('monitor3', false);
            if (options.onDeviceTrigger) options.onDeviceTrigger('services');
          } else if (hitM2 || hitMon || isMonitorHovered) {
            setCameraView('monitor2', false);
            if (options.onDeviceTrigger) options.onDeviceTrigger('portfolio');
          }`;

code = code.replace(oldClick, newClick);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully updated studioEngine.js');
