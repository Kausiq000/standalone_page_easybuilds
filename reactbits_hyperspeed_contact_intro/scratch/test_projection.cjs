const THREE = require('three');

// Setup camera matching studioEngine
const camera = new THREE.PerspectiveCamera(62, 1920 / 1080, 0.5, 2000);
camera.position.set(0, 0, 0);
camera.rotation.order = 'YXZ';
camera.rotation.set(0, 0, 0);
camera.updateMatrixWorld(true);

const boxes = {
  hosting: { center: [-315.8, 181.9, -435.5], size: [147.0, 99.7] },
  uiux: { center: [-315.8, 70.7, -435.5], size: [147.0, 99.7] },
  management: { center: [298.1, 181.9, -446.2], size: [147.0, 99.7] },
  webdev: { center: [298.1, 70.7, -446.2], size: [147.0, 99.7] },
  leftMon: { center: [-257.2, -98.1, -465.6], size: [293.5, 199.4] },
  centerMon: { center: [39.2, -96.2, -499.6], size: [303.8, 195.6] },
  rightMon: { center: [330.7, -98.1, -425.1], size: [291.8, 199.4] }
};

for (const [key, b] of Object.entries(boxes)) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(b.size[0], b.size[1]));
  mesh.position.set(...b.center);
  mesh.lookAt(0, b.center[1], 0);
  mesh.updateMatrixWorld(true);

  // Project corners
  const v = new THREE.Vector3(...b.center);
  v.project(camera);
  const screenX = (v.x * 0.5 + 0.5) * 1920;
  const screenY = (-v.y * 0.5 + 0.5) * 1080;
  console.log(`${key}: screen center = (${screenX.toFixed(1)}, ${screenY.toFixed(1)})`);
}
