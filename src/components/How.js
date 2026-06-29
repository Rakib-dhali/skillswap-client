"use client";

import React from 'react';
import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Post a Task",
    description: "Clearly outline your project specs, technical requirements, and target budget. Our system immediately indexes it for top matching freelancers."
  },
  {
    number: "02",
    title: "Get Proposals",
    description: "Review automated matching proposals within minutes. Filter by rating, review historical task data, and vet communication styles cleanly."
  },
  {
    number: "03",
    title: "Hire and Pay",
    description: "Select the perfect fit, initiate work through milestone contracts, and release capital safely only once the task matches your exact standards."
  }
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-20 px-6 md:px-16 lg:px-24 select-none border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title Header */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-xl mb-16 md:mb-24"
        >
          <span className="text-[10px] font-black tracking-[0.2em] text-black/40 uppercase block mb-3">
            Workflow Optimization
          </span>
          <h2 className="text-2xl md:text-4xl font-black tracking-tight text-black uppercase">
            How It Works — Easy 3-Step Guide
          </h2>
        </motion.div>

        {/* 3-Step Process Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-16 gap-y-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex flex-col border-t border-black pt-6 relative"
            >
              
              {/* Massive Structural Numbering */}
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.2 + 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-4xl md:text-5xl font-black tracking-tighter text-black/10 absolute -top-7 lg:-top-8 bg-white pr-4"
              >
                {step.number}
              </motion.span>

              {/* Step Title */}
              <h3 className="text-xl font-black text-black uppercase tracking-tight mt-2 mb-4">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm text-black/60 font-normal leading-relaxed max-w-sm">
                {step.description}
              </p>
              
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}