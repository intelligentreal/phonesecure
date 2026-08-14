import { Dataset, DatasetIdentity } from './types';

export class InMemoryDataset<T = unknown> implements Dataset<T> {
  private readonly map = new Map<string, T>();

  constructor(
    public readonly identity: DatasetIdentity,
    entries: Iterable<[string, T]> | Record<string, T>
  ) {
    if (entries && typeof entries === 'object' && Symbol.iterator in entries) {
      for (const [k, v] of entries as Iterable<[string, T]>) {
        this.map.set(k.toLowerCase(), v);
      }
    } else if (entries && typeof entries === 'object') {
      for (const [k, v] of Object.entries(entries as Record<string, T>)) {
        this.map.set(k.toLowerCase(), v);
      }
    }
  }

  public has(key: string): boolean {
    return this.map.has(key.toLowerCase());
  }

  public get(key: string): T | undefined {
    return this.map.get(key.toLowerCase());
  }

  public keys(): readonly string[] {
    return Array.from(this.map.keys());
  }
}

export function createStandardRiskyTldDataset(): InMemoryDataset<string> {
  return new InMemoryDataset<string>(
    { id: 'risky_tlds', version: '1.0.0' },
    {
      'tk': 'HIGH_ABUSE_FREE_REGISTRATION',
      'ml': 'HIGH_ABUSE_FREE_REGISTRATION',
      'ga': 'HIGH_ABUSE_FREE_REGISTRATION',
      'cf': 'HIGH_ABUSE_FREE_REGISTRATION',
      'gq': 'HIGH_ABUSE_FREE_REGISTRATION',
      'top': 'ABUSE_FREQUENT_PHISHING',
      'xyz': 'SUSPICIOUS_HIGH_VOLUME',
      'buzz': 'MALWARE_DISTRIBUTION',
      'cam': 'FRAUD_SCAM_PATTERNS',
      'icu': 'UNVERIFIED_FAST_FLUX',
      'work': 'HIGH_ABUSE_LOW_COST',
      'loan': 'FINANCIAL_PHISHING_ABUSE',
      'country': 'MALWARE_COMMAND_CONTROL'
    }
  );
}
