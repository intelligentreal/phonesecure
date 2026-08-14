import { Classification } from '../types';

export const THRESHOLDS = {
  MALICIOUS_MIN: 75,
  SUSPICIOUS_MIN: 40,
} as const;

export function mapScoreToClassification(score: number): Classification {
  if (score >= THRESHOLDS.MALICIOUS_MIN) {
    return 'MALICIOUS';
  }
  if (score >= THRESHOLDS.SUSPICIOUS_MIN) {
    return 'SUSPICIOUS';
  }
  return 'SAFE';
}
