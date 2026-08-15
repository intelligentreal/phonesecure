export type SensorType = 'camera' | 'microphone' | 'gps' | 'biometrics';
export type SensorAccessState = 'IDLE' | 'AUTHORIZED' | 'UNAUTHORIZED_ACCESS' | 'BLOCKED';

export interface SensorStateStatus {
  type: SensorType;
  label: string;
  hardwareDriver: string;
  hardwareAddress: string;
  isPhysicallyActive: boolean;
  authorizedApp: string | null;
  state: SensorAccessState;
  lastAccessTimestamp: string;
  totalAccessEventsToday: number;
  unauthorizedAttemptsToday: number;
  sampleRateOrResolution: string;
  webApiStatus?: string;
  biometricEnclaveType?: 'Ultrasonic In-Display FP' | '3D Structured Light Face Enclave' | 'Titan M2 Hardware Key';
}

export interface HardwareSensorAccessLog {
  id: string;
  timestamp: string;
  sensor: SensorType;
  state: 'AUTHORIZED' | 'UNAUTHORIZED_BLOCKED' | 'SUSPICIOUS_PROBE';
  originProcess: string;
  processUid: number;
  isBackground: boolean;
  severity: 'critical' | 'high' | 'medium' | 'safe';
  details: string;
  mitigationTaken: string;
  cryptographicSignature: string;
}

export interface HardwareIntegrityAuditResult {
  auditId: string;
  timestamp: string;
  overallStatus: 'SECURE' | 'TAMPER_DETECTED' | 'UNAUTHORIZED_LEAK';
  integrityScore: number;
  sensorsInspected: number;
  anomaliesFound: number;
  cameraStatus: SensorStateStatus;
  microphoneStatus: SensorStateStatus;
  gpsStatus: SensorStateStatus;
  biometricsStatus: SensorStateStatus;
  firmwareHashVerified: boolean;
  busInterceptionDetected: boolean;
}
