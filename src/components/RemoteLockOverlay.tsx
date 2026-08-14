import React, { useState } from 'react';
import {
  Lock,
  Phone,
  ShieldAlert,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Smartphone
} from 'lucide-react';
import { soundFx } from '../utils/audioSensors';

interface RemoteLockOverlayProps {
  isLocked: boolean;
  message: string;
  correctPin: string;
  onUnlock: () => void;
  onFailedAttempt: () => void;
}

export const RemoteLockOverlay: React.FC<RemoteLockOverlayProps> = ({
  isLocked,
  message,
  correctPin,
  onUnlock,
  onFailedAttempt
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [attempts, setAttempts] = useState(0);

  if (!isLocked) return null;

  const handleKeyPress = (digit: string) => {
    if (pinInput.length >= 6) return;
    const next = pinInput + digit;
    setPinInput(next);
    soundFx.playClick(true);

    if (next.length === correctPin.length) {
      if (next === correctPin) {
        soundFx.playShieldSecured();
        setPinInput('');
        setAttempts(0);
        onUnlock();
      } else {
        soundFx.playThreatAlert();
        setErrorShake(true);
        setAttempts((a) => a + 1);
        onFailedAttempt();
        setTimeout(() => {
          setPinInput('');
          setErrorShake(false);
        }, 600);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-between p-6 text-white select-none">
      {/* Top Status */}
      <div className="text-center space-y-2 pt-6">
        <div className="w-14 h-14 rounded-full bg-rose-600/20 border border-rose-500 text-rose-400 flex items-center justify-center mx-auto animate-pulse">
          <Lock className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold font-mono tracking-wide text-rose-400 uppercase">
          DEVICE REMOTELY LOCKED
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <Radio className="w-3 h-3 text-cyan-400 animate-ping" />
          <span>GPS Tracking & Intruder Snapper Active</span>
        </div>
      </div>

      {/* Distress Owner Message Box */}
      <div className="max-w-md w-full p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">
          Owner Contact Notice:
        </span>
        <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
          {message || 'THIS PHONE IS LOST. PLEASE RETURN TO OWNER.'}
        </p>
        <div className="pt-1">
          <a
            href="tel:+15552345678"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Owner: +1 (555) 234-5678</span>
          </a>
        </div>
      </div>

      {/* PIN Unlock Keypad */}
      <div className="max-w-xs w-full space-y-4 pb-4 text-center">
        <div className="text-xs font-mono text-slate-400">
          Enter Recovery PIN (Default: <strong>{correctPin}</strong>)
        </div>

        {/* PIN Indicators */}
        <div className={`flex justify-center gap-3 py-1 ${errorShake ? 'animate-bounce' : ''}`}>
          {Array.from({ length: correctPin.length }).map((_, i) => (
            <div
              key={i}
              className={`w-3.5 h-3.5 rounded-full border transition-all ${
                errorShake
                  ? 'bg-rose-500 border-rose-500'
                  : pinInput.length > i
                  ? 'bg-cyan-400 border-cyan-400'
                  : 'bg-slate-900 border-slate-700'
              }`}
            />
          ))}
        </div>

        {attempts > 0 && (
          <div className="text-[11px] font-mono text-rose-400">
            Failed attempts: {attempts} (Intruder selfie captured)
          </div>
        )}

        {/* Digits Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((d) => (
            <button
              key={d}
              onClick={() => {
                if (d === 'C') setPinInput('');
                else if (d === '⌫') setPinInput((p) => p.slice(0, -1));
                else handleKeyPress(d);
              }}
              className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-lg font-mono font-bold text-white transition active:scale-95"
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
