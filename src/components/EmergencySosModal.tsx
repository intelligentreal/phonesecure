import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Volume2,
  VolumeX,
  MapPin,
  Phone,
  MessageSquare,
  ShieldAlert,
  X,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-lg">
      {/* Strobe Effect Ring */}
      {strobeActive && (
        <div className="absolute inset-0 bg-rose-600/10 pointer-events-none animate-pulse" />
      )}

      <div className="max-w-md w-full bg-slate-900 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-rose-950 relative z-10">
        {/* Header Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping" />
          <div className="w-16 h-16 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-rose-600/50">
            <AlertOctagon className="w-9 h-9 animate-bounce" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            EMERGENCY SOS ACTIVE
          </h2>
          <p className="text-xs text-rose-300 font-mono mt-1">
            BROADCASTING DISTRESS BEACON & GPS TELEMETRY
          </p>
        </div>

        {/* Dispatch Countdown or Dispatched Badge */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-900 text-xs font-mono space-y-1">
          {countdown > 0 ? (
            <div className="text-amber-300 font-bold">
              Dispatching SOS SMS in <span className="text-lg text-white font-black">{countdown}</span>s...
            </div>
          ) : (
            <div className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
              <Radio className="w-4 h-4 animate-ping" />
              <span>SOS GPS SMS SENT TO TRUSTED CONTACT</span>
            </div>
          )}
          <div className="text-[11px] text-slate-400">
            To: {emergencyContact.name} ({emergencyContact.phone})
          </div>
        </div>

        {/* Live Distress SMS Preview */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-left text-xs font-mono text-slate-300 space-y-1">
          <span className="text-[10px] text-slate-500 uppercase">Emergency SMS Payload:</span>
          <p className="text-[11px] text-rose-200">
            "EMERGENCY: I need urgent assistance! PhoneSecure live GPS location: {locationText} (Galaxy S24 Ultra, Battery: 84%)"
          </p>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleToggleSiren}
            className={`py-3 rounded-xl font-bold text-xs font-mono transition flex items-center justify-center gap-2 ${
              sirenPlaying
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-slate-800 text-white'
            }`}
          >
            {sirenPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{sirenPlaying ? 'Mute Siren' : 'Play Siren'}</span>
          </button>

          <button
            onClick={() => setStrobeActive(!strobeActive)}
            className="py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs font-mono border border-slate-700 transition"
          >
            {strobeActive ? 'Stop Strobe' : 'Flash Strobe'}
          </button>
        </div>

        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold text-xs font-mono transition uppercase tracking-wider"
        >
          Cancel & Deactivate Emergency SOS
        </button>
      </div>
    </div>
  );
};
