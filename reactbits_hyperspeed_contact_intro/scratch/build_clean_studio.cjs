const fs = require('fs');
const path = require('path');

const htmlContent = fs.readFileSync('contactpage.html', 'utf8');

// Extract GLB Base64 string
const glbMatch = htmlContent.match(/const\s+EMBEDDED_GLB_GZ_B64\s*=\s*"([^"]+)";/);
if (!glbMatch) {
  console.error('Could not find EMBEDDED_GLB_GZ_B64 in contactpage.html');
  process.exit(1);
}
const glbBase64 = glbMatch[1];

const studioEngineCode = `// EASYBUILDS 3D ARCHITECTURAL STUDIO ENGINE
// Native high-performance WebGL2 PBR renderer with zero runtime dependencies.

export function initStudioEngine(options = {}) {
    // =========================================================================
    // 1. FAST HIGH-PERFORMANCE 4x4 MATRIX MATH (ZERO PER-FRAME ALLOCATIONS)
    // =========================================================================
    const Mat4 = {
      identity() {
        return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
      },
      perspective(fovyRad, aspect, near, far, out = new Float32Array(16)) {
        const f = 1.0 / Math.tan(fovyRad / 2);
        out[0] = f / aspect; out[1] = 0; out[2] = 0; out[3] = 0;
        out[4] = 0; out[5] = f; out[6] = 0; out[7] = 0;
        out[8] = 0; out[9] = 0; out[10] = (far + near) / (near - far); out[11] = -1;
        out[12] = 0; out[13] = 0; out[14] = (2 * far * near) / (near - far); out[15] = 0;
        return out;
      },
      ortho(left, right, bottom, top, near, far, out = new Float32Array(16)) {
        const lr = 1 / (left - right), bt = 1 / (bottom - top), nf = 1 / (near - far);
        out[0] = -2 * lr; out[1] = 0; out[2] = 0; out[3] = 0;
        out[4] = 0; out[5] = -2 * bt; out[6] = 0; out[7] = 0;
        out[8] = 0; out[9] = 0; out[10] = 2 * nf; out[11] = 0;
        out[12] = (left + right) * lr; out[13] = (top + bottom) * bt; out[14] = (far + near) * nf; out[15] = 1;
        return out;
      },
      lookAt(eye, center, up, out = new Float32Array(16)) {
        let z0 = eye[0] - center[0], z1 = eye[1] - center[1], z2 = eye[2] - center[2];
        let len = Math.hypot(z0, z1, z2) || 1;
        z0 /= len; z1 /= len; z2 /= len;
        let x0 = up[1] * z2 - up[2] * z1, x1 = up[2] * z0 - up[0] * z2, x2 = up[0] * z1 - up[1] * z0;
        len = Math.hypot(x0, x1, x2) || 1;
        x0 /= len; x1 /= len; x2 /= len;
        const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;
        out[0] = x0; out[1] = y0; out[2] = z0; out[3] = 0;
        out[4] = x1; out[5] = y1; out[6] = z1; out[7] = 0;
        out[8] = x2; out[9] = y2; out[10] = z2; out[11] = 0;
        out[12] = -(x0 * eye[0] + x1 * eye[1] + x2 * eye[2]);
        out[13] = -(y0 * eye[0] + y1 * eye[1] + y2 * eye[2]);
        out[14] = -(z0 * eye[0] + z1 * eye[1] + z2 * eye[2]);
        out[15] = 1;
        return out;
      },
      multiply(a, b, out = new Float32Array(16)) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        let b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
        out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
        out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
        out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;

        b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
        out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
        out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
        out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
        out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
        return out;
      },
      invert(a, out = new Float32Array(16)) {
        const a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
        const a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
        const a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
        const a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

        const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
        out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
        out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[10] = (a30 * b03 - a31 * b01 + a33 * b00) * det;
        out[11] = (a21 * b01 - a20 * b03 - a23 * b00) * det;
        out[12] = (a11 * b07 - a12 * b06 - a13 * b09) * det;
        out[13] = (a02 * b06 - a00 * b07 + a03 * b09) * det;
        out[14] = (a31 * b02 - a32 * b00 - a33 * b03) * det;
        out[15] = (a20 * b04 - a21 * b02 + a22 * b00) * det;
        return out;
      },
      fromTRS(translation, rotation, scale) {
        const out = new Float32Array(16);
        const x = rotation[0], y = rotation[1], z = rotation[2], w = rotation[3];
        const x2 = x + x, y2 = y + y, z2 = z + z;
        const xx = x * x2, xy = x * y2, xz = x * z2;
        const yy = y * y2, yz = y * z2, zz = z * z2;
        const wx = w * x2, wy = w * y2, wz = w * z2;
        const sx = scale[0], sy = scale[1], sz = scale[2];

        out[0] = (1 - (yy + zz)) * sx;
        out[1] = (xy + wz) * sx;
        out[2] = (xz - wy) * sx;
        out[3] = 0;
        out[4] = (xy - wz) * sy;
        out[5] = (1 - (xx + zz)) * sy;
        out[6] = (yz + wx) * sy;
        out[7] = 0;
        out[8] = (xz + wy) * sz;
        out[9] = (yz - wx) * sz;
        out[10] = (1 - (xx + yy)) * sz;
        out[11] = 0;
        out[12] = translation[0];
        out[13] = translation[1];
        out[14] = translation[2];
        out[15] = 1;
        return out;
      },
      normalFromMat4(mat) {
        const out = new Float32Array(9);
        const a00 = mat[0], a01 = mat[1], a02 = mat[2], a03 = mat[3];
        const a10 = mat[4], a11 = mat[5], a12 = mat[6], a13 = mat[7];
        const a20 = mat[8], a21 = mat[9], a22 = mat[10], a23 = mat[11];
        const a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

        const b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
        const b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
        const b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
        const b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;

        let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
        if (!det) return null;
        det = 1.0 / det;

        out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
        out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
        out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
        out[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
        out[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
        out[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
        out[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
        out[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
        out[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
        return out;
      }
    };

    const scratchProj = new Float32Array(16);
    const scratchView = new Float32Array(16);
    const scratchViewProj = new Float32Array(16);
    const scratchInvViewProj = new Float32Array(16);
    const scratchModelViewProj = new Float32Array(16);
    const scratchLightView = new Float32Array(16);
    const scratchLightProj = new Float32Array(16);
    const scratchLightSpace = new Float32Array(16);
    let currentInvViewProj = null;

    // =========================================================================
    // 2. PROCEDURAL HIGH-RESOLUTION TEXTURE GENERATORS
    // =========================================================================

    // Procedural Photorealistic Architectural Villa Visual Generator
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

      // Warm natural travertine / ivory limestone base
      const grad = ctx.createLinearGradient(0, 0, 2048, 768);
      grad.addColorStop(0, '#ede5d5');
      grad.addColorStop(0.5, '#e4dbc9');
      grad.addColorStop(1, '#dbd1bd');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 2048, 768);

      // Fine mineral aggregate specks
      for (let i = 0; i < 3500; i++) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255, 255, 255, 0.40)' : 'rgba(140, 125, 105, 0.18)';
        ctx.fillRect(Math.random() * 2048, Math.random() * 768, Math.random() * 4 + 1, Math.random() * 3 + 1);
      }

      // Subtle travertine natural sedimentary veins
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = 'rgba(160, 145, 125, 0.14)';
        ctx.lineWidth = Math.random() * 2.5 + 1;
        ctx.beginPath();
        let vx = Math.random() * 2048;
        let vy = Math.random() * 768;
        ctx.moveTo(vx, vy);
        for (let s = 0; s < 5; s++) {
          vx += (Math.random() - 0.5) * 150;
          vy += (Math.random() - 0.5) * 55;
          ctx.lineTo(vx, vy);
        }
        ctx.stroke();
      }

      // Delicate inner perimeter border bevel
      ctx.strokeStyle = 'rgba(155, 140, 120, 0.35)';
      ctx.lineWidth = 3.5;
      ctx.strokeRect(26, 26, 1996, 716);

      // Horizontal bronze divider bar beneath 3D wordmark
      ctx.fillStyle = '#22252a';
      ctx.fillRect(280, 525, 1488, 4);

      // Crisp Inscribed Tagline: “BUILT WITH PRECISION. DESIGNED FOR IMPACT.”
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '800 48px "Space Grotesk", sans-serif';
      ctx.fillStyle = '#1c1f24';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('BUILT WITH PRECISION. DESIGNED FOR IMPACT.', 1024, 600);

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

    function createOakWoodCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#c8a87b';
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 512; i += 3) {
        const wave = Math.sin(i * 0.04) * 6;
        ctx.fillStyle = (i % 6 === 0) ? 'rgba(165, 130, 85, 0.45)' : 'rgba(235, 210, 175, 0.35)';
        ctx.fillRect(0, i + wave, 512, 2);
      }
      return c;
    }

    function createBrushedSilverCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#b8bec8';
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 512; i += 2) {
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
        ctx.fillRect(0, i, 512, 1);
      }
      return c;
    }

    function createPaperworkCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#f6f7f9';
      ctx.fillRect(0, 0, 512, 512);

      ctx.strokeStyle = '#2b3a4a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(30, 30, 452, 452);

      ctx.lineWidth = 3;
      ctx.strokeRect(60, 60, 280, 220);
      ctx.strokeRect(60, 280, 160, 160);
      ctx.strokeRect(220, 280, 120, 160);

      ctx.strokeStyle = '#6e8ba6';
      ctx.lineWidth = 1;
      for (let x = 60; x <= 340; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 60); ctx.lineTo(x, 440); ctx.stroke();
      }

      ctx.fillStyle = '#1e2835';
      ctx.font = '700 16px "Space Grotesk", sans-serif';
      ctx.fillText('EASYBUILDS ARCHITECTURAL STUDIO', 70, 465);
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText('SCALE 1:50  •  PROJECT EB-2026', 320, 465);
      return c;
    }

    function createTwilightWindowCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 512;
      const ctx = c.getContext('2d');
      const grad = ctx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#091322');
      grad.addColorStop(0.55, '#1b2d4b');
      grad.addColorStop(0.85, '#443b46');
      grad.addColorStop(1, '#664433');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 512);

      ctx.fillStyle = '#050a14';
      for (let x = 0; x < 512; x += 22) {
        const h = 70 + Math.sin(x * 0.05) * 45 + Math.cos(x * 0.12) * 25;
        ctx.fillRect(x, 512 - h, 20, h);
      }
      return c;
    }

    function createDeskCalendarCanvas() {
      const c = document.createElement('canvas');
      c.width = 512; c.height = 384;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#141822';
      ctx.fillRect(0, 0, 512, 384);
      ctx.strokeStyle = 'rgba(218, 180, 124, 0.45)';
      ctx.lineWidth = 3;
      ctx.strokeRect(20, 20, 472, 344);

      ctx.fillStyle = '#dab47c';
      ctx.font = '700 22px "Space Grotesk", sans-serif';
      ctx.fillText('EASYBUILDS STUDIO', 40, 60);

      ctx.fillStyle = '#f0f4fc';
      ctx.font = '700 32px "Space Grotesk", sans-serif';
      ctx.fillText('OCTOBER 2026', 40, 105);

      ctx.fillStyle = '#8e9bb0';
      ctx.font = '600 15px "JetBrains Mono", monospace';
      const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
      days.forEach((d, i) => ctx.fillText(d, 40 + i * 62, 150));

      ctx.font = '500 14px "JetBrains Mono", monospace';
      let dayNum = 1;
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 7; col++) {
          if (row === 0 && col < 3) continue;
          if (dayNum > 31) break;
          const x = 40 + col * 62;
          const y = 190 + row * 34;
          if (dayNum === 24) {
            ctx.fillStyle = '#dab47c';
            ctx.beginPath();
            ctx.arc(x + 10, y - 5, 14, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#0a0d14';
            ctx.fillText(dayNum.toString(), x + 3, y);
          } else {
            ctx.fillStyle = '#c4cddb';
            ctx.fillText(dayNum.toString().padStart(2, ' '), x, y);
          }
          dayNum++;
        }
      }
      return c;
    }

    // =========================================================================
    // 3. PROCEDURAL 3D PRIMITIVE GENERATOR
    // =========================================================================
    function createBoxPrim(cx, cy, cz, sx, sy, sz, uvScaleX = 1, uvScaleY = 1) {
      const hx = sx / 2, hy = sy / 2, hz = sz / 2;
      const pos = [
        cx - hx, cy - hy, cz + hz,  cx + hx, cy - hy, cz + hz,  cx + hx, cy + hy, cz + hz,  cx - hx, cy + hy, cz + hz,
        cx + hx, cy - hy, cz - hz,  cx - hx, cy - hy, cz - hz,  cx - hx, cy + hy, cz - hz,  cx + hx, cy + hy, cz - hz,
        cx - hx, cy + hy, cz + hz,  cx + hx, cy + hy, cz + hz,  cx + hx, cy + hy, cz - hz,  cx - hx, cy + hy, cz - hz,
        cx - hx, cy - hy, cz - hz,  cx + hx, cy - hy, cz - hz,  cx + hx, cy - hy, cz + hz,  cx - hx, cy - hy, cz + hz,
        cx + hx, cy - hy, cz + hz,  cx + hx, cy - hy, cz - hz,  cx + hx, cy + hy, cz - hz,  cx + hx, cy + hy, cz + hz,
        cx - hx, cy - hy, cz - hz,  cx - hx, cy - hy, cz + hz,  cx - hx, cy + hy, cz + hz,  cx - hx, cy + hy, cz - hz
      ];
      const nrm = [
         0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
         0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1,
         0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
         0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,
         1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
        -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0
      ];
      const uv = [
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY,
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY,
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY,
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY,
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY,
        0, 0,  uvScaleX, 0,  uvScaleX, uvScaleY,  0, uvScaleY
      ];
      const idx = [];
      for (let f = 0; f < 6; f++) {
        const o = f * 4;
        idx.push(o, o + 1, o + 2, o, o + 2, o + 3);
      }
      return { pos, nrm, uv, idx };
    }

    function mergeBoxPrims(boxes) {
      let totalPos = 0, totalIdx = 0;
      for (const b of boxes) {
        totalPos += b.pos.length;
        totalIdx += b.idx.length;
      }
      const pos = new Float32Array(totalPos);
      const nrm = new Float32Array(totalPos);
      const uv = new Float32Array((totalPos / 3) * 2);
      const idx = new Uint16Array(totalIdx);

      let vOffset = 0, pPtr = 0, uvPtr = 0, iPtr = 0;
      for (const b of boxes) {
        pos.set(b.pos, pPtr);
        nrm.set(b.nrm, pPtr);
        uv.set(b.uv, uvPtr);
        for (let i = 0; i < b.idx.length; i++) {
          idx[iPtr + i] = b.idx[i] + vOffset;
        }
        vOffset += b.pos.length / 3;
        pPtr += b.pos.length;
        uvPtr += b.uv.length;
        iPtr += b.idx.length;
      }
      return { pos, nrm, uv, idx };
    }

    function createPictureFramePrim(cx, cy, cz, w, h, borderW, depth) {
      const topBar    = createBoxPrim(cx, cy + h/2 - borderW/2, cz, w, borderW, depth);
      const bottomBar = createBoxPrim(cx, cy - h/2 + borderW/2, cz, w, borderW, depth);
      const leftBar   = createBoxPrim(cx - w/2 + borderW/2, cy, cz, borderW, h - borderW * 2, depth);
      const rightBar  = createBoxPrim(cx + w/2 - borderW/2, cy, cz, borderW, h - borderW * 2, depth);
      return mergeBoxPrims([topBar, bottomBar, leftBar, rightBar]);
    }

    // Genuine 3D Extruded Dimensional Letters for EASYBUILDS on Plaque
    function generate3DLetterMeshes(cx, cy, cz, totalW, letterH, depth) {
      const letters = [];
      const d = depth;
      const numLetters = 10;
      const spacing = totalW / numLetters;
      const startX = cx - (totalW / 2) + (spacing / 2);
      const stroke = letterH * 0.19;
      const w = spacing * 0.74;
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
              createBoxPrim(lx - stroke*0.1, ly, lz, w * 0.8, stroke, d),
              createBoxPrim(lx, ly - h/2 + stroke/2, lz, w, stroke, d)
            );
            break;
          case 'A':
            letters.push(
              createBoxPrim(lx - w/2 + stroke/2, ly - stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - stroke/2, lz, stroke, h - stroke, d),
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx, ly - stroke*0.15, lz, w - stroke*0.4, stroke * 0.9, d)
            );
            break;
          case 'S':
            letters.push(
              createBoxPrim(lx, ly + h/2 - stroke/2, lz, w, stroke, d),
              createBoxPrim(lx - w/2 + stroke/2, ly + h/4, lz, stroke, h/2 - stroke/2, d),
              createBoxPrim(lx, ly, lz, w, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - h/4, lz, stroke, h/2 - stroke/2, d),
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
              createBoxPrim(lx - stroke*0.2, ly + h/2 - stroke/2, lz, w - stroke*0.4, stroke, d),
              createBoxPrim(lx - stroke*0.2, ly, lz, w - stroke*0.4, stroke, d),
              createBoxPrim(lx - stroke*0.2, ly - h/2 + stroke/2, lz, w - stroke*0.4, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly + h/4, lz, stroke, h/2 - stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly - h/4, lz, stroke, h/2 - stroke, d)
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
              createBoxPrim(lx - stroke*0.2, ly + h/2 - stroke/2, lz, w - stroke*0.4, stroke, d),
              createBoxPrim(lx - stroke*0.2, ly - h/2 + stroke/2, lz, w - stroke*0.4, stroke, d),
              createBoxPrim(lx + w/2 - stroke/2, ly, lz, stroke, h - stroke * 1.5, d)
            );
            break;
        }
      }
      return mergeBoxPrims(letters);
    }

    // =========================================================================
    // 4. WEBGL2 PBR + SHADOW SHADERS (GGX + PHYSICAL CEILING SPOTLIGHTS + ACES FILMIC)
    // =========================================================================
    const SHADOW_VS = \`#version 300 es
    layout(location = 0) in vec3 a_position;
    uniform mat4 u_lightSpaceMatrix;
    uniform mat4 u_model;
    void main() {
      gl_Position = u_lightSpaceMatrix * u_model * vec4(a_position, 1.0);
    }\`;

    const SHADOW_FS = \`#version 300 es
    precision highp float;
    void main() {}\`;

    const PBR_VS = \`#version 300 es
    layout(location = 0) in vec3 a_position;
    layout(location = 1) in vec3 a_normal;
    layout(location = 2) in vec2 a_uv;

    uniform mat4 u_viewProj;
    uniform mat4 u_lightSpaceMatrix;
    uniform mat4 u_model;
    uniform mat3 u_normalMatrix;

    out vec3 v_worldPos;
    out vec3 v_normal;
    out vec2 v_uv;
    out vec4 v_lightSpacePos;

    void main() {
      vec4 wp = u_model * vec4(a_position, 1.0);
      v_worldPos = wp.xyz;
      v_normal = normalize(u_normalMatrix * a_normal);
      v_uv = a_uv;
      v_lightSpacePos = u_lightSpaceMatrix * wp;
      gl_Position = u_viewProj * wp;
    }\`;

    const PBR_FS = \`#version 300 es
    precision highp float;

    in vec3 v_worldPos;
    in vec3 v_normal;
    in vec2 v_uv;
    in vec4 v_lightSpacePos;

    uniform sampler2D u_baseColorTex;
    uniform sampler2D u_shadowMap;
    uniform int u_hasTexture;
    uniform vec4 u_baseColorFactor;
    uniform vec3 u_emissiveFactor;
    uniform float u_metallic;
    uniform float u_roughness;
    uniform vec3 u_cameraPos;
    uniform float u_warmMode;
    uniform float u_monitorHoverGlow;
    uniform int u_isMonitorScreen;
    uniform float u_introReveal;

    out vec4 fragColor;

    const float PI = 3.14159265359;

    float DistributionGGX(vec3 N, vec3 H, float roughness) {
      float a = roughness * roughness;
      float a2 = a * a;
      float NdotH = max(dot(N, H), 0.0);
      float NdotH2 = NdotH * NdotH;
      float denom = (NdotH2 * (a2 - 1.0) + 1.0);
      denom = PI * denom * denom + 0.0001;
      return a2 / denom;
    }

    float GeometrySchlickGGX(float NdotV, float roughness) {
      float r = (roughness + 1.0);
      float k = (r * r) / 8.0;
      return NdotV / (NdotV * (1.0 - k) + k + 0.0001);
    }

    float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {
      return GeometrySchlickGGX(max(dot(N, V), 0.0), roughness) *
             GeometrySchlickGGX(max(dot(N, L), 0.0), roughness);
    }

    vec3 fresnelSchlick(float cosTheta, vec3 F0) {
      return F0 + (1.0 - F0) * pow(clamp(1.0 - cosTheta, 0.0, 1.0), 5.0);
    }

    float computeShadow(vec4 lightSpacePos, vec3 N, vec3 L) {
      vec3 projCoords = lightSpacePos.xyz / lightSpacePos.w;
      projCoords = projCoords * 0.5 + 0.5;
      if (projCoords.z > 0.998 || projCoords.x < 0.002 || projCoords.x > 0.998 || projCoords.y < 0.002 || projCoords.y > 0.998) {
        return 1.0;
      }
      float bias = max(0.0025 * (1.0 - dot(N, L)), 0.0008);
      vec2 t = vec2(1.25 / 1024.0);
      float d0 = (projCoords.z - bias > texture(u_shadowMap, projCoords.xy).r) ? 0.25 : 1.0;
      float d1 = (projCoords.z - bias > texture(u_shadowMap, projCoords.xy + vec2(-t.x, -t.y)).r) ? 0.25 : 1.0;
      float d2 = (projCoords.z - bias > texture(u_shadowMap, projCoords.xy + vec2( t.x, -t.y)).r) ? 0.25 : 1.0;
      float d3 = (projCoords.z - bias > texture(u_shadowMap, projCoords.xy + vec2(-t.x,  t.y)).r) ? 0.25 : 1.0;
      float d4 = (projCoords.z - bias > texture(u_shadowMap, projCoords.xy + vec2( t.x,  t.y)).r) ? 0.25 : 1.0;
      return (d0 + d1 + d2 + d3 + d4) * 0.2;
    }

    float computeContactAO(vec3 p, vec3 n) {
      float ao = 1.0;
      if (p.y < 0.18) {
        float hFade = clamp(1.0 - p.y / 0.18, 0.0, 1.0);
        float dPC = length(max(abs(p.xz - vec2(-1.05, 0.62)) - vec2(0.32, 0.45), 0.0));
        ao *= mix(1.0, 0.28, exp(-dPC * 8.0) * hFade);
        float dDesk = length(max(abs(p.xz - vec2(0.0, 0.32)) - vec2(1.42, 0.68), 0.0));
        ao *= mix(1.0, 0.58, exp(-dDesk * 2.5) * hFade);
        float dChair = length(p.xz - vec2(-0.025, 0.84));
        ao *= mix(1.0, 0.42, exp(-dChair * dChair * 5.0) * hFade);
      }
      if (abs(p.y - 0.81) < 0.08) {
        float dFade = clamp(1.0 - abs(p.y - 0.81) / 0.08, 0.0, 1.0);
        float dKB = length(max(abs(p.xz - vec2(-0.11, 0.12)) - vec2(0.28, 0.09), 0.0));
        ao *= mix(1.0, 0.40, exp(-dKB * 16.0) * dFade);
        float dLap = length(max(abs(p.xz - vec2(-0.92, 0.45)) - vec2(0.26, 0.26), 0.0));
        ao *= mix(1.0, 0.38, exp(-dLap * 12.0) * dFade);
        float dMon = length(max(abs(p.xz - vec2(0.0, -0.25)) - vec2(0.45, 0.10), 0.0));
        ao *= mix(1.0, 0.45, exp(-dMon * 10.0) * dFade);
        float dLamp = length(p.xz - vec2(-0.78, -0.22));
        ao *= mix(1.0, 0.32, exp(-dLamp * 22.0) * dFade);
        float dBook = length(max(abs(p.xz - vec2(0.42, 0.18)) - vec2(0.12, 0.09), 0.0));
        ao *= mix(1.0, 0.42, exp(-dBook * 18.0) * dFade);
      }
      if (p.y < 0.785) {
        float inDeskX = 1.0 - smoothstep(1.15, 1.52, abs(p.x));
        float inDeskZ = (1.0 - smoothstep(0.45, 0.95, p.z)) * smoothstep(-0.55, -0.15, p.z);
        float underCanopy = inDeskX * inDeskZ;
        float topProximity = smoothstep(0.15, 0.78, p.y);
        ao *= mix(1.0, 0.18, underCanopy * (0.55 + 0.45 * topProximity));
      }
      float floorCrease = clamp(p.y / 0.35, 0.55, 1.0);
      float backWallCrease = clamp((p.z - (-1.68)) / 0.45, 0.62, 1.0);
      return ao * floorCrease * backWallCrease;
    }

    vec3 evalStudioIBL(vec3 R, vec3 N, vec3 worldPos, float roughness) {
      float blur = roughness * roughness;
      vec3 env = mix(vec3(0.035, 0.042, 0.056), vec3(0.018, 0.022, 0.030), clamp(-R.y, 0.0, 1.0));

      float winDir = smoothstep(-0.15, -0.75, R.x) * smoothstep(-0.35, 0.45, R.y);
      vec3 winColor = mix(vec3(0.26, 0.44, 0.72), vec3(0.18, 0.30, 0.48), u_warmMode * 0.5);
      env += winColor * winDir * mix(1.15, 0.45, blur);

      float ceilDir = smoothstep(0.25, 0.88, R.y) * exp(-abs(R.z) * 1.8);
      env += vec3(0.85, 0.68, 0.46) * ceilDir * mix(0.85, 0.30, blur) * u_introReveal;

      float backDir = smoothstep(-0.2, -0.85, R.z) * smoothstep(-0.2, 0.6, R.y);
      env += vec3(0.72, 0.48, 0.25) * backDir * 0.38 * u_introReveal;

      if (worldPos.y > 0.75 && worldPos.y < 0.95 && worldPos.z > -0.25 && worldPos.z < 0.65) {
        float monRefl = smoothstep(-0.1, -0.8, R.z) * exp(-abs(worldPos.x) * 1.4);
        env += vec3(0.22, 0.34, 0.52) * monRefl * (0.65 + 0.35 * u_monitorHoverGlow) * u_introReveal;
      }
      return env;
    }

    vec3 acesFilm(vec3 x) {
      const float a = 2.51;
      const float b = 0.03;
      const float c = 2.43;
      const float d = 0.59;
      const float e = 0.14;
      return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
    }

    void main() {
      vec4 texSample = (u_hasTexture == 1) ? texture(u_baseColorTex, v_uv) : vec4(1.0);
      if (u_hasTexture == 1 && texSample.a < 0.2) discard;
      vec3 albedo = pow(texSample.rgb, vec3(2.2)) * pow(u_baseColorFactor.rgb, vec3(2.2));

      vec3 N = normalize(v_normal);
      vec3 V = normalize(u_cameraPos - v_worldPos);
      vec3 R = reflect(-V, N);

      float metallic = clamp(u_metallic, 0.0, 1.0);
      float roughness = clamp(u_roughness, 0.06, 1.0);
      vec3 F0 = mix(vec3(0.04), albedo, metallic);
      float ao = computeContactAO(v_worldPos, N);

      // Light 0: Overhead Key Light
      vec3 keyPos = vec3(1.15, 3.15, 1.55);
      vec3 L0 = normalize(keyPos - v_worldPos);
      vec3 H0 = normalize(V + L0);
      float shadow = computeShadow(v_lightSpacePos, N, L0);
      vec3 keyRadiance = mix(vec3(2.55, 2.28, 1.98), vec3(2.85, 2.42, 1.92), u_warmMode) * shadow * (0.25 + 0.75 * u_introReveal);

      // Light 1: Cool-Blue Window Skylight
      vec3 winPos = vec3(-4.1, 1.95, 0.65);
      vec3 L1 = normalize(winPos - v_worldPos);
      vec3 H1 = normalize(V + L1);
      float winDist = length(winPos - v_worldPos);
      float winAtten = 1.0 / (1.0 + 0.06 * winDist * winDist);
      vec3 winRadiance = mix(vec3(1.85, 2.35, 3.15), vec3(1.15, 1.48, 2.05), u_warmMode) * winAtten;

      // Light 2: 3 Ceiling Recessed Spotlights (Warm Architectural Downlight Scallops on Wall & Plaque)
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
      vec3 coveRadiance = spotWallRad * u_introReveal + vec3(1.2, 0.82, 0.45) * u_introReveal;

      // Light 3: Monitor Screen Light
      vec3 monPos = vec3(0.0, 1.12, -0.12);
      vec3 L3 = normalize(monPos - v_worldPos);
      vec3 H3 = normalize(V + L3);
      float monDist = length(monPos - v_worldPos);
      float monFront = smoothstep(-0.35, 0.25, v_worldPos.z);
      vec3 monRadiance = vec3(0.85, 1.18, 1.68) * (1.0 + 0.45 * u_monitorHoverGlow) * monFront * (0.2 + 0.8 * u_introReveal) / (1.0 + 1.4 * monDist * monDist);

      // Light 4: 3D Architectural Desk Lamp (Warm Task Luminaire)
      vec3 lampPos = vec3(0.54, 1.22, 0.38);
      vec3 L4 = normalize(lampPos - v_worldPos);
      vec3 H4 = normalize(V + L4);
      float lampDist = length(lampPos - v_worldPos);
      vec3 lampSpotDir = normalize(vec3(0.05, -0.96, 0.15));
      float lampCos = dot(-L4, lampSpotDir);
      float lampSpotFactor = smoothstep(0.18, 0.88, lampCos);
      vec3 lampRadiance = vec3(3.6, 2.65, 1.45) * lampSpotFactor * u_introReveal / (1.0 + 2.8 * lampDist * lampDist);

      vec3 Lo = vec3(0.0);
      vec3 lightsL[5] = vec3[5](L0, L1, L2, L3, L4);
      vec3 lightsH[5] = vec3[5](H0, H1, H2, H3, H4);
      vec3 lightsRad[5] = vec3[5](keyRadiance, winRadiance, coveRadiance, monRadiance, lampRadiance);

      float NdotV = max(dot(N, V), 0.001);
      for (int i = 0; i < 5; i++) {
        vec3 Li = lightsL[i];
        vec3 Hi = lightsH[i];
        float NdotL = max(dot(N, Li), 0.0);
        if (NdotL > 0.0) {
          float D = DistributionGGX(N, Hi, roughness);
          float G = GeometrySmith(N, V, Li, roughness);
          vec3 F = fresnelSchlick(max(dot(Hi, V), 0.0), F0);
          vec3 spec = (D * G * F) / (4.0 * NdotV * NdotL + 0.001);
          vec3 kD = (vec3(1.0) - F) * (1.0 - metallic);
          Lo += (kD * albedo / PI + spec) * lightsRad[i] * NdotL;
        }
      }

      // Ambient & Studio IBL
      vec3 F_ibl = fresnelSchlick(NdotV, F0);
      vec3 kD_ibl = (1.0 - F_ibl) * (1.0 - metallic);
      vec3 irradiance = mix(vec3(0.045, 0.055, 0.075), vec3(0.065, 0.058, 0.052), u_warmMode);
      vec3 diffuseIBL = irradiance * albedo * kD_ibl;
      vec3 specIBL = evalStudioIBL(R, N, v_worldPos, roughness) * (F_ibl * (1.0 - roughness * 0.55));
      vec3 color = (Lo + (diffuseIBL + specIBL) * ao);

      if (u_isMonitorScreen == 1) {
        float boost = (1.05 + 0.28 * u_monitorHoverGlow) * (0.35 + 0.65 * u_introReveal);
        color = color * 0.18 + texSample.rgb * boost;
        color += evalStudioIBL(R, N, v_worldPos, 0.12) * 0.09;
      } else if (length(u_emissiveFactor) > 0.01) {
        vec3 emTex = (u_hasTexture == 1) ? texSample.rgb : vec3(1.0);
        color += emTex * u_emissiveFactor * (0.2 + 0.8 * u_introReveal);
      }

      // Atmospheric depth fog
      float camDist = length(u_cameraPos - v_worldPos);
      float fogFactor = clamp((camDist - 4.5) / 9.5, 0.0, 0.65);
      vec3 fogColor = vec3(0.008, 0.010, 0.015);
      color = mix(color, fogColor, fogFactor);

      // ACES Filmic Tone Mapping + Contrast Curve
      vec3 mapped = acesFilm(color * 1.15);
      fragColor = vec4(pow(mapped, vec3(1.0 / 2.2)), 1.0);
    }\`;

    // =========================================================================
    // 5. WEBGL2 CONTEXT & PIPELINE SETUP
    // =========================================================================
    const canvas = options.canvas || document.getElementById('webgl-canvas');
    if (!canvas) {
      console.warn('WebGL canvas element not found');
      return {
        startCinematicEntrance() {},
        setCameraView() {},
        openContactModal() {},
        closeContactModal() {},
        scheduleRender() {},
        dispose() {}
      };
    }

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      depth: true,
      powerPreference: 'high-performance',
      stencil: false,
      preserveDrawingBuffer: false
    });

    if (!gl) {
      console.error('WebGL2 is not supported on this browser/GPU');
      return {
        startCinematicEntrance() {},
        setCameraView() {},
        openContactModal() {},
        closeContactModal() {},
        scheduleRender() {},
        dispose() {}
      };
    }

    const anisoExt = gl.getExtension('EXT_texture_filter_anisotropic');
    const maxAniso = anisoExt ? Math.min(gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT), 16) : 1;

    function compileShader(src, type) {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    function createProgram(vsSrc, fsSrc) {
      const p = gl.createProgram();
      const vs = compileShader(vsSrc, gl.VERTEX_SHADER);
      const fs = compileShader(fsSrc, gl.FRAGMENT_SHADER);
      gl.attachShader(p, vs);
      gl.attachShader(p, fs);
      gl.linkProgram(p);
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
        console.error('Program link error:', gl.getProgramInfoLog(p));
        return null;
      }
      return p;
    }

    const pbrProg = createProgram(PBR_VS, PBR_FS);
    const shadowProg = createProgram(SHADOW_VS, SHADOW_FS);

    const shadowFBO = gl.createFramebuffer();
    const shadowTex = gl.createTexture();
    const SHADOW_RES = 1024;
    gl.bindTexture(gl.TEXTURE_2D, shadowTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, SHADOW_RES, SHADOW_RES, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, shadowTex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const pbrUniforms = {
      viewProj: gl.getUniformLocation(pbrProg, 'u_viewProj'),
      lightSpaceMatrix: gl.getUniformLocation(pbrProg, 'u_lightSpaceMatrix'),
      model: gl.getUniformLocation(pbrProg, 'u_model'),
      normalMatrix: gl.getUniformLocation(pbrProg, 'u_normalMatrix'),
      baseColorTex: gl.getUniformLocation(pbrProg, 'u_baseColorTex'),
      shadowMap: gl.getUniformLocation(pbrProg, 'u_shadowMap'),
      hasTexture: gl.getUniformLocation(pbrProg, 'u_hasTexture'),
      baseColorFactor: gl.getUniformLocation(pbrProg, 'u_baseColorFactor'),
      emissiveFactor: gl.getUniformLocation(pbrProg, 'u_emissiveFactor'),
      metallic: gl.getUniformLocation(pbrProg, 'u_metallic'),
      roughness: gl.getUniformLocation(pbrProg, 'u_roughness'),
      cameraPos: gl.getUniformLocation(pbrProg, 'u_cameraPos'),
      warmMode: gl.getUniformLocation(pbrProg, 'u_warmMode'),
      monitorHoverGlow: gl.getUniformLocation(pbrProg, 'u_monitorHoverGlow'),
      isMonitorScreen: gl.getUniformLocation(pbrProg, 'u_isMonitorScreen'),
      introReveal: gl.getUniformLocation(pbrProg, 'u_introReveal')
    };

    const shadowUniforms = {
      lightSpaceMatrix: gl.getUniformLocation(shadowProg, 'u_lightSpaceMatrix'),
      model: gl.getUniformLocation(shadowProg, 'u_model')
    };

    function createTextureFromCanvas(cnv, repeat = false) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cnv);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE);
      if (anisoExt) gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
      return tex;
    }

    const monitor1ProjectsTex = createTextureFromCanvas(createMonitor1ProjectsCanvas(), false);
    const monitor2BrandTexNormal = createTextureFromCanvas(createMonitor2BrandCanvas(false), false);
    const monitor2BrandTexHover = createTextureFromCanvas(createMonitor2BrandCanvas(true), false);
    const monitor3ServicesTex = createTextureFromCanvas(createMonitor3ServicesCanvas(), false);
    const laptopScreenTex = createTextureFromCanvas(createLaptopOSCanvas(), false);
    const floorStoneTex = createTextureFromCanvas(createBasaltFloorCanvas(), true);
    const graphiteWallTex = createTextureFromCanvas(createGraphiteWallCanvas(), false);
    const deskWoodTex = createTextureFromCanvas(createDeskWoodCanvas(), true);
    const paperworkTex = createTextureFromCanvas(createPaperworkCanvas(), false);
    const twilightWindowTex = createTextureFromCanvas(createTwilightWindowCanvas(), false);
    const oakWoodTex = createTextureFromCanvas(createOakWoodCanvas(), true);
    const brushedSilverTex = createTextureFromCanvas(createBrushedSilverCanvas(), true);
    const deskCalendarTex = createTextureFromCanvas(createDeskCalendarCanvas(), false);

    const ivoryStoneTex = createTextureFromCanvas(createIvoryStoneCanvas(), false);
    const champagneBrassTex = createTextureFromCanvas(createChampagneBrassCanvas(), true);

    const boardHostingTex = createTextureFromCanvas(createServiceBoardCanvas('HOSTING & DEPLOYMENT', 'SCALABLE INFRASTRUCTURE. SEAMLESS PERFORMANCE.'), false);
    const boardDesignTex = createTextureFromCanvas(createServiceBoardCanvas('UI / UX DESIGN', 'INTUITIVE EXPERIENCES. MEANINGFUL INTERFACES.'), false);
    const boardManagementTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE MANAGEMENT', 'MONITOR. OPTIMIZE. GROW.'), false);
    const boardDevTex = createTextureFromCanvas(createServiceBoardCanvas('WEBSITE DEVELOPMENT', 'MODERN SOLUTIONS. REAL RESULTS.'), false);

    const drawCalls = [];
    function uploadMeshPrimitive(pos, nrm, uv, idx, worldMat, matProps) {
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos instanceof Float32Array ? pos : new Float32Array(pos), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

      const nrmBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
      gl.bufferData(gl.ARRAY_BUFFER, nrm instanceof Float32Array ? nrm : new Float32Array(nrm), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

      const uvBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
      gl.bufferData(gl.ARRAY_BUFFER, uv instanceof Float32Array ? uv : new Float32Array(uv), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(2);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, false, 0, 0);

      const idxBuf = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx instanceof Uint16Array ? idx : new Uint16Array(idx), gl.STATIC_DRAW);

      gl.bindVertexArray(null);

      const normalMatrix = Mat4.normalFromMat4(worldMat);

      drawCalls.push({
        vao,
        indexCount: idx.length,
        worldMatrix: new Float32Array(worldMat),
        normalMatrix,
        texture: matProps.texture || null,
        baseColorFactor: matProps.baseColor || [1, 1, 1, 1],
        emissiveFactor: matProps.emissive || [0, 0, 0],
        metallic: matProps.metallic !== undefined ? matProps.metallic : 0.1,
        roughness: matProps.roughness !== undefined ? matProps.roughness : 0.5,
        castShadow: !!matProps.castShadow,
        isMonitorScreen: matProps.isMonitorScreen || 0,
        isCenterMonitor: !!matProps.isCenterMonitor,
        name: matProps.name || ''
      });
    }

    // =========================================================================
    // 6. BUILD PHOTOREALISTIC ARCHITECTURAL ROOM & ACCESSORIES
    // =========================================================================
    function buildArchitecturalRoom() {
      const identity = Mat4.identity();

      // 1. Honed Obsidian Basalt Tiled Floor (Y = 0)
      const floorBox = createBoxPrim(0, -0.02, 0.6, 10.5, 0.04, 8.2, 6, 5);
      uploadMeshPrimitive(floorBox.pos, floorBox.nrm, floorBox.uv, floorBox.idx, identity, {
        name: 'STUDIO_FLOOR',
        texture: floorStoneTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.12,
        roughness: 0.30,
        castShadow: false
      });

      // 2. Rear Architectural Wall Backing (Z = -1.72)
      const backWall = createBoxPrim(0, 1.7, -1.72, 9.6, 3.5, 0.08, 1, 1);
      uploadMeshPrimitive(backWall.pos, backWall.nrm, backWall.uv, backWall.idx, identity, {
        name: 'BACK_WALL_BACKING',
        baseColor: [0.055, 0.062, 0.078, 1],
        metallic: 0.08,
        roughness: 0.78,
        castShadow: false
      });

      // 3. Central Monolithic Graphite Concrete Feature Panel (Z = -1.64)
      const centerWall = createBoxPrim(0, 1.7, -1.64, 3.36, 3.4, 0.07, 1, 1);
      uploadMeshPrimitive(centerWall.pos, centerWall.nrm, centerWall.uv, centerWall.idx, identity, {
        name: 'CENTER_MONOLITH_WALL',
        texture: graphiteWallTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.15,
        roughness: 0.48,
        castShadow: true
      });

      // 4. Recessed Warm LED Reveal Slot Across Feature Wall
      const warmStrips = [
        createBoxPrim(0, 2.24, -1.60, 3.34, 0.014, 0.015),
        createBoxPrim(0, 3.34, -1.58, 8.6, 0.02, 0.04),
        createBoxPrim(3.42, 1.22, 0.15, 0.025, 0.012, 2.85),
        createBoxPrim(3.42, 1.76, 0.15, 0.025, 0.012, 2.85),
        createBoxPrim(3.42, 2.30, 0.15, 0.025, 0.012, 2.85),
        createBoxPrim(3.42, 2.84, 0.15, 0.025, 0.012, 2.85),
      ];
      const mergedWarmStrips = mergeBoxPrims(warmStrips);
      uploadMeshPrimitive(mergedWarmStrips.pos, mergedWarmStrips.nrm, mergedWarmStrips.uv, mergedWarmStrips.idx, identity, {
        name: 'WARM_LED_COVES',
        baseColor: [1.0, 0.85, 0.65, 1],
        emissive: [2.35, 1.65, 0.92],
        roughness: 0.2,
        castShadow: false
      });

      // 5. Left & Right Fluted Dark Walnut Acoustic Slat Walls (Extended coverage behind frames)
      const slatBoxes = [];
      for (let x = -3.95; x <= -1.12; x += 0.075) {
        slatBoxes.push(createBoxPrim(x, 1.68, -1.65, 0.038, 3.36, 0.045));
      }
      for (let x = 1.12; x <= 3.95; x += 0.075) {
        slatBoxes.push(createBoxPrim(x, 1.68, -1.65, 0.038, 3.36, 0.045));
      }
      const mergedSlats = mergeBoxPrims(slatBoxes);
      uploadMeshPrimitive(mergedSlats.pos, mergedSlats.nrm, mergedSlats.uv, mergedSlats.idx, identity, {
        name: 'ACOUSTIC_WALNUT_SLATS',
        baseColor: [0.16, 0.115, 0.09, 1],
        metallic: 0.08,
        roughness: 0.52,
        castShadow: true
      });

      // 6. Left Floor-to-Ceiling Mullioned Architectural Window + Twilight Exterior
      const winBackdrop = createBoxPrim(-4.15, 1.7, 0.65, 0.02, 3.4, 5.2, 1, 1);
      uploadMeshPrimitive(winBackdrop.pos, winBackdrop.nrm, winBackdrop.uv, winBackdrop.idx, identity, {
        name: 'TWILIGHT_WINDOW_BACKDROP',
        texture: twilightWindowTex,
        baseColor: [1, 1, 1, 1],
        emissive: [1.35, 1.55, 1.85],
        roughness: 0.2,
        castShadow: false
      });

      const mullionBoxes = [
        createBoxPrim(-3.88, 1.7, -1.62, 0.09, 3.4, 0.06),
        createBoxPrim(-3.88, 1.7, -0.55, 0.09, 3.4, 0.06),
        createBoxPrim(-3.88, 1.7,  0.52, 0.09, 3.4, 0.06),
        createBoxPrim(-3.88, 1.7,  1.59, 0.09, 3.4, 0.06),
        createBoxPrim(-3.88, 1.7,  2.66, 0.09, 3.4, 0.06),
        createBoxPrim(-3.88, 0.85, 0.65, 0.08, 0.05, 5.0),
        createBoxPrim(-3.88, 2.55, 0.65, 0.08, 0.05, 5.0),
        createBoxPrim(-3.05, 0.41, -0.95, 0.50, 0.82, 0.50),
        createBoxPrim(3.62, 0.37, 0.15, 0.58, 0.74, 3.1),
        createBoxPrim(3.58, 1.24, 0.15, 0.44, 0.036, 2.95),
        createBoxPrim(3.58, 1.78, 0.15, 0.44, 0.036, 2.95),
        createBoxPrim(3.58, 2.32, 0.15, 0.44, 0.036, 2.95),
        createBoxPrim(3.58, 2.86, 0.15, 0.44, 0.036, 2.95),
        createBoxPrim(3.92, 1.7, 0.15, 0.08, 3.4, 3.6),
        createBoxPrim(0.0, 2.66, -0.04, 2.16, 0.042, 0.064),
        createBoxPrim(-0.82, 3.04, -0.04, 0.008, 0.76, 0.008),
        createBoxPrim( 0.82, 3.04, -0.04, 0.008, 0.76, 0.008),
      ];
      const mergedAnodized = mergeBoxPrims(mullionBoxes);
      uploadMeshPrimitive(mergedAnodized.pos, mergedAnodized.nrm, mergedAnodized.uv, mergedAnodized.idx, identity, {
        name: 'ARCHITECTURAL_MILLWORK_AND_MULLIONS',
        baseColor: [0.11, 0.125, 0.155, 1],
        metallic: 0.68,
        roughness: 0.30,
        castShadow: true
      });

      // 7. Brushed Titanium / Champagne Sculptures & Shelving Folios
      const sculptureBoxes = [
        createBoxPrim(-3.05, 0.94, -0.95, 0.20, 0.24, 0.20),
        createBoxPrim(-2.99, 1.10, -0.92, 0.14, 0.18, 0.14),
        createBoxPrim(3.52, 1.37, -0.72, 0.20, 0.22, 0.04),
        createBoxPrim(3.52, 1.36, -0.65, 0.20, 0.20, 0.04),
        createBoxPrim(3.52, 1.38, -0.58, 0.21, 0.24, 0.04),
        createBoxPrim(3.52, 1.30,  0.28, 0.22, 0.07, 0.36),
        createBoxPrim(3.50, 1.36,  0.25, 0.16, 0.06, 0.24),
        createBoxPrim(3.52, 1.91, -0.32, 0.20, 0.22, 0.045),
        createBoxPrim(3.52, 1.89, -0.24, 0.19, 0.19, 0.045),
        createBoxPrim(3.52, 1.84,  0.55, 0.20, 0.08, 0.30),
      ];
      const mergedSculptures = mergeBoxPrims(sculptureBoxes);
      uploadMeshPrimitive(mergedSculptures.pos, mergedSculptures.nrm, mergedSculptures.uv, mergedSculptures.idx, identity, {
        name: 'STUDIO_SCULPTURES_AND_MODELS',
        baseColor: [0.34, 0.32, 0.29, 1],
        metallic: 0.78,
        roughness: 0.25,
        castShadow: true
      });

      // A. PHYSICAL WARM IVORY WALL PLAQUE & DIMENSIONAL 3D EASYBUILDS WORDMARK
      const plaqueWidth = 2.18, plaqueHeight = 0.74, plaqueThickness = 0.038;
      const plaqueZFront = -1.580 + plaqueThickness / 2;
      const plaqueBox = createBoxPrim(0.0, 1.95, -1.580, plaqueWidth, plaqueHeight, plaqueThickness);
      uploadMeshPrimitive(plaqueBox.pos, plaqueBox.nrm, plaqueBox.uv, plaqueBox.idx, identity, {
        name: 'IVORY_WALL_PLAQUE',
        texture: ivoryStoneTex,
        baseColor: [0.96, 0.94, 0.90, 1],
        metallic: 0.02,
        roughness: 0.68,
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

      // Genuine 3D Extruded Dimensional EASYBUILDS Letter Meshes mounted on Plaque
      const letterDepth = 0.022;
      const letterMesh = generate3DLetterMeshes(0.0, 2.05, plaqueZFront + letterDepth/2, 1.62, 0.24, letterDepth);
      uploadMeshPrimitive(letterMesh.pos, letterMesh.nrm, letterMesh.uv, letterMesh.idx, identity, {
        name: 'EASYBUILDS_3D_EXTRUDED_WORDMARK',
        baseColor: [0.16, 0.17, 0.20, 1],
        metallic: 0.94,
        roughness: 0.20,
        castShadow: true
      });

      // Horizontal Metallic Divider Bar on Plaque
      const dividerBar = createBoxPrim(0.0, 1.845, plaqueZFront + 0.003, 1.58, 0.003, 0.005);
      uploadMeshPrimitive(dividerBar.pos, dividerBar.nrm, dividerBar.uv, dividerBar.idx, identity, {
        name: 'PLAQUE_DIVIDER_BAR',
        baseColor: [0.20, 0.21, 0.24, 1],
        metallic: 0.90,
        roughness: 0.25,
        castShadow: true
      });

      // B. FOUR ARCHITECTURAL SERVICE FRAMES (CHAMPAGNE BRASS FINISH)
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

      // Left Indoor Desk Plant (Fluted Dark Ceramic Pot + Upright Broad Tropical Foliage)
      const potX = -1.26, potY = 0.52, potZ = 0.28;
      const plantPot = createBoxPrim(potX, potY, potZ, 0.28, 0.48, 0.28);
      const plantPotRim = createBoxPrim(potX, potY + 0.24, potZ, 0.30, 0.04, 0.30);
      const plantSoil = createBoxPrim(potX, potY + 0.23, potZ, 0.26, 0.02, 0.26);
      const mergedPot = mergeBoxPrims([plantPot, plantPotRim, plantSoil]);
      uploadMeshPrimitive(mergedPot.pos, mergedPot.nrm, mergedPot.uv, mergedPot.idx, identity, {
        name: 'LEFT_PLANTER_POT',
        baseColor: [0.10, 0.11, 0.13, 1],
        metallic: 0.18,
        roughness: 0.35,
        castShadow: true
      });

      // Broad Ficus / Monstera leaves radiating and arching upwards
      const leaves = [];
      const leafConfigs = [
        { ang: 15,  dist: 0.12, yOffset: 0.32, w: 0.14, h: 0.18 },
        { ang: 60,  dist: 0.14, yOffset: 0.38, w: 0.16, h: 0.20 },
        { ang: 110, dist: 0.13, yOffset: 0.44, w: 0.15, h: 0.22 },
        { ang: 160, dist: 0.15, yOffset: 0.50, w: 0.16, h: 0.24 },
        { ang: 210, dist: 0.13, yOffset: 0.54, w: 0.15, h: 0.22 },
        { ang: 260, dist: 0.14, yOffset: 0.48, w: 0.16, h: 0.20 },
        { ang: 310, dist: 0.12, yOffset: 0.42, w: 0.15, h: 0.19 },
        { ang: 355, dist: 0.14, yOffset: 0.56, w: 0.16, h: 0.24 },
        { ang: 40,  dist: 0.08, yOffset: 0.62, w: 0.14, h: 0.22 },
        { ang: 130, dist: 0.09, yOffset: 0.66, w: 0.14, h: 0.23 },
        { ang: 220, dist: 0.08, yOffset: 0.70, w: 0.14, h: 0.22 },
        { ang: 300, dist: 0.07, yOffset: 0.74, w: 0.13, h: 0.20 },
      ];

      leafConfigs.forEach((cfg) => {
        const rad = cfg.ang * Math.PI / 180;
        const lx = potX + Math.cos(rad) * cfg.dist;
        const lz = potZ + Math.sin(rad) * cfg.dist;
        const ly = potY + cfg.yOffset;
        leaves.push(createBoxPrim(lx, ly, lz, cfg.w, 0.010, cfg.h));
      });
      const mergedLeaves = mergeBoxPrims(leaves);
      uploadMeshPrimitive(mergedLeaves.pos, mergedLeaves.nrm, mergedLeaves.uv, mergedLeaves.idx, identity, {
        name: 'LEFT_PLANT_FOLIAGE',
        baseColor: [0.10, 0.24, 0.13, 1],
        metallic: 0.04,
        roughness: 0.46,
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

      // C. ARCHITECTURAL TASK DESK LAMP & PAPERWORK
      const lampBase = createBoxPrim(0.82, 0.820, 0.32, 0.18, 0.016, 0.18);
      const lampKnuckle1 = createBoxPrim(0.82, 0.836, 0.32, 0.028, 0.024, 0.028);
      const lampStem = createBoxPrim(0.82, 1.02, 0.32, 0.018, 0.36, 0.018);
      const lampGooseneck = createBoxPrim(0.76, 1.20, 0.35, 0.016, 0.08, 0.12);
      const lampArm = createBoxPrim(0.65, 1.22, 0.38, 0.22, 0.016, 0.016);
      const lampHeadHousing = createBoxPrim(0.54, 1.22, 0.38, 0.26, 0.018, 0.038);
      const mergedLampMesh = mergeBoxPrims([lampBase, lampKnuckle1, lampStem, lampGooseneck, lampArm, lampHeadHousing]);
      uploadMeshPrimitive(mergedLampMesh.pos, mergedLampMesh.nrm, mergedLampMesh.uv, mergedLampMesh.idx, identity, {
        name: 'ARCHITECTURAL_GOOSENECK_LAMP',
        baseColor: [0.10, 0.10, 0.11, 1],
        metallic: 0.88,
        roughness: 0.24,
        castShadow: true
      });

      const lampDiffuser = createBoxPrim(0.54, 1.208, 0.38, 0.24, 0.006, 0.024);
      uploadMeshPrimitive(lampDiffuser.pos, lampDiffuser.nrm, lampDiffuser.uv, lampDiffuser.idx, identity, {
        name: 'DESK_LAMP_LINEAR_LED_BAR',
        baseColor: [1.0, 0.94, 0.82, 1],
        emissive: [3.8, 2.8, 1.6],
        roughness: 0.1,
        castShadow: false
      });

      const paperSheet1 = createBoxPrim(0.56, 0.815, 0.38, 0.30, 0.002, 0.24);
      const paperSheet2 = createBoxPrim(0.565, 0.818, 0.385, 0.295, 0.002, 0.235);
      const paperSheet3 = createBoxPrim(0.558, 0.821, 0.378, 0.29, 0.002, 0.23);
      const mergedPaperStack = mergeBoxPrims([paperSheet1, paperSheet2, paperSheet3]);
      uploadMeshPrimitive(mergedPaperStack.pos, mergedPaperStack.nrm, mergedPaperStack.uv, mergedPaperStack.idx, identity, {
        name: 'STACKED_ARCHITECTURAL_BLUEPRINTS',
        texture: paperworkTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.58,
        castShadow: true
      });

      const rolledBlueprint = createBoxPrim(0.38, 0.832, 0.44, 0.046, 0.046, 0.28);
      uploadMeshPrimitive(rolledBlueprint.pos, rolledBlueprint.nrm, rolledBlueprint.uv, rolledBlueprint.idx, identity, {
        name: 'ROLLED_BLUEPRINT_DRAWING',
        baseColor: [0.65, 0.72, 0.78, 1],
        metallic: 0.0,
        roughness: 0.82,
        castShadow: true
      });

      const blueprintSheet1 = createBoxPrim(-0.25, 0.815, 0.28, 0.27, 0.002, 0.19);
      uploadMeshPrimitive(blueprintSheet1.pos, blueprintSheet1.nrm, blueprintSheet1.uv, blueprintSheet1.idx, identity, {
        name: 'BLUEPRINT_SPEC_SHEET',
        texture: paperworkTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.0,
        roughness: 0.65,
        castShadow: true
      });

      const pen = createBoxPrim(-0.40, 0.818, 0.28, 0.135, 0.008, 0.008);
      uploadMeshPrimitive(pen.pos, pen.nrm, pen.uv, pen.idx, identity, {
        name: 'BRASS_ARCHITECT_PEN',
        baseColor: [0.78, 0.64, 0.32, 1],
        metallic: 0.94,
        roughness: 0.18,
        castShadow: true
      });

      const ceramicCoaster = createBoxPrim(0.70, 0.816, 0.08, 0.095, 0.006, 0.095);
      const ceramicCup = createBoxPrim(0.70, 0.854, 0.08, 0.065, 0.072, 0.065);
      const mergedCup = mergeBoxPrims([ceramicCoaster, ceramicCup]);
      uploadMeshPrimitive(mergedCup.pos, mergedCup.nrm, mergedCup.uv, mergedCup.idx, identity, {
        name: 'STUDIO_CERAMIC_CUP',
        baseColor: [0.15, 0.17, 0.21, 1],
        metallic: 0.12,
        roughness: 0.36,
        castShadow: true
      });

      const calendarFace = createBoxPrim(-0.64, 0.854, 0.12, 0.11, 0.082, 0.008);
      uploadMeshPrimitive(calendarFace.pos, calendarFace.nrm, calendarFace.uv, calendarFace.idx, identity, {
        name: 'DESK_CALENDAR_FACE',
        texture: deskCalendarTex,
        baseColor: [1, 1, 1, 1],
        metallic: 0.1,
        roughness: 0.55,
        castShadow: true
      });

      const calendarStand = createBoxPrim(-0.64, 0.816, 0.12, 0.114, 0.008, 0.048);
      uploadMeshPrimitive(calendarStand.pos, calendarStand.nrm, calendarStand.uv, calendarStand.idx, identity, {
        name: 'DESK_CALENDAR_STAND',
        baseColor: [0.08, 0.09, 0.12, 1],
        metallic: 0.8,
        roughness: 0.25,
        castShadow: true
      });

      const globePedestal = createBoxPrim(0.96, 0.818, 0.14, 0.065, 0.012, 0.065);
      const globeGimbal = createBoxPrim(0.96, 0.854, 0.14, 0.014, 0.060, 0.014);
      const globeRing = createBoxPrim(0.96, 0.892, 0.14, 0.072, 0.072, 0.012);
      const mergedGlobeMount = mergeBoxPrims([globePedestal, globeGimbal, globeRing]);
      uploadMeshPrimitive(mergedGlobeMount.pos, mergedGlobeMount.nrm, mergedGlobeMount.uv, mergedGlobeMount.idx, identity, {
        name: 'DECORATIVE_GLOBE_BRASS_MOUNT',
        baseColor: [0.78, 0.65, 0.38, 1],
        metallic: 0.94,
        roughness: 0.18,
        castShadow: true
      });

      const globeSphere = createBoxPrim(0.96, 0.892, 0.14, 0.052, 0.052, 0.052);
      uploadMeshPrimitive(globeSphere.pos, globeSphere.nrm, globeSphere.uv, globeSphere.idx, identity, {
        name: 'DECORATIVE_GLOBE_SPHERE',
        baseColor: [0.12, 0.14, 0.18, 1],
        metallic: 0.45,
        roughness: 0.22,
        castShadow: true
      });

      const polyToy = createBoxPrim(-0.52, 0.832, 0.09, 0.038, 0.038, 0.038);
      uploadMeshPrimitive(polyToy.pos, polyToy.nrm, polyToy.uv, polyToy.idx, identity, {
        name: 'ARCHITECTURAL_POLYHEDRAL_ORNAMENT',
        baseColor: [0.85, 0.75, 0.45, 1],
        metallic: 0.96,
        roughness: 0.15,
        castShadow: true
      });

      const pendantGlow = createBoxPrim(0.0, 2.636, -0.04, 2.08, 0.01, 0.044);
      uploadMeshPrimitive(pendantGlow.pos, pendantGlow.nrm, pendantGlow.uv, pendantGlow.idx, identity, {
        name: 'PENDANT_DIFFUSER',
        baseColor: [1, 0.95, 0.88, 1],
        emissive: [2.8, 2.35, 1.85],
        roughness: 0.2,
        castShadow: false
      });

      const ceilingBox = createBoxPrim(0, 3.42, 0.5, 10.5, 0.04, 8.2);
      uploadMeshPrimitive(ceilingBox.pos, ceilingBox.nrm, ceilingBox.uv, ceilingBox.idx, identity, {
        name: 'STUDIO_CEILING',
        baseColor: [0.05, 0.055, 0.07, 1],
        metallic: 0.05,
        roughness: 0.85,
        castShadow: false
      });
    }

    // =========================================================================
    // 7. LOAD & PARSE ACTUAL BINARY GLB (\`computer_and_laptop.glb\`)
    // =========================================================================
    async function unpackGLBBuffer() {
      const binStr = atob(EMBEDDED_GLB_GZ_B64);
      const gzBytes = new Uint8Array(binStr.length);
      for (let i = 0; i < binStr.length; i++) gzBytes[i] = binStr.charCodeAt(i);
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      writer.write(gzBytes);
      writer.close();
      return await new Response(ds.readable).arrayBuffer();
    }

    async function loadWorkstationGLB() {
      if (typeof EMBEDDED_GLB_GZ_B64 === 'undefined' || !EMBEDDED_GLB_GZ_B64) {
        console.warn('Embedded GLB buffer not defined');
        return;
      }
      const arrayBuffer = await unpackGLBBuffer();

      const dv = new DataView(arrayBuffer);
      const magic = dv.getUint32(0, true);
      if (magic !== 0x46546C67) throw new Error('Invalid GLB header');
      const chunk0Len = dv.getUint32(12, true);
      const jsonBytes = new Uint8Array(arrayBuffer, 20, chunk0Len);
      const gltf = JSON.parse(new TextDecoder('utf-8').decode(jsonBytes));
      const binStart = 28 + chunk0Len;

      const glTextures = [];
      for (let i = 0; i < (gltf.images || []).length; i++) {
        const imgMeta = gltf.images[i];
        const bv = gltf.bufferViews[imgMeta.bufferView];
        const slice = new Uint8Array(arrayBuffer, binStart + (bv.byteOffset || 0), bv.byteLength);
        const blob = new Blob([slice], { type: imgMeta.mimeType || 'image/jpeg' });
        let img = null;
        try {
          img = await createImageBitmap(blob, { imageOrientation: 'none', premultiplyAlpha: 'none' });
        } catch (e) {
          img = null;
        }

        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        if (img) {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
          gl.generateMipmap(gl.TEXTURE_2D);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
          if (anisoExt) gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, maxAniso);
        } else {
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([128,128,128,255]));
        }
        glTextures.push(tex);
      }

      const rootTransform = Mat4.fromTRS([0, 0.022, 0], [0, 0, 0, 1], [0.05, 0.05, 0.05]);

      function getNodeMatrix(node) {
        let mat = node.matrix ? new Float32Array(node.matrix) : null;
        if (!mat) {
          const t = node.translation || [0, 0, 0];
          const r = node.rotation || [0, 0, 0, 1];
          const s = node.scale || [1, 1, 1];
          mat = Mat4.fromTRS(t, r, s);
        }
        if (node.name && node.name.includes('CHAIR')) {
          mat[12] = -0.5;
          mat[14] = 16.8;
        }
        return mat;
      }

      function readAccessorFloat32(accIdx, numComps) {
        const acc = gltf.accessors[accIdx];
        const bv = gltf.bufferViews[acc.bufferView];
        const byteOffset = binStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
        const stride = bv.byteStride || numComps * 4;
        const count = acc.count;
        if (stride === numComps * 4) {
          return new Float32Array(arrayBuffer, byteOffset, count * numComps);
        }
        const out = new Float32Array(count * numComps);
        const view = new DataView(arrayBuffer);
        for (let i = 0; i < count; i++) {
          const base = byteOffset + i * stride;
          for (let c = 0; c < numComps; c++) {
            out[i * numComps + c] = view.getFloat32(base + c * 4, true);
          }
        }
        return out;
      }

      function readIndices(accIdx) {
        const acc = gltf.accessors[accIdx];
        const bv = gltf.bufferViews[acc.bufferView];
        const byteOffset = binStart + (bv.byteOffset || 0) + (acc.byteOffset || 0);
        if (acc.componentType === 5123) {
          return new Uint16Array(arrayBuffer, byteOffset, acc.count);
        } else if (acc.componentType === 5125) {
          return new Uint32Array(arrayBuffer, byteOffset, acc.count);
        }
        const u8 = new Uint8Array(arrayBuffer, byteOffset, acc.count);
        const out = new Uint16Array(acc.count);
        for (let i = 0; i < acc.count; i++) out[i] = u8[i];
        return out;
      }

      function traverseNode(nodeIdx, parentMat) {
        const node = gltf.nodes[nodeIdx];
        if (node.name && (node.name.includes('SPEAKER') || node.name.includes('BASS'))) {
          return;
        }

        const worldMat = Mat4.multiply(parentMat, getNodeMatrix(node));
        if (node.mesh !== undefined) {
          const mesh = gltf.meshes[node.mesh];
          for (const prim of mesh.primitives) {
            const mat = gltf.materials[prim.material] || {};
            const matName = mat.name || '';
            if (matName === 'SPEAKER-0' || matName === 'BASS-0') {
              continue;
            }

            const pos = readAccessorFloat32(prim.attributes.POSITION, 3);
            const nrm = readAccessorFloat32(prim.attributes.NORMAL, 3);
            const uv = readAccessorFloat32(prim.attributes.TEXCOORD_0, 2);
            const idx = readIndices(prim.indices);

            const pbr = mat.pbrMetallicRoughness || {};
            let tex = null;
            if (pbr.baseColorTexture !== undefined) {
              const tObj = gltf.textures[pbr.baseColorTexture.index];
              tex = glTextures[tObj.source];
            }

            const isCenterMonitor = (matName === '2PIC-0');
            const isLeftMonitor = (matName === '1PIC-0');
            const isRightMonitor = (matName === '3PIC-0');
            const isLaptopScreen = (matName === 'SCREEN-0.001');
            const isDeskSurface = (matName === 'DESK-0');
            const isDeskMat = (matName === 'MAT-0');
            const isComputerTower = (matName === 'COMPUTER-0' || matName === '1COMPUTER-0');
            const isKeyboard = (matName === '2KB-0' || matName === '1KB-BASE-0.001' || matName === '1KEYS-0.001');

            let finalTex = tex;
            let finalRoughness = pbr.roughnessFactor !== undefined ? pbr.roughnessFactor : 0.45;
            let finalMetallic = pbr.metallicFactor !== undefined ? pbr.metallicFactor : 0.25;
            let finalBaseColor = pbr.baseColorFactor || [1, 1, 1, 1];
            let finalEmissive = mat.emissiveFactor || [0, 0, 0];

            if (isCenterMonitor) {
              finalTex = monitor2BrandTexNormal;
              finalRoughness = 0.12;
              finalMetallic = 0.05;
              finalEmissive = [0.85, 0.85, 0.90];
            } else if (isLeftMonitor) {
              finalTex = monitor1ProjectsTex;
              finalRoughness = 0.12;
              finalMetallic = 0.05;
              finalEmissive = [0.85, 0.85, 0.90];
            } else if (isRightMonitor) {
              finalTex = monitor3ServicesTex;
              finalRoughness = 0.12;
              finalMetallic = 0.05;
              finalEmissive = [0.85, 0.85, 0.90];
            } else if (isLaptopScreen) {
              finalTex = laptopScreenTex;
              finalRoughness = 0.15;
              finalMetallic = 0.05;
              finalEmissive = [0.85, 0.85, 0.90];
            } else if (isDeskSurface) {
              finalTex = deskWoodTex;
              finalRoughness = 0.38;
              finalMetallic = 0.08;
            } else if (isDeskMat) {
              finalBaseColor = [0.18, 0.20, 0.24, 1];
              finalRoughness = 0.48;
              finalMetallic = 0.06;
            } else if (isComputerTower) {
              finalBaseColor = [0.12, 0.13, 0.16, 1];
              finalMetallic = 0.88;
              finalRoughness = 0.22;
            } else if (isKeyboard) {
              finalBaseColor = matName.includes('KEYS') ? [0.17, 0.18, 0.21, 1] : [0.08, 0.09, 0.11, 1];
              finalMetallic = 0.22;
              finalRoughness = matName.includes('KEYS') ? 0.65 : 0.35;
            }

            uploadMeshPrimitive(pos, nrm, uv, idx, worldMat, {
              name: matName,
              texture: finalTex,
              baseColor: finalBaseColor,
              emissive: finalEmissive,
              metallic: finalMetallic,
              roughness: finalRoughness,
              castShadow: matName !== 'MAT-0',
              isMonitorScreen: (isCenterMonitor || isLeftMonitor || isRightMonitor || isLaptopScreen) ? 1 : 0,
              isCenterMonitor
            });
          }
        }
        for (const childIdx of (node.children || [])) {
          traverseNode(childIdx, worldMat);
        }
      }

      for (const rootIdx of gltf.scenes[0].nodes) {
        traverseNode(rootIdx, rootTransform);
      }
    }

    // =========================================================================
    // 8. CAMERA RIG & CINEMATIC ENTER REVEAL TRANSITION
    // =========================================================================
    const CAMERA_VIEWS = {
      entryway: {
        pos: [-0.85, 1.55, 2.45],
        target: [0.02, 1.05, -0.05],
        fov: 54
      },
      overview: {
        pos: [-0.38, 1.30, 1.86],
        target: [0.00, 1.05, -0.05],
        fov: 52
      },
      desk: {
        pos: [-0.35, 1.40, 1.70],
        target: [0.0, 1.02, -0.10],
        fov: 42
      },
      monitor: {
        pos: [0.0, 1.12, 0.65],
        target: [0.0, 1.11, -0.288],
        fov: 38
      },
      monitor1: {
        pos: [-0.44, 1.12, 0.58],
        target: [-0.48, 1.11, -0.26],
        fov: 36
      },
      monitor2: {
        pos: [0.0, 1.12, 0.62],
        target: [0.0, 1.11, -0.288],
        fov: 36
      },
      monitor3: {
        pos: [0.44, 1.12, 0.58],
        target: [0.48, 1.11, -0.26],
        fov: 36
      },
      laptop: {
        pos: [-0.88, 1.05, 0.66],
        target: [-0.92, 0.94, 0.42],
        fov: 38
      }
    };

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener('change', (e) => { reducedMotion = e.matches; });

    const startViewKey = (options.initialView && CAMERA_VIEWS[options.initialView]) ? options.initialView : 'overview';
    let activeView = startViewKey;
    let hasEntered = (startViewKey !== 'entryway');
    let isTransitioning = false;
    let transitionStartTime = 0;
    const TRANSITION_DURATION = 2200;

    const initialPose = CAMERA_VIEWS[startViewKey];
    const camPos = new Float32Array(initialPose.pos);
    const camTarget = new Float32Array(initialPose.target);
    let camFov = initialPose.fov;
    let introReveal = hasEntered ? 1.0 : 0.0;
    let targetIntroReveal = 1.0;

    let pointerNormX = 0, pointerNormY = 0;
    let isMonitorHovered = false;
    let monitorHoverGlow = 0;
    let warmLightingMode = 1;
    let targetWarmLightingMode = 1;
    let isContactOpen = false;

    const MONITOR_ANCHOR_3D = [0.0, 1.11, -0.26];
    const MONITOR_1_BBOX_MIN = [-0.82, 0.82, -0.42];
    const MONITOR_1_BBOX_MAX = [-0.18, 1.42,  0.12];
    const MONITOR_2_BBOX_MIN = [-0.18, 0.82, -0.42];
    const MONITOR_2_BBOX_MAX = [ 0.18, 1.42, -0.10];
    const MONITOR_3_BBOX_MIN = [ 0.20, 0.82, -0.42];
    const MONITOR_3_BBOX_MAX = [ 0.82, 1.42,  0.12];
    const MONITOR_BBOX_MIN = [-1.22, 0.80, -0.42];
    const MONITOR_BBOX_MAX = [ 1.22, 1.42,  0.18];
    const LAPTOP_BBOX_MIN = [-1.28, 0.72, 0.16];
    const LAPTOP_BBOX_MAX = [-0.62, 1.20, 0.74];

    function cinematicEase(t) {
      return 1 - Math.pow(1 - t, 3.4);
    }

    function startCinematicEntrance(durationMs = TRANSITION_DURATION) {
      if (isTransitioning) return;
      hasEntered = true;
      isTransitioning = true;
      transitionStartTime = performance.now();
      targetIntroReveal = 1.0;
      activeView = 'overview';
      camPos[0] = CAMERA_VIEWS.entryway.pos[0];
      camPos[1] = CAMERA_VIEWS.entryway.pos[1];
      camPos[2] = CAMERA_VIEWS.entryway.pos[2];
      camTarget[0] = CAMERA_VIEWS.entryway.target[0];
      camTarget[1] = CAMERA_VIEWS.entryway.target[1];
      camTarget[2] = CAMERA_VIEWS.entryway.target[2];
      camFov = CAMERA_VIEWS.entryway.fov;
      introReveal = 0.0;
      scheduleRender();
    }
    function startEnterTransition() {
      startCinematicEntrance();
    }

    function unprojectRay(clientX, clientY, invViewProj) {
      const rect = canvas.getBoundingClientRect();
      const nx = ((clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((clientY - rect.top) / rect.height) * 2 - 1);

      function transformPt(z) {
        const x = invViewProj[0]*nx + invViewProj[4]*ny + invViewProj[8]*z + invViewProj[12];
        const y = invViewProj[1]*nx + invViewProj[5]*ny + invViewProj[9]*z + invViewProj[13];
        const zp = invViewProj[2]*nx + invViewProj[6]*ny + invViewProj[10]*z + invViewProj[14];
        const w = invViewProj[3]*nx + invViewProj[7]*ny + invViewProj[11]*z + invViewProj[15] || 1;
        return [x/w, y/w, zp/w];
      }
      const pNear = transformPt(-1);
      const pFar = transformPt(1);
      const dx = pFar[0] - pNear[0], dy = pFar[1] - pNear[1], dz = pFar[2] - pNear[2];
      const len = Math.hypot(dx, dy, dz) || 1;
      return { orig: pNear, dir: [dx/len, dy/len, dz/len] };
    }

    function intersectRayAABB(orig, dir, bmin, bmax) {
      let tmin = -Infinity, tmax = Infinity;
      for (let i = 0; i < 3; i++) {
        if (Math.abs(dir[i]) < 1e-6) {
          if (orig[i] < bmin[i] || orig[i] > bmax[i]) return false;
        } else {
          let t1 = (bmin[i] - orig[i]) / dir[i];
          let t2 = (bmax[i] - orig[i]) / dir[i];
          if (t1 > t2) { const tmp = t1; t1 = t2; t2 = tmp; }
          tmin = Math.max(tmin, t1);
          tmax = Math.min(tmax, t2);
          if (tmin > tmax) return false;
        }
      }
      return tmax > 0;
    }

    function project3DToScreen(pt, viewProj, width, height) {
      const x = viewProj[0]*pt[0] + viewProj[4]*pt[1] + viewProj[8]*pt[2] + viewProj[12];
      const y = viewProj[1]*pt[0] + viewProj[5]*pt[1] + viewProj[9]*pt[2] + viewProj[13];
      const w = viewProj[3]*pt[0] + viewProj[7]*pt[1] + viewProj[11]*pt[2] + viewProj[15];
      if (w <= 0.05) return null;
      const sx = ((x / w) * 0.5 + 0.5) * width;
      const sy = (-(y / w) * 0.5 + 0.5) * height;
      return [sx, sy];
    }

    function setCameraView(mode, openFormIfMonitor = false) {
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
    }

    function openContactModal() {
      isContactOpen = true;
      if (options.onModalTrigger) {
        options.onModalTrigger();
      }
      scheduleRender();
    }

    function closeContactModal(returnToOverview = true) {
      isContactOpen = false;
      if (hasEntered) {
        if (returnToOverview && (activeView.startsWith('monitor') || activeView === 'laptop')) {
          setCameraView('overview', false);
        }
      }
      scheduleRender();
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isContactOpen) {
        closeContactModal(true);
      }
    });

    window.addEventListener('pointermove', (e) => {
      pointerNormX = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNormY = -((e.clientY / window.innerHeight) * 2 - 1);

      if (hasEntered && !isContactOpen && currentInvViewProj) {
        const ray = unprojectRay(e.clientX, e.clientY, currentInvViewProj);
        const hitLap = intersectRayAABB(ray.orig, ray.dir, LAPTOP_BBOX_MIN, LAPTOP_BBOX_MAX);
        const hitM1 = intersectRayAABB(ray.orig, ray.dir, MONITOR_1_BBOX_MIN, MONITOR_1_BBOX_MAX);
        const hitM2 = intersectRayAABB(ray.orig, ray.dir, MONITOR_2_BBOX_MIN, MONITOR_2_BBOX_MAX);
        const hitM3 = intersectRayAABB(ray.orig, ray.dir, MONITOR_3_BBOX_MIN, MONITOR_3_BBOX_MAX);
        const hitMon = intersectRayAABB(ray.orig, ray.dir, MONITOR_BBOX_MIN, MONITOR_BBOX_MAX);
        const hit = hitLap || hitM1 || hitM2 || hitM3 || hitMon;
        if (hit !== isMonitorHovered) {
          isMonitorHovered = hit;
          canvas.style.cursor = hit ? 'pointer' : 'default';
        }
      }
      scheduleRender();
    }, { passive: true });

    canvas.addEventListener('click', (e) => {
      if (!hasEntered) {
        startEnterTransition();
        return;
      }
      if (!isContactOpen) {
        if (currentInvViewProj) {
          const ray = unprojectRay(e.clientX, e.clientY, currentInvViewProj);
          const hitLap = intersectRayAABB(ray.orig, ray.dir, LAPTOP_BBOX_MIN, LAPTOP_BBOX_MAX);
          const hitM1 = intersectRayAABB(ray.orig, ray.dir, MONITOR_1_BBOX_MIN, MONITOR_1_BBOX_MAX);
          const hitM3 = intersectRayAABB(ray.orig, ray.dir, MONITOR_3_BBOX_MIN, MONITOR_3_BBOX_MAX);
          const hitM2 = intersectRayAABB(ray.orig, ray.dir, MONITOR_2_BBOX_MIN, MONITOR_2_BBOX_MAX);
          const hitMon = intersectRayAABB(ray.orig, ray.dir, MONITOR_BBOX_MIN, MONITOR_BBOX_MAX);

          if (hitLap) {
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
          }
        }
      }
    });

    // =========================================================================
    // 10. 60 FPS COORDINATED RENDER LOOP & PERFORMANCE CONTROLS
    // =========================================================================
    let renderRequested = false;
    let lastRenderTime = performance.now();
    let shadowMapDirty = true;
    let rafId = null;

    function scheduleRender() {
      if (!renderRequested) {
        renderRequested = true;
        rafId = requestAnimationFrame(renderFrame);
      }
    }

    function resizeCanvas() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        shadowMapDirty = true;
      }
    }

    function renderFrame(now) {
      renderRequested = false;
      const dt = Math.min(now - lastRenderTime, 100);
      lastRenderTime = now;

      resizeCanvas();

      if (isTransitioning) {
        const elapsed = now - transitionStartTime;
        const progress = Math.min(elapsed / TRANSITION_DURATION, 1.0);
        const ease = reducedMotion ? 1.0 : cinematicEase(progress);

        const targetPose = CAMERA_VIEWS.overview;
        const startPose = CAMERA_VIEWS.entryway;

        for (let i = 0; i < 3; i++) {
          camPos[i] = startPose.pos[i] + (targetPose.pos[i] - startPose.pos[i]) * ease;
          camTarget[i] = startPose.target[i] + (targetPose.target[i] - startPose.target[i]) * ease;
        }
        camFov = startPose.fov + (targetPose.fov - startPose.fov) * ease;
        introReveal = ease;

        if (progress >= 1.0) {
          isTransitioning = false;
          introReveal = 1.0;
        }
        scheduleRender();
      } else {
        const targetPose = CAMERA_VIEWS[activeView] || CAMERA_VIEWS.overview;
        const smoothRate = reducedMotion ? 1.0 : 0.08;

        const maxOffset = 0.035;
        const targetX = targetPose.pos[0] + (pointerNormX * maxOffset);
        const targetY = targetPose.pos[1] + (pointerNormY * maxOffset * 0.7);

        camPos[0] += (targetX - camPos[0]) * smoothRate;
        camPos[1] += (targetY - camPos[1]) * smoothRate;
        camPos[2] += (targetPose.pos[2] - camPos[2]) * smoothRate;

        camTarget[0] += (targetPose.target[0] - camTarget[0]) * smoothRate;
        camTarget[1] += (targetPose.target[1] - camTarget[1]) * smoothRate;
        camTarget[2] += (targetPose.target[2] - camTarget[2]) * smoothRate;

        camFov += (targetPose.fov - camFov) * smoothRate;
        introReveal += (targetIntroReveal - introReveal) * 0.08;
      }

      warmLightingMode += (targetWarmLightingMode - warmLightingMode) * 0.08;
      const targetHoverGlow = isMonitorHovered ? 1.0 : 0.0;
      monitorHoverGlow += (targetHoverGlow - monitorHoverGlow) * 0.12;

      // 1. Shadow Map Pass (Rendered only when dirty or transitioning)
      if (shadowMapDirty || isTransitioning) {
        gl.bindFramebuffer(gl.FRAMEBUFFER, shadowFBO);
        gl.viewport(0, 0, SHADOW_RES, SHADOW_RES);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        gl.useProgram(shadowProg);

        const keyPos = [1.15, 3.15, 1.55];
        Mat4.lookAt(keyPos, [0.0, 1.0, 0.0], [0, 1, 0], scratchLightView);
        Mat4.ortho(-3.2, 3.2, -2.6, 2.6, 0.5, 9.5, scratchLightProj);
        Mat4.multiply(scratchLightProj, scratchLightView, scratchLightSpace);
        gl.uniformMatrix4fv(shadowUniforms.lightSpaceMatrix, false, scratchLightSpace);

        for (const dc of drawCalls) {
          if (!dc.castShadow) continue;
          gl.uniformMatrix4fv(shadowUniforms.model, false, dc.worldMatrix);
          gl.bindVertexArray(dc.vao);
          gl.drawElements(gl.TRIANGLES, dc.indexCount, gl.UNSIGNED_SHORT, 0);
        }
        shadowMapDirty = false;
      }

      // 2. Main PBR Pass
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.02, 0.025, 0.035, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);

      const aspect = canvas.width / canvas.height;
      Mat4.perspective((camFov * Math.PI) / 180, aspect, 0.1, 35.0, scratchProj);
      Mat4.lookAt(camPos, camTarget, [0, 1, 0], scratchView);
      Mat4.multiply(scratchProj, scratchView, scratchViewProj);

      Mat4.invert(scratchViewProj, scratchInvViewProj);
      currentInvViewProj = scratchInvViewProj;

      gl.useProgram(pbrProg);
      gl.uniformMatrix4fv(pbrUniforms.viewProj, false, scratchViewProj);
      gl.uniformMatrix4fv(pbrUniforms.lightSpaceMatrix, false, scratchLightSpace);
      gl.uniform3fv(pbrUniforms.cameraPos, camPos);
      gl.uniform1f(pbrUniforms.warmMode, warmLightingMode);
      gl.uniform1f(pbrUniforms.monitorHoverGlow, monitorHoverGlow);
      gl.uniform1f(pbrUniforms.introReveal, introReveal);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, shadowTex);
      gl.uniform1i(pbrUniforms.shadowMap, 1);

      for (const dc of drawCalls) {
        gl.uniformMatrix4fv(pbrUniforms.model, false, dc.worldMatrix);
        gl.uniformMatrix3fv(pbrUniforms.normalMatrix, false, dc.normalMatrix);
        gl.uniform4fv(pbrUniforms.baseColorFactor, dc.baseColorFactor);
        gl.uniform3fv(pbrUniforms.emissiveFactor, dc.emissiveFactor);
        gl.uniform1f(pbrUniforms.metallic, dc.metallic);
        gl.uniform1f(pbrUniforms.roughness, dc.roughness);
        gl.uniform1i(pbrUniforms.isMonitorScreen, dc.isMonitorScreen);

        if (dc.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, (dc.isCenterMonitor && isMonitorHovered) ? monitor2BrandTexHover : dc.texture);
          gl.uniform1i(pbrUniforms.baseColorTex, 0);
          gl.uniform1i(pbrUniforms.hasTexture, 1);
        } else {
          gl.uniform1i(pbrUniforms.hasTexture, 0);
        }

        gl.bindVertexArray(dc.vao);
        gl.drawElements(gl.TRIANGLES, dc.indexCount, gl.UNSIGNED_SHORT, 0);
      }

      if (isTransitioning || Math.abs(introReveal - targetIntroReveal) > 0.001 || Math.hypot(camPos[0] - CAMERA_VIEWS[activeView]?.pos[0] || 0, camPos[1] - CAMERA_VIEWS[activeView]?.pos[1] || 0) > 0.001) {
        scheduleRender();
      }
    }

    // =========================================================================
    // 11. BOOT SEQUENCE
    // =========================================================================
    (async function initStudio() {
      try {
        buildArchitecturalRoom();
        await loadWorkstationGLB();
        shadowMapDirty = true;
        scheduleRender();
        if (options.onSceneReady) options.onSceneReady();
      } catch (err) {
        console.error('Failed to initialize 3D studio:', err);
      }
    })();

    return {
      startCinematicEntrance,
      setCameraView,
      openContactModal,
      closeContactModal,
      scheduleRender,
      dispose() {
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };
}

// Embedded binary GLB buffer definition
const EMBEDDED_GLB_GZ_B64 = "${glbBase64}";
`;

fs.writeFileSync(path.join(__dirname, '../src/components/studioEngine.js'), studioEngineCode, 'utf8');
console.log('Successfully built pristine studioEngine.js');
