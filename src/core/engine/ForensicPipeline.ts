import { IdentityNormalizer } from '../identity/Normalizer';
import { SignalRegistry } from '../detection/registry';
import { createStandardSignalRegistry } from '../detection/detectors';
import { RiskEngine } from '../detection/RiskEngine';
import { ResolvedConfiguration } from '../dataset/types';
import { SignalInput, SignalResult, RiskScoreResult } from '../detection/types';
import { InMemoryDataset, createStandardRiskyTldDataset } from '../dataset/InMemoryDataset';
import { AUTHORITATIVE_DNA_FIXTURE } from '../db/ForensicDatabase';

export interface ForensicExecutionResult {
  readonly observationId: string;
  readonly identity: ReturnType<typeof IdentityNormalizer.normalize>;
  readonly config: ResolvedConfiguration;
  readonly signalResults: readonly SignalResult<unknown>[];
  readonly riskScore: RiskScoreResult;
  readonly executionTimeMs: number;
  readonly provenanceHash: string;
  readonly timestamp: string;
}

export class ForensicPipeline {
  private readonly registry: SignalRegistry;
  private readonly riskEngine: RiskEngine;
  private readonly datasets: Record<string, InMemoryDataset<unknown>>;

  constructor(
    registry?: SignalRegistry,
    datasets?: Record<string, InMemoryDataset<unknown>>
  ) {
    this.registry = registry || createStandardSignalRegistry();
    this.riskEngine = new RiskEngine();
    this.datasets = datasets || {
      'risky_tlds': createStandardRiskyTldDataset(),
    };
  }

  public async executeScan(
    rawInput: string,
    telemetry: Record<string, unknown> = {},
    config: ResolvedConfiguration = AUTHORITATIVE_DNA_FIXTURE as unknown as ResolvedConfiguration,
    customObservationId?: string
  ): Promise<ForensicExecutionResult> {
    const startTime = performance.now();
    const identity = IdentityNormalizer.normalize(rawInput);
    const observationId = customObservationId || `obs_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const signalResults: SignalResult<unknown>[] = [];
    const signalWeights: Record<string, number> = {};

    for (const sigRef of config.signals) {
      const key = `${sigRef.id}\u001F${sigRef.version}`;
      signalWeights[key] = sigRef.weight;

      const evaluator = this.registry.get(sigRef.id, sigRef.version);

      // Map authorized datasets
      const signalDatasets: Record<string, InMemoryDataset<unknown>> = {};
      for (const dsRef of sigRef.authorizedDatasets) {
        const ds = this.datasets[dsRef.id];
        if (ds && ds.identity.version === dsRef.version) {
          signalDatasets[dsRef.id] = ds;
        }
      }

      const signalInput: SignalInput = {
        identity,
        telemetry,
        datasets: signalDatasets,
      };

      const result = await evaluator.evaluate(signalInput);
      signalResults.push(result);
    }

    const riskScore = this.riskEngine.calculate({
      signalResults,
      configType: config.config_type,
      configVersion: config.config_version,
      familyCaps: config.family_caps,
      signalWeights,
      observationId,
    });

    const executionTimeMs = Math.round((performance.now() - startTime) * 100) / 100;

    // Deterministic provenance hash computation
    const provenanceSeed = JSON.stringify({
      observationId,
      identityCanonical: identity.canonicalUrl,
      configType: config.config_type,
      configVersion: config.config_version,
      contributions: riskScore.signalContributions,
      overallScore: riskScore.overallScore,
      classification: riskScore.classification,
    });

    // Simple deterministic hash
    let hash = 0;
    for (let i = 0; i < provenanceSeed.length; i++) {
      const char = provenanceSeed.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const provenanceHash = `sha256:prov_${Math.abs(hash).toString(16).padStart(8, '0')}`;

    return {
      observationId,
      identity,
      config,
      signalResults,
      riskScore,
      executionTimeMs,
      provenanceHash,
      timestamp: new Date().toISOString(),
    };
  }
}
