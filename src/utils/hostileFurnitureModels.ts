import * as THREE from 'three';
import {
  createCamdenPlaqueTexture,
  createMastHazardDecalTexture,
  createSpikePlaqueTexture,
  createMosquitoPlacardTexture,
  createTransitPerchBadgeTexture,
  createHexAcousticGrilleTexture,
  createGalvanizedMastTexture,
  createContactShadowTexture,
  createConcreteTexture,
} from './proceduralTextures';

/**
 * High-Fidelity Architectural 3D Hostile Street Furniture Builders
 * Built with realistic industrial design details, authentic municipal specifications,
 * PBR materials, mechanical fasteners, warning plaques, and tactical citizen counter-hardware.
 */

export interface SharedMaterials {
  concreteMat: THREE.Material;
  darkGraniteMat: THREE.Material;
  brushedSteelMat: THREE.Material;
  galvanizedSteelMat: THREE.Material;
  bronzeMat: THREE.Material;
  hazardTex: THREE.Texture;
}

export interface HotspotInfo {
  id: string;
  title: string;
  detail: string;
  pos: [number, number, number];
}

// Helper to create soft contact AO shadow decals
function createDecalShadow(width: number, height: number, opacity = 0.6): THREE.Mesh {
  const geo = new THREE.PlaneGeometry(width, height);
  const mat = new THREE.MeshBasicMaterial({
    map: createContactShadowTexture(),
    transparent: true,
    opacity,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.003;
  return mesh;
}

// =========================================================================
// 1. THE CAMDEN DETERRENT BENCH (London Borough of Camden Type C-100)
// =========================================================================
export function buildCamdenBench(materials: SharedMaterials) {
  const camdenGroup = new THREE.Group();
  camdenGroup.position.set(-3.2, 0.18, 0.8);
  camdenGroup.rotation.y = Math.PI * 0.14;

  const { concreteMat, darkGraniteMat, brushedSteelMat, bronzeMat } = materials;

  // A. Monolithic Sculpted Architectural Concrete Body with 35° Chamfers & Undercut Base
  // Cross-section profile in Y (height) and Z (depth)
  const benchShape = new THREE.Shape();
  // Start at front bottom undercut
  benchShape.moveTo(0.32, 0.0);
  benchShape.lineTo(0.44, 0.12); // outward flare from recessed plinth
  benchShape.lineTo(0.44, 0.48); // front vertical-ish facet
  benchShape.lineTo(0.08, 0.68); // 35° anti-sleeping front slope to apex crest
  benchShape.lineTo(-0.06, 0.68); // narrow peaked ridge
  benchShape.lineTo(-0.44, 0.48); // 35° anti-sleeping rear slope
  benchShape.lineTo(-0.44, 0.12); // rear vertical facet
  benchShape.lineTo(-0.32, 0.0); // rear undercut shadow gap
  benchShape.closePath();

  const extrudeSettings = {
    steps: 2,
    depth: 2.6,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelOffset: 0,
    bevelSegments: 5,
  };

  const concreteGeo = new THREE.ExtrudeGeometry(benchShape, extrudeSettings);
  concreteGeo.center();

  // Create high-detail aggregate concrete material
  const polishedConcreteMat = new THREE.MeshStandardMaterial({
    map: createConcreteTexture(),
    roughness: 0.72,
    metalness: 0.1,
  });

  const benchBody = new THREE.Mesh(concreteGeo, polishedConcreteMat);
  benchBody.rotation.y = Math.PI / 2;
  benchBody.position.y = 0.38;
  benchBody.castShadow = true;
  benchBody.receiveShadow = true;
  camdenGroup.add(benchBody);

  // B. Recessed Dark Basalt Plinth Base (Undercut Shadow Gap preventing debris accumulation)
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.68), darkGraniteMat);
  plinth.position.y = 0.04;
  plinth.receiveShadow = true;
  camdenGroup.add(plinth);

  // C. Recessed Crane Hoist Lifting Sockets (Cast bronze circular rings on end facets)
  [-1.34, 1.34].forEach((xPos) => {
    const socketPocket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.04, 16),
      darkGraniteMat
    );
    socketPocket.rotation.z = Math.PI / 2;
    socketPocket.position.set(xPos, 0.42, 0);
    camdenGroup.add(socketPocket);

    const liftingEye = new THREE.Mesh(
      new THREE.TorusGeometry(0.04, 0.012, 12, 24),
      bronzeMat
    );
    liftingEye.rotation.y = Math.PI / 2;
    liftingEye.position.set(xPos + (xPos > 0 ? 0.01 : -0.01), 0.42, 0);
    camdenGroup.add(liftingEye);
  });

  // D. Transverse Rainwater Drainage Scupper Channel (Central depression across the ridge)
  const scupperGrate = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.02, 0.88),
    brushedSteelMat
  );
  scupperGrate.position.set(0, 0.72, 0);
  scupperGrate.castShadow = true;
  camdenGroup.add(scupperGrate);

  // E. THREE Heavy Architectural Bronze Anti-Vagrancy Dividing Armrests
  // Physically segmenting the monolith into 4 distinct non-recumbent seating bays
  [-0.65, 0.0, 0.65].forEach((xPos) => {
    const armrest = new THREE.Group();
    armrest.position.set(xPos, 0.68, 0);

    // Front & rear heavy mounting flanges
    [-0.24, 0.24].forEach((zP) => {
      const flange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.05, 0.04, 16),
        bronzeMat
      );
      flange.position.set(0, 0.02, zP);
      armrest.add(flange);

      // Security Torx bolts
      for (let b = 0; b < 3; b++) {
        const ang = (b / 3) * Math.PI * 2;
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.005, 0.005, 0.02, 6),
          brushedSteelMat
        );
        bolt.position.set(Math.cos(ang) * 0.03, 0.045, zP + Math.sin(ang) * 0.03);
        armrest.add(bolt);
      }
    });

    // Cast bronze tubular loop divider arch
    const archCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.02, 0.24),
      new THREE.Vector3(0, 0.26, 0.16),
      new THREE.Vector3(0, 0.3, 0.0),
      new THREE.Vector3(0, 0.26, -0.16),
      new THREE.Vector3(0, 0.02, -0.24),
    ]);
    const archTube = new THREE.Mesh(
      new THREE.TubeGeometry(archCurve, 24, 0.026, 12, false),
      bronzeMat
    );
    archTube.castShadow = true;
    armrest.add(archTube);

    camdenGroup.add(armrest);
  });

  // F. 6 Precision Milled Anti-Skate Stopper Studs along front and rear perimeter chamfers
  [-0.95, -0.32, 0.32, 0.95].forEach((xPos) => {
    [-0.46, 0.46].forEach((zPos) => {
      const stopper = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.035, 0.06),
        bronzeMat
      );
      stopper.position.set(xPos, 0.51, zPos);
      stopper.castShadow = true;
      camdenGroup.add(stopper);

      const securityScrew = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.02, 6),
        brushedSteelMat
      );
      securityScrew.position.set(xPos, 0.53, zPos);
      camdenGroup.add(securityScrew);
    });
  });

  // G. Embedded Cast Bronze London Borough of Camden Civic Asset Plaque
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: createCamdenPlaqueTexture(),
    metalness: 0.85,
    roughness: 0.28,
  });
  const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.2), plaqueMat);
  plaqueMesh.position.set(0, 0.32, 0.472);
  plaqueMesh.castShadow = true;
  camdenGroup.add(plaqueMesh);

  // H. Tactical Counter Intervention: CNC Birch Plywood Leveling Platform
  const tacticalGroup = new THREE.Group();
  tacticalGroup.position.set(0, 0.76, 0);

  const plywoodMat = new THREE.MeshStandardMaterial({
    color: 0xdeb887,
    roughness: 0.65,
    metalness: 0.05,
  });
  const plywoodPlank = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.08, 0.92), plywoodMat);
  plywoodPlank.position.y = 0.04;
  plywoodPlank.castShadow = true;
  tacticalGroup.add(plywoodPlank);

  const feltMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.9,
    metalness: 0.0,
  });
  const feltPad = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.03, 0.88), feltMat);
  feltPad.position.y = 0.095;
  feltPad.castShadow = true;
  tacticalGroup.add(feltPad);

  [-0.8, 0.8].forEach((xPos) => {
    const strap = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.82, 0.94),
      new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.8 })
    );
    strap.position.set(xPos, -0.32, 0);
    tacticalGroup.add(strap);
  });

  tacticalGroup.visible = false;
  camdenGroup.add(tacticalGroup);

  // Ground Contact Shadow
  const shadow = createDecalShadow(3.2, 1.6, 0.65);
  camdenGroup.add(shadow);

  // Hotspots for architectural inspection
  const hotspots: HotspotInfo[] = [
    {
      id: 'camden-chamfer',
      title: '35° Anti-Recumbent Ridge',
      detail: 'Peaked transverse apex slopes downward at 35° on both facets, physically preventing lying flat without sliding.',
      pos: [-3.2, 0.95, 0.8],
    },
    {
      id: 'camden-armrest',
      title: 'Cast Bronze Divider Hoops',
      detail: 'Three heavy architectural bronze hoops partition the span into narrow single-occupant bays to prevent resting.',
      pos: [-3.2, 1.05, 0.8],
    },
    {
      id: 'camden-skate',
      title: 'Anti-Skate Grind Studs',
      detail: 'Milled bronze notched pucks tamper-fastened along the chamfer edge to fracture skateboard trucks.',
      pos: [-4.1, 0.72, 0.8],
    },
    {
      id: 'camden-plaque',
      title: 'Municipal Civic Plaque',
      detail: 'Official London Borough of Camden Type C-100 certification badge marking asset ownership and patent authority.',
      pos: [-3.2, 0.52, 1.3],
    },
  ];

  return {
    group: camdenGroup,
    tacticalMesh: tacticalGroup,
    hotspots,
  };
}

