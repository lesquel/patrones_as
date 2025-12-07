import type { Pokemon } from "../models/pokemon.model";
import { PokemonCard } from "./PokemonCard";
import type { Signal } from "@preact/signals";

export function PokemonGrid({ list }: { list: Signal<Pokemon[]> | Pokemon[] }) {
  const items: Pokemon[] = (list as any)?.value ?? (list as Pokemon[]);
  console.log(
    "[PokemonGrid] items length:",
    items.length,
    "isSignal:",
    !!(list as any)?.value
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {items.map((p: Pokemon) => (
        <PokemonCard p={p} key={p.id} />
      ))}
    </div>
  );
}
