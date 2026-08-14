import { RiskScoreResult, SignalResult } from '../detection/types';

export interface PersistenceInput {
  readonly riskResult: RiskScoreResult;
  readonly signalResults: readonly SignalResult<unknown>[];
}
