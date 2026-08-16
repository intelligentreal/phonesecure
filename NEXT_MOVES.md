# Prioritized Engineering Next Moves

---

## Priority Matrix

| Priority | Action Item | Affected Subsystem | Required Change | Evidence / Gate |
|---|---|---|---|---|
| **P0** | **Cryptographic Vault WebCrypto Persistence** | `SecureVaultView.tsx` | Wire actual `PBKDF2` + `AES-GCM-256` key derivation and store encrypted blobs in IndexedDB. | Unit test asserting ciphertext decryption failure on wrong PIN. |
| **P1** | **Web Worker Background Hashing** | `binaryInspector.ts` | Offload heavy multi-megabyte SHA-256 and Shannon entropy byte loops to a dedicated Web Worker. | Non-blocking UI performance benchmark on 50MB APK files. |
| **P1** | **Strict Runtime Schema Validation for AI** | `server.ts` | Use Zod / Ajv to strictly validate Gemini response payloads before returning to client. | Adversarial prompt test returning malformed JSON. |
| **P2** | **Full AndroidManifest.xml Binary Parser** | `binaryInspector.ts` | Parse raw binary AXML chunks from APK zip archives to extract actual declared permissions. | Test on standard `AndroidManifest.xml` byte buffer. |
| **P3** | **Interactive STIX 2.1 Graph Visualizer** | `ForensicCoreView.tsx` | Render visual DAG nodes for STIX `indicator` and `observed-data` relationships. | UI canvas component rendering. |
