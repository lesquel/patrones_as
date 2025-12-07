export interface HttpAdapter {
  get<T>(url: string): Promise<T>;
  post?<T>(url: string, body: any): Promise<T>;
  put?<T>(url: string, body: any): Promise<T>;
  delete?(url: string): Promise<void>;
}
