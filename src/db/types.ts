import { ColumnType } from 'kysely';
import { Classification, SignalFamily } from '../core/detection/types';

export type GeneratedId = ColumnType<string, string | undefined, never>;
export type GeneratedTimestamp = ColumnType<Date | string, Date | string | undefined, never>;

export interface SystemConfigurationsTable {
  config_id: GeneratedId;
  config_type: string;
  config_version: string;
  schema_version: string;
  status: 'ACTIVE' | 'RETIRED' | 'DRAFT';
  configuration: unknown;
  created_at: GeneratedTimestamp;
}

export interface VerdictsTable {
  verdict_id: GeneratedId;
  observation_id: string;
  config_type: string;
  config_version: string;
  risk_score: number;
  classification: Classification;
  policy_decision: string;
  created_at: GeneratedTimestamp;
}

export interface EvidenceTable {
  evidence_id: GeneratedId;
  observation_id: string;
  signal_id: string;
  signal_version: string;
  detector_version: string;
  confidence: number;
  contribution: number;
  evidence_data: string;
  created_at: GeneratedTimestamp;
}

export interface JobsTable {
  job_id: GeneratedId;
  observation_id: string;
  config_type: string;
  config_version: string;
  status: 'PENDING' | 'LEASED' | 'COMPLETED' | 'FAILED';
  lease_token: string | null;
  leased_at: Date | string | null;
  payload: string;
  created_at: GeneratedTimestamp;
}

export interface SignalsTable {
  signal_id: string;
  signal_version: string;
  detector_version: string;
  family: SignalFamily;
  metadata: string;
  created_at: GeneratedTimestamp;
}

export interface DatasetsTable {
  dataset_id: string;
  dataset_version: string;
  item_count: number;
  hash_sha256: string;
  created_at: GeneratedTimestamp;
}

export interface ObservationsTable {
  observation_id: string;
  raw_input: string;
  normalized_identity: string;
  telemetry_hash: string;
  created_at: GeneratedTimestamp;
}

export interface AuditLogTable {
  log_id: GeneratedId;
  event_type: string;
  entity_id: string;
  details: string;
  created_at: GeneratedTimestamp;
}

export interface Database {
  system_configurations: SystemConfigurationsTable;
  verdicts: VerdictsTable;
  evidence: EvidenceTable;
  jobs: JobsTable;
  signals: SignalsTable;
  datasets: DatasetsTable;
  observations: ObservationsTable;
  audit_logs: AuditLogTable;
}
