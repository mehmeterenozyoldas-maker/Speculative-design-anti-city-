import * as THREE from 'three';

/**
 * Procedural PBR Texture Generator
 * Generates high-fidelity diffuse, roughness, and bump maps on HTML5 Canvas
 * to give realistic architectural materials without external network asset dependencies.
 */

// 1. Raw Architectural Concrete (Camden Bench & Facades)
export function createConcreteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base raw cement gray
  ctx.fillStyle = '#4a4d53';
  ctx.fillRect(0, 0, 512, 512);

  // Layer 1: Aggregate grain noise
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 45;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  // Layer 2: Formwork subtle board seams and aggregate flecks
  ctx.fillStyle = 'rgba(25, 25, 28, 0.15)';
  for (let y = 0; y < 512; y += 128) {
    ctx.fillRect(0, y, 512, 2);
  }

  // Layer 3: Dark and light stone aggregate specks
  for (let i = 0; i < 300; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const r = Math.random() * 2.5 + 0.5;
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(20, 20, 25, 0.4)' : 'rgba(180, 185, 195, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Concrete Bump / Normal map
export function createConcreteBumpMap(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const n = Math.random() * 120;
    data[i] = n;
    data[i + 1] = n;
    data[i + 2] = n;
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 3. Wet Asphalt Pavement with subtle reflective puddles
export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1c1f24';
  ctx.fillRect(0, 0, 512, 512);

  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * 35;
    data[i] = Math.max(0, Math.min(255, data[i] + grain));
    data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
    data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain + 2)); // slight cool blue tint
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 4. Sidewalk Paver Grid with Expansion Joints
export function createPaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base stone tone
  ctx.fillStyle = '#3a3f47';
  ctx.fillRect(0, 0, 512, 512);

  // Micro stone texture
  const imgData = ctx.getImageData(0, 0, 512, 512);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 25;
    data[i] += noise;
    data[i + 1] += noise;
    data[i + 2] += noise;
  }
  ctx.putImageData(imgData, 0, 0);

  // Paver slab grid joints (64x64 tiles)
  ctx.strokeStyle = '#1b1d22';
  ctx.lineWidth = 3;
  for (let x = 0; x <= 512; x += 64) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 512);
    ctx.stroke();
  }
  for (let y = 0; y <= 512; y += 64) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 5. Tactile Blister Paving (Warning studs used along transit/curb perimeters)
