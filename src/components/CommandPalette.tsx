import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Shield,
  ShieldAlert,
  ScanSearch,
  EyeOff,
  Crosshair,
  Wifi,
  Lock,
  Bot,
  Binary,
  Activity,
  Zap,
  RefreshCw,
  AlertOctagon,
  Volume2,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { ActiveTabType } from '../types';
import { soundFx } from '../utils/audioSensors';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTabType) => void;
  onStartScan: () => void;
  onCleanCache: () => void;
  onToggleVpn: () => void;
  onOpenSos: () => void;
  vpnConnected: boolean;
}

interface CommandItem {
  id: string;
  category: 'Security Modules' | 'Tactical Actions' | 'System Controls';
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  action: () => void;
  badge?: string;
  badgeColor?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onStartScan,
  onCleanCache,
  onToggleVpn,
  onOpenSos,
  vpnConnected
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or handled by parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allCommands: CommandItem[] = [
    {
      id: 'nav-dashboard',
      category: 'Security Modules',
      title: 'Real-Time Protection Center',
      subtitle: 'Live attack telemetry, security score index, and background guardian',
      icon: <Shield className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate('dashboard');
        onClose();
      },
      badge: 'HUD'
    },
    {
      id: 'nav-scanner',
      category: 'Security Modules',
      title: 'Threat Scanner & Sandbox Isolator',
      subtitle: 'Deep heuristic scan for trojans, spyware, and suspicious APK packages',
      icon: <ScanSearch className="w-4 h-4 text-rose-400" />,
      action: () => {
        onNavigate('scanner');
        onClose();
      }
    },
    {
      id: 'nav-zero_click',
      category: 'Security Modules',
      title: 'Zero-Click & Pegasus Exploit Hardening',
      subtitle: 'BLASTPASS, ForcedEntry mitigation, media sandbox parsing, and lockdown',
      icon: <ShieldAlert className="w-4 h-4 text-indigo-400" />,
      action: () => {
        onNavigate('zero_click');
        onClose();
      },
      badge: 'PEGASUS'
    },
    {
      id: 'nav-privacy',
      category: 'Security Modules',
      title: 'Privacy Guard & Hardware Killswitches',
      subtitle: 'Hardware camera/mic blockers, clipboard protection, and permission manager',
      icon: <EyeOff className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('privacy');
        onClose();
      }
    },
    {
      id: 'nav-antitheft',
      category: 'Security Modules',
      title: 'Anti-Theft Command & Remote Recovery',
      subtitle: 'Precision GPS satellite tracker, 105dB siren, and intruder camera trap',
      icon: <Crosshair className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onNavigate('antitheft');
        onClose();
      },
      badge: 'GPS'
    },
    {
      id: 'nav-network',
      category: 'Security Modules',
      title: 'Safe Browsing & WireGuard VPN Tunnel',
      subtitle: 'Encrypted tunnel nodes, ARP spoofing sentry, and phishing URL analyzer',
      icon: <Wifi className="w-4 h-4 text-emerald-400" />,
      action: () => {
        onNavigate('network');
        onClose();
      }
    },
    {
      id: 'nav-vault',
      category: 'Security Modules',
      title: 'Encrypted Vault & Decoy PIN Chamber',
      subtitle: 'AES-GCM-256 client-side encrypted storage for sensitive documents and notes',
      icon: <Lock className="w-4 h-4 text-blue-400" />,
      action: () => {
        onNavigate('vault');
        onClose();
      },
      badge: 'AES-256'
    },
    {
      id: 'nav-ai_advisor',
      category: 'Security Modules',
      title: 'AI Cyber Threat Advisor & Smishing Guard',
      subtitle: 'Neural SMS phishing inspection, invoice trap analysis, and AI defense consultant',
      icon: <Bot className="w-4 h-4 text-purple-400" />,
      action: () => {
        onNavigate('ai_advisor');
        onClose();
      },
      badge: 'AI'
    },
    {
      id: 'nav-forensic',
      category: 'Security Modules',
      title: 'Forensic DNA & Sandbox Analyzer',
      subtitle: 'Binary header disassembly, entropy calculator, and IOC matching database',
      icon: <Binary className="w-4 h-4 text-pink-400" />,
      action: () => {
        onNavigate('forensic');
        onClose();
      }
    },
    {
      id: 'nav-diagnostics',
      category: 'Security Modules',
      title: 'Hardware & Sensor Integrity Attestation',
      subtitle: 'Kernel bus attestation, Web API verification, RAM optimizer, and thermals',
      icon: <Activity className="w-4 h-4 text-amber-400" />,
      action: () => {
        onNavigate('diagnostics');
        onClose();
      }
    },
    // Tactical Actions
    {
      id: 'action-scan',
      category: 'Tactical Actions',
      title: 'Initiate Full Deep Heuristic System Scan',
      subtitle: 'Triggers on-demand sandbox audit across all APK signatures and storage',
      icon: <Zap className="w-4 h-4 text-amber-400" />,
      action: () => {
        onStartScan();
        onClose();
      },
      badge: 'SCAN'
    },
    {
      id: 'action-vpn',
      category: 'Tactical Actions',
      title: vpnConnected ? 'Disconnect WireGuard VPN Tunnel' : 'Connect WireGuard Encrypted Tunnel',
      subtitle: vpnConnected ? 'Terminate encrypted ChaCha20-Poly1305 routing' : 'Route all traffic via zero-log Swiss relay node',
      icon: <Wifi className={`w-4 h-4 ${vpnConnected ? 'text-rose-400' : 'text-emerald-400'}`} />,
      action: () => {
        onToggleVpn();
        onClose();
      },
      badge: vpnConnected ? 'DISCONNECT' : 'CONNECT'
    },
    {
      id: 'action-cache',
      category: 'Tactical Actions',
      title: 'Purge Temporary Caches & Orphaned Payloads',
      subtitle: 'Frees volatile application caches and shred temporary memory buffers',
      icon: <RefreshCw className="w-4 h-4 text-cyan-400" />,
      action: () => {
        onCleanCache();
        onClose();
      }
    },
    {
      id: 'action-sos',
      category: 'Tactical Actions',
      title: 'Trigger Emergency SOS Tactical Panel',
      subtitle: 'Open emergency distress protocols, 105dB strobe alarm, and GPS SMS beacon',
      icon: <AlertOctagon className="w-4 h-4 text-rose-400" />,
      action: () => {
        onOpenSos();
        onClose();
      },
      badge: 'PANIC'
    }
  ];

  const filteredCommands = allCommands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-xl transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-2xl bg-[#0B0F17] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[80vh] shadow-blue-500/10"
        >
          {/* Top Search Input Bar */}
          <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-[#070A10]">
            <Search className="w-4 h-4 text-blue-400 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type to search security modules, tactical triggers, or tools..."
              className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none font-mono"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block ml-2 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-800/80 border border-slate-700 rounded-md">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm font-mono space-y-2">
                <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No matching security modules found for "{query}".</p>
                <p className="text-xs text-slate-500">Try searching for "Scanner", "Pegasus", "Killswitch", "Vault", or "VPN".</p>
              </div>
            ) : (
              filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  onClick={() => {
                    soundFx.playClick(true);
                    cmd.action();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-slate-800/70 border border-transparent hover:border-slate-700/80 flex items-center justify-between gap-3 group transition cursor-pointer"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2.5 rounded-lg bg-slate-900/90 group-hover:bg-blue-600/20 group-hover:text-blue-300 transition shrink-0 border border-slate-800">
                      {cmd.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white group-hover:text-blue-400 transition truncate font-display">
                          {cmd.title}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-slate-400 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 font-sans">
                        {cmd.subtitle}
                      </p>
                    </div>
                  </div>

                  {cmd.badge && (
                    <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-300 border border-blue-800/60 shadow-sm">
                      {cmd.badge}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer Bar */}
          <div className="px-4 py-2.5 bg-[#070A10] border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Aegis Cyber HUD • All 10 Modules Armed</span>
            <div className="flex items-center gap-3">
              <span>Use <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 text-[10px]">↑</kbd> <kbd className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-300 text-[10px]">↓</kbd> to navigate</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