// =========================================================================
// 2. AUTONOMOUS PANOPTICON GAZE MAST & MULTI-SENSOR TOWER
// =========================================================================
export function buildPanopticonMast(materials: SharedMaterials) {
  const mastGroup = new THREE.Group();
  mastGroup.position.set(0, 0.18, -2.2);

  const { concreteMat, brushedSteelMat, darkGraniteMat } = materials;

  const galvMastTex = createGalvanizedMastTexture();
  const galvMastMat = new THREE.MeshStandardMaterial({
    map: galvMastTex,
    metalness: 0.88,
    roughness: 0.32,
  });

  // A. Octagonal Concrete Foundation Plinth with Chamfered Perimeter
  const padGeo = new THREE.CylinderGeometry(0.72, 0.78, 0.22, 8);
  const pad = new THREE.Mesh(padGeo, concreteMat);
  pad.position.y = 0.11;
  pad.receiveShadow = true;
  mastGroup.add(pad);

  // B. Heavy Structural Anchor Ring with 8 Studs & Double Hex Locknuts
  const baseFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.52, 0.08, 8), galvMastMat);
  baseFlange.position.y = 0.25;
  baseFlange.castShadow = true;
  mastGroup.add(baseFlange);

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const studX = Math.cos(angle) * 0.4;
    const studZ = Math.sin(angle) * 0.4;

    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 6), brushedSteelMat);
    bolt.position.set(studX, 0.32, studZ);
    mastGroup.add(bolt);

    const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 0.04, 6), brushedSteelMat);
    nut.position.set(studX, 0.31, studZ);
    mastGroup.add(nut);
  }

  // C. Hot-Dip Galvanized Octagonal Stepped Mast
  const mastLower = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.26, 3.2, 8), galvMastMat);
  mastLower.position.y = 1.85;
  mastLower.castShadow = true;
  mastGroup.add(mastLower);

  // Reflective Municipal Warning Chevron Band on Mast
  const chevronBand = new THREE.Mesh(
    new THREE.CylinderGeometry(0.225, 0.235, 0.4, 8),
    new THREE.MeshStandardMaterial({
      map: materials.hazardTex,
      roughness: 0.3,
      metalness: 0.1,
    })
  );
  chevronBand.position.y = 1.9;
  mastGroup.add(chevronBand);

  const mastStep = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 8), galvMastMat);
  mastStep.position.y = 3.48;
  mastGroup.add(mastStep);

  const mastUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.2, 3.2, 8), galvMastMat);
  mastUpper.position.y = 5.1;
  mastUpper.castShadow = true;
  mastGroup.add(mastUpper);

  // D. Lower Lockable Service Access Door with Padlock Hasp & Grounding Strap
  const hatch = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.68, 0.04), darkGraniteMat);
  hatch.position.set(0, 1.25, 0.23);
  mastGroup.add(hatch);

  const keyHole = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.02, 8), brushedSteelMat);
  keyHole.rotation.x = Math.PI / 2;
  keyHole.position.set(0.05, 1.5, 0.25);
  mastGroup.add(keyHole);

  const earthLug = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.02), materials.bronzeMat);
  earthLug.position.set(-0.15, 0.36, 0.2);
  mastGroup.add(earthLug);

  // E. NEMA 4X Telemetry Cabinet with Louvers & High-Voltage Warning Decal
  const cabinetGroup = new THREE.Group();
  cabinetGroup.position.set(0, 2.5, 0.26);

  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.76, 0.34), galvMastMat);
  cabinet.castShadow = true;
  cabinetGroup.add(cabinet);

  // Padlock latches
  [-0.18, 0.18].forEach((xPos) => {
    const latch = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.08, 0.02), brushedSteelMat);
    latch.position.set(xPos, 0, 0.175);
    cabinetGroup.add(latch);
  });

  // Warning Decal on Cabinet Door
  const decalMat = new THREE.MeshStandardMaterial({
    map: createMastHazardDecalTexture(),
    roughness: 0.35,
    metalness: 0.1,
  });
  const decalMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.34), decalMat);
  decalMesh.position.set(0, 0.05, 0.172);
  cabinetGroup.add(decalMesh);
  mastGroup.add(cabinetGroup);

  // F. Mid-Mast Sensor Outrigger Array (Acoustic triangulation, air sniffer, PA speaker horn)
  const sensorBracket = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.12), galvMastMat);
  sensorBracket.position.set(-0.38, 4.3, 0);
  mastGroup.add(sensorBracket);

  // 1. Acoustic gunshot / scream triangulation mic cluster
  const micCluster = new THREE.Group();
  micCluster.position.set(-0.7, 4.3, 0);
  for (let i = 0; i < 3; i++) {
    const micArm = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.16, 8), brushedSteelMat);
    micArm.rotation.z = (i / 3) * Math.PI * 2;
    micCluster.add(micArm);

    const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 12), darkGraniteMat);
    micHead.position.set(Math.cos(micArm.rotation.z) * 0.09, Math.sin(micArm.rotation.z) * 0.09, 0);
    micCluster.add(micHead);
  }
  mastGroup.add(micCluster);

  // 2. Air quality laser particulate sniffer pod
  const snifferPod = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.22, 12), brushedSteelMat);
  snifferPod.position.set(-0.38, 4.45, 0.12);
  mastGroup.add(snifferPod);

  // 3. Municipal Audio PA Megaphone Speaker Horn
  const paHorn = new THREE.Mesh(
    new THREE.ConeGeometry(0.12, 0.24, 16, 1, true),
    darkGraniteMat
  );
  paHorn.rotation.x = -Math.PI / 2;
  paHorn.position.set(0.32, 4.3, 0.16);
  mastGroup.add(paHorn);

  // G. Motorized Dual-Arm Gimbal Pan-Tilt Head Assembly
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 6.7, 0);

  const rotatorCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 16), darkGraniteMat);
  rotatorCollar.position.y = 0.06;
  headGroup.add(rotatorCollar);

  const forkBase = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.18), darkGraniteMat);
  forkBase.position.y = 0.16;
  headGroup.add(forkBase);

  [-0.22, 0.22].forEach((xPos) => {
    const forkArm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.14), darkGraniteMat);
    forkArm.position.set(xPos, 0.33, 0);
    forkArm.castShadow = true;
    headGroup.add(forkArm);

    const pivotCap = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.02, 16), brushedSteelMat);
    pivotCap.rotation.z = Math.PI / 2;
    pivotCap.position.set(xPos + (xPos > 0 ? 0.035 : -0.035), 0.44, 0);
    headGroup.add(pivotCap);
  });

  // Camera Housing Body
  const camHousing = new THREE.Group();
  camHousing.position.set(0, 0.44, 0.12);

  const mainTube = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.54, 24), darkGraniteMat);
  mainTube.rotation.x = Math.PI / 2;
  mainTube.castShadow = true;
  camHousing.add(mainTube);

  // Sun-Shield Visor Cowl
  const visor = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.18, 0.34, 24, 1, true, 0, Math.PI * 1.3),
    darkGraniteMat
  );
  visor.rotation.x = Math.PI / 2;
  visor.position.set(0, 0.04, 0.18);
  camHousing.add(visor);

  // Front Lens Bezel
  const lensBezel = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.02, 16, 32), brushedSteelMat);
  lensBezel.position.set(0, 0, 0.27);
  camHousing.add(lensBezel);

  // Primary Multicoated Optical Lens (Deep sapphire reflection)
  const lensGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.125, 24, 24, 0, Math.PI * 2, 0, Math.PI * 0.45),
    new THREE.MeshPhysicalMaterial({
      color: 0x051d38,
      metalness: 0.95,
      roughness: 0.02,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      reflectivity: 0.9,
    })
  );
  lensGlass.rotation.x = Math.PI / 2;
  lensGlass.position.set(0, 0, 0.28);
  camHousing.add(lensGlass);

  // Secondary Thermal FLIR Germanium Lens
  const thermalLens = new THREE.Mesh(
    new THREE.SphereGeometry(0.042, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0x78350f, metalness: 0.9, roughness: 0.1 })
  );
  thermalLens.position.set(0.07, 0.07, 0.27);
  camHousing.add(thermalLens);

  // Circular Ring of 12 Infrared Night-Vision LEDs
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    const irLED = new THREE.Mesh(
      new THREE.SphereGeometry(0.01, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0xef4444 })
    );
    irLED.position.set(Math.cos(a) * 0.11, Math.sin(a) * 0.11, 0.275);
    camHousing.add(irLED);
  }

  // Camera Rain Wiper Blade
  const wiperArm = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.13, 0.006), brushedSteelMat);
  wiperArm.position.set(-0.04, 0.02, 0.295);
  wiperArm.rotation.z = 0.35;
  camHousing.add(wiperArm);

  // Status Indicator LEDs
  const powerLED = new THREE.Mesh(new THREE.SphereGeometry(0.01, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  powerLED.position.set(-0.11, -0.09, 0.27);
  camHousing.add(powerLED);

  headGroup.add(camHousing);

  // H. Tactical Dazzler Counter Intervention (IR overexposure strobe array)
  const dazzlerGroup = new THREE.Group();
  dazzlerGroup.position.set(0, 0.44, 0.48);

  const dazzlerShield = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.24, 0.04, 16),
    new THREE.MeshStandardMaterial({ color: 0x0284c7, metalness: 0.95, roughness: 0.15 })
  );
  dazzlerShield.rotation.x = Math.PI / 2;
  dazzlerGroup.add(dazzlerShield);

  const dazzlerCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
  );
  dazzlerGroup.add(dazzlerCore);
  dazzlerGroup.visible = false;
  headGroup.add(dazzlerGroup);

  mastGroup.add(headGroup);

  // I. Floor Laser Reticle Projection Mesh
  const reticleGroup = new THREE.Group();
  reticleGroup.position.set(0, 0.185, 1.2);

  const outerCircle = new THREE.Mesh(
    new THREE.RingGeometry(1.4, 1.45, 48),
    new THREE.MeshBasicMaterial({ color: 0xff1e38, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  outerCircle.rotation.x = -Math.PI / 2;
  reticleGroup.add(outerCircle);

  const innerCircle = new THREE.Mesh(
    new THREE.RingGeometry(0.3, 0.33, 32),
    new THREE.MeshBasicMaterial({ color: 0xff1e38, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
  );
  innerCircle.rotation.x = -Math.PI / 2;
  reticleGroup.add(innerCircle);

  // Crosshair ticks
  for (let rot = 0; rot < Math.PI * 2; rot += Math.PI / 2) {
    const tick = new THREE.Mesh(
      new THREE.PlaneGeometry(0.04, 0.42),
      new THREE.MeshBasicMaterial({ color: 0xff1e38, side: THREE.DoubleSide, transparent: true, opacity: 0.85 })
    );
    tick.rotation.x = -Math.PI / 2;
    tick.rotation.z = rot;
    tick.position.set(Math.cos(rot) * 1.55, 0, Math.sin(rot) * 1.55);
    reticleGroup.add(tick);
  }

  // Ground Shadow
  const shadow = createDecalShadow(2.2, 2.2, 0.7);
  mastGroup.add(shadow);

  // Hotspots
  const hotspots: HotspotInfo[] = [
    {
      id: 'panopticon-ptz',
      title: 'Dual-Spectrum PTZ Head',
      detail: 'High-magnification optical lens paired with a 7-14µm thermal FLIR sensor and 12-LED infrared illuminator ring.',
      pos: [0, 7.1, -2.0],
    },
    {
      id: 'panopticon-audio',
      title: 'Acoustic Anomaly Boom',
      detail: 'Triangulated array of omnidirectional high-SPL microphones tuned for scream and gunshot detection.',
      pos: [-0.7, 4.5, -2.2],
    },
    {
      id: 'panopticon-cabinet',
      title: 'NEMA-4X Telemetry Locker',
      detail: 'IP66 weather-sealed control locker with edge-AI biometrics processors and 400V power interlocks.',
      pos: [0, 2.8, -1.9],
    },
    {
      id: 'panopticon-reticle',
      title: 'Ground Targeting Reticle',
      detail: 'Floor-projected boundary circle demarcating the algorithmic high-density loitering surveillance zone.',
      pos: [0, 0.2, -1.0],
    },
  ];

  return {
    group: mastGroup,
    head: headGroup,
    reticle: reticleGroup,
    tacticalMesh: dazzlerGroup,
    hotspots,
  };
}

// =========================================================================
// 3. DEFENSIVE PERIMETER SPIKES (Anti-Rough-Sleeping Pyramidal Studs)
// =========================================================================
export function buildDefensiveSpikes(materials: SharedMaterials) {
  const spikesGroup = new THREE.Group();
  spikesGroup.position.set(4.2, 0.18, -0.6);

  const { darkGraniteMat, brushedSteelMat } = materials;

  // A. Architectural Building Facade Backdrop (Window Recess Alcove)
  // This anchors the spikes directly into realistic architecture so they don't look floating or abstract!
  const facadeWall = new THREE.Mesh(
    new THREE.BoxGeometry(3.6, 2.8, 0.3),
    materials.concreteMat
  );
  facadeWall.position.set(0, 1.4, -0.52);
  facadeWall.castShadow = true;
  facadeWall.receiveShadow = true;
  spikesGroup.add(facadeWall);

  // Recessed Security Window Bay
  const windowFrame = new THREE.Mesh(
    new THREE.BoxGeometry(3.1, 1.8, 0.08),
    darkGraniteMat
  );
  windowFrame.position.set(0, 1.5, -0.38);
  spikesGroup.add(windowFrame);

  // Dark Reflective Security Glass
  const windowGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(2.9, 1.6),
    new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      roughness: 0.1,
      metalness: 0.9,
      reflectivity: 0.8,
    })
  );
  windowGlass.position.set(0, 1.5, -0.33);
  spikesGroup.add(windowGlass);

  // Vertical Wrought Iron Security Bars inside Window Reveal
  for (let b = -1.2; b <= 1.2; b += 0.3) {
    const bar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.012, 0.012, 1.6, 8),
      materials.galvanizedSteelMat
    );
    bar.position.set(b, 1.5, -0.31);
    bar.castShadow = true;
    spikesGroup.add(bar);
  }

  // B. Architectural Carved Granite Window Sill / Ledge with Weather Drip Groove
  const sillBody = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.42, 0.88), darkGraniteMat);
  sillBody.position.y = 0.21;
  sillBody.receiveShadow = true;
  sillBody.castShadow = true;
  spikesGroup.add(sillBody);

  // Sill Nosing / Drip Edge Moulding
  const nosing = new THREE.Mesh(new THREE.BoxGeometry(3.34, 0.08, 0.06), darkGraniteMat);
  nosing.position.set(0, 0.38, 0.46);
  nosing.castShadow = true;
  spikesGroup.add(nosing);

  // Weathering Drip Groove Underneath Nosing
  const dripGroove = new THREE.Mesh(new THREE.BoxGeometry(3.32, 0.015, 0.015), darkGraniteMat);
  dripGroove.position.set(0, 0.33, 0.44);
  spikesGroup.add(dripGroove);

  // C. Twin Extruded Stainless Steel Mounting Channels with Slotted Holes
  [-0.18, 0.18].forEach((zPos) => {
    const channel = new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.024, 0.16), brushedSteelMat);
    channel.position.set(0, 0.432, zPos);
    channel.castShadow = true;
    spikesGroup.add(channel);

    // Expansion Sleeve Anchor Hex Bolts every 25cm
    for (let c = 0; c < 12; c++) {
      const xPos = -1.35 + c * 0.245;

      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.02, 6), brushedSteelMat);
      bolt.position.set(xPos, 0.446, zPos + 0.05);
      spikesGroup.add(bolt);

      const washer = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 12), brushedSteelMat);
      washer.position.set(xPos, 0.438, zPos + 0.05);
      spikesGroup.add(washer);
    }
  });

  // D. Staggered 4-Sided Pyramidal Stainless Steel Studs with Safety-Code Blunted Tips
  for (let row = 0; row < 2; row++) {
    const zOffset = -0.18 + row * 0.36;
    const colCount = 14;

    for (let col = 0; col < colCount; col++) {
      const xOffset = row % 2 === 0 ? 0 : 0.1;
      const xPos = -1.3 + col * 0.2 + xOffset;

      if (xPos > 1.45 || xPos < -1.45) continue;

      // 4-sided pyramid geometry
      const spikeGeo = new THREE.ConeGeometry(0.048, 0.24, 4);
      const spikeMesh = new THREE.Mesh(spikeGeo, brushedSteelMat);
      spikeMesh.rotation.y = Math.PI / 4;
      spikeMesh.position.set(xPos, 0.55, zOffset);
      spikeMesh.castShadow = true;
      spikesGroup.add(spikeMesh);

      // Stud base collar
      const studCollar = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.015, 0.07), brushedSteelMat);
      studCollar.position.set(xPos, 0.44, zOffset);
      spikesGroup.add(studCollar);
    }
  }

  // E. Anti-Cardboard Bridging Transverse Plates
  [-0.65, 0.0, 0.65].forEach((xPos) => {
    const bridgeBlocker = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.52), brushedSteelMat);
    bridgeBlocker.position.set(xPos, 0.49, 0);
    bridgeBlocker.castShadow = true;
    spikesGroup.add(bridgeBlocker);
  });

  // F. Laser-Etched Stainless Steel Warning Plaque on Sill Face
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: createSpikePlaqueTexture(),
    metalness: 0.9,
    roughness: 0.25,
  });
  const plaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.22), plaqueMat);
  plaqueMesh.position.set(0, 0.23, 0.445);
  plaqueMesh.castShadow = true;
  spikesGroup.add(plaqueMesh);

  // G. Tactical Counter: Custom CNC Interlocking EVA Foam Alcove Bridge
  const tacticalGroup = new THREE.Group();
  tacticalGroup.position.set(0, 0.58, 0);

  const evaMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    roughness: 0.85,
    metalness: 0.05,
  });
  const foamBlock = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.28, 0.82), evaMat);
  foamBlock.position.y = 0;
  foamBlock.castShadow = true;
  tacticalGroup.add(foamBlock);

  // Stenciled white text ribbon
  const stencilBanner = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 0.12),
    new THREE.MeshBasicMaterial({ color: 0xf8fafc, transparent: true, opacity: 0.9 })
  );
  stencilBanner.rotation.x = -Math.PI / 2;
  stencilBanner.position.set(0, 0.142, 0);
  tacticalGroup.add(stencilBanner);

  // Carrying cutout handles on ends
  [-1.4, 1.4].forEach((xPos) => {
    const handleVoid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.84, 16), darkGraniteMat);
    handleVoid.rotation.x = Math.PI / 2;
    handleVoid.position.set(xPos, 0.02, 0);
    tacticalGroup.add(handleVoid);
  });

  tacticalGroup.visible = false;
  spikesGroup.add(tacticalGroup);

  // Ground Shadow
  const shadow = createDecalShadow(3.8, 1.5, 0.62);
  spikesGroup.add(shadow);

  // Hotspots
  const hotspots: HotspotInfo[] = [
    {
      id: 'spikes-pyramid',
      title: 'Machined Pyramidal Studs',
      detail: 'Staggered 4-sided steel pyramids with blunted safety tips designed to create acute pressure points.',
      pos: [4.2, 0.78, -0.6],
    },
    {
      id: 'spikes-bridge',
      title: 'Anti-Cardboard Baffles',
      detail: 'Transverse upright plates welded between spike rows to prevent spanning with cardboard, plywood, or sleeping bags.',
      pos: [4.2, 0.72, -0.6],
    },
    {
      id: 'spikes-channel',
      title: 'Grade 316 Stainless Channel',
      detail: 'Tamper-resistant chemical sleeve anchor channels bolted into the architectural granite ledge.',
      pos: [4.2, 0.62, -0.4],
    },
    {
      id: 'spikes-plaque',
      title: 'Laser-Etched Warning Sign',
      detail: 'Municipal exclusion notice citing §4 Criminal Justice Act establishing liability for trespassing on the ledge.',
      pos: [4.2, 0.42, -0.15],
    },
  ];

  return {
    group: spikesGroup,
    tacticalMesh: tacticalGroup,
    hotspots,
  };
}

