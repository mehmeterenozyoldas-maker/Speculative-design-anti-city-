import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { HostileArtifact, UrbanInspectionMode, SurveillanceTelemetry, LightingMode, UrbanDenizen } from '../types';
import { soundEngine } from '../audio/SpatialSoundscape';
import {
  createConcreteTexture,
  createConcreteBumpMap,
  createAsphaltTexture,
  createPaverTexture,
  createTactilePavingTexture,
  createBrushedMetalTexture,
  createHazardStripeTexture,
  createEquirectangularEnvTexture,
  createContactShadowTexture,
  createManholeTexture,
  createWarningSignTexture,
  createFloatingBadgeTexture,
  createHotspotCalloutTexture,
} from '../utils/proceduralTextures';
import {
  createStrayCatModel,
  createRedPandaModel,
  createRadioRatModel,
  createSpiritBeastModel,
  createGoldenKingModel,
} from '../utils/denizenModels';
import {
  buildCamdenBench,
  buildPanopticonMast,
  buildDefensiveSpikes,
  buildMosquitoEmitter,
  buildAntiSitPerch,
  HotspotInfo,
} from '../utils/hostileFurnitureModels';

interface ThreeCanvasProps {
  artifacts: HostileArtifact[];
  activeArtifactId: string | null;
  onSelectArtifact: (id: string | null) => void;
  denizens: UrbanDenizen[];
  activeDenizenId: string | null;
  onSelectDenizen: (id: string | null) => void;
  inspectionMode: UrbanInspectionMode;
  lightingMode: LightingMode;
  brightnessMultiplier: number;
  telemetry: SurveillanceTelemetry;
  cameraPerspective: 'orbit' | 'pedestrian' | 'panopticon';
  onTelemetryUpdate: (data: Partial<SurveillanceTelemetry>) => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  denizens,
  activeDenizenId,
  onSelectDenizen,
  inspectionMode,
  lightingMode,
  brightnessMultiplier,
  cameraPerspective,
  onTelemetryUpdate,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const pmremGeneratorRef = useRef<THREE.PMREMGenerator | null>(null);

  // Dynamic light references
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const streetLampSpotRef = useRef<THREE.SpotLight | null>(null);
  const alertSpotRef = useRef<THREE.SpotLight | null>(null);

  // Dynamic mesh references
  const panopticonHeadRef = useRef<THREE.Group | null>(null);
  const groundLaserReticleRef = useRef<THREE.Group | null>(null);
  const mosquitoWavesRef = useRef<THREE.Mesh[]>([]);
  const tacticalMeshesRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const interactiveObjectsRef = useRef<{ [key: string]: THREE.Object3D }>({});
  const denizenMeshesRef = useRef<{ [key: string]: THREE.Group }>({});
  const badgeSpritesRef = useRef<THREE.Sprite[]>([]);
  const hotspotsGroupRef = useRef<THREE.Group | null>(null);
  const hotspotsMapRef = useRef<Record<string, HotspotInfo[]>>({});
  const [activeHotspot, setActiveHotspot] = useState<HotspotInfo | null>(null);

  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseScreenRef = useRef(new THREE.Vector2());

