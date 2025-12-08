import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import pokemonService from "./services/pokemon.service";
import { PokemonGrid } from "./components/PokemonGrid";
import { PaginationControls } from "./components/PaginationControls";

const SKELETON_KEYS = [
  "sk-1",
  "sk-2",
  "sk-3",
  "sk-4",
  "sk-5",
  "sk-6",
  "sk-7",
  "sk-8",
];

export function App() {
  const pokemonList = useSignal<Pokemon[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const page = useSignal(0);
  const limit = useSignal(10);

  const lastFetchId = useRef(0);

  const fetchPage = async () => {
    const id = ++lastFetchId.current;
    loading.value = true;
    error.value = null;
    try {
      const results = await pokemonService.getAllPokemon({
        page: page.value,
        limit: limit.value,
        total: 0,
      });
      if (id === lastFetchId.current) pokemonList.value = results;
    } catch (e: any) {
      if (id === lastFetchId.current) {
        error.value = e?.message ?? String(e);
        pokemonList.value = [];
      }
    } finally {
      if (id === lastFetchId.current) loading.value = false;
    }
  };

  useEffect(() => {
    void fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.value, limit.value]);

  const prev = () => {
    if (loading.value) return;
    if (page.value <= 0) return;
    page.value = page.value - 1;
  };

  const next = () => {
    if (loading.value) return;
    page.value = page.value + 1;
  };

  const changeLimit = (v: number) => {
    limit.value = Math.max(1, v);
    page.value = 0;
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">
        Pokémon (Adapter + Clean Architecture)
      </h1>

      <PaginationControls
        page={page}
        limit={limit}
        loading={loading}
        onPrev={prev}
        onNext={next}
        onChangeLimit={changeLimit}
        onLoad={() => void fetchPage()}
      />

      {loading.value && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
          {SKELETON_KEYS.map((k) => (
            <div key={k} className="card card-compact bg-base-100 shadow">
              <div className="skeleton h-40 w-full" />
              <div className="card-body">
                <div className="skeleton h-6 w-3/4 mb-2" />
                <div className="skeleton h-4 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error.value && <p className="text-error">{error.value}</p>}

      <div className="mb-4">
        <span className="font-medium">Loaded:</span>{" "}
        <span className="ml-2">{pokemonList.value.length}</span>
      </div>

      <PokemonGrid list={pokemonList} />
    </div>
  );
}
