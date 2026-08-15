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
  Search
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

  // 10 Services List
  const servicesList: Array<{
    id: ActiveTabType;
    title: string;
    description: string;
    icon: React.ReactNode;
    badge: string;
  }> = [
    {
      id: 'scanner',
      title: 'Threat Scanner & Sandbox',
      description: 'Heuristic APK signatures, trojans, ransomware, and quarantine containment sandbox.',
      icon: <ScanSearch className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: activeThreats.length > 0 ? `${activeThreats.length} ISSUES` : 'SECURED'
    },
    {
      id: 'zero_click',
      title: 'Zero-Click & Pegasus Hardening',
      description: 'BLASTPASS, ForcedEntry mitigation, media sandbox parsing, and accessibility lockdown.',
      icon: <ShieldAlert className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: 'HARDENED'
    },
    {
      id: 'privacy',
      title: 'Sensor Privacy & Killswitches',
      description: 'Hardware killswitches for Optical Camera & MEMS Mic, clipboard protector, and permissions.',
      icon: <EyeOff className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: micCamGuardActive ? 'GUARDED' : 'STANDBY'
    },
    {
      id: 'antitheft',
      title: 'Anti-Theft Armory & Siren',
      description: 'Precision GPS real-time tracker, front-camera decoy intruder traps, and remote lockout wipe.',
      icon: <Crosshair className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: antiTheftArmed ? 'ARMED' : 'STANDBY'
    },
    {
      id: 'network',
      title: 'Network Defense & WireGuard VPN',
      description: 'Encrypted Zurich tunnel, Wi-Fi ARP spoofing sentry, SSL stripping, and DNS leak guard.',
      icon: <Wifi className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: vpnConnected ? 'CONNECTED' : 'DISCONNECTED'
    },
    {
      id: 'vault',
      title: 'Encrypted Vault & Decoy PIN',
      description: 'Zero-knowledge AES-GCM-256 client-side cryptographic storage with master & decoy PINs.',
      icon: <Lock className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: 'AES-256'
    },
    {
      id: 'ai_advisor',
      title: 'AI Threat Advisor & Smishing Dissector',
      description: 'Neural SMS phishing inspection, invoice trap analysis, and conversational cyber advisor.',
      icon: <Bot className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: 'AI ADVISOR'
    },
    {
      id: 'forensic',
      title: 'Forensic DNA & Sandbox Analyzer',
      description: 'Binary header disassembly, entropy calculators, cryptographic hash matching, and IOC tracking.',
      icon: <Binary className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: 'ANALYZER'
    },
    {
      id: 'diagnostics',
      title: 'Hardware Sensor Integrity',
      description: 'Low-level kernel bus attestation, Web API real-time verification, and SOC battery thermals.',
      icon: <Activity className="w-4 h-4 text-slate-700 dark:text-slate-200" />,
      badge: 'SENSORS'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Main Section: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Main Hero Security Index + Twin Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Security Index Card */}
          <div className="cyber-card p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
            {/* Card Header */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-0.5">
                  SYSTEM SECURITY POSTURE
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  Security Integrity Index
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium border ${
                    isOptimal
                      ? 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                      : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOptimal ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'
                    }`}
                  />
                  {isOptimal ? 'PROTECTION ACTIVE' : 'ISSUES DETECTED'}
                </span>
              </div>
            </div>

            {/* Minimalist Thermostat/Halo Index (Inspired by Image 3) */}
            <div className="my-8 flex flex-col items-center justify-center">
              <div className="relative w-56 h-56 sm:w-60 sm:h-60 flex items-center justify-center">
                {/* Minimal Outer Ring with soft subtle halo */}
                <div className="absolute inset-0 border border-slate-200 dark:border-slate-700/60 rounded-full shadow-[0_4px_24px_rgba(0,0,0,0.03)]" />
                
                {/* Secondary Inset Circle */}
                <div className="absolute inset-3 border border-slate-100 dark:border-slate-800 rounded-full bg-slate-50/50 dark:bg-[#141B26]/60" />

                {/* Center Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
                  {isOptimal ? (
                    <ShieldCheck className="w-8 h-8 text-[#4A5D73] dark:text-slate-300 mb-1" />
                  ) : (
                    <ShieldAlert className="w-8 h-8 text-rose-500 mb-1 animate-pulse" />
                  )}
                  <span className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                    {healthScore}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mt-1">
                    {isOptimal ? 'Optimal Health' : 'Review Security'}
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {activeThreats.length === 0
                      ? 'All Engines Active'
                      : `${activeThreats.length} Action Items`}
                  </span>
                </div>
              </div>

              {/* Action Trigger Buttons */}
              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                <button
                  onClick={onStartScan}
                  className="px-5 py-2 bg-[#4A5D73] hover:bg-[#38495C] text-white rounded-full text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Start System Scan</span>
                </button>
                <button
                  onClick={onCleanCache}
                  disabled={isCleaningCache}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 text-slate-500 ${isCleaningCache ? 'animate-spin' : ''}`}
                  />
                  <span>{isCleaningCache ? 'Cleaning...' : 'Purge Cache'}</span>
                </button>

                {onOpenCommandPalette && (
                  <button
                    onClick={() => {
                      soundFx.playClick(true);
                      onOpenCommandPalette();
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-full text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5 text-slate-500" />
                    <span>Quick Command</span>
                  </button>
                )}
              </div>
            </div>

            {/* Bottom 3 Metrics */}
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 grid grid-cols-3 divide-x divide-slate-200 dark:divide-slate-800/80 text-center">
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">1.4k</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                  Files Verified
                </div>
              </div>
              <div className="px-2">
                <div
                  className={`text-xl sm:text-2xl font-bold ${
                    activeThreats.length > 0 ? 'text-rose-600' : 'text-slate-900 dark:text-slate-100'
                  }`}
                >
                  {activeThreats.length}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                  Threats
                </div>
              </div>
              <div className="px-2">
                <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">42ms</div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">
                  VPN Latency
                </div>
              </div>
            </div>
          </div>

          {/* Twin Highlight Cards (Minimalist Clean Cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Identity Guard Card */}
            <div className="cyber-card p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    IDENTITY GUARD
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Dark Web Breach Monitor</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Monitors compromised email databases and credential dumps in real-time.
                </p>
              </div>

              <button
                onClick={() => {
                  onNavigate('ai_advisor');
                  soundFx.playClick(false);
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Run Breach Audit</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Network Shield Card */}
            <div className="cyber-card p-5 flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
                    <Wifi className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {vpnConnected ? 'WIREGUARD' : 'HOTSPOT GUARD'}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Encrypted Tunnel</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {vpnConnected
                    ? 'Encrypted AES-256 WireGuard tunnel active via Zurich node.'
                    : 'Real-time ARP spoofing and public Wi-Fi packet encryption ready.'}
                </p>
              </div>

              <button
                onClick={() => {
                  onToggleVpn();
                  soundFx.playClick(!vpnConnected);
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{vpnConnected ? 'Disconnect VPN' : 'Connect VPN'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Threat Journal + Emergency Card */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Cyber Threat Journal */}
          <div className="cyber-card p-5 flex flex-col flex-1 justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Activity Journal</h3>
                </div>
                <span className="text-[10px] font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                  LIVE
                </span>
              </div>

              {/* Event items */}
              <div className="space-y-3">
                {eventLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 text-xs">
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        log.severity === 'high'
                          ? 'bg-rose-500'
                          : log.severity === 'warning'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{log.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {log.timestamp}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{log.description}</p>
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
              className="mt-4 w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Full Security Logs</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Distress / Emergency Card */}
          <div
            onClick={() => {
              onNavigate('antitheft');
              soundFx.playClick(false);
            }}
            className="p-5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50 group cursor-pointer hover:bg-rose-100/50 dark:hover:bg-rose-950/40 transition-all flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Emergency Lockdown
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Instantly arm anti-theft sensors, trigger 105dB alarm, and dispatch GPS distress beacon.
                </p>
                <div className="pt-1 text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                  <span>Open Emergency Controls</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* REAL-TIME PROTECTION SWITCHBOARD WITH MINIMAL TOGGLES */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#4A5D73] dark:text-slate-400" />
              Active Protection Controls
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Individual shield toggles using minimalist single-tone switches.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">6 Engines Active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Module 1: File & APK Shield */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">File & APK Shield</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Heuristic analysis for sideloaded APKs and binaries.
              </p>
            </div>
            <ToggleSwitch
              checked={realTimeShieldActive}
              onChange={onToggleRealTimeShield}
              ariaLabel="Toggle File & APK Shield"
            />
          </div>

          {/* Module 2: Web Guard */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Web Phishing Guard</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Blocks deceptive zero-day phishing and malicious URLs.
              </p>
            </div>
            <ToggleSwitch
              checked={webShieldActive}
              onChange={onToggleWebShield}
              ariaLabel="Toggle Web Phishing Guard"
            />
          </div>

          {/* Module 3: Wi-Fi Sentry */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Wi-Fi & ARP Sentry</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Detects rogue APs, SSL stripping, and packet sniffing.
              </p>
            </div>
            <ToggleSwitch
              checked={wifiShieldActive}
              onChange={onToggleWifiShield}
              ariaLabel="Toggle Wi-Fi & ARP Sentry"
            />
          </div>

          {/* Module 4: Sensor Privacy */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Sensor Privacy Guard</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Blocks background microphone and camera access.
              </p>
            </div>
            <ToggleSwitch
              checked={micCamGuardActive}
              onChange={onToggleMicCamGuard}
              ariaLabel="Toggle Sensor Privacy Guard"
            />
          </div>

          {/* Module 5: Anti-Theft */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">Anti-Theft Beacon</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                GPS tracking, siren alarm, and decoy intruder traps.
              </p>
            </div>
            <ToggleSwitch
              checked={antiTheftArmed}
              onChange={onToggleAntiTheft}
              ariaLabel="Toggle Anti-Theft Beacon"
            />
          </div>

          {/* Module 6: VPN Tunnel */}
          <div className="p-4 cyber-card flex items-start justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <div className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-slate-100">WireGuard VPN Tunnel</div>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {vpnConnected ? 'Connected via Zurich node' : 'Route all traffic via encrypted tunnel'}
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

      {/* ALL 10 SERVICES & DEFENSE CAPABILITIES LAUNCHER */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              Security & Defense Services Directory
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Direct access to all mobile protection modules, hardware gates, and sandboxes.
            </p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
            10 MODULES OPERATIONAL
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
              className="cyber-card p-5 cursor-pointer flex flex-col justify-between space-y-3 hover:border-slate-300 dark:hover:border-slate-600"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {srv.icon}
                  </div>
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    {srv.badge}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{srv.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {srv.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-[#4A5D73] dark:text-slate-300">
                <span>Open Module</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
