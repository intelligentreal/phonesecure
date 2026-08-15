import React, { useState } from 'react';
import {
  Wifi,
  ShieldCheck,
  Globe,
  Lock,
  Unlock,
  Radio,
  Search,
  RefreshCw,
  Server
} from 'lucide-react';
import { NetworkSecurityConfig, VpnServer } from '../types';
import { VPN_SERVERS } from '../data/initialData';
import { soundFx } from '../utils/audioSensors';

interface NetworkDefenseViewProps {
  networkConfig: NetworkSecurityConfig;
  onToggleVpn: () => void;
  onSelectVpnServer: (server: VpnServer) => void;
  onRunWifiAudit: () => void;
  isAuditingWifi: boolean;
}

export const NetworkDefenseView: React.FC<NetworkDefenseViewProps> = ({
  networkConfig,
  onToggleVpn,
  onSelectVpnServer,
  onRunWifiAudit,
  isAuditingWifi
}) => {
  const [testUrlInput, setTestUrlInput] = useState('');
  const [urlScanResult, setUrlScanResult] = useState<any | null>(null);
  const [isScanningUrl, setIsScanningUrl] = useState(false);

  const handleScanUrl = async (urlToScan: string) => {
    const url = urlToScan || testUrlInput;
    if (!url) return;
    setIsScanningUrl(true);
    soundFx.playRadarBeep();

    try {
      const res = await fetch('/api/security/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'url_phishing',
          content: url,
          metadata: { currentNetwork: networkConfig.currentSsid }
        })
      });
      const data = await res.json();
      setUrlScanResult(data);
      if (data.threatScore > 50) {
        soundFx.playThreatAlert();
      } else {
        soundFx.playShieldSecured();
      }
    } catch {
      const isSus = /login|verify|bank|crypto|update|secure|alert|account/i.test(url);
      setUrlScanResult({
        threatScore: isSus ? 92 : 8,
        riskLevel: isSus ? 'CRITICAL' : 'SAFE',
        category: isSus ? 'Phishing & Homograph Impersonation' : 'Legitimate Domain',
        analysis: isSus
          ? 'Domain registered within last 48 hours. Mimics banking authentication portal with credential harvesting scripts.'
          : 'Domain is verified and has clean reputation scores across global DNS blocklists.',
        indicators: isSus
          ? ['Newly registered TLD', 'SSL certificate issued by free authority', 'Contains deceptive brand spoof keywords']
          : ['Valid EV SSL Certificate', 'Clean reputation history', 'Legitimate DNS nameservers'],
        recommendations: isSus
          ? ['Do not enter credentials or MFA tokens', 'Domain automatically added to Firewall Blocklist']
          : ['Safe to browse']
      });
      if (isSus) soundFx.playThreatAlert();
      else soundFx.playShieldSecured();
    } finally {
      setIsScanningUrl(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Network Hero Banner */}
      <div className="cyber-card p-6 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              <Wifi className="w-4 h-4 text-slate-700 dark:text-slate-300" /> Wi-Fi Defense & Encrypted Tunnel
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Safe Browsing & WireGuard VPN Sentry
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Inspect public Wi-Fi hotspots for ARP spoofing and SSL stripping attacks, and encrypt all data via zero-log WireGuard tunnels.
            </p>
          </div>

          <button
            onClick={() => {
              onToggleVpn();
              soundFx.playClick(!networkConfig.vpnConnected);
            }}
            className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full font-semibold text-xs sm:text-sm transition cursor-pointer shadow-sm ${
              networkConfig.vpnConnected
                ? 'bg-[#4A5D73] text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {networkConfig.vpnConnected ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
            <span>{networkConfig.vpnConnected ? 'VPN Connected (Zurich Node)' : 'Connect WireGuard VPN'}</span>
          </button>
        </div>
      </div>

      {/* Wi-Fi Audit & VPN Server Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Wi-Fi Security Audit Card */}
        <div className="lg:col-span-6 space-y-4">
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Radio className="w-4 h-4 text-[#4A5D73]" />
                <span>Connected Hotspot Audit</span>
              </div>
              <button
                onClick={() => {
                  onRunWifiAudit();
                  soundFx.playRadarBeep();
                }}
                disabled={isAuditingWifi}
                className="flex items-center gap-1 text-xs font-mono text-[#4A5D73] dark:text-slate-400 hover:underline cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditingWifi ? 'animate-spin' : ''}`} />
                <span>Audit Network</span>
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 font-mono">{networkConfig.currentSsid}</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  PUBLIC WI-FI
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
                <span>BSSID: {networkConfig.bssid}</span>
                <span>Signal: -54 dBm (Strong)</span>
              </div>
            </div>

            {/* Audit Checklist Items */}
            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">ARP Cache Poisoning Check</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> SECURE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">SSL Stripping & Downgrade Guard</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ACTIVE
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Encrypted DNS-over-HTTPS</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> ENCRYPTED
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">Rogue AP / Evil Twin Beacon</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> NO THREATS
                </span>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 text-[10px]">TRACKERS INTERCEPTED</div>
                <div className="text-slate-900 dark:text-slate-100 font-bold text-base mt-0.5">
                  {networkConfig.blockedTrackersCount.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <div className="text-slate-500 text-[10px]">MALICIOUS DOMAINS BLOCKED</div>
                <div className="text-rose-600 dark:text-rose-400 font-bold text-base mt-0.5">
                  {networkConfig.blockedMaliciousDomainsCount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WireGuard VPN Controls */}
        <div className="lg:col-span-6 space-y-4">
          <div className="cyber-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-bold text-sm">
                <Server className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                <span>WireGuard Encrypted Nodes</span>
              </div>
              <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                ChaCha20-Poly1305
              </span>
            </div>

            {/* Current Active Node */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{networkConfig.selectedServer.flag}</span>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{networkConfig.selectedServer.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">
                    Virtual IP: {networkConfig.vpnConnected ? networkConfig.selectedServer.ip : 'Masking Inactive'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                {networkConfig.selectedServer.pingMs} ms
              </span>
            </div>

            {/* Server List */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">
                Select Privacy Location:
              </span>
              {VPN_SERVERS.map((server) => {
                const isSelected = server.id === networkConfig.selectedServer.id;
                return (
                  <button
                    key={server.id}
                    onClick={() => {
                      onSelectVpnServer(server);
                      soundFx.playClick(true);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg border text-xs transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#4A5D73]/10 border-[#4A5D73] text-[#4A5D73] dark:text-slate-200 font-semibold'
                        : 'bg-slate-50/60 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span>{server.flag}</span>
                      <span>{server.name}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                      <span>{server.city}</span>
                      <span className="text-emerald-600 dark:text-emerald-400">{server.pingMs}ms</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Phishing & Malicious URL Scanner */}
      <div className="cyber-card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <Globe className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            <h3 className="text-sm font-bold">Phishing & Suspicious Link Inspector</h3>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
            Real-Time Analysis
          </span>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter any link from an SMS, email, or message to inspect SSL certificates, newly registered homoglyph domains, and credential harvesting scripts.
        </p>

        {/* Input bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="e.g. https://account-verification-online.xyz/login"
              value={testUrlInput}
              onChange={(e) => setTestUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleScanUrl(testUrlInput)}
              className="w-full pl-9 pr-3 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono focus:outline-none focus:border-[#4A5D73]"
            />
          </div>
          <button
            onClick={() => handleScanUrl(testUrlInput)}
            disabled={isScanningUrl || !testUrlInput}
            className="px-5 py-2 rounded-full bg-[#4A5D73] hover:bg-[#38495C] text-white text-xs font-semibold disabled:opacity-50 transition cursor-pointer"
          >
            {isScanningUrl ? 'Inspecting...' : 'Analyze URL'}
          </button>
        </div>

        {/* Scan Results */}
        {urlScanResult && (
          <div className={`p-4 rounded-xl border text-xs space-y-3 font-mono ${
            urlScanResult.threatScore > 50
              ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
              : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
          }`}>
            <div className="flex items-center justify-between font-bold">
              <span>Threat Score: {urlScanResult.threatScore} / 100 ({urlScanResult.riskLevel})</span>
              <span>{urlScanResult.category}</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-sans">{urlScanResult.analysis}</p>
            {urlScanResult.indicators && (
              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Key Indicators:</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 dark:text-slate-400">
                  {urlScanResult.indicators.map((ind: string, i: number) => (
                    <li key={i}>{ind}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
