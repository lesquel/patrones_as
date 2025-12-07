import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import { PokemonService } from "./services/pokemon.service";
import { PokemonGrid } from "./components/PokemonGrid";
import { PaginationControls } from "./components/PaginationControls";

export function App() {
  const pokemonList = useSignal<Pokemon[]>([]);
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const page = useSignal(0);
  const limit = useSignal(10);

  const svcRef = useRef(new PokemonService());
  const lastFetchId = useRef(0);
  // no pending queue needed: we'll run fetchPage from an effect when page/limit change

  const fetchPage = async () => {
    const myId = ++lastFetchId.current;
    loading.value = true;
    error.value = null;
    try {
      const results = await svcRef.current.getAllPokemon({
        page: page.value,
        limit: limit.value,
        total: 0,
      });
      if (myId === lastFetchId.current) {
        pokemonList.value = results;
        console.log(
          "[App] assigned pokemonList, length:",
          pokemonList.value.length
        );

        // previously we used a pending queue here; now fetchPage is triggered
        // by the effect that listens to `page.value` / `limit.value` so nothing else needed
      } else {
        console.log("[App] ignored stale results for fetchId:", myId);
      }
    } catch (err: any) {
      if (myId === lastFetchId.current) {
        error.value = err?.message ?? String(err);
        pokemonList.value = [];
      }
    } finally {
      if (myId === lastFetchId.current) loading.value = false;
    }
  };

  useEffect(() => {
    // fetch when page or limit change (also runs on mount)
    void fetchPage();
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page.value, limit.value]);

  const prev = () => {
    if (loading.value) return;
    if (page.value <= 0) return;
    page.value = page.value - 1;
    console.log("[App] prev page:", page.value);
  };

  const next = () => {
    if (loading.value) return;
    page.value = page.value + 1;
    console.log("[App] next page:", page.value);
  };

  const changeLimit = (v: number) => {
    const val = Math.max(1, v);
    limit.value = val;
    page.value = 0;
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pokémon (Adapter + Clean Architecture)</h1>

      <PaginationControls
        page={page}
        limit={limit}
        loading={loading}
        onPrev={prev}
        onNext={next}
        onChangeLimit={changeLimit}
        onLoad={() => void fetchPage()}
      />

      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}

      <p>Loaded: {pokemonList.value.length}</p>

      <PokemonGrid list={pokemonList} />
    </div>
  );
}
