# PhoneSecure Forensic Audit — Repository Baseline

**Audit Date:** 2026-08-15  
**Audit Standard:** v1.2.2-F Grounding Directives  
**Target Repository:** https://github.com/intelligentreal/phonesecure  

---

## 1. Environment & Runtime Inventory

- **Runtime Environment:** Node.js `v22.23.1`
- **Package Manager:** npm `10.9.8` (with `bun.lock` present alongside `package.json`)
- **Working Tree State:** Workspace filesystem directly initialized with TypeScript & Vite build toolchain
- **Git Metadata:** Non-git container filesystem mount
- **Production Build Command:** `npm run build` (`vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`)
- **Lint / Typecheck Command:** `npm run lint` (`tsc --noEmit`)
- **Test Framework / Runner:** `npx tsx` executing `EmpiricalTestSuite` (`src/core/test/TestSuite.ts`)
- **Core Test Suite Result:** **170 / 170 passing (0 failures, 14.03 ms)**

---

## 2. Directory Structure & Key Artifacts

```
/
├── .env.example
├── API.md
├── ARCHITECTURE.md
├── AUDIT_REPORT.md
├── BUSINESS_SPECIFICATION.md
├── FORENSIC_ARCHITECTURE.md
├── SECURITY_COMPLIANCE.md
├── THREAT_MODEL.md
├── STEP_8_FORENSIC_AUDIT.md
├── package.json
├── tsconfig.json
├── vite.config.ts
├── server.ts
├── src/
│   ├── components/ (17 UI Views: ThreatScanner, PrivacyShield, ForensicCore, Diagnostics, Vault, etc.)
│   ├── core/
│   │   ├── crypto/ (Sha256.ts)
│   │   ├── dataset/ (ConfigurationResolver, InMemoryDataset, types)
│   │   ├── db/ (ForensicDatabase.ts)
│   │   ├── detection/ (RiskEngine, classification, detectors, registry)
│   │   ├── engine/ (ForensicPipeline.ts)
│   │   ├── export/ (ForensicExporter.ts)
│   │   ├── identity/ (Normalizer.ts)
│   │   ├── persistence/ (PersistenceLedger.ts)
│   │   └── test/ (TestSuite.ts - 170 Empirical Tests)
│   ├── utils/
│   │   ├── audioSensors.ts
│   │   ├── binaryInspector.ts (Real SHA-256, Shannon entropy, magic bytes)
│   │   ├── mediaStreamRig.ts (Live Web Audio Oscilloscope & Track Disabling)
│   │   ├── pdfExport.ts (jsPDF & html2canvas Dossier Generator)
│   │   └── systemProber.ts (W3C Web API Hardware & Sandbox Prober)
│   └── types.ts
```
