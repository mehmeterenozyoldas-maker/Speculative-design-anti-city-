import React from 'react';
import { X, BookOpen, Layers, ShieldCheck, Flame, ExternalLink } from 'lucide-react';

interface DiscursiveManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscursiveManifestoModal: React.FC<DiscursiveManifestoModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono select-text">
      <div className="max-w-2xl w-full max-h-[88vh] overflow-y-auto bg-neutral-950 border border-neutral-800 rounded-lg shadow-2xl text-neutral-200">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 bg-neutral-900/60 sticky top-0 backdrop-blur z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            <h2 className="font-display font-bold text-sm tracking-wider uppercase text-neutral-100">
              Discursive Urbanism: A Design Manifesto
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-neutral-800 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-xs leading-relaxed text-neutral-300">
          {/* Intro */}
          <section className="space-y-2">
            <h3 className="font-display text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              1. The Politics of Friction Over Convenience
            </h3>
            <p>
              Contemporary UX dogma obsesses over <em>"frictionless"</em> consumption—smoothing away the rough seams of political reality so capital and data flow unimpeded. In the smart city, this frictionlessness is an asymmetrical illusion: while affluent pedestrians glide through frictionless transit gates, marginalized bodies encounter brutal physical and acoustic violence.
            </p>
            <p className="text-neutral-400">
              This spatial environment employs <strong>Discursive Design</strong>—design as an intellectual inquiry rather than a consumer service. We use friction, intentional obstruction, and seamful telemetry to make the hidden ideological architecture of the city speak.
            </p>
          </section>

          {/* Theoretical Pillars */}
          <section className="space-y-3 border-t border-neutral-800 pt-4">
            <h3 className="font-display text-sm font-bold text-neutral-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              2. Conceptual Frameworks in Action
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded">
                <span className="font-bold text-rose-400">Interrogative Design (Krzysztof Wodiczko)</span>
                <p className="mt-1 text-neutral-300">
                  Designing spatial prosthetics and interventions that articulate the trauma and unvoiced presence of those marginalized by urban policy. In this simulation, each hostile artifact reveals its real bodily toll instead of corporate PR slogans.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded">
                <span className="font-bold text-amber-400">Adversarial Design (Carl DiSalvo)</span>
                <p className="mt-1 text-neutral-300">
                  Using antagonistic computational logic to materialize political disagreement. The Loitering Penalty and evading button mechanics force users to experience the exhausting bureaucratic friction imposed on unhoused citizens.
                </p>
              </div>

              <div className="p-3 bg-neutral-900/70 border border-neutral-800 rounded">
                <span className="font-bold text-emerald-400">Tactical Media &amp; Counter-Prosthetics</span>
                <p className="mt-1 text-neutral-300">
                  Appropriating everyday materials (marine plywood, EVA foam, Helmholtz resonators, infrared dazzlers) to physically subvert exclusionary architecture and reclaim public space as a genuine democratic commons.
                </p>
              </div>
            </div>
          </section>

          {/* Key Literature */}
          <section className="space-y-2 border-t border-neutral-800 pt-4">
            <h3 className="font-display text-sm font-bold text-neutral-100 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              3. Critical Bibliography
            </h3>
            <ul className="space-y-1.5 text-neutral-400">
              <li>• <strong>Carl DiSalvo</strong> (2012) — <em>Adversarial Design</em>, MIT Press.</li>
              <li>• <strong>Rosalyn Deutsche</strong> (1996) — <em>Evictions: Art and Spatial Politics</em>, MIT Press.</li>
              <li>• <strong>Mike Davis</strong> (1990) — <em>City of Quartz: Excavating the Future in Los Angeles</em>, Verso.</li>
              <li>• <strong>Steve Goodman</strong> (2009) — <em>Sonic Warfare: Sound, Affect, and the Ecology of Fear</em>, MIT Press.</li>
              <li>• <strong>Krzysztof Wodiczko</strong> (1999) — <em>Critical Vehicles: Writings, Projects, Interviews</em>, MIT Press.</li>
            </ul>
          </section>

          {/* Footer action */}
          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-semibold transition-colors"
            >
              RETURN TO SPATIAL PROTOTYPE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
