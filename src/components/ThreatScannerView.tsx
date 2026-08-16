import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ScanSearch,
  ShieldCheck,
  AlertTriangle,
  FileCode,
  Trash2,
  Lock,
  Unlock,
  CheckCircle2,
  Upload,
  Terminal,
  RefreshCw,
  FolderLock,
  Cpu,
  ArrowRight,
  Clock,
  BatteryCharging,
  Moon,
  Calendar,
  Sparkles,
  Zap,
  Sliders,
  Radio,
  FileText,
  AlertOctagon
} from 'lucide-react';
import { ThreatItem, SecuritySeverity, ScheduledScanConfig, SecurityEventLog } from '../types';
import { soundFx } from '../utils/audioSensors';
import { ToggleSwitch } from './ToggleSwitch';

interface ThreatScannerViewProps {
  threats: ThreatItem[];
  onQuarantineThreat: (id: string) => void;
  onDeleteThreat: (id: string) => void;
  onRestoreThreat: (id: string) => void;
  onAddCustomThreat: (threat: ThreatItem) => void;
  isScanning: boolean;
  onTriggerScan: () => void;
  scheduledScan: ScheduledScanConfig;
  onUpdateScheduledScan: (config: ScheduledScanConfig) => void;
  onLogSecurityEvent?: (event: SecurityEventLog) => void;
}

const SYSTEM_PATHS_TO_SCAN = [
  '/system/framework/framework.jar',
  '/system/bin/app_process64',
  '/data/app/com.free.flash.lighting-1/base.apk',
  '/data/app/com.free.flash.lighting-1/lib/arm64/libhook.so',
  '/data/data/com.sys.batteryoptimizer/files/.daemon',
  '/storage/emulated/0/Download/Modded_Game_Coins.apk',
  '/storage/emulated/0/DCIM/Camera/IMG_20260814.jpg',
  '/system/priv-app/SettingsProvider.apk',
  '/data/system/users/0/package-restrictions.xml',
  '/proc/sys/kernel/random/uuid',
  '/data/local/tmp/gdbserver',
  '/storage/emulated/0/Android/data/com.whatsapp/databases/msgstore.db.crypt14',
  '/data/dalvik-cache/arm64/system@framework@boot.art',
  '/vendor/lib64/hw/gatekeeper.default.so',
  '/data/misc/keystore/user_0/10023_USRCERT_bank_token'
];

const SCAN_STAGES = [
  { at: 0, text: 'INITIALIZING KERNEL MALCORE ENGINE...' },
  { at: 15, text: 'PARSING INSTALLED APK SIGNATURES...' },
  { at: 35, text: 'DISSECTING NATIVE .SO BINARIES & HOOKS...' },
  { at: 55, text: 'SCANNING DALVIK / ART RUNTIME BYTECODE...' },
  { at: 75, text: 'AUDITING ZERO-CLICK MEDIA PARSERS...' },
  { at: 90, text: 'CROSS-MATCHING IOC THREAT DATABASE...' },
  { at: 100, text: 'DEEP HEURISTIC SCAN COMPLETED' }
];

