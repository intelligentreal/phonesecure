import React, { useState, useRef } from 'react';
import {
  Crosshair,
  MapPin,
  Volume2,
  VolumeX,
  Lock,
  Camera,
  Smartphone,
  AlertTriangle,
  Radio,
  Trash2,
  CheckCircle2,
  RefreshCw,
  BellRing,
  ShieldAlert,
  BatteryCharging
} from 'lucide-react';
import { AntiTheftConfig, IntruderLog } from '../types';
import { soundFx } from '../utils/audioSensors';

interface AntiTheftViewProps {
  antiTheftConfig: AntiTheftConfig;
  onUpdateConfig: (updated: Partial<AntiTheftConfig>) => void;
  onTriggerRemoteLock: () => void;
  onAddIntruderLog: (log: IntruderLog) => void;
  onTriggerRemoteWipe: () => void;
}

export const AntiTheftView: React.FC<AntiTheftViewProps> = ({
  antiTheftConfig,
  onUpdateConfig,
  onTriggerRemoteLock,
  onAddIntruderLog,
  onTriggerRemoteWipe
}) => {
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isCapturingWebcam, setIsCapturingWebcam] = useState(false);
  const [customMsg, setCustomMsg] = useState(antiTheftConfig.remoteLockMessage);
  const [customPin, setCustomPin] = useState(antiTheftConfig.remoteLockPin);
  const [isRefreshingGps, setIsRefreshingGps] = useState(false);
  const [showWipeConfirm, setShowWipeConfirm] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleToggleSiren = () => {
    if (isSirenActive) {
      soundFx.stopSiren();
      setIsSirenActive(false);
    } else {
      soundFx.startSiren();
      setIsSirenActive(true);
    }
  };

  const handleRefreshGps = () => {
    setIsRefreshingGps(true);
    soundFx.playRadarBeep();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsRefreshingGps(false);
          soundFx.playShieldSecured();
          onUpdateConfig({
            deviceLocation: {
              lat: Number(pos.coords.latitude.toFixed(4)),
              lng: Number(pos.coords.longitude.toFixed(4)),
              accuracyMeters: Math.round(pos.coords.accuracy) || 5,
              address: 'Live Geolocation Beacon (Browser Verified)',
              lastUpdated: 'Just now (Real GPS Signal)'
            }
          });
        },
        () => {
          setIsRefreshingGps(false);
          // simulated fallback
          onUpdateConfig({
            deviceLocation: {
              ...antiTheftConfig.deviceLocation,
              lastUpdated: 'Just now (High Accuracy Cellular Beacon)'
            }
          });
        },
        { timeout: 5000 }
      );
    } else {
      setTimeout(() => {
        setIsRefreshingGps(false);
      }, 1000);
    }
  };

  // Live Camera Intruder Selfie Trap Simulator
  const handleTriggerIntruderTrap = async () => {
    setIsCapturingWebcam(true);
    soundFx.playThreatAlert();

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        setTimeout(() => {
          // Take snapshot from canvas
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 240;
          const ctx = canvas.getContext('2d');
          if (ctx && videoRef.current) {
            ctx.drawImage(videoRef.current, 0, 0, 320, 240);
            const photoUrl = canvas.toDataURL('image/jpeg');

            // Stop streams
            stream.getTracks().forEach((t) => t.stop());

            const newLog: IntruderLog = {
              id: `intruder-${Date.now()}`,
              timestamp: 'Just now',
              photoUrl,
              location: `${antiTheftConfig.deviceLocation.lat}° N, ${antiTheftConfig.deviceLocation.lng}° W`,
              reason: 'Remote Selfie Trigger',
              batteryLevel: 84
            };

            onAddIntruderLog(newLog);
            setIsCapturingWebcam(false);
            soundFx.playShieldSecured();
          }
        }, 1500);
      } else {
        throw new Error('No camera access');
      }
    } catch {
      // Fallback simulated intruder photo
      const newLog: IntruderLog = {
        id: `intruder-${Date.now()}`,
        timestamp: 'Just now (Simulated Intruder)',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60',
        location: `${antiTheftConfig.deviceLocation.lat}° N, ${antiTheftConfig.deviceLocation.lng}° W`,
        reason: 'Failed PIN Attempts (3x)',
        batteryLevel: 82
      };
      onAddIntruderLog(newLog);
      setIsCapturingWebcam(false);
      soundFx.playThreatAlert();
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden Video element for webcam capture */}
      <video ref={videoRef} className="hidden" playsInline muted />

      {/* Hero Find My Phone Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
              <Crosshair className="w-4 h-4" /> Real-time Satellite & Sensor Beacon
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Anti-Theft Command & Remote Recovery Center
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track lost or stolen devices, trigger 105dB siren alarms, lock the device remotely, and take silent intruder selfies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleSiren}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition shadow-lg ${
                isSirenActive
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 animate-pulse border border-rose-400'
                  : 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-700'
              }`}
            >
              {isSirenActive ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-rose-400" />}
              <span>{isSirenActive ? 'STOP 105dB SIREN' : 'SOUND 105dB SIREN'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* GPS Location & Live Satellite Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map & Coordinates Widget */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl cyber-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <Radio className="w-4 h-4 animate-ping" />
                <span>Live GPS Beacon & Telemetry</span>
              </div>
              <button
                onClick={handleRefreshGps}
                disabled={isRefreshingGps}
                className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 underline"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingGps ? 'animate-spin' : ''}`} />
                <span>Ping Beacon</span>
              </button>
            </div>

            {/* Simulated Satellite Radar Map View */}
            <div className="relative w-full h-64 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
              {/* Map grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-40" />

              {/* Radar sweep */}
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 m-auto w-48 h-48 animate-ping" />
              <div className="absolute inset-0 rounded-full border border-cyan-500/40 m-auto w-32 h-32" />

              {/* Center Target Marker */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-lg shadow-cyan-500/50 animate-bounce">
                  <Smartphone className="w-4 h-4" />
                </div>
                <div className="mt-2 px-2.5 py-1 rounded bg-slate-900/90 border border-cyan-500/60 text-[10px] font-mono text-cyan-300 shadow">
                  Galaxy S24 Ultra • ±{antiTheftConfig.deviceLocation.accuracyMeters}m
                </div>
              </div>

              {/* Live coordinates overlay */}
              <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-slate-950/90 border border-slate-800 text-[11px] font-mono flex items-center justify-between text-slate-300">
                <div className="truncate">
                  📍 {antiTheftConfig.deviceLocation.address}
                </div>
                <span className="text-emerald-400 text-[10px] shrink-0 ml-2">
                  {antiTheftConfig.deviceLocation.lastUpdated}
                </span>
              </div>
            </div>

            {/* Device Vitals Bar */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">BATTERY</div>
                <div className="text-emerald-400 font-bold">84% Charging</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">SIM CARD</div>
                <div className="text-cyan-400 font-bold">Verizon (Locked)</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-slate-500 text-[10px]">GEOFENCE</div>
                <div className="text-emerald-400 font-bold">ARMED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Remote Command & Security Controls */}
        <div className="lg:col-span-5 space-y-4">
          {/* Remote Screen Lock Config */}
          <div className="p-5 rounded-2xl cyber-card space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Remote Lock Screen Config</span>
            </div>
            <p className="text-xs text-slate-400">
              Instantly lock device with emergency return message and secure recovery PIN.
            </p>

            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Lock Screen Distress Message:
                </label>
                <textarea
                  rows={2}
                  value={customMsg}
                  onChange={(e) => {
                    setCustomMsg(e.target.value);
                    onUpdateConfig({ remoteLockMessage: e.target.value });
                  }}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono text-slate-400 block mb-1">
                  Emergency Unlock PIN:
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={customPin}
                  onChange={(e) => {
                    setCustomPin(e.target.value);
                    onUpdateConfig({ remoteLockPin: e.target.value });
                  }}
                  className="w-full p-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <button
              onClick={() => {
                onTriggerRemoteLock();
                soundFx.playClick(true);
              }}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition shadow-md shadow-cyan-900/30"
            >
              Test Lock Screen Overlay Now
            </button>
          </div>

          {/* Silent Intruder Camera Trap */}
          <div className="p-5 rounded-2xl cyber-card space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>Intruder Photo Trap</span>
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                Auto-Capture
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Captures silent selfie snapshot upon 3 failed unlock PIN entries.
            </p>

            <button
              onClick={handleTriggerIntruderTrap}
              disabled={isCapturingWebcam}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition"
            >
              <Camera className="w-4 h-4" />
              <span>{isCapturingWebcam ? 'Capturing Snapshot...' : 'Test Intruder Capture Now'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intruder Log Gallery */}
      <div className="p-5 rounded-2xl cyber-card space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Intruder Selfie Logs & Unauthorized Access History</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">Encrypted in Local Enclave</span>
        </div>

        {antiTheftConfig.intruderLogs.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-400">
            No unauthorized unlock attempts recorded.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {antiTheftConfig.intruderLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs"
              >
                <div className="relative w-full h-36 rounded-lg overflow-hidden bg-slate-950 border border-slate-800">
                  {log.photoUrl ? (
                    <img
                      src={log.photoUrl}
                      alt="Intruder Snapshot"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono">
                      No Photo Captured
                    </div>
                  )}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 font-mono text-[10px] font-bold border border-rose-800">
                    INTRUDER
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[11px]">
                  <div className="text-slate-200 font-semibold">{log.reason}</div>
                  <div className="text-slate-400">🕒 {log.timestamp}</div>
                  <div className="text-slate-500 truncate">📍 {log.location}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Emergency Remote Wipe Zone */}
      <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Emergency Cryptographic Remote Wipe</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5 max-w-xl">
            Permanently shreds all on-device encryption keys, wiping private vault, banking tokens, and system storage.
          </p>
        </div>

        {showWipeConfirm ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTriggerRemoteWipe();
                setShowWipeConfirm(false);
                soundFx.playShieldSecured();
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs font-mono"
            >
              CONFIRM WIPE
            </button>
            <button
              onClick={() => setShowWipeConfirm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowWipeConfirm(true)}
            className="px-4 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-mono font-bold transition shrink-0"
          >
            Initiate Remote Wipe
          </button>
        )}
      </div>
    </div>
  );
};
