import type { Pokemon } from "../models/pokemon.model";

export function PokemonCard({ p }: Readonly<{ p: Pokemon }>) {
  return (
    <div class="card card-compact bg-base-100 shadow">
      {p.avatar ? (
        <figure>
          <img
            src={p.avatar}
            alt={p.name}
            style={{ width: 160, height: 160, objectFit: "contain" }}
          />
        </figure>
      ) : null}
      <div class="card-body">
        <h2 class="card-title">{p.name}</h2>
        <p class="text-sm text-muted">#{p.id}</p>
      </div>
    </div>
  );
}