export const ThreatScannerView: React.FC<ThreatScannerViewProps> = ({
  threats,
  onQuarantineThreat,
  onDeleteThreat,
  onRestoreThreat,
  onAddCustomThreat,
  isScanning,
  onTriggerScan,
  scheduledScan,
  onUpdateScheduledScan,
  onLogSecurityEvent
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanPath, setCurrentScanPath] = useState(SYSTEM_PATHS_TO_SCAN[0]);
  const [localScanning, setLocalScanning] = useState(false);
  const [scannedFilesCount, setScannedFilesCount] = useState(14892);
  const [scannedAppsCount, setScannedAppsCount] = useState(84);
  const [selectedThreatDetail, setSelectedThreatDetail] = useState<ThreatItem | null>(null);
  const [sandboxFileName, setSandboxFileName] = useState('');
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);
  const [isSandboxAnalyzing, setIsSandboxAnalyzing] = useState(false);
  const [isSimulatingScheduled, setIsSimulatingScheduled] = useState(false);
  const [activeTabSubView, setActiveTabSubView] = useState<'realtime_scanner' | 'scheduled_settings'>('realtime_scanner');

  // Radial progress circumference parameters
  const ringRadius = 88;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const strokeDashoffset = ringCircumference - (scanProgress / 100) * ringCircumference;

  // Scanning loop simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (localScanning || isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLocalScanning(false);
            soundFx.playShieldSecured();

            if (onLogSecurityEvent) {
              onLogSecurityEvent({
                id: `evt-${Date.now()}`,
                timestamp: new Date().toLocaleTimeString(),
                type: 'scan',
                title: 'On-Demand Deep Scan Complete',
                description: `Audited 18,450 files and 84 APKs. 0 new rootkits detected.`,
                severity: 'safe'
              });
            }
            return 100;
          }

          const next = prev + 2;
          const pathIdx = Math.floor((next / 100) * SYSTEM_PATHS_TO_SCAN.length) % SYSTEM_PATHS_TO_SCAN.length;
          setCurrentScanPath(SYSTEM_PATHS_TO_SCAN[pathIdx]);
          setScannedFilesCount((f) => f + 24);

          if (next % 20 === 0) {
            soundFx.playRadarBeep();
          }
          return next;
        });
      }, 70);
    }
    return () => clearInterval(interval);
  }, [localScanning, isScanning, onLogSecurityEvent]);

  const handleStartScan = () => {
    setLocalScanning(true);
    soundFx.playRadarBeep();
  };

  // Simulate Scheduled Scan (Overnight Charging & Idle Mode)
  const handleSimulateScheduledExecution = () => {
    setIsSimulatingScheduled(true);
    soundFx.playRadarBeep();

    setTimeout(() => {
      setIsSimulatingScheduled(false);
      soundFx.playShieldSecured();
      const updatedConfig: ScheduledScanConfig = {
        ...scheduledScan,
        lastScanTimestamp: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Idle & Charging)`,
        lastScanThreatsFound: 0
      };
      onUpdateScheduledScan(updatedConfig);

      if (onLogSecurityEvent) {
        onLogSecurityEvent({
          id: `evt-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'scan',
          title: 'Automated Scheduled Scan Completed',
          description: `Executed scheduled ${scheduledScan.frequency} scan during device idle & charging state. Integrity verified.`,
          severity: 'safe'
        });
      }
    }, 2400);
  };

  const handleSandboxSimulate = (fileName: string, isMalicious: boolean) => {
    setSandboxFileName(fileName);
    setIsSandboxAnalyzing(true);
    soundFx.playRadarBeep();

    setTimeout(() => {
      setIsSandboxAnalyzing(false);
      if (isMalicious) {
        soundFx.playThreatAlert();
        const newThreat: ThreatItem = {
          id: `thr-${Date.now()}`,
          name: `Trojan.Android.${fileName.replace('.apk', '')}.Dropper`,
          type: 'Trojan',
          severity: 'critical',
          description: 'Sandbox analysis detected dynamic code loading (DexClassLoader) targeting banking API endpoints.',
          path: `/storage/emulated/0/Download/${fileName}`,
          packageName: `com.untrusted.${fileName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}`,
          detectedAt: 'Just now (Sandbox Heuristic)',
          status: 'active',
          indicators: [
            'Dynamic DexClassLoader unpacks encrypted payload at runtime',
            'Requests BIND_ACCESSIBILITY_SERVICE and RECEIVE_SMS',
            'C2 Host: https://command-node-889.top/beacon'
          ],
          recommendedAction: 'Quarantine immediately and block background network access.',
          sha256: 'a6c8e9821d3fbc910283c7482910fedcba819203948571029384756102938475'
        };
        onAddCustomThreat(newThreat);
        setSandboxResult({
          safe: false,
          score: 96,
          threatName: newThreat.name,
          details: 'Malicious payload confirmed by behavioral sandbox emulation.'
        });
      } else {
        soundFx.playShieldSecured();
        setSandboxResult({
          safe: true,
          score: 4,
          threatName: 'Clean Package',
          details: 'Signed with valid SHA-256 certificate. No suspicious dynamic reflection or illicit permissions found.'
        });
      }
    }, 1800);
  };

  const activeThreats = threats.filter((t) => t.status === 'active');
  const quarantinedThreats = threats.filter((t) => t.status === 'quarantined');

  // Find current stage text
  const currentStageText =
    SCAN_STAGES.slice()
      .reverse()
      .find((s) => scanProgress >= s.at)?.text || 'SCANNING...';

  return (
    <div className="space-y-6">
      {/* Top Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B101C] p-2 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTabSubView('realtime_scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeTabSubView === 'realtime_scanner'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanSearch className="w-4 h-4" />
            <span>Real-Time Radial Threat Scanner</span>
          </button>

          <button
            onClick={() => setActiveTabSubView('scheduled_settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeTabSubView === 'scheduled_settings'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Scheduled Smart Scan Engine</span>
            {scheduledScan.enabled && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-1 bg-slate-900/90 rounded-lg border border-slate-800">
          <BatteryCharging className="w-3.5 h-3.5 text-amber-400" />
          <span>Auto-Scan: {scheduledScan.enabled ? `${scheduledScan.frequency.toUpperCase()} • ${scheduledScan.preferredTime}` : 'DISABLED'}</span>
        </div>
      </div>

      {activeTabSubView === 'scheduled_settings' ? (
        /* SCHEDULED SCAN CONFIGURATION VIEW */
        <div className="space-y-6 animate-fadeIn">
          <div className="cyber-card p-6 sm:p-8 bg-gradient-to-b from-[#0D1322] to-[#070B14] border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <Clock className="w-4 h-4" />
                  Automated Background Threat Scheduling
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Scheduled Smart Scan (Idle & Charging)
                </h2>
                <p className="text-xs text-slate-400 max-w-xl">
                  Automatically launches deep heuristic malware analysis when your device is safely docked on charger and idle overnight. Zero battery drain during active usage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-300 font-semibold">
                  {scheduledScan.enabled ? 'AUTOMATED SCANNING ARMED' : 'DISABLED'}
                </span>
                <ToggleSwitch
                  checked={scheduledScan.enabled}
                  onChange={() => {
                    soundFx.playClick(true);
                    onUpdateScheduledScan({
                      ...scheduledScan,
                      enabled: !scheduledScan.enabled
                    });
                  }}
                  ariaLabel="Toggle scheduled scans"
                />
              </div>
            </div>

            {/* Scheduled Configuration Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Frequency & Preferred Window */}
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    Scan Frequency
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['daily', 'every_3_days', 'weekly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => {
                          soundFx.playClick(false);
                          onUpdateScheduledScan({ ...scheduledScan, frequency: freq });
                        }}
                        className={`py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                          scheduledScan.frequency === freq
                            ? 'bg-blue-600 text-white border-blue-400 shadow-md shadow-blue-600/30'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {freq === 'daily' ? 'DAILY' : freq === 'every_3_days' ? 'EVERY 3 DAYS' : 'WEEKLY'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Preferred Overnight Execution Time
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['02:00', '03:00', '04:30'].map((time) => (
                      <button
                        key={time}
                        onClick={() => {
                          soundFx.playClick(false);
                          onUpdateScheduledScan({ ...scheduledScan, preferredTime: time });
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                          scheduledScan.preferredTime === time
                            ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/30'
                            : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {time} AM (Overnight)
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 font-bold">
                    <Sliders className="w-3.5 h-3.5 text-purple-400" />
                    Inspection Scope & Depth
                  </label>
                  <select
                    value={scheduledScan.scanScope}
                    onChange={(e) => {
                      soundFx.playClick(false);
                      onUpdateScheduledScan({
                        ...scheduledScan,
                        scanScope: e.target.value as any
                      });
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="full_system">Full Deep Storage & Kernel Signature Scan (Recommended)</option>
                    <option value="quick_heuristic">Quick Memory Heap & APK Permissions Only</option>
                    <option value="zero_click_memory">Zero-Click Exploit & Sandbox Memory Dump</option>
                  </select>
                </div>
              </div>

              {/* Right Column: Hardware Guard Conditions */}
              <div className="space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
                  Zero-Impact Execution Locks:
                </h4>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                      <BatteryCharging className="w-4 h-4 text-emerald-400" />
                      <span>Require Device Connected to Power</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Prevents scan initiation if battery is not actively charging via AC adapter or Qi pad.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={scheduledScan.requireCharging}
                    onChange={() => {
                      onUpdateScheduledScan({
                        ...scheduledScan,
                        requireCharging: !scheduledScan.requireCharging
                      });
                    }}
                    ariaLabel="Toggle charging requirement"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>Require Device Idle (Screen Locked)</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Waits until the screen has been locked for at least 15 minutes with no active foreground apps.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={scheduledScan.requireIdle}
                    onChange={() => {
                      onUpdateScheduledScan({
                        ...scheduledScan,
                        requireIdle: !scheduledScan.requireIdle
                      });
                    }}
                    ariaLabel="Toggle idle requirement"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                      <Lock className="w-4 h-4 text-rose-400" />
                      <span>Auto-Quarantine Critical Threats</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Instantly revokes execution rights and isolates discovered trojans or rootkits without waiting for user approval.
                    </p>
                  </div>
                  <ToggleSwitch
                    checked={scheduledScan.autoQuarantineCritical}
                    onChange={() => {
                      onUpdateScheduledScan({
                        ...scheduledScan,
                        autoQuarantineCritical: !scheduledScan.autoQuarantineCritical
                      });
                    }}
                    ariaLabel="Toggle auto quarantine"
                  />
                </div>
              </div>
            </div>

            {/* Scheduled Status Bar & Test Run Simulator */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-0.5 font-mono text-xs">
                <div className="text-slate-400">
                  Last Automated Execution:{' '}
                  <span className="text-white font-bold">{scheduledScan.lastScanTimestamp || 'Pending first window'}</span>
                </div>
                <div className="text-emerald-400 text-[11px]">
                  ✓ WorkManager background task registered • Next scan at {scheduledScan.preferredTime} AM
                </div>
              </div>

              <button
                onClick={handleSimulateScheduledExecution}
                disabled={isSimulatingScheduled}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs font-mono transition flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20 disabled:opacity-50"
              >
                <Zap className={`w-3.5 h-3.5 text-amber-300 ${isSimulatingScheduled ? 'animate-spin' : ''}`} />
                <span>{isSimulatingScheduled ? 'EXECUTING IDLE AUDIT...' : 'TEST SCHEDULED EXECUTION'}</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* REAL-TIME SCANNER VIEW WITH RADIAL PROGRESS RING */
        <div className="space-y-6 animate-fadeIn">
          {/* Main Radial Scanner Interactive Hero */}
          <div className="cyber-card p-6 sm:p-8 bg-gradient-to-b from-[#0D1322] to-[#070B14] border-slate-800 relative overflow-hidden shadow-2xl">
            {/* Cyber Grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
              {/* Left Side: Scanner Info & Trigger */}
              <div className="space-y-4 text-center lg:text-left max-w-lg">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800">
                  <ScanSearch className="w-3.5 h-3.5" />
                  <span>Deep Heuristic Malcore Engine v2026.8</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                  System Threat Scanner
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Performs deep signature matching, root exploit identification, DEX bytecode disassembly, and zero-click memory parsing across all storage volumes.
                </p>

                {/* Quick Hardware Stats */}
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-sm sm:text-base font-bold text-white">{scannedFilesCount.toLocaleString()}</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Files Audited</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-sm sm:text-base font-bold text-cyan-400">{scannedAppsCount} APKS</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Apps Verified</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div className="text-sm sm:text-base font-bold text-emerald-400">0 ROOTKITS</div>
                    <div className="text-[9px] uppercase tracking-wider text-slate-400">Kernel Safe</div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
                  <button
                    disabled={localScanning}
                    onClick={handleStartScan}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs sm:text-sm transition-all font-mono cursor-pointer shadow-lg active:scale-95 ${
                      localScanning
                        ? 'bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-600/30 border border-blue-400/50'
                    }`}
                  >
                    <RefreshCw className={`w-4 h-4 ${localScanning ? 'animate-spin' : ''}`} />
                    <span>{localScanning ? 'AUDITING SYSTEM...' : 'START DEEP SYSTEM SCAN'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTabSubView('scheduled_settings')}
                    className="px-4 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-mono font-bold transition flex items-center gap-2 cursor-pointer"
                  >
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SCHEDULE OVERNIGHT</span>
                  </button>
                </div>
              </div>

              {/* Right Side: HIGH-PRECISION RADIAL PROGRESS RING */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  {/* Subtle Background Glow Ring */}
                  <div
                    className={`absolute inset-0 rounded-full transition-all duration-300 ${
                      localScanning
                        ? 'bg-blue-500/10 blur-xl animate-pulse'
                        : 'bg-cyan-500/5 blur-lg'
                    }`}
                  />

                  {/* SVG Radial Ring */}
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
                    <defs>
                      <linearGradient id="radialScanGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06B6D4" />
                        <stop offset="50%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#6366F1" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* Background Track Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ringRadius}
                      className="stroke-slate-800/80"
                      strokeWidth="10"
                      fill="transparent"
                    />

                    {/* Active Animated Radial Ring */}
                    <circle
                      cx="100"
                      cy="100"
                      r={ringRadius}
                      stroke="url(#radialScanGrad)"
                      strokeWidth="10"
                      fill="transparent"
                      strokeLinecap="round"
                      strokeDasharray={ringCircumference}
                      style={{
                        strokeDashoffset,
                        transition: 'stroke-dashoffset 0.2s ease-out'
                      }}
                      filter="url(#glow)"
                    />
                  </svg>

                  {/* Center Radial Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    {localScanning ? (
                      <div className="space-y-1">
                        <span className="text-4xl sm:text-5xl font-extrabold text-white font-display tracking-tight drop-shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                          {scanProgress}
                          <span className="text-xl font-mono text-cyan-400 font-light ml-0.5">%</span>
                        </span>
                        <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-300 animate-pulse">
                          {scanProgress < 100 ? 'HEURISTIC SCAN' : 'SCAN COMPLETE'}
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 max-w-[150px] truncate mx-auto">
                          {currentScanPath.split('/').pop()}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/40 flex items-center justify-center text-blue-400 mx-auto mb-1 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <span className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                          {activeThreats.length === 0 ? 'SECURE' : `${activeThreats.length} ALERTS`}
                        </span>
                        <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">
                          {activeThreats.length === 0 ? 'SYSTEM CERTIFIED' : 'ACTION REQUIRED'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Status Bar Below Ring */}
                {localScanning && (
                  <div className="mt-3 text-center space-y-1">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {currentStageText}
                    </span>
                    <p className="text-[10px] font-mono text-slate-400 max-w-xs truncate">
                      {currentScanPath}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Threats & Quarantine Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Threats List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 font-display">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  Active System Threats ({activeThreats.length})
                </h3>
                <span className="text-xs font-mono text-slate-500">Real-time isolation ready</span>
              </div>

              {activeThreats.length === 0 ? (
                <div className="p-8 rounded-2xl cyber-card text-center space-y-2 bg-[#0B101C]">
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white font-display">No Active Malware Detected</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Your system storage and active memory processes are clean. All APK packages match trusted vendor signatures.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeThreats.map((threat) => (
                    <div
                      key={threat.id}
                      className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/50 hover:border-rose-700/80 transition space-y-3 shadow-lg shadow-rose-950/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-rose-950 text-rose-300 border border-rose-800">
                              {threat.severity}
                            </span>
                            <span className="text-xs font-mono text-cyan-400">{threat.type}</span>
                            <span className="text-xs text-slate-500 font-mono">• {threat.detectedAt}</span>
                          </div>
                          <h4 className="text-sm font-bold text-white font-mono">{threat.name}</h4>
                          <p className="text-xs text-slate-300">{threat.description}</p>
                        </div>

                        <button
                          onClick={() => {
                            setSelectedThreatDetail(threat);
                            soundFx.playClick(false);
                          }}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0 cursor-pointer"
                        >
                          Inspect IOCs
                        </button>
                      </div>

                      <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 font-mono text-[11px] text-slate-400 truncate">
                        Path: <span className="text-rose-300">{threat.path}</span>
                      </div>

                      {/* Remediation Action Buttons */}
                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          onClick={() => {
                            onQuarantineThreat(threat.id);
                            soundFx.playClick(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/80 border border-amber-700 text-amber-300 text-xs font-semibold transition cursor-pointer"
                        >
                          <Lock className="w-3.5 h-3.5" />
                          <span>Quarantine</span>
                        </button>
                        <button
                          onClick={() => {
                            onDeleteThreat(threat.id);
                            soundFx.playShieldSecured();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-md shadow-rose-950 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete & Clean</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quarantined Vault Items */}
              {quarantinedThreats.length > 0 && (
                <div className="pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 font-display">
                      <FolderLock className="w-3.5 h-3.5 text-amber-400" />
                      Isolated in Quarantine ({quarantinedThreats.length})
                    </h3>
                    <span className="text-[11px] font-mono text-slate-500">Disabled execution hooks</span>
                  </div>

                  <div className="space-y-2">
                    {quarantinedThreats.map((threat) => (
                      <div
                        key={threat.id}
                        className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-slate-200 font-mono">{threat.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono">Isolated at {threat.path}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              onRestoreThreat(threat.id);
                              soundFx.playClick(false);
                            }}
                            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium cursor-pointer"
                          >
                            Restore
                          </button>
                          <button
                            onClick={() => {
                              onDeleteThreat(threat.id);
                              soundFx.playShieldSecured();
                            }}
                            className="p-1.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-800 cursor-pointer"
                            title="Purge permanently"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* APK & Sandbox File Analyzer */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl cyber-card space-y-4 bg-[#0B101C]">
                <div className="flex items-center gap-2 text-cyan-400">
                  <FileCode className="w-4 h-4" />
                  <h3 className="text-sm font-bold text-white font-display">APK & Package Sandbox Analyzer</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Test suspicious sideloaded packages in an isolated virtual container before installing on device.
                </p>

                {/* Test Sample Packages */}
                <div className="space-y-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Analyze Preloaded Suspicious Packages:
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    <button
                      onClick={() => handleSandboxSimulate('CryptoWallet_Free_AirDrop_v4.apk', true)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition group cursor-pointer"
                    >
                      <span className="font-mono text-rose-300 group-hover:text-white">
                        📦 CryptoWallet_Free_AirDrop_v4.apk
                      </span>
                      <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-900">
                        Test Payload
                      </span>
                    </button>

                    <button
                      onClick={() => handleSandboxSimulate('Signal_Secure_Messenger_v7.apk', false)}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition group cursor-pointer"
                    >
                      <span className="font-mono text-emerald-300 group-hover:text-white">
                        📦 Signal_Secure_Messenger_v7.apk
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-900">
                        Test Clean
                      </span>
                    </button>
                  </div>
                </div>

                {/* Drag and Drop Simulator */}
                <div className="border-2 border-dashed border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 text-center space-y-2 transition cursor-pointer">
                  <Upload className="w-6 h-6 text-slate-500 mx-auto" />
                  <div className="text-xs text-slate-300 font-medium">
                    Upload or Drop any APK / Script to analyze
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    id="sandbox-file-input"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleSandboxSimulate(
                          file.name,
                          file.name.toLowerCase().includes('mod') || file.name.toLowerCase().includes('free')
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor="sandbox-file-input"
                    className="inline-block px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono cursor-pointer"
                  >
                    Browse APK / File
                  </label>
                </div>

                {/* Sandbox Analysis Result Display */}
                {isSandboxAnalyzing && (
                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/50 flex items-center gap-3 text-xs font-mono text-cyan-300 animate-pulse">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Decompiling bytecode & inspecting AndroidManifest.xml...</span>
                  </div>
                )}

                {sandboxResult && !isSandboxAnalyzing && (
                  <div
                    className={`p-3.5 rounded-xl border space-y-1.5 text-xs font-mono ${
                      sandboxResult.safe
                        ? 'bg-emerald-950/40 border-emerald-700 text-emerald-300'
                        : 'bg-rose-950/40 border-rose-700 text-rose-300'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span>{sandboxFileName}</span>
                      <span>Risk Score: {sandboxResult.score}/100</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-sans">{sandboxResult.details}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Threat Detail Modal / Drawer */}
      {selectedThreatDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-[#0B101C] border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Threat IOCs & Technical Breakdown
              </h3>
              <button
                onClick={() => setSelectedThreatDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-800 rounded cursor-pointer"
              >
                CLOSE
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 font-mono">Threat Name: </span>
                <span className="font-bold text-rose-400 font-mono">{selectedThreatDetail.name}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">Location: </span>
                <span className="font-mono text-slate-300 break-all">{selectedThreatDetail.path}</span>
              </div>
              <div>
                <span className="text-slate-400 font-mono">SHA-256 Checksum: </span>
                <span className="font-mono text-[10px] text-cyan-300 break-all">{selectedThreatDetail.sha256}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-mono font-bold text-slate-300">
                Observed Indicators of Compromise:
              </span>
              <ul className="space-y-1 text-xs text-slate-400 list-disc list-inside">
                {selectedThreatDetail.indicators.map((ind, i) => (
                  <li key={i} className="text-rose-200">{ind}</li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
              <strong className="text-cyan-400 font-mono">Recommended Action: </strong>
              {selectedThreatDetail.recommendedAction}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  onQuarantineThreat(selectedThreatDetail.id);
                  setSelectedThreatDetail(null);
                  soundFx.playClick(true);
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer"
              >
                Quarantine Now
              </button>
              <button
                onClick={() => {
                  onDeleteThreat(selectedThreatDetail.id);
                  setSelectedThreatDetail(null);
                  soundFx.playShieldSecured();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold cursor-pointer"
              >
                Delete Threat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
