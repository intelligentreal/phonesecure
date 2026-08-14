import { SignalEvaluator, SignalInput, SignalResult } from '../types';

export interface RiskyTldEvidence {
  readonly tld: string;
  readonly isRisky: boolean;
  readonly datasetVersion: string;
  readonly riskCategory?: string;
}

export class RiskyTldDetector implements SignalEvaluator<boolean> {
  public readonly metadata = {
    id: 'RISKY_TLD',
    version: '1.0.0',
    detectorVersion: '1.0.0',
    family: 'DOMAIN' as const,
    requiredDatasets: [
      { id: 'risky_tlds', version: '1.0.0' }
    ] as const,
  };

  public evaluate(input: SignalInput): SignalResult<boolean> {
    const { identity, datasets } = input;
    const dataset = datasets['risky_tlds'];

    if (!dataset) {
      return {
        state: 'UNKNOWN',
        reason: 'Required dataset risky_tlds:1.0.0 not provided',
        detectorVersion: this.metadata.detectorVersion,
        signalId: this.metadata.id,
        signalVersion: this.metadata.version,
        family: this.metadata.family,
      };
    }

    if (!identity.publicSuffix) {
      return {
        state: 'UNKNOWN',
        reason: 'Missing public suffix in normalized identity',
        detectorVersion: this.metadata.detectorVersion,
        signalId: this.metadata.id,
        signalVersion: this.metadata.version,
        family: this.metadata.family,
      };
    }

    const tld = identity.publicSuffix.toLowerCase();
    const isRisky = dataset.has(tld);
    const category = isRisky ? String(dataset.get(tld) || 'HIGH_ABUSE_TLD') : undefined;

    return {
      state: 'SUCCESS',
      value: isRisky,
      confidence: isRisky ? 90 : 0,
      evidence: {
        tld,
        isRisky,
        datasetVersion: dataset.identity.version,
        riskCategory: category,
      },
      detectorVersion: this.metadata.detectorVersion,
      signalId: this.metadata.id,
      signalVersion: this.metadata.version,
      family: this.metadata.family,
    };
  }
}
