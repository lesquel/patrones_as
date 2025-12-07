import { signal } from "@preact/signals";
import { useEffect, useState, useRef } from "preact/hooks";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import { PokemonService } from "./services/pokemon.service";
import { PokemonGrid } from "./components/PokemonGrid";
import { PaginationControls } from "./components/PaginationControls";

export function App() {
  const pokemonList = signal<Pokemon[]>([]);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const svc = new PokemonService();
  const [localList, setLocalList] = useState<Pokemon[]>([]);
  const lastFetchId = useRef(0);
  const pending = useRef(false);

  const fetchPage = async () => {
    const myId = ++lastFetchId.current;
    loading.value = true;
    error.value = null;
    try {
      const results = await svc.getAllPokemon({
        page: page,
        limit: limit,
        total: 0,
      });
      console.log(
        "[App] fetched results:",
        results.length,
        "fetchId:",
        myId,
        "page:",
        page,
        "limit:",
        limit
      );

      if (myId === lastFetchId.current) {
        pokemonList.value = results;
        setLocalList(results);
        console.log(
          "[App] pokemonList.value after set:",
          pokemonList.value.length,
          pokemonList
        );
        // if a new page was requested while we were loading, trigger it now
        if (pending.current) {
          pending.current = false;
          // schedule next fetch (will read current page)
          void fetchPage();
        }
      } else {
        console.log("[App] ignored stale results for fetchId:", myId);
      }
    } catch (err: any) {
      if (myId === lastFetchId.current) {
        error.value = err?.message ?? String(err);
        pokemonList.value = [];
        setLocalList([]);
      }
    } finally {
      if (myId === lastFetchId.current) loading.value = false;
    }
  };

  useEffect(() => {
    // fetch initial page on mount
    void fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = () => {
    if (loading.value) {
      if (page <= 0) return;
      setPage((p) => p - 1);
      pending.current = true;
      return;
    }
    if (page <= 0) return;
    setPage((p) => p - 1);
    void fetchPage();
  };

  const next = () => {
    if (loading.value) {
      setPage((p) => p + 1);
      pending.current = true;
      return;
    }
    setPage((p) => p + 1);
    void fetchPage();
  };

  const changeLimit = (v: number) => {
    const val = Math.max(1, v);
    setLimit(val);
    setPage(0);
    void fetchPage();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pokémon (Adapter + Clean Architecture)</h1>

      <PaginationControls
        page={page}
        limit={limit}
        loading={loading.value}
        onPrev={prev}
        onNext={next}
        onChangeLimit={changeLimit}
        onLoad={() => void fetchPage()}
      />

      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}

      <p>Loaded: {pokemonList.value.length}</p>
      <pre style={{ maxHeight: 200, overflow: "auto" }}>
        {JSON.stringify(pokemonList.value, null, 2)}
      </pre>

      <PokemonGrid list={localList} />
    </div>
  );
}
