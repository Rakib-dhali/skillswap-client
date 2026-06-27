export default function Loading() {
  return (
    <section className="w-full bg-[#F5F5F5] min-h-screen py-16 font-sans select-none text-black">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Header Skeleton */}
        <div className="mb-10 animate-pulse">
          <div className="h-11 bg-black/10 w-64 mb-3" />
          <div className="h-4 bg-black/10 w-full max-w-xl" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-white border border-black/10 p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-end animate-pulse">
          <div className="w-full md:w-2/5 h-12 bg-black/5" />
          <div className="w-full md:w-1/4 h-12 bg-black/5" />
          <div className="w-full md:w-1/5 h-12 bg-black/5" />
          <div className="w-full md:w-1/5 h-12 bg-black/5" />
          <div className="w-full md:w-auto h-10 bg-black/10 w-24" />
        </div>

        {/* Active Filter Tags Skeleton placeholder */}
        <div className="h-6.5 mb-8" />

        {/* Grid Tasks Skeleton Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-pulse">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`skeleton-card-${idx}`}
              className="bg-white border border-black/5 p-6 shadow-sm flex flex-col justify-between min-h-[190px]"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="h-6 bg-black/10 w-2/3" />
                  <div className="h-5 bg-black/10 w-16" />
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-black/10 w-full" />
                  <div className="h-3 bg-black/10 w-4/5" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-black/5">
                <div className="flex items-center gap-2 w-1/2">
                  <div className="w-6 h-6 bg-black/10" />
                  <div className="h-3 bg-black/10 w-24" />
                </div>
                <div className="h-4 bg-black/10 w-14" />
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </section>
  );
}