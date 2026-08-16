# PhoneSecure Mobile Guardian (Enterprise Edition v5.2)

> **Next-Generation Zero-Trust Mobile Defense, Heuristic Threat Scanner, Zero-Click Blastdoor Hardening, and Cryptographic Privacy Protection.**

---

## 🛡️ Executive Overview

**PhoneSecure Mobile Guardian** is an enterprise-grade mobile cybersecurity suite engineered to defend mobile devices and web clients against zero-day malware, blastdoor media parser exploits, smishing/phishing scams, rogue public Wi-Fi hotspots, ARP poisoning, credential harvesting, and unauthorized hardware bus access.

Built on an **Express + React 19 + TypeScript** architecture, PhoneSecure unites real-time threat intelligence powered by Google Gemini AI, client-side zero-knowledge cryptography (AES-GCM-256 + PBKDF2), hardware sensor probing via standard Web APIs, deterministic phishing DNA analysis, and exportable forensic PDF audit certification.

---

## ⚡ Core Modules & Implemented Capabilities

### 1. 🔍 Threat Scanner & Heuristic Sandbox
- **SVG Radial Progress Scanner**: Real-time animated gradient ring displaying live percentage progress, active inspection stages, and monitored filesystem paths.
- **APK & Payload Sandbox**: Decompiles uploaded files and packages, evaluating dynamic class loading, illicit permission hooks, and C2 beacons.
- **Scheduled Smart Scans**: Background threat engine with customizable frequencies (Daily, Every 3 Days, Weekly), overnight execution windows, and zero-drain charging/idle locks.
- **Quarantine Vault**: Isolated containment with one-tap restoration or permanent cryptographic file shredding.

### 2. 🛡️ Zero-Click Exploit Hardening & Media Blastdoor
- **Blastdoor Mitigations**: Isolated rendering for MMS, iMessage, and RCS media streams to prevent zero-click RCE payloads (e.g. Pegasus archetypes).
- **Hardening Toggles**: WebGL & JIT compiler lockdown, USB debugging locks, baseband cellular hardening, and NFC proximity shields.
- **Live Exploit Simulation Sandbox**: Interactive testing of WebP chunk heap overflows, TIFF integer wraps, and PDF font parser exploits.

### 3. 👁️ Sensor Privacy & Permission Matrix
- **Hardware Bus Killswitches**: Instant software-level disconnection and DMA buffer clearing for Camera and Microphone sensors.
- **App Permission Matrix**: Auditing and granular revocation of dangerous privileges (SMS, Contacts, Background Location, Accessibility, Overlay).
- **Clipboard Sanitizer**: Automatic memory buffer wipe with configurable expiration timers.

### 4. 🚨 Anti-Theft & Rapid Response Armory
- **Precision GPS Locator**: Live coordinates, accuracy radius, and location history tracking.
- **Decoy Intruder Trap**: Secret automated front-camera snapshot capture upon failed PIN attempts.
- **105dB Deterrent Siren**: High-intensity polyphonic auditory alarm generated via the Web Audio API.
- **Remote Lockdown & Enclave Wipe**: Full-screen lockout overlay requiring recovery credentials, with irreversible remote data wipe simulation.

### 5. 🌐 Network Defense & VPN Gateway
- **Zero-Log VPN Relay**: Multi-node proxy selector (Zurich, Tokyo, Frankfurt, Virginia) with live ping latency and throughput telemetry.
- **Wi-Fi ARP & SSL Stripping Sentry**: Continuous analysis of gateway MAC addresses and certificate spoofing on public networks.
- **DNS Leak Protection**: Enforces DNS-over-HTTPS (DoH) with ad tracker and malicious domain blocking counters.

### 6. 🔐 Encrypted Vault & Application Locker
- **Client-Side Cryptography**: Zero-knowledge encryption with AES-GCM-256 and PBKDF2 key derivation (100,000 iterations).
- **Plausible Deniability (Decoy PIN)**: Dual-PIN architecture (Master vs. Decoy) displaying benign decoy content if forced to unlock.
- **App Locker**: Passcode enforcement on sensitive applications (Banking, WhatsApp, Gallery).

