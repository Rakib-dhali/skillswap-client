"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

function Statistics() {
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/statistics`);
        if (res.ok) {
          setStatsData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      }
    };

    fetchStats();
  }, []);

  if (!statsData) {
    return (
      <section className="bg-black text-white py-12 px-6 md:px-16 lg:px-24 select-none">
        <div className="max-w-7xl w-full mx-auto text-center">
          <span className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Loading statistics...
          </span>
        </div>
      </section>
    );
  }

  const stats = [
    { value: `${statsData.totalTasks}+`, label: "Tasks Posted" },
    { value: `${statsData.totalUsers}+`, label: "Active Users", hasBorder: true },
    { value: `$${statsData.totalRevenue}+`, label: "Total Payouts" },
  ];

  return (
    <section className="bg-black text-white py-12 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 items-center justify-center text-center">
        
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className={`flex flex-col items-center justify-center py-4 ${
              stat.hasBorder ? "md:border-x md:border-white/20" : ""
            }`}
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.15 + 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
              className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase font-sans"
            >
              {stat.value}
            </motion.span>
            <span className="text-[9px] md:text-[10px] tracking-[0.2em] font-bold text-white/50 uppercase mt-3">
              {stat.label}
            </span>
          </motion.div>
        ))}

      </div>
    </section>
  );
}

export default Statistics;