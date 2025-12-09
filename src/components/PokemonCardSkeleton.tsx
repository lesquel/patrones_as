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

export const PokemonCardSkeleton = () => {
  return (
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
  );
};
