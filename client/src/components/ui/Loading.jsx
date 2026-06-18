export default function Loading() {
  return (
    <div className="w-full space-y-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-10 w-56 skeleton rounded-xl" />
        <div className="h-10 w-32 skeleton rounded-xl ml-auto" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card p-5 space-y-4">
            <div className="h-12 w-12 skeleton rounded-2xl" />
            <div className="h-8 w-24 skeleton" />
            <div className="h-3 w-28 skeleton" />
          </div>
        ))}
      </div>
      <div className="card p-6 space-y-5">
        <div className="h-5 w-40 skeleton rounded-lg" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-10 w-10 skeleton rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 skeleton rounded-lg" />
              <div className="h-3 w-1/2 skeleton rounded-lg" />
            </div>
            <div className="h-4 w-20 skeleton rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
