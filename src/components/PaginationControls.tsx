import type { Signal } from "@preact/signals";

export function PaginationControls(props: {
  page: Signal<number>;
  limit: Signal<number>;
  loading?: Signal<boolean>;
  onPrev: () => void;
  onNext: () => void;
  onChangeLimit: (v: number) => void;
  onLoad: () => void;
}) {
  const { page, limit, onPrev, onNext, onChangeLimit, onLoad } = props;
  const loading = props.loading?.value === true;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <button
        onClick={onPrev}
        disabled={loading || page.value === 0}
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Prev ⏳" : "Prev"}
      </button>

      <span>
        Page: {page.value + 1} {loading ? "⏳" : ""}
      </span>

      <button
        onClick={onNext}
        disabled={loading}
        style={{ opacity: loading ? 0.6 : 1 }}
      >
        {loading ? "Next ⏳" : "Next"}
      </button>

      <label style={{ marginLeft: 12 }}>
        Per page:
        <input
          type="number"
          value={limit.value}
          min={1}
          onInput={(e: any) => onChangeLimit(Number(e.currentTarget.value))}
          style={{ width: 64, marginLeft: 6 }}
        />
      </label>

      <button onClick={onLoad} style={{ marginLeft: 12 }} disabled={loading}>
        {loading ? "Loading..." : "Load"}
      </button>
    </div>
  );
}
