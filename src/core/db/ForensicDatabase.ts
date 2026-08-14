import { SystemConfigurationsTable, VerdictsTable, EvidenceTable } from '../../db/types';

export interface StandardDnaFixture {
  schema_version: '1.0.0';
  config_type: 'MOBILE_PHISHING_DNA';
  config_version: 'v1.2.2-F';
  family_caps: {
    DOMAIN: 50;
    INFRASTRUCTURE: 30;
    CONTENT: 40;
    RELATIONSHIP: 30;
  };
  signals: [
    {
      id: 'PUNYCODE';
      version: '1.0.0';
      family: 'DOMAIN';
      weight: 45;
      authorizedDatasets: [];
    },
    {
      id: 'RISKY_TLD';
      version: '1.0.0';
      family: 'DOMAIN';
      weight: 35;
      authorizedDatasets: [
        { id: 'risky_tlds'; version: '1.0.0' }
      ];
    },
    {
      id: 'EXT_FORM';
      version: '1.0.0';
      family: 'CONTENT';
      weight: 40;
      authorizedDatasets: [];
    }
  ];
}

export const AUTHORITATIVE_DNA_FIXTURE: StandardDnaFixture = {
  schema_version: '1.0.0',
  config_type: 'MOBILE_PHISHING_DNA',
  config_version: 'v1.2.2-F',
  family_caps: {
    DOMAIN: 50,
    INFRASTRUCTURE: 30,
    CONTENT: 40,
    RELATIONSHIP: 30
  },
  signals: [
    {
      id: 'PUNYCODE',
      version: '1.0.0',
      family: 'DOMAIN',
      weight: 45,
      authorizedDatasets: []
    },
    {
      id: 'RISKY_TLD',
      version: '1.0.0',
      family: 'DOMAIN',
      weight: 35,
      authorizedDatasets: [
        { id: 'risky_tlds', version: '1.0.0' }
      ]
    },
    {
      id: 'EXT_FORM',
      version: '1.0.0',
      family: 'CONTENT',
      weight: 40,
      authorizedDatasets: []
    }
  ]
};

export class InMemoryForensicStore {
  public systemConfigurations = new Map<string, SystemConfigurationsTable>();
  public verdicts = new Map<string, VerdictsTable>();
  public evidence: EvidenceTable[] = [];

  constructor() {
    this.seedAuthoritativeDna();
  }

  public seedAuthoritativeDna(): void {
    const key = `MOBILE_PHISHING_DNA\u001Fv1.2.2-F`;
    this.systemConfigurations.set(key, {
      config_id: 'cfg_authoritative_frozen_122f' as any,
      config_type: 'MOBILE_PHISHING_DNA',
      config_version: 'v1.2.2-F',
      schema_version: '1.0.0',
      status: 'ACTIVE',
      configuration: AUTHORITATIVE_DNA_FIXTURE,
      created_at: new Date('2026-08-14T00:00:00Z') as any
    });
  }

  public reset(): void {
    this.systemConfigurations.clear();
    this.verdicts.clear();
    this.evidence = [];
    this.seedAuthoritativeDna();
  }
}
