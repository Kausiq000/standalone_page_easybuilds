const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '../src/components/studioEngine.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Refine createIvoryStoneCanvas to have warm honed travertine tone and clear engraved tagline
const oldIvoryCanvasStart = code.indexOf('function createIvoryStoneCanvas() {');
const oldIvoryCanvasEnd = code.indexOf('function createChampagneBrassCanvas() {', oldIvoryCanvasStart);

const newIvoryCanvas = `function createIvoryStoneCanvas() {
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

    `;

code = code.substring(0, oldIvoryCanvasStart) + newIvoryCanvas + code.substring(oldIvoryCanvasEnd);

// 2. Refine generate3DLetterMeshes for clean, crisp, bold sans letter geometry
const oldLettersStart = code.indexOf('function generate3DLetterMeshes(');
const oldLettersEnd = code.indexOf('function buildArchitecturalRoom() {', oldLettersStart);

const newLetters = `function generate3DLetterMeshes(cx, cy, cz, totalW, letterH, depth) {
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

    `;

code = code.substring(0, oldLettersStart) + newLetters + code.substring(oldLettersEnd);

// 3. Remove duplicate taglinePlate in buildArchitecturalRoom (it's engraved cleanly on ivory stone)
const oldPlaqueRoomStart = code.indexOf('// A. PHYSICAL WARM IVORY WALL PLAQUE & DIMENSIONAL 3D EASYBUILDS WORDMARK');
const oldPlaqueRoomEnd = code.indexOf('// B. FOUR ARCHITECTURAL SERVICE FRAMES', oldPlaqueRoomStart);

const newPlaqueRoom = `// A. PHYSICAL WARM IVORY WALL PLAQUE & DIMENSIONAL 3D EASYBUILDS WORDMARK
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

      // =======================================================================
      `;

code = code.substring(0, oldPlaqueRoomStart) + newPlaqueRoom + code.substring(oldPlaqueRoomEnd);

// 4. Refine Left Desk Plant (Ceramic Pot + Upright Tropical Broad Leaves)
const oldPlantStart = code.indexOf('// Left Indoor Desk Plant');
const oldPlantEnd = code.indexOf('// Top-Right Shelf Trailing Ivy', oldPlantStart);

const newPlant = `// Left Indoor Desk Plant (Fluted Dark Ceramic Pot + Upright Broad Tropical Foliage)
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
        { ang: 15,  dist: 0.12, yOffset: 0.32, w: 0.14, h: 0.18, tiltX: 0.02, tiltZ: 0.05 },
        { ang: 60,  dist: 0.14, yOffset: 0.38, w: 0.16, h: 0.20, tiltX: 0.04, tiltZ: 0.04 },
        { ang: 110, dist: 0.13, yOffset: 0.44, w: 0.15, h: 0.22, tiltX: 0.05, tiltZ: -0.02 },
        { ang: 160, dist: 0.15, yOffset: 0.50, w: 0.16, h: 0.24, tiltX: 0.03, tiltZ: -0.05 },
        { ang: 210, dist: 0.13, yOffset: 0.54, w: 0.15, h: 0.22, tiltX: -0.03, tiltZ: -0.04 },
        { ang: 260, dist: 0.14, yOffset: 0.48, w: 0.16, h: 0.20, tiltX: -0.05, tiltZ: -0.01 },
        { ang: 310, dist: 0.12, yOffset: 0.42, w: 0.15, h: 0.19, tiltX: -0.04, tiltZ: 0.04 },
        { ang: 355, dist: 0.14, yOffset: 0.56, w: 0.16, h: 0.24, tiltX: 0.01, tiltZ: 0.06 },
        { ang: 40,  dist: 0.08, yOffset: 0.62, w: 0.14, h: 0.22, tiltX: 0.02, tiltZ: 0.03 },
        { ang: 130, dist: 0.09, yOffset: 0.66, w: 0.14, h: 0.23, tiltX: 0.03, tiltZ: -0.02 },
        { ang: 220, dist: 0.08, yOffset: 0.70, w: 0.14, h: 0.22, tiltX: -0.02, tiltZ: -0.03 },
        { ang: 300, dist: 0.07, yOffset: 0.74, w: 0.13, h: 0.20, tiltX: -0.02, tiltZ: 0.02 },
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

      `;

code = code.substring(0, oldPlantStart) + newPlant + code.substring(oldPlantEnd);

// 5. Expand device bounding boxes for generous, responsive hit testing
const oldBbox = `    const MONITOR_1_BBOX_MIN = [-0.75, 0.88, -0.36];
    const MONITOR_1_BBOX_MAX = [-0.20, 1.36,  0.05];
    const MONITOR_2_BBOX_MIN = [-0.20, 0.88, -0.36];
    const MONITOR_2_BBOX_MAX = [ 0.20, 1.36, -0.15];
    const MONITOR_3_BBOX_MIN = [ 0.20, 0.88, -0.36];
    const MONITOR_3_BBOX_MAX = [ 0.75, 1.36,  0.05];
    const MONITOR_BBOX_MIN = [-1.18, 0.84, -0.34];
    const MONITOR_BBOX_MAX = [ 1.18, 1.36,  0.15];
    const LAPTOP_BBOX_MIN = [-1.15, 0.78, 0.22];
    const LAPTOP_BBOX_MAX = [-0.68, 1.12, 0.68];`;

const newBbox = `    const MONITOR_1_BBOX_MIN = [-0.82, 0.82, -0.42];
    const MONITOR_1_BBOX_MAX = [-0.18, 1.42,  0.12];
    const MONITOR_2_BBOX_MIN = [-0.18, 0.82, -0.42];
    const MONITOR_2_BBOX_MAX = [ 0.18, 1.42, -0.10];
    const MONITOR_3_BBOX_MIN = [ 0.18, 0.82, -0.42];
    const MONITOR_3_BBOX_MAX = [ 0.82, 1.42,  0.12];
    const MONITOR_BBOX_MIN = [-1.22, 0.80, -0.42];
    const MONITOR_BBOX_MAX = [ 1.22, 1.42,  0.18];
    const LAPTOP_BBOX_MIN = [-1.28, 0.72, 0.16];
    const LAPTOP_BBOX_MAX = [-0.62, 1.20, 0.74];`;

code = code.replace(oldBbox, newBbox);

fs.writeFileSync(targetPath, code, 'utf8');
console.log('Successfully refined studioEngine.js');
