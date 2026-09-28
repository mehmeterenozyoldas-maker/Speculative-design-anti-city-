import * as THREE from 'three';
import { UrbanDenizen } from '../types';

/**
 * High-Quality Stylized 3D Denizen Character Models
 * Built with procedural primitives, smooth bevels, and expressive materials
 * representing the urban wildlife and inhabitants navigating hostile smart city architecture.
 */

// Helper: glossy eye material
function createEyeMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0x111111,
    roughness: 0.1,
    metalness: 0.1,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });
}

// 1. Stray Cat: Aloof Porch Landlord
export function createStrayCatModel(): THREE.Group {
  const cat = new THREE.Group();
  cat.name = 'denizen-stray-cat';

  const furMat = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Warm ginger orange
    roughness: 0.65,
    metalness: 0.05,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xfdfdfd,
    roughness: 0.6,
  });
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xf472b6,
    roughness: 0.5,
  });
  const eyeMat = createEyeMaterial();

  // Torso / sitting body
  const bodyGeo = new THREE.SphereGeometry(0.24, 20, 20);
  bodyGeo.scale(1, 1.25, 1.4);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.set(0, 0.26, 0);
  body.castShadow = true;
  cat.add(body);

  // White chest bib
  const chestGeo = new THREE.SphereGeometry(0.16, 16, 16);
  chestGeo.scale(0.85, 1.1, 1.1);
  const chest = new THREE.Mesh(chestGeo, whiteMat);
  chest.position.set(0, 0.22, 0.16);
  cat.add(chest);

  // Head
  const headGeo = new THREE.SphereGeometry(0.18, 20, 20);
  headGeo.scale(1.15, 1, 1);
  const head = new THREE.Mesh(headGeo, furMat);
  head.position.set(0, 0.52, 0.18);
  head.castShadow = true;
  cat.add(head);

  // White muzzle
  const muzzleGeo = new THREE.SphereGeometry(0.08, 16, 16);
  muzzleGeo.scale(1.3, 0.8, 1);
  const muzzle = new THREE.Mesh(muzzleGeo, whiteMat);
  muzzle.position.set(0, 0.48, 0.32);
  cat.add(muzzle);

  // Pink nose
  const noseGeo = new THREE.ConeGeometry(0.02, 0.02, 4);
  const nose = new THREE.Mesh(noseGeo, pinkMat);
  nose.rotation.x = Math.PI;
  nose.position.set(0, 0.5, 0.39);
  cat.add(nose);

  // Pointed Ears
  [-0.11, 0.11].forEach((xPos, idx) => {
    const earGeo = new THREE.ConeGeometry(0.07, 0.12, 4);
    const ear = new THREE.Mesh(earGeo, furMat);
    ear.position.set(xPos, 0.69, 0.16);
    ear.rotation.z = (idx === 0 ? 0.2 : -0.2);
    ear.castShadow = true;
    cat.add(ear);

    // Inner pink ear
    const innerEarGeo = new THREE.ConeGeometry(0.045, 0.09, 4);
    const innerEar = new THREE.Mesh(innerEarGeo, pinkMat);
    innerEar.position.set(xPos, 0.68, 0.18);
    innerEar.rotation.z = (idx === 0 ? 0.2 : -0.2);
    cat.add(innerEar);
  });

  // Expressive glossy eyes
  [-0.07, 0.07].forEach((xPos) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.035, 12, 12), eyeMat);
    eye.position.set(xPos, 0.55, 0.33);
    cat.add(eye);

    // Cute specular glint highlight
    const glint = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glint.position.set(xPos + 0.01, 0.56, 0.36);
    cat.add(glint);
  });

  // Curled Tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.16, -0.24),
    new THREE.Vector3(0.08, 0.18, -0.36),
    new THREE.Vector3(0.18, 0.28, -0.32),
    new THREE.Vector3(0.22, 0.42, -0.24),
  ]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.035, 8, false);
  const tail = new THREE.Mesh(tailGeo, furMat);
  tail.castShadow = true;
  cat.add(tail);

  // Whiskers (3 on each side)
  const whiskerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  [-1, 1].forEach((side) => {
    [-0.02, 0, 0.02].forEach((yOff, i) => {
      const whiskerGeo = new THREE.CylinderGeometry(0.002, 0.001, 0.09, 4);
      const whisker = new THREE.Mesh(whiskerGeo, whiskerMat);
      whisker.rotation.z = side * (Math.PI / 2 + (i - 1) * 0.18);
      whisker.position.set(side * 0.1, 0.48 + yOff, 0.35);
      cat.add(whisker);
    });
  });

  // Front Paws with cute pink paw pads
  [-0.08, 0.08].forEach((xPos) => {
    const pawGeo = new THREE.SphereGeometry(0.05, 12, 12);
    pawGeo.scale(0.9, 0.6, 1.2);
    const paw = new THREE.Mesh(pawGeo, whiteMat);
    paw.position.set(xPos, 0.06, 0.22);
    paw.castShadow = true;
    cat.add(paw);

    const pad = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), pinkMat);
    pad.scale.set(1, 0.4, 1);
    pad.position.set(xPos, 0.03, 0.25);
    cat.add(pad);
  });

  return cat;
}

