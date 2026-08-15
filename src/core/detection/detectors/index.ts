import { SignalRegistry } from '../registry';
import { PunycodeDetector } from './PunycodeDetector';
import { RiskyTldDetector } from './RiskyTldDetector';
import { ExtFormDetector } from './ExtFormDetector';
import { IpAsHostDetector } from './IpAsHostDetector';
import { ShannonEntropyDetector } from './ShannonEntropyDetector';

export function createStandardSignalRegistry(): SignalRegistry {
  const registry = new SignalRegistry();
  registry.register(new PunycodeDetector());
  registry.register(new RiskyTldDetector());
  registry.register(new ExtFormDetector());
  registry.register(new IpAsHostDetector());
  registry.register(new ShannonEntropyDetector());
  return registry;
}
