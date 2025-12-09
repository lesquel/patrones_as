import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import pokemonService from "./services/pokemon.service";
import { PaginationControls } from "./components/PaginationControls";
import { Home } from "./page/home";

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

      <Home pokemonList={pokemonList} loading={loading} error={error} />
    </div>
  );
}
