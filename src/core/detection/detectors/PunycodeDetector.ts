import { SignalEvaluator, SignalInput, SignalResult } from '../types';

export interface PunycodeEvidence {
  readonly hasPunycode: boolean;
  readonly hostname: string;
  readonly labels: readonly string[];
}

export class PunycodeDetector implements SignalEvaluator<boolean> {
  public readonly metadata = {
    id: 'PUNYCODE',
    version: '1.0.0',
    detectorVersion: '1.0.0',
    family: 'DOMAIN' as const,
    requiredDatasets: [] as const,
  };

  public evaluate(input: SignalInput): SignalResult<boolean> {
    const { identity } = input;
    if (!identity.hostname) {
      return {
        state: 'UNKNOWN',
        reason: 'Missing hostname in normalized identity',
        detectorVersion: this.metadata.detectorVersion,
        signalId: this.metadata.id,
        signalVersion: this.metadata.version,
        family: this.metadata.family,
      };
    }

    const labels = identity.hostname.split('.');
    const hasPunycode = labels.some(label => label.toLowerCase().startsWith('xn--'));

    return {
      state: 'SUCCESS',
      value: hasPunycode,
      confidence: hasPunycode ? 100 : 0,
      evidence: {
        hasPunycode,
        hostname: identity.hostname,
        labels,
      },
      detectorVersion: this.metadata.detectorVersion,
      signalId: this.metadata.id,
      signalVersion: this.metadata.version,
      family: this.metadata.family,
    };
  }
}
