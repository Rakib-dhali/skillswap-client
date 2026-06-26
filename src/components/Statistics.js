async function Statistics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/statistics`);
  const statsData = await res.json();
  return (
    <section className="bg-black text-white py-12 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center justify-center text-center">
        
        {/* Stat 1: Tasks Posted */}
        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
            {statsData.totalTasks}+
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase mt-3">
            Tasks Posted
          </span>
        </div>

        {/* Stat 2: Active Users */}
        <div className="flex flex-col items-center justify-center py-4 md:border-x md:border-white/20">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
            {statsData.totalUsers}+
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase mt-3">
            Active Users
          </span>
        </div>

        {/* Stat 3: Total Payouts */}
        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans">
            ${statsData.totalRevenue}+
          </span>
          <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase mt-3">
            Total Payouts
          </span>
        </div>

      </div>
    </section>
  );
}

export default Statistics;