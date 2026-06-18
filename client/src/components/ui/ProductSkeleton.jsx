export default function ProductSkeleton({ featured = false }) {
  return (
    <div className={`card overflow-hidden ${featured ? 'md:col-span-2' : ''}`}>
      <div className={`${featured ? 'aspect-[4/3]' : 'aspect-square'} skeleton rounded-none`} />
      <div className="p-4 md:p-5 space-y-3">
        <div className="h-3 w-20 skeleton rounded-full" />
        <div className="h-4 w-3/4 skeleton rounded-lg" />
        <div className="h-3 w-1/2 skeleton rounded-lg" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 w-20 skeleton rounded-lg" />
          <div className="h-9 w-24 skeleton rounded-full" />
        </div>
      </div>
    </div>
  );
}
