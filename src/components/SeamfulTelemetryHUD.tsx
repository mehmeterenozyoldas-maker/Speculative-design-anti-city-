import React, { useState } from 'react';
import { SurveillanceTelemetry, UrbanInspectionMode } from '../types';
import { Terminal, Activity, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface SeamfulTelemetryHUDProps {
  telemetry: SurveillanceTelemetry;
  mode: UrbanInspectionMode;
}

export const SeamfulTelemetryHUD: React.FC<SeamfulTelemetryHUDProps> = ({
  telemetry,
  mode,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside
      aria-label="Surveillance Telemetry Stream"
      className="absolute bottom-4 left-4 z-20 w-80 sm:w-96 bg-neutral-950/90 backdrop-blur-md border border-neutral-800 rounded shadow-2xl overflow-hidden font-mono text-[11px] select-text"
    >
      {/* Header bar */}
      <header className="flex items-center justify-between px-3 py-2 bg-neutral-900 border-b border-neutral-800 text-neutral-300">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span className="font-semibold text-neutral-200 tracking-wide">
            {mode === 'corporate'
              ? 'MUNICIPAL TELEMETRY SINK'
              : mode === 'interrogative'
              ? 'BIOMETRIC SURVEILLANCE LOG'
              : 'TACTICAL SIGNAL INTERCEPT'}
          </span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-neutral-400 hover:text-neutral-200 p-0.5"
          title={isExpanded ? 'Collapse JSON data feed' : 'Expand raw JSON stream'}
        >
          {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </header>

      {/* Primary Metrics Grid */}
      <div className="p-3 grid grid-cols-2 gap-2 text-neutral-400">
        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <div className="text-[10px] text-neutral-500 uppercase">Cursor Spatial Anchor</div>
          <div className="text-neutral-200 font-medium">
            X:{telemetry.cursorX} <span className="text-neutral-600">|</span> Y:{telemetry.cursorY}
          </div>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <div className="text-[10px] text-neutral-500 uppercase">Kinetic Velocity</div>
          <div className="text-neutral-200 font-medium">
            {telemetry.velocity.toFixed(1)} px/Δt
          </div>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <div className="text-[10px] text-neutral-500 uppercase">Dwell Time (Loiter)</div>
          <div className={`font-medium ${telemetry.dwellTimeSeconds > 3 ? 'text-rose-400' : 'text-neutral-200'}`}>
            {telemetry.dwellTimeSeconds.toFixed(1)}s
          </div>
        </div>

        <div className="bg-neutral-900/60 p-2 rounded border border-neutral-800/80">
          <div className="text-[10px] text-neutral-500 uppercase">Closest Exclusion Zone</div>
          <div className="text-neutral-200 font-medium">
            {telemetry.nearestArtifactDistance < 900 ? `${telemetry.nearestArtifactDistance}m` : 'Scanning...'}
          </div>
        </div>
      </div>

      {/* Loitering warning message if high */}
      {telemetry.loiteringRiskIndex > 70 && (
        <div className="mx-3 mb-2 p-2 bg-rose-950/60 border border-rose-800/80 rounded flex items-center gap-2 text-rose-300">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 animate-bounce" />
          <span className="text-[10px] leading-tight">
            CRITICAL: Prolonged spatial dwell detected. Municipal loitering infraction logged.
          </span>
        </div>
      )}

      {/* Raw JSON Stream / Seamful Computational Labor */}
      {isExpanded && (
        <div className="border-t border-neutral-800 bg-black/80 p-2.5 max-h-48 overflow-y-auto">
          <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
            <span className="flex items-center gap-1">
              <Terminal className="w-3 h-3 text-emerald-400" />
              LIVE_EVENT_INGEST_STREAM
            </span>
            <span className="text-emerald-500/80 animate-pulse">STREAMING</span>
          </div>
          <pre className="text-[10px] text-emerald-400/90 leading-relaxed font-mono whitespace-pre-wrap break-all">
            {JSON.stringify(
              {
                timestamp: new Date().toISOString(),
                protocol: 'SMART_MUNICIPALITY_CADASTRAL_V4',
                subject: {
                  cursorVector: [telemetry.cursorX, telemetry.cursorY],
                  speed_px_ms: telemetry.velocity,
                  stationaryDuration_sec: telemetry.dwellTimeSeconds,
                  loiteringIndex: `${telemetry.loiteringRiskIndex}%`,
                  biometricEntropyScore: telemetry.biometricEntropy.toFixed(4),
                },
                spatialEnforcement: {
                  nearestHostileAsset: telemetry.nearestArtifactId || 'NONE_IN_VICINITY',
                  proximityMeters: telemetry.nearestArtifactDistance,
                  activeBylawRestriction: telemetry.loiteringRiskIndex > 60 ? 'MUNI_CODE_LOITER_77A' : 'NOMINAL_FLOW',
                  cameraHeadServoPitch: `${(telemetry.surveillanceCameraAngle || 0).toFixed(1)}°`,
                },
                critiqueNote:
                  'Reflective Design reveals the invisible biometric labor executed silently behind your viewport.',
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </aside>
  );
};
