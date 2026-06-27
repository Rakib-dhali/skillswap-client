export default function Loading() {
  return (
    <main className="min-h-screen py-12 select-none font-sans bg-[#F5F5F5] animate-pulse">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24">
        
        {/* Upper Architecture Skeleton: Identity Card Stack */}
        <div className="bg-white border border-black/5 p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-6 w-full sm:w-auto">
            {/* Avatar Placeholder */}
            <div className="w-20 h-20 bg-black/10 shrink-0" />

            <div className="space-y-3 w-48">
              {/* Name */}
              <div className="h-6 bg-black/10 w-full" />
              {/* Title */}
              <div className="h-3 bg-black/10 w-2/3" />
            </div>
          </div>

          {/* Pricing Highlight Tag Placeholder */}
          <div className="h-14 bg-black/10 w-full sm:w-32" />
        </div>

        {/* Workspace Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT DECK: Profile Core Bio & Technical Stack */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Biography Details Placeholder */}
            <div className="bg-white border border-black/5 p-8 min-h-40">
              <div className="h-4 bg-black/10 w-44 pb-4 mb-6 border-b border-black/5" />
              <div className="space-y-2">
                <div className="h-3 bg-black/5 w-full" />
                <div className="h-3 bg-black/5 w-full" />
                <div className="h-3 bg-black/5 w-4/5" />
              </div>
            </div>

            {/* Technical Tooling & Skill Badges Block */}
            <div className="bg-white border border-black/5 p-8">
              <div className="h-4 bg-black/10 w-40 pb-4 mb-6 border-b border-black/5" />
              <div className="flex flex-wrap gap-2">
                <div className="h-7 bg-black/5 w-16" />
                <div className="h-7 bg-black/5 w-24" />
                <div className="h-7 bg-black/5 w-20" />
                <div className="h-7 bg-black/5 w-14" />
              </div>
            </div>

          </div>

          {/* RIGHT DECK: Work Direct Hire Form Placeholder */}
          <div className="space-y-6">
            <div className="bg-white border border-black/5 p-6 min-h-80 flex flex-col justify-between">
              <div>
                <div className="h-4 bg-black/10 w-28 pb-4 mb-6 border-b border-black/5" />
                <div className="space-y-4">
                  <div>
                    <div className="h-2.5 bg-black/10 w-28 mb-2" />
                    <div className="h-9 bg-black/5 w-full" />
                  </div>
                  <div>
                    <div className="h-2.5 bg-black/10 w-20 mb-2" />
                    <div className="h-20 bg-black/5 w-full" />
                  </div>
                </div>
              </div>
              <div className="h-11 bg-black/10 w-full mt-4" />
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}