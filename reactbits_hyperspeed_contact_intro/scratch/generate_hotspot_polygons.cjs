const THREE = require('three');
const fs = require('fs');

const width = 1920;
const height = 912;
const camera = new THREE.PerspectiveCamera(62, width / height, 0.5, 2000);
camera.position.set(0, 0, 0);
camera.rotation.set(0, 0, 0);
camera.updateMatrixWorld(true);

function getCorners(geoW, geoH, posX, posY, posZ, rotY) {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(geoW, geoH));
  mesh.position.set(posX, posY, posZ);
  mesh.rotation.y = rotY;
  mesh.updateMatrixWorld(true);
  mesh.geometry.computeBoundingBox();
  const box = mesh.geometry.boundingBox;
  const corners = [
    new THREE.Vector3(box.min.x, box.max.y, 0).applyMatrix4(mesh.matrixWorld), // top left
    new THREE.Vector3(box.max.x, box.max.y, 0).applyMatrix4(mesh.matrixWorld), // top right
    new THREE.Vector3(box.max.x, box.min.y, 0).applyMatrix4(mesh.matrixWorld), // bottom right
    new THREE.Vector3(box.min.x, box.min.y, 0).applyMatrix4(mesh.matrixWorld), // bottom left
  ];
  return corners.map(c => {
    c.project(camera);
    return [Math.round((c.x * 0.5 + 0.5) * width), Math.round((-c.y * 0.5 + 0.5) * height)];
  });
}

const hotspots = {
  hosting: { geo: [180, 105], pos: [-315, 195, -500], rot: 0.12, color: 'cyan' },
  uiux: { geo: [180, 105], pos: [-315, 95, -500], rot: 0.12, color: 'magenta' },
  management: { geo: [185, 110], pos: [370, 205, -500], rot: -0.12, color: 'lime' },
  webdev: { geo: [185, 110], pos: [370, 100, -500], rot: -0.12, color: 'gold' },
  centerMon: { geo: [280, 165], pos: [60, -85, -485], rot: 0, color: 'red' },
  leftMon: { geo: [290, 175], pos: [-225, -80, -450], rot: 0.28, color: 'orange' },
  rightMon: { geo: [310, 180], pos: [330, -80, -430], rot: -0.32, color: 'yellow' }
};

const result = {};
for (const [key, val] of Object.entries(hotspots)) {
  result[key] = {
    corners: getCorners(val.geo[0], val.geo[1], val.pos[0], val.pos[1], val.pos[2], val.rot),
    color: val.color
  };
}

fs.writeFileSync('scratch/projected_polygons.json', JSON.stringify(result, null, 2));
console.log('Projected polygons saved:');
console.log(JSON.stringify(result, null, 2));
