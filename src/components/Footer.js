"use client";

import { FaXTwitter, FaFacebookF, FaInstagram } from 'react-icons/fa6';
import { motion } from "motion/react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const columnVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: i * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <footer className="bg-white border-t border-black/10 py-16 px-6 md:px-16 lg:px-24 select-none">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 items-start">
        
        {/* Column 1: Brand & Contact Info */}
        <motion.div
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={columnVariants}
          className="flex flex-col gap-4"
        >
          <h2 className="text-xl font-black tracking-tighter uppercase text-black">
            SkillSwap
          </h2>
          <div className="text-xs tracking-wider text-black/60 font-medium">
            <span className="block mb-1 font-black text-[10px] text-black/40">SUPPORT & OPERATIONS</span>
            <a href="mailto:ops@skillswap.com" className="text-black hover:underline transition-all block">
              ops@skillswap.com
            </a>
          </div>
        </motion.div>

        {/* Column 2: Physical HQ Address */}
        <motion.div
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={columnVariants}
          className="flex flex-col gap-3"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
            Headquarters
          </span>
          <address className="text-xs font-medium tracking-wider text-black/70 not-italic leading-relaxed">
            100 Brutalist Blvd, Suite 404<br />
            New York, NY 10013<br />
            United States
          </address>
        </motion.div>

        {/* Column 3: Navigation Links */}
        <motion.div
          custom={2}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={columnVariants}
          className="flex flex-col gap-3"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
            Navigation
          </span>
          <ul className="flex flex-col gap-2 text-xs font-bold tracking-[0.15em] uppercase text-black/70">
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Home
            </li>
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Browse Tasks
            </li>
            <li className="hover:text-black transition-colors duration-200 cursor-pointer">
              Browse Freelancers
            </li>
          </ul>
        </motion.div>

        {/* Column 4: Social Channels & Legal Copyright */}
        <motion.div
          custom={3}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          variants={columnVariants}
          className="flex flex-col lg:items-end gap-6 self-stretch justify-between"
        >
          <div className="flex flex-col lg:items-end gap-3">
            <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase">
              Connect
            </span>
            <div className="flex items-center gap-5 text-lg text-black/70">
              {/* X (Formerly Twitter) */}
              <motion.a
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="X"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <FaXTwitter />
              </motion.a>
              {/* Facebook */}
              <motion.a
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="Facebook"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <FaFacebookF className="text-[16px]" />
              </motion.a>
              {/* Instagram */}
              <motion.a
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-black transition-colors duration-200"
                aria-label="Instagram"
                whileHover={{ scale: 1.2, y: -2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <FaInstagram />
              </motion.a>
            </div>
          </div>

          {/* Dynamic Copyright Year */}
          <span className="text-[10px] font-bold tracking-widest text-black/40 uppercase whitespace-nowrap lg:text-right mt-4 lg:mt-0">
            © {currentYear} SKILLSWAP INC.
          </span>
        </motion.div>

      </div>
    </footer>
  );
}