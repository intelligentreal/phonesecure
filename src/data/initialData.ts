import {
  AppSecurityProfile,
  ThreatItem,
  VpnServer,
  VaultSecretItem,
  DeviceHardwareHealth,
  SecurityEventLog,
  AntiTheftConfig,
  NetworkSecurityConfig,
  ScheduledScanConfig
} from '../types';

export const INITIAL_THREATS: ThreatItem[] = [
  {
    id: 'thr-101',
    name: 'Trojan.AndroidOS.Agent.xg',
    type: 'Trojan',
    severity: 'critical',
    description: 'Stealth credential harvesting payload injected via third-party package. Attempts to capture two-factor SMS OTPs and banking session tokens.',
    path: '/data/app/com.free.flash.lighting-1/base.apk',
    packageName: 'com.free.flash.lighting',
    detectedAt: '12 minutes ago',
    status: 'active',
    indicators: [
      'Executes hidden root shell scripts in /data/local/tmp',
      'Requests Accessibility Service permission to read screen contents',
      'Encrypted C2 communication to 185.220.101.5:8443'
    ],
    recommendedAction: 'Quarantine and perform full APK uninstallation immediately.',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'thr-102',
    name: 'Spyware.Pegasus.HeuristicPattern',
    type: 'Spyware',
    severity: 'high',
    description: 'Background process attempting unnotified microphone and location telemetry streaming to unknown foreign IP.',
    path: '/data/data/com.sys.batteryoptimizer/files/.daemon',
    packageName: 'com.sys.batteryoptimizer',
    detectedAt: '1 hour ago',
    status: 'active',
    indicators: [
      'Wakes audio recording hardware while display is locked',
      'Bypasses Android power management doze mode',
      'Transfers compressed zip archives at 03:00 AM'
    ],
    recommendedAction: 'Revoke microphone and background execution rights; isolate in Quarantine.',
    sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
  },
  {
    id: 'thr-103',
    name: 'Adware.MobiDash.HiddenTrack',
    type: 'Adware',
    severity: 'medium',
    description: 'Aggressive adware injecting full-screen popups over lockscreen and browser tabs without user invocation.',
    path: '/sdcard/Download/Modded_Game_UnlimitedCoins_v2.apk',
    detectedAt: '3 hours ago',
    status: 'quarantined',
    indicators: [
      'Draws over other apps permission abuse (SYSTEM_ALERT_WINDOW)',
      'Spawns persistent foreground service without dismissable notification'
    ],
    recommendedAction: 'Purge package cache and remove APK from Downloads.',
    sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
  }
];

