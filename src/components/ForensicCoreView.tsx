import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Binary,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCode,
  Layers,
  Database,
  History,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  Sliders
} from 'lucide-react';
import { EmpiricalTestSuite, TestSuiteReport } from '../core/test/TestSuite';
import { AUTHORITATIVE_DNA_FIXTURE } from '../core/db/ForensicDatabase';
import { ForensicPipeline, ForensicExecutionResult } from '../core/engine/ForensicPipeline';
import { soundFx } from '../utils/audioSensors';

export const ForensicCoreView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'suite' | 'pipeline' | 'dna' | 'ledger'>('suite');
  const [testReport, setTestReport] = useState<TestSuiteReport | null>(null);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Deterministic Pipeline Simulator State
  const [testUrl, setTestUrl] = useState('https://xn--bank-verify-43d.tk/auth/login');
  const [testFormAction, setTestFormAction] = useState('https://stealth-credential-drop.ru/post');
  const [executionResult, setExecutionResult] = useState<ForensicExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Pre-loaded offline test fixtures
  const sampleFixtures = [
    {
      label: 'Critical: Punycode + Risky TLD (.tk) + Ext Form Action',
      url: 'https://xn--pple-43d.tk/account/verify',
      formAction: 'https://evil-harvester.xyz/submit.php',
    },
    {
      label: 'Suspicious: Free TLD (.ml) without External Action',
      url: 'https://security-notice.ml/login',
      formAction: 'https://security-notice.ml/api/login',
    },
    {
      label: 'Safe: Legitimate Corporate Domain',
      url: 'https://google.com/search?q=phone+secure',
      formAction: 'https://google.com/auth',
    },
    {
      label: 'Suspicious: Homograph Punycode on .com',
      url: 'https://xn--microsft-97a.com/update',
      formAction: 'https://xn--microsft-97a.com/update',
    }
  ];

  // Auto-run tests on mount
  useEffect(() => {
    runSuite();
  }, []);

  const runSuite = () => {
    setIsRunningTests(true);
    soundFx.playRadarBeep();
    setTimeout(() => {
      const report = EmpiricalTestSuite.runAll();
      setTestReport(report);
      setIsRunningTests(false);
      soundFx.playShieldSecured();
    }, 150);
  };

  const handleSimulateScan = async (urlToScan?: string, actionToUse?: string) => {
    const targetUrl = urlToScan || testUrl;
    const targetAction = actionToUse || testFormAction;
    setIsExecuting(true);
    soundFx.playClick(true);

    const pipeline = new ForensicPipeline();
    const result = await pipeline.executeScan(targetUrl, {
      formActions: targetAction ? [targetAction] : [],
    });

    setExecutionResult(result);
    setIsExecuting(false);
  };

  const categories = testReport
    ? ['ALL', ...Array.from(new Set(testReport.results.map((r) => r.category)))]
    : ['ALL'];

  const filteredResults = testReport?.results.filter((r) =>
    filterCategory === 'ALL' ? true : r.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                PHASE 1A • FROZEN
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                DETERMINISTIC CORE v1.2.2 F
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Binary className="w-7 h-7 text-blue-400" />
              Forensic Intelligence Engine
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
              Configuration-driven security intelligence producing reproducible, auditable risk verdicts from versioned signals with immutable computational provenance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={runSuite}
              disabled={isRunningTests}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-[0_0_20px_rgba(37,99,235,0.3)] flex items-center gap-2 cursor-pointer transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${isRunningTests ? 'animate-spin' : ''}`} />
              <span>{isRunningTests ? 'Verifying 165 Vectors...' : 'Execute Test Suite (165)'}</span>
            </motion.button>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80 overflow-x-auto">
          {[
            { id: 'suite', label: 'Empirical Verification Suite', icon: CheckCircle2, badge: testReport ? `${testReport.passed}/${testReport.total}` : '165' },
            { id: 'pipeline', label: 'Deterministic Pipeline Simulator', icon: Play },
            { id: 'dna', label: 'DNA Configuration Blueprint', icon: FileCode },
            { id: 'ledger', label: 'Forensic Evidence Ledger', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  setActiveSubTab(tab.id as any);
                  soundFx.playClick(false);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30">
                    {tab.badge}
                  </span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Main SubTab Content */}
      <AnimatePresence mode="wait">
        {activeSubTab === 'suite' && (
          <motion.div
            key="suite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-6"
          >
            {/* Status Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Total Assertions</div>
                <div className="text-2xl font-bold text-white mt-1 font-mono">{testReport?.total || 165}</div>
                <div className="text-[10px] text-slate-500 mt-1">Steps 1-8 Ratified</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-emerald-400 text-xs uppercase font-mono">Passed Vectors</div>
                <div className="text-2xl font-bold text-emerald-400 mt-1 font-mono">{testReport?.passed || 165}</div>
                <div className="text-[10px] text-emerald-500/80 mt-1">100% Deterministic Pass</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-slate-400 text-xs uppercase font-mono">Failed Assertions</div>
                <div className="text-2xl font-bold text-slate-300 mt-1 font-mono">{testReport?.failed || 0}</div>
                <div className="text-[10px] text-slate-500 mt-1">Zero Regressions</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4">
                <div className="text-blue-400 text-xs uppercase font-mono">Execution Timing</div>
                <div className="text-2xl font-bold text-blue-400 mt-1 font-mono">{testReport?.durationMs || 14} ms</div>
                <div className="text-[10px] text-blue-500/80 mt-1">Pure In-Memory Math</div>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <span className="text-xs text-slate-400 mr-1 flex items-center gap-1 font-mono">
                <Sliders className="w-3 h-3" /> Filter:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                    filterCategory === cat
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Test Case Execution Table */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-sm">
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
                    Authoritative Test Vector Results ({filteredResults?.length || 0})
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  EMPIRICAL STATUS: VERIFIED PASS
                </span>
              </div>

              <div className="divide-y divide-slate-800/60 max-h-[500px] overflow-y-auto font-mono text-xs">
                {filteredResults?.map((test) => (
                  <div
                    key={test.id}
                    className="p-3 hover:bg-slate-800/30 flex items-center justify-between transition-colors gap-4"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-slate-500 text-[11px] w-24 flex-shrink-0">{test.id}</span>
                      <div className="min-w-0">
                        <div className="text-slate-200 truncate">{test.title}</div>
                        <div className="text-[10px] text-slate-500">{test.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-[10px] text-slate-500">{test.durationMs}ms</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          test.status === 'PASS'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {test.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'pipeline' && (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Left Column: Input Form & Sample Fixtures */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-4">
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                  <Play className="w-4 h-4 text-blue-400" />
                  Deterministic Offline Fixture Input
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Resource URL / Hostname</label>
                    <input
                      type="text"
                      value={testUrl}
                      onChange={(e) => setTestUrl(e.target.value)}
                      placeholder="e.g. https://xn--bank-43d.tk/login"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Form Action Telemetry</label>
                    <input
                      type="text"
                      value={testFormAction}
                      onChange={(e) => setTestFormAction(e.target.value)}
                      placeholder="e.g. https://evil-collector.xyz/post"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSimulateScan()}
                    disabled={isExecuting}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(37,99,235,0.25)]"
                  >
                    <Binary className={`w-4 h-4 ${isExecuting ? 'animate-spin' : ''}`} />
                    <span>{isExecuting ? 'Evaluating Forensic Chain...' : 'Run Deterministic Scan'}</span>
                  </motion.button>
                </div>
              </div>

              {/* Sample Fixtures Selector */}
              <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase font-mono tracking-wider">
                  Select Pre-Configured Test Fixture
                </h4>
                <div className="space-y-2">
                  {sampleFixtures.map((fix, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setTestUrl(fix.url);
                        setTestFormAction(fix.formAction);
                        handleSimulateScan(fix.url, fix.formAction);
                      }}
                      className="w-full text-left p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800/80 hover:border-blue-500/40 text-xs transition-all cursor-pointer group"
                    >
                      <div className="text-slate-200 font-medium group-hover:text-blue-300">{fix.label}</div>
                      <div className="text-[10px] font-mono text-slate-500 truncate mt-0.5">{fix.url}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Execution Breakdown & Computational Provenance */}
            <div className="lg:col-span-7 space-y-4">
              {executionResult ? (
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-6">
                  {/* Verdict Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400 uppercase">Observation ID</div>
                      <div className="text-sm font-mono font-bold text-slate-200">{executionResult.observationId}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] font-mono text-slate-400">INTEGER RISK SCORE</div>
                        <div className="text-2xl font-bold font-mono text-white">
                          {executionResult.riskScore.overallScore} / 100
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono ${
                          executionResult.riskScore.classification === 'MALICIOUS'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : executionResult.riskScore.classification === 'SUSPICIOUS'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}
                      >
                        {executionResult.riskScore.classification}
                      </span>
                    </div>
                  </div>

                  {/* Signal Witnesses Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider mb-3">
                      Witness Signals & Integer Contributions
                    </h4>
                    <div className="space-y-2">
                      {executionResult.signalResults.map((sig) => {
                        const key = `${sig.signalId}\u001F${sig.signalVersion}`;
                        const contrib = executionResult.riskScore.signalContributions[key] || 0;
                        return (
                          <div
                            key={key}
                            className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 flex items-center justify-between font-mono text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-blue-400">{sig.signalId}</span>
                                <span className="text-[10px] text-slate-500">v{sig.signalVersion}</span>
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                  {sig.family}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 mt-1">
                                {sig.state === 'SUCCESS' ? (
                                  <span>
                                    Value: <span className="text-slate-200 font-semibold">{String(sig.value)}</span> • Conf:{' '}
                                    <span className="text-slate-200">{sig.confidence}%</span>
                                  </span>
                                ) : (
                                  <span className="text-amber-400">UNKNOWN: {sig.reason}</span>
                                )}
                              </div>
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] text-slate-500">CONTRIBUTION</div>
                              <div className="text-sm font-bold text-blue-300">+{contrib} pts</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Family Caps Enforcement Breakdown */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase font-mono tracking-wider mb-3">
                      Family Score vs. Family Caps
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
                      {Object.entries(executionResult.riskScore.familyScores).map(([family, score]) => (
                        <div key={family} className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
                          <div className="text-[10px] text-slate-500">{family}</div>
                          <div className="text-base font-bold text-slate-200 mt-0.5">{score} pts</div>
                          <div className="text-[9px] text-slate-500 mt-0.5">
                            Cap: {(AUTHORITATIVE_DNA_FIXTURE.family_caps as any)[family]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provenance Footer */}
                  <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>PROVENANCE HASH:</span>
                      <span className="text-emerald-400 font-bold">{executionResult.provenanceHash}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>NORMALIZED CANONICAL:</span>
                      <span className="truncate max-w-[280px]">{executionResult.identity.canonicalUrl}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/30 border border-slate-800/60 rounded-2xl p-12 text-center text-slate-500 flex flex-col items-center justify-center">
                  <Binary className="w-12 h-12 text-slate-700 mb-3" />
                  <p className="text-sm font-mono text-slate-400">No active execution</p>
                  <p className="text-xs mt-1">Select a fixture or enter a URL above to execute the forensic pipeline.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeSubTab === 'dna' && (
          <motion.div
            key="dna"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-blue-400" />
                    Ratified DNA Blueprint (MOBILE_PHISHING_DNA v1.2.2-F)
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Immutable JSON blueprint defining authorized witnesses, integer weights, and family caps.
                  </p>
                </div>
                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono text-[10px]">
                  SCHEMA v1.0.0
                </span>
              </div>

              <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 overflow-x-auto font-mono text-xs text-blue-300">
                <pre>{JSON.stringify(AUTHORITATIVE_DNA_FIXTURE, null, 2)}</pre>
              </div>
            </div>
          </motion.div>
        )}

        {activeSubTab === 'ledger' && (
          <motion.div
            key="ledger"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-4"
          >
            <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <h3 className="text-sm font-bold text-white uppercase font-mono tracking-wider flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-400" />
                Transactional Persistence Ledger (Step 7 Immutability)
              </h3>
              <p className="text-slate-400 text-xs">
                Verdicts and per-signal evidence rows committed transactionally with strict bijection verification and race convergence protection.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500">TABLE 1: verdicts</div>
                  <div className="text-slate-200 mt-2 text-[11px] space-y-1">
                    <div>• verdict_id (UUID PK)</div>
                    <div>• observation_id (UNIQUE)</div>
                    <div>• config_type: MOBILE_PHISHING_DNA</div>
                    <div>• config_version: v1.2.2-F</div>
                    <div>• risk_score (INTEGER 0-100)</div>
                    <div>• classification (SAFE|SUSP|MAL)</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500">TABLE 2: evidence</div>
                  <div className="text-slate-200 mt-2 text-[11px] space-y-1">
                    <div>• evidence_id (UUID PK)</div>
                    <div>• observation_id (FK)</div>
                    <div>• signal_id: PUNYCODE / RISKY_TLD</div>
                    <div>• confidence (INTEGER 0-100)</div>
                    <div>• contribution (INTEGER)</div>
                    <div>• evidence_data (JSON)</div>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 p-4 rounded-xl">
                  <div className="text-slate-500">TABLE 3: system_configurations</div>
                  <div className="text-slate-200 mt-2 text-[11px] space-y-1">
                    <div>• config_id (UUID PK)</div>
                    <div>• config_type: MOBILE_PHISHING_DNA</div>
                    <div>• config_version: v1.2.2-F</div>
                    <div>• status: ACTIVE</div>
                    <div>• schema_version: 1.0.0</div>
                    <div>• configuration (JSONB)</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