// 2. Red Panda: Endangered Aristocrat
export function createRedPandaModel(): THREE.Group {
  const panda = new THREE.Group();
  panda.name = 'denizen-red-panda';

  const rustMat = new THREE.MeshStandardMaterial({
    color: 0xc2410c, // Rich russet red
    roughness: 0.65,
    metalness: 0.05,
  });
  const darkMat = new THREE.MeshStandardMaterial({
    color: 0x27272a, // Dark chocolate belly and paws
    roughness: 0.7,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.6,
  });
  const eyeMat = createEyeMaterial();

  // Torso
  const bodyGeo = new THREE.SphereGeometry(0.26, 20, 20);
  bodyGeo.scale(1, 1.15, 1.5);
  const body = new THREE.Mesh(bodyGeo, rustMat);
  body.position.set(0, 0.28, 0);
  body.castShadow = true;
  panda.add(body);

  // Dark belly
  const bellyGeo = new THREE.SphereGeometry(0.22, 16, 16);
  bellyGeo.scale(0.9, 0.9, 1.3);
  const belly = new THREE.Mesh(bellyGeo, darkMat);
  belly.position.set(0, 0.2, 0.05);
  panda.add(belly);

  // Head
  const headGeo = new THREE.SphereGeometry(0.2, 20, 20);
  headGeo.scale(1.2, 1.05, 1.05);
  const head = new THREE.Mesh(headGeo, rustMat);
  head.position.set(0, 0.54, 0.22);
  head.castShadow = true;
  panda.add(head);

  // White cheeks & snout markings
  [-0.14, 0.14].forEach((xPos) => {
    const cheekGeo = new THREE.SphereGeometry(0.08, 12, 12);
    cheekGeo.scale(1.2, 0.8, 1);
    const cheek = new THREE.Mesh(cheekGeo, whiteMat);
    cheek.position.set(xPos, 0.5, 0.3);
    panda.add(cheek);
  });

  const snoutGeo = new THREE.SphereGeometry(0.07, 14, 14);
  const snout = new THREE.Mesh(snoutGeo, whiteMat);
  snout.position.set(0, 0.5, 0.38);
  panda.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), darkMat);
  nose.position.set(0, 0.53, 0.44);
  panda.add(nose);

  // White-trimmed rounded ears
  [-0.16, 0.16].forEach((xPos, idx) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), whiteMat);
    ear.scale.set(1, 1.2, 0.4);
    ear.position.set(xPos, 0.72, 0.18);
    ear.rotation.z = (idx === 0 ? 0.35 : -0.35);
    panda.add(ear);

    const inner = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 8), rustMat);
    inner.scale.set(0.9, 1, 0.4);
    inner.position.set(xPos, 0.72, 0.2);
    panda.add(inner);
  });

  // Expressive eyes with tear markings
  [-0.08, 0.08].forEach((xPos) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 12), eyeMat);
    eye.position.set(xPos, 0.57, 0.36);
    panda.add(eye);

    const glint = new THREE.Mesh(
      new THREE.SphereGeometry(0.012, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glint.position.set(xPos + 0.01, 0.58, 0.39);
    panda.add(glint);
  });

  // Magnificent Ringed Bushy Tail
  const tailGroup = new THREE.Group();
  tailGroup.position.set(0, 0.22, -0.3);
  const ringCount = 5;
  for (let i = 0; i < ringCount; i++) {
    const ringMat = i % 2 === 0 ? rustMat : whiteMat;
    const ringGeo = new THREE.CylinderGeometry(0.08 - i * 0.008, 0.09 - i * 0.008, 0.12, 16);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 3;
    ring.position.set(0, i * 0.08, -i * 0.1);
    ring.castShadow = true;
    tailGroup.add(ring);
  }
  panda.add(tailGroup);

  // Dark paws holding the perch
  [-0.1, 0.1].forEach((xPos) => {
    const paw = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), darkMat);
    paw.position.set(xPos, 0.08, 0.2);
    paw.castShadow = true;
    panda.add(paw);
  });

  return panda;
}

