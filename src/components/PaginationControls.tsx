import type { Signal } from "@preact/signals";

export function PaginationControls(props: {
  readonly page: Signal<number>;
  readonly limit: Signal<number>;
  readonly loading?: Signal<boolean>;
  readonly onPrev: () => void;
  readonly onNext: () => void;
  readonly onChangeLimit: (v: number) => void;
  readonly onLoad: () => void;
}) {
  const { page, limit, onPrev, onNext, onChangeLimit, onLoad } = props;
  const loading = props.loading?.value === true;

  const prevClass = `btn btn-sm ${
    loading || page.value === 0 ? "btn-disabled" : "btn-ghost"
  }`;
  const nextClass = `btn btn-sm ${loading ? "btn-disabled" : "btn-primary"}`;

  return (
    <div class="flex items-center gap-4 mb-3">
      <button onClick={onPrev} class={prevClass} aria-label="previous page">
        Prev
      </button>

      <span class="font-medium">
        Page: {page.value + 1} {loading ? <span class="ml-2">⏳</span> : null}
      </span>

      <button onClick={onNext} class={nextClass} aria-label="next page">
        Next
      </button>

      <div class="ml-4 flex items-center gap-2">
        <label class="flex items-center gap-2">
          <span class="text-sm">Per page:</span>
          <input
            class="input input-sm input-bordered w-20"
            type="number"
            value={limit.value}
            min={1}
            onInput={(e: any) => onChangeLimit(Number(e.currentTarget.value))}
            disabled={loading}
          />
        </label>

        <button
          onClick={onLoad}
          class={`btn btn-sm ${loading ? "btn-disabled" : "btn-outline"}`}
        >
          {loading ? <span class="loading loading-spinner"></span> : "Load"}
        </button>
      </div>
    </div>
  );
}
