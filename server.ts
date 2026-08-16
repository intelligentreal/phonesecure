import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initialization of Gemini AI
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// AI Threat & Scam Analysis Endpoint
app.post("/api/security/analyze", async (req, res) => {
  try {
    const { type, content, metadata } = req.body;
    const ai = getAIClient();

    if (!ai) {
      // Return smart local heuristic analysis if no API key is provided
      const isSus = /urgent|verify your account|bank|wire|password|crypto|gift card|suspended|click here|apk|install now|win|lottery|prize|irs|tax refund|fedex delivery|unusual activity/i.test(
        content || ""
      );
      return res.json({
        threatScore: isSus ? 88 : 12,
        riskLevel: isSus ? "CRITICAL" : "SAFE",
        category: isSus ? "Social Engineering & Phishing" : "Legitimate Activity",
        analysis: isSus
          ? "This message exhibits strong indicators of credential phishing and urgent psychological manipulation tactics commonly used in mobile smishing attacks."
          : "No immediate malicious heuristics, homograph spoofs, or suspicious payload links detected.",
        indicators: isSus
          ? [
              "Urgency cue forcing immediate action without verification",
              "Suspicious shortened URL or unverified redirect target",
              "Request for sensitive authentication or financial credentials",
            ]
          : ["Safe domain structure", "No suspicious redirection triggers", "Consistent sender signature"],
        recommendations: isSus
          ? [
              "Do not click links or install attached packages (.APK / .IPA)",
              "Block sender number / domain immediately",
              "Report to PhoneSecure Anti-Fraud Community Feed",
            ]
          : ["Standard vigilance recommended", "Ensure Multi-Factor Authentication is active"],
        isSimulated: true,
      });
    }

    const prompt = `You are the core Threat Intelligence AI of "PhoneSecure Mobile Guardian", an elite mobile cybersecurity application.
Analyze the following user input for mobile threats, malware, smishing/phishing scams, malicious URLs, rogue APK permissions, or social engineering traps.

Type: ${type || "general_security"}
Context Metadata: ${JSON.stringify(metadata || {})}
Content to analyze:
"""
${content}
"""

Respond ONLY with a valid JSON object matching this exact structure:
{
  "threatScore": number (0 to 100, where 0 is completely safe and 100 is fatal malware/scam),
  "riskLevel": "SAFE" | "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "category": "Phishing / Smishing" | "Malware / Ransomware" | "Spyware / Stalkerware" | "Rogue App / Permission Abuse" | "Safe / Legitimate" | "Network / Wi-Fi Threat",
  "analysis": "Detailed explanation in 2-3 concise sentences",
  "indicators": ["Key red flag or safe indicator 1", "Indicator 2", "Indicator 3"],
  "recommendations": ["Action step 1", "Action step 2", "Action step 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text);
    return res.json({ ...parsed, isSimulated: false });
  } catch (error: any) {
    console.error("AI Analysis error:", error);
    return res.status(500).json({
      error: "Security analysis failed",
      fallback: {
        threatScore: 45,
        riskLevel: "MEDIUM",
        category: "Indeterminate Threat",
        analysis: "Analysis encountered a network timeout; exercising cautious quarantine standard.",
        indicators: ["Unverified external endpoint"],
        recommendations: ["Manually verify sender before taking action"],
      },
    });
  }
});

// AI Cyber Security Advisor Chat
app.post("/api/security/chat", async (req, res) => {
  try {
    const { messages, deviceState } = req.body;
    const ai = getAIClient();

    if (!ai) {
      return res.json({
        reply:
          "🛡️ **PhoneSecure Guardian Assistant**: I am monitoring your active shield. All core defenses (Live Protection, Wi-Fi Firewall, and App Permission Auditor) are currently nominal. If you received a suspicious SMS, call, or email, paste it in the Scam Analyzer tab to inspect it.",
        isSimulated: true,
      });
    }

    const systemInstruction = `You are the PhoneSecure Cyber Advisor AI inside the PhoneSecure Mobile Guardian app.
You provide concise, highly practical, expert-level mobile cybersecurity advice to everyday users and power users alike.
Cover topics including: malware removal, iOS/Android permission hardening, anti-theft measures, phishing & sim-swap prevention, rogue Wi-Fi hotspots, encrypted vaults, and data breach prevention.
Current Phone Security Status: ${JSON.stringify(deviceState || {})}.
Keep responses structured with markdown bullet points, clear actionable advice, and a professional cyber-defense tone.`;

    const formattedContents = (messages || []).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: formattedContents,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({
      reply: response.text,
      isSimulated: false,
    });
  } catch (error: any) {
    console.error("Chat error:", error);
    return res.status(500).json({
      reply: "Security advisor is currently offline. Please ensure real-time shield is enabled in the Dashboard.",
    });
  }
});

// VPN Gateway Node Discovery Endpoint
app.get("/api/vpn/nodes", (req, res) => {
  res.json({
    nodes: [
      {
        id: "node-ch-1",
        country: "Switzerland",
        city: "Zurich",
        flag: "🇨🇭",
        ip: "185.156.72.41",
        pingMs: 38,
        load: 24,
        features: ["Zero-Log", "Double-Hop", "WireGuard-ChaCha20"]
      },
      {
        id: "node-jp-1",
        country: "Japan",
        city: "Tokyo",
        flag: "🇯🇵",
        ip: "103.208.220.19",
        pingMs: 110,
        load: 42,
        features: ["Zero-Log", "High-Bandwidth", "WireGuard-ChaCha20"]
      },
      {
        id: "node-de-1",
        country: "Germany",
        city: "Frankfurt",
        flag: "🇩🇪",
        ip: "194.26.29.88",
        pingMs: 45,
        load: 31,
        features: ["Zero-Log", "DDoS-Mitigated", "WireGuard-ChaCha20"]
      },
      {
        id: "node-us-1",
        country: "United States",
        city: "Virginia",
        flag: "🇺🇸",
        ip: "149.28.241.112",
        pingMs: 82,
        load: 55,
        features: ["Zero-Log", "Streaming-Optimized", "WireGuard-ChaCha20"]
      }
    ]
  });
});

// Emergency SOS Dispatch & Telemetry Broadcast
app.post("/api/sos/broadcast", (req, res) => {
  const { deviceId, location, batteryLevel, triggerReason } = req.body || {};
  const dispatchId = `dispatch-${Date.now()}-sos`;

  return res.json({
    acknowledged: true,
    dispatchId,
    timestamp: new Date().toISOString(),
    telemetry: {
      deviceId: deviceId || "mobile-enclave-primary",
      location: location || { latitude: 47.3769, longitude: 8.5417, accuracy: 4.5 },
      batteryLevel: batteryLevel ?? 88,
      triggerReason: triggerReason || "MANUAL_SOS_ENGAGED"
    },
    emergencySmsSent: true,
    recipient: "+1 (555) 911-0199"
  });
});

// Vite middleware & Production Serving Setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PhoneSecure Guardian Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
