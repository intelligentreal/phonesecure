import { SignalEvaluator, SignalInput, SignalResult } from '../types';

export interface ExtFormEvidence {
  readonly hasExternalForm: boolean;
  readonly formActions: readonly string[];
  readonly targetHostnames: readonly string[];
}

export class ExtFormDetector implements SignalEvaluator<boolean> {
  public readonly metadata = {
    id: 'EXT_FORM',
    version: '1.0.0',
    detectorVersion: '1.0.0',
    family: 'CONTENT' as const,
    requiredDatasets: [] as const,
  };

  public evaluate(input: SignalInput): SignalResult<boolean> {
    const { identity, telemetry } = input;
    const formActionsRaw = telemetry.formActions;

    if (!Array.isArray(formActionsRaw)) {
      return {
        state: 'UNKNOWN',
        reason: 'Telemetry missing formActions array',
        detectorVersion: this.metadata.detectorVersion,
        signalId: this.metadata.id,
        signalVersion: this.metadata.version,
        family: this.metadata.family,
      };
    }

    const formActions = formActionsRaw.map(String);
    const targetHostnames: string[] = [];
    let hasExternal = false;

    for (const action of formActions) {
      try {
        const parsed = new URL(action, identity.canonicalUrl || 'http://localhost');
        targetHostnames.push(parsed.hostname);
        if (identity.domain && parsed.hostname && !parsed.hostname.endsWith(identity.domain)) {
          hasExternal = true;
        }
      } catch {
        // invalid URL form action
      }
    }

    return {
      state: 'SUCCESS',
      value: hasExternal,
      confidence: hasExternal ? 85 : 0,
      evidence: {
        hasExternalForm: hasExternal,
        formActions,
        targetHostnames,
      },
      detectorVersion: this.metadata.detectorVersion,
      signalId: this.metadata.id,
      signalVersion: this.metadata.version,
      family: this.metadata.family,
    };
  }
}
