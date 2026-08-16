# PhoneSecure Mobile Guardian REST API Specification

This document details the backend REST API endpoints exposed by the PhoneSecure Guardian server (`server.ts`).

---

## Base URL
```
http://localhost:3000/api
```

---

## Endpoints

### 1. System Health & Gateway Check
Returns current server operational status, Gemini API key presence, and timestamp.

- **Method**: `GET`
- **Path**: `/api/health`
- **Headers**: None required

#### Success Response (`200 OK`)
```json
{
  "status": "ok",
  "hasGeminiKey": true,
  "timestamp": "2026-08-15T18:00:00.000Z"
}
```

---

### 2. AI Threat & Scam Analysis
Inspects suspicious text, SMS messages, phishing URLs, or APK metadata using Google Gemini (`gemini-3.7-flash`) with structured JSON schema or offline heuristics fallback.

- **Method**: `POST`
- **Path**: `/api/security/analyze`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "type": "scam_sms_phishing",
  "content": "CHASE ALERT: A wire transfer of $1,450.00 was attempted. If NOT you, verify at https://chase-auth-alert.top",
  "metadata": { "timestamp": "2026-08-15T18:00:00.000Z" }
}
```

#### Success Response (`200 OK`)
```json
{
  "threatScore": 94,
  "riskLevel": "CRITICAL",
  "category": "Phishing / Smishing",
  "analysis": "The message creates artificial urgency regarding unauthorized wire transfers to harvest banking credentials via an unverified top-level domain.",
  "indicators": [
    "Urgent financial loss coercion",
    "Spoofed bank authentication link",
    "High-risk non-banking TLD"
  ],
  "recommendations": [
    "Do not click the embedded link",
    "Block the sending telephone number immediately",
    "Forward to 7726 (SPAM)"
  ],
  "isSimulated": false
}
```

---

### 3. AI Cyber Security Advisor Live Chat
Conversational mobile cybersecurity assistant answering queries on threat remediation, permissions, and device hardening.

- **Method**: `POST`
- **Path**: `/api/security/chat`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "messages": [
    { "role": "user", "content": "How do I protect against Pegasus zero-click spyware on Android?" }
  ],
  "deviceState": {
    "healthScore": 94,
    "os": "Android 15",
    "shield": "Active"
  }
}
```

#### Success Response (`200 OK`)
```json
{
  "reply": "🛡️ **PhoneSecure Zero-Click Mitigation Protocol**:\n- Keep OS security patches updated monthly.\n- Disable auto-downloading of MMS/RCS attachments.\n- Enable Lockdown Mode to restrict JIT compiling and WebGL parsers.\n- Reboot device daily to flush non-persistent memory payloads.",
  "isSimulated": false
}
```

---

### 4. VPN Gateway Node Discovery
Retrieves available zero-log WireGuard proxy servers and current latency metrics.

- **Method**: `GET`
- **Path**: `/api/vpn/nodes`
- **Headers**: None required

#### Success Response (`200 OK`)
```json
{
  "nodes": [
    {
      "id": "node-ch-1",
      "country": "Switzerland",
      "city": "Zurich",
      "flag": "🇨🇭",
      "ip": "185.156.72.41",
      "pingMs": 38,
      "load": 24,
      "features": ["Zero-Log", "Double-Hop", "WireGuard-ChaCha20"]
    }
  ]
}
```

---

### 5. Emergency SOS Dispatch & Telemetry Beacon
Dispatches emergency location coordinates and triggers distress sirens.

- **Method**: `POST`
- **Path**: `/api/sos/broadcast`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "deviceId": "s24-ultra-knox-alpha7",
  "location": {
    "latitude": 47.3769,
    "longitude": 8.5417,
    "accuracy": 4.5
  },
  "batteryLevel": 88,
  "triggerReason": "MANUAL_SOS_ENGAGED"
}
```

#### Success Response (`200 OK`)
```json
{
  "acknowledged": true,
  "dispatchId": "dispatch-1755280000000-sos",
  "timestamp": "2026-08-15T18:00:00.000Z",
  "telemetry": {
    "deviceId": "s24-ultra-knox-alpha7",
    "location": { "latitude": 47.3769, "longitude": 8.5417, "accuracy": 4.5 },
    "batteryLevel": 88,
    "triggerReason": "MANUAL_SOS_ENGAGED"
  },
  "emergencySmsSent": true,
  "recipient": "+1 (555) 911-0199"
}
```

---

## Error Codes

| HTTP Status | Code | Meaning |
| :--- | :--- | :--- |
| `400` | `INVALID_PAYLOAD` | Request body missing mandatory parameters |
| `401` | `UNAUTHORIZED` | Invalid or missing authentication bearer token |
| `429` | `RATE_LIMIT_EXCEEDED` | Exceeded API quota (100 req/min) |
| `500` | `INTERNAL_SECURITY_ERROR` | An unexpected server-side exception occurred |
