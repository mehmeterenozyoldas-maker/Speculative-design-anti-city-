import React from 'react';
import { UrbanDenizen, HostileArtifact } from '../types';
import { X, Compass, AlertCircle, Heart } from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';

interface DenizenDrawerProps {
  denizen: UrbanDenizen | null;
  onClose: () => void;
  onFocusDenizen: (id: string) => void;
  targetArtifact?: HostileArtifact | null;
}

export const DenizenDrawer: React.FC<DenizenDrawerProps> = ({
  denizen,
  onClose,
  onFocusDenizen,
  targetArtifact,
}) => {
  if (!denizen) return null;

  return (
    <div className="absolute top-16 sm:top-20 right-4 z-30 w-[90vw] max-w-sm bg-neutral-950/95 backdrop-blur-xl border border-neutral-800 rounded-xl shadow-2xl text-neutral-200 font-mono text-xs select-text overflow-hidden animate-in fade-in slide-in-from-right-2 duration-150">
      {/* Header */}
      <div className="p-4 border-b border-neutral-800 bg-neutral-900/70 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 bg-neutral-800/80 rounded-lg border border-neutral-700/60 shadow-inner">
            {denizen.emoji}
          </span>
          <div>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">
              Urban Inhabitant
            </span>
            <h2 className="text-base font-display font-bold text-white mt-1 leading-snug">
              {denizen.name}
            </h2>
            <p className="text-[11px] text-neutral-400 font-sans italic">
              {denizen.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onFocusDenizen(denizen.id)}
            className="p-1.5 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
            title="Recenter Camera on Inhabitant"
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

      <div className="p-4 space-y-3.5">
        {/* Ecological Description */}
        <div className="p-3 bg-neutral-900/60 border border-neutral-800/80 rounded-lg">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            Ecological Habitat in the Smart City
          </div>
          <p className="text-neutral-300 font-sans leading-relaxed text-xs">
            {denizen.description}
          </p>
        </div>

        {/* Hostile Architecture Exclusion Reality */}
        <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg">
          <div className="text-[10px] font-semibold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Displacement by Hostile Infrastructure
          </div>
          <p className="text-rose-200 font-sans leading-relaxed text-xs">
            {denizen.hostileImpact}
          </p>
        </div>

        {/* Target Site */}
        {targetArtifact && (
          <div className="p-2.5 bg-neutral-900/90 border border-neutral-800 rounded-lg flex items-center justify-between text-[11px]">
            <span className="text-neutral-400">Contested Urban Site:</span>
            <span className="font-semibold text-amber-300">{targetArtifact.name}</span>
          </div>
        )}

        <button
          onClick={() => {
            onFocusDenizen(denizen.id);
            soundEngine.triggerBiometricScanBeep();
          }}
          className="w-full py-2 px-3 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold text-xs border border-neutral-700 flex items-center justify-center gap-2 transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>INSPECT 3D POSITION IN SQUARE</span>
        </button>
      </div>
    </div>
  );
};
