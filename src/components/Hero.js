"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="bg-white flex mt-10 items-center px-6 py-12 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl w-full flex flex-col justify-center">
        
        {/* Main Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-[40px] leading-[1.1] sm:text-[56px] md:text-[68px] lg:text-[76px] font-black tracking-tight text-black text-left uppercase font-sans"
        >
          Get your tasks <br />
          done by skilled <br />
          freelancers
        </motion.h1>

        {/* Subtext Description Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-8 md:mt-10 pl-4 border-l-[3px] border-black max-w-[540px]"
        >
          <p className="text-sm sm:text-base text-black/80 font-normal leading-relaxed text-left">
            The fastest, most brutally efficient marketplace for digital micro-tasks. No 
            fluff, just work exchanged for capital. Connect, execute, and scale your 
            operations today.
          </p>
        </motion.div>

        {/* Action Buttons / Navigation Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-12 md:mt-16 flex flex-row items-center gap-8 sm:gap-12 text-xs sm:text-sm font-bold tracking-[0.15em] text-black/70 uppercase"
        >
        <Link href="/dashboard/client/tasks/post">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.08)" }}
            transition={{ type: "tween", stiffness: 400, damping: 20 }}
            className="hover:text-black bg-gray-100 p-2 rounded cursor-pointer"
          >
            Post a task
          </motion.button>
        </Link>
        <Link href="/tasks">
          <motion.button
            whileHover={{ scale: 1.05, backgroundColor: "rgba(0,0,0,0.08)" }}
            transition={{ type: "tween", stiffness: 400, damping: 20 }}
            className="hover:text-black bg-gray-100  p-2 rounded cursor-pointer"
          >
            Browse tasks
          </motion.button></Link>
        </motion.div>

      </div>
    </section>
  );
}