export const INITIAL_APPS: AppSecurityProfile[] = [
  {
    id: 'app-1',
    appName: 'Chase Mobile & Investing',
    packageName: 'com.chase.sig.android',
    version: '4.32.0',
    iconType: 'bank',
    category: 'Finance & Banking',
    trustScore: 98,
    isSystemApp: false,
    installSource: 'Google Play',
    lastUsed: 'Just now',
    networkActivityMb: 4.2,
    hasBackgroundAccess: false,
    isLocked: true,
    permissions: [
      { type: 'location', name: 'Precise Location (For ATM finder)', isDangerous: false, backgroundUsage: false, isGranted: true },
      { type: 'camera', name: 'Camera (For Check Deposit)', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'storage', name: 'Storage (Statements)', isDangerous: false, backgroundUsage: false, isGranted: true }
    ]
  },
  {
    id: 'app-2',
    appName: 'Flashlight Ultra Bright',
    packageName: 'com.free.flash.lighting',
    version: '1.0.4',
    iconType: 'utility',
    category: 'Utilities (Sideloaded)',
    trustScore: 18,
    isSystemApp: false,
    installSource: 'Sideloaded (Unknown APK)',
    lastUsed: '12 min ago',
    networkActivityMb: 142.8,
    hasBackgroundAccess: true,
    isLocked: false,
    permissions: [
      { type: 'camera', name: 'Camera Flash', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'microphone', name: 'Record Audio (High Risk)', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'contacts', name: 'Read Contacts Book', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'sms', name: 'Read SMS / OTP Messages', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'location', name: 'Background Precise GPS', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'accessibility', name: 'Accessibility Service (Screen Reading)', isDangerous: true, backgroundUsage: true, isGranted: true }
    ]
  },
  {
    id: 'app-3',
    appName: 'WhatsApp Messenger',
    packageName: 'com.whatsapp',
    version: '2.24.12.8',
    iconType: 'chat',
    category: 'Communication',
    trustScore: 92,
    isSystemApp: false,
    installSource: 'Google Play',
    lastUsed: '5 min ago',
    networkActivityMb: 38.5,
    hasBackgroundAccess: true,
    isLocked: true,
    permissions: [
      { type: 'camera', name: 'Camera (Photos/Video Call)', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'microphone', name: 'Microphone (Voice notes)', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'contacts', name: 'Contacts Sync', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'storage', name: 'Storage Access', isDangerous: false, backgroundUsage: true, isGranted: true }
    ]
  },
  {
    id: 'app-4',
    appName: 'Instagram',
    packageName: 'com.instagram.android',
    version: '315.0.0',
    iconType: 'social',
    category: 'Social Media',
    trustScore: 84,
    isSystemApp: false,
    installSource: 'App Store',
    lastUsed: '24 min ago',
    networkActivityMb: 124.0,
    hasBackgroundAccess: true,
    isLocked: false,
    permissions: [
      { type: 'camera', name: 'Camera Access', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'microphone', name: 'Microphone Access', isDangerous: true, backgroundUsage: false, isGranted: true },
      { type: 'location', name: 'Location Tagging', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'storage', name: 'Photos & Videos', isDangerous: false, backgroundUsage: false, isGranted: true }
    ]
  },
  {
    id: 'app-5',
    appName: 'Battery Optimizer & Booster',
    packageName: 'com.sys.batteryoptimizer',
    version: '2.1.0',
    iconType: 'utility',
    category: 'Utilities',
    trustScore: 32,
    isSystemApp: false,
    installSource: 'Sideloaded (Unknown APK)',
    lastUsed: '1 hour ago',
    networkActivityMb: 88.3,
    hasBackgroundAccess: true,
    isLocked: false,
    permissions: [
      { type: 'microphone', name: 'Microphone (Background Listening)', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'location', name: 'Precise Location Tracking', isDangerous: true, backgroundUsage: true, isGranted: true },
      { type: 'storage', name: 'Full Internal Storage Read/Write', isDangerous: true, backgroundUsage: true, isGranted: true }
    ]
  },
  {
    id: 'app-6',
    appName: 'Photos & Gallery',
    packageName: 'com.google.android.apps.photos',
    version: '6.78.0',
    iconType: 'camera',
    category: 'System & Media',
    trustScore: 99,
    isSystemApp: true,
    installSource: 'System Pre-installed',
    lastUsed: '2 hours ago',
    networkActivityMb: 15.0,
    hasBackgroundAccess: false,
    isLocked: true,
    permissions: [
      { type: 'storage', name: 'Media Library Access', isDangerous: false, backgroundUsage: true, isGranted: true },
      { type: 'location', name: 'Photo Geotagging', isDangerous: false, backgroundUsage: false, isGranted: true }
    ]
  }
];

export const VPN_SERVERS: VpnServer[] = [
  { id: 'vpn-1', name: 'Zurich Zero-Log Shield', country: 'Switzerland', flag: '🇨🇭', city: 'Zurich', pingMs: 18, ip: '185.156.175.42' },
  { id: 'vpn-2', name: 'Reykjavik Privacy Vault', country: 'Iceland', flag: '🇮🇸', city: 'Reykjavik', pingMs: 34, ip: '194.38.20.12' },
  { id: 'vpn-3', name: 'Tokyo Fast Armor', country: 'Japan', flag: '🇯🇵', city: 'Tokyo', pingMs: 82, ip: '133.242.18.99' },
  { id: 'vpn-4', name: 'Frankfurt Ultra Secure', country: 'Germany', flag: '🇩🇪', city: 'Frankfurt', pingMs: 22, ip: '159.69.112.5' },
  { id: 'vpn-5', name: 'New York WireGuard Node', country: 'United States', flag: '🇺🇸', city: 'New York', pingMs: 45, ip: '198.51.100.24' },
  { id: 'vpn-6', name: 'Singapore Cyber Gateway', country: 'Singapore', flag: '🇸🇬', city: 'Singapore', pingMs: 110, ip: '103.253.144.18' }
];

export const INITIAL_VAULT_ITEMS: VaultSecretItem[] = [
  {
    id: 'vlt-1',
    title: 'Passport & Identity Scan (AES-256)',
    type: 'photo',
    preview: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=400&auto=format&fit=crop&q=60',
    content: 'ENCRYPTED_BLOB_90a4f31c4b78912de',
    dateCreated: '2026-08-10',
    size: '3.4 MB',
    isDecoy: false
  },
  {
    id: 'vlt-2',
    title: 'Emergency Master Crypto Seed Phrase',
    type: 'note',
    content: '1. bunker 2. horizon 3. shield 4. quantum 5. vault 6. falcon 7. galaxy 8. cipher 9. granite 10. summit 11. titan 12. vector',
    dateCreated: '2026-08-04',
    size: '1.2 KB',
    isDecoy: false
  },
  {
    id: 'vlt-3',
    title: 'Corporate VPN & Server SSH Keys',
    type: 'password',
    content: 'Host: secure.internal.corp\nUser: root_sec_ops\nKey: id_ed25519_phone_protected_78a\nPassphrase: [REDACTED_BIOMETRIC_PROTECTED]',
    dateCreated: '2026-08-12',
    size: '2.8 KB',
    isDecoy: false
  },
  {
    id: 'vlt-decoy-1',
    title: 'Supermarket Grocery List (Decoy Mode)',
    type: 'note',
    content: '1. Almond milk\n2. Sourdough bread\n3. Honey crisp apples\n4. Olive oil\n5. Green tea bags',
    dateCreated: '2026-08-14',
    size: '0.4 KB',
    isDecoy: true
  }
];

