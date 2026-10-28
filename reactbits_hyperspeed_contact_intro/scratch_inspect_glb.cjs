const fs = require('fs');
const zlib = require('zlib');
const content = fs.readFileSync('contactpage.html', 'utf8');
const match = content.match(/const EMBEDDED_GLB_GZ_B64 = "([^"]+)"/);
if (match) {
  const buf = zlib.gunzipSync(Buffer.from(match[1], 'base64'));
  const jsonLen = buf.readUInt32LE(12);
  const jsonStr = buf.toString('utf8', 20, 20 + jsonLen);
  const gltf = JSON.parse(jsonStr);
  console.log('Meshes:', gltf.meshes ? gltf.meshes.map(m => m.name) : []);
  console.log('Materials:', gltf.materials ? gltf.materials.map(m => m.name) : []);
  console.log('Nodes count:', gltf.nodes ? gltf.nodes.length : 0);
  console.log('Scenes nodes:', gltf.scenes);
} else {
  console.log('No EMBEDDED_GLB_GZ_B64 match');
}
