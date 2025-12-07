import type { Pokemon } from "../models/pokemon.model";
import type { PokeAPIPokemonResponse } from "../interfaces/pokeapi-response.interface";

export class PokemonMapper {
  static apiToEntity(data: PokeAPIPokemonResponse): Pokemon {
    return {
      id: data.id,
      name: data.name
        ? data.name.charAt(0).toUpperCase() + data.name.slice(1)
        : "",
      avatar: data.sprites?.front_default ?? "",
    };
  }
}