### 7. 🤖 AI Scam & Smishing Advisor
- **Neural Threat Dissection**: Ingests SMS, emails, and scam URLs, leveraging Google Gemini AI (`gemini-3.7-flash`) with structured risk scoring and actionable remediation steps.
- **Interactive Security Advisor**: Conversational cyber consultant answering questions on permissions, SIM-swap protection, and mobile hygiene.
- **Resilient Local Heuristics**: Automated regex and behavioral heuristic fallback for offline or unauthenticated scenarios.

### 8. 📊 Hardware Diagnostics & Forensic PDF/JSON Export
- **Live Web API Sensor Probing**: Validates hardware access across `navigator.mediaDevices`, `navigator.permissions`, `navigator.geolocation`, and `window.PublicKeyCredential`.
- **System Telemetry**: Battery thermals, CPU load, memory utilization, storage volumes, and Knox / Secure Enclave attestation status.
- **Forensic PDF Audit Certificate**: Client-side **jsPDF** engine producing official, tamper-evident PDF reports with cryptographic SHA-256 verification and event timelines.
- **Machine-Readable JSON Dump**: Raw telemetry export for SIEM ingestion and offline forensics.

---

## 🔒 Scope & Product Boundaries: What This Product Does & Does NOT Do

| Feature Area | ✅ What This Product DOES | ❌ What This Product DOES NOT |
| :--- | :--- | :--- |
| **Malware & Threats** | Dissects APK manifests, matches signatures, simulates sandbox analysis, and provides quarantine/shredding. | Does not execute native ring-0 kernel driver modifications or flash OS firmware directly. |
| **Hardware Privacy** | Intercepts Web API media tracks, silences streams, and revokes browser-level hardware permissions. | Does not physically sever electronic motherboard circuits. |
| **Network & VPN** | Simulates multi-region WireGuard relays, monitors ARP table anomalies, and filters DNS domains. | Does not install a native virtual network adapter (TUN/TAP) into the host operating system. |
| **Anti-Theft & SOS** | Generates 105dB synthetic sirens, tracks geolocation, takes intruder snapshots, and logs dispatch telemetry. | Does not place real carrier voice calls to 911 or dispatch physical first responders. |
| **AI Threat Intelligence** | Uses Google Gemini AI and local heuristic engines to dissect smishing and social engineering attacks. | Does not replace human legal or corporate incident response teams. |

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend UI** | React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React |
| **Backend Server** | Node.js, Express, TypeScript (`tsx`), `esbuild` |
| **Forensic PDF** | `jspdf` (Client-side vector report generation) |
| **Audio Sensors** | Web Audio API Real-time Polyphonic Synthesizer |
| **Security & Crypto** | Web Crypto API (AES-GCM-256, SHA-256, PBKDF2) |
| **AI Integration** | Google Gemini API via `@google/genai` |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
# Clone the repository
git clone https://github.com/aegis-security/aegis-mobile-guardian.git

# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

---

## 📄 Documentation Index
- [`AUDIT_REPORT.md`](AUDIT_REPORT.md) — Comprehensive Full-Stack Audit, Gap Analysis & Boundary Definition
- [`API.md`](API.md) — REST API Endpoints and Payloads
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — Defense-in-Depth Architectural Specifications
- [`FORENSIC_ARCHITECTURE.md`](FORENSIC_ARCHITECTURE.md) — Deterministic Phishing DNA & STIX 2.1 Engine
- [`THREAT_MODEL.md`](THREAT_MODEL.md) — STRIDE Threat Model & Scenario Analysis
- [`SECURITY_COMPLIANCE.md`](SECURITY_COMPLIANCE.md) — Regulatory Governance (GDPR, SOC 2, ISO 27001)

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
