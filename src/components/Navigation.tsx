import React from 'react';
import { motion } from 'motion/react';
import {
  Shield,
  ScanSearch,
  EyeOff,
  Crosshair,
  Wifi,
  Lock,
  Bot,
  Activity
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
      badgeColor: 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
    },
    {
      id: 'privacy' as ActiveTabType,
      label: 'Privacy Guard',
      icon: EyeOff,
      badge: null
    },
    {
      id: 'antitheft' as ActiveTabType,
      label: 'Anti-Theft & Alarm',
      icon: Crosshair,
      badge: 'GPS',
      badgeColor: 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
    },
    {
      id: 'network' as ActiveTabType,
      label: 'Network & VPN',
      icon: Wifi,
      badge: vpnActive ? 'ZURICH' : null,
      badgeColor: 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
    },
    {
      id: 'vault' as ActiveTabType,
      label: 'Encrypted Vault',
      icon: Lock,
      badge: null
    },
    {
      id: 'ai_advisor' as ActiveTabType,
      label: 'AI Threat Advisor',
      icon: Bot,
      badge: 'NEURAL',
      badgeColor: 'bg-indigo-500/20 border border-indigo-500/40 text-indigo-300'
    },
    {
      id: 'diagnostics' as ActiveTabType,
      label: 'Diagnostics',
      icon: Activity,
      badge: null
    }
  ];

  return (
    <nav className="bg-[#070b18]/70 border-b border-slate-800/60 sticky top-[65px] z-30 overflow-x-auto scrollbar-none backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center gap-1.5 px-4 sm:px-8 py-2.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                soundFx.playClick(false);
              }}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-200 cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_20px_rgba(37,99,235,0.25)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <motion.span
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                    tab.badgeColor || 'bg-slate-800/80 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  {tab.badge}
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};

