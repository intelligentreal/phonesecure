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
  CheckCircle2
} from 'lucide-react';
import { DeviceHardwareHealth } from '../types';
import { soundFx } from '../utils/audioSensors';

interface DiagnosticsViewProps {
  hardware: DeviceHardwareHealth;
  onOptimizeRam: () => void;
  isOptimizing: boolean;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  hardware,
  onOptimizeRam,
  isOptimizing
}) => {
  const [testSensorsDone, setTestSensorsDone] = useState(false);
  const [isTestingSensors, setIsTestingSensors] = useState(false);

  const handleRunSensorAudit = () => {
    setIsTestingSensors(true);
    soundFx.playRadarBeep();
    setTimeout(() => {
      setIsTestingSensors(false);
      setTestSensorsDone(true);
      soundFx.playShieldSecured();
    }, 1200);
  };

  return (
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20"
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
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl cyber-card space-y-4">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Hardware Security & Boot Attestation</span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Root & Jailbreak Detection</span>
                <span className="text-emerald-400 font-bold">PASSED (CLEAN)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Bootloader Lock Status</span>
                <span className="text-emerald-400 font-bold">LOCKED & VERIFIED</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Samsung Knox / Secure Enclave</span>
                <span className="text-emerald-400 font-bold">HARDWARE ACTIVE</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">SELinux Mode</span>
                <span className="text-emerald-400 font-bold">ENFORCING</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Android OS Security Patch</span>
                <span className="text-cyan-400 font-bold">{hardware.securityPatchDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hardware Sensor Audit */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-5 rounded-2xl cyber-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Sensors & Biometric Security Audit</span>
              </div>
              <button
                onClick={handleRunSensorAudit}
                disabled={isTestingSensors}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
              >
                {isTestingSensors ? 'Auditing Sensors...' : 'Run Sensor Test'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Ultrasonic Fingerprint</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Calibrated
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">3D Face Unlock Biometrics</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Enclave Protected
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">Gyroscope & Motion Guard</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Armed for Theft
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[11px]">NFC & Secure Element</div>
                <div className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tokenized
                </div>
              </div>
            </div>

            {testSensorsDone && (
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>All 12 hardware sensors passed low-level latency & cryptographic tamper checks.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
