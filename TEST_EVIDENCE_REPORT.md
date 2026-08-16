# Test Evidence Report

---

## 1. Execution Evidence

- **Test Runner**: Node.js `v22.23.1` + `tsx`
- **Command**:
  ```bash
  npx tsx -e "import { EmpiricalTestSuite } from './src/core/test/TestSuite.js'; const r = EmpiricalTestSuite.runAll(); console.log(JSON.stringify({ total: r.total, passed: r.passed, failed: r.failed, durationMs: r.durationMs }, null, 2));"
  ```
- **Exit Code**: `0`
- **Output**:
  ```json
  {
    "total": 170,
    "passed": 170,
    "failed": 0,
    "durationMs": 14.03
  }
  ```

---

## 2. Test Category Breakdown

1. **RFC 3986 Identity Normalization (`ID-NORM-001` .. `030`)**: 30 Tests — **PASS**
2. **Witness Detectors & Datasets (`DET-SIG-001` .. `030`)**: 30 Tests — **PASS**
3. **Risk Arithmetic & Overflow Guard (`RISK-ARITH-001` .. `030`)**: 30 Tests — **PASS**
4. **Classification Thresholds (`CLASS-THRESH-001` .. `025`)**: 25 Tests — **PASS**
5. **DNA Configuration & Registry Strictness (`DNA-INT-001` .. `020`)**: 20 Tests — **PASS**
6. **Forensic Provenance & SHA-256 Reproducibility (`PIPE-PROV-001` .. `035`)**: 35 Tests — **PASS**

**Scope Note:** 170/170 passing empirically verifies the core mathematical and forensic analysis pipeline. UI components, Web Audio APIs, and Express endpoints are verified via browser execution and build compilation.
