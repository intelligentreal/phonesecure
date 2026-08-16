# Platform Boundary Audit: Browser Sandbox vs. Host OS

---

## 1. Clear Operational Boundaries

| Subsystem | What is Claimed in UI | What is Actually Executed | Operational Boundary |
|---|---|---|---|
| **Microphone Killswitch** | "Hardware Bus Disconnection" | Disables active browser `MediaStreamAudioSourceNode` and zeroes analyzer buffers | **Browser Sandbox Level** (Cannot cut host OS microphone for external apps). |
| **Camera Killswitch** | "Optical Sensor Shutdown" | Stops active WebRTC video tracks in browser DOM | **Browser Sandbox Level** |
| **System Diagnostics** | "Hardware Core Diagnostics" | Probes `navigator.hardwareConcurrency`, `deviceMemory`, `storage.estimate()` | **W3C Browser API Layer** |
| **Network Defense & VPN** | "WireGuard Kernel Tunnel" | Fetches endpoint status from Express `/api/vpn/nodes` | **Web Presentation Layer** (Browsers cannot create raw network sockets or install TUN devices). |
| **App Permission Matrix** | "Revoke Android Permissions" | Modifies local mock app state in UI | **Web Simulation Layer** (Browsers cannot modify third-party Android APK permissions). |
| **Binary Inspector** | "Deep Bytecode Dissection" | Calculates genuine SHA-256 digest, Shannon entropy (0–8.0), and magic byte headers | **Real Client-Side Static Analysis** |
| **Deterministic Risk Pipeline** | "Forensic Evidence Engine" | Executes 170 deterministic unit-tested rules and generates STIX 2.1 / JSON-LD | **Real Full Execution Pipeline** |
