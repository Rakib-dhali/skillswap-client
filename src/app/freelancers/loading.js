export default function Loading() {
  return (
    <section className="w-full py-16 select-none font-sans bg-[#F5F5F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Section Header Skeleton */}
        <div className="mb-12 animate-pulse">
          <div className="h-11 bg-black/10 w-72 mb-3" />
          <div className="h-4 bg-black/10 w-full max-w-md" />
        </div>

        {/* Brutalist Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div 
              key={`expert-skeleton-${idx}`}
              className="bg-white border border-black/5 p-6 shadow-sm flex flex-col justify-between min-h-[260px]"
            >
              <div>
                {/* Upper Deck: Profile Meta & Rates */}
                <div className="flex items-start justify-between mb-4">
                  {/* Avatar Frame */}
                  <div className="w-14 h-14 bg-black/10" />
                  {/* Rate Badge */}
                  <div className="h-6 bg-black/10 w-16" />
                </div>

                {/* Identity Block */}
                <div className="mb-4">
                  <div className="h-5 bg-black/10 w-2/3 mb-2" />
                  <div className="h-3 bg-black/10 w-1/3" />
                </div>

                {/* Professional Description Lines */}
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-black/5 w-full" />
                  <div className="h-3 bg-black/5 w-full" />
                  <div className="h-3 bg-black/5 w-4/5" />
                </div>
              </div>

              {/* Lower Deck: Skill Badges */}
              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-black/5">
                <div className="h-5 bg-black/5 w-12" />
                <div className="h-5 bg-black/5 w-16" />
                <div className="h-5 bg-black/5 w-14" />
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}