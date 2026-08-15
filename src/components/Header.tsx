import React from 'react';
import { ShieldCheck, ShieldAlert, Volume2, VolumeX, AlertOctagon, Wifi, Search, Shield, Zap } from 'lucide-react';
import { soundFx } from '../utils/audioSensors';

interface HeaderProps {
  healthScore: number;
  threatCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSos: () => void;
  vpnConnected: boolean;
  onOpenCommandPalette?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  healthScore,
  threatCount,
  isMuted,
  onToggleMute,
  onOpenSos,
  vpnConnected,
  onOpenCommandPalette
}) => {
  const isHealthy = healthScore >= 80 && threatCount === 0;

  return (
    <header className="border-b border-slate-800/80 bg-[#070B12]/90 backdrop-blur-xl sticky top-0 z-40 px-4 py-3 sm:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/30 border border-blue-400/30">
            <Shield className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isHealthy ? 'bg-emerald-500 shadow-[0_0_8px_#10B981]' : 'bg-rose-500 shadow-[0_0_8px_#F43F5E]'}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2 font-display">
                <span>AEGIS</span>
                <span className="text-blue-400">GUARDIAN</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/60 uppercase tracking-widest font-semibold">
                  PRO HUD
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                KERNEL SECURED
              </span>
              <span className="text-slate-600">•</span>
              <span className="flex items-center gap-1">
                <Wifi className={`w-3 h-3 ${vpnConnected ? 'text-cyan-400' : 'text-slate-400'}`} />
                {vpnConnected ? 'WireGuard Enclave Active' : 'Wi-Fi Guard Shielded'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Score & Quick Triggers */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Health Index Metric Pill */}
          <div className="px-3.5 py-1.5 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs font-medium flex items-center text-slate-200 shadow-inner">
            <span className={`w-2 h-2 rounded-full mr-2 ${isHealthy ? 'bg-emerald-400 shadow-[0_0_6px_#10B981]' : 'bg-rose-400 animate-pulse shadow-[0_0_6px_#F43F5E]'}`} />
            <span className="text-slate-400 font-mono mr-1.5">DEFENSE:</span>
            <span className={`font-mono font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>
              {healthScore}% {isHealthy ? 'OPTIMAL' : `${threatCount} ALERTS`}
            </span>
          </div>

          {/* Quick Search & Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={() => {
                onOpenCommandPalette();
                soundFx.playClick(true);
              }}
              title="Quick Search & Command Center (Cmd+K)"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 hover:border-blue-500/50 text-slate-200 transition cursor-pointer text-xs font-mono group shadow-sm"
            >
              <Search className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300" />
              <span className="hidden md:inline">Command HUD</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 bg-slate-950 border border-slate-700 rounded text-[10px] text-slate-400">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              soundFx.playClick(true);
            }}
            title={isMuted ? 'Unmute tactical audio' : 'Mute tactical audio'}
            className="p-2 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 hover:border-slate-600 transition cursor-pointer"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs border border-rose-400/40 shadow-lg shadow-rose-600/30 transition active:scale-95 cursor-pointer font-mono"
          >
            <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">SOS DISTRESS</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};
