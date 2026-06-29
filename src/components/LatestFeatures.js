"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

function LatestFeatures() {
  const [tasksData, setTasksData] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/featured-task`);

        if (res.ok) {
          setTasksData(await res.json());
        }
      } catch (error) {
        console.error("Failed to fetch featured tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  return (
    <section className="bg-[#F5F5F5] py-16 px-6 md:px-16 lg:px-24 select-none border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex justify-between items-baseline mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-black uppercase">
            Latest Featured Tasks
          </h2>
          <motion.button
            whileHover={{ x: 4 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-[10px] tracking-[0.2em] font-bold text-black/60 uppercase hover:text-black transition-colors duration-200 cursor-pointer"
          >
            View All &gt;
          </motion.button>
        </motion.div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {tasksData.map((task, index) => {
            const taskId = task._id;

            return (
              <motion.div
                key={taskId}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
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
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default LatestFeatures;