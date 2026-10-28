const THREE = require('three');

// Replicate camera setup from studioEngine.js
const fov = 62;
const aspect = 1440 / 800; // standard desktop viewport
const camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 2000);
camera.position.set(0, 0, 0.1);
camera.lookAt(0, 0, -500);
camera.updateMatrixWorld(true);

function toScreen(x, y, z) {
  const v = new THREE.Vector3(x, y, z);
  v.project(camera);
  const sx = (v.x * 0.5 + 0.5) * 1440;
  const sy = (-v.y * 0.5 + 0.5) * 800;
  return { sx: Math.round(sx), sy: Math.round(sy) };
}

console.log('Center Monitor (15, -33, -485):', toScreen(15, -33, -485));
console.log('Left Monitor (-165, -35, -455):', toScreen(-165, -35, -455));
console.log('Right Monitor (195, -35, -445):', toScreen(195, -35, -445));

// Test proposed board positions:
// Top Left: HOSTING & DEPLOYMENT (-285, 125, -500)
// Bottom Left: UI / UX DESIGN (-285, 40, -500)
// Top Right: WEBSITE MANAGEMENT (285, 125, -500)
// Bottom Right: WEBSITE DEVELOPMENT (285, 40, -500)
console.log('Top Left Board (-285, 125, -500):', toScreen(-285, 125, -500));
console.log('Bottom Left Board (-285, 40, -500):', toScreen(-285, 40, -500));
console.log('Top Right Board (285, 125, -500):', toScreen(285, 125, -500));
console.log('Bottom Right Board (285, 40, -500):', toScreen(285, 40, -500));
