import React from 'react';
import { HostileArtifact, UrbanInspectionMode } from '../types';
import { ShieldAlert, Info } from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';

interface ArtifactSelectorDockProps {
  artifacts: HostileArtifact[];
  activeArtifactId: string | null;
  onSelectArtifact: (id: string) => void;
  mode: UrbanInspectionMode;
  onOpenManifesto: () => void;
}

export const ArtifactSelectorDock: React.FC<ArtifactSelectorDockProps> = ({
  artifacts,
  activeArtifactId,
  onSelectArtifact,
  mode,
  onOpenManifesto,
}) => {
  return (
    <nav
      aria-label="Discursive Artifacts Quick Selector"
      className="absolute bottom-4 right-4 z-20 flex flex-col items-end gap-2 pointer-events-none"
    >
      <div className="flex items-center gap-2 pointer-events-auto bg-neutral-950/90 backdrop-blur-md border border-neutral-800 p-1.5 rounded-lg shadow-2xl overflow-x-auto max-w-[95vw]">
        <button
          onClick={onOpenManifesto}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-mono border border-neutral-700 transition-colors"
          title="Discursive Design Theory & Citations"
        >
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">MANIFESTO</span>
        </button>

        <div className="w-[1px] h-5 bg-neutral-800 mx-1" />

        {artifacts.map((art, idx) => {
          const isActive = art.id === activeArtifactId;
          const isDeployed = art.tacticalIntervention.deployed;
          const numStr = `0${idx + 1}`;

          return (
            <button
              key={art.id}
              onClick={() => {
                onSelectArtifact(art.id);
                soundEngine.triggerBiometricScanBeep();
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-mono transition-all shrink-0 ${
                isActive
                  ? 'bg-neutral-100 text-neutral-950 font-bold shadow-[0_0_12px_rgba(255,255,255,0.4)]'
                  : 'bg-neutral-900/90 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
              }`}
            >
              <span
                className={`text-[10px] font-bold px-1 py-0.2 rounded ${
                  isActive ? 'bg-neutral-900 text-neutral-100' : 'bg-neutral-800 text-neutral-400'
                }`}
              >
                {numStr}
              </span>
              {isDeployed && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              <span className="truncate max-w-[130px] sm:max-w-[170px]">
                {mode === 'corporate' ? art.corporateEuphemism : art.name}
              </span>
            </button>
          );
        })}
      </div>
      <div className="text-[10px] font-mono text-neutral-500 mr-1 flex items-center gap-1.5">
        <ShieldAlert className="w-3 h-3 text-neutral-400" />
        <span>Click artifact or drag to orbit | Spatial audio reactive</span>
      </div>
    </nav>
  );
};
