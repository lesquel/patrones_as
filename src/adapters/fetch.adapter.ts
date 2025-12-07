import type { HttpAdapter } from "./http-adapter.interface";

export class FetchAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const res = await fetch(url);
      if (!res.ok)
        throw new Error(`Network response was not ok (${res.status})`);
      const data = await res.json();
      return data as T;
    } catch (err) {
      throw new Error(`FetchAdapter GET error: ${String(err)}`);
    }
  }
}
