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
  CheckCircle2,
  Cpu,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Shield
} from 'lucide-react';
import { ThreatItem, SecurityEventLog, ActiveTabType } from '../types';
import { soundFx } from '../utils/audioSensors';

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
  isCleaningCache
}) => {
  const activeThreats = threats.filter((t) => t.status === 'active');
  const isOptimal = healthScore >= 85 && activeThreats.length === 0;

  return (
    <div className="space-y-6">
      {/* Top Main Section: 2 Columns matching Immersive UI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Main Hero Security Index + Twin Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Security Index Card */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl overflow-hidden backdrop-blur-sm group relative p-6 sm:p-8 flex flex-col justify-between">
            {/* Immersive Cyber Grid Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(37,99,235,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            {/* Card Header */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-blue-400 font-semibold block mb-1">
                  Continuous Telemetry
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Aegis Cyber Security Index
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-semibold border ${
                  isOptimal
                    ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${isOptimal ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)] animate-ping'}`} />
                  {isOptimal ? 'SYSTEM PROTECTED' : 'AT RISK'}
                </span>
              </div>
            </div>

            {/* Glowing Center Orb */}
            <div className="relative z-10 my-8 flex flex-col items-center justify-center">
              <div className="relative w-60 h-60 sm:w-64 sm:h-64 flex items-center justify-center">
                {/* Outer Ring Static */}
                <div className="absolute inset-0 border-[6px] border-emerald-500/10 rounded-full" />
                {/* Rotating Glowing Arc */}
                <div
                  className={`absolute inset-0 border-[6px] rounded-full border-t-transparent animate-[spin_4s_linear_infinite] ${
                    isOptimal
                      ? 'border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                      : 'border-rose-500 shadow-[0_0_40px_rgba(244,63,94,0.25)]'
                  }`}
                />

                {/* Center Content */}
                <div className="flex flex-col items-center justify-center text-center px-4">
                  {isOptimal ? (
                    <ShieldCheck className="w-10 h-10 text-emerald-400 mb-1 drop-shadow" />
                  ) : (
                    <ShieldAlert className="w-10 h-10 text-rose-400 mb-1 drop-shadow animate-pulse" />
                  )}
                  <span className="text-5xl sm:text-6xl font-black text-white tracking-tight">
                    {healthScore}
                  </span>
                  <span className={`text-[11px] uppercase tracking-widest font-bold mt-1 ${isOptimal ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isOptimal ? 'Security Index' : 'Remediation Required'}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-1 font-mono">
                    {activeThreats.length === 0 ? '6 Shield Engines Active' : `${activeThreats.length} Malicious Threats`}
                  </span>
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <motion.button
                  onClick={onStartScan}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-[0_0_20px_rgba(37,99,235,0.35)] flex items-center gap-2 cursor-pointer"
                >
                  <ScanSearch className="w-4 h-4" />
                  <span>Initiate Deep Scan</span>
                </motion.button>
                <motion.button
                  onClick={onCleanCache}
                  disabled={isCleaningCache}
                  whileHover={isCleaningCache ? {} : { scale: 1.02, y: -1 }}
                  whileTap={isCleaningCache ? {} : { scale: 0.97 }}
                  className="px-4 py-2.5 bg-slate-800/70 hover:bg-slate-700/80 border border-slate-700/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isCleaningCache ? 'animate-spin' : ''}`} />
                  <span>{isCleaningCache ? 'Purging Temp Files...' : 'Clean Junk & Cache'}</span>
                </motion.button>
              </div>
            </div>

            {/* Bottom 3-Column Metrics */}
            <div className="relative z-10 border-t border-slate-800/60 pt-4 grid grid-cols-3 divide-x divide-slate-800/60 text-center">
              <motion.div whileHover={{ scale: 1.04 }} className="px-2 cursor-default transition-transform">
                <div className="text-xl sm:text-2xl font-bold text-white">1.4k</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Files Protected</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} className="px-2 cursor-default transition-transform">
                <div className={`text-xl sm:text-2xl font-bold ${activeThreats.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {activeThreats.length}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Active Threats</div>
              </motion.div>
              <motion.div whileHover={{ scale: 1.04 }} className="px-2 cursor-default transition-transform">
                <div className="text-xl sm:text-2xl font-bold text-blue-400">42ms</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Tunnel Latency</div>
              </motion.div>
            </div>
          </div>

          {/* Twin Highlight Cards matching Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Identity Guard Card */}
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-indigo-600/20 to-blue-900/20 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/60">
                    DARK WEB SENTRY
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Identity & Breach Guard</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Zero leaked credentials detected on monitored breach intelligence databases.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onNavigate('ai_advisor');
                  soundFx.playClick(false);
                }}
                className="mt-4 w-full py-2 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 text-indigo-200 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Run Identity Audit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>

            {/* Network Shield Card */}
            <motion.div
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-gradient-to-br from-emerald-600/20 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-6 relative overflow-hidden backdrop-blur-sm flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-300">
                    <Wifi className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                    {vpnConnected ? 'WIREGUARD' : 'HOTSPOT GUARD'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">Network & VPN Shield</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {vpnConnected
                    ? 'Encrypted AES-256 tunnel active via Zurich, CH node (Zero-Log).'
                    : 'Real-time ARP spoofing and SSL stripping defense enabled.'}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  onToggleVpn();
                  soundFx.playClick(!vpnConnected);
                }}
                className={`mt-4 w-full py-2 border rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                  vpnConnected
                    ? 'bg-emerald-600/30 hover:bg-emerald-600/40 border-emerald-500/40 text-emerald-200'
                    : 'bg-slate-800/70 hover:bg-slate-700/80 border-slate-700/70 text-slate-300'
                }`}
              >
                <span>{vpnConnected ? 'Disconnect VPN' : 'Connect Secure Zurich VPN'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Right Column: Threat Journal + Emergency Lockdown Card */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cyber Threat Journal */}
          <div className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 flex flex-col flex-1 backdrop-blur-sm justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-800/70 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold text-white">Threat Journal</h3>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                  REAL-TIME
                </span>
              </div>

              {/* Event items */}
              <div className="space-y-3.5">
                {eventLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-3 text-xs">
                    <span
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'high'
                          ? 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]'
                          : log.severity === 'warning'
                          ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                          : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-slate-200 truncate">{log.title}</span>
                        <span className="text-[10px] font-mono text-slate-500 shrink-0">{log.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{log.description}</p>
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
              className="mt-6 w-full py-2.5 bg-slate-800/60 hover:bg-slate-700/70 border border-slate-700/60 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>View Full Security Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Distress / Emergency Lockdown Card */}
          <div
            onClick={() => {
              onNavigate('antitheft');
              soundFx.playClick(false);
            }}
            className="bg-rose-500/10 border border-rose-500/20 rounded-3xl p-6 group cursor-pointer hover:bg-rose-500/20 transition-all backdrop-blur-sm relative overflow-hidden"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0 group-hover:scale-105 transition">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white group-hover:text-rose-300 transition">
                  Emergency Lockdown
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Instantly sever all radios, engage hardware enclave lock, and sound the 105dB siren deterrent.
                </p>
                <div className="pt-2 text-xs font-bold text-rose-400 flex items-center gap-1">
                  <span>Open Anti-Theft Armory</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Defense Switchboard */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            Active Protection Switchboard
          </h3>
          <span className="text-xs font-mono text-slate-400">Layer-7 Heuristic Core</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: File & APK Shield */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">File & APK Shield</div>
              </div>
              <p className="text-xs text-slate-400">
                Hash and heuristic analysis for sideloaded APKs and binaries.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={realTimeShieldActive}
                onChange={onToggleRealTimeShield}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          {/* Module 2: Web Guard */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">Web & Phishing Guard</div>
              </div>
              <p className="text-xs text-slate-400">
                Blocks deceptive zero-day phishing and malicious URLs.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={webShieldActive}
                onChange={onToggleWebShield}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
            </label>
          </div>

          {/* Module 3: Wi-Fi Sentry */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Wifi className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">Wi-Fi & ARP Sentry</div>
              </div>
              <p className="text-xs text-slate-400">
                Detects Rogue APs, SSL stripping, and MitM sniffing.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={wifiShieldActive}
                onChange={onToggleWifiShield}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600" />
            </label>
          </div>

          {/* Module 4: Sensor Privacy */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">Sensor Privacy Guard</div>
              </div>
              <p className="text-xs text-slate-400">
                Prevents silent background microphone and camera eavesdropping.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={micCamGuardActive}
                onChange={onToggleMicCamGuard}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500" />
            </label>
          </div>

          {/* Module 5: Anti-Theft */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">Anti-Theft Beacon</div>
              </div>
              <p className="text-xs text-slate-400">
                Precision GPS tracking, 105dB siren, and decoy intruder traps.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={antiTheftArmed}
                onChange={onToggleAntiTheft}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600" />
            </label>
          </div>

          {/* Module 6: VPN Tunnel */}
          <div className="p-4 rounded-2xl cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="font-semibold text-sm text-white">WireGuard VPN Tunnel</div>
              </div>
              <p className="text-xs text-slate-400">
                {vpnConnected ? 'Encrypted via Zurich Node' : 'Bypass ISP tracking & encrypt IP'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={vpnConnected}
                onChange={onToggleVpn}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
