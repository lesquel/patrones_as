import type { Signal } from "@preact/signals";
import { PokemonGrid } from "../components/PokemonGrid";
import type { Pokemon } from "./../models/pokemon.model";
import { PokemonCardSkeleton } from "../components/PokemonCardSkeleton";
import PokemonModal from "../components/PokemonModal";

export function Home({
  pokemonList,
  loading,
  error,
}: {
  readonly pokemonList: Signal<Pokemon[]>;
  readonly loading: Signal<boolean>;
  readonly error: Signal<string | null>;
}) {
  if (loading.value) return <PokemonCardSkeleton />;
  if (error.value) return <p className="text-error">{error.value}</p>;
  return (
    <div>
      <div className="mb-4">
        <span className="font-medium">Loaded:</span>{" "}
        <span className="ml-2">{pokemonList.value.length}</span>
      </div>

      <PokemonGrid list={pokemonList} />
      <PokemonModal />
    </div>
  );
}
