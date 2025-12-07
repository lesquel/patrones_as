import { signal } from "@preact/signals";
import "./index.css";
import type { Pokemon } from "./models/pokemon.model";
import { PokemonService } from "./services/pokemon.service";

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

      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <button onClick={prev} disabled={page.value === 0}>
          Prev
        </button>
        <span>Page: {page.value + 1}</span>
        <button onClick={next}>Next</button>

        <label style={{ marginLeft: 12 }}>
          Per page:
          <input
            type="number"
            value={limit.value}
            min={1}
            onInput={(e: any) => changeLimit(Number(e.currentTarget.value))}
            style={{ width: 64, marginLeft: 6 }}
          />
        </label>

        <button onClick={() => void fetchPage()} style={{ marginLeft: 12 }}>
          Load
        </button>
      </div>

      {loading.value && <p>Loading...</p>}
      {error.value && <p style={{ color: "red" }}>{error.value}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: 12,
        }}
      >
        {pokemonList.value.map((p) => (
          <div key={p.id} style={{ border: "1px solid #ddd", padding: 8 }}>
            <p>
              <strong>{p.name}</strong>
            </p>
            <p>#{p.id}</p>
            {p.avatar && (
              <img
                src={p.avatar}
                alt={p.name}
                style={{ width: 96, height: 96 }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
