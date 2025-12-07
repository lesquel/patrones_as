import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import { PokemonService } from "./services/pokemon.service";
import { PokemonGrid } from "./components/PokemonGrid";
import { PaginationControls } from "./components/PaginationControls";

export function App() {
  const pokemonList = signal<Pokemon[]>([]);
  const loading = signal(false);
  const error = signal<string | null>(null);
  const page = signal(0);
  const limit = signal(10);

  const svc = new PokemonService();

  const fetchPage = async () => {
    loading.value = true;
    error.value = null;
    try {
      const results = await svc.getAllPokemon({
        page: page.value,
        limit: limit.value,
        total: 0,
      });
      pokemonList.value = results;
    } catch (err: any) {
      error.value = err?.message ?? String(err);
      pokemonList.value = [];
    } finally {
      loading.value = false;
    }
  };

  useEffect(() => {
    // fetch initial page on mount
    void fetchPage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const prev = () => {
    if (page.value <= 0) return;
    page.value -= 1;
    void fetchPage();
  };

  const next = () => {
    page.value += 1;
    void fetchPage();
  };

  const changeLimit = (v: number) => {
    limit.value = Math.max(1, v);
    page.value = 0;
    void fetchPage();
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Pokémon (Adapter + Clean Architecture)</h1>

      <PaginationControls
        page={page}
        limit={limit}
        onPrev={prev}
        onNext={next}
        onChangeLimit={changeLimit}
        onLoad={() => void fetchPage()}
      />

      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}

      <PokemonGrid list={pokemonList.value} />
    </div>
  );
}
