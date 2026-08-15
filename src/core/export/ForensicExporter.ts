import { ForensicExecutionResult } from '../engine/ForensicPipeline';

export interface StixCyberObservable {
  type: string;
  id: string;
  spec_version: '2.1';
  value: string;
  resolves_to_refs?: string[];
  belongs_to_refs?: string[];
}

export interface StixIndicator {
  type: 'indicator';
  id: string;
  spec_version: '2.1';
  created: string;
  modified: string;
  name: string;
  description: string;
  indicator_types: string[];
  pattern: string;
  pattern_type: 'stix';
  valid_from: string;
  confidence: number;
}

export interface StixObservedData {
  type: 'observed-data';
  id: string;
  spec_version: '2.1';
  created: string;
  modified: string;
  first_observed: string;
  last_observed: string;
  number_observed: 1;
  object_refs: string[];
}

export interface StixBundle {
  type: 'bundle';
  id: string;
  objects: (StixCyberObservable | StixIndicator | StixObservedData)[];
}

export class ForensicExporter {
  /**
   * Generates a STIX 2.1 Threat Intelligence Bundle from forensic evaluation execution
   */
  public static toStixBundle(result: ForensicExecutionResult): StixBundle {
    const bundleId = `bundle--${result.provenanceHash.replace(/[^a-zA-Z0-9-]/g, '')}-${Date.now()}`;
    const timestamp = result.timestamp;

    const urlObservable: StixCyberObservable = {
      type: 'url',
      id: `url--${Math.random().toString(36).slice(2, 10)}`,
      spec_version: '2.1',
      value: result.identity.canonicalUrl || result.identity.rawInput,
    };

    const domainObservable: StixCyberObservable = {
      type: 'domain-name',
      id: `domain-name--${Math.random().toString(36).slice(2, 10)}`,
      spec_version: '2.1',
      value: result.identity.hostname || 'unknown',
    };

    const indicator: StixIndicator = {
      type: 'indicator',
      id: `indicator--${Math.random().toString(36).slice(2, 10)}`,
      spec_version: '2.1',
      created: timestamp,
      modified: timestamp,
      name: `Mobile Phishing Witness: ${result.identity.hostname}`,
      description: `Forensic assessment by Phone Secure Engine (${result.config.config_version}). Classification: ${result.riskScore.classification}, Risk: ${result.riskScore.overallScore}/100. Provenance: ${result.provenanceHash}`,
      indicator_types: [
        result.riskScore.classification === 'MALICIOUS'
          ? 'malicious-activity'
          : result.riskScore.classification === 'SUSPICIOUS'
          ? 'anomalous-activity'
          : 'benign',
      ],
      pattern: `[url:value = '${result.identity.canonicalUrl}']`,
      pattern_type: 'stix',
      valid_from: timestamp,
      confidence: Math.min(100, result.riskScore.overallScore),
    };

    const observedData: StixObservedData = {
      type: 'observed-data',
      id: `observed-data--${Math.random().toString(36).slice(2, 10)}`,
      spec_version: '2.1',
      created: timestamp,
      modified: timestamp,
      first_observed: timestamp,
      last_observed: timestamp,
      number_observed: 1,
      object_refs: [urlObservable.id, domainObservable.id, indicator.id],
    };

    return {
      type: 'bundle',
      id: bundleId,
      objects: [urlObservable, domainObservable, indicator, observedData],
    };
  }

  /**
   * Generates a structured JSON-LD Legal Evidence Dossier
   */
  public static toJsonLdDossier(result: ForensicExecutionResult): Record<string, unknown> {
    return {
      '@context': {
        '@vocab': 'https://schema.org/',
        'sec': 'https://security.phone-secure.internal/vocab#',
      },
      '@type': 'sec:ForensicVerdictRecord',
      '@id': `urn:phonesecure:verdict:${result.observationId}`,
      'sec:provenanceHash': result.provenanceHash,
      'sec:timestamp': result.timestamp,
      'sec:executionTimeMs': result.executionTimeMs,
      'sec:config': {
        'sec:configType': result.config.config_type,
        'sec:configVersion': result.config.config_version,
      },
      'sec:identity': {
        'sec:rawInput': result.identity.rawInput,
        'sec:canonicalUrl': result.identity.canonicalUrl,
        'sec:hostname': result.identity.hostname,
        'sec:isIp': result.identity.isIp,
        'sec:punycode': result.identity.punycode,
      },
      'sec:verdict': {
        'sec:classification': result.riskScore.classification,
        'sec:overallScore': result.riskScore.overallScore,
        'sec:familyScores': result.riskScore.familyScores,
        'sec:signalContributions': result.riskScore.signalContributions,
      },
    };
  }
}
