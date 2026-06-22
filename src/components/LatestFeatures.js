
// Mock database collection data mapping directly to "image_56ab23.png"
const tasksData = [
  { id: '1', categoryName: 'DEVELOPMENT', budget: 150, title: 'Write API Documentation', description: 'Need comprehensive REST API documentation for a new authentication...', dueDate: 'DUE IN 48H', clientName: 'DevCorp' },
  { id: '2', categoryName: 'DESIGN', budget: 85, title: 'Vectorize Company Logo', description: 'Convert a high-res PNG into a clean, scalable SVG file. No creative changes needed, stric...', dueDate: 'DUE IN 24H', clientName: 'PixelCraft' },
  { id: '3', categoryName: 'DATA', budget: 200, title: 'Scrape E-commerce Listings', description: 'Build a Python script to extract product names, prices, and SKUs from a target...', dueDate: 'URGENT: 12H', isUrgent: true, clientName: 'DataInc' },
  { id: '4', categoryName: 'WRITING', budget: 45, title: 'Technical Blog Post Editor', description: 'Review and edit a 1500-word article on Kubernetes deployment strategies for...', dueDate: 'DUE IN 3 DAYS', clientName: 'CloudMedia' },
  { id: '5', categoryName: 'VIDEO', budget: 300, title: 'Short Form Ad Editing', description: 'Cut raw footage into three 15-second high-energy clips for TikTok/Reels. Hard cuts,...', dueDate: 'DUE IN 5 DAYS', clientName: 'VibeMedia' },
  { id: '6', categoryName: 'AUDIO', budget: 60, title: 'Podcast Noise Reduction', description: 'Clean up a 45-minute audio track. Remove background hum and level the voices. Exac...', dueDate: 'DUE IN 48H', clientName: 'SoundWave' },
];

 function LatestFeatures() {
  return (
    <section className="bg-[#F5F5F5] py-16 px-6 md:px-16 lg:px-24 select-none border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase">
            Latest Featured Tasks
          </h2>
          <button className="text-[10px] tracking-[0.2em] font-bold text-black/60 uppercase hover:text-black transition-colors duration-200">
            View All &gt;
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {tasksData.map((task) => (
            <div key={task.id} className="flex flex-col hover:bg-gray-200 border-2 border-gray-200 transition-colors duration-200 cursor-pointer p-5 rounded-md justify-between group min-h-47.5">
              <div>
                {/* Category and Budget Line */}
                <div className="flex justify-between items-center text-xs font-bold tracking-wider text-black/40 uppercase mb-4">
                  <span>{task.categoryName}</span>
                  <span className="text-black text-sm font-black">${task.budget}</span>
                </div>

                {/* Task Title */}
                <h3 className="text-lg font-bold text-black leading-tight mb-2 group-hover:underline cursor-pointer">
                  {task.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-black/50 font-normal leading-relaxed mb-6 line-clamp-2">
                  {task.description}
                </p>
              </div>

              {/* Deadline Indicator */}
              <div className="pt-4 border-t border-black/10 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
                {task.isUrgent ? (
                  <span className="text-red-500 flex items-center gap-1">
                    ⚠️ {task.dueDate}
                  </span>
                ) : (
                  <span className="text-black/40 flex items-center gap-1">
                    🕒 {task.dueDate}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default LatestFeatures;