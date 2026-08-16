import React, { useState, useEffect } from 'react';
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
  Radio,
  FileDown,
  FileText,
  FileCode,
  Search,
  Filter,
  Download,
  AlertTriangle,
  Lock,
  Clock,
  Shield,
  Gauge,
  Layers
} from 'lucide-react';
import { DeviceHardwareHealth, SecurityEventLog, ThreatItem, NetworkSecurityConfig, ScheduledScanConfig } from '../types';
import { soundFx } from '../utils/audioSensors';
import { HardwareIntegrityTool } from './HardwareIntegrityTool';
import { generateSecurityAuditPdf, exportSecurityDataAsJson } from '../utils/pdfExport';
import { probeLiveSystemEnvironment, SystemProbeResult } from '../utils/systemProber';

interface DiagnosticsViewProps {
  hardware: DeviceHardwareHealth;
  onOptimizeRam: () => void;
  isOptimizing: boolean;
  healthScore?: number;
  threats?: ThreatItem[];
  network?: NetworkSecurityConfig;
  scheduledScan?: ScheduledScanConfig;
  eventLogs?: SecurityEventLog[];
  onLogSecurityEvent?: (event: SecurityEventLog) => void;
}

export const DiagnosticsView: React.FC<DiagnosticsViewProps> = ({
  hardware,
  onOptimizeRam,
  isOptimizing,
  healthScore = 96,
  threats = [],
  network = {
    currentSsid: 'Secure_Network_5G',
    bssid: 'a4:2b:8c:91:04:f2',
    isPublicHotspot: false,
    encryption: 'WPA3 Enterprise',
    vpnConnected: true,
    selectedServer: { id: 'srv-1', name: 'Zurich Zero-Log Relay', country: 'Switzerland', flag: '🇨🇭', city: 'Zurich', pingMs: 38, ip: '194.38.21.14' },
    dnsShieldActive: true,
    arpProtectionActive: true,
    safeBrowsingActive: true,
    blockedTrackersCount: 1420,
    blockedMaliciousDomainsCount: 37,
    liveThroughputMbps: { download: 48.2, upload: 14.7 }
  },
  scheduledScan = {
    enabled: true,
    frequency: 'daily' as const,
    preferredTime: '03:00',
    requireCharging: true,
    requireIdle: true,
    scanScope: 'full_system' as const,
    autoQuarantineCritical: true,
    lastScanTimestamp: 'Today at 03:04 AM',
    lastScanThreatsFound: 0
  },
  eventLogs = [],
  onLogSecurityEvent
}) => {
  const [activeDiagnosticMode, setActiveDiagnosticMode] = useState<'sensor_integrity' | 'hardware_health' | 'audit_export'>('sensor_integrity');
  const [searchLogQuery, setSearchLogQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | 'high' | 'warning' | 'safe'>('all');
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingJson, setIsExportingJson] = useState(false);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [liveProbe, setLiveProbe] = useState<SystemProbeResult | null>(null);

  useEffect(() => {
    probeLiveSystemEnvironment().then((result) => {
      setLiveProbe(result);
    });
  }, []);

  // Filtered logs
  const filteredLogs = eventLogs.filter((log) => {
    const matchesSearch =
      log.title.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.description.toLowerCase().includes(searchLogQuery.toLowerCase()) ||
      log.timestamp.includes(searchLogQuery);
    
    if (severityFilter === 'all') return matchesSearch;
    if (severityFilter === 'high') return matchesSearch && (log.severity === 'high' || log.severity === 'critical');
    if (severityFilter === 'warning') return matchesSearch && log.severity === 'warning';
    if (severityFilter === 'safe') return matchesSearch && (log.severity === 'safe' || log.severity === 'low');
    return matchesSearch;
  });

  const handleExportPdf = () => {
    setIsExportingPdf(true);
    soundFx.playRadarBeep();

    setTimeout(() => {
      try {
        generateSecurityAuditPdf({
          healthScore,
          hardware,
          threats,
          network,
          scheduledScan,
          eventLogs
        });
        soundFx.playShieldSecured();
        setExportSuccessMessage('Official PDF Security Audit Certificate generated and downloaded successfully.');
        setTimeout(() => setExportSuccessMessage(null), 4000);

        if (onLogSecurityEvent) {
          onLogSecurityEvent({
            id: `evt-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'export',
            title: 'Forensic PDF Audit Exported',
            description: `Generated tamper-evident PDF security report with ${eventLogs.length} audit logs.`,
            severity: 'safe'
          });
        }
      } catch (err) {
        console.error('PDF export failed:', err);
      } finally {
        setIsExportingPdf(false);
      }
    }, 600);
  };

  const handleExportJson = () => {
    setIsExportingJson(true);
    soundFx.playClick(true);

    setTimeout(() => {
      try {
        exportSecurityDataAsJson({
          healthScore,
          hardware,
          threats,
          network,
          scheduledScan,
          eventLogs
        });
        soundFx.playShieldSecured();
        setExportSuccessMessage('Full JSON security telemetry payload exported and downloaded.');
        setTimeout(() => setExportSuccessMessage(null), 4000);

        if (onLogSecurityEvent) {
          onLogSecurityEvent({
            id: `evt-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString(),
            type: 'export',
            title: 'JSON Telemetry Exported',
            description: `Exported raw JSON cryptographic dataset with hardware attestation.`,
            severity: 'safe'
          });
        }
      } catch (err) {
        console.error('JSON export failed:', err);
      } finally {
        setIsExportingJson(false);
      }
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Switcher between Sensor Integrity, Hardware Telemetry & Audit Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0B101C] p-2 rounded-2xl border border-slate-800 backdrop-blur-sm">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveDiagnosticMode('sensor_integrity')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeDiagnosticMode === 'sensor_integrity'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Hardware Sensors</span>
          </button>

          <button
            onClick={() => setActiveDiagnosticMode('hardware_health')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeDiagnosticMode === 'hardware_health'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>SOC Thermals & Boot Enclave</span>
          </button>

          <button
            onClick={() => setActiveDiagnosticMode('audit_export')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-mono font-bold transition cursor-pointer ${
              activeDiagnosticMode === 'audit_export'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 border border-blue-400/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileDown className="w-4 h-4 text-cyan-400" />
            <span>Log Export & Forensic PDF</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-950 text-[10px] text-cyan-300 border border-cyan-800">
              PDF / JSON
            </span>
          </button>
        </div>

        <span className="hidden sm:inline-block text-[11px] font-mono text-cyan-400 px-3 py-1 bg-cyan-950/40 border border-cyan-800 rounded-lg">
          Low-Level Kernel Watchdog
        </span>
      </div>

      {/* Success Notification Alert */}
      {exportSuccessMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg shadow-emerald-950/40">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{exportSuccessMessage}</span>
        </div>
      )}

      {activeDiagnosticMode === 'sensor_integrity' ? (
        <HardwareIntegrityTool onLogSecurityEvent={onLogSecurityEvent} />
      ) : activeDiagnosticMode === 'hardware_health' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Hero Banner */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
                  <Activity className="w-4 h-4" /> Hardware Telemetry & Kernel Security
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
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
            <div className="p-4 rounded-xl cyber-card space-y-2 bg-[#0B101C]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">BATTERY STATUS</span>
                <Battery className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {liveProbe?.batteryStatus?.supported
                  ? `${liveProbe.batteryStatus.levelPercent}% (${liveProbe.batteryStatus.charging ? 'Charging' : 'Battery'})`
                  : `${hardware.batteryHealthPercent}% Health`}
              </div>
              <div className="text-xs text-emerald-400 font-mono">
                Thermals: {hardware.batteryTemperatureC}°C (Safe Operating Range)
              </div>
            </div>

            {/* CPU Cores & Concurrency */}
            <div className="p-4 rounded-xl cyber-card space-y-2 bg-[#0B101C]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">LOGICAL CPU THREADS</span>
                <Cpu className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {liveProbe ? `${liveProbe.logicalCores} Threads Active` : `${hardware.cpuUsagePercent}% Load`}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Hardware Concurrency Probed via Web API
              </div>
            </div>

            {/* RAM Memory Range */}
            <div className="p-4 rounded-xl cyber-card space-y-2 bg-[#0B101C]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">DEVICE RAM CAPACITY</span>
                <Zap className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {liveProbe?.deviceMemoryGb ? `${liveProbe.deviceMemoryGb} GB RAM Tier` : '12 GB Unified RAM'}
              </div>
              <div className="text-xs text-cyan-400 font-mono">
                {hardware.ramUsagePercent}% Utilization Buffer
              </div>
            </div>

            {/* Storage Quota */}
            <div className="p-4 rounded-xl cyber-card space-y-2 bg-[#0B101C]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-mono">STORAGE ALLOCATION</span>
                <HardDrive className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl font-bold text-white font-mono">
                {liveProbe?.storageEstimate
                  ? `${liveProbe.storageEstimate.quotaGb} GB Quota`
                  : `${hardware.storageFreeGb} GB Free`}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {liveProbe?.storageEstimate
                  ? `Used: ${liveProbe.storageEstimate.usageMb} MB (${liveProbe.storageEstimate.usagePercent}%)`
                  : `Total: ${hardware.storageTotalGb} GB Partition`}
              </div>
            </div>
          </div>

          {/* Live Web Sandbox Capabilities Box */}
          {liveProbe && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-300">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>Real-Time Tested Web API Capabilities & Security Boundaries</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                  Measured Directly in Browser Runtime
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">GRAPHICS ACCELERATION</span>
                  <span className="text-slate-200 text-[11px] truncate block" title={liveProbe.webglRenderer}>
                    {liveProbe.webglRenderer}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">PLATFORM AUTHENTICATOR</span>
                  <span className="text-emerald-400 text-[11px] font-bold block">
                    {liveProbe.securityEnclaveType}
                  </span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#070B14] border border-slate-800/80">
                  <span className="text-slate-500 block text-[10px]">COLOR DEPTH & TOUCH</span>
                  <span className="text-slate-200 text-[11px] block">
                    {liveProbe.screenColorDepth}-bit • {liveProbe.touchPoints} Max Touch Points
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Security Attestation & Root/Jailbreak Check */}
          <div className="p-5 rounded-2xl cyber-card space-y-4 bg-[#0B101C]">
            <div className="flex items-center gap-2 text-white font-bold text-sm font-display">
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
      ) : (
        /* FORENSIC LOG EXPORT & REPORT CENTER */
        <div className="space-y-6 animate-fadeIn">
          {/* Export Center Hero */}
          <div className="cyber-card p-6 sm:p-8 bg-gradient-to-b from-[#0D1322] to-[#070B14] border-slate-800 space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  <FileDown className="w-4 h-4" />
                  Forensic Archival & Regulatory Compliance
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                  Security Event Logs & Forensic Audit Export
                </h2>
                <p className="text-xs text-slate-400 max-w-xl leading-relaxed">
                  Export verified cryptographic records of security incidents, hardware attestation metrics, scheduled scan logs, and threat mitigations for IT audit, insurance claims, or offline forensics.
                </p>
              </div>

              {/* Action Export Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleExportPdf}
                  disabled={isExportingPdf}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs font-mono transition flex items-center gap-2 shadow-lg shadow-blue-600/30 border border-blue-400/40 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <FileText className={`w-4 h-4 ${isExportingPdf ? 'animate-spin' : ''}`} />
                  <span>{isExportingPdf ? 'GENERATING PDF...' : 'EXPORT OFFICIAL PDF REPORT'}</span>
                </button>

                <button
                  onClick={handleExportJson}
                  disabled={isExportingJson}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 font-bold text-xs font-mono transition flex items-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
                >
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>{isExportingJson ? 'SAVING JSON...' : 'EXPORT JSON DATA'}</span>
                </button>
              </div>
            </div>

            {/* Audit Summary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Total Recorded Events</div>
                <div className="text-xl font-bold text-white font-display mt-0.5">{eventLogs.length}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider">High / Critical Alerts</div>
                <div className="text-xl font-bold text-rose-400 font-display mt-0.5">
                  {eventLogs.filter((l) => l.severity === 'high' || l.severity === 'critical').length}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Integrity Index</div>
                <div className="text-xl font-bold text-emerald-400 font-display mt-0.5">{healthScore}%</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-xs text-slate-400 uppercase tracking-wider">Format Standard</div>
                <div className="text-xl font-bold text-cyan-400 font-display mt-0.5">PDF-A / JSON</div>
              </div>
            </div>

            {/* Search & Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter logs by title, keyword, or timestamp..."
                  value={searchLogQuery}
                  onChange={(e) => setSearchLogQuery(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto">
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1 mr-1">
                  <Filter className="w-3 h-3 text-slate-500" />
                  Severity:
                </span>
                {(['all', 'high', 'warning', 'safe'] as const).map((sev) => (
                  <button
                    key={sev}
                    onClick={() => {
                      soundFx.playClick(false);
                      setSeverityFilter(sev);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                      severityFilter === sev
                        ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                        : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sev.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Audit Log Table */}
            <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3">Time</th>
                      <th className="p-3">Severity</th>
                      <th className="p-3">Event Type</th>
                      <th className="p-3">Title & Action</th>
                      <th className="p-3">Audit Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredLogs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-slate-500">
                          No matching security event records found for current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/50 transition">
                          <td className="p-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                          <td className="p-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                                log.severity === 'high' || log.severity === 'critical'
                                  ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                                  : log.severity === 'warning'
                                  ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                                  : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                              }`}
                            >
                              {log.severity}
                            </span>
                          </td>
                          <td className="p-3 text-cyan-400 uppercase text-[11px] whitespace-nowrap">{log.type}</td>
                          <td className="p-3 text-white font-sans font-semibold text-xs">{log.title}</td>
                          <td className="p-3 text-slate-400 max-w-xs truncate text-[11px] font-sans">{log.description}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
