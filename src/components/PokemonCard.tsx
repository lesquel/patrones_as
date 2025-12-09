import type { Pokemon } from "../models/pokemon.model";
import eventBus from "../utils/event-bus";

export function PokemonCard({ p }: Readonly<{ p: Pokemon }>) {
  const onOpen = () => eventBus.emit<number>("pokemon:open", p.id);

  return (
    <button
      onClick={onOpen}
      class="card card-compact bg-base-100 shadow text-left"
    >
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
    </button>
  );
}
