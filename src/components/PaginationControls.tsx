export function PaginationControls(props: {
  page: number;
  limit: number;
  loading?: boolean;
  onPrev: () => void;
  onNext: () => void;
  onChangeLimit: (v: number) => void;
  onLoad: () => void;
}) {
  const { page, limit, onPrev, onNext, onChangeLimit, onLoad } = props;

  return (
    <div
      style={{
        display: "flex",
        gap: 8,
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <button onClick={onPrev} disabled={page === 0}>
        Prev
      </button>
      <span>Page: {page + 1}</span>
      <button onClick={onNext} disabled={props.loading === true}>
        Next
      </button>

      <label style={{ marginLeft: 12 }}>
        Per page:
        <input
          type="number"
          value={limit}
          min={1}
          onInput={(e: any) => onChangeLimit(Number(e.currentTarget.value))}
          style={{ width: 64, marginLeft: 6 }}
        />
      </label>

      <button
        onClick={onLoad}
        style={{ marginLeft: 12 }}
        disabled={props.loading === true}
      >
        {props.loading === true ? "Loading..." : "Load"}
      </button>
    </div>
  );
}
