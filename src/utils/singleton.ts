const __singleton_registry = new Map<Function, any>();

export abstract class Singleton {
  protected constructor() {}

  // Use a permissive `this` type to allow subclasses with protected constructors.
  // This keeps the runtime safety of a singleton registry while avoiding
  // TypeScript constructor-visibility mismatches.
  static getInstance<T>(this: any, ...args: any[]): T {
    const ctor = this as Function;
    if (!__singleton_registry.has(ctor)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      __singleton_registry.set(ctor, new (this as any)(...args));
    }
    return __singleton_registry.get(ctor) as T;
  }
}

export default Singleton;
