import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardView } from './components/DashboardView';
import { ThreatScannerView } from './components/ThreatScannerView';
import { PrivacyShieldView } from './components/PrivacyShieldView';
import { AntiTheftView } from './components/AntiTheftView';
import { NetworkDefenseView } from './components/NetworkDefenseView';
import { SecureVaultView } from './components/SecureVaultView';
import { AiCyberAdvisorView } from './components/AiCyberAdvisorView';
import { DiagnosticsView } from './components/DiagnosticsView';
import { EmergencySosModal } from './components/EmergencySosModal';
import { RemoteLockOverlay } from './components/RemoteLockOverlay';

import {
  INITIAL_THREATS,
  INITIAL_APPS,
  INITIAL_ANTI_THEFT,
  INITIAL_NETWORK,
  INITIAL_VAULT_ITEMS,
  INITIAL_HARDWARE,
  INITIAL_LOGS
} from './data/initialData';

import {
  ActiveTabType,
  ThreatItem,
  AppSecurityProfile,
  PermissionType,
  AntiTheftConfig,
  NetworkSecurityConfig,
  VaultSecretItem,
  SecurityEventLog,
  IntruderLog,
  VpnServer
} from './types';

import { soundFx } from './utils/audioSensors';

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<ActiveTabType>('dashboard');

  // Security Entities
  const [threats, setThreats] = useState<ThreatItem[]>(INITIAL_THREATS);
  const [apps, setApps] = useState<AppSecurityProfile[]>(INITIAL_APPS);
  const [antiTheftConfig, setAntiTheftConfig] = useState<AntiTheftConfig>(INITIAL_ANTI_THEFT);
  const [networkConfig, setNetworkConfig] = useState<NetworkSecurityConfig>(INITIAL_NETWORK);
  const [vaultItems, setVaultItems] = useState<VaultSecretItem[]>(INITIAL_VAULT_ITEMS);
  const [hardware, setHardware] = useState(INITIAL_HARDWARE);
  const [eventLogs, setEventLogs] = useState<SecurityEventLog[]>(INITIAL_LOGS);

  // Active Shields & Killswitches
  const [realTimeShieldActive, setRealTimeShieldActive] = useState(true);
  const [webShieldActive, setWebShieldActive] = useState(true);
  const [wifiShieldActive, setWifiShieldActive] = useState(true);
  const [micCamGuardActive, setMicCamGuardActive] = useState(true);
  const [cameraKillswitch, setCameraKillswitch] = useState(false);
  const [micKillswitch, setMicKillswitch] = useState(false);
  const [clipboardShield, setClipboardShield] = useState(true);

  // UI Modals & Actions
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isCleaningCache, setIsCleaningCache] = useState(false);
  const [isAuditingWifi, setIsAuditingWifi] = useState(false);
  const [isOptimizingRam, setIsOptimizingRam] = useState(false);

  // Dynamic Health Score Calculation
  const activeThreatsCount = useMemo(() => {
    return threats.filter((t) => t.status === 'active').length;
  }, [threats]);

  const quarantinedCount = useMemo(() => {
    return threats.filter((t) => t.status === 'quarantined').length;
  }, [threats]);

  const healthScore = useMemo(() => {
    let score = 100;
    // Deduct for active threats
    score -= activeThreatsCount * 18;
    // Deduct for unshielded toggles
    if (!realTimeShieldActive) score -= 12;
    if (!webShieldActive) score -= 10;
    if (!wifiShieldActive) score -= 8;
    if (!antiTheftConfig.isArmed) score -= 6;
    if (!networkConfig.vpnConnected && networkConfig.isPublicHotspot) score -= 6;
    return Math.max(12, Math.min(100, score));
  }, [
    activeThreatsCount,
    realTimeShieldActive,
    webShieldActive,
    wifiShieldActive,
    antiTheftConfig.isArmed,
    networkConfig.vpnConnected,
    networkConfig.isPublicHotspot
  ]);

  // Event Logger Helper
  const addLog = (
    type: SecurityEventLog['type'],
    title: string,
    description: string,
    severity: SecurityEventLog['severity']
  ) => {
    const newLog: SecurityEventLog = {
      id: `evt-${Date.now()}`,
      timestamp: new Date().toTimeString().split(' ')[0],
      type,
      title,
      description,
      severity
    };
    setEventLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  // Threat Actions
  const handleQuarantineThreat = (id: string) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'quarantined' as const } : t))
    );
    addLog('threat_blocked', 'Malware Quarantined', `Isolated malicious payload id: ${id}`, 'warning');
  };

  const handleDeleteThreat = (id: string) => {
    setThreats((prev) => prev.filter((t) => t.id !== id));
    addLog('threat_blocked', 'Threat Neutralized & Shredded', `Permanently purged APK package`, 'safe');
  };

  const handleRestoreThreat = (id: string) => {
    setThreats((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: 'active' as const } : t))
    );
    addLog('threat_blocked', 'Package Restored', `User whitelisted threat item`, 'warning');
  };

  const handleAddCustomThreat = (threat: ThreatItem) => {
    setThreats((prev) => [threat, ...prev]);
    addLog('scan', 'Sandbox Detected Malicious Payload', threat.name, 'high');
  };

  // Permission Actions
  const handleToggleAppPermission = (appId: string, permType: PermissionType) => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const updatedPerms = app.permissions.map((p) => {
          if (p.type === permType) {
            return { ...p, isGranted: !p.isGranted };
          }
          return p;
        });
        return { ...app, permissions: updatedPerms };
      })
    );
    addLog('permission_revoked', 'Permission Policy Modified', `Toggled ${permType} permission`, 'safe');
  };

  const handleHardenAllPermissions = () => {
    setApps((prev) =>
      prev.map((app) => {
        if (app.trustScore < 60) {
          const hardenedPerms = app.permissions.map((p) =>
            p.isDangerous ? { ...p, isGranted: false } : p
          );
          return { ...app, permissions: hardenedPerms, trustScore: 78 };
        }
        return app;
      })
    );
    addLog('permission_revoked', 'Zero-Trust Hardening Applied', 'Revoked dangerous permissions on all low-trust packages', 'safe');
  };

  // Anti-Theft Actions
  const handleUpdateAntiTheft = (updated: Partial<AntiTheftConfig>) => {
    setAntiTheftConfig((prev) => ({ ...prev, ...updated }));
  };

  const handleTriggerRemoteLock = () => {
    setAntiTheftConfig((prev) => ({ ...prev, isRemotelyLocked: true }));
    addLog('anti_theft', 'Remote Lock Triggered', 'Screen locked with emergency PIN challenge', 'warning');
  };

  const handleAddIntruderLog = (log: IntruderLog) => {
    setAntiTheftConfig((prev) => ({
      ...prev,
      intruderLogs: [log, ...prev.intruderLogs]
    }));
    addLog('anti_theft', 'Intruder Snapshot Logged', `${log.reason} at ${log.location}`, 'high');
  };

  const handleRemoteWipe = () => {
    setVaultItems([]);
    addLog('anti_theft', 'Cryptographic Shredding Complete', 'Local vault & sensitive caches wiped clean', 'safe');
  };

  // Network & VPN Actions
  const handleToggleVpn = () => {
    const next = !networkConfig.vpnConnected;
    setNetworkConfig((prev) => ({ ...prev, vpnConnected: next }));
    addLog('vpn', next ? 'WireGuard VPN Connected' : 'VPN Tunnel Disconnected', next ? `Encrypted via ${networkConfig.selectedServer.name}` : 'Direct connection active', 'safe');
  };

  const handleSelectVpnServer = (server: VpnServer) => {
    setNetworkConfig((prev) => ({ ...prev, selectedServer: server }));
    addLog('vpn', 'VPN Server Changed', `Switched routing node to ${server.name} (${server.city})`, 'safe');
  };

  const handleRunWifiAudit = () => {
    setIsAuditingWifi(true);
    setTimeout(() => {
      setIsAuditingWifi(false);
      soundFx.playShieldSecured();
      addLog('scan', 'Wi-Fi Hotspot Audit Complete', 'No ARP spoofing or Rogue AP detected on Starbucks_Guest_WiFi_5G', 'safe');
    }, 1200);
  };

  // Vault Actions
  const handleToggleAppLock = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, isLocked: !a.isLocked } : a))
    );
    addLog('vault', 'App Locker Policy Updated', 'App lock state changed', 'safe');
  };

  const handleAddVaultItem = (item: VaultSecretItem) => {
    setVaultItems((prev) => [item, ...prev]);
    addLog('vault', 'Secret Stored in Vault', `Added encrypted item: ${item.title}`, 'safe');
  };

  const handleDeleteVaultItem = (id: string) => {
    setVaultItems((prev) => prev.filter((i) => i.id !== id));
    addLog('vault', 'Vault Item Deleted', `Shredded encrypted record`, 'safe');
  };

  // Cache Cleaner Action
  const handleCleanCache = () => {
    setIsCleaningCache(true);
    soundFx.playRadarBeep();
    setTimeout(() => {
      setIsCleaningCache(false);
      setHardware((prev) => ({
        ...prev,
        storageFreeGb: Number((prev.storageFreeGb + 1.2).toFixed(1))
      }));
      soundFx.playShieldSecured();
      addLog('scan', 'System Cache Cleared', 'Freed 1.2 GB of temporary caches and orphaned APK payloads', 'safe');
    }, 1400);
  };

  // RAM Optimizer Action
  const handleOptimizeRam = () => {
    setIsOptimizingRam(true);
    soundFx.playRadarBeep();
    setTimeout(() => {
      setIsOptimizingRam(false);
      setHardware((prev) => ({
        ...prev,
        ramUsagePercent: 38,
        cpuUsagePercent: 8
      }));
      soundFx.playShieldSecured();
      addLog('scan', 'RAM Memory Optimized', 'Terminated 14 dormant background background services', 'safe');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.15),transparent)] selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header
        healthScore={healthScore}
        threatCount={activeThreatsCount}
        isMuted={isMuted}
        onToggleMute={() => setIsMuted(soundFx.toggleMute())}
        onOpenSos={() => setIsSosOpen(true)}
        vpnConnected={networkConfig.vpnConnected}
      />

      {/* Navigation Sub-Header */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        threatCount={activeThreatsCount}
        quarantinedCount={quarantinedCount}
        vpnActive={networkConfig.vpnConnected}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.995 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab === 'dashboard' && (
              <DashboardView
                healthScore={healthScore}
                threats={threats}
                realTimeShieldActive={realTimeShieldActive}
                onToggleRealTimeShield={() => {
                  setRealTimeShieldActive(!realTimeShieldActive);
                  soundFx.playClick(!realTimeShieldActive);
                }}
                webShieldActive={webShieldActive}
                onToggleWebShield={() => {
                  setWebShieldActive(!webShieldActive);
                  soundFx.playClick(!webShieldActive);
                }}
                wifiShieldActive={wifiShieldActive}
                onToggleWifiShield={() => {
                  setWifiShieldActive(!wifiShieldActive);
                  soundFx.playClick(!wifiShieldActive);
                }}
                micCamGuardActive={micCamGuardActive}
                onToggleMicCamGuard={() => {
                  setMicCamGuardActive(!micCamGuardActive);
                  soundFx.playClick(!micCamGuardActive);
                }}
                antiTheftArmed={antiTheftConfig.isArmed}
                onToggleAntiTheft={() => {
                  setAntiTheftConfig((prev) => ({ ...prev, isArmed: !prev.isArmed }));
                  soundFx.playClick(!antiTheftConfig.isArmed);
                }}
                vpnConnected={networkConfig.vpnConnected}
                onToggleVpn={handleToggleVpn}
                onStartScan={() => {
                  setActiveTab('scanner');
                  setIsScanning(true);
                  soundFx.playRadarBeep();
                }}
                onNavigate={setActiveTab}
                eventLogs={eventLogs}
                onCleanCache={handleCleanCache}
                isCleaningCache={isCleaningCache}
              />
            )}

            {activeTab === 'scanner' && (
              <ThreatScannerView
                threats={threats}
                onQuarantineThreat={handleQuarantineThreat}
                onDeleteThreat={handleDeleteThreat}
                onRestoreThreat={handleRestoreThreat}
                onAddCustomThreat={handleAddCustomThreat}
                isScanning={isScanning}
                onTriggerScan={() => {
                  setIsScanning(true);
                  soundFx.playRadarBeep();
                }}
              />
            )}

            {activeTab === 'privacy' && (
              <PrivacyShieldView
                apps={apps}
                onToggleAppPermission={handleToggleAppPermission}
                onHardenAllPermissions={handleHardenAllPermissions}
                cameraKillswitch={cameraKillswitch}
                onToggleCameraKillswitch={() => setCameraKillswitch(!cameraKillswitch)}
                micKillswitch={micKillswitch}
                onToggleMicKillswitch={() => setMicKillswitch(!micKillswitch)}
                clipboardShield={clipboardShield}
                onToggleClipboardShield={() => setClipboardShield(!clipboardShield)}
              />
            )}

            {activeTab === 'antitheft' && (
              <AntiTheftView
                antiTheftConfig={antiTheftConfig}
                onUpdateConfig={handleUpdateAntiTheft}
                onTriggerRemoteLock={handleTriggerRemoteLock}
                onAddIntruderLog={handleAddIntruderLog}
                onTriggerRemoteWipe={handleRemoteWipe}
              />
            )}

            {activeTab === 'network' && (
              <NetworkDefenseView
                networkConfig={networkConfig}
                onToggleVpn={handleToggleVpn}
                onSelectVpnServer={handleSelectVpnServer}
                onRunWifiAudit={handleRunWifiAudit}
                isAuditingWifi={isAuditingWifi}
              />
            )}

            {activeTab === 'vault' && (
              <SecureVaultView
                vaultItems={vaultItems}
                apps={apps}
                onToggleAppLock={handleToggleAppLock}
                onAddVaultItem={handleAddVaultItem}
                onDeleteVaultItem={handleDeleteVaultItem}
              />
            )}

            {activeTab === 'ai_advisor' && <AiCyberAdvisorView />}

            {activeTab === 'diagnostics' && (
              <DiagnosticsView
                hardware={hardware}
                onOptimizeRam={handleOptimizeRam}
                isOptimizing={isOptimizingRam}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Emergency SOS Modal */}
      <EmergencySosModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        emergencyContact={antiTheftConfig.emergencyContact}
        locationText={antiTheftConfig.deviceLocation.address}
      />

      {/* Remote Lock Fullscreen Overlay */}
      <RemoteLockOverlay
        isLocked={antiTheftConfig.isRemotelyLocked}
        message={antiTheftConfig.remoteLockMessage}
        correctPin={antiTheftConfig.remoteLockPin}
        onUnlock={() => {
          setAntiTheftConfig((prev) => ({ ...prev, isRemotelyLocked: false }));
          addLog('anti_theft', 'Device Successfully Unlocked', 'Authenticated with emergency recovery PIN', 'safe');
        }}
        onFailedAttempt={() => {
          const newLog: IntruderLog = {
            id: `intruder-${Date.now()}`,
            timestamp: 'Just now',
            location: antiTheftConfig.deviceLocation.address,
            reason: 'Failed PIN Attempts (3x)',
            batteryLevel: 84
          };
          handleAddIntruderLog(newLog);
        }}
      />
    </div>
  );
}
