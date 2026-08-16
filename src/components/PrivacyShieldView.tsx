import React, { useState, useEffect, useRef } from 'react';
import {
  EyeOff,
  Camera,
  Mic,
  MapPin,
  MessageSquare,
  Users,
  HardDrive,
  Sparkles,
  Search,
  Lock,
  Radio,
  Activity
} from 'lucide-react';
import { AppSecurityProfile, PermissionType } from '../types';
import { soundFx } from '../utils/audioSensors';
import { ToggleSwitch } from './ToggleSwitch';
import { mediaRig } from '../utils/mediaStreamRig';

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
  const [isAudioProbing, setIsAudioProbing] = useState(false);
  const [liveAudioDb, setLiveAudioDb] = useState<number>(-100);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync killswitch with live media rig
  useEffect(() => {
    mediaRig.setHardwareMute(micKillswitch);
  }, [micKillswitch]);

  // Clean up media rig on unmount
  useEffect(() => {
    return () => {
      mediaRig.stop();
    };
  }, []);

  const handleToggleLiveAudioProbe = async () => {
    if (isAudioProbing) {
      mediaRig.stop();
      setIsAudioProbing(false);
      setLiveAudioDb(-100);
    } else {
      if (canvasRef.current) {
        const success = await mediaRig.startMicrophoneProbe(canvasRef.current, (db) => {
          setLiveAudioDb(db);
        });
        if (success) {
          setIsAudioProbing(true);
          mediaRig.setHardwareMute(micKillswitch);
          soundFx.playRadarBeep();
        }
      }
    }
  };

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
      <div className="cyber-card p-6 space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
              <EyeOff className="w-4 h-4 text-slate-700 dark:text-slate-300" /> Permission & Sensor Enclave
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
              Privacy Guard & Killswitches
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Prevent unauthorized eavesdropping, background location tracking, and covert accessibility exfiltration.
            </p>
          </div>

          <button
            onClick={() => {
              onHardenAllPermissions();
              soundFx.playShieldSecured();
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#4A5D73] hover:bg-[#38495C] text-white font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Harden Sensitive Permissions</span>
          </button>
        </div>

        {/* Live Hardware Killswitches */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
          {/* Killswitch 1: Camera Hardware Lock */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Camera Killswitch</div>
                <div className="text-[11px] text-slate-500">
                  {cameraKillswitch ? 'Hardware Disabled' : 'Normal Access'}
                </div>
              </div>
            </div>
            <ToggleSwitch
              checked={cameraKillswitch}
              onChange={() => {
                onToggleCameraKillswitch();
                soundFx.playClick(cameraKillswitch);
              }}
              ariaLabel="Toggle Camera Killswitch"
            />
          </div>

          {/* Killswitch 2: Mic Hardware Lock */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Microphone Killswitch</div>
                <div className="text-[11px] text-slate-500">
                  {micKillswitch ? 'Audio Bus Muted' : 'Normal Access'}
                </div>
              </div>
            </div>
            <ToggleSwitch
              checked={micKillswitch}
              onChange={() => {
                onToggleMicKillswitch();
                soundFx.playClick(micKillswitch);
              }}
              ariaLabel="Toggle Microphone Killswitch"
            />
          </div>

          {/* Killswitch 3: Clipboard Snooping Shield */}
          <div className="p-4 rounded-xl cyber-card flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">Clipboard Guard</div>
                <div className="text-[11px] text-slate-500">
                  {clipboardShield ? 'Auto-Purge Active' : 'Passive'}
                </div>
              </div>
            </div>
            <ToggleSwitch
              checked={clipboardShield}
              onChange={() => {
                onToggleClipboardShield();
                soundFx.playClick(clipboardShield);
              }}
              ariaLabel="Toggle Clipboard Guard"
            />
          </div>
        </div>

        {/* Live Audio Interception & Real-Time Oscilloscope Visualizer */}
        <div className="p-4 rounded-2xl bg-[#080E1A] border border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200 font-mono">Live Microphone Stream Interceptor & Oscilloscope</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                W3C MediaStream Layer
              </span>
            </div>

            <button
              onClick={handleToggleLiveAudioProbe}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                isAudioProbing
                  ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                  : 'bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isAudioProbing ? 'animate-pulse text-rose-400' : ''}`} />
              <span>{isAudioProbing ? 'Stop Live Audio Probe' : 'Test Live Audio Stream'}</span>
            </button>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-[#060B14] border border-slate-800/80 p-1 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={600}
              height={70}
              className="w-full h-16 sm:h-20 block"
            />
            {!isAudioProbing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[1px] text-xs font-mono text-slate-400">
                Click "Test Live Audio Stream" to verify real-time hardware killswitch track severing
              </div>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span>Status:</span>
              <span className={`font-bold ${
                !isAudioProbing ? 'text-slate-500' : micKillswitch ? 'text-rose-400' : 'text-emerald-400'
              }`}>
                {!isAudioProbing ? 'IDLE' : micKillswitch ? 'MUTED (Track Severed / 0 dB)' : 'ACTIVE (Live Stream Audio Passing)'}
              </span>
            </div>
            {isAudioProbing && (
              <div className="flex items-center gap-1.5">
                <span>Signal Level:</span>
                <span className="text-cyan-300 font-bold">{liveAudioDb} dB</span>
              </div>
            )}
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
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#4A5D73] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              All Applications ({apps.length})
            </button>
            <button
              onClick={() => setFilterType('high_risk')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 cursor-pointer ${
                filterType === 'high_risk'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>High Risk</span>
              {highRiskCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono text-[10px]">
                  {highRiskCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setFilterType('sideloaded')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                filterType === 'sideloaded'
                  ? 'bg-[#4A5D73] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Sideloaded Packages
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search apps or packages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#4A5D73]"
            />
          </div>
        </div>

        {/* Apps List */}
        <div className="space-y-3">
          {filteredApps.map((app) => (
            <div
              key={app.id}
              className="cyber-card p-4 space-y-3"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      app.trustScore >= 80
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : app.trustScore >= 50
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {app.trustScore}%
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{app.appName}</h4>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
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
                  <span className="text-slate-500">Data usage: {app.networkActivityMb} MB</span>
                  {app.hasBackgroundAccess && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px]">
                      Background Access
                    </span>
                  )}
                </div>
              </div>

              {/* Granted Permissions Toggles */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-2">
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
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono transition border cursor-pointer ${
                          isGranted
                            ? isDangerous
                              ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300'
                              : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
                            : 'bg-transparent border-slate-200 dark:border-slate-800 text-slate-400 line-through opacity-60 hover:opacity-100'
                        }`}
                      >
                        {perm.type === 'camera' && <Camera className="w-3 h-3" />}
                        {perm.type === 'microphone' && <Mic className="w-3 h-3" />}
                        {perm.type === 'location' && <MapPin className="w-3 h-3" />}
                        {perm.type === 'sms' && <MessageSquare className="w-3 h-3" />}
                        {perm.type === 'contacts' && <Users className="w-3 h-3" />}
                        {perm.type === 'storage' && <HardDrive className="w-3 h-3" />}
                        <span>{perm.name}</span>
                        <span className="text-[9px] font-bold">
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
