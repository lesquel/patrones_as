import type { HttpAdapter } from "../adapters/http-adapter.interface";
import type { Pokemon } from "../models/pokemon.model";
import { PokemonMapper } from "../mappers/pokemon.mapper";
import type { PokeAPIPokemonResponse } from "../interfaces/pokeapi-response.interface";
import { FetchAdapter } from "../adapters/fetch.adapter";
import type { Pagination } from "../interfaces/pagination.interface";
import type {
  PokeAPIListResponse,
  PokeAPIListResult,
} from "../interfaces/pokeapi-list.interface";

export class PokemonService {
  private readonly http: HttpAdapter = new FetchAdapter();

  async getPokemonById(id: number): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await this.http.get<PokeAPIPokemonResponse>(url);
    return PokemonMapper.apiToEntity(data);
  }

  // Fetch paginated list, then request details for each result and map to Pokemon
  async getAllPokemon(pagination: Pagination): Promise<Pokemon[]> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${
      pagination.limit
    }&offset=${pagination.limit * pagination.page}`;

    console.log("[PokemonService] fetching:", url);
    console.log("[PokemonService] pagination:", pagination);

    const list = await this.http.get<PokeAPIListResponse<PokeAPIListResult>>(
      url
    );

    // Request each pokemon detail in parallel (be careful with very large limits)
    const detailPromises = list.results.map((r) =>
      this.http.get<PokeAPIPokemonResponse>(r.url)
    );

    const details = await Promise.all(detailPromises);

    return details.map(PokemonMapper.apiToEntity);
  }
}
