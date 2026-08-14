import { Kysely } from 'kysely';
import { Database } from '../../db/types';
import { SignalRegistry } from '../detection/registry';
import { 
  ConfigurationNotFoundError, 
  ConfigurationStatusError, 
  ConfigurationMalformedError, 
  ConfigurationSignalNotFoundError,
  ConfigurationRegistryIntegrityError,
  ConfigurationInfrastructureError,
  SignalNotFoundError
} from '../detection/errors';
import { ResolvedConfiguration, ConfigSignalReference } from './types';
import { SignalFamily } from '../detection/types';

function isRecord(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null && !Array.isArray(val);
}

function isSignalFamily(val: unknown): val is SignalFamily {
  return val === 'DOMAIN' || val === 'INFRASTRUCTURE' || val === 'CONTENT' || val === 'RELATIONSHIP';
}

export class ConfigurationResolver {
  constructor(private readonly db: Kysely<Database>, private readonly registry: SignalRegistry) {}

  public async resolve(type: string, version: string): Promise<ResolvedConfiguration> {
    let row;
    try {
      row = await this.db.selectFrom('system_configurations')
        .selectAll().where('config_type', '=', type).where('config_version', '=', version).executeTakeFirst();
    } catch {
      throw new ConfigurationInfrastructureError('Database lookup failed');
    }

    if (!row) throw new ConfigurationNotFoundError(type, version);
    if (row.status !== 'ACTIVE' && row.status !== 'RETIRED') {
      throw new ConfigurationStatusError(type, version, row.status);
    }

    const validated = this.validateStrict(row.configuration, type, version);

    for (const conf of validated.signals) {
      try {
        const impl = this.registry.get(conf.id, conf.version);
        if (impl.metadata.family !== conf.family) throw new ConfigurationRegistryIntegrityError(conf.id, 'Family mismatch');

        const reqSet = new Set(impl.metadata.requiredDatasets.map(r => `${r.id}\u001F${r.version}`));
        const authSet = new Set(conf.authorizedDatasets.map(r => `${r.id}\u001F${r.version}`));

        if (reqSet.size !== authSet.size || ![...reqSet].every(k => authSet.has(k))) {
          throw new ConfigurationRegistryIntegrityError(conf.id, 'Dataset DNA mismatch');
        }
      } catch (e) {
        if (e instanceof SignalNotFoundError) throw new ConfigurationSignalNotFoundError(conf.id, conf.version);
        throw e;
      }
    }
    return validated;
  }

  private validateStrict(raw: unknown, type: string, version: string): ResolvedConfiguration {
    if (!isRecord(raw)) throw new ConfigurationMalformedError(type, version, 'Root must be object');
    
    if (raw.config_type !== type || raw.config_version !== version || raw.schema_version !== '1.0.0') {
      throw new ConfigurationMalformedError(type, version, 'DNA Identity mismatch');
    }

    const caps = raw.family_caps;
    if (!isRecord(caps)) throw new ConfigurationMalformedError(type, version, 'Caps error');

    const validatedCaps = {
      DOMAIN: this.valInt(caps.DOMAIN),
      INFRASTRUCTURE: this.valInt(caps.INFRASTRUCTURE),
      CONTENT: this.valInt(caps.CONTENT),
      RELATIONSHIP: this.valInt(caps.RELATIONSHIP)
    };

    if (!Array.isArray(raw.signals)) throw new ConfigurationMalformedError(type, version, 'Signals error');
    const seen = new Set<string>();
    const signals: ConfigSignalReference[] = raw.signals.map(s => {
      if (!isRecord(s)) throw new ConfigurationMalformedError(type, version, 'Signal invalid');
      const id = String(s.id);
      const ver = String(s.version);
      if (seen.has(id)) throw new ConfigurationMalformedError(type, version, 'Duplicate signal');
      seen.add(id);
      
      const ds = s.authorizedDatasets;
      if (!Array.isArray(ds)) throw new ConfigurationMalformedError(type, version, 'DS missing');

      return {
        id, version: ver, family: this.valFamily(s.family), weight: this.valInt(s.weight),
        authorizedDatasets: ds.map(d => {
          if (!isRecord(d) || typeof d.id !== 'string' || typeof d.version !== 'string') throw new ConfigurationMalformedError(type, version, 'DS identity error');
          return { id: d.id, version: d.version };
        })
      };
    });

    return { schema_version: '1.0.0', config_type: type, config_version: version, family_caps: validatedCaps, signals };
  }

  private valInt(v: unknown): number {
    if (typeof v === 'number' && Number.isInteger(v) && v >= 0) return v;
    throw new Error('Invalid integer');
  }

  private valFamily(v: unknown): SignalFamily {
    if (isSignalFamily(v)) return v;
    throw new Error('Invalid family');
  }
}
