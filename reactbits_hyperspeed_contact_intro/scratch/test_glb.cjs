const fs = require('fs');
const zlib = require('zlib');
const html = fs.readFileSync('contactpage.html', 'utf8');
const match = html.match(/const\s+EMBEDDED_GLB_GZ_B64\s*=\s*"([^"]+)";/);
if (match) {
  const gzBuf = Buffer.from(match[1], 'base64');
  const glbBuf = zlib.gunzipSync(gzBuf);
  console.log('Uncompressed GLB size:', glbBuf.length);
  const jsonLen = glbBuf.readUInt32LE(12);
  const jsonBuf = glbBuf.slice(20, 20 + jsonLen);
  const gltf = JSON.parse(jsonBuf.toString('utf8'));
  console.log('GLB meshes:', gltf.meshes ? gltf.meshes.map(m => m.name) : []);
  console.log('GLB nodes:', gltf.nodes ? gltf.nodes.map(n => n.name) : []);
  console.log('GLB materials:', gltf.materials ? gltf.materials.map(m => m.name) : []);
  console.log('GLB images count:', gltf.images ? gltf.images.length : 0);
} else {
  console.log('No match found');
}
