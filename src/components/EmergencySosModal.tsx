import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Volume2,
  VolumeX,
  Radio
} from 'lucide-react';
import { soundFx } from '../utils/audioSensors';

interface EmergencySosModalProps {
  isOpen: boolean;
  onClose: () => void;
  emergencyContact: { name: string; phone: string };
  locationText: string;
}

export const EmergencySosModal: React.FC<EmergencySosModalProps> = ({
  isOpen,
  onClose,
  emergencyContact,
  locationText
}) => {
  const [strobeActive, setStrobeActive] = useState(true);
  const [sirenPlaying, setSirenPlaying] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [smsDispatched, setSmsDispatched] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      soundFx.startSiren();
      setSirenPlaying(true);
      setCountdown(5);
      setSmsDispatched(false);

      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSmsDispatched(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      soundFx.stopSiren();
    }
    return () => {
      clearInterval(timer);
      soundFx.stopSiren();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleSiren = () => {
    if (sirenPlaying) {
      soundFx.stopSiren();
      setSirenPlaying(false);
    } else {
      soundFx.startSiren();
      setSirenPlaying(true);
    }
  };

  const handleClose = () => {
    soundFx.stopSiren();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      {/* Strobe Effect Ring */}
      {strobeActive && (
        <div className="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse" />
      )}

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl relative z-10">
        {/* Header Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-rose-600/40">
            <AlertOctagon className="w-8 h-8 animate-bounce" />
          </div>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">
            Emergency SOS Active
          </h2>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-mono mt-1">
            Broadcasting distress beacon & live telemetry
          </p>
        </div>

        {/* Dispatch Countdown or Dispatched Badge */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-rose-900/50 text-xs font-mono space-y-1">
          {countdown > 0 ? (
            <div className="text-amber-600 dark:text-amber-400 font-bold">
              Dispatching SOS SMS in <span className="text-base text-slate-900 dark:text-white font-black">{countdown}</span>s...
            </div>
          ) : (
            <div className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1.5">
              <Radio className="w-4 h-4 animate-ping" />
              <span>SOS GPS SMS Sent to Contact</span>
            </div>
          )}
          <div className="text-[11px] text-slate-500">
            To: {emergencyContact.name} ({emergencyContact.phone})
          </div>
        </div>

        {/* Live Distress SMS Preview */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-left text-xs font-mono text-slate-600 dark:text-slate-400 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider">Distress Payload:</span>
          <p className="text-[11px] text-slate-800 dark:text-rose-200">
            "EMERGENCY: Urgent assistance needed. Location: {locationText} (Battery: 84%)"
          </p>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleToggleSiren}
            className={`py-2.5 rounded-full font-semibold text-xs font-mono transition flex items-center justify-center gap-2 cursor-pointer ${
              sirenPlaying
                ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
            }`}
          >
            {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{sirenPlaying ? 'Mute Siren' : 'Play Siren'}</span>
          </button>

          <button
            onClick={() => setStrobeActive(!strobeActive)}
            className="py-2.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs font-mono border border-slate-200 dark:border-slate-700 transition cursor-pointer"
          >
            {strobeActive ? 'Stop Strobe' : 'Flash Strobe'}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3 rounded-full bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs font-mono transition tracking-wider cursor-pointer"
        >
          Cancel & Deactivate SOS
        </button>
      </div>
    </div>
  );
};
