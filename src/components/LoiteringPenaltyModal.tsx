import React, { useState, useRef } from 'react';
import { AlertOctagon, ShieldX, HelpCircle } from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';

interface LoiteringPenaltyModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  dwellSeconds: number;
}

export const LoiteringPenaltyModal: React.FC<LoiteringPenaltyModalProps> = ({
  isOpen,
  onDismiss,
  dwellSeconds,
}) => {
  const [evadeOffset, setEvadeOffset] = useState({ x: 0, y: 0 });
  const [evadeCount, setEvadeCount] = useState(0);
  const complyButtonRef = useRef<HTMLButtonElement>(null);

  if (!isOpen) return null;

  // Antagonistic algorithm: Button eludes the cursor to materialize bureaucratic friction
  const handleButtonHover = (e: React.MouseEvent) => {
    if (evadeCount < 4) {
      soundEngine.triggerDispersalWarning();
      const rect = complyButtonRef.current?.getBoundingClientRect();
      if (!rect) return;

      // Calculate vector away from mouse
      const randomX = (Math.random() - 0.5) * 180;
      const randomY = (Math.random() - 0.5) * 120;

      setEvadeOffset({ x: randomX, y: randomY });
      setEvadeCount((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-none">
      <div className="max-w-md w-full bg-neutral-950 border-2 border-rose-600 rounded-lg shadow-[0_0_50px_rgba(225,29,72,0.4)] overflow-hidden text-neutral-100">
        {/* Top Hazard Banner */}
        <div className="bg-rose-600 px-4 py-2 flex items-center justify-between text-black font-bold text-xs tracking-wider uppercase">
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 fill-black text-rose-600" />
            <span>MUNICIPAL ENFORCEMENT CITATION</span>
          </div>
          <span className="font-mono">BYLAW §402.8</span>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <ShieldX className="w-8 h-8 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-lg font-bold text-neutral-100">
                Unlawful Ambient Stationary Repose
              </h3>
              <p className="text-xs text-rose-400 mt-1">
                Prolonged dwell time recorded: <span className="font-bold text-white">{dwellSeconds.toFixed(1)}s</span> without active commercial consumption or approved vehicular transit.
              </p>
            </div>
          </div>

          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded text-xs space-y-2 text-neutral-300">
            <p>
              Smart city sensory telemetry has determined your posture constitutes <em>non-transactional spatial appropriation</em> of civic square airspace.
            </p>
            <div className="text-[11px] text-neutral-500 border-t border-neutral-800 pt-2 flex items-center justify-between">
              <span>PENALTY STATUS: LEVEL 1 ADVISORY</span>
              <span>GEO-NODE: 51.5074° N, 0.1278° W</span>
            </div>
          </div>

          {/* Adversarial Friction Explanation */}
          <div className="text-[11px] text-neutral-400 italic bg-rose-950/20 p-2.5 rounded border border-rose-900/40">
            <div className="flex items-center gap-1.5 text-rose-300 font-semibold mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Adversarial Design Mechanics:</span>
            </div>
            In neoliberal public management, friction is asymmetrically deployed to wear down human will. Try clicking the municipal compliance button below.
          </div>

          {/* Buttons Container */}
          <div className="pt-2 flex flex-col gap-3 relative min-h-[110px]">
            {/* Evading Compliance Button */}
            <div className="relative flex justify-center">
              <button
                ref={complyButtonRef}
                onMouseEnter={handleButtonHover}
                onClick={() => {
                  soundEngine.triggerBiometricScanBeep();
                  onDismiss();
                }}
                style={{
                  transform: `translate(${evadeOffset.x}px, ${evadeOffset.y}px)`,
                  transition: 'transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)',
                }}
                className="px-5 py-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 text-xs font-semibold shadow-lg active:scale-95"
              >
                {evadeCount < 4 ? 'Acknowledge Citation & Vacate Perimeter' : 'Force Compliance (Bureaucracy Cleared)'}
              </button>
            </div>

            {/* Direct Citizen Right Counter-Action */}
            <button
              onClick={() => {
                soundEngine.triggerBiometricScanBeep();
                onDismiss();
              }}
              className="w-full py-2.5 px-4 rounded bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors shadow-[0_0_15px_rgba(225,29,72,0.3)] mt-auto"
            >
              ASSERT RIGHT TO THE COMMONS (DISMISS CITATION)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
