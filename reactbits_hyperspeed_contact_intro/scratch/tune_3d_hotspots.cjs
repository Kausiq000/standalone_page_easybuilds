const THREE = require('three');

const width = 1920;
const height = 912;
const camera = new THREE.PerspectiveCamera(62, width / height, 0.5, 2000);
camera.position.set(0, 0, 0);
camera.rotation.set(0, 0, 0);
camera.updateMatrixWorld(true);

function testMesh(geoW, geoH, posX, posY, posZ, rotY) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(geoW, geoH));
  mesh.position.set(posX, posY, posZ);
  mesh.rotation.y = rotY;
  mesh.updateMatrixWorld(true);
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const corners = [
    new THREE.Vector3(box.min.x, box.min.y, 0).applyMatrix4(mesh.matrixWorld),
    new THREE.Vector3(box.max.x, box.min.y, 0).applyMatrix4(mesh.matrixWorld),
    new THREE.Vector3(box.max.x, box.max.y, 0).applyMatrix4(mesh.matrixWorld),
    new THREE.Vector3(box.min.x, box.max.y, 0).applyMatrix4(mesh.matrixWorld),
  ];
  const screenCorners = corners.map(c => {
    c.project(camera);
    return { x: (c.x * 0.5 + 0.5) * width, y: (-c.y * 0.5 + 0.5) * height };
  });
  const xs = screenCorners.map(c => c.x);
  const ys = screenCorners.map(c => c.y);
  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    w: Math.max(...xs) - Math.min(...xs),
    h: Math.max(...ys) - Math.min(...ys),
    cx: (Math.max(...xs) + Math.min(...xs)) / 2,
    cy: (Math.max(...ys) + Math.min(...ys)) / 2
  };
}

// Target:
// Hosting: x in [320, 625], y in [68, 226]
console.log('Hosting target: x in [320, 625], y in [68, 226]');
console.log('Hosting test 1:', testMesh(175, 115, -280, 200, -500, 0.12));
console.log('Hosting test 2:', testMesh(185, 120, -285, 205, -500, 0.12));

// UIUX: x in [320, 625], y in [232, 390]
console.log('\nUIUX target: x in [320, 625], y in [232, 390]');
console.log('UIUX test 1:', testMesh(185, 120, -285, 95, -500, 0.12));

// Management: x in [1380, 1710], y in [42, 218]
console.log('\nMgmt target: x in [1380, 1710], y in [42, 218]');
console.log('Mgmt test 1:', testMesh(195, 125, 305, 210, -500, -0.12));

// WebDev: x in [1380, 1710], y in [215, 395]
console.log('\nWebDev target: x in [1380, 1710], y in [215, 395]');
console.log('WebDev test 1:', testMesh(195, 125, 305, 100, -500, -0.12));

// Center Mon: x in [830, 1285], y in [460, 740]
console.log('\nCenter Mon target: x in [830, 1285], y in [460, 740]');
console.log('Center Mon test 1:', testMesh(275, 170, 58, -70, -485, 0));

// Left Mon: x in [275, 830], y in [450, 765]
console.log('\nLeft Mon target: x in [275, 830], y in [450, 765]');
console.log('Left Mon test 1:', testMesh(310, 185, -200, -70, -445, 0.28));

// Right Mon: x in [1285, 1920], y in [440, 805]
console.log('\nRight Mon target: x in [1285, 1920], y in [440, 805]');
console.log('Right Mon test 1:', testMesh(340, 195, 255, -70, -430, -0.32));
