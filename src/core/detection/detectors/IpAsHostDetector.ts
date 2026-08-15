import { SignalEvaluator, SignalInput, SignalResult } from '../types';

export interface IpAsHostEvidence {
  readonly isIp: boolean;
  readonly hostname: string;
  readonly isPrivateIp: boolean;
}

export class IpAsHostDetector implements SignalEvaluator<boolean> {
  public readonly metadata = {
    id: 'IP_AS_HOST',
    version: '1.0.0',
    detectorVersion: '1.0.0',
    family: 'INFRASTRUCTURE' as const,
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

    const isIp = identity.isIp;
    let isPrivateIp = false;

    if (isIp) {
      const parts = identity.hostname.replace(/[[\]]/g, '').split('.').map(Number);
      if (parts.length === 4 && !parts.some(isNaN)) {
        // Private IP RFC 1918 check (10.x, 172.16-31.x, 192.168.x, 127.x)
        if (
          parts[0] === 10 ||
          parts[0] === 127 ||
          (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
          (parts[0] === 192 && parts[1] === 168)
        ) {
          isPrivateIp = true;
        }
      }
    }

    return {
      state: 'SUCCESS',
      value: isIp,
      confidence: isIp ? (isPrivateIp ? 50 : 95) : 0,
      evidence: {
        isIp,
        hostname: identity.hostname,
        isPrivateIp,
      },
      detectorVersion: this.metadata.detectorVersion,
      signalId: this.metadata.id,
      signalVersion: this.metadata.version,
      family: this.metadata.family,
    };
  }
}
