import axios from "axios";
import type { HttpAdapter } from "./http-adapter.interface";
import { Singleton } from "../utils/singleton";

export class AxiosAdapter extends Singleton implements HttpAdapter {
  protected constructor() {
    super();
  }

  async get<T>(url: string): Promise<T> {
    try {
      const { data } = await axios.get<T>(url);
      return data;
    } catch (err: any) {
      throw new Error(`AxiosAdapter GET error: ${String(err)}`);
    }
  }
}

// Export a ready-to-use singleton instance so callers don't need to call `getInstance()`.
export const axiosAdapter = AxiosAdapter.getInstance();
export default axiosAdapter;
