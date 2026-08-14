import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  KeyRound,
  FileText,
  Image,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  ShieldCheck,
  Smartphone,
  Fingerprint,
  AlertTriangle,
  FolderLock
} from 'lucide-react';
import { VaultSecretItem, AppSecurityProfile } from '../types';
import { soundFx } from '../utils/audioSensors';

interface SecureVaultViewProps {
  vaultItems: VaultSecretItem[];
  apps: AppSecurityProfile[];
  onToggleAppLock: (appId: string) => void;
  onAddVaultItem: (item: VaultSecretItem) => void;
  onDeleteVaultItem: (id: string) => void;
}

export const SecureVaultView: React.FC<SecureVaultViewProps> = ({
  vaultItems,
  apps,
  onToggleAppLock,
  onAddVaultItem,
  onDeleteVaultItem
}) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isDecoyMode, setIsDecoyMode] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);

  // New item state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemContent, setNewItemContent] = useState('');
  const [newItemType, setNewItemType] = useState<'note' | 'password' | 'photo'>('note');

  // Test App Lock state
  const [testingApp, setTestingApp] = useState<AppSecurityProfile | null>(null);
  const [appUnlockPin, setAppUnlockPin] = useState('');
  const [appUnlockSuccess, setAppUnlockSuccess] = useState(false);

  const handleKeypadPress = (digit: string) => {
    if (enteredPin.length >= 4) return;
    const nextPin = enteredPin + digit;
    setEnteredPin(nextPin);
    soundFx.playClick(true);

    if (nextPin.length === 4) {
      if (nextPin === '1234') {
        setIsUnlocked(true);
        setIsDecoyMode(false);
        setPinError(false);
        soundFx.playShieldSecured();
      } else if (nextPin === '9999') {
        setIsUnlocked(true);
        setIsDecoyMode(true);
        setPinError(false);
        soundFx.playShieldSecured();
      } else {
        setPinError(true);
        soundFx.playThreatAlert();
        setTimeout(() => {
          setEnteredPin('');
          setPinError(false);
        }, 800);
      }
    }
  };

  const handleBiometricUnlock = () => {
    soundFx.playRadarBeep();
    setTimeout(() => {
      setIsUnlocked(true);
      setIsDecoyMode(false);
      soundFx.playShieldSecured();
    }, 600);
  };

  const handleSaveItem = () => {
    if (!newItemTitle || !newItemContent) return;
    const item: VaultSecretItem = {
      id: `vlt-${Date.now()}`,
      title: newItemTitle,
      type: newItemType,
      content: newItemContent,
      dateCreated: new Date().toISOString().split('T')[0],
      size: `${(newItemContent.length * 0.05).toFixed(1)} KB`,
      isDecoy: isDecoyMode
    };
    onAddVaultItem(item);
    setNewItemTitle('');
    setNewItemContent('');
    setShowAddModal(false);
    soundFx.playShieldSecured();
  };

  const displayedItems = vaultItems.filter((i) => (isDecoyMode ? i.isDecoy : !i.isDecoy));

  return (
    <div className="space-y-6">
      {/* Vault Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
              <FolderLock className="w-4 h-4" /> Hardware-Backed AES-256 Enclave
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Encrypted Vault & App Security Locker
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Store private media, passwords, and seed phrases behind military-grade encryption with decoy duress PIN defense.
            </p>
          </div>

          {isUnlocked && (
            <button
              onClick={() => {
                setIsUnlocked(false);
                setEnteredPin('');
                soundFx.playClick(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold"
            >
              <Lock className="w-4 h-4 text-rose-400" />
              <span>Lock Vault Now</span>
            </button>
          )}
        </div>
      </div>

      {!isUnlocked ? (
        /* PIN Keypad Authentication Screen */
        <div className="max-w-md mx-auto p-8 rounded-2xl cyber-card text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-lg font-bold text-white">Unlock Secure Vault</h3>
            <p className="text-xs text-slate-400 mt-1">
              Enter master PIN (<strong>1234</strong>) or Decoy PIN (<strong>9999</strong>)
            </p>
          </div>

          {/* PIN Indicators */}
          <div className="flex justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border transition-all duration-200 ${
                  pinError
                    ? 'border-rose-500 bg-rose-500 animate-bounce'
                    : enteredPin.length > idx
                    ? 'border-emerald-400 bg-emerald-400 shadow-sm shadow-emerald-400/50'
                    : 'border-slate-700 bg-slate-900'
                }`}
              />
            ))}
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((k) => (
              <button
                key={k}
                onClick={() => {
                  if (k === 'C') setEnteredPin('');
                  else if (k === '⌫') setEnteredPin((p) => p.slice(0, -1));
                  else handleKeypadPress(k);
                }}
                className="py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-base font-mono font-bold text-white transition active:scale-95 shadow"
              >
                {k}
              </button>
            ))}
          </div>

          {/* Biometric simulation button */}
          <div className="pt-2">
            <button
              onClick={handleBiometricUnlock}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700 text-emerald-300 text-xs font-mono font-semibold transition"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Simulate Biometric Scan</span>
            </button>
          </div>
        </div>
      ) : (
        /* Unlocked Vault & App Locker Tabs */
        <div className="space-y-6">
          {/* Decoy Mode Notice */}
          {isDecoyMode && (
            <div className="p-3 rounded-xl bg-amber-950/60 border border-amber-800 text-amber-300 text-xs font-mono flex items-center justify-between">
              <span>⚠️ DECOY PIN ACTIVE: Showing safe dummy files only. Real vault hidden.</span>
              <button
                onClick={() => {
                  setIsUnlocked(false);
                  setEnteredPin('');
                }}
                className="underline"
              >
                Exit Decoy Mode
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Vault Files List */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-emerald-400" />
                  Encrypted Stored Items ({displayedItems.length})
                </h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold font-mono transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Secret</span>
                </button>
              </div>

              <div className="space-y-3">
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl cyber-card space-y-2 hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-slate-900 text-emerald-400 border border-slate-800">
                          {item.type === 'photo' && <Image className="w-4 h-4" />}
                          {item.type === 'note' && <FileText className="w-4 h-4" />}
                          {item.type === 'password' && <KeyRound className="w-4 h-4" />}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                          <div className="text-[11px] font-mono text-slate-500">
                            Added: {item.dateCreated} • {item.size}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onDeleteVaultItem(item.id);
                          soundFx.playClick(false);
                        }}
                        className="p-1.5 rounded bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                        title="Delete from vault"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Preview / Content */}
                    {item.preview && (
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-slate-800 bg-slate-950 mt-2">
                        <img
                          src={item.preview}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-line">
                      {item.content}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* App Locker Configuration */}
            <div className="lg:col-span-5 space-y-4">
              <div className="p-5 rounded-2xl cyber-card space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-bold text-sm">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>App Locker Protection</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                    PIN/Biometric Gate
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Enforce PIN authentication whenever sensitive financial or communication apps are launched.
                </p>

                <div className="space-y-2">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{app.appName}</div>
                        <div className="text-[11px] font-mono text-slate-500">{app.category}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        {app.isLocked && (
                          <button
                            onClick={() => setTestingApp(app)}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono"
                          >
                            Test Lock
                          </button>
                        )}
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={app.isLocked}
                            onChange={() => {
                              onToggleAppLock(app.id);
                              soundFx.playClick(!app.isLocked);
                            }}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-500" />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Vault Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Add Encrypted Item to Vault
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1 font-mono">Item Type:</label>
                <div className="flex gap-2">
                  {(['note', 'password', 'photo'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setNewItemType(t)}
                      className={`flex-1 py-1.5 rounded-lg border text-xs font-mono uppercase font-bold transition ${
                        newItemType === t
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono">Title / Label:</label>
                <input
                  type="text"
                  placeholder="e.g. Master Wallet Seed Phrase"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1 font-mono">Secret Content:</label>
                <textarea
                  rows={4}
                  placeholder="Enter secret text, passwords, or credentials to encrypt..."
                  value={newItemContent}
                  onChange={(e) => setNewItemContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs font-mono"
              >
                Encrypt & Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated App Lock Tester Modal */}
      {testingApp && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-sm w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{testingApp.appName} is Locked</h4>
              <p className="text-xs text-slate-400 mt-1">Enter Master PIN (1234) to open application</p>
            </div>

            <input
              type="password"
              maxLength={4}
              value={appUnlockPin}
              onChange={(e) => {
                const val = e.target.value;
                setAppUnlockPin(val);
                if (val === '1234') {
                  setAppUnlockSuccess(true);
                  soundFx.playShieldSecured();
                  setTimeout(() => {
                    setTestingApp(null);
                    setAppUnlockPin('');
                    setAppUnlockSuccess(false);
                  }, 900);
                }
              }}
              placeholder="••••"
              className="w-32 py-2 text-center tracking-widest text-lg font-mono rounded-lg bg-slate-950 border border-slate-700 text-cyan-300 focus:outline-none focus:border-cyan-400 mx-auto block"
            />

            {appUnlockSuccess ? (
              <div className="text-xs text-emerald-400 font-mono font-bold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4" /> App Unlocked! Launching...
              </div>
            ) : (
              <button
                onClick={() => setTestingApp(null)}
                className="text-xs text-slate-500 hover:text-slate-300 underline"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
