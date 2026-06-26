async function LatestFeatures() {
  let tasksData = [];

  try {
    // 1. Fixed missing await keyword
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/featured-task`, {
      cache: 'no-store' // Ensures dynamic data updates
    });
    
    if (res.ok) {
      tasksData = await res.json();
    }
  } catch (error) {
    console.error("Failed to fetch featured tasks:", error);
  }
  return (
    <section className="bg-[#F5F5F5] py-16 px-6 md:px-16 lg:px-24 select-none border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase">
            Latest Featured Tasks
          </h2>
          <button className="text-[10px] tracking-[0.2em] font-bold text-black/60 uppercase hover:text-black transition-colors duration-200 cursor-pointer">
            View All &gt;
          </button>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {tasksData.map((task) => {
            // Safe fallback value mapping for key and deadline format
            const taskId = task._id;
            
            return (
              <div 
                key={taskId} 
                className="flex flex-col hover:bg-gray-200 border-2 border-gray-200 transition-colors duration-200 cursor-pointer p-5 rounded-md justify-between group min-h-47.5"
              >
                <div>
                  {/* Category and Budget Line */}
                  <div className="flex justify-between items-center text-xs font-bold tracking-wider text-black/40 uppercase mb-4">
                    {/* Fixed: task.categoryName -> task.category */}
                    <span>{task.category || "General"}</span>
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
                  {/* Fixed property values using task.deadline */}
                  <span className="text-black/40 flex items-center gap-1">
                    🕒 {task.deadline || "No deadline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default LatestFeatures;