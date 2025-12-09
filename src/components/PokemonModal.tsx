import { useEffect } from "preact/hooks";
import modalService from "../services/modal.service";

export function PokemonModal() {
  const ms = modalService;
  const open = ms.open;
  const loading = ms.loading;
  const data = ms.data;
  const error = ms.error;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") ms.close();
    }
    globalThis.addEventListener("keydown", onKey);
    return () => globalThis.removeEventListener("keydown", onKey);
  }, []);

  if (!open.value) return null;

  return (
    <dialog open className="modal modal-open">
      <div className="modal-box max-w-3xl">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-xl">
            {data.value?.name ?? "Detalles"}
          </h3>
          <button
            aria-label="Close"
            className="btn btn-sm"
            onClick={() => ms.close()}
          >
            Close
          </button>
        </div>

        {loading.value && <div className="py-6">Cargando...</div>}
        {!loading.value && error.value && (
          <div className="text-error py-6">{error.value}</div>
        )}

        {!loading.value && !error.value && data.value && (
          <div className="py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col items-center">
              <img
                src={data.value.sprites?.front_default}
                alt={data.value.name}
                style={{ width: 160, height: 160, objectFit: "contain" }}
              />
              <div className="mt-2 text-center">
                <div className="font-semibold">#{data.value.id}</div>
                <div className="capitalize">{data.value.name}</div>
              </div>
            </div>

            <div>
              <div className="mb-2">
                <strong>Types:</strong>{" "}
                {data.value.types?.map((t: any) => t.type.name).join(", ")}
              </div>
              <div className="mb-2">
                <strong>Height:</strong> {data.value.height}
              </div>
              <div className="mb-2">
                <strong>Weight:</strong> {data.value.weight}
              </div>
              <div className="mb-2">
                <strong>Abilities:</strong>{" "}
                {data.value.abilities
                  ?.map((a: any) => a.ability.name)
                  .join(", ")}
              </div>
              <div className="mt-4">
                <strong>Stats</strong>
                <ul className="list-disc list-inside">
                  {data.value.stats?.map((s: any) => (
                    <li key={s.stat.name}>
                      {s.stat.name}: {s.base_stat}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}

export default PokemonModal;
