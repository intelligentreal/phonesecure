# Aegis Secure Architecture & System Specifications

## 1. High-Level Architecture Overview

Aegis Secure implements a **Defense-in-Depth, Zero-Trust Mobile Security Architecture**. The platform isolates untrusted applications and payloads while enforcing strict local hardware controls and server-side threat intelligence verification.

```
+-------------------------------------------------------------------------+
|                         Aegis Mobile Client UI                          |
|  (React 19 + TypeScript + Motion Engine + Tailwind CSS v4 + Web Audio)  |
+------------------------------------+------------------------------------+
                                     |
               +---------------------+---------------------+
               |                                           |
+--------------v---------------+           +---------------v--------------+
|     Local Heuristic Engine   |           |    Zero-Knowledge Crypto     |
| - Signature Hash DB          |           | - AES-GCM-256                |
| - Background Sensor Monitor  |           | - PBKDF2 (100k iterations)   |
| - ARP / Gateway Sentry       |           | - Decoy PIN Storage Matrix   |
+--------------+---------------+           +---------------+--------------+
               |                                           |
+--------------v-------------------------------------------v--------------+
|                        Express Server Gateway                           |
|       (/api/ai-advisor, /api/health, /api/vpn, /api/telemetry)          |
+------------------------------------+------------------------------------+
                                     |
               +---------------------+---------------------+
               |                                           |
+--------------v---------------+           +---------------v--------------+
|       Google Gemini AI       |           |  WireGuard Tunneling Nodes   |
|   (Neural Smishing Parser)   |           |  (Zurich, Tokyo, Frankfurt)  |
+------------------------------+           +------------------------------+
```

---

## 2. Core Security Subsystems

### 2.1 Threat Detection & Isolation Pipeline
1. **Payload Intake**: File hashes (SHA-256) and APK manifests are ingested via drag-and-drop or filesystem scans.
2. **Signature Matching**: Payloads are compared against high-risk trojan and spyware signatures (e.g., Pegasus, Hermit, Joker).
3. **Heuristic Risk Scoring**: Evaluates requested runtime permissions, obfuscated code execution, and unverified C2 domains.
4. **Quarantine Sandbox**: Modifies execution permissions to isolate malicious packages from OS process schedulers.

### 2.2 Privacy & Sensor Sentry
- **Hardware Interception**: Emulates hardware killswitches by intercepting `navigator.mediaDevices` streams and injecting black frames or silence buffers.
- **Permission Matrix**: Maintains an active permission ledger, flagging high-risk combinations (e.g., Accessibility + SMS Read + Overlay permissions).
- **Clipboard Sanitizer**: Runs a periodic memory buffer sweep to overwrite transient secrets.

### 2.3 Cryptographic Vault Subsystem
- **Cipher**: AES-GCM (Galois/Counter Mode) with 256-bit keys.
- **Key Derivation**: PBKDF2 with HMAC-SHA256, 100,000 iterations, and unique 16-byte cryptographic salts per record.
- **Plausible Deniability (Deniable Encryption)**:
  - **Master PIN**: Decrypts the complete vault store.
  - **Decoy PIN**: Unlocks a fabricated, benign mock database without exposing the existence of the primary vault.

### 2.4 WireGuard VPN & Network Defense
- **Protocol**: WireGuard UDP with ChaCha20-Poly1305 encryption.
- **Zero-Log Assurance**: Network nodes operate in stateless RAM mode with automated session key rotation every 180 seconds.
- **ARP Spoof Detection**: Compares default gateway MAC addresses with cached hardware profiles.

---

## 3. Threat Classification & Response Matrix

| Severity | Definition | Action Taken |
| :--- | :--- | :--- |
| **Critical** | Zero-click spyware, rootkits, remote shell APKs | Instant process termination, isolation, and alert sound |
| **High** | Credential stealers, background audio snooping | Permission revocation and user confirmation prompt |
| **Medium** | Aggressive adware, trackware, unencrypted HTTP traffic | Automated traffic diversion and cache purge |
| **Low** | Dormant permissions, stale cache files | Optimization recommendation |

---

## 4. Performance & Resource Constraints
- **Idle Memory Footprint**: < 45 MB RAM.
- **Active Scanning CPU Overhead**: < 8% peak load.
- **Cold Start Latency**: < 350ms.
