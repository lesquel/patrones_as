import type { HttpAdapter } from "./http-adapter.interface";
import { Singleton } from "../utils/singleton";

export class FetchAdapter extends Singleton implements HttpAdapter {
  protected constructor() {
    super();
  }

  async get<T>(url: string): Promise<T> {
    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Network response was not ok (${res.status})`);
      const data = await res.json();
      return data as T;
    } catch (err: any) {
      throw new Error(`FetchAdapter GET error: ${String(err)}`);
    }
  }
}

// Export default singleton instance for convenience
export const fetchAdapter = FetchAdapter.getInstance();
export default fetchAdapter;
