# Aegis Secure REST API Specification

This document details the backend REST API endpoints exposed by the Aegis Secure server.

---

## Base URL
```
http://localhost:3000/api
```

---

## Endpoints

### 1. System Health & Gateway Check
Returns current server status and active engine telemetry.

- **Method**: `GET`
- **Path**: `/api/health`
- **Headers**: None required

#### Success Response (`200 OK`)
```json
{
  "status": "ok",
  "service": "Aegis Secure Mobile Guardian",
  "version": "5.2.0-enterprise",
  "timestamp": "2026-08-14T22:30:00.000Z",
  "telemetry": {
    "engine": "active",
    "threatDatabaseVersion": "2026.08.14-r4",
    "tunnelNodesOnline": 4
  }
}
```

---

### 2. AI Threat & Scam Analysis
Inspects suspicious text, SMS messages, phishing URLs, or email headers using Google Gemini neural models.

- **Method**: `POST`
- **Path**: `/api/ai-advisor`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "content": "URGENT: Your bank account has been suspended. Click http://secure-bank-verify.cc/login to unlock immediately.",
  "type": "sms"
}
```

#### Success Response (`200 OK`)
```json
{
  "isScam": true,
  "riskLevel": "CRITICAL",
  "threatType": "Smishing & Credential Harvester",
  "analysis": "The message creates false urgency regarding bank account suspension and redirects to an unverified typo-squatted domain (.cc).",
  "indicators": [
    "High-pressure urgent language",
    "Suspicious non-standard TLD (.cc)",
    "Unsolicited account security claim"
  ],
  "recommendations": [
    "Do not click the embedded URL",
    "Block the sending telephone number",
    "Log into your official banking app directly to verify account status"
  ]
}
```

---

### 3. VPN Gateway Node Discovery
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
      "ip": "185.156.72.41",
      "pingMs": 42,
      "load": 28,
      "features": ["Zero-Log", "Double-Hop", "Tor-Over-VPN"]
    },
    {
      "id": "node-jp-1",
      "country": "Japan",
      "city": "Tokyo",
      "ip": "103.208.220.19",
      "pingMs": 110,
      "load": 45,
      "features": ["Zero-Log", "High-Bandwidth"]
    }
  ]
}
```

---

### 4. Emergency SOS Dispatch & Telemetry Beacon
Dispatches emergency location coordinates and triggers distress sirens.

- **Method**: `POST`
- **Path**: `/api/sos/broadcast`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "deviceId": "s24-ultra-knox-alpha7",
  "timestamp": "2026-08-14T22:35:10.000Z",
  "location": {
    "latitude": 47.3769,
    "longitude": 8.5417,
    "accuracy": 4.2
  },
  "batteryLevel": 84,
  "triggerReason": "MANUAL_SOS_ENGAGED"
}
```

#### Success Response (`200 OK`)
```json
{
  "acknowledged": true,
  "dispatchId": "dispatch-994102-sos",
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
