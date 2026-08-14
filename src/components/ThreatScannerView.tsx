import React, { useState, useEffect, useRef } from 'react';
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
  ArrowRight
} from 'lucide-react';
import { ThreatItem, SecuritySeverity } from '../types';
import { soundFx } from '../utils/audioSensors';

interface ThreatScannerViewProps {
  threats: ThreatItem[];
  onQuarantineThreat: (id: string) => void;
  onDeleteThreat: (id: string) => void;
  onRestoreThreat: (id: string) => void;
  onAddCustomThreat: (threat: ThreatItem) => void;
  isScanning: boolean;
  onTriggerScan: () => void;
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
  '/storage/emulated/0/Android/data/com.whatsapp/databases/msgstore.db.crypt14'
];

export const ThreatScannerView: React.FC<ThreatScannerViewProps> = ({
  threats,
  onQuarantineThreat,
  onDeleteThreat,
  onRestoreThreat,
  onAddCustomThreat,
  isScanning,
  onTriggerScan
}) => {
  const [scanProgress, setScanProgress] = useState(0);
  const [currentScanPath, setCurrentScanPath] = useState('');
  const [localScanning, setLocalScanning] = useState(false);
  const [scannedFilesCount, setScannedFilesCount] = useState(14892);
  const [selectedThreatDetail, setSelectedThreatDetail] = useState<ThreatItem | null>(null);
  const [sandboxFileName, setSandboxFileName] = useState('');
  const [sandboxResult, setSandboxResult] = useState<any | null>(null);
  const [isSandboxAnalyzing, setIsSandboxAnalyzing] = useState(false);

  // Scanning loop simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (localScanning || isScanning) {
      setScanProgress(0);
      let count = 0;
      interval = setInterval(() => {
        count += 4;
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setLocalScanning(false);
            soundFx.playShieldSecured();
            return 100;
          }
          const next = prev + 3;
          const pathIdx = Math.floor((next / 100) * SYSTEM_PATHS_TO_SCAN.length) % SYSTEM_PATHS_TO_SCAN.length;
          setCurrentScanPath(SYSTEM_PATHS_TO_SCAN[pathIdx]);
          setScannedFilesCount((f) => f + 18);
          if (next % 15 === 0) {
            soundFx.playRadarBeep();
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [localScanning, isScanning]);

  const handleStartScan = () => {
    setLocalScanning(true);
    soundFx.playRadarBeep();
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

  return (
    <div className="space-y-6">
      {/* Scanner Header & Control Center */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <ScanSearch className="w-4 h-4" /> Deep Heuristic Malcore Engine
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Antivirus & Malware Threat Scanner
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspects APK signatures, runtime process injection, root exploits, and dangerous permission abuse across all partitions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              disabled={localScanning}
              onClick={handleStartScan}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                localScanning
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${localScanning ? 'animate-spin' : ''}`} />
              <span>{localScanning ? 'Scanning In Progress...' : 'Start Deep System Scan'}</span>
            </button>
          </div>
        </div>

        {/* Live Scan Telemetry Progress */}
        {localScanning && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-cyan-500/40 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                Scanning: {currentScanPath}
              </span>
              <span className="text-white font-bold">{scanProgress}%</span>
            </div>

            {/* Cyber Progress Bar */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 h-full rounded-full transition-all duration-150"
                style={{ width: `${scanProgress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Files Checked: {scannedFilesCount.toLocaleString()}</span>
              <span>Memory Heap: 0 exploits</span>
              <span>Engine: Heuristic v2026.8</span>
            </div>
          </div>
        )}
      </div>

      {/* Threats & Quarantine Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Threats List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              Active System Threats ({activeThreats.length})
            </h3>
            <span className="text-xs font-mono text-slate-500">Real-time isolation ready</span>
          </div>

          {activeThreats.length === 0 ? (
            <div className="p-8 rounded-2xl cyber-card text-center space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h4 className="text-sm font-bold text-white">No Active Malware Detected</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Your system storage and active memory processes are clean. All APK packages match trusted vendor signatures.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeThreats.map((threat) => (
                <div
                  key={threat.id}
                  className="p-4 rounded-xl bg-slate-900/90 border border-rose-900/50 hover:border-rose-700/80 transition space-y-3"
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
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 shrink-0"
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
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/80 border border-amber-700 text-amber-300 text-xs font-semibold transition"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Quarantine</span>
                    </button>
                    <button
                      onClick={() => {
                        onDeleteThreat(threat.id);
                        soundFx.playShieldSecured();
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition shadow-md shadow-rose-950"
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
                <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2">
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
                      <div className="text-[11px] text-slate-400">Isolated at {threat.path}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          onRestoreThreat(threat.id);
                          soundFx.playClick(false);
                        }}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium"
                      >
                        Restore
                      </button>
                      <button
                        onClick={() => {
                          onDeleteThreat(threat.id);
                          soundFx.playShieldSecured();
                        }}
                        className="p-1.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-400 border border-rose-800"
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
          <div className="p-5 rounded-2xl cyber-card space-y-4">
            <div className="flex items-center gap-2 text-cyan-400">
              <FileCode className="w-4 h-4" />
              <h3 className="text-sm font-bold text-white">APK & Package Sandbox Analyzer</h3>
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
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs transition group"
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
                  className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-left text-xs transition group"
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
                    handleSandboxSimulate(file.name, file.name.toLowerCase().includes('mod') || file.name.toLowerCase().includes('free'));
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

      {/* Threat Detail Modal / Drawer */}
      {selectedThreatDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
                Threat IOCs & Technical Breakdown
              </h3>
              <button
                onClick={() => setSelectedThreatDetail(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-2 py-1 bg-slate-800 rounded"
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
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
              >
                Quarantine Now
              </button>
              <button
                onClick={() => {
                  onDeleteThreat(selectedThreatDetail.id);
                  setSelectedThreatDetail(null);
                  soundFx.playShieldSecured();
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
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
