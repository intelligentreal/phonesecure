export type ThreatTierLevel = 'TIER_1_OPPORTUNISTIC' | 'TIER_2_CELLULAR_HARDWARE' | 'TIER_3_BANKING_ACCESSIBILITY' | 'TIER_4_MERCENARY_ZEROCLICK';

export interface ThreatIntelligenceVector {
  id: string;
  name: string;
  tier: ThreatTierLevel;
  targetFramework: 'Android Accessibility' | 'Stagefright / Media Decoders' | 'Notification Listener' | 'Kernel / SELinux' | 'Cellular Baseband / IMSI' | 'SMS / Smishing';
  activeThreatActors: string[];
  cveReferences: string[];
  severity: 'critical' | 'high' | 'medium';
  killChainStage: string;
  description: string;
  mitigationStatus: 'HARDENED' | 'WARNING' | 'VULNERABLE';
  remediationAction: string;
}

export interface AppPermissionDeepAudit {
  packageName: string;
  appName: string;
  appCategory: string;
  iconType: 'bank' | 'social' | 'game' | 'utility' | 'camera' | 'chat' | 'file';
  hasAccessibilityAccess: boolean;
  hasNotificationListenerAccess: boolean;
  hasSystemAlertWindow: boolean; // Screen Overlay
  hasDeviceAdmin: boolean;
  hasSmsReadWrite: boolean;
  threatAssessment: 'SAFE' | 'SUSPICIOUS_OVERLAY' | 'CRITICAL_KEYLOGGER_RISK';
  riskScore: number;
}

export interface MediaFrameworkHardeningStatus {
  app: 'WhatsApp' | 'Telegram' | 'Google Messages' | 'Signal';
  linkPreviewsDisabled: boolean;
  mediaAutoDownloadDisabled: boolean;
  autoBlockerActive: boolean;
  stagefrightMitigationActive: boolean;
}

export interface ZeroClickHygieneMetrics {
  uptimeHours: number;
  lastColdRebootTimestamp: string;
  memoryVolatilityScore: number; // 0 to 100 (100 = freshly purged)
  pendingHardRebootRecommended: boolean;
  sideloadingBlocked: boolean;
  usbDebuggingDisabled: boolean;
  selinuxEnforcing: boolean;
  playProtectActive: boolean;
}
