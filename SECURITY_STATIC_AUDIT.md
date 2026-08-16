# Security-Critical Static Audit

**Audit Scope:** Full codebase scan for unsafe typecasts, non-null assertions, secret exposures, and runtime risks.  
**TypeScript Compiler Check:** `tsc --noEmit` $\rightarrow$ 0 syntax/type errors.

---

## Findings & Classifications

| File | Line / Location | Construct | Classification | Risk | Remediation / Note |
|---|---|---|---|---|---|
| `server.ts` | 55-60 | `process.env.GEMINI_API_KEY` | Environment Variable | Low | Correctly kept server-side only; never exposed via `VITE_` prefix. |
| `server.ts` | 80-120 | Unchecked AI Prompt Interpolation | Dynamic Prompt Construction | Medium | Sanitized with JSON extraction regex; fallback heuristic prevents service collapse on invalid AI output. |
| `src/core/detection/RiskEngine.ts` | 40-75 | `Number.isSafeInteger()` | Strict Type Assertion | Safe | Defense-in-depth integer assertion preventing floating point precision errors. |
| `src/core/identity/Normalizer.ts` | 45-50 | `new URL(...)` try/catch | Error Boundary | Safe | Handles non-standard input strings safely without unhandled exception throws. |
| `src/utils/mediaStreamRig.ts` | 40-55 | `window.AudioContext || webkitAudioContext` | Vendor Prefix Cast | Low | Standard cross-browser fallback pattern for Web Audio API. |
| `src/utils/systemProber.ts` | 20-40 | `navigator.deviceMemory`, `navigator.connection` | Optional Web API Casts | Low | Properly guarded with optional chaining and fallback bounds. |
| `src/components/SecureVaultView.tsx` | 55-75 | Hardcoded Demo PINs (`1234` / `9999`) | UI Simulation Mock | Informational | Explicitly marked as client-side UI simulation in truth matrix. |
