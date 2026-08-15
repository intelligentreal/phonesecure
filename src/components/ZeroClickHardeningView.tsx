import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Cpu,
  Layers,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Radio,
  Lock,
  Smartphone,
  Eye,
  KeyRound,
  FileWarning,
  Power,
  RotateCcw,
  Sparkles,
  Download,
  Share2,
  ChevronRight,
  Zap
} from 'lucide-react';
import {
  ThreatIntelligenceVector,
  AppPermissionDeepAudit,
  MediaFrameworkHardeningStatus,
  ZeroClickHygieneMetrics,
  ThreatTierLevel
} from '../types/hardening';
import {
  INITIAL_THREAT_VECTORS,
  INITIAL_APP_PERMISSIONS_AUDIT,
  INITIAL_MEDIA_HARDENING,
  INITIAL_HYGIENE_METRICS
} from '../data/hardeningData';
import { soundFx } from '../utils/audioSensors';
import { ToggleSwitch } from './ToggleSwitch';

interface ZeroClickHardeningViewProps {
  onTriggerRebootSimulation?: () => void;
}

export const ZeroClickHardeningView: React.FC<ZeroClickHardeningViewProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'matrix' | 'accessibility' | 'media_hardening' | 'memory_hygiene'>('matrix');
  const [threatVectors, setThreatVectors] = useState<ThreatIntelligenceVector[]>(INITIAL_THREAT_VECTORS);
  const [appAudits, setAppAudits] = useState<AppPermissionDeepAudit[]>(INITIAL_APP_PERMISSIONS_AUDIT);
  const [mediaSettings, setMediaSettings] = useState<MediaFrameworkHardeningStatus[]>(INITIAL_MEDIA_HARDENING);
  const [hygiene, setHygiene] = useState<ZeroClickHygieneMetrics>(INITIAL_HYGIENE_METRICS);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');
  const [notification, setNotification] = useState<string | null>(null);
  const [isRebooting, setIsRebooting] = useState(false);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleRevokeDangerousPermission = (packageName: string, permissionName: 'accessibility' | 'notification' | 'overlay') => {
    soundFx.playThreatAlert();
    setAppAudits((prev) =>
      prev.map((app) => {
        if (app.packageName === packageName) {
          const updated = { ...app };
          if (permissionName === 'accessibility') updated.hasAccessibilityAccess = false;
          if (permissionName === 'notification') updated.hasNotificationListenerAccess = false;
          if (permissionName === 'overlay') updated.hasSystemAlertWindow = false;

          // Re-evaluate risk score
          if (!updated.hasAccessibilityAccess && !updated.hasNotificationListenerAccess && !updated.hasSystemAlertWindow) {
            updated.threatAssessment = 'SAFE';
            updated.riskScore = Math.min(10, updated.riskScore);
          } else if (!updated.hasAccessibilityAccess) {
            updated.threatAssessment = 'SUSPICIOUS_OVERLAY';
            updated.riskScore = 50;
          }
          return updated;
        }
        return app;
      })
    );
    showToast(`Revoked ${permissionName.toUpperCase()} privilege from ${packageName}`);
  };

  const handleToggleMediaHardening = (appName: string, key: 'linkPreviewsDisabled' | 'mediaAutoDownloadDisabled') => {
    soundFx.playClick(true);
    setMediaSettings((prev) =>
      prev.map((m) => {
        if (m.app === appName) {
          const updated = { ...m, [key]: !m[key] };
          updated.stagefrightMitigationActive = updated.linkPreviewsDisabled && updated.mediaAutoDownloadDisabled;
          return updated;
        }
        return m;
      })
    );
    showToast(`Updated zero-click defense posture for ${appName}`);
  };

  const handleSimulateHardReboot = () => {
    setIsRebooting(true);
    soundFx.playRadarBeep();
    setTimeout(() => {
      setHygiene({
        uptimeHours: 0.1,
        lastColdRebootTimestamp: 'Just now (Memory Purged)',
        memoryVolatilityScore: 98,
        pendingHardRebootRecommended: false,
        sideloadingBlocked: true,
        usbDebuggingDisabled: true,
        selinuxEnforcing: true,
        playProtectActive: true
      });
      setIsRebooting(false);
      soundFx.playShieldSecured();
      showToast('Volatile RAM Purged. Non-persistent zero-click memory implants cleared.');
    }, 1800);
  };

  const filteredVectors = threatVectors.filter((v) => {
    if (selectedTierFilter === 'ALL') return true;
    return v.tier === selectedTierFilter;
  });

  const highRiskAppsCount = appAudits.filter((a) => a.threatAssessment === 'CRITICAL_KEYLOGGER_RISK').length;
  const unhardenedChatAppsCount = mediaSettings.filter((m) => !m.stagefrightMitigationActive).length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 relative overflow-hidden backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-rose-600/10 border border-rose-500/30 text-rose-400">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl font-bold text-white font-mono tracking-tight">
                  ZERO-CLICK SPYWARE & HARDENING DEFENSE
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  PEGASUS & STAGEFRIGHT SHIELD
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Multi-Tier Android Defense • Accessibility Hijack Guard • RAM Volatility Hygiene • Stagefright Auto-Blocker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={handleSimulateHardReboot}
              disabled={isRebooting}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-rose-900/20 disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRebooting ? 'animate-spin' : ''}`} />
              {isRebooting ? 'Purging RAM...' : 'Hard Reboot (Flush RAM)'}
            </button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => setActiveSubTab('matrix')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'matrix'
                ? 'bg-rose-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Threat Tier Matrix ({threatVectors.length})
          </button>
          <button
            onClick={() => setActiveSubTab('accessibility')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'accessibility'
                ? 'bg-rose-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            Accessibility & OTP Guard {highRiskAppsCount > 0 && <span className="bg-rose-500 text-white px-1.5 py-0.2 rounded-full text-[9px]">{highRiskAppsCount}</span>}
          </button>
          <button
            onClick={() => setActiveSubTab('media_hardening')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'media_hardening'
                ? 'bg-rose-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Messaging & Stagefright Hardening {unhardenedChatAppsCount > 0 && <span className="bg-amber-500 text-black px-1.5 py-0.2 rounded-full text-[9px] font-bold">{unhardenedChatAppsCount}</span>}
          </button>
          <button
            onClick={() => setActiveSubTab('memory_hygiene')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeSubTab === 'memory_hygiene'
                ? 'bg-rose-600 text-white font-semibold shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Volatile RAM Hygiene ({hygiene.memoryVolatilityScore}%)
          </button>
        </div>
      </div>

      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono px-4 py-2.5 rounded-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-rose-400" />
          {notification}
        </motion.div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Tier 4 Mercenary APTs</div>
                <div className="text-2xl font-bold text-rose-400 mt-1 font-mono">Pegasus / Predator</div>
                <div className="text-[10px] text-emerald-400 mt-1">Stagefright Isolated</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Tier 3 Banking Trojans</div>
                <div className="text-2xl font-bold text-amber-400 mt-1 font-mono">SharkBot / Xenomorph</div>
                <div className="text-[10px] text-amber-500 mt-1">{highRiskAppsCount} Flagged App(s)</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Tier 2 Baseband Stingray</div>
                <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">IMSI / 2G Cipher</div>
                <div className="text-[10px] text-blue-400 mt-1">Active Ciphers Monitored</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Volatile RAM Uptime</div>
                <div className="text-2xl font-bold text-slate-200 mt-1 font-mono">{hygiene.uptimeHours.toFixed(1)} hrs</div>
                <div className={`text-[10px] mt-1 ${hygiene.pendingHardRebootRecommended ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {hygiene.pendingHardRebootRecommended ? 'Reboot Recommended' : 'RAM Sanitized'}
                </div>
              </div>
            </div>

            {/* Exploit Kill Chain Visualizer */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
              <h3 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider mb-4 flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-400" />
                Zero-Click Exploit Path & Automatic Interception Layer
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold">STAGE 1</span>
                    <div className="text-white font-bold mt-1">Weaponized VoIP / Media</div>
                    <p className="text-[11px] text-slate-400 mt-1">Silent malformed call/image packet before notification</p>
                  </div>
                  <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Mitigation: Media Auto-Download Lock
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold">STAGE 2</span>
                    <div className="text-white font-bold mt-1">Silent RAM Overflow</div>
                    <p className="text-[11px] text-slate-400 mt-1">Stagefright / libwebp decoder memory corruption</p>
                  </div>
                  <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Mitigation: 24h Cold Power Cycle
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold">STAGE 3</span>
                    <div className="text-white font-bold mt-1">Kernel Privilege LPE</div>
                    <p className="text-[11px] text-slate-400 mt-1">Escape sandbox and seize master root permissions</p>
                  </div>
                  <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Mitigation: SELinux & ADB Guard
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold">STAGE 4</span>
                    <div className="text-white font-bold mt-1">Accessibility Abuse</div>
                    <p className="text-[11px] text-slate-400 mt-1">Invisibly logs keystrokes and reads bank balance</p>
                  </div>
                  <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Mitigation: BIND_ACCESSIBILITY Auditor
                  </div>
                </div>

                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-rose-400 font-bold">STAGE 5</span>
                    <div className="text-white font-bold mt-1">OTP Scrape & Exfil</div>
                    <p className="text-[11px] text-slate-400 mt-1">Intercepts SMS 2FA code and deletes incoming text</p>
                  </div>
                  <div className="mt-3 text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                    Mitigation: Notification Guard & DNA
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-mono">
                <Sliders className="w-3 h-3" /> Filter by Threat Tier:
              </span>
              {[
                { id: 'ALL', label: 'All Threat Tiers' },
                { id: 'TIER_4_MERCENARY_ZEROCLICK', label: 'Tier 4 (Pegasus / Zero-Click)' },
                { id: 'TIER_3_BANKING_ACCESSIBILITY', label: 'Tier 3 (Accessibility / OTP)' },
                { id: 'TIER_2_CELLULAR_HARDWARE', label: 'Tier 2 (IMSI / Baseband)' },
                { id: 'TIER_1_OPPORTUNISTIC', label: 'Tier 1 (Smishing / Phishing)' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => setSelectedTierFilter(tier.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                    selectedTierFilter === tier.id
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>

            {/* Threat Vector Deep Dossiers */}
            <div className="space-y-3 font-mono text-xs">
              {filteredVectors.map((vec) => (
                <div
                  key={vec.id}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                        {vec.id}
                      </span>
                      <h4 className="text-sm font-bold text-slate-100">{vec.name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {vec.targetFramework}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          vec.mitigationStatus === 'HARDENED'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {vec.mitigationStatus}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed">{vec.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800/60">
                    <div>
                      <span className="text-slate-500">Active Threat Actors:</span>{' '}
                      <span className="text-rose-300">{vec.activeThreatActors.join(', ')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500">CVE Signatures:</span>{' '}
                      <span className="text-blue-300">{vec.cveReferences.join(', ')}</span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-[11px]">
                      <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="text-slate-300">{vec.remediationAction}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'accessibility' && (
          <motion.div
            key="accessibility"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4 font-mono"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-rose-400" />
                Accessibility & Sensitive API Exfiltration Watchdog
              </h3>
              <p className="text-slate-400 text-xs">
                Scans all installed applications for dangerous screen-reading (<code className="text-rose-300">BIND_ACCESSIBILITY_SERVICE</code>), notification scraping (<code className="text-amber-300">NotificationListenerService</code>), and banking overlay permissions.
              </p>
            </div>

            <div className="space-y-3">
              {appAudits.map((app) => (
                <div
                  key={app.packageName}
                  className={`bg-slate-900/40 border rounded-2xl p-5 backdrop-blur-sm space-y-4 transition-all ${
                    app.threatAssessment === 'CRITICAL_KEYLOGGER_RISK'
                      ? 'border-rose-500/40 bg-rose-950/10'
                      : app.threatAssessment === 'SUSPICIOUS_OVERLAY'
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{app.appName}</span>
                        <span className="text-[10px] text-slate-500 px-2 py-0.2 rounded bg-slate-800">
                          {app.packageName}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{app.appCategory}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-500">RISK INDEX</div>
                        <div
                          className={`text-lg font-bold ${
                            app.riskScore >= 75
                              ? 'text-rose-400'
                              : app.riskScore >= 40
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {app.riskScore} / 100
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-xl border ${
                          app.threatAssessment === 'CRITICAL_KEYLOGGER_RISK'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : app.threatAssessment === 'SUSPICIOUS_OVERLAY'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {app.threatAssessment}
                      </span>
                    </div>
                  </div>

                  {/* Permissions Granted & Quick Revoke Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-slate-400 text-[10px]">ACCESSIBILITY SERVICE</div>
                        <div className={`font-bold mt-0.5 ${app.hasAccessibilityAccess ? 'text-rose-400' : 'text-slate-500'}`}>
                          {app.hasAccessibilityAccess ? 'ACTIVE (Keylogger Risk)' : 'REVOKED / SAFE'}
                        </div>
                      </div>
                      {app.hasAccessibilityAccess && (
                        <button
                          onClick={() => handleRevokeDangerousPermission(app.packageName, 'accessibility')}
                          className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-slate-400 text-[10px]">NOTIFICATION LISTENER</div>
                        <div className={`font-bold mt-0.5 ${app.hasNotificationListenerAccess ? 'text-amber-400' : 'text-slate-500'}`}>
                          {app.hasNotificationListenerAccess ? 'ACTIVE (2FA OTP Risk)' : 'REVOKED / SAFE'}
                        </div>
                      </div>
                      {app.hasNotificationListenerAccess && (
                        <button
                          onClick={() => handleRevokeDangerousPermission(app.packageName, 'notification')}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex items-center justify-between">
                      <div>
                        <div className="text-slate-400 text-[10px]">SYSTEM OVERLAY (DRAW OVER)</div>
                        <div className={`font-bold mt-0.5 ${app.hasSystemAlertWindow ? 'text-amber-400' : 'text-slate-500'}`}>
                          {app.hasSystemAlertWindow ? 'ACTIVE (Fake Bank Screen)' : 'REVOKED / SAFE'}
                        </div>
                      </div>
                      {app.hasSystemAlertWindow && (
                        <button
                          onClick={() => handleRevokeDangerousPermission(app.packageName, 'overlay')}
                          className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'media_hardening' && (
          <motion.div
            key="media_hardening"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4 font-mono"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-2">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-rose-400" />
                Zero-Click Stagefright & Chat App Hardening Matrix
              </h3>
              <p className="text-slate-400 text-xs">
                Disabling Link Previews and Media Auto-Download prevents malicious WebP/MP4 media payloads from triggering memory corruption in Android&apos;s native decoding frameworks without user interaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mediaSettings.map((chat) => (
                <div
                  key={chat.app}
                  className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-5 backdrop-blur-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{chat.app}</h4>
                      <span className="text-[10px] text-slate-500">Android Messaging Client</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        chat.stagefrightMitigationActive
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}
                    >
                      {chat.stagefrightMitigationActive ? 'ZERO-CLICK SHIELDED' : 'EXPLOIT SURFACE EXPOSED'}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <div>
                        <div className="text-slate-200 font-semibold">Disable Link Previews</div>
                        <div className="text-[10px] text-slate-500">Stops background HTTP pre-fetch of zero-day domains</div>
                      </div>
                      <ToggleSwitch
                        checked={chat.linkPreviewsDisabled}
                        onChange={() => handleToggleMediaHardening(chat.app, 'linkPreviewsDisabled')}
                        ariaLabel={`Disable Link Previews for ${chat.app}`}
                        size="sm"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                      <div>
                        <div className="text-slate-200 font-semibold">Disable Media Auto-Download</div>
                        <div className="text-[10px] text-slate-500">Prevents automatic Stagefright decoding of audio/video</div>
                      </div>
                      <ToggleSwitch
                        checked={chat.mediaAutoDownloadDisabled}
                        onChange={() => handleToggleMediaHardening(chat.app, 'mediaAutoDownloadDisabled')}
                        ariaLabel={`Disable Media Auto-Download for ${chat.app}`}
                        size="sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'memory_hygiene' && (
          <motion.div
            key="memory_hygiene"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4 font-mono"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-rose-400" />
                    Volatile RAM Hygiene & 24-Hour Cold Power Cycle
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    State-sponsored mercenary spyware (e.g. Pegasus) relies on volatile memory residence without persistence to evade disk scanners. A daily hard cold reboot wipes memory-only implants and forces attackers to spend another zero-day exploit to regain entry.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] text-slate-500">MEMORY SANITATION INDEX</div>
                  <div className="text-3xl font-bold text-emerald-400">{hygiene.memoryVolatilityScore} / 100</div>
                </div>
              </div>

              {/* Uptime Status Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">CURRENT SYSTEM UPTIME</div>
                  <div className="text-xl font-bold text-white mt-1">{hygiene.uptimeHours.toFixed(1)} Hours</div>
                  <div className="text-[10px] text-slate-500 mt-1">Max Recommended: 24.0 Hours</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">LAST COLD REBOOT PURGE</div>
                  <div className="text-sm font-bold text-slate-200 mt-1">{hygiene.lastColdRebootTimestamp}</div>
                  <div className="text-[10px] text-slate-500 mt-1">Clears Volatile RAM Implants</div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                  <div className="text-slate-500 text-[10px]">SELINUX / ROOT INTEGRITY</div>
                  <div className="text-sm font-bold text-emerald-400 mt-1">ENFORCING & CERTIFIED</div>
                  <div className="text-[10px] text-slate-500 mt-1">Zero Kernel Tampering Detected</div>
                </div>
              </div>

              {/* Action Trigger */}
              <div className="bg-rose-950/20 border border-rose-500/30 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Execute 24-Hour Memory Flush Simulation</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Simulates a full power-down sequence, terminates unverified background execution loops, and clears volatile heap memory.
                  </p>
                </div>
                <button
                  onClick={handleSimulateHardReboot}
                  disabled={isRebooting}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-900/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  {isRebooting ? 'Purging Memory...' : 'Flush Volatile RAM Now'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
