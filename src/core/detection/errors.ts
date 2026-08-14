export class CalculationError extends Error {
  constructor(message: string) {
    super(`[CalculationError] ${message}`);
    this.name = 'CalculationError';
  }
}

export class ConfigurationMissingError extends Error {
  constructor(signalId: string, signalVersion: string) {
    super(`[ConfigurationMissingError] Missing weight configuration for signal: ${signalId}:${signalVersion}`);
    this.name = 'ConfigurationMissingError';
  }
}

export class ConfigurationNotFoundError extends Error {
  constructor(type: string, version: string) {
    super(`[ConfigurationNotFoundError] Configuration ${type}:${version} not found in database`);
    this.name = 'ConfigurationNotFoundError';
  }
}

export class ConfigurationStatusError extends Error {
  constructor(type: string, version: string, status: string) {
    super(`[ConfigurationStatusError] Configuration ${type}:${version} is not in ACTIVE/RETIRED state: ${status}`);
    this.name = 'ConfigurationStatusError';
  }
}

export class ConfigurationMalformedError extends Error {
  constructor(type: string, version: string, detail: string) {
    super(`[ConfigurationMalformedError] Configuration ${type}:${version} is malformed: ${detail}`);
    this.name = 'ConfigurationMalformedError';
  }
}

export class ConfigurationSignalNotFoundError extends Error {
  constructor(signalId: string, signalVersion: string) {
    super(`[ConfigurationSignalNotFoundError] Signal registered in DNA not found in SignalRegistry: ${signalId}:${signalVersion}`);
    this.name = 'ConfigurationSignalNotFoundError';
  }
}

export class ConfigurationRegistryIntegrityError extends Error {
  constructor(signalId: string, reason: string) {
    super(`[ConfigurationRegistryIntegrityError] Signal ${signalId} failed DNA registry integrity check: ${reason}`);
    this.name = 'ConfigurationRegistryIntegrityError';
  }
}

export class ConfigurationInfrastructureError extends Error {
  constructor(message: string) {
    super(`[ConfigurationInfrastructureError] Database/storage infrastructure failure: ${message}`);
    this.name = 'ConfigurationInfrastructureError';
  }
}

export class SignalNotFoundError extends Error {
  constructor(signalId: string, signalVersion: string) {
    super(`[SignalNotFoundError] Signal ${signalId} v${signalVersion} not found in registry`);
    this.name = 'SignalNotFoundError';
  }
}

export class PersistenceError extends Error {
  constructor(message: string) {
    super(`[PersistenceError] ${message}`);
    this.name = 'PersistenceError';
  }
}

export class ForensicIntegrityError extends Error {
  constructor(message: string) {
    super(`[ForensicIntegrityError] ${message}`);
    this.name = 'ForensicIntegrityError';
  }
}
