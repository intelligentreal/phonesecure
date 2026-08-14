import React, { useState } from 'react';
import {
  EyeOff,
  Camera,
  Mic,
  MapPin,
  MessageSquare,
  Users,
  HardDrive,
  ShieldAlert,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { AppSecurityProfile, PermissionType } from '../types';
import { soundFx } from '../utils/audioSensors';

interface PrivacyShieldViewProps {
  apps: AppSecurityProfile[];
  onToggleAppPermission: (appId: string, permType: PermissionType) => void;
  onHardenAllPermissions: () => void;
  cameraKillswitch: boolean;
  onToggleCameraKillswitch: () => void;
  micKillswitch: boolean;
  onToggleMicKillswitch: () => void;
  clipboardShield: boolean;
  onToggleClipboardShield: () => void;
}

export const PrivacyShieldView: React.FC<PrivacyShieldViewProps> = ({
  apps,
  onToggleAppPermission,
  onHardenAllPermissions,
  cameraKillswitch,
  onToggleCameraKillswitch,
  micKillswitch,
  onToggleMicKillswitch,
  clipboardShield,
  onToggleClipboardShield
}) => {
  const [filterType, setFilterType] = useState<'all' | 'high_risk' | 'sideloaded' | 'system'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      app.appName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (filterType === 'high_risk') return app.trustScore < 60;
    if (filterType === 'sideloaded') return app.installSource.includes('Sideloaded');
    if (filterType === 'system') return app.isSystemApp;
    return true;
  });

  const highRiskCount = apps.filter((a) => a.trustScore < 60).length;

  return (
    <div className="space-y-6">
      {/* Privacy Control Center Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <EyeOff className="w-4 h-4" /> Zero-Trust Permission Auditor
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Privacy Shield & Sensor Killswitches
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Prevent unauthorized eavesdropping, rogue background location tracking, and covert accessibility keyloggers.
            </p>
          </div>

          <button
            onClick={() => {
              onHardenAllPermissions();
              soundFx.playShieldSecured();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-cyan-500/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Harden All Dangerous Permissions</span>
          </button>
        </div>

        {/* Live Hardware Killswitches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* Killswitch 1: Camera Hardware Lock */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  cameraKillswitch
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Camera Killswitch</div>
                <div className="text-[11px] text-slate-400">
                  {cameraKillswitch ? 'Hardware Disabled' : 'Normal Access'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={cameraKillswitch}
                onChange={() => {
                  onToggleCameraKillswitch();
                  soundFx.playClick(cameraKillswitch);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {/* Killswitch 2: Mic Hardware Lock */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  micKillswitch
                    ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Microphone Killswitch</div>
                <div className="text-[11px] text-slate-400">
                  {micKillswitch ? 'Audio Bus Muted' : 'Normal Access'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={micKillswitch}
                onChange={() => {
                  onToggleMicKillswitch();
                  soundFx.playClick(micKillswitch);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500" />
            </label>
          </div>

          {/* Killswitch 3: Clipboard Snooping Shield */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`p-2.5 rounded-xl ${
                  clipboardShield
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Clipboard Guard</div>
                <div className="text-[11px] text-slate-400">
                  {clipboardShield ? 'Auto-Purge Active' : 'Passive'}
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={clipboardShield}
                onChange={() => {
                  onToggleClipboardShield();
                  soundFx.playClick(clipboardShield);
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500" />
            </label>
          </div>
        </div>
      </div>

      {/* App Permissions Matrix */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterType === 'all'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              All Applications ({apps.length})
            </button>
            <button
              onClick={() => setFilterType('high_risk')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 ${
                filterType === 'high_risk'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <span>High Risk / Overprivileged</span>
              {highRiskCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white font-mono text-[10px]">
                  {highRiskCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterType('sideloaded')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterType === 'sideloaded'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Sideloaded Packages
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search apps or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Apps List */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className={`p-4 rounded-xl border transition space-y-3 ${
                app.trustScore < 50
                  ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700/80'
                  : 'cyber-card hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      app.trustScore >= 80
                        ? 'bg-emerald-950 border border-emerald-800 text-emerald-400'
                        : app.trustScore >= 50
                        ? 'bg-amber-950 border border-amber-800 text-amber-400'
                        : 'bg-rose-950 border border-rose-800 text-rose-400'
                    }`}
                  >
                    {app.trustScore}%
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{app.appName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {app.category}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
                      <span>{app.packageName}</span>
                      <span>•</span>
                      <span>Source: {app.installSource}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Data usage: {app.networkActivityMb} MB</span>
                  {app.hasBackgroundAccess && (
                    <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 text-[10px]">
                      Background Running
                    </span>
                  )}
                </div>
              </div>

              {/* Granted Permissions Toggles */}
              <div className="pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
                  Configured Hardware & Data Permissions:
                </div>
                <div className="flex flex-wrap gap-2">
                  {app.permissions.map((perm) => {
                    const isDangerous = perm.isDangerous;
                    const isGranted = perm.isGranted;

                    return (
                      <button
                        key={perm.name}
                        onClick={() => {
                          onToggleAppPermission(app.id, perm.type);
                          soundFx.playClick(isGranted);
                        }}
                        className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition border ${
                          isGranted
                            ? isDangerous
                              ? 'bg-rose-950/60 border-rose-700 text-rose-300 hover:bg-rose-900/60'
                              : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                            : 'bg-slate-950 border-slate-800 text-slate-500 line-through opacity-60 hover:opacity-100'
                        }`}
                      >
                        {perm.type === 'camera' && <Camera className="w-3.5 h-3.5" />}
                        {perm.type === 'microphone' && <Mic className="w-3.5 h-3.5 text-amber-400" />}
                        {perm.type === 'location' && <MapPin className="w-3.5 h-3.5 text-cyan-400" />}
                        {perm.type === 'sms' && <MessageSquare className="w-3.5 h-3.5 text-rose-400" />}
                        {perm.type === 'contacts' && <Users className="w-3.5 h-3.5" />}
                        {perm.type === 'storage' && <HardDrive className="w-3.5 h-3.5" />}
                        <span>{perm.name}</span>
                        <span className="text-[10px] font-bold">
                          {isGranted ? 'ALLOWED' : 'REVOKED'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