// =========================================================================
// 4. HIGH-FREQUENCY ULTRASONIC MOSQUITO DISPERSER (Compound Security Systems)
// =========================================================================
export function buildMosquitoEmitter(materials: SharedMaterials) {
  const mosquitoGroup = new THREE.Group();
  mosquitoGroup.position.set(3.8, 2.9, -3.95);

  const { darkGraniteMat, brushedSteelMat, bronzeMat, galvanizedSteelMat } = materials;

  // A. Wall Mount Flange with 4 Lag Expansion Bolts
  const wallFlange = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.44, 0.03), galvanizedSteelMat);
  wallFlange.position.set(0, 0, -0.16);
  mosquitoGroup.add(wallFlange);

  [[-0.14, -0.17], [0.14, -0.17], [-0.14, 0.17], [0.14, 0.17]].forEach(([x, y]) => {
    const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.03, 6), brushedSteelMat);
    bolt.rotation.x = Math.PI / 2;
    bolt.position.set(x, y, -0.14);
    mosquitoGroup.add(bolt);
  });

  // Rigid Galvanized EMT Conduit Pipe Running Down from Wall Junction Box
  const conduitPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 1.8, 12),
    galvanizedSteelMat
  );
  conduitPipe.position.set(0.12, 0.95, -0.13);
  mosquitoGroup.add(conduitPipe);

  const conduitFitting = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.06, 12), brushedSteelMat);
  conduitFitting.position.set(0.12, 0.22, -0.13);
  mosquitoGroup.add(conduitFitting);

  // B. Die-Cast Aluminum Enclosure Chassis with Cooling Fins
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.22), darkGraniteMat);
  chassis.position.set(0, 0, -0.02);
  chassis.castShadow = true;
  mosquitoGroup.add(chassis);

  // Cooling fins along top
  for (let i = 0; i < 5; i++) {
    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.025, 0.2), darkGraniteMat);
    fin.position.set(0, 0.19 + i * 0.022, -0.02);
    mosquitoGroup.add(fin);
  }

  // Key-operated arming switch barrel on chassis side
  const keyBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.03, 12), brushedSteelMat);
  keyBarrel.rotation.z = Math.PI / 2;
  keyBarrel.position.set(0.17, -0.08, 0.0);
  mosquitoGroup.add(keyBarrel);

  // Status LEDs
  const activeLED = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), new THREE.MeshBasicMaterial({ color: 0x22c55e }));
  activeLED.position.set(-0.1, 0.14, 0.095);
  mosquitoGroup.add(activeLED);

  const pulseLED = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 8), new THREE.MeshBasicMaterial({ color: 0xf59e0b }));
  pulseLED.position.set(-0.06, 0.14, 0.095);
  mosquitoGroup.add(pulseLED);

  // C. Machined Acoustic Compression Horn with Hexagonal Grille
  const horn = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.32, 24, 1, true),
    brushedSteelMat
  );
  horn.rotation.x = Math.PI / 2;
  horn.position.set(0, 0, 0.22);
  horn.castShadow = true;
  mosquitoGroup.add(horn);

  // Perforated Hexagonal Acoustic Speaker Grille Mesh
  const grilleTex = createHexAcousticGrilleTexture();
  const grilleMat = new THREE.MeshStandardMaterial({
    map: grilleTex,
    roughness: 0.4,
    metalness: 0.8,
  });
  const grilleDisc = new THREE.Mesh(new THREE.CircleGeometry(0.14, 24), grilleMat);
  grilleDisc.position.set(0, 0, 0.16);
  mosquitoGroup.add(grilleDisc);

  // Central Bronze Acoustic Phase Bullet
  const phaseBullet = new THREE.Mesh(
    new THREE.CylinderGeometry(0.035, 0.055, 0.16, 16),
    bronzeMat
  );
  phaseBullet.rotation.x = Math.PI / 2;
  phaseBullet.position.set(0, 0, 0.25);
  mosquitoGroup.add(phaseBullet);

  // D. 16-Gauge Vandal-Resistant Steel Security Cage
  const cageGroup = new THREE.Group();
  cageGroup.position.set(0, 0, 0.18);

  const cageBarMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.7, roughness: 0.4 });
  for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.38, 8), cageBarMat);
    bar.position.set(Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0.02);
    bar.rotation.x = Math.PI / 2;
    cageGroup.add(bar);
  }
  const cageRingFront = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.01, 12, 24), cageBarMat);
  cageRingFront.position.z = 0.2;
  cageGroup.add(cageRingFront);

  // Brass security padlock securing the cage
  const padlockBody = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, 0.02), bronzeMat);
  padlockBody.position.set(0, -0.28, 0.15);
  cageGroup.add(padlockBody);

  const padlockShackle = new THREE.Mesh(new THREE.TorusGeometry(0.018, 0.005, 8, 16), brushedSteelMat);
  padlockShackle.position.set(0, -0.25, 0.15);
  cageGroup.add(padlockShackle);

  mosquitoGroup.add(cageGroup);

  // E. Industrial Warning Placard Mounted on Adjacent Wall
  const placardMat = new THREE.MeshStandardMaterial({
    map: createMosquitoPlacardTexture(),
    metalness: 0.2,
    roughness: 0.4,
  });
  const placardMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.28), placardMat);
  placardMesh.position.set(0.68, 0.0, -0.15);
  mosquitoGroup.add(placardMesh);

  // F. Animated Ultrasonic Shockwave Rings
  const waves: THREE.Mesh[] = [];
  for (let i = 0; i < 4; i++) {
    const ringGeo = new THREE.TorusGeometry(0.28 + i * 0.3, 0.014, 8, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 0.6 - i * 0.12,
    });
    const waveMesh = new THREE.Mesh(ringGeo, ringMat);
    waveMesh.position.set(0, 0, 0.48 + i * 0.42);
    mosquitoGroup.add(waveMesh);
    waves.push(waveMesh);
  }

  // G. Tactical Counter: Tuned Helmholtz Acoustic Muffler Cap
  const tacticalGroup = new THREE.Group();
  tacticalGroup.position.set(0, 0, 0.38);

  const mufflerBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 0.48, 24),
    new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.65, metalness: 0.15 })
  );
  mufflerBody.rotation.x = Math.PI / 2;
  mufflerBody.castShadow = true;
  tacticalGroup.add(mufflerBody);

  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.12), brushedSteelMat);
    clamp.position.set(Math.cos(angle) * 0.38, Math.sin(angle) * 0.38, -0.12);
    tacticalGroup.add(clamp);
  }

  tacticalGroup.visible = false;
  mosquitoGroup.add(tacticalGroup);

  // Hotspots
  const hotspots: HotspotInfo[] = [
    {
      id: 'mosquito-horn',
      title: '17.4 kHz Piezo Compression Horn',
      detail: 'Directional acoustic transducer emitting ear-piercing high frequency sound tuned to the presbycusis hearing range of youth under 25.',
      pos: [3.8, 3.1, -3.6],
    },
    {
      id: 'mosquito-cage',
      title: 'Anti-Vandal Security Cage',
      detail: 'Welded 16-gauge steel wire enclosure with padlocked shackle to repel physical sabotage and spray-foam muffling.',
      pos: [3.8, 2.7, -3.7],
    },
    {
      id: 'mosquito-placard',
      title: 'Bio-Acoustic Exclusion Placard',
      detail: 'Municipal disclaimer warning that ultrasonic radiation is deployed to enforce youth dispersal.',
      pos: [4.5, 2.9, -4.0],
    },
  ];

  return {
    group: mosquitoGroup,
    waves,
    tacticalMesh: tacticalGroup,
    hotspots,
  };
}

