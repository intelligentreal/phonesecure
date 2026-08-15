import { SignalEvaluator, SignalInput, SignalResult } from '../types';

export interface ShannonEntropyEvidence {
  readonly entropy: number;
  readonly length: number;
  readonly isHighEntropy: boolean;
  readonly analyzedString: string;
}

export class ShannonEntropyDetector implements SignalEvaluator<boolean> {
  public readonly metadata = {
    id: 'ENTROPY_HIGH',
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

    // Extract subdomains or SLD without public suffix
    const target = identity.domain ? identity.domain.split('.')[0] : identity.hostname;
    const entropy = this.calculateShannonEntropy(target);
    // Algorithmically Generated Domains (DGA) typically exceed 3.75 bits/char for strings > 8 chars
    const isHighEntropy = target.length >= 8 && entropy >= 3.8;

    return {
      state: 'SUCCESS',
      value: isHighEntropy,
      confidence: isHighEntropy ? 80 : 0,
      evidence: {
        entropy: Math.round(entropy * 100) / 100,
        length: target.length,
        isHighEntropy,
        analyzedString: target,
      },
      detectorVersion: this.metadata.detectorVersion,
      signalId: this.metadata.id,
      signalVersion: this.metadata.version,
      family: this.metadata.family,
    };
  }

  private calculateShannonEntropy(str: string): number {
    if (!str || str.length === 0) return 0;
    const frequencies = new Map<string, number>();
    for (const char of str) {
      frequencies.set(char, (frequencies.get(char) || 0) + 1);
    }

    let entropy = 0;
    const len = str.length;
    for (const count of frequencies.values()) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }
    return entropy;
  }
}
