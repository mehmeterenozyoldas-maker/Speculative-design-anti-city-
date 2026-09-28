import React, { useState } from 'react';
import { UrbanDenizen } from '../types';
import { ChevronDown, ChevronUp, Sparkles, HeartHandshake } from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';

interface DenizensMenuProps {
  denizens: UrbanDenizen[];
  activeDenizenId: string | null;
  onSelectDenizen: (id: string | null) => void;
}

export const DenizensMenu: React.FC<DenizensMenuProps> = ({
  denizens,
  activeDenizenId,
  onSelectDenizen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeDenizen = denizens.find((d) => d.id === activeDenizenId);

  return (
    <div className="relative pointer-events-auto">
      {/* Trigger Button */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          soundEngine.triggerBiometricScanBeep();
        }}
        className={`flex items-center gap-2 px-3 py-1.5 rounded font-mono text-xs transition-all border shadow-lg ${
          activeDenizen
            ? 'bg-neutral-900 border-amber-500/80 text-amber-200'
            : 'bg-neutral-900/90 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
        }`}
        title="Urban Denizens & Wildlife Impact"
      >
        <span className="text-sm">{activeDenizen ? activeDenizen.emoji : '🐾'}</span>
        <div className="flex flex-col text-left">
          <span className="font-semibold leading-tight text-[11px]">
            {activeDenizen ? activeDenizen.name : 'Urban Denizens'}
          </span>
          <span className="text-[9px] text-neutral-400 font-mono">
            {activeDenizen ? activeDenizen.subtitle : 'Wildlife displaced by architecture'}
          </span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-1 text-neutral-400" /> : <ChevronDown className="w-3.5 h-3.5 ml-1 text-neutral-400" />}
      </button>

      {/* Dropdown Menu (Styled exactly as user's screenshot) */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-64 bg-[#141b26]/95 backdrop-blur-xl border border-neutral-700/80 rounded-xl shadow-2xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2 duration-150 font-sans">
          <div className="px-3 py-2 border-b border-neutral-800 bg-[#0e131b] flex items-center justify-between text-[11px] font-mono text-neutral-400">
            <span className="flex items-center gap-1.5 uppercase font-semibold text-neutral-300">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
              Urban Inhabitants
            </span>
            <span className="text-[10px] text-neutral-500">5 SPECIES</span>
          </div>

          <div className="py-1 divide-y divide-neutral-800/40">
            {denizens.map((denizen) => {
              const isSelected = denizen.id === activeDenizenId;
              return (
                <button
                  key={denizen.id}
                  onClick={() => {
                    onSelectDenizen(isSelected ? null : denizen.id);
                    setIsOpen(false);
                    soundEngine.triggerBiometricScanBeep();
                  }}
                  className={`w-full px-3.5 py-2.5 flex items-center gap-3 text-left transition-colors ${
                    isSelected
                      ? 'bg-neutral-800/80 text-white'
                      : 'hover:bg-neutral-800/50 text-neutral-300'
                  }`}
                >
                  <span className="text-xl shrink-0 select-none">{denizen.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-xs text-white leading-tight flex items-center gap-1.5">
                      <span>{denizen.name}</span>
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                    </div>
                    <div className="text-[11px] text-neutral-400 truncate mt-0.5 font-normal">
                      {denizen.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="px-3 py-2 bg-[#0c1017] border-t border-neutral-800 text-[10px] font-mono text-neutral-400 leading-snug">
            Hostile architecture criminalizes urban wildlife seeking warmth &amp; respite.
          </div>
        </div>
      )}
    </div>
  );
};
