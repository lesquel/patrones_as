import type { Pokemon } from "../models/pokemon.model";

export function PokemonCard({ p }: { p: Pokemon }) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 8 }}>
      <p>
        <strong>{p.name}</strong>
      </p>
      <p>#{p.id}</p>
      {p.avatar && (
        <img src={p.avatar} alt={p.name} style={{ width: 96, height: 96 }} />
      )}
    </div>
  );
}
