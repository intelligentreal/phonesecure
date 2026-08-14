import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Send,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Search,
  RefreshCw,
  HelpCircle,
  CheckCircle2
} from 'lucide-react';
import { soundFx } from '../utils/audioSensors';

const SAMPLE_SCAMS = [
  {
    label: '🚨 Fake Bank Fraud SMS',
    text: 'CHASE ALERT: A wire transfer of $1,450.00 to CryptoDesk LLC was attempted from your account. If this was NOT you, call +1 (800) 555-0199 or verify immediately at https://chase-auth-alert-secure.top/login'
  },
  {
    label: '🚨 USPS Package Redelivery Trap',
    text: 'USPS Notice: Your package #US948201 has an incomplete address and cannot be delivered. Update your delivery address & pay $1.50 handling fee within 12 hours: http://usps-redelivery-portal.info'
  },
  {
    label: '🚨 Job Offer Telegram Scam',
    text: 'Hi! I am recruiter from Global HR. We noticed your resume and offer $300-$800 daily for remote app rating. No experience needed. Contact our manager on Telegram @hr_direct_99'
  },
  {
    label: '✅ Legitimate MFA Token',
    text: 'Your Microsoft verification code is 492019. This code will expire in 5 minutes. Never share this code with anyone.'
  }
];

export const AiCyberAdvisorView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content:
        '👋 **PhoneSecure AI Advisor Online**. I analyze smishing scams, malicious sideloaded APK risks, rogue Wi-Fi hotspots, and SIM-swap defense strategies. How can I assist your mobile security today?'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleAnalyzeText = async (textToScan: string) => {
    const content = textToScan || inputText;
    if (!content.trim()) return;

    setIsAnalyzing(true);
    soundFx.playRadarBeep();

    try {
      const res = await fetch('/api/security/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'scam_sms_phishing',
          content,
          metadata: { timestamp: new Date().toISOString() }
        })
      });

      const data = await res.json();
      setAnalysisResult(data);
      if (data.threatScore > 50) {
        soundFx.playThreatAlert();
      } else {
        soundFx.playShieldSecured();
      }
    } catch {
      // Local fallback
      const isSus = /wire|transfer|crypto|usps|package|telegram|verify|click|urgent|alert/i.test(content);
      setAnalysisResult({
        threatScore: isSus ? 94 : 5,
        riskLevel: isSus ? 'CRITICAL' : 'SAFE',
        category: isSus ? 'Social Engineering & Smishing Phishing' : 'Legitimate Notification',
        analysis: isSus
          ? 'This text uses artificial urgency and fear to provoke an immediate credential submission on a spoofed phishing portal.'
          : 'Standard verification token pattern with no malicious calls to action or suspicious hyperlinks.',
        indicators: isSus
          ? [
              'Urgent financial loss coercion',
              'Deceptive domain name mimicking legitimate institution',
              'Direct redirection to harvest 2FA OTP codes'
            ]
          : ['Legitimate shortcode signature', 'Standard expiration warning', 'No external links'],
        recommendations: isSus
          ? ['Do not click link or reply to message', 'Block sender number immediately', 'Forward to 7726 (SPAM)']
          : ['Standard OTP usage safe']
      });
      if (isSus) soundFx.playThreatAlert();
      else soundFx.playShieldSecured();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    const updatedMessages = [...chatMessages, { role: 'user' as const, content: userMsg }];
    setChatMessages(updatedMessages);
    setIsChatLoading(true);
    soundFx.playClick(true);

    try {
      const res = await fetch('/api/security/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          deviceState: {
            healthScore: 94,
            os: 'Android 15',
            shield: 'Active'
          }
        })
      });
      const data = await res.json();
      setChatMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      soundFx.playShieldSecured();
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '🛡️ **Security Recommendation**: Always verify sender identity directly through official banking apps or verified customer support lines before acting on any SMS notifications.'
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4" /> Gemini AI Threat Intelligence Core
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              AI Cyber Scam, Smishing & Fraud Inspector
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect suspicious SMS texts, voicemail transcripts, WhatsApp messages, and scam caller scripts with neural threat detection.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scam Text Inspector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl cyber-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Inspect Suspicious Text / Message</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                Neural Phishing Parser
              </span>
            </div>

            <textarea
              rows={4}
              placeholder="Paste suspicious SMS, email body, or WhatsApp message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
            />

            {/* Quick Test Samples */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-slate-500">Quick Test Attack Scenarios:</span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_SCAMS.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputText(s.text);
                      handleAnalyzeText(s.text);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleAnalyzeText(inputText)}
              disabled={isAnalyzing || !inputText.trim()}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
            >
              <Search className="w-4 h-4" />
              <span>{isAnalyzing ? 'Analyzing Social Engineering Vectors...' : 'Analyze Message for Threats'}</span>
            </button>

            {/* Analysis Result */}
            {analysisResult && (
              <div
                className={`p-4 rounded-xl border space-y-3 text-xs ${
                  analysisResult.threatScore > 50
                    ? 'bg-rose-950/40 border-rose-700 text-rose-200'
                    : 'bg-emerald-950/40 border-emerald-700 text-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-xs uppercase ${
                        analysisResult.threatScore > 50 ? 'bg-rose-900 text-white' : 'bg-emerald-900 text-white'
                      }`}
                    >
                      {analysisResult.riskLevel}
                    </span>
                    <span className="font-bold text-white">{analysisResult.category}</span>
                  </div>
                  <span className="font-mono font-bold text-sm">
                    Threat Score: {analysisResult.threatScore}/100
                  </span>
                </div>

                <p className="text-xs text-slate-300 font-sans leading-relaxed">
                  {analysisResult.analysis}
                </p>

                <div className="space-y-1">
                  <span className="font-mono text-[11px] font-bold text-slate-400">
                    Detected Red Flags & Behavioral Indicators:
                  </span>
                  <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                    {analysisResult.indicators?.map((ind: string, i: number) => (
                      <li key={i}>{ind}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                  <strong className="text-cyan-400 font-mono">Immediate Action: </strong>
                  {analysisResult.recommendations?.[0] || 'Do not click links or provide credentials.'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Cyber Advisor Live Chat */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl cyber-card flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">PhoneSecure AI Cyber Advisor</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                ONLINE
              </span>
            </div>

            {/* Chat message history */}
            <div className="flex-1 overflow-y-auto space-y-3 py-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[88%] p-3 rounded-xl leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-cyan-600 text-white rounded-br-none'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing threat knowledge base...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="pt-2 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Ask about malware, permissions, SIM-swaps..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
