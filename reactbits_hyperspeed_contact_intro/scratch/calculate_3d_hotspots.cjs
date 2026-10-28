const CYLINDER_RADIUS = 500;
const CYLINDER_HEIGHT = Math.PI * CYLINDER_RADIUS; // 1570.7963
const CYLINDER_Y = -128;
const FLATNESS = 0.75;
const BLEND_ANGLE = (66 * Math.PI) / 180;

function frontPixelTo3D(fx, fy) {
  const panoX = 1194 + fx;
  const panoY = 460 + fy;
  const u = panoX / 4096.0;
  const v = 1.0 - (panoY / 2048.0);

  let deltaAngle = (u - 0.5) * Math.PI * 2;
  while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
  while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;

  const absAngle = Math.abs(deltaAngle);
  let blendWeight = 0;
  if (absAngle < BLEND_ANGLE) {
    const normAngle = absAngle / BLEND_ANGLE;
    blendWeight = Math.pow(Math.cos(normAngle * Math.PI * 0.5), 2) * FLATNESS;
  }

  // Cylindrical coordinate (scaled -1 on X so u increases left to right in camera view):
  // Since camera looks down -Z at u=0.5, with scale(-1, 1, 1):
  // x = -CYLINDER_RADIUS * sin(deltaAngle) * (-1) = CYLINDER_RADIUS * sin(deltaAngle)
  const origX = CYLINDER_RADIUS * Math.sin(deltaAngle);
  const origZ = -CYLINDER_RADIUS * Math.cos(deltaAngle);

  // Target flat wall at distance CYLINDER_RADIUS
  const flatX = CYLINDER_RADIUS * Math.tan(deltaAngle);
  const flatZ = -CYLINDER_RADIUS;

  const x = origX * (1 - blendWeight) + flatX * blendWeight;
  const z = origZ * (1 - blendWeight) + flatZ * blendWeight;
  const y = (v - 0.5) * CYLINDER_HEIGHT + CYLINDER_Y;

  return { x, y, z, deltaAngle };
}

const boxes = {
  hosting: { fx: 355, fy: 95, fw: 180, fh: 130 },
  uiux: { fx: 355, fy: 240, fw: 180, fh: 130 },
  management: { fx: 1148, fy: 95, fw: 180, fh: 130 },
  webdev: { fx: 1148, fy: 240, fw: 180, fh: 130 },
  leftMon: { fx: 340, fy: 395, fw: 370, fh: 260 },
  centerMon: { fx: 710, fy: 395, fw: 390, fh: 255 },
  rightMon: { fx: 1100, fy: 395, fw: 370, fh: 260 }
};

for (const [key, b] of Object.entries(boxes)) {
  const p1 = frontPixelTo3D(b.fx, b.fy);
  const p2 = frontPixelTo3D(b.fx + b.fw, b.fy + b.fh);
  const center = frontPixelTo3D(b.fx + b.fw / 2, b.fy + b.fh / 2);
  const width3D = Math.hypot(p2.x - p1.x, p2.z - p1.z);
  const height3D = Math.abs(p1.y - p2.y);
  const angleY = Math.atan2(p2.z - p1.z, p2.x - p1.x);

  console.log(`${key}:`);
  console.log(`  center: x=${center.x.toFixed(1)}, y=${center.y.toFixed(1)}, z=${center.z.toFixed(1)}`);
  console.log(`  size: width=${width3D.toFixed(1)}, height=${height3D.toFixed(1)}`);
  console.log(`  angleY: ${angleY.toFixed(3)} rad (${(angleY * 180 / Math.PI).toFixed(1)} deg)`);
}
