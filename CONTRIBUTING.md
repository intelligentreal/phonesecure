# Contributing to Aegis Secure Mobile Guardian

Thank you for your interest in contributing to Aegis Secure! We welcome contributions from developers, security researchers, and designers.

---

## 1. Responsible Vulnerability Disclosure Program (VDP)

If you discover a security vulnerability within the Aegis codebase or infrastructure:
1. **DO NOT** open a public issue.
2. Email your findings with a reproducible Proof of Concept (PoC) to `security@aegis-security.io`.
3. We acknowledge all legitimate reports within **24 hours** and offer bug bounty rewards based on severity:
   - **Critical (Remote Code Execution / Cryptographic Bypass)**: $2,500 - $10,000
   - **High (Privilege Escalation / Data Leak)**: $1,000 - $2,500
   - **Medium (Denial of Service / Logic Flaw)**: $300 - $1,000

---

## 2. Development Guidelines

### Code Formatting & Type Safety
- All code must be strictly typed in TypeScript (`strict: true`).
- Ensure no type errors or linter warnings (`npm run lint`).
- Maintain modular architecture: separate UI components, cryptographic utilities, and backend routes.

### Pull Request Process
1. Fork the repository and create your feature branch: `git checkout -b feature/defense-enhancement`.
2. Commit your changes: `git commit -m "feat: add Knox hardware attestation module"`.
3. Push to your branch and open a Pull Request against `main`.
4. Ensure all CI build checks pass (`npm run build`).
