export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical' | 'warning';

export interface ThreatItem {
  id: string;
  name: string;
  type: 'Trojan' | 'Spyware' | 'Adware' | 'Ransomware' | 'Rogue Permission' | 'Phishing Payload' | 'Exploit Payload';
  severity: SecuritySeverity;
  description: string;
  path: string;
  packageName?: string;
  detectedAt: string;
  status: 'active' | 'quarantined' | 'resolved' | 'ignored';
  indicators: string[];
  recommendedAction: string;
  sha256: string;
}

export type PermissionType = 'camera' | 'microphone' | 'location' | 'contacts' | 'sms' | 'storage' | 'accessibility' | 'overlay';

export interface AppPermission {
  type: PermissionType;
  name: string;
  isDangerous: boolean;
  backgroundUsage: boolean;
  isGranted: boolean;
}

export interface AppSecurityProfile {
  id: string;
  appName: string;
  packageName: string;
  version: string;
  iconType: 'bank' | 'social' | 'game' | 'utility' | 'camera' | 'chat' | 'file';
  category: string;
  trustScore: number; // 0 to 100
  isSystemApp: boolean;
  installSource: 'Google Play' | 'App Store' | 'Sideloaded (Unknown APK)' | 'System Pre-installed';
  permissions: AppPermission[];
  lastUsed: string;
  networkActivityMb: number;
  hasBackgroundAccess: boolean;
  isLocked: boolean;
}

export interface IntruderLog {
  id: string;
  timestamp: string;
  photoUrl?: string;
  location: string;
  reason: 'Failed PIN Attempts (3x)' | 'Motion Sensor Triggered' | 'SIM Ejection Attempt' | 'Remote Selfie Trigger';
  batteryLevel: number;
}

export interface AntiTheftConfig {
  isArmed: boolean;
  motionAlarmEnabled: boolean;
  simChangeProtection: boolean;
  pinAttemptsBeforeLock: number;
  emergencyContact: {
    name: string;
    phone: string;
  };
  remoteLockPin: string;
  remoteLockMessage: string;
  isRemotelyLocked: boolean;
  deviceLocation: {
    lat: number;
    lng: number;
    accuracyMeters: number;
    address: string;
    lastUpdated: string;
  };
  intruderLogs: IntruderLog[];
}

export interface VpnServer {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  pingMs: number;
  ip: string;
}

export interface NetworkSecurityConfig {
  currentSsid: string;
  bssid: string;
  isPublicHotspot: boolean;
  encryption: string;
  vpnConnected: boolean;
  selectedServer: VpnServer;
  dnsShieldActive: boolean;
  arpProtectionActive: boolean;
  safeBrowsingActive: boolean;
  blockedTrackersCount: number;
  blockedMaliciousDomainsCount: number;
  liveThroughputMbps: {
    download: number;
    upload: number;
  };
}

export interface VaultSecretItem {
  id: string;
  title: string;
  type: 'photo' | 'note' | 'card' | 'password';
  preview?: string;
  content: string;
  dateCreated: string;
  size: string;
  isDecoy: boolean;
}

export interface DeviceHardwareHealth {
  batteryHealthPercent: number;
  batteryTemperatureC: number;
  isCharging: boolean;
  cpuUsagePercent: number;
  ramUsagePercent: number;
  storageFreeGb: number;
  storageTotalGb: number;
  osVersion: string;
  securityPatchDate: string;
  rootJailbreakDetected: boolean;
  secureEnclaveActive: boolean;
}

export interface SecurityEventLog {
  id: string;
  timestamp: string;
  type: 'scan' | 'threat_blocked' | 'anti_theft' | 'permission_revoked' | 'vpn' | 'vault';
  title: string;
  description: string;
  severity: SecuritySeverity | 'safe';
}

export type ActiveTabType =
  | 'dashboard'
  | 'scanner'
  | 'privacy'
  | 'antitheft'
  | 'network'
  | 'vault'
  | 'ai_advisor'
  | 'diagnostics';
