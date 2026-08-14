# Aegis Secure Privacy Policy

**Effective Date**: August 14, 2026

---

## 1. Our Commitment to Zero-Knowledge Privacy
At Aegis Security, your privacy is paramount. We believe privacy is a fundamental human right. Our architecture is deliberately engineered such that **we cannot read your encrypted vault secrets, track your location histories, or log your internet traffic**.

---

## 2. Information We Process

### 2.1 On-Device Processing (Zero Cloud Retention)
- **Malware Scans**: Package inspection and heuristic tests occur strictly on your local device CPU. File contents are never uploaded to our servers.
- **Hardware Killswitches**: Camera and microphone stream suppressions are executed directly within the device memory layer.
- **Encrypted Vault**: Vault files and credentials are encrypted using your master key via client-side AES-GCM-256 before touching storage.

### 2.2 VPN Zero-Log Policy
- **No IP Logging**: We do not record source IP addresses, destination IP addresses, or connection timestamps.
- **No Browsing History**: We never monitor, store, or inspect DNS queries or HTTP/HTTPS request headers.
- **RAM-Only Nodes**: All VPN servers operate in volatile RAM. No persistent disk writes take place.

### 2.3 AI Threat Analysis (Opt-in)
- When you submit suspicious text to the AI Threat Advisor, the payload is sanitized and evaluated using Google Gemini models. Transmitted text is strictly used for immediate inference and is never stored, sold, or used for model training without your explicit authorization.

---

## 3. Data Subject Rights (GDPR & CCPA)
You have the right to:
- Request immediate purge of any account metadata.
- Export your locally encrypted backups.
- Exercise total control over on-device data via the instant **Remote Wipe** mechanism.

---

## 4. Contact Information
For security or privacy inquiries, contact our Data Protection Officer at: `dpo@aegis-security.io`.
