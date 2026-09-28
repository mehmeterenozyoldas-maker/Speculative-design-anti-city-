import React from 'react';
import { UrbanInspectionMode, LightingMode, UrbanDenizen } from '../types';
import {
  Eye,
  ShieldAlert,
  Wrench,
  Volume2,
  VolumeX,
  Radio,
  Camera,
  Compass,
  Sun,
  Lightbulb,
  Sunset,
  Moon,
  Tv,
  Plus,
  Minus,
} from 'lucide-react';
import { soundEngine } from '../audio/SpatialSoundscape';
import { DenizensMenu } from './DenizensMenu';

interface TopControlBarProps {
  mode: UrbanInspectionMode;
  onModeChange: (mode: UrbanInspectionMode) => void;
  perspective: 'orbit' | 'pedestrian' | 'panopticon';
  onPerspectiveChange: (p: 'orbit' | 'pedestrian' | 'panopticon') => void;
  isMuted: boolean;
  onToggleMute: () => void;
  loiteringRisk: number;
  lightingMode: LightingMode;
  onLightingModeChange: (l: LightingMode) => void;
  brightness: number;
  onBrightnessChange: (b: number) => void;
  scanlinesEnabled: boolean;
  onToggleScanlines: () => void;
  denizens: UrbanDenizen[];
  activeDenizenId: string | null;
  onSelectDenizen: (id: string | null) => void;
}

export const TopControlBar: React.FC<TopControlBarProps> = ({
  mode,
  onModeChange,
  perspective,
  onPerspectiveChange,
  isMuted,
  onToggleMute,
  loiteringRisk,
  lightingMode,
  onLightingModeChange,
  brightness,
  onBrightnessChange,
  scanlinesEnabled,
  onToggleScanlines,
  denizens,
  activeDenizenId,
  onSelectDenizen,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-2 sm:p-3 flex flex-col gap-2 pointer-events-none">
      {/* Top Line: Brand, Denizens Menu, and Right Utilities */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Title Tag */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 px-3 py-1.5 rounded-lg shadow-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-xs sm:text-sm font-bold tracking-wider text-neutral-100 uppercase">
                Civic Restraints
              </h1>
              <span className="text-[9px] font-mono tracking-widest px-1.5 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700 rounded">
                STUDIO 3D
              </span>
            </div>
            <p className="text-[10px] font-mono text-neutral-400 hidden sm:block">
              Hostile Urbanism &amp; Wildlife Displacement
            </p>
          </div>
        </div>

        {/* Urban Denizens Dropdown (From User Screenshot) */}
        <DenizensMenu
          denizens={denizens}
          activeDenizenId={activeDenizenId}
          onSelectDenizen={onSelectDenizen}
        />

        {/* Discursive Lens Switcher */}
        <div className="flex items-center bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded-lg p-1 shadow-xl pointer-events-auto overflow-x-auto">
          <button
            onClick={() => {
              onModeChange('corporate');
              soundEngine.triggerBiometricScanBeep();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
              mode === 'corporate'
                ? 'bg-sky-950 text-sky-300 border border-sky-600 shadow-[0_0_12px_rgba(56,189,248,0.2)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Neoliberal Municipal Euphemisms"
          >
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">CORPORATE</span>
          </button>

          <button
            onClick={() => {
              onModeChange('interrogative');
              soundEngine.triggerBiometricScanBeep();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
              mode === 'interrogative'
                ? 'bg-rose-950 text-rose-300 border border-rose-600 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Interrogative Design: Bodily Exclusion"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">INTERROGATIVE</span>
          </button>

          <button
            onClick={() => {
              onModeChange('tactical_counter');
              soundEngine.triggerBiometricScanBeep();
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono transition-all ${
              mode === 'tactical_counter'
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Tactical Media: DIY Counter-Prosthetics"
          >
            <Wrench className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">TACTICAL</span>
          </button>
        </div>

        {/* Right Utility Group: Lighting, Brightness & Sound */}
        <div className="flex items-center gap-1.5 pointer-events-auto ml-auto">
          {/* Lighting Mode Selector */}
          <div className="flex items-center bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg p-0.5 shadow-lg">
            <button
              onClick={() => onLightingModeChange('daylight')}
              className={`p-1.5 rounded transition-colors ${
                lightingMode === 'daylight'
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Daylight Architecture (High Clarity & Sun)"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLightingModeChange('studio')}
              className={`p-1.5 rounded transition-colors ${
                lightingMode === 'studio'
                  ? 'bg-sky-400 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Clean Studio Backdrop (High Visibility)"
            >
              <Lightbulb className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLightingModeChange('golden_hour')}
              className={`p-1.5 rounded transition-colors ${
                lightingMode === 'golden_hour'
                  ? 'bg-orange-500 text-neutral-950 font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Warm Golden Sunset (Cinematic Shadows)"
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onLightingModeChange('night_patrol')}
              className={`p-1.5 rounded transition-colors ${
                lightingMode === 'night_patrol'
                  ? 'bg-indigo-600 text-white font-bold shadow'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Night Patrol (Enhanced Visibility Floodlights)"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Brightness Increaser */}
          <div className="flex items-center bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg p-0.5 text-neutral-300">
            <button
              onClick={() => onBrightnessChange(Math.max(0.6, brightness - 0.2))}
              className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              title="Decrease Brightness"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[10px] font-mono px-1 select-none font-semibold text-amber-300">
              {Math.round(brightness * 100)}%
            </span>
            <button
              onClick={() => onBrightnessChange(Math.min(2.4, brightness + 0.2))}
              className="p-1.5 hover:bg-neutral-800 rounded text-neutral-400 hover:text-white"
              title="Increase Brightness (Screen Clarity)"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Scanlines Toggle */}
          <button
            onClick={onToggleScanlines}
            className={`p-1.5 rounded border transition-colors ${
              scanlinesEnabled
                ? 'bg-neutral-800 border-neutral-600 text-amber-300'
                : 'bg-neutral-950 border-neutral-800 text-neutral-500'
            }`}
            title={scanlinesEnabled ? 'Disable CRT Overlay (Clean View)' : 'Enable CRT Scanlines'}
          >
            <Tv className="w-3.5 h-3.5" />
          </button>

          {/* Perspective Selector */}
          <div className="flex items-center bg-neutral-900/90 backdrop-blur-md border border-neutral-700/80 rounded-lg p-0.5">
            <button
              onClick={() => onPerspectiveChange('orbit')}
              className={`p-1.5 rounded transition-colors ${
                perspective === 'orbit' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Free Orbit Camera"
            >
              <Compass className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPerspectiveChange('pedestrian')}
              className={`p-1.5 rounded transition-colors ${
                perspective === 'pedestrian' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Pedestrian Eye-Level View"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onPerspectiveChange('panopticon')}
              className={`p-1.5 rounded transition-colors ${
                perspective === 'panopticon' ? 'bg-rose-900 text-rose-200' : 'text-neutral-400 hover:text-neutral-200'
              }`}
              title="Panopticon Tower View"
            >
              <Radio className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Audio Engine Button */}
          <button
            onClick={onToggleMute}
            className={`p-1.5 rounded border transition-all ${
              !isMuted
                ? 'bg-neutral-900 border-neutral-700 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                : 'bg-neutral-950 border-neutral-800 text-neutral-500'
            }`}
            title={isMuted ? 'Activate Spatial Audio Engine' : 'Mute Soundscape'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 animate-pulse" />}
          </button>
        </div>
      </div>
    </header>
  );
};
