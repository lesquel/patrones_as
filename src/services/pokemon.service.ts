import type { HttpAdapter } from "../adapters/http-adapter.interface";
import type { Pokemon } from "../models/pokemon.model";
import { PokemonMapper } from "../mappers/pokemon.mapper";
import type { PokeAPIPokemonResponse } from "../interfaces/pokeapi-response.interface";
import type { Pagination } from "../interfaces/pagination.interface";
import type {
  PokeAPIListResponse,
  PokeAPIListResult,
} from "../interfaces/pokeapi-list.interface";
import axiosAdapter from "../adapters/axios.adapter";
import { Singleton } from "../utils/singleton";

export class PokemonService extends Singleton {
  private readonly http: HttpAdapter = axiosAdapter as unknown as HttpAdapter;

  async getPokemonById(id: number): Promise<Pokemon> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const data = await this.http.get<PokeAPIPokemonResponse>(url);
    return PokemonMapper.apiToEntity(data);
  }

  private async fetchDetailsFromResults(
    results: PokeAPIListResult[],
    concurrency = 5
  ): Promise<PokeAPIPokemonResponse[]> {
    const out: PokeAPIPokemonResponse[] = [];

    for (let i = 0; i < results.length; i += concurrency) {
      const chunk = results.slice(i, i + concurrency);

      const chunkDetails = await Promise.all(
        chunk.map((r) =>
          this.http.get<PokeAPIPokemonResponse>(r.url).catch(() => null)
        )
      );

      out.push(...(chunkDetails.filter(Boolean) as PokeAPIPokemonResponse[]));
    }
    return out;
  }

  async getAllPokemon(pagination: Pagination): Promise<Pokemon[]> {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${
      pagination.limit
    }&offset=${pagination.limit * pagination.page}`;

    const list = await this.http.get<PokeAPIListResponse<PokeAPIListResult>>(
      url
    );

    const CONCURRENCY = 5;
    const details = await this.fetchDetailsFromResults(
      list.results,
      CONCURRENCY
    );

    return details.map(PokemonMapper.apiToEntity);
  }
}

export const pokemonService: PokemonService =
  PokemonService.getInstance() as unknown as PokemonService;
export default pokemonService;
