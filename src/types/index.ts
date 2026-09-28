export type DiscursiveFramework = 'interrogative' | 'adversarial' | 'tactical' | 'reflective';

export type UrbanInspectionMode = 'corporate' | 'interrogative' | 'tactical_counter';

export type LightingMode = 'daylight' | 'studio' | 'golden_hour' | 'night_patrol';

export interface UrbanDenizen {
  id: string;
  name: string;
  subtitle: string;
  emoji: string;
  description: string;
  hostileImpact: string;
  restingStatus: 'displaced' | 'perched' | 'evading' | 'seeking_shelter';
  targetArtifactId: string;
  position: [number, number, number];
  rotation: number;
}

export interface HostileArtifact {
  id: string;
  name: string;
  corporateEuphemism: string;
  typology: 'anti-sleeping' | 'anti-loitering' | 'acoustic-deterrent' | 'physical-exclusion' | 'panoptic-surveillance';
  yearIntroduced: string;
  municipalJustification: string;
  sociologicalReality: string;
  ergonomicFriction: string;
  criticalCitation: {
    author: string;
    work: string;
    quote: string;
  };
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  exclusionRadius: number;
  tacticalIntervention: {
    name: string;
    description: string;
    material: string;
    deployed: boolean;
  };
}

export interface SurveillanceTelemetry {
  cursorX: number;
  cursorY: number;
  velocity: number;
  dwellTimeSeconds: number;
  loiteringRiskIndex: number;
  nearestArtifactDistance: number;
  nearestArtifactId: string | null;
  biometricEntropy: number;
  bylawViolationCode: string | null;
  surveillanceCameraAngle: number;
}
