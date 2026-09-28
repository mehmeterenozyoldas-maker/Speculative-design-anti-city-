/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThreeCanvas } from './components/ThreeCanvas';
import { TopControlBar } from './components/TopControlBar';
import { SeamfulTelemetryHUD } from './components/SeamfulTelemetryHUD';
import { ArtifactDrawer } from './components/ArtifactDrawer';
import { DenizenDrawer } from './components/DenizenDrawer';
import { ArtifactSelectorDock } from './components/ArtifactSelectorDock';
import { LoiteringPenaltyModal } from './components/LoiteringPenaltyModal';
import { DiscursiveManifestoModal } from './components/DiscursiveManifestoModal';
import { HOSTILE_ARTIFACTS } from './data/artifacts';
import { URBAN_DENIZENS } from './data/denizens';
import { HostileArtifact, UrbanInspectionMode, SurveillanceTelemetry, LightingMode, UrbanDenizen } from './types';
import { soundEngine } from './audio/SpatialSoundscape';
import { Volume2 } from 'lucide-react';

export default function App() {
  const [artifacts, setArtifacts] = useState<HostileArtifact[]>(HOSTILE_ARTIFACTS);
  const [denizens] = useState<UrbanDenizen[]>(URBAN_DENIZENS);
  const [activeArtifactId, setActiveArtifactId] = useState<string | null>('camden-bench');
  const [activeDenizenId, setActiveDenizenId] = useState<string | null>(null);

  const [inspectionMode, setInspectionMode] = useState<UrbanInspectionMode>('interrogative');
  const [lightingMode, setLightingMode] = useState<LightingMode>('daylight'); // High-clarity bright default!
  const [brightnessMultiplier, setBrightnessMultiplier] = useState<number>(1.25);
  const [scanlinesEnabled, setScanlinesEnabled] = useState<boolean>(false); // Disabled by default for maximum screen clarity

  const [cameraPerspective, setCameraPerspective] = useState<'orbit' | 'pedestrian' | 'panopticon'>('orbit');
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isLoiteringModalOpen, setIsLoiteringModalOpen] = useState<boolean>(false);
  const [isManifestoOpen, setIsManifestoOpen] = useState<boolean>(false);
  const [hasUserInteractedAudio, setHasUserInteractedAudio] = useState<boolean>(false);

  // Live Telemetry state
  const [telemetry, setTelemetry] = useState<SurveillanceTelemetry>({
    cursorX: 0,
    cursorY: 0,
    velocity: 0,
    dwellTimeSeconds: 0,
    loiteringRiskIndex: 0,
    nearestArtifactDistance: 0,
    nearestArtifactId: 'camden-bench',
    biometricEntropy: 0.4521,
    bylawViolationCode: null,
    surveillanceCameraAngle: 0,
  });

  const lastMovementTimeRef = useRef<number>(Date.now());
  const dwellTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle tactical intervention toggling
  const handleToggleTacticalIntervention = (artifactId: string) => {
    setArtifacts((prev) =>
      prev.map((art) => {
        if (art.id === artifactId) {
          return {
            ...art,
            tacticalIntervention: {
              ...art.tacticalIntervention,
              deployed: !art.tacticalIntervention.deployed,
            },
          };
        }
        return art;
      })
    );
  };

  // Sound toggle
  const handleToggleMute = () => {
    if (!soundEngine.isInitialized) {
      soundEngine.init();
      setHasUserInteractedAudio(true);
    }
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundEngine.setMuted(newMuted);
    if (!newMuted) {
      soundEngine.triggerBiometricScanBeep();
    }
  };

  // Telemetry update callback
  const handleTelemetryUpdate = useCallback((partial: Partial<SurveillanceTelemetry>) => {
    setTelemetry((prev) => {
      const updated = { ...prev, ...partial };
      if (partial.velocity && partial.velocity > 1.5) {
        lastMovementTimeRef.current = Date.now();
      }
      return updated;
    });
  }, []);

  // Adversarial Dwell / Loitering Detection Loop
  useEffect(() => {
    dwellTimerRef.current = setInterval(() => {
      const now = Date.now();
      const stationarySecs = (now - lastMovementTimeRef.current) / 1000;
      const risk = Math.min(100, Math.round((stationarySecs / 5.0) * 100));

      setTelemetry((prev) => ({
        ...prev,
        dwellTimeSeconds: stationarySecs,
        loiteringRiskIndex: risk,
        biometricEntropy: Math.max(0.01, 1 - stationarySecs * 0.18),
      }));

      // Only trigger adversarial loitering modal after prolonged dwell (>60s) without active artifact inspection
      if (
        stationarySecs > 60.0 &&
        !isLoiteringModalOpen &&
        !activeArtifactId
      ) {
        soundEngine.triggerDispersalWarning();
        setIsLoiteringModalOpen(true);
        lastMovementTimeRef.current = Date.now();
      }
    }, 400);

    return () => {
      if (dwellTimerRef.current) clearInterval(dwellTimerRef.current);
    };
  }, [inspectionMode, isLoiteringModalOpen, activeArtifactId]);

  // Audio start prompt helper
  const handleFirstInteraction = () => {
    if (!soundEngine.isInitialized && isMuted) {
      soundEngine.init();
      soundEngine.setMuted(false);
      setIsMuted(false);
      setHasUserInteractedAudio(true);
      soundEngine.triggerBiometricScanBeep();
    }
  };

  const activeArtifact = artifacts.find((a) => a.id === activeArtifactId) || null;
  const activeDenizen = denizens.find((d) => d.id === activeDenizenId) || null;
  const denizenTargetArtifact = activeDenizen
    ? artifacts.find((a) => a.id === activeDenizen.targetArtifactId) || null
    : null;

  return (
    <main
      className="relative w-screen h-screen overflow-hidden bg-neutral-900 font-mono"
      onClick={!hasUserInteractedAudio ? handleFirstInteraction : undefined}
    >
      {/* 3D WebGL Canvas Layer */}
      <ThreeCanvas
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        onSelectArtifact={(id) => {
          setActiveArtifactId(id);
          setActiveDenizenId(null);
        }}
        denizens={denizens}
        activeDenizenId={activeDenizenId}
        onSelectDenizen={(id) => {
          setActiveDenizenId(id);
          if (id) {
            const d = denizens.find((item) => item.id === id);
            if (d) setActiveArtifactId(d.targetArtifactId);
          }
        }}
        inspectionMode={inspectionMode}
        lightingMode={lightingMode}
        brightnessMultiplier={brightnessMultiplier}
        telemetry={telemetry}
        cameraPerspective={cameraPerspective}
        onTelemetryUpdate={handleTelemetryUpdate}
      />

      {/* Optional Diegetic CRT Scanlines */}
      {scanlinesEnabled && (
        <div className="absolute inset-0 scanlines pointer-events-none z-10" />
      )}

      {/* Audio Initializer Banner if user hasn't unmuted */}
      {!hasUserInteractedAudio && (
        <div
          onClick={handleToggleMute}
          className="absolute top-24 left-1/2 -translate-x-1/2 z-30 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-bold rounded-full cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center gap-2 pointer-events-auto transition-transform active:scale-95"
        >
          <Volume2 className="w-4 h-4 animate-bounce" />
          <span>CLICK TO ENGAGE GENERATIVE SPATIAL SOUNDSCAPE</span>
        </div>
      )}

      {/* Top Header with Lighting, Denizens & Lens Controls */}
      <TopControlBar
        mode={inspectionMode}
        onModeChange={setInspectionMode}
        perspective={cameraPerspective}
        onPerspectiveChange={setCameraPerspective}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        loiteringRisk={telemetry.loiteringRiskIndex}
        lightingMode={lightingMode}
        onLightingModeChange={setLightingMode}
        brightness={brightnessMultiplier}
        onBrightnessChange={setBrightnessMultiplier}
        scanlinesEnabled={scanlinesEnabled}
        onToggleScanlines={() => setScanlinesEnabled(!scanlinesEnabled)}
        denizens={denizens}
        activeDenizenId={activeDenizenId}
        onSelectDenizen={(id) => {
          setActiveDenizenId(id);
          if (id) {
            const d = denizens.find((item) => item.id === id);
            if (d) setActiveArtifactId(d.targetArtifactId);
          }
        }}
      />

      {/* Seamful Computational Surveillance Telemetry HUD */}
      <SeamfulTelemetryHUD telemetry={telemetry} mode={inspectionMode} />

      {/* Artifact Detailed Discursive Dossier Drawer */}
      {activeArtifact && !activeDenizen && (
        <ArtifactDrawer
          artifact={activeArtifact}
          onClose={() => setActiveArtifactId(null)}
          mode={inspectionMode}
          onToggleTacticalIntervention={handleToggleTacticalIntervention}
          onFocusArtifact={(id) => setActiveArtifactId(id)}
        />
      )}

      {/* Denizen Inhabitant Drawer */}
      {activeDenizen && (
        <DenizenDrawer
          denizen={activeDenizen}
          onClose={() => setActiveDenizenId(null)}
          onFocusDenizen={(id) => setActiveDenizenId(id)}
          targetArtifact={denizenTargetArtifact}
        />
      )}

      {/* Quick Selection Dock & Discursive Manifesto Button */}
      <ArtifactSelectorDock
        artifacts={artifacts}
        activeArtifactId={activeArtifactId}
        onSelectArtifact={(id) => {
          setActiveArtifactId(id);
          setActiveDenizenId(null);
        }}
        mode={inspectionMode}
        onOpenManifesto={() => setIsManifestoOpen(true)}
      />

      {/* Adversarial Loitering Penalty Modal */}
      <LoiteringPenaltyModal
        isOpen={isLoiteringModalOpen}
        dwellSeconds={telemetry.dwellTimeSeconds}
        onDismiss={() => {
          setIsLoiteringModalOpen(false);
          lastMovementTimeRef.current = Date.now();
        }}
      />

      {/* Discursive Design Theoretical Manifesto Modal */}
      <DiscursiveManifestoModal
        isOpen={isManifestoOpen}
        onClose={() => setIsManifestoOpen(false)}
      />
    </main>
  );
}
