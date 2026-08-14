import { SignalRegistry } from '../registry';
import { PunycodeDetector } from './PunycodeDetector';
import { RiskyTldDetector } from './RiskyTldDetector';
import { ExtFormDetector } from './ExtFormDetector';

export function createStandardSignalRegistry(): SignalRegistry {
  const registry = new SignalRegistry();
  registry.register(new PunycodeDetector());
  registry.register(new RiskyTldDetector());
  registry.register(new ExtFormDetector());
  return registry;
}