// =========================================================================
// 5. THE 65° ANTI-SIT TRANSIT PERCH (Metropolitan Transit Type LR-4)
// =========================================================================
export function buildAntiSitPerch(materials: SharedMaterials) {
  const perchGroup = new THREE.Group();
  perchGroup.position.set(-2.6, 0.18, -2.6);

  const { brushedSteelMat, darkGraniteMat } = materials;

  // Stanchions: Twin 316 Stainless Steel Tubes with Hydraulic Mandrel Bends
  [-1.05, 1.05].forEach((xPos) => {
    // Elliptical Floor Base Flange
    const flange = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.17, 0.04, 16), brushedSteelMat);
    flange.position.set(xPos, 0.02, 0);
    flange.castShadow = true;
    perchGroup.add(flange);

    // 4 High-torque anchor hex bolts
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const nut = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.02, 6), brushedSteelMat);
      nut.position.set(xPos + Math.cos(a) * 0.11, 0.045, Math.sin(a) * 0.11);
      perchGroup.add(nut);
    }

    // Spun Stainless Steel Escutcheon Beauty Cover Ring
    const coverRing = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.02, 12, 24), brushedSteelMat);
    coverRing.rotation.x = Math.PI / 2;
    coverRing.position.set(xPos, 0.04, 0);
    perchGroup.add(coverRing);

    // Mandrel Bent Tubular Stanchion (65° lean incline)
    const stanchionCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(xPos, 0.04, 0),
      new THREE.Vector3(xPos, 0.45, 0.06),
      new THREE.Vector3(xPos, 0.95, 0.28),
      new THREE.Vector3(xPos, 1.32, 0.48),
    ]);
    const stanchion = new THREE.Mesh(
      new THREE.TubeGeometry(stanchionCurve, 32, 0.052, 16, false),
      brushedSteelMat
    );
    stanchion.castShadow = true;
    perchGroup.add(stanchion);

    // Ground Contact Shadow
    const shadow = createDecalShadow(0.65, 0.65, 0.55);
    shadow.position.set(xPos, 0.002, 0.12);
    perchGroup.add(shadow);
  });

  // Tactile Yellow Blister Warning Paver Grid directly on the sidewalk in front of the perch
  const tactileMat = new THREE.MeshStandardMaterial({
    color: 0xca8a04,
    roughness: 0.6,
    metalness: 0.1,
  });
  const tactilePad = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.015, 0.55), tactileMat);
  tactilePad.position.set(0, 0.008, 0.72);
  tactilePad.receiveShadow = true;
  perchGroup.add(tactilePad);

  // Heavy Stainless Steel Crossbar Support
  const crossbar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.058, 0.058, 2.3, 24),
    brushedSteelMat
  );
  crossbar.rotation.z = Math.PI / 2;
  crossbar.position.set(0, 1.32, 0.48);
  crossbar.castShadow = true;
  perchGroup.add(crossbar);

  // Ergonomic Bolster: Sculpted High-Density Polyurethane Ribbed Lean Cushion
  const bolsterGroup = new THREE.Group();
  bolsterGroup.position.set(0, 1.32, 0.48);

  const cushionMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.75,
    metalness: 0.2,
  });
  const cushion = new THREE.Mesh(new THREE.BoxGeometry(2.18, 0.18, 0.14), cushionMat);
  cushion.rotation.x = -Math.PI * 0.14; // Exactly 65° incline to horizon
  cushion.castShadow = true;
  bolsterGroup.add(cushion);

  // Grip ribbing grooves across cushion face
  for (let i = -4; i <= 4; i++) {
    const rib = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.012, 0.012), darkGraniteMat);
    rib.rotation.x = -Math.PI * 0.14;
    rib.position.set(0, i * 0.018, 0.075);
    bolsterGroup.add(rib);
  }

  // Welded Stainless Steel Skate Stoppers & Anti-Lying Center Fin
  const centerFin = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.22, 0.26), brushedSteelMat);
  centerFin.rotation.x = -Math.PI * 0.14;
  centerFin.position.set(0, 0, 0.04);
  centerFin.castShadow = true;
  bolsterGroup.add(centerFin);

  [-0.6, 0.6].forEach((xPos) => {
    const skateFin = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.12, 0.18), brushedSteelMat);
    skateFin.rotation.x = -Math.PI * 0.14;
    skateFin.position.set(xPos, 0, 0.03);
    skateFin.castShadow = true;
    bolsterGroup.add(skateFin);
  });

  // Laser-Etched Transit Authority Badges on Tubular End-Caps
  const badgeMat = new THREE.MeshStandardMaterial({
    map: createTransitPerchBadgeTexture(),
    metalness: 0.7,
    roughness: 0.3,
  });
  [-1.16, 1.16].forEach((xPos) => {
    const badgeCap = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.06), badgeMat);
    badgeCap.rotation.y = xPos > 0 ? Math.PI / 2 : -Math.PI / 2;
    badgeCap.position.set(xPos, 0, 0);
    bolsterGroup.add(badgeCap);
  });

  perchGroup.add(bolsterGroup);

  // Tactical Counter: High-Strength Ballistic Nylon Suspended Sling Hammock
  const tacticalGroup = new THREE.Group();
  tacticalGroup.position.set(0, 0.88, 0.28);

  const slingMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    roughness: 0.85,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });
  const slingFabric = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.04, 0.78), slingMat);
  slingFabric.castShadow = true;
  tacticalGroup.add(slingFabric);

  // Aircraft aluminum carabiners
  [-1.02, 1.02].forEach((xPos) => {
    const carabiner = new THREE.Mesh(new THREE.TorusGeometry(0.04, 0.01, 8, 16), brushedSteelMat);
    carabiner.position.set(xPos, 0.38, 0.18);
    tacticalGroup.add(carabiner);

    const strap = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.42, 8), darkGraniteMat);
    strap.position.set(xPos * 0.96, 0.18, 0.08);
    tacticalGroup.add(strap);
  });

  tacticalGroup.visible = false;
  perchGroup.add(tacticalGroup);

  // Hotspots
  const hotspots: HotspotInfo[] = [
    {
      id: 'perch-angle',
      title: '65° Fatigue Incline Bolster',
      detail: 'Rigid 65° incline induces lower back and calf muscle exhaustion after 3-5 minutes, enforcing rapid passenger egress.',
      pos: [-2.6, 1.55, -2.1],
    },
    {
      id: 'perch-divider',
      title: 'Anti-Lying Center Fin',
      detail: 'Welded stainless steel barrier bisecting the rail to block across-the-bar resting.',
      pos: [-2.6, 1.45, -2.1],
    },
    {
      id: 'perch-tactile',
      title: 'Tactile Transit Warning Pavers',
      detail: 'Yellow blister studs defining the narrow pedestrian clear zone to deter lingering.',
      pos: [-2.6, 0.25, -1.85],
    },
  ];

  return {
    group: perchGroup,
    tacticalMesh: tacticalGroup,
    hotspots,
  };
}
