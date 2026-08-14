import { SignalEvaluator, SignalId, SignalVersion } from '../types';
import { SignalNotFoundError } from '../errors';

export class SignalRegistry {
  private readonly registry = new Map<string, SignalEvaluator<unknown>>();

  private makeKey(id: SignalId, version: SignalVersion): string {
    return `${id}\u001F${version}`;
  }

  public register<T>(evaluator: SignalEvaluator<T>): void {
    const key = this.makeKey(evaluator.metadata.id, evaluator.metadata.version);
    this.registry.set(key, evaluator as SignalEvaluator<unknown>);
  }

  public get(id: SignalId, version: SignalVersion): SignalEvaluator<unknown> {
    const key = this.makeKey(id, version);
    const impl = this.registry.get(key);
    if (!impl) {
      throw new SignalNotFoundError(id, version);
    }
    return impl;
  }

  public has(id: SignalId, version: SignalVersion): boolean {
    const key = this.makeKey(id, version);
    return this.registry.has(key);
  }

  public list(): readonly SignalEvaluator<unknown>[] {
    return Array.from(this.registry.values());
  }
}
