import React from 'react';
import { HostileArtifact, UrbanInspectionMode } from '../types';
import { X, ShieldAlert, Sparkles, AlertCircle, Bookmark, Compass, CheckCircle2, Wrench } from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';

const ARCHITECTURAL_SPECS: Record<
  string,
  { material: string; details: string[]; hardware: string; affordance: string }
> = {
  'camden-bench': {
    material: 'Diamond-ground C40/50 exposed aggregate concrete with anti-graffiti sealant',
    details: [
      '35° sacral-sliding chamfers on both seating faces',
      'Central longitudinal drainage trough with 3 weeping drain holes',
      'Recessed shadow-gap plinth base (prevents stashing items & litter under bench)',
      'Dual recessed cast-bronze crane hoisting sockets on end-caps',
    ],
    hardware: 'Cast architectural bronze divider armrest with tamper-proof security pin-Torx bolts; 4 milled bronze skate-stoppers',
    affordance: 'Anti-Affordance: actively forces human spine forward; zero flat resting area; sleep tolerance < 14 min',
  },
  'panopticon-pole': {
    material: 'Octagonal stepped hot-dip galvanized structural steel (BS EN ISO 1461) + die-cast aluminum',
    details: [
      '8-stud high-tensile anchor cage with double locknuts on chamfered concrete plinth',
      'Lower lockable electrical access door with copper grounding braid',
      'Mid-mast NEMA 4X weather-sealed cabinet with warning decal & louvers',
      'Triangulated acoustic anomaly microphone cluster + PM2.5 particulate sniffer',
    ],
    hardware: 'Motorized dual-arm cast aluminum PTZ gimbal with 4K telephoto sapphire lens, FLIR thermal eye, 12 IR LEDs, and rain wiper',
    affordance: 'Omni-surveillance: calculates pedestrian dwell time in ms; automated alert trigger for non-consumptive presence',
  },
  'anti-rough-sleeping-spikes': {
    material: 'Marine-grade 316 brushed stainless steel + architectural sandstone/granite sill',
    details: [
      'Drip edge moulding nosing with undercut weathering drip groove',
      'Dual extruded stainless mounting channel tracks with slotted anchor points',
      'Expansion sleeve anchor bolts every 25cm with lock washers into masonry',
      'Anti-cardboard bridging transverse plates between rows',
    ],
    hardware: '2 rows of 4-sided precision pyramid spikes with defensive code-compliant blunted safety tips',
    affordance: 'Puncture hazard: converts dry architectural rain overhangs into hazardous exclusion zones',
  },
  'acoustic-mosquito': {
    material: '16-gauge powder-coated heavy steel security clamshell cage + die-cast zinc-aluminum chassis',
    details: [
      'Rigid galvanized EMT electrical conduit with watertight compression couplings',
      'Cooling heat-sink fins along top and rear of chassis',
      'Key-operated tubular barrel arming switch with active pulse LEDs',
      'Laser-cut acoustic slots and heavy brass security padlock preventing sabotage',
    ],
    hardware: 'Machined aluminum compression horn with hexagonal perforated grille & tuned bronze acoustic phase bullet',
    affordance: 'Bio-acoustic weapon: 17.4 kHz ultrasonic emission exploiting presbycusis to inflict ear pain exclusively on youth',
  },
  'anti-sit-leaner': {
    material: 'Hydraulic mandrel-bent 316 tubular stainless steel + high-density polyurethane',
    details: [
      '65° anti-rest incline to horizon (zero horizontal seat depth)',
      'Laser-cut elliptical base mounting flanges with spun escutcheon beauty cover collars',
      'Sculpted polyurethane ribbed bolster pad with horizontal anti-slip traction grooves',
      'Integrated braille tactile warning indicators',
    ],
    hardware: 'Welded stainless steel skate-stoppers (anti-grind blocks) with visible TIG beads + center anti-lying divider fin',
    affordance: 'Abolition of sitting: forces 35% continuous isometric leg muscle contraction; rest is rendered punitive',
  },
};

interface ArtifactDrawerProps {
  artifact: HostileArtifact | null;
  onClose: () => void;
  mode: UrbanInspectionMode;
  onToggleTacticalIntervention: (artifactId: string) => void;
  onFocusArtifact: (artifactId: string) => void;
}

