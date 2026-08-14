import { NormalizedResourceIdentity } from '../identity/types';
import { Dataset } from '../dataset/types';

export type SignalId = string;
export type SignalVersion = string;
export type DetectorVersion = string;
export type SignalFamily = 'DOMAIN' | 'INFRASTRUCTURE' | 'CONTENT' | 'RELATIONSHIP';
export type Classification = 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS' | 'UNKNOWN';

export interface DatasetIdentity {
  readonly id: string;
  readonly version: string;
}

export interface SignalMetadata {
  readonly id: SignalId;
  readonly version: SignalVersion;
  readonly detectorVersion: DetectorVersion;
  readonly family: SignalFamily;
  readonly requiredDatasets: readonly DatasetIdentity[];
}

export interface SignalInput {
  readonly identity: NormalizedResourceIdentity;
  readonly telemetry: Readonly<Record<string, unknown>>;
  readonly datasets: Readonly<Record<string, Dataset<unknown>>>;
}

export type SignalResult<T = unknown> =
  | { 
      readonly state: 'SUCCESS'; 
      readonly value: T; 
      readonly confidence: number; 
      readonly evidence: Readonly<Record<string, unknown>>; 
      readonly detectorVersion: DetectorVersion; 
      readonly signalId: SignalId; 
      readonly signalVersion: SignalVersion; 
      readonly family: SignalFamily 
    }
  | { 
      readonly state: 'UNKNOWN'; 
      readonly reason: string; 
      readonly detectorVersion: DetectorVersion; 
      readonly signalId: SignalId; 
      readonly signalVersion: SignalVersion; 
      readonly family: SignalFamily 
    };

export interface RiskEngineInput {
  readonly signalResults: readonly SignalResult<unknown>[];
  readonly configType: string;
  readonly configVersion: string;
  readonly familyCaps: Readonly<Record<SignalFamily, number>>;
  readonly signalWeights: Readonly<Record<string, number>>;
  readonly observationId: string;
}

export interface RiskScoreResult {
  readonly overallScore: number;
  readonly familyScores: Readonly<Record<SignalFamily, number>>;
  readonly signalContributions: Readonly<Record<string, number>>;
  readonly classification: Classification;
  readonly configType: string;
  readonly configVersion: string;
  readonly observationId: string;
}

export interface SignalEvaluator<T = unknown> {
  readonly metadata: SignalMetadata;
  evaluate(input: SignalInput): Promise<SignalResult<T>> | SignalResult<T>;
}
