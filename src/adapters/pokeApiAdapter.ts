import type { Character } from '../models/character'

export class PokeApiAdapter {
  baseUrl = 'https://pokeapi.co/api/v2'

  async fetchPokemon(nameOrId: string | number): Promise<Character> {
    const url = `${this.baseUrl}/pokemon/${encodeURIComponent(String(nameOrId))}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new Error(`PokeAPI error: ${res.status}`)
    }
    const data = await res.json()

    const character: Character = {
      id: data.id,
      name: data.name,
      sprite: data.sprites?.front_default ?? '',
      types: (data.types || []).map((t: any) => t.type.name),
    }

    return character
  }
}