// 3. Radio Rat: Neon Sewer Scurrier
export function createRadioRatModel(): THREE.Group {
  const rat = new THREE.Group();
  rat.name = 'denizen-radio-rat';

  const furMat = new THREE.MeshStandardMaterial({
    color: 0x52525b, // Sleek slate gray
    roughness: 0.6,
  });
  const pinkMat = new THREE.MeshStandardMaterial({
    color: 0xfb7185,
    roughness: 0.5,
  });
  const techMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4, // Cyan tactical LED
    roughness: 0.2,
    metalness: 0.8,
  });
  const eyeMat = createEyeMaterial();

  // Low, sleek aerodynamic body
  const bodyGeo = new THREE.SphereGeometry(0.18, 16, 16);
  bodyGeo.scale(0.85, 0.7, 1.8);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.set(0, 0.12, 0);
  body.castShadow = true;
  rat.add(body);

  // Pointed Snout Head
  const headGeo = new THREE.ConeGeometry(0.11, 0.26, 16);
  const head = new THREE.Mesh(headGeo, furMat);
  head.rotation.x = Math.PI / 2;
  head.position.set(0, 0.14, 0.28);
  head.castShadow = true;
  rat.add(head);

  // Pink nose tip
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), pinkMat);
  nose.position.set(0, 0.14, 0.42);
  rat.add(nose);

  // Big round translucent ears
  [-0.09, 0.09].forEach((xPos) => {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.065, 12, 12), pinkMat);
    ear.scale.set(1, 1, 0.2);
    ear.position.set(xPos, 0.24, 0.22);
    rat.add(ear);
  });

  // Beady eyes
  [-0.06, 0.06].forEach((xPos) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeMat);
    eye.position.set(xPos, 0.17, 0.32);
    rat.add(eye);
  });

  // Long flexible curved tail
  const tailCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.1, -0.3),
    new THREE.Vector3(-0.06, 0.08, -0.46),
    new THREE.Vector3(0.04, 0.06, -0.6),
    new THREE.Vector3(0.12, 0.12, -0.72),
  ]);
  const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.018, 8, false);
  const tail = new THREE.Mesh(tailGeo, pinkMat);
  rat.add(tail);

  // Tactical Backpack (subverting CCTV data stream)
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.16), techMat);
  pack.position.set(0, 0.24, 0.02);
  rat.add(pack);

  // Glowing antenna probe
  const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), pinkMat);
  antenna.position.set(0.03, 0.35, -0.02);
  antenna.rotation.z = -0.2;
  rat.add(antenna);

  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(0.015, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  beacon.position.set(0.05, 0.44, -0.02);
  rat.add(beacon);

  return rat;
}