  // Setup High-Fidelity Three.js scene
  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    // 1. SCENE SETUP - Crisp Architectural Environment
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdce5f0);
    scene.fog = new THREE.FogExp2(0xdce5f0, 0.005);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 140);
    camera.position.set(-2.0, 1.8, 3.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25 * brightnessMultiplier;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // PMREM Environment Map for realistic metallic & dielectric PBR reflections
    const pmrem = new THREE.PMREMGenerator(renderer);
    pmrem.compileEquirectangularShader();
    pmremGeneratorRef.current = pmrem;

    const initialEnvTex = createEquirectangularEnvTexture(lightingMode);
    const initialEnvMap = pmrem.fromEquirectangular(initialEnvTex).texture;
    scene.environment = initialEnvMap;
    initialEnvTex.dispose();

    // 2. ORBIT CONTROLS
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;
    controls.minDistance = 2.0;
    controls.maxDistance = 32;
    controls.target.set(-1.6, 0.9, 0.2);
    controlsRef.current = controls;

    // 3. GENERATE PBR TEXTURES
    const concreteTex = createConcreteTexture();
    concreteTex.repeat.set(2, 2);
    const concreteBump = createConcreteBumpMap();
    concreteBump.repeat.set(2, 2);

    const asphaltTex = createAsphaltTexture();
    asphaltTex.repeat.set(6, 6);

    const paverTex = createPaverTexture();
    paverTex.repeat.set(4, 4);

    const tactileTex = createTactilePavingTexture();
    tactileTex.repeat.set(10, 1);

    const metalTex = createBrushedMetalTexture();
    const hazardTex = createHazardStripeTexture();
    hazardTex.repeat.set(4, 1);

    const shadowDecalTex = createContactShadowTexture();
    const manholeTex = createManholeTexture();
    const warningSignTex = createWarningSignTexture();

    // Helper: Contact shadow plane factory
    const createContactShadow = (w: number, d: number, opacity = 0.55) => {
      const mesh = new THREE.Mesh(
        new THREE.PlaneGeometry(w, d),
        new THREE.MeshBasicMaterial({ map: shadowDecalTex, transparent: true, opacity })
      );
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.002;
      return mesh;
    };

    // 4. SHARED HIGH-END PBR MATERIALS
    const concreteMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      bumpMap: concreteBump,
      bumpScale: 0.025,
      roughness: 0.78,
      metalness: 0.05,
      color: 0xb5bac3,
    });

    const darkGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x32373f,
      roughness: 0.38,
      metalness: 0.3,
      bumpMap: concreteBump,
      bumpScale: 0.015,
    });

    const brushedSteelMat = new THREE.MeshStandardMaterial({
      map: metalTex,
      color: 0xeef2f7,
      metalness: 0.94,
      roughness: 0.22,
    });

    const bronzeMat = new THREE.MeshStandardMaterial({
      color: 0xbfa05a,
      metalness: 0.88,
      roughness: 0.26,
    });

    const galvanizedSteelMat = new THREE.MeshStandardMaterial({
      color: 0x7c8594,
      metalness: 0.75,
      roughness: 0.35,
    });

    // 5. BRIGHT, CRISP STUDIO/DAYLIGHT LIGHTING
    const hemiLight = new THREE.HemisphereLight(0xe0edff, 0xd1d5db, 2.2);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const sunLight = new THREE.DirectionalLight(0xfffdf7, 2.8);
    sunLight.position.set(12, 24, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    const shadowD = 14;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0003;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    const fillLight = new THREE.DirectionalLight(0x94b4e0, 1.4);
    fillLight.position.set(-14, 18, -12);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    // Warm Architectural Street Lamp
    const streetLampLight = new THREE.SpotLight(0xffedd5, 3.5, 20, Math.PI * 0.35, 0.45, 1.2);
    streetLampLight.position.set(-2, 7.2, 3.2);
    streetLampLight.target.position.set(-2.5, 0, 1.2);
    streetLampLight.castShadow = true;
    streetLampLight.shadow.mapSize.width = 1024;
    streetLampLight.shadow.mapSize.height = 1024;
    streetLampLight.shadow.bias = -0.0004;
    scene.add(streetLampLight);
    scene.add(streetLampLight.target);
    streetLampSpotRef.current = streetLampLight;

    // Panoptic Alert Spotlight
    const alertSpot = new THREE.SpotLight(0xff2244, 2.8, 16, Math.PI * 0.24, 0.4, 1.4);
    alertSpot.position.set(0, 6.4, -2.2);
    alertSpot.target.position.set(0, 0, 0);
    scene.add(alertSpot);
    scene.add(alertSpot.target);
    alertSpotRef.current = alertSpot;

    // 6. URBAN ENVIRONMENT (STREET, SIDEWALK, FACADE)
    const envGroup = new THREE.Group();

    // Roadway (Asphalt)
    const roadGeo = new THREE.PlaneGeometry(36, 12);
    const roadMat = new THREE.MeshStandardMaterial({
      map: asphaltTex,
      roughness: 0.55,
      metalness: 0.1,
      color: 0x2e333d,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, 4.8);
    road.receiveShadow = true;
    envGroup.add(road);

    // Embossed Cast-Iron Manhole Cover
    const manhole = new THREE.Mesh(
      new THREE.CircleGeometry(0.58, 32),
      new THREE.MeshStandardMaterial({
        map: manholeTex,
        bumpMap: manholeTex,
        bumpScale: 0.04,
        roughness: 0.65,
        metalness: 0.7,
      })
    );
    manhole.rotation.x = -Math.PI / 2;
    manhole.position.set(-3.5, 0.008, 6.2);
    manhole.receiveShadow = true;
    envGroup.add(manhole);

    // Thermoplastic White Crossing Markings
    for (let i = -12; i <= 12; i += 2.4) {
      const stripeGeo = new THREE.PlaneGeometry(0.75, 3.2);
      const stripeMat = new THREE.MeshStandardMaterial({
        color: 0xf1f5f9,
        roughness: 0.5,
        metalness: 0.05,
      });
      const stripe = new THREE.Mesh(stripeGeo, stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(i, 0.005, 4.8);
      stripe.receiveShadow = true;
      envGroup.add(stripe);
    }

    // Sidewalk Elevated Slab (+0.18m curb)
    const sidewalkGeo = new THREE.BoxGeometry(28, 0.18, 9);
    const sidewalkMat = new THREE.MeshStandardMaterial({
      map: paverTex,
      bumpMap: concreteBump,
      bumpScale: 0.015,
      roughness: 0.75,
      metalness: 0.05,
      color: 0xa8afb9,
    });
    const sidewalk = new THREE.Mesh(sidewalkGeo, sidewalkMat);
    sidewalk.position.set(0, 0.09, -0.6);
    sidewalk.receiveShadow = true;
    envGroup.add(sidewalk);

    // Granite Curbstone
    const curbGeo = new THREE.BoxGeometry(28, 0.22, 0.25);
    const curb = new THREE.Mesh(curbGeo, darkGraniteMat);
    curb.position.set(0, 0.11, 3.9);
    curb.receiveShadow = true;
    curb.castShadow = true;
    envGroup.add(curb);

    // Tactile Blister Paving Warning Strip
    const tactileGeo = new THREE.PlaneGeometry(28, 0.55);
    const tactileMat = new THREE.MeshStandardMaterial({
      map: tactileTex,
      roughness: 0.65,
      metalness: 0.1,
    });
    const tactileStrip = new THREE.Mesh(tactileGeo, tactileMat);
    tactileStrip.rotation.x = -Math.PI / 2;
    tactileStrip.position.set(0, 0.182, 3.48);
    tactileStrip.receiveShadow = true;
    envGroup.add(tactileStrip);

    // Cast-iron Street Drain Grate
    const drainGeo = new THREE.PlaneGeometry(0.85, 1.3);
    const drainMat = new THREE.MeshStandardMaterial({
      color: 0x23272e,
      metalness: 0.85,
      roughness: 0.45,
    });
    const drain = new THREE.Mesh(drainGeo, drainMat);
    drain.rotation.x = -Math.PI / 2;
    drain.position.set(-5, 0.006, 3.6);
    envGroup.add(drain);

    // 2 Architectural Anti-Ram Safety Bollards
    [-1.4, 2.4].forEach((xPos) => {
      const bollardGroup = new THREE.Group();
      bollardGroup.position.set(xPos, 0.18, 3.8);

      const bollardBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.06, 16), darkGraniteMat);
      bollardBase.position.y = 0.03;
      bollardGroup.add(bollardBase);

      const bollardPole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.95, 16), brushedSteelMat);
      bollardPole.position.y = 0.5;
      bollardPole.castShadow = true;
      bollardGroup.add(bollardPole);

      const bollardCap = new THREE.Mesh(
        new THREE.SphereGeometry(0.09, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5),
        brushedSteelMat
      );
      bollardCap.position.y = 0.975;
      bollardGroup.add(bollardCap);

      const bollardHazard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.092, 0.092, 0.1, 16),
        new THREE.MeshStandardMaterial({ map: hazardTex })
      );
      bollardHazard.position.y = 0.82;
      bollardGroup.add(bollardHazard);

      const bollardShadow = createContactShadow(0.65, 0.65, 0.6);
      bollardGroup.add(bollardShadow);

      envGroup.add(bollardGroup);
    });

    // Smart City Solar Compacting Waste Station ("CleanCity Sensor Unit")
    const binGroup = new THREE.Group();
    binGroup.position.set(-5.4, 0.18, -0.6);

    const binBody = new THREE.Mesh(
      new THREE.BoxGeometry(0.72, 1.25, 0.68),
      new THREE.MeshStandardMaterial({ color: 0x22262e, roughness: 0.45, metalness: 0.35 })
    );
    binBody.position.y = 0.625;
    binBody.castShadow = true;
    binGroup.add(binBody);

    const binRoof = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 0.06, 0.72),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.1, metalness: 0.9 })
    );
    binRoof.rotation.x = 0.1;
    binRoof.position.set(0, 1.28, 0);
    binGroup.add(binRoof);

    const binDoor = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.36, 0.03), brushedSteelMat);
    binDoor.position.set(0, 0.82, 0.355);
    binGroup.add(binDoor);

    const binLed = new THREE.Mesh(
      new THREE.SphereGeometry(0.02, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    binLed.position.set(0.26, 1.15, 0.35);
    binGroup.add(binLed);

    const binShadow = createContactShadow(1.4, 1.3, 0.55);
    binGroup.add(binShadow);

    envGroup.add(binGroup);

    // Architectural Building Facade Wall
    const facadeGeo = new THREE.BoxGeometry(28, 11, 1.4);
    const facadeMat = new THREE.MeshStandardMaterial({
      map: concreteTex,
      bumpMap: concreteBump,
      bumpScale: 0.02,
      roughness: 0.85,
      color: 0x5a606d,
    });
    const facadeWall = new THREE.Mesh(facadeGeo, facadeMat);
    facadeWall.position.set(0, 5.5, -4.8);
    facadeWall.receiveShadow = true;
    facadeWall.castShadow = true;
    envGroup.add(facadeWall);

    // Municipal CCTV Notice Sign Plaque on Wall
    const wallSign = new THREE.Mesh(
      new THREE.PlaneGeometry(0.65, 0.34),
      new THREE.MeshStandardMaterial({ map: warningSignTex, roughness: 0.3, metalness: 0.5 })
    );
    wallSign.position.set(-0.8, 3.2, -4.08);
    envGroup.add(wallSign);

    // Storefront Window with Interior Gallery Depth
    const windowFrameGeo = new THREE.BoxGeometry(10, 3.6, 0.4);
    const windowFrame = new THREE.Mesh(windowFrameGeo, darkGraniteMat);
    windowFrame.position.set(3.8, 2.2, -4.0);
    envGroup.add(windowFrame);

    const glassGeo = new THREE.PlaneGeometry(9.6, 3.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e293b,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.45,
      transparent: true,
      opacity: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
    });
    const glassPane = new THREE.Mesh(glassGeo, glassMat);
    glassPane.position.set(3.8, 2.2, -3.78);
    envGroup.add(glassPane);

    // Interior exhibit behind storefront glass
    const interiorPlinth = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.95, 0.7),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 })
    );
    interiorPlinth.position.set(3.8, 0.95, -4.7);
    envGroup.add(interiorPlinth);

    const interiorSculpture = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.2, 0.055, 64, 16),
      bronzeMat
    );
    interiorSculpture.position.set(3.8, 1.7, -4.7);
    envGroup.add(interiorSculpture);

    const interiorSpot = new THREE.PointLight(0xfff3e0, 2.4, 7, 1.5);
    interiorSpot.position.set(3.8, 3.2, -4.4);
    envGroup.add(interiorSpot);

    // Modern Street Lamp Post
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-2, 0.18, 3.2);

    const lampPoleGeo = new THREE.CylinderGeometry(0.09, 0.12, 7.0, 16);
    const lampPole = new THREE.Mesh(lampPoleGeo, galvanizedSteelMat);
    lampPole.position.y = 3.5;
    lampPole.castShadow = true;
    lampGroup.add(lampPole);

    const lampArmGeo = new THREE.CylinderGeometry(0.06, 0.06, 1.8, 12);
    const lampArm = new THREE.Mesh(lampArmGeo, galvanizedSteelMat);
    lampArm.rotation.z = Math.PI / 3;
    lampArm.position.set(-0.7, 7.0, -0.6);
    lampGroup.add(lampArm);

    const luminaire = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.45), darkGraniteMat);
    luminaire.position.set(-1.4, 7.4, -1.0);
    lampGroup.add(luminaire);

    const ledEmitter = new THREE.Mesh(
      new THREE.PlaneGeometry(0.75, 0.38),
      new THREE.MeshBasicMaterial({ color: 0xfff3e0 })
    );
    ledEmitter.rotation.x = Math.PI / 2;
    ledEmitter.position.set(-1.4, 7.32, -1.0);
    lampGroup.add(ledEmitter);

    const lampShadow = createContactShadow(0.8, 0.8, 0.5);
    lampGroup.add(lampShadow);

    envGroup.add(lampGroup);
    scene.add(envGroup);

    // ==========================================
    // 7. HIGH-FIDELITY HOSTILE ARTIFACTS
    // ==========================================
    const sharedFurnitureMaterials = {
      concreteMat,
      darkGraniteMat,
      brushedSteelMat,
      galvanizedSteelMat,
      bronzeMat,
      hazardTex,
    };

    // --- ARTIFACT 1: The Camden Deterrent Bench (LB Camden Type C-100) ---
    const camdenData = buildCamdenBench(sharedFurnitureMaterials);
    scene.add(camdenData.group);
    interactiveObjectsRef.current['camden-bench'] = camdenData.group;
    tacticalMeshesRef.current['camden-bench'] = camdenData.tacticalMesh;

    // --- ARTIFACT 2: Autonomous Panopticon Gaze Tower & Multi-Sensor Mast ---
    const panopticonData = buildPanopticonMast(sharedFurnitureMaterials);
    scene.add(panopticonData.group);
    interactiveObjectsRef.current['panopticon-pole'] = panopticonData.group;
    tacticalMeshesRef.current['panopticon-pole'] = panopticonData.tacticalMesh;
    panopticonHeadRef.current = panopticonData.head;
    groundLaserReticleRef.current = panopticonData.reticle;
    scene.add(panopticonData.reticle);

    // --- ARTIFACT 3: Defensive Window Sill Spikes (Pyramidal Studs) ---
    const spikesData = buildDefensiveSpikes(sharedFurnitureMaterials);
    scene.add(spikesData.group);
    interactiveObjectsRef.current['anti-rough-sleeping-spikes'] = spikesData.group;
    tacticalMeshesRef.current['anti-rough-sleeping-spikes'] = spikesData.tacticalMesh;

    // --- ARTIFACT 4: High-Frequency Ultrasonic Mosquito Emitter ---
    const mosquitoData = buildMosquitoEmitter(sharedFurnitureMaterials);
    scene.add(mosquitoData.group);
    interactiveObjectsRef.current['acoustic-mosquito'] = mosquitoData.group;
    tacticalMeshesRef.current['acoustic-mosquito'] = mosquitoData.tacticalMesh;
    mosquitoWavesRef.current = mosquitoData.waves;

    // --- ARTIFACT 5: The 65° Anti-Sit Transit Perch (Type LR-4) ---
    const perchData = buildAntiSitPerch(sharedFurnitureMaterials);
    scene.add(perchData.group);
    interactiveObjectsRef.current['anti-sit-leaner'] = perchData.group;
    tacticalMeshesRef.current['anti-sit-leaner'] = perchData.tacticalMesh;

    // Store artifact hotspots for architectural inspection
    hotspotsMapRef.current['camden-bench'] = camdenData.hotspots;
    hotspotsMapRef.current['panopticon-pole'] = panopticonData.hotspots;
    hotspotsMapRef.current['anti-rough-sleeping-spikes'] = spikesData.hotspots;
    hotspotsMapRef.current['acoustic-mosquito'] = mosquitoData.hotspots;
    hotspotsMapRef.current['anti-sit-leaner'] = perchData.hotspots;

    const hotspotsGroup = new THREE.Group();
    scene.add(hotspotsGroup);
    hotspotsGroupRef.current = hotspotsGroup;

    // --- 3D FLOATING INTERACTIVE ARTIFACT BADGES ---
    const badgeConfigs: {
      id: string;
      code: string;
      title: string;
      pos: [number, number, number];
      color: string;
    }[] = [
      {
        id: 'camden-bench',
        code: '01 · ANTI-SLEEP',
        title: 'CAMDEN DETERRENT BENCH',
        pos: [-3.2, 1.35, 0.8],
        color: '#38bdf8',
      },
      {
        id: 'panopticon-pole',
        code: '02 · OPTICAL GAZE',
        title: 'BIOMETRIC SURVEILLANCE MAST',
        pos: [0, 5.2, -2.2],
        color: '#ef4444',
      },
      {
        id: 'anti-rough-sleeping-spikes',
        code: '03 · PHYSICAL DEFENSE',
        title: 'DEFENSIVE SILL SPIKES',
        pos: [4.2, 1.25, -0.6],
        color: '#f59e0b',
      },
      {
        id: 'acoustic-mosquito',
        code: '04 · BIO-ACOUSTIC',
        title: 'THE MOSQUITO DISPERSAL',
        pos: [3.8, 3.55, -3.95],
        color: '#a855f7',
      },
      {
        id: 'anti-sit-leaner',
        code: '05 · RAPID EGRESS',
        title: '65° LEAN REST PERCH',
        pos: [-2.6, 1.95, -2.6],
        color: '#06b6d4',
      },
    ];

    const badges: THREE.Sprite[] = [];
    badgeConfigs.forEach((cfg) => {
      const badgeTex = createFloatingBadgeTexture(cfg.code, cfg.title, cfg.color);
      const spriteMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthTest: false,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(...cfg.pos);
      sprite.scale.set(1.4, 0.35, 1);
      sprite.userData = { isBadge: true, artifactId: cfg.id, basePosY: cfg.pos[1] };
      scene.add(sprite);
      badges.push(sprite);
      interactiveObjectsRef.current[`badge-${cfg.id}`] = sprite;
    });
    badgeSpritesRef.current = badges;

    // ==========================================
    // 8. PROCEDURAL 3D URBAN DENIZEN INHABITANTS
    // ==========================================
    const denizensParent = new THREE.Group();

    // 1. Stray Cat: Aloof Porch Landlord (curled on Camden bench)
    const catModel = createStrayCatModel();
    catModel.position.set(-2.6, 0.82, 0.8);
    catModel.rotation.y = Math.PI * 0.2;
    catModel.scale.set(0.9, 0.9, 0.9);
    denizensParent.add(catModel);
    denizenMeshesRef.current['stray-cat'] = catModel;

    // 2. Red Panda: Endangered Aristocrat (perched on the 65° Anti-Sit Perch)
    const pandaModel = createRedPandaModel();
    pandaModel.position.set(-2.6, 1.25, -2.42);
    pandaModel.rotation.y = Math.PI * 0.35;
    pandaModel.scale.set(0.85, 0.85, 0.85);
    denizensParent.add(pandaModel);
    denizenMeshesRef.current['red-panda'] = pandaModel;

    // 3. Radio Rat: Neon Sewer Scurrier (scurrying by the drain grate)
    const ratModel = createRadioRatModel();
    ratModel.position.set(-4.8, 0.18, 3.4);
    ratModel.rotation.y = -Math.PI * 0.3;
    ratModel.scale.set(0.95, 0.95, 0.95);
    denizensParent.add(ratModel);
    denizenMeshesRef.current['radio-rat'] = ratModel;

    // 4. Spirit Beast: Patio Astral Guardian (floating near plaza center)
    const spiritModel = createSpiritBeastModel();
    spiritModel.position.set(0.4, 0.6, 0.8);
    spiritModel.scale.set(0.9, 0.9, 0.9);
    denizensParent.add(spiritModel);
    denizenMeshesRef.current['spirit-beast'] = spiritModel;

    // 5. Golden King: Lord of the Dumpsters (sitting on window sill near spikes)
    const kingModel = createGoldenKingModel();
    kingModel.position.set(4.2, 0.66, -0.6);
    kingModel.rotation.y = -Math.PI * 0.15;
    kingModel.scale.set(0.85, 0.85, 0.85);
    denizensParent.add(kingModel);
    denizenMeshesRef.current['golden-king'] = kingModel;

    scene.add(denizensParent);

    // Handle Window Resize
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 9. ANIMATION LOOP
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Animate mosquito soundwaves
      mosquitoWavesRef.current.forEach((wave, idx) => {
        const s = 1 + ((elapsed * 2.2 + idx * 0.75) % 2.6);
        wave.scale.set(s, s, s);
        (wave.material as THREE.MeshBasicMaterial).opacity = Math.max(0, 0.65 - s * 0.24);
      });

      // Animate Spirit Beast gentle hovering & rotation
      if (denizenMeshesRef.current['spirit-beast']) {
        denizenMeshesRef.current['spirit-beast'].position.y = 0.6 + Math.sin(elapsed * 2.0) * 0.08;
        denizenMeshesRef.current['spirit-beast'].rotation.y = elapsed * 0.4;
      }

      // Animate Stray Cat subtle breathing & tail tip twitch
      if (denizenMeshesRef.current['stray-cat']) {
        const catBody = denizenMeshesRef.current['stray-cat'].children[0];
        if (catBody) {
          catBody.scale.y = 1.25 + Math.sin(elapsed * 2.2) * 0.03;
        }
      }

      // Animate Red Panda idle head bob
      if (denizenMeshesRef.current['red-panda']) {
        const pandaHead = denizenMeshesRef.current['red-panda'].children[2];
        if (pandaHead) {
          pandaHead.rotation.z = Math.sin(elapsed * 1.5) * 0.04;
        }
      }

      // Animate Radio Rat twitching antenna & tail
      if (denizenMeshesRef.current['radio-rat']) {
        const ratAntenna = denizenMeshesRef.current['radio-rat'].children[7];
        if (ratAntenna) {
          ratAntenna.rotation.z = -0.2 + Math.sin(elapsed * 8) * 0.06;
        }
      }

      // Panopticon Gaze Head Scanning & Target Reticle Tracking
      if (panopticonHeadRef.current) {
        const sweepAngle = Math.sin(elapsed * 0.6) * 0.55;
        panopticonHeadRef.current.rotation.y = sweepAngle;

        if (groundLaserReticleRef.current) {
          const targetX = Math.sin(sweepAngle) * 4.2;
          const targetZ = Math.cos(sweepAngle) * 2.8 - 0.5;
          groundLaserReticleRef.current.position.set(targetX, 0.185, targetZ);
          groundLaserReticleRef.current.rotation.y = elapsed * 0.8;

          if (alertSpotRef.current) {
            alertSpotRef.current.target.position.set(targetX, 0.185, targetZ);
            alertSpotRef.current.target.updateMatrixWorld();
          }
        }

        if (Math.abs(Math.cos(elapsed * 0.6)) > 0.96) {
          soundEngine.triggerServoTick();
        }
      }

      // Animate 3D Floating Badges gentle bobbing
      badgeSpritesRef.current.forEach((badge, idx) => {
        const base = badge.userData.basePosY || badge.position.y;
        badge.position.y = base + Math.sin(elapsed * 2.2 + idx * 0.9) * 0.04;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      pmrem.dispose();
      controls.dispose();
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  // Update Lighting Mode, Environment Map and Brightness
  useEffect(() => {
    if (!rendererRef.current || !sceneRef.current) return;

    rendererRef.current.toneMappingExposure = 1.25 * brightnessMultiplier;

    const hemi = hemiLightRef.current;
    const sun = sunLightRef.current;
    const fill = fillLightRef.current;
    const street = streetLampSpotRef.current;
    const scene = sceneRef.current;

    // Update PMREM environment reflections
    if (pmremGeneratorRef.current) {
      const envTex = createEquirectangularEnvTexture(lightingMode);
      const newEnvMap = pmremGeneratorRef.current.fromEquirectangular(envTex).texture;
      scene.environment = newEnvMap;
      envTex.dispose();
    }

    if (lightingMode === 'daylight') {
      scene.background = new THREE.Color(0xdce5f0);
      scene.fog = new THREE.FogExp2(0xdce5f0, 0.005);
      if (hemi) {
        hemi.color.setHex(0xe0edff);
        hemi.groundColor.setHex(0xd1d5db);
        hemi.intensity = 2.4 * brightnessMultiplier;
      }
      if (sun) {
        sun.color.setHex(0xfffdf7);
        sun.intensity = 3.0 * brightnessMultiplier;
      }
      if (fill) {
        fill.color.setHex(0x94b4e0);
        fill.intensity = 1.6 * brightnessMultiplier;
      }
      if (street) street.intensity = 0.5;
    } else if (lightingMode === 'studio') {
      scene.background = new THREE.Color(0x282e38);
      scene.fog = new THREE.FogExp2(0x282e38, 0.006);
      if (hemi) {
        hemi.color.setHex(0xffffff);
        hemi.groundColor.setHex(0x64748b);
        hemi.intensity = 2.2 * brightnessMultiplier;
      }
      if (sun) {
        sun.color.setHex(0xf8fafc);
        sun.intensity = 2.6 * brightnessMultiplier;
      }
      if (fill) {
        fill.color.setHex(0xcfd8dc);
        fill.intensity = 1.8 * brightnessMultiplier;
      }
      if (street) street.intensity = 2.0;
    } else if (lightingMode === 'golden_hour') {
      scene.background = new THREE.Color(0x4a3735);
      scene.fog = new THREE.FogExp2(0x4a3735, 0.008);
      if (hemi) {
        hemi.color.setHex(0xfef08a);
        hemi.groundColor.setHex(0x78350f);
        hemi.intensity = 2.0 * brightnessMultiplier;
      }
      if (sun) {
        sun.color.setHex(0xfb923c);
        sun.intensity = 3.2 * brightnessMultiplier;
      }
      if (fill) {
        fill.color.setHex(0x818cf8);
        fill.intensity = 1.2 * brightnessMultiplier;
      }
      if (street) street.intensity = 3.0;
    } else if (lightingMode === 'night_patrol') {
      scene.background = new THREE.Color(0x131823);
      scene.fog = new THREE.FogExp2(0x131823, 0.012);
      if (hemi) {
        hemi.color.setHex(0x64748b);
        hemi.groundColor.setHex(0x1e293b);
        hemi.intensity = 1.4 * brightnessMultiplier;
      }
      if (sun) {
        sun.color.setHex(0x93c5fd);
        sun.intensity = 1.8 * brightnessMultiplier;
      }
      if (fill) {
        fill.color.setHex(0x38bdf8);
        fill.intensity = 1.4 * brightnessMultiplier;
      }
      if (street) street.intensity = 4.8 * brightnessMultiplier;
    }
  }, [lightingMode, brightnessMultiplier]);

  // Update tactical interventions visibility
  useEffect(() => {
    artifacts.forEach((art) => {
      const mesh = tacticalMeshesRef.current[art.id];
      if (mesh) {
        mesh.visible = inspectionMode === 'tactical_counter' && art.tacticalIntervention.deployed;
      }
    });

    if (alertSpotRef.current) {
      if (inspectionMode === 'corporate') {
        alertSpotRef.current.color.setHex(0x38bdf8);
      } else if (inspectionMode === 'interrogative') {
        alertSpotRef.current.color.setHex(0xff1e38);
      } else {
        alertSpotRef.current.color.setHex(0x10b981);
      }
    }
  }, [artifacts, inspectionMode]);

  // Handle camera perspective changes
  useEffect(() => {
    if (!controlsRef.current || !cameraRef.current) return;
    const controls = controlsRef.current;
    const camera = cameraRef.current;

    if (cameraPerspective === 'orbit') {
      controls.target.set(-0.5, 1.2, 0);
      camera.position.set(-6, 4.5, 9.5);
    } else if (cameraPerspective === 'pedestrian') {
      controls.target.set(-3.2, 0.9, 0.8);
      camera.position.set(-3.2, 1.65, 3.2);
    } else if (cameraPerspective === 'panopticon') {
      controls.target.set(-1.0, 0.2, 0.5);
      camera.position.set(0, 6.2, -2.1);
    }
    controls.update();
  }, [cameraPerspective]);

  // Focus on active artifact with bespoke close-up framing
  useEffect(() => {
    if (!activeArtifactId || !controlsRef.current || !cameraRef.current) return;
    const targetArt = artifacts.find((a) => a.id === activeArtifactId);
    if (!targetArt) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;

    if (activeArtifactId === 'camden-bench') {
      controls.target.set(-3.2, 0.55, 0.8);
      camera.position.set(-1.7, 1.45, 2.5);
    } else if (activeArtifactId === 'panopticon-pole') {
      controls.target.set(0, 3.6, -2.2);
      camera.position.set(2.8, 4.8, 1.4);
    } else if (activeArtifactId === 'anti-rough-sleeping-spikes') {
      controls.target.set(4.2, 0.45, -0.6);
      camera.position.set(4.2, 1.25, 1.35);
    } else if (activeArtifactId === 'acoustic-mosquito') {
      controls.target.set(3.8, 2.9, -3.95);
      camera.position.set(3.8, 2.95, -1.8);
    } else if (activeArtifactId === 'anti-sit-leaner') {
      controls.target.set(-2.6, 1.1, -2.4);
      camera.position.set(-1.1, 1.6, -0.8);
    } else {
      controls.target.set(targetArt.position[0], targetArt.position[1] + 0.6, targetArt.position[2]);
      camera.position.set(
        targetArt.position[0] + 2.4,
        targetArt.position[1] + 1.8,
        targetArt.position[2] + 3.0
      );
    }
    controls.update();
    soundEngine.triggerBiometricScanBeep();
  }, [activeArtifactId, artifacts]);

  // Synchronize 3D Architectural Hotspots on the active artifact
  useEffect(() => {
    if (!hotspotsGroupRef.current) return;
    const group = hotspotsGroupRef.current;

    // Clear previous hotspots cleanly
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      child.traverse((node) => {
        if ((node as THREE.Mesh).geometry) {
          (node as THREE.Mesh).geometry.dispose();
        }
        if ((node as THREE.Mesh).material) {
          const mat = (node as THREE.Mesh).material;
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    }

    // Clear interactiveObjectsRef hotspot keys
    Object.keys(interactiveObjectsRef.current).forEach((key) => {
      if (key.startsWith('hotspot-')) {
        delete interactiveObjectsRef.current[key];
      }
    });

    if (!activeArtifactId) {
      setActiveHotspot(null);
      return;
    }

    const hotspots = hotspotsMapRef.current[activeArtifactId] || [];
    if (hotspots.length === 0) {
      setActiveHotspot(null);
      return;
    }

    const badgeColor =
      inspectionMode === 'corporate'
        ? '#38bdf8'
        : inspectionMode === 'tactical_counter'
        ? '#10b981'
        : '#ff1e38';

    hotspots.forEach((hs, idx) => {
      const hotspotContainer = new THREE.Group();
      hotspotContainer.position.set(...hs.pos);

      // Glowing anchor pin at feature location
      const pinGeo = new THREE.SphereGeometry(0.045, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(badgeColor),
      });
      const pinMesh = new THREE.Mesh(pinGeo, pinMat);
      hotspotContainer.add(pinMesh);

      // Outer beacon ring
      const ringGeo = new THREE.RingGeometry(0.055, 0.08, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(badgeColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 0.01;
      hotspotContainer.add(ringMesh);

      // Vertical stem / leader line up to label
      const stemHeight = 0.35;
      const stemGeo = new THREE.CylinderGeometry(0.006, 0.006, stemHeight, 8);
      const stemMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(badgeColor),
        transparent: true,
        opacity: 0.7,
      });
      const stemMesh = new THREE.Mesh(stemGeo, stemMat);
      stemMesh.position.y = stemHeight / 2;
      hotspotContainer.add(stemMesh);

      // Floating Callout Sprite
      const calloutTex = createHotspotCalloutTexture(idx + 1, hs.title, badgeColor);
      const spriteMat = new THREE.SpriteMaterial({
        map: calloutTex,
        transparent: true,
        depthTest: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(1.4, 0.32, 1);
      sprite.position.set(0, stemHeight + 0.16, 0);
      sprite.userData = {
        isHotspot: true,
        hotspot: hs,
        artifactId: activeArtifactId,
      };

      hotspotContainer.add(sprite);
      group.add(hotspotContainer);

      interactiveObjectsRef.current[`hotspot-${hs.id}`] = sprite;
    });
  }, [activeArtifactId, inspectionMode]);

  // Focus on active denizen
  useEffect(() => {
    if (!activeDenizenId || !controlsRef.current || !cameraRef.current) return;
    const targetDenizen = denizens.find((d) => d.id === activeDenizenId);
    if (!targetDenizen) return;

    const controls = controlsRef.current;
    const camera = cameraRef.current;

    controls.target.set(targetDenizen.position[0], targetDenizen.position[1] + 0.2, targetDenizen.position[2]);
    camera.position.set(
      targetDenizen.position[0] + 1.2,
      targetDenizen.position[1] + 0.8,
      targetDenizen.position[2] + 1.6
    );
    controls.update();
    soundEngine.triggerBiometricScanBeep();
  }, [activeDenizenId, denizens]);

  // Raycasting & pointer telemetry
  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || !cameraRef.current) return;

      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseScreenRef.current.set(normX, normY);

      const camPos = cameraRef.current.position;
      let minDistance = 999;
      let closestId: string | null = null;

      artifacts.forEach((art) => {
        const artVec = new THREE.Vector3(...art.position);
        const dist = camPos.distanceTo(artVec);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = art.id;
        }
      });

      const isNearMosquito = closestId === 'acoustic-mosquito' && minDistance < 5.0;
      soundEngine.updateSpatialState(minDistance, isNearMosquito);

      onTelemetryUpdate({
        cursorX: Math.round(e.clientX),
        cursorY: Math.round(e.clientY),
        velocity: Math.hypot(e.movementX, e.movementY),
        nearestArtifactDistance: parseFloat(minDistance.toFixed(2)),
        nearestArtifactId: closestId,
      });
    },
    [artifacts, onTelemetryUpdate]
  );

  const handleClick = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect || !cameraRef.current || !sceneRef.current) return;

    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(new THREE.Vector2(normX, normY), cameraRef.current);

    const denizenObjects: THREE.Object3D[] = Object.values(denizenMeshesRef.current);
    const denizenHits = raycasterRef.current.intersectObjects(denizenObjects, true);

    if (denizenHits.length > 0) {
      let hit: THREE.Object3D | null = denizenHits[0].object;
      let matchedDenizenId: string | null = null;

      while (hit && hit !== sceneRef.current) {
        for (const [dId, grp] of Object.entries(denizenMeshesRef.current)) {
          if (hit === grp) {
            matchedDenizenId = dId;
            break;
          }
        }
        if (matchedDenizenId) break;
        hit = hit.parent;
      }

      if (matchedDenizenId) {
        onSelectDenizen(matchedDenizenId);
        soundEngine.triggerBiometricScanBeep();
        return;
      }
    }

    const interactables: THREE.Object3D[] = Object.values(interactiveObjectsRef.current);
    const intersects = raycasterRef.current.intersectObjects(interactables, true);

    if (intersects.length > 0) {
      let hitObj: THREE.Object3D | null = intersects[0].object;
      let matchedId: string | null = null;

      // Check if clicked directly on an architectural feature hotspot
      if (hitObj.userData && hitObj.userData.isHotspot && hitObj.userData.hotspot) {
        setActiveHotspot(hitObj.userData.hotspot);
        soundEngine.triggerBiometricScanBeep();
        return;
      }

      // Check if clicked directly on a badge sprite or object with artifactId
      if (hitObj.userData && hitObj.userData.artifactId) {
        matchedId = hitObj.userData.artifactId;
      }

      while (!matchedId && hitObj && hitObj !== sceneRef.current) {
        if (hitObj.userData && hitObj.userData.isHotspot && hitObj.userData.hotspot) {
          setActiveHotspot(hitObj.userData.hotspot);
          soundEngine.triggerBiometricScanBeep();
          return;
        }
        if (hitObj.userData && hitObj.userData.artifactId) {
          matchedId = hitObj.userData.artifactId;
          break;
        }
        for (const [artId, group] of Object.entries(interactiveObjectsRef.current)) {
          if (hitObj === group) {
            matchedId = artId.startsWith('badge-') ? artId.replace('badge-', '') : artId;
            break;
          }
        }
        if (matchedId) break;
        hitObj = hitObj.parent;
      }

      if (matchedId) {
        const cleanId = matchedId.startsWith('badge-') ? matchedId.replace('badge-', '') : matchedId;
        onSelectArtifact(cleanId);
        soundEngine.triggerBiometricScanBeep();
      }
    }
  };

  if (!webglSupported) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-900 p-8 text-center text-neutral-400">
        <p className="text-lg font-medium text-red-400 mb-2">WebGL Hardware Acceleration Unavailable</p>
        <p className="text-sm max-w-md">Your browser requires WebGL hardware acceleration to render the 3D urban environment.</p>
      </div>
    );
  }

  return (
    <div
      className="w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden outline-none"
      onPointerMove={handlePointerMove}
      onClick={handleClick}
      tabIndex={0}
      role="region"
      aria-label="High-Maturity 3D Urban Spatial Environment"
    >
      <div ref={containerRef} className="w-full h-full absolute inset-0" />

      {/* 3D Architectural Hotspot Callout Detail Card */}
      {activeHotspot && (
        <div className="absolute bottom-24 left-4 z-20 max-w-sm bg-neutral-950/92 backdrop-blur-xl border border-sky-500/50 rounded-xl p-4 shadow-2xl text-left pointer-events-auto transition-all animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold">
                Architectural Hotspot Feature
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveHotspot(null);
              }}
              className="text-neutral-400 hover:text-neutral-200 text-xs px-1.5 py-0.5 rounded hover:bg-neutral-800 transition-colors"
              aria-label="Close hotspot detail"
            >
              ✕
            </button>
          </div>
          <h4 className="text-sm font-semibold text-white mb-1.5 font-sans">
            {activeHotspot.title}
          </h4>
          <p className="text-xs text-neutral-300 font-mono leading-relaxed">
            {activeHotspot.detail}
          </p>
          <div className="mt-3 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-500 font-mono">
            <span>COORDS: [{activeHotspot.pos.map((n) => n.toFixed(1)).join(', ')}]</span>
            <span className="text-sky-400 font-semibold tracking-wide">HARDWARE SPEC</span>
          </div>
        </div>
      )}
    </div>
  );
};
