# Phone Secure: Forensic Phishing Intelligence Engine (v1.2.2-F)

## 1. Executive & Technical Architecture

The **Phone Secure Forensic Intelligence Engine** provides deterministic, mathematically verifiable phishing threat detection for mobile and enterprise clients. It operates strictly without unverified heuristics or dynamic model drift by using an **authoritative, frozen DNA configuration blueprint**.

```
[ Raw Observation Input ]
          │
          ▼
[ RFC 3986 Identity Normalizer ]
    • Strips UserInfo credentials (user:pass@)
    • Standardizes Default Ports (80, 443)
    • Punycode / Public Suffix extraction (tldts)
          │
          ▼
[ Configuration Resolver ]
    • Ratifies Schema v1.0.0 & Active State
    • Bijective Dataset Validation
          │
          ▼
[ Witness Detectors (Registry) ]
    ├─ PUNYCODE (v1.0.0) [DOMAIN]
    ├─ RISKY_TLD (v1.0.0) [DOMAIN] (Authorized Dataset: risky_tlds v1.0.0)
    ├─ ENTROPY_HIGH (v1.0.0) [DOMAIN] (Shannon Entropy DGA analysis)
    ├─ EXT_FORM (v1.0.0) [CONTENT] (Telemetry Form Action)
    └─ IP_AS_HOST (v1.0.0) [INFRASTRUCTURE] (RFC 1918 & IPv4/v6)
          │
          ▼
[ Pure Integer Risk Engine ]
    • Exact Integer Multiplication: Math.floor((weight * conf) / 100)
    • MAX_SAFE_INTEGER Overflow Protections
    • Family Caps (DOMAIN: 50, INFRASTRUCTURE: 30, CONTENT: 40, RELATIONSHIP: 30)
    • Monotonic Threshold Mapping (MALICIOUS: >= 75, SUSPICIOUS: >= 40, SAFE: < 40)
          │
          ▼
[ Cryptographic Provenance & Ledger Persistence ]
    • SHA-256 Provenance Hash (Web Crypto + Sync Fallback)
    • Transactional Multi-table Insertion (verdicts, evidence)
    • Exportable Threat Intelligence (STIX 2.1 & JSON-LD Legal Dossiers)
```

---

## 2. Invariant Specifications

### A. Strict Integer Math
All calculations conform to:
$$\text{contribution}_i = \left\lfloor \frac{\text{weight}_i \times \text{confidence}_i}{100} \right\rfloor$$
$$\text{family\_score}_f = \min\left(\text{cap}_f, \sum_{i \in f} \text{contribution}_i\right)$$
$$\text{overall\_score} = \min\left(100, \sum_f \text{family\_score}_f\right)$$

### B. Classification Thresholds
- **MALICIOUS**: Score $\ge 75$
- **SUSPICIOUS**: $40 \le \text{Score} < 75$
- **SAFE**: Score $< 40$

### C. Threat Intelligence Export
- **STIX 2.1**: Standard OASIS Threat Intelligence Bundle containing `url`, `domain-name`, `indicator`, and `observed-data` observables.
- **JSON-LD**: W3C Schema.org compliant structured legal evidence record.

---

## 3. Empirical Test Suite Coverage (170 Vectors)

| Category | Count | Status | Verification Criteria |
| :--- | :--- | :--- | :--- |
| **Identity & Normalization** | 30 | `PASS` | RFC 3986 userinfo stripping, port removal, punycode flag, FQDN trailing dot cleaning |
| **Witness Detectors** | 30 | `PASS` | `PUNYCODE`, `RISKY_TLD`, `EXT_FORM`, `IP_AS_HOST`, `ENTROPY_HIGH` evaluation |
| **Risk Arithmetic & Overflow Guard** | 30 | `PASS` | Safe integer math, cap clamping, `CalculationError` on overflow bounds |
| **Classification Thresholds** | 25 | `PASS` | Boundary conditions across entire $[0, 100]$ score domain |
| **DNA Configuration & Registry** | 20 | `PASS` | Schema v1.0.0 enforcement, 5-signal bijection, cap immutability |
| **Forensic Provenance & STIX** | 35 | `PASS` | SHA-256 cryptographic provenance replay, STIX 2.1 object integrity |
