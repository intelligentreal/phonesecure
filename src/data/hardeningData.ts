import {
  ThreatIntelligenceVector,
  AppPermissionDeepAudit,
  MediaFrameworkHardeningStatus,
  ZeroClickHygieneMetrics
} from '../types/hardening';

export const INITIAL_THREAT_VECTORS: ThreatIntelligenceVector[] = [
  {
    id: 'VEC-401',
    name: 'Mercenary Zero-Click Memory Implants (Pegasus / Predator)',
    tier: 'TIER_4_MERCENARY_ZEROCLICK',
    targetFramework: 'Stagefright / Media Decoders',
    activeThreatActors: ['NSO Group (Pegasus)', 'Intellexa (Predator)', 'Candiru'],
    cveReferences: ['CVE-2023-4863', 'CVE-2023-41064', 'CVE-2024-32896'],
    severity: 'critical',
    killChainStage: 'Silent VoIP / WebP RAM Buffer Overflow ➔ Kernel LPE',
    description: 'Weaponized audio/video packets or malformed image formats trigger instant RAM overflow before the messaging app displays call notifications, establishing non-persistent memory implants.',
    mitigationStatus: 'HARDENED',
    remediationAction: 'Enforce 24-Hour Cold Power Cycle & Disable Messaging Media Auto-Download.'
  },
  {
    id: 'VEC-301',
    name: 'Android Accessibility Service Hijack & Keylogger (SharkBot / Xenomorph)',
    tier: 'TIER_3_BANKING_ACCESSIBILITY',
    targetFramework: 'Android Accessibility',
    activeThreatActors: ['SharkBot Syndicate', 'Xenomorph Gang', 'FluBot Affiliates'],
    cveReferences: ['CWE-269', 'CAPEC-563'],
    severity: 'critical',
    killChainStage: 'BIND_ACCESSIBILITY_SERVICE ➔ Automated Background Screen Scraping',
    description: 'Malicious apps pose as cleaners or utility updates to request Accessibility permissions. Once granted, they log keystrokes, read banking screens, and simulate user taps for auto-transfers.',
    mitigationStatus: 'WARNING',
    remediationAction: 'Revoke BIND_ACCESSIBILITY_SERVICE from all non-essential assistive tools.'
  },
  {
    id: 'VEC-302',
    name: 'OTP Notification Listener & Stealth SMS Exfiltration',
    tier: 'TIER_3_BANKING_ACCESSIBILITY',
    targetFramework: 'Notification Listener',
    activeThreatActors: ['BlackRock Operators', 'Godfather Trojan Crew'],
    cveReferences: ['CWE-200', 'CAPEC-115'],
    severity: 'high',
    killChainStage: 'NotificationListenerService ➔ 2FA Code Intercept ➔ SMS Delete',
    description: 'Intercepts incoming banking SMS verification codes from the system notification tray, sends them to command servers, and instantly cancels notifications before the user sees them.',
    mitigationStatus: 'HARDENED',
    remediationAction: 'Lock down Notification Access in Android Privacy Settings.'
  },
  {
    id: 'VEC-201',
    name: 'Rogue Cellular Base Station & IMSI-Catcher (Stingray Attack)',
    tier: 'TIER_2_CELLULAR_HARDWARE',
    targetFramework: 'Cellular Baseband / IMSI',
    activeThreatActors: ['State-sponsored IMSI Operators', 'Over-The-Air Interceptors'],
    cveReferences: ['3GPP TS 33.102', 'CWE-300'],
    severity: 'high',
    killChainStage: 'Forced 2G Cipher Downgrade ➔ Unencrypted GSM Eavesdropping',
    description: 'Portable rogue cell towers broadcast maximum signal strength, forcing phones to downgrade to legacy unencrypted 2G ciphers (A5/0 or A5/1) to intercept SMS and voice data.',
    mitigationStatus: 'HARDENED',
    remediationAction: 'Disable 2G Baseband Connectivity & Monitor Base Station LAC ID Shifts.'
  },
  {
    id: 'VEC-101',
    name: 'Smishing, Homograph Punycode & Credential Exfiltration',
    tier: 'TIER_1_OPPORTUNISTIC',
    targetFramework: 'SMS / Smishing',
    activeThreatActors: ['Phishing-as-a-Service Kits', 'Smishing Fraud Rings'],
    cveReferences: ['RFC 3986', 'RFC 3492'],
    severity: 'medium',
    killChainStage: 'SMS Lure ➔ Unicode Fake Domain ➔ External Form Action Harvester',
    description: 'Deceptive SMS texts targeting package deliveries or bank locks with lookalike Punycode domains (e.g. xn--pple-43d.tk) that submit credentials directly to foreign exfiltration endpoints.',
    mitigationStatus: 'HARDENED',
    remediationAction: 'Real-time RFC 3986 Inspection via Authoritative DNA Engine v1.2.2-F.'
  }
];

