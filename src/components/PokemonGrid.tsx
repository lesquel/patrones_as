import type { Pokemon } from "../models/pokemon.model";
import { PokemonCard } from "./PokemonCard";

export function PokemonGrid({ list }: { list: Pokemon[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 12,
      }}
    >
      {list.map((p: Pokemon) => (
        <PokemonCard p={p} key={p.id} />
      ))}
    </div>
  );
}
