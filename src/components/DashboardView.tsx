import React from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  Lock,
  Wifi,
  EyeOff,
  Zap,
  Activity,
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Shield,
  Crosshair,
  Bot,
  Binary,
  Search,
  Radio,
  Cpu,
  Fingerprint
} from 'lucide-react';
import { ThreatItem, SecurityEventLog, ActiveTabType } from '../types';
import { soundFx } from '../utils/audioSensors';
import { ToggleSwitch } from './ToggleSwitch';

interface DashboardViewProps {
  healthScore: number;
  threats: ThreatItem[];
  realTimeShieldActive: boolean;
  onToggleRealTimeShield: () => void;
  webShieldActive: boolean;
  onToggleWebShield: () => void;
  wifiShieldActive: boolean;
  onToggleWifiShield: () => void;
  micCamGuardActive: boolean;
  onToggleMicCamGuard: () => void;
  antiTheftArmed: boolean;
  onToggleAntiTheft: () => void;
  vpnConnected: boolean;
  onToggleVpn: () => void;
  onStartScan: () => void;
  onNavigate: (tab: ActiveTabType) => void;
  eventLogs: SecurityEventLog[];
  onCleanCache: () => void;
  isCleaningCache: boolean;
  onOpenCommandPalette?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  healthScore,
  threats,
  realTimeShieldActive,
  onToggleRealTimeShield,
  webShieldActive,
  onToggleWebShield,
  wifiShieldActive,
  onToggleWifiShield,
  micCamGuardActive,
  onToggleMicCamGuard,
  antiTheftArmed,
  onToggleAntiTheft,
  vpnConnected,
  onToggleVpn,
  onStartScan,
  onNavigate,
  eventLogs,
  onCleanCache,
  isCleaningCache,
  onOpenCommandPalette
}) => {
  const activeThreats = threats.filter((t) => t.status === 'active');
  const isOptimal = healthScore >= 80 && activeThreats.length === 0;

  // 10 Security Modules Directory
  const servicesList: Array<{
    id: ActiveTabType;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
    badgeColor: string;
    tag: string;
  }> = [
    {
      id: 'scanner',
      title: 'Threat Scanner & Sandbox',
      description: 'Radial progress scanner, heuristic signatures, overnight scheduled scans, and quarantine sandbox.',
      icon: <ScanSearch className="w-4 h-4 text-rose-400" />,
      badge: activeThreats.length > 0 ? `${activeThreats.length} ISSUES` : 'SECURED',
      badgeColor: activeThreats.length > 0 ? 'bg-rose-950/80 text-rose-400 border-rose-800' : 'bg-emerald-950/80 text-emerald-400 border-emerald-800',
      tag: 'KERNEL V12'
    },
    {
      id: 'zero_click',
      title: 'Zero-Click & Pegasus Defense',
      description: 'BLASTPASS, ForcedEntry mitigation, media sandbox parsing, and memory randomization.',
      icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />,
      badge: 'HARDENED',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-800',
      tag: 'STAGEFRIGHT BLOCKED'
    },
    {
      id: 'privacy',
      title: 'Sensor Privacy & Killswitches',
      description: 'Hardware killswitches for Optical Camera & MEMS Mic, clipboard protector, and permissions.',
      icon: <EyeOff className="w-4 h-4 text-cyan-400" />,
      badge: micCamGuardActive ? 'GUARDED' : 'STANDBY',
      badgeColor: micCamGuardActive ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800' : 'bg-slate-900 text-slate-400 border-slate-800',
      tag: 'HARDWARE BUS'
    },
    {
      id: 'antitheft',
      title: 'Anti-Theft Armory & Radar',
      description: 'Precision GPS satellite tracker, decoy intruder selfie traps, and remote lockout wipe.',
      icon: <Crosshair className="w-4 h-4 text-emerald-400" />,
      badge: antiTheftArmed ? 'ARMED' : 'STANDBY',
      badgeColor: antiTheftArmed ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' : 'bg-slate-900 text-slate-400 border-slate-800',
      tag: '105dB ALARM'
    },
    {
      id: 'network',
      title: 'Network Defense & WireGuard VPN',
      description: 'Encrypted Zurich tunnel, Wi-Fi ARP spoofing sentry, SSL stripping, and DNS leak guard.',
      icon: <Wifi className="w-4 h-4 text-blue-400" />,
      badge: vpnConnected ? 'CONNECTED' : 'DISCONNECTED',
      badgeColor: vpnConnected ? 'bg-blue-950/80 text-blue-300 border-blue-800' : 'bg-slate-900 text-slate-400 border-slate-800',
      tag: 'CHACHA20'
    },
    {
      id: 'vault',
      title: 'Encrypted Vault & Decoy PIN',
      description: 'Zero-knowledge AES-GCM-256 client-side cryptographic storage with master & decoy PINs.',
      icon: <Lock className="w-4 h-4 text-amber-400" />,
      badge: 'AES-256',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-800',
      tag: 'DECOY CHAMBER'
    },
    {
      id: 'ai_advisor',
      title: 'AI Threat Advisor & Smishing Dissector',
      description: 'Neural SMS phishing inspection, invoice trap analysis, and conversational cyber advisor.',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      badge: 'GEMINI AI',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-800',
      tag: 'NEURAL NET'
    },
    {
      id: 'forensic',
      title: 'Forensic DNA & Sandbox Analyzer',
      description: 'Binary header disassembly, entropy calculators, cryptographic hash matching, and IOC tracking.',
      icon: <Binary className="w-4 h-4 text-pink-400" />,
      badge: 'REVERSE ENG',
      badgeColor: 'bg-pink-950/80 text-pink-300 border-pink-800',
      tag: 'ELF / DEX DECOMPILER'
    },
    {
      id: 'diagnostics',
      title: 'Hardware Diagnostics & Log Export',
      description: 'Low-level kernel bus attestation, SOC battery thermals, and tamper-evident PDF/JSON audit log export.',
      icon: <Activity className="w-4 h-4 text-cyan-400" />,
      badge: 'PDF / JSON AUDIT',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-800',
      tag: 'TEE ENCLAVE'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Main Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Main Hero Security Index + Twin Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Security Index Card */}
          <div className="cyber-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-[#0D1322] to-[#070B14] border-slate-800/90 shadow-2xl">
            {/* Background Cyber Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-blue-400 flex items-center gap-1.5 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
                  REAL-TIME DEFENSE TELEMETRY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                  System Security Posture
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                    isOptimal
                      ? 'bg-emerald-950/80 border-emerald-700/70 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.25)]'
                      : 'bg-rose-950/80 border-rose-700/70 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOptimal ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-rose-400 animate-pulse shadow-[0_0_6px_#F43F5E]'
                    }`}
                  />
                  {isOptimal ? 'SHIELD OPERATIONAL' : 'THREATS DETECTED'}
                </span>
              </div>
            </div>

            {/* Holographic Glowing Gauge Index */}
            <div className="my-8 flex flex-col items-center justify-center relative z-10">
              <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Subtle Outer Neon Ring with Pulsing Glow */}
                <div className={`absolute inset-0 rounded-full border ${isOptimal ? 'border-blue-500/30 shadow-[0_0_35px_rgba(59,130,246,0.2)]' : 'border-rose-500/40 shadow-[0_0_35px_rgba(244,63,94,0.3)]'} animate-pulse`} />
                
                {/* Secondary Inset Dark Chamber with Neon Border */}
                <div className="absolute inset-3 rounded-full border border-slate-800 bg-[#090E1A]/90 backdrop-blur-xl flex items-center justify-center shadow-inner" />

                {/* Rotating Sensor Radar Beam */}
                <div className="absolute inset-4 rounded-full border border-dashed border-blue-500/20 animate-spin [animation-duration:18s]" />

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                  {isOptimal ? (
                    <div className="w-11 h-11 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400 mb-1 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-rose-500/10 border border-rose-500/40 flex items-center justify-center text-rose-400 mb-1 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
                      <ShieldAlert className="w-6 h-6 animate-pulse" />
                    </div>
                  )}
                  <span className="text-5xl sm:text-6xl font-extrabold text-white tracking-tight font-display drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                    {healthScore}
                    <span className="text-2xl text-blue-400 font-mono font-light ml-0.5">%</span>
                  </span>
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-300 font-mono mt-1">
                    {isOptimal ? 'ARMOR OPTIMAL' : 'ACTION REQUIRED'}
                  </span>
                  <span className="text-[11px] text-blue-400/90 font-mono mt-0.5 flex items-center gap-1">
                    <Radio className="w-3 h-3 text-cyan-400 animate-pulse" />
                    {activeThreats.length === 0
                      ? 'Zero Attack Surface'
                      : `${activeThreats.length} Unresolved Alerts`}
                  </span>
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={onStartScan}
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/40 cursor-pointer active:scale-95"
                >
                  <ScanSearch className="w-4 h-4" />
                  <span>START SYSTEM SCAN</span>
                </button>
                <button
                  onClick={onCleanCache}
                  disabled={isCleaningCache}
                  className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-cyan-400 ${isCleaningCache ? 'animate-spin' : ''}`}
                  />
                  <span>{isCleaningCache ? 'PURGING BUFFER...' : 'PURGE CACHE'}</span>
                </button>

                {onOpenCommandPalette && (
                  <button
                    onClick={() => {
                      soundFx.playClick(true);
                      onOpenCommandPalette();
                    }}
                    className="px-4 py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 text-slate-200 rounded-full text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 group"
                  >
                    <Search className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
                    <span>COMMAND HUD</span>
                    <kbd className="px-1.5 py-0.2 bg-slate-950 text-[10px] text-slate-400 border border-slate-800 rounded">
                      ⌘K
                    </kbd>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom 3 Metrics HUD */}
            <div className="border-t border-slate-800/80 pt-4 grid grid-cols-3 divide-x divide-slate-800/80 text-center relative z-10 font-mono">
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">1,480</div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                  Signatures Verified
                </div>
              </div>
              <div className="px-2">
                <div
                  className={`text-xl sm:text-2xl font-bold font-display tracking-tight ${
                    activeThreats.length > 0 ? 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]' : 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                  }`}
                >
                  {activeThreats.length}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                  Active Threat Vectors
                </div>
              </div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold text-cyan-400 font-display tracking-tight drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]">
                  38ms
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 mt-0.5">
                  WireGuard Latency
                </div>
              </div>
            </div>
          </div>

          {/* Twin Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Identity Guard Card */}
            <div className="cyber-card p-5 flex flex-col justify-between space-y-3 bg-[#0B101C]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-700/60 flex items-center justify-center text-blue-400 shadow-md shadow-blue-950/50">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-blue-950/90 text-blue-300 border border-blue-800/80">
                    DARK WEB RADAR
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-display">Credential Breach Sentinel</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time neural monitoring against 14B+ dumped records and exposed credential leak databases.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate('ai_advisor');
                  soundFx.playClick(false);
                }}
                className="w-full py-2.5 bg-slate-900/90 hover:bg-blue-600/20 border border-slate-700/80 hover:border-blue-500/60 text-slate-200 hover:text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>RUN BREACH AUDIT</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>

            {/* Network Shield Card */}
            <div className="cyber-card p-5 flex flex-col justify-between space-y-3 bg-[#0B101C]">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400 shadow-md shadow-cyan-950/50">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950/90 text-cyan-300 border border-cyan-800/80">
                    {vpnConnected ? 'WIREGUARD ENCRYPTED' : 'HOTSPOT DEFENSE'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white font-display">Encrypted WireGuard Relay</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {vpnConnected
                    ? 'ChaCha20-Poly1305 encrypted node active via Zurich 10Gbps zero-log server.'
                    : 'Real-time ARP spoofing and public Wi-Fi packet sniffing defense standing by.'}
                </p>
              </div>

              <button
                onClick={() => {
                  onToggleVpn();
                  soundFx.playClick(!vpnConnected);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  vpnConnected
                    ? 'bg-rose-950/60 hover:bg-rose-950 text-rose-300 border-rose-800/80'
                    : 'bg-emerald-950/60 hover:bg-emerald-950 text-emerald-300 border-emerald-800/80 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                }`}
              >
                <span>{vpnConnected ? 'DISCONNECT WIREGUARD' : 'CONNECT SECURE TUNNEL'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Threat Journal + Emergency Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Cyber Threat Journal */}
          <div className="cyber-card p-5 flex flex-col flex-1 justify-between bg-[#0A0E18]">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-display">Kernel Attack Journal</h3>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-800/80 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  LIVE HUD
                </span>
              </div>

              {/* Event items */}
              <div className="space-y-3 font-mono">
                {eventLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 text-xs p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'high'
                          ? 'bg-rose-500 shadow-[0_0_6px_#F43F5E]'
                          : log.severity === 'warning'
                          ? 'bg-amber-500 shadow-[0_0_6px_#F59E0B]'
                          : 'bg-emerald-500 shadow-[0_0_6px_#10B981]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-200 truncate font-sans text-xs">{log.title}</span>
                        <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-mono">{log.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onNavigate('scanner');
                soundFx.playClick(false);
              }}
              className="mt-4 w-full py-2.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-slate-200 hover:text-white rounded-xl text-xs font-bold font-mono transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>OPEN TELEMETRY LOGS</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
            </button>
          </div>

          {/* Distress / Emergency Card */}
          <div
            onClick={() => {
              onNavigate('antitheft');
              soundFx.playClick(false);
            }}
            className="p-5 rounded-2xl bg-gradient-to-br from-rose-950/50 to-slate-900 border border-rose-700/60 group cursor-pointer hover:border-rose-500 transition-all flex flex-col justify-between shadow-lg shadow-rose-950/40"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-rose-900/60 text-rose-300 border border-rose-700/80 shrink-0 shadow-md">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white font-display">
                    Emergency Lockdown Hub
                  </h4>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                    PANIC
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Arm anti-theft sensors, trigger 105dB strobe siren, and broadcast GPS distress beacon.
                </p>
                <div className="pt-2 text-xs font-bold font-mono text-rose-400 flex items-center gap-1 group-hover:text-rose-300">
                  <span>DEPLOY DISTRESS PROTOCOL</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME DEFENSE SWITCHBOARD */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Shield className="w-4 h-4 text-blue-400" />
              Hardware & Kernel Interceptor Engines
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Granular state control for low-level system interceptors and filters.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 font-bold">
            6 ENGINES SYNCHRONIZED
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: File & APK Shield */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">File & APK Shield</div>
              </div>
              <p className="text-xs text-slate-400">
                Heuristic signature checking for sideloaded binaries and payload APKs.
              </p>
            </div>
            <ToggleSwitch
              checked={realTimeShieldActive}
              onChange={onToggleRealTimeShield}
              ariaLabel="Toggle File & APK Shield"
            />
          </div>

          {/* Module 2: Web Guard */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">Web Phishing Guard</div>
              </div>
              <p className="text-xs text-slate-400">
                Blocks zero-day homograph spoofing, fake banking portals, and malicious URLs.
              </p>
            </div>
            <ToggleSwitch
              checked={webShieldActive}
              onChange={onToggleWebShield}
              ariaLabel="Toggle Web Phishing Guard"
            />
          </div>

          {/* Module 3: Wi-Fi Sentry */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-cyan-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">Wi-Fi & ARP Sentry</div>
              </div>
              <p className="text-xs text-slate-400">
                Monitors fake evil twin hotspots, SSL stripping, and gateway MAC poisoning.
              </p>
            </div>
            <ToggleSwitch
              checked={wifiShieldActive}
              onChange={onToggleWifiShield}
              ariaLabel="Toggle Wi-Fi & ARP Sentry"
            />
          </div>

          {/* Module 4: Sensor Privacy */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-emerald-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">Sensor Privacy Guard</div>
              </div>
              <p className="text-xs text-slate-400">
                Instantly clamps rogue background MEMS mic eavesdropping and camera wakeups.
              </p>
            </div>
            <ToggleSwitch
              checked={micCamGuardActive}
              onChange={onToggleMicCamGuard}
              ariaLabel="Toggle Sensor Privacy Guard"
            />
          </div>

          {/* Module 5: Anti-Theft */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">Anti-Theft Beacon</div>
              </div>
              <p className="text-xs text-slate-400">
                GPS satellite tracking, accelerometer perimeter guard, and decoy PIN traps.
              </p>
            </div>
            <ToggleSwitch
              checked={antiTheftArmed}
              onChange={onToggleAntiTheft}
              ariaLabel="Toggle Anti-Theft Beacon"
            />
          </div>

          {/* Module 6: VPN Tunnel */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3 bg-[#0B101C]">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-400" />
                <div className="font-bold text-xs sm:text-sm text-white font-display">WireGuard Tunnel</div>
              </div>
              <p className="text-xs text-slate-400">
                {vpnConnected ? 'Encrypted via zero-log Zurich node' : 'ChaCha20-Poly1305 tunnel ready to bind'}
              </p>
            </div>
            <ToggleSwitch
              checked={vpnConnected}
              onChange={onToggleVpn}
              ariaLabel="Toggle WireGuard VPN Tunnel"
            />
          </div>
        </div>
      </div>

      {/* ALL 10 SERVICES DIRECTORY */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
              <Sparkles className="w-4 h-4 text-blue-400" />
              Security Suite Services & Modules
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Direct access to all 10 specialized defense modules, hardware gates, and sandboxes.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-700/80 text-blue-400 font-bold self-start sm:self-auto">
            10/10 MODULES ARMED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {servicesList.map((srv) => (
            <div
              key={srv.id}
              onClick={() => {
                soundFx.playClick(true);
                onNavigate(srv.id);
              }}
              className="cyber-card p-5 cursor-pointer flex flex-col justify-between space-y-3 bg-[#0B101C] group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 group-hover:border-blue-500/50 transition shadow-inner">
                    {srv.icon}
                  </div>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border ${srv.badgeColor}`}>
                    {srv.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-blue-400 transition font-display">
                    {srv.title}
                  </h4>
                  <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block mt-0.5">
                    {srv.tag}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold font-mono text-blue-400 group-hover:text-blue-300">
                <span>LAUNCH ENCLAVE</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
