import { Singleton } from "./singleton";

type Handler<T = any> = (payload: T) => void;

export class EventBus extends Singleton {
  private readonly handlers = new Map<string, Set<Handler>>();

  on<T = any>(event: string, h: Handler<T>) {
    if (!this.handlers.has(event)) this.handlers.set(event, new Set());
    this.handlers.get(event)!.add(h as Handler);
    return () => this.off(event, h);
  }

  off<T = any>(event: string, h: Handler<T>) {
    this.handlers.get(event)?.delete(h as Handler);
  }

  emit<T = any>(event: string, payload?: T) {
    const set = this.handlers.get(event);
    if (!set) return;
    for (const h of Array.from(set)) {
      h(payload as T);
    }
  }
}

export const eventBus = EventBus.getInstance<EventBus>();
export default eventBus;