export function createTactilePavingTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Municipal safety yellow / ochre
  ctx.fillStyle = '#b8860b';
  ctx.fillRect(0, 0, 256, 256);

  // Embossed circular tactile blisters
  const step = 32;
  for (let x = step / 2; x < 256; x += step) {
    for (let y = step / 2; y < 256; y += step) {
      const grad = ctx.createRadialGradient(x - 2, y - 2, 1, x, y, 9);
      grad.addColorStop(0, '#fcd34d');
      grad.addColorStop(0.7, '#d97706');
      grad.addColorStop(1, '#78350f');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 6. Brushed Stainless Steel
export function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#b0b5be';
  ctx.fillRect(0, 0, 256, 256);

  // Directional brush lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 256;
    const h = Math.random() * 1.5 + 0.5;
    ctx.fillRect(0, y, 256, h);
  }
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * 256;
    const h = Math.random() * 1.5 + 0.5;
    ctx.fillRect(0, y, 256, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 7. Municipal Hazard Warning Strip (Yellow / Black Chevrons)
export function createHazardStripeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#eab308';
  ctx.fillRect(0, 0, 256, 64);

  ctx.fillStyle = '#18181b';
  ctx.beginPath();
  const stripeW = 24;
  for (let x = -64; x < 320; x += stripeW * 2) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x + stripeW, 0);
    ctx.lineTo(x + stripeW - 32, 64);
    ctx.lineTo(x - 32, 64);
    ctx.closePath();
  }
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 8. Procedural Equirectangular Environment Map Generator
export function createEquirectangularEnvTexture(mode: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  const isDay = mode === 'daylight';
  const isStudio = mode === 'studio';
  const isGolden = mode === 'golden_hour';

  // Sky gradient (Top half)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, 256);
  if (isDay) {
    skyGrad.addColorStop(0, '#3b82f6');
    skyGrad.addColorStop(0.5, '#93c5fd');
    skyGrad.addColorStop(1, '#e0f2fe');
  } else if (isStudio) {
    skyGrad.addColorStop(0, '#334155');
    skyGrad.addColorStop(0.5, '#64748b');
    skyGrad.addColorStop(1, '#94a3b8');
  } else if (isGolden) {
    skyGrad.addColorStop(0, '#9a3412');
    skyGrad.addColorStop(0.5, '#ea580c');
    skyGrad.addColorStop(1, '#fed7aa');
  } else {
    // Night
    skyGrad.addColorStop(0, '#020617');
    skyGrad.addColorStop(0.7, '#0f172a');
    skyGrad.addColorStop(1, '#1e293b');
  }
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, 1024, 256);

  // Distant urban silhouettes along horizon (y = 190 to 256)
  ctx.fillStyle = isDay ? 'rgba(71, 85, 105, 0.4)' : isGolden ? 'rgba(67, 20, 7, 0.55)' : 'rgba(15, 23, 42, 0.85)';
  for (let x = 0; x < 1024; x += 32) {
    const bldH = Math.sin(x * 0.05) * 25 + Math.cos(x * 0.12) * 15 + 32;
    const bldW = 24 + Math.sin(x * 0.08) * 8;
    ctx.fillRect(x, 256 - bldH, bldW, bldH);
  }

  // Ground plane gradient (Bottom half)
  const groundGrad = ctx.createLinearGradient(0, 256, 0, 512);
  if (isDay) {
    groundGrad.addColorStop(0, '#94a3b8');
    groundGrad.addColorStop(1, '#334155');
  } else if (isStudio) {
    groundGrad.addColorStop(0, '#334155');
    groundGrad.addColorStop(1, '#1e293b');
  } else if (isGolden) {
    groundGrad.addColorStop(0, '#78350f');
    groundGrad.addColorStop(1, '#292524');
  } else {
    groundGrad.addColorStop(0, '#0f172a');
    groundGrad.addColorStop(1, '#020617');
  }
  ctx.fillStyle = groundGrad;
  ctx.fillRect(0, 256, 1024, 256);

  // Distant studio softbox or sun highlights
  if (isStudio) {
    const lightGrad1 = ctx.createRadialGradient(250, 120, 10, 250, 120, 140);
    lightGrad1.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
    lightGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = lightGrad1;
    ctx.fillRect(130, 0, 240, 240);

    const lightGrad2 = ctx.createRadialGradient(780, 130, 10, 780, 130, 150);
    lightGrad2.addColorStop(0, 'rgba(224, 242, 254, 0.75)');
    lightGrad2.addColorStop(1, 'rgba(224, 242, 254, 0)');
    ctx.fillStyle = lightGrad2;
    ctx.fillRect(660, 0, 240, 240);
  } else {
    const sunX = isGolden ? 320 : 480;
    const sunY = isGolden ? 210 : 80;
    const sunGrad = ctx.createRadialGradient(sunX, sunY, 5, sunX, sunY, 130);
    sunGrad.addColorStop(0, isGolden ? '#ffedd5' : '#ffffff');
    sunGrad.addColorStop(0.3, isGolden ? '#f97316' : '#fef08a');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sunGrad;
    ctx.fillRect(sunX - 130, sunY - 130, 260, 260);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

// 9. Radial Contact Shadow Decal
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
  grad.addColorStop(0.4, 'rgba(0, 0, 0, 0.45)');
  grad.addColorStop(0.8, 'rgba(0, 0, 0, 0.12)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 10. Cast-Iron Manhole Cover Texture
export function createManholeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#1e2229';
  ctx.fillRect(0, 0, 256, 256);

  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(128, 128, 120, 0, Math.PI * 2);
  ctx.stroke();

  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(128, 128, 90, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(128, 128, 50, 0, Math.PI * 2);
  ctx.stroke();

  // Waffle grip knurls
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
    ctx.beginPath();
    ctx.moveTo(128 + Math.cos(a) * 60, 128 + Math.sin(a) * 60);
    ctx.lineTo(128 + Math.cos(a) * 115, 128 + Math.sin(a) * 115);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 11. Municipal Warning Sign Texture
export function createWarningSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(0, 0, 256, 128);

  ctx.fillStyle = '#1e3a8a';
  ctx.fillRect(4, 4, 248, 36);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 15px sans-serif';
  ctx.fillText('NOTICE: CCTV ZONE', 18, 28);

  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('PUBLIC ORDER BYLAW §402', 18, 62);
  ctx.font = '9px monospace';
  ctx.fillText('AUTOMATED SPATIAL TELEMETRY', 18, 80);
  ctx.fillText('LOITERING PROHIBITED IN PERIMETER', 18, 98);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 12. London Borough of Camden Bench Asset Plaque (Cast Bronze)
export function createCamdenPlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;

  // Bronze metallic background
  const grad = ctx.createLinearGradient(0, 0, 512, 160);
  grad.addColorStop(0, '#59442b');
  grad.addColorStop(0.3, '#7d5f3c');
  grad.addColorStop(0.7, '#8f6e47');
  grad.addColorStop(1, '#4e3b25');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 160);

  // Border bevel
  ctx.strokeStyle = '#2b2014';
  ctx.lineWidth = 6;
  ctx.strokeRect(3, 3, 506, 154);
  ctx.strokeStyle = '#c9a875';
  ctx.lineWidth = 2;
  ctx.strokeRect(8, 8, 496, 144);

  // Corner security rivets
  const rivets = [
    [16, 16],
    [496, 16],
    [16, 144],
    [496, 144],
  ];
  rivets.forEach(([x, y]) => {
    ctx.fillStyle = '#221910';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#d4b27c';
    ctx.beginPath();
    ctx.arc(x - 1, y - 1, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // Text
  ctx.fillStyle = '#d4b27c';
  ctx.font = 'bold 20px "Courier New", monospace';
  ctx.fillText('LONDON BOROUGH OF CAMDEN', 70, 42);

  ctx.fillStyle = '#f5dfb8';
  ctx.font = 'bold 15px "Courier New", monospace';
  ctx.fillText('CIVIC BENCH TYPE C-100 · ASSET #8841-B', 70, 72);

  ctx.fillStyle = '#baa077';
  ctx.font = '12px "Courier New", monospace';
  ctx.fillText('PATENT GRANTED · NON-RECUMBENT PROFILE', 70, 98);
  ctx.fillText('FLOW-OPTIMIZED KINETIC STREET PLINTH', 70, 120);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 13. High-Voltage / Smart City Surveillance Mast Warning Decal
export function createMastHazardDecalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d')!;

  // Safety yellow background
  ctx.fillStyle = '#facc15';
  ctx.fillRect(0, 0, 256, 320);

  // Black perimeter border
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeRect(4, 4, 248, 312);

  // Danger banner
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(12, 12, 232, 54);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('WARNING', 55, 48);

  // Lightning bolt symbol
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.moveTo(128, 80);
  ctx.lineTo(105, 140);
  ctx.lineTo(125, 140);
  ctx.lineTo(110, 195);
  ctx.lineTo(150, 130);
  ctx.lineTo(130, 130);
  ctx.closePath();
  ctx.fill();

  ctx.font = 'bold 14px monospace';
  ctx.fillText('SMART CITY NODE 04', 40, 225);
  ctx.font = 'bold 12px monospace';
  ctx.fillText('400V BIOMETRIC GAZE ARRAY', 28, 250);
  ctx.font = '10px monospace';
  ctx.fillText('UNAUTHORIZED ACCESS FORBIDDEN', 22, 275);
  ctx.fillText('BYLAW ORDER CODE 77-A/PTZ', 32, 295);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 14. Anti-Intrusion Spike Warning Plaque (Laser-Etched Stainless Steel)
export function createSpikePlaqueTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // Brushed steel background
  ctx.fillStyle = '#94a3b8';
  ctx.fillRect(0, 0, 512, 140);

  // Fine brushed horizontal noise lines
  for (let y = 0; y < 140; y += 2) {
    const shade = (Math.random() - 0.5) * 40;
    ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + Math.random() * 0.08})`;
    ctx.fillRect(0, y, 512, 1);
  }

  // Border & bolts
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 3;
  ctx.strokeRect(6, 6, 500, 128);

  const bolts = [[16, 16], [496, 16], [16, 124], [496, 124]];
  bolts.forEach(([x, y]) => {
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Black laser etched typography
  ctx.fillStyle = '#090d16';
  ctx.font = 'bold 22px "Arial Black", sans-serif';
  ctx.fillText('PERIMETER DEFENSE SYSTEM', 70, 42);

  ctx.font = 'bold 14px monospace';
  ctx.fillText('HARDENED STAINLESS PYRAMID STUDS · ACTIVE DETERRENT', 70, 70);

  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 13px monospace';
  ctx.fillText('LOITERING / RESTING STRICTLY PROHIBITED (ENCLOSURE ACT §8)', 70, 96);

  ctx.fillStyle = '#334155';
  ctx.font = '11px monospace';
  ctx.fillText('FACADE ALCOVE ASSET NO. 44109-SEC', 70, 118);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 15. Ultrasonic Mosquito Deterrent Industrial Placard
export function createMosquitoPlacardTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 200;
  const ctx = canvas.getContext('2d')!;

  // Industrial white enamel
  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 384, 200);

  // Header band
  ctx.fillStyle = '#d97706'; // warning amber
  ctx.fillRect(4, 4, 376, 44);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('ACOUSTIC DISPERSAL', 75, 34);

  // Sonic warning icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(42, 26, 12, -Math.PI / 3, Math.PI / 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(42, 26, 18, -Math.PI / 3, Math.PI / 3);
  ctx.stroke();

  // Specs text
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px monospace';
  ctx.fillText('THE MOSQUITO · MK IV SYSTEM', 20, 80);

  ctx.fillStyle = '#475569';
  ctx.font = '12px monospace';
  ctx.fillText('FREQUENCY RANGE: 17.4 kHz - 18.5 kHz', 20, 108);
  ctx.fillText('TARGET AGE GROUP: UNDER 25 YRS', 20, 128);
  ctx.fillText('DISPERSAL RADIUS: 15-25 METERS', 20, 148);

  ctx.fillStyle = '#b91c1c';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('CIVIC DISPERSAL ORDINANCE §33-B', 20, 178);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 16. Transit Lean Perch Authority Badge
export function createTransitPerchBadgeTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Deep transit blue
  ctx.fillStyle = '#0369a1';
  ctx.fillRect(0, 0, 256, 128);

  // Clean silver border
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 3;
  ctx.strokeRect(4, 4, 248, 120);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('RAPID TRANSIT', 58, 36);

  ctx.fillStyle = '#bae6fd';
  ctx.font = 'bold 12px monospace';
  ctx.fillText('LEAN REST UNIT LR-4', 58, 62);
  ctx.fillText('NON-RECUMBENT SUPPORT', 58, 80);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'bold 10px monospace';
  ctx.fillText('MAX 15 MIN POSTURAL DWELL', 58, 104);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 17. Perforated Hexagonal Acoustic Speaker Grille Texture
export function createHexAcousticGrilleTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;

  // Dark metallic gunmetal plate
  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 256, 256);

  // Perforated hole pattern
  ctx.fillStyle = '#05070a';
  const r = 5;
  const spacing = 14;
  for (let y = 8; y < 256; y += spacing) {
    const isOdd = Math.floor(y / spacing) % 2 === 1;
    const xOffset = isOdd ? spacing / 2 : 0;
    for (let x = 8 + xOffset; x < 256; x += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 18. Galvanized Zinc Mast Texture (Zinc Crystal Spangles)
export function createGalvanizedMastTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base zinc gray
  ctx.fillStyle = '#78828e';
  ctx.fillRect(0, 0, 512, 512);

  // Zinc crystalline spangles (irregular polygons)
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const size = 10 + Math.random() * 25;
    const lightness = 95 + Math.floor(Math.random() * 70);
    ctx.fillStyle = `rgb(${lightness}, ${lightness + 5}, ${lightness + 12})`;
    ctx.beginPath();
    const sides = 5 + Math.floor(Math.random() * 3);
    for (let s = 0; s < sides; s++) {
      const angle = (s / sides) * Math.PI * 2;
      const px = x + Math.cos(angle) * (size * (0.7 + Math.random() * 0.5));
      const py = y + Math.sin(angle) * (size * (0.7 + Math.random() * 0.5));
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// 19. High-Contrast 3D Floating Interactive Callout Badge Texture
export function createFloatingBadgeTexture(
  code: string,
  title: string,
  color = '#38bdf8'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  // Dark background with rounded corners
  ctx.fillStyle = 'rgba(8, 12, 20, 0.95)';
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(8, 8, 496, 112, 16);
  } else {
    ctx.rect(8, 8, 496, 112);
  }
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.stroke();

  // High-tech corner bracket ticks
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5;
  // Left bracket
  ctx.beginPath();
  ctx.moveTo(32, 28);
  ctx.lineTo(20, 28);
  ctx.lineTo(20, 100);
  ctx.lineTo(32, 100);
  ctx.stroke();
  // Right bracket
  ctx.beginPath();
  ctx.moveTo(480, 28);
  ctx.lineTo(492, 28);
  ctx.lineTo(492, 100);
  ctx.lineTo(480, 100);
  ctx.stroke();

  // Status indicator dot
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(48, 64, 10, 0, Math.PI * 2);
  ctx.fill();

  // Top Code Text
  ctx.fillStyle = color;
  ctx.font = 'bold 22px monospace';
  ctx.fillText(code, 75, 48);

  // Main Title Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 28px sans-serif';
  ctx.fillText(title, 75, 88);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 20. Architectural Teak Wood Slat Texture (Fine grain, warm honey tone)
export function createTeakWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Warm golden amber base
  ctx.fillStyle = '#b4783c';
  ctx.fillRect(0, 0, 512, 512);

  // Longitudinal wood grain lines
  for (let x = 0; x < 512; x += 2) {
    const wave = Math.sin(x * 0.05) * 8;
    const darkness = (Math.random() - 0.5) * 35;
    ctx.fillStyle = `rgba(${135 + darkness}, ${80 + darkness * 0.7}, ${30 + darkness * 0.4}, 0.25)`;
    ctx.fillRect(x + wave * 0.2, 0, 1.5, 512);
  }

  // Annual rings & subtle knots
  for (let i = 0; i < 6; i++) {
    const ringY = Math.random() * 512;
    const ringW = 40 + Math.random() * 120;
    const grad = ctx.createLinearGradient(0, ringY - 20, 0, ringY + 20);
    grad.addColorStop(0, 'rgba(80, 45, 15, 0)');
    grad.addColorStop(0.5, 'rgba(75, 40, 12, 0.35)');
    grad.addColorStop(1, 'rgba(80, 45, 15, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, ringY - 20, 512, 40);
  }

  // Matte protective polyurethane sheen overlay
  ctx.fillStyle = 'rgba(255, 235, 200, 0.06)';
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 4);
  return texture;
}

// 20. 3D Architectural Hotspot Callout Texture
export function createHotspotCalloutTexture(
  num: number,
  title: string,
  color = '#38bdf8'
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 112;
  const ctx = canvas.getContext('2d')!;

  // Background rounded pill
  ctx.fillStyle = 'rgba(10, 14, 23, 0.94)';
  ctx.beginPath();
  ctx.roundRect(8, 8, 496, 96, 48);
  ctx.fill();

  // Border with accent glow
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  // Left Circular Badge
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(56, 56, 32, 0, Math.PI * 2);
  ctx.fill();

  // Number inside circle
  ctx.fillStyle = '#0a0e17';
  ctx.font = 'bold 26px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const numStr = num < 10 ? `0${num}` : `${num}`;
  ctx.fillText(numStr, 56, 56);

  // Title text
  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
  ctx.fillText(title.toUpperCase(), 104, 56);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}



