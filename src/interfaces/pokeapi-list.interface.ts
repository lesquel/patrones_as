export interface PokeAPIListResult {
  name: string;
  url: string;
}

export interface PokeAPIListResponse<T = PokeAPIListResult> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