export const INITIAL_APP_PERMISSIONS_AUDIT: AppPermissionDeepAudit[] = [
  {
    packageName: 'com.cleaner.speedup.booster',
    appName: 'Ultra Battery Doctor & Booster',
    appCategory: 'Utility / Optimization',
    iconType: 'utility',
    hasAccessibilityAccess: true,
    hasNotificationListenerAccess: true,
    hasSystemAlertWindow: true,
    hasDeviceAdmin: false,
    hasSmsReadWrite: true,
    threatAssessment: 'CRITICAL_KEYLOGGER_RISK',
    riskScore: 94
  },
  {
    packageName: 'com.quickcrypto.tradefree',
    appName: 'FastCrypto Wallet Pro',
    appCategory: 'Finance',
    iconType: 'bank',
    hasAccessibilityAccess: false,
    hasNotificationListenerAccess: true,
    hasSystemAlertWindow: true,
    hasDeviceAdmin: false,
    hasSmsReadWrite: false,
    threatAssessment: 'SUSPICIOUS_OVERLAY',
    riskScore: 68
  },
  {
    packageName: 'com.whatsapp',
    appName: 'WhatsApp Messenger',
    appCategory: 'Communication',
    iconType: 'chat',
    hasAccessibilityAccess: false,
    hasNotificationListenerAccess: false,
    hasSystemAlertWindow: false,
    hasDeviceAdmin: false,
    hasSmsReadWrite: false,
    threatAssessment: 'SAFE',
    riskScore: 12
  },
  {
    packageName: 'com.google.android.apps.messaging',
    appName: 'Google Messages',
    appCategory: 'System SMS',
    iconType: 'chat',
    hasAccessibilityAccess: false,
    hasNotificationListenerAccess: false,
    hasSystemAlertWindow: false,
    hasDeviceAdmin: false,
    hasSmsReadWrite: true,
    threatAssessment: 'SAFE',
    riskScore: 8
  },
  {
    packageName: 'com.bank.secure.mobile',
    appName: 'First National Bank Mobile',
    appCategory: 'Banking',
    iconType: 'bank',
    hasAccessibilityAccess: false,
    hasNotificationListenerAccess: false,
    hasSystemAlertWindow: false,
    hasDeviceAdmin: false,
    hasSmsReadWrite: false,
    threatAssessment: 'SAFE',
    riskScore: 4
  }
];

export const INITIAL_MEDIA_HARDENING: MediaFrameworkHardeningStatus[] = [
  {
    app: 'WhatsApp',
    linkPreviewsDisabled: false,
    mediaAutoDownloadDisabled: false,
    autoBlockerActive: true,
    stagefrightMitigationActive: false
  },
  {
    app: 'Telegram',
    linkPreviewsDisabled: true,
    mediaAutoDownloadDisabled: true,
    autoBlockerActive: true,
    stagefrightMitigationActive: true
  },
  {
    app: 'Google Messages',
    linkPreviewsDisabled: true,
    mediaAutoDownloadDisabled: true,
    autoBlockerActive: true,
    stagefrightMitigationActive: true
  },
  {
    app: 'Signal',
    linkPreviewsDisabled: true,
    mediaAutoDownloadDisabled: true,
    autoBlockerActive: true,
    stagefrightMitigationActive: true
  }
];

export const INITIAL_HYGIENE_METRICS: ZeroClickHygieneMetrics = {
  uptimeHours: 54.8,
  lastColdRebootTimestamp: '2 days 6 hours ago',
  memoryVolatilityScore: 42, // Reduced due to >24h uptime
  pendingHardRebootRecommended: true,
  sideloadingBlocked: true,
  usbDebuggingDisabled: true,
  selinuxEnforcing: true,
  playProtectActive: true
};
