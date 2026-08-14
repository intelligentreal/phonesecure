import { RiskEngineInput, RiskScoreResult, SignalFamily } from './types';
import { CalculationError, ConfigurationMissingError } from './errors';
import { mapScoreToClassification } from './classification/Thresholds';

export class RiskEngine {
  public calculate(input: RiskEngineInput): RiskScoreResult {
    const familySums: Record<SignalFamily, number> = { DOMAIN: 0, INFRASTRUCTURE: 0, CONTENT: 0, RELATIONSHIP: 0 };
    const contributions: Record<string, number> = {};
    const seen = new Set<string>();
    let hasSuccess = false;

    for (const result of input.signalResults) {
      const key = `${result.signalId}\u001F${result.signalVersion}`;
      if (seen.has(key)) throw new CalculationError(`Duplicate signal in input: ${key}`);
      seen.add(key);

      if (result.state === 'UNKNOWN') {
        contributions[key] = 0;
        continue;
      }

      hasSuccess = true;
      const weight = input.signalWeights[key];
      if (weight === undefined) throw new ConfigurationMissingError(result.signalId, result.signalVersion);

      if (result.confidence > 0 && weight > Math.floor(Number.MAX_SAFE_INTEGER / result.confidence)) {
        throw new CalculationError(`Arithmetic overflow risk for ${key}`);
      }

      const contribution = Math.floor((weight * result.confidence) / 100);
      familySums[result.family] += contribution;
      contributions[key] = contribution;
    }

    const familyScores = {
      DOMAIN: Math.min(familySums.DOMAIN, input.familyCaps.DOMAIN),
      INFRASTRUCTURE: Math.min(familySums.INFRASTRUCTURE, input.familyCaps.INFRASTRUCTURE),
      CONTENT: Math.min(familySums.CONTENT, input.familyCaps.CONTENT),
      RELATIONSHIP: Math.min(familySums.RELATIONSHIP, input.familyCaps.RELATIONSHIP)
    };

    const overallScore = Math.min(Object.values(familyScores).reduce((a, b) => a + b, 0), 100);

    return {
      overallScore,
      familyScores,
      signalContributions: contributions,
      classification: hasSuccess ? mapScoreToClassification(overallScore) : 'UNKNOWN',
      configType: input.configType,
      configVersion: input.configVersion,
      observationId: input.observationId
    };
  }
}
