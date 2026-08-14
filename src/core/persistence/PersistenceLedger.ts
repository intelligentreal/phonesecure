import { Kysely, Transaction } from 'kysely';
import { Database } from '../../db/types';
import { PersistenceInput } from './types';
import { PersistenceError, ForensicIntegrityError } from '../detection/errors';

export class PersistenceLedger {
  constructor(private readonly db: Kysely<Database>) {}

  public async persistVerdict(input: PersistenceInput): Promise<string> {
    const resultIds = new Set(input.signalResults.map(r => `${r.signalId}\u001F${r.signalVersion}`));
    const contribIds = new Set(Object.keys(input.riskResult.signalContributions));

    if (resultIds.size !== input.signalResults.length || resultIds.size !== contribIds.size || ![...resultIds].every(k => contribIds.has(k))) {
      throw new PersistenceError('Forensic bijection violation');
    }

    return await this.db.transaction().execute(async (trx) => {
      const insertResult = await (trx.insertInto('verdicts') as any).values({
        observation_id: input.riskResult.observationId,
        config_type: input.riskResult.configType,
        config_version: input.riskResult.configVersion,
        risk_score: input.riskResult.overallScore,
        classification: input.riskResult.classification,
        policy_decision: 'PENDING'
      }).onConflict((oc: any) => oc.column('observation_id').doNothing()).returning(['verdict_id', 'config_type', 'config_version']).executeTakeFirst();

      const authoritative = insertResult ? insertResult : await trx.selectFrom('verdicts')
        .select(['verdict_id', 'config_type', 'config_version'])
        .where('observation_id', '=', input.riskResult.observationId).executeTakeFirstOrThrow();

      if (authoritative.config_type !== input.riskResult.configType || authoritative.config_version !== input.riskResult.configVersion) {
        throw new ForensicIntegrityError('DNA mismatch on race convergence');
      }

      if (insertResult) await this.persistEvidence(trx, input);
      return authoritative.verdict_id;
    });
  }

  private async persistEvidence(trx: Transaction<Database>, input: PersistenceInput): Promise<void> {
    for (const res of input.signalResults) {
      const key = `${res.signalId}\u001F${res.signalVersion}`;
      await (trx.insertInto('evidence') as any).values({
        observation_id: input.riskResult.observationId,
        signal_id: res.signalId, signal_version: res.signalVersion, detector_version: res.detectorVersion,
        confidence: res.state === 'SUCCESS' ? res.confidence : 0,
        contribution: input.riskResult.signalContributions[key],
        evidence_data: JSON.stringify(res.state === 'SUCCESS' ? res.evidence : { reason: res.reason })
      }).execute();
    }
  }
}
