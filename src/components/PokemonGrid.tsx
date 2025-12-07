import type { Pokemon } from "../models/pokemon.model";
import { PokemonCard } from "./PokemonCard";
import type { Signal } from "@preact/signals";

export function PokemonGrid({ list }: Readonly<{ list: Signal<Pokemon[]> }>) {
  return (
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {list.value.map((p: Pokemon) => (
        <div key={p.id} class="p-1">
          <PokemonCard p={p} />
        </div>
      ))}
    </div>
  );
}