export const ArtifactDrawer: React.FC<ArtifactDrawerProps> = ({
  artifact,
  onClose,
  mode,
  onToggleTacticalIntervention,
  onFocusArtifact,
}) => {
  if (!artifact) return null;

  const isInterrogative = mode === 'interrogative';
  const isTactical = mode === 'tactical_counter';

  return (
    <div className="absolute top-16 sm:top-20 right-4 z-20 w-[90vw] max-w-md max-h-[82vh] overflow-y-auto bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-lg shadow-2xl text-neutral-200 font-mono text-xs select-text">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 sticky top-0 backdrop-blur z-10 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider font-semibold ${
                artifact.typology === 'anti-sleeping'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : artifact.typology === 'panoptic-surveillance'
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : artifact.typology === 'acoustic-deterrent'
                  ? 'bg-purple-950 text-purple-300 border border-purple-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
              }`}
            >
              {artifact.typology.replace('-', ' ')}
            </span>
            <span className="text-[10px] text-neutral-500">{artifact.yearIntroduced}</span>
          </div>

          <h2 className="text-base font-display font-bold text-neutral-100 leading-snug">
            {isInterrogative || isTactical ? artifact.name : artifact.corporateEuphemism}
          </h2>

          <p className="text-[11px] text-neutral-400 mt-0.5">
            {isInterrogative || isTactical
              ? `Euphemism: "${artifact.corporateEuphemism}"`
              : 'Registered Municipal Asset #UK-CMD-882'}
          </p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onFocusArtifact(artifact.id)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Recenter Camera on Artifact"
          >
            <Compass className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Close Dossier"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Discursive Juxtaposition Box */}
        <div className="space-y-3">
          {/* Municipal sanitized PR rationale */}
          <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded">
            <div className="text-[10px] font-semibold text-sky-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Municipal / Corporate Justification
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              {artifact.municipalJustification}
            </p>
          </div>

          {/* Interrogative Sociological Reality */}
          {(isInterrogative || isTactical) && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded">
              <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                Interrogative Sociological Reality
              </div>
              <p className="text-rose-200 leading-relaxed text-[11px]">
                {artifact.sociologicalReality}
              </p>
            </div>
          )}

          {/* Ergonomic Friction Analysis */}
          <div className="p-3 bg-neutral-900/80 border border-neutral-800 rounded">
            <div className="text-[10px] font-semibold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" />
              Ergonomic Friction &amp; Bodily Discipline
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              {artifact.ergonomicFriction}
            </p>
          </div>

          {/* Architectural & Industrial Design Blueprint */}
          {ARCHITECTURAL_SPECS[artifact.id] && (
            <div className="p-3 bg-neutral-900/90 border border-neutral-700/80 rounded space-y-2">
              <div className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" />
                Architectural &amp; Industrial Design Blueprint
              </div>

              <div className="text-[11px] text-neutral-300">
                <span className="text-neutral-400 font-semibold">Specification Material: </span>
                {ARCHITECTURAL_SPECS[artifact.id].material}
              </div>

              <div className="space-y-1 pt-1">
                <div className="text-[10px] uppercase font-semibold text-neutral-400">Engineered Details:</div>
                <ul className="list-disc list-inside space-y-0.5 text-[10.5px] text-neutral-300 pl-1">
                  {ARCHITECTURAL_SPECS[artifact.id].details.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>

              <div className="text-[10.5px] text-neutral-300 pt-1 border-t border-neutral-800">
                <span className="text-neutral-400 font-semibold">Fasteners &amp; Hardware: </span>
                {ARCHITECTURAL_SPECS[artifact.id].hardware}
              </div>

              <div className="text-[10.5px] text-rose-300/90 pt-1 border-t border-neutral-800">
                <span className="text-neutral-400 font-semibold">Hostile Affordance: </span>
                {ARCHITECTURAL_SPECS[artifact.id].affordance}
              </div>
            </div>
          )}
        </div>

        {/* Theoretical Critical Citation */}
        {(isInterrogative || isTactical) && (
          <div className="p-3 bg-neutral-900/90 border-l-2 border-neutral-400 rounded-r text-[11px]">
            <div className="flex items-center gap-1.5 text-neutral-400 font-semibold mb-1 text-[10px]">
              <Bookmark className="w-3 h-3 text-neutral-400" />
              <span>{artifact.criticalCitation.author}</span>
              <span className="text-neutral-600">—</span>
              <span className="italic text-neutral-400">{artifact.criticalCitation.work}</span>
            </div>
            <p className="italic text-neutral-300 leading-relaxed">
              "{artifact.criticalCitation.quote}"
            </p>
          </div>
        )}

        {/* Tactical Counter-Prosthetic Section */}
        <div className="pt-2 border-t border-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400">
              Tactical Counter-Prosthetic
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded border ${
                artifact.tacticalIntervention.deployed
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  : 'bg-neutral-900 text-neutral-500 border-neutral-800'
              }`}
            >
              {artifact.tacticalIntervention.deployed ? 'DEPLOYED IN 3D' : 'STAGED'}
            </span>
          </div>

          <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded space-y-2">
            <div className="font-semibold text-emerald-300 text-xs">
              {artifact.tacticalIntervention.name}
            </div>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              {artifact.tacticalIntervention.description}
            </p>
            <div className="text-[10px] text-neutral-400">
              <strong className="text-neutral-300">Materials: </strong>
              {artifact.tacticalIntervention.material}
            </div>

            <button
              onClick={() => {
                onToggleTacticalIntervention(artifact.id);
                soundEngine.triggerBiometricScanBeep();
              }}
              className={`w-full mt-2 py-2 px-3 rounded font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                artifact.tacticalIntervention.deployed
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {artifact.tacticalIntervention.deployed
                  ? 'REMOVE TACTICAL SUBVERSION'
                  : 'DEPLOY COUNTER-PROSTHETIC (3D)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
