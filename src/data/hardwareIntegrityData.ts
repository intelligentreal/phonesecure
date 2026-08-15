import { SensorStateStatus, HardwareSensorAccessLog, SensorType } from '../types/hardwareIntegrity';

export const INITIAL_SENSOR_STATUSES: Record<SensorType, SensorStateStatus> = {
  camera: {
    type: 'camera',
    label: 'Primary Dual CMOS Optical Sensor',
    hardwareDriver: 'qcom,camera-sensor-isp7',
    hardwareAddress: '0x0c000000 (MIPI-CSI2)',
    isPhysicallyActive: false,
    authorizedApp: null,
    state: 'IDLE',
    lastAccessTimestamp: '42 mins ago (System Camera)',
    totalAccessEventsToday: 14,
    unauthorizedAttemptsToday: 1,
    sampleRateOrResolution: '50 MP / 4K UHD 60fps',
    webApiStatus: 'MediaDevices.getUserMedia Available'
  },
  microphone: {
    type: 'microphone',
    label: 'Triple Multi-Beam MEMS Microphone Array',
    hardwareDriver: 'snd_soc_wcd938x_codec',
    hardwareAddress: '0x32001000 (SoundWire Bus 1)',
    isPhysicallyActive: false,
    authorizedApp: null,
    state: 'IDLE',
    lastAccessTimestamp: '12 mins ago (Phone Dialer)',
    totalAccessEventsToday: 38,
    unauthorizedAttemptsToday: 2,
    sampleRateOrResolution: '192 kHz / 24-bit Hi-Res',
    webApiStatus: 'AudioContext / WebAudio Ready'
  },
  gps: {
    type: 'gps',
    label: 'Dual-Band GNSS (L1/L5 Multi-Constellation)',
    hardwareDriver: 'gnss_qcom_l5_loc_api',
    hardwareAddress: '0x17a00000 (PCIe Host Gen3)',
    isPhysicallyActive: true,
    authorizedApp: 'com.google.android.apps.maps (Google Maps)',
    state: 'AUTHORIZED',
    lastAccessTimestamp: 'Active Now',
    totalAccessEventsToday: 112,
    unauthorizedAttemptsToday: 1,
    sampleRateOrResolution: '1.0 Hz High-Precision GeoLock',
    webApiStatus: 'Navigator.geolocation Online'
  },
  biometrics: {
    type: 'biometrics',
    label: 'Titan M2 Hardware Biometrics & 3D Face Enclave',
    hardwareDriver: 'android.hardware.biometrics.fingerprint@2.3',
    hardwareAddress: '0x0e400000 (SPU Isolated Enclave)',
    isPhysicallyActive: false,
    authorizedApp: null,
    state: 'IDLE',
    lastAccessTimestamp: '5 mins ago (System Unlock)',
    totalAccessEventsToday: 46,
    unauthorizedAttemptsToday: 1,
    sampleRateOrResolution: 'FAR < 0.00001% / FIDO2 Level 3+',
    webApiStatus: 'WebAuthn / PublicKeyCredential Supported',
    biometricEnclaveType: 'Ultrasonic In-Display FP'
  }
};

export const INITIAL_HARDWARE_INTEGRITY_LOGS: HardwareSensorAccessLog[] = [
  {
    id: 'HW-SEC-905',
    timestamp: '15:28:19',
    sensor: 'biometrics',
    state: 'UNAUTHORIZED_BLOCKED',
    originProcess: 'com.fake.finance.trojan',
    processUid: 10620,
    isBackground: true,
    severity: 'critical',
    details: 'Unverified background service tried invoking BiometricPrompt without user interaction to hijack FIDO2 credential signing.',
    mitigationTaken: 'Secure Enclave hardware gate severed. Null crypto nonce returned; process sandboxed.',
    cryptographicSignature: '0x88fe31ba008741eef9'
  },
  {
    id: 'HW-SEC-904',
    timestamp: '15:12:04',
    sensor: 'microphone',
    state: 'UNAUTHORIZED_BLOCKED',
    originProcess: 'com.cleaner.speedup.booster',
    processUid: 10482,
    isBackground: true,
    severity: 'critical',
    details: 'Background process attempted direct low-level ALSA PCM capture without foreground notification or active audio session.',
    mitigationTaken: 'Hardware I/O bus hook isolated. Zero-sample silent buffer returned to process.',
    cryptographicSignature: '0x9fa830bf92e104ca81'
  },
  {
    id: 'HW-SEC-903',
    timestamp: '14:48:10',
    sensor: 'camera',
    state: 'UNAUTHORIZED_BLOCKED',
    originProcess: 'com.quickcrypto.tradefree',
    processUid: 10399,
    isBackground: true,
    severity: 'critical',
    details: 'Covert background Camera2 NDK session request initiated while display state was SLEEP (Screen Off).',
    mitigationTaken: 'Optical shutter gate locked. System Alert Window revoked.',
    cryptographicSignature: '0x71ba90ce4821fb39a4'
  },
  {
    id: 'HW-SEC-902',
    timestamp: '13:05:42',
    sensor: 'gps',
    state: 'UNAUTHORIZED_BLOCKED',
    originProcess: 'com.system.fake.analytics',
    processUid: 10512,
    isBackground: true,
    severity: 'high',
    details: 'High-precision GNSS raw NMEA stream requested outside user geofence boundaries during background wake lock.',
    mitigationTaken: 'Precise coordinates obfuscated with synthetic coarse city-center offset (15km fuzzy mask).',
    cryptographicSignature: '0x32cc8910ebf71299df'
  },
  {
    id: 'HW-SEC-901',
    timestamp: '11:20:15',
    sensor: 'gps',
    state: 'AUTHORIZED',
    originProcess: 'com.google.android.apps.maps',
    processUid: 10080,
    isBackground: false,
    severity: 'safe',
    details: 'Foreground navigation session requesting Dual-Frequency L1/L5 position fix.',
    mitigationTaken: 'Authenticated hardware token verified.',
    cryptographicSignature: '0x12bb99ee348001fa77'
  }
];
