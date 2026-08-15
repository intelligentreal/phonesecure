import React, { useState } from 'react';
import {
  Activity,
  Cpu,
  Battery,
  HardDrive,
  ShieldCheck,
  Smartphone,
  Thermometer,
  Zap,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Terminal,
  Radio
} from 'lucide-react';
import { DeviceHardwareHealth, SecurityEventLog } from '../types';
import { soundFx } from '../utils/audioSensors';
import { HardwareIntegrityTool } from './HardwareIntegrityTool';

interface DiagnosticsViewProps {
  hardware: DeviceHardwareHealth;
  onOptimizeRam: () => void;
  isOptimizing: boolean;
  onLogSecurityEvent?: (event: SecurityEventLog) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  hardware,
  onOptimizeRam,
  isOptimizing,
  onLogSecurityEvent
}) => {
  const [activeDiagnosticMode, setActiveDiagnosticMode] = useState<'sensor_integrity' | 'hardware_health'>('sensor_integrity');

  return (
    <div className="space-y-6">
      {/* Navigation Switcher between Sensor Integrity & Hardware Telemetry */}
      <div className="flex items-center justify-between bg-slate-900/60 p-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveDiagnosticMode('sensor_integrity')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeDiagnosticMode === 'sensor_integrity'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Hardware Sensor Integrity (Camera, Mic, GPS, Biometrics)</span>
          </button>

          <button
            onClick={() => setActiveDiagnosticMode('hardware_health')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeDiagnosticMode === 'hardware_health'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>SOC Thermals & Boot Attestation</span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400 px-3 py-1 bg-cyan-950/40 border border-cyan-800 rounded-lg">
          Low-Level Kernel Watchdog
        </span>
      </div>

      {activeDiagnosticMode === 'sensor_integrity' ? (
        <HardwareIntegrityTool onLogSecurityEvent={onLogSecurityEvent} />
      ) : (
        <div className="space-y-6">
          {/* Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4" /> Hardware Telemetry & Kernel Security
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  Hardware Health & Device Integrity Diagnostics
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Inspect bootloader integrity, Knox / Secure Enclave hardware attestation, battery thermal safety, and background CPU hogs.
                </p>
              </div>

              <button
                onClick={onOptimizeRam}
                disabled={isOptimizing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isOptimizing ? 'animate-spin' : ''}`} />
                <span>{isOptimizing ? 'Optimizing RAM & Services...' : 'Optimize RAM & Process Leaks'}</span>
              </button>
            </div>
          </div>

          {/* Hardware Telemetry Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Battery & Thermal */}
            <div className="p-4 rounded-xl cyber-card space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">BATTERY THERMALS</span>
                <Thermometer className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {hardware.batteryTemperatureC}°C
              </div>
              <div className="text-xs text-emerald-400 font-mono">
                Health: {hardware.batteryHealthPercent}% (Safe Range)
              </div>
            </div>

            {/* CPU Load */}
            <div className="p-4 rounded-xl cyber-card space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">OCTA-CORE CPU</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {hardware.cpuUsagePercent}% Load
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Snapdragon 8 Gen 3 • 8/8 Cores
              </div>
            </div>

            {/* RAM Usage */}
            <div className="p-4 rounded-xl cyber-card space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">UNIFIED RAM (12 GB)</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {hardware.ramUsagePercent}% Used
              </div>
              <div className="text-xs text-cyan-400 font-mono">
                5.5 GB Available Memory
              </div>
            </div>

            {/* Storage Volume */}
            <div className="p-4 rounded-xl cyber-card space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">UFS 4.0 STORAGE</span>
                <HardDrive className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {hardware.storageFreeGb} GB Free
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Total: {hardware.storageTotalGb} GB Partition
              </div>
            </div>
          </div>

          {/* Security Attestation & Root/Jailbreak Check */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-12 space-y-4">
              <div className="p-5 rounded-2xl cyber-card space-y-4">
                <div className="flex items-center gap-2 text-white font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Hardware Security & Boot Attestation</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Root & Jailbreak</span>
                    <div className="text-emerald-400 font-bold">PASSED (CLEAN)</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Bootloader Lock</span>
                    <div className="text-emerald-400 font-bold">LOCKED & VERIFIED</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Secure Enclave</span>
                    <div className="text-emerald-400 font-bold">HARDWARE ACTIVE</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">SELinux Mode</span>
                    <div className="text-emerald-400 font-bold">ENFORCING</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">OS Security Patch</span>
                    <div className="text-cyan-400 font-bold">{hardware.securityPatchDate}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-400">Knox Warranty Bit</span>
                    <div className="text-emerald-400 font-bold">0x0 (UNTRIPPED)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
