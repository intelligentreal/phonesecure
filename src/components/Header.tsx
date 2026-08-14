import React from 'react';
import { ShieldCheck, ShieldAlert, Volume2, VolumeX, AlertOctagon, Wifi, Smartphone, Radio } from 'lucide-react';
import { soundFx } from '../utils/audioSensors';

interface HeaderProps {
  healthScore: number;
  threatCount: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenSos: () => void;
  vpnConnected: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  healthScore,
  threatCount,
  isMuted,
  onToggleMute,
  onOpenSos,
  vpnConnected
}) => {
  const isHealthy = healthScore >= 80 && threatCount === 0;

  return (
    <header className="border-b border-slate-800/60 bg-[#070b18]/80 backdrop-blur-xl sticky top-0 z-40 px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Protocol Tag */}
        <div className="flex items-center gap-3.5">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white">
            <div className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isHealthy ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Aegis Secure <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-blue-950/80 text-blue-400 border border-blue-800/60 uppercase">Guardian</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Device Protocol: <span className="text-emerald-400 font-mono font-semibold">ALPHA-7_ENABLED</span></span>
              <span className="hidden sm:inline-block text-slate-600">•</span>
              <span className="hidden sm:flex items-center gap-1 text-slate-400">
                <Wifi className={`w-3 h-3 ${vpnConnected ? 'text-emerald-400' : 'text-slate-500'}`} />
                {vpnConnected ? 'Zurich Tunnel Active' : 'Hotspot Guard Active'}
              </span>
            </div>
          </div>
        </div>

        {/* Status Score & Quick Triggers */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 ml-auto">
          {/* Status Pill matching Design HTML */}
          <div className="px-3.5 py-1.5 bg-slate-800/50 border border-slate-700/70 rounded-xl text-xs sm:text-sm font-medium flex items-center text-slate-200 shadow-sm backdrop-blur-sm">
            <span className={`w-2 h-2 rounded-full mr-2 ${isHealthy ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse'}`}></span>
            System Status: <span className={`ml-1 font-bold ${isHealthy ? 'text-emerald-400' : 'text-rose-400'}`}>{isHealthy ? 'Optimal' : `${threatCount} Issues`}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              onToggleMute();
              soundFx.playClick(true);
            }}
            title={isMuted ? 'Unmute security sound effects' : 'Mute sound effects'}
            className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-700 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 hover:text-rose-300 font-bold text-xs tracking-wider border border-rose-500/30 transition transform active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.15)]"
          >
            <AlertOctagon className="w-4 h-4 animate-bounce" />
            <span className="hidden sm:inline">EMERGENCY SOS</span>
            <span className="sm:hidden">SOS</span>
          </button>
        </div>
      </div>
    </header>
  );
};

