import axios from "axios";
import type { HttpAdapter } from "./http-adapter.interface";

export class AxiosAdapter implements HttpAdapter {
  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(url);
      return data;
    } catch (err: any) {
      throw new Error(`AxiosAdapter GET error: ${String(err)}`);
    }
  }
}
