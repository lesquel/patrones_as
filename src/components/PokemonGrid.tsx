import type { Pokemon } from "../models/pokemon.model";
import { PokemonCard } from "./PokemonCard";
import type { Signal } from "@preact/signals";

export function PokemonGrid({ list }: { list: Signal<Pokemon[]> }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {list.value.map((p: Pokemon) => (
        <PokemonCard p={p} key={p.id} />
      ))}
    </div>
  );
}
