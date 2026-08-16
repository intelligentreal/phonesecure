# Cryptography & Vault Audit

**Standard:** NIST SP 800-38D (AES-GCM), RFC 8018 (PBKDF2), W3C Web Cryptography API

---

## 1. Cryptographic Primitives in Repository

### A. SHA-256 Hashing (`src/core/crypto/Sha256.ts` & `src/utils/binaryInspector.ts`)
- **API**: W3C `crypto.subtle.digest('SHA-256', buffer)`
- **Output**: 64-character lowercase hex string.
- **Determinism**: 100% reproducible across all platforms.
- **Status**: **VERIFIED / PRODUCTION-GRADE**

### B. Secure Vault Implementation (`src/components/SecureVaultView.tsx`)
- **Current Mechanism**: React component state holding items, filtered by `isDecoy: boolean`.
- **PIN Verification**: Compared against demo strings `1234` (real) and `9999` (decoy).
- **Plaintext Storage**: In-memory React state (not sent over network, not persisted to remote server).
- **Honest Boundary Classification**: **CLIENT-SIDE UI DEMONSTRATION**.
- **Audit Requirement**: Vault UI must not claim "Hardware-Backed Enclave" unless native Android Keystore bridge is attached. Recommended labeling: *"Client-Side Demonstration Vault"*.

### C. Zero-Knowledge Definition & Claims
- Plaintext data in the current web application does not leave the browser window.
- However, because persistent ciphertext is not yet saved to an encrypted IndexedDB store via `AES-GCM-256` + `PBKDF2`, the application must not be marketed as a production zero-knowledge key manager without explicit disclaimer.
