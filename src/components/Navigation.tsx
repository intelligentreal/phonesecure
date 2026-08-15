import React from 'react';
import {
  Shield,
  ShieldAlert,
  ScanSearch,
  EyeOff,
  Crosshair,
  Wifi,
  Lock,
  Bot,
  Activity,
  Binary
} from 'lucide-react';
import { ActiveTabType } from '../types';
import { soundFx } from '../utils/audioSensors';

interface NavigationProps {
  activeTab: ActiveTabType;
  onTabChange: (tab: ActiveTabType) => void;
  threatCount: number;
  quarantinedCount: number;
  vpnActive: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  threatCount,
  vpnActive
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTabType,
      label: 'Live Shield',
      icon: Shield,
      badge: null
    },
    {
      id: 'scanner' as ActiveTabType,
      label: 'Threat Scanner',
      icon: ScanSearch,
      badge: threatCount > 0 ? `${threatCount}` : null,
      badgeColor: 'bg-rose-950/80 text-rose-400 border-rose-700/80 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
    },
    {
      id: 'zero_click' as ActiveTabType,
      label: 'Zero-Click Defense',
      icon: ShieldAlert,
      badge: 'HARDENED',
      badgeColor: 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
    },
    {
      id: 'privacy' as ActiveTabType,
      label: 'Privacy Guard',
      icon: EyeOff,
      badge: null
    },
    {
      id: 'antitheft' as ActiveTabType,
      label: 'Anti-Theft',
      icon: Crosshair,
      badge: 'GPS',
      badgeColor: 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60'
    },
    {
      id: 'network' as ActiveTabType,
      label: 'Network & VPN',
      icon: Wifi,
      badge: vpnActive ? 'ENCRYPTED' : null,
      badgeColor: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
    },
    {
      id: 'vault' as ActiveTabType,
      label: 'Encrypted Vault',
      icon: Lock,
      badge: 'AES-256',
      badgeColor: 'bg-blue-950/80 text-blue-300 border-blue-700/60'
    },
    {
      id: 'ai_advisor' as ActiveTabType,
      label: 'AI Advisor',
      icon: Bot,
      badge: 'AI',
      badgeColor: 'bg-purple-950/80 text-purple-300 border-purple-700/60'
    },
    {
      id: 'forensic' as ActiveTabType,
      label: 'Forensic DNA',
      icon: Binary,
      badge: null
    },
    {
      id: 'diagnostics' as ActiveTabType,
      label: 'Hardware Integrity',
      icon: Activity,
      badge: 'SENSORS',
      badgeColor: 'bg-amber-950/80 text-amber-300 border-amber-700/60'
    }
  ];

  return (
    <nav className="bg-[#070B12]/80 border-b border-slate-800/80 sticky top-[65px] z-30 overflow-x-auto scrollbar-none backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center gap-2 px-4 sm:px-8 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                soundFx.playClick(false);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 border border-blue-400/40 font-semibold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 border border-transparent hover:border-slate-700/60'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white drop-shadow-[0_0_6px_rgba(255,255,255,0.6)]' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border ${
                    isActive
                      ? 'bg-white/20 text-white border-white/30'
                      : tab.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
