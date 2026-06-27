export default function Loading() {
  return (
    <main className="min-h-screen bg-[#F5F5F5] py-12 select-none font-sans animate-pulse">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Upper Architecture Skeleton */}
        <div className="mb-8">
          {/* Title Line */}
          <div className="h-9 bg-black/10 w-3/4 max-w-2xl mb-4" />
          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-5 bg-black/10 w-14" />
            <div className="h-5 bg-black/10 w-20" />
            <div className="h-5 bg-black/10 w-16" />
          </div>
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT DECK */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white border border-black/5 p-8 min-h-[220px]">
              <div className="h-5 bg-black/10 w-36 mb-6" />
              <div className="space-y-3">
                <div className="h-3 bg-black/10 w-full" />
                <div className="h-3 bg-black/10 w-full" />
                <div className="h-3 bg-black/10 w-4/5" />
                <div className="h-3 bg-black/10 w-2/3" />
              </div>
            </div>

            {/* Financial Parameters Deck */}
            <div className="bg-white border border-black/5 p-6 grid grid-cols-3 gap-4">
              <div>
                <div className="h-2.5 bg-black/10 w-12 mb-2" />
                <div className="h-4 bg-black/10 w-16" />
              </div>
              <div className="border-l border-black/10 pl-4">
                <div className="h-2.5 bg-black/10 w-14 mb-2" />
                <div className="h-4 bg-black/10 w-20" />
              </div>
              <div className="border-l border-black/10 pl-4">
                <div className="h-2.5 bg-black/10 w-14 mb-2" />
                <div className="h-4 bg-black/10 w-20" />
              </div>
            </div>
          </div>

          {/* RIGHT DECK */}
          <div className="space-y-6">
            {/* Form Side Widget */}
            <div className="bg-white border border-black/5 p-6 min-h-[340px] flex flex-col justify-between">
              <div>
                <div className="h-4 bg-black/10 w-28 pb-4 mb-6" />
                <div className="space-y-4">
                  <div>
                    <div className="h-2 bg-black/10 w-16 mb-2" />
                    <div className="h-9 bg-black/5 w-full" />
                  </div>
                  <div>
                    <div className="h-2 bg-black/10 w-20 mb-2" />
                    <div className="h-9 bg-black/5 w-full" />
                  </div>
                </div>
              </div>
              <div className="h-10 bg-black/10 w-full mt-4" />
            </div>

            {/* Client Card */}
            <div className="bg-white border border-black/5 p-6">
              <div className="h-3 bg-black/10 w-24 mb-4" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-black/5" />
                <div className="space-y-2 w-1/2">
                  <div className="h-3 bg-black/10 w-full" />
                  <div className="h-2 bg-black/10 w-2/3" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}