export const INITIAL_ANTI_THEFT: AntiTheftConfig = {
  isArmed: true,
  motionAlarmEnabled: false,
  simChangeProtection: true,
  pinAttemptsBeforeLock: 3,
  emergencyContact: {
    name: 'Sarah Connor (Trusted Partner)',
    phone: '+1 (555) 234-5678'
  },
  remoteLockPin: '8492',
  remoteLockMessage: 'THIS PHONE IS LOST / MONITORED BY PHONESECURE. PLEASE CALL +1 (555) 234-5678 TO RETURN FOR REWARD.',
  isRemotelyLocked: false,
  deviceLocation: {
    lat: 37.7749,
    lng: -122.4194,
    accuracyMeters: 4.8,
    address: '742 Market St, Financial District, San Francisco, CA 94103',
    lastUpdated: 'Live (GPS Beacon 12s ago)'
  },
  intruderLogs: [
    {
      id: 'log-1',
      timestamp: 'Today at 02:14 PM',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=60',
      location: '37.7749° N, 122.4194° W (Near Union Square)',
      reason: 'Failed PIN Attempts (3x)',
      batteryLevel: 78
    }
  ]
};

export const INITIAL_NETWORK: NetworkSecurityConfig = {
  currentSsid: 'Starbucks_Guest_WiFi_5G',
  bssid: 'a4:2b:8c:91:04:f2',
  isPublicHotspot: true,
  encryption: 'Unencrypted / Open Hotspot (High Risk)',
  vpnConnected: false,
  selectedServer: VPN_SERVERS[0],
  dnsShieldActive: true,
  arpProtectionActive: true,
  safeBrowsingActive: true,
  blockedTrackersCount: 1420,
  blockedMaliciousDomainsCount: 37,
  liveThroughputMbps: {
    download: 48.2,
    upload: 14.7
  }
};

export const INITIAL_HARDWARE: DeviceHardwareHealth = {
  batteryHealthPercent: 96,
  batteryTemperatureC: 31.4,
  isCharging: false,
  cpuUsagePercent: 14,
  ramUsagePercent: 54,
  storageFreeGb: 142.5,
  storageTotalGb: 256.0,
  osVersion: 'Android 15 / Security Patch 2026.08',
  securityPatchDate: 'August 1, 2026',
  rootJailbreakDetected: false,
  secureEnclaveActive: true
};

export const INITIAL_SCHEDULED_SCAN: ScheduledScanConfig = {
  enabled: true,
  frequency: 'daily',
  preferredTime: '03:00',
  requireCharging: true,
  requireIdle: true,
  scanScope: 'full_system',
  autoQuarantineCritical: true,
  lastScanTimestamp: 'Today at 03:04 AM',
  lastScanThreatsFound: 0
};

export const INITIAL_LOGS: SecurityEventLog[] = [
  {
    id: 'evt-1',
    timestamp: '14:48:10',
    type: 'threat_blocked',
    title: 'Blocked Spyware Audio Access',
    description: 'Background microphone hook blocked for "Battery Optimizer & Booster".',
    severity: 'high'
  },
  {
    id: 'evt-2',
    timestamp: '14:32:05',
    type: 'vpn',
    title: 'DNS Tunnel Shield Activated',
    description: 'Intercepted 18 telemetry trackers attempting DNS exfiltration.',
    severity: 'safe'
  },
  {
    id: 'evt-3',
    timestamp: '13:10:44',
    type: 'scan',
    title: 'Deep Heuristic Scan Completed',
    description: 'Scanned 14,892 files across 4 storage volumes. 2 active threats flagged.',
    severity: 'warning'
  },
  {
    id: 'evt-4',
    timestamp: '11:05:22',
    type: 'anti_theft',
    title: 'Anti-Theft Geofence Armed',
    description: 'High-accuracy GPS telemetry and motion sensor guard activated.',
    severity: 'safe'
  }
];