// 4. Spirit Beast: Patio Astral Guardian
export function createSpiritBeastModel(): THREE.Group {
  const spirit = new THREE.Group();
  spirit.name = 'denizen-spirit-beast';

  const spiritMat = new THREE.MeshPhysicalMaterial({
    color: 0x67e8f9,
    roughness: 0.1,
    metalness: 0.1,
    transmission: 0.6,
    transparent: true,
    opacity: 0.85,
    clearcoat: 1.0,
    emissive: 0x0891b2,
    emissiveIntensity: 0.4,
  });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 24), spiritMat);
  body.position.set(0, 0.35, 0);
  body.castShadow = true;
  spirit.add(body);

  // Floating astral horns
  [-0.1, 0.1].forEach((xPos, idx) => {
    const hornCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(xPos, 0.5, 0),
      new THREE.Vector3(xPos * 1.5, 0.68, -0.05),
      new THREE.Vector3(xPos * 2.0, 0.82, -0.1),
    ]);
    const horn = new THREE.Mesh(new THREE.TubeGeometry(hornCurve, 16, 0.025, 8, false), spiritMat);
    spirit.add(horn);
  });

  // Glowing white eyes
  [-0.07, 0.07].forEach((xPos) => {
    const eye = new THREE.Mesh(
      new THREE.SphereGeometry(0.035, 12, 12),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    eye.position.set(xPos, 0.38, 0.22);
    spirit.add(eye);
  });

  // Orbiting star particle ring
  const ringGeo = new THREE.TorusGeometry(0.38, 0.012, 8, 32);
  const ring = new THREE.Mesh(
    ringGeo,
    new THREE.MeshBasicMaterial({ color: 0xbae6fd, transparent: true, opacity: 0.7 })
  );
  ring.rotation.x = Math.PI / 3;
  ring.position.set(0, 0.35, 0);
  spirit.add(ring);

  return spirit;
}

// 5. Golden King: Lord of the Dumpsters
export function createGoldenKingModel(): THREE.Group {
  const king = new THREE.Group();
  king.name = 'denizen-golden-king';

  const furMat = new THREE.MeshStandardMaterial({
    color: 0x475569, // Gray raccoon/urban survivor fur
    roughness: 0.65,
  });
  const blackMaskMat = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.7,
  });
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    roughness: 0.6,
  });
  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    metalness: 0.9,
    roughness: 0.2,
  });
  const gemMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  const eyeMat = createEyeMaterial();

  // Torso
  const body = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), furMat);
  body.scale.set(1, 1.2, 1.2);
  body.position.set(0, 0.26, 0);
  body.castShadow = true;
  king.add(body);

  // Head with bandit mask
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), furMat);
  head.position.set(0, 0.52, 0.16);
  head.castShadow = true;
  king.add(head);

  // Black mask across eyes
  const mask = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.1), blackMaskMat);
  mask.position.set(0, 0.52, 0.26);
  king.add(mask);

  // Snout
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.12, 12), whiteMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 0.48, 0.32);
  king.add(snout);

  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 8, 8), blackMaskMat);
  nose.position.set(0, 0.48, 0.39);
  king.add(nose);

  // Eyes
  [-0.07, 0.07].forEach((xPos) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), eyeMat);
    eye.position.set(xPos, 0.53, 0.3);
    king.add(eye);

    const glint = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    glint.position.set(xPos + 0.01, 0.54, 0.33);
    king.add(glint);
  });

  // Imperial Golden Crown perched on head!
  const crownGroup = new THREE.Group();
  crownGroup.position.set(0, 0.72, 0.14);
  crownGroup.rotation.z = -0.15; // rakish tilt

  const crownBase = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.04, 16), goldMat);
  crownGroup.add(crownBase);

  // 5 Crown Points
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.08, 4), goldMat);
    spike.position.set(Math.cos(a) * 0.085, 0.05, Math.sin(a) * 0.085);
    crownGroup.add(spike);

    // Mini Ruby gem
    const ruby = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), gemMat);
    ruby.position.set(Math.cos(a) * 0.095, 0.02, Math.sin(a) * 0.095);
    crownGroup.add(ruby);
  }
  king.add(crownGroup);

  return king;
}
