import { SignalFamily, DatasetIdentity } from '../detection/types';
export type { DatasetIdentity };

export interface Dataset<T = unknown> {
  readonly identity: DatasetIdentity;
  has(key: string): boolean;
  get(key: string): T | undefined;
  keys?(): readonly string[];
}

export interface ConfigSignalReference {
  readonly id: string;
  readonly version: string;
  readonly family: SignalFamily;
  readonly weight: number;
  readonly authorizedDatasets: readonly DatasetIdentity[];
}

export interface ResolvedConfiguration {
  readonly schema_version: string;
  readonly config_type: string;
  readonly config_version: string;
  readonly family_caps: Record<SignalFamily, number>;
  readonly signals: readonly ConfigSignalReference[];
